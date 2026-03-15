import React, { useState } from 'react'
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

export const TrackList: React.FC<TrackListProps> = ({
    title = '音樂庫', tracks, currentTrack, onPlay, onToggleFavorite, favorites = []
}) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [matches, setMatches] = useState<number[]>([])
    const [currentMatchIdx, setCurrentMatchIdx] = useState(0)

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
        const el = document.getElementById(`track-item-${index}`)
        if (el) {
            // Use setTimeout to ensure DOM is ready if it was offscreen, though it's not virtualized so it should be there.
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
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

    return (
        <div className={styles.container}>
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
            <div className={styles.trackList}>
                {tracks.map((track, index) => {
                    const isFav = favorites.some(f => f.path === track.path)
                    const isActive = currentTrack?.path === track.path

                    // Optimization: Use currentTrack's artwork for the active item
                    // effectively showing the cover for the playing song without loading it for everyone
                    const displayTrack = (isActive && currentTrack?.artwork)
                        ? { ...track, artwork: currentTrack.artwork }
                        : track

                    return (
                        <TrackItem
                            key={`${track.path}-${index}`}
                            id={`track-item-${index}`}
                            track={displayTrack}
                            isActive={isActive}
                            isHighlighted={matches.length > 0 && matches[currentMatchIdx] === index}
                            onClick={() => onPlay(track)}
                            isFavorite={isFav}
                            onToggleFavorite={() => onToggleFavorite && onToggleFavorite(track)}
                        />
                    )
                })}
            </div>
        </div>
    )
}
