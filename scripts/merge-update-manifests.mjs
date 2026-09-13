import fs from 'node:fs/promises'
import path from 'node:path'
const directory = path.resolve(process.argv[2] || 'release-assets')
const files = (await fs.readdir(directory)).filter(file => /^latest-(windows|darwin|linux)-.+\.json$/.test(file))
if (files.length === 0) throw new Error('No signed platform manifests found')
let combined
for (const file of files) {
  const manifest = JSON.parse(await fs.readFile(path.join(directory, file), 'utf8'))
  combined ??= { ...manifest, platforms: {} }
  if (combined.version !== manifest.version) throw new Error('Platform versions do not match')
  Object.assign(combined.platforms, manifest.platforms)
}
await fs.writeFile(path.join(directory, 'latest.json'), JSON.stringify(combined, null, 2))
console.log(`Updater manifest ${combined.version}: ${Object.keys(combined.platforms).join(', ')}`)
