/* build.js — Vercel 建置腳本（編碼安全）
 *
 * 為什麼用 Node 而非 shell cp：app 原始碼放在非 ASCII 路徑「數學/app」，
 * Vercel build 環境的 shell locale 不一定是 UTF-8，直接在 buildCommand 打中文
 * 路徑可能找不到資料夾而失敗。Node 的 fs 以位元組處理檔名，不受 locale 影響，
 * 且這裡用「找出含 app/index.html 的子資料夾」來定位，完全不依賴中文字串比對。
 *
 * 行為：把 <某學科>/app 整個複製到 public/（Vercel outputDirectory）。
 */
const fs = require("fs");
const path = require("path");

const OUT = "public";

// 1) 找出根目錄下哪個資料夾含有 app/index.html（就是我們的 app）
function findAppDir() {
  const entries = fs.readdirSync(".", { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const cand = path.join(e.name, "app", "index.html");
    if (fs.existsSync(cand)) return path.join(e.name, "app");
  }
  // 後備：若已有頂層 app/index.html
  if (fs.existsSync(path.join("app", "index.html"))) return "app";
  throw new Error("找不到含 app/index.html 的資料夾");
}

// 2) 遞迴複製
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else if (e.isFile()) fs.copyFileSync(s, d);
  }
}

const appDir = findAppDir();
fs.rmSync(OUT, { recursive: true, force: true });
copyDir(appDir, OUT);

// 3) 簡單統計，方便在 build log 確認
let count = 0;
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p); else count++;
  }
})(OUT);

console.log(`[build] 從 "${appDir}" 複製到 "${OUT}/"，共 ${count} 個檔案`);
if (!fs.existsSync(path.join(OUT, "index.html"))) {
  throw new Error("[build] 失敗：public/index.html 不存在");
}
console.log("[build] OK：public/index.html 已就緒");
