/* ============================================================
 * exam.js — 模擬考組卷（學測版 / 段考版）
 *  - 學測版：跨 1~4 冊全範圍抽題，題數較多、計時長。
 *  - 段考版：可指定範圍（某冊/某些章），題數較少。
 *  題源：靜態學測風格題 + 參數化題庫；若已設定金鑰也可混入 LLM 出題。
 *  作答後以 SCORING(大考中心級分) 換算，並把對錯回寫 ANALYTICS。
 * ============================================================ */
(function () {
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }

  // 從某章抽一題：優先用參數化題庫（可無限變化），否則用靜態題
  function drawFromChapter(ch) {
    var gens = (ch.generators || []).filter(function (k) { return window.GENERATORS[k]; });
    if (gens.length && Math.random() < 0.7) {
      var key = gens[Math.floor(Math.random() * gens.length)];
      var item = window.GENERATORS[key]();
      return { chapterId: ch.id, chapterTitle: ch.title, q: item.q, hint: item.hint, sol: item.sol, answer: item.answer, source: "參數化" };
    }
    var probs = ch.problems || [];
    if (probs.length) {
      var p = probs[Math.floor(Math.random() * probs.length)];
      return { chapterId: ch.id, chapterTitle: ch.title, q: p.q, hint: p.hint, sol: p.sol, answer: p.answer, source: "題庫" };
    }
    return null;
  }

  // 學測版：全範圍，預設 20 題、100 分、100 分鐘
  function buildGSAT(count) {
    count = count || 20;
    var chs = CURRICULUM.allChapters();
    var items = [];
    for (var i = 0; i < count; i++) {
      var ch = chs[Math.floor(Math.random() * chs.length)];
      var it = drawFromChapter(ch);
      if (it) items.push(it);
    }
    return {
      kind: "學測版", title: "數A 學測模擬卷（全範圍 1~4 冊）",
      durationMin: 100, fullScore: 100, perQ: 100 / items.length, items: items
    };
  }

  // 段考版：指定 bookIds 或 chapterIds；預設 12 題、100 分、50 分鐘
  function buildMidterm(scope, count) {
    count = count || 12;
    var chs = CURRICULUM.allChapters().filter(function (c) {
      if (!scope) return true;
      if (scope.bookIds) return scope.bookIds.indexOf(c.bookId) >= 0;
      if (scope.chapterIds) return scope.chapterIds.indexOf(c.id) >= 0;
      return true;
    });
    if (!chs.length) chs = CURRICULUM.allChapters();
    var items = [];
    for (var i = 0; i < count; i++) {
      var ch = chs[Math.floor(Math.random() * chs.length)];
      var it = drawFromChapter(ch);
      if (it) items.push(it);
    }
    return {
      kind: "段考版", title: "數A 段考模擬卷",
      durationMin: 50, fullScore: 100, perQ: 100 / items.length, items: items
    };
  }

  // 批改：results 為使用者每題是否答對的布林陣列
  function grade(paper, results) {
    var correct = results.filter(Boolean).length;
    var raw = Math.round(correct * paper.perQ);
    var level = window.SCORING.toLevel(raw, paper.fullScore);
    var band = window.SCORING.band(level);
    // 回寫個人分析
    paper.items.forEach(function (it, i) {
      window.ANALYTICS.record(it.chapterId, it.chapterTitle, !!results[i]);
    });
    return {
      correct: correct, total: paper.items.length, raw: raw,
      fullScore: paper.fullScore, level: level, band: band,
      needForPerfect: window.SCORING.neededForPerfect(paper.fullScore)
    };
  }

  window.EXAM = { buildGSAT: buildGSAT, buildMidterm: buildMidterm, grade: grade, shuffle: shuffle };
})();
