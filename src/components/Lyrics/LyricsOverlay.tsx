import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { parseLrc, LyricLine, getCurrentLineIndex } from '../../utils/lrcParser'

interface LyricsOverlayProps {
    visible: boolean
    onClose: () => void
    trackTitle: string
    trackArtist: string
    trackPath?: string
    trackArtwork?: string
    trackDuration?: number
    currentTime: number
}

export const LyricsOverlay: React.FC<LyricsOverlayProps> = ({
    visible, onClose, trackTitle, trackArtist, trackPath, trackDuration, currentTime
}) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [lyrics, setLyrics] = useState<LyricLine[]>([])

    const scrollRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(-1)

    // Check if we have valid synced timestamps (at least some lines > 0s)
    // If all are 0, it's likely plain text passed with dummy timestamps
    const isSynced = React.useMemo(() => lyrics.some(l => l.time > 0), [lyrics])



    // Auto-scroll effect
    useEffect(() => {
        if (showSearch || !isSynced) return // Don't scroll when searching or unsynced

        const idx = getCurrentLineIndex(lyrics, currentTime)
        if (idx !== activeIndex) {
            setActiveIndex(idx)
            if (scrollRef.current && idx !== -1) {
                const activeEl = scrollRef.current.children[idx] as HTMLElement
                if (activeEl) {
                    activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
            }
        }
    }, [currentTime, lyrics, showSearch, isSynced])

    // Reset scroll when lyrics load
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0
        }
        if (!isSynced) {
            setActiveIndex(-1)
        }
    }, [lyrics, isSynced])

    const fetchLyrics = async (title: string, artist: string, path: string = '', duration: number = 0) => {
        setLoading(true)
        setError(false)
        setLyrics([])
        try {
            const rawLrc = await window.ipcRenderer.getLyrics(title, artist, path, duration)
            if (rawLrc) {
                const parsed = parseLrc(rawLrc)
                if (parsed.length > 0) {
                    setLyrics(parsed)
                    setShowSearch(false)
                } else {
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

    // Initial Fetch
    useEffect(() => {
        if (!visible || !trackTitle) return
        fetchLyrics(trackTitle, trackArtist, trackPath, trackDuration)
    }, [trackTitle, trackArtist, trackPath, visible, trackDuration])

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && visible) {
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [visible, onClose])

    // --- Rendering ---
    const activeLine = activeIndex !== -1 ? lyrics[activeIndex] : null

    // Danmaku Style: We only show the active line, very casually floating
    // "Switch" concept means the user toggles it from the main bar, so no UI here.

    if (!visible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999, // Top layer
                    pointerEvents: 'none', // CLICK THROUGH
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end', // Bottom aligned
                    alignItems: 'center',
                    paddingBottom: '8vh',
                    fontFamily: '"Outfit", sans-serif',
                    overflow: 'hidden'
                }}
            >
                {/* Visual Feedback for Loading (Subtle) */}
                {loading && (
                    <div style={{
                        position: 'absolute', top: '20%',
                        color: 'rgba(255,255,255,0.4)',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '4px 8px', borderRadius: '4px',
                        fontSize: '12px'
                    }}>
                        Searching Lyrics...
                    </div>
                )}

                {/* The "Danmaku" / Subtitle Line */}
                {!loading && !error && activeLine && (
                    <div style={{
                        width: '100%',
                        textAlign: 'center',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <motion.div
                            key={activeLine.time}
                            initial={{ y: 20, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -20, opacity: 0, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            style={{
                                fontSize: 'min(64px, 8vw)', // Responsive giant text
                                fontWeight: 900,
                                color: '#fff',
                                // "Danmaku" needs HEAVY stroke to be readable on white/black/gameplay
                                textShadow: `
                                 3px 3px 0 #000,
                                -3px -3px 0 #000,  
                                 3px -3px 0 #000,
                                -3px 3px 0 #000,
                                 3px 0px 0 #000,
                                 0px 3px 0 #000,
                                -3px 0px 0 #000,
                                 0px -3px 0 #000
                               `,
                                WebkitTextStroke: '2px black',
                                lineHeight: 1.1,
                                padding: '0 20px'
                            }}
                        >
                            {activeLine.text}
                        </motion.div>

                        {/* Optional: Translation line if we had it, or next line small? 
                           User asked for "Danmaku", usually just one scrolling line or flowing text. 
                           Subtitle style is safest for "Lyrics".
                       */}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}
