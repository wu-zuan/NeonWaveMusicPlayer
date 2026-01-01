import React, { useState, useEffect, useRef } from 'react'
import { Search, Download, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Search.module.css'
import { ARTIST_NAMES } from '../../data/artists'

interface SearchResult {
    id: string
    title: string
    artist: string
    duration: number
    thumbnail: string
    url: string
}

const ArtistCard = ({ name, onClick }: { name: string, onClick: () => void }) => {
    const [img, setImg] = useState<string | null>(() => localStorage.getItem(`artist_img_v5_${name}`))
    const [isVisible, setIsVisible] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (img) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { rootMargin: '100px' }
        )

        if (cardRef.current) observer.observe(cardRef.current)

        return () => observer.disconnect()
    }, [img])

    useEffect(() => {
        if (!isVisible || img) return

        const fetchImage = async () => {
            // Hash-based delay to stagger requests
            const delay = (name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 20) * 100
            await new Promise(r => setTimeout(r, delay))

            try {
                const url = await window.ipcRenderer.getArtistImage(name)
                if (url) {
                    setImg(url)
                    localStorage.setItem(`artist_img_v5_${name}`, url)
                } else {
                    // Try Bing Images as a "Premium" fallback
                    // Adding "歌手" to ensure we get an artist image, not a generic word result (e.g. for "同理")
                    const fallback = `https://tse2.mm.bing.net/th?q=${encodeURIComponent(name + ' 歌手')}&w=500&h=500&c=7&rs=1&p=0`
                    setImg(fallback)
                    localStorage.setItem(`artist_img_v5_${name}`, fallback)
                }
            } catch (e) {
                console.error(e)
                // If IPC fails, also try fallback
                const fallback = `https://tse2.mm.bing.net/th?q=${encodeURIComponent(name + ' 歌手')}&w=500&h=500&c=7&rs=1&p=0`
                setImg(fallback)
            }
        }
        fetchImage()
    }, [isVisible, name, img])

    return (
        <div ref={cardRef} className={styles.artistCard} onClick={onClick}>
            {img ? (
                <img
                    src={img}
                    alt={name}
                    className={styles.artistImage}
                    loading="lazy"
                    onError={(e) => {
                        // If Bing image fails (404), fallback to UI Avatars
                        e.currentTarget.onerror = null // prevent loop
                        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`
                        e.currentTarget.src = avatar
                        // Optionally update cache, but simple fallback is enough for runtime
                    }}
                />
            ) : (
                <div className={styles.artistImage} style={{ background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader2 size={24} className="animate-spin" style={{ opacity: 0.5 }} />
                </div>
            )}
            <span className={styles.artistName}>{name}</span>
        </div>
    )
}

export const SearchView = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [page, setPage] = useState(1)
    const PAGE_SIZE = 15

    const handleSearch = async (overrideQuery?: string) => {
        const q = overrideQuery ?? query
        if (!q.trim()) return

        setIsLoading(true)
        setHasSearched(true)
        setPage(1) // Reset to page 1
        if (overrideQuery) setQuery(overrideQuery)

        try {
            const res = await window.ipcRenderer.searchYouTube(q)
            setResults(res)
        } catch (e) {
            console.error("Search failed:", e)
            alert("搜尋失敗，請稍後再試。")
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    const handleDownload = async (track: SearchResult) => {
        const confirm = window.confirm(`是否下載：\n${track.title}\n${track.artist}\n此過程可能需要一些時間...`)
        if (!confirm) return

        try {
            const savedPath = await window.ipcRenderer.downloadYouTube(track.url, track.title)
            if (savedPath) {
                alert(`✅ 下載完成！\n已儲存至：\n${savedPath}`)
            }
        } catch (e) {
            console.error(e)
            alert("❌ 下載失敗，請稍後再試。")
        }
    }

    // Pagination Logic
    const totalPages = Math.ceil(results.length / PAGE_SIZE)
    const currentResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return (
        <div className={styles.container}>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="搜尋歌曲、演出者..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        if (e.target.value === '') {
                            setHasSearched(false)
                            setResults([])
                        }
                    }}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className={styles.searchBtn}
                    onClick={() => handleSearch()}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                    搜尋
                </button>
            </div>

            {/* Content Area */}
            <div className={styles.results}>
                {/* Home View: Artist Recommendations */}
                {!hasSearched && !isLoading && (
                    <div>
                        <h2 className={styles.sectionTitle}>💎 華語歌手推薦</h2>
                        <div className={styles.artistGrid}>
                            {ARTIST_NAMES.map(name => (
                                <ArtistCard
                                    key={name}
                                    name={name}
                                    onClick={() => handleSearch(name)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Results List */}
                {hasSearched && currentResults.map(item => (
                    <div key={item.id} className={styles.resultItem}>
                        <img src={item.thumbnail} alt={item.title} className={styles.thumbnail} />
                        <div className={styles.info}>
                            <div className={styles.title}>{item.title}</div>
                            <div className={styles.artist}>{item.artist}</div>
                            <div className={styles.meta}>時長: {formatDuration(item.duration)}</div>
                        </div>
                        <div className={styles.actions}>
                            <button
                                className={styles.actionBtn}
                                onClick={() => handleDownload(item)}
                                title="下載"
                            >
                                <Download size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {!isLoading && hasSearched && results.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                        找不到相關歌曲
                    </div>
                )}

                {/* Pagination Controls */}
                {hasSearched && results.length > 0 && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.pageBtn}
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            <ChevronLeft size={16} /> 上一頁
                        </button>
                        <span className={styles.pageInfo}>第 {page} 頁 / 共 {totalPages} 頁</span>
                        <button
                            className={styles.pageBtn}
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        >
                            下一頁 <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
