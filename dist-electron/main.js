import { app as i, BrowserWindow as d, ipcMain as a, dialog as w } from "electron";
import { fileURLToPath as h } from "node:url";
import r from "node:path";
import c from "node:fs/promises";
const f = r.dirname(h(import.meta.url));
process.env.APP_ROOT = r.join(f, "..");
const l = process.env.VITE_DEV_SERVER_URL, y = r.join(process.env.APP_ROOT, "dist-electron"), p = r.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = l ? r.join(process.env.APP_ROOT, "public") : p;
let e;
function m() {
  e = new d({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: "hidden",
    // Custom title bar for premium look
    titleBarOverlay: {
      color: "#00000000",
      symbolColor: "#ffffff",
      height: 30
    },
    webPreferences: {
      preload: r.join(f, "preload.mjs"),
      webSecurity: !1
      // simplified for local file access in dev
    }
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), l ? e.loadURL(l) : e.loadFile(r.join(p, "index.html"));
}
i.on("window-all-closed", () => {
  process.platform !== "darwin" && (i.quit(), e = null);
});
i.on("activate", () => {
  d.getAllWindows().length === 0 && m();
});
i.whenReady().then(() => {
  m(), a.handle("dialog:openDirectory", async () => {
    const { canceled: t, filePaths: o } = await w.showOpenDialog(e, {
      properties: ["openDirectory"]
    });
    return t ? null : o[0];
  }), a.handle("files:listMusic", async (t, o) => {
    if (!o) return [];
    try {
      const n = await c.readdir(o), u = [".mp3", ".wav", ".wma", ".m4a", ".flac", ".ogg", ".mp4", ".mov", ".wmv", ".avi"];
      return n.filter((s) => u.includes(r.extname(s).toLowerCase())).map((s) => r.join(o, s));
    } catch (n) {
      return console.error("Error reading directory:", n), [];
    }
  }), a.handle("files:readBuffer", async (t, o) => {
    try {
      return await c.readFile(o);
    } catch (n) {
      return console.error("Error reading file:", n), null;
    }
  });
});
export {
  y as MAIN_DIST,
  p as RENDERER_DIST,
  l as VITE_DEV_SERVER_URL
};
