const fs = require('node:fs');
const path = require('node:path');
const workspace = path.resolve(__dirname, '..');
for (const relative of ['dist', 'src-tauri/resources', 'src-tauri/binaries']) {
    const target = path.resolve(workspace, relative);
    if (!target.startsWith(workspace + path.sep)) throw new Error('Unsafe clean target');
    fs.rmSync(target, { recursive: true, force: true });
    console.log(`[clean] removed ${relative}`);
}
