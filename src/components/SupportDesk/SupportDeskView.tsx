import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Bot,
    CheckCircle2,
    Clock3,
    RefreshCw,
    Search,
    ShieldAlert,
    Sparkles,
    TimerReset,
    TriangleAlert,
    UserRound,
    MessagesSquare,
    Layers3,
    BadgeCheck,
    ArrowRight,
} from 'lucide-react'
import styles from './SupportDeskView.module.css'

type TicketStatus = 'queued' | 'analyzing' | 'drafting' | 'waiting_human' | 'resolved'
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

type TimelineStage = {
    key: string
    title: string
    description: string
    status: 'done' | 'active' | 'pending'
}

type Ticket = {
    id: string
    customer: string
    subject: string
    channel: string
    assignee: string
    model: string
    status: TicketStatus
    priority: TicketPriority
    progress: number
    createdAt: string
    updatedAt: string
    sla: string
    tags: string[]
    summary: string
    lastMessage: string
    stages: TimelineStage[]
    activity: Array<{ time: string; text: string }>
}

const statusMeta: Record<TicketStatus, { label: string; tone: string; icon: React.ReactNode }> = {
    queued: { label: '排隊中', tone: 'neutral', icon: <Clock3 size={14} /> },
    analyzing: { label: '分析中', tone: 'info', icon: <Sparkles size={14} /> },
    drafting: { label: '生成中', tone: 'warn', icon: <Bot size={14} /> },
    waiting_human: { label: '待人工', tone: 'warn', icon: <ShieldAlert size={14} /> },
    resolved: { label: '已完成', tone: 'good', icon: <CheckCircle2 size={14} /> },
}

const priorityMeta: Record<TicketPriority, { label: string; tone: string }> = {
    low: { label: '低', tone: 'neutral' },
    medium: { label: '中', tone: 'info' },
    high: { label: '高', tone: 'warn' },
    urgent: { label: '緊急', tone: 'good' },
}

export const SupportDeskView: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState<'all' | TicketStatus>('all')
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const loadTickets = useCallback(async () => {
        setLoading(true)
        setLoadError(null)
        try {
            const rows = await window.ipcRenderer.getSupportTickets()
            setTickets(rows as Ticket[])
            setSelectedId(prev => prev && rows.some((row: Ticket) => row.id === prev) ? prev : (rows[0]?.id || null))
        } catch (error) {
            console.error('[SupportDesk] Failed to load tickets:', error)
            setLoadError('無法從 MySQL 載入客服單')
            setTickets([])
            setSelectedId(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadTickets()
    }, [loadTickets])

    const filteredTickets = useMemo(() => {
        const q = query.trim().toLowerCase()
        return tickets.filter(ticket => {
            const matchesFilter = filter === 'all' ? true : ticket.status === filter
            const haystack = [
                ticket.id,
                ticket.customer,
                ticket.subject,
                ticket.channel,
                ticket.assignee,
                ticket.model,
                ticket.summary,
                ...ticket.tags,
            ].join(' ').toLowerCase()
            const matchesQuery = !q || haystack.includes(q)
            return matchesFilter && matchesQuery
        })
    }, [tickets, query, filter])

    useEffect(() => {
        if (filteredTickets.length === 0) return
        if (!filteredTickets.some(t => t.id === selectedId)) {
            setSelectedId(filteredTickets[0].id)
        }
    }, [filteredTickets, selectedId])

    const selectedTicket = useMemo(() => {
        return filteredTickets.find(t => t.id === selectedId) || filteredTickets[0] || null
    }, [filteredTickets, selectedId])

    const metrics = useMemo(() => {
        if (tickets.length === 0) {
            return { openCount: 0, activeCount: 0, humanCount: 0, avgProgress: 0 }
        }
        const openCount = tickets.filter(t => t.status !== 'resolved').length
        const activeCount = tickets.filter(t => t.status === 'analyzing' || t.status === 'drafting').length
        const humanCount = tickets.filter(t => t.status === 'waiting_human').length
        const avgProgress = Math.round(tickets.reduce((sum, t) => sum + t.progress, 0) / tickets.length)
        return { openCount, activeCount, humanCount, avgProgress }
    }, [tickets])

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <section className={styles.hero}>
                    <div>
                        <div className={styles.eyebrow}>Support AI Operations</div>
                        <h1 className={styles.title}>客服單與 AI 進度看板</h1>
                        <p className={styles.subtitle}>
                            這裡可以即時查看客戶送進 AI 的請求、處理進度、等待人工覆核狀態，
                            也能快速篩選緊急工單與追蹤整個回覆流程。
                        </p>
                    </div>
                    <div className={styles.heroMeta}>
                        <div className={styles.metaChip}>
                            <span>系統狀態</span>
                            <span className={styles.metaValue}>{loadError ? '資料異常' : loading ? '同步中' : '正常運作'}</span>
                        </div>
                        <div className={styles.metaChip}>
                            <span>最後同步</span>
                            <span className={styles.metaValue}>{loading ? '同步中' : '剛剛'}</span>
                        </div>
                        <div className={styles.metaChip}>
                            <span>今日 AI 工單</span>
                            <span className={styles.metaValue}>{tickets.length}</span>
                        </div>
                    </div>
                </section>

                <section className={styles.toolbar}>
                    <div className={styles.search}>
                        <Search size={16} color="var(--text-muted)" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="搜尋客服單、客戶、關鍵字、模型..."
                        />
                    </div>
                    <div className={styles.filters}>
                        <button className={styles.filterBtn} onClick={loadTickets}>
                            <RefreshCw size={14} style={{ marginRight: 6 }} />
                            重新同步
                        </button>
                        {[
                            ['all', '全部'],
                            ['queued', '排隊中'],
                            ['analyzing', '分析中'],
                            ['drafting', '生成中'],
                            ['waiting_human', '待人工'],
                            ['resolved', '已完成'],
                        ].map(([key, label]) => (
                            <button
                                key={key}
                                className={`${styles.filterBtn} ${filter === key ? styles.active : ''}`}
                                onClick={() => setFilter(key as 'all' | TicketStatus)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </section>

                {loadError && (
                    <div className={`${styles.panel} ${styles.detail}`} style={{ padding: '16px 18px', color: '#fca5a5' }}>
                        {loadError}
                    </div>
                )}

                <section className={styles.metrics}>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>未完成工單</div>
                        <div className={styles.metricValue}>{metrics.openCount}</div>
                        <div className={styles.metricHint}>目前還在處理中的客服單</div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>AI 進行中</div>
                        <div className={styles.metricValue}>{metrics.activeCount}</div>
                        <div className={styles.metricHint}>正在推理或撰寫回覆</div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>待人工覆核</div>
                        <div className={styles.metricValue}>{metrics.humanCount}</div>
                        <div className={styles.metricHint}>需要客服最後確認</div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>平均進度</div>
                        <div className={styles.metricValue}>{metrics.avgProgress}%</div>
                        <div className={styles.metricHint}>所有客服單平均完成率</div>
                    </div>
                </section>

                <section className={styles.grid}>
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <div>
                                <h2 className={styles.panelTitle}>客服單列表</h2>
                                <div className={styles.panelSub}>{filteredTickets.length} 筆符合條件</div>
                            </div>
                        </div>
                        <div className={styles.ticketList}>
                            {filteredTickets.length === 0 && (
                                <div style={{ padding: '18px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                    沒有符合條件的客服單，請調整關鍵字或篩選條件。
                                </div>
                            )}

                            {filteredTickets.map(ticket => {
                                const status = statusMeta[ticket.status]
                                const priority = priorityMeta[ticket.priority]
                                const isActive = ticket.id === selectedTicket?.id
                                return (
                                    <div
                                        key={ticket.id}
                                        className={`${styles.ticketCard} ${isActive ? styles.active : ''}`}
                                        onClick={() => setSelectedId(ticket.id)}
                                    >
                                        <div className={styles.ticketTop}>
                                            <div>
                                                <div className={styles.ticketSubject}>{ticket.subject}</div>
                                                <div className={styles.ticketMeta}>
                                                    <span>{ticket.id}</span>
                                                    <span>·</span>
                                                    <span>{ticket.customer}</span>
                                                    <span>·</span>
                                                    <span>{ticket.channel}</span>
                                                </div>
                                            </div>
                                            <span className={`${styles.badge} ${styles[status.tone as keyof typeof styles] || styles.info}`}>
                                                {status.icon}
                                                {status.label}
                                            </span>
                                        </div>
                                        <div className={styles.ticketMeta}>
                                            <span className={`${styles.badge} ${styles[priority.tone as keyof typeof styles] || styles.neutral}`}>
                                                {priority.label} 優先
                                            </span>
                                            <span className={`${styles.badge} ${styles.info}`}>{ticket.model}</span>
                                            <span className={`${styles.badge} ${styles.neutral}`}>{ticket.sla}</span>
                                        </div>
                                        <div className={styles.ticketMeta}>
                                            {ticket.tags.map(tag => (
                                                <span key={tag} className={`${styles.badge} ${styles.neutral}`}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <div>
                                <h2 className={styles.panelTitle}>AI 處理進度</h2>
                                <div className={styles.panelSub}>追蹤從收到請求到完成覆核的整條流程</div>
                            </div>
                            <span className={`${styles.badge} ${styles.info}`}>
                                <Layers3 size={14} />
                                流程可視化
                            </span>
                        </div>

                        <div className={styles.detail}>
                            <div className={styles.detailHead}>
                                    {selectedTicket ? (
                                        <>
                                            <div>
                                                <div className={styles.detailMeta}>
                                                    <span className={`${styles.badge} ${styles[statusMeta[selectedTicket.status].tone as keyof typeof styles] || styles.info}`}>
                                                        {statusMeta[selectedTicket.status].icon}
                                                        {statusMeta[selectedTicket.status].label}
                                                    </span>
                                                    <span className={`${styles.badge} ${styles.neutral}`}>
                                                        <TimerReset size={14} />
                                                        由 {selectedTicket.assignee} 處理
                                                    </span>
                                                </div>
                                                <h3 className={styles.detailTitle}>{selectedTicket.subject}</h3>
                                                <div className={styles.panelSub}>{selectedTicket.summary}</div>
                                            </div>
                                            <div style={{ minWidth: 180, textAlign: 'right' }}>
                                                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>更新時間</div>
                                                <div style={{ fontSize: 18, fontWeight: 800 }}>{selectedTicket.updatedAt}</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>SLA {selectedTicket.sla}</div>
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ color: 'var(--text-muted)' }}>沒有可顯示的工單。</div>
                                    )}
                                </div>

                            {selectedTicket && (
                                <>
                                    <div className={styles.progressWrap}>
                                        <div className={styles.progressLabels}>
                                            <span>已完成 {selectedTicket.progress}%</span>
                                            <span>預計完成 {selectedTicket.progress >= 85 ? '很快' : '約 3-5 分鐘'}</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div className={styles.progressFill} style={{ width: `${selectedTicket.progress}%` }} />
                                        </div>
                                        <div className={styles.progressLabels}>
                                            <span>建立於 {selectedTicket.createdAt}</span>
                                            <span>最後訊息：{selectedTicket.lastMessage}</span>
                                        </div>
                                    </div>

                                    <div className={styles.timeline}>
                                        {selectedTicket.stages.map(stage => (
                                            <div key={stage.key} className={styles.timelineItem}>
                                                <div
                                                    className={`${styles.timelineDot} ${
                                                        stage.status === 'done' ? styles.done : stage.status === 'active' ? styles.active : ''
                                                    }`}
                                                />
                                                <div>
                                                    <div className={styles.timelineTitle}>
                                                        {stage.title}
                                                        {stage.status === 'active' && (
                                                            <span className={`${styles.badge} ${styles.info}`} style={{ marginLeft: 8 }}>
                                                                進行中
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={styles.timelineText}>{stage.description}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className={styles.sidebar}>
                        <div className={styles.panel}>
                            <div className={styles.panelHeader}>
                                <div>
                                    <h2 className={styles.panelTitle}>即時事件</h2>
                                    <div className={styles.panelSub}>顯示系統與 AI 的最近狀態變化</div>
                                </div>
                                <MessagesSquare size={18} color="var(--accent-primary)" />
                            </div>
                            <div className={styles.activityList}>
                                {selectedTicket?.activity?.map(item => (
                                    <div key={`${item.time}-${item.text}`} className={styles.activityItem}>
                                        <div className={styles.activityTop}>
                                            <span>{item.time}</span>
                                            <span>Live</span>
                                        </div>
                                        <div className={styles.activityMsg}>{item.text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.panel}>
                            <div className={styles.panelHeader}>
                                <div>
                                    <h2 className={styles.panelTitle}>快速資訊</h2>
                                    <div className={styles.panelSub}>目前客服單的處理摘要</div>
                                </div>
                                <BadgeCheck size={18} color="#4ade80" />
                            </div>
                            <div className={styles.smallList}>
                                {selectedTicket ? (
                                    <>
                                        <div className={styles.smallRow}>
                                            <div>
                                                <div className={styles.smallLabel}>客戶</div>
                                                <div className={styles.smallValue}>{selectedTicket.customer}</div>
                                            </div>
                                            <UserRound size={18} color="var(--text-muted)" />
                                        </div>
                                        <div className={styles.smallRow}>
                                            <div>
                                                <div className={styles.smallLabel}>來源通路</div>
                                                <div className={styles.smallValue}>{selectedTicket.channel}</div>
                                            </div>
                                            <ArrowRight size={18} color="var(--text-muted)" />
                                        </div>
                                        <div className={styles.smallRow}>
                                            <div>
                                                <div className={styles.smallLabel}>使用模型</div>
                                                <div className={styles.smallValue}>{selectedTicket.model}</div>
                                            </div>
                                            <Bot size={18} color="var(--accent-primary)" />
                                        </div>
                                        <div className={styles.smallRow}>
                                            <div>
                                                <div className={styles.smallLabel}>風險提示</div>
                                                <div className={styles.smallValue}>
                                                    {selectedTicket.priority === 'urgent' || selectedTicket.status === 'waiting_human'
                                                        ? '需要優先關注'
                                                        : '自動流程正常'}
                                                </div>
                                            </div>
                                            <TriangleAlert size={18} color="#fbbf24" />
                                        </div>
                                    </>
                                ) : (
                                    <div className={styles.smallValue}>沒有工單資料。</div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
