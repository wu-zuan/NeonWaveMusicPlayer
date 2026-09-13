const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const Module = require('node:module')
const { buildSync } = require('esbuild')

const filename = path.resolve('sidecar/transport.ts')
const compiled = buildSync({ entryPoints: [filename], bundle: true, platform: 'node', format: 'cjs', write: false })
const service = new Module(filename, module)
service.filename = filename
service.paths = module.paths
service._compile(compiled.outputFiles[0].text, filename)
const { rpc, encode, decode } = service.exports

test('audio transport retains exact bytes for both HTTP bodies and stdio envelopes', async () => {
  const received = []
  rpc.on('test:audio-chunk', (_, chunk) => {
    assert.ok(ArrayBuffer.isView(chunk) || chunk instanceof ArrayBuffer)
    received.push(Buffer.from(chunk))
  })
  const samples = [Buffer.from([0, 255, 1, 128]), new Uint8Array([9, 8, 7]).subarray(1), new Uint8Array([3, 4]).buffer]
  for (const sample of samples) {
    await rpc.dispatch('test:audio-chunk', [sample])
    await rpc.dispatch('test:audio-chunk', [JSON.parse(JSON.stringify(encode(sample)))])
    assert.deepEqual(received.at(-1), Buffer.from(sample))
    assert.deepEqual(received.at(-2), Buffer.from(sample))
  }
})

test('optional arguments and nested binary results retain their original meanings', async () => {
  rpc.handle('test:optional', (_, title, options = { loadArtwork: true }) => ({ title, options }))
  assert.deepEqual(await rpc.dispatch('test:optional', ['Song', encode(undefined)]), { title: 'Song', options: { loadArtwork: true } })
  assert.deepEqual(decode(encode({ optional: undefined, payload: [Buffer.from([0, 255])] })), { optional: undefined, payload: [Buffer.from([0, 255])] })
})
