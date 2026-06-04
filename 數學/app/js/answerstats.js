/* ============================================================
 * answerstats.js — 學測歷屆「選擇題答案」統計分析引擎
 *
 * 目的：分析近十年各科學測選擇題答案，找出
 *   1. 各題號跨年的答案分布、眾數、重複率、最長連續相同年數
 *   2. 高重複題號（某選項在該題號出現比例偏高 → 可作猜題參考）
 *   3. 相鄰年份「同題號答案相同」的數量與比例（年度相似度）
 *   4. 整卷選項偏好（A/B/C/D/E 出現比例）
 *
 * 純資料運算、無副作用；資料源為 window.EXAM_ANSWERS。
 * 設計成 classic script，雙擊 index.html 也能運作。
 * ============================================================ */
(function () {
  function subjectById(id) {
    var root = window.EXAM_ANSWERS;
    if (!root || !root.subjects) return null;
    return root.subjects.filter(function (s) { return s.id === id; })[0] || null;
  }

  function subjectList() {
    var root = window.EXAM_ANSWERS;
    if (!root || !root.subjects) return [];
    return root.subjects.map(function (s) {
      return { id: s.id, name: s.name, verified: !!s.verified, years: (s.years || []).length };
    });
  }

  // 某科目最大題號（取各年答案長度最大值）
  function maxQuestions(sub) {
    return (sub.years || []).reduce(function (m, y) { return Math.max(m, (y.answers || []).length); }, 0);
  }

  // 主分析：回傳整理後的統計物件
  function analyze(id) {
    var sub = typeof id === "string" ? subjectById(id) : id;
    if (!sub) return null;
    // 依年份「由舊到新」排序，方便算連續相同
    var years = (sub.years || []).slice().sort(function (a, b) { return a.year - b.year; });
    var maxQ = maxQuestions(sub);
    var totalYears = years.length;

    // ---- 各題號統計 ----
    var perQuestion = [];
    for (var qi = 0; qi < maxQ; qi++) {
      var seq = [];           // 依年份順序的答案（含年份）
      var dist = {};          // 選項 → 次數
      years.forEach(function (y) {
        var a = (y.answers || [])[qi];
        if (a) { seq.push({ year: y.year, a: a }); dist[a] = (dist[a] || 0) + 1; }
      });
      var total = seq.length;
      // 眾數
      var mode = null, modeCount = 0;
      Object.keys(dist).forEach(function (k) { if (dist[k] > modeCount) { modeCount = dist[k]; mode = k; } });
      // 最長連續相同（依年份順序）
      var streak = 0, cur = 0, prev = null;
      seq.forEach(function (s) {
        if (s.a === prev) cur++; else cur = 1;
        if (cur > streak) streak = cur;
        prev = s.a;
      });
      // 相鄰年份「與前一年同題號相同」的次數
      var sameAsPrev = 0;
      for (var i = 1; i < seq.length; i++) if (seq[i].a === seq[i - 1].a) sameAsPrev++;

      perQuestion.push({
        n: qi + 1,
        seq: seq,
        dist: dist,
        total: total,
        mode: mode,
        modeCount: modeCount,
        repeatRate: total ? modeCount / total : 0,   // 眾數占比（越高＝越穩定/可猜）
        streak: streak,                               // 最長連續相同年數
        sameAsPrev: sameAsPrev,
        lastYear: seq.length ? seq[seq.length - 1] : null
      });
    }

    // ---- 整卷選項偏好 ----
    var optionDist = {};
    var grandTotal = 0;
    years.forEach(function (y) {
      (y.answers || []).forEach(function (a) { if (a) { optionDist[a] = (optionDist[a] || 0) + 1; grandTotal++; } });
    });
    var optionRows = (sub.choices || Object.keys(optionDist)).map(function (k) {
      var c = optionDist[k] || 0;
      return { opt: k, count: c, pct: grandTotal ? c / grandTotal : 0 };
    }).sort(function (a, b) { return b.count - a.count; });

    // ---- 相鄰年份相似度（同題號答案相同的數量） ----
    var yearPairs = [];
    for (var p = 1; p < years.length; p++) {
      var prevY = years[p - 1], curY = years[p];
      var len = Math.min((prevY.answers || []).length, (curY.answers || []).length);
      var same = 0, denom = 0;
      for (var q = 0; q < len; q++) {
        var pa = prevY.answers[q], ca = curY.answers[q];
        if (pa && ca) { denom++; if (pa === ca) same++; }
      }
      yearPairs.push({ from: prevY.year, to: curY.year, same: same, total: denom, rate: denom ? same / denom : 0 });
    }

    // ---- 高重複題號：眾數占比高者（至少 3 年資料） ----
    var hot = perQuestion.filter(function (q) { return q.total >= 3; })
      .slice().sort(function (a, b) {
        if (b.repeatRate !== a.repeatRate) return b.repeatRate - a.repeatRate;
        return b.streak - a.streak;
      });

    return {
      subject: { id: sub.id, name: sub.name, verified: !!sub.verified, note: sub.note || "", choices: sub.choices || [] },
      years: years.map(function (y) { return y.year; }),
      totalYears: totalYears,
      maxQ: maxQ,
      perQuestion: perQuestion,
      optionRows: optionRows,
      grandTotal: grandTotal,
      yearPairs: yearPairs,
      hot: hot
    };
  }

  window.ANSWERSTATS = {
    subjectById: subjectById,
    subjectList: subjectList,
    analyze: analyze
  };
})();
