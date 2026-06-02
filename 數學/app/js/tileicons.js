/* tileicons.js — 首頁卡片用的日系可愛 2D 插圖圖標（取代 emoji）
 * 風格：柔和圓角、深藍描邊、粉彩填色，扁平插畫感。
 * 每個皆為 viewBox 0 0 64 64 的內嵌 SVG，尺寸由 CSS .tic svg 控制。
 */
(function () {
  var OUT = '#3c4863';
  // 共用外層屬性
  function wrap(inner) {
    return '<svg class="tileico" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<g stroke="' + OUT + '" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">' +
      inner + '</g></svg>';
  }

  window.TILEICONS = {
    // 教學：攤開的書
    learn: wrap(
      '<path d="M32 18C26 14 18 13 11 15.5V47C18 44.5 26 45.5 32 49.5Z" fill="#fbf3dd"/>' +
      '<path d="M32 18C38 14 46 13 53 15.5V47C46 44.5 38 45.5 32 49.5Z" fill="#ffffff"/>' +
      '<path d="M32 18V49.5"/>' +
      '<path d="M16 24H27M16 30H27M16 36H25" stroke-width="1.9"/>' +
      '<path d="M37 24H48M37 30H48M37 36H46" stroke-width="1.9"/>' +
      '<path d="M44 13.5V25l3-2.6 3 2.6V13.5" fill="#ef9a8e"/>'
    ),

    // 無限練習：鉛筆 + 閃光
    practice: wrap(
      '<g transform="rotate(40 32 33)">' +
      '<rect x="25" y="13" width="14" height="8" rx="2.5" fill="#f6b8ae"/>' +
      '<rect x="25" y="20" width="14" height="4" fill="#cdd6e6"/>' +
      '<rect x="25" y="24" width="14" height="20" fill="#f7ce78"/>' +
      '<path d="M30 27V41M34 27V41" stroke-width="1.5"/>' +
      '<path d="M25 44H39L32 54Z" fill="#f0dab0"/>' +
      '<path d="M29.5 49H34.5L32 54Z" fill="#3c4863"/>' +
      '</g>' +
      '<path d="M49 15l1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4z" fill="#f7ce78" stroke-width="1.4"/>'
    ),

    // 學測題：燈泡（靈感）
    gsat: wrap(
      '<path d="M32 6V2M15 13l-3-3M49 13l3-3" stroke-width="2.3"/>' +
      '<path d="M32 9C22 9 16 16 16 25c0 6 4 9 6 14h20c2-5 6-8 6-14 0-9-6-16-16-16Z" fill="#f9d77a"/>' +
      '<path d="M27 30l5-6 5 6" stroke-width="2"/>' +
      '<path d="M24 39h16M25.5 44h13l-1.7 5H27.2Z" fill="#cdd6e6"/>'
    ),

    // 整合考點：標靶 + 星
    points: wrap(
      '<circle cx="32" cy="32" r="22" fill="#ffffff"/>' +
      '<circle cx="32" cy="32" r="14.5" fill="#9fc0ef"/>' +
      '<circle cx="32" cy="32" r="7" fill="#ffffff"/>' +
      '<path d="M32 26l1.7 3.6 3.9.5-2.9 2.7.8 3.9L32 32.9 28.5 36.7l.8-3.9-2.9-2.7 3.9-.5z" fill="#ef9a8e" stroke-width="1.6"/>'
    ),

    // 模擬考：夾板 + 勾選 + 星等
    exam: wrap(
      '<rect x="14" y="13" width="36" height="43" rx="5" fill="#ffffff"/>' +
      '<rect x="23" y="9" width="18" height="9" rx="3.5" fill="#9fc0ef"/>' +
      '<path d="M20 28l3 3 5-6" stroke="#6fae7f"/>' +
      '<path d="M33 28H45" stroke-width="2"/>' +
      '<path d="M20 39l3 3 5-6" stroke="#6fae7f"/>' +
      '<path d="M33 39H45" stroke-width="2"/>' +
      '<path d="M32 45l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill="#f7ce78" stroke-width="1.6"/>'
    ),

    // 背單字：單字卡（A）
    vocab: wrap(
      '<rect x="11" y="22" width="34" height="26" rx="5" fill="#acc4ec"/>' +
      '<rect x="19" y="16" width="34" height="26" rx="5" fill="#ffffff"/>' +
      '<path d="M30 35l6-13 6 13M31.7 31h8.6" stroke-width="2.4"/>'
    ),

    // 拍照解題：相機
    photo: wrap(
      '<path d="M23 20l3-5h12l3 5" fill="#7e9fd6"/>' +
      '<rect x="9" y="20" width="46" height="30" rx="7" fill="#7e9fd6"/>' +
      '<circle cx="32" cy="36" r="9.5" fill="#ffffff"/>' +
      '<circle cx="32" cy="36" r="4.5" fill="#9fc0ef"/>' +
      '<rect x="43" y="25" width="7" height="4" rx="1.5" fill="#f7ce78"/>'
    ),

    // 弱點分析：長條圖 + 放大鏡
    analysis: wrap(
      '<path d="M11 50H53" stroke-width="2.4"/>' +
      '<rect x="13" y="34" width="8" height="14" rx="2" fill="#acc4ec"/>' +
      '<rect x="25" y="27" width="8" height="21" rx="2" fill="#7e9fd6"/>' +
      '<rect x="37" y="20" width="8" height="28" rx="2" fill="#5b79b3"/>' +
      '<circle cx="41" cy="22" r="9" fill="#ffffff" fill-opacity="0.55"/>' +
      '<path d="M47.5 28.5L53 34" stroke-width="3.4"/>'
    ),

    // 口語練習：麥克風 + 音波
    speak: wrap(
      '<rect x="25" y="9" width="14" height="27" rx="7" fill="#ef9a8e"/>' +
      '<path d="M19 29a13 13 0 0 0 26 0"/>' +
      '<path d="M32 42v8M25 50h14"/>' +
      '<path d="M48 17a9 9 0 0 1 0 12M52 13a15 15 0 0 1 0 20" stroke-width="2"/>'
    )
  };
})();
