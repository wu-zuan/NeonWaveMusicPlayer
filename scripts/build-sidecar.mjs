import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { build } from 'esbuild'

const workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
process.chdir(workspace)
if (Number(process.versions.node.split('.')[0]) !== 24) throw new Error('Build with Node.js 24 LTS; the exact runtime is bundled with the sidecar')
const target = execFileSync('rustc', ['--print', 'host-tuple'], { encoding: 'utf8', windowsHide: true }).trim()
if (process.env.TAURI_ENV_TARGET_TRIPLE && process.env.TAURI_ENV_TARGET_TRIPLE !== target) throw new Error('Build sidecar native modules on the target OS/architecture; cross-compilation is not supported')
const out = path.join(workspace, 'src-tauri/resources/sidecar')
const binaryDirectory = path.join(workspace, 'src-tauri/binaries')
await fs.mkdir(out, { recursive: true })
await fs.mkdir(binaryDirectory, { recursive: true })
const binary = path.join(binaryDirectory, `neonwave-node-${target}${process.platform === 'win32' ? '.exe' : ''}`)
const lock = await fs.readFile('package-lock.json')
const fingerprint = createHash('sha256').update(lock).update(process.version).update(target).digest('hex')
const previous = await fs.readFile(path.join(out, 'build.json'), 'utf8').then(JSON.parse).catch(() => ({}))
if (previous.fingerprint !== fingerprint || !await fs.stat(binary).catch(() => null)) {
  const npmCli = process.env.npm_execpath || path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js')
  const output = execFileSync(process.execPath, [npmCli, 'ls', '--omit=dev', '--all', '--parseable'], { encoding: 'utf8', windowsHide: true })
  const modules = path.join(out, 'node_modules')
  const expected = path.join(workspace, 'src-tauri', 'resources', 'sidecar', 'node_modules')
  if (path.resolve(modules) !== expected) throw new Error('Unsafe generated modules directory')
  await fs.rm(modules, { recursive: true, force: true })
  const packages = [...new Set(output.trim().split(/\r?\n/).filter(directory => directory !== workspace && directory.includes(`${path.sep}node_modules${path.sep}`)))]
  for (const directory of packages) {
    const relative = path.relative(workspace, directory)
    if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`Dependency is outside checkout: ${relative}`)
    await fs.cp(directory, path.join(out, relative), { recursive: true, dereference: true })
  }
  await fs.copyFile(process.execPath, binary)
  if (process.platform !== 'win32') await fs.chmod(binary, 0o755)
  const license = await fetch(`https://raw.githubusercontent.com/nodejs/node/${process.version}/LICENSE`)
  if (!license.ok) throw new Error(`Could not retrieve Node.js license: HTTP ${license.status}`)
  await fs.writeFile(path.join(out, 'NODE-LICENSE'), await license.text())
  await fs.writeFile(path.join(out, 'build.json'), JSON.stringify({ fingerprint, node: process.version, target, packages: packages.length }, null, 2))
}
await build({ entryPoints: ['sidecar/index.ts'], outfile: path.join(out, 'index.mjs'),
  bundle: true, platform: 'node', format: 'esm', target: 'node24', packages: 'external', sourcemap: true })
await fs.writeFile(path.join(out, 'package.json'), JSON.stringify({ name: 'neonwave-service', private: true, type: 'module' }))
console.log(`Sidecar ready: Node ${process.version}, ${target}`)
