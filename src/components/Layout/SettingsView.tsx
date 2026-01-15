import { useState, useEffect } from 'react'
import { RefreshCw, Download, CheckCircle, AlertCircle, Key, Eye, EyeOff } from 'lucide-react'

export function useUpdater() {
    const [status, setStatus] = useState<string>('idle') // idle, checking, available, not-available, downloading, downloaded, error
    const [progress, setProgress] = useState<any>(null)
    const [version, setVersion] = useState<string>('')
    const [error, setError] = useState<string>('')

    useEffect(() => {
        window.ipcRenderer.getAppVersion().then(setVersion)

        const cleanup = window.ipcRenderer.onUpdateStatus((data) => {
            console.log('Update Status:', data)
            setStatus(data.status)
            if (data.progress) setProgress(data.progress)
            if (data.error) setError(data.error)
        })

        return cleanup
    }, [])

    const checkForUpdates = () => {
        setStatus('checking')
        setError('')
        window.ipcRenderer.checkUpdate()
    }

    const installUpdate = () => {
        window.ipcRenderer.installUpdate()
    }

    return { status, progress, version, error, checkForUpdates, installUpdate }
}

export function SettingsView() {
    const { status, progress, version, error, checkForUpdates, installUpdate } = useUpdater()
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('neonwave_openai_key') || '')
    const [showKey, setShowKey] = useState(false)

    const handleSaveKey = () => {
        localStorage.setItem('neonwave_openai_key', apiKey.trim())
        alert('API Key 已儲存！')
    }

    return (
        <div style={{ padding: '40px', maxWidth: '800px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '32px', fontWeight: 700 }}>設定</h2>

            {/* AI Settings */}
            <div className="glass" style={{ padding: '32px', borderRadius: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Key size={20} color="var(--accent-primary)" />
                    AI 歌詞生成設定 (Whisper)
                </h3>
                <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                    啟用此功能可自動為沒有歌詞的歌曲生成字幕。
                    <br />
                    需要 OpenAI API Key (產生使用費用)。
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input
                            type={showKey ? "text" : "password"}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-..."
                            style={{
                                width: '100%', padding: '12px', paddingRight: '40px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                                borderRadius: '12px', color: '#fff', outline: 'none'
                            }}
                        />
                        <button
                            onClick={() => setShowKey(!showKey)}
                            style={{
                                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                            }}
                        >
                            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    <button
                        onClick={handleSaveKey}
                        style={{
                            padding: '0 24px', borderRadius: '12px',
                            background: 'var(--accent-primary)', color: '#000', fontWeight: 'bold',
                            border: 'none', cursor: 'pointer'
                        }}
                    >
                        儲存
                    </button>
                </div>
            </div>

            <div className="glass" style={{ padding: '32px', borderRadius: '24px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>關於 NeonWave</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <img src="logo.png" alt="NeonWave Logo" style={{
                        width: '64px', height: '64px', borderRadius: '16px',
                        objectFit: 'cover',
                        boxShadow: '0 0 20px var(--accent-glow)'
                    }} />
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: 700 }}>NeonWave</div>
                        <div style={{ color: 'var(--text-muted)' }}>v{version}</div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px' }}>
                    <h4 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>更新狀態</h4>

                    {status === 'idle' && (
                        <button
                            onClick={checkForUpdates}
                            style={{
                                padding: '12px 24px', borderRadius: '12px',
                                background: 'rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                fontWeight: 600, transition: 'all 0.2s'
                            }}
                        >
                            <RefreshCw size={18} /> 檢查更新
                        </button>
                    )}

                    {status === 'checking' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                            <RefreshCw size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                            正在檢查更新...
                        </div>
                    )}

                    {status === 'not-available' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4ade80' }}>
                            <CheckCircle size={18} />
                            目前已是最新版本！
                        </div>
                    )}

                    {status === 'available' && (
                        <div style={{ color: 'var(--accent-primary)' }}>
                            發現新版本！正在自動下載...
                        </div>
                    )}

                    {status === 'downloading' && progress && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                <span>正在下載更新...</span>
                                <span>{Math.round(progress.percent)}%</span>
                            </div>
                            <div style={{
                                height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${progress.percent}%`, height: '100%',
                                    background: 'var(--accent-primary)',
                                    transition: 'width 0.2s ease'
                                }}></div>
                            </div>
                        </div>
                    )}

                    {status === 'downloaded' && (
                        <div>
                            <div style={{ marginBottom: '16px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle size={18} />
                                更新已下載完成，準備安裝。
                            </div>
                            <button
                                onClick={installUpdate}
                                style={{
                                    padding: '12px 24px', borderRadius: '12px',
                                    background: 'var(--accent-primary)', color: '#000',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    fontWeight: 700,
                                    boxShadow: '0 0 20px var(--accent-glow)'
                                }}
                            >
                                <Download size={18} /> 重啟並安裝
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={18} />
                            更新失敗: {error}
                            <button onClick={checkForUpdates} style={{ marginLeft: '16px', textDecoration: 'underline' }}>重試</button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
        </div>
    )
}
