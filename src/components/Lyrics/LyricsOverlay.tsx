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
    const [lyrics, setLyrics] = useState<LyricLine[]>([])

    const scrollRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(-1)

    const [statusMsg, setStatusMsg] = useState<string | null>(null)

    // Status Toast Helper
    const showStatus = (msg: string) => {
        setStatusMsg(msg)
        setTimeout(() => setStatusMsg(null), 3000)
    }

    // "Lyrics: ON" indicator when toggled visible
    useEffect(() => {
        if (visible) {
            showStatus("Lyrics Mode: ON")
        }
    }, [visible])

    // Check if we have valid synced timestamps (at least some lines > 0s)
    // If all are 0, it's likely plain text passed with dummy timestamps
    const isSynced = React.useMemo(() => lyrics.some(l => l.time > 0), [lyrics])


    // Auto-scroll effect
    useEffect(() => {
        if (!isSynced) return // Don't scroll when unsynced

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
    }, [currentTime, lyrics, isSynced])

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
        showStatus(`Searching: ${title}...`)
        try {
            const rawLrc = await window.ipcRenderer.getLyrics(title, artist, path, duration)
            if (rawLrc) {
                const parsed = parseLrc(rawLrc)
                if (parsed.length > 0) {
                    setLyrics(parsed)
                    showStatus("Synced Lyrics Loaded")
                } else {
                    setError(true)
                    showStatus("No Synced Lyrics Found")
                }
            } else {
                setError(true)
                showStatus("No Synced Lyrics Found")
            }
        } catch (e) {
            console.error(e)
            setError(true)
            showStatus("Error Loading Lyrics")
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
                {/* Status / Feedback Toast (Top Center) */}
                <AnimatePresence>
                    {(statusMsg || loading) && (
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            style={{
                                position: 'absolute', top: '10%',
                                color: '#fff',
                                background: 'rgba(0,0,0,0.6)',
                                padding: '8px 16px', borderRadius: '20px',
                                fontSize: '14px', fontWeight: 600,
                                backdropFilter: 'blur(4px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            {loading && <div className="animate-spin" style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />}
                            {loading ? 'Searching...' : statusMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* The "Subtitle Block" Style */}
                {/* Shows Active Line + Next Line Preview used in many modern players/Karoke */}
                {!loading && !error && (
                    <div style={{
                        width: '100%',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px' // Gap between current and next
                    }}>
                        {/* Current Line */}
                        <motion.div
                            key={activeLine ? activeLine.time : 'empty'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            style={{
                                fontSize: 'min(56px, 7vw)',
                                fontWeight: 900,
                                color: '#fff',
                                textShadow: `
                                 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000,
                                 2px 0px 0 #000, 0px 2px 0 #000, -2px 0px 0 #000, 0px -2px 0 #000,
                                 0 4px 10px rgba(0,0,0,0.5)
                               `,
                                WebkitTextStroke: '1.5px black',
                                lineHeight: 1.1,
                                padding: '0 20px',
                                maxWidth: '90%'
                            }}
                        >
                            {activeLine ? activeLine.text : (
                                <span style={{ opacity: 0.5, fontSize: '32px' }}>...</span>
                            )}
                        </motion.div>

                        {/* Next Line Preview (Context) */}
                        {activeIndex !== -1 && activeIndex + 1 < lyrics.length && (
                            <motion.div
                                key={lyrics[activeIndex + 1].time}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                style={{
                                    fontSize: 'min(32px, 4vw)',
                                    fontWeight: 700,
                                    color: 'rgba(255,255,255,0.8)',
                                    textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 0 2px 4px rgba(0,0,0,0.5)',
                                    WebkitTextStroke: '1px black',
                                    marginTop: '4px'
                                }}
                            >
                                {lyrics[activeIndex + 1].text}
                            </motion.div>
                        )}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}
