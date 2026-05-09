const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../package.json');

try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const version = packageJson.version;

    if (!version) {
        console.error('Error: No version found in package.json');
        process.exit(1);
    }

    const parts = version.split('.').map(Number);
    if (parts.length !== 3) {
        console.error(`Error: Version ${version} is not in m.n.p format`);
        process.exit(1);
    }

    let [major, minor, patch] = parts;

    
    
    patch += 1;

    
    if (patch > 9) {
        patch = 0;
        minor += 1;
    }

    
    if (minor > 9) {
        minor = 0;
        major += 1;
    }

    const newVersion = `${major}.${minor}.${patch}`;

    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

    console.log(newVersion);

} catch (err) {
    console.error('Error updating version:', err);
    process.exit(1);
}
