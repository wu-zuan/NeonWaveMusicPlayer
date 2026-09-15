// Build first with `npm run build:dir`, then `node scripts/e2e-performance.cjs`.
// Runs the real built app in an isolated Tauri profile (NW_HIDDEN=1 hides it). All fixtures
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
const builtMain = process.env.NW_E2E_BINARY || path.join(workspace, 'src-tauri', 'target', 'release', 'NeonWave.exe');
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
            title: index === 0 ? 'Performance Tone' : index === 10 ? '跳轉 Needle A' : index === 19999 ? '跳轉 Needle B' : 'Track ' + index,
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
            { id: 'perf-small', name: 'PERF Small', type: 'custom', tracks: smallTracks },
            { id: 'perf-empty', name: 'PERF Empty', type: 'custom', tracks: [] }
        ]));
        localStorage.setItem('nw_8d', 'true');
        localStorage.setItem('nw_muted', 'true');
        localStorage.setItem('nw_repeat', 'none');
        localStorage.setItem('nw_shuffle', 'false');
        localStorage.setItem('neonwave_enable_discord_rpc', 'false');
    })();`;
}

async function main() {
    assert.ok(fs.existsSync(builtMain), 'Run npm run build:dir first');
    const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'neonwave-performance-'));
    const profile = path.join(fixtureRoot, 'profile');
    fs.mkdirSync(profile);
    const tone = path.join(fixtureRoot, 'tone.m4a');
    execFileSync(require('ffmpeg-static'), ['-y', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=30', '-c:a', 'aac', tone], { windowsHide: true, stdio: 'ignore' });
    const port = await unusedPort();
    const childEnvironment = { ...process.env, NW_REMOTE_DEBUG: String(port), NW_USER_DATA: profile, NW_OFFLINE: '1', NW_HIDDEN: process.env.NW_HIDDEN || '0' };
    const child = spawn(builtMain, [], { cwd: workspace, env: childEnvironment, windowsHide: true, stdio: ['ignore','pipe','pipe'] });
    const exited = new Promise(resolve => child.once('exit', resolve));
    let processOutput = '';
    child.stdout.on('data', data => { processOutput = (processOutput + data).slice(-16000); });
    child.stderr.on('data', data => { processOutput = (processOutput + data).slice(-16000); });
    let cdp;
    let miniCdp;
    try {
        let target;
        await waitFor(async () => {
            if (child.exitCode !== null) throw new Error(`Tauri exited: ${processOutput}`);
            target = (await getJson(`http://127.0.0.1:${port}/json/list`)).find(item => item.type === 'page' && item.url.includes('tauri.localhost') && !item.url.includes('mini=true'));
            return !!target;
        }, 'isolated Tauri target', 20000);
        const socket = new WebSocket(target.webSocketDebuggerUrl, { maxPayload: 64 * 1024 * 1024 });
        await new Promise((resolve, reject) => { socket.once('open', resolve); socket.once('error', reject); });
        cdp = new CDP(socket);
        await cdp.send('Runtime.enable');
        await cdp.send('Page.enable');
        // WebView2's hidden native surface may omit compositor layers from
        // screenshots. Give CDP a complete fixed viewport for visual checks.
        await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: true });
        await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 800, deviceScaleFactor: 1, mobile: false });
        // WebView2 advertises the pending navigation URL before its first
        // document commits. Reloading then cancels it and reloads about:blank.
        await waitFor(() => cdp.eval(`location.href.includes('tauri.localhost') && !!window.ipcRenderer && !!document.querySelector('aside')`), 'initial WebView2 document and services', 60000);
        await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: instrumentation(tone, fixtureRoot) });
        await cdp.send('Page.navigate', { url: 'http://tauri.localhost/?validation=performance' });
        await waitFor(() => cdp.eval(`document.querySelectorAll(${JSON.stringify(rowsSelector)}).length > 0 && !!window.__nwPerf`), '20,000-track library');

        await sleep(350);
        const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png' });
        fs.mkdirSync(path.join(workspace,'artifacts'),{recursive:true});
        fs.writeFileSync(path.join(workspace,'artifacts/tauri-main.png'),Buffer.from(screenshot.data,'base64'));
        const layout = await cdp.eval(`({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,body:getComputedStyle(document.body).fontFamily,aside:(()=>{const r=document.querySelector('aside').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})()})`);
        fs.writeFileSync(path.join(workspace,'artifacts/tauri-layout.json'),JSON.stringify(layout,null,2));
        assert.equal(layout.width,1200); assert.equal(layout.height,800); assert.equal(layout.aside.width,260);
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
        const playlistHeight = () => cdp.eval(`document.querySelector('[role="list"]').getBoundingClientRect().height`);
        const visibleMatches = [];
        const expectVisibleMatch = async (index, label) => {
            let geometry;
            await waitFor(async () => {
                geometry = await cdp.eval(`(() => {
                    const row = document.getElementById('track-item-${index}');
                    if (!row?.className.includes('highlighted')) return null;
                    const rect = row.getBoundingClientRect();
                    const list = row.parentElement.getBoundingClientRect();
                    const viewport = document.querySelector('.app-scroll');
                    const bounds = viewport.getBoundingClientRect();
                    const top = Math.max(0, bounds.top, list.top);
                    const bottom = Math.min(innerHeight, bounds.bottom - parseFloat(getComputedStyle(viewport).paddingBottom), list.bottom);
                    return { top: rect.top, bottom: rect.bottom, viewportTop: top, viewportBottom: bottom,
                        visible: rect.height > 0 && rect.top >= top - 1 && rect.bottom <= bottom + 1 };
                })()`);
                return geometry?.visible;
            }, `${label}: highlighted row is visible above the player`);
            visibleMatches.push({ label, index, ...geometry });
        };
        await clickPlaylist('PERF Large');
        const initialListHeight = await playlistHeight();
        await sleep(1200);
        assert.ok(Math.abs(await playlistHeight() - initialListHeight) <= 1, 'list height stays stable while idle');
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
        await expectVisibleMatch(10, 'typing jumps to first match');
        await pressEnter();
        await expectVisibleMatch(19999, 'Enter jumps to second match');
        mountedCounts.push(await rowCount());
        await clickPlaylist('PERF Small');
        await waitFor(() => cdp.eval(`document.getElementById('track-item-0')?.className.includes('highlighted') && document.querySelectorAll(${JSON.stringify(rowsSelector)}).length === 2`), 'search refresh after playlist switch');
        await cdp.eval(`document.querySelector('input[class*="searchInput"]').focus()`);
        await pressEnter();
        await expectVisibleMatch(1, 'Enter on switched playlist');
        await clickPlaylist('PERF Empty');
        await waitFor(() => cdp.eval(`document.body.textContent.includes('這個列表是空的。')`), 'empty playlist');
        await clickPlaylist('PERF Large');
        await expectVisibleMatch(10, 'search after remounting an empty list');

        // A mounted/highlighted virtual row can still be outside the screen.
        // Exercise the themed headers and minimum window size with real bounds.
        await clickPlaylist('PERF Large');
        for (const theme of ['neonwave', 'spotify', 'discord', 'youtube-music', 'apple-music']) {
            await cdp.eval(`document.documentElement.dataset.theme = ${JSON.stringify(theme)}`);
            for (const viewport of [{ width: 1200, height: 800 }, { width: 800, height: 600 }]) {
                await cdp.send('Emulation.setDeviceMetricsOverride', { ...viewport, deviceScaleFactor: 1, mobile: false });
                await sleep(150);
                const height = await playlistHeight();
                await sleep(250);
                assert.ok(Math.abs(await playlistHeight() - height) <= 1, `${theme}: list height remains bounded after resize`);
                await setSearch('');
                await waitFor(() => cdp.eval(`!document.querySelector('[class*="searchCount"]')`), 'cleared playlist search');
                await setSearch('跳轉');
                await expectVisibleMatch(10, `${theme} ${viewport.width}: first match`);
                await pressEnter();
                await expectVisibleMatch(19999, `${theme} ${viewport.width}: last match`);
                await pressEnter();
                await expectVisibleMatch(10, `${theme} ${viewport.width}: Enter wraps`);
                assert.ok(await rowCount() < 80, `${theme}: virtual rows stay bounded`);
            }
        }
        await cdp.eval(`document.documentElement.dataset.theme = 'neonwave'`);
        await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 800, deviceScaleFactor: 1, mobile: false });
        await setSearch('no matching track');
        await waitFor(() => cdp.eval(`!document.querySelector('[class*="searchCount"]')`), 'unmatched query');
        await pressEnter();
        assert.equal(await cdp.eval(`!!document.querySelector('[id^="track-item-"][class*="highlighted"]')`), false, 'Enter with no matches is harmless');
        await setSearch('Needle A');
        await expectVisibleMatch(10, 'single result');
        await cdp.eval(`document.querySelector('[role="list"]').scrollTop = 10000 * 56`);
        await waitFor(() => cdp.eval(`!!document.getElementById('track-item-10000')`), 'scroll away from single result');
        await pressEnter();
        await expectVisibleMatch(10, 'Enter returns to a single result');

        await clickPlaylist('PERF Large');
        await setSearch('Performance Tone');
        await waitFor(() => cdp.eval(`!!document.getElementById('track-item-0')`), 'tone row');
        assert.equal(await cdp.eval(`window.__nwPerf.videos.length`), 1, 'one shared media element');
        assert.equal(await cdp.eval(`[...window.__nwPerf.intervals.values()].filter(delay => delay === 16).length`), 0, '8D is idle before playback');
        await cdp.eval(`document.getElementById('track-item-0').click()`);
        await waitFor(() => cdp.eval(`window.__nwPerf.videos[0].currentTime > 0.4 && !window.__nwPerf.videos[0].paused`), 'local media playback');
        await waitFor(() => cdp.eval(`[...window.__nwPerf.intervals.values()].filter(delay => delay === 16).length === 1`), '8D rotation during playback');
        // Let the existing 2-second foreground detector publish its initial
        // process name before measuring renders caused by the playback clock.
        await sleep(2500);
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

        const result = { result: 'PASS', libraryTracks: 20000, mountedRows: mountedCounts, searchAndPlaylistSwitch: true, visibleSearchMatches: visibleMatches, playbackAdvanceSeconds: +(after.time - before.time).toFixed(3), clockCommits: after.commits - before.commits, mainAppClockRenders: after.mainRenders - before.mainRenders, seekAnd8DPauseResume: true, pausedMiniSnapshot: true, profile };
        fs.writeFileSync(path.join(workspace, 'artifacts/performance-validation.json'), JSON.stringify(result, null, 2));
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        if (cdp) {
            try { console.error('Renderer diagnostic:', await cdp.eval(`({text:document.body.innerText.slice(0,3000),url:location.href,ready:document.readyState,bridge:!!window.ipcRenderer,fixture:!!window.__nwPerf,exceptions:0})`), cdp.exceptions); } catch {}
        }
        console.error(processOutput);
        throw error;
    } finally {
        miniCdp?.close();
        if (cdp) {
            try { await cdp.eval("window.ipcRenderer.invoke('window:close')"); } catch {}
            cdp.close();
        }
        const closed = await Promise.race([exited.then(() => true), sleep(8000).then(() => false)]);
        if (!closed) {
            child.kill();
            await Promise.race([exited, sleep(2500)]);
        }
        // Preserve the uniquely named profile/logs for inspection after failures.
        fs.writeFileSync(path.join(fixtureRoot, 'tauri-output.log'), processOutput);
    }
}

if (require.main === module) main().catch(error => { console.error('PERFORMANCE E2E FAIL:', error); process.exitCode = 1; });
module.exports = { CDP, getJson, waitFor, unusedPort };
