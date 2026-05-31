/* ============================================================
 * /api/llm — 伺服器端 Anthropic 代理（Vercel Serverless Function）
 * 金鑰存在 Vercel 環境變數 ANTHROPIC_API_KEY（只存伺服器、永不外流給瀏覽器）。
 * 前端打 POST /api/llm { prompt }，預設模型 claude-opus-4-8。
 * 站長只需在 Vercel 專案 Settings → Environment Variables 設一次 ANTHROPIC_API_KEY。
 * ============================================================ */
module.exports = async function handler(req, res) {
  // 同源即可用；保險起見允許簡單 CORS（同網域不受影響）
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method Not Allowed" }); return; }

  var key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(503).json({ error: "未設定", detail: "伺服器尚未設定 ANTHROPIC_API_KEY 環境變數。" });
    return;
  }

  try {
    // 讀取 body（Vercel 多半已解析；保險再 parse 一次）
    var body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    body = body || {};
    var prompt = (body.prompt || "").toString();
    var image = body.image; // 選用：{ media_type, data(base64) } 用於拍照解題（視覺）
    if (!prompt && !image) { res.status(400).json({ error: "缺少 prompt" }); return; }
    var model = body.model || "claude-opus-4-8";
    var maxTokens = Math.min(parseInt(body.max_tokens, 10) || 4000, 8000);

    // 組訊息內容：純文字，或文字＋圖片（視覺）
    var content;
    if (image && image.data) {
      content = [
        { type: "image", source: { type: "base64", media_type: image.media_type || "image/jpeg", data: image.data } },
        { type: "text", text: prompt || "請解這張圖片中的題目。" }
      ];
    } else {
      content = prompt;
    }

    var apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: model,
        max_tokens: maxTokens,
        messages: [{ role: "user", content: content }]
      })
    });

    var data = await apiRes.json();
    if (!apiRes.ok) {
      res.status(apiRes.status).json({ error: "Anthropic API 錯誤", detail: data });
      return;
    }
    // 只回傳純文字內容，前端自行解析 JSON 題目
    var text = (data.content && data.content[0] && data.content[0].text) || "";
    res.status(200).json({ text: text, model: model });
  } catch (e) {
    res.status(500).json({ error: "代理失敗", detail: String(e && e.message || e) });
  }
};
