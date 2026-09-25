//! Give NeonWave's WebView2 audio sessions an app name in the Windows mixer.

use std::{collections::HashMap, ffi::c_void, mem::size_of, thread, time::Duration};
use windows::{
    core::{w, Interface},
    Win32::{
        Foundation::CloseHandle,
        Media::Audio::{
            eRender, IAudioSessionControl2, IAudioSessionManager2, IMMDeviceEnumerator,
            MMDeviceEnumerator, DEVICE_STATE_ACTIVE,
        },
        System::{
            Com::{
                CoCreateInstance, CoInitializeEx, CoTaskMemFree, CLSCTX_ALL, COINIT_MULTITHREADED,
            },
            Diagnostics::ToolHelp::{
                CreateToolhelp32Snapshot, Process32FirstW, Process32NextW, PROCESSENTRY32W,
                TH32CS_SNAPPROCESS,
            },
        },
    },
};

pub fn start() {
    thread::spawn(|| unsafe {
        if CoInitializeEx(None, COINIT_MULTITHREADED).is_err() {
            return;
        }
        loop {
            let _ = rename_sessions_for(std::process::id());
            thread::sleep(Duration::from_secs(4));
        }
    });
}

unsafe fn process_tree() -> windows::core::Result<HashMap<u32, (u32, String)>> {
    let snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0)?;
    let mut processes = HashMap::new();
    let mut entry = PROCESSENTRY32W::default();
    entry.dwSize = size_of::<PROCESSENTRY32W>() as u32;
    if Process32FirstW(snapshot, &mut entry).is_ok() {
        loop {
            let len = entry
                .szExeFile
                .iter()
                .position(|c| *c == 0)
                .unwrap_or(entry.szExeFile.len());
            processes.insert(
                entry.th32ProcessID,
                (
                    entry.th32ParentProcessID,
                    String::from_utf16_lossy(&entry.szExeFile[..len]),
                ),
            );
            if Process32NextW(snapshot, &mut entry).is_err() {
                break;
            }
        }
    }
    let _ = CloseHandle(snapshot);
    Ok(processes)
}

fn is_our_webview(pid: u32, own_pid: u32, processes: &HashMap<u32, (u32, String)>) -> bool {
    let Some((_, name)) = processes.get(&pid) else {
        return false;
    };
    if !name.eq_ignore_ascii_case("msedgewebview2.exe") {
        return false;
    }
    let mut cursor = pid;
    for _ in 0..16 {
        let Some((parent, _)) = processes.get(&cursor) else {
            return false;
        };
        if *parent == own_pid {
            return true;
        }
        if *parent == 0 || *parent == cursor {
            return false;
        }
        cursor = *parent;
    }
    false
}

pub(crate) unsafe fn rename_sessions_for(own_pid: u32) -> windows::core::Result<usize> {
    let processes = process_tree()?;
    let mut renamed = 0;
    let enumerator: IMMDeviceEnumerator = CoCreateInstance(&MMDeviceEnumerator, None, CLSCTX_ALL)?;
    let devices = enumerator.EnumAudioEndpoints(eRender, DEVICE_STATE_ACTIVE)?;
    for device_index in 0..devices.GetCount()? {
        let device = devices.Item(device_index)?;
        let manager: IAudioSessionManager2 = match device.Activate(CLSCTX_ALL, None) {
            Ok(manager) => manager,
            Err(_) => continue,
        };
        let Ok(sessions) = manager.GetSessionEnumerator() else {
            continue;
        };
        for session_index in 0..sessions.GetCount()? {
            let Ok(control) = sessions.GetSession(session_index) else {
                continue;
            };
            let Ok(control2) = control.cast::<IAudioSessionControl2>() else {
                continue;
            };
            let Ok(pid) = control2.GetProcessId() else {
                continue;
            };
            if !is_our_webview(pid, own_pid, &processes) {
                continue;
            }
            let Ok(name) = control.GetDisplayName() else {
                continue;
            };
            let current = name.to_string().unwrap_or_default();
            CoTaskMemFree(Some(name.0 as *const c_void));
            if current != "NeonWave" {
                if control
                    .SetDisplayName(w!("NeonWave"), std::ptr::null())
                    .is_ok()
                {
                    renamed += 1;
                }
            }
        }
    }
    Ok(renamed)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn only_names_webview_descendants_of_our_process() {
        let processes = HashMap::from([
            (10, (1, "NeonWave.exe".to_owned())),
            (20, (10, "msedgewebview2.exe".to_owned())),
            (21, (20, "msedgewebview2.exe".to_owned())),
            (30, (1, "Other.exe".to_owned())),
            (31, (30, "msedgewebview2.exe".to_owned())),
            (40, (10, "other-audio.exe".to_owned())),
        ]);
        assert!(is_our_webview(20, 10, &processes));
        assert!(is_our_webview(21, 10, &processes));
        assert!(!is_our_webview(31, 10, &processes));
        assert!(!is_our_webview(40, 10, &processes));
    }
}
