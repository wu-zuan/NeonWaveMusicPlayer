# NeonWave：Electron → Tauri 2 等價遷移

## 遷移前盤點（7.0.8）

前端是 React 18 / TypeScript / Vite 5，沒有額外 routing 或 state-management framework。音效在 renderer 的 Web Audio graph 執行，共用一個 video element。保留元件、五種主題、虛擬清單、歌詞動畫、播放器和儲存鍵值。

| 原實作 | 對應 Tauri 2 實作 |
| --- | --- |
| 主視窗 1200×800、最小 800×600、背景 #020617、延後顯示、關閉即退出 | Rust WebviewWindow，保留尺寸、焦點、生命週期；Windows caption controls 等價替代 |
| 迷你視窗 356×132、主螢幕右上 20px、透明、置頂、不可縮放、無陰影、不列工作列 | Rust WebviewWindow，同一 React `?mini=true` entry；遊戲模式游標穿透 |
| preload 暴露的 `window.ipcRenderer` | 前端相容介面，底層為 Tauri invoke / events；保留 channel 名稱、參數、結果及取消訂閱契約 |
| metadata / lyrics / yt-search / yt-dlp / FFmpeg / Discord / Party | 隨安裝檔附帶 Node sidecar；保留成熟邏輯及原本 native dependency，無需使用者另裝 Node |
| 開啟資料夾、儲存下載檔 | Tauri dialog plugin，固定應用程式 command，不暴露任意 shell |
| `media://` 本機 Range 串流和遠端 CORS proxy | 僅綁定 loopback、每次啟動隨機權杖的 sidecar 串流；保留 Range / HEAD / MIME / Web Audio samples |
| Electron userData 下 debug.log、metadata-cache.json、yt-dlp、deno-runtime、cloudflared、gpu-lyrics | 沿用既有資料根目錄；設定檔、歌詞和校正檔的格式／位置不變 |
| Chromium Local Storage LevelDB | 唯讀複本匯入既有 localStorage，於 React 初始化前完成；保留來源以供 rollback |
| 單一執行個體、第二次啟動還原並聚焦 | Tauri single-instance plugin |
| Windows 前景程式偵測 | 保留原本每 2 秒 PowerShell/User32 偵測，平台程式碼隔離 |
| Discord 防休眠與背景播放 | Windows native power request；WebView2 背景 timer / occlusion 設定 |
| 更新狀態、下載進度、下載完成通知、手動立即安裝 | Tauri updater / notification plugins，保留 UI event payload；GitHub Release 改用簽署的 Tauri manifest |
| Windows NSIS、per-user、保留 app data、安裝前結束程序 | Tauri NSIS，保留名稱與 application identifier；一鍵安裝模板及舊版安裝銜接 |
| macOS DMG / Linux AppImage | Tauri 對應 bundle；Windows 為實際驗收平台 |
| 錯誤與 renderer console 收集、程序退出清理 | sidecar debug.log + native log，renderer bridge 錯誤轉送；正常結束與子程序樹回收 |

### 原本沒有的整合

原始碼未定義 Tray、globalShortcut、OS deep-link registration、檔案關聯、自啟動或原生產品 context menu，因此沒有新增或移除這些功能。React 選單、同步 confirm / prompt、DOM keyboard handlers 和 drag 行為繼續保留；原本使用 browser clipboard 的邀請連結複製改由 Tauri clipboard plugin 執行。`media://` 是內部播放 transport，不是 OS deep link。Windows 標題列右鍵系統選單另以 Win32 實作。

### Dependency 分類

- Tauri：視窗、單一實例、dialog、notification、updater、外部連結、clipboard。
- Node sidecar：`discord.js`、`@discordjs/voice`、`@discordjs/opus`（有 native codec 時使用）、`opusscript` fallback、`@snazzah/davey`、`libsodium-wrappers`、`discord-rpc`、`yt-search`、`yt-dlp-wrap`、`ffmpeg-static`、`music-metadata`、`extract-zip`、歌詞 providers / AI / GPU orchestration。
- Renderer：React、ReactDOM、react-window、lucide-react、OpenCC 和既有 Web Audio 程式。
- 移除：Electron runtime / updater / rebuild / builder、Vite Electron plugins、preload build、ASAR hooks。

## IPC 完整性

逐一比對原本 main process 註冊的 **49 個 channel**：39 個移至 sidecar、10 個改為 Rust native command，沒有未對應的 channel。`window.ipcRenderer` 是刻意保留的相容介面名稱，已不引用 Electron，也沒有 preload、contextBridge 或 Node integration 注入 renderer。

| 位置 | 原有 channels（保留名稱、引數順序與回傳資料） |
| --- | --- |
| Rust | `app:version`；`dialog:openDirectory`；`update:check`、`update:install`；`window:togglePlay`、`window:previousTrack`、`window:nextTrack`、`window:restoreMain`、`window:setMiniPlayer`、`window:toggleMiniPlayer` |
| Sidecar / Discord | `discord:updatePresence`、`discord:clearCache`、`discord:scanAndUpload`、`discord:clearPresence`、`discord:login`、`discord:getGuilds`、`discord:getChannels`、`discord:join`、`discord:leave`、`discord:disconnect`、`discord:play`、`discord:stop`、`discord:pause`、`discord:resume`、`discord:setVolume`、`discord:status`、`discord:startStreamMode`、`discord:audio-chunk` |
| Sidecar / Party、player | `party:status`、`party:start`、`party:stop`；`player:getSnapshot`、`player:sync` |
| Sidecar / files | `files:listMusic`、`files:getMetadataBatch`、`files:readBufferPartial`、`files:readBuffer`、`files:getArtwork`、`files:getMetadata` |
| Sidecar / search、download | `search:youtube`、`search:youtubePreview`、`search:artistImage`、`search:lyrics`；`download:youtube`、`download:youtubeToDir` |
| Sidecar / platform、GPU | `app:active-window`；`lyrics:gpuStatus`、`lyrics:computeDevices`、`lyrics:gpuCalibrate` |

新增的 bootstrap、設定備份、logging、caption controls 是宿主替換所需介面。進度、player snapshot、Party 控制及更新 events 使用原 payload，並依真正的 WebviewWindow label 訂閱，避免主視窗的退出事件傳給 mini。傳輸層保留 `undefined` 與 binary 型別，音訊擷取以依序 POST 的 binary body 傳至 sidecar；完整音檔以 ArrayBuffer 回傳，部分讀取維持 Uint8Array。

Dialog plugin 僅初始化原生功能，不載入會改寫 `window.confirm` 的 JavaScript polyfill，避免原本的同步取消判斷變成永遠 truthy 的 Promise。這項行為已用真實 WebView2 的接受／取消與匯入提示測試。

## 資料與 rollback

Windows 優先沿用 `%APPDATA%\neon-wave-music-player`；若只有歷史 productName 目錄有資料，則使用 `%APPDATA%\NeonWave`。macOS / Linux 同樣從原平台 config / application-support 根目錄尋找既有名稱。`NW_USER_DATA` 可指定絕對路徑供隔離測試使用。

首次啟動且不存在 `preferences.json` 時，複製舊 `Local Storage/leveldb` 至 `tauri-migration/local-storage-*`，只開啟複本，不修復或改寫來源。支援 Chromium Latin-1 / UTF-16 儲存字串、繁體中文與 emoji；只匯入既有應用程式 key prefixes，同名 key 以正式版 `file://` origin 優先。匯入報告只列 key 名稱，不列 token 或設定值。

React 掛載前將匯入資料補入 WebView2 localStorage。後續設定維持原 key / JSON 格式，另以原子 rename 備份至 `preferences.json`；一般關閉先等待寫入完成，再關閉 sidecar。主視窗無回應時有退出期限，不會讓背景服務永久留存。WebView2 自己的 profile 位於同一 userData 下的 `WebView2/`。

保留 `metadata-cache.json`、既有 yt-dlp / Deno / cloudflared / GPU engine 與模型目錄，以及音檔旁的 `.lrc`、`.neonwave-calibration.json`。`.nwp` 仍是 version 1 的原始分享格式，匯入／匯出流程不變。

這是**首次單向匯入**，不持續同步兩個不同 Chromium 的 LevelDB。重裝舊版本可讀取原資料，但 Tauri 使用後的新設定不會自動寫回 Electron 的 LevelDB。匯入失敗會顯示啟動錯誤，不以空設定覆蓋原資料；修正來源後可重試。

## 權限與程序生命週期

- `main` capability 僅開放三個應用程式 command 與 event listen / unlisten；`mini` 不開放 send command，Rust 再限制其可用 channel 與可寫入的設定 key。
- Renderer 沒有 fs、shell、process、HTTP plugin 或任意視窗操作權限。資料夾、媒體、GPU、下載等必要作業由驗證過的應用程式 command 處理；Discord developer portal 是唯一可透過外部連結 command 開啟的 URL。
- 內部串流綁定 `127.0.0.1` 的隨機 port，具有每次啟動產生的 256-bit 權杖與來源檢查。只讀絕對音訊／影片路徑；YouTube proxy 限 HTTPS googlevideo hosts，逐次檢查 redirects。保留 Range、HEAD、CORS、中文與特殊字元檔名。
- CSP 不開放任意 script、frame、object 或遠端 native API；正式版 navigation 限制在應用程式 origin。公開 Party server 保留原本的房間驗證及網路行為，與內部 media server 分開。
- Node executable 由建置機的 Node 24 複製，與同次安裝的 native modules 配對；產物包含 Node 授權及 dependency licenses，使用者不必安裝 Node。跨 OS / CPU 架構必須在目標平台建置。
- Rust 管理 stdio RPC、錯誤、逾時和退出。Windows Job Object 回收 Node、FFmpeg、yt-dlp、Deno、PowerShell、cloudflared 等子程序樹；一般退出先讓服務停止與寫完設定。非 Windows 透過 stdin EOF 與追蹤的 process groups 清理。
- 保留每次啟動重建的 `debug.log`，另有 `native.log`、`service-stderr.log` 協助診斷新宿主。WebView2 renderer crash 延遲重載，無回應提供重新載入／稍候，browser process crash 提示後重新啟動。

## Windows installer 與更新

正式產物為 `release/7.0.8/NeonWave-Windows-7.0.8-Setup.exe`，另附 `.sig`。NSIS 保留 per-user、一鍵安裝、正常安裝完成啟動、原 app 圖示、開始選單／桌面捷徑及卸載保留資料的行為；保留舊 registry GUID `c0566c3e-2626-593e-a376-234a368140ce` 與預設 `%LOCALAPPDATA%\Programs\neon-wave-music-player` 路徑。舊 installer 沒有 InstallLocation 時，可從已登記的 uninstaller path 恢復自訂位置。優先使用目前安裝的登錄位置，再使用歷史記住的位置。

依使用者要求，安裝檔不包含 WebView2 離線安裝包，改用 `downloadBootstrapper`。已安裝 runtime 時直接使用系統 WebView2；缺少時才從 Microsoft 下載 bootstrapper 並安裝 runtime，因此這個分支需要網際網路。本機已有 WebView2，尚未在缺少 runtime 的乾淨虛擬機上驗證首次安裝分支。產物的原生 host、Node、Opus、DAVE、LevelDB 已檢查 PE imports，沒有額外的動態 VCRUNTIME140 / MSVCP140 相依性。

新 payload 完成後才清除可辨識的舊 runtime：要求該安裝目錄同時有 `resources/app.asar` 與舊 uninstaller，再刪除舊 resources / locales 及固定的 Chromium runtime 檔案清單。資料根目錄不在此清單中，不會把舊 uninstaller 當成 Tauri uninstaller 執行。安裝模板基於 Tauri CLI 2.11.4 原始模板，更新 CLI 時應一併比較模板變更。

更新仍包含 prerelease、手動檢查、背景自動下載、原本進度與通知，以及手動立即安裝；一般退出不自動安裝。新 manifest 使用 Tauri `latest.json` 與 Ed25519 簽章，release 同時產生舊更新器可讀的 YAML，使原版取得新的 Windows installer。實際發佈需高於 7.0.8 的版本，並設定 CI 更新簽署金鑰，詳見 [signing.md](signing.md)。

本機 installer 的 updater signature 已驗證，修改任一 payload byte 會驗證失敗。這不是 Authenticode：目前沒有 Windows 發行者憑證，與原本未配置憑證時相同。

## 實際驗證

驗證日期：2026-09-13。主機為 **Windows 10 IoT Enterprise LTSC 19044**、x64、Node 24.11.1、Rust 1.93.0、WebView2。Windows 11 是首要目標，這台主機並不是 Windows 11，不能將下表視為 Win11 實機結果。

| 項目 | 結果與範圍 |
| --- | --- |
| Production build | `npm run build` 通過，產出完整 NSIS exe + updater signature；不是只有 frontend 或 cargo check |
| TypeScript / Rust | typecheck、cargo check、cargo fmt check 通過 |
| 回歸測試 | 44 項既有測試 + 3 項 sidecar / binary transport 測試，全數通過 |
| Native dependencies | 隨附 Node 實際載入 Opus，編碼／解碼 48 kHz stereo frame；FFmpeg、DAVE、sodium 載入通過 |
| 真實資料 | 從正在使用的舊 profile 的唯讀複本匯入 898 個 key；來源 CURRENT 檔案不變，未輸出設定內容 |
| 兩萬首歌曲 | 真實 production WebView2 的虛擬列表、搜尋 Enter、切換歌單、本機播放、跳秒、8D pause / resume、暫停中開 mini 的快照通過 |
| UI 幾何 | 主內容 1200×800、sidebar 260×800、原字體 stack；mini 356×132，保留原 CSS 與元件布局 |
| 原生功能 | IPC allowlist、mini 權限隔離、拒絕任意 shell / fs、無下載時拒絕安裝更新、Party 啟停通過 |
| Dialog / playlist files | 同步 confirm 的接受及取消、原本 FileReader 匯入 `.nwp`、串流歌單選項、實際 Blob 下載匯出原格式通過 |
| 正常退出 | 主視窗關閉、mini 一起結束、設定寫入完成、服務回收與 process exit 0；測試中沒有未捕捉的 renderer exception |
| 安裝器 | Windows installer payload 通過隔離測試：從模擬舊安裝恢復自訂目錄、清除舊 runtime、從安裝目錄啟動並完成 native 驗證、同版重裝、解除安裝；保留使用者資料，原有正式安裝登錄項目不變 |
| 簽章 | `verify-update-signature.mjs` 獨立驗證 artifact / trusted comment 簽章、key ID，並驗證被修改的檔案會拒絕 |

最終安裝檔 SHA-256 記錄於 `artifacts/installer-validation.json` 的 `productionInstallerSha256`，交付檔案須與此相符。其餘機器可讀證據位於 `artifacts/native-validation.json`、`artifacts/performance-validation.json`、`artifacts/legacy-data-validation.json` 與 `artifacts/ipc-audit.json`；這些本機驗證產物不加入版本控制。

改用線上 WebView2 bootstrapper 後已重新建置並驗證更新簽章；安裝驗收另記錄這次的 payload。重跑 native 啟動時，當時執行中的正式版依單一執行個體機制接手第二次啟動，沒有建立測試用 CDP endpoint，因此本輪保留原程序並略過 native 重測；上表 native / 播放結果來自遷移時已完成的驗收。執行 `e2e-native.cjs`、`e2e-performance.cjs` 或完整 `test-installer.cjs` 前需先關閉正在執行的 Tauri 版 NeonWave，即使使用不同 profile 或 installer 識別碼，程式仍遵循正式版的單一實例限制。

`scripts/e2e-native.cjs` 與 `scripts/e2e-performance.cjs` 使用獨立 profile、合成音訊／歌單及 CDP，不需操作使用者桌面。隱藏 WebView2 的原生 surface 截圖可能漏掉 compositor layers，視覺測試使用 CDP viewport / focus emulation；此設定不會加入 production app。原生 picker 先前已實際回傳所選資料夾。桌面操作收到實體 Esc 中止後，停止滑鼠／鍵盤工具，後續驗證以隔離程序執行。

## 必須區分的差異與未驗證項目

| 差異 / 限制 | 原因與處理 |
| --- | --- |
| WebView2 取代內附 Chromium | Windows 使用系統 Evergreen runtime；字型反鋸齒、codec、原生 dialog / notification 樣式會隨 OS / WebView2 更新。保留前端尺寸、字體 stack、效果與 Web Audio graph，不能保證跨 Chromium 版本逐像素一致 |
| Windows caption controls | Tauri 無相同的 titleBarOverlay API，因此保留 30px 區域並繪製對應按鈕；原生最小化／最大化／關閉與拖曳，另以隔離的 Win32 hit testing 支援 HTMAXBUTTON / Snap 與系統選單。Win11 hover Snap、多螢幕 DPI、第二次啟動的實體焦點還原、遊戲模式游標穿透及完整實體鍵盤／滑鼠驗收仍需實機確認 |
| 儲存引擎 | 兩個 runtime 的 Chromium profile 不可共用；採保留來源、首次匯入及同格式 JSON 備份，不直接讓 WebView2 開啟舊 profile |
| 傳輸與安全範圍 | 內部 `media://` 改為帶權杖 loopback；只接受產品實際使用的媒體路徑與 YouTube stream hosts，沒有沿用無限制的 URL / filesystem 存取 |
| HTTP implementation | 原 `net.fetch` 改用 Node fetch；一般 HTTPS / Range 行為已移植，但特殊企業 proxy / 自訂 CA 環境需個別確認，不能假設 WebView2、Node 與 Rust 自動共用所有網路設定 |
| macOS / Linux | 已配置平台資源、Node sidecar、DMG / AppImage workflow；未在本機跨平台編譯或實機驗收。Windows 防休眠與前景程式偵測有專用實作；目前非 Windows 的防休眠沒有等價系統 inhibit 實作 |
| 帳號與大型背景作業 | 保留 Discord voice / RPC、YouTube / Deno、公開 Cloudflare tunnel、AI providers、GPU whisper 的原成熟邏輯與依賴；未使用個人 token 連線至實際 Discord 頻道、未下載 GPU 模型或跑完整辨識、未執行真實 YouTube 下載及公開 tunnel 驗收 |
| 線上升級 | GitHub Actions 使用已設定的更新簽署 Secret 建置與發佈；本機簽章與竄改拒絕驗證已通過。尚未在使用者實機操作完整的「檢查更新 → 下載 → 立即安裝」流程 |

全庫掃描沒有殘留的 `electron` runtime import、`ipcMain`、`contextBridge`、`BrowserWindow`、`webContents` 或 ASAR packaging 邏輯。仍出現的名稱有明確用途：前端 `ipcRenderer` 相容名稱、遷移文件、installer 清除舊 `LICENSE.electron.txt` 的規則，以及 Babel / Browserslist 的 **dev-only** `electron-to-chromium` 版本資料庫。`npm ls electron electron-updater electron-builder vite-plugin-electron @electron/rebuild --all` 為空。舊版比較用的編譯產物移至 ignored `scratch/baseline/`，不參與建置或安裝。

原生視窗參考：[Microsoft Snap Layout 自訂 caption 指引](https://learn.microsoft.com/en-us/windows/apps/desktop/modernize/ui/apply-snap-layout-menu)；安全與發佈參考：[Tauri capabilities](https://v2.tauri.app/security/capabilities/)、[sidecar](https://v2.tauri.app/develop/sidecar/)、[updater](https://v2.tauri.app/plugin/updater/)。
