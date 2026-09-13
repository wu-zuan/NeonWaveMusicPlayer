// Verify both Minisign signatures with Node's standard Ed25519 implementation.
// This is an independent check of the exact bytes shipped in the release.
import fs from 'node:fs/promises'
import { createHash, createPublicKey, verify } from 'node:crypto'
import assert from 'node:assert/strict'

export function verifyUpdate(bytes, encodedSignature, encodedPublicKey) {
  const publicLines = Buffer.from(encodedPublicKey,'base64').toString('utf8').trim().split(/\r?\n/)
  const lines = Buffer.from(encodedSignature.trim(),'base64').toString('utf8').trim().split(/\r?\n/)
  const key = Buffer.from(publicLines[1],'base64')
  const signature = Buffer.from(lines[1],'base64')
  assert.equal(key.length,42)
  assert.equal(signature.length,74)
  assert.equal(signature.subarray(0,2).toString(),'ED','require prehashed Minisign')
  assert.deepEqual(key.subarray(2,10),signature.subarray(2,10),'signing key ID')
  assert.ok(lines[2].startsWith('trusted comment: '))
  const publicKey = createPublicKey({key:Buffer.concat([Buffer.from('302a300506032b6570032100','hex'),key.subarray(10)]),format:'der',type:'spki'})
  const raw = signature.subarray(10)
  assert.ok(verify(null,createHash('blake2b512').update(bytes).digest(),publicKey,raw),'artifact signature')
  assert.ok(verify(null,Buffer.concat([raw,Buffer.from(lines[2].slice(17))]),publicKey,Buffer.from(lines[3],'base64')),'trusted comment signature')
}

if (process.argv[1]?.endsWith('verify-update-signature.mjs')) {
  const filename = process.argv[2]
  if (!filename) throw new Error('Provide a signed artifact path')
  const {plugins:{updater:{pubkey}}} = JSON.parse(await fs.readFile('src-tauri/tauri.conf.json','utf8'))
  const bytes = await fs.readFile(filename)
  const signature = await fs.readFile(filename+'.sig','utf8')
  verifyUpdate(bytes,signature,pubkey)
  const changed = Buffer.from(bytes); changed[changed.length-1] ^= 1
  assert.throws(()=>verifyUpdate(changed,signature,pubkey),/artifact signature/,'reject tampered payload')
  console.log(JSON.stringify({result:'PASS',filename,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),signatureVerified:true,tamperingRejected:true},null,2))
}
