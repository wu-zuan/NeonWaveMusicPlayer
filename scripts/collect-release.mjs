import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { verifyUpdate } from './verify-update-signature.mjs'

const { version } = JSON.parse(await fs.readFile('package.json', 'utf8'))
const output = path.resolve('release', version)
await fs.mkdir(output, { recursive: true })
const origin = `https://github.com/wu-zuan/NeonWaveMusicPlayer/releases/download/v${version}`
const arch = process.arch === 'arm64' ? 'aarch64' : 'x86_64'
const platform = { win32: 'windows', darwin: 'darwin', linux: 'linux' }[process.platform]
if (!platform) throw new Error('Unsupported release platform')
const files = []
async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) { if (!entry.name.endsWith('.app')) await walk(file) }
    else files.push(file)
  }
}
await walk('src-tauri/target/release/bundle')
// Local builds may leave previous versions in the bundle directory. Never
// relabel an older installer as the version currently being published.
const versionedFiles = files.filter(file => path.basename(file).includes(`_${version}_`))
const manifest = { version, notes: '', pub_date: new Date().toISOString(), platforms: {} }
const artifact = async (source, name, update = false) => {
  const destination = path.join(output, name)
  await fs.copyFile(source, destination)
  if (update) {
    const signature = await fs.readFile(source + '.sig', 'utf8')
    const config = JSON.parse(await fs.readFile('src-tauri/tauri.conf.json', 'utf8'))
    verifyUpdate(await fs.readFile(source), signature, config.plugins.updater.pubkey)
    await fs.writeFile(destination + '.sig', signature)
    manifest.platforms[`${platform}-${arch}`] = { signature: signature.trim(), url: `${origin}/${encodeURIComponent(name)}` }
  }
  return destination
}
let legacyFile, legacyManifest
if (platform === 'windows') {
  const source = versionedFiles.find(file => file.endsWith('-setup.exe'))
  if (!source) throw new Error('Windows NSIS installer missing')
  legacyFile = await artifact(source, `NeonWave-Windows-${version}-Setup.exe`, true)
  legacyManifest = 'latest.yml'
} else if (platform === 'linux') {
  const source = versionedFiles.find(file => file.endsWith('.AppImage'))
  if (!source) throw new Error('AppImage missing')
  legacyFile = await artifact(source, `NeonWave-Linux-${version}.AppImage`, true)
  legacyManifest = 'latest-linux.yml'
} else {
  const dmg = versionedFiles.find(file => file.endsWith('.dmg'))
  const update = files.find(file => file.endsWith('.app.tar.gz'))
  if (!dmg || !update) throw new Error('macOS DMG/updater archive missing')
  await artifact(dmg, `NeonWave-Mac-${version}-${process.arch}.dmg`)
  await artifact(update, `NeonWave-Mac-${version}-${process.arch}.app.tar.gz`, true)
  legacyFile = path.join(output, `NeonWave-Mac-${version}-${process.arch}.zip`)
  execFileSync('ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', 'src-tauri/target/release/bundle/macos/NeonWave.app', legacyFile])
  legacyManifest = 'latest-mac.yml'
}
// Transitional metadata lets the existing updater download the new installer.
// The application itself contains no legacy runtime or updater dependency.
const bytes = await fs.readFile(legacyFile)
const sha512 = createHash('sha512').update(bytes).digest('base64')
const name = path.basename(legacyFile)
await fs.writeFile(path.join(output, legacyManifest), `version: ${version}\nfiles:\n  - url: ${name}\n    sha512: ${sha512}\n    size: ${bytes.length}\npath: ${name}\nsha512: ${sha512}\nreleaseDate: '${manifest.pub_date}'\n`)
await fs.writeFile(path.join(output, `latest-${platform}-${arch}.json`), JSON.stringify(manifest, null, 2))
if (process.env.GITHUB_OUTPUT) await fs.appendFile(process.env.GITHUB_OUTPUT, `directory=${output}\n`)
console.log(`Release artifacts: ${output}`)
