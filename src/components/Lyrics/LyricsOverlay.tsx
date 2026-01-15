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
    const [lyrics, setLyrics] = useState<LyricLine[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [searchTitle, setSearchTitle] = useState(trackTitle)
    const [searchArtist, setSearchArtist] = useState(trackArtist)

    const scrollRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(-1)

    // Check if we have valid synced timestamps (at least some lines > 0s)
    // If all are 0, it's likely plain text passed with dummy timestamps
    const isSynced = React.useMemo(() => lyrics.some(l => l.time > 0), [lyrics])

    // Init search fields when track changes
    useEffect(() => {
        setSearchTitle(trackTitle)
        setSearchArtist(trackArtist)
        setShowSearch(false)
    }, [trackTitle, trackArtist])

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

    const handleManualSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchLyrics(searchTitle, searchArtist, '', trackDuration)
        // We clear path here to force clean metadata search logic
    }

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
    const nextLine = (activeIndex !== -1 && activeIndex + 1 < lyrics.length) ? lyrics[activeIndex + 1] : null

    if (!visible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 9999, // Very high z-index to sit on top of everything
                    background: 'transparent', // Transparent background
                    pointerEvents: 'none', // Allow clicking through to app
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end', // Subtitle positioning
                    alignItems: 'center',
                    paddingBottom: '10vh', // Bottom 10-15%
                    fontFamily: '"Outfit", sans-serif',
                }}
            >
                {/* Controls (Clickable) */}
                <div style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    pointerEvents: 'auto', // Enable clicking buttons
                    display: 'flex',
                    gap: 10,
                    zIndex: 10000
                }}>
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        style={{
                            background: 'rgba(0,0,0,0.6)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {showSearch ? 'Close Search' : 'Search'}
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(0,0,0,0.6)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.2s'
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Search Panel (Clickable) */}
                {showSearch && (
                    <div style={{
                        position: 'absolute',
                        top: '20%',
                        background: 'rgba(0,0,0,0.85)',
                        padding: '30px',
                        borderRadius: '20px',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        width: '400px',
                        pointerEvents: 'auto',
                        zIndex: 10001
                    }}>
                        <h3 style={{ color: '#fff', margin: '0 0 20px 0' }}>Manual Search</h3>
                        <form onSubmit={handleManualSearch} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <input
                                value={searchTitle}
                                onChange={e => setSearchTitle(e.target.value)}
                                placeholder="Track Title"
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '16px'
                                }}
                            />
                            <input
                                value={searchArtist}
                                onChange={e => setSearchArtist(e.target.value)}
                                placeholder="Artist"
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '16px'
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    background: '#fff',
                                    color: '#000',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    marginTop: '10px'
                                }}
                            >
                                Search Lyrics
                            </button>
                        </form>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div style={{ color: '#fff', textShadow: '2px 2px 4px #000' }}>
                        Searching Lyrics...
                    </div>
                )}

                {/* Lyrics Display - Subtitle Style */}
                {!loading && !error && activeLine && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        width: '90%',
                        maxWidth: '1200px'
                    }}>
                        {/* Active Line (Big & Punchy) */}
                        <motion.div
                            key={activeLine.time} // Key change triggers animation
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            style={{
                                fontSize: '48px', // Large
                                fontWeight: 900,  // Bold
                                color: '#ffffff',
                                marginBottom: '16px',
                                // Heavy Stroke / Shadow for readability on ANY background
                                textShadow: `
                                 3px 3px 0 #000,
                                -1px -1px 0 #000,  
                                 1px -1px 0 #000,
                                -1px 1px 0 #000,
                                 1px 1px 0 #000
                               `,
                                WebkitTextStroke: '2px black', // Chrome/Safari stroke
                                lineHeight: 1.2
                            }}
                        >
                            {activeLine.text}
                        </motion.div>

                        {/* Next Line (Subtle Preview) */}
                        {nextLine && (
                            <motion.div
                                key={nextLine.time + 'next'}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                transition={{ duration: 0.5 }}
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    color: '#e0e0e0',
                                    textShadow: '2px 2px 0 #000',
                                    WebkitTextStroke: '1px black',
                                }}
                            >
                                {nextLine.text}
                            </motion.div>
                        )}
                    </div>
                )}

                {/* No Sync / Error State */}
                {(error || (!loading && lyrics.length === 0)) && (
                    <div style={{
                        color: 'rgba(255,255,255,0.5)',
                        textShadow: '1px 1px 2px #000',
                        fontSize: '18px'
                    }}>
                        {/* Empty state - keeps UI clean */}
                    </div>
                )}

            </motion.div>
        </AnimatePresence>
    )
}
