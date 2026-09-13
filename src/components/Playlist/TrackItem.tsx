import React from 'react'
import { Music, AudioWaveform, Heart, Film } from 'lucide-react'
import styles from './Playlist.module.css'
import { Track } from '../../hooks/useAudioPlayer'
import { createArtworkLoader, type ArtworkResult } from '../../utils/artworkLoader'

const artworkLoader = createArtworkLoader(async (path) => {
    if (path.startsWith('shared:')) {
        const results = await window.ipcRenderer.searchYouTube(path.slice('shared:'.length))
        const first = results?.[0]
        return { artwork: first?.thumbnail || undefined, duration: first?.duration || undefined }
    }
    return { artwork: await window.ipcRenderer.getAudioArtwork(path) || undefined }
})

interface TrackItemProps {
    id?: string
    style?: React.CSSProperties
    track: Track
    isActive: boolean
    isFavorite?: boolean
    isHighlighted?: boolean
    onClick: () => void
    onToggleFavorite?: () => void
    trackIndex?: number
}

const TrackItemView: React.FC<TrackItemProps> = ({ id, style, track, isActive, isFavorite, isHighlighted, onClick, onToggleFavorite, trackIndex }) => {
    const [resolved, setResolved] = React.useState<ArtworkResult & { path: string }>(() => ({
        ...artworkLoader.get(track.path), path: track.path
    }))
    const [failedArtwork, setFailedArtwork] = React.useState<string>()
    const itemRef = React.useRef<HTMLDivElement>(null)
    const artwork = track.artwork || (resolved.path === track.path ? resolved.artwork : undefined)
    const resolvedDuration = track.duration || (resolved.path === track.path ? resolved.duration : undefined)

    // Sync artwork from props (e.g. when currentTrack provides it)
    React.useEffect(() => {
        const cached = artworkLoader.get(track.path)
        if (track.artwork) artworkLoader.remember(track.path, {
            artwork: track.artwork, duration: track.duration || cached?.duration
        })
        setResolved(previous => {
            const next = {
                path: track.path,
                artwork: track.artwork || cached?.artwork || (previous.path === track.path ? previous.artwork : undefined),
                duration: track.duration || cached?.duration || (previous.path === track.path ? previous.duration : undefined)
            }
            return previous.path === next.path && previous.artwork === next.artwork && previous.duration === next.duration
                ? previous : next
        })
    }, [track.artwork, track.duration, track.path])

    // Lazy-load artwork when visible (via IntersectionObserver) with a small debounce/delay
    React.useEffect(() => {
        if (track.artwork || artworkLoader.get(track.path) || !itemRef.current) return

        let timeoutId: ReturnType<typeof setTimeout> | null = null
        let cancelled = false
        let request: ReturnType<typeof artworkLoader.request> | null = null

        const release = () => {
            if (timeoutId !== null) clearTimeout(timeoutId)
            timeoutId = null
            request?.release()
            request = null
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (timeoutId !== null || request) return
                timeoutId = setTimeout(() => {
                    timeoutId = null
                    const currentRequest = artworkLoader.request(track.path)
                    request = currentRequest
                    currentRequest.promise
                        .then((result) => {
                            if (cancelled || request !== currentRequest || !result) return
                            setResolved({ ...result, path: track.path })
                            observer.disconnect()
                        })
                        .catch(() => {})
                        .finally(() => {
                            currentRequest.release()
                            if (request === currentRequest) request = null
                        })
                }, 80)
            } else {
                // Discard work for rows scrolled away before their IPC turn.
                release()
            }
        }, { rootMargin: '160px 0px' })

        observer.observe(itemRef.current)

        return () => {
            cancelled = true
            observer.disconnect()
            release()
        }
    }, [track.artwork, track.path])

    return (
        <div
            id={id}
            ref={itemRef}
            className={`${styles.trackItem} ${isActive ? styles.active : ''} ${isHighlighted ? styles.highlighted : ''}`}
            onClick={onClick}
            style={style}
        >
            <span className={styles.trackIndex}>{trackIndex}</span>
            <div className={styles.icon}>
                {artwork && artwork !== failedArtwork ? (
                    <img
                        src={artwork}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className={styles.artwork}
                        onError={() => {
                            setFailedArtwork(artwork)
                        }}
                    />
                ) : (
                    isActive ? <AudioWaveform size={20} /> : track.mediaType === 'video' ? <Film size={20} /> : <Music size={20} />
                )}
            </div>
            <div className={styles.info}>
                <div className={styles.titleLine}>
                    <span className={styles.title}>{track.title}</span>
                    {track.mediaType === 'video' && <span className={styles.mediaBadge}>影片</span>}
                </div>
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
                {resolvedDuration ? formatTime(resolvedDuration) : ''}
            </div>
        </div>
    )
}

export const TrackItem = React.memo(TrackItemView)

function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
}
