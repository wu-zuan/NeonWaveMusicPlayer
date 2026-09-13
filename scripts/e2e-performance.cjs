// Build first with `npx vite build`, then `node scripts/e2e-performance.cjs`.
// Runs the real built app in a hidden, isolated Electron profile. All fixtures
// are local; the bootstrap blocks external HTTP requests and never downloads.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawn, execFileSync } = require('node:child_process');
const { setTimeout: sleep } = require('node:timers/promises');
const WebSocket = require('ws');

const workspace = path.resolve(__dirname, '..');
const builtMain = path.join(workspace, 'dist-electron', 'main.js');
const rowsSelector = '[id^="track-item-"]';

async function unusedPort() {
    const server = net.createServer();
    await new Promise((resolve, reject) => server.listen(0, '127.0.0.1', resolve).on('error', reject));
    const port = server.address().port;
    await new Promise(resolve => server.close(resolve));
    return port;
}

function getJson(url) {
    return new Promise((resolve, reject) => {
        const request = http.get(url, response => {
            let body = '';
            response.on('data', data => { body += data; });
            response.on('end', () => { try { resolve(JSON.parse(body)); } catch (error) { reject(error); } });
        }).on('error', reject);
        request.setTimeout(1500, () => request.destroy(new Error('CDP discovery timed out')));
    });
}

class CDP {
    constructor(socket) {
        this.socket = socket;
        this.nextId = 0;
        this.pending = new Map();
        this.exceptions = [];
        socket.on('message', message => {
            const data = JSON.parse(message);
            if (data.method === 'Runtime.exceptionThrown') this.exceptions.push(data.params.exceptionDetails);
            const request = this.pending.get(data.id);
            if (!request) return;
            this.pending.delete(data.id);
            clearTimeout(request.timer);
            data.error ? request.reject(new Error(JSON.stringify(data.error))) : request.resolve(data.result);
        });
    }
    send(method, params = {}) {
        return new Promise((resolve, reject) => {
            const id = ++this.nextId;
            const timer = setTimeout(() => {
                this.pending.delete(id);
                reject(new Error(`CDP timed out: ${method}`));
            }, 10000);
            this.pending.set(id, { resolve, reject, timer });
            this.socket.send(JSON.stringify({ id, method, params }));
        });
    }
    async eval(expression) {
        const result = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
        if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || JSON.stringify(result.exceptionDetails));
        return result.result.value;
    }
    close() {
        for (const request of this.pending.values()) clearTimeout(request.timer);
        this.pending.clear();
        this.socket.close();
    }
}

async function waitFor(probe, label, timeout = 12000) {
    const end = Date.now() + timeout;
    let lastError;
    while (Date.now() < end) {
        try { if (await probe()) return; } catch (error) { lastError = error; }
        await sleep(100);
    }
    throw new Error(`Timed out waiting for ${label}${lastError ? `: ${lastError.message}` : ''}`);
}

function instrumentation(tone, fixtureRoot) {
    return `(() => {
        const state = window.__nwPerf = { videos: [], intervals: new Map(), commits: 0, mainRenders: 0, mainSeen: false };
        const createElement = document.createElement.bind(document);
        document.createElement = function(name, ...args) {
            const element = createElement(name, ...args);
            if (String(name).toLowerCase() === 'video') state.videos.push(element);
            return element;
        };
        const setIntervalOriginal = window.setInterval.bind(window);
        const clearIntervalOriginal = window.clearInterval.bind(window);
        window.setInterval = function(callback, delay, ...args) {
            const id = setIntervalOriginal(callback, delay, ...args);
            state.intervals.set(id, Number(delay));
            return id;
        };
        window.clearInterval = function(id) {
            state.intervals.delete(id);
            return clearIntervalOriginal(id);
        };
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
            supportsFiber: true,
            inject() { return 1; },
            onCommitFiberRoot(_id, root) {
                state.commits++;
                const visit = fiber => {
                    if (!fiber) return;
                    const hookState = fiber.memoizedState?.memoizedState;
                    if (Array.isArray(hookState) && hookState[0]?.id === 'perf-large') {
                        state.mainSeen = true;
                        if (fiber.flags & 1) state.mainRenders++;
                    }
                    visit(fiber.child);
                    visit(fiber.sibling);
                };
                visit(root.current);
            },
            onCommitFiberUnmount() {}
        };
        const tracks = Array.from({ length: 20000 }, (_, index) => ({
            path: index === 0 ? ${JSON.stringify(tone)} : ${JSON.stringify(path.basename(fixtureRoot))} + '/missing-' + index + '.m4a',
            title: index === 0 ? 'Performance Tone' : index === 10 ? 'Needle A' : index === 19999 ? 'Needle B' : 'Track ' + index,
            artist: 'Fixture'
        }));
        tracks[0].artwork = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"><rect width="2" height="2" fill="blue"/></svg>');
        const smallTracks = [0, 1].map(index => ({
            path: ${JSON.stringify(fixtureRoot)} + '/small-' + index + '.m4a',
            title: 'Needle Small ' + index, artist: 'Local Fixture', duration: 30, mediaType: 'audio'
        }));
        localStorage.setItem('neonwave_folders_v2', '[]');
        localStorage.setItem('neonwave_favorites', '[]');
        localStorage.setItem('neonwave_custom_playlists', JSON.stringify([
            { id: 'perf-large', name: 'PERF Large', type: 'custom', tracks },
            { id: 'perf-small', name: 'PERF Small', type: 'custom', tracks: smallTracks }
        ]));
        localStorage.setItem('nw_8d', 'true');
        localStorage.setItem('nw_muted', 'true');
        localStorage.setItem('nw_repeat', 'none');
        localStorage.setItem('nw_shuffle', 'false');
        localStorage.setItem('neonwave_enable_discord_rpc', 'false');
    })();`;
}

async function main() {
    assert.ok(fs.existsSync(builtMain), 'Run npx vite build first');
    const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'neonwave-performance-'));
    const profile = path.join(fixtureRoot, 'profile');
    fs.mkdirSync(profile);
    const tone = path.join(fixtureRoot, 'tone.m4a');
    execFileSync(require('ffmpeg-static'), ['-y', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=30', '-c:a', 'aac', tone], { windowsHide: true, stdio: 'ignore' });
    const bootstrap = path.join(fixtureRoot, 'bootstrap.mjs');
    fs.writeFileSync(bootstrap, `
        import { app, session } from 'electron';
        app.setPath('userData', ${JSON.stringify(profile)});
        app.setPath('sessionData', ${JSON.stringify(profile)});
        app.on('browser-window-created', (_event, window) => {
            window.show = () => {};
            window.focus = () => {};
            window.setAlwaysOnTop = () => {};
        });
        app.whenReady().then(() => session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
            callback({ cancel: /^https?:/.test(details.url) && !/^https?:\\/\\/(localhost|127\\.0\\.0\\.1)(:|\\/)/.test(details.url) });
        }));
        await import(${JSON.stringify(pathToFileURL(builtMain).href)});
    `);
    const port = await unusedPort();
    const childEnvironment = { ...process.env, NW_REMOTE_DEBUG: String(port) };
    delete childEnvironment.ELECTRON_RUN_AS_NODE;
    delete childEnvironment.VITE_DEV_SERVER_URL;
    const child = spawn(require('electron'), [bootstrap, `--user-data-dir=${profile}`], {
        cwd: workspace, env: childEnvironment, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe']
    });
    const exited = new Promise(resolve => child.once('exit', resolve));
    let processOutput = '';
    child.stdout.on('data', data => { processOutput = (processOutput + data).slice(-16000); });
    child.stderr.on('data', data => { processOutput = (processOutput + data).slice(-16000); });
    let cdp;
    let miniCdp;
    try {
        let target;
        await waitFor(async () => {
            if (child.exitCode !== null) throw new Error(`Electron exited: ${processOutput}`);
            target = (await getJson(`http://127.0.0.1:${port}/json/list`)).find(item => item.type === 'page' && item.url.startsWith('file:') && !item.url.includes('mini=true'));
            return !!target;
        }, 'isolated Electron target', 20000);
        const socket = new WebSocket(target.webSocketDebuggerUrl, { maxPayload: 64 * 1024 * 1024 });
        await new Promise((resolve, reject) => { socket.once('open', resolve); socket.once('error', reject); });
        cdp = new CDP(socket);
        await cdp.send('Runtime.enable');
        await cdp.send('Page.enable');
        await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: instrumentation(tone, fixtureRoot) });
        await cdp.send('Page.reload', { ignoreCache: true });
        await waitFor(() => cdp.eval(`document.querySelectorAll(${JSON.stringify(rowsSelector)}).length > 0 && !!window.__nwPerf`), '20,000-track library');

        const clickPlaylist = async name => {
            assert.equal(await cdp.eval(`(() => {
                const label = [...document.querySelectorAll('aside span')].find(node => node.textContent === ${JSON.stringify(name)});
                const item = label?.closest('[class*="navItem"]');
                if (!item) return false;
                item.click(); return true;
            })()`), true, `playlist exists: ${name}`);
            await sleep(120);
        };
        const setSearch = async value => {
            await cdp.eval(`(() => {
                const input = document.querySelector('input[class*="searchInput"]');
                Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ${JSON.stringify(value)});
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.focus();
            })()`);
        };
        const pressEnter = async () => {
            await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
            await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
        };
        const rowCount = () => cdp.eval(`document.querySelectorAll(${JSON.stringify(rowsSelector)}).length`);
        await clickPlaylist('PERF Large');
        const mountedCounts = [await rowCount()];
        await cdp.eval(`(() => {
            const row = document.querySelector(${JSON.stringify(rowsSelector)});
            let list = row.parentElement;
            while (list && getComputedStyle(list).overflowY !== 'auto') list = list.parentElement;
            if (!list) throw new Error('Virtual list scroll container missing');
            list.scrollTop = 10000 * 56;
        })()`);
        await waitFor(() => cdp.eval(`!!document.getElementById('track-item-10000')`), 'middle of large library');
        mountedCounts.push(await rowCount());
        assert.ok(mountedCounts.every(count => count > 0 && count < 80), `virtualization bounded: ${mountedCounts}`);

        await setSearch('Needle');
        await waitFor(() => cdp.eval(`document.querySelector('[class*="searchCount"]')?.textContent === '1 / 2'`), 'large library search');
        await pressEnter();
        await waitFor(() => cdp.eval(`document.getElementById('track-item-19999')?.className.includes('highlighted')`), 'Enter jumps to second match');
        mountedCounts.push(await rowCount());
        await clickPlaylist('PERF Small');
        await waitFor(() => cdp.eval(`document.getElementById('track-item-0')?.className.includes('highlighted') && document.querySelectorAll(${JSON.stringify(rowsSelector)}).length === 2`), 'search refresh after playlist switch');
        await cdp.eval(`document.querySelector('input[class*="searchInput"]').focus()`);
        await pressEnter();
        await waitFor(() => cdp.eval(`document.getElementById('track-item-1')?.className.includes('highlighted')`), 'Enter on switched playlist');

        await clickPlaylist('PERF Large');
        await setSearch('Performance Tone');
        await waitFor(() => cdp.eval(`!!document.getElementById('track-item-0')`), 'tone row');
        assert.equal(await cdp.eval(`window.__nwPerf.videos.length`), 1, 'one shared media element');
        assert.equal(await cdp.eval(`[...window.__nwPerf.intervals.values()].filter(delay => delay === 16).length`), 0, '8D is idle before playback');
        await cdp.eval(`document.getElementById('track-item-0').click()`);
        await waitFor(() => cdp.eval(`window.__nwPerf.videos[0].currentTime > 0.4 && !window.__nwPerf.videos[0].paused`), 'local media playback');
        await waitFor(() => cdp.eval(`[...window.__nwPerf.intervals.values()].filter(delay => delay === 16).length === 1`), '8D rotation during playback');
        await sleep(500);
        const before = await cdp.eval(`({ time: window.__nwPerf.videos[0].currentTime, commits: window.__nwPerf.commits, mainRenders: window.__nwPerf.mainRenders, mainSeen: window.__nwPerf.mainSeen })`);
        await sleep(1400);
        const after = await cdp.eval(`({ time: window.__nwPerf.videos[0].currentTime, commits: window.__nwPerf.commits, mainRenders: window.__nwPerf.mainRenders })`);
        assert.ok(after.time > before.time + 0.8, 'media clock advances');
        assert.ok(after.commits > before.commits, 'time UI updates');
        assert.equal(before.mainSeen, true, 'React instrumentation found MainApp');
        assert.equal(after.mainRenders, before.mainRenders, 'MainApp does not render on playback clock updates');

        const seekPoint = await cdp.eval(`(() => {
            const rect = document.querySelector('input[class*="timeSlider"]').getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        })()`);
        await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...seekPoint, button: 'left', clickCount: 1 });
        await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...seekPoint, button: 'left', clickCount: 1 });
        await waitFor(() => cdp.eval(`window.__nwPerf.videos[0].currentTime >= 14 && !window.__nwPerf.videos[0].seeking`), 'seek to midpoint');
        await cdp.eval(`document.querySelector('button[class*="playBtn"]').click()`);
        await waitFor(() => cdp.eval(`window.__nwPerf.videos[0].paused && [...window.__nwPerf.intervals.values()].filter(delay => delay === 16).length === 0`), '8D timer stops when paused');
        const pausedTime = await cdp.eval(`window.__nwPerf.videos[0].currentTime`);
        await cdp.eval(`window.ipcRenderer.invoke('window:setMiniPlayer', true)`);
        let miniTarget;
        await waitFor(async () => {
            miniTarget = (await getJson(`http://127.0.0.1:${port}/json/list`)).find(item => item.type === 'page' && item.url.includes('mini=true'));
            return !!miniTarget;
        }, 'new paused mini player');
        const miniSocket = new WebSocket(miniTarget.webSocketDebuggerUrl);
        await new Promise((resolve, reject) => { miniSocket.once('open', resolve); miniSocket.once('error', reject); });
        miniCdp = new CDP(miniSocket);
        await waitFor(() => miniCdp.eval(`document.querySelector('strong')?.textContent === 'Performance Tone' && !!document.querySelector('button[aria-label="播放"]')`), 'mini receives paused snapshot without a playback tick');
        const miniState = await miniCdp.eval(`({ time: document.querySelector('small')?.textContent, artwork: document.querySelector('img')?.getAttribute('src') })`);
        assert.equal(miniState.time, `0:${Math.floor(pausedTime).toString().padStart(2, '0')}`, 'mini receives paused clock');
        assert.ok(miniState.artwork.startsWith('data:image/svg+xml,'), 'mini receives cached artwork');
        await cdp.eval(`document.querySelector('button[class*="playBtn"]').click()`);
        await waitFor(() => cdp.eval(`!window.__nwPerf.videos[0].paused && [...window.__nwPerf.intervals.values()].filter(delay => delay === 16).length === 1`), '8D timer restarts on resume');
        assert.deepEqual(cdp.exceptions, [], 'no uncaught renderer exceptions');

        console.log(JSON.stringify({ result: 'PASS', libraryTracks: 20000, mountedRows: mountedCounts, searchAndPlaylistSwitch: true, playbackAdvanceSeconds: +(after.time - before.time).toFixed(3), clockCommits: after.commits - before.commits, mainAppClockRenders: after.mainRenders - before.mainRenders, seekAnd8DPauseResume: true, pausedMiniSnapshot: true, profile }, null, 2));
    } catch (error) {
        console.error(processOutput);
        throw error;
    } finally {
        miniCdp?.close();
        if (cdp) {
            try { await cdp.send('Browser.close'); } catch {}
            cdp.close();
        }
        const closed = await Promise.race([exited.then(() => true), sleep(2500).then(() => false)]);
        if (!closed) {
            child.kill();
            await Promise.race([exited, sleep(2500)]);
        }
        // Preserve the uniquely named profile/logs for inspection after failures.
        fs.writeFileSync(path.join(fixtureRoot, 'electron-output.log'), processOutput);
    }
}

main().catch(error => { console.error('PERFORMANCE E2E FAIL:', error); process.exitCode = 1; });
