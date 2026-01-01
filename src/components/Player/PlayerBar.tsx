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
    onSetNormalization?: (enable: boolean) => void
    onSetCrowd?: (enable: boolean) => void
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
    isPlaying, currentTrack, currentTime, duration, volume, is8D,
    isShuffle, repeatMode,
    onTogglePlay, onSeek, onVolumeChange, onToggle8D,
    onToggleShuffle, onToggleRepeat, onNext, onPrev,
    onSetDistance, onSetSpace, onSetPosition, onSetFocusMode, onSetNormalization, onSetCrowd
}) => {
    const [showSpatial, setShowSpatial] = useState(false)
    const [distVal, setDistVal] = useState(0)
    const [spaceMode, setSpaceMode] = useState('none')
    const [isFocus, setIsFocus] = useState(false)
    const [isNorm, setIsNorm] = useState(false)
    const [isCrowd, setIsCrowd] = useState(false)
    const [radarPos, setRadarPos] = useState({ x: 0, z: 0 })
    const [activeTab, setActiveTab] = useState<'effects' | 'spatial'>('effects')

    const handleDistance = (val: number) => {
        setDistVal(val)
        onSetDistance?.(val)
    }

    const handleSpace = (val: string) => {
        setSpaceMode(val)
        onSetSpace?.(val)

        if (val !== 'none') {
            setIsFocus(false)
            onSetFocusMode?.(false)
        }

        // Automation: Auto-set distance and position based on venue
        let newDist = 0
        let newPos = { x: 0, z: 0 }

        if (val === 'concert') {
            newDist = 7.5
            newPos = { x: 0, z: 0 } // Immerse inside center
        } else if (val === 'hall') {
            newDist = 5.0
            newPos = { x: 0, z: -3.5 } // Wide open lobby
        } else if (val === 'room') {
            newDist = 2.5
            newPos = { x: 0, z: -2 } // Desk speakers relative to head
        } else if (val === 'driver') {
            newDist = 0.5               // Very close cabin
            newPos = { x: 0, z: -0.8 }  // Dashboard speakers (close front)
        } else {
            // none
            newDist = 0
            newPos = { x: 0, z: 0 }
        }

        setDistVal(newDist)
        onSetDistance?.(newDist)

        setRadarPos(newPos)
        onSetPosition?.(newPos.x, 0, newPos.z)

        // Reset Crowd if not concert
        if (val !== 'concert') {
            setIsCrowd(false)
            onSetCrowd?.(false)
        }
    }

    const handleFocus = () => {
        const newVal = !isFocus
        setIsFocus(newVal)
        onSetFocusMode?.(newVal)
        if (newVal) {
            setDistVal(0.5)
            setSpaceMode('none')
            setRadarPos({ x: 0, z: 0 })
            // Ensure crowd is off
            setIsCrowd(false)
            onSetCrowd?.(false)
        }
    }

    const handleNorm = () => {
        const newVal = !isNorm
        setIsNorm(newVal)
        onSetNormalization?.(newVal)
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
                    width: '300px',
                    background: 'rgba(19, 19, 31, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    zIndex: 200
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AudioWaveform size={16} color="var(--accent-primary)" />
                            NeonSpace 音訊核心
                        </h3>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
                        <button
                            onClick={() => setActiveTab('effects')}
                            style={{
                                flex: 1, padding: '6px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                                background: activeTab === 'effects' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: activeTab === 'effects' ? 'var(--text-main)' : 'var(--text-muted)',
                                transition: 'all 0.2s'
                            }}
                        >
                            🎛️ 音效特效
                        </button>
                        <button
                            onClick={() => setActiveTab('spatial')}
                            style={{
                                flex: 1, padding: '6px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                                background: activeTab === 'spatial' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: activeTab === 'spatial' ? 'var(--text-main)' : 'var(--text-muted)',
                                transition: 'all 0.2s'
                            }}
                        >
                            📡 3D 空間
                        </button>
                    </div>

                    {/* Tab Content: Effects */}
                    {activeTab === 'effects' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '4px' }}>
                            {/* Focus Mode */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                <div>
                                    <div style={{ color: 'var(--text-main)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        🧠 專注模式
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '2px' }}>消除殘響，增強人聲清晰度</div>
                                </div>
                                <button
                                    onClick={handleFocus}
                                    style={{
                                        width: '40px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer',
                                        background: isFocus ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                        position: 'relative', transition: 'all 0.3s'
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute', top: '2px', left: isFocus ? '20px' : '2px',
                                        width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                                        transition: 'all 0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                    }} />
                                </button>
                            </div>

                            {/* Normalization */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                <div>
                                    <div style={{ color: 'var(--text-main)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        ⚖️ 音量平衡
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '2px' }}>動態壓縮，防止爆音</div>
                                </div>
                                <button
                                    onClick={handleNorm}
                                    style={{
                                        width: '40px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer',
                                        background: isNorm ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                        position: 'relative', transition: 'all 0.3s'
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute', top: '2px', left: isNorm ? '20px' : '2px',
                                        width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                                        transition: 'all 0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                    }} />
                                </button>
                            </div>

                            {/* Space Mode */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: isFocus ? 0.5 : 1, pointerEvents: isFocus ? 'none' : 'auto', transition: 'all 0.3s' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label style={{ color: 'var(--text-muted)', fontSize: '12px' }}>真實空間模擬</label>
                                    {isFocus && <span style={{ fontSize: '10px', color: 'var(--accent-secondary)' }}>專注模式下不可用</span>}
                                </div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {['none', 'room', 'hall', 'concert', 'driver'].map(mode => (
                                        <button
                                            key={mode}
                                            onClick={() => handleSpace(mode)}
                                            style={{
                                                flex: 1, minWidth: '50px',
                                                background: spaceMode === mode ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                                color: spaceMode === mode ? '#000' : 'var(--text-muted)',
                                                border: '1px solid',
                                                borderColor: spaceMode === mode ? 'var(--accent-primary)' : 'transparent',
                                                borderRadius: '6px', fontSize: '11px', padding: '6px 0', cursor: 'pointer', transition: 'all 0.2s',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {mode === 'none' ? '原音' : mode === 'room' ? '房間' : mode === 'hall' ? '空間' : mode === 'concert' ? '演唱會' : '車內'}
                                        </button>
                                    ))}
                                </div>

                                {/* Virtual Crowd Toggle (Concert Only) */}
                                {spaceMode === 'concert' && (
                                    <div style={{ marginTop: '4px', padding: '8px', background: 'rgba(0,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(0,255,255,0.1)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '14px' }}>👥</span>
                                            <span style={{ color: 'var(--text-main)', fontSize: '12px' }}>虛擬觀眾</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newVal = !isCrowd
                                                setIsCrowd(newVal)
                                                onSetCrowd?.(newVal)
                                            }}
                                            style={{
                                                width: '36px', height: '20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                                background: isCrowd ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                                position: 'relative', transition: 'all 0.3s'
                                            }}
                                        >
                                            <div style={{
                                                position: 'absolute', top: '2px', left: isCrowd ? '18px' : '2px',
                                                width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                                                transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab Content: Spatial */}
                    {activeTab === 'spatial' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, position: 'relative' }}>
                            {isFocus && (
                                <div style={{
                                    position: 'absolute', inset: 0, zIndex: 10,
                                    background: 'rgba(10,10,20,0.6)', backdropFilter: 'blur(2px)', borderRadius: '8px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}>
                                    <span style={{ fontSize: '24px' }}>🚫</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-main)' }}>專注模式已啟用</span>
                                    <button onClick={handleFocus} style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--accent-primary)', background: 'transparent', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '11px' }}>
                                        關閉專注模式
                                    </button>
                                </div>
                            )}

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
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                <label style={{ color: 'var(--text-muted)', fontSize: '12px' }}>3D 音源定位</label>
                                <div style={{ flex: 1, minHeight: '180px', display: 'flex', flexDirection: 'column' }}>
                                    <AudioRadar
                                        currentX={radarPos.x}
                                        currentZ={radarPos.z}
                                        onSetPosition={(x, y, z) => {
                                            if (isFocus) return // Should be blocked by overlay anyway
                                            setRadarPos({ x, z })
                                            onSetPosition?.(x, y, z)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
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
