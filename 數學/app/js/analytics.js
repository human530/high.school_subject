/* ============================================================
 * analytics.js — 個人化學習分析（資料存在瀏覽器 localStorage）
 * 記錄每章作答對錯 → 找弱點 → 以「滿級分」為目標排補強順序。
 * ============================================================ */
(function () {
  var LS = "math_a_progress";

  function load() {
    try { return JSON.parse(localStorage.getItem(LS)) || { chapters: {}, history: [], goal: 15 }; }
    catch (e) { return { chapters: {}, history: [], goal: 15 }; }
  }
  function save(d) { localStorage.setItem(LS, JSON.stringify(d)); }

  // 記錄一次作答
  function record(chapterId, chapterTitle, correct) {
    var d = load();
    if (!d.chapters[chapterId]) d.chapters[chapterId] = { title: chapterTitle, attempts: 0, correct: 0, recent: [] };
    var c = d.chapters[chapterId];
    c.attempts++; if (correct) c.correct++;
    c.recent.push(correct ? 1 : 0); if (c.recent.length > 10) c.recent.shift();
    d.history.push({ t: Date.now(), chapterId: chapterId, correct: correct });
    if (d.history.length > 500) d.history.shift();
    save(d);
    return c;
  }

  // 每章正確率（含未練過的章節，標 0/未練）
  function chapterStats() {
    var d = load();
    var all = CURRICULUM.allChapters();
    return all.map(function (ch) {
      var c = d.chapters[ch.id] || { attempts: 0, correct: 0, recent: [] };
      var rate = c.attempts ? c.correct / c.attempts : null;
      var recentRate = c.recent.length ? c.recent.reduce(function (a, b) { return a + b; }, 0) / c.recent.length : null;
      return {
        id: ch.id, title: ch.title, book: ch.bookTitle,
        attempts: c.attempts, correct: c.correct,
        rate: rate, recentRate: recentRate
      };
    });
  }

  // 找弱點並排補強優先序：未練 > 正確率低 > 練習量少
  function weakSpots() {
    return chapterStats().slice().sort(function (a, b) {
      var ra = a.rate === null ? -1 : a.rate;   // 未練最優先
      var rb = b.rate === null ? -1 : b.rate;
      if (ra !== rb) return ra - rb;            // 正確率低者先補
      return a.attempts - b.attempts;           // 練得少者先補
    });
  }

  // 整體：以滿級分(90%+ 正確率、看到就會算)為標準的健康度
  function overall() {
    var stats = chapterStats();
    var practiced = stats.filter(function (s) { return s.attempts > 0; });
    var totalAtt = stats.reduce(function (a, s) { return a + s.attempts; }, 0);
    var totalCor = stats.reduce(function (a, s) { return a + s.correct; }, 0);
    var rate = totalAtt ? totalCor / totalAtt : 0;
    var mastered = stats.filter(function (s) { return s.rate !== null && s.rate >= 0.9 && s.attempts >= 5; }).length;
    return {
      totalChapters: stats.length,
      practicedChapters: practiced.length,
      masteredChapters: mastered,   // 達 90%+ 且練過 5 題以上＝「秒殺級」
      overallRate: rate,
      totalAttempts: totalAtt
    };
  }

  // 產生「邁向滿級分」的個人化讀書建議
  function plan() {
    var weak = weakSpots();
    var o = overall();
    var steps = [];
    var targets = weak.filter(function (w) {
      return w.rate === null || w.rate < 0.9;
    }).slice(0, 5);
    targets.forEach(function (w, i) {
      var label = w.rate === null ? "尚未練習" : (Math.round(w.rate * 100) + "% 正確率");
      steps.push({
        priority: i + 1,
        chapterId: w.id,
        title: w.title,
        reason: w.rate === null
          ? "此章還沒練過，先看教學→經典題→學測題建立手感。"
          : (w.rate < 0.6 ? "正確率偏低(" + label + ")，回到教學重看『秒殺解法』再大量練同型題。"
            : "接近精熟(" + label + ")，用參數化題庫衝到 90%+ 即可達秒殺級。")
      });
    });
    return { overall: o, steps: steps };
  }

  function reset() { localStorage.removeItem(LS); }
  function setGoal(g) { var d = load(); d.goal = g; save(d); }

  window.ANALYTICS = {
    record: record, chapterStats: chapterStats, weakSpots: weakSpots,
    overall: overall, plan: plan, reset: reset, setGoal: setGoal, load: load
  };
})();
