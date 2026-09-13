export class AudioEngine {
    private context: AudioContext
    private source: MediaElementAudioSourceNode | null = null
    private mediaElement: HTMLMediaElement | null = null

    
    private panner: PannerNode
    private distanceFilter: BiquadFilterNode
    private focusEQ: BiquadFilterNode
    private masterGain: GainNode
    private compressor: DynamicsCompressorNode 
    private crowdGain: GainNode
    private crowdSource: AudioBufferSourceNode | null = null
    private crowdFilter: BiquadFilterNode | null = null
    private crowdBuffer: AudioBuffer | null = null
    private crowdVoices = new Map<AudioBufferSourceNode, BiquadFilterNode>()
    private disposed = false

    
    private streamDestination: MediaStreamAudioDestinationNode | null = null
    private isLocalMuted: boolean = false
    private pcmCaptureNode: ScriptProcessorNode | null = null
    private pcmCaptureSink: GainNode | null = null

    
    private convolver: ConvolverNode
    private reverbGain: GainNode
    private dryGain: GainNode
    private impulseCache = new Map<string, AudioBuffer>()
    private reverbConnected = false
    private reverbDisconnectTimer: ReturnType<typeof setTimeout> | null = null

    
    private is8DEnabled: boolean = false
    private rotationAngle: number = 0
    private intervalId: number | null = null

    constructor() {
        this.context = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: 48000
        })

        
        this.panner = this.context.createPanner()
        this.panner.panningModel = 'HRTF'
        this.panner.distanceModel = 'inverse'
        this.panner.refDistance = 1
        this.panner.maxDistance = 20
        this.panner.rolloffFactor = 1
        this.panner.coneInnerAngle = 360

        
        this.focusEQ = this.context.createBiquadFilter()
        this.focusEQ.type = 'peaking'
        this.focusEQ.frequency.value = 2500
        this.focusEQ.Q.value = 1
        this.focusEQ.gain.value = 0

        
        this.distanceFilter = this.context.createBiquadFilter()
        this.distanceFilter.type = 'lowpass'
        this.distanceFilter.frequency.value = 20000 

        
        this.convolver = this.context.createConvolver()
        this.reverbGain = this.context.createGain()
        this.reverbGain.gain.value = 0 

        this.dryGain = this.context.createGain()
        this.dryGain.gain.value = 1

        
        this.masterGain = this.context.createGain()

        
        this.compressor = this.context.createDynamicsCompressor()
        
        this.compressor.threshold.value = 0
        this.compressor.knee.value = 40
        this.compressor.ratio.value = 1
        this.compressor.attack.value = 0
        this.compressor.release.value = 0.25

        
        this.crowdGain = this.context.createGain()
        this.crowdGain.gain.value = 0
        this.crowdGain.connect(this.masterGain) 

        

        
        
        
        

        
        this.panner.connect(this.focusEQ)
        this.focusEQ.connect(this.distanceFilter)
        this.distanceFilter.connect(this.dryGain)
        this.dryGain.connect(this.masterGain)

        
        this.convolver.connect(this.reverbGain)
        this.reverbGain.connect(this.masterGain)

        
        
        this.masterGain.connect(this.compressor)
        this.compressor.connect(this.context.destination)
        this.context.addEventListener('statechange', this.updateRotation)
    }

    private generateImpulse(duration: number, decay: number, preDelaySeconds: number = 0, lowPass: boolean = false) {
        const key = `${duration}:${decay}:${preDelaySeconds}:${lowPass}`
        const cached = this.impulseCache.get(key)
        if (cached) {
            if (this.convolver.buffer !== cached) this.convolver.buffer = cached
            return
        }
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
            
            const val = Math.pow(1 - realIndex / length, decay)

            let L = (Math.random() * 2 - 1) * val
            let R = (Math.random() * 2 - 1) * val

            
            if (lowPass && i > 1) {
                L = (L + left[i - 1] + left[i - 2]) / 3
                R = (R + right[i - 1] + right[i - 2]) / 3
            }

            left[i] = L
            right[i] = R
        }
        this.impulseCache.set(key, impulse)
        this.convolver.buffer = impulse
    }

    private setReverb(amount: number, timeConstant: number) {
        if (this.reverbDisconnectTimer !== null) {
            clearTimeout(this.reverbDisconnectTimer)
            this.reverbDisconnectTimer = null
        }
        if (amount > 0 && !this.reverbConnected) {
            this.panner.connect(this.convolver)
            this.reverbConnected = true
        }
        this.reverbGain.gain.setTargetAtTime(amount, this.context.currentTime, timeConstant)
        if (amount === 0 && this.reverbConnected) {
            // Preserve the fade before retiring the expensive convolution branch.
            this.reverbDisconnectTimer = setTimeout(() => {
                this.reverbGain.gain.setValueAtTime(0, this.context.currentTime)
                this.panner.disconnect(this.convolver)
                this.reverbConnected = false
                this.reverbDisconnectTimer = null
            }, timeConstant * 8000)
        }
    }

    connect(audioElement: HTMLMediaElement) {
        if (this.source) return
        this.resume()
        try {
            this.source = this.context.createMediaElementSource(audioElement)
            this.mediaElement = audioElement
            audioElement.addEventListener('play', this.updateRotation)
            audioElement.addEventListener('pause', this.updateRotation)
            audioElement.addEventListener('ended', this.updateRotation)
            
            this.source.connect(this.panner)
            this.updateRotation()
        } catch (e) {
            console.warn("Audio source connect error:", e)
        }
    }

    async resume() {
        if (this.disposed) return
        if (this.context.state === 'suspended') {
            await this.context.resume()
        }
    }

    setVolume(val: number) {
        this.masterGain.gain.setTargetAtTime(val, this.context.currentTime, 0.1)
    }

    

     
    setPosition(x: number, y: number, z: number) {
        
        const t = this.context.currentTime
        this.panner.positionX.setTargetAtTime(x, t, 0.1)
        this.panner.positionY.setTargetAtTime(y, t, 0.1)
        this.panner.positionZ.setTargetAtTime(z, t, 0.1)
    }

     
    setDistance(meters: number) {
        
        
        const minFreq = 2000
        const maxFreq = 22000
        
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
            case 'concert': 
                wetAmount = 0.5   
                duration = 3.0    
                decay = 3.0       
                preDelay = 0      
                lowPass = true    
                targetDry = 1.0   
                targetCutoff = 16000 
                break;
            case 'hall': 
                wetAmount = 0.4   
                duration = 3.0    
                decay = 3.0       
                preDelay = 0.06   
                lowPass = true
                targetDry = 1.0   
                targetCutoff = 19000 
                break;
            case 'room': 
                wetAmount = 0.45
                duration = 0.7    
                decay = 10.0      
                preDelay = 0.008  
                lowPass = true
                targetDry = 1.0
                targetCutoff = 3000 
                break;
            case 'driver': 
                wetAmount = 0.35  
                duration = 0.3    
                decay = 12.0      
                preDelay = 0.001  
                lowPass = true
                targetDry = 1.0   
                targetCutoff = 8000 
                break;
            case 'racing':
                wetAmount = 0.18
                duration = 0.45
                decay = 8.0
                preDelay = 0.004
                lowPass = true
                targetDry = 1.0
                targetCutoff = 12500
                break;
            case 'fps':
                wetAmount = 0.08
                duration = 0.22
                decay = 14.0
                preDelay = 0.002
                lowPass = true
                targetDry = 1.0
                targetCutoff = 15500
                break;
            case 'none':
            default:
                wetAmount = 0
                break;
        }

        
        if (wetAmount > 0) {
            this.generateImpulse(duration, decay, preDelay, lowPass)
        }

        this.setReverb(wetAmount, 0.5)

        
        this.dryGain.gain.setTargetAtTime(targetDry, t, 0.5)
        
        if (type !== 'none') {
            this.distanceFilter.frequency.setTargetAtTime(targetCutoff, t, 0.5)
        } else {
            this.distanceFilter.frequency.setTargetAtTime(20000, t, 0.5)
        }
    }

    setCrowd(enable: boolean) {
        if (enable) {
            if (this.crowdSource) return

            
            if (!this.crowdBuffer) {
                const rate = this.context.sampleRate
                const buf = this.context.createBuffer(2, rate * 5, rate)
                for (let c = 0; c < 2; c++) {
                    const data = buf.getChannelData(c)
                    let lastOut = 0
                    for (let i = 0; i < buf.length; i++) {
                        const white = Math.random() * 2 - 1
                        lastOut = (lastOut + white) / 2
                        data[i] = lastOut * 0.1
                    }
                }
                this.crowdBuffer = buf
            }

            this.crowdSource = this.context.createBufferSource()
            this.crowdSource.buffer = this.crowdBuffer
            this.crowdSource.loop = true

            
            const filter = this.context.createBiquadFilter()
            filter.type = 'lowpass'
            filter.frequency.value = 500
            this.crowdFilter = filter
            this.crowdVoices.set(this.crowdSource, filter)

            this.crowdSource.connect(filter)
            filter.connect(this.crowdGain)

            this.crowdSource.start()
            
            this.crowdGain.gain.setValueAtTime(0, this.context.currentTime)
            this.crowdGain.gain.linearRampToValueAtTime(0.15, this.context.currentTime + 2)
        } else {
            if (this.crowdSource) {
                
                this.crowdGain.gain.setTargetAtTime(0, this.context.currentTime, 0.5)
                const oldSource = this.crowdSource
                const oldFilter = this.crowdFilter
                this.crowdSource = null
                this.crowdFilter = null
                oldSource.onended = () => {
                    oldSource.disconnect()
                    oldFilter?.disconnect()
                    this.crowdVoices.delete(oldSource)
                    oldSource.onended = null
                }
                oldSource.stop(this.context.currentTime + 1)
            }
        }
    }

    setNormalization(enable: boolean) {
        const t = this.context.currentTime
        if (enable) {
            
            this.compressor.threshold.setTargetAtTime(-24, t, 0.1)
            this.compressor.knee.setTargetAtTime(30, t, 0.1)
            this.compressor.ratio.setTargetAtTime(12, t, 0.1)
            this.compressor.attack.setTargetAtTime(0.003, t, 0.1)
            this.compressor.release.setTargetAtTime(0.25, t, 0.1)
        } else {
            
            this.compressor.threshold.setTargetAtTime(0, t, 0.1)
            this.compressor.ratio.setTargetAtTime(1, t, 0.1)
        }
    }

    setFocusMode(enable: boolean) {
        const t = this.context.currentTime
        if (enable) {
            this.is8DEnabled = false
            this.stopRotation()

            
            this.setReverb(0, 0.2)
            
            this.setDistance(0.5)
            
            this.setPosition(0, 0, 0)
            
            this.focusEQ.gain.setTargetAtTime(5, t, 0.2)
            this.focusEQ.Q.value = 0.5
        } else {
            
            this.focusEQ.gain.setTargetAtTime(0, t, 0.2)
        }
    }

    
    toggle8D(enable: boolean) {
        if (this.is8DEnabled === enable) return
        this.is8DEnabled = enable
        if (enable) {
            this.updateRotation()
        } else {
            this.stopRotation()
            this.setPosition(0, 0, 0)
        }
    }

    private updateRotation = () => {
        if (this.is8DEnabled && this.mediaElement && !this.mediaElement.paused &&
            !this.mediaElement.ended && this.context.state === 'running') {
            this.startRotation()
        } else {
            this.stopRotation()
        }
    }

    private startRotation() {
        if (this.intervalId !== null) return
        let lastTime = performance.now()

        const loop = () => {
            if (!this.is8DEnabled) return
            const time = performance.now()
            const delta = (time - lastTime) / 1000
            lastTime = time

            this.rotationAngle += delta * 1.5
            const radius = 3
            const x = Math.sin(this.rotationAngle) * radius
            const z = Math.cos(this.rotationAngle) * radius * 0.5 

            
            this.panner.positionX.value = x
            this.panner.positionZ.value = z
        }
        this.intervalId = window.setInterval(loop, 16)
    }

    private stopRotation() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    }

    
    getAudioStream(): MediaStream {
        if (!this.streamDestination) {
            this.streamDestination = this.context.createMediaStreamDestination()
            this.compressor.connect(this.streamDestination)
        }
        return this.streamDestination.stream
    }

    startPcmCapture(onChunk: (chunk: ArrayBuffer) => void) {
        this.stopPcmCapture()

        // Discord raw resources expect interleaved signed 16-bit, 48 kHz stereo
        // PCM. Capturing here avoids segmented WebM/Opus demuxing stalls.
        const captureNode = this.context.createScriptProcessor(2048, 2, 2)
        const silentSink = this.context.createGain()
        silentSink.gain.value = 0

        captureNode.onaudioprocess = event => {
            const input = event.inputBuffer
            const frames = input.length
            const left = input.getChannelData(0)
            const right = input.numberOfChannels > 1 ? input.getChannelData(1) : left
            const pcm = new Int16Array(frames * 2)

            for (let i = 0; i < frames; i++) {
                const leftSample = Math.max(-1, Math.min(1, left[i]))
                const rightSample = Math.max(-1, Math.min(1, right[i]))
                pcm[i * 2] = leftSample < 0 ? leftSample * 0x8000 : leftSample * 0x7fff
                pcm[i * 2 + 1] = rightSample < 0 ? rightSample * 0x8000 : rightSample * 0x7fff
            }

            onChunk(pcm.buffer)
        }

        this.compressor.connect(captureNode)
        captureNode.connect(silentSink)
        silentSink.connect(this.context.destination)
        this.pcmCaptureNode = captureNode
        this.pcmCaptureSink = silentSink
        void this.resume()
    }

    stopPcmCapture() {
        if (this.pcmCaptureNode) {
            this.pcmCaptureNode.onaudioprocess = null
            try { this.compressor.disconnect(this.pcmCaptureNode) } catch (e) {
                // The capture graph may already be disconnected during teardown.
            }
            try { this.pcmCaptureNode.disconnect() } catch (e) {
                // The capture graph may already be disconnected during teardown.
            }
            this.pcmCaptureNode = null
        }
        if (this.pcmCaptureSink) {
            try { this.pcmCaptureSink.disconnect() } catch (e) {
                // The capture graph may already be disconnected during teardown.
            }
            this.pcmCaptureSink = null
        }
    }

    setLocalMute(muted: boolean) {
        if (this.isLocalMuted === muted) return
        this.isLocalMuted = muted

        if (muted) {
            try { this.compressor.disconnect(this.context.destination) } catch (e) { }
        } else {
            this.compressor.connect(this.context.destination)
        }
    }

    dispose() {
        if (this.disposed) return
        this.disposed = true
        this.stopRotation()
        if (this.reverbDisconnectTimer !== null) clearTimeout(this.reverbDisconnectTimer)
        this.reverbDisconnectTimer = null
        this.context.removeEventListener('statechange', this.updateRotation)
        this.mediaElement?.removeEventListener('play', this.updateRotation)
        this.mediaElement?.removeEventListener('pause', this.updateRotation)
        this.mediaElement?.removeEventListener('ended', this.updateRotation)
        this.stopPcmCapture()
        for (const [source, filter] of this.crowdVoices) {
            source.onended = null
            source.stop()
            source.disconnect()
            filter.disconnect()
        }
        this.crowdVoices.clear()
        this.crowdSource = null
        this.crowdFilter = null
        this.crowdBuffer = null
        this.impulseCache.clear()
        this.convolver.buffer = null
        this.source?.disconnect()
        this.source = null
        this.mediaElement = null
        for (const node of [this.panner, this.focusEQ, this.distanceFilter, this.dryGain,
            this.convolver, this.reverbGain, this.crowdGain, this.masterGain, this.compressor]) {
            node.disconnect()
        }
        if (this.streamDestination) {
            for (const track of this.streamDestination.stream.getTracks()) track.stop()
            this.streamDestination.disconnect()
            this.streamDestination = null
        }
        void this.context.close().catch(error => console.warn('Audio context cleanup failed:', error))
    }
}
