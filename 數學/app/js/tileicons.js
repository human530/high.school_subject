/* ============================================================
 * tileicons.js — 首頁磁磚的手繪扁平 2D 插畫圖標（離線內嵌 SVG）
 * 畫風對齊既有「彩色手繪科目徽章」：24×24、深藍圓角描邊、柔和粉彩平塗、
 * 圓頭線條、略帶手繪感；非 3D、非 AI 重感。
 * 用法：TILEICONS.render(key, fallbackEmoji) —— 沒有對應 key 時自動退回 emoji。
 * （現有彩色手繪科目徽章 DIAGRAMS.subjectIcon 維持不動。）
 * ============================================================ */
(function () {
  var INK = "#20304d";
  function svg(inner) {
    return '<svg class="tileic" viewBox="0 0 24 24" width="34" height="34" fill="none" ' +
      'stroke="' + INK + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      inner + '</svg>';
  }

  var I = {
    // 高分攻略：手繪靶心＋射中紅心的箭（使用者特別指定的「靶」圖標）
    strategy: svg(
      '<circle cx="11" cy="13" r="8.6" fill="#f7c5c3"/>' +
      '<circle cx="11" cy="13" r="5.6" fill="#ffffff"/>' +
      '<circle cx="11" cy="13" r="2.5" fill="#ef6f6c"/>' +
      '<path d="M20.5 4.5 L12.4 12.2" stroke="#2563eb" stroke-width="1.8"/>' +
      '<path d="M11 13 l3.4 -1.2 -1.1 3.3 z" fill="#2563eb" stroke-width="0.8"/>' +
      '<path d="M20.5 4.5 l1.7 -0.4 -0.4 1.7 z" fill="#fde9c8" stroke-width="0.8"/>'),

    // 教學：攤開的書＋書籤
    learn: svg(
      '<path d="M12 7 C9.5 5.3 6 5.2 4 6 V18 C6 17.2 9.5 17.3 12 19 Z" fill="#cfe0ff"/>' +
      '<path d="M12 7 C14.5 5.3 18 5.2 20 6 V18 C18 17.2 14.5 17.3 12 19 Z" fill="#eaf1ff"/>' +
      '<path d="M12 7 V19" stroke-width="1.2"/>' +
      '<path d="M15.6 5.6 V10 l1.3 -1 1.3 1 V5.2" fill="#ef6f6c" stroke-width="1"/>'),

    // 無限練習：鉛筆＋靈感火花
    practice: svg(
      '<path d="M6 18 L5.4 14.4 L15 4.8 L18.6 8.4 L9 18 Z" fill="#fbe2b6"/>' +
      '<path d="M13 6.8 L16.6 10.4" stroke-width="1.2"/>' +
      '<path d="M6 18 L5.4 14.4 L7.2 16.2 L9 18 Z" fill="#20304d"/>' +
      '<path d="M19.4 4 v2 M18.4 5 h2" stroke="#f3b14e" stroke-width="1.4"/>'),

    // 學測題：燈泡（靈感／思考）
    gsat: svg(
      '<path d="M12 3.2 a5.8 5.8 0 0 1 3.9 10.1 c-.8 .7 -1 1.3 -1 2.4 h-5.8 c0 -1.1 -.2 -1.7 -1 -2.4 A5.8 5.8 0 0 1 12 3.2 Z" fill="#fbe2b6"/>' +
      '<path d="M10.5 12 l1.5 -2 1.5 2" stroke="#ef6f6c" stroke-width="1.2"/>' +
      '<path d="M9.6 18 h4.8 M10.2 20 h3.6" stroke-width="1.5"/>'),

    // 整合考點：跨章串連的節點
    points: svg(
      '<path d="M7 8 L17 8 M7 8 L12 17 M17 8 L12 17" stroke-width="1.3"/>' +
      '<circle cx="7" cy="8" r="2.6" fill="#cfe0ff"/>' +
      '<circle cx="17" cy="8" r="2.6" fill="#c6e8d2"/>' +
      '<circle cx="12" cy="17" r="2.6" fill="#f7c5c3"/>'),

    // 模擬考：夾板＋打勾
    exam: svg(
      '<rect x="5" y="4.6" width="14" height="15.8" rx="2.2" fill="#cfe0ff"/>' +
      '<rect x="9" y="3" width="6" height="3.4" rx="1.3" fill="#ffffff"/>' +
      '<path d="M8.6 13 l2 2 4 -4.6" stroke="#4fae74" stroke-width="1.9"/>'),

    // 背單字：單字卡（A）
    vocab: svg(
      '<rect x="7" y="6" width="12.5" height="11" rx="2" fill="#ddd6f5"/>' +
      '<rect x="4.5" y="8" width="12.5" height="11" rx="2" fill="#ffffff"/>' +
      '<path d="M8 16 L10.7 10 L13.4 16 M9 14 H12.4" stroke="#2563eb" stroke-width="1.6"/>'),

    // 拍照解題：相機
    photo: svg(
      '<path d="M8.6 7 l1.2 -2 h4.4 l1.2 2" fill="#cfe0ff"/>' +
      '<rect x="3.6" y="7" width="16.8" height="12" rx="2.5" fill="#cfe0ff"/>' +
      '<circle cx="12" cy="13" r="3.4" fill="#ffffff"/>' +
      '<circle cx="12" cy="13" r="1.5" fill="#2563eb" stroke="none"/>' +
      '<circle cx="17" cy="9.6" r="0.9" fill="#f3b14e" stroke="none"/>'),

    // 答案統計：長條圖
    answerstats: svg(
      '<path d="M5 19 H20 M5 19 V6" stroke-width="1.5"/>' +
      '<rect x="7" y="13" width="2.7" height="6" rx="0.6" fill="#cfe0ff" stroke-width="1"/>' +
      '<rect x="11" y="10" width="2.7" height="9" rx="0.6" fill="#c6e8d2" stroke-width="1"/>' +
      '<rect x="15" y="7.5" width="2.7" height="11.5" rx="0.6" fill="#f7c5c3" stroke-width="1"/>'),

    // 弱點分析：圖表＋放大鏡
    analysis: svg(
      '<rect x="4" y="5" width="13" height="13" rx="2" fill="#eaf1ff"/>' +
      '<path d="M7 15 V11 M10 15 V8 M13 15 V12" stroke="#2563eb" stroke-width="1.8"/>' +
      '<circle cx="16.2" cy="16.2" r="3.3" fill="#ffffff"/>' +
      '<path d="M18.6 18.6 L21 21" stroke-width="1.8"/>'),

    // 口語練習：麥克風＋音波（英文限定）
    speak: svg(
      '<rect x="9.5" y="3.5" width="5" height="10" rx="2.5" fill="#cfe0ff"/>' +
      '<path d="M7 11 a5 5 0 0 0 10 0" stroke-width="1.5"/>' +
      '<path d="M12 16 V19 M9.5 19 h5" stroke-width="1.5"/>' +
      '<path d="M4 9 q-1 2 0 4 M20 9 q1 2 0 4" stroke="#f3b14e" stroke-width="1.3"/>')
  };

  window.TILEICONS = {
    has: function (k) { return !!I[k]; },
    get: function (k) { return I[k] || ""; },
    render: function (k, fallbackEmoji) { return I[k] || fallbackEmoji || ""; }
  };
})();
