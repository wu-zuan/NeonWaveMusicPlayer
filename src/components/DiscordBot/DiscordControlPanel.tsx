
import React, { useState, useEffect } from 'react'
import { Disc, Server, Volume2, LogOut, Power, Radio } from 'lucide-react'
import styles from './DiscordControlPanel.module.css'

// Define IPC types for Renderer
interface DiscordGuild {
    id: string
    name: string
    icon: string | null
    memberCount: number
}

interface DiscordChannel {
    id: string
    name: string
    userLimit: number
    members: string[]
}

export const DiscordControlPanel: React.FC = () => {
    const [token, setToken] = useState('')
    const [step, setStep] = useState(1) // 1: Input Token, 2: Select Server, 3: Select Channel, 4: Control
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [userInfo, setUserInfo] = useState<{ username: string, avatar: string | null } | null>(null)
    const [guilds, setGuilds] = useState<DiscordGuild[]>([])
    const [channels, setChannels] = useState<DiscordChannel[]>([])

    const [selectedGuild, setSelectedGuild] = useState<DiscordGuild | null>(null)
    const [activeChannel, setActiveChannel] = useState<DiscordChannel | null>(null)

    // -- Actions --

    const handleLogin = async () => {
        if (!token) return
        setLoading(true)
        setError(null)
        try {
            const data = await window.ipcRenderer.invoke('discord:login', token)
            setUserInfo({ username: data.username, avatar: data.avatar })
            const guildList = await window.ipcRenderer.invoke('discord:getGuilds')
            setGuilds(guildList)
            setStep(2)
            // Save token to localStorage for convenience? User didn't ask, but good UX.
            localStorage.setItem('discord_bot_token', token)
        } catch (e: any) {
            setError(e.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleSelectGuild = async (guild: DiscordGuild) => {
        setLoading(true)
        setError(null)
        try {
            const channelList = await window.ipcRenderer.invoke('discord:getChannels', guild.id)
            setChannels(channelList)
            setSelectedGuild(guild)
            setStep(3)
        } catch (e: any) {
            setError(e.message || 'Failed to fetch channels')
        } finally {
            setLoading(false)
        }
    }

    const handleJoinChannel = async (channel: DiscordChannel) => {
        if (!selectedGuild) return
        setLoading(true)
        setError(null)
        try {
            await window.ipcRenderer.invoke('discord:join', selectedGuild.id, channel.id)
            setActiveChannel(channel)
            setStep(4)
        } catch (e: any) {
            setError(e.message || 'Failed to join channel')
        } finally {
            setLoading(false)
        }
    }

    const handleDisconnect = async () => {
        if (!confirm('Are you sure you want to disconnect the bot completely?')) return
        setLoading(true)
        try {
            await window.ipcRenderer.invoke('discord:leave')
            // Reset state logic
            setStep(1)
            setUserInfo(null)
            setSelectedGuild(null)
            setActiveChannel(null)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleLeaveChannel = async () => {
        setLoading(true)
        try {
            await window.ipcRenderer.invoke('discord:leave')
            // Go back to channel selection
            setActiveChannel(null)
            setStep(3)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const checkStatus = async () => {
            setLoading(true)
            const savedToken = localStorage.getItem('discord_bot_token')
            if (savedToken) setToken(savedToken)

            try {
                const status = await window.ipcRenderer.invoke('discord:status')
                if (status.isConnected) {
                    setUserInfo({
                        username: status.username || 'Bot',
                        avatar: status.avatar
                    })

                    // We need to reconstruct minimal guild/channel objects to satisfy the UI state
                    if (status.currentGuildId) {
                        setSelectedGuild({
                            id: status.currentGuildId,
                            name: status.currentGuildName || 'Unknown Server',
                            icon: null, // we can't get icon easily without re-fetching guilds, but that's ok
                            memberCount: 0
                        })
                    }

                    if (status.currentChannelId) {
                        setActiveChannel({
                            id: status.currentChannelId,
                            name: status.currentChannelName || 'Unknown Channel',
                            userLimit: 0,
                            members: []
                        })
                        // If we have a channel, we are in "Control" mode
                        setStep(4)
                    } else {
                        // Connected but no channel? Should be Step 2 or 3. 
                        // Let's go to Step 2 (Guild Selection) and fetch guilds really quick
                        const guildList = await window.ipcRenderer.invoke('discord:getGuilds')
                        setGuilds(guildList)
                        setStep(2)
                    }
                }
            } catch (e) {
                console.error("Failed to check discord status", e)
            } finally {
                setLoading(false)
            }
        }
        checkStatus()
    }, [])

    // -- Render Helpers --

    const renderStep1 = () => (
        <div className={styles.content}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <Disc size={48} className={styles.iconSpin} />
                    <h2 className={styles.title}>
                        Discord 機器人連線
                    </h2>
                    <p className={styles.subtitle}>直接在您的 Discord 伺服器中控制音樂播放。</p>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>機器人 Token</label>
                    <input
                        type="password"
                        value={token}
                        onChange={e => setToken(e.target.value)}
                        className={styles.input}
                        placeholder="請輸入 Discord Bot Token..."
                        disabled={loading}
                    />
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button
                    onClick={handleLogin}
                    disabled={loading || !token}
                    className={styles.button}
                >
                    {loading ? '連線中...' : '連線機器人'}
                </button>

                <p className={styles.footerText}>
                    還沒有機器人？前往 <a href="#" onClick={() => window.open('https://discord.com/developers/applications')} className={styles.link}>Discord Developer Portal</a> 建立一個。
                </p>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className={styles.fullPageContainer}>
            <div className={styles.navHeader}>
                <h2 className={styles.navTitle}>
                    <Server color="#a855f7" /> 選擇伺服器
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {userInfo && (
                        <div className={styles.userInfo}>
                            {userInfo.avatar && <img src={userInfo.avatar} className={styles.userAvatar} />}
                            <span className={styles.userName}>{userInfo.username}</span>
                        </div>
                    )}
                    <button onClick={() => setStep(1)} className={styles.backBtn}>返回</button>
                </div>
            </div>

            <div className={styles.grid}>
                {guilds.map(guild => (
                    <button
                        key={guild.id}
                        onClick={() => handleSelectGuild(guild)}
                        className={styles.cardItem}
                    >
                        {guild.icon ? (
                            <img src={guild.icon} alt={guild.name} className={styles.guildIcon} />
                        ) : (
                            <div className={styles.guildPlaceholder}>
                                {guild.name.substring(0, 2)}
                            </div>
                        )}
                        <div style={{ minWidth: 0, width: '100%' }}>
                            <div className={styles.itemName}>{guild.name}</div>
                            <div className={styles.itemSub}>{guild.memberCount} 位成員</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className={styles.fullPageContainer}>
            <div className={styles.navHeader}>
                <h2 className={styles.navTitle}>
                    <span onClick={() => setStep(2)} style={{ cursor: 'pointer', opacity: 0.7 }}>{selectedGuild?.name}</span>
                    <span style={{ margin: '0 8px', opacity: 0.4 }}>/</span>
                    <Volume2 color="#f472b6" /> 選擇語音頻道
                </h2>
                <button onClick={() => setStep(2)} className={styles.backBtn}>返回</button>
            </div>

            <div className={styles.grid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {channels.map(channel => (
                    <button
                        key={channel.id}
                        onClick={() => handleJoinChannel(channel)}
                        disabled={loading}
                        className={styles.channelItem}
                    >
                        <div className={styles.channelItemLeft}>
                            <Volume2 size={20} color="#9ca3af" />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ color: '#e5e7eb', fontWeight: 500 }}>{channel.name}</div>
                                <div style={{ fontSize: '11px', color: '#6b7280' }}>{channel.members.length} 人在線</div>
                            </div>
                        </div>
                        <div className={styles.joinBadge}>
                            加入
                        </div>
                    </button>
                ))}
                {channels.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                        此伺服器中沒有發現語音頻道。
                    </div>
                )}
            </div>
        </div>
    )

    const renderStep4 = () => (
        <div className={styles.connectedContainer}>
            {/* Status Icon */}
            <div className={styles.statusIconWrapper}>
                <div className={styles.glow}></div>
                <Radio size={60} color="#a855f7" style={{ position: 'relative', zIndex: 10 }} />
                <div className={styles.onlineBadge}></div>
            </div>

            {/* Title */}
            <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>已連線到 Discord</h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#9ca3af', fontSize: '14px' }}>
                    <Server size={14} /> {selectedGuild?.name}
                    <span>•</span>
                    <Volume2 size={14} /> {activeChannel?.name}
                </div>
            </div>

            {/* Info Box */}
            <div className={styles.infoBox}>
                <h3 className={styles.infoTitle}>💡 使用提示</h3>
                <p className={styles.infoDesc}>
                    • 在主播放器中播放歌曲，機器人會自動同步<br />
                    • 本地播放器會自動靜音，音樂轉給機器人播放<br />
                    • 所有播放控制、音量調整皆同步主播放器
                </p>
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
                <button
                    onClick={handleLeaveChannel}
                    className={styles.btnSecondary}
                >
                    <LogOut size={18} /> 離開頻道
                </button>

                <button
                    onClick={handleDisconnect}
                    className={styles.btnDanger}
                >
                    <Power size={18} /> 斷開連線
                </button>
            </div>
        </div>
    )

    return (
        <div className={styles.container}>
            <div className={styles.backgroundGradient} />
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
        </div>
    )
}
