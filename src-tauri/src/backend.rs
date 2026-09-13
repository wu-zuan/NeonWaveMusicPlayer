use serde_json::{json, Value};
use std::{
    collections::HashMap,
    io::{BufRead, BufReader, Write},
    path::PathBuf,
    process::{Child, ChildStdin, Command, Stdio},
    sync::{
        atomic::{AtomicBool, AtomicU64, Ordering},
        Arc, Mutex,
    },
    time::Duration,
};
use tauri::{AppHandle, Emitter, Manager};
use tokio::sync::oneshot;

pub struct Backend {
    input: Mutex<ChildStdin>,
    child: Mutex<Child>,
    pending: Mutex<HashMap<u64, oneshot::Sender<Result<Value, String>>>>,
    next_id: AtomicU64,
    pub stopping: AtomicBool,
    pub stopped: AtomicBool,
    pub user_data: PathBuf,
    #[cfg(windows)]
    _job: crate::platform::ProcessJob,
}

impl Backend {
    pub fn spawn(
        app: &AppHandle,
        user_data: PathBuf,
    ) -> Result<Arc<Self>, Box<dyn std::error::Error>> {
        let executable_directory = std::env::current_exe()?.parent().unwrap().to_path_buf();
        let binary_name = if cfg!(windows) {
            "neonwave-node.exe"
        } else {
            "neonwave-node"
        };
        let mut binary = executable_directory.join(binary_name);
        let mut entry = app.path().resource_dir()?.join("sidecar/index.mjs");
        // Development runs use resources in the checkout; bundles resolve beside the executable.
        if cfg!(dev) && !entry.exists() {
            entry = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("resources/sidecar/index.mjs");
        }
        if cfg!(dev) && !binary.exists() {
            let suffix = if cfg!(windows) { ".exe" } else { "" };
            let target = include_str!("../resources/sidecar/build.json");
            let info: Value = serde_json::from_str(target)?;
            binary = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join(format!(
                "binaries/neonwave-node-{}{}",
                info["target"].as_str().unwrap(),
                suffix
            ));
        }
        crate::log_native(
            &user_data,
            &format!(
                "Service runtime: {}; entry: {}",
                binary.display(),
                entry.display()
            ),
        );
        let stderr = std::fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(user_data.join("service-stderr.log"))?;
        let mut command = Command::new(dunce::simplified(&binary));
        // Node's entrypoint loader rejects verbatim Windows drive paths (\\?\D:).
        command
            .arg(dunce::simplified(&entry))
            .env("NW_USER_DATA", dunce::simplified(&user_data))
            .env("NW_DEVELOPMENT", if cfg!(dev) { "1" } else { "0" })
            .env_remove("NODE_OPTIONS")
            .env_remove("NODE_PATH")
            .env_remove("NODE_EXTRA_CA_CERTS")
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::from(stderr));
        #[cfg(windows)]
        {
            use std::os::windows::process::CommandExt;
            command.creation_flags(0x08000000);
        }
        let mut child = command.spawn()?;
        #[cfg(windows)]
        let job = crate::platform::ProcessJob::attach(&child)?;
        let input = child.stdin.take().unwrap();
        let output = child.stdout.take().unwrap();
        let host = Arc::new(Self {
            input: Mutex::new(input),
            child: Mutex::new(child),
            pending: Mutex::new(HashMap::new()),
            next_id: AtomicU64::new(1),
            stopping: AtomicBool::new(false),
            stopped: AtomicBool::new(false),
            user_data,
            #[cfg(windows)]
            _job: job,
        });
        let reader = host.clone();
        let handle = app.clone();
        std::thread::spawn(move || {
            for line in BufReader::new(output).lines() {
                let Ok(line) = line else { break };
                match serde_json::from_str::<Value>(&line) {
                    Ok(message) => reader.message(&handle, message),
                    Err(_) => {
                        crate::log_native(&reader.user_data, "Invalid sidecar transport message")
                    }
                }
            }
            reader.stopped.store(true, Ordering::SeqCst);
            for (_, sender) in reader.pending.lock().unwrap().drain() {
                let _ = sender.send(Err("The background service stopped".into()));
            }
            if !reader.stopping.load(Ordering::SeqCst) {
                crate::log_native(&reader.user_data, "Background service exited unexpectedly");
                let _ = handle.emit_to("main", "desktop-event", json!({"channel":"desktop:error","args":["背景服務已停止，請重新啟動 NeonWave。"]}));
            }
        });
        Ok(host)
    }

    pub fn write(&self, message: Value) -> Result<(), String> {
        let mut input = self.input.lock().map_err(|_| "Service input lock failed")?;
        let encoded = serde_json::to_vec(&message).map_err(|e| e.to_string())?;
        input
            .write_all(&encoded)
            .and_then(|_| input.write_all(b"\n"))
            .and_then(|_| input.flush())
            .map_err(|e| e.to_string())
    }

    pub async fn request(
        &self,
        window: &str,
        channel: &str,
        args: Vec<Value>,
    ) -> Result<Value, String> {
        if self.stopped.load(Ordering::SeqCst) {
            return Err("Background service is unavailable".into());
        }
        let id = self.next_id.fetch_add(1, Ordering::Relaxed);
        let (sender, receiver) = oneshot::channel();
        self.pending.lock().unwrap().insert(id, sender);
        if let Err(error) = self
            .write(json!({"kind":"request","id":id,"window":window,"channel":channel,"args":args}))
        {
            self.pending.lock().unwrap().remove(&id);
            return Err(error);
        }
        // Model downloads / GPU transcription can legitimately take hours.
        let timeout = if channel.starts_with("lyrics:gpu") || channel.starts_with("download:") {
            6 * 3600
        } else {
            300
        };
        let result = tokio::time::timeout(Duration::from_secs(timeout), receiver).await;
        self.pending.lock().unwrap().remove(&id);
        match result {
            Ok(Ok(value)) => value,
            Ok(Err(_)) => Err("Background service disconnected".into()),
            Err(_) => Err(format!("Command timed out: {channel}")),
        }
    }

    fn message(self: &Arc<Self>, app: &AppHandle, message: Value) {
        match message["kind"].as_str() {
            Some("result") => {
                if let Some(id) = message["id"].as_u64() {
                    if let Some(sender) = self.pending.lock().unwrap().remove(&id) {
                        let result = match message["error"].as_str() {
                            Some(error) => Err(error.to_string()),
                            None => Ok(message["result"].clone()),
                        };
                        let _ = sender.send(result);
                    }
                }
            }
            Some("event") => {
                let window = message["window"].as_str().unwrap_or("main");
                if ["main", "mini"].contains(&window) {
                    let _ = app.emit_to(
                        window,
                        "desktop-event",
                        json!({"channel": message["channel"], "args": message["args"]}),
                    );
                }
            }
            Some("native") => {
                let host = self.clone();
                let handle = app.clone();
                tauri::async_runtime::spawn(async move {
                    let result = crate::native_request(
                        &handle,
                        message["command"].as_str().unwrap_or(""),
                        message["args"].as_array().cloned().unwrap_or_default(),
                    )
                    .await;
                    let reply = match result {
                        Ok(value) => {
                            json!({"kind":"native-result","id":message["id"],"result":value})
                        }
                        Err(error) => {
                            json!({"kind":"native-result","id":message["id"],"error":error})
                        }
                    };
                    let _ = host.write(reply);
                });
            }
            Some("stopped") => {
                self.stopped.store(true, Ordering::SeqCst);
            }
            _ => {}
        }
    }

    pub async fn shutdown(&self) {
        if !self.stopping.swap(true, Ordering::SeqCst) {
            let _ = self.write(json!({"kind":"shutdown"}));
        }
        for _ in 0..60 {
            if self
                .child
                .lock()
                .unwrap()
                .try_wait()
                .ok()
                .flatten()
                .is_some()
            {
                return;
            }
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
        let mut child = self.child.lock().unwrap();
        let _ = child.kill();
        let _ = child.wait();
    }
}
