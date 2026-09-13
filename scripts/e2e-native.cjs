// Runs the production host with an isolated profile, without desktop input.
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const { spawn } = require('node:child_process')
const { once } = require('node:events')
const WebSocket = require('ws')
const { CDP, getJson, waitFor, unusedPort } = require('./e2e-performance.cjs')

async function main() {
  const binary = path.resolve(process.env.NW_E2E_BINARY || 'src-tauri/target/release/NeonWave.exe')
  const profile = process.env.NW_E2E_PROFILE || await fs.mkdtemp(path.join(os.tmpdir(), 'neonwave-native-'))
  await fs.mkdir(profile, { recursive: true })
  const port = await unusedPort()
  const environment = { ...process.env, NW_USER_DATA: profile, NW_OFFLINE: '1', NW_HIDDEN: '1', NW_REMOTE_DEBUG: String(port) }
  const child = spawn(binary, [], { env: environment, windowsHide: true, stdio: 'ignore' })
  const exited = once(child, 'exit')
  let cdp, mini
  try {
    let target
    await waitFor(async () => { target = (await getJson(`http://127.0.0.1:${port}/json/list`)).find(t => t.type === 'page' && t.url.includes('tauri.localhost')); return !!target }, 'native app', 30000)
    const socket = new WebSocket(target.webSocketDebuggerUrl)
    await once(socket, 'open')
    cdp = new CDP(socket)
    await cdp.send('Runtime.enable')
    await cdp.send('Page.enable')
    await cdp.send('Emulation.setFocusEmulationEnabled', {enabled:true})
    await cdp.send('Emulation.setDeviceMetricsOverride', {width:1200,height:800,deviceScaleFactor:1,mobile:false})
    const dialogAnswers = []
    socket.on('message', data => {
      const message = JSON.parse(data)
      if (message.method === 'Page.javascriptDialogOpening') void cdp.send('Page.handleJavaScriptDialog', {accept:dialogAnswers.shift() ?? true}).catch(() => {})
    })
    await waitFor(() => cdp.eval(`!!window.ipcRenderer && !!document.querySelector('aside')`), 'native bootstrap', 60000)
    assert.equal(await cdp.eval(`window.ipcRenderer.getAppVersion()`), require('../package.json').version)
    await fs.mkdir('artifacts',{recursive:true})
    const image = await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:true})
    await fs.writeFile('artifacts/native-main.png',Buffer.from(image.data,'base64'))
    dialogAnswers.push(false)
    assert.equal(await cdp.eval(`confirm('Cancel regression check')`), false, 'Cancel remains a synchronous false value')
    dialogAnswers.push(true)
    assert.equal(await cdp.eval(`confirm('Accept regression check')`), true)
    assert.match(await cdp.eval(`window.ipcRenderer.invoke('shell:exec', 'whoami').catch(String)`), /Unknown application command/)
    assert.match(await cdp.eval(`window.ipcRenderer.invoke('shell:openExternal', 'https://example.com').catch(String)`), /not permitted/)
    // A general filesystem/shell plugin invocation is denied by capabilities.
    assert.match(await cdp.eval(`window.__TAURI_INTERNALS__.invoke('plugin:fs|read_text_file', {path:'C:/Windows/win.ini'}).catch(String)`), /not allowed|not found|not permitted/i)
    assert.equal((await cdp.eval(`window.ipcRenderer.installUpdate()`)).ok, false, 'cannot install an undownloaded update')
    assert.ok((await cdp.eval(`window.ipcRenderer.invoke('party:start', {autoTunnel:false})`)).active)
    assert.equal(await cdp.eval(`window.ipcRenderer.invoke('party:stop')`), true)

    await cdp.eval(`window.ipcRenderer.invoke('window:setMiniPlayer', true)`)
    let miniTarget
    await waitFor(async () => { miniTarget = (await getJson(`http://127.0.0.1:${port}/json/list`)).find(t => t.url.includes('mini=true')); return !!miniTarget }, 'mini webview')
    const miniSocket = new WebSocket(miniTarget.webSocketDebuggerUrl)
    await once(miniSocket, 'open')
    mini = new CDP(miniSocket)
    await mini.send('Runtime.enable')
    await waitFor(() => mini.eval(`!!window.ipcRenderer && !!document.querySelector('button')`), 'mini bootstrap')
    assert.deepEqual(await mini.eval(`({width:innerWidth,height:innerHeight})`), {width:356,height:132})
    assert.match(await mini.eval(`window.ipcRenderer.invoke('files:listMusic', 'C:/').catch(String)`), /not allowed for this window/)
    assert.match(await mini.eval(`window.ipcRenderer.invoke('storage:set', 'discord_token', 'forbidden').catch(String)`), /cannot change/)
    assert.match(await mini.eval(`window.__TAURI_INTERNALS__.invoke('desktop_send',{channel:'player:sync',args:[]}).catch(String)`), /not allowed|not permitted/i)

    // Use the existing hidden input and real FileReader, with CDP intercepting
    // only the OS chooser so this test never needs physical input.
    const playlist = {version:1,name:'遷移驗證 🎵',tracks:[{title:'測試歌曲',artist:'Test artist'}]}
    const file = path.join(profile, 'migration.nwp')
    await fs.writeFile(file, JSON.stringify(playlist))
    await cdp.send('Page.setInterceptFileChooserDialog', {enabled:true})
    let chooser
    socket.on('message', data => {
      const message = JSON.parse(data)
      if (message.method === 'Page.fileChooserOpened') chooser = message.params
    })
    await cdp.eval(`void document.querySelector('button[title="匯入分享歌單 (.nwp)"]').click()`)
    await waitFor(() => !!chooser, 'playlist file input')
    await cdp.send('DOM.setFileInputFiles', {files:[file],backendNodeId:chooser.backendNodeId})
    await waitFor(() => cdp.eval(`document.body.innerText.includes('遷移驗證')`), 'existing playlist import dialog')
    const choices = await cdp.eval(`[...document.querySelectorAll('button')].map(b=>b.textContent)`)
    const stream = choices.find(text => text.includes('串流') && !text.includes('Discord'))
    assert.ok(stream, 'stream import option')
    await cdp.eval(`void [...document.querySelectorAll('button')].find(b=>b.textContent===${JSON.stringify(stream)}).click()`)
    await waitFor(() => cdp.eval(`document.querySelector('aside')?.innerText.includes('遷移驗證')`), 'imported playlist')

    const downloads = path.join(profile, 'downloads')
    await fs.mkdir(downloads)
    await cdp.send('Browser.setDownloadBehavior', {behavior:'allow',downloadPath:downloads})
    await cdp.eval(`document.querySelector('button[title="匯出分享 (.nwp)"]').click()`)
    const exported = path.join(downloads, playlist.name + '.nwp')
    await waitFor(async () => !!await fs.stat(exported).catch(() => null), 'playlist blob download')
    assert.deepEqual(JSON.parse(await fs.readFile(exported,'utf8')), playlist)

    await cdp.eval(`localStorage.setItem('neonwave_migration_close_test', '完整儲存'); void window.ipcRenderer.invoke('window:close')`)
    const [code] = await Promise.race([exited, new Promise((_,reject)=>setTimeout(()=>reject(new Error('Graceful shutdown timed out')),12000))])
    assert.equal(code, 0)
    const preferences = JSON.parse(await fs.readFile(path.join(profile, 'preferences.json'),'utf8'))
    assert.equal(preferences.neonwave_migration_close_test, '完整儲存')
    assert.equal(preferences.discord_token, undefined)
    assert.deepEqual(cdp.exceptions, [])
    assert.deepEqual(mini.exceptions, [])
    const result = {result:'PASS',binary,profile,ipcAndCapabilities:true,miniDimensions:true,playlistImportExport:true,closeFlushAndCleanExit:true}
    await fs.mkdir('artifacts',{recursive:true})
    await fs.writeFile('artifacts/native-validation.json',JSON.stringify(result,null,2))
    console.log(JSON.stringify(result,null,2))
  } finally {
    mini?.close(); cdp?.close()
    if (child.exitCode === null) child.kill()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
