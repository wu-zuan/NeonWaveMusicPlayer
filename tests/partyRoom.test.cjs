const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const { EventEmitter } = require('node:events')
const { PassThrough } = require('node:stream')
const { Script } = require('node:vm')
const { build } = require('esbuild')

let PartyRoomService, tempDir
const children = []
before(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nw-party-test-'))
  global.__partyTestSpawn = () => {
    const child = new EventEmitter()
    child.stdout = new PassThrough()
    child.stderr = new PassThrough()
    child.kill = () => { child.killed = true; return true }
    children.push(child)
    return child
  }
  const outfile = path.join(tempDir, 'party.cjs')
  await build({
    entryPoints: ['electron/partyRoom.ts'], bundle: true, platform: 'node', format: 'cjs', outfile,
    plugins: [{ name: 'test-process-boundaries', setup(build) {
      build.onResolve({ filter: /^(electron|node:child_process)$/ }, args => ({ path: args.path, namespace: 'stub' }))
      build.onLoad({ filter: /.*/, namespace: 'stub' }, args => ({ contents: args.path === 'electron'
        ? `export const app = { getPath: () => ${JSON.stringify(tempDir)} }`
        : 'export const spawn = (...args) => globalThis.__partyTestSpawn(...args)' }))
    } }]
  })
  ;({ PartyRoomService } = require(outfile))
})
after(async () => {
  delete global.__partyTestSpawn
  await fs.rm(tempDir, { recursive: true, force: true })
})

test('guest state stays compact, artwork clears on track change, ranges and auth work', async () => {
  const room = new PartyRoomService(() => {})
  try {
    const media = path.join(tempDir, 'sample.mp3')
    await fs.writeFile(media, '0123456789')
    const artwork = 'data:image/png;base64,' + Buffer.alloc(256000).toString('base64')
    room.updatePlayback({ path: media, title: '</script><script>bad()</script>', artwork, duration: 10 })
    const status = await room.start()
    const invite = new URL(status.localUrl)
    const api = invite.origin + '/api/room/' + status.roomId
    const query = invite.search
    const stateResponse = await fetch(api + query)
    const body = await stateResponse.text()
    assert.ok(body.length < 2048, `status payload: ${body.length} bytes`)
    const state = JSON.parse(body)
    assert.notEqual(state.track.path, media)
    const art = await fetch(invite.origin + state.track.artwork)
    assert.equal((await art.arrayBuffer()).byteLength, 256000)
    assert.equal((await fetch(api)).status, 403)
    const html = await (await fetch(status.localUrl)).text()
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    assert.equal(scripts.length, 1)
    new Script(scripts[0][1])
    assert.equal(JSON.parse(/let state = (.*);/.exec(scripts[0][1])[1]).track.title, '</script><script>bad()</script>')
    assert.ok(!html.includes('new EventSource('))
    for (const [range, expected, contentRange] of [
      ['bytes=2-4', '234', 'bytes 2-4/10'],
      ['bytes=-3', '789', 'bytes 7-9/10'],
      ['bytes=8-99', '89', 'bytes 8-9/10']
    ]) {
      const res = await fetch(api + '/stream' + query, { headers: { Range: range } })
      assert.equal(res.status, 206)
      assert.equal(res.headers.get('content-range'), contentRange)
      assert.equal(await res.text(), expected)
    }
    const invalid = await fetch(api + '/stream' + query, { headers: { Range: 'bytes=99-' } })
    assert.equal(invalid.status, 416)
    assert.equal(invalid.headers.get('content-range'), 'bytes */10')
    room.updatePlayback({ path: 'different.mp3' })
    assert.equal(room.getStatus().track.artwork, undefined)
  } finally { await room.stop() }
})

test('tunnel waits for registration, accepts split logs, ignores old process exit and supports retry', async () => {
  const room = new PartyRoomService(() => {})
  room.ensureCloudflared = async () => 'mock-cloudflared'
  try {
    const count = children.length
    await Promise.all([room.start({ autoTunnel: true }), room.start({ autoTunnel: true })])
    assert.equal(children.length, count + 1)
    const child = children.at(-1)
    child.stderr.emit('data', Buffer.from('https://test-room.trycloud'))
    child.stderr.emit('data', Buffer.from('flare.com\n'))
    assert.equal(room.getStatus().publicUrl, null)
    child.stderr.emit('data', Buffer.from('Registered tunnel connection connIndex=0\n'))
    assert.equal(room.getStatus().tunnelStatus, 'connected')
    assert.ok(room.getStatus().publicUrl.startsWith('https://test-room.trycloudflare.com/'))
    await room.stop()
    assert.equal(child.killed, true)
    await room.start({ autoTunnel: true })
    const next = children.at(-1)
    child.emit('exit', 0)
    assert.equal(room.getStatus().tunnelStatus, 'starting')
    next.emit('error', new Error('ENOENT'))
    assert.equal(room.getStatus().tunnelStatus, 'error')
    await room.start({ autoTunnel: true })
    assert.equal(room.getStatus().tunnelStatus, 'starting')
    assert.notEqual(children.at(-1), next)
  } finally { await room.stop() }
})

test('stopping during dependency installation does not launch a tunnel afterwards', async () => {
  const room = new PartyRoomService(() => {})
  let finishInstall, startedInstall
  const installing = new Promise(resolve => { startedInstall = resolve })
  room.ensureCloudflared = () => {
    startedInstall()
    return new Promise(resolve => { finishInstall = resolve })
  }
  const count = children.length
  const starting = room.start({ autoTunnel: true })
  await installing
  await room.stop()
  finishInstall('mock-cloudflared')
  await starting
  assert.equal(children.length, count)
  assert.equal(room.getStatus().active, false)
  assert.equal(room.getStatus().tunnelStatus, 'idle')
})
