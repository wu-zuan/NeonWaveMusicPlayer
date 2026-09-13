const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const { spawn, execFileSync } = require('node:child_process')
const { createInterface } = require('node:readline')
const { once } = require('node:events')
const { ClassicLevel } = require('classic-level')

function decode(value) {
  if (value?.$undefined) return undefined
  if (typeof value?.$bytes === 'string') return Buffer.from(value.$bytes, 'base64')
  if (Array.isArray(value)) return value.map(decode)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, decode(item)]))
  return value
}

test('packaged Node service preserves local storage, IPC, media, lyrics, party and shutdown', { timeout: 60000 }, async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'neonwave-sidecar-'))
  const legacy = path.join(root, 'Local Storage', 'leveldb')
  const db = new ClassicLevel(legacy, { keyEncoding: 'buffer', valueEncoding: 'buffer' })
  const legacyKey = (origin, name) => Buffer.concat([Buffer.from(`_${origin}\0`), Buffer.from([1]), Buffer.from(name)])
  const stored = value => Buffer.concat([Buffer.from([0]), Buffer.from(value, 'utf16le')])
  await db.put(legacyKey('file://', 'neonwave_theme'), stored('discord'))
  await db.put(legacyKey('file://', 'neonwave_folders_v2'), stored(JSON.stringify([{ path: root, name: '繁體測試🎵' }])))
  await db.put(legacyKey('http://localhost:5173', 'neonwave_theme'), stored('spotify'))
  await db.put(legacyKey('https://unrelated.example', 'neonwave_theme'), stored('apple-music'))
  await db.close()
  const originalManifest = await fs.readFile(path.join(legacy, 'CURRENT'))
  const tone = path.join(root, '音樂 #100% 測試.m4a')
  execFileSync(require('ffmpeg-static'), ['-y', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=2', '-metadata', 'title=Fixture title', '-metadata', 'artist=Fixture artist', '-c:a', 'aac', tone], { windowsHide: true, stdio: 'ignore' })
  await fs.writeFile(tone.replace(/\.m4a$/, '.lrc'), '[00:00.00]繁體歌詞\n[00:01.00]第二行')
  const empty = path.join(root, 'empty.mp3')
  await fs.writeFile(empty, '')
  const build = JSON.parse(await fs.readFile('src-tauri/resources/sidecar/build.json'))
  const binary = path.resolve(`src-tauri/binaries/neonwave-node-${build.target}${process.platform === 'win32' ? '.exe' : ''}`)
  const child = spawn(binary, [path.resolve('src-tauri/resources/sidecar/index.mjs')], { env: { ...process.env, NW_USER_DATA: root, NW_OFFLINE: '1' }, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] })
  const exited = once(child, 'exit')
  let output = '', id = 0
  const pending = new Map()
  child.stderr.on('data', data => { output += data })
  createInterface({ input: child.stdout }).on('line', line => {
    const message = JSON.parse(line)
    if (message.kind === 'native') {
      child.stdin.write(JSON.stringify({kind:'native-result', id:message.id, result:message.command === 'dialog:open' ? {canceled:false,filePaths:[root]} : null}) + '\n')
    }
    const request = pending.get(message.id)
    if (message.kind !== 'result' || !request) return
    pending.delete(message.id)
    message.error ? request.reject(new Error(message.error)) : request.resolve(decode(message.result))
  })
  function invoke(channel, ...args) {
    return new Promise((resolve, reject) => {
      const requestId = ++id
      pending.set(requestId, {resolve,reject})
      child.stdin.write(JSON.stringify({kind:'request',id:requestId,window:'main',channel,args})+'\n')
    })
  }
  try {
    const bootstrap = await invoke('desktop:bootstrap')
    assert.equal(bootstrap.preferences.neonwave_theme, 'discord')
    assert.match(bootstrap.preferences.neonwave_folders_v2, /繁體測試🎵/)
    assert.deepEqual(await fs.readFile(path.join(legacy, 'CURRENT')), originalManifest, 'original LevelDB untouched')
    await invoke('storage:set', 'nw_volume', '0.27')
    await invoke('storage:set', 'nw_shuffle', 'true')
    await invoke('storage:set', 'nw_shuffle', null)
    assert.equal(JSON.parse(await fs.readFile(path.join(root, 'preferences.json'))).nw_volume, '0.27')
    assert.ok((await invoke('files:listMusic', root)).includes(tone))
    const metadata = await invoke('files:getMetadata', tone, {$undefined:true})
    assert.equal(metadata.title, 'Fixture title')
    assert.equal(metadata.artist, 'Fixture artist')
    assert.ok(metadata.duration > 1.9)
    const batch = await invoke('files:getMetadataBatch', [tone])
    assert.equal(batch[0].path, tone)
    assert.equal(await invoke('files:getArtwork', tone), null)
    const buffer = await invoke('files:readBufferPartial', tone, 16)
    assert.equal(buffer.length, 16)
    await assert.rejects(invoke('files:readBuffer', path.join(root, 'preferences.json')), /audio\/video/)
    await assert.rejects(invoke('shell:exec', 'whoami'), /Unknown command/)
    const lyrics = await invoke('search:lyrics', 'Fixture title', 'Fixture artist', tone, 2, {provider:'default'})
    assert.match(lyrics, /繁體歌詞|繁体歌词/)
    const url = `${bootstrap.mediaBase}/local?path=${encodeURIComponent(tone)}`
    const bytes = await fs.readFile(tone)
    for (const [range, expected] of [['bytes=2-15',bytes.subarray(2,16)],['bytes=-12',bytes.subarray(-12)],['bytes=0-',bytes]]) {
      const response = await fetch(url, {headers:{Range:range,Origin:'http://tauri.localhost'}})
      assert.equal(response.status, 206)
      assert.equal(response.headers.get('access-control-allow-origin'), 'http://tauri.localhost')
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected)
    }
    assert.equal((await fetch(url,{headers:{Range:'bytes=999999999-'}})).status,416)
    assert.equal((await fetch(url,{headers:{Range:'bytes=-0'}})).status,416)
    assert.equal((await fetch(url,{headers:{Range:'bytes=0-1,4-5'}})).status,416)
    assert.equal((await fetch(url,{headers:{Origin:'https://evil.example'}})).status,403)
    const unauthorized = new URL(url); unauthorized.pathname = '/wrong/local'
    assert.equal((await fetch(unauthorized)).status,403)
    const head = await fetch(url,{method:'HEAD'})
    assert.equal(head.headers.get('content-length'),String(bytes.length))
    assert.equal((await head.arrayBuffer()).byteLength,0)
    assert.equal((await fetch(url+'&maxBytes=1')).status,413)
    assert.equal((await fetch(`${bootstrap.mediaBase}/local?path=${encodeURIComponent(empty)}`)).status,200)
    await invoke('player:sync', {path:tone,title:'Fixture title',artist:'Fixture artist',duration:2,currentTime:1,isPlaying:false,artwork:'data:image/png;base64,AA=='})
    await invoke('player:sync', {path:tone,title:'Fixture title',currentTime:1,isPlaying:false})
    assert.equal((await invoke('player:getSnapshot')).artwork, 'data:image/png;base64,AA==')
    const status = await invoke('party:start', {autoTunnel:false})
    assert.equal(status.active,true)
    assert.equal((await fetch(status.localUrl)).status,200)
    assert.equal(await invoke('party:stop'),true)
    assert.equal((await invoke('discord:status')).isConnected,false)
    const compute = await invoke('lyrics:computeDevices')
    assert.ok(compute.cpu.logicalThreads > 0)
    assert.equal(typeof (await invoke('lyrics:gpuStatus')).engineReady,'boolean')
    assert.equal((await fetch(`${bootstrap.mediaBase}/audio`,{method:'POST',body:Buffer.from([1,2,3])})).status,204)
    child.stdin.end()
    const [code] = await exited
    assert.equal(code,0,output)
    await assert.rejects(fetch(url), /fetch failed/)
    assert.ok(!output.includes('[CRITICAL]'),output)
  } finally {
    if (child.exitCode === null) { child.stdin.end(); await Promise.race([exited,new Promise(resolve=>setTimeout(resolve,6000))]); if (child.exitCode === null) child.kill() }
    assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()))
    assert.ok(path.basename(root).startsWith('neonwave-sidecar-'))
    await fs.rm(root,{recursive:true,force:true,maxRetries:5,retryDelay:200})
  }
})
