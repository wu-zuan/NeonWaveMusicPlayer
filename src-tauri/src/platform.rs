use std::sync::atomic::{AtomicBool, Ordering};
#[cfg(windows)]
#[path = "platform/windows_caption.rs"]
pub mod caption;
static KEEP_AWAKE: AtomicBool = AtomicBool::new(false);
pub fn set_keep_awake(enabled: bool) {
    KEEP_AWAKE.store(enabled, Ordering::SeqCst);
}

pub fn initialize() {
    #[cfg(windows)]
    unsafe {
        // Preserve the predecessor's explicit taskbar / notification identity.
        let _ = windows::Win32::UI::Shell::SetCurrentProcessExplicitAppUserModelID(
            windows::core::w!("NeonWave"),
        );
    }
    #[cfg(windows)]
    std::thread::spawn(|| {
        use windows::Win32::System::Power::{
            SetThreadExecutionState, ES_CONTINUOUS, ES_SYSTEM_REQUIRED,
        };
        let mut previous = false;
        loop {
            let next = KEEP_AWAKE.load(Ordering::SeqCst);
            if next != previous {
                unsafe {
                    SetThreadExecutionState(if next {
                        ES_CONTINUOUS | ES_SYSTEM_REQUIRED
                    } else {
                        ES_CONTINUOUS
                    });
                }
                previous = next;
            }
            std::thread::sleep(std::time::Duration::from_millis(250));
        }
    });
}

#[cfg(windows)]
pub struct ProcessJob(windows::Win32::Foundation::HANDLE);
#[cfg(windows)]
unsafe impl Send for ProcessJob {}
#[cfg(windows)]
unsafe impl Sync for ProcessJob {}

#[cfg(windows)]
impl ProcessJob {
    pub fn attach(child: &std::process::Child) -> Result<Self, windows::core::Error> {
        use std::os::windows::io::AsRawHandle;
        use windows::Win32::{Foundation::HANDLE, System::JobObjects::*};
        unsafe {
            let handle = CreateJobObjectW(None, None)?;
            let job = Self(handle);
            let mut limits = JOBOBJECT_EXTENDED_LIMIT_INFORMATION::default();
            limits.BasicLimitInformation.LimitFlags = JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE;
            SetInformationJobObject(
                handle,
                JobObjectExtendedLimitInformation,
                &limits as *const _ as _,
                std::mem::size_of_val(&limits) as u32,
            )?;
            AssignProcessToJobObject(handle, HANDLE(child.as_raw_handle()))?;
            Ok(job)
        }
    }
}
#[cfg(windows)]
impl Drop for ProcessJob {
    fn drop(&mut self) {
        unsafe {
            let _ = windows::Win32::Foundation::CloseHandle(self.0);
        }
    }
}
