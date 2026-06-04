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
    var sub = CURRICULUM.activeSubject() || {};
    // 啟動器磁磚（不把功能全列在頂部，改成首頁卡片網格）
    var tiles = [
      { href: "#learn", icon: "📖", t: "教學", d: "白話＋秒殺解法", c: "t-blue" },
      { href: "#practice", icon: "✏️", t: "無限練習", d: "參數化題庫", c: "t-red" },
      { href: "#gsat", icon: "🧠", t: "學測題", d: "歷屆風格題", c: "t-blue" },
      { href: "#points", icon: "🎯", t: "整合考點", d: "跨章高頻", c: "t-red" },
      { href: "#exam", icon: "📝", t: "模擬考", d: "學測／段考", c: "t-blue" },
      { href: "#vocab", icon: "📕", t: "背單字", d: "7000 高頻", c: "t-red" },
      { href: "#photo", icon: "📷", t: "拍照解題", d: "AI 看圖解", c: "t-blue" },
      { href: "#answerstats", icon: "📈", t: "答案統計", d: "近十年題號分析", c: "t-blue" },
      { href: "#analysis", icon: "📊", t: "弱點分析", d: "個人化補強", c: "t-red" }
    ];
    // 口語練習為英文專屬功能，僅在英文科目顯示
    if (sub.id === "english") {
      tiles.splice(7, 0, { href: "#speak", icon: "🎤", t: "口語練習", d: "範讀＋語音評分", c: "t-blue" });
    }
    var tileHtml = tiles.map(function (x) {
      return '<a class="tile ' + x.c + '" href="' + x.href + '">' +
        '<span class="tic">' + x.icon + '</span><span class="tit">' + x.t + '</span>' +
        '<span class="tid">' + x.d + '</span></a>';
    }).join("");

    app.appendChild(el(
      '<div class="view home">' +
      '<section class="hero homehero">' +
      '<div class="herorow">' +
      '<div><h1>個申就上</h1>' +
      '<p class="muted">目前科目 ' + ((window.DIAGRAMS && DIAGRAMS.hasSubjectIcon(sub.id)) ? DIAGRAMS.subjectIcon(sub.id) : (sub.icon || "")) + ' <b>' + (sub.name || "") + '</b>　·　目標：看到題目就秒殺</p></div>' +
      '<div class="herostat"><div class="hsbig">' + rate + '%</div><div class="muted">整體正確率</div></div>' +
      '</div>' +
      '<div class="progress"><div class="bar" style="width:' + pct + '%"></div></div>' +
      '<div class="herometa"><span>已達秒殺 ' + o.masteredChapters + '/' + o.totalChapters + ' 章</span>' +
      '<span>累計練習 ' + o.totalAttempts + ' 題</span></div>' +
      '</section>' +

      '<section class="tilegrid">' + tileHtml + '</section>' +

      '<section class="panel todaycard">' +
      '<h2>📌 今日補強優先序</h2>' +
      '<ol class="planlist">' + stepsHtml + '</ol>' +
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

    var subj = CURRICULUM.activeSubject && CURRICULUM.activeSubject();
    var guideLine = subj && subj.guide
      ? '<p class="muted">📘 考點範圍依據複習講義：<b>' + subj.guide + '</b>　整理學測高頻主題與易錯陷阱。</p>'
      : '';

    app.innerHTML = "";
    app.appendChild(el(
      '<div class="view"><h1>🎯 整合考點</h1>' +
      '<p class="muted">把分散各章的觀念整合成「一個會考的主題」，跨章串連、附整合解題心法與易錯陷阱。★ 越多代表學測越常考。</p>' +
      guideLine +
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
   * 學測答案統計：近十年各科選擇題答案的相同/相似題號分析
   * ============================================================ */
  function viewAnswerStats(subId) {
    if (!window.ANSWERSTATS || !window.EXAM_ANSWERS) {
      app.innerHTML = '<div class="view"><h1>📈 學測答案統計</h1><p class="muted">答案資料載入中…請重新整理。</p></div>';
      return;
    }
    var list = ANSWERSTATS.subjectList();
    if (!list.length) {
      app.innerHTML = '<div class="view"><h1>📈 學測答案統計</h1><p class="muted">尚無答案資料。</p></div>';
      return;
    }
    // 預設用目前選中的科目；若該科無資料則退回第一個有資料的科目
    var pick = subId || CURRICULUM.active;
    if (!list.filter(function (s) { return s.id === pick; }).length) pick = list[0].id;

    var data = ANSWERSTATS.analyze(pick);
    var meta = EXAM_ANSWERS.meta || {};

    var subOpts = list.map(function (s) {
      return '<option value="' + s.id + '"' + (s.id === pick ? ' selected' : '') + '>' + s.name + '（' + s.years + ' 年）' + (s.verified ? '' : ' ⚠未校正') + '</option>';
    }).join("");

    // 整卷選項偏好長條
    var maxOpt = Math.max.apply(null, data.optionRows.map(function (r) { return r.count; }).concat([1]));
    var optBars = data.optionRows.map(function (r) {
      return '<div class="boxrow"><span class="boxlab">選項 ' + r.opt + '</span>' +
        '<div class="minibar"><div style="width:' + Math.round(r.count / maxOpt * 100) + '%"></div></div>' +
        '<span class="boxnum">' + r.count + ' 次（' + Math.round(r.pct * 100) + '%）</span></div>';
    }).join("");
    var topOpt = data.optionRows[0];

    // 各題號穩定度表（各年答案＋眾數＋重複率＋最長連續）
    var qRows = data.perQuestion.map(function (q) {
      var pct = Math.round(q.repeatRate * 100);
      var cls = q.repeatRate >= 0.7 ? "good" : (q.repeatRate >= 0.5 ? "mid" : "na");
      var cells = data.years.map(function (yr) {
        var hit = q.seq.filter(function (s) { return s.year === yr; })[0];
        var a = hit ? hit.a : "—";
        var same = hit && q.mode && hit.a === q.mode;
        return '<span class="ascell' + (same ? ' amode' : '') + '">' + a + '</span>';
      }).join("");
      return '<tr class="' + cls + '"><td>第 ' + q.n + ' 題</td>' +
        '<td class="asrow">' + cells + '</td>' +
        '<td><b>' + (q.mode || '—') + '</b></td>' +
        '<td>' + pct + '%（' + q.modeCount + '/' + q.total + '）</td>' +
        '<td>' + q.streak + ' 年</td></tr>';
    }).join("");

    // 高重複題號（眾數占比高者）
    var hotTop = data.hot.filter(function (q) { return q.repeatRate >= 0.5; }).slice(0, 8);
    var hotHtml = hotTop.length
      ? hotTop.map(function (q) {
        return '<li><b>第 ' + q.n + ' 題</b>：常見答案 <b>' + q.mode + '</b>　' +
          Math.round(q.repeatRate * 100) + '% 年份相同（' + q.modeCount + '/' + q.total + '）・最長連續 ' + q.streak + ' 年</li>';
      }).join("")
      : '<li class="muted">近十年沒有明顯偏向特定答案的題號（分布平均）。</li>';

    // 相鄰年份相似度
    var pairRows = data.yearPairs.map(function (p) {
      var pct = Math.round(p.rate * 100);
      var cls = p.rate >= 0.5 ? "mid" : "na";
      return '<tr class="' + cls + '"><td>' + p.from + ' → ' + p.to + '</td>' +
        '<td>' + p.same + ' / ' + p.total + ' 題相同</td>' +
        '<td><div class="minibar"><div style="width:' + pct + '%"></div></div></td>' +
        '<td>' + pct + '%</td></tr>';
    }).join("");
    var avgPair = data.yearPairs.length
      ? Math.round(data.yearPairs.reduce(function (a, p) { return a + p.rate; }, 0) / data.yearPairs.length * 100)
      : 0;

    var warn = data.subject.verified
      ? ''
      : '<div class="panel warnbox"><b>⚠️ 此為示範／未校正資料</b><p class="muted">本科答案尚未逐題核對。正式參考前，請以<b>大考中心官方公布之參考答案</b>為準，' +
        '並更新 <code>data/exam_answers.js</code> 後將該科 <code>verified</code> 設為 true。' + (data.subject.note ? '<br>' + data.subject.note : '') + '</p></div>';

    app.innerHTML = "";
    app.appendChild(el(
      '<div class="view"><h1>📈 學測答案統計</h1>' +
      '<p class="muted">分析近十年各科學測「選擇題」答案，找出每個題號跨年的答案分布、最常見答案、' +
      '相同/相似的題號，以及整卷選項偏好，做為複習與作答策略的<b>參考</b>。</p>' +
      '<p class="muted">資料範圍：' + (meta.yearsLabel || '') + '　·　來源：' + (meta.source || '') + '</p>' +

      '<div class="ctrl"><label>選科目：<select id="asSel">' + subOpts + '</select></label></div>' +
      warn +

      '<div class="cards">' +
      '<div class="card stat"><div class="big">' + data.totalYears + '</div><div>收錄年數</div></div>' +
      '<div class="card stat"><div class="big">' + data.maxQ + '</div><div>分析題數</div></div>' +
      '<div class="card stat"><div class="big">' + (topOpt ? topOpt.opt : '—') + '</div><div>最常見選項（' + (topOpt ? Math.round(topOpt.pct * 100) : 0) + '%）</div></div>' +
      '<div class="card stat"><div class="big">' + avgPair + '%</div><div>相鄰年份平均相同率</div></div>' +
      '</div>' +

      '<section class="panel"><h2>🔥 高重複題號（最常出現同一答案）</h2>' +
      '<p class="muted">眾數占比高＝該題號近十年常落在同一個選項；可作為「沒把握時的參考傾向」，但仍以解題為主。</p>' +
      '<ul class="planlist">' + hotHtml + '</ul></section>' +

      '<section class="panel"><h2>📊 整卷選項偏好</h2>' +
      '<div class="boxbars">' + optBars + '</div>' +
      '<p class="muted">各選項在近十年所有題目中出現的次數與比例。理論上應接近平均，偏高者代表命題習慣或本示範資料的偏差。</p></section>' +

      '<section class="panel"><h2>🧮 各題號穩定度</h2>' +
      '<div class="tablewrap"><table class="statstable astable"><thead><tr><th>題號</th>' +
      '<th>各年答案（' + data.years.join(' / ') + '）</th><th>眾數</th><th>重複率</th><th>最長連續</th></tr></thead>' +
      '<tbody>' + qRows + '</tbody></table></div>' +
      '<p class="muted">綠=重複率≥70%・黃=50~69%・灰=分布平均。表中<b>粗體底色</b>格代表該年答案＝眾數。</p></section>' +

      '<section class="panel"><h2>🔁 相鄰年份相似度</h2>' +
      '<p class="muted">兩相鄰年份「同一題號答案相同」的數量與比例，反映年度之間答案分布的相似程度。</p>' +
      '<table class="statstable"><thead><tr><th>年份</th><th>相同題數</th><th>相似度</th><th>比例</th></tr></thead>' +
      '<tbody>' + pairRows + '</tbody></table></section>' +

      '<section class="panel five"><h2>📌 怎麼用這份統計</h2>' +
      '<ul class="concepts">' +
      '<li><b>把它當參考、不是答案：</b>學測每年重新命題，過去的分布<u>不保證</u>未來；務必以理解與解題為主。</li>' +
      '<li><b>檢查作答平衡：</b>若你整份考卷某個選項猜得特別多，對照「整卷選項偏好」可發現異常、回頭檢查。</li>' +
      '<li><b>沒把握時的微小傾向：</b>真的完全不會、要猜時，可參考該題號的常見答案與整卷最常見選項。</li>' +
      '<li><b>更新資料：</b>把官方答案填入 <code>data/exam_answers.js</code> 並設 <code>verified=true</code>，統計就會即時更新。</li>' +
      '</ul></section>' +
      '</div>'
    ));
    $("#asSel").onchange = function () { go("answerstats/" + this.value); };
    renderMath();
  }

  /* ============================================================
   * 背單字：7000 高頻字庫 + SRS 間隔重複（主動回憶，背到記住）
   * ============================================================ */
  function vocabReady() { return window.VOCAB && window.VOCAB_SRS; }

  function viewVocab(mode) {
    if (!vocabReady()) { app.innerHTML = '<div class="view"><h1>📕 背單字</h1><p class="muted">單字庫載入中…請重新整理。</p></div>'; return; }
    if (mode === "study") { vocabStudy(); return; }
    if (mode === "wrong") { vocabStudy(true); return; }
    // 首頁：今日任務 + 統計 + 入口
    var s = VOCAB_SRS.stats(window.VOCAB);
    var q = VOCAB_SRS.todayQueue(window.VOCAB, vocabOpts());
    var pct = Math.round(s.learned / s.total * 100);
    var masterPct = Math.round(s.mastered / s.total * 100);
    app.innerHTML = "";
    app.appendChild(el(
      '<div class="view"><h1>📕 背單字（學測高頻 7000）</h1>' +
      '<p class="muted">用「間隔重複」逼進長期記憶：答對拉長複習間隔、答錯隔天再轟炸，背到記住為止。</p>' +

      '<section class="hero"><h2>📌 今日任務</h2>' +
      '<p class="muted">到期複習 <b>' + Math.min(q.dueCount, (vocabOpts().reviewCap)) + '</b> 字　＋　新學 <b>' +
      Math.min(q.newCount, vocabOpts().newPerDay) + '</b> 字　|　今日已背 ' + s.todayDone + ' 字　🔥 連續 ' + s.streak + ' 天</p>' +
      '<a class="qbtn big" href="#vocab/study">▶ 開始今日背誦（' + q.queue.length + ' 字）</a></section>' +

      '<section class="panel"><h2>🎤 口語練習</h2>' +
      '<p class="muted">用真人語音範讀＋手機語音辨識評分，跟著念出日常會話與學測句型，練發音與口說流利度。</p>' +
      '<a class="qbtn" href="#speak">▶ 開始口語練習</a></section>' +

      '<div class="cards">' +
      '<div class="card stat"><div class="big">' + s.learned + '</div><div>已學單字</div></div>' +
      '<div class="card stat"><div class="big">' + s.mastered + '</div><div>已精熟(≥7天)</div></div>' +
      '<div class="card stat"><div class="big">' + s.total + '</div><div>字庫總量</div></div>' +
      '</div>' +
      '<div class="progress"><div class="bar" style="width:' + pct + '%"></div></div>' +
      '<p class="muted">學習進度 ' + pct + '%　|　精熟率 ' + masterPct + '%</p>' +

      '<section class="panel"><h2>📊 熟練度分布（萊特納 5 盒）</h2>' +
      vocabBoxBars(s.boxes) +
      '<p class="muted">盒子越右＝記得越牢、複習間隔越長（box4 = 30 天才再考一次）</p></section>' +

      '<section class="panel"><h2>🔧 設定每日量</h2>' +
      '<label>每天新學：<select id="vNew">' + [10, 15, 20, 30, 50].map(function (n) { return '<option' + (vocabOpts().newPerDay === n ? ' selected' : '') + '>' + n + '</option>'; }).join("") + '</select> 字</label>' +
      '<label>每天複習上限：<select id="vRev">' + [40, 60, 80, 120].map(function (n) { return '<option' + (vocabOpts().reviewCap === n ? ' selected' : '') + '>' + n + '</option>'; }).join("") + '</select> 字</label>' +
      '<button id="vSave" class="qbtn">儲存</button> <span id="vMsg" class="muted"></span></section>' +

      '<section class="panel"><h2>📕 錯詞本</h2>' +
      (s.wrongList.length
        ? '<p class="muted">最常錯的 ' + Math.min(s.wrongList.length, 20) + ' 字，集中加強：</p>' +
        '<a class="qbtn" href="#vocab/wrong">▶ 只練錯詞（' + s.wrongList.length + ' 字）</a>' +
        '<ul class="wrongwords">' + s.wrongList.slice(0, 20).map(function (w) { return '<li><b>' + w.w + '</b> <span class="muted">' + w.pos + ' ' + w.zh + '</span> <span class="wcount">錯 ' + w.wrong + ' 次</span></li>'; }).join("") + '</ul>'
        : '<p class="muted">還沒有錯詞，繼續保持！</p>') +
      '</section>' +

      '<section class="panel"><button id="vReset" class="ghost">清除背單字進度</button></section>' +
      '</div>'
    ));
    $("#vSave").onclick = function () {
      var o = vocabOpts(); o.newPerDay = parseInt($("#vNew").value, 10); o.reviewCap = parseInt($("#vRev").value, 10);
      localStorage.setItem("vocab_opts", JSON.stringify(o)); $("#vMsg").textContent = "已儲存 ✅"; setTimeout(function () { viewVocab(); }, 500);
    };
    $("#vReset").onclick = function () { if (confirm("確定清除所有背單字進度？")) { VOCAB_SRS.reset(); viewVocab(); } };
    renderMath();
  }

  function vocabOpts() {
    try { var o = JSON.parse(localStorage.getItem("vocab_opts")); if (o) return o; } catch (e) { }
    return { newPerDay: 15, reviewCap: 60 };
  }
  function vocabBoxBars(boxes) {
    var labels = ["新(box0)", "剛學(1天)", "熟悉(3天)", "熟練(7天)", "精熟(30天)"];
    var max = Math.max.apply(null, boxes.concat([1]));
    return '<div class="boxbars">' + boxes.map(function (n, i) {
      return '<div class="boxrow"><span class="boxlab">' + labels[i] + '</span>' +
        '<div class="minibar"><div style="width:' + Math.round(n / max * 100) + '%"></div></div><span class="boxnum">' + n + '</span></div>';
    }).join("") + '</div>';
  }

  /* 背誦模式：主動回憶（看中文＋詞性，輸入英文） */
  var vocabState = null;
  function vocabStudy(wrongOnly) {
    var pool;
    if (wrongOnly) {
      var s = VOCAB_SRS.stats(window.VOCAB);
      pool = s.wrongList.slice();
      if (!pool.length) { location.hash = "#vocab"; return; }
    } else {
      pool = VOCAB_SRS.todayQueue(window.VOCAB, vocabOpts()).queue;
      if (!pool.length) {
        app.innerHTML = '<div class="view"><h1>📕 背單字</h1><section class="panel"><h2>🎉 今日任務完成！</h2><p>到期的字都複習完了，明天再來保持手感。</p><a class="qbtn" href="#vocab">← 回背單字首頁</a></section></div>';
        return;
      }
    }
    vocabState = { pool: pool, i: 0, correct: 0, wrong: 0, wrongOnly: !!wrongOnly };
    nextVocab();
  }

  function nextVocab() {
    var st = vocabState;
    if (st.i >= st.pool.length) {
      app.innerHTML = "";
      app.appendChild(el('<div class="view"><h1>📕 背單字</h1>' +
        '<section class="panel result"><h2>✅ 完成這輪 ' + st.pool.length + ' 字</h2>' +
        '<div class="cards"><div class="card stat"><div class="big">' + st.correct + '</div><div>答對</div></div>' +
        '<div class="card stat"><div class="big">' + st.wrong + '</div><div>答錯(已排入加強)</div></div></div>' +
        '<p class="muted">答錯的字今天會再出現，直到記住為止。</p>' +
        '<a class="qbtn" href="#vocab/study">再背一輪 ↻</a> <a class="qbtn" href="#vocab">回首頁</a></section></div>'));
      return;
    }
    var item = st.pool[st.i];
    app.innerHTML = "";
    app.appendChild(el(
      '<div class="view"><a class="back" href="#vocab">← 結束</a>' +
      '<div class="muted">第 ' + (st.i + 1) + ' / ' + st.pool.length + ' 字　|　✅ ' + st.correct + '　❌ ' + st.wrong + '</div>' +
      '<section class="panel vocabcard">' +
      '<div class="vzh">' + item.zh + '</div>' +
      '<div class="vpos">' + item.pos + (item.lv ? '　Lv.' + item.lv : '') + '</div>' +
      '<input id="vIn" class="vinput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="輸入英文拼字…">' +
      '<div class="vbtns"><button id="vCheck" class="qbtn">送出</button>' +
      '<button id="vHint" class="ghost">💡 提示</button>' +
      '<button id="vSkip" class="ghost">略過(算錯)</button></div>' +
      '<div id="vFeedback"></div>' +
      '</section></div>'
    ));
    var input = $("#vIn"); input.focus();
    var done = false;
    function grade(forceWrong) {
      if (done) return; done = true;
      var ans = (input.value || "").trim().toLowerCase();
      var correct = !forceWrong && ans === item.w.toLowerCase();
      VOCAB_SRS.answer(item.w, correct);
      if (correct) st.correct++; else st.wrong++;
      var fb = $("#vFeedback");
      fb.innerHTML =
        (correct ? '<div class="vok">✅ 答對！</div>' : '<div class="vng">❌ 正解：<b>' + item.w + '</b></div>') +
        '<div class="vex"><b>' + item.w + '</b> ' + item.pos + ' ' + item.zh + '</div>' +
        '<div class="vex muted">📝 ' + item.ex + '<br>' + item.exZh + '</div>' +
        '<button id="vNext" class="qbtn big">下一個 →</button>';
      input.disabled = true;
      $("#vCheck").disabled = true;
      var nb = $("#vNext"); nb.focus();
      nb.onclick = function () { st.i++; nextVocab(); };
    }
    $("#vCheck").onclick = function () { grade(false); };
    $("#vSkip").onclick = function () { grade(true); };
    $("#vHint").onclick = function () {
      input.value = item.w.slice(0, Math.max(2, Math.ceil(item.w.length / 3)));
      input.focus();
    };
    input.onkeydown = function (e) { if (e.key === "Enter") { if (done) { st.i++; nextVocab(); } else grade(false); } };
  }

  /* ============================================================
   * 口語練習（英文）：TTS 範讀 + 瀏覽器語音辨識評分（離線可用）
   * ============================================================ */
  var SpeakState = { list: [], i: 0, cat: "全部", recog: null, listening: false };

  function speakStats() {
    try { return JSON.parse(localStorage.getItem("speak_stats") || "{}"); } catch (e) { return {}; }
  }
  function saveSpeakStats(s) { try { localStorage.setItem("speak_stats", JSON.stringify(s)); } catch (e) { } }
  function speakNorm(s) { return (s || "").toLowerCase().replace(/[^a-z0-9'\s]/g, " ").replace(/\s+/g, " ").trim(); }
  function speakEsc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function speakTTS(text, rate) {
    if (!("speechSynthesis" in window)) return false;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US"; u.rate = rate || 0.95; u.pitch = 1;
      var vs = window.speechSynthesis.getVoices() || [];
      var v = vs.filter(function (x) { return /en[-_]US/i.test(x.lang); })[0] || vs.filter(function (x) { return /^en/i.test(x.lang); })[0];
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  }
  // 把使用者說的句子和目標句逐字比對，回傳分數與上色 HTML
  function speakScore(targetEn, said) {
    var targTokens = targetEn.split(/\s+/);
    var pool = speakNorm(said).split(" ").filter(Boolean);
    var matched = 0, denom = 0;
    var html = targTokens.map(function (tok) {
      var n = speakNorm(tok);
      if (!n) return speakEsc(tok);
      denom++;
      var idx = pool.indexOf(n);
      var ok = idx >= 0;
      if (ok) { pool.splice(idx, 1); matched++; }
      return '<span class="' + (ok ? "wmatch" : "wmiss") + '">' + speakEsc(tok) + "</span>";
    }).join(" ");
    return { score: denom ? Math.round(matched / denom * 100) : 0, html: html };
  }

  function viewSpeak() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var hasSTT = !!SR, hasTTS = ("speechSynthesis" in window);
    var all = window.SPEAKING || [];
    var cats = ["全部"].concat(all.map(function (x) { return x.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
    if (SpeakState.cat !== "全部" && cats.indexOf(SpeakState.cat) < 0) SpeakState.cat = "全部";
    SpeakState.list = SpeakState.cat === "全部" ? all.slice() : all.filter(function (x) { return x.cat === SpeakState.cat; });
    if (SpeakState.i >= SpeakState.list.length) SpeakState.i = 0;

    var st = speakStats();
    var avg = st.count ? Math.round(st.sum / st.count) : null;
    var catOpts = cats.map(function (c) { return '<option value="' + c + '"' + (c === SpeakState.cat ? " selected" : "") + '>' + c + "</option>"; }).join("");
    var support = hasSTT
      ? '<p class="muted">🎤 跟著範讀念出句子，按「開始說」由語音辨識評分。建議在安靜環境、允許麥克風權限。</p>'
      : '<p class="bad">⚠️ 這個瀏覽器或環境不支援語音辨識（建議用手機／電腦版 Chrome，且需在 https 網站）。仍可使用 🔊 範讀＋自我跟讀，並用下方「我念對了／要再練」記錄進度。</p>';

    app.innerHTML = "";
    app.appendChild(el(
      '<div class="view"><a class="back" href="#vocab">← 回背單字</a>' +
      '<h1>🎤 英文口語練習</h1>' + support +
      '<div class="ctrl"><label style="margin:0">主題：</label><select id="spkCat">' + catOpts + "</select>" +
      '<span class="muted mini">' + (avg === null ? "尚未練習" : "平均分 " + avg + "　·　已練 " + st.count + " 句") + "</span></div>" +
      '<section class="panel vocabcard speakcard">' +
      '<div class="vpos" id="spkCatTag"></div>' +
      '<div class="speaken" id="spkEn"></div>' +
      '<div class="vzh" id="spkZh"></div>' +
      '<div class="speaktip muted" id="spkTip"></div>' +
      '<div class="vbtns">' +
      (hasTTS ? '<button class="qbtn" id="spkPlay">🔊 範讀</button><button class="ghost" id="spkSlow">🐢 慢速</button>' : "") +
      (hasSTT ? '<button class="qbtn" id="spkRec">🎤 開始說</button>' : "") +
      '</div>' +
      '<div id="spkResult"></div>' +
      (hasSTT ? "" : '<div class="selfcheck">自我評估：<button id="spkSelfOk">✅ 我念對了</button><button id="spkSelfNg">🔁 要再練</button></div>') +
      '<div class="vbtns"><button class="ghost" id="spkPrev">← 上一句</button><button class="qbtn" id="spkNext">下一句 →</button></div>' +
      '</section></div>'
    ));

    function render() {
      var it = SpeakState.list[SpeakState.i];
      if (!it) { $("#spkEn").textContent = "（此主題暫無句子）"; return; }
      $("#spkCatTag").innerHTML = '<span class="badge">' + it.cat + "</span>　第 " + (SpeakState.i + 1) + " / " + SpeakState.list.length + " 句";
      $("#spkEn").textContent = it.en;
      $("#spkZh").textContent = it.zh;
      $("#spkTip").textContent = it.tip ? "💡 " + it.tip : "";
      $("#spkResult").innerHTML = "";
    }
    function recordScore(score) {
      var s = speakStats(); s.count = (s.count || 0) + 1; s.sum = (s.sum || 0) + score;
      if (score > (s.best || 0)) s.best = score; saveSpeakStats(s);
    }
    function stopRec() {
      SpeakState.listening = false;
      if (SpeakState.recog) { try { SpeakState.recog.stop(); } catch (e) { } }
      var b = $("#spkRec"); if (b) { b.textContent = "🎤 開始說"; b.classList.remove("rec-on"); }
    }

    $("#spkCat").onchange = function () { SpeakState.cat = this.value; SpeakState.i = 0; stopRec(); viewSpeak(); };
    $("#spkNext").onclick = function () { stopRec(); SpeakState.i = (SpeakState.i + 1) % SpeakState.list.length; render(); };
    $("#spkPrev").onclick = function () { stopRec(); SpeakState.i = (SpeakState.i - 1 + SpeakState.list.length) % SpeakState.list.length; render(); };
    if ($("#spkPlay")) $("#spkPlay").onclick = function () { speakTTS(SpeakState.list[SpeakState.i].en, 0.95); };
    if ($("#spkSlow")) $("#spkSlow").onclick = function () { speakTTS(SpeakState.list[SpeakState.i].en, 0.6); };
    if ($("#spkSelfOk")) $("#spkSelfOk").onclick = function () { recordScore(100); $("#spkResult").innerHTML = '<div class="sol">已記錄一次成功跟讀 👍</div>'; };
    if ($("#spkSelfNg")) $("#spkSelfNg").onclick = function () { recordScore(50); $("#spkResult").innerHTML = '<div class="hint">已記錄，多聽幾次範讀再念一次！</div>'; };

    if (hasSTT && $("#spkRec")) {
      $("#spkRec").onclick = function () {
        if (SpeakState.listening) { stopRec(); return; }
        var it = SpeakState.list[SpeakState.i];
        var rec = new SR(); SpeakState.recog = rec;
        rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 3;
        SpeakState.listening = true;
        this.textContent = "● 聆聽中…（再按停止）"; this.classList.add("rec-on");
        $("#spkResult").innerHTML = '<div class="muted mini">請開始說…</div>';
        rec.onresult = function (ev) {
          var best = null, bestScore = -1, heard = "";
          for (var i = 0; i < ev.results[0].length; i++) {
            var alt = ev.results[0][i].transcript;
            var r = speakScore(it.en, alt);
            if (r.score > bestScore) { bestScore = r.score; best = r; heard = alt; }
          }
          recordScore(bestScore);
          var msg = bestScore >= 85 ? "🌟 很棒！幾乎完全正確" : (bestScore >= 60 ? "👍 不錯，再把紅字的地方加強" : "💪 再聽一次範讀，放慢念清楚");
          $("#spkResult").innerHTML =
            '<div class="panel speakscore"><div class="vok">得分 ' + bestScore + ' 分</div>' +
            '<div class="speakcompare">' + best.html + "</div>" +
            '<div class="muted mini">你說的：' + speakEsc(heard) + "</div>" +
            '<div class="speakmsg">' + msg + "</div></div>";
        };
        rec.onerror = function (ev) {
          $("#spkResult").innerHTML = '<div class="hint">語音辨識失敗（' + (ev.error || "未知") + "）。請確認已允許麥克風權限，並在安靜環境再試一次。</div>";
          stopRec();
        };
        rec.onend = function () { stopRec(); };
        try { rec.start(); } catch (e) { stopRec(); }
      };
    }

    // 預載語音清單（部分瀏覽器需先觸發）
    if (hasTTS && window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = function () { };
    }
    render();
  }

  /* ============================================================
   * 拍照解題：拍/上傳題目照片 → 視覺 AI 給秒殺解法
   * ============================================================ */
  function viewPhoto() {
    app.innerHTML = "";
    app.appendChild(el(
      '<div class="view"><h1>📷 拍照解題</h1>' +
      '<p class="muted">拍下或上傳一張數學題照片，AI 會讀題並給「最快解法」步驟。圖片只送到出題用的 AI，不會公開儲存。</p>' +
      '<section class="panel">' +
      '<div class="photobtns">' +
      '<label class="qbtn">📸 拍照<input id="camIn" type="file" accept="image/*" capture="environment" hidden></label> ' +
      '<label class="qbtn">🖼️ 從相簿選<input id="fileIn" type="file" accept="image/*" hidden></label>' +
      '</div>' +
      '<div id="photoPreview"></div>' +
      '<button id="solveBtn" class="qbtn big" style="display:none">🧠 開始解題</button>' +
      '<p id="photoStatus" class="muted"></p>' +
      '<div id="photoResult"></div>' +
      '</section></div>'
    ));

    var dataUrl = null;
    function onPick(input) {
      var f = input.files && input.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        // 壓縮到最長邊 1280，省流量也加速
        compressImage(reader.result, 1280, function (out) {
          dataUrl = out;
          $("#photoPreview").innerHTML = '<img class="photoimg" src="' + out + '" alt="題目照片">';
          $("#solveBtn").style.display = "block";
          $("#photoResult").innerHTML = "";
          $("#photoStatus").textContent = "";
        });
      };
      reader.readAsDataURL(f);
    }
    $("#camIn").onchange = function () { onPick(this); };
    $("#fileIn").onchange = function () { onPick(this); };

    $("#solveBtn").onclick = async function () {
      if (!dataUrl) return;
      var status = $("#photoStatus"), result = $("#photoResult");
      // 確認視覺來源可用
      await LLM.probeProxy();
      if (!LLM.photoReady()) {
        result.innerHTML = '<p class="bad">拍照解題需要「看得懂圖」的 AI：請站長在 Vercel 設 ANTHROPIC_API_KEY，或到「設定」貼上 Anthropic／OpenAI(gpt-4o) 金鑰。<br><span class="muted">（Ollama 多數模型不支援看圖，故此功能不適用）</span></p>';
        return;
      }
      status.textContent = "AI 讀題解題中…（首次可能較久）";
      this.disabled = true;
      try {
        var text = await LLM.solvePhoto(dataUrl);
        result.innerHTML = '<div class="panel sol photosol">' + mdToHtml(text) + '</div>';
        renderMath(result);
        status.textContent = "";
      } catch (e) {
        result.innerHTML = '<p class="bad">解題失敗：' + e.message + '</p>';
        status.textContent = "";
      }
      this.disabled = false;
    };
  }

  // 簡易壓縮：把 dataURL 縮到最長邊 maxEdge 的 JPEG
  function compressImage(dataUrl, maxEdge, cb) {
    var img = new Image();
    img.onload = function () {
      var w = img.width, h = img.height, scale = Math.min(1, maxEdge / Math.max(w, h));
      var cw = Math.round(w * scale), ch = Math.round(h * scale);
      var c = document.createElement("canvas"); c.width = cw; c.height = ch;
      c.getContext("2d").drawImage(img, 0, 0, cw, ch);
      try { cb(c.toDataURL("image/jpeg", 0.85)); } catch (e) { cb(dataUrl); }
    };
    img.onerror = function () { cb(dataUrl); };
    img.src = dataUrl;
  }

  // 極簡 Markdown → HTML（標題/粗體/換行/清單），數學式交給 KaTeX
  function mdToHtml(md) {
    var esc = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    esc = esc.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    var lines = esc.split(/\n/).map(function (ln) {
      if (/^\s*[-*]\s+/.test(ln)) return "<li>" + ln.replace(/^\s*[-*]\s+/, "") + "</li>";
      if (/^\s*#{1,3}\s+/.test(ln)) return "<h3>" + ln.replace(/^\s*#{1,3}\s+/, "") + "</h3>";
      return ln.trim() ? "<p>" + ln + "</p>" : "";
    });
    return lines.join("").replace(/(<li>.*?<\/li>)+/g, function (m) { return "<ul>" + m + "</ul>"; });
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
      '<section class="panel"><h2>引擎② 自帶來源（選用）</h2>' +
      '<p class="muted">可選 <b>Ollama</b>（本機免費、免金鑰）或貼自己的 API 金鑰。設定只存在本機瀏覽器，不會上傳。</p>' +
      '<label>供應商：<select id="prov">' +
      '<option value="ollama"' + (cfg.provider === "ollama" ? " selected" : "") + '>Ollama（本機免費・免金鑰）</option>' +
      '<option value="openai"' + (cfg.provider === "openai" ? " selected" : "") + '>OpenAI 相容</option>' +
      '<option value="anthropic"' + (cfg.provider === "anthropic" ? " selected" : "") + '>Anthropic</option>' +
      '</select></label>' +
      '<label>API 金鑰（Ollama 免填）：<input id="key" type="password" value="' + (cfg.key || "") + '" placeholder="Ollama 不需要；其他填 sk-..."></label>' +
      '<label>模型：<input id="model" type="text" value="' + (cfg.model || "") + '" placeholder="llama3.1 / qwen2.5 / gpt-4o-mini"></label>' +
      '<label>Base URL：<input id="base" type="text" value="' + (cfg.baseUrl || "") + '" placeholder="Ollama 預設 http://localhost:11434/v1"></label>' +
      '<button id="saveCfg" class="qbtn">儲存設定</button> <span id="cfgmsg" class="muted"></span>' +
      '<details style="margin-top:.6rem"><summary>📘 用 Ollama 的步驟（免費、免金鑰）</summary>' +
      '<div class="hint">' +
      '1. 到 <b>ollama.com</b> 下載安裝（Windows/Mac/Linux）。<br>' +
      '2. 開終端機下載模型：<code>ollama pull llama3.1</code>（或 <code>qwen2.5</code>，中文數學建議 qwen2.5）。<br>' +
      '3. 讓網站連得到本機 Ollama：啟動時設環境變數 <code>OLLAMA_ORIGINS=*</code>（開啟跨來源）。<br>' +
      '&nbsp;&nbsp;・Mac/Linux：<code>OLLAMA_ORIGINS=* ollama serve</code><br>' +
      '&nbsp;&nbsp;・Windows：系統環境變數加 <code>OLLAMA_ORIGINS=*</code> 後重啟 Ollama。<br>' +
      '4. 上面供應商選 <b>Ollama</b>、模型填你下載的（如 <code>llama3.1</code>）→ 儲存 → 下方產生題目。<br>' +
      '⚠️ 只有「你這台有跑 Ollama 的電腦」連得到；手機需另接內網穿透。' +
      '</div></details>' +
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
      case "answerstats": viewAnswerStats(parts[1]); break;
      case "photo": viewPhoto(); break;
      case "vocab": viewVocab(parts[1]); break;
      case "speak": viewSpeak(); break;
      case "settings": viewSettings(); break;
      default: viewDashboard();
    }
    if (typeof highlightTab === "function") highlightTab();
    window.scrollTo(0, 0);
  }

  /* ============================================================
   * 科目切換器：注入頂列，切換時同步 EXAMPOINTS 並重繪
   * ============================================================ */
  function mountSubjectSwitcher() {
    if (!window.CURRICULUM || !CURRICULUM.subjectList) return;
    var bar = document.getElementById("subjectBar");
    if (!bar) {
      var header = document.querySelector(".topbar");
      bar = el('<div id="subjectBar" class="subjectbar"></div>');
      if (header && header.parentNode) header.parentNode.insertBefore(bar, header.nextSibling);
    }
    var list = CURRICULUM.subjectList();
    bar.innerHTML = '<span class="sublabel">科目：</span>' + list.map(function (s) {
      var ic = (window.DIAGRAMS && DIAGRAMS.hasSubjectIcon(s.id)) ? DIAGRAMS.subjectIcon(s.id) : s.icon;
      return '<button class="subbtn' + (s.id === CURRICULUM.active ? ' on' : '') + '" data-sid="' + s.id + '">' +
        ic + '<span class="subname">' + s.name + '</span></button>';
    }).join("");
    $all(".subbtn", bar).forEach(function (b) {
      b.onclick = function () {
        CURRICULUM.setActive(b.dataset.sid);
        // 重設考點探測等，重繪當前頁
        mountSubjectSwitcher();
        router();
      };
    });
  }

  /* ============================================================
   * 底部分頁列（5 主要入口）：避免把所有功能列在頂部
   * ============================================================ */
  // 底部分頁線稿圖示：用 currentColor，隨分頁狀態變色（未選藍灰、選中正紅）
  function tabSvg(paths) {
    return '<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }
  var TABS = [
    { href: "#dashboard", icon: tabSvg('<path d="M4 11 L12 4 L20 11"/><path d="M6 10 V20 H18 V10"/>'), t: "首頁", match: ["", "dashboard"] },
    { href: "#learn", icon: tabSvg('<path d="M12 6 C9.5 4.3 6 4.2 4 5 V18 C6 17.2 9.5 17.3 12 19 C14.5 17.3 18 17.2 20 18 V5 C18 4.2 14.5 4.3 12 6 Z"/><path d="M12 6 V19"/>'), t: "教學", match: ["learn"] },
    { href: "#practice", icon: tabSvg('<path d="M5.5 18.5 L5 15 L15 5 L19 9 L9 19 L5.5 18.5 Z"/><path d="M13 7 L17 11"/>'), t: "練習", match: ["practice", "gsat", "points", "exam", "photo"] },
    { href: "#vocab", icon: tabSvg('<rect x="4" y="4.5" width="16" height="15" rx="2.2"/><path d="M9 15.5 L12 8.5 L15 15.5"/><path d="M10 13 H14"/>'), t: "單字", match: ["vocab"] },
    { href: "#analysis", icon: tabSvg('<path d="M4 20 H20"/><path d="M7 18 V12"/><path d="M12 18 V7"/><path d="M17 18 V14"/>'), t: "我的", match: ["analysis", "answerstats", "settings"] }
  ];
  function mountTabBar() {
    var bar = document.getElementById("tabbar");
    if (!bar) {
      bar = el('<nav id="tabbar" class="tabbar"></nav>');
      document.body.appendChild(bar);
    }
    bar.innerHTML = TABS.map(function (x, i) {
      return '<a class="tab" data-i="' + i + '" href="' + x.href + '">' +
        '<span class="tabic">' + x.icon + '</span><span class="tabt">' + x.t + '</span></a>';
    }).join("");
    highlightTab();
  }
  function highlightTab() {
    var route = (location.hash.replace(/^#/, "").split("/")[0]) || "dashboard";
    $all("#tabbar .tab").forEach(function (a) {
      var i = parseInt(a.dataset.i, 10);
      a.classList.toggle("on", TABS[i].match.indexOf(route) >= 0);
    });
  }

  function boot() {
    if (window.CURRICULUM && CURRICULUM.initActive) CURRICULUM.initActive();
    mountSubjectSwitcher();
    mountTabBar();
    router();
  }

  window.addEventListener("hashchange", router);
  window.addEventListener("DOMContentLoaded", boot);
  if (document.readyState !== "loading") boot();
})();
