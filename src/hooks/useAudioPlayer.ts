import { useState, useEffect, useRef } from 'react'
import { AudioEngine } from '../utils/AudioEngine'

export interface Track {
    path: string
    title: string
    artist: string
    album?: string
    duration?: number
}

export function useAudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [is8D, setIs8D] = useState(false)

    // Use a ref for the audio element to persist across renders
    const audioRef = useRef<HTMLAudioElement>(new Audio())
    const engineRef = useRef<AudioEngine | null>(null)

    useEffect(() => {
        // Initialize Audio Engine
        engineRef.current = new AudioEngine()

        const audio = audioRef.current
        audio.crossOrigin = "anonymous"

        // Connect audio element to Web Audio API
        // Must be done after user interaction usually, but let's try init
        try {
            engineRef.current.connect(audio)
        } catch (e) {
            console.warn("Autoplay policy might prevent instant connection", e)
        }

        const onTimeUpdate = () => setCurrentTime(audio.currentTime)
        const onDurationChange = () => setDuration(audio.duration)
        const onEnded = () => {
            setIsPlaying(false)
            // Emit event or callback for next track?
        }
        const onPlay = () => setIsPlaying(true)
        const onPause = () => setIsPlaying(false)

        audio.addEventListener('timeupdate', onTimeUpdate)
        audio.addEventListener('durationchange', onDurationChange)
        audio.addEventListener('ended', onEnded)
        audio.addEventListener('play', onPlay)
        audio.addEventListener('pause', onPause)

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate)
            audio.removeEventListener('durationchange', onDurationChange)
            audio.removeEventListener('ended', onEnded)
            audio.removeEventListener('play', onPlay)
            audio.removeEventListener('pause', onPause)
            audio.pause()
        }
    }, [])

    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.toggle8D(is8D)
        }
    }, [is8D])

    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.setVolume(volume)
        } else {
            audioRef.current.volume = volume // Fallback
        }
    }, [volume])

    const playTrack = async (track: Track) => {
        const audio = audioRef.current

        // In Electron, to load local files, usage of 'file://' or 'media://' is required.
        // Ideally we register a protocol in main process.
        // For now assuming we can use 'file://' + path
        // But we need to handle special chars.
        const fileUrl = `file://${track.path}` // Basic approach

        if (currentTrack?.path !== track.path) {
            audio.src = fileUrl
            setCurrentTrack(track)
            audio.load()
        }

        try {
            await engineRef.current?.resume()
            await audio.play()
        } catch (e) {
            console.error("Playback failed:", e)
        }
    }

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            engineRef.current?.resume()
            audioRef.current.play()
        }
    }

    const seek = (time: number) => {
        audioRef.current.currentTime = time
        setCurrentTime(time)
    }

    return {
        isPlaying,
        currentTrack,
        currentTime,
        duration,
        volume,
        is8D,
        playTrack,
        togglePlay,
        setVolume,
        setIs8D,
        seek
    }
}
