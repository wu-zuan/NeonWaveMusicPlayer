import React, { useState } from 'react'
import { Search, Download, Loader2 } from 'lucide-react'
import styles from './Search.module.css'

interface SearchResult {
    id: string
    title: string
    artist: string
    duration: number
    thumbnail: string
    url: string
}

export const SearchView = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = async () => {
        if (!query.trim()) return
        setIsLoading(true)
        try {
            const res = await window.ipcRenderer.searchYouTube(query)
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
        // TODO: Implement download IPC
    }

    return (
        <div className={styles.container}>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="搜尋歌曲、演出者..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className={styles.searchBtn}
                    onClick={handleSearch}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                    搜尋
                </button>
            </div>

            <div className={styles.results}>
                {results.map(item => (
                    <div key={item.id} className={styles.resultItem}>
                        <img src={item.thumbnail} alt={item.title} className={styles.thumbnail} />
                        <div className={styles.info}>
                            <div className={styles.title}>{item.title}</div>
                            <div className={styles.artist}>{item.artist}</div>
                            <div className={styles.meta}>時長: {formatDuration(item.duration)}</div>
                        </div>
                        <div className={styles.actions}>
                            {/* <button className={styles.actionBtn} title="試聽">
                                <Play size={18} />
                            </button> */}
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

                {!isLoading && results.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                        請輸入關鍵字開始搜尋
                    </div>
                )}
            </div>
        </div>
    )
}
