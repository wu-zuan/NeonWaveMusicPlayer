use serde_json::{json, Value};
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_notification::NotificationExt;
use tauri_plugin_updater::{Update, UpdaterExt};
use tokio::sync::Mutex;

#[derive(Default)]
pub struct Updates {
    check_lock: Mutex<()>,
    downloaded: Mutex<Option<(Update, Vec<u8>)>>,
}

fn status(app: &AppHandle, payload: Value) {
    let _ = app.emit_to(
        "main",
        "desktop-event",
        json!({"channel":"update-status","args":[payload]}),
    );
}

pub async fn check(app: &AppHandle) -> Value {
    if cfg!(dev) {
        return fail(
            app,
            "自動更新只會在打包安裝版中運作，開發模式無法檢查 GitHub 更新。",
        );
    }
    let state = app.state::<Updates>();
    let Ok(_lock) = state.check_lock.try_lock() else {
        let _wait = state.check_lock.lock().await;
        return json!({"ok":true});
    };
    *state.downloaded.lock().await = None;
    status(app, json!({"status":"checking"}));
    match check_inner(app, &state).await {
        Ok(()) => json!({"ok":true}),
        Err(error) => fail(app, &error),
    }
}

async fn check_inner(app: &AppHandle, state: &Updates) -> Result<(), String> {
    // Include prereleases as the previous updater did. Ignore legacy releases
    // without a signed Tauri manifest; those installers cannot update this host.
    let client = reqwest::Client::builder()
        .user_agent("NeonWave-Updater")
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| e.to_string())?;
    let releases = client
        .get("https://api.github.com/repos/wu-zuan/NeonWaveMusicPlayer/releases?per_page=30")
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?
        .json::<Vec<Value>>()
        .await
        .map_err(|e| e.to_string())?;
    let endpoint = releases
        .iter()
        .filter(|release| release["draft"] != true)
        .filter_map(|release| release["assets"].as_array())
        .flat_map(|assets| assets.iter())
        .find(|asset| asset["name"] == "latest.json")
        .and_then(|asset| asset["browser_download_url"].as_str());
    let Some(endpoint) = endpoint else {
        status(app, json!({"status":"not-available"}));
        return Ok(());
    };
    let endpoint = endpoint
        .parse()
        .map_err(|e| format!("Invalid release URL: {e}"))?;
    let exit_app = app.clone();
    let updater = app
        .updater_builder()
        .endpoints(vec![endpoint])
        .map_err(|e| e.to_string())?
        .on_before_exit(move || {
            let host = exit_app
                .state::<std::sync::Arc<crate::backend::Backend>>()
                .inner()
                .clone();
            let _ =
                std::thread::spawn(move || tauri::async_runtime::block_on(host.shutdown())).join();
        })
        .build()
        .map_err(|e| e.to_string())?;
    let update = updater.check().await.map_err(|e| e.to_string())?;
    let Some(update) = update else {
        status(app, json!({"status":"not-available"}));
        return Ok(());
    };
    let info = json!({"version":update.version,"releaseNotes":update.body});
    status(app, json!({"status":"available","info":info}));
    let started = std::time::Instant::now();
    let mut transferred = 0usize;
    let bytes = update.download(|length, total| {
        transferred += length;
        let percent = total.filter(|total| *total > 0).map(|total| transferred as f64 / total as f64 * 100.0).unwrap_or(0.0);
        status(app, json!({"status":"downloading","progress":{
            "percent":percent,"transferred":transferred,"total":total,
            "bytesPerSecond": transferred as f64 / started.elapsed().as_secs_f64().max(0.001)
        }}));
    }, || {}).await.map_err(|e| e.to_string())?;
    *state.downloaded.lock().await = Some((update, bytes));
    status(app, json!({"status":"downloaded","info":info}));
    let _ = app
        .notification()
        .builder()
        .title("NeonWave 更新")
        .body("新版本已下載完成，將於重啟後自動安裝。")
        .show();
    Ok(())
}

pub async fn install(app: &AppHandle) -> Value {
    if cfg!(dev) {
        return fail(app, "開發模式不能安裝更新。");
    }
    let state = app.state::<Updates>();
    let Some((update, bytes)) = state.downloaded.lock().await.take() else {
        return fail(app, "更新尚未下載完成，請先檢查並下載更新。");
    };
    status(app, json!({"status":"installing"}));
    match update.install(&bytes) {
        Ok(()) => {
            app.state::<std::sync::Arc<crate::backend::Backend>>()
                .shutdown()
                .await;
            app.restart();
        }
        Err(error) => {
            *state.downloaded.lock().await = Some((update, bytes));
            fail(app, &error.to_string())
        }
    }
}
fn fail(app: &AppHandle, error: &str) -> Value {
    status(app, json!({"status":"error","error":error}));
    json!({"ok":false,"error":error})
}
