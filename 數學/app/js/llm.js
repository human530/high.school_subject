/* ============================================================
 * llm.js — 引擎②：貼上自己的 API 金鑰，呼叫真 LLM 出全新題
 * 支援 OpenAI 相容 (含 OpenAI / groq / together 等) 與 Anthropic。
 * 金鑰只存在瀏覽器 localStorage，不會上傳到任何伺服器。
 * ============================================================ */
(function () {
  var LS = "math_a_llm_cfg";

  function getCfg() {
    try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; }
  }
  function setCfg(c) { localStorage.setItem(LS, JSON.stringify(c)); }

  function buildPrompt(opts) {
    // opts: {topics:[...], count, style:'學測'|'段考', difficulty}
    return (
      "你是台灣高中數學A的命題老師，目標是幫助學生考到學測滿級分。\n" +
      "請依下列規格出『" + opts.count + "』題" + opts.style + "風格的單選/計算題：\n" +
      "範圍：" + opts.topics.join("、") + "\n" +
      "難度：" + (opts.difficulty || "中偏難") + "\n" +
      "要求：\n" +
      "1. 每題務必附『5 歲也聽得懂的白話詳解』與『最快解法/秒殺技巧』。\n" +
      "2. 數字設計成計算合理、答案簡潔。\n" +
      "3. 數學式請用 LaTeX，並以 $...$ 包住。\n" +
      "只回傳 JSON 陣列，格式：\n" +
      '[{"q":"題目","hint":"提示","sol":"詳解","answer":"最終答案","topic":"主題"}]\n' +
      "不要任何多餘文字。"
    );
  }

  function parseJSON(text) {
    // 從回應中抓出 JSON 陣列
    var m = text.match(/\[[\s\S]*\]/);
    if (!m) throw new Error("無法解析 LLM 回應");
    return JSON.parse(m[0]);
  }

  async function generate(opts) {
    var cfg = getCfg();
    if (!cfg.key) throw new Error("尚未設定 API 金鑰，請先到『設定』貼上金鑰。");
    var prompt = buildPrompt(opts);

    if (cfg.provider === "anthropic") {
      var res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": cfg.key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: cfg.model || "claude-haiku-4-5-20251001",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      if (!res.ok) throw new Error("Anthropic API 錯誤 " + res.status);
      var data = await res.json();
      return parseJSON(data.content[0].text);
    }

    // OpenAI 相容
    var base = cfg.baseUrl || "https://api.openai.com/v1";
    var r = await fetch(base + "/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", "authorization": "Bearer " + cfg.key },
      body: JSON.stringify({
        model: cfg.model || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });
    if (!r.ok) throw new Error("OpenAI 相容 API 錯誤 " + r.status);
    var d = await r.json();
    return parseJSON(d.choices[0].message.content);
  }

  window.LLM = { getCfg: getCfg, setCfg: setCfg, generate: generate, isReady: function () { return !!getCfg().key; } };
})();
