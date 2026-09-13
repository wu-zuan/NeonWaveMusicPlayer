// Exercise the built NSIS payload without replacing a user's installed app.
// Only installer identity, output path and process name are substituted. The
// native executable, bundled runtime, dependencies, hooks and file list match
// the production bundle. Run after npm run build, on Windows.
const fs = require('node:fs/promises')
const path = require('node:path')
const assert = require('node:assert/strict')
const { execFileSync, spawn } = require('node:child_process')
const { createHash, randomUUID } = require('node:crypto')
const { once } = require('node:events')
const { waitFor } = require('./e2e-performance.cjs')

async function main() {
  assert.equal(process.platform, 'win32')
  const workspace = path.resolve(__dirname, '..')
  process.chdir(workspace)
  const root = path.join(workspace, 'artifacts', `installer-${randomUUID()}`)
  const install = path.join(root, 'custom-location')
  const profile = path.join(root, 'profile')
  const name = 'NeonWaveMigrationTest'
  const legacyKey = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\c0566c3e-2626-593e-a376-234a368140ce'
  const testKey = legacyKey + '.migration-validation'
  const registry = (args) => execFileSync('reg.exe', args, { encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','pipe'] })
  const query = key => { try { return registry(['query',key,'/reg:64']) } catch { return '' } }
  assert.equal(query(testKey), '', 'another installer validation is already registered')
  const previous = query(legacyKey)
  await fs.mkdir(install,{recursive:true})
  await fs.mkdir(profile,{recursive:true})
  const scriptDirectory = path.join(workspace,'src-tauri/target/release/nsis/x64')
  let script = await fs.readFile(path.join(scriptDirectory,'installer.nsi'),'utf8')
  const productionInstaller = script.match(/^!define OUTFILE "(.+)"$/m)?.[1]
  assert.ok(productionInstaller, 'production installer output path')
  assert.ok(script.includes('One-click upgrades replace the payload in place'))
  const substitutions = {
    PRODUCTNAME:name, MAINBINARYNAME:name, BUNDLEID:'com.wuzuan.neonwave.migration-validation',
    UNINSTKEY:testKey.replace(/^HKCU\\/,''), OUTFILE:path.join(root,'validation-setup.exe')
  }
  for (const [key,value] of Object.entries(substitutions)) {
    const pattern = new RegExp(`^!define ${key} ".*"$`,'m')
    assert.ok(pattern.test(script), key)
    script = script.replace(pattern,()=>`!define ${key} "${value}"`)
  }
  script = script.replace('$LOCALAPPDATA\\Programs\\neon-wave-music-player', '$LOCALAPPDATA\\Programs\\' + name)
  // NSIS otherwise derives the installed file name from MAINBINARYSRCPATH,
  // which must still point at the unchanged production executable.
  script = script.replace('File "${MAINBINARYSRCPATH}"', 'File /oname=${MAINBINARYNAME}.exe "${MAINBINARYSRCPATH}"')
  const scriptFile = path.join(root,'validation.nsi')
  await fs.writeFile(scriptFile,script)
  console.log('Compiling isolated installer with the production payload...')
  execFileSync(path.join(process.env.LOCALAPPDATA,'tauri/NSIS/makensis.exe'),['/V2','/NOCD',scriptFile],{cwd:scriptDirectory,windowsHide:true,stdio:'inherit'})
  // Simulate an existing installation at a non-default path. This also proves
  // that migration does not invoke the predecessor's uninstaller.
  await fs.mkdir(path.join(install,'resources'),{recursive:true})
  await fs.mkdir(path.join(install,'locales'),{recursive:true})
  for (const file of ['resources/app.asar','locales/test.pak','ffmpeg.dll',`Uninstall ${name}.exe`,`${name}.exe`]) await fs.writeFile(path.join(install,file),'legacy fixture')
  const sentinel = path.join(profile,'existing-user-data.txt')
  await fs.writeFile(sentinel,'既有資料保留')
  for (const [key,value] of Object.entries({ DisplayName:name,DisplayVersion:'7.0.7',UninstallString:`"${path.join(install,`Uninstall ${name}.exe`)}" /currentuser` })) {
    registry(['add',testKey,'/v',key,'/t','REG_SZ','/d',value,'/f','/reg:64'])
  }
  const run = async (file,args,options={}) => {
    const child = spawn(file,args,{windowsHide:true,stdio:'inherit',...options})
    const [code] = await once(child,'exit')
    assert.equal(code,0,`${path.basename(file)} exit code`)
  }
  console.log('Installing over the isolated predecessor, recovering its custom directory...')
  await run(substitutions.OUTFILE,['/S','/NS'])
  const installedBinary = path.join(install,`${name}.exe`)
  const digest = async file => createHash('sha256').update(await fs.readFile(file)).digest('hex')
  assert.equal(await digest(installedBinary),await digest('src-tauri/target/release/NeonWave.exe'))
  assert.ok(await fs.stat(path.join(install,'neonwave-node.exe')))
  assert.ok(await fs.stat(path.join(install,'sidecar/index.mjs')))
  assert.equal(await fs.stat(path.join(install,'resources')).catch(()=>null),null)
  assert.equal(await fs.stat(path.join(install,'ffmpeg.dll')).catch(()=>null),null)
  assert.equal(await fs.stat(path.join(install,`Uninstall ${name}.exe`)).catch(()=>null),null)
  assert.equal(await fs.readFile(sentinel,'utf8'),'既有資料保留')
  console.log('Running IPC, playlist import/export and graceful shutdown from the installed app...')
  const testEnvironment = {...process.env,NW_E2E_BINARY:installedBinary,NW_E2E_PROFILE:profile,NW_HIDDEN:'1'}
  await run(process.execPath,['scripts/e2e-native.cjs'],{cwd:workspace,env:testEnvironment})
  console.log('Reinstalling the same version, then uninstalling...')
  await run(substitutions.OUTFILE,['/S','/NS',`/D=${install}`])
  assert.equal(await digest(installedBinary),await digest('src-tauri/target/release/NeonWave.exe'))
  await run(path.join(install,'uninstall.exe'),['/S'])
  await waitFor(async()=> !(await fs.stat(installedBinary).catch(()=>null)) && query(testKey)==='', 'isolated uninstallation',60000)
  assert.equal(await fs.readFile(sentinel,'utf8'),'既有資料保留')
  assert.equal(JSON.parse(await fs.readFile(path.join(profile,'preferences.json'),'utf8')).neonwave_migration_close_test,'完整儲存')
  assert.equal(query(legacyKey),previous,'existing user installation registry unchanged')
  const result = {result:'PASS',root,productionInstallerSha256:await digest(productionInstaller),identitySubstitutions:substitutions,customDirectoryRecovery:true,legacyRuntimeRemoved:true,installedAppVerified:true,sameVersionReinstall:true,uninstall:true,userDataPreserved:true,existingUserRegistryUnchanged:true}
  await fs.writeFile('artifacts/installer-validation.json',JSON.stringify(result,null,2))
  console.log(JSON.stringify(result,null,2))
}
main().catch(error=>{console.error(error);process.exitCode=1})
