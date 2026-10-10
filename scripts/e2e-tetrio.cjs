// Isolated native WebView checks: startup, incremental library and game launch edges.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn, execFileSync } = require('node:child_process');
const { setTimeout: sleep } = require('node:timers/promises');
const { launch, clickText } = require('./e2e-settings.cjs');
const { waitFor } = require('./e2e-performance.cjs');

async function main() {
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'neonwave-tetrio-'));
    const tone = path.join(profile, 'tone.m4a');
    execFileSync(require('ffmpeg-static'), ['-y', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=120', '-c:a', 'aac', tone], { windowsHide: true, stdio: 'ignore' });
    fs.writeFileSync(path.join(profile, 'preferences.json'), JSON.stringify({
        nw_muted: 'true',
        neonwave_folders_v2: JSON.stringify([{ path: profile, name: 'TETR fixture' }])
    }));
    const artifacts = path.resolve(__dirname, '../artifacts');
    fs.mkdirSync(artifacts, { recursive: true });
    let app = await launch(profile), game;
    try {
        let cdp = app.cdp;
        const firstScreenMs = app.startupMs;
        const initialNative = await cdp.eval("window.ipcRenderer.invoke('app:tetrio-status')");
        assert.equal(initialNative.supported, true);
        if (!initialNative.running) {
            const helper = path.join(profile, 'TETR.IO.exe');
            fs.copyFileSync(process.execPath, helper);
            game = spawn(helper, ['-e', 'setInterval(()=>{},1000)'], { windowsHide: true, stdio: 'ignore' });
            await waitFor(() => cdp.eval("window.ipcRenderer.invoke('app:tetrio-status').then(s=>s.running)"), 'native process detection');
            await new Promise(resolve => { game.once('exit', resolve); game.kill(); }); game = null;
            await waitFor(() => cdp.eval("window.ipcRenderer.invoke('app:tetrio-status').then(s=>!s.running)"), 'native process exit');
        }
        await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: `
            window.__gameRunning = false;
            let batches = 0;
            let api;
            Object.defineProperty(window, 'ipcRenderer', { get: () => api, set: value => {
                api = value;
                const original = api.invoke.bind(api);
                api.invoke = async (channel, ...args) => {
                    if (channel === 'desktop:bootstrap') await new Promise(r=>setTimeout(r,1800));
                    if (channel === 'app:tetrio-status') {
                        if (window.__gameError) throw new Error('Temporary process query failure');
                        return { supported: true, running: window.__gameRunning };
                    }
                    return original(channel,...args);
                };
                api.listMusicFiles = async () => Array.from({length:401},(_,i)=>i===0?${JSON.stringify(tone)}:${JSON.stringify(profile)}+'/missing-'+i+'.m4a');
                api.getAudioMetadataBatch = async paths => {
                    if (++batches > 1) await new Promise(r=>setTimeout(r,1800));
                    return paths.map(path=>({path,title:'Fixture '+path,duration:120}));
                };
            }});
            const play = HTMLMediaElement.prototype.play;
            HTMLMediaElement.prototype.play = function(...args) { window.__audio = this; return play.apply(this,args); };
        ` });
        await cdp.send('Page.reload');
        await waitFor(() => cdp.eval("!!document.querySelector('.startup-wave i') && !!window.ipcRenderer"), 'loading shell');
        assert.equal(await cdp.eval("!!document.querySelector('.native-caption-controls')"), true, 'window controls during startup');
        const wave = await cdp.eval("getComputedStyle(document.querySelector('.startup-wave i')).transform");
        await sleep(200);
        assert.notEqual(await cdp.eval("getComputedStyle(document.querySelector('.startup-wave i')).transform"), wave);
        const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(artifacts, 'startup-animation.png'), Buffer.from(screenshot.data, 'base64'));
        await waitFor(() => cdp.eval("document.querySelector('.library-loading')?.textContent.includes('200') && !!document.getElementById('track-item-0')"), 'first batch before full scan');
        await cdp.eval("document.getElementById('track-item-0').click()");
        await waitFor(() => cdp.eval("window.__audio?.currentTime > 0.1"), 'play while library loads');
        await cdp.eval("window.__audio.pause()");
        await cdp.eval("[...document.querySelectorAll('aside button')].find(b=>b.textContent.includes('設定')).click()");
        await clickText(cdp, '音效與專注自動專注設定');
        assert.equal(await cdp.eval("document.querySelector('input[aria-label=\"TETR.IO 自動接續播放\"]').checked"), false);
        await cdp.eval("document.querySelector('input[aria-label=\"TETR.IO 自動接續播放\"]').click()");
        await waitFor(() => cdp.eval("document.querySelector('[data-tetrio-status]').dataset.tetrioStatus==='waiting'"), 'waiting for game');
        await cdp.eval("window.__gameRunning=true");
        await waitFor(() => cdp.eval("!window.__audio.paused"), 'resume when desktop game starts');
        await cdp.eval("window.__audio.pause()");
        const pausedAt = await cdp.eval('window.__audio.currentTime');
        await sleep(5400);
        assert.equal(await cdp.eval('window.__audio.paused'), true, 'manual pause remains paused across polls');
        assert.equal(await cdp.eval('window.__audio.currentTime'), pausedAt);
        await cdp.eval('window.__gameError=true');
        await waitFor(() => cdp.eval("document.querySelector('[data-tetrio-status]').dataset.tetrioStatus==='error'"), 'query error indicator');
        await cdp.eval('window.__gameError=false');
        await waitFor(() => cdp.eval("document.querySelector('[data-tetrio-status]').dataset.tetrioStatus==='running'"), 'query recovery');
        assert.equal(await cdp.eval('window.__audio.paused'), true, 'query recovery does not restart paused music');
        await cdp.eval('window.__gameRunning=false');
        await waitFor(() => cdp.eval("document.querySelector('[data-tetrio-status]').dataset.tetrioStatus==='waiting'"), 'rearm on game exit');
        await cdp.eval('window.__gameRunning=true');
        await waitFor(() => cdp.eval('!window.__audio.paused'), 'resume again on next launch');
        assert.ok(await cdp.eval('window.__audio.currentTime') >= pausedAt, 'resume preserves position');
        await cdp.eval("document.querySelector('input[aria-label=\"TETR.IO 自動接續播放\"]').click(); window.__audio.pause(); window.__gameRunning=false");
        await sleep(2700);
        await cdp.eval('window.__gameRunning=true');
        await sleep(2700);
        assert.equal(await cdp.eval('window.__audio.paused'), true, 'disabled detection does not resume');
        await cdp.eval("document.querySelector('input[aria-label=\"TETR.IO 自動接續播放\"]').click()");
        await waitFor(() => cdp.eval('!window.__audio.paused'), 'enable while game already running');
        assert.deepEqual(cdp.exceptions, []);
        await app.close(); app = null;
        assert.equal(JSON.parse(fs.readFileSync(path.join(profile, 'preferences.json'), 'utf8')).neonwave_tetrio_companion, 'true');
        app = await launch(profile); cdp = app.cdp;
        assert.equal(await cdp.eval("localStorage.getItem('neonwave_tetrio_companion')"), 'true');
        const result = { result: 'PASS', firstScreenMs, reopenMs: app.startupMs, nativeGameRunning: initialNative.running, profile };
        fs.writeFileSync(path.join(artifacts, 'tetrio-validation.json'), JSON.stringify(result, null, 2));
        console.log(JSON.stringify(result, null, 2));
    } finally { game?.kill(); await app?.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
