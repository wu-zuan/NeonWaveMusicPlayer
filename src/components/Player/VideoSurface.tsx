import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Film, Maximize, Minimize } from 'lucide-react'
import { Track } from '../../hooks/useAudioPlayer'
import styles from './VideoSurface.module.css'

interface VideoSurfaceProps {
    track: Track
    getMediaElement: () => HTMLVideoElement | null
}

export const VideoSurface: React.FC<VideoSurfaceProps> = ({ track, getMediaElement }) => {
    const hostRef = useRef<HTMLDivElement>(null)
    const frameRef = useRef<HTMLDivElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const toggleFullscreen = useCallback(() => {
        const frame = frameRef.current
        if (!frame) return
        if (document.fullscreenElement) void document.exitFullscreen()
        else void frame.requestFullscreen().catch(console.error)
    }, [])

    useEffect(() => {
        const sync = () => setIsFullscreen(document.fullscreenElement === frameRef.current)
        document.addEventListener('fullscreenchange', sync)
        return () => {
            document.removeEventListener('fullscreenchange', sync)
            if (document.fullscreenElement === frameRef.current) void document.exitFullscreen()
        }
    }, [])

    useEffect(() => {
        const host = hostRef.current
        const media = getMediaElement()
        if (!host || !media) return

        media.classList.add(styles.videoElement)
        media.controls = false
        media.disablePictureInPicture = true
        media.setAttribute('controlsList', 'nodownload noremoteplayback')
        host.appendChild(media)

        return () => {
            media.classList.remove(styles.videoElement)
            if (media.parentElement === host) {
                host.removeChild(media)
            }
        }
    }, [getMediaElement, track.path])

    return (
        <section className={styles.surface} aria-label="影片播放">
            <div
                className={styles.frame}
                ref={frameRef}
                onContextMenu={event => event.preventDefault()}
                onDoubleClick={toggleFullscreen}
            >
                <div className={styles.host} ref={hostRef}>
                    <div className={styles.placeholder}>
                        <Film size={28} />
                    </div>
                </div>
                <button
                    type="button"
                    className={styles.fullscreenButton}
                    aria-label={isFullscreen ? '離開全螢幕' : '全螢幕'}
                    title={isFullscreen ? '離開全螢幕 (Esc)' : '全螢幕'}
                    onClick={toggleFullscreen}
                    onDoubleClick={event => event.stopPropagation()}
                >
                    {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
            </div>
            <div className={styles.caption}>
                <span className={styles.badge}>影片</span>
                <span className={styles.title}>{track.title}</span>
            </div>
        </section>
    )
}
