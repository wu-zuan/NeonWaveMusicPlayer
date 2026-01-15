import { useState, useEffect, useRef, useCallback } from 'react'
import { AudioEngine } from '../utils/AudioEngine'

export interface Track {
    path: string
    title: string
    artist: string
    album?: string
    duration?: number
    artwork?: string
    codec?: string
    bitrate?: number
    sampleRate?: number
}

type RepeatMode = 'none' | 'all' | 'one'

export function useAudioPlayer() {
    // State
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [is8D, setIs8D] = useState(false)

    // Playlist & Ordering
    const [playlist, setPlaylist] = useState<Track[]>([])
    const [isShuffle, setIsShuffle] = useState(false)
    const [repeatMode, setRepeatMode] = useState<RepeatMode>('none')
    const [history, setHistory] = useState<Track[]>([])

    // Refs
    const audioRef = useRef<HTMLAudioElement>(new Audio())
    const engineRef = useRef<AudioEngine | null>(null)

    // Helper to get random index
    const getRandomIndex = (max: number) => Math.floor(Math.random() * max)


    // Effects for Audio Engine
    useEffect(() => { engineRef.current?.toggle8D(is8D) }, [is8D])
    useEffect(() => {
        if (engineRef.current) engineRef.current.setVolume(volume)
        else audioRef.current.volume = volume
    }, [volume])

    // Main Play Logic
    const playTrack = async (track: Track, newPlaylist?: Track[]) => {
        const audio = audioRef.current

        if (newPlaylist) {
            setPlaylist(newPlaylist)
        }

        // Handle special characters in file path (e.g. #, ?, %) which break file:// URLs
        // We split by / or \ to encode each segment individually
        const encodedPath = track.path.split(/[\\/]/).map(encodeURIComponent).join('/')
        const fileUrl = `file:///${encodedPath}`

        if (currentTrack?.path !== track.path) {
            // Add to history if it's different
            if (currentTrack) setHistory(prev => [...prev, currentTrack])

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

    // Navigation Logic
    const handleNext = useCallback((autoTrigger = false) => {
        if (!currentTrack || playlist.length === 0) return

        let nextTrack: Track

        if (repeatMode === 'one' && autoTrigger) {
            // If repeating one and it ended naturally, replay same track
            nextTrack = currentTrack
            audioRef.current.currentTime = 0
            audioRef.current.play()
            return
        }

        if (isShuffle) {
            // Simple random pick for now
            const idx = getRandomIndex(playlist.length)
            nextTrack = playlist[idx]
            // Avoid repeating same track in shuffle if possible, unless only 1 track
            if (nextTrack.path === currentTrack.path && playlist.length > 1) {
                handleNext(autoTrigger) // try again
                return
            }
        } else {
            // Sequential
            const idx = playlist.findIndex(t => t.path === currentTrack.path)
            const nextIdx = (idx + 1)

            if (nextIdx >= playlist.length) {
                // End of playlist
                if (repeatMode === 'all') {
                    nextTrack = playlist[0]
                } else {
                    // Stop playing
                    return
                }
            } else {
                nextTrack = playlist[nextIdx]
            }
        }

        playTrack(nextTrack)
    }, [currentTrack, playlist, isShuffle, repeatMode])

    const handlePrev = useCallback(() => {
        if (audioRef.current.currentTime > 3) {
            // Restart current song
            audioRef.current.currentTime = 0
            return
        }

        if (history.length > 0) {
            const prev = history[history.length - 1]
            setHistory(h => h.slice(0, -1)) // Pop
            playTrack(prev)
            return
        }

        // If no history, just go previous in list or restart
        if (!currentTrack || playlist.length === 0) return

        const idx = playlist.findIndex(t => t.path === currentTrack.path)
        const prevIdx = (idx - 1 + playlist.length) % playlist.length
        playTrack(playlist[prevIdx])


    }, [currentTrack, playlist, history])

    // Audio Engine Init
    useEffect(() => {
        engineRef.current = new AudioEngine()
        const audio = audioRef.current
        audio.crossOrigin = "anonymous"
        try { engineRef.current.connect(audio) } catch (e) {
            console.warn("Connection error", e)
        }
        // Cleanup? AudioContext might need close, but usually fine for singleton app.
    }, [])

    // Event Listeners
    useEffect(() => {
        const audio = audioRef.current
        const onTimeUpdate = () => setCurrentTime(audio.currentTime)
        const onDurationChange = () => setDuration(audio.duration)
        const onEnded = () => handleNext(true)
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
        }
    }, [handleNext])

    // Media Session API Integration (System Media Controls)
    useEffect(() => {
        if (!('mediaSession' in navigator)) return

        // 1. Update Metadata
        if (currentTrack) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentTrack.title,
                artist: currentTrack.artist,
                album: currentTrack.album || 'NeonWave Music',
                artwork: [
                    // Use embedded artwork if available, otherwise placeholder
                    { src: currentTrack.artwork || 'logo.png', sizes: '512x512', type: 'image/png' }
                ]
            })
        }

        // 2. Action Handlers
        navigator.mediaSession.setActionHandler('play', () => {
            audioRef.current.play()
        })
        navigator.mediaSession.setActionHandler('pause', () => {
            audioRef.current.pause()
        })
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            handlePrev() // This needs to be stable or ref-based to avoid stale closures if effect re-runs rarely
        })
        navigator.mediaSession.setActionHandler('nexttrack', () => {
            handleNext()
        })
        navigator.mediaSession.setActionHandler('seekto', (details) => {
            if (details.seekTime && duration) {
                audioRef.current.currentTime = details.seekTime
                setCurrentTime(details.seekTime)
            }
        })

    }, [currentTrack, handlePrev, handleNext, duration]) // dependencies ensure handlers use latest state wrappers


    const togglePlay = () => isPlaying ? audioRef.current.pause() : audioRef.current.play()
    const seek = (time: number) => { audioRef.current.currentTime = time; setCurrentTime(time) }

    return {
        isPlaying,
        currentTrack,
        currentTime,
        duration,
        volume,
        is8D,
        isShuffle,
        repeatMode,
        playlist,
        playTrack,
        togglePlay,
        setVolume,
        setIs8D,
        toggleShuffle: () => setIsShuffle(!isShuffle),
        toggleRepeat: () => setRepeatMode(m => m === 'none' ? 'all' : m === 'all' ? 'one' : 'none'),
        seek,
        handleNext: () => handleNext(false),
        handlePrev: () => handlePrev(),
        // Advanced Audio Controls
        setDistance: (meters: number) => engineRef.current?.setDistance(meters),
        setSpaceMode: (mode: string) => engineRef.current?.setSpaceMode(mode),
        setPosition: (x: number, y: number, z: number) => {
            setIs8D(false)
            engineRef.current?.setPosition(x, y, z)
        },
        setFocusMode: (enable: boolean) => engineRef.current?.setFocusMode(enable),
        setNormalization: (enable: boolean) => engineRef.current?.setNormalization(enable),
        setCrowd: (enable: boolean) => engineRef.current?.setCrowd(enable)
    }
}