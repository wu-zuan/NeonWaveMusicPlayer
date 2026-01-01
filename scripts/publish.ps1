$ErrorActionPreference = "Stop"

# 1. Read Version
$package = Get-Content package.json | ConvertFrom-Json
$version = $package.version

Write-Host "🚀 Starting release process for NeonWave v$version..." -ForegroundColor Cyan

# 2. Git Sync
Write-Host "📦 Syncing with GitHub..." -ForegroundColor Yellow
git add .
try {
    git commit -m "chore: release v$version"
    Write-Host "   Commit created." -ForegroundColor Gray
} catch {
    Write-Host "   Nothing to commit." -ForegroundColor Gray
}

git push
Write-Host "   Code pushed to main." -ForegroundColor Green

# 3. Handle Tag
if ($(git tag -l "v$version")) {
    Write-Host "⚠️ Tag v$version already exists. Skipping tag creation." -ForegroundColor Yellow
} else {
    git tag "v$version"
    git push origin "v$version"
    Write-Host "🏷️  Tag v$version pushed." -ForegroundColor Green
}

# 4. Build
Write-Host "🔨 Building project (this may take a minute)..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Aborting." -ForegroundColor Red
    exit
}

# 5. Instructions for Upload
$releasePath = "release\$version"
Write-Host "`n✅ Build Complete!" -ForegroundColor Green
Write-Host "----------------------------------------------------------------"
Write-Host "⚠️  MANUAL UPLOAD REQUIRED FOR AUTO-UPDATES ⚠️" -ForegroundColor Yellow
Write-Host "1. I have opened the GitHub Release page for you."
Write-Host "2. Create a new release for tag: v$version"
Write-Host "3. Drag and drop these 3 files from '$releasePath' folder:"
Write-Host "   📄 NeonWave-Windows-$version-Setup.exe"
Write-Host "   📄 NeonWave-Windows-$version-Setup.exe.blockmap"
Write-Host "   📄 latest.yml"
Write-Host "4. Click 'Publish release'."
Write-Host "----------------------------------------------------------------"

# 6. Open Folder and URL
Invoke-Item $releasePath
Start-Process "https://github.com/DM-WuzuanTW/NeonWaveMusicPlayer/releases/new?tag=v$version&title=v$version"
