#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod backend;
mod native_dialogs;
mod platform;
mod updates;
mod windows;

use backend::Backend;
use serde_json::{json, Value};
use std::{
    fs::{self, OpenOptions},
    io::Write,
    path::{Path, PathBuf},
    sync::{atomic::Ordering, Arc},
};
use tauri::{AppHandle, Emitter, Manager, WebviewWindow};
use tauri_plugin_clipboard_manager::ClipboardExt;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;

fn user_data(app: &AppHandle) -> Result<PathBuf, Box<dyn std::error::Error>> {
    if let Ok(path) = std::env::var("NW_USER_DATA") {
        let path = PathBuf::from(path);
        if !path.is_absolute() {
            return Err("NW_USER_DATA must be absolute".into());
        }
        return Ok(path);
    }
    // Match the old app.name path. Some packaged versions used productName.
    let root = app.path().config_dir()?;
    let names = ["neon-wave-music-player", "NeonWave"];
    for name in names {
        let candidate = root.join(name);
        if candidate.join("Local Storage").exists()
            || candidate.join("metadata-cache.json").exists()
            || candidate.join("preferences.json").exists()
        {
            return Ok(candidate);
        }
    }
    Ok(root.join(names[0]))
}

pub fn log_native(directory: &Path, message: &str) {
    if let Ok(mut file) = OpenOptions::new()
        .create(true)
        .append(true)
        .open(directory.join("native.log"))
    {
        let _ = writeln!(file, "[{:?}] {message}", std::time::SystemTime::now());
    }
}

fn validate_window(window: &str, channel: &str) -> Result<(), String> {
    if window == "main" {
        return Ok(());
    }
    if window == "mini"
        && [
            "desktop:bootstrap",
            "player:getSnapshot",
            "window:togglePlay",
            "window:previousTrack",
            "window:nextTrack",
            "window:restoreMain",
            "window:setMiniPlayer",
            "window:startDrag",
            "renderer:log",
            "storage:set",
        ]
        .contains(&channel)
    {
        return Ok(());
    }
    Err(format!("Command is not allowed for this window: {channel}"))
}

#[tauri::command]
async fn desktop_invoke(
    app: AppHandle,
    window: WebviewWindow,
    channel: String,
    args: Vec<Value>,
) -> Result<Value, String> {
    validate_window(window.label(), &channel)?;
    let first = args.first().cloned().unwrap_or(Value::Null);
    match channel.as_str() {
        "app:version" => Ok(json!(app.package_info().version.to_string())),
        "app:quit" => {
            app.state::<Arc<Backend>>().shutdown().await;
            app.exit(0);
            Ok(Value::Null)
        }
        "window:minimize" => window
            .minimize()
            .map(|_| Value::Null)
            .map_err(|e| e.to_string()),
        "window:close" => window
            .close()
            .map(|_| Value::Null)
            .map_err(|e| e.to_string()),
        "window:maximize" => {
            if window.is_maximized().unwrap_or(false) {
                window.unmaximize()
            } else {
                window.maximize()
            }
            .map_err(|e| e.to_string())?;
            Ok(json!(window.is_maximized().unwrap_or(false)))
        }
        "window:isMaximized" => Ok(json!(window.is_maximized().map_err(|e| e.to_string())?)),
        "window:startDrag" => window
            .start_dragging()
            .map(|_| Value::Null)
            .map_err(|e| e.to_string()),
        "window:systemMenu" => {
            #[cfg(windows)]
            platform::caption::system_menu(&window)?;
            Ok(Value::Null)
        }
        "window:restoreMain" => {
            windows::restore_main(&app);
            Ok(Value::Null)
        }
        "window:setMiniPlayer" | "window:toggleMiniPlayer" => {
            let enabled = if channel == "window:toggleMiniPlayer" {
                app.get_webview_window("mini").is_none()
            } else {
                first.as_bool().ok_or("Expected a boolean")?
            };
            let host = app.state::<Arc<Backend>>();
            Ok(json!(windows::set_mini(&app, &host.user_data, enabled)?))
        }
        "window:togglePlay" | "window:previousTrack" | "window:nextTrack" => {
            let event = channel.replacen("window:", "player:", 1);
            app.emit_to("main", "desktop-event", json!({"channel":event,"args":[]}))
                .map_err(|e| e.to_string())?;
            Ok(Value::Null)
        }
        "dialog:openDirectory" => {
            let result = native_request(
                &app,
                "dialog:open",
                vec![json!({"properties":["openDirectory"]})],
            )
            .await?;
            Ok(result["filePaths"][0].clone())
        }
        "clipboard:writeText" => {
            app.clipboard()
                .write_text(first.as_str().ok_or("Expected text")?)
                .map_err(|e| e.to_string())?;
            Ok(Value::Null)
        }
        "shell:openExternal" => {
            let url = first.as_str().ok_or("Expected URL")?;
            if url != "https://discord.com/developers/applications" {
                return Err("External URL is not permitted".into());
            }
            app.opener()
                .open_url(url, None::<&str>)
                .map_err(|e| e.to_string())?;
            Ok(Value::Null)
        }
        "update:check" => Ok(updates::check(&app).await),
        "update:install" => Ok(updates::install(&app).await),
        _ => {
            let channels: Vec<String> =
                serde_json::from_str(include_str!("../../shared/sidecar-channels.json")).unwrap();
            if !channels.contains(&channel) {
                return Err(format!("Unknown application command: {channel}"));
            }
            if window.label() == "mini"
                && channel == "storage:set"
                && first != "neonwave_mini_player"
            {
                return Err("Mini player cannot change this preference".into());
            }
            app.state::<Arc<Backend>>()
                .request(window.label(), &channel, args)
                .await
        }
    }
}

#[tauri::command]
async fn desktop_send(
    app: AppHandle,
    window: WebviewWindow,
    channel: String,
    args: Vec<Value>,
) -> Result<(), String> {
    if window.label() != "main"
        || !["player:sync", "discord:audio-chunk", "party:presentation"].contains(&channel.as_str())
    {
        return Err("Event is not permitted".into());
    }
    app.state::<Arc<Backend>>()
        .request(window.label(), &channel, args)
        .await?;
    Ok(())
}

#[tauri::command]
async fn desktop_ready(app: AppHandle, window: WebviewWindow) -> Result<(), String> {
    if !["main", "mini"].contains(&window.label()) {
        return Err("Unknown window".into());
    }
    #[cfg(windows)]
    if window.label() == "main" {
        platform::caption::attach(&window);
    }
    if window.label() == "mini" {
        let snapshot = app
            .state::<Arc<Backend>>()
            .request("mini", "player:getSnapshot", vec![])
            .await?;
        window
            .set_ignore_cursor_events(snapshot["isGameModeActive"].as_bool().unwrap_or(false))
            .map_err(|e| e.to_string())?;
    }
    if std::env::var("NW_HIDDEN").as_deref() != Ok("1") {
        window.show().map_err(|e| e.to_string())?;
        if window.label() == "main" {
            windows::restore_main(&app);
        }
    }
    Ok(())
}

pub async fn native_request(
    app: &AppHandle,
    command: &str,
    args: Vec<Value>,
) -> Result<Value, String> {
    let first = args.first().cloned().unwrap_or(Value::Null);
    match command {
        "mini:passthrough" => {
            if let Some(window) = app.get_webview_window("mini") {
                window
                    .set_ignore_cursor_events(first.as_bool().unwrap_or(false))
                    .map_err(|e| e.to_string())?;
            }
            Ok(Value::Null)
        }
        "power:set" => {
            platform::set_keep_awake(first.as_bool().unwrap_or(false));
            Ok(Value::Null)
        }
        "dialog:open" => {
            let mut picker = app.dialog().file();
            if let Some(window) = app.get_webview_window("main") {
                picker = picker.set_parent(&window);
            }
            let multiple = first["properties"]
                .as_array()
                .is_some_and(|items| items.iter().any(|item| item == "multiSelections"));
            let (sender, receiver) = tokio::sync::oneshot::channel();
            if multiple {
                picker.pick_folders(move |paths| {
                    let _ = sender.send(paths);
                });
            } else {
                picker.pick_folder(move |path| {
                    let _ = sender.send(path.map(|path| vec![path]));
                });
            }
            let paths = receiver.await.map_err(|e| e.to_string())?;
            let paths: Vec<String> = paths
                .unwrap_or_default()
                .into_iter()
                .filter_map(|file| file.into_path().ok())
                .map(|path| path.to_string_lossy().into_owned())
                .collect();
            Ok(json!({"canceled":paths.is_empty(),"filePaths":paths}))
        }
        "dialog:save" => {
            let mut picker = app
                .dialog()
                .file()
                .set_title(first["title"].as_str().unwrap_or("下載歌曲"));
            if let Some(window) = app.get_webview_window("main") {
                picker = picker.set_parent(&window);
            }
            if let Some(name) = first["defaultPath"].as_str() {
                picker = picker.set_file_name(name);
            }
            if let Some(filters) = first["filters"].as_array() {
                for filter in filters {
                    let extensions: Vec<&str> = filter["extensions"]
                        .as_array()
                        .map(|items| items.iter().filter_map(Value::as_str).collect())
                        .unwrap_or_default();
                    picker =
                        picker.add_filter(filter["name"].as_str().unwrap_or("Media"), &extensions);
                }
            }
            let (sender, receiver) = tokio::sync::oneshot::channel();
            picker.save_file(move |path| {
                let _ = sender.send(path);
            });
            let file = receiver
                .await
                .map_err(|e| e.to_string())?
                .and_then(|file| file.into_path().ok());
            Ok(
                json!({"canceled":file.is_none(),"filePath":file.map(|file| file.to_string_lossy().into_owned())}),
            )
        }
        _ => Err("Unknown native service request".into()),
    }
}

fn main() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _, _| windows::restore_main(app)))
        .plugin(native_dialogs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .manage(updates::Updates::default())
        .invoke_handler(tauri::generate_handler![desktop_invoke, desktop_send, desktop_ready])
        .setup(|app| {
            let directory = user_data(app.handle())?;
            fs::create_dir_all(&directory)?;
            log_native(&directory, "NeonWave native host starting");
            let host = Backend::spawn(app.handle(), directory.clone())?;
            app.manage(host);
            platform::initialize();
            windows::create_main(app.handle(), &directory)?;
            Ok(())
        })
        .on_window_event(|window, event| {
            if window.label() == "main" {
                match event {
                    tauri::WindowEvent::CloseRequested { api, .. } => {
                        api.prevent_close();
                        let app = window.app_handle().clone();
                        let _ = app.emit_to("main", "desktop-event", json!({"channel":"desktop:before-close","args":[]}));
                        tauri::async_runtime::spawn(async move {
                            // The renderer flushes queued preference writes and
                            // acknowledges with app:quit. A crashed UI cannot
                            // prevent shutdown indefinitely.
                            tokio::time::sleep(std::time::Duration::from_secs(3)).await;
                            app.state::<Arc<Backend>>().shutdown().await;
                            app.exit(0);
                        });
                    }
                    tauri::WindowEvent::Resized(_) => {
                        let _ = window.emit("desktop-event", json!({"channel":"window:maximized","args":[window.is_maximized().unwrap_or(false)]}));
                    }
                    _ => {}
                }
            }
        })
        .build(tauri::generate_context!())
        .expect("Failed to start NeonWave");
    app.run(|app, event| {
        if let tauri::RunEvent::ExitRequested { api, .. } = event {
            let host = app.state::<Arc<Backend>>();
            if !host.stopping.load(Ordering::SeqCst) {
                api.prevent_exit();
                let handle = app.clone();
                tauri::async_runtime::spawn(async move {
                    handle.state::<Arc<Backend>>().shutdown().await;
                    handle.exit(0);
                });
            }
        }
    });
}
