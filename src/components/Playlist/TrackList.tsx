import React, { useState, useRef, useEffect } from 'react'
import { List, useListRef } from 'react-window'
import { Search } from 'lucide-react'
import { TrackItem } from './TrackItem'
import styles from './Playlist.module.css'
import { Track } from '../../hooks/useAudioPlayer'

interface TrackListProps {
    title?: string
    tracks: Track[]
    currentTrack: Track | null
    onPlay: (track: Track) => void
    onToggleFavorite?: (track: Track) => void
    favorites?: Track[]
}

const ITEM_HEIGHT = 56

export const TrackList: React.FC<TrackListProps> = ({
    title = '音樂庫', tracks, currentTrack, onPlay, onToggleFavorite, favorites = []
}) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [matches, setMatches] = useState<number[]>([])
    const [currentMatchIdx, setCurrentMatchIdx] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const listRef = useListRef() as any
    const [listHeight, setListHeight] = useState(600)

    // Measure container height for virtualized list
    useEffect(() => {
        const measure = () => {
            if (containerRef.current) {
                // Subtract header height (~90px) from container
                const rect = containerRef.current.getBoundingClientRect()
                setListHeight(Math.max(200, rect.height - 90))
            }
        }
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value.toLowerCase()
        setSearchQuery(q)
        if (!q) {
            setMatches([])
            return
        }

        const newMatches: number[] = []
        tracks.forEach((t, i) => {
            if (t.title.toLowerCase().includes(q) || (t.artist && t.artist.toLowerCase().includes(q))) {
                newMatches.push(i)
            }
        })

        setMatches(newMatches)
        setCurrentMatchIdx(0)

        if (newMatches.length > 0) {
            scrollToMatch(newMatches[0])
        }
    }

    const scrollToMatch = (index: number) => {
        listRef.current?.scrollToRow({ index, align: 'center' })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && matches.length > 0) {
            const nextIdx = (currentMatchIdx + 1) % matches.length
            setCurrentMatchIdx(nextIdx)
            scrollToMatch(matches[nextIdx])
        }
    }

    if (tracks.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <p>這個列表是空的。</p>
                </div>
            </div>
        )
    }

    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const track = tracks[index]
        const isFav = favorites.some(f => f.path === track.path)
        const isActive = currentTrack?.path === track.path

        // Optimization: Use currentTrack's artwork for the active item
        const displayTrack = (isActive && currentTrack?.artwork)
            ? { ...track, artwork: currentTrack.artwork }
            : track

        return (
            <TrackItem
                style={style}
                key={track.path}
                id={`track-item-${index}`}
                track={displayTrack}
                isActive={isActive}
                isHighlighted={matches.length > 0 && matches[currentMatchIdx] === index}
                onClick={() => onPlay(track)}
                isFavorite={isFav}
                onToggleFavorite={() => onToggleFavorite && onToggleFavorite(track)}
            />
        )
    }

    return (
        <div className={styles.container} ref={containerRef}>
            <header className={styles.header}>
                <h2 className={styles.heading}>{title}</h2>
                <div className={styles.searchWrapper}>
                    <Search size={16} color="var(--text-muted)" style={{ marginRight: '8px' }} />
                    <input 
                        type="text" 
                        placeholder="在列表中跳轉尋找...(可按Enter換首)" 
                        value={searchQuery}
                        onChange={handleSearch}
                        onKeyDown={handleKeyDown}
                        className={styles.searchInput}
                    />
                    {matches.length > 0 && <span className={styles.searchCount}>{currentMatchIdx + 1} / {matches.length}</span>}
                </div>
                <span className={styles.artist}>{tracks.length} 首歌曲</span>
            </header>
            <List<{}>
                listRef={listRef}
                style={{ height: listHeight, width: '100%' }}
                rowCount={tracks.length}
                rowHeight={ITEM_HEIGHT}
                rowComponent={Row}
                rowProps={{}}
                overscanCount={10}
            />
        </div>
    )
}
