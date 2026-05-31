/* ============================================================
 * vocab_srs.js — 單字背誦引擎（間隔重複 SRS，SM-2 簡化版）
 * 讓你「一定背得會」：答對拉長間隔、答錯隔天再轟炸，逼進長期記憶。
 * 進度存 localStorage，與各科練習分開。
 * ============================================================ */
(function () {
  var LS = "vocab_srs";
  // 5 個熟練度等級對應的「下次複習間隔(天)」
  var INTERVALS = { 0: 0, 1: 1, 2: 3, 3: 7, 4: 30 }; // box 0~4
  var DAY = 86400000;

  function load() {
    try { return JSON.parse(localStorage.getItem(LS)) || { cards: {}, stats: { learned: 0 }, streak: { last: null, days: 0 }, daily: {} }; }
    catch (e) { return { cards: {}, stats: { learned: 0 }, streak: { last: null, days: 0 }, daily: {} }; }
  }
  function save(d) { localStorage.setItem(LS, JSON.stringify(d)); }
  function todayStr() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }

  // 取得某字的卡片狀態（沒有就視為未學）
  function card(d, w) { return d.cards[w] || { box: 0, due: 0, seen: 0, wrong: 0, learned: false }; }

  // 是否到期該複習
  function isDue(c) { return c.due <= Date.now(); }

  /* 取得「今天該背的清單」：到期的舊字 + 補充新字到每日上限 */
  function todayQueue(allWords, opts) {
    opts = opts || {}; var newPerDay = opts.newPerDay || 15, reviewCap = opts.reviewCap || 60;
    var d = load();
    var due = [], fresh = [];
    allWords.forEach(function (item) {
      var c = d.cards[item.w];
      if (c) { if (isDue(c)) due.push(item); }
      else fresh.push(item);
    });
    // 到期的優先（最久沒複習在前），新字補足
    due.sort(function (a, b) { return (d.cards[a.w].due) - (d.cards[b.w].due); });
    var queue = due.slice(0, reviewCap);
    if (queue.length < reviewCap) {
      // 依等級(lv)排序新字：先學基礎高頻
      fresh.sort(function (a, b) { return (a.lv || 3) - (b.lv || 3); });
      queue = queue.concat(fresh.slice(0, newPerDay));
    }
    return { queue: queue, dueCount: due.length, newCount: fresh.length };
  }

  /* 記錄一次作答：correct=true 升 box、false 回 box1 並隔天重來 */
  function answer(w, correct) {
    var d = load();
    var c = card(d, w);
    c.seen = (c.seen || 0) + 1;
    if (correct) {
      c.box = Math.min(4, (c.box || 0) + 1);
      if (!c.learned && c.box >= 1) { c.learned = true; d.stats.learned = (d.stats.learned || 0) + 1; }
    } else {
      c.box = 1; c.wrong = (c.wrong || 0) + 1;
    }
    c.due = Date.now() + (INTERVALS[c.box] || 0) * DAY + (correct ? 0 : DAY * 0); // 答錯今天還會再出
    if (!correct) c.due = Date.now(); // 答錯立即可再複習（當天加強）
    d.cards[w] = c;

    // 連續天數
    var t = todayStr();
    if (d.streak.last !== t) {
      var yest = new Date(Date.now() - DAY); var ys = yest.getFullYear() + "-" + (yest.getMonth() + 1) + "-" + yest.getDate();
      d.streak.days = (d.streak.last === ys) ? (d.streak.days + 1) : 1;
      d.streak.last = t;
    }
    // 每日計數
    d.daily[t] = d.daily[t] || { correct: 0, wrong: 0 };
    if (correct) d.daily[t].correct++; else d.daily[t].wrong++;

    save(d);
    return c;
  }

  /* 統計：總學過、精熟(box>=3)、各 box 分布、錯詞、連續天數、今日已背 */
  function stats(allWords) {
    var d = load();
    var boxes = [0, 0, 0, 0, 0], learned = 0, mastered = 0, wrongList = [];
    allWords.forEach(function (item) {
      var c = d.cards[item.w];
      if (c) {
        boxes[c.box || 0]++;
        if (c.learned) learned++;
        if ((c.box || 0) >= 3) mastered++;
        if ((c.wrong || 0) > 0 && (c.box || 0) < 3) wrongList.push(Object.assign({ box: c.box, wrong: c.wrong }, item));
      }
    });
    wrongList.sort(function (a, b) { return b.wrong - a.wrong; });
    var t = todayStr();
    return {
      total: allWords.length, learned: learned, mastered: mastered,
      boxes: boxes, wrongList: wrongList,
      streak: d.streak.days || 0,
      todayDone: (d.daily[t] ? (d.daily[t].correct + d.daily[t].wrong) : 0),
      todayCorrect: d.daily[t] ? d.daily[t].correct : 0
    };
  }

  function reset() { localStorage.removeItem(LS); }

  window.VOCAB_SRS = {
    todayQueue: todayQueue, answer: answer, stats: stats, reset: reset,
    INTERVALS: INTERVALS, load: load
  };
})();
