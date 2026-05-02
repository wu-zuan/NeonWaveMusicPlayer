import { useState, useEffect } from 'react'

interface TrackInfo {
    title: string
    artist: string
    artwork?: string
    currentTime: number
    duration: number
    isPlaying: boolean
}

export function MiniPlayer() {
    const [track, setTrack] = useState<TrackInfo | null>(null)

    useEffect(() => {
        const cleanup = (window as any).ipcRenderer.on('player:sync', (_: any, data: TrackInfo) => {
            setTrack(data)
        })
        return () => { if (cleanup) cleanup() }
    }, [])

    if (!track) return (
        <div style={{
            width: '100vw',
            height: '100vh',
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            border: '2px solid rgba(255, 255, 255, 0.1)',
            WebkitAppRegion: 'drag',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            fontFamily: 'system-ui, sans-serif'
        } as any}>
            NeonWave
        </div>
    )

    const progress = track.duration > 0 ? (track.currentTime / track.duration) * 100 : 0
    const size = 160 // Circle size
    const circumference = 2 * Math.PI * (size / 2 - 2) 
    const offset = circumference - (progress / 100) * circumference

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            WebkitAppRegion: 'drag',
            userSelect: 'none',
            fontFamily: 'system-ui, sans-serif'
        } as any}>
            <div style={{
                width: `${size}px`,
                height: `${size}px`,
                position: 'relative',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#0f172a',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 15px var(--accent-glow, rgba(139, 92, 246, 0.3))',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {/* Album Art Background */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${track.artwork || 'logo.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.6) blur(1px)',
                    transition: 'background-image 0.8s ease'
                }} />

                {/* Progress Ring */}
                <svg style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${size}px`,
                    height: `${size}px`,
                    transform: 'rotate(-90deg)',
                    pointerEvents: 'none'
                }}>
                    <circle
                        cx={size/2}
                        cy={size/2}
                        r={size/2 - 2}
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="4"
                        fill="transparent"
                    />
                    <circle
                        cx={size/2}
                        cy={size/2}
                        r={size/2 - 2}
                        stroke="var(--accent, #8b5cf6)"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.3s linear' }}
                    />
                </svg>

                {/* Info Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    textAlign: 'center',
                    color: 'white',
                    textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                    pointerEvents: 'none'
                }}>
                    <div style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        width: '120px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '2px'
                    }}>
                        {track.title}
                    </div>
                    <div style={{
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.8)',
                        width: '100px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {track.artist}
                    </div>
                </div>

                {!track.isPlaying && (
                    <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        opacity: 0.6
                    }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 5px #ef4444' }} />
                    </div>
                )}
            </div>
        </div>
    )
}
