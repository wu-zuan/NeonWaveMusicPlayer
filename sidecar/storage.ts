import fs from 'node:fs/promises'
import path from 'node:path'
import { ClassicLevel } from 'classic-level'
import { userData } from './paths'

export const isPreferenceKey = (key: string) => /^(neonwave_|nw_|discord_|artist_img_|lyrics_)/.test(key)
const preferencesPath = path.join(userData, 'preferences.json')
let values: Record<string, string> = {}
let writeQueue = Promise.resolve()
function decodeString(bytes: Buffer) {
  if (bytes[0] === 0) return bytes.subarray(1).toString('utf16le')
  if (bytes[0] === 1) return bytes.subarray(1).toString('latin1')
  throw new Error('Unknown Chromium Local Storage string encoding')
}

export async function importLegacyStorage(directory: string) {
  const source = path.join(directory, 'Local Storage', 'leveldb')
  if (!await fs.stat(source).then(stat => stat.isDirectory()).catch(() => false)) return {}
  // Open a copy: never lock, repair, upgrade or write to the existing profile.
  const parent = path.join(directory, 'tauri-migration')
  await fs.mkdir(parent, { recursive: true })
  const snapshot = await fs.mkdtemp(path.join(parent, 'local-storage-'))
  await fs.cp(source, snapshot, { recursive: true, filter: file => path.basename(file) !== 'LOCK' })
  const db = new ClassicLevel<Buffer, Buffer>(snapshot, { keyEncoding: 'buffer', valueEncoding: 'buffer', createIfMissing: false })
  const origins = new Map<string, Record<string, string>>()
  try {
    await db.open()
    for await (const [key, value] of db.iterator()) {
      if (key[0] !== 95) continue
      const separator = key.indexOf(0)
      if (separator < 0) continue
      const origin = key.subarray(1, separator).toString('utf8')
      if (!['file://', 'http://localhost:5173', 'http://127.0.0.1:5173'].includes(origin)) continue
      const name = decodeString(key.subarray(separator + 1))
      if (!isPreferenceKey(name)) continue
      if (!origins.has(origin)) origins.set(origin, {})
      origins.get(origin)![name] = decodeString(value)
    }
  } finally { await db.close() }
  // Installed builds take precedence over development data, per key.
  const imported = Object.assign({}, origins.get('http://127.0.0.1:5173'), origins.get('http://localhost:5173'), origins.get('file://'))
  await fs.writeFile(path.join(parent, 'import-report.json'), JSON.stringify({
    source, snapshot, keys: Object.keys(imported), importedAt: new Date().toISOString()
  }, null, 2))
  return imported as Record<string, string>
}

export async function loadPreferences() {
  try {
    values = JSON.parse(await fs.readFile(preferencesPath, 'utf8'))
  } catch (error: any) {
    if (error.code !== 'ENOENT') throw new Error(`Cannot read preferences.json: ${error.message}`)
    values = await importLegacyStorage(userData)
    await persist()
  }
  return values
}
export function preferences() { return { ...values } }
function persist() {
  const snapshot = JSON.stringify(values)
  writeQueue = writeQueue.catch(() => {}).then(async () => {
    await fs.writeFile(`${preferencesPath}.tmp`, snapshot, { mode: 0o600 })
    await fs.rename(`${preferencesPath}.tmp`, preferencesPath)
  })
  return writeQueue
}
export async function setPreference(key: string, value: string | null) {
  if (!isPreferenceKey(key)) return
  if (value === null) delete values[key]
  else values[key] = value
  await persist()
}
export function flushPreferences() { return writeQueue }
