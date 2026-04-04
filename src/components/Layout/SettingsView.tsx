import { useState, useEffect } from 'react'
import { RefreshCw, Download, CheckCircle, AlertCircle } from 'lucide-react'

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

    return (
        <div style={{ padding: '40px', maxWidth: '800px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '32px', fontWeight: 700 }}>設定</h2>



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

                    <div style={{ marginTop: '24px', borderTop: '1px solid var(--glass-border)', paddingTop: '24px' }}>
                        <h4 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Discord 狀態優化</h4>
                        <button
                            onClick={async (e) => {
                                const btn = e.currentTarget;
                                const originalText = btn.innerHTML;
                                try {
                                    await window.ipcRenderer.invoke('discord:clearCache');
                                    btn.innerHTML = '<span style="color:#4ade80">✓ 快取已清理，重新播放即可更新</span>';
                                    setTimeout(() => btn.innerHTML = originalText, 3000);
                                } catch (e) {}
                            }}
                            style={{
                                padding: '10px 20px', borderRadius: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                fontSize: '14px', transition: 'all 0.2s'
                            }}
                        >
                            一鍵更新圖片動態（清除上傳快取）
                        </button>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px', marginTop: '24px' }}>
                    <h4 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>下載設定</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>並行下載數量 (請依據您的網路頻寬選擇)</span>
                            <select 
                                className="settings-select"
                                defaultValue={localStorage.getItem('neonwave_download_concurrency') || '2'}
                                onChange={(e) => {
                                    localStorage.setItem('neonwave_download_concurrency', e.target.value);
                                    // 確保無單獨限速，自動發揮最大頻寬
                                    localStorage.removeItem('neonwave_download_speed');
                                }}
                            >
                                <option value="1">1 首 (背景下載 / 較省 CPU)</option>
                                <option value="3">3 首 (一般 Wi-Fi / 筆電建議)</option>
                                <option value="5">5 首 (100M 光世代建議)</option>
                                <option value="10">10 首 (300M 光世代建議)</option>
                                <option value="15">15 首 (500M 光世代建議)</option>
                                <option value="24">24 首 (1G 光世代火力全開！)</option>
                            </select>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '-8px' }}>
                            * 註：不提供人為限速，系統將直接根據您的網路頻寬發揮最大效益。請注意並行數量越高，越吃重電腦的 CPU 處理能力 (因需同步執行轉碼)。
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .settings-select {
            appearance: none;
            background-color: rgba(0, 0, 0, 0.4);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 10px 36px 10px 16px;
            border-radius: 10px;
            font-size: 14px;
            cursor: pointer;
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'16'%20height%3D'16'%20viewBox%3D'0%200%2024%2024'%20fill%3D'none'%20stroke%3D'%23a1a1aa'%20stroke-width%3D'2'%20stroke-linecap%3D'round'%20stroke-linejoin%3D'round'%3E%3Cpolyline%20points%3D'6%209%2012%2015%2018%209'%2F%3E%3C%2Fsvg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            outline: none;
            transition: all 0.2s ease;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }
        .settings-select:hover {
            border-color: rgba(255, 255, 255, 0.3);
            background-color: rgba(0, 0, 0, 0.6);
        }
        .settings-select:focus {
            border-color: #8b5cf6;
            box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3);
            background-color: rgba(0, 0, 0, 0.8);
        }
        .settings-select option {
            background-color: #1a1b1e;
            color: #fff;
            font-size: 14px;
            padding: 12px;
        }
      `}</style>
        </div>
    )
}
