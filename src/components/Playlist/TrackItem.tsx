import React from 'react'
import { Music, AudioWaveform, Heart } from 'lucide-react'
import styles from './Playlist.module.css'
import { Track } from '../../hooks/useAudioPlayer'

// LRU Artwork Cache — prevents memory bloat from base64 artwork strings
const ARTWORK_CACHE_MAX = 80
const artworkCache = new Map<string, string>()

function getCachedArtwork(key: string): string | undefined {
    const val = artworkCache.get(key)
    if (val) {
        // Move to end (most recently used)
        artworkCache.delete(key)
        artworkCache.set(key, val)
    }
    return val
}

function setCachedArtwork(key: string, value: string) {
    if (artworkCache.has(key)) {
        artworkCache.delete(key)
    } else if (artworkCache.size >= ARTWORK_CACHE_MAX) {
        // Evict oldest entry
        const oldest = artworkCache.keys().next().value!
        artworkCache.delete(oldest)
    }
    artworkCache.set(key, value)
}

interface TrackItemProps {
    id?: string
    style?: React.CSSProperties
    track: Track
    isActive: boolean
    isFavorite?: boolean
    isHighlighted?: boolean
    onClick: () => void
    onToggleFavorite?: () => void
}

export const TrackItem: React.FC<TrackItemProps> = ({ id, style, track, isActive, isFavorite, isHighlighted, onClick, onToggleFavorite }) => {
    const [artwork, setArtwork] = React.useState<string | undefined>(() => {
        return track.artwork || getCachedArtwork(track.path)
    })
    const itemRef = React.useRef<HTMLDivElement>(null)

    // Sync artwork from props (e.g. when currentTrack provides it)
    React.useEffect(() => {
        if (track.artwork) {
            setArtwork(track.artwork)
            setCachedArtwork(track.path, track.artwork)
        }
    }, [track.artwork, track.path])

    // Lazy-load artwork when visible (via IntersectionObserver)
    React.useEffect(() => {
        if (artwork || !itemRef.current) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (track.path.startsWith('shared:')) {
                    const query = track.path.replace('shared:', '')
                    window.ipcRenderer.searchYouTube(query).then(results => {
                        if (results && results.length > 0) {
                            if (results[0].thumbnail) {
                                setArtwork(results[0].thumbnail)
                                setCachedArtwork(track.path, results[0].thumbnail)
                            }
                            if (results[0].duration) {
                                track.duration = results[0].duration
                            }
                        }
                    }).catch(() => {})
                } else {
                    window.ipcRenderer.getAudioArtwork(track.path)
                        .then((art: string | null) => {
                            if (art) {
                                setArtwork(art)
                                setCachedArtwork(track.path, art)
                            }
                        })
                        .catch(() => {})
                }
                observer.disconnect()
            }
        }, { rootMargin: '100px' })

        observer.observe(itemRef.current)

        return () => observer.disconnect()
    }, [artwork, track.path])

    return (
        <div
            id={id}
            ref={itemRef}
            className={`${styles.trackItem} ${isActive ? styles.active : ''} ${isHighlighted ? styles.highlighted : ''}`}
            onClick={onClick}
            style={style}
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
