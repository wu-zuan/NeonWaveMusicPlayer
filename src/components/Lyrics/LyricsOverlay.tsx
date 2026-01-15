import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mic2, Loader2, Search as SearchIcon } from 'lucide-react'
import { parseLrc, LyricLine, getCurrentLineIndex } from '../../utils/lrcParser'

interface LyricsOverlayProps {
    visible: boolean
    onClose: () => void
    trackTitle: string
    trackArtist: string
    trackPath?: string
    trackArtwork?: string
    currentTime: number
}

export const LyricsOverlay: React.FC<LyricsOverlayProps> = ({
    visible, onClose, trackTitle, trackArtist, trackPath, trackArtwork, currentTime
}) => {
    const [lyrics, setLyrics] = useState<LyricLine[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [searchTitle, setSearchTitle] = useState(trackTitle)
    const [searchArtist, setSearchArtist] = useState(trackArtist)

    const scrollRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(-1)

    // Init search fields when track changes
    useEffect(() => {
        setSearchTitle(trackTitle)
        setSearchArtist(trackArtist)
        setShowSearch(false)
    }, [trackTitle, trackArtist])

    // Auto-scroll effect
    useEffect(() => {
        if (showSearch) return // Don't scroll when searching
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
    }, [currentTime, lyrics, showSearch])

    const fetchLyrics = async (title: string, artist: string, path: string = '') => {
        setLoading(true)
        setError(false)
        setLyrics([])
        try {
            const rawLrc = await window.ipcRenderer.getLyrics(title, artist, path)
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
        fetchLyrics(trackTitle, trackArtist, trackPath)
    }, [trackTitle, trackArtist, trackPath, visible])

    const handleManualSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchLyrics(searchTitle, searchArtist)
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
                        position: 'fixed', inset: 0, zIndex: 1000,
                        backgroundColor: '#000',
                        overflow: 'hidden',
                        display: 'flex', flexDirection: 'column'
                    }}
                >
                    {/* Background Artwork Blur */}
                    {trackArtwork ? (
                        <div style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: `url(${trackArtwork})`,
                            backgroundSize: 'cover', backgroundPosition: 'center',
                            filter: 'blur(60px) brightness(0.4)',
                            transform: 'scale(1.2)', // Scale up to hide blur edges
                            zIndex: 0
                        }} />
                    ) : (
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'radial-gradient(circle at 50% 30%, #2a2a2a, #000)',
                            zIndex: 0
                        }}>
                            <div style={{
                                position: 'absolute', bottom: '-10%', left: '-10%', width: '50vw', height: '50vw',
                                background: 'radial-gradient(circle, rgba(0,255,255,0.1), transparent 70%)',
                                filter: 'blur(80px)', pointerEvents: 'none'
                            }} />
                            <div style={{
                                position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw',
                                background: 'radial-gradient(circle, rgba(255,0,255,0.1), transparent 70%)',
                                filter: 'blur(80px)', pointerEvents: 'none'
                            }} />
                        </div>
                    )}

                    {/* Header */}
                    <div style={{
                        position: 'relative', // Ensure zIndex works
                        padding: '40px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        zIndex: 20, // Higher than before
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)'
                    }}>
                        <div style={{ opacity: 0.9, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: '#fff', letterSpacing: '-0.5px' }}>
                                {showSearch ? '搜尋歌詞' : trackTitle}
                            </h2>
                            <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                                {showSearch ? '手動輸入歌名與演出者' : trackArtist}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', WebkitAppRegion: 'no-drag' } as any}>
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                style={{
                                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '50%',
                                    width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#fff', transition: 'all 0.2s',
                                    zIndex: 30
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                title="修正歌詞"
                            >
                                <SearchIcon size={22} />
                            </button>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '50%',
                                    width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#fff', transition: 'all 0.2s',
                                    zIndex: 30
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            >
                                <X size={26} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        style={{
                            position: 'relative', // Ensure zIndex works
                            flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', scrollbarWidth: 'none',
                            padding: showSearch ? '100px 0' : '45vh 0', // Start padding to center first line
                            zIndex: 10,
                            maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
                        }}
                        className="lyrics-container"
                        ref={scrollRef}
                    >
                        {showSearch ? (
                            <form onSubmit={handleManualSearch} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '360px', zIndex: 20 }}>
                                <input
                                    value={searchTitle}
                                    onChange={e => setSearchTitle(e.target.value)}
                                    placeholder="歌名"
                                    style={{
                                        padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)',
                                        background: 'rgba(0,0,0,0.6)', color: '#fff', outline: 'none', fontSize: '16px',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                />
                                <input
                                    value={searchArtist}
                                    onChange={e => setSearchArtist(e.target.value)}
                                    placeholder="演出者"
                                    style={{
                                        padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)',
                                        background: 'rgba(0,0,0,0.6)', color: '#fff', outline: 'none', fontSize: '16px',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        padding: '16px', borderRadius: '12px',
                                        background: 'var(--accent-primary)', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer',
                                        fontSize: '16px', letterSpacing: '0.5px'
                                    }}
                                >
                                    {loading ? '搜尋中...' : '搜尋'}
                                </button>
                            </form>
                        ) : (
                            <>
                                {loading && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: '#fff', opacity: 0.8 }}>
                                        <Loader2 size={48} className="animate-spin" />
                                        <span style={{ fontSize: '18px', fontWeight: 500 }}>正在搜尋歌詞...</span>
                                    </div>
                                )}

                                {!loading && error && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', color: '#fff', opacity: 0.6 }}>
                                        <Mic2 size={64} style={{ opacity: 0.5 }} />
                                        <div style={{ fontSize: '22px', fontWeight: 600 }}>找不到同步歌詞</div>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <button
                                                onClick={() => {
                                                    setSearchTitle(trackTitle);
                                                    setShowSearch(true)
                                                }}
                                                style={{
                                                    padding: '10px 24px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)',
                                                    background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer',
                                                    fontSize: '16px', fontWeight: 500
                                                }}
                                            >
                                                手動搜尋
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {!loading && !error && lyrics.map((line, i) => {
                                    const isActive = i === activeIndex
                                    const isPast = i < activeIndex
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={false}
                                            animate={{
                                                scale: isActive ? 1.05 : 1,
                                                opacity: isActive ? 1 : isPast ? 0.3 : 0.4,
                                                filter: isActive ? 'blur(0px)' : 'blur(1px)',
                                                y: isActive ? 0 : 0,
                                                color: isActive ? '#fff' : '#ccc'
                                            }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            style={{
                                                margin: '20px 0',
                                                textAlign: 'center',
                                                maxWidth: '90%',
                                                padding: '4px 30px',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                zIndex: 1
                                            }}
                                            onClick={() => {
                                                // Optional: seek to this line
                                            }}
                                        >
                                            <span style={{
                                                fontSize: isActive ? '42px' : '28px',
                                                fontWeight: isActive ? 800 : 600,
                                                lineHeight: 1.3,
                                                letterSpacing: '-0.02em',
                                                display: 'inline-block',
                                                textShadow: isActive ? '0 4px 24px rgba(0,0,0,0.5)' : 'none',
                                                transformOrigin: 'center center'
                                            }}>
                                                {line.text}
                                            </span>
                                        </motion.div>
                                    )
                                })}
                            </>
                        )}
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    )
}
