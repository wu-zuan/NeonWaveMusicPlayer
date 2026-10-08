import assert from 'node:assert/strict'
import test from 'node:test'
import { PreferenceWriter, restorePreferences } from '../src/utils/preferenceWriter.ts'
import { readAudioSettings, spacePreset, SPACE_MODES } from '../src/utils/audioSettings.ts'

test('reopening restores saved effects, validates damaged settings and retires removed modes', () => {
    const saved = { ...spacePreset('concert'), distance: 6.5, position: { x: 2, y: 0, z: -3 } }
    assert.deepEqual(readAudioSettings(JSON.stringify(saved)), saved)
    assert.deepEqual(readAudioSettings('{bad'), spacePreset('none'))
    assert.deepEqual(readAudioSettings('null'), spacePreset('none'))
    assert.equal(readAudioSettings('{"spaceMode":"fps"}').spaceMode, 'none')
    assert.deepEqual(SPACE_MODES, ['none', 'room', 'hall', 'concert', 'tetr'])
})

test('disk preferences override a stale WebView cache on relaunch', () => {
    const values = new Map([['nw_volume', '1'], ['neonwave_auto_focus', 'false']])
    const storage = { setItem(key: string, value: string) { values.set(key, value) } } as Storage
    restorePreferences(storage, { nw_volume: '0.27', neonwave_auto_focus: 'true', nw_audio_settings: JSON.stringify(spacePreset('tetr')) })
    assert.equal(values.get('nw_volume'), '0.27')
    assert.equal(values.get('neonwave_auto_focus'), 'true')
    assert.equal(readAudioSettings(values.get('nw_audio_settings')!).spaceMode, 'tetr')
})

test('volume drags are coalesced and close flushes the last value without waiting for debounce', async t => {
    t.mock.timers.enable({ apis: ['setTimeout'] })
    const writes: unknown[] = []
    const writer = new PreferenceWriter(async (key, value) => { writes.push([key, value]) }, error => { throw error })
    for (let i = 0; i <= 100; i++) writer.enqueue('nw_volume', String(i / 100))
    writer.enqueue('neonwave_auto_focus', 'true')
    assert.equal(writes.length, 0)
    await writer.flush()
    assert.deepEqual(writes, [['nw_volume', '1'], ['neonwave_auto_focus', 'true']])
    t.mock.timers.tick(80)
    assert.equal(writes.length, 2)
})

test('an in-flight update preserves a newer value and a failed save is retried at close', async t => {
    t.mock.timers.enable({ apis: ['setTimeout'] })
    let finish!: () => void
    const first = new Promise<void>(resolve => { finish = resolve })
    const values: Array<string | null> = []
    let fail = false
    const writer = new PreferenceWriter(async (_, value) => {
        if (fail) throw new Error('disk unavailable')
        values.push(value)
        if (values.length === 1) await first
    }, error => { throw error })
    writer.enqueue('nw_volume', '0.1')
    const saving = writer.flush()
    writer.enqueue('nw_volume', '0.9')
    finish()
    await saving
    assert.deepEqual(values, ['0.1', '0.9'])
    fail = true
    writer.enqueue('nw_volume', '0.5')
    await assert.rejects(writer.flush(), /disk unavailable/)
    fail = false
    await writer.flush()
    assert.equal(values.at(-1), '0.5')
})

test('an update arriving as a flush finishes is still saved', async t => {
    t.mock.timers.enable({ apis: ['setTimeout'] })
    const values: Array<string | null> = []
    const writer = new PreferenceWriter(async (_, value) => { values.push(value) }, error => { throw error })
    const saving = writer.flush()
    writer.enqueue('nw_volume', '0.33')
    await saving
    assert.deepEqual(values, ['0.33'])
})
