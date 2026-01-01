export class AudioEngine {
    private context: AudioContext
    private source: MediaElementAudioSourceNode | null = null

    // Nodes
    private panner: PannerNode
    private distanceFilter: BiquadFilterNode
    private focusEQ: BiquadFilterNode
    private masterGain: GainNode

    // Reverb (Spatial)
    private convolver: ConvolverNode
    private reverbGain: GainNode
    private dryGain: GainNode

    // State
    private is8DEnabled: boolean = false
    private rotationAngle: number = 0
    private intervalId: number | null = null

    constructor() {
        this.context = new (window.AudioContext || (window as any).webkitAudioContext)()

        // 1. Panner (Positioning)
        this.panner = this.context.createPanner()
        this.panner.panningModel = 'HRTF'
        this.panner.distanceModel = 'inverse'
        this.panner.refDistance = 1
        this.panner.maxDistance = 20
        this.panner.rolloffFactor = 1
        this.panner.coneInnerAngle = 360

        // 2a. Focus EQ (Clarity Boost)
        this.focusEQ = this.context.createBiquadFilter()
        this.focusEQ.type = 'peaking'
        this.focusEQ.frequency.value = 2500
        this.focusEQ.Q.value = 1
        this.focusEQ.gain.value = 0

        // 2b. Distance Filter (Air Absorption)
        this.distanceFilter = this.context.createBiquadFilter()
        this.distanceFilter.type = 'lowpass'
        this.distanceFilter.frequency.value = 20000 // Full bandwidth initially

        // 3. Reverb (Space)
        this.convolver = this.context.createConvolver()
        this.reverbGain = this.context.createGain()
        this.reverbGain.gain.value = 0 // Off by default

        this.dryGain = this.context.createGain()
        this.dryGain.gain.value = 1

        // 4. Master
        this.masterGain = this.context.createGain()

        // Graph Construction
        // Path A (Dry/Direct): Source -> Panner -> FocusEQ -> DistanceFilter -> DryGain -> Master
        // Path B (Wet/Reflect): Source -> Convolver -> ReverbGain -> Master

        // Note: We connect source in .connect()

        // Connect Dry Path
        this.panner.connect(this.focusEQ)
        this.focusEQ.connect(this.distanceFilter)
        this.distanceFilter.connect(this.dryGain)
        this.dryGain.connect(this.masterGain)

        // Connect Wet Path
        this.convolver.connect(this.reverbGain)
        this.reverbGain.connect(this.masterGain)

        // Master -> Out
        this.masterGain.connect(this.context.destination)

        // Generate a basic impulse response for testing space
        this.generateSimpleImpulse()
    }

    private generateSimpleImpulse() {
        // Simple synthetic reverb IR
        const duration = 2
        const rate = this.context.sampleRate
        const length = rate * duration
        const impulse = this.context.createBuffer(2, length, rate)
        const left = impulse.getChannelData(0)
        const right = impulse.getChannelData(1)

        for (let i = 0; i < length; i++) {
            const decay = Math.pow(1 - i / length, 3)
            left[i] = (Math.random() * 2 - 1) * decay
            right[i] = (Math.random() * 2 - 1) * decay
        }
        this.convolver.buffer = impulse
    }

    connect(audioElement: HTMLAudioElement) {
        if (this.source) return
        this.resume()
        try {
            this.source = this.context.createMediaElementSource(audioElement)
            // Connect to Panner (Direct)
            this.source.connect(this.panner)
            // Connect to Convolver (Ambient/Space)
            this.source.connect(this.convolver)
        } catch (e) {
            console.warn("Audio source connect error:", e)
        }
    }

    async resume() {
        if (this.context.state === 'suspended') {
            await this.context.resume()
        }
    }

    setVolume(val: number) {
        this.masterGain.gain.setTargetAtTime(val, this.context.currentTime, 0.1)
    }

    // --- Spatial Control ---

    /**
     * Set explicit 3D position
     * @param x Left/Right (-10 to 10)
     * @param y Up/Down (-10 to 10)
     * @param z Front/Back (-10 to 10), negative is close/behind, positive is far? 
     * WebAudio coord: Right: +x, Up: +y, Out of screen: +z.
     * Usually z negative is into screen.
     */
    setPosition(x: number, y: number, z: number) {
        // Smooth transition
        const t = this.context.currentTime
        this.panner.positionX.setTargetAtTime(x, t, 0.1)
        this.panner.positionY.setTargetAtTime(y, t, 0.1)
        this.panner.positionZ.setTargetAtTime(z, t, 0.1)
    }

    /**
     * Simulate distance
     * @param meters 0 to 10
     */
    setDistance(meters: number) {
        // 1. Roll off high frequencies (Air absorption)
        // At 0m -> 20kHz, at 10m -> 2kHz?
        const minFreq = 2000
        const maxFreq = 22000
        // Simple linear map for now. 0 -> max, 10 -> min
        const freq = maxFreq - (Math.min(meters, 10) / 10) * (maxFreq - minFreq)

        this.distanceFilter.frequency.setTargetAtTime(freq, this.context.currentTime, 0.2)
    }

    /**
     * Set Space/Reverb Type
     * @param type 'none' | 'room' | 'hall' | 'driver'
     */
    setSpaceMode(type: string) {
        let wetAmount = 0
        switch (type) {
            case 'room': wetAmount = 0.3; break;
            case 'hall': wetAmount = 0.6; break;
            case 'driver': wetAmount = 0.1; break; // Tight reflection
            case 'none': default: wetAmount = 0; break;
        }

        this.reverbGain.gain.setTargetAtTime(wetAmount, this.context.currentTime, 0.5)

        // In real impl, we would swap Convolver buffer here for different impulse responses.
    }

    setFocusMode(enable: boolean) {
        const t = this.context.currentTime
        if (enable) {
            this.is8DEnabled = false
            this.stopRotation()

            // Cut Reverb
            this.reverbGain.gain.setTargetAtTime(0, t, 0.2)
            // Close Distance
            this.setDistance(0.5)
            // Center Position
            this.setPosition(0, 0, 0)
            // EQ Boost (Clarity at 2.5kHz)
            this.focusEQ.gain.setTargetAtTime(5, t, 0.2)
            this.focusEQ.Q.value = 0.5
        } else {
            // Reset EQ only
            this.focusEQ.gain.setTargetAtTime(0, t, 0.2)
        }
    }

    // --- Legacy 8D (now uses setPosition) ---
    toggle8D(enable: boolean) {
        this.is8DEnabled = enable
        if (enable) {
            this.startRotation()
        } else {
            this.stopRotation()
            this.setPosition(0, 0, 0)
        }
    }

    private startRotation() {
        if (this.intervalId) clearInterval(this.intervalId)
        let lastTime = performance.now()

        const loop = () => {
            if (!this.is8DEnabled) return
            const time = performance.now()
            const delta = (time - lastTime) / 1000
            lastTime = time

            this.rotationAngle += delta * 1.5
            const radius = 3
            const x = Math.sin(this.rotationAngle) * radius
            const z = Math.cos(this.rotationAngle) * radius * 0.5 // Ellipse

            // Update Panner directly
            this.panner.positionX.setTargetAtTime(x, this.context.currentTime, 0.05)
            this.panner.positionZ.setTargetAtTime(z, this.context.currentTime, 0.05)
        }
        this.intervalId = window.setInterval(loop, 16)
    }

    private stopRotation() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    }
}
