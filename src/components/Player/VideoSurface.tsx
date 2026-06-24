import React, { useEffect, useRef } from 'react'
import { Film } from 'lucide-react'
import { Track } from '../../hooks/useAudioPlayer'
import styles from './VideoSurface.module.css'

interface VideoSurfaceProps {
    track: Track
    getMediaElement: () => HTMLVideoElement | null
}

export const VideoSurface: React.FC<VideoSurfaceProps> = ({ track, getMediaElement }) => {
    const hostRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const host = hostRef.current
        const media = getMediaElement()
        if (!host || !media) return

        media.classList.add(styles.videoElement)
        media.controls = false
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
            <div className={styles.frame} ref={hostRef}>
                <div className={styles.placeholder}>
                    <Film size={28} />
                </div>
            </div>
            <div className={styles.caption}>
                <span className={styles.badge}>影片</span>
                <span className={styles.title}>{track.title}</span>
            </div>
        </section>
    )
}
