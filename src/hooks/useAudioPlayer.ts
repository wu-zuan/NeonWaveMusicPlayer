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

// Module-level singletons — survive Vite HMR hot reloads.
// An HTMLAudioElement can only be connected to ONE AudioContext ever;
// re-creating them on each hot reload would throw DOMException.
let _sharedAudio: HTMLAudioElement | null = null
let _sharedEngine: AudioEngine | null = null

function getSharedAudio(): HTMLAudioElement {
    if (!_sharedAudio) _sharedAudio = new Audio()
    return _sharedAudio
}

function getSharedEngine(audio: HTMLAudioElement): AudioEngine {
    if (!_sharedEngine) {
        _sharedEngine = new AudioEngine()
        _sharedEngine.connect(audio)
    }
    return _sharedEngine
}

export function useAudioPlayer(contextMode?: string) {
    
    
    
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    
    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem('nw_volume')
        return saved ? parseFloat(saved) : 1
    })
    const [isMuted, setIsMuted] = useState(() => localStorage.getItem('nw_muted') === 'true')
    const [is8D, setIs8D] = useState(() => localStorage.getItem('nw_8d') === 'true')
    const [defaultArtwork, setDefaultArtwork] = useState('')

    
    const [playlist, setPlaylist] = useState<Track[]>([])
    const [shuffledQueue, setShuffledQueue] = useState<Track[]>([]) 
    const [isShuffle, setIsShuffle] = useState(() => localStorage.getItem('nw_shuffle') === 'true')
    const [repeatMode, setRepeatMode] = useState<RepeatMode>(() => {
        return (localStorage.getItem('nw_repeat') as RepeatMode) || 'none'
    })
    const [history, setHistory] = useState<Track[]>([])

    // Use module-level singletons to avoid re-connection crashes on HMR
    const audioRef = useRef<HTMLAudioElement>(getSharedAudio())
    const engineRef = useRef<AudioEngine | null>(_sharedEngine)

    
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

    
    
    useEffect(() => { engineRef.current?.toggle8D(is8D) }, [is8D])
    useEffect(() => {
        const effectiveVolume = isMuted ? 0 : volume
        if (engineRef.current) engineRef.current.setVolume(effectiveVolume)
        else audioRef.current.volume = effectiveVolume
    }, [volume, isMuted])

    
    useEffect(() => { localStorage.setItem('nw_volume', volume.toString()) }, [volume])
    useEffect(() => { localStorage.setItem('nw_muted', String(isMuted)) }, [isMuted])
    useEffect(() => { localStorage.setItem('nw_8d', String(is8D)) }, [is8D])
    useEffect(() => { localStorage.setItem('nw_shuffle', String(isShuffle)) }, [isShuffle])
    useEffect(() => { localStorage.setItem('nw_repeat', repeatMode) }, [repeatMode])

    
    useEffect(() => {
        if (isShuffle && playlist.length > 0) {
            
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

    
    const currentTrackRef = useRef(currentTrack)
    currentTrackRef.current = currentTrack

    const playTrack = useCallback(async (originalTrack: Track, newPlaylist?: Track[]) => {
        const audio = audioRef.current
        const prevTrack = currentTrackRef.current

        if (newPlaylist) {
            setPlaylist(newPlaylist)
        }

        
        const trackToPlay = { ...originalTrack }
        
        
        if (prevTrack?.path !== trackToPlay.path) {
            if (!audio.paused) {
                try { audio.pause() } catch (e) { }
            }
            audio.currentTime = 0
            
            
            if (prevTrack) {
                setHistory(prev => {
                    const { artwork, ...lightweightTrack } = prevTrack
                    const newHistory = [...prev, lightweightTrack]
                    if (newHistory.length > 50) return newHistory.slice(-50)
                    return newHistory
                })
            }
            
            setCurrentTrack(trackToPlay)
            
            audio.src = ''
        }

        
        if (!trackToPlay.artwork && !trackToPlay.path.startsWith('shared:')) {
            try {
                const art = await window.ipcRenderer.getAudioArtwork(trackToPlay.path)
                if (art) {
                    trackToPlay.artwork = art
                    setCurrentTrack({ ...trackToPlay }) 
                }
            } catch (e) {
                console.warn("Failed to load artwork lazily", e)
            }
        }

        
        let finalUrl = ''
        if (trackToPlay.path.startsWith('shared:')) {
            try {
                const query = trackToPlay.path.replace('shared:', '')
                const results = await window.ipcRenderer.searchYouTube(query)
                if (results && results.length > 0) {
                    
                    const streamInfo = await window.ipcRenderer.getYouTubePreview(results[0].url)
                    
                    if (!trackToPlay.artwork && results[0].thumbnail) {
                        trackToPlay.artwork = results[0].thumbnail
                    }
                    if (!trackToPlay.duration && results[0].duration) {
                        trackToPlay.duration = results[0].duration
                    }
                    
                    
                    setCurrentTrack({ ...trackToPlay })

                    if (streamInfo && streamInfo.url) {
                        finalUrl = streamInfo.url
                        
                        
                        
                        audioRef.current.crossOrigin = "anonymous"
                    } else throw new Error("No stream URL")
                } else throw new Error("Not found on YouTube")
            } catch (e) {
                console.error("Failed to resolve shared track:", e)
                
                return
            }
        } else {
            audioRef.current.crossOrigin = "anonymous"
            // Use file:// protocol for HTMLAudioElement — custom protocols like media:// don't work for audio playback
            const encodedPath = trackToPlay.path.split(/[\\/]/).map(encodeURIComponent).join('/')
            finalUrl = `file:///${encodedPath}`
        }

        // Apply Final URL for new track
        if (audio.src !== finalUrl) {
            audio.src = finalUrl
            audio.load()
        }

        // Same track: If we just loaded artwork (and it wasn't there before), update state
        const curTrack = currentTrackRef.current
        if (curTrack?.path === trackToPlay.path && trackToPlay.artwork && !curTrack?.artwork) {
            setCurrentTrack(prev => prev ? ({ ...prev, artwork: trackToPlay.artwork }) : trackToPlay)
        }

        try {
            await engineRef.current?.resume()
            await audio.play()
        } catch (e) {
            console.error("Playback failed:", e)
        }
    }, [])

    
    const handleNext = useCallback((autoTrigger = false) => {
        if (!currentTrack || playlist.length === 0) return

        let nextTrack: Track

        if (repeatMode === 'one' && autoTrigger) {
            
            nextTrack = currentTrack
            audioRef.current.currentTime = 0
            audioRef.current.play()
            return
        }

        
        const activeList = isShuffle ? shuffledQueue : playlist

        
        let currentIdx = activeList.findIndex(t => t.path === currentTrack.path)

        
        if (currentIdx === -1) currentIdx = -1

        let nextIdx = currentIdx + 1

        if (nextIdx >= activeList.length) {
            
            if (repeatMode === 'all') {
                nextIdx = 0
                
                
            } else {
                
                return
            }
        }

        nextTrack = activeList[nextIdx]

        
        playTrack(nextTrack)
    }, [currentTrack, playlist, shuffledQueue, isShuffle, repeatMode])

    const handlePrev = useCallback(() => {
        if (audioRef.current.currentTime > 3) {
            
            audioRef.current.currentTime = 0
            return
        }

        if (history.length > 0) {
            const prev = history[history.length - 1]
            setHistory(h => h.slice(0, -1)) 
            playTrack(prev)
            return
        }

        
        if (!currentTrack || playlist.length === 0) return

        const activeList = isShuffle ? shuffledQueue : playlist
        const idx = activeList.findIndex(t => t.path === currentTrack.path)

        
        const prevIdx = (idx - 1 + activeList.length) % activeList.length
        playTrack(activeList[prevIdx])

    }, [currentTrack, playlist, shuffledQueue, isShuffle, history])

    
    useEffect(() => {
        // Get (or create) the shared engine — safe across HMR reloads
        const audio = audioRef.current
        const engine = getSharedEngine(audio)
        engineRef.current = engine
        try {
            // Apply initial settings (safe to call multiple times)
            engine.toggle8D(is8D)
            engine.setVolume(isMuted ? 0 : volume)
        } catch (e) {
            console.warn("Engine init error", e)
        }
    }, [])

    
    useEffect(() => {
        const audio = audioRef.current
        const onTimeUpdate = () => setCurrentTime(audio.currentTime)
        const onDurationChange = () => setDuration(audio.duration)
        const onEnded = () => {
            handleNext(true)
            window.ipcRenderer.invoke('app:clear-memory').catch(() => {})
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
        }
    }, [handleNext])

    
    useEffect(() => {
        if (!('mediaSession' in navigator)) return

        
        if (currentTrack) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentTrack.title,
                artist: currentTrack.artist,
                album: currentTrack.album || 'NeonWave Music',
                artwork: [
                    
                    { src: currentTrack.artwork || defaultArtwork, sizes: '512x512', type: 'image/png' }
                ]
            })
        }

        
        navigator.mediaSession.setActionHandler('play', () => {
            audioRef.current.play()
        })
        navigator.mediaSession.setActionHandler('pause', () => {
            audioRef.current.pause()
        })
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            handlePrev() 
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

    }, [currentTrack, handlePrev, handleNext, duration, defaultArtwork]) 

    
    useEffect(() => {
        const isRpcEnabled = localStorage.getItem('neonwave_enable_discord_rpc') !== 'false';
        
        if (!currentTrack || !isPlaying || !isRpcEnabled) {
            window.ipcRenderer.invoke('discord:clearPresence').catch(() => {});
            return;
        }

        const updatePresence = () => {
            window.ipcRenderer.invoke('discord:updatePresence', {
                title: currentTrack.title,
                artist: currentTrack.artist,
                album: currentTrack.album,
                duration: duration,
                elapsed: currentTime,
                artworkUrl: currentTrack.artwork,
                isPaused: false 
            }).catch(() => {});
        }

        updatePresence();
    }, [currentTrack?.path, isPlaying]);

    
    // Use refs for frequently-changing values to avoid tearing down the interval on every timeupdate
    const syncCurrentTimeRef = useRef(currentTime)
    syncCurrentTimeRef.current = currentTime
    const syncDurationRef = useRef(duration)
    syncDurationRef.current = duration
    const syncIsPlayingRef = useRef(isPlaying)
    syncIsPlayingRef.current = isPlaying

    useEffect(() => {
        const sync = () => {
            const gameModeSetting = localStorage.getItem('neonwave_mini_game_mode') || 'auto';
            const isGameModeActive = (gameModeSetting === 'always') || (gameModeSetting === 'auto' && contextMode === 'game');

            window.ipcRenderer.send('player:sync', {
                path: currentTrack ? currentTrack.path : '',
                title: currentTrack ? currentTrack.title : '',
                artist: currentTrack ? currentTrack.artist : '',
                album: currentTrack ? currentTrack.album : undefined,
                artwork: currentTrack ? currentTrack.artwork : undefined,
                currentTime: syncCurrentTimeRef.current,
                duration: syncDurationRef.current,
                isPlaying: syncIsPlayingRef.current,
                isGameModeActive
            });
        };

        sync(); 

        const handleSettingsChange = () => sync();
        window.addEventListener('neonwave:settings-changed', handleSettingsChange);

        const interval = setInterval(sync, 1000);
        return () => {
            clearInterval(interval);
            window.removeEventListener('neonwave:settings-changed', handleSettingsChange);
        };
    }, [currentTrack, contextMode]);

    const togglePlay = async () => {
        if (!audioRef.current) return;
        try {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                await engineRef.current?.resume()  // Resume AudioContext if suspended
                await audioRef.current.play();
                setIsPlaying(true);
            }
        } catch (e) {
            console.warn("[Audio] Playback was slightly interrupted or blocked:", e);
        }
    }
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
