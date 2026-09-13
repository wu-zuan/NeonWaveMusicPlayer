import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { setImmediate } from 'node:timers/promises'
import type { parseFile, IAudioMetadata } from 'music-metadata'
import { BoundedCache, createConcurrencyLimit, mapConcurrent } from '../shared/boundedCache.ts'
import { MediaMetadataService } from '../sidecar/utils/mediaMetadata.ts'

test('cache enforces byte and entry budgets, refreshes recency, and releases replacements', () => {
  const cache = new BoundedCache<string, string | null>(3, 8, value => value?.length || 1)
  cache.set('a', '123')
  cache.set('b', '123')
  assert.equal(cache.get('a'), '123')
  cache.set('c', '123')
  assert.equal(cache.get('b'), undefined)
  assert.equal(cache.bytes, 6)
  cache.set('a', null)
  assert.equal(cache.bytes, 4)
  cache.set('d', null)
  cache.set('e', null)
  assert.equal(cache.size, 3)
  assert.equal(cache.get('c'), undefined)
  cache.set('e', '123456789')
  assert.equal(cache.get('e'), undefined)
  cache.clear()
  assert.equal(cache.size, 0)
  assert.equal(cache.bytes, 0)
})

test('folder mapping and shared limiter bound work without changing result order', async () => {
  const limit = createConcurrencyLimit(3)
  let active = 0
  let peak = 0
  const results = await mapConcurrent(Array.from({ length: 1000 }, (_, i) => i), 8, value => limit(async () => {
    active++
    peak = Math.max(peak, active)
    await setImmediate()
    active--
    return value * 2
  }))
  assert.equal(peak, 3)
  assert.deepEqual(results, Array.from({ length: 1000 }, (_, i) => i * 2))
  await assert.rejects(limit(async () => { throw new Error('parse failure') }))
  assert.equal(await limit(async () => 42), 42)
})

const tags = (title: string, withArtwork = false): IAudioMetadata => ({
  common: {
    title,
    artist: 'Artist',
    picture: withArtwork ? [{ format: 'image/png', data: new Uint8Array([1, 2, 3]) }] : undefined
  },
  format: { duration: 120 },
  native: {},
  quality: { warnings: [] }
})

async function fixture(parser: typeof parseFile) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'neonwave-metadata-'))
  const cachePath = path.join(directory, 'cache.json')
  const service = new MediaMetadataService(cachePath, parser)
  return {
    directory, cachePath, service,
    async file(name: string) {
      const filePath = path.join(directory, name)
      await fs.writeFile(filePath, 'track')
      return filePath
    },
    async cleanup() {
      await service.close()
      assert.equal(path.dirname(path.resolve(directory)), path.resolve(os.tmpdir()))
      assert.ok(path.basename(directory).startsWith('neonwave-metadata-'))
      await fs.rm(directory, { recursive: true, force: true })
    }
  }
}

test('concurrent artwork requests share parsing and unchanged tracks reuse lightweight metadata', async () => {
  let parses = 0
  const env = await fixture(async (_filePath, options) => {
    parses++
    await setImmediate()
    return tags('Track', !options?.skipCovers)
  })
  try {
    const file = await env.file('track.mp3')
    const results = await Promise.all(Array.from({ length: 20 }, () => env.service.get(file, true)))
    assert.equal(parses, 1)
    assert.ok(results.every(result => result.artwork === 'data:image/png;base64,AQID'))
    assert.equal((await env.service.get(file, false)).artwork, null)
    assert.equal(parses, 1)
  } finally { await env.cleanup() }
})

test('file changes invalidate both metadata and artwork, and no-cover misses are cached', async () => {
  let parses = 0
  const env = await fixture(async () => tags(`Version ${++parses}`))
  try {
    const file = await env.file('track.mp3')
    assert.equal((await env.service.get(file, true)).title, 'Version 1')
    assert.equal((await env.service.get(file, true)).artwork, null)
    assert.equal(parses, 1)
    await fs.appendFile(file, 'new tags')
    assert.equal((await env.service.get(file, true)).title, 'Version 2')
    assert.equal(parses, 2)
  } finally { await env.cleanup() }
})

test('global parser concurrency stays bounded across independent requests', async () => {
  let active = 0
  let peak = 0
  const env = await fixture(async filePath => {
    active++
    peak = Math.max(peak, active)
    await setImmediate()
    active--
    return tags(String(filePath))
  })
  try {
    const files = await Promise.all(Array.from({ length: 50 }, (_, i) => env.file(`${i}.mp3`)))
    const results = await Promise.all(files.map(file => env.service.get(file, false)))
    assert.equal(results.length, 50)
    assert.equal(peak, 4)
  } finally { await env.cleanup() }
})

test('persisted and legacy metadata are available to every concurrent startup reader', async () => {
  let parses = 0
  const env = await fixture(async () => { parses++; return tags('Parsed') })
  try {
    const file = await env.file('track.mp3')
    const mtime = Math.round((await fs.stat(file)).mtimeMs)
    const metadata = { title: 'Cached', artist: null, album: null, duration: 120, codec: null, bitrate: null, sampleRate: null }
    await fs.writeFile(env.cachePath, JSON.stringify({ [`${file}\0${mtime}`]: metadata }))
    const results = await Promise.all(Array.from({ length: 20 }, () => env.service.get(file, false)))
    assert.ok(results.every(result => result.title === 'Cached'))
    assert.equal(parses, 0)
    await env.service.flush()
    const saved = JSON.parse(await fs.readFile(env.cachePath, 'utf8'))
    assert.equal(saved.version, 2)
    assert.equal(saved.entries.length, 1)
    const reopened = new MediaMetadataService(env.cachePath, async () => { throw new Error('must use cache') })
    try { assert.equal((await reopened.get(file, false)).title, 'Cached') }
    finally { await reopened.close() }
  } finally { await env.cleanup() }
})

test('failed parsers release in-flight requests so a later retry succeeds', async () => {
  let parses = 0
  const env = await fixture(async () => {
    if (++parses === 1) throw new Error('temporary read failure')
    return tags('Recovered')
  })
  try {
    const file = await env.file('track.mp3')
    await assert.rejects(env.service.get(file, true), /temporary read failure/)
    assert.equal((await env.service.get(file, true)).title, 'Recovered')
    assert.equal(parses, 2)
  } finally { await env.cleanup() }
})
