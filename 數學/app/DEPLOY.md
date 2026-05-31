# 部署到 Vercel（Git 整合，最穩）

本專案已內含 `vercel.json`，把 `數學/app/` 自動複製到 `public/` 後發佈，
完全離線、無 CDN 相依（KaTeX 與字型皆本機 vendor）。

## 一次性設定（約 2 分鐘）

1. 到 <https://vercel.com> 登入（用你的 GitHub 帳號）。
2. 點 **Add New… → Project**。
3. 選 **Import** 你的 repo：`human530/high.school_subject`。
4. 設定頁全部用預設即可（`vercel.json` 已幫你設好）：
   - Framework Preset：**Other**
   - Build Command：（已由 vercel.json 指定，免改）
   - Output Directory：`public`（已由 vercel.json 指定）
   - **Production Branch**：建議在 Project → Settings → Git 把 production branch
     設為目前的 `claude/high-school-math-a-app-LOnqr`，或先把這個分支合併進 `main`
     再用 `main` 當 production。
5. 按 **Deploy**。完成後會給你一個網址（例如 `https://high-school-subject.vercel.app`）。

## 之後

只要 push 到 production branch，Vercel 會自動重新部署。PR 也會有預覽網址。

## 驗證重點（部署後可自查）

- 開首頁應看到「🎯 數A 滿級分作戰中心」。
- 進任一章節（教學 → 點章節）應看到 **🖼️ 圖解分析** 的 SVG 圖。
- 數學式應正確排版（KaTeX）。
- DevTools → Application → Service Workers 應看到已啟用；關網路仍可開啟。

## 技術細節

`vercel.json`：
- `buildCommand`：`rm -rf public && mkdir -p public && cp -r 數學/app/. public/`
  （因為原始碼放在非 ASCII 路徑 `數學/app`，複製到 `public/` 可避免路徑編碼問題）
- `outputDirectory`：`public`
- `sw.js` 設 `no-cache`（確保 service worker 更新即時生效）
- KaTeX 字型設一年期 immutable 快取。

## 開啟伺服器端 AI 出題（Opus 4.8，學生端免設定）

1. Vercel 專案 → **Settings → Environment Variables**
2. 新增：`ANTHROPIC_API_KEY` = 你的 Anthropic 金鑰（`sk-ant-...`），套用到 Production
3. Redeploy（或下次 push 自動套用）

完成後，`/api/llm` 代理會用伺服器金鑰呼叫 Claude Opus 4.8，使用者打開「設定 → 用 LLM 產生模擬題」即可出題，**完全不需要自己貼金鑰**。金鑰只存在伺服器環境變數，不會外流到瀏覽器或版控。
