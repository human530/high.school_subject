/* ============================================================
 * app.js — 主程式：路由 + 各頁面 UI（純 vanilla JS）
 * 頁面：儀表板 / 教學 / 練習(參數化) / 學測題 / 模擬考 / 個人分析 / 設定
 * 數學式以 KaTeX auto-render。
 * ============================================================ */
(function () {
  var app = document.getElementById("app");

  /* ---------- 工具 ---------- */
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function go(hash) { location.hash = hash; }
  function renderMath(root) {
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(root || app, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ],
          throwOnError: false
        });
      } catch (e) { }
    }
  }
  function setActive(route) {
    $all(".nav a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + route);
    });
  }

  /* ============================================================
   * 儀表板
   * ============================================================ */
  function viewDashboard() {
    var o = ANALYTICS.overall();
    var plan = ANALYTICS.plan();
    var pct = o.totalChapters ? Math.round(o.masteredChapters / o.totalChapters * 100) : 0;
    var rate = Math.round((o.overallRate || 0) * 100);

    var stepsHtml = plan.steps.length
      ? plan.steps.map(function (s) {
        return '<li><span class="pri">#' + s.priority + '</span> <a href="#learn/' + s.chapterId + '">' + s.title + '</a><div class="muted">' + s.reason + '</div></li>';
      }).join("")
      : '<li class="muted">還沒有練習紀錄。先去「教學」看一章，再到「練習」做幾題，我就能幫你抓弱點了！</li>';

    app.innerHTML = "";
    app.appendChild(el(
      '<div class="view">' +
      '<section class="hero">' +
      '<h1>🎯 個申就上</h1>' +
      '<p class="muted">目標：每章正確率 90%+、看到題目就秒殺。以下是你目前的進度。</p>' +
      '<div class="cards">' +
      '<div class="card stat"><div class="big">' + rate + '%</div><div>整體正確率</div></div>' +
      '<div class="card stat"><div class="big">' + o.masteredChapters + '/' + o.totalChapters + '</div><div>已達秒殺級章節</div></div>' +
      '<div class="card stat"><div class="big">' + o.totalAttempts + '</div><div>累計練習題數</div></div>' +
      '</div>' +
      '<div class="progress"><div class="bar" style="width:' + pct + '%"></div></div>' +
      '<p class="muted">距離「全章秒殺」完成度 ' + pct + '%</p>' +
      '</section>' +

      '<section class="panel">' +
      '<h2>📌 今日補強優先序（邁向滿級分）</h2>' +
      '<ol class="planlist">' + stepsHtml + '</ol>' +
      '</section>' +

      '<section class="panel">' +
      '<h2>🚀 快速開始</h2>' +
      '<div class="quick">' +
      '<a class="qbtn" href="#learn">📖 看教學（白話＋秒殺解法）</a>' +
      '<a class="qbtn" href="#practice">✏️ 無限練習（參數化題庫）</a>' +
      '<a class="qbtn" href="#gsat">🧠 學測風格題</a>' +
      '<a class="qbtn" href="#points">🎯 整合考點（跨章高頻）</a>' +
      '<a class="qbtn" href="#exam">📝 模擬考（學測/段考）</a>' +
      '<a class="qbtn" href="#analysis">📊 個人弱點分析</a>' +
      '</div>' +
      '</section>' +
      '</div>'
    ));
    renderMath();
  }

  /* ============================================================
   * 教學：章節列表 + 章節詳情
   * ============================================================ */
  function viewLearnList() {
    var html = '<div class="view"><h1>📖 教學</h1><p class="muted">點章節看：5 歲也懂的白話講解、秒殺解法、公式、經典題與學測題。</p>';
    CURRICULUM.books.forEach(function (b) {
      html += '<section class="panel"><h2>' + b.title + '</h2><div class="chaplist">';
      b.chapters.forEach(function (c) {
        html += '<a class="chapcard" href="#learn/' + c.id + '"><div class="ct">' + c.title + '</div>' +
          '<div class="tags">' + (c.tags || []).map(function (t) { return '<span>' + t + '</span>'; }).join("") + '</div></a>';
      });
      html += '</div></section>';
    });
    html += '</div>';
    app.innerHTML = ""; app.appendChild(el(html)); renderMath();
  }

  function viewChapter(id) {
    var c = CURRICULUM.chapterById(id);
    if (!c) { viewLearnList(); return; }
    var st = ANALYTICS.chapterStats().filter(function (s) { return s.id === id; })[0];
    var rateTxt = st && st.rate !== null ? Math.round(st.rate * 100) + "%（" + st.correct + "/" + st.attempts + "）" : "尚未練習";

    var html = '<div class="view chapter">' +
      '<a class="back" href="#learn">← 回章節列表</a>' +
      '<h1>' + c.title + '</h1>' +
      '<div class="muted">本章正確率：' + rateTxt + '　|　冊別：' + c.bookTitle + '</div>' +

      (window.EXAMPOINTS_API && EXAMPOINTS_API.forChapter(c.id).length
        ? '<div class="eptags">🎯 本章對應整合考點：' +
        EXAMPOINTS_API.forChapter(c.id).map(function (e) {
          return '<a class="eptag" href="#points/' + e.id + '">' + e.name + '（' + "★".repeat(e.freq) + '）</a>';
        }).join("") + '</div>'
        : '') +

      (window.DIAGRAMS && DIAGRAMS.has(c.diagram)
        ? '<section class="panel diagrampanel"><h2>🖼️ 圖解分析</h2>' +
        '<div class="diagramwrap">' + DIAGRAMS.render(c.diagram) + '</div>' +
        '<p class="muted diagcap">一張圖看懂本章核心：對照下面的觀念與秒殺解法一起看，最快建立直覺。</p></section>'
        : '') +
      '<section class="panel five"><h2>🧒 5 歲也懂版</h2><p>' + c.fiveYO + '</p></section>' +

      '<section class="panel"><h2>💡 核心觀念</h2><ul class="concepts">' +
      c.concepts.map(function (k) { return '<li><b>' + k.h + '：</b>' + k.b + '</li>'; }).join("") +
      '</ul></section>' +

      '<section class="panel trick"><h2>⚡ 秒殺解法 / 口訣</h2><ul>' +
      c.tricks.map(function (t) { return '<li>' + t + '</li>'; }).join("") +
      '</ul></section>' +

      '<section class="panel"><h2>📐 重點公式</h2><ul class="formulas">' +
      c.formulas.map(function (f) { return '<li>' + f + '</li>'; }).join("") +
      '</ul></section>' +

      '<section class="panel"><h2>📝 經典題 & 學測風格題</h2><div class="problems">' +
      (c.problems || []).map(function (p, i) {
        var badge = p.type === "gsat" ? '<span class="badge gsat">學測風格</span>' : '<span class="badge">經典題</span>';
        return '<div class="prob">' + badge + '<div class="q">' + (i + 1) + '. ' + p.q + '</div>' +
          '<details><summary>看提示</summary><div class="hint">' + p.hint + '</div></details>' +
          '<details><summary>看完整詳解</summary><div class="sol">' + p.sol + '<div class="ans">✅ 答案：' + p.answer + '</div></div></details>' +
          '<div class="selfcheck" data-cid="' + c.id + '" data-ct="' + c.title.replace(/"/g, "") + '">' +
          '我會了嗎？<button class="ok">✅ 答對</button><button class="ng">❌ 答錯</button></div>' +
          '</div>';
      }).join("") +
      '</div></section>' +

      '<section class="panel"><h2>🎯 練到秒殺</h2><a class="qbtn" href="#practice/' + c.id + '">用本章參數化題庫無限練習 →</a></section>' +
      '</div>';

    app.innerHTML = ""; app.appendChild(el(html));
    // 自評按鈕
    $all(".selfcheck").forEach(function (sc) {
      sc.querySelector(".ok").onclick = function () { ANALYTICS.record(sc.dataset.cid, sc.dataset.ct, true); flash(sc, "已記錄 ✅"); };
      sc.querySelector(".ng").onclick = function () { ANALYTICS.record(sc.dataset.cid, sc.dataset.ct, false); flash(sc, "已記錄 ❌（會幫你列入補強）"); };
    });
    renderMath();
  }

  function flash(node, msg) {
    var s = node.querySelector(".flashmsg") || el('<span class="flashmsg"></span>');
    s.textContent = " " + msg; node.appendChild(s);
  }

  /* ============================================================
   * 練習：參數化題庫（無限換數字）
   * ============================================================ */
  var practiceState = null;
  function viewPractice(chapterId) {
    var chapters = CURRICULUM.allChapters();
    var current = chapterId ? CURRICULUM.chapterById(chapterId) : null;

    var opts = chapters.map(function (c) {
      return '<option value="' + c.id + '"' + (current && current.id === c.id ? " selected" : "") + '>' + c.title + '</option>';
    }).join("");

    app.innerHTML = "";
    app.appendChild(el(
      '<div class="view">' +
      '<h1>✏️ 無限練習</h1>' +
      '<p class="muted">同一題型自動換數字，附完整詳解。答完按「我答對/答錯」會自動記錄到弱點分析。</p>' +
      '<div class="ctrl"><label>選章節：<select id="psel">' + opts + '</select></label>' +
      '<button id="pnew" class="qbtn">出新題 ↻</button></div>' +
      '<div id="parea"></div>' +
      '</div>'
    ));
    $("#psel").onchange = nextProblem;
    $("#pnew").onclick = nextProblem;
    nextProblem();

    function nextProblem() {
      var id = $("#psel").value;
      var ch = CURRICULUM.chapterById(id);
      var gens = (ch.generators || []).filter(function (k) { return window.GENERATORS[k]; });
      var area = $("#parea");
      if (!gens.length) {
        area.innerHTML = '<div class="panel">此章暫無參數化題庫，請到「教學」看經典題與學測題。</div>';
        return;
      }
      var key = gens[Math.floor(Math.random() * gens.length)];
      var item = window.GENERATORS[key]();
      practiceState = { chapterId: ch.id, chapterTitle: ch.title };
      area.innerHTML = "";
      area.appendChild(el(
        '<div class="panel prob">' +
        '<span class="badge">' + item.topic + '</span>' +
        '<div class="q">' + item.q + '</div>' +
        '<details><summary>看提示</summary><div class="hint">' + item.hint + '</div></details>' +
        '<details><summary>看完整詳解</summary><div class="sol">' + item.sol + '<div class="ans">✅ 答案：' + item.answer + '</div></div></details>' +
        '<div class="selfcheck">作答結果：<button class="ok">✅ 我答對</button><button class="ng">❌ 我答錯</button></div>' +
        '</div>'
      ));
      var sc = area.querySelector(".selfcheck");
      sc.querySelector(".ok").onclick = function () { ANALYTICS.record(ch.id, ch.title, true); flash(sc, "已記錄，下一題！"); setTimeout(nextProblem, 600); };
      sc.querySelector(".ng").onclick = function () { ANALYTICS.record(ch.id, ch.title, false); flash(sc, "沒關係，記得回看秒殺解法。"); };
      renderMath(area);
    }
  }

  /* ============================================================
   * 學測題：把所有 gsat 靜態題集中練
   * ============================================================ */
  function viewGSAT() {
    var probs = CURRICULUM.allProblems().filter(function (p) { return p.type === "gsat"; });
    var html = '<div class="view"><h1>🧠 學測風格題</h1><p class="muted">蒐集各章學測風格題，附最快解法。共 ' + probs.length + ' 題。</p><div class="problems">';
    probs.forEach(function (p, i) {
      html += '<div class="panel prob"><span class="badge gsat">' + p.chapterTitle + '</span>' +
        '<div class="q">' + (i + 1) + '. ' + p.q + '</div>' +
        '<details><summary>看提示</summary><div class="hint">' + p.hint + '</div></details>' +
        '<details><summary>看完整詳解</summary><div class="sol">' + p.sol + '<div class="ans">✅ 答案：' + p.answer + '</div></div></details>' +
        '<div class="selfcheck" data-cid="' + p.chapterId + '" data-ct="' + p.chapterTitle.replace(/"/g, "") + '">作答結果：<button class="ok">✅</button><button class="ng">❌</button></div>' +
        '</div>';
    });
    html += '</div></div>';
    app.innerHTML = ""; app.appendChild(el(html));
    $all(".selfcheck").forEach(function (sc) {
      sc.querySelector(".ok").onclick = function () { ANALYTICS.record(sc.dataset.cid, sc.dataset.ct, true); flash(sc, "已記錄 ✅"); };
      sc.querySelector(".ng").onclick = function () { ANALYTICS.record(sc.dataset.cid, sc.dataset.ct, false); flash(sc, "已記錄 ❌"); };
    });
    renderMath();
  }

  /* ============================================================
   * 模擬考
   * ============================================================ */
  var examState = null;
  function viewExam() {
    var bookOpts = CURRICULUM.books.map(function (b) {
      return '<label class="chk"><input type="checkbox" value="' + b.id + '" checked> ' + b.title + '</label>';
    }).join("");
    app.innerHTML = "";
    app.appendChild(el(
      '<div class="view">' +
      '<h1>📝 模擬考</h1>' +
      '<div class="cards">' +
      '<div class="card examcard"><h2>學測版</h2><p class="muted">全範圍 1~4 冊・100 分鐘・以大考中心級分換算</p>' +
      '<label>題數：<input id="gsatCount" type="number" value="20" min="5" max="40"></label>' +
      '<button id="startGsat" class="qbtn">開始學測模擬卷</button></div>' +
      '<div class="card examcard"><h2>段考版</h2><p class="muted">自選範圍・題數較少</p>' +
      '<div class="bookchecks">' + bookOpts + '</div>' +
      '<label>題數：<input id="midCount" type="number" value="12" min="5" max="30"></label>' +
      '<button id="startMid" class="qbtn">開始段考模擬卷</button></div>' +
      '<div class="card examcard"><h2>整合考點版</h2><p class="muted">跨章高頻考點混合・專練「整合題」</p>' +
      '<label>考點：<select id="epSel"><option value="">全部考點綜合（高頻優先）</option>' +
      (window.EXAMPOINTS || []).map(function (e) { return '<option value="' + e.id + '">' + e.name + '（' + "★".repeat(e.freq) + '）</option>'; }).join("") +
      '</select></label>' +
      '<label>題數：<input id="epCount" type="number" value="12" min="5" max="30"></label>' +
      '<button id="startEp" class="qbtn">開始整合考點卷</button></div>' +
      '</div>' +
      '<div id="examArea"></div>' +
      '</div>'
    ));
    $("#startEp").onclick = function () {
      var ep = $("#epSel").value ? EXAMPOINTS_API.byId($("#epSel").value) : null;
      var n = parseInt($("#epCount").value, 10) || 12;
      startPaper(EXAM.buildExamPoint(ep, n));
    };
    $("#startGsat").onclick = function () {
      var n = parseInt($("#gsatCount").value, 10) || 20;
      startPaper(EXAM.buildGSAT(n));
    };
    $("#startMid").onclick = function () {
      var ids = $all(".bookchecks input:checked").map(function (i) { return i.value; });
      var n = parseInt($("#midCount").value, 10) || 12;
      startPaper(EXAM.buildMidterm({ bookIds: ids }, n));
    };
  }

  function startPaper(paper) {
    examState = { paper: paper, results: new Array(paper.items.length).fill(false), answered: new Array(paper.items.length).fill(false) };
    var html = '<div class="panel exampaper"><h2>' + paper.title + '</h2>' +
      '<div class="muted">建議作答時間 ' + paper.durationMin + ' 分鐘・滿分 ' + paper.fullScore + ' 分・共 ' + paper.items.length + ' 題</div>' +
      '<div id="timer" class="timer">⏱ 00:00</div>';
    paper.items.forEach(function (it, i) {
      html += '<div class="prob examq" data-i="' + i + '"><span class="badge gsat">' + it.chapterTitle + '</span>' +
        '<div class="q">第 ' + (i + 1) + ' 題：' + it.q + '</div>' +
        '<details><summary>看詳解</summary><div class="sol">' + it.sol + '<div class="ans">✅ 答案：' + it.answer + '</div></div></details>' +
        '<div class="selfcheck">對照詳解後：<button class="ok">✅ 我對</button><button class="ng">❌ 我錯</button></div>' +
        '</div>';
    });
    html += '<button id="submitExam" class="qbtn big">交卷並計算級分</button></div>';
    var area = $("#examArea");
    area.innerHTML = ""; area.appendChild(el(html));

    $all(".examq").forEach(function (q) {
      var i = parseInt(q.dataset.i, 10);
      q.querySelector(".ok").onclick = function () { examState.results[i] = true; examState.answered[i] = true; q.classList.add("done"); q.classList.remove("wrong"); };
      q.querySelector(".ng").onclick = function () { examState.results[i] = false; examState.answered[i] = true; q.classList.add("done", "wrong"); };
    });
    $("#submitExam").onclick = submitExam;
    startTimer();
    renderMath(area);
  }

  var timerId = null;
  function startTimer() {
    if (timerId) clearInterval(timerId);
    var t0 = Date.now();
    timerId = setInterval(function () {
      var s = Math.floor((Date.now() - t0) / 1000);
      var el2 = $("#timer"); if (!el2) { clearInterval(timerId); return; }
      el2.textContent = "⏱ " + String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
    }, 1000);
  }

  function submitExam() {
    if (timerId) clearInterval(timerId);
    var r = EXAM.grade(examState.paper, examState.results);
    var html = '<div class="panel result"><h2>📊 成績單</h2>' +
      '<div class="cards">' +
      '<div class="card stat"><div class="big">' + r.raw + '</div><div>原始分 / ' + r.fullScore + '</div></div>' +
      '<div class="card stat"><div class="big">' + r.level + '</div><div>學測級分（滿 15）</div></div>' +
      '<div class="card stat"><div class="big">' + r.correct + '/' + r.total + '</div><div>答對題數</div></div>' +
      '</div>' +
      '<p class="bandnote"><b>' + r.band.name + '</b>：' + r.band.note + '</p>' +
      '<p class="muted">要拿滿級分（15 級），此卷原始分需約 ≥ ' + r.needForPerfect + ' 分。' +
      (r.level >= 15 ? ' 🎉 你已達滿級分標準！維持手感、別失誤。' : ' 加油，差 ' + Math.max(0, r.needForPerfect - r.raw) + ' 分。') + '</p>' +
      '<p class="muted">已將本卷每題對錯記入「個人分析」。</p>' +
      '<a class="qbtn" href="#analysis">看弱點分析與補強計畫 →</a> ' +
      '<a class="qbtn" href="#exam">再考一份 ↻</a>' +
      '</div>';
    var area = $("#examArea");
    area.appendChild(el(html));
    area.lastChild.scrollIntoView({ behavior: "smooth" });
    renderMath(area);
  }

  /* ============================================================
   * 整合考點：列表 + 單一考點詳情（含整合解題心法、陷阱、開練）
   * ============================================================ */
  function viewExamPoints(id) {
    if (id) { viewExamPointDetail(id); return; }
    var stats = ANALYTICS.examPointStats();
    var statMap = {}; stats.forEach(function (s) { statMap[s.id] = s; });

    var cards = (window.EXAMPOINTS || []).map(function (e) {
      var s = statMap[e.id] || { rate: null, attempts: 0 };
      var rate = s.rate === null ? "尚未練習" : Math.round(s.rate * 100) + "%（" + s.attempts + " 題）";
      var cls = s.rate === null ? "na" : (s.rate >= 0.9 ? "good" : (s.rate >= 0.6 ? "mid" : "bad"));
      var chips = e.chapters.map(function (cid) {
        var ch = CURRICULUM.chapterById(cid);
        return ch ? '<a class="eptag" href="#learn/' + cid + '">' + ch.title + '</a>' : '';
      }).join("");
      return '<section class="panel eppanel ' + cls + '">' +
        '<h2>' + e.name + ' <span class="freq">' + "★".repeat(e.freq) + '</span></h2>' +
        '<div class="muted">學測高頻 ' + e.freq + '★　|　你的精熟度：' + rate + '</div>' +
        '<p class="epinsight"><b>💡 整合觀念：</b>' + e.insight + '</p>' +
        '<div class="epchips">涵蓋章節：' + chips + '</div>' +
        '<a class="qbtn" href="#points/' + e.id + '">看整合心法 & 開始練 →</a>' +
        '</section>';
    }).join("");

    app.innerHTML = "";
    app.appendChild(el(
      '<div class="view"><h1>🎯 整合考點</h1>' +
      '<p class="muted">把分散各章的觀念整合成「一個會考的主題」，跨章串連、附整合解題心法與易錯陷阱。★ 越多代表學測越常考。</p>' +
      cards + '</div>'
    ));
    renderMath();
  }

  function viewExamPointDetail(id) {
    var e = window.EXAMPOINTS_API && EXAMPOINTS_API.byId(id);
    if (!e) { viewExamPoints(); return; }
    var s = ANALYTICS.examPointStats().filter(function (x) { return x.id === id; })[0] || { rate: null, attempts: 0 };
    var rate = s.rate === null ? "尚未練習" : Math.round(s.rate * 100) + "%（" + s.attempts + " 題）";

    var chips = e.chapters.map(function (cid) {
      var ch = CURRICULUM.chapterById(cid);
      return ch ? '<a class="eptag" href="#learn/' + cid + '">' + ch.title + '</a>' : '';
    }).join("");
    var traps = (e.traps || []).map(function (t) { return '<li>' + t + '</li>'; }).join("");

    app.innerHTML = "";
    app.appendChild(el(
      '<div class="view"><a class="back" href="#points">← 回考點列表</a>' +
      '<h1>🎯 ' + e.name + ' <span class="freq">' + "★".repeat(e.freq) + '</span></h1>' +
      '<div class="muted">學測高頻 ' + e.freq + '★　|　你的精熟度：' + rate + '</div>' +
      '<section class="panel five"><h2>💡 整合觀念</h2><p>' + e.insight + '</p></section>' +
      '<section class="panel trick"><h2>⚡ 整合解題心法（連招）</h2><p>' + e.combo + '</p></section>' +
      '<section class="panel"><h2>⚠️ 易錯陷阱</h2><ul class="concepts">' + traps + '</ul></section>' +
      '<section class="panel"><h2>📚 涵蓋章節</h2><div class="epchips">' + chips + '</div></section>' +
      '<section class="panel"><h2>✏️ 開始練（混合本考點題型）</h2>' +
      '<div id="eparea"></div>' +
      '<button id="epNew" class="qbtn">出新題 ↻</button>　' +
      '<a class="qbtn" href="#exam">用整合考點卷計時測 →</a></section>' +
      '</div>'
    ));

    function nextEpProblem() {
      var gens = EXAMPOINTS_API.gens(e);
      var area = $("#eparea");
      if (!gens.length) { area.innerHTML = '<div class="panel">此考點暫無參數化題庫。</div>'; return; }
      var key = gens[Math.floor(Math.random() * gens.length)];
      var item = window.GENERATORS[key]();
      // 記錄到「本考點第一章」以反映在精熟度
      var chId = e.chapters[0], ch = CURRICULUM.chapterById(chId);
      area.innerHTML = "";
      area.appendChild(el(
        '<div class="panel prob"><span class="badge gsat">' + e.name + '</span>' +
        '<div class="q">' + item.q + '</div>' +
        '<details><summary>看提示</summary><div class="hint">' + item.hint + '</div></details>' +
        '<details><summary>看完整詳解</summary><div class="sol">' + item.sol + '<div class="ans">✅ 答案：' + item.answer + '</div></div></details>' +
        '<div class="selfcheck">作答結果：<button class="ok">✅ 我答對</button><button class="ng">❌ 我答錯</button></div>' +
        '</div>'
      ));
      var sc = area.querySelector(".selfcheck");
      sc.querySelector(".ok").onclick = function () { ANALYTICS.record(chId, ch ? ch.title : e.name, true); flash(sc, "已記錄，下一題！"); setTimeout(nextEpProblem, 600); };
      sc.querySelector(".ng").onclick = function () { ANALYTICS.record(chId, ch ? ch.title : e.name, false); flash(sc, "回看上面的整合心法再來一次。"); };
      renderMath(area);
    }
    $("#epNew").onclick = nextEpProblem;
    nextEpProblem();
    renderMath();
  }

  /* ============================================================
   * 個人分析
   * ============================================================ */
  function viewAnalysis() {
    var stats = ANALYTICS.chapterStats();
    var plan = ANALYTICS.plan();
    var o = plan.overall;

    var rows = stats.map(function (s) {
      var rate = s.rate === null ? "—" : Math.round(s.rate * 100) + "%";
      var cls = s.rate === null ? "na" : (s.rate >= 0.9 ? "good" : (s.rate >= 0.6 ? "mid" : "bad"));
      var w = s.rate === null ? 0 : Math.round(s.rate * 100);
      return '<tr class="' + cls + '"><td><a href="#learn/' + s.id + '">' + s.title + '</a></td>' +
        '<td>' + s.attempts + '</td><td>' + rate + '</td>' +
        '<td><div class="minibar"><div style="width:' + w + '%"></div></div></td></tr>';
    }).join("");

    var stepsHtml = plan.steps.length
      ? plan.steps.map(function (s) { return '<li><b>#' + s.priority + ' ' + s.title + '</b><div class="muted">' + s.reason + '</div><a class="mini" href="#practice/' + s.chapterId + '">立即練此章 →</a></li>'; }).join("")
      : '<li class="muted">尚無資料，先去練習！</li>';

    // 整合考點精熟度
    var epStats = ANALYTICS.examPointStats();
    var epRows = epStats.map(function (s) {
      var rate = s.rate === null ? "—" : Math.round(s.rate * 100) + "%";
      var cls = s.rate === null ? "na" : (s.rate >= 0.9 ? "good" : (s.rate >= 0.6 ? "mid" : "bad"));
      var w = s.rate === null ? 0 : Math.round(s.rate * 100);
      return '<tr class="' + cls + '"><td><a href="#points/' + s.id + '">' + s.name + '</a> <span class="freq">' + "★".repeat(s.freq) + '</span></td>' +
        '<td>' + s.attempts + '</td><td>' + rate + '</td>' +
        '<td><div class="minibar"><div style="width:' + w + '%"></div></div></td></tr>';
    }).join("");
    var epPlan = ANALYTICS.examPointPlan();
    var epPlanHtml = epPlan.length
      ? epPlan.map(function (s) { return '<li><b>#' + s.priority + ' ' + s.name + '</b> <span class="freq">' + "★".repeat(s.freq) + '</span><div class="muted">' + s.reason + '</div><a class="mini" href="#points/' + s.id + '">看整合心法 →</a></li>'; }).join("")
      : '<li class="muted">尚無資料。</li>';

    app.innerHTML = "";
    app.appendChild(el(
      '<div class="view"><h1>📊 個人弱點分析</h1>' +
      '<div class="cards">' +
      '<div class="card stat"><div class="big">' + Math.round((o.overallRate || 0) * 100) + '%</div><div>整體正確率</div></div>' +
      '<div class="card stat"><div class="big">' + o.masteredChapters + '</div><div>秒殺級章節(≥90%)</div></div>' +
      '<div class="card stat"><div class="big">' + o.practicedChapters + '/' + o.totalChapters + '</div><div>已練章節</div></div>' +
      '</div>' +
      '<section class="panel"><h2>🎯 補強優先序（往滿級分）</h2><ol class="planlist">' + stepsHtml + '</ol></section>' +
      '<section class="panel"><h2>🎯 整合考點補強（高頻優先）</h2><ol class="planlist">' + epPlanHtml + '</ol></section>' +
      '<section class="panel"><h2>整合考點精熟度</h2>' +
      '<table class="statstable"><thead><tr><th>考點（★=高頻）</th><th>練習數</th><th>正確率</th><th>精熟度</th></tr></thead><tbody>' + epRows + '</tbody></table></section>' +
      '<section class="panel"><h2>各章精熟度</h2>' +
      '<table class="statstable"><thead><tr><th>章節</th><th>練習數</th><th>正確率</th><th>精熟度</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<p class="muted">綠=秒殺級(≥90%)・黃=尚可(60-89%)・紅=需補強(<60%)・灰=未練</p>' +
      '<button id="resetData" class="ghost">清除所有學習紀錄</button></section>' +
      '</div>'
    ));
    $("#resetData").onclick = function () {
      if (confirm("確定清除所有練習與成績紀錄？此動作無法復原。")) { ANALYTICS.reset(); viewAnalysis(); }
    };
    renderMath();
  }

  /* ============================================================
   * 設定（LLM 金鑰 + LLM 出題）
   * ============================================================ */
  function viewSettings() {
    var cfg = LLM.getCfg();
    app.innerHTML = "";
    app.appendChild(el(
      '<div class="view"><h1>⚙️ 設定</h1>' +
      '<section class="panel five"><h2>🤖 AI 出題狀態</h2>' +
      '<p id="proxyStatus" class="muted">偵測伺服器 AI 連線中…</p>' +
      '<p class="muted">本站可由伺服器直接連 Anthropic Claude（Opus 4.8），學生端免設定即可用。若站長尚未設定，可改用下方自帶金鑰。</p>' +
      '</section>' +
      '<section class="panel"><h2>引擎② 自帶金鑰（備援，選用）</h2>' +
      '<p class="muted">若伺服器 AI 未開啟，可貼自己的 API 金鑰直連。金鑰只存在本機瀏覽器，不會上傳到任何伺服器。</p>' +
      '<label>供應商：<select id="prov">' +
      '<option value="openai"' + (cfg.provider === "openai" ? " selected" : "") + '>OpenAI 相容</option>' +
      '<option value="anthropic"' + (cfg.provider === "anthropic" ? " selected" : "") + '>Anthropic</option>' +
      '</select></label>' +
      '<label>API 金鑰：<input id="key" type="password" value="' + (cfg.key || "") + '" placeholder="sk-..."></label>' +
      '<label>模型：<input id="model" type="text" value="' + (cfg.model || "") + '" placeholder="gpt-4o-mini / claude-haiku-4-5-20251001"></label>' +
      '<label>Base URL（OpenAI 相容可改）：<input id="base" type="text" value="' + (cfg.baseUrl || "") + '" placeholder="https://api.openai.com/v1"></label>' +
      '<button id="saveCfg" class="qbtn">儲存設定</button> <span id="cfgmsg" class="muted"></span>' +
      '</section>' +

      '<section class="panel"><h2>用 LLM 產生模擬題</h2>' +
      '<label>範圍主題（逗號分隔）：<input id="llmTopics" type="text" placeholder="對數, 三角函數, 平面向量"></label>' +
      '<label>風格：<select id="llmStyle"><option>學測</option><option>段考</option></select></label>' +
      '<label>題數：<input id="llmCount" type="number" value="3" min="1" max="10"></label>' +
      '<button id="llmGen" class="qbtn">產生題目</button>' +
      '<div id="llmArea"></div>' +
      '</section></div>'
    ));
    $("#saveCfg").onclick = function () {
      LLM.setCfg({ provider: $("#prov").value, key: $("#key").value.trim(), model: $("#model").value.trim(), baseUrl: $("#base").value.trim() });
      $("#cfgmsg").textContent = "已儲存 ✅";
    };
    // 偵測伺服器 AI 代理是否可用
    LLM.probeProxy().then(function (ok) {
      var s = $("#proxyStatus"); if (!s) return;
      s.innerHTML = ok
        ? '✅ <b>伺服器 AI 已連線</b>：可直接用 Claude Opus 4.8 出題，免任何設定。'
        : '⚠️ 伺服器 AI 未開啟（站長需在 Vercel 設定 <code>ANTHROPIC_API_KEY</code>）。可改用下方自帶金鑰，或用引擎①離線題庫。';
    });
    $("#llmGen").onclick = async function () {
      var area = $("#llmArea");
      var ready = LLM.isReady() || await LLM.probeProxy();
      if (!ready) { area.innerHTML = '<p class="bad">目前無 AI 出題來源：請站長在 Vercel 設定 ANTHROPIC_API_KEY，或在上方貼自己的金鑰。仍可用引擎①離線題庫練習。</p>'; return; }
      area.innerHTML = '<p class="muted">出題中…（呼叫 LLM）</p>';
      try {
        var topics = $("#llmTopics").value.split(/[,，]/).map(function (s) { return s.trim(); }).filter(Boolean);
        if (!topics.length) topics = ["數A 綜合"];
        var items = await LLM.generate({ topics: topics, count: parseInt($("#llmCount").value, 10) || 3, style: $("#llmStyle").value, difficulty: "中偏難" });
        area.innerHTML = '<div class="problems">' + items.map(function (p, i) {
          return '<div class="panel prob"><span class="badge gsat">' + (p.topic || "LLM") + '</span>' +
            '<div class="q">' + (i + 1) + '. ' + p.q + '</div>' +
            '<details><summary>看提示</summary><div class="hint">' + (p.hint || "") + '</div></details>' +
            '<details><summary>看詳解</summary><div class="sol">' + (p.sol || "") + '<div class="ans">✅ 答案：' + (p.answer || "") + '</div></div></details></div>';
        }).join("") + '</div>';
        renderMath(area);
      } catch (e) {
        area.innerHTML = '<p class="bad">出題失敗：' + e.message + '<br><span class="muted">提示：瀏覽器直連 API 可能遇到 CORS。OpenAI 相容端點通常可直連；若失敗請改用引擎①離線題庫。</span></p>';
      }
    };
  }

  /* ============================================================
   * 路由
   * ============================================================ */
  function router() {
    var h = location.hash.replace(/^#/, "") || "dashboard";
    var parts = h.split("/");
    var route = parts[0];
    setActive(route === "" ? "dashboard" : route);
    switch (route) {
      case "": case "dashboard": viewDashboard(); break;
      case "learn": parts[1] ? viewChapter(parts[1]) : viewLearnList(); break;
      case "practice": viewPractice(parts[1]); break;
      case "gsat": viewGSAT(); break;
      case "points": viewExamPoints(parts[1]); break;
      case "exam": viewExam(); break;
      case "analysis": viewAnalysis(); break;
      case "settings": viewSettings(); break;
      default: viewDashboard();
    }
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", router);
  window.addEventListener("DOMContentLoaded", router);
  if (document.readyState !== "loading") router();
})();
