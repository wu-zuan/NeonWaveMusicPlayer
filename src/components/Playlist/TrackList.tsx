import React from 'react'
import { TrackItem } from './TrackItem'
import styles from './Playlist.module.css'
import { Track } from '../../hooks/useAudioPlayer'

interface TrackListProps {
    tracks: Track[]
    currentTrack: Track | null
    onPlay: (track: Track) => void
}

export const TrackList: React.FC<TrackListProps> = ({ tracks, currentTrack, onPlay }) => {
    if (tracks.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <p>No music found. Click "Open Folder" to import your library.</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.heading}>Library</h2>
                <span className={styles.artist}>{tracks.length} Songs</span>
            </header>
            <div className={styles.trackList}>
                {tracks.map((track) => (
                    <TrackItem
                        key={track.path}
                        track={track}
                        isActive={currentTrack?.path === track.path}
                        onClick={() => onPlay(track)}
                    />
                ))}
            </div>
        </div>
    )
}
