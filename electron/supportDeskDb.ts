import * as mysql from 'mysql2/promise'

type TicketStatus = 'queued' | 'analyzing' | 'drafting' | 'waiting_human' | 'resolved'
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

type TimelineStage = {
  key: string
  title: string
  description: string
  status: 'done' | 'active' | 'pending'
}

type TicketActivity = {
  time: string
  text: string
}

export type SupportTicketRecord = {
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
  activity: TicketActivity[]
}

const DEFAULT_JDBC_URL = 'jdbc:mysql://u239_jkhOaTouUS:59.%2BUFrpjrblDDsDY6yM0%3DNs@10.27.28.201:3306/s239_Discord-Bot'

type SeedTicket = Omit<SupportTicketRecord, 'tags' | 'stages' | 'activity'> & {
  tags: string[]
  stages: TimelineStage[]
  activity: TicketActivity[]
}

const seedTickets: SeedTicket[] = [
  {
    id: 'TKT-4821',
    customer: '王小姐',
    subject: '付款成功但 AI 沒有回覆',
    channel: 'LINE',
    assignee: 'Support Bot / Mia',
    model: 'gpt-4o-mini',
    status: 'analyzing',
    priority: 'urgent',
    progress: 42,
    createdAt: '09:12',
    updatedAt: '09:21',
    sla: '剩餘 12 分鐘',
    tags: ['付款', 'AI 未回覆', '高優先'],
    summary: '客戶在付款後提交了產品客製化需求，但第一輪 AI 推論結果卡在格式檢查，系統已自動重試。',
    lastMessage: '「我已經付款了，但還沒看到 AI 產生內容。」',
    stages: [
      { key: 'ingest', title: '已接收請求', description: '客服單建立並寫入佇列', status: 'done' },
      { key: 'verify', title: '驗證上下文', description: '比對訂單、付款與身分', status: 'done' },
      { key: 'prompt', title: '整理提示詞', description: '合併客服訊息與商品資料', status: 'active' },
      { key: 'gen', title: 'AI 回覆生成', description: '模型正在產出第一版內容', status: 'pending' },
      { key: 'review', title: '人工覆核', description: '高風險案件需人工最後確認', status: 'pending' },
    ],
    activity: [
      { time: '09:21', text: 'AI 已重新整理上下文，等待模型回應。' },
      { time: '09:19', text: '檢測到付款完成，從待確認升級為緊急。' },
      { time: '09:15', text: '客戶透過 LINE 送出自訂需求。' },
    ],
  },
  {
    id: 'TKT-4822',
    customer: '陳先生',
    subject: '請幫我把回覆改成英文',
    channel: 'Web Chat',
    assignee: 'AI Worker 17',
    model: 'claude-3.5-sonnet',
    status: 'drafting',
    priority: 'medium',
    progress: 71,
    createdAt: '09:05',
    updatedAt: '09:20',
    sla: '剩餘 28 分鐘',
    tags: ['語言轉換', '可自動化'],
    summary: 'AI 已完成語意分析，正在輸出英文版本並保留原始語氣。預計無需人工介入。',
    lastMessage: '「請把上面的內容翻成英文，語氣不要太正式。」',
    stages: [
      { key: 'ingest', title: '已接收請求', description: '客服單建立並寫入佇列', status: 'done' },
      { key: 'verify', title: '驗證上下文', description: '確認語言與商品版本', status: 'done' },
      { key: 'prompt', title: '整理提示詞', description: '建立雙語回覆規則', status: 'done' },
      { key: 'gen', title: 'AI 回覆生成', description: '模型正在輸出英文版本', status: 'active' },
      { key: 'review', title: '人工覆核', description: '低風險案件可略過', status: 'pending' },
    ],
    activity: [
      { time: '09:20', text: '已產出第一版英文草稿。' },
      { time: '09:17', text: '提示詞模板套用成功。' },
      { time: '09:05', text: '客戶從網站後台送出翻譯請求。' },
    ],
  },
  {
    id: 'TKT-4823',
    customer: '李小姐',
    subject: '請求人工確認退款條件',
    channel: 'Email',
    assignee: 'Sophie / Human Review',
    model: 'gpt-4.1',
    status: 'waiting_human',
    priority: 'high',
    progress: 88,
    createdAt: '08:52',
    updatedAt: '09:18',
    sla: '剩餘 6 分鐘',
    tags: ['退款', '需人工'],
    summary: 'AI 已完成條款解析，因政策例外條件需要人工確認，系統已發通知給客服人員。',
    lastMessage: '「這個訂單可以退嗎？」',
    stages: [
      { key: 'ingest', title: '已接收請求', description: '客服單建立並寫入佇列', status: 'done' },
      { key: 'verify', title: '驗證上下文', description: '讀取訂單與退款規則', status: 'done' },
      { key: 'prompt', title: '整理提示詞', description: '加入政策與例外條款', status: 'done' },
      { key: 'gen', title: 'AI 回覆生成', description: '已生成建議答案', status: 'done' },
      { key: 'review', title: '人工覆核', description: '正在等待人工確認後送出', status: 'active' },
    ],
    activity: [
      { time: '09:18', text: '系統已標記為高風險退款案件。' },
      { time: '09:14', text: 'AI 建議答案通過初步審核。' },
      { time: '08:52', text: 'Email 工單自動匯入。' },
    ],
  },
]

let pool: mysql.Pool | null = null
let initPromise: Promise<void> | null = null

function getJdbcUrl() {
  return process.env.SUPPORT_DESK_JDBC_URL || DEFAULT_JDBC_URL
}

function buildConnectionConfig() {
  const jdbcUrl = getJdbcUrl().replace(/^jdbc:/, '')
  const parsed = new URL(jdbcUrl)

  return {
    host: parsed.hostname,
    port: Number(parsed.port || 3306),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: decodeURIComponent(parsed.pathname.replace(/^\/+/, '')),
    connectionLimit: 5,
    waitForConnections: true,
    supportBigNumbers: true,
    timezone: 'Z' as const,
  }
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool(buildConnectionConfig())
  }
  return pool
}

function mapRow(row: any): SupportTicketRecord {
  const parseJson = <T,>(value: any, fallback: T): T => {
    if (value == null) return fallback
    if (Array.isArray(value)) return value as T
    if (typeof value === 'object') return value as T
    try {
      return JSON.parse(String(value)) as T
    } catch {
      return fallback
    }
  }

  return {
    id: row.id,
    customer: row.customer,
    subject: row.subject,
    channel: row.channel,
    assignee: row.assignee,
    model: row.model,
    status: row.status,
    priority: row.priority,
    progress: Number(row.progress ?? 0),
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
    sla: row.sla,
    tags: parseJson<string[]>(row.tags_json, []),
    summary: row.summary,
    lastMessage: row.last_message,
    stages: parseJson<TimelineStage[]>(row.stages_json, []),
    activity: parseJson<TicketActivity[]>(row.activity_json, []),
  }
}

async function ensureSchema() {
  const conn = getPool()
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id VARCHAR(32) PRIMARY KEY,
      customer VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      channel VARCHAR(64) NOT NULL,
      assignee VARCHAR(255) NOT NULL,
      model VARCHAR(128) NOT NULL,
      status VARCHAR(32) NOT NULL,
      priority VARCHAR(32) NOT NULL,
      progress INT NOT NULL DEFAULT 0,
      created_at VARCHAR(32) NOT NULL,
      updated_at VARCHAR(32) NOT NULL,
      sla VARCHAR(64) NOT NULL,
      tags_json LONGTEXT NOT NULL,
      summary TEXT NOT NULL,
      last_message TEXT NOT NULL,
      stages_json LONGTEXT NOT NULL,
      activity_json LONGTEXT NOT NULL
    )
  `)

  const [rows] = await conn.query<any[]>('SELECT COUNT(*) AS count FROM support_tickets')
  const count = Number(rows?.[0]?.count ?? 0)
  if (count > 0) return

  for (const ticket of seedTickets) {
    await conn.execute(
      `INSERT INTO support_tickets
        (id, customer, subject, channel, assignee, model, status, priority, progress, created_at, updated_at, sla, tags_json, summary, last_message, stages_json, activity_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ticket.id,
        ticket.customer,
        ticket.subject,
        ticket.channel,
        ticket.assignee,
        ticket.model,
        ticket.status,
        ticket.priority,
        ticket.progress,
        ticket.createdAt,
        ticket.updatedAt,
        ticket.sla,
        JSON.stringify(ticket.tags),
        ticket.summary,
        ticket.lastMessage,
        JSON.stringify(ticket.stages),
        JSON.stringify(ticket.activity),
      ],
    )
  }
}

export async function initSupportDeskDb() {
  if (!initPromise) {
    initPromise = ensureSchema()
  }
  await initPromise
}

export async function listSupportTickets(): Promise<SupportTicketRecord[]> {
  await initSupportDeskDb()
  const conn = getPool()
  const [rows] = await conn.query<any[]>(
    'SELECT * FROM support_tickets ORDER BY updated_at DESC, created_at DESC, id DESC',
  )
  return rows.map(mapRow)
}
