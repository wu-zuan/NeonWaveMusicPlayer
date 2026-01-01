import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mic2, Loader2 } from 'lucide-react'
import { parseLrc, LyricLine, getCurrentLineIndex } from '../../utils/lrcParser'

interface LyricsOverlayProps {
    visible: boolean
    onClose: () => void
    trackTitle: string
    trackArtist: string
    trackPath?: string
    currentTime: number
}

export const LyricsOverlay: React.FC<LyricsOverlayProps> = ({
    visible, onClose, trackTitle, trackArtist, trackPath, currentTime
}) => {
    const [lyrics, setLyrics] = useState<LyricLine[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(-1)

    // Auto-scroll effect
    useEffect(() => {
        const idx = getCurrentLineIndex(lyrics, currentTime)
        if (idx !== activeIndex) {
            setActiveIndex(idx)
            // Scroll logic
            if (scrollRef.current && idx !== -1) {
                const activeEl = scrollRef.current.children[idx] as HTMLElement
                if (activeEl) {
                    activeEl.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    })
                }
            }
        }
    }, [currentTime, lyrics])

    // Fetch Lyrics
    useEffect(() => {
        if (!visible || !trackTitle) return

        const fetchLyrics = async () => {
            setLoading(true)
            setError(false)
            setLyrics([])
            try {
                // Try to find lyrics
                const rawLrc = await window.ipcRenderer.getLyrics(trackTitle, trackArtist || '', trackPath || '')
                if (rawLrc) {
                    const parsed = parseLrc(rawLrc)
                    if (parsed.length > 0) {
                        setLyrics(parsed)
                    } else {
                        // Sometimes plain text wraps... but we want synced first
                        // If parse fails, maybe treat line by line as unsynced?
                        // For now detailed error
                        setError(true)
                    }
                } else {
                    setError(true)
                }
            } catch (e) {
                console.error(e)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchLyrics()
    }, [trackTitle, trackArtist, trackPath, visible])

    if (!visible) return null

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1000,
                        background: 'radial-gradient(circle at 50% 30%, rgba(20, 20, 40, 0.95), #000)',
                        backdropFilter: 'blur(30px)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '30px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 10
                    }}>
                        <div style={{ opacity: 0.8 }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#fff' }}>{trackTitle}</h2>
                            <div style={{ fontSize: '16px', color: 'var(--accent-primary)', marginTop: '4px' }}>{trackArtist}</div>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#fff'
                            }}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            // Scrollbar hidden
                            scrollbarWidth: 'none',
                            padding: '50vh 0', // huge padding to center first/last lines
                        }}
                        className="lyrics-container"
                        ref={scrollRef}
                    >
                        {loading && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#fff', opacity: 0.7 }}>
                                <Loader2 size={40} className="animate-spin" />
                                Searching Lyrics...
                            </div>
                        )}

                        {!loading && error && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#fff', opacity: 0.5 }}>
                                <Mic2 size={40} />
                                <div style={{ fontSize: '18px' }}>No synchronized lyrics found</div>
                            </div>
                        )}

                        {!loading && !error && lyrics.map((line, i) => {
                            const isActive = i === activeIndex
                            const isPast = i < activeIndex

                            // Visual Style Logic
                            // Active: scale 1.2, blur 0, bright white + glow
                            // Near: scale 1, blur 0, gray
                            // Far: scale 0.9, blur 2px, dark gray

                            return (
                                <motion.div
                                    key={i}
                                    initial={false}
                                    animate={{
                                        scale: isActive ? 1.2 : 1,
                                        opacity: isActive ? 1 : isPast ? 0.4 : 0.6,
                                        filter: isActive ? 'blur(0px)' : 'blur(1.5px)',
                                        y: isActive ? 0 : 0,
                                        color: isActive ? '#fff' : '#aaa'
                                    }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        margin: '24px 0',
                                        textAlign: 'center',
                                        maxWidth: '80%',
                                        padding: '0 20px',
                                        cursor: 'pointer',
                                        position: 'relative'
                                    }}
                                    onClick={() => {
                                        // Optional: seek to this line
                                    }}
                                >
                                    <span style={{
                                        fontSize: isActive ? '36px' : '24px',
                                        fontWeight: 700,
                                        lineHeight: 1.4,
                                        textShadow: isActive ? '0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.4)' : 'none',
                                        transition: 'font-size 0.5s ease'
                                    }}>
                                        {line.text}
                                    </span>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Background decorations */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-10%',
                        left: '-10%',
                        width: '50vw',
                        height: '50vw',
                        background: 'radial-gradient(circle, rgba(0,255,255,0.1), transparent 70%)',
                        filter: 'blur(80px)',
                        pointerEvents: 'none',
                        zIndex: 0
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '-10%',
                        right: '-10%',
                        width: '50vw',
                        height: '50vw',
                        background: 'radial-gradient(circle, rgba(255,0,255,0.1), transparent 70%)',
                        filter: 'blur(80px)',
                        pointerEvents: 'none',
                        zIndex: 0
                    }} />

                </motion.div>
            )}
        </AnimatePresence>
    )
}
