import React, { useEffect, useState } from 'react'
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

    const [activeIndex, setActiveIndex] = useState(-1)
    const [statusMsg, setStatusMsg] = useState<string | null>(null)

    
    const showStatus = (msg: string) => {
        setStatusMsg(msg)
        setTimeout(() => setStatusMsg(null), 3000)
    }

    
    useEffect(() => {
        if (visible) {
            showStatus("歌詞模式: 開啟")
        }
    }, [visible])

    
    const isSynced = React.useMemo(() => lyrics.some(l => l.time > 0), [lyrics])

    
    useEffect(() => {
        if (!isSynced) return

        const idx = getCurrentLineIndex(lyrics, currentTime)
        if (idx !== activeIndex) {
            setActiveIndex(idx)
        }
    }, [currentTime, lyrics, isSynced])

    
    useEffect(() => {
        if (!isSynced) {
            setActiveIndex(-1)
        }
    }, [lyrics, isSynced])

    const fetchLyrics = async (title: string, artist: string, path: string = '', duration: number = 0) => {
        setLoading(true)
        setError(false)
        setLyrics([])
        showStatus(`搜尋中: ${title}...`)
        try {
            const rawLrc = await window.ipcRenderer.getLyrics(title, artist, path, duration)
            if (rawLrc) {
                const parsed = parseLrc(rawLrc)
                if (parsed.length > 0) {
                    setLyrics(parsed)
                    showStatus("已載入同步歌詞")
                } else {
                    setError(true)
                    showStatus("未找到同步歌詞")
                }
            } else {
                setError(true)
                showStatus("未找到同步歌詞")
            }
        } catch (e) {
            console.error(e)
            setError(true)
            showStatus("載入歌詞時發生錯誤")
        } finally {
            setLoading(false)
        }
    }

    
    useEffect(() => {
        if (!visible || !trackTitle) return
        fetchLyrics(trackTitle, trackArtist, trackPath, trackDuration)
    }, [trackTitle, trackArtist, trackPath, visible, trackDuration])

    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && visible) {
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [visible, onClose])

    
    
    interface DanmakuItem {
        id: string
        text: string
        top: number 
        duration: number
        color: string
        size: number
    }

    const [danmakuItems, setDanmakuItems] = useState<DanmakuItem[]>([])

    
    useEffect(() => {
        setDanmakuItems([])
    }, [trackTitle, visible, isSynced])

    
    useEffect(() => {
        if (!visible || activeIndex === -1 || !lyrics[activeIndex]) return

        const currentLine = lyrics[activeIndex]

        
        

        const colors = ['#ffffff', '#00fff2', '#ff00ff', '#f8fafc']
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        const randomTop = Math.floor(Math.random() * 80) + 10 
        const randomDuration = Math.random() * 5 + 8 
        const randomSize = Math.random() * 1.5 + 2 

        const newItem: DanmakuItem = {
            id: `${currentLine.time}-${Date.now()}`,
            text: currentLine.text,
            top: randomTop,
            duration: randomDuration,
            color: randomColor,
            size: randomSize
        }

        setDanmakuItems(prev => {
            const next = [...prev, newItem]
            // Cap at 8 concurrent items to prevent GPU overload
            return next.length > 8 ? next.slice(-8) : next
        })

    }, [activeIndex, lyrics, visible])

    const handleAnimationComplete = (id: string) => {
        setDanmakuItems(prev => prev.filter(item => item.id !== id))
    }

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
                    zIndex: 9999,
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    background: 'rgba(0,0,0,0.3)', 
                    fontFamily: '"Outfit", sans-serif',
                }}
            >
                { }
                <AnimatePresence>
                    {(statusMsg || loading) && (
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            style={{
                                position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)',
                                color: '#fff',
                                background: 'rgba(0,0,0,0.6)',
                                padding: '8px 16px', borderRadius: '20px',
                                fontSize: '14px', fontWeight: 600,
                                backdropFilter: 'blur(4px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                zIndex: 100
                            }}
                        >
                            {loading && <div className="animate-spin" style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />}
                            {loading ? '搜尋中...' : statusMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Danmaku Items */}
                {danmakuItems.map(item => (
                    <motion.div
                        key={item.id}
                        initial={{ x: '100vw' }}
                        animate={{ x: '-100vw' }}
                        transition={{
                            duration: item.duration,
                            ease: "linear"
                        }}
                        onAnimationComplete={() => handleAnimationComplete(item.id)}
                        style={{
                            position: 'absolute',
                            top: `${item.top}%`,
                            whiteSpace: 'nowrap',
                            fontSize: `${item.size}rem`,
                            fontWeight: 900,
                            color: item.color,
                            textShadow: `
                                2px 2px 0 #000, -1px -1px 0 #000, 
                                0 0 10px ${item.color}
                            `,
                            WebkitTextStroke: '1px rgba(0,0,0,0.5)',
                            willChange: 'transform'
                        }}
                    >
                        {item.text}
                    </motion.div>
                ))}

                { }
                {error && danmakuItems.length === 0 && (
                    <div style={{ position: 'absolute', bottom: '10%', width: '100%', textAlign: 'center', opacity: 0.5 }}>
                        未找到歌詞
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}
