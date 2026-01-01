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
}
catch {
    Write-Host "   Nothing to commit." -ForegroundColor Gray
}

git push
Write-Host "   Code pushed to main." -ForegroundColor Green

# 3. Handle Tag
if ($(git tag -l "v$version")) {
    Write-Host "⚠️ Tag v$version already exists. Skipping tag creation." -ForegroundColor Yellow
}
else {
    git tag "v$version"
    git push origin "v$version"
    Write-Host "🏷️  Tag v$version pushed." -ForegroundColor Green
}

# 4. Build & Publish
Write-Host "🔨 Building and Publishing (this may take a few minutes)..." -ForegroundColor Cyan

# Run checks and build
npm run typecheck
npx vite build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Aborting." -ForegroundColor Red
    exit
}

# Package and Publish
# Ensure GH_TOKEN is available in env or via cli logic normally, but here we assume local setup is good.
npx electron-builder --publish always

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Packaging/Publishing failed." -ForegroundColor Red
    exit
}

Write-Host "`n✅ Release v$version Published Successfully!" -ForegroundColor Green
