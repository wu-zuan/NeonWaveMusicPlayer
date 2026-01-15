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
REM 1. Check current session
if not "%GH_TOKEN%"=="" goto TokenFound
REM 2. Check system environment (in case it was set but not loaded in this session yet)
for /f "tokens=3*" %%a in ('reg query HKCU\Environment /v GH_TOKEN 2^>nul') do set GH_TOKEN=%%a
if not "%GH_TOKEN%"=="" goto TokenFound


REM 3. Try GitHub CLI
where gh >nul 2>nul
if %errorlevel% equ 0 (
    echo [Info] GitHub CLI detected. Attempting to fetch auth token...
    for /f %%t in ('gh auth token') do set GH_TOKEN=%%t
)
if not "%GH_TOKEN%"=="" goto TokenFound

REM 4. IF STILL MISSING: ONE-TIME PROMPT
echo.
echo [!] Electron-Builder needs a specific API Token to upload files.
echo     (This is different from your Git login)
echo.
echo     We need this ONLY ONCE. I will save it to your system for you.
echo.
set /p "GH_TOKEN=Please paste your GitHub Token (ghp_...): "

if "%GH_TOKEN%"=="" (
    echo.
    echo [Error] No token provided. I cannot upload the release files.
    echo         The build will finish, but you will have to upload manually.
    pause
    exit /b
) else (
    echo.
    echo [Setup] Saving token to system environment variables...
    setx GH_TOKEN "%GH_TOKEN%"
    echo [Setup] Token saved! You won't need to do this again.
)

:TokenFound
REM Export to environment for electron-builder
set GH_TOKEN=%GH_TOKEN%


REM --- AUTO INCREMENT VERSION ---
echo [Setup] Incrementing version...
for /f "delims=" %%v in ('node scripts/increment_version.cjs') do set VERSION=%%v

if "%VERSION%"=="" (
   echo [Error] Failed to update version number.
   pause
   exit /b
)

REM --- GET VERSION ---
REM (Double check from file)
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
    echo    - Tag v!VERSION! already exists or failed. (Checking if remote needs update)
    call git push origin v!VERSION! >nul 2>&1
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
    echo     Possible reasons:
    echo     1. Token is invalid or expired.
    echo     2. Network issue.
    echo     3. Tag already exists as a draft release.
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
