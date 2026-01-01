import React, { useState } from 'react'
import { Search, Download, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Search.module.css'

interface SearchResult {
    id: string
    title: string
    artist: string
    duration: number
    thumbnail: string
    url: string
}

const RECOMMENDED_ARTISTS = [
    { name: '周杰倫', img: 'https://ui-avatars.com/api/?name=Jay+Chou&background=00fff2&color=000&size=200' },
    { name: '林俊傑', img: 'https://ui-avatars.com/api/?name=JJ+Lin&background=ff00ff&color=fff&size=200' },
    { name: '鄧紫棋', img: 'https://ui-avatars.com/api/?name=GEM&background=random&size=200' },
    { name: '陳奕迅', img: 'https://ui-avatars.com/api/?name=Eason&background=random&size=200' },
    { name: '五月天', img: 'https://ui-avatars.com/api/?name=Mayday&background=random&size=200' },
    { name: '蔡依林', img: 'https://ui-avatars.com/api/?name=Jolin&background=random&size=200' },
    { name: '周興哲', img: 'https://ui-avatars.com/api/?name=Eric&background=random&size=200' },
    { name: '張惠妹', img: 'https://ui-avatars.com/api/?name=A-Mei&background=random&size=200' },
    { name: '薛之謙', img: 'https://ui-avatars.com/api/?name=Joker&background=random&size=200' },
    { name: '李榮浩', img: 'https://ui-avatars.com/api/?name=Li&background=random&size=200' },
]

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

    const handleDownload = (track: SearchResult) => {
        alert(`準備下載: ${track.title}\n(此功能將在下一版本實裝)`)
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
                            {RECOMMENDED_ARTISTS.map(artist => (
                                <div
                                    key={artist.name}
                                    className={styles.artistCard}
                                    onClick={() => handleSearch(artist.name)}
                                >
                                    <img src={artist.img} alt={artist.name} className={styles.artistImage} />
                                    <span className={styles.artistName}>{artist.name}</span>
                                </div>
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
