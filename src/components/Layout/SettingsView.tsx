import { useState, useEffect } from 'react'
import { RefreshCw, Download, CheckCircle, AlertCircle } from 'lucide-react'

const ScanProgress = () => {
    const [scanData, setScanData] = useState<{current: number, total: number, success: number} | null>(null);

    useEffect(() => {
        const remove = (window as any).ipcRenderer.on('discord:scanProgress', (_: any, data: any) => {
            setScanData(data);
            if (data.current === data.total) {
                setTimeout(() => setScanData(null), 5000);
            }
        });
        return () => { if (remove) remove(); };
    }, []);

    if (!scanData) return null;

    const percentage = Math.round((scanData.current / scanData.total) * 100);

    return (
        <div style={{ marginTop: '16px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                <span>正在預載封面圖...</span>
                <span>{scanData.current} / {scanData.total} ({percentage}%)</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }}></div>
            </div>
            <div style={{ fontSize: '12px', marginTop: '8px', color: '#4ade80' }}>
                成功上傳: {scanData.success}
            </div>
        </div>
    );
};

export function useUpdater() {
    const [status, setStatus] = useState<string>('idle') 
    const [progress, setProgress] = useState<any>(null)
    const [version, setVersion] = useState<string>('...')
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
                        <h4 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Discord RPC</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)' }}>啟用 Discord 狀態顯示</span>
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        defaultChecked={localStorage.getItem('neonwave_enable_discord_rpc') !== 'false'}
                                        onChange={(e) => {
                                            const enabled = e.target.checked;
                                            localStorage.setItem('neonwave_enable_discord_rpc', enabled.toString());
                                            if (!enabled) {
                                                window.ipcRenderer.invoke('discord:clearPresence');
                                            }
                                        }}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        <h4 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--text-main)' }}>Discord 狀態優化</h4>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
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
                                    fontSize: '14px', transition: 'all 0.2s',
                                }}
                            >
                                清除圖片快取
                            </button>

                            <button
                                onClick={() => window.ipcRenderer.invoke('discord:scanAndUpload')}
                                style={{
                                    padding: '10px 20px', borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid var(--glass-border)',
                                    fontSize: '14px', transition: 'all 0.2s',
                                    color: 'var(--accent)'
                                }}
                            >
                                批量預載資料夾封面圖
                            </button>
                        </div>

                        {/* Progress UI managed by React state */}
                        <ScanProgress />
                    </div>

                    <div style={{ marginTop: '24px', borderTop: '1px solid var(--glass-border)', paddingTop: '24px' }}>
                        <h4 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>介面設定</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ color: 'var(--text-main)' }}>啟用 迷你播放器 (PIP)</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>在螢幕右上角顯示懸浮圓形播放器</div>
                            </div>
                            <label className="switch">
                                <input 
                                    type="checkbox" 
                                    defaultChecked={localStorage.getItem('neonwave_mini_player') === 'true'}
                                    onChange={async (e) => {
                                        const enabled = e.target.checked;
                                        localStorage.setItem('neonwave_mini_player', enabled.toString());
                                        await window.ipcRenderer.invoke('window:toggleMiniPlayer');
                                    }}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>

                        {/* Mini Player Game Mode Option */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                            <div>
                                <div style={{ color: 'var(--text-main)' }}>迷你播放器遊戲模式 (點擊穿透)</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '480px', marginTop: '4px', lineHeight: '1.5' }}>
                                    當偵測到執行遊戲（如 <b>Valorant 瓦羅蘭</b>、<b>League of Legends 英雄聯盟</b> 等）時：
                                    <br />
                                    • <b>自動</b>：自動設定為點擊穿透，完全不影響滑鼠與瞄準，並降低不透明度與縮小以防干擾。切回桌面時自動恢復正常。
                                    <br />
                                    • <b>始終點擊穿透</b>：始終點擊穿透，不受遊戲狀態限制，適合當作純桌面小組件的玩家。
                                </div>
                            </div>
                            <select 
                                className="settings-select"
                                defaultValue={localStorage.getItem('neonwave_mini_game_mode') || 'auto'}
                                onChange={(e) => {
                                    localStorage.setItem('neonwave_mini_game_mode', e.target.value);
                                    window.dispatchEvent(new Event('neonwave:settings-changed'));
                                }}
                            >
                                <option value="off">🚫 關閉 (正常點擊與移動)</option>
                                <option value="auto">🎮 自動 (偵測到遊戲時點擊穿透)</option>
                                <option value="always">🔒 始終啟用 (始終點擊穿透)</option>
                            </select>
                        </div>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>預設下載格式</span>
                            <select 
                                className="settings-select"
                                defaultValue={localStorage.getItem('neonwave_download_format') || 'm4a'}
                                onChange={(e) => {
                                    localStorage.setItem('neonwave_download_format', e.target.value);
                                }}
                            >
                                <option value="m4a">m4a (最高相容性與音質)</option>
                                <option value="mp4">mp4 (若無mp4則自動使用m4a)</option>
                            </select>
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
        
        .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 26px;
        }
        .switch input { 
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.1);
            transition: .4s;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
        }
        input:checked + .slider {
            background-color: var(--accent);
            border-color: var(--accent);
        }
        input:focus + .slider {
            box-shadow: 0 0 1px var(--accent);
        }
        input:checked + .slider:before {
            transform: translateX(24px);
        }
        .slider.round {
            border-radius: 34px;
        }
        .slider.round:before {
            border-radius: 50%;
        }
      `}</style>
        </div>
    )
}
