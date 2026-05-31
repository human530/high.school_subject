/* ============================================================
 * llm.js — 引擎②：真 LLM 出題
 *  模式 A（預設、零設定）：呼叫自家伺服器代理 /api/llm，
 *     站長在 Vercel 設好 ANTHROPIC_API_KEY，學生端打開就能用 Opus 4.8。
 *  模式 B（備援、自帶金鑰）：使用者在「設定」貼自己的金鑰，直連 API。
 *  金鑰（模式B）只存在瀏覽器 localStorage，不會上傳到任何伺服器。
 * ============================================================ */
(function () {
  var LS = "math_a_llm_cfg";
  var PROXY = "/api/llm";          // 自家伺服器代理（同源）
  var DEFAULT_MODEL = "claude-opus-4-8";
  var proxyOK = null;              // null=未測, true/false=結果（快取本次工作階段）

  function getCfg() {
    try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; }
  }
  function setCfg(c) { localStorage.setItem(LS, JSON.stringify(c)); }

  function buildPrompt(opts) {
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
    var m = text.match(/\[[\s\S]*\]/);
    if (!m) throw new Error("無法解析 LLM 回應");
    return JSON.parse(m[0]);
  }

  // 透過自家伺服器代理出題（零設定）
  async function viaProxy(prompt) {
    var res = await fetch(PROXY, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt: prompt, model: DEFAULT_MODEL })
    });
    if (res.status === 503) { proxyOK = false; throw new Error("PROXY_UNCONFIGURED"); }
    if (!res.ok) throw new Error("伺服器代理錯誤 " + res.status);
    var data = await res.json();
    proxyOK = true;
    return parseJSON(data.text || "");
  }

  // 自帶金鑰直連（備援）
  async function viaOwnKey(prompt, cfg) {
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
          model: cfg.model || DEFAULT_MODEL,
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      if (!res.ok) throw new Error("Anthropic API 錯誤 " + res.status);
      var data = await res.json();
      return parseJSON(data.content[0].text);
    }
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

  async function generate(opts) {
    var prompt = buildPrompt(opts);
    var cfg = getCfg();
    // 優先用自家代理（零設定）；代理未設定才退回自帶金鑰
    if (proxyOK !== false) {
      try { return await viaProxy(prompt); }
      catch (e) {
        if (e.message !== "PROXY_UNCONFIGURED" && proxyOK === true) throw e; // 代理可用但出錯→照實丟
        // 代理未設定 → 往下試自帶金鑰
      }
    }
    if (cfg.key) return await viaOwnKey(prompt, cfg);
    throw new Error("尚未設定出題來源：請站長在 Vercel 設定 ANTHROPIC_API_KEY，或到『設定』貼上你自己的金鑰。");
  }

  // 探測伺服器代理是否可用（給 UI 顯示用）
  async function probeProxy() {
    if (proxyOK !== null) return proxyOK;
    try {
      var res = await fetch(PROXY, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: "" })  // 空 prompt：函式有跑且金鑰已設→400(缺prompt)；金鑰未設→503
      });
      // 只有「函式確實執行了」才算可用：200=成功、400=有跑但缺 prompt。
      // 503=未設金鑰、404/501=根本沒有此函式（如本機靜態伺服器）→ 視為不可用。
      proxyOK = (res.status === 200 || res.status === 400);
    } catch (e) { proxyOK = false; }
    return proxyOK;
  }

  window.LLM = {
    getCfg: getCfg, setCfg: setCfg, generate: generate, probeProxy: probeProxy,
    // 只要伺服器代理可用，或本機有金鑰，就算 ready
    isReady: function () { return proxyOK === true || !!getCfg().key; }
  };
})();
