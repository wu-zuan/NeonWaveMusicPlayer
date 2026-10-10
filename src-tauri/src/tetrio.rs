#[cfg(windows)]
fn is_tetrio(name: &str) -> bool {
    ["tetr.io.exe", "tetrio.exe", "tetrio-desktop.exe"]
        .iter().any(|candidate| name.eq_ignore_ascii_case(candidate))
}

pub fn status() -> Result<serde_json::Value, String> {
    #[cfg(windows)]
    {
        use windows::Win32::{Foundation::CloseHandle, System::Diagnostics::ToolHelp::{
            CreateToolhelp32Snapshot, Process32FirstW, Process32NextW, PROCESSENTRY32W, TH32CS_SNAPPROCESS,
        }};
        // A read-only snapshot works even when the game is in the background.
        unsafe {
            let snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0).map_err(|e| e.to_string())?;
            let mut entry = PROCESSENTRY32W::default();
            entry.dwSize = std::mem::size_of::<PROCESSENTRY32W>() as u32;
            let result = (|| {
                Process32FirstW(snapshot, &mut entry).map_err(|e| e.to_string())?;
                loop {
                    let len = entry.szExeFile.iter().position(|c| *c == 0).unwrap_or(entry.szExeFile.len());
                    if is_tetrio(&String::from_utf16_lossy(&entry.szExeFile[..len])) {
                        return Ok(serde_json::json!({"supported": true, "running": true}));
                    }
                    if let Err(error) = Process32NextW(snapshot, &mut entry) {
                        if error.code() != windows::core::HRESULT::from_win32(18) {
                            return Err(error.to_string());
                        }
                        break;
                    }
                }
                Ok(serde_json::json!({"supported": true, "running": false}))
            })();
            let _ = CloseHandle(snapshot);
            result
        }
    }
    #[cfg(not(windows))]
    Ok(serde_json::json!({"supported": false, "running": false}))
}

#[cfg(all(test, windows))]
mod tests {
    #[test]
    fn matches_only_desktop_executables() {
        for name in ["TETR.IO.exe", "tetrio.exe", "TETRIO-DESKTOP.EXE"] {
            assert!(super::is_tetrio(name));
        }
        for name in ["chrome.exe", "code.exe", "tetr.io-updater.exe", "my-tetrio.exe"] {
            assert!(!super::is_tetrio(name));
        }
    }
}
