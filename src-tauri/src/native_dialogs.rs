use serde_json::Value;
use tauri::{
    plugin::{Plugin, TauriPlugin},
    AppHandle, Wry,
};

// The dialog plugin's JavaScript initializer replaces window.confirm with an
// async function. Existing callers intentionally expect a synchronous boolean;
// a Promise would approve destructive UI actions even when Cancel is chosen.
// Use its native setup through our validated commands and retain the WebView's
// built-in alert / confirm / prompt implementations and return types.
struct NativeDialogs(TauriPlugin<Wry>);

impl Plugin<Wry> for NativeDialogs {
    fn name(&self) -> &'static str {
        self.0.name()
    }
    fn initialize(
        &mut self,
        app: &AppHandle,
        config: Value,
    ) -> Result<(), Box<dyn std::error::Error>> {
        self.0.initialize(app, config)
    }
}

pub fn init() -> impl Plugin<Wry> {
    NativeDialogs(tauri_plugin_dialog::init())
}
