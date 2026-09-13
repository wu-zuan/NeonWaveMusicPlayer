import assert from 'node:assert/strict'
import test from 'node:test'
import { setImmediate } from 'node:timers/promises'
import { createArtworkLoader, type ArtworkResult } from '../src/utils/artworkLoader.ts'

function controlledLoader() {
    const calls: string[] = []
    const completions = new Map<string, (result: ArtworkResult) => void>()
    const load = (path: string) => {
        calls.push(path)
        return new Promise<ArtworkResult>(resolve => completions.set(path, resolve))
    }
    return { load, calls, complete: (path: string) => completions.get(path)!({ artwork: path }) }
}

test('evicts least recently used results, including empty artwork results', () => {
    const loader = createArtworkLoader(async () => ({}), { maxEntries: 2 })
    loader.remember('missing', {})
    loader.remember('cover', { artwork: 'image' })
    assert.deepEqual(loader.get('missing'), {})
    loader.remember('new', { artwork: 'new image' })
    assert.equal(loader.get('cover'), undefined)
    assert.deepEqual(loader.get('missing'), {})
    loader.remember('another', {})
    assert.equal(loader.get('new'), undefined)
})

test('bounds retained cover strings by bytes and does not retain oversized results', async () => {
    const loader = createArtworkLoader(async () => ({ artwork: 'x'.repeat(20) }), { maxBytes: 20 })
    loader.remember('a', { artwork: '1234' })
    loader.remember('b', { artwork: '1234' })
    loader.remember('c', { artwork: '1234' })
    assert.equal(loader.get('a'), undefined)
    assert.ok(loader.get('b'))
    assert.ok(loader.get('c'))
    assert.equal((await loader.request('large').promise)?.artwork?.length, 20)
    assert.equal(loader.get('large'), undefined)
    assert.ok(loader.get('b'))
    assert.ok(loader.get('c'))
})

test('deduplicates consumers and retains shared queued requests until all consumers leave', async () => {
    const control = controlledLoader()
    const loader = createArtworkLoader(control.load, { concurrency: 1 })
    const active = loader.request('active')
    const first = loader.request('shared')
    const second = loader.request('shared')
    assert.equal(first.promise, second.promise)
    first.release()
    first.release()
    await setImmediate()
    assert.deepEqual(control.calls, ['active'])
    control.complete('active')
    await active.promise
    await setImmediate()
    assert.deepEqual(control.calls, ['active', 'shared'])
    control.complete('shared')
    assert.deepEqual(await second.promise, { artwork: 'shared' })
    second.release()
})

test('rapid scrolling discards obsolete queued work and loads the new visible row next', async () => {
    const control = controlledLoader()
    const loader = createArtworkLoader(control.load, { concurrency: 2 })
    const first = loader.request('first')
    const second = loader.request('second')
    const abandoned = Array.from({ length: 500 }, (_, index) => loader.request(`scrolled-${index}`))
    abandoned.forEach(request => request.release())
    assert.ok((await Promise.all(abandoned.map(request => request.promise))).every(value => value === undefined))
    const visible = loader.request('visible')
    await setImmediate()
    assert.deepEqual(control.calls, ['first', 'second'])
    control.complete('first')
    await first.promise
    await setImmediate()
    assert.deepEqual(control.calls, ['first', 'second', 'visible'])
    control.complete('second')
    control.complete('visible')
    await Promise.all([second.promise, visible.promise])
})

test('allows a cancelled path to be requested again without cancelling its replacement', async () => {
    const control = controlledLoader()
    const loader = createArtworkLoader(control.load, { concurrency: 1 })
    const active = loader.request('active')
    const oldRequest = loader.request('row')
    oldRequest.release()
    const newRequest = loader.request('row')
    oldRequest.release()
    assert.equal(await oldRequest.promise, undefined)
    await setImmediate()
    control.complete('active')
    await active.promise
    await setImmediate()
    control.complete('row')
    assert.deepEqual(await newRequest.promise, { artwork: 'row' })
    assert.deepEqual(control.calls, ['active', 'row'])
})

test('reuses an in-flight request after its original row unmounts', async () => {
    const control = controlledLoader()
    const loader = createArtworkLoader(control.load)
    const first = loader.request('row')
    await setImmediate()
    first.release()
    const second = loader.request('row')
    assert.equal(first.promise, second.promise)
    control.complete('row')
    await second.promise
    assert.deepEqual(control.calls, ['row'])
})

test('caches missing artwork and discovered duration without repeating IPC', async () => {
    let calls = 0
    const loader = createArtworkLoader(async () => {
        calls += 1
        return { duration: 185 }
    })
    assert.deepEqual(await loader.request('missing').promise, { duration: 185 })
    assert.deepEqual(await loader.request('missing').promise, { duration: 185 })
    assert.equal(calls, 1)
})

test('synchronous failures free concurrency slots and can be retried', async () => {
    let attempts = 0
    const loader = createArtworkLoader(path => {
        if (path === 'failure' && attempts++ === 0) throw new Error('IPC unavailable')
        return Promise.resolve({ artwork: path })
    }, { concurrency: 1 })
    const failed = loader.request('failure')
    const next = loader.request('next')
    await assert.rejects(failed.promise, /IPC unavailable/)
    assert.deepEqual(await next.promise, { artwork: 'next' })
    assert.deepEqual(await loader.request('failure').promise, { artwork: 'failure' })
})
