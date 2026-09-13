# NeonWave Music Player

[![CI](https://github.com/wu-zuan/NeonWaveMusicPlayer/actions/workflows/ci.yml/badge.svg)](https://github.com/wu-zuan/NeonWaveMusicPlayer/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/wu-zuan/NeonWaveMusicPlayer)](https://github.com/wu-zuan/NeonWaveMusicPlayer/releases)

高質感桌面音樂播放器 — 8D 環繞音效、同步歌詞彈幕、Discord 整合、Listening Party 即時分享。

Tauri 2 + React + TypeScript + Web Audio API；既有 Node.js 服務以隨安裝檔附帶的 sidecar 執行。

## 功能

- 🎵 **本機音樂庫** — mp3 / m4a / flac / wav / ogg,以及 mp4 / mov 等影片播放
- 🎧 **音效引擎** — 8D 環繞旋轉、空間殘響(演唱會 / 音樂廳 / 房間 / 賽車 / FPS)、距離模擬、專注模式、響度正規化
- 📝 **智慧歌詞** — LRCLib 精準比對快速路徑 + 網易雲 + 酷狗三來源並行搜尋、標題/時長評分選擇、時間軸自動校正、簡繁轉換,找不到時可用 AI 生成(OpenAI / Claude / Gemini / OpenRouter / Ollama / Open WebUI)
- 🎮 **情境偵測** — 偵測前景程式,遊戲 / 工作模式自動調整(Windows)
- 💬 **Discord** — Rich Presence 歌曲與封面顯示(iTunes/Deezer 封面查詢)、Bot 語音頻道串流播放
- 🎉 **Listening Party** — 內建房間伺服器 + Cloudflare Tunnel 一鍵產生公開連結,朋友用瀏覽器同步聆聽
- ⬇️ **YouTube** — 搜尋、串流預覽(自動跳副歌)、yt-dlp 下載(自動附中繼資料與封面)
- 🔄 **自動更新** — 透過 GitHub Releases 與 Tauri 更新簽章驗證；保留原本更新操作介面

## 下載

到 [Releases](https://github.com/wu-zuan/NeonWaveMusicPlayer/releases) 下載:

| 平台 | 檔案 |
|------|------|
| Windows | `NeonWave-Windows-x.y.z-Setup.exe` |
| macOS (Apple Silicon) | `NeonWave-Mac-x.y.z-arm64.dmg` |
| Linux | `NeonWave-Linux-x.y.z.AppImage` |

> macOS 版未經 Apple 簽章,首次開啟請在 App 上按右鍵 → 打開;或執行
> `xattr -cr /Applications/NeonWave.app`。
> Linux AppImage 需要 `libfuse2`(`chmod +x` 後直接執行)。
> 簽名設定方式見 [docs/signing.md](docs/signing.md)。

## 開發

使用 Node.js 24 LTS、Rust stable。Windows 開發需有 MSVC C++ Build Tools 及 WebView2；正式安裝檔使用系統 WebView2，缺少 runtime 時才連線下載並安裝，不包含離線安裝包。使用者不需要另裝 Node.js。Windows 10／11 為主要平台。

```bash
npm install
npm run dev        # 開發模式(Vite + Tauri + bundled Node service)
npm run typecheck  # TypeScript 檢查
npm run test:party # 分享房間、Tunnel 生命週期與串流回歸測試
npm run test:performance # 快取容量、工作佇列、播放時鐘與音效資源回收
npm test           # 全部既有測試及 sidecar 整合測試
npm run build:dir  # Windows release exe 與完整 sidecar，不做 installer
npm run e2e:performance # 真實 WebView2、2 萬首歌曲與播放回歸
node scripts/e2e-native.cjs # IPC 權限、同步確認、歌單檔案與退出
npm run build      # 完整 installer + updater signature，需更新簽署金鑰
node scripts/collect-release.mjs # 整理原有檔名與更新 manifest
node scripts/test-installer.cjs # Windows 隔離 installer 驗收，不取代目前安裝版本
```

效能設計與大型音樂庫測試方式見 [效能與資源管理](docs/performance.md)。

遷移對應、舊資料匯入、權限、平台差異與驗收結果見 [Tauri 遷移紀錄](docs/tauri-migration.md)。資料仍使用舊版的 userData 目錄；第一次開啟會從舊 Chromium Local Storage 的複本匯入設定，原始資料保留。開發／測試可設定 `NW_USER_DATA` 為另一個絕對路徑以隔離資料。

## 分享連線排查

公開連結會在 cloudflared 確認連線後顯示；若啟動逾時或程序退出，可按「重試連線」。朋友首次開啟頁面若沒有聲音，請按播放按鈕允許瀏覽器播放。

分享頁使用約每秒一次的狀態輪詢，失敗時逐步延長重試間隔，封面另行快取，避免反覆傳送圖片。[Cloudflare Quick Tunnel 不支援 SSE](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/)，且有服務端並行請求限制；目前仍適合少量朋友臨時分享。

## 發佈

```bash
npm run release
```

腳本會把 patch 版號 +1、commit、推送 `v*` 標籤;GitHub Actions
(`.github/workflows/release.yml`)接手編譯 **Windows / macOS / Linux**
三平台安裝檔並發佈到 GitHub Release。

首次 Tauri 發佈前需設定 `TAURI_SIGNING_PRIVATE_KEY`，詳見 [簽署設定](docs/signing.md)。發佈流程同時提供 `latest.json` 與舊更新器使用的 YAML；原版使用者可取得 Tauri installer。原版 7.0.8 升級需發佈更高版號。

## 專案結構

```
src/                    # React renderer
  components/           #   播放器 UI、歌詞彈幕、搜尋、設定、Discord 面板
  hooks/                #   useAudioPlayer / useLibrary / useAppDetection
  utils/AudioEngine.ts  #   Web Audio 音效管線(panner、殘響、壓縮器)
src-tauri/              # Rust native host、視窗、capabilities、更新、installer
src/desktop.ts          # 保留既有前端介面的 Tauri invoke / event adapter
sidecar/                # 隨安裝檔附帶的 Node.js service
  services.ts           #   原有業務 IPC handlers、yt-dlp、metadata
  transport.ts          #   Rust ↔ Node stdio RPC
  storage.ts            #   舊 Local Storage 匯入與 JSON 設定備份
  media.ts              #   帶權杖的本機 Range / proxy / binary audio transport
  lyrics/               #   歌詞引擎(providers / 評分 / AI 封裝 / 協調器)
  discordBot.ts         #   Discord 語音串流
  discordRPC.ts         #   Rich Presence
  partyRoom.ts          #   Listening Party 伺服器 + cloudflared
```
