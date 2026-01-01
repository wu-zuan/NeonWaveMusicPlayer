import React from 'react'
import { Play, Pause, SkipBack, SkipForward, Shuffle, Volume2, Music, Repeat } from 'lucide-react'
import styles from './Player.module.css'
import { Track } from '../../hooks/useAudioPlayer'

interface PlayerBarProps {
    isPlaying: boolean
    currentTrack: Track | null
    currentTime: number
    duration: number
    volume: number
    is8D: boolean
    onTogglePlay: () => void
    onSeek: (time: number) => void
    onVolumeChange: (vol: number) => void
    onToggle8D: () => void
    onNext?: () => void
    onPrev?: () => void
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
    isPlaying, currentTrack, currentTime, duration, volume, is8D,
    onTogglePlay, onSeek, onVolumeChange, onToggle8D, onNext, onPrev
}) => {

    const formatTime = (t: number) => {
        if (isNaN(t)) return '0:00'
        const m = Math.floor(t / 60)
        const s = Math.floor(t % 60)
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    // Calculate background gradient for slider
    const progressPercent = duration ? (currentTime / duration) * 100 : 0

    const sliderStyle = {
        background: `linear-gradient(to right, var(--accent-primary) ${progressPercent}%, rgba(255,255,255,0.1) ${progressPercent}%)`
    }

    const volPercent = volume * 100
    const volStyle = {
        background: `linear-gradient(to right, #fff ${volPercent}%, rgba(255,255,255,0.1) ${volPercent}%)`
    }

    return (
        <div className={styles.bar}>
            {/* Track Info */}
            <div className={styles.nowPlaying}>
                <div className={styles.art}>
                    <Music size={24} className="text-gray-400" />
                </div>
                <div className={styles.trackInfo}>
                    <div className={styles.trackTitle}>{currentTrack?.title || 'NeonWave'}</div>
                    <div className={styles.trackArtist}>{currentTrack?.artist || 'Ready to Play'}</div>
                </div>
            </div>

            {/* Main Controls */}
            <div className={styles.controls}>
                <div className={styles.buttons}>
                    <button className={styles.actionBtn}>
                        <Shuffle size={18} />
                    </button>

                    <button className={styles.actionBtn} onClick={onPrev}>
                        <SkipBack size={22} />
                    </button>

                    <button className={styles.playBtn} onClick={onTogglePlay}>
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>

                    <button className={styles.actionBtn} onClick={onNext}>
                        <SkipForward size={22} />
                    </button>

                    <button className={styles.actionBtn}>
                        <Repeat size={18} />
                    </button>
                </div>

                <div className={styles.progressContainer}>
                    <span>{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={(e) => onSeek(Number(e.target.value))}
                        className={styles.timeSlider}
                        style={sliderStyle}
                    />
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Extras */}
            <div className={styles.extra}>
                <button
                    className={`${styles.toggle8D} ${is8D ? styles.active8D : ''}`}
                    onClick={onToggle8D}
                    title="Toggle 8D Surround"
                >
                    8D
                </button>

                <div className="flex items-center gap-2 w-32">
                    <Volume2 size={18} className="text-gray-400" />
                    <input
                        type="range"
                        min={0} max={1} step={0.01}
                        value={volume}
                        onChange={(e) => onVolumeChange(Number(e.target.value))}
                        className={styles.timeSlider}
                        style={volStyle}
                    />
                </div>
            </div>
        </div>
    )
}
