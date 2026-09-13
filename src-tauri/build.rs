fn main() {
    tauri_build::try_build(tauri_build::Attributes::new().app_manifest(
        tauri_build::AppManifest::new().commands(&[
            "desktop_invoke",
            "desktop_send",
            "desktop_ready",
        ]),
    ))
    .expect("Tauri application manifest");
}
