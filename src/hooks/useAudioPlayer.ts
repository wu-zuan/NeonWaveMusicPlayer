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
    // State
    // State - Initialized from localStorage where applicable
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    // Settings Persistence
    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem('nw_volume')
        return saved ? parseFloat(saved) : 1
    })
    const [isMuted, setIsMuted] = useState(() => localStorage.getItem('nw_muted') === 'true')
    const [is8D, setIs8D] = useState(() => localStorage.getItem('nw_8d') === 'true')
    const [defaultArtwork, setDefaultArtwork] = useState('')

    // Playlist & Ordering
    const [playlist, setPlaylist] = useState<Track[]>([])
    const [shuffledQueue, setShuffledQueue] = useState<Track[]>([]) // Internal shuffled list
    const [isShuffle, setIsShuffle] = useState(() => localStorage.getItem('nw_shuffle') === 'true')
    const [repeatMode, setRepeatMode] = useState<RepeatMode>(() => {
        return (localStorage.getItem('nw_repeat') as RepeatMode) || 'none'
    })
    const [history, setHistory] = useState<Track[]>([])

    // Refs
    const audioRef = useRef<HTMLAudioElement>(new Audio())
    const engineRef = useRef<AudioEngine | null>(null)



    // Load Default Logo as Data URI (Workaround for ASAR/Windows SMTC)
    useEffect(() => {
        fetch('logo.png')
            .then(res => res.blob())
            .then(blob => {
                const reader = new FileReader()
                reader.onloadend = () => setDefaultArtwork(reader.result as string)
                reader.readAsDataURL(blob)
            })
            .catch(err => console.error("Failed to load logo", err))
    }, [])


    // Effects for Audio Engine
    // Effects for Audio Engine
    useEffect(() => { engineRef.current?.toggle8D(is8D) }, [is8D])
    useEffect(() => {
        const effectiveVolume = isMuted ? 0 : volume
        if (engineRef.current) engineRef.current.setVolume(effectiveVolume)
        else audioRef.current.volume = effectiveVolume
    }, [volume, isMuted])

    // Save Settings to LocalStorage
    useEffect(() => { localStorage.setItem('nw_volume', volume.toString()) }, [volume])
    useEffect(() => { localStorage.setItem('nw_muted', String(isMuted)) }, [isMuted])
    useEffect(() => { localStorage.setItem('nw_8d', String(is8D)) }, [is8D])
    useEffect(() => { localStorage.setItem('nw_shuffle', String(isShuffle)) }, [isShuffle])
    useEffect(() => { localStorage.setItem('nw_repeat', repeatMode) }, [repeatMode])

    // Generate Shuffle Queue
    useEffect(() => {
        if (isShuffle && playlist.length > 0) {
            // Fisher-Yates Shuffle
            const sh = [...playlist]
            for (let i = sh.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [sh[i], sh[j]] = [sh[j], sh[i]];
            }
            setShuffledQueue(sh)
        } else {
            setShuffledQueue([])
        }
    }, [isShuffle, playlist])

    // Main Play Logic
    const playTrack = async (originalTrack: Track, newPlaylist?: Track[]) => {
        const audio = audioRef.current

        if (newPlaylist) {
            setPlaylist(newPlaylist)
        }

        // Clone track to avoid mutating the playlist object
        const trackToPlay = { ...originalTrack }

        // Always attempt to load artwork if missing, ensuring UI has it even on replay
        if (!trackToPlay.artwork) {
            try {
                const art = await window.ipcRenderer.getAudioArtwork(trackToPlay.path)
                if (art) trackToPlay.artwork = art
            } catch (e) {
                console.warn("Failed to load artwork lazily", e)
            }
        }

        // Handle dynamic streaming for shared playlists
        let finalUrl = ''
        if (trackToPlay.path.startsWith('shared:')) {
            try {
                const query = trackToPlay.path.replace('shared:', '')
                const results = await window.ipcRenderer.searchYouTube(query)
                if (results && results.length > 0) {
                    const streamInfo = await window.ipcRenderer.getYouTubePreview(results[0].url)
                    if (streamInfo && streamInfo.url) {
                        finalUrl = streamInfo.url
                    } else throw new Error("No stream URL")
                } else throw new Error("Not found on YouTube")
            } catch (e) {
                console.error("Failed to resolve shared track:", e)
                // Might want to automatically skip to next track here.
                return
            }
        } else {
            const encodedPath = trackToPlay.path.split(/[\\/]/).map(encodeURIComponent).join('/')
            finalUrl = `file:///${encodedPath}`
        }

        // If switching tracks
        if (currentTrack?.path !== trackToPlay.path) {

            // Force pause before switching
            if (!audio.paused) {
                try { audio.pause() } catch (e) { }
            }
            audio.currentTime = 0

            // Add to history if it's different and we have a current track
            if (currentTrack) {
                setHistory(prev => {
                    // Optimized: Strip artwork from history to save memory
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { artwork, ...lightweightTrack } = currentTrack
                    const newHistory = [...prev, lightweightTrack]
                    if (newHistory.length > 50) return newHistory.slice(-50)
                    return newHistory
                })
            }

            audio.src = finalUrl
            setCurrentTrack(trackToPlay)
            audio.load()
        } else {
            // Same track: If we just loaded artwork (and it wasn't there before), update state
            if (trackToPlay.artwork && !currentTrack?.artwork) {
                setCurrentTrack(prev => prev ? ({ ...prev, artwork: trackToPlay.artwork }) : trackToPlay)
            }
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

        // Determine active list (Shuffle Queue or Normal Playlist)
        const activeList = isShuffle ? shuffledQueue : playlist

        // Find current position in the active list
        let currentIdx = activeList.findIndex(t => t.path === currentTrack.path)

        // Fallback: If not found (shouldn't happen), start from 0
        if (currentIdx === -1) currentIdx = -1

        let nextIdx = currentIdx + 1

        if (nextIdx >= activeList.length) {
            // End of list reached
            if (repeatMode === 'all') {
                nextIdx = 0
                // Note: If we wanted to re-shuffle on every loop, we'd do it here. 
                // For now, looping the same shuffled order is standard behavior.
            } else {
                // Stop playing if no repeat
                return
            }
        }

        nextTrack = activeList[nextIdx]

        // Play without replacing the playlist (keep current playlist/context)
        playTrack(nextTrack)
    }, [currentTrack, playlist, shuffledQueue, isShuffle, repeatMode])

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

        // If no history, navigate backwards in current list
        if (!currentTrack || playlist.length === 0) return

        const activeList = isShuffle ? shuffledQueue : playlist
        const idx = activeList.findIndex(t => t.path === currentTrack.path)

        // Wrap around logic
        const prevIdx = (idx - 1 + activeList.length) % activeList.length
        playTrack(activeList[prevIdx])

    }, [currentTrack, playlist, shuffledQueue, isShuffle, history])

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
                    { src: currentTrack.artwork || defaultArtwork, sizes: '512x512', type: 'image/png' }
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

    }, [currentTrack, handlePrev, handleNext, duration, defaultArtwork]) // dependencies ensure handlers use latest state wrappers


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
        setCrowd: (enable: boolean) => engineRef.current?.setCrowd(enable),
        isMuted,
        setIsMuted,
        getAudioStream: () => engineRef.current?.getAudioStream(),
        setLocalMute: (muted: boolean) => engineRef.current?.setLocalMute(muted)
    }
}