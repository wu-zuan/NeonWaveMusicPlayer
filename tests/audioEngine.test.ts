import assert from 'node:assert/strict'
import test, { type TestContext } from 'node:test'
import { AudioEngine } from '../src/utils/AudioEngine.ts'

class FakeParam {
    value = 0
    setTargetAtTime(value: number) { this.value = value }
    setValueAtTime(value: number) { this.value = value }
    linearRampToValueAtTime(value: number) { this.value = value }
}

class FakeNode {
    connections = new Set<FakeNode>()
    gain = new FakeParam()
    frequency = new FakeParam()
    Q = new FakeParam()
    threshold = new FakeParam()
    knee = new FakeParam()
    ratio = new FakeParam()
    attack = new FakeParam()
    release = new FakeParam()
    positionX = new FakeParam()
    positionY = new FakeParam()
    positionZ = new FakeParam()
    buffer: unknown = null
    onaudioprocess: ((event: any) => void) | null = null
    onended: (() => void) | null = null
    stopAt: number | undefined
    stopped = false
    stream = { getTracks: () => [{ stop: () => { this.stopped = true } }] }
    connect(node: FakeNode) { this.connections.add(node) }
    disconnect(node?: FakeNode) {
        if (!node) this.connections.clear()
        else assert.ok(this.connections.delete(node), 'only disconnect an attached audio route')
    }
    start() {}
    stop(time = 0) { this.stopAt = time }
}

class FakeContext extends EventTarget {
    state = 'running'
    currentTime = 0
    sampleRate = 48000
    destination = new FakeNode()
    nodes: FakeNode[] = []
    buffersCreated = 0
    streamsCreated = 0
    panner!: FakeNode
    convolver!: FakeNode
    compressor!: FakeNode
    capture!: FakeNode
    createNode() {
        const node = new FakeNode()
        this.nodes.push(node)
        return node
    }
    createPanner() { return this.panner = this.createNode() }
    createBiquadFilter() { return this.createNode() }
    createConvolver() { return this.convolver = this.createNode() }
    createGain() { return this.createNode() }
    createDynamicsCompressor() { return this.compressor = this.createNode() }
    createMediaElementSource() { return this.createNode() }
    createMediaStreamDestination() { this.streamsCreated++; return this.createNode() }
    createBufferSource() { return this.createNode() }
    createScriptProcessor() { return this.capture = this.createNode() }
    createBuffer(channels: number, length: number) {
        this.buffersCreated++
        const data = Array.from({ length: channels }, () => new Float32Array(length))
        return { length, getChannelData: (channel: number) => data[channel] }
    }
    async resume() { this.state = 'running'; this.dispatchEvent(new Event('statechange')) }
    async close() { this.state = 'closed' }
}

class FakeMedia extends EventTarget {
    paused = true
    ended = false
    play() { this.paused = false; this.ended = false; this.dispatchEvent(new Event('play')) }
    pause() { this.paused = true; this.dispatchEvent(new Event('pause')) }
    end() { this.ended = true; this.dispatchEvent(new Event('ended')) }
}

function harness(t: TestContext) {
    const intervals = new Map<number, () => void>()
    let nextId = 0
    let context!: FakeContext
    const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
    Object.defineProperty(globalThis, 'window', {
        configurable: true,
        value: {
            AudioContext: class extends FakeContext { constructor() { super(); context = this } },
            setInterval(callback: () => void, delay: number) {
                assert.equal(delay, 16, 'retain the original spatial motion update rate while playing')
                const id = ++nextId
                intervals.set(id, callback)
                return id
            }
        }
    })
    t.mock.method(globalThis, 'clearInterval', (id: number) => { intervals.delete(id) })
    t.mock.timers.enable({ apis: ['setTimeout'] })
    const engine = new AudioEngine()
    const media = new FakeMedia()
    engine.connect(media as unknown as HTMLMediaElement)
    t.after(() => {
        engine.dispose()
        if (oldWindow) Object.defineProperty(globalThis, 'window', oldWindow)
        else Reflect.deleteProperty(globalThis, 'window')
    })
    return { engine, media, context, intervals }
}

test('spatial rotation has no idle timer and resumes once without reducing active quality', t => {
    const { engine, media, context, intervals } = harness(t)
    engine.toggle8D(true)
    assert.equal(intervals.size, 0)
    media.play()
    assert.equal(intervals.size, 1)
    engine.toggle8D(true)
    media.dispatchEvent(new Event('play'))
    assert.equal(intervals.size, 1)
    media.pause()
    assert.equal(intervals.size, 0)
    media.play()
    context.state = 'suspended'
    context.dispatchEvent(new Event('statechange'))
    assert.equal(intervals.size, 0)
    context.state = 'running'
    context.dispatchEvent(new Event('statechange'))
    assert.equal(intervals.size, 1)
    media.end()
    assert.equal(intervals.size, 0)
})

test('reverb allocates on demand, reuses presets, and disconnects only after fading', t => {
    const { engine, context } = harness(t)
    assert.equal(context.buffersCreated, 0)
    assert.equal(context.streamsCreated, 0)
    assert.equal(context.panner.connections.has(context.convolver), false)
    engine.setSpaceMode('room')
    const roomImpulse = context.convolver.buffer
    assert.equal(context.buffersCreated, 1)
    assert.equal(context.panner.connections.has(context.convolver), true)
    engine.setSpaceMode('hall')
    engine.setSpaceMode('room')
    assert.equal(context.buffersCreated, 2)
    assert.equal(context.convolver.buffer, roomImpulse)
    engine.setSpaceMode('none')
    t.mock.timers.tick(3999)
    assert.equal(context.panner.connections.has(context.convolver), true)
    t.mock.timers.tick(1)
    assert.equal(context.panner.connections.has(context.convolver), false)
    engine.setSpaceMode('room')
    engine.setSpaceMode('none')
    t.mock.timers.tick(1000)
    engine.setSpaceMode('hall')
    t.mock.timers.tick(5000)
    assert.equal(context.panner.connections.has(context.convolver), true, 'a stale fade must not disconnect a newly selected effect')
    assert.equal(context.buffersCreated, 2)
})

test('capture preserves PCM format and cleans its branch without interrupting broadcast', t => {
    const { engine, context } = harness(t)
    const stream = engine.getAudioStream()
    assert.equal(engine.getAudioStream(), stream)
    assert.equal(context.streamsCreated, 1)
    let result: ArrayBuffer | undefined
    engine.startPcmCapture(chunk => { result = chunk })
    const capture = context.capture
    capture.onaudioprocess!({ inputBuffer: {
        length: 3,
        numberOfChannels: 1,
        getChannelData: () => new Float32Array([-2, 0, 2])
    } })
    assert.deepEqual([...new Int16Array(result!)], [-32768, -32768, 0, 0, 32767, 32767])
    engine.stopPcmCapture()
    assert.equal(capture.onaudioprocess, null)
    assert.equal(capture.connections.size, 0)
    assert.equal(context.compressor.connections.size, 2, 'local and broadcast output routes remain attached')
})

test('dispose releases pending fades, buffers, streams, capture, nodes and playback listeners', t => {
    const { engine, media, context, intervals } = harness(t)
    engine.getAudioStream()
    engine.setSpaceMode('hall')
    engine.setSpaceMode('none')
    engine.setCrowd(true)
    engine.setCrowd(false)
    engine.setCrowd(true)
    const allocatedBuffers = context.buffersCreated
    assert.equal(allocatedBuffers, 2, 'the crowd loop buffer is reused when toggled')
    engine.startPcmCapture(() => {})
    engine.toggle8D(true)
    media.play()
    engine.dispose()
    engine.dispose()
    assert.equal(context.state, 'closed')
    assert.equal(context.convolver.buffer, null)
    assert.equal(context.capture.onaudioprocess, null)
    assert.equal(intervals.size, 0)
    assert.ok(context.nodes.every(node => node.connections.size === 0))
    t.mock.timers.tick(10000)
    media.play()
    context.dispatchEvent(new Event('statechange'))
    assert.equal(intervals.size, 0)
})
