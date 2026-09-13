import path from 'node:path'

// Supplied exclusively by the Rust host (or an isolated integration-test host).
if (!process.env.NW_USER_DATA || !path.isAbsolute(process.env.NW_USER_DATA)) {
  throw new Error('NW_USER_DATA must be an absolute application data directory')
}
export const userData = process.env.NW_USER_DATA
