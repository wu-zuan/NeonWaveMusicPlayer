import React from 'react'
import { Music, AudioWaveform, Heart } from 'lucide-react'
import styles from './Playlist.module.css'
import { Track } from '../../hooks/useAudioPlayer'

interface TrackItemProps {
    track: Track
    isActive: boolean
    isFavorite?: boolean
    onClick: () => void
    onToggleFavorite?: () => void
}

export const TrackItem: React.FC<TrackItemProps> = ({ track, isActive, isFavorite, onClick, onToggleFavorite }) => {
    return (
        <div className={`${styles.trackItem} ${isActive ? styles.active : ''}`} onClick={onClick}>
            <div className={styles.icon}>
                {isActive ? <AudioWaveform size={20} /> : <Music size={20} />}
            </div>
            <div className={styles.info}>
                <div className={styles.title}>{track.title}</div>
                <div className={styles.artist}>{track.artist || '未知演出者'}</div>
            </div>

            <button
                className={styles.favBtn}
                onClick={(e) => {
                    e.stopPropagation()
                    onToggleFavorite && onToggleFavorite()
                }}
            >
                <Heart size={16} fill={isFavorite ? "var(--accent-primary)" : "none"} color={isFavorite ? "var(--accent-primary)" : "var(--text-muted)"} />
            </button>

            <div className={styles.duration}>
                {track.duration ? formatTime(track.duration) : ''}
            </div>
        </div>
    )
}

function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
}
