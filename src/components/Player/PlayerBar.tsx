import React, { useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Shuffle, Volume2, Music, Repeat, Repeat1, Sliders, AudioWaveform } from 'lucide-react'
import styles from './Player.module.css'
import { Track } from '../../hooks/useAudioPlayer'
import { AudioRadar } from './AudioRadar'

interface PlayerBarProps {
    isPlaying: boolean
    currentTrack: Track | null
    currentTime: number
    duration: number
    volume: number
    is8D: boolean
    isShuffle: boolean
    repeatMode: 'none' | 'all' | 'one'
    onTogglePlay: () => void
    onSeek: (time: number) => void
    onVolumeChange: (vol: number) => void
    onToggle8D: () => void
    onToggleShuffle: () => void
    onToggleRepeat: () => void
    onNext?: () => void
    onPrev?: () => void
    // Advanced
    onSetDistance?: (d: number) => void
    onSetSpace?: (s: string) => void
    onSetPosition?: (x: number, y: number, z: number) => void
    onSetFocusMode?: (enable: boolean) => void
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
    isPlaying, currentTrack, currentTime, duration, volume, is8D,
    isShuffle, repeatMode,
    onTogglePlay, onSeek, onVolumeChange, onToggle8D,
    onToggleShuffle, onToggleRepeat, onNext, onPrev,
    onSetDistance, onSetSpace, onSetPosition, onSetFocusMode
}) => {
    const [showSpatial, setShowSpatial] = useState(false)
    const [distVal, setDistVal] = useState(0)
    const [spaceMode, setSpaceMode] = useState('none')
    const [isFocus, setIsFocus] = useState(false)
    const [radarPos, setRadarPos] = useState({ x: 0, z: 0 })

    const handleDistance = (val: number) => {
        setDistVal(val)
        onSetDistance?.(val)
    }

    const handleSpace = (val: string) => {
        setSpaceMode(val)
        onSetSpace?.(val)
    }

    const handleFocus = () => {
        const newVal = !isFocus
        setIsFocus(newVal)
        onSetFocusMode?.(newVal)
        if (newVal) {
            setDistVal(0.5)
            setSpaceMode('none')
            setRadarPos({ x: 0, z: 0 })
        }
    }

    const formatTime = (t: number) => {
        if (isNaN(t)) return '0:00'
        const m = Math.floor(t / 60)
        const s = Math.floor(t % 60)
        return `${m}:${s.toString().padStart(2, '0')}`
    }

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
            {/* Spatial Control Popup */}
            {showSpatial && (
                <div style={{
                    position: 'absolute',
                    bottom: '110px',
                    right: '30px',
                    width: '280px',
                    background: 'rgba(19, 19, 31, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    zIndex: 200
                }}>
                    <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AudioWaveform size={16} color="var(--accent-primary)" />
                        NeonSpace 音訊核心
                    </h3>

                    {/* Focus Mode Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            🧠 專注模式
                        </label>
                        <button
                            onClick={handleFocus}
                            style={{
                                background: isFocus ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                color: isFocus ? '#000' : '#fff',
                                border: 'none', borderRadius: '12px', padding: '4px 12px', fontSize: '11px', cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {isFocus ? 'ON' : 'OFF'}
                        </button>
                    </div>

                    {/* Space Mode */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ color: 'var(--text-muted)', fontSize: '12px' }}>真實空間模擬</label>
                        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
                            {['none', 'room', 'hall', 'driver'].map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => handleSpace(mode)}
                                    style={{
                                        flex: 1,
                                        background: spaceMode === mode ? 'var(--accent-primary)' : 'transparent',
                                        color: spaceMode === mode ? '#000' : 'var(--text-muted)',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        padding: '6px 0',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {mode === 'none' ? '原音' : mode === 'room' ? '房間' : mode === 'hall' ? '大廳' : '車內'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Distance */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label style={{ color: 'var(--text-muted)', fontSize: '12px' }}>音場距離</label>
                            <span style={{ color: 'var(--accent-primary)', fontSize: '12px' }}>{distVal}m</span>
                        </div>
                        <input
                            type="range" min={0} max={10} step={0.5}
                            value={distVal}
                            onChange={(e) => handleDistance(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                        />
                    </div>

                    {/* Position */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ color: 'var(--text-muted)', fontSize: '12px' }}>3D 音源定位</label>
                        <AudioRadar
                            currentX={radarPos.x}
                            currentZ={radarPos.z}
                            onSetPosition={(x, y, z) => {
                                setRadarPos({ x, z })
                                onSetPosition?.(x, y, z)
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Track Info */}
            <div className={styles.nowPlaying}>
                <div className={styles.art}>
                    <Music size={24} className="text-gray-400" />
                </div>
                <div className={styles.trackInfo}>
                    <div className={styles.trackTitle}>{currentTrack?.title || 'NeonWave'}</div>
                    <div className={styles.trackArtist}>{currentTrack?.artist || 'Ready to Play'}</div>

                    {/* Audio Format Badges */}
                    {currentTrack && (
                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
                            {currentTrack.codec && (
                                <span style={{
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    padding: '0 4px',
                                    borderRadius: '3px',
                                    textTransform: 'uppercase',
                                    color: (currentTrack.codec.toUpperCase().includes('FLAC') || currentTrack.codec.toUpperCase().includes('WAV')) ? 'var(--accent-primary)' : 'inherit',
                                    borderColor: (currentTrack.codec.toUpperCase().includes('FLAC') || currentTrack.codec.toUpperCase().includes('WAV')) ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)'
                                }}>
                                    {currentTrack.codec.replace('MPEG 1 Layer 3', 'MP3')}
                                </span>
                            )}
                            {currentTrack.bitrate && (
                                <span>{Math.round(currentTrack.bitrate / 1000)}kbps</span>
                            )}
                            {currentTrack.sampleRate && (
                                <span>{(currentTrack.sampleRate / 1000).toFixed(1)}kHz</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Controls */}
            <div className={styles.controls}>
                <div className={styles.buttons}>
                    <button
                        className={`${styles.actionBtn} ${isShuffle ? styles.activeControl : ''}`}
                        onClick={onToggleShuffle}
                        title="隨機播放"
                    >
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

                    <button
                        className={`${styles.actionBtn} ${repeatMode !== 'none' ? styles.activeControl : ''}`}
                        onClick={onToggleRepeat}
                        title={repeatMode === 'one' ? '單曲循環' : repeatMode === 'all' ? '列表循環' : '不循環'}
                    >
                        {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
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
                    className={`${styles.actionBtn} ${showSpatial ? styles.activeControl : ''}`}
                    onClick={() => setShowSpatial(!showSpatial)}
                    title="空間音效設定"
                    style={{ marginRight: '12px' }}
                >
                    <Sliders size={18} />
                </button>

                <button
                    className={`${styles.toggle8D} ${is8D ? styles.active8D : ''}`}
                    onClick={onToggle8D}
                    title="8D 環繞音效"
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
