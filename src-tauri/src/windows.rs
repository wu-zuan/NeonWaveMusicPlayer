use std::path::Path;
use tauri::{AppHandle, LogicalPosition, Manager, WebviewUrl, WebviewWindow, WebviewWindowBuilder};

fn internal_navigation(url: &tauri::Url) -> bool {
    (url.scheme() == "tauri" && url.host_str() == Some("localhost"))
        || (["http", "https"].contains(&url.scheme())
            && url.host_str() == Some("tauri.localhost")
            && url.port().is_none())
        || (cfg!(dev)
            && url.scheme() == "http"
            && [Some("localhost"), Some("127.0.0.1")].contains(&url.host_str())
            && url.port() == Some(5173))
}

fn browser_args() -> String {
    let mut args = "--autoplay-policy=no-user-gesture-required --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding".to_string();
    #[cfg(windows)]
    {
        let system = std::env::var("SystemRoot").unwrap_or_else(|_| "C:\\Windows".into());
        if !Path::new(&system).join("System32/mfplat.dll").exists()
            || !Path::new(&system)
                .join("System32/vcruntime140.dll")
                .exists()
        {
            args.push_str(" --disable-gpu");
        }
    }
    // Explicit opt-in only; never enabled by a shipped default or by page input.
    if let Ok(port) = std::env::var("NW_REMOTE_DEBUG") {
        if let Ok(port) = port.parse::<u16>() {
            args.push_str(&format!(
                " --remote-debugging-port={port} --remote-debugging-address=127.0.0.1"
            ));
        }
    }
    args
}

pub fn create_main(app: &AppHandle, profile: &Path) -> tauri::Result<WebviewWindow> {
    let builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::App("index.html".into()))
        .title("NeonWave Music Player")
        .inner_size(1200.0, 800.0)
        .min_inner_size(800.0, 600.0)
        .center()
        .visible(false)
        .background_color(tauri::webview::Color(2, 6, 23, 255))
        .data_directory(profile.join("WebView2"))
        .additional_browser_args(&browser_args())
        .disable_drag_drop_handler()
        .background_throttling(tauri::utils::config::BackgroundThrottlingPolicy::Disabled)
        .on_navigation(internal_navigation);
    #[cfg(windows)]
    let builder = builder.decorations(false);
    #[cfg(target_os = "macos")]
    let builder = builder
        .title_bar_style(tauri::TitleBarStyle::Overlay)
        .hidden_title(true);
    let window = builder.build()?;
    attach_recovery(&window, profile);
    Ok(window)
}

pub fn restore_main(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.unminimize();
        let _ = window.show();
        let _ = window.set_always_on_top(true);
        let _ = window.set_focus();
        let _ = window.set_always_on_top(false);
    }
}

pub fn set_mini(app: &AppHandle, profile: &Path, enabled: bool) -> Result<bool, String> {
    if let Some(window) = app.get_webview_window("mini") {
        if !enabled {
            window.close().map_err(|e| e.to_string())?;
        }
        return Ok(enabled);
    }
    if !enabled {
        return Ok(false);
    }
    let screen_width = app
        .primary_monitor()
        .ok()
        .flatten()
        .map(|monitor| monitor.work_area().size.width as f64 / monitor.scale_factor())
        .unwrap_or(1920.0);
    let window =
        WebviewWindowBuilder::new(app, "mini", WebviewUrl::App("index.html?mini=true".into()))
            .title("NeonWave Music Player")
            .inner_size(356.0, 132.0)
            .position(screen_width - 376.0, 20.0)
            .decorations(false)
            .transparent(true)
            .always_on_top(true)
            .resizable(false)
            .skip_taskbar(true)
            .shadow(false)
            .visible(false)
            .background_color(tauri::webview::Color(0, 0, 0, 0))
            .data_directory(profile.join("WebView2"))
            .additional_browser_args(&browser_args())
            .disable_drag_drop_handler()
            .background_throttling(tauri::utils::config::BackgroundThrottlingPolicy::Disabled)
            .on_navigation(internal_navigation)
            .build()
            .map_err(|e| e.to_string())?;
    attach_recovery(&window, profile);
    window
        .set_position(LogicalPosition::new(screen_width - 376.0, 20.0))
        .map_err(|e| e.to_string())?;
    Ok(true)
}

fn attach_recovery(window: &WebviewWindow, profile: &Path) {
    #[cfg(windows)]
    {
        use tauri_plugin_dialog::{DialogExt, MessageDialogButtons, MessageDialogKind};
        use webview2_com::{Microsoft::Web::WebView2::Win32::*, ProcessFailedEventHandler};
        let owned_window = window.clone();
        let directory = profile.to_path_buf();
        let _ = window.with_webview(move |webview| unsafe {
            let Ok(core) = webview.controller().CoreWebView2() else {
                return;
            };
            let mut token = 0;
            let _ = core.add_ProcessFailed(
                &ProcessFailedEventHandler::create(Box::new(move |_, args| {
                    let Some(args) = args else { return Ok(()) };
                    let mut kind = COREWEBVIEW2_PROCESS_FAILED_KIND_RENDER_PROCESS_EXITED;
                    args.ProcessFailedKind(&mut kind)?;
                    crate::log_native(&directory, &format!("WebView2 process event: {}", kind.0));
                    if kind == COREWEBVIEW2_PROCESS_FAILED_KIND_RENDER_PROCESS_UNRESPONSIVE {
                        let window = owned_window.clone();
                        window
                            .app_handle()
                            .dialog()
                            .message("應用程式似乎沒有回應，是否重新載入？")
                            .title("NeonWave 無回應")
                            .kind(MessageDialogKind::Warning)
                            .buttons(MessageDialogButtons::OkCancelCustom(
                                "重新載入".into(),
                                "稍候".into(),
                            ))
                            .show(move |reload| {
                                if reload {
                                    let _ = window.reload();
                                }
                            });
                    } else if kind == COREWEBVIEW2_PROCESS_FAILED_KIND_RENDER_PROCESS_EXITED {
                        let window = owned_window.clone();
                        tauri::async_runtime::spawn(async move {
                            tokio::time::sleep(std::time::Duration::from_secs(2)).await;
                            let _ = window.reload();
                        });
                    } else if kind == COREWEBVIEW2_PROCESS_FAILED_KIND_BROWSER_PROCESS_EXITED {
                        let app = owned_window.app_handle().clone();
                        let action = app.clone();
                        app.dialog()
                            .message("渲染進程意外終止，應用程式將嘗試重新載入。")
                            .title("NeonWave 錯誤")
                            .kind(MessageDialogKind::Error)
                            .show(move |_| {
                                let handle = action.clone();
                                tauri::async_runtime::spawn(async move {
                                    handle
                                        .state::<std::sync::Arc<crate::backend::Backend>>()
                                        .shutdown()
                                        .await;
                                    handle.restart();
                                });
                            });
                    }
                    // GPU child process recovery is automatic in WebView2.
                    Ok(())
                })),
                &mut token,
            );
        });
    }
    #[cfg(not(windows))]
    {
        let _ = (window, profile);
    }
}
