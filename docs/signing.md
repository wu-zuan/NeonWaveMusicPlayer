# 簽署與更新發佈

## Tauri 更新簽章（必須）

Tauri 更新器會驗證每個更新檔的 Ed25519 簽章。這與 Windows Authenticode／Apple Developer ID 是不同的金鑰；不能用 PFX 或 Apple 憑證取代。

此次遷移已建立本機更新金鑰，公開金鑰已寫入 `src-tauri/tauri.conf.json`。私鑰位於 `.local/updater.key`，由 `.gitignore` 排除；不要加入版本控制或放進 release。請安全備份它，未來的更新必須用同一把私鑰簽署。

`npm run build` 自動使用這個本機私鑰；其他開發環境可設定 `TAURI_SIGNING_PRIVATE_KEY`（私鑰內容或檔案路徑）與 `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`。沒有金鑰時可用 `npm run build:dir` 產出 production executable。

GitHub repository Secrets 必須設定：

| Secret | 內容 |
| --- | --- |
| TAURI_SIGNING_PRIVATE_KEY | 與設定檔 public key 配對的完整私鑰文字 |
| TAURI_SIGNING_PRIVATE_KEY_PASSWORD | 私鑰密碼；目前本機金鑰無密碼，留空 |

此儲存庫已設定 `TAURI_SIGNING_PRIVATE_KEY` Actions Secret，使用與本機相同的更新金鑰。其他 fork 或儲存庫仍需自行設定上述 Secret。可使用原有 `npm run release` 標籤流程，或在 GitHub Actions 手動執行 Release workflow：後者會使用所選 commit 的版號建置，待所有平台與驗證通過後建立標籤、上傳草稿附件，再公開 Release。

## Windows 安裝檔簽署（選用）

目前與原版相同，未配置受信任的程式碼簽署憑證時會產生 unsigned installer。更新檔仍有 Tauri 簽章，但作業系統發行者身分不會因此變成受信任。

需要 Authenticode 時，在 CI 設定 `WINDOWS_SIGN_COMMAND`（Tauri signCommand，檔案佔位符為 `%1`），指向機構使用的 SignTool、SignPath 或雲端簽署腳本。腳本負責保護並載入憑證，不能將密碼寫入 repository。舊版的 `WIN_CSC_LINK` 不會直接套用到 Tauri，需移至組織的簽署命令。

## macOS 簽署與公證（選用）

沒有 Developer ID 時沿用 ad-hoc signing；設定真實身分時 build script 會取代 ad-hoc 設定。

| GitHub Secret | 對應 Tauri 環境變數 |
| --- | --- |
| MAC_CSC_LINK | APPLE_CERTIFICATE（base64 P12） |
| MAC_CSC_KEY_PASSWORD | APPLE_CERTIFICATE_PASSWORD |
| APPLE_SIGNING_IDENTITY | APPLE_SIGNING_IDENTITY |
| APPLE_ID | APPLE_ID |
| APPLE_APP_SPECIFIC_PASSWORD | APPLE_PASSWORD |
| APPLE_TEAM_ID | APPLE_TEAM_ID |

## 發佈格式與既有使用者

`scripts/collect-release.mjs` 保留原有 Windows／Mac／Linux 人類可讀檔名，收集 Tauri 簽章並產生每個平台的 manifest。Workflow 合併成 `latest.json`，同時產生舊更新器的 `latest.yml`、`latest-mac.yml`、`latest-linux.yml`。Windows installer 保留舊 NSIS registry identity 與安裝目錄；macOS 另產生原更新器需要的 zip。

Tauri host 的更新檢查包含 prerelease，並只採用含 `latest.json` 的 release。保留「檢查 → 自動下載 → 使用者立即安裝」以及原本的進度／錯誤 events；一般退出不安裝更新。這與原始 `autoInstallOnAppQuit=false` 一致。

首次發佈必須使用高於 7.0.8 的版號。未發佈簽署的新版前，不能宣稱已驗證線上升級；macOS／Linux 舊 runtime 到新 runtime 的更新切換也需要各平台實機驗證。

參考：[Tauri updater](https://v2.tauri.app/plugin/updater/)、[Windows installer](https://v2.tauri.app/distribute/windows-installer/)。
