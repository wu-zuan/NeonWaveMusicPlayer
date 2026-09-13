// Windows 11 Snap requires native HTMAXBUTTON hit testing even when the
// caption is drawn in HTML. Keep this Win32 adaptation outside the renderer.
// https://learn.microsoft.com/windows/apps/desktop/modernize/ui/apply-snap-layout-menu
use tauri::WebviewWindow;
use windows::core::BOOL;
use windows::Win32::{
    Foundation::{HWND, LPARAM, LRESULT, POINT, RECT, WPARAM},
    Graphics::Gdi::ScreenToClient,
    UI::{
        HiDpi::GetDpiForWindow,
        Shell::{DefSubclassProc, RemoveWindowSubclass, SetWindowSubclass},
        WindowsAndMessaging::*,
    },
};

const SUBCLASS: usize = 0x4e575343;

unsafe fn over_maximize(root: HWND, position: LPARAM) -> bool {
    let mut rect = RECT::default();
    let mut point = POINT {
        x: position.0 as i16 as i32,
        y: (position.0 >> 16) as i16 as i32,
    };
    if GetClientRect(root, &mut rect).is_err() || !ScreenToClient(root, &mut point).as_bool() {
        return false;
    }
    let scale = GetDpiForWindow(root) as f64 / 96.0;
    let x = point.x as f64;
    let y = point.y as f64;
    // Same 46 × 30 logical-pixel rectangle as the original caption overlay.
    x >= rect.right as f64 - 92.0 * scale
        && x < rect.right as f64 - 46.0 * scale
        && y >= 0.0
        && y < 30.0 * scale
}

unsafe extern "system" fn caption_proc(
    hwnd: HWND,
    message: u32,
    wp: WPARAM,
    lp: LPARAM,
    _: usize,
    root: usize,
) -> LRESULT {
    let root = HWND(root as _);
    match message {
        WM_NCHITTEST if over_maximize(root, lp) => {
            // WebView2 has child HWNDs. Let this part of their input pass to
            // the top-level window so Windows associates Snap with the app.
            return LRESULT(if hwnd == root {
                HTMAXBUTTON as isize
            } else {
                HTTRANSPARENT as isize
            });
        }
        WM_NCLBUTTONDOWN if hwnd == root && wp.0 == HTMAXBUTTON as usize => return LRESULT(0),
        WM_NCLBUTTONUP if hwnd == root && wp.0 == HTMAXBUTTON as usize => {
            let action = if IsZoomed(root).as_bool() {
                SC_RESTORE
            } else {
                SC_MAXIMIZE
            };
            let _ = PostMessageW(
                Some(root),
                WM_SYSCOMMAND,
                WPARAM(action as usize),
                LPARAM(0),
            );
            return LRESULT(0);
        }
        WM_NCDESTROY => {
            let _ = RemoveWindowSubclass(hwnd, Some(caption_proc), SUBCLASS);
        }
        _ => {}
    }
    DefSubclassProc(hwnd, message, wp, lp)
}

unsafe extern "system" fn attach_child(child: HWND, root: LPARAM) -> BOOL {
    // SetWindowSubclass is only valid on windows owned by the current thread.
    if GetWindowThreadProcessId(child, None) == GetWindowThreadProcessId(HWND(root.0 as _), None) {
        let _ = SetWindowSubclass(child, Some(caption_proc), SUBCLASS, root.0 as usize);
    }
    BOOL(1)
}

pub fn attach(window: &WebviewWindow) {
    let target = window.clone();
    let _ = window.run_on_main_thread(move || unsafe {
        if let Ok(root) = target.hwnd() {
            let _ = SetWindowSubclass(root, Some(caption_proc), SUBCLASS, root.0 as usize);
            let _ = EnumChildWindows(Some(root), Some(attach_child), LPARAM(root.0 as isize));
        }
    });
}

pub fn system_menu(window: &WebviewWindow) -> Result<(), String> {
    let target = window.clone();
    window
        .run_on_main_thread(move || unsafe {
            if let Ok(root) = target.hwnd() {
                let mut point = POINT::default();
                if GetCursorPos(&mut point).is_ok() {
                    let menu = GetSystemMenu(root, false);
                    let maximized = IsZoomed(root).as_bool();
                    let _ = EnableMenuItem(
                        menu,
                        SC_RESTORE,
                        MF_BYCOMMAND | if maximized { MF_ENABLED } else { MF_GRAYED },
                    );
                    let _ = EnableMenuItem(
                        menu,
                        SC_MAXIMIZE,
                        MF_BYCOMMAND | if maximized { MF_GRAYED } else { MF_ENABLED },
                    );
                    let result = TrackPopupMenu(
                        menu,
                        TPM_RETURNCMD | TPM_RIGHTBUTTON,
                        point.x,
                        point.y,
                        None,
                        root,
                        None,
                    );
                    if result.0 != 0 {
                        let _ = PostMessageW(
                            Some(root),
                            WM_SYSCOMMAND,
                            WPARAM(result.0 as usize),
                            LPARAM(0),
                        );
                    }
                }
            }
        })
        .map_err(|error| error.to_string())
}
