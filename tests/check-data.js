/* 全域資料層自動檢查：語法外的資料完整性。CI 與本機皆可跑：node tests/check-data.js */
global.window = global;
var store = {};
global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = v; }, removeItem: k => { delete store[k]; } };
var path = require('path');
var APP = path.join(__dirname, '..', '數學', 'app');
[
  'data/curriculum.js', 'js/generator.js',
  'data/book1.js', 'data/book2.js', 'data/book3.js', 'data/book4.js', 'data/exampoints.js',
  'data/subj_chinese.js', 'data/subj_english.js', 'data/subj_physics.js',
  'data/subj_chemistry.js', 'data/subj_biology.js', 'data/subj_earth.js',
  'data/vocab.js', 'js/vocab_srs.js', 'js/diagrams.js', 'js/scoring.js', 'js/analytics.js', 'js/exam.js',
  'data/exam_answers.js', 'js/answerstats.js'
].forEach(f => require(path.join(APP, f)));
CURRICULUM.initActive();

var problems = [];
var chSeen = {}, epSeen = {};
CURRICULUM.subjects.forEach(function (s) {
  s.books.forEach(function (b) {
    b.chapters.forEach(function (c) {
      if (chSeen[c.id]) problems.push('重複章節 id: ' + c.id); chSeen[c.id] = 1;
      if (!c.title || !c.fiveYO || !c.concepts || !c.tricks || !c.problems || !c.problems.length) problems.push(s.id + '/' + c.id + ' 缺欄位');
      (c.generators || []).forEach(function (g) { if (!window.GENERATORS[g]) problems.push(s.id + '/' + c.id + ' 無 generator ' + g); });
      if (c.diagram && !DIAGRAMS.has(c.diagram)) problems.push(s.id + '/' + c.id + ' 無 diagram ' + c.diagram);
      (c.problems || []).forEach(function (p, i) { if (!p.q || !p.sol || p.answer === undefined || !p.hint) problems.push(s.id + '/' + c.id + ' 題#' + i + ' 缺欄位'); });
    });
  });
  s.exampoints.forEach(function (ep) {
    if (epSeen[ep.id]) problems.push('重複考點 id: ' + ep.id); epSeen[ep.id] = 1;
    if (!ep.name || !ep.chapters || !ep.insight || !ep.combo || !ep.traps) problems.push(s.id + '/' + ep.id + ' 考點缺欄位');
    ep.chapters.forEach(function (cid) { if (!CURRICULUM.chapterById(cid)) problems.push(s.id + '/' + ep.id + ' 考點章節不存在 ' + cid); });
  });
});
Object.keys(window.GENERATORS).forEach(function (k) {
  try { for (var i = 0; i < 80; i++) { var o = window.GENERATORS[k](); if (!o.q || !o.sol || o.answer === undefined || !o.hint || /undefined|NaN|\[object/.test(o.q + o.sol + o.answer)) { problems.push('generator ' + k + ' 產出異常'); break; } } }
  catch (e) { problems.push('generator ' + k + ' 例外: ' + e.message); }
});
CURRICULUM.subjects.forEach(function (s) {
  CURRICULUM.setActive(s.id);
  if (EXAM.buildGSAT(8).items.length < 1) problems.push(s.id + ' 學測卷組卷失敗');
  if (s.exampoints.length && EXAM.buildExamPoint(s.exampoints[0], 6).items.length < 1) problems.push(s.id + ' 整合考點卷失敗');
});
if (!window.VOCAB || window.VOCAB.length < 600) problems.push('vocab 數量異常');

// 學測答案統計：資料源與分析引擎健檢
if (!window.EXAM_ANSWERS || !Array.isArray(window.EXAM_ANSWERS.subjects) || !window.EXAM_ANSWERS.subjects.length) {
  problems.push('EXAM_ANSWERS 資料缺失');
} else {
  var validOpt = /^[A-E]$/;
  window.EXAM_ANSWERS.subjects.forEach(function (s) {
    if (!s.id || !s.name || !Array.isArray(s.years) || !s.years.length) { problems.push('答案資料 ' + (s.id || '?') + ' 結構缺欄位'); return; }
    var years = {};
    s.years.forEach(function (y) {
      if (years[y.year]) problems.push('答案資料 ' + s.id + ' 年份重複 ' + y.year); years[y.year] = 1;
      if (!Array.isArray(y.answers) || !y.answers.length) problems.push('答案資料 ' + s.id + '/' + y.year + ' 無答案');
      (y.answers || []).forEach(function (a) { if (a && !validOpt.test(a)) problems.push('答案資料 ' + s.id + '/' + y.year + ' 非法答案 ' + a); });
    });
    var an = window.ANSWERSTATS.analyze(s.id);
    if (!an || !an.perQuestion.length || !an.optionRows.length) problems.push('answerstats 分析 ' + s.id + ' 失敗');
    an && an.perQuestion.forEach(function (q) {
      if (q.modeCount > q.total) problems.push('answerstats ' + s.id + ' 第' + q.n + '題 眾數計數異常');
      if (q.streak > q.total) problems.push('answerstats ' + s.id + ' 第' + q.n + '題 連續數異常');
    });
  });
}
var vseen = {}; (window.VOCAB || []).forEach(function (x) { if (vseen[x.w]) problems.push('vocab 重複 ' + x.w); vseen[x.w] = 1; if (!x.w || !x.pos || !x.zh || !x.ex || !x.exZh || !(x.lv >= 1 && x.lv <= 6)) problems.push('vocab 缺欄位 ' + x.w); });

console.log('科目 ' + CURRICULUM.subjects.length + ' | 章節 ' + Object.keys(chSeen).length + ' | 考點 ' + Object.keys(epSeen).length + ' | generator ' + Object.keys(window.GENERATORS).length + ' | vocab ' + (window.VOCAB || []).length);
if (problems.length) { console.error('❌ ' + problems.length + ' 個問題:\n  ' + problems.slice(0, 40).join('\n  ')); process.exit(1); }
console.log('✅ 全域資料檢查通過');
