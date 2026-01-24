
import React, { useState, useEffect } from 'react'
import { Disc, Server, Volume2, LogOut, Power, Radio } from 'lucide-react'

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
        const savedToken = localStorage.getItem('discord_bot_token')
        if (savedToken) setToken(savedToken)
    }, [])

    // -- Render Helpers --

    const renderStep1 = () => (
        <div className="flex flex-col gap-6 max-w-md w-full mx-auto p-10 bg-[#1e1e1e] rounded-xl shadow-2xl border border-white/5 mt-10">
            <div className="text-center space-y-2">
                <Disc size={48} className="mx-auto text-purple-500 animate-spin-slow" />
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Discord 機器人連線
                </h2>
                <p className="text-gray-400 text-sm">直接在您的 Discord 伺服器中控制音樂播放。</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wide">機器人 Token</label>
                    <input
                        type="password"
                        value={token}
                        onChange={e => setToken(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm"
                        placeholder="請輸入 Discord Bot Token..."
                    />
                </div>

                {error && <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</div>}

                <button
                    onClick={handleLogin}
                    disabled={loading || !token}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                >
                    {loading ? '連線中...' : '連線機器人'}
                </button>

                <p className="text-xs text-center text-gray-600">
                    還沒有機器人？前往 <a href="#" onClick={() => window.open('https://discord.com/developers/applications')} className="text-purple-400 hover:underline">Discord Developer Portal</a> 建立一個。
                </p>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Server className="text-purple-400" /> 選擇伺服器
                </h2>
                <div className="flex items-center gap-4">
                    {userInfo && (
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                            {userInfo.avatar && <img src={userInfo.avatar} className="w-6 h-6 rounded-full" />}
                            <span className="text-sm font-medium text-gray-300">{userInfo.username}</span>
                        </div>
                    )}
                    <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white text-sm">返回</button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto pb-10">
                {guilds.map(guild => (
                    <button
                        key={guild.id}
                        onClick={() => handleSelectGuild(guild)}
                        className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/50 transition-all hover:-translate-y-1"
                    >
                        {guild.icon ? (
                            <img src={guild.icon} alt={guild.name} className="w-16 h-16 rounded-2xl shadow-lg group-hover:shadow-purple-500/20 transition-all" />
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xl font-bold shadow-lg">
                                {guild.name.substring(0, 2)}
                            </div>
                        )}
                        <div className="text-center">
                            <div className="font-semibold text-white truncate max-w-[120px]">{guild.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{guild.memberCount} 位成員</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="text-purple-400 cursor-pointer hover:underline" onClick={() => setStep(2)}>{selectedGuild?.name}</span>
                    <span className="text-gray-600">/</span>
                    <Volume2 className="text-pink-400" /> 選擇語音頻道
                </h2>
                <button onClick={() => setStep(2)} className="text-gray-400 hover:text-white text-sm">返回</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-10">
                {channels.map(channel => (
                    <button
                        key={channel.id}
                        onClick={() => handleJoinChannel(channel)}
                        disabled={loading}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 group transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <Volume2 className="text-gray-400 group-hover:text-purple-400 size-5" />
                            <div className="text-left">
                                <div className="font-medium text-gray-200 group-hover:text-white">{channel.name}</div>
                                <div className="text-xs text-gray-500">{channel.members.length} 人在線</div>
                            </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 text-xs font-bold bg-purple-600 text-white px-3 py-1 rounded-full shadow-lg transition-opacity">
                            加入
                        </div>
                    </button>
                ))}
                {channels.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        此伺服器中沒有發現語音頻道。
                    </div>
                )}
            </div>
        </div>
    )

    const renderStep4 = () => (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="relative">
                <div className="absolute -inset-4 bg-purple-500/20 blur-xl rounded-full animate-pulse"></div>
                <Radio size={80} className="text-purple-400 relative z-10" />
                <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#121212] z-20"></div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-white mb-2">已連線到 Discord</h2>
                <div className="text-gray-400 flex items-center justify-center gap-2">
                    <Server size={14} /> {selectedGuild?.name}
                    <span className="text-gray-600">•</span>
                    <Volume2 size={14} /> {activeChannel?.name}
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-lg w-full">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">正在控制</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                    現在使用主播放器播放音樂時，<br />
                    Discord 機器人將會同步播放音樂到頻道中。
                </p>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleLeaveChannel}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                    <LogOut size={18} /> 離開頻道
                </button>

                <button
                    onClick={handleDisconnect}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg font-medium transition-colors"
                >
                    <Power size={18} /> 斷開連線
                </button>
            </div>
        </div>
    )

    return (
        <div className="h-full w-full bg-[#121212] flex flex-col overflow-hidden relative">
            {/* Background Aesthetics */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />

            <div className="flex-1 relative z-10 overflow-hidden">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
            </div>
        </div>
    )
}
