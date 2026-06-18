import { useState, useEffect, useRef, useCallback } from 'react'

interface TrackInfo {
    title: string
    artist: string
    artwork?: string
    currentTime: number
    duration: number
    isPlaying: boolean
    isGameModeActive?: boolean
}

export function MiniPlayer() {
    const [track, setTrack] = useState<TrackInfo | null>(null)
    const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const cleanup = (window as any).ipcRenderer.on('player:sync', (_: any, data: TrackInfo) => {
            setTrack(data)
        })
        return () => {
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current)
                clickTimeoutRef.current = null
            }
            if (cleanup) cleanup()
        }
    }, [])

    const isGameModeActive = !!(track && track.isGameModeActive)

    // Handle single/double clicks to control playback and restore main window
    const handleClicks = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (e.detail === 1) {
            if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
            clickTimeoutRef.current = setTimeout(() => {
                (window as any).ipcRenderer.invoke('window:togglePlay').catch(console.error)
            }, 250)
        } else if (e.detail === 2) {
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current)
                clickTimeoutRef.current = null
            }
            (window as any).ipcRenderer.invoke('window:restoreMain').catch(console.error)
        }
    }, [])

    if (!track || !track.title) return (
        <div 
            onClick={handleClicks}
            style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                WebkitAppRegion: isGameModeActive ? 'none' : 'drag',
                cursor: 'pointer',
                userSelect: 'none',
                fontFamily: "'Outfit', 'Inter', sans-serif",
                opacity: isGameModeActive ? 0.35 : 1,
                transform: isGameModeActive ? 'scale(0.92)' : 'scale(1)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            } as any}
        >
            <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: '#020617',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 600,
                border: isGameModeActive ? '1px solid rgba(255, 85, 0, 0.25)' : '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: isGameModeActive 
                    ? '0 10px 30px rgba(0,0,0,0.9), 0 0 15px rgba(255, 85, 0, 0.15)' 
                    : '0 8px 32px rgba(0,0,0,0.5)',
                fontFamily: "'Outfit', sans-serif",
                transition: 'all 0.5s ease'
            }}>
                NeonWave
            </div>
        </div>
    )

    const progress = track.duration > 0 ? (track.currentTime / track.duration) * 100 : 0
    const size = 150
    const strokeWidth = 3
    const radius = size / 2 - strokeWidth
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (progress / 100) * circumference

    return (
        <div 
            onClick={handleClicks}
            style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                WebkitAppRegion: isGameModeActive ? 'none' : 'drag',
                cursor: 'pointer',
                userSelect: 'none',
                fontFamily: "'Outfit', 'Inter', sans-serif",
                opacity: isGameModeActive ? 0.35 : 1,
                transform: isGameModeActive ? 'scale(0.92)' : 'scale(1)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            } as any}
        >
            <div style={{
                width: `${size}px`,
                height: `${size}px`,
                position: 'relative',
                borderRadius: '50%',
                background: '#020617',
                boxShadow: isGameModeActive 
                    ? '0 10px 30px rgba(0,0,0,0.9), 0 0 15px rgba(255, 85, 0, 0.15)' 
                    : '0 15px 45px rgba(0,0,0,0.8), 0 0 20px rgba(0, 255, 242, 0.2)',
                border: isGameModeActive 
                    ? '1px solid rgba(255, 85, 0, 0.25)' 
                    : '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.5s ease'
            }}>
                { }
                <div style={{
                    width: `${size - 10}px`,
                    height: `${size - 10}px`,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    position: 'relative',
                    animation: track.isPlaying ? 'spin 12s linear infinite' : 'none',
                    transition: 'all 0.5s ease',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                }}>
                        <img 
                            src={track.artwork || '/logo.png'} 
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.5) contrast(1.1)'
                        }}
                    />
                    
                    {/* Vinyl Center Hole Decor */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#020617',
                        border: '2px solid rgba(255,255,255,0.2)',
                        zIndex: 10
                    }} />
                </div>

                {/* Progress Ring Overlay */}
                <svg style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${size}px`,
                    height: `${size}px`,
                    transform: 'rotate(-90deg)',
                    pointerEvents: 'none',
                    zIndex: 20
                }}>
                    <circle
                        cx={size/2}
                        cy={size/2}
                        r={radius}
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    <circle
                        cx={size/2}
                        cy={size/2}
                        r={radius}
                        stroke="var(--accent-primary, #00fff2)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ 
                            transition: 'stroke-dashoffset 0.5s linear',
                            filter: 'drop-shadow(0 0 3px var(--accent-primary, #00fff2))'
                        }}
                    />
                </svg>

                { }
                {isGameModeActive && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(255, 85, 0, 0.2)',
                        border: '1px solid rgba(255, 85, 0, 0.4)',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '9px',
                        color: '#ff5500',
                        fontWeight: 700,
                        zIndex: 40,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        boxShadow: '0 0 10px rgba(255, 85, 0, 0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        whiteSpace: 'nowrap'
                    }}>
                        🎮 遊戲模式
                    </div>
                )}

                {/* Text Overlay (Bottom Arc) */}
                <div style={{
                    position: 'absolute',
                    bottom: '25px',
                    width: '110px',
                    height: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 30,
                    pointerEvents: 'none'
                }}>
                    <div style={{
                        width: '100%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            fontSize: '11px',
                            fontWeight: 800,
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                            padding: '0 5px',
                            animation: track.title.length > 12 ? 'scrollText 8s linear infinite' : 'none'
                        }}>
                            {track.title}
                        </div>
                    </div>
                    <div style={{
                        fontSize: '9px',
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: 500,
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                        maxWidth: '90px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {track.artist}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    zIndex: 30
                }}>
                     <div style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        background: track.isPlaying ? '#00fff2' : '#ff00ff',
                        boxShadow: `0 0 8px ${track.isPlaying ? '#00fff2' : '#ff00ff'}`,
                        animation: track.isPlaying ? 'pulse 2s infinite' : 'none'
                     }} />
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
                @keyframes scrollText {
                    0% { transform: translateX(10%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    )
}
