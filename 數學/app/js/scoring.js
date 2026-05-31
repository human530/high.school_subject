/* ============================================================
 * scoring.js — 以大考中心(學測)為準的「級分」換算
 *
 * 大考中心級分制：滿級分 15 級。
 *   級距 = (該科到考生中，原始分數前 1% 考生的平均) ÷ 15
 *   某考生級分 = 無條件進位( 原始得分 ÷ 級距 )，上限 15。
 *
 * 模擬考無法取得真實母群，這裡用「設定滿分對應 15 級」的近似：
 *   預設 級距 = 滿分 / 15。
 * 並提供五標(頂前均後底)的對照說明，貼近實際解讀。
 * ============================================================ */
(function () {
  // 由原始分數換成級分（近似版）
  function toLevel(raw, fullScore) {
    if (fullScore <= 0) return 0;
    var span = fullScore / 15;        // 級距近似
    var lv = Math.ceil(raw / span);
    if (lv > 15) lv = 15;
    if (lv < 0) lv = 0;
    return lv;
  }

  // 學測五標（以該次百分位對應，這裡用相對分數位置近似說明）
  function band(level) {
    if (level >= 14) return { name: "頂標級", note: "前 12% 水準，朝滿級分穩定邁進。" };
    if (level >= 12) return { name: "前標級", note: "前 25% 水準，再補強弱章即可衝頂。" };
    if (level >= 10) return { name: "均標級", note: "前 50% 水準，觀念已具，需加強速度與細節。" };
    if (level >= 7) return { name: "後標級", note: "前 75% 水準，建議回到弱章重新打底。" };
    return { name: "底標級", note: "基礎尚未穩固，從教學與經典題逐章重練。" };
  }

  // 滿級分需求：通常需 原始分 ≥ 14/15 * 滿分
  function neededForPerfect(fullScore) {
    return Math.ceil(14 / 15 * fullScore); // 進入 15 級分的最低原始分（近似）
  }

  window.SCORING = { toLevel: toLevel, band: band, neededForPerfect: neededForPerfect };
})();
