import React, { useState, useEffect, useRef } from 'react'
import { Search, Download, Loader2, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import styles from './Search.module.css'

interface SearchResult {
    id: string
    title: string
    artist: string
    duration: number
    thumbnail: string
    url: string
}

const ArtistCard = React.memo(({ name, onClick }: { name: string, onClick: () => void }) => {
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
            
            const delay = (name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 20) * 100
            await new Promise(r => setTimeout(r, delay))

            try {
                const url = await window.ipcRenderer.getArtistImage(name)
                if (url) {
                    setImg(url)
                    localStorage.setItem(`artist_img_v5_${name}`, url)
                } else {
                    
                    
                    const fallback = `https://tse2.mm.bing.net/th?q=${encodeURIComponent(name + ' 歌手')}&w=500&h=500&c=7&rs=1&p=0`
                    setImg(fallback)
                    localStorage.setItem(`artist_img_v5_${name}`, fallback)
                }
            } catch (e) {
                console.error(e)
                
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
                        
                        e.currentTarget.onerror = null 
                        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`
                        e.currentTarget.src = avatar
                        
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
})

const ARTIST_CATEGORIES = [
    {
        id: 'popular',
        name: '🔥 熱門推薦',
        artists: ['周杰倫', '林俊傑', '鄧紫棋', '陳奕迅', '五月天', '蔡依林', '張惠妹', '孫燕姿', '王力宏', '陶喆', '張學友', '劉德華', '郭富城', '黎明', '王菲', '莫文蔚', '那英', '林憶蓮', '李宗盛', '羅大佑', '周華健', '伍佰', '張信哲', '任賢齊', '許茹芸', '蘇慧倫', '徐懷鈺', '范曉萱', '李玟', '張雨生']
    },
    {
        id: 'pop',
        name: '🎤 流行金曲',
        artists: ['羅志祥', '楊丞琳', '潘瑋柏', '王心凌', '張韶涵', '林宥嘉', '蕭敬騰', '楊宗緯', '梁靜茹', '戴佩妮', '蔡健雅', '陳綺貞', '田馥甄', 'S.H.E', '陳嘉樺', '任家萱', '韋禮安', '盧廣仲', '徐佳瑩', '李榮浩', '薛之謙', '華晨宇', '毛不易', '汪蘇瀧', '許嵩', '胡夏', '郁可唯', '丁噹', '郭靜', '范瑋琪', '張懸', '安溥', '魏如萱', '家家', '紀家盈', '艾怡良', '岑寧兒', '李千娜', '曾沛慈', '李佳薇', '閻奕格', '陳勢安', '畢書盡', 'Bii', '朱俐靜', '林曉培', '温嵐', '周蕙', '許慧欣', '卓文萱', '江美琪', '侯湘婷', '林凡', '順子', '戴愛玲', 'A-Lin', '黃小琥']
    },
    {
        id: 'bands',
        name: '🎸 樂團組合',
        artists: ['動力火車', 'F.I.R.', '信樂團', '八三夭', '告五人', '茄子蛋', '滅火器', '美秀集團', '老王樂隊', '草東沒有派對', '理想混蛋', '宇宙人', '麋先生', '落日飛車', 'Deca Joins', '康士坦的變化球', '甜約翰', '怕胖團', 'TRASH', '南拳媽媽', '玖壹壹', '頑童MJ116', '兄弟本色', 'C.T.O', '五堅情', '九澤CP', '原子少年', 'Ozone', 'AcQUA源少年', 'U:NUS']
    },
    {
        id: 'hiphop',
        name: '🎧 潮流嘻哈',
        artists: ['周興哲', '高爾宣', '瘦子E.SO', 'ØZI', 'J.Sheon', '熊仔', '熱狗 MC HotDog', '蛋堡', '國蛋', '李英宏', 'Leo王', '春艷', '夜貓組', '9m88', 'Julia 吳卓源', '陳芳語', '孫盛希', 'Karencici', '壞特 ?te', '施語庭', '持修', '黃宣', '雷擎', '鶴 The Crane', 'LINION', '雷雨心', '法蘭', '洪佩瑜', '陳嫺靜', '乃萬', '萬妮達', 'Vava', 'GAI', '艾熱', '那吾克熱', '楊和蘇', '福克斯', '劉聰', 'KEY.L', '功夫胖', 'C-BLOCK', 'Higher Brothers', '馬思唯', 'KnowKnow', 'Masiwei', 'Tizzy T', '滿舒克', 'Jony J']
    },
    {
        id: 'classic',
        name: '📻 經典港台',
        artists: ['費玉清', '江蕙', '黃乙玲', '葉啓田', '陳雷', '蔡小虎', '翁立友', '龍千玉', '張秀卿', '黃妃', '蕭煌奇', '李聖傑', '林志炫', '彭佳慧', '辛曉琪', '萬芳', '趙傳', '齊秦', '齊豫', '潘越雲', '謝霆鋒', '陳小春', '古巨基', '鄭中基', '張智霖', '蘇永康', '許志安', '梁詠琪', '鄭秀文', '楊千嬅', '容祖兒', 'Twins', '蔡卓妍', '鍾欣潼', '鄧麗欣', '方力申', '薛凱琪', '衛蘭', '謝安琪', '泳兒']
    }
]

export const SearchView = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [page, setPage] = useState(1)
    const [selectedCategory, setSelectedCategory] = useState('popular')
    const PAGE_SIZE = 15

    const [previewSongId, setPreviewSongId] = useState<string | null>(null)
    const [previewLoading, setPreviewLoading] = useState<string | null>(null)
    const [previewCurrentTime, setPreviewCurrentTime] = useState(0)
    const [previewDuration, setPreviewDuration] = useState(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.onerror = null
                audioRef.current.src = ''
            }
        }
    }, [])

    const handlePreview = async (item: SearchResult) => {
        if (previewLoading) return

        if (previewSongId === item.id && audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play()
            } else {
                audioRef.current.pause()
                setPreviewSongId(null)
            }
            return
        }

        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.onerror = null
            audioRef.current.src = ''
            setPreviewSongId(null)
            setPreviewCurrentTime(0)
            setPreviewDuration(0)
        }
        
        setPreviewLoading(item.id)
        try {
            const data = await window.ipcRenderer.getYouTubePreview(item.url, item.title, item.artist)
            if (data && data.url) {
                const audio = new Audio(data.url)
                audio.currentTime = data.startTime
                audio.volume = 0.5 // Default preview volume
                
                audio.play().catch(e => {
                    console.warn("Audio play interrupted or failed:", e)
                    // Only alert if it's a real failure, not an abort error from switching
                    if (e.name !== 'AbortError') {
                        setPreviewSongId(null)
                        setPreviewCurrentTime(0)
                        alert("部分連結可能需要等待或暫時無法播放")
                    }
                })
                
                audioRef.current = audio
                setPreviewSongId(item.id)
                audio.ontimeupdate = () => setPreviewCurrentTime(audio.currentTime)
                audio.ondurationchange = () => setPreviewDuration(audio.duration)
                audio.onended = () => {
                    setPreviewSongId(null)
                    setPreviewCurrentTime(0)
                }
                audio.onerror = (e) => {
                    console.error("Audio Load Error:", e)
                    const errStatus = audio.error
                    if (errStatus && errStatus.code !== 4) { // Ignore MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED on empty src
                        setPreviewSongId(null)
                        setPreviewCurrentTime(0)
                        // Removed alert to prevent annoying popups; rely on UI state instead
                    }
                }
            } else {
                alert("無法獲取試聽連結")
            }
        } catch(e) {
             console.error(e)
             alert("試聽失敗")
        } finally {
            setPreviewLoading(null)
        }
    }

    const handleSearch = async (overrideQuery?: string) => {
        if (isLoading) return

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
            const format = localStorage.getItem('neonwave_download_format') || 'm4a'
            const savedPath = await window.ipcRenderer.downloadYouTube(track.url, track.title, track.artist, format)
            if (savedPath) {
                alert(`✅ 下載完成！\n已儲存至：\n${savedPath}`)
            }
        } catch (e: any) {
            console.error(e)
            alert(`❌ 下載失敗：\n${e.message || '未知錯誤'}`)
        }
    }

    
    const [filterMode, setFilterMode] = useState<'all' | 'official'>('all')
    const [showFilterMenu, setShowFilterMenu] = useState(false)

    
    const filteredResults = results.filter(item => {
        if (filterMode === 'all') return true

        const t = item.title.toLowerCase()
        const a = item.artist.toLowerCase()

        
        const badKeywords = ['cover', '翻唱', 'remix', 'live', '現場', 'concert', 'karaoke', 'instrumental', '伴奏', 'nightcore', 'hour loop', '1 hour', 'reaction']
        if (badKeywords.some(w => t.includes(w))) return false

        
        
        
        

        const goodKeywords = ['official', 'mv', 'music video', 'lyric', 'audio']
        if (goodKeywords.some(w => t.includes(w))) return true
        if (a.includes('topic') || a.includes('vevo')) return true

        
        
        
        return false
    })

    
    const totalPages = Math.ceil(filteredResults.length / PAGE_SIZE)
    const currentResults = filteredResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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

                {/* Filter Dropdown */}
                <div style={{ position: 'relative' }}>
                    <button
                        className={`${styles.searchBtn} ${styles.iconBtn}`}
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        style={{ background: filterMode !== 'all' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', color: filterMode !== 'all' ? '#000' : '#fff' }}
                        title="篩選器"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    </button>

                    {showFilterMenu && (
                        <div style={{
                            position: 'absolute', top: '110%', right: 0,
                            background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px', padding: '8px', zIndex: 200,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)', minWidth: '180px'
                        }}>
                            <div style={{ padding: '8px 12px', color: '#888', fontSize: '12px' }}>音樂類型</div>
                            {[
                                { id: 'all', label: '全部結果 (All)' },
                                { id: 'official', label: '官方/有歌詞 (Official)' }
                            ].map(opt => (
                                <div
                                    key={opt.id}
                                    onClick={() => { setFilterMode(opt.id as any); setShowFilterMenu(false); setPage(1); }}
                                    style={{
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        background: filterMode === opt.id ? 'var(--accent-primary)' : 'transparent',
                                        color: filterMode === opt.id ? '#000' : '#fff',
                                        fontSize: '14px',
                                        marginBottom: '4px'
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

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
                        <div className={styles.tabsContainer}>
                            {ARTIST_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`${styles.tab} ${selectedCategory === cat.id ? styles.tabActive : ''}`}
                                    onClick={() => setSelectedCategory(cat.id)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                        <div className={styles.artistGrid}>
                            {(ARTIST_CATEGORIES.find(cat => cat.id === selectedCategory)?.artists || []).map(name => (
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
                            {previewSongId === item.id && previewDuration > 0 && (
                                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--accent-primary)', minWidth: '35px' }}>{formatDuration(Math.floor(previewCurrentTime))}</span>
                                    <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', background: 'var(--accent-primary)', width: `${(previewCurrentTime / previewDuration) * 100}%`, transition: 'width 0.1s linear' }} />
                                    </div>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDuration(Math.floor(previewDuration))}</span>
                                </div>
                            )}
                        </div>
                        <div className={styles.actions}>
                            <button
                                className={styles.actionBtn}
                                onClick={() => handlePreview(item)}
                                title="試聽最熱門片段"
                                style={{ background: previewSongId === item.id ? 'var(--accent-primary)' : '', color: previewSongId === item.id ? '#000' : '' }}
                            >
                                {previewLoading === item.id ? <Loader2 size={18} className="animate-spin" /> : 
                                 previewSongId === item.id ? <Pause size={18} /> : <Play size={18} />}
                            </button>
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

                {!isLoading && hasSearched && filteredResults.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                        {results.length > 0 ? '沒有符合篩選條件的歌曲' : '找不到相關歌曲'}
                    </div>
                )}

                {/* Pagination Controls */}
                {hasSearched && filteredResults.length > 0 && (
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
