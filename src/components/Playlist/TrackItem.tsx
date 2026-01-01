import React from 'react'
import { Music, AudioWaveform } from 'lucide-react'
import styles from './Playlist.module.css'
import { Track } from '../../hooks/useAudioPlayer'

interface TrackItemProps {
    track: Track
    isActive: boolean
    onClick: () => void
}

export const TrackItem: React.FC<TrackItemProps> = ({ track, isActive, onClick }) => {
    return (
        <div className={`${styles.trackItem} ${isActive ? styles.active : ''}`} onClick={onClick}>
            <div className={styles.icon}>
                {isActive ? <AudioWaveform size={20} /> : <Music size={20} />}
            </div>
            <div className={styles.info}>
                <div className={styles.title}>{track.title}</div>
                <div className={styles.artist}>{track.artist || 'Unknown Artist'}</div>
            </div>
            <div className={styles.duration}>
                {/* Placeholder for duration as metadata loading is async/complex */}
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
