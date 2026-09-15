import React, { useState, useEffect, useMemo, useCallback, useDeferredValue } from 'react'
import { List, useListRef } from 'react-window'
import { Music, Search } from 'lucide-react'
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
const EMPTY_FAVORITES: Track[] = []

type TrackRowProps = Pick<TrackListProps, 'tracks' | 'currentTrack' | 'onPlay' | 'onToggleFavorite'> & {
    favoritePaths: Set<string>
    highlightedIndex: number | undefined
}

const TrackRow = ({ index, style, tracks, currentTrack, favoritePaths, highlightedIndex, onPlay, onToggleFavorite }: TrackRowProps & { index: number; style: React.CSSProperties }) => {
        const track = tracks[index]
        const isFav = favoritePaths.has(track.path)
        const isActive = currentTrack?.path === track.path

        // Optimization: Use currentTrack's artwork for the active item
        const activeArtwork = isActive ? currentTrack?.artwork : undefined
        const displayTrack = useMemo(() => activeArtwork
            ? { ...track, artwork: activeArtwork }
            : track, [track, activeArtwork])
        const handlePlay = useCallback(() => onPlay(track), [onPlay, track])
        const handleToggleFavorite = useCallback(() => onToggleFavorite?.(track), [onToggleFavorite, track])

        return (
            <TrackItem
                style={style}
                key={track.path}
                id={`track-item-${index}`}
                track={displayTrack}
                isActive={isActive}
                isHighlighted={highlightedIndex === index}
                onClick={handlePlay}
                isFavorite={isFav}
                onToggleFavorite={handleToggleFavorite}
                trackIndex={index + 1}
            />
        )
    }


const TrackListView: React.FC<TrackListProps> = ({
    title = '音樂庫', tracks, currentTrack, onPlay, onToggleFavorite, favorites = EMPTY_FAVORITES
}) => {
    const [searchQuery, setSearchQuery] = useState('')
    const deferredQuery = useDeferredValue(searchQuery.toLowerCase())
    const [currentMatchIdx, setCurrentMatchIdx] = useState(0)
    const listRef = useListRef(null)
    const [listSize, setListSize] = useState<{ height: number; width: number }>()
    const favoritePaths = useMemo(() => new Set(favorites.map(f => f.path)), [favorites])
    const searchIndex = useMemo(() => tracks.map(track => ({
        title: track.title.toLowerCase(), artist: track.artist?.toLowerCase() || ''
    })), [tracks])
    const matches = useMemo(() => {
        if (!deferredQuery) return []
        const result: number[] = []
        searchIndex.forEach((track, index) => {
            if (track.title.includes(deferredQuery) || track.artist.includes(deferredQuery)) result.push(index)
        })
        return result
    }, [deferredQuery, searchIndex])
    const rowProps = useMemo(() => ({
        tracks, currentTrack, favoritePaths, highlightedIndex: matches[currentMatchIdx], onPlay, onToggleFavorite
    }), [tracks, currentTrack, favoritePaths, matches, currentMatchIdx, onPlay, onToggleFavorite])

    // Refresh navigation when the query or playlist changes. Search work runs
    // behind input updates, and normalization is reused across keystrokes.
    useEffect(() => {
        setCurrentMatchIdx(0)
    }, [matches])

    // Wait for the list's actual flex viewport, including after an empty list
    // mounts or a theme/window resize changes the space below the header.
    useEffect(() => {
        const index = matches[currentMatchIdx]
        if (index !== undefined) listRef.current?.scrollToRow({ index, align: 'center' })
    }, [matches, currentMatchIdx, listSize, listRef])

    const scrollToMatch = (index: number) => {
        listRef.current?.scrollToRow({ index, align: 'center' })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing && deferredQuery === searchQuery.toLowerCase() && matches.length > 0) {
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
            <div className={styles.headerArea}>
                <section className={styles.themeHero} aria-hidden="true">
                    <div className={styles.themeHeroArtwork}>
                        {currentTrack?.artwork ? (
                            <img
                                src={currentTrack.artwork}
                                alt=""
                                draggable={false}
                                className={styles.themeHeroImage}
                            />
                        ) : (
                            <Music size={34} />
                        )}
                    </div>
                    <div className={styles.themeHeroCopy}>
                        <span className={styles.themeHeroEyebrow} />
                        <strong>{title}</strong>
                        <small>NeonWave · {tracks.length} 首歌曲</small>
                    </div>
                </section>
                <header className={styles.header}>
                    <h2 className={styles.heading}>{title}</h2>
                    <div className={styles.searchWrapper}>
                        <Search size={16} color="var(--text-muted)" style={{ marginRight: '8px' }} />
                        <input
                            type="text"
                            placeholder="在列表中跳轉尋找...(可按Enter換首)"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className={styles.searchInput}
                        />
                        {matches.length > 0 && <span className={styles.searchCount}>{currentMatchIdx + 1} / {matches.length}</span>}
                    </div>
                    <span className={styles.artist}>{tracks.length} 個項目</span>
                </header>
            </div>
            <List<TrackRowProps>
                listRef={listRef}
                onResize={setListSize}
                style={{ height: '100%', minHeight: ITEM_HEIGHT, width: '100%' }}
                rowCount={tracks.length}
                rowHeight={ITEM_HEIGHT}
                rowComponent={TrackRow}
                rowProps={rowProps}
                overscanCount={10}
            />
        </div>
    )
}

export const TrackList = React.memo(TrackListView)
