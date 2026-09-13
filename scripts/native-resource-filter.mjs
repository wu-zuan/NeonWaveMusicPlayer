// Native packages can contain prebuilds for several operating systems and
// libcs. AppImage inspects every ELF file, including ones Node would never load.
export function nativeResourceFilter({ platform, arch, libc }) {
  return source => {
    const parts = source.split(/[\\/]/)
    const prebuild = parts[parts.lastIndexOf('prebuilds') + 1]
    if (parts.includes('prebuilds') && prebuild) {
      const tuple = prebuild.match(/^(aix|android|darwin|freebsd|linux|netbsd|openbsd|sunos|win32)-([\w+]+)$/)
      if (tuple && (tuple[1] !== platform || !tuple[2].split('+').includes(arch))) return false
    }
    if (platform === 'linux') {
      // NAPI-RS optional packages do not always declare their libc to npm.
      for (const part of parts) {
        const target = part.match(/-linux-[\w]+-(gnu(?:eabihf)?|musl(?:eabihf)?)$/)
        if (target && (target[1].startsWith('musl') ? 'musl' : 'glibc') !== libc) return false
      }
      const filename = parts.at(-1)
      if (filename.endsWith('.node')) {
        const tags = filename.split('.')
        if (tags.includes(libc === 'musl' ? 'glibc' : 'musl')) return false
      }
    }
    return true
  }
}
