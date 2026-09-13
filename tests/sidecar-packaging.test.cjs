const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')

test('packaged LevelDB prebuilds match the target, including universal macOS binaries', async () => {
  const { nativeResourceFilter } = await import('../scripts/native-resource-filter.mjs')
  const root = 'node_modules/classic-level/prebuilds'
  const directories = await fs.readdir(root)
  for (const [platform,arch,expected] of [
    ['win32','x64',['win32-x64']], ['darwin','arm64',['darwin-x64+arm64']], ['linux','x64',['linux-x64']]
  ]) {
    const filter = nativeResourceFilter({platform,arch,libc:'glibc'})
    assert.deepEqual(directories.filter(name=>filter(`${root}/${name}`)),expected)
  }
})

test('glibc AppImages exclude unused musl LevelDB and DAVE binaries', async () => {
  const { nativeResourceFilter } = await import('../scripts/native-resource-filter.mjs')
  const filter = nativeResourceFilter({platform:'linux',arch:'x64',libc:'glibc'})
  const root = 'node_modules/classic-level/prebuilds/linux-x64'
  const files = await fs.readdir(root)
  assert.deepEqual(files.filter(name=>filter(`${root}/${name}`)),['classic-level.node'])
  const lock = JSON.parse(await fs.readFile('package-lock.json','utf8'))
  const davey = Object.keys(lock.packages).filter(name=>/^node_modules\/@snazzah\/davey-linux-x64-/.test(name))
  assert.deepEqual(davey.filter(filter),['node_modules/@snazzah/davey-linux-x64-gnu'])
  assert.ok(filter('node_modules/@snazzah/davey/index.js'))
  assert.ok(filter('node_modules/classic-level/LICENSE'))
})
