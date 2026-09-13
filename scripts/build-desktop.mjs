import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
process.chdir(root)
const environment = { ...process.env }
const localKey = path.join(root, '.local/updater.key')
if (!environment.TAURI_SIGNING_PRIVATE_KEY && fs.existsSync(localKey)) environment.TAURI_SIGNING_PRIVATE_KEY = localKey
if (!process.argv.includes('--no-bundle') && !environment.TAURI_SIGNING_PRIVATE_KEY) {
  throw new Error('TAURI_SIGNING_PRIVATE_KEY is required for signed updater artifacts. See docs/signing.md; use npm run build:dir for an executable-only build.')
}
environment.TAURI_SIGNING_PRIVATE_KEY_PASSWORD ??= ''
for (const key of ['APPLE_CERTIFICATE', 'APPLE_CERTIFICATE_PASSWORD', 'APPLE_SIGNING_IDENTITY', 'APPLE_ID', 'APPLE_PASSWORD', 'APPLE_TEAM_ID']) {
  if (!environment[key]) delete environment[key]
}
const overrides = { bundle: {} }
if (environment.APPLE_SIGNING_IDENTITY) overrides.bundle.macOS = { signingIdentity: environment.APPLE_SIGNING_IDENTITY }
if (environment.WINDOWS_SIGN_COMMAND) overrides.bundle.windows = { signCommand: environment.WINDOWS_SIGN_COMMAND }
const extra = Object.keys(overrides.bundle).length ? ['--config', JSON.stringify(overrides)] : []
const result = spawnSync(process.execPath, ['node_modules/@tauri-apps/cli/tauri.js', 'build', ...process.argv.slice(2), ...extra], {
  stdio: 'inherit', env: environment, windowsHide: true
})
if (result.error) throw result.error
process.exitCode = result.status ?? 1
