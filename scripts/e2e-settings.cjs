// Validate real WebView controls and disk persistence in an isolated profile.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { setTimeout: sleep } = require('node:timers/promises');
const WebSocket = require('ws');
const { CDP, getJson, waitFor, unusedPort } = require('./e2e-performance.cjs');
const workspace = path.resolve(__dirname, '..');
const binary = process.env.NW_E2E_BINARY || path.join(workspace, 'src-tauri/target/release/NeonWave.exe');

async function launch(profile) {
    const port = await unusedPort();
    const start = Date.now();
    const child = spawn(binary, [], { cwd: workspace, windowsHide: true,
        env: { ...process.env, NW_USER_DATA: profile, NW_REMOTE_DEBUG: String(port), NW_OFFLINE: '1', NW_HIDDEN: '1' },
        stdio: ['ignore', 'pipe', 'pipe'] });
    const exited = new Promise(resolve => child.once('exit', resolve));
    child.stdout.resume(); child.stderr.resume();
    let cdp;
    async function close() {
        if (cdp) {
            try { await cdp.eval("window.ipcRenderer.invoke('window:close')"); } catch {}
            cdp.close();
        }
        if (!await Promise.race([exited.then(() => true), sleep(8000).then(() => false)])) {
            child.kill(); await exited;
        }
    }
    try {
        let target;
        await waitFor(async () => {
            if (child.exitCode !== null) throw Error('Native host exited before rendering');
            target = (await getJson(`http://127.0.0.1:${port}/json/list`)).find(t => t.type === 'page' && t.url.includes('tauri.localhost'));
            return !!target;
        }, 'native WebView', 30000);
        const socket = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise((resolve, reject) => { socket.once('open', resolve); socket.once('error', reject); });
        cdp = new CDP(socket);
        await cdp.send('Runtime.enable');
        await cdp.send('Page.enable');
        await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: true });
        await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 800, deviceScaleFactor: 1, mobile: false });
        await waitFor(() => cdp.eval("!!document.querySelector('input[aria-label=音量]') && !!window.ipcRenderer"), 'first screen', 30000);
        return { cdp, close, startupMs: Date.now() - start };
    } catch (error) { await close(); throw error; }
}

async function clickText(cdp, text) {
    assert.equal(await cdp.eval(`(() => {
        const button = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === ${JSON.stringify(text)});
        if (!button) return false; button.click(); return true;
    })()`), true, `button exists: ${text}`);
    await sleep(100);
}

async function main() {
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'neonwave-settings-'));
    const artifacts = path.join(workspace, 'artifacts'); fs.mkdirSync(artifacts, { recursive: true });
    const result = { profile };
    let app = await launch(profile);
    try {
        result.startupMs = app.startupMs;
        let cdp = app.cdp;
        assert.notEqual(await cdp.eval("localStorage.getItem('neonwave_auto_focus')"), 'true');
        await cdp.eval("document.querySelector('button[title=空間音效設定]').click()");
        await clickText(cdp, '演唱會');
        assert.equal(await cdp.eval("document.body.innerText.includes('FPS') || document.body.innerText.includes('賽車遊戲') || document.body.innerText.includes('音量平衡')"), false);
        await cdp.eval(`window.__testApp = 'code'; const invoke = window.ipcRenderer.invoke.bind(window.ipcRenderer);
            window.ipcRenderer.invoke = (channel, ...args) => channel === 'app:active-window' ? Promise.resolve(window.__testApp) : invoke(channel, ...args);`);
        await sleep(2300);
        assert.equal(await cdp.eval("document.body.innerText.includes('工作程式自動啟用')"), false, 'automatic focus is off by default');
        assert.equal(await cdp.eval("JSON.parse(localStorage.getItem('nw_audio_settings')).spaceMode"), 'concert');
        await cdp.eval("[...document.querySelectorAll('aside button')].find(b=>b.textContent.includes('設定')).click()");
        await clickText(cdp, '音效與專注自動專注設定');
        await cdp.eval("document.querySelector('input[aria-label=自動專注模式]').click()");
        await waitFor(() => cdp.eval("document.body.innerText.includes('工作程式自動啟用')"), 'optional automatic focus');
        assert.equal(await cdp.eval("JSON.parse(localStorage.getItem('nw_audio_settings')).spaceMode"), 'concert');
        await cdp.eval("window.__testApp = 'normal'");
        await waitFor(() => cdp.eval("!document.body.innerText.includes('工作程式自動啟用')"), 'manual concert setting restored');
        assert.equal(await cdp.eval("[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='演唱會').style.background"), 'var(--accent-primary)');
        await clickText(cdp, 'TETR');
        await cdp.eval("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('3D 空間')).click()");
        await waitFor(() => cdp.eval("!!document.querySelector('input[type=range][max=\"10\"]')"), 'spatial controls');
        await cdp.eval("document.querySelector('input[type=range][max=\"10\"]').focus()");
        for (let i = 0; i < 2; i++) {
            await cdp.send('Input.dispatchKeyEvent', {type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
            await cdp.send('Input.dispatchKeyEvent', {type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
        }
        await waitFor(() => cdp.eval("JSON.parse(localStorage.getItem('nw_audio_settings')).distance===2"), 'manual distance adjustment');

        const bounds = await cdp.eval("(() => {const r=document.querySelector('input[aria-label=音量]').getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};})()");
        const point = { x: bounds.x + 6 + (bounds.w - 12) * 0.27, y: bounds.y + bounds.h / 2 };
        await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
        await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
        await waitFor(() => cdp.eval("Math.abs(Number(document.querySelector('input[aria-label=音量]').value)-0.27)<0.02"), 'volume pointer alignment');
        const volume = await cdp.eval("document.querySelector('input[aria-label=音量]').value");
        // Chromium does not expose its native range-track computed style.
        // Resolve the actual shipped rule on a probe with the same variables.
        const gradient = await cdp.eval(`(() => {
            const rules = sheets => [...sheets].flatMap(rule => rule.selectorText ? [rule] : rule.cssRules ? rules(rule.cssRules) : []);
            const track = [...document.styleSheets].flatMap(sheet => rules(sheet.cssRules))
                .find(rule => rule.selectorText?.includes('volumeSlider') && rule.selectorText.includes('runnable-track'));
            if (!track) return { background: 'none', rule: 'missing' };
            const probe = document.createElement('div');
            probe.style.setProperty('--volume-progress', document.querySelector('input[aria-label=音量]').value);
            probe.style.background = track.style.background;
            document.body.appendChild(probe);
            const value = { background: getComputedStyle(probe).backgroundImage, rule: track.cssText, specified: probe.style.background };
            probe.remove(); return value;
        })()`);
        assert.notEqual(gradient.background, 'none', JSON.stringify(gradient));
        result.volume = volume; result.gradient = gradient;
        const layouts = [];
        for (const width of [1200, 800]) {
            await cdp.send('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 1, mobile: false });
            for (const theme of ['neonwave', 'spotify', 'discord', 'youtube-music', 'apple-music']) {
                await cdp.eval(`document.documentElement.dataset.theme = ${JSON.stringify(theme)}`);
                await sleep(40);
                const layout = await cdp.eval(`(() => {
                    const slider=document.querySelector('input[aria-label=音量]'); const r=slider.getBoundingClientRect();
                    const parent=slider.parentElement.getBoundingClientRect(); const icon=slider.previousElementSibling.getBoundingClientRect();
                    const controls=document.querySelector('[class*="controls_"]').getBoundingClientRect();
                    return {x:r.x,right:r.right,sliderWidth:r.width,centre:r.y+r.height/2,iconCentre:icon.y+icon.height/2,parentRight:parent.right,controlsRight:controls.right,extraLeft:document.querySelector('[class*="extra_"]').getBoundingClientRect().left};
                })()`);
                assert.ok(layout.x >= 0 && layout.parentRight <= width && layout.sliderWidth >= 30, `${theme} ${width}: volume stays inside viewport`);
                assert.ok(Math.abs(layout.centre - layout.iconCentre) < 1, `${theme} ${width}: volume is vertically aligned`);
                assert.ok(layout.controlsRight <= layout.extraLeft + 1, `${theme} ${width}: playback and volume do not overlap`);
                layouts.push({theme,width,...layout});
            }
        }
        result.layouts = layouts;
        await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 800, deviceScaleFactor: 1, mobile: false });
        await cdp.eval("document.documentElement.dataset.theme='neonwave'");
        const screenshot = await cdp.send('Page.captureScreenshot', {format:'png'});
        fs.writeFileSync(path.join(artifacts, 'settings-volume.png'), Buffer.from(screenshot.data, 'base64'));
        assert.deepEqual(cdp.exceptions, []);
        await app.close(); app = null;
        const saved = JSON.parse(fs.readFileSync(path.join(profile,'preferences.json'),'utf8'));
        assert.equal(saved.neonwave_auto_focus, 'true');
        assert.equal(saved.nw_volume, volume);
        assert.equal(JSON.parse(saved.nw_audio_settings).spaceMode, 'tetr');
        assert.equal(JSON.parse(saved.nw_audio_settings).distance, 2);
        app = await launch(profile); cdp = app.cdp;
        result.reopenMs = app.startupMs;
        assert.equal(await cdp.eval("document.querySelector('input[aria-label=音量]').value"), volume);
        await cdp.eval("document.querySelector('button[title=空間音效設定]').click()");
        assert.equal(await cdp.eval("JSON.parse(localStorage.getItem('nw_audio_settings')).spaceMode"), 'tetr');
        assert.equal(await cdp.eval("[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='TETR').style.background"), 'var(--accent-primary)');
        await cdp.eval("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('3D 空間')).click()");
        await waitFor(() => cdp.eval("!!document.querySelector('input[type=range][max=\"10\"]')"), 'reopened spatial controls');
        assert.equal(await cdp.eval("document.querySelector('input[type=range][max=\"10\"]').value"), '2');
        assert.equal(await cdp.eval("localStorage.getItem('neonwave_auto_focus')"), 'true');
        result.result = 'PASS';
        fs.writeFileSync(path.join(artifacts,'settings-validation.json'),JSON.stringify(result,null,2));
        console.log(JSON.stringify({result:result.result,startupMs:result.startupMs,reopenMs:result.reopenMs,volume:result.volume,layouts:layouts.length,profile},null,2));
    } finally { await app?.close(); }
}
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
