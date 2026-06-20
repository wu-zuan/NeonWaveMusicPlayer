import { useEffect, useState } from 'react'
import { Link2, Radio, Square, Play } from 'lucide-react'
import styles from './ListeningPartyPanel.module.css'

type PartyStatus = {
    active: boolean
    roomId: string | null
    inviteUrl: string | null
    localUrl: string | null
    publicUrl: string | null
    tunnelStatus: 'idle' | 'starting' | 'connected' | 'error'
    tunnelMessage?: string
    cloudflaredAvailable: boolean
    cloudflaredState: 'idle' | 'downloading' | 'ready' | 'error'
    cloudflaredMessage?: string
    cloudflaredProgress?: number
    track: {
        title: string
        artist: string
        album?: string
        artwork?: string
        currentTime: number
        duration: number
        isPlaying: boolean
        streamable: boolean
    } | null
}

const initialStatus: PartyStatus = {
    active: false,
    roomId: null,
    inviteUrl: null,
    localUrl: null,
    publicUrl: null,
    tunnelStatus: 'idle',
    cloudflaredAvailable: false,
    cloudflaredState: 'idle',
    track: null
}

export function ListeningPartyPanel() {
    const [status, setStatus] = useState<PartyStatus>(initialStatus)
    const [busy, setBusy] = useState(false)
    const [message, setMessage] = useState('')

    const refresh = async () => {
        try {
            const res = await window.ipcRenderer.invoke<PartyStatus>('party:status')
            setStatus(res)
        } catch (err) {
            setMessage(err instanceof Error ? err.message : String(err))
        }
    }

    useEffect(() => {
        refresh()
        const timer = setInterval(refresh, 2500)
        return () => clearInterval(timer)
    }, [])

    const startParty = async () => {
        setBusy(true)
        setMessage('')
        try {
            const res = await window.ipcRenderer.invoke<PartyStatus>('party:start', { autoTunnel: true })
            setStatus(res)
        } catch (err) {
            setMessage(err instanceof Error ? err.message : String(err))
        } finally {
            setBusy(false)
        }
    }

    const stopParty = async () => {
        setBusy(true)
        setMessage('')
        try {
            await window.ipcRenderer.invoke('party:stop')
            setStatus(initialStatus)
        } catch (err) {
            setMessage(err instanceof Error ? err.message : String(err))
        } finally {
            setBusy(false)
        }
    }

    const copyInvite = async () => {
        const text = status.publicUrl || ''
        if (!text) {
            setMessage('請等 Cloudflare 公開網址建立完成後再複製')
            return
        }
        await navigator.clipboard.writeText(text)
        setMessage('已複製邀請連結')
        setTimeout(() => setMessage(''), 2000)
    }

    const currentLabel = status.active
        ? (status.publicUrl ? 'Cloudflare Tunnel 已連線' : '本機房間已啟動')
        : '尚未建立聆聽房間'

    const linkLabel = status.publicUrl
        ? '分享連結已就緒'
        : status.tunnelStatus === 'starting' || status.cloudflaredState === 'downloading'
            ? '正在建立 Cloudflare Tunnel'
            : status.active
                ? '等待 Cloudflare 產生公開連結'
                : '尚未建立分享房間'

    const linkDescription = status.publicUrl
        ? '現在可以把公開網址分享給朋友。'
        : status.tunnelStatus === 'starting' || status.cloudflaredState === 'downloading'
            ? '請稍候，正在背景準備公開連結。'
            : status.active
                ? '房間已啟動，但還沒拿到可對外分享的網址。'
                : '按下建立房間後，會自動下載依賴並開啟 Tunnel。'

    const cloudflaredLabel = status.cloudflaredState === 'downloading'
        ? '背景下載中'
        : status.cloudflaredState === 'ready'
            ? '已就緒'
            : status.cloudflaredState === 'error'
                ? '發生錯誤'
                : '尚未檢查'

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div>
                    <div className={styles.kicker}>Listening Party</div>
                    <h3 className={styles.title}>線上分享聆聽</h3>
                </div>
                <Radio size={18} color="var(--accent-primary)" />
            </div>

            <div className={styles.body}>
                <div className={styles.noticeBox}>
                    <div className={styles.noticeTitle}>首次使用提醒</div>
                    <div className={styles.noticeText}>
                        這個功能會在你的電腦上自動下載 Cloudflare Tunnel 的依賴 <code>cloudflared</code>。
                        音樂不會上傳到我們的伺服器，房間只由你自己的主機對外公開。
                    </div>
                </div>

                <div className={styles.statusRow}>
                    <span className={styles.label}>狀態</span>
                    <span className={styles.value}>{currentLabel}</span>
                </div>
                <div className={styles.statusRow}>
                    <span className={styles.label}>依賴</span>
                    <span className={styles.value}>{cloudflaredLabel}</span>
                </div>
                <div className={styles.statusRow}>
                    <span className={styles.label}>Tunnel</span>
                    <span className={styles.value}>
                        {status.tunnelStatus === 'connected' ? '已啟動' : status.tunnelStatus === 'starting' ? '啟動中' : status.tunnelStatus === 'error' ? '錯誤' : '未啟動'}
                    </span>
                </div>
                <div className={styles.statusRow}>
                    <span className={styles.label}>歌曲</span>
                    <span className={styles.value}>
                        {status.track ? `${status.track.title} - ${status.track.artist || '未知演出者'}` : '尚未同步'}
                    </span>
                </div>

                <div className={styles.linkBox}>
                    <div className={styles.linkLabel}>分享連結</div>
                    {status.publicUrl ? (
                        <div className={styles.linkValue}>{status.publicUrl}</div>
                    ) : (
                        <div className={styles.linkPlaceholder}>
                            <span className={styles.statusDot} />
                            <div>
                                <div className={styles.linkHeadline}>{linkLabel}</div>
                                <div className={styles.linkSubtext}>{linkDescription}</div>
                            </div>
                        </div>
                    )}
                    {!status.publicUrl ? (
                        <div className={styles.linkLoading}>
                            <div className={styles.loadingBar} />
                        </div>
                    ) : null}
                </div>

                {status.cloudflaredState === 'downloading' && typeof status.cloudflaredProgress === 'number' ? (
                    <div className={styles.progressBox}>
                        <div className={styles.progressTrack}>
                            <div className={styles.progressFill} style={{ width: `${Math.max(0, Math.min(100, status.cloudflaredProgress * 100))}%` }} />
                        </div>
                        <div className={styles.progressText}>{Math.round(status.cloudflaredProgress * 100)}%</div>
                    </div>
                ) : null}

                {message ? <div className={styles.notice}>{message}</div> : null}

                {status.tunnelMessage ? <div className={styles.subtle}>{status.tunnelMessage}</div> : null}
                {status.cloudflaredMessage ? <div className={styles.subtle}>{status.cloudflaredMessage}</div> : null}
                {!status.cloudflaredAvailable && status.active ? <div className={styles.subtle}>找不到 cloudflared，請先安裝 Cloudflare Tunnel CLI。</div> : null}
            </div>

            <div className={styles.actions}>
                {!status.active ? (
                    <button className={styles.primaryBtn} onClick={startParty} disabled={busy}>
                        <Play size={16} />
                        {status.cloudflaredState === 'idle' ? '建立房間並自動安裝依賴' : '建立房間並啟動 Tunnel'}
                    </button>
                ) : (
                    <button className={styles.primaryBtn} onClick={stopParty} disabled={busy}>
                        <Square size={16} />
                        停止分享
                    </button>
                )}

                <button className={styles.secondaryBtn} onClick={copyInvite} disabled={!status.publicUrl}>
                    <Link2 size={16} />
                    複製邀請連結
                </button>
            </div>
        </div>
    )
}
