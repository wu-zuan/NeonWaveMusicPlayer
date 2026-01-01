import React from 'react'
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
                <span className={styles.artist}>{tracks.length} 首歌曲</span>
            </header>
            <div className={styles.trackList}>
                {tracks.map((track) => {
                    const isFav = favorites.some(f => f.path === track.path)
                    return (
                        <TrackItem
                            key={track.path}
                            track={track}
                            isActive={currentTrack?.path === track.path}
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
