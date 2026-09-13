import assert from 'node:assert/strict'
import test from 'node:test'
import { subscribePlaybackTime } from '../src/utils/playbackClock.ts'

class TestMedia extends EventTarget {
    currentTime = 0
}

test('clock observes seeks, track resets, and elapsed time immediately', () => {
    const media = new TestMedia()
    const times: number[] = []
    media.currentTime = 12
    const unsubscribe = subscribePlaybackTime(media, time => times.push(time))
    media.currentTime = 13
    media.dispatchEvent(new Event('timeupdate'))
    media.currentTime = 95
    media.dispatchEvent(new Event('seeking'))
    media.currentTime = 0
    media.dispatchEvent(new Event('emptied'))
    assert.deepEqual(times, [12, 13, 95, 0])
    unsubscribe()
})

test('hidden or unmounted clock subscribers release every event listener', () => {
    const media = new TestMedia()
    const hiddenTimes: number[] = []
    const playerTimes: number[] = []
    const hideLyrics = subscribePlaybackTime(media, time => hiddenTimes.push(time))
    const closePlayer = subscribePlaybackTime(media, time => playerTimes.push(time))
    hideLyrics()
    media.currentTime = 42
    for (const event of ['timeupdate', 'loadedmetadata', 'emptied', 'seeking', 'seeked', 'ended']) {
        media.dispatchEvent(new Event(event))
    }
    assert.deepEqual(hiddenTimes, [0])
    assert.equal(playerTimes.at(-1), 42)
    closePlayer()
    const updates = playerTimes.length
    media.dispatchEvent(new Event('timeupdate'))
    assert.equal(playerTimes.length, updates)
    const shownTimes: number[] = []
    const hideAgain = subscribePlaybackTime(media, time => shownTimes.push(time))
    assert.deepEqual(shownTimes, [42])
    hideAgain()
})
