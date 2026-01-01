import React, { useState, useEffect } from 'react'
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

const ARTIST_NAMES = [
    '周杰倫', '林俊傑', '鄧紫棋', '陳奕迅', '五月天', '蔡依林', '周興哲', '張惠妹', '薛之謙', '李榮浩',
    '王力宏', '孫燕姿', '張學友', '劉德華', '莫文蔚', '田馥甄', '梁靜茹', '蔡健雅', '蕭敬騰', '林宥嘉',
    '楊丞琳', '羅志祥', '潘瑋柏', 'A-Lin', '王心凌', '伍佰', '徐佳瑩', '吳青峰', '蘇打綠', '告五人',
    '八三夭', '茄子蛋', '謝和弦', '盧廣仲', '韋禮安', '張韶涵', '動力火車', 'F.I.R.', 'Tank', '郭靜',
    '丁噹', '郁可唯', '華晨宇', '毛不易', '汪蘇瀧', '許嵩', '胡夏', '高爾宣', '瘦子E.SO', '玖壹壹'
]

const ArtistCard = ({ name, onClick }: { name: string, onClick: () => void }) => {
    const [img, setImg] = useState<string | null>(() => localStorage.getItem(`artist_img_v2_${name}`))

    useEffect(() => {
        if (img && img !== 'null' && !img.includes('ui-avatars')) return

        // Delay fetch slightly to avoid congestion if mounting many
        const timer = setTimeout(() => {
            window.ipcRenderer.getArtistImage(name).then(url => {
                if (url) {
                    setImg(url)
                    localStorage.setItem(`artist_img_v2_${name}`, url)
                } else {
                    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`
                    setImg(fallback)
                    localStorage.setItem(`artist_img_v2_${name}`, fallback)
                }
            })
        }, Math.random() * 2000) // Stagger requests

        return () => clearTimeout(timer)
    }, [name])

    return (
        <div className={styles.artistCard} onClick={onClick}>
            <img
                src={img || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`}
                alt={name}
                className={styles.artistImage}
                loading="lazy"
            />
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
