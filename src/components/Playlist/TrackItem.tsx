import React from 'react'
import { Music, AudioWaveform, Heart } from 'lucide-react'
import styles from './Playlist.module.css'
import { Track } from '../../hooks/useAudioPlayer'

interface TrackItemProps {
    id?: string
    track: Track
    isActive: boolean
    isFavorite?: boolean
    isHighlighted?: boolean
    onClick: () => void
    onToggleFavorite?: () => void
}

export const TrackItem: React.FC<TrackItemProps> = ({ id, track, isActive, isFavorite, isHighlighted, onClick, onToggleFavorite }) => {
    const [artwork, setArtwork] = React.useState<string | undefined>(track.artwork)
    const itemRef = React.useRef<HTMLDivElement>(null)

    // Sync with prop if it updates (e.g. from player or playlist update)
    React.useEffect(() => {
        if (track.artwork) setArtwork(track.artwork)
    }, [track.artwork])

    // Lazy load artwork when visible
    React.useEffect(() => {
        if (artwork || !itemRef.current) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (track.path.startsWith('shared:')) {
                    const query = track.path.replace('shared:', '')
                    window.ipcRenderer.searchYouTube(query).then(results => {
                        if (results && results.length > 0) {
                            if (results[0].thumbnail) setArtwork(results[0].thumbnail)
                            if (results[0].duration) {
                                track.duration = results[0].duration
                                // Force re-render of this item to show duration
                                setArtwork((prev) => prev);
                            }
                        }
                    }).catch(() => {})
                } else {
                    window.ipcRenderer.getAudioArtwork(track.path)
                        .then((art: string | null) => {
                            if (art) setArtwork(art)
                        })
                        .catch(() => {
                            // ignore errors
                        })
                }
                observer.disconnect()
            }
        }, { rootMargin: '50px' }) // Start loading slightly before it appears

        observer.observe(itemRef.current)

        return () => observer.disconnect()
    }, [artwork, track.path])

    return (
        <div
            id={id}
            ref={itemRef}
            className={`${styles.trackItem} ${isActive ? styles.active : ''} ${isHighlighted ? styles.highlighted : ''}`}
            onClick={onClick}
        >
            <div className={styles.icon}>
                {artwork ? (
                    <img src={artwork} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                ) : (
                    isActive ? <AudioWaveform size={20} /> : <Music size={20} />
                )}
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
