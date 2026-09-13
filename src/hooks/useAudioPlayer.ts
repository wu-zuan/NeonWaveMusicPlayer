import { useState, useEffect, useRef, useCallback } from 'react'
import { AudioEngine } from '../utils/AudioEngine'

export interface Track {
    path: string
    title: string
    artist: string
    album?: string
    mediaType?: 'audio' | 'video'
    duration?: number
    artwork?: string
    codec?: string
    bitrate?: number
    sampleRate?: number
}

type RepeatMode = 'none' | 'all' | 'one'

// Preserve the pair across Fast Refresh: a media element can only be attached
// to one MediaElementAudioSourceNode during its lifetime.
interface SharedPlayback {
    audio: HTMLVideoElement | null
    engine: AudioEngine | null
    owners: number
    disposeTimer: ReturnType<typeof setTimeout> | null
}
const sharedPlayback: SharedPlayback = import.meta.hot?.data.neonWavePlayback ?? {
    audio: null, engine: null, owners: 0, disposeTimer: null
}
if (import.meta.hot) import.meta.hot.data.neonWavePlayback = sharedPlayback

function getSharedAudio(): HTMLVideoElement {
    if (!sharedPlayback.audio) {
        sharedPlayback.audio = document.createElement('video')
        sharedPlayback.audio.playsInline = true
    }
    return sharedPlayback.audio
}

function getSharedEngine(audio: HTMLMediaElement): AudioEngine {
    if (!sharedPlayback.engine) {
        sharedPlayback.engine = new AudioEngine()
        sharedPlayback.engine.connect(audio)
    }
    return sharedPlayback.engine
}

function releaseSharedPlayback() {
    sharedPlayback.owners--
    if (sharedPlayback.owners !== 0) return
    // StrictMode and Fast Refresh re-run effects immediately. Let that owner
    // retain the graph before tearing down media decoding and audio resources.
    sharedPlayback.disposeTimer = setTimeout(() => {
        sharedPlayback.disposeTimer = null
        if (sharedPlayback.owners !== 0) return
        sharedPlayback.audio?.pause()
        sharedPlayback.audio?.removeAttribute('src')
        sharedPlayback.audio?.load()
        sharedPlayback.engine?.dispose()
        sharedPlayback.audio = null
        sharedPlayback.engine = null
    }, 0)
}

function waitForPlayable(media: HTMLMediaElement, signal: AbortSignal, timeoutMs = 6000): Promise<void> {
    if (signal.aborted) return Promise.reject(new DOMException('Playback superseded', 'AbortError'))
    if (media.readyState >= 3) return Promise.resolve()

    return new Promise((resolve, reject) => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null

        const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId)
            media.removeEventListener('canplay', onReady)
            media.removeEventListener('loadeddata', onReady)
            media.removeEventListener('error', onError)
            signal.removeEventListener('abort', onAbort)
        }

        const onReady = () => {
            cleanup()
            resolve()
        }

        const onError = () => {
            cleanup()
            reject(media.error || new Error('Media failed to load'))
        }

        const onAbort = () => {
            cleanup()
            reject(new DOMException('Playback superseded', 'AbortError'))
        }

        timeoutId = setTimeout(() => {
            cleanup()
            resolve()
        }, timeoutMs)

        media.addEventListener('canplay', onReady, { once: true })
        media.addEventListener('loadeddata', onReady, { once: true })
        media.addEventListener('error', onError, { once: true })
        signal.addEventListener('abort', onAbort, { once: true })
    })
}

export function useAudioPlayer(contextMode?: string) {
    
    
    
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
    const [duration, setDuration] = useState(0)

    
    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem('nw_volume')
        return saved ? parseFloat(saved) : 1
    })
    const [isMuted, setIsMuted] = useState(() => localStorage.getItem('nw_muted') === 'true')
    const [is8D, setIs8D] = useState(() => localStorage.getItem('nw_8d') === 'true')
    // Relative URL works from both the dev server and the packaged file:// page
    // (fetch()-ing it to a data URL would be blocked under webSecurity).
    const defaultArtwork = 'logo.png'

    
    const [playlist, setPlaylist] = useState<Track[]>([])
    const [shuffledQueue, setShuffledQueue] = useState<Track[]>([]) 
    const [isShuffle, setIsShuffle] = useState(() => localStorage.getItem('nw_shuffle') === 'true')
    const [repeatMode, setRepeatMode] = useState<RepeatMode>(() => {
        return (localStorage.getItem('nw_repeat') as RepeatMode) || 'none'
    })
    const [history, setHistory] = useState<Track[]>([])

    // Use module-level singletons to avoid re-connection crashes on HMR
    const audioRef = useRef<HTMLVideoElement>(getSharedAudio())
    const engineRef = useRef<AudioEngine | null>(sharedPlayback.engine)
    const isSwitchingTrackRef = useRef(false)
    const isPlaybackPendingRef = useRef(false)
    const playRequestIdRef = useRef(0)
    const playAbortRef = useRef<AbortController | null>(null)
    const loadedTrackPathRef = useRef<string | null>(null)
    const mountedRef = useRef(false)

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
            playRequestIdRef.current++
            playAbortRef.current?.abort()
        }
    }, [])

    // Expose the shared media element for automated smoke tests (dev only)
    useEffect(() => {
        if (import.meta.env.DEV) {
            const debugWindow = window as unknown as Record<string, unknown>
            const audio = audioRef.current
            debugWindow.__nwAudio = audio
            return () => {
                if (debugWindow.__nwAudio === audio) delete debugWindow.__nwAudio
            }
        }
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
        const requestId = playRequestIdRef.current + 1
        playRequestIdRef.current = requestId
        playAbortRef.current?.abort()
        const controller = new AbortController()
        playAbortRef.current = controller
        const isCurrentRequest = () => playRequestIdRef.current === requestId
        isPlaybackPendingRef.current = true

        if (newPlaylist) {
            setPlaylist(newPlaylist)
        }

        
        const trackToPlay = { ...originalTrack }
        
        
        if (prevTrack?.path !== trackToPlay.path) {
            isSwitchingTrackRef.current = true
            if (!audio.paused && !audio.ended) {
                try { audio.pause() } catch (e) { }
            }
            audio.currentTime = 0
            setDuration(0)
            
            
            if (prevTrack) {
                setHistory(prev => {
                    const { artwork, ...lightweightTrack } = prevTrack
                    const newHistory = [...prev, lightweightTrack]
                    if (newHistory.length > 50) return newHistory.slice(-50)
                    return newHistory
                })
            }
            
            currentTrackRef.current = trackToPlay
            setCurrentTrack(trackToPlay)
        }

        
        let finalUrl = ''
        if (trackToPlay.path.startsWith('shared:')) {
            try {
                const query = trackToPlay.path.replace('shared:', '')
                const results = await window.ipcRenderer.searchYouTube(query)
                if (!isCurrentRequest()) return
                if (results && results.length > 0) {
                    
                    const streamInfo = await window.ipcRenderer.getYouTubePreview(results[0].url)
                    if (!isCurrentRequest()) return
                    
                    if (!trackToPlay.artwork && results[0].thumbnail) {
                        trackToPlay.artwork = results[0].thumbnail
                    }
                    if (!trackToPlay.duration && results[0].duration) {
                        trackToPlay.duration = results[0].duration
                    }
                    
                    
                    setCurrentTrack({ ...trackToPlay })

                    if (streamInfo && streamInfo.url) {
                        // Remote stream URLs (googlevideo) carry no CORS headers, which
                        // would taint Web Audio under webSecurity. Proxy them through the
                        // main process via the media:// scheme, which adds the headers.
                        finalUrl = `media://remote/?u=${encodeURIComponent(streamInfo.url)}`
                        audioRef.current.crossOrigin = "anonymous"
                    } else throw new Error("No stream URL")
                } else throw new Error("Not found on YouTube")
            } catch (e) {
                console.error("Failed to resolve shared track:", e)
                if (isCurrentRequest()) {
                    isSwitchingTrackRef.current = false
                    isPlaybackPendingRef.current = false
                    setIsPlaying(false)
                }
                return
            }
        } else {
            audioRef.current.crossOrigin = "anonymous"
            // Local files go through the privileged media:// scheme (CORS-enabled
            // by the main-process handler) so webSecurity can stay on. A custom
            // standard scheme needs a non-empty host, so use media://local/<path>
            // (the empty-host media:/// form fails to parse in the renderer).
            const encodedPath = trackToPlay.path.split(/[\\/]/).filter(Boolean).map(encodeURIComponent).join('/')
            finalUrl = `media://local/${encodedPath}`
        }

        // Apply Final URL for new track
        if (audio.src !== finalUrl) {
            audio.src = finalUrl
            audio.load()
        }
        loadedTrackPathRef.current = trackToPlay.path

        // Same track: If we just loaded artwork (and it wasn't there before), update state
        const curTrack = currentTrackRef.current
        if (curTrack?.path === trackToPlay.path && trackToPlay.artwork && !curTrack?.artwork) {
            setCurrentTrack(prev => prev ? ({ ...prev, artwork: trackToPlay.artwork }) : trackToPlay)
        }

        // Cover parsing belongs to the selected track, independently of whether
        // its pending playback is subsequently paused or resumed.
        if (mountedRef.current && currentTrackRef.current?.path === trackToPlay.path &&
            !trackToPlay.artwork && !trackToPlay.path.startsWith('shared:')) {
            window.ipcRenderer.getAudioArtwork(trackToPlay.path)
                .then((art) => {
                    if (!art || !mountedRef.current) return
                    setCurrentTrack(prev => prev?.path === trackToPlay.path ? ({ ...prev, artwork: art }) : prev)
                })
                .catch((e) => {
                    console.warn("Failed to load artwork lazily", e)
                })
        }

        try {
            isPlaybackPendingRef.current = true
            await engineRef.current?.resume()
            if (!isCurrentRequest()) return
            await waitForPlayable(audio, controller.signal)
            if (!isCurrentRequest()) return
            await audio.play()
            if (isCurrentRequest()) {
                isPlaybackPendingRef.current = false
                setIsPlaying(!audio.paused && !audio.ended)
            }
        } catch (e) {
            if (isCurrentRequest()) {
                console.error("Playback failed:", e)
                isPlaybackPendingRef.current = false
                setIsPlaying(false)
            }
        } finally {
            if (isCurrentRequest()) {
                isSwitchingTrackRef.current = false
            }
        }

    }, [])

    
    const handleNext = useCallback(async (autoTrigger = false) => {
        if (!currentTrack || playlist.length === 0) return

        let nextTrack: Track

        if (repeatMode === 'one' && autoTrigger) {
            const requestId = playRequestIdRef.current
            audioRef.current.currentTime = 0
            try {
                isPlaybackPendingRef.current = true
                await engineRef.current?.resume()
                if (playRequestIdRef.current !== requestId) return
                await audioRef.current.play()
                if (playRequestIdRef.current === requestId) {
                    isPlaybackPendingRef.current = false
                    setIsPlaying(!audioRef.current.paused && !audioRef.current.ended)
                }
            } catch (e) {
                if (playRequestIdRef.current === requestId) {
                    console.error("Playback failed:", e)
                    isPlaybackPendingRef.current = false
                    setIsPlaying(false)
                }
            }
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

        
        await playTrack(nextTrack)
    }, [currentTrack, playlist, shuffledQueue, isShuffle, repeatMode, playTrack])

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

    }, [currentTrack, playlist, shuffledQueue, isShuffle, history, playTrack])

    
    useEffect(() => {
        // Get (or create) the shared engine — safe across HMR reloads
        sharedPlayback.owners++
        if (sharedPlayback.disposeTimer !== null) {
            clearTimeout(sharedPlayback.disposeTimer)
            sharedPlayback.disposeTimer = null
        }
        const audio = getSharedAudio()
        audioRef.current = audio
        const engine = getSharedEngine(audio)
        engineRef.current = engine
        try {
            // Apply initial settings (safe to call multiple times)
            engine.toggle8D(is8D)
            engine.setVolume(isMuted ? 0 : volume)
        } catch (e) {
            console.warn("Engine init error", e)
        }
        return releaseSharedPlayback
    }, [])

    
    useEffect(() => {
        const audio = audioRef.current
        const onDurationChange = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
        const onEnded = () => {
            setIsPlaying(false)
            handleNext(true)
        }
        const onPlay = () => {
            isPlaybackPendingRef.current = false
            setIsPlaying(true)
        }
        const onPause = () => {
            if (isSwitchingTrackRef.current || isPlaybackPendingRef.current) return
            if (!audio.paused) return
            setIsPlaying(false)
        }

        audio.addEventListener('durationchange', onDurationChange)
        audio.addEventListener('ended', onEnded)
        audio.addEventListener('play', onPlay)
        audio.addEventListener('pause', onPause)

        return () => {
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
            void engineRef.current?.resume().then(() => audioRef.current.play()).catch(error => {
                console.warn('Media-session playback failed:', error)
            })
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
            if (details.seekTime !== undefined && duration) {
                audioRef.current.currentTime = details.seekTime
            }
        })

        return () => {
            for (const action of ['play', 'pause', 'previoustrack', 'nexttrack', 'seekto'] as const) {
                navigator.mediaSession.setActionHandler(action, null)
            }
            navigator.mediaSession.metadata = null
        }

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
                elapsed: audioRef.current.currentTime,
                artworkUrl: currentTrack.artwork,
                isPaused: false 
            }).catch(() => {});
        }

        updatePresence();
    }, [currentTrack?.path, isPlaying]);

    
    // Keep large cover images out of recurring IPC messages, including across
    // pause/resume and metadata effect restarts. The main process caches the snapshot.
    const lastSyncedTrackRef = useRef({ path: '', artwork: '' })

    useEffect(() => {
        const audio = audioRef.current

        const sync = () => {
            // Click-through is opt-in. Defaulting to automatic can make a new
            // PIP appear broken when an app is incorrectly detected as a game.
            const gameModeSetting = localStorage.getItem('neonwave_mini_game_mode') || 'off';
            const isGameModeActive = (gameModeSetting === 'always') || (gameModeSetting === 'auto' && contextMode === 'game');

            const currentPath = currentTrack ? currentTrack.path : '';
            const currentArtwork = currentTrack ? currentTrack.artwork || '' : '';
            const shouldSendArtwork = (currentPath !== lastSyncedTrackRef.current.path) ||
                (currentArtwork !== lastSyncedTrackRef.current.artwork);

            window.ipcRenderer.send('player:sync', {
                path: currentPath,
                title: currentTrack ? currentTrack.title : '',
                artist: currentTrack ? currentTrack.artist : '',
                album: currentTrack ? currentTrack.album : undefined,
                artwork: shouldSendArtwork ? (currentTrack ? currentTrack.artwork : undefined) : undefined,
                currentTime: audio.currentTime,
                duration,
                isPlaying,
                isGameModeActive
            });

            if (shouldSendArtwork) {
                lastSyncedTrackRef.current = { path: currentPath, artwork: currentArtwork };
            }
        };

        sync(); 

        const handleSettingsChange = () => sync();
        window.addEventListener('neonwave:settings-changed', handleSettingsChange);
        audio.addEventListener('seeked', sync)
        // The media clock does not change while paused; events cover seeks and
        // state/settings changes without waking an idle renderer every second.
        const timer = isPlaying ? setInterval(sync, 250) : null
        return () => {
            if (timer !== null) clearInterval(timer)
            audio.removeEventListener('seeked', sync)
            window.removeEventListener('neonwave:settings-changed', handleSettingsChange);
        };
    }, [currentTrack, contextMode, duration, isPlaying]);

    const togglePlay = useCallback(async () => {
        const audio = audioRef.current
        let requestId = playRequestIdRef.current
        try {
            if (!audio.paused || isPlaybackPendingRef.current) {
                playRequestIdRef.current++
                playAbortRef.current?.abort()
                isPlaybackPendingRef.current = false
                isSwitchingTrackRef.current = false
                audio.pause();
                setIsPlaying(false);
            } else {
                const track = currentTrackRef.current
                if (track && loadedTrackPathRef.current !== track.path) {
                    await playTrack(track)
                    return
                }
                if (!audio.src) return
                requestId = ++playRequestIdRef.current
                isPlaybackPendingRef.current = true
                await engineRef.current?.resume()  // Resume AudioContext if suspended
                if (playRequestIdRef.current !== requestId) return
                await audio.play();
                if (playRequestIdRef.current === requestId) {
                    isPlaybackPendingRef.current = false
                    setIsPlaying(!audio.paused && !audio.ended);
                }
            }
        } catch (e) {
            if (playRequestIdRef.current === requestId) {
                isPlaybackPendingRef.current = false
                console.warn("[Audio] Playback was slightly interrupted or blocked:", e);
            }
        }
    }, [playTrack])
    const seek = useCallback((time: number) => {
        const audio = audioRef.current
        if (!Number.isFinite(time) || audio.readyState === HTMLMediaElement.HAVE_NOTHING) return

        const mediaDuration = Number.isFinite(audio.duration) ? audio.duration : duration
        const nextTime = Math.min(Math.max(time, 0), mediaDuration > 0 ? mediaDuration : time)
        audio.currentTime = nextTime
    }, [duration])
    const getAudioStream = useCallback(() => engineRef.current?.getAudioStream(), [])
    const startPcmCapture = useCallback((onChunk: (chunk: ArrayBuffer) => void) => {
        engineRef.current?.startPcmCapture(onChunk)
        return !!engineRef.current
    }, [])
    const stopPcmCapture = useCallback(() => {
        engineRef.current?.stopPcmCapture()
    }, [])
    const getMediaElement = useCallback(() => audioRef.current, [])
    const setLocalMute = useCallback((muted: boolean) => {
        engineRef.current?.setLocalMute(muted)
    }, [])
    const toggleShuffle = useCallback(() => setIsShuffle(value => !value), [])
    const toggleRepeat = useCallback(() => setRepeatMode(mode => mode === 'none' ? 'all' : mode === 'all' ? 'one' : 'none'), [])
    const playNext = useCallback(() => handleNext(false), [handleNext])
    const setDistance = useCallback((meters: number) => engineRef.current?.setDistance(meters), [])
    const setSpaceMode = useCallback((mode: string) => engineRef.current?.setSpaceMode(mode), [])
    const setPosition = useCallback((x: number, y: number, z: number) => {
        engineRef.current?.toggle8D(false)
        setIs8D(false)
        engineRef.current?.setPosition(x, y, z)
    }, [])
    const setFocusMode = useCallback((enable: boolean) => {
        if (enable) setIs8D(false)
        engineRef.current?.setFocusMode(enable)
    }, [])
    const setNormalization = useCallback((enable: boolean) => engineRef.current?.setNormalization(enable), [])
    const setCrowd = useCallback((enable: boolean) => engineRef.current?.setCrowd(enable), [])

    return {
        isPlaying,
        currentTrack,
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
        toggleShuffle,
        toggleRepeat,
        seek,
        handleNext: playNext,
        handlePrev,
        
        setDistance,
        setSpaceMode,
        setPosition,
        setFocusMode,
        setNormalization,
        setCrowd,
        isMuted,
        setIsMuted,
        getAudioStream,
        startPcmCapture,
        stopPcmCapture,
        getMediaElement,
        setLocalMute
    }
}
