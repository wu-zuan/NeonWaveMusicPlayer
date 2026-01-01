@echo off
setlocal EnableDelayedExpansion

title NeonWave Fully Automated Publisher

echo ========================================================
echo       NeonWave Music Player - Auto Release Tool
echo ========================================================

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    pause
    exit /b
)

REM --- AUTO-DETECT GITHUB TOKEN ---
REM 1. Check if GH_TOKEN or GITHUB_TOKEN is already set in system
if not "%GH_TOKEN%"=="" goto TokenFound
if not "%GITHUB_TOKEN%"=="" (
    set GH_TOKEN=%GITHUB_TOKEN%
    goto TokenFound
)

REM 2. Try to get token from GitHub CLI (gh) if installed
where gh >nul 2>nul
if %errorlevel% equ 0 (
    echo [Info] GitHub CLI detected. Attempting to fetch auth token...
    for /f %%t in ('gh auth token') do set GH_TOKEN=%%t
)

if not "%GH_TOKEN%"=="" (
    echo [Success] GitHub Token retrieved from gh cli.
    goto TokenFound
)

REM 3. If no token found, warn user but proceed (Upload might fail)
echo.
echo [Warning] No GitHub Token detected (GH_TOKEN system var or GitHub CLI).
echo           Git operations will work if you are logged in, 
echo           BUT the automatic release upload via electron-builder WILL FAIL.
echo.

:TokenFound
REM Export to environment for electron-builder
set GH_TOKEN=%GH_TOKEN%


REM --- GET VERSION ---
for /f "delims=" %%v in ('node -p "require('./package.json').version"') do set VERSION=%%v

echo.
echo --------------------------------------------------------
echo  Target Release Version: v%VERSION%
echo --------------------------------------------------------
echo.

REM --- GIT OPERATIONS ---
echo [Step 1/3] Syncing Git Repository...
git add .
call git commit -m "chore: release v!VERSION!" >nul 2>&1
if %errorlevel% equ 0 (
    echo    - Changes committed.
) else (
    echo    - No changes to commit.
)

echo    - Pushing code to GitHub...
call git push origin main

REM Handle Tag
call git tag v!VERSION! >nul 2>&1
if %errorlevel% equ 0 (
    echo    - Created tag v!VERSION!
    call git push origin v!VERSION!
) else (
    echo    - Tag v!VERSION! already exists or failed. (Assuming verify run)
)


REM --- BUILD & PUBLISH ---
echo.
echo [Step 2/3] Building Source Code...
call npm run typecheck
call npx vite build

echo.
echo [Step 3/3] Packaging and Uploading to GitHub...
echo    - This may take a few minutes. Please wait.

REM Run electron-builder with publish flag
call npx electron-builder --win --publish always

if %errorlevel% neq 0 (
    echo.
    echo [X] Error occurred.
    echo     If the error is "HttpError: 401 Unauthorized", it means electron-builder needs a token.
    echo     Log in with GitHub CLI 'gh auth login' or set GH_TOKEN environment variable.
    pause
    exit /b
)

echo.
echo ========================================================
echo  SUCCESS! Release v%VERSION% is live.
echo  Link: https://github.com/DM-WuzuanTW/NeonWaveMusicPlayer/releases/tag/v%VERSION%
echo ========================================================
echo.
pause
