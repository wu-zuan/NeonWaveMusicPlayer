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
    currentTime: number
}

export const LyricsOverlay: React.FC<LyricsOverlayProps> = ({
    visible, onClose, trackTitle, trackArtist, trackPath, currentTime
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
                        background: 'radial-gradient(circle at 50% 30%, rgba(20, 20, 40, 0.95), #000)',
                        backdropFilter: 'blur(30px)',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden'
                    }}
                >
                    {/* Header */}
                    <div style={{ padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                        <div style={{ opacity: 0.8 }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#fff' }}>
                                {showSearch ? '搜尋歌詞' : trackTitle}
                            </h2>
                            <div style={{ fontSize: '16px', color: 'var(--accent-primary)', marginTop: '4px' }}>
                                {showSearch ? '手動輸入歌名與演出者' : trackArtist}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                style={{
                                    background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                                    width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#fff'
                                }}
                                title="修正歌詞"
                            >
                                <SearchIcon size={20} />
                            </button>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                                    width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#fff'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        style={{
                            flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', scrollbarWidth: 'none', padding: showSearch ? '100px 0' : '50vh 0',
                        }}
                        className="lyrics-container"
                        ref={scrollRef}
                    >
                        {showSearch ? (
                            <form onSubmit={handleManualSearch} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px', zIndex: 20 }}>
                                <input
                                    value={searchTitle}
                                    onChange={e => setSearchTitle(e.target.value)}
                                    placeholder="歌名"
                                    style={{
                                        padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(0,0,0,0.5)', color: '#fff', outline: 'none'
                                    }}
                                />
                                <input
                                    value={searchArtist}
                                    onChange={e => setSearchArtist(e.target.value)}
                                    placeholder="演出者"
                                    style={{
                                        padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(0,0,0,0.5)', color: '#fff', outline: 'none'
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        padding: '12px', borderRadius: '8px',
                                        background: 'var(--accent-primary)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer'
                                    }}
                                >
                                    {loading ? '搜尋中...' : '搜尋'}
                                </button>
                            </form>
                        ) : (
                            <>
                                {loading && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#fff', opacity: 0.7 }}>
                                        <Loader2 size={40} className="animate-spin" />
                                        正在搜尋歌詞...
                                    </div>
                                )}

                                {!loading && error && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', color: '#fff', opacity: 0.5 }}>
                                        <Mic2 size={40} />
                                        <div style={{ fontSize: '18px' }}>找不到同步歌詞</div>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button
                                                onClick={() => {
                                                    setSearchTitle(trackTitle);
                                                    setShowSearch(true)
                                                }}
                                                style={{
                                                    padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)',
                                                    background: 'transparent', color: '#fff', cursor: 'pointer'
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
                                                scale: isActive ? 1.2 : 1,
                                                opacity: isActive ? 1 : isPast ? 0.4 : 0.6,
                                                filter: isActive ? 'blur(0px)' : 'blur(1.5px)',
                                                y: isActive ? 0 : 0,
                                                color: isActive ? '#fff' : '#aaa'
                                            }}
                                            transition={{ duration: 0.5 }}
                                            style={{
                                                margin: '24px 0', textAlign: 'center', maxWidth: '80%', padding: '0 20px',
                                                cursor: 'pointer', position: 'relative', zIndex: 1
                                            }}
                                            onClick={() => {
                                                // Optional: seek to this line
                                            }}
                                        >
                                            <span style={{
                                                fontSize: isActive ? '36px' : '24px', fontWeight: 700, lineHeight: 1.4,
                                                textShadow: isActive ? '0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.4)' : 'none',
                                                transition: 'font-size 0.5s ease'
                                            }}>
                                                {line.text}
                                            </span>
                                        </motion.div>
                                    )
                                })}
                            </>
                        )}
                    </div>

                    {/* Background decorations */}
                    <div style={{
                        position: 'absolute', bottom: '-10%', left: '-10%', width: '50vw', height: '50vw',
                        background: 'radial-gradient(circle, rgba(0,255,255,0.1), transparent 70%)',
                        filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0
                    }} />
                    <div style={{
                        position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw',
                        background: 'radial-gradient(circle, rgba(255,0,255,0.1), transparent 70%)',
                        filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0
                    }} />

                </motion.div>
            )}
        </AnimatePresence>
    )
}
