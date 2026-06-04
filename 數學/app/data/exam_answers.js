/* ============================================================
 * exam_answers.js — 歷屆學測「選擇題答案」資料源（供答案統計分析）
 *
 * 結構：每科一筆，內含近十年（民國年）各題答案。
 *   { id, name, verified, choices, note, years:[{ year, answers:[...] }] }
 *   - answers 陣列：index 0 = 第 1 題、index 1 = 第 2 題…（依序）
 *   - 單選答案用大寫字母（A/B/C/D/E）。空字串代表該題非單選或缺資料。
 *
 * ⚠️ 重要：以下答案為「示範／彙整資料」，verified=false 代表尚未逐題核對。
 *    正式參考前，請以「大學入學考試中心（大考中心）」官方公布之
 *    參考答案為準，並把對應年份的 answers 換成官方版本後設 verified=true。
 *    本資料僅為展示「答案統計分析」功能之用。
 *
 * 設計成 classic script，雙擊 index.html 也能運作。
 * ============================================================ */
(function () {
  // 為了示範與一致性，各科收錄「單選題」近十年（民國 104~113）各 12 題。
  // 注意：真實學測各科單選題數不一（國文/英文較多、數學含選填），此處統一簡化為前 12 題單選作示範。
  var SUBJECTS = [
    {
      id: "matha", name: "數學A", verified: false, choices: ["A", "B", "C", "D", "E"],
      note: "示範資料：取單選題前 12 題；實際學測數學A含多選與選填，請以官方為準。",
      years: [
        { year: 113, answers: ["B", "C", "A", "D", "E", "B", "A", "C", "D", "B", "E", "A"] },
        { year: 112, answers: ["B", "D", "A", "C", "E", "B", "C", "A", "D", "B", "A", "E"] },
        { year: 111, answers: ["C", "C", "A", "D", "B", "E", "A", "C", "D", "B", "E", "A"] },
        { year: 110, answers: ["B", "C", "D", "A", "E", "B", "A", "C", "B", "D", "E", "A"] },
        { year: 109, answers: ["A", "C", "A", "D", "E", "B", "C", "B", "D", "E", "A", "C"] },
        { year: 108, answers: ["B", "D", "A", "C", "E", "A", "B", "C", "D", "B", "E", "A"] },
        { year: 107, answers: ["B", "C", "A", "E", "D", "B", "A", "C", "D", "B", "C", "A"] },
        { year: 106, answers: ["D", "C", "A", "B", "E", "B", "A", "C", "E", "B", "D", "A"] },
        { year: 105, answers: ["B", "C", "A", "D", "A", "B", "E", "C", "D", "B", "E", "C"] },
        { year: 104, answers: ["B", "C", "B", "D", "E", "A", "A", "C", "D", "E", "B", "A"] }
      ]
    },
    {
      id: "chinese", name: "國文", verified: false, choices: ["A", "B", "C", "D"],
      note: "示範資料：取單選題前 12 題；國文選擇題實際題數較多，請以官方為準。",
      years: [
        { year: 113, answers: ["C", "A", "D", "B", "C", "A", "B", "D", "C", "A", "B", "D"] },
        { year: 112, answers: ["C", "B", "D", "A", "C", "B", "A", "D", "C", "A", "B", "C"] },
        { year: 111, answers: ["A", "C", "D", "B", "C", "A", "B", "D", "A", "C", "B", "D"] },
        { year: 110, answers: ["C", "A", "B", "D", "C", "A", "D", "B", "C", "A", "B", "D"] },
        { year: 109, answers: ["B", "C", "D", "A", "C", "B", "A", "D", "C", "A", "D", "B"] },
        { year: 108, answers: ["C", "A", "D", "B", "A", "C", "B", "D", "C", "B", "A", "D"] },
        { year: 107, answers: ["C", "D", "A", "B", "C", "A", "B", "D", "A", "C", "B", "D"] },
        { year: 106, answers: ["A", "C", "D", "B", "C", "B", "A", "D", "C", "A", "B", "C"] },
        { year: 105, answers: ["C", "A", "D", "B", "C", "A", "B", "D", "B", "C", "A", "D"] },
        { year: 104, answers: ["D", "C", "A", "B", "C", "A", "B", "D", "C", "A", "D", "B"] }
      ]
    },
    {
      id: "english", name: "英文", verified: false, choices: ["A", "B", "C", "D"],
      note: "示範資料：取詞彙/綜合/閱讀單選前 12 題；英文選擇題實際題數較多，請以官方為準。",
      years: [
        { year: 113, answers: ["B", "D", "A", "C", "B", "A", "D", "C", "B", "A", "C", "D"] },
        { year: 112, answers: ["A", "D", "B", "C", "B", "A", "D", "C", "A", "B", "C", "D"] },
        { year: 111, answers: ["B", "C", "A", "D", "B", "A", "D", "C", "B", "A", "C", "D"] },
        { year: 110, answers: ["B", "D", "A", "C", "A", "B", "D", "C", "B", "A", "D", "C"] },
        { year: 109, answers: ["C", "D", "A", "B", "B", "A", "D", "C", "A", "B", "C", "D"] },
        { year: 108, answers: ["B", "D", "A", "C", "B", "C", "D", "A", "B", "A", "C", "D"] },
        { year: 107, answers: ["B", "A", "D", "C", "B", "A", "D", "C", "A", "B", "C", "D"] },
        { year: 106, answers: ["D", "B", "A", "C", "B", "A", "D", "C", "B", "A", "C", "B"] },
        { year: 105, answers: ["B", "D", "C", "A", "B", "A", "D", "C", "B", "C", "A", "D"] },
        { year: 104, answers: ["B", "D", "A", "C", "C", "A", "B", "D", "B", "A", "D", "C"] }
      ]
    },
    {
      id: "physics", name: "物理", verified: false, choices: ["A", "B", "C", "D", "E"],
      note: "示範資料：取自然科物理單選前 12 題；學測自然為混合卷，請以官方為準。",
      years: [
        { year: 113, answers: ["C", "B", "E", "A", "D", "C", "B", "A", "E", "D", "C", "B"] },
        { year: 112, answers: ["C", "D", "E", "A", "B", "C", "A", "E", "D", "B", "C", "A"] },
        { year: 111, answers: ["B", "C", "E", "A", "D", "C", "B", "A", "E", "D", "C", "B"] },
        { year: 110, answers: ["C", "B", "A", "E", "D", "C", "B", "A", "D", "E", "C", "B"] },
        { year: 109, answers: ["D", "C", "E", "A", "B", "C", "A", "E", "D", "B", "C", "A"] },
        { year: 108, answers: ["C", "B", "E", "A", "D", "B", "C", "A", "E", "D", "B", "C"] },
        { year: 107, answers: ["C", "B", "E", "D", "A", "C", "B", "A", "E", "D", "C", "B"] },
        { year: 106, answers: ["A", "C", "E", "B", "D", "C", "B", "A", "E", "D", "C", "B"] },
        { year: 105, answers: ["C", "B", "D", "A", "E", "C", "A", "B", "E", "D", "C", "B"] },
        { year: 104, answers: ["C", "B", "E", "A", "D", "C", "B", "E", "A", "D", "C", "B"] }
      ]
    },
    {
      id: "chemistry", name: "化學", verified: false, choices: ["A", "B", "C", "D", "E"],
      note: "示範資料：取自然科化學單選前 12 題；學測自然為混合卷，請以官方為準。",
      years: [
        { year: 113, answers: ["D", "B", "A", "C", "E", "D", "B", "A", "C", "E", "D", "B"] },
        { year: 112, answers: ["D", "C", "A", "B", "E", "D", "A", "C", "B", "E", "D", "C"] },
        { year: 111, answers: ["B", "D", "A", "C", "E", "D", "B", "A", "C", "E", "D", "B"] },
        { year: 110, answers: ["D", "B", "C", "A", "E", "D", "B", "A", "E", "C", "D", "B"] },
        { year: 109, answers: ["C", "D", "A", "B", "E", "D", "A", "C", "B", "E", "D", "A"] },
        { year: 108, answers: ["D", "B", "A", "C", "E", "B", "D", "A", "C", "E", "B", "D"] },
        { year: 107, answers: ["D", "B", "A", "E", "C", "D", "B", "A", "C", "E", "D", "B"] },
        { year: 106, answers: ["A", "D", "B", "C", "E", "D", "B", "A", "C", "E", "D", "B"] },
        { year: 105, answers: ["D", "B", "A", "C", "B", "D", "E", "A", "C", "E", "D", "B"] },
        { year: 104, answers: ["D", "B", "A", "C", "E", "D", "B", "C", "A", "E", "D", "B"] }
      ]
    },
    {
      id: "biology", name: "生物", verified: false, choices: ["A", "B", "C", "D", "E"],
      note: "示範資料：取自然科生物單選前 12 題；學測自然為混合卷，請以官方為準。",
      years: [
        { year: 113, answers: ["A", "C", "D", "B", "E", "A", "C", "B", "D", "E", "A", "C"] },
        { year: 112, answers: ["A", "D", "C", "B", "E", "A", "B", "D", "C", "E", "A", "D"] },
        { year: 111, answers: ["C", "A", "D", "B", "E", "A", "C", "B", "D", "E", "A", "C"] },
        { year: 110, answers: ["A", "C", "B", "D", "E", "A", "C", "B", "E", "D", "A", "C"] },
        { year: 109, answers: ["B", "A", "D", "C", "E", "A", "B", "D", "C", "E", "A", "B"] },
        { year: 108, answers: ["A", "C", "D", "B", "E", "C", "A", "B", "D", "E", "C", "A"] },
        { year: 107, answers: ["A", "C", "D", "E", "B", "A", "C", "B", "D", "E", "A", "C"] },
        { year: 106, answers: ["D", "A", "C", "B", "E", "A", "C", "B", "D", "E", "A", "C"] },
        { year: 105, answers: ["A", "C", "D", "B", "C", "A", "E", "B", "D", "E", "A", "C"] },
        { year: 104, answers: ["A", "C", "D", "B", "E", "A", "C", "D", "B", "E", "A", "C"] }
      ]
    },
    {
      id: "earth", name: "地球科學", verified: false, choices: ["A", "B", "C", "D", "E"],
      note: "示範資料：取自然科地科單選前 12 題；學測自然為混合卷，請以官方為準。",
      years: [
        { year: 113, answers: ["E", "A", "C", "B", "D", "E", "A", "C", "B", "D", "E", "A"] },
        { year: 112, answers: ["E", "B", "C", "A", "D", "E", "C", "A", "B", "D", "E", "B"] },
        { year: 111, answers: ["A", "E", "C", "B", "D", "E", "A", "C", "B", "D", "E", "A"] },
        { year: 110, answers: ["E", "A", "B", "C", "D", "E", "A", "C", "D", "B", "E", "A"] },
        { year: 109, answers: ["B", "E", "C", "A", "D", "E", "C", "A", "B", "D", "E", "C"] },
        { year: 108, answers: ["E", "A", "C", "B", "D", "A", "E", "C", "B", "D", "A", "E"] },
        { year: 107, answers: ["E", "A", "C", "D", "B", "E", "A", "C", "B", "D", "E", "A"] },
        { year: 106, answers: ["C", "E", "A", "B", "D", "E", "A", "C", "B", "D", "E", "A"] },
        { year: 105, answers: ["E", "A", "C", "B", "A", "E", "D", "C", "B", "D", "E", "A"] },
        { year: 104, answers: ["E", "A", "C", "B", "D", "E", "A", "B", "C", "D", "E", "A"] }
      ]
    }
  ];

  window.EXAM_ANSWERS = {
    meta: {
      source: "示範／彙整資料（正式參考請以大考中心官方公布之答案為準）",
      verifiedAll: false,
      updated: "2026-06",
      yearsLabel: "民國 104~113（近十年）"
    },
    subjects: SUBJECTS
  };
})();
