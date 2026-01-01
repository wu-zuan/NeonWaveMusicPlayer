export class AudioEngine {
    private context: AudioContext
    private source: MediaElementAudioSourceNode | null = null

    // Nodes
    private panner: PannerNode
    private distanceFilter: BiquadFilterNode
    private focusEQ: BiquadFilterNode
    private masterGain: GainNode
    private compressor: DynamicsCompressorNode // Volume Normalization
    private crowdGain: GainNode
    private crowdSource: AudioBufferSourceNode | null = null

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

        // 5. Normalizer (Compressor)
        this.compressor = this.context.createDynamicsCompressor()
        // Default DISABLED settings
        this.compressor.threshold.value = 0
        this.compressor.knee.value = 40
        this.compressor.ratio.value = 1
        this.compressor.attack.value = 0
        this.compressor.release.value = 0.25

        // 6. Crowd Ambience (Virtual Audience)
        this.crowdGain = this.context.createGain()
        this.crowdGain.gain.value = 0
        this.crowdGain.connect(this.masterGain) // Bypass Panner/Reverb (Ambient)

        // Graph Construction
        // Path A (Dry/Direct): Source -> Panner -> FocusEQ -> DistanceFilter -> DryGain -> Master
        // Path B (Wet/Reflect): Source -> Panner -> Convolver -> ReverbGain -> Master
        // Output: Master -> Compressor -> Destination

        // Connect Dry Path
        this.panner.connect(this.focusEQ)
        this.focusEQ.connect(this.distanceFilter)
        this.distanceFilter.connect(this.dryGain)
        this.dryGain.connect(this.masterGain)

        // Connect Wet Path (Now fed by Panner for Spatial Reverb)
        this.panner.connect(this.convolver)
        this.convolver.connect(this.reverbGain)
        this.reverbGain.connect(this.masterGain)

        // Master -> Compressor -> Out
        this.masterGain.connect(this.compressor)
        this.compressor.connect(this.context.destination)

        // Generate a basic impulse response for testing space
        this.generateImpulse(2, 3)
    }

    private generateImpulse(duration: number, decay: number, preDelaySeconds: number = 0, lowPass: boolean = false) {
        const rate = this.context.sampleRate
        const length = rate * duration
        const preDelaySamples = Math.floor(rate * preDelaySeconds)
        const totalLength = length + preDelaySamples

        const impulse = this.context.createBuffer(2, totalLength, rate)
        const left = impulse.getChannelData(0)
        const right = impulse.getChannelData(1)

        for (let i = 0; i < totalLength; i++) {
            if (i < preDelaySamples) {
                left[i] = 0; right[i] = 0;
                continue;
            }
            const realIndex = i - preDelaySamples
            // Exponential decay usually sounds better than linear power for reverb
            const val = Math.pow(1 - realIndex / length, decay)

            let L = (Math.random() * 2 - 1) * val
            let R = (Math.random() * 2 - 1) * val

            // Stronger LowPass (Warmth) to kill the "hash"
            if (lowPass && i > 1) {
                L = (L + left[i - 1] + left[i - 2]) / 3
                R = (R + right[i - 1] + right[i - 2]) / 3
            }

            left[i] = L
            right[i] = R
        }
        this.convolver.buffer = impulse
    }

    connect(audioElement: HTMLAudioElement) {
        if (this.source) return
        this.resume()
        try {
            this.source = this.context.createMediaElementSource(audioElement)
            // Connect to Panner (Direct) - Reverb is now chained after Panner
            this.source.connect(this.panner)
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

    setSpaceMode(type: string) {
        const t = this.context.currentTime
        let wetAmount = 0
        let duration = 0.1
        let decay = 1
        let preDelay = 0
        let lowPass = false

        let targetDry = 1
        let targetCutoff = 20000

        switch (type) {
            case 'concert': // Stadium / Live
                wetAmount = 0.5   // Balanced Ambience
                duration = 3.0    // Standard Tail
                decay = 3.0       // Natural Decay
                preDelay = 0      // No pre-delay to prevent vocal phasing/doubling
                lowPass = true    // Warm air absorption
                targetDry = 1.0   // Full Dry Signal (Fixes "weird" vocals)
                targetCutoff = 16000 // High Fidelity
                break;
            case 'hall':
                wetAmount = 0.4
                duration = 2.0
                decay = 3.0
                preDelay = 0.02
                lowPass = true
                targetCutoff = 16000
                break;
            case 'room': // Real Bedroom (Tight & Damp)
                wetAmount = 0.45
                duration = 0.7    // Very short tail
                decay = 10.0      // Fast decay
                preDelay = 0.008  // 8ms (Walls are close)
                lowPass = true
                targetDry = 1.0
                targetCutoff = 3000 // Furniture absorbs highs heavily
                break;
            case 'driver':
                wetAmount = 0.1
                duration = 0.1
                decay = 10.0
                break;
            case 'none':
            default:
                wetAmount = 0
                break;
        }

        // Regenerate IR if not none
        if (type !== 'none') {
            this.generateImpulse(duration, decay, preDelay, lowPass)
        }

        this.reverbGain.gain.setTargetAtTime(wetAmount, t, 0.5)

        // Adjust Dry & Cutoff for immersion
        this.dryGain.gain.setTargetAtTime(targetDry, t, 0.5)
        // Only adjust cutoff if we are tweaking for mode, otherwise let distance slider handle it
        if (type !== 'none') {
            this.distanceFilter.frequency.setTargetAtTime(targetCutoff, t, 0.5)
        } else {
            this.distanceFilter.frequency.setTargetAtTime(20000, t, 0.5)
        }
    }

    setCrowd(enable: boolean) {
        if (enable) {
            if (this.crowdSource) return

            // 5s buffer Loop suitable for crowd ambience (Pink Noise-ish)
            const rate = this.context.sampleRate
            const buf = this.context.createBuffer(2, rate * 5, rate)
            for (let c = 0; c < 2; c++) {
                const data = buf.getChannelData(c)
                let lastOut = 0;
                for (let i = 0; i < buf.length; i++) {
                    const white = Math.random() * 2 - 1
                    // Simple lowpass to make it less harsh (pink-ish)
                    lastOut = (lastOut + white) / 2
                    data[i] = lastOut * 0.1
                }
            }

            this.crowdSource = this.context.createBufferSource()
            this.crowdSource.buffer = buf
            this.crowdSource.loop = true

            // Filter to shape it into "distant crowd roar"
            const filter = this.context.createBiquadFilter()
            filter.type = 'lowpass'
            filter.frequency.value = 500

            this.crowdSource.connect(filter)
            filter.connect(this.crowdGain)

            this.crowdSource.start()
            // Fade In
            this.crowdGain.gain.setValueAtTime(0, this.context.currentTime)
            this.crowdGain.gain.linearRampToValueAtTime(0.15, this.context.currentTime + 2)
        } else {
            if (this.crowdSource) {
                // Fade Out
                this.crowdGain.gain.setTargetAtTime(0, this.context.currentTime, 0.5)
                const oldSource = this.crowdSource
                this.crowdSource = null
                setTimeout(() => {
                    oldSource.stop()
                    oldSource.disconnect()
                }, 1000)
            }
        }
    }

    setNormalization(enable: boolean) {
        const t = this.context.currentTime
        if (enable) {
            // "Mastering" Style Compression
            this.compressor.threshold.setTargetAtTime(-24, t, 0.1)
            this.compressor.knee.setTargetAtTime(30, t, 0.1)
            this.compressor.ratio.setTargetAtTime(12, t, 0.1)
            this.compressor.attack.setTargetAtTime(0.003, t, 0.1)
            this.compressor.release.setTargetAtTime(0.25, t, 0.1)
        } else {
            // Disable (Pass-through)
            this.compressor.threshold.setTargetAtTime(0, t, 0.1)
            this.compressor.ratio.setTargetAtTime(1, t, 0.1)
        }
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
