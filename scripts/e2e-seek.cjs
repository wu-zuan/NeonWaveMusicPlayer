const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { setTimeout: sleep } = require('node:timers/promises');
const { launch } = require('./e2e-settings.cjs');
const { waitFor } = require('./e2e-performance.cjs');

async function main() {
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'neonwave-seek-'));
    const tone = path.join(profile, 'seek.m4a');
    execFileSync(require('ffmpeg-static'), ['-y', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=120', '-c:a', 'aac', tone], { windowsHide: true, stdio: 'ignore' });
    fs.writeFileSync(path.join(profile, 'preferences.json'), JSON.stringify({ nw_muted: 'true',
        neonwave_custom_playlists: JSON.stringify([{id:'seek', name:'Seek fixture', type:'custom', tracks:[{path:tone, title:'Seek fixture'}]}]) }));
    const app = await launch(profile);
    try {
        const cdp = app.cdp;
        await cdp.eval(`window.__seekEvents=[]; for(const type of ['pointerdown','pointermove','pointerup','pointercancel','gotpointercapture','lostpointercapture','blur']) document.addEventListener(type,event=>{
            if (!/timeSlider|seekTarget/.test(String(event.target.className))) return;
            window.__seekEvents.push({type,value:event.target.value,time:window.__audio?.currentTime,x:event.clientX,y:event.clientY,pointerId:event.pointerId,buttons:event.buttons,capture:event.target.hasPointerCapture?.(event.pointerId)});
            if(window.__seekEvents.length>35)window.__seekEvents.shift();
        },true);`);
        await cdp.eval(`const play = HTMLMediaElement.prototype.play;
            HTMLMediaElement.prototype.play = function(...args) { window.__audio = this; return play.apply(this,args); };
            document.getElementById('track-item-0').click();`);
        await waitFor(() => cdp.eval('window.__audio?.currentTime > .1'), 'local playback');
        await cdp.eval('window.__audio.pause()');
        await waitFor(() => cdp.eval("Number(document.querySelector('input[class*=timeSlider]').max) > 119"), 'local duration');
        let rect = await cdp.eval("(()=>{ const r=document.querySelector('input[class*=timeSlider]').getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; })()");
        const point = ratio => ({ x: rect.x + 6 + (rect.w - 12) * ratio, y: rect.y + rect.h / 2 });
        const sliderTime = () => cdp.eval("Number(document.querySelector('input[class*=timeSlider]').value)");
        const beforeDrag = await cdp.eval('window.__audio.currentTime');
        await cdp.send('Input.dispatchMouseEvent', {type:'mousePressed', ...point(.2), button:'left', buttons:1, clickCount:1});
        for (const ratio of [.4,.8,.3,.7]) {
            await cdp.send('Input.dispatchMouseEvent', {type:'mouseMoved', ...point(ratio), buttons:1});
            await sleep(100);
            const preview = await sliderTime();
            assert.ok(Math.abs(preview - ratio * 120) < 1, 'drag preview follows the pointer in both directions');
            assert.equal(await cdp.eval('window.__audio.currentTime'), beforeDrag, 'drag previews without repeated decoder seeks');
        }
        await cdp.send('Input.dispatchMouseEvent', {type:'mouseReleased', ...point(.7), button:'left', buttons:0, clickCount:1});
        assert.ok(Math.abs(await sliderTime() - 84) < 1, 'release does not briefly revert to the old playhead');
        await waitFor(() => cdp.eval('Math.abs(window.__audio.currentTime-84)<1 && !window.__audio.seeking'), 'commit dragged local position');
        assert.equal(await cdp.eval('window.__audio.paused'), true, 'paused seek stays paused');
        assert.ok(rect.h >= 20, 'seek hit target is easy to grab');
        // Cancel and capture loss restore the playhead without seeking.
        for (const cancel of ['escape', 'pointercancel', 'blur']) {
            await cdp.send('Input.dispatchMouseEvent', {type:'mousePressed', ...point(.3), button:'left', buttons:1, clickCount:1});
            if (cancel === 'escape') {
                await cdp.send('Input.dispatchKeyEvent', {type:'keyDown', key:'Escape', code:'Escape', windowsVirtualKeyCode:27});
                await cdp.send('Input.dispatchKeyEvent', {type:'keyUp', key:'Escape', code:'Escape', windowsVirtualKeyCode:27});
            } else if (cancel === 'blur') await cdp.eval("document.querySelector('input[class*=timeSlider]').blur()");
            else await cdp.eval("document.querySelector('input[class*=timeSlider]').dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:1}))");
            await cdp.send('Input.dispatchMouseEvent', {type:'mouseReleased', ...point(.3), button:'left', buttons:0, clickCount:1});
            assert.ok(Math.abs(await cdp.eval('window.__audio.currentTime') - 84) < 1, `${cancel} does not commit`);
            assert.ok(Math.abs(await sliderTime() - 84) < 1, `${cancel} clears preview`);
        }
        await cdp.eval("document.querySelector('input[class*=timeSlider]').focus()");
        for (const key of ['Home', 'ArrowRight']) {
            const code = key === 'Home' ? 36 : 39;
            await cdp.send('Input.dispatchKeyEvent', {type:'keyDown',key,code:key,windowsVirtualKeyCode:code});
            await cdp.send('Input.dispatchKeyEvent', {type:'keyUp',key,code:key,windowsVirtualKeyCode:code});
        }
        await waitFor(() => cdp.eval('Math.abs(window.__audio.currentTime-.1)<.05 && !window.__audio.seeking'), 'keyboard seeking');
        let layouts = 0;
        for (const theme of ['neonwave','spotify','discord','youtube-music','apple-music']) {
            await cdp.eval(`document.documentElement.dataset.theme=${JSON.stringify(theme)}`);
            for (const width of [1200,800]) {
                await cdp.send('Emulation.setDeviceMetricsOverride', {width,height:800,deviceScaleFactor:1,mobile:false});
                await sleep(100);
                rect = await cdp.eval("(()=>{ const r=document.querySelector('input[class*=timeSlider]').getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; })()");
                for (const ratio of [.8,.2]) {
                    await cdp.send('Input.dispatchMouseEvent', {type:'mousePressed', ...point(.5), button:'left', buttons:1, clickCount:1});
                    await cdp.send('Input.dispatchMouseEvent', {type:'mouseMoved', ...point(ratio), buttons:1});
                    // Captured pointer can leave the thin visual track and still release.
                    await cdp.send('Input.dispatchMouseEvent', {type:'mouseReleased', ...point(ratio), y:rect.y-35, button:'left', buttons:0, clickCount:1});
                    try {
                        await waitFor(() => cdp.eval(`Math.abs(window.__audio.currentTime-${ratio*120})<1 && !window.__audio.seeking`), `${theme} ${width}: seek ${ratio}`);
                    } catch(error) {
                        console.log(await cdp.eval('JSON.stringify({events:window.__seekEvents,time:window.__audio.currentTime,seeking:window.__audio.seeking})'));
                        throw error;
                    }
                }
                layouts++;
            }
        }
        await cdp.eval('window.__audio.play()');
        await cdp.send('Input.dispatchMouseEvent', {type:'mousePressed', ...point(.5), button:'left', buttons:1, clickCount:1});
        await cdp.send('Input.dispatchMouseEvent', {type:'mouseMoved', ...point(.3), buttons:1});
        await cdp.send('Input.dispatchMouseEvent', {type:'mouseReleased', ...point(.3), button:'left', buttons:0, clickCount:1});
        await waitFor(() => cdp.eval('window.__audio.currentTime > 36.1 && window.__audio.currentTime < 38 && !window.__audio.paused'), 'playing seek continues from the new position');
        assert.deepEqual(cdp.exceptions, []);
        console.log(JSON.stringify({result:'PASS', layouts, bidirectionalDrag:true, releaseOutside:true, keyboard:true, cancellation:true, profile}));
    } finally { await app.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
