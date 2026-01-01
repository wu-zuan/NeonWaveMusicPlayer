export class AudioEngine {
    private context: AudioContext
    private source: MediaElementAudioSourceNode | null = null
    private panner: PannerNode
    private gain: GainNode
    private is8DEnabled: boolean = false
    private rotationAngle: number = 0
    private intervalId: number | null = null

    constructor() {
        this.context = new (window.AudioContext || (window as any).webkitAudioContext)()
        this.panner = this.context.createPanner()
        this.panner.panningModel = 'HRTF'
        this.panner.distanceModel = 'linear'
        this.panner.refDistance = 1
        this.panner.maxDistance = 10000
        this.panner.rolloffFactor = 1
        this.panner.coneInnerAngle = 360
        this.panner.coneOuterAngle = 0
        this.panner.coneOuterGain = 0

        this.gain = this.context.createGain()

        // Graph: Panner -> Gain -> Destination
        this.panner.connect(this.gain)
        this.gain.connect(this.context.destination)
    }

    connect(audioElement: HTMLAudioElement) {
        if (this.source) return

        // Ensure context is running
        this.resume()

        try {
            this.source = this.context.createMediaElementSource(audioElement)
            this.source.connect(this.panner)
        } catch (e) {
            console.warn("Audio source already connected or error:", e)
        }
    }

    async resume() {
        if (this.context.state === 'suspended') {
            await this.context.resume()
        }
    }

    setVolume(val: number) {
        // val 0.0 to 1.0
        this.gain.gain.value = val
    }

    toggle8D(enable: boolean) {
        this.is8DEnabled = enable
        if (enable) {
            this.startRotation()
        } else {
            this.stopRotation()
            // Reset position
            this.panner.positionX.setTargetAtTime(0, this.context.currentTime, 0.1)
            this.panner.positionZ.setTargetAtTime(0, this.context.currentTime, 0.1)
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

            // Rotate
            this.rotationAngle += delta * 1.5 // Speed factor (1.5 rad/s)

            // Circular motion around listener (0,0,0)
            const radius = 3
            const x = Math.sin(this.rotationAngle) * radius
            const z = Math.cos(this.rotationAngle) * radius

            // Update panner position
            // Using setTargetAtTime avoids zipper noise but direct assignment is usually fine for RAF/Interval if frequent
            // We use setTargetAtTime for smoother audio even if JS jitters
            this.panner.positionX.setTargetAtTime(x, this.context.currentTime, 0.02)
            this.panner.positionZ.setTargetAtTime(z, this.context.currentTime, 0.02)
        }

        // Run at approx 60fps (16ms)
        this.intervalId = window.setInterval(loop, 16)
    }

    private stopRotation() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    }
}
