/* ============================================================
 * diagrams.js — 圖解分析教學：純 SVG 手繪圖（離線、零相依）
 * 每個 key 對應一張說明該章核心觀念的圖，回傳 SVG 字串。
 * 設計成「看圖就懂」：大字、箭頭、顏色標註、白話文字標籤。
 * 在 app.js 章節頁以 DIAGRAMS.render(chapter.diagram) 插入。
 * ============================================================ */
(function () {
  // 共用樣式：土色系手繪墨線（SPACE CADET/SLATE/TAN/COFFEE/CAPUT MORTUUM）
  var C = {
    axis: "#3a4d6b", grid: "#c7b48f", ink: "#1f2c44",
    a: "#25344f", b: "#4f6b4a", c: "#b07a3c", d: "#632024",
    hl: "#632024", paper: "#f4e8d4"
  };

  function svg(w, h, body) {
    return '<svg class="diagram" viewBox="0 0 ' + w + ' ' + h + '" width="100%" ' +
      'preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img">' +
      '<defs>' +
      '<marker id="arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">' +
      '<path d="M0,0 L8,3 L0,6 Z" fill="' + C.hl + '"/></marker>' +
      '<marker id="arrB" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">' +
      '<path d="M0,0 L8,3 L0,6 Z" fill="' + C.b + '"/></marker>' +
      '<marker id="arrC" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">' +
      '<path d="M0,0 L8,3 L0,6 Z" fill="' + C.c + '"/></marker>' +
      '</defs>' + body + '</svg>';
  }
  function t(x, y, str, opt) {
    opt = opt || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (opt.fill || C.ink) + '" ' +
      'font-size="' + (opt.size || 13) + '" text-anchor="' + (opt.anchor || "middle") + '" ' +
      'font-family="system-ui,sans-serif"' + (opt.weight ? ' font-weight="' + opt.weight + '"' : '') + '>' + str + '</text>';
  }
  function line(x1, y1, x2, y2, col, w, marker) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (col || C.axis) +
      '" stroke-width="' + (w || 1.5) + '"' + (marker ? ' marker-end="url(#' + marker + ')"' : '') + '/>';
  }
  /* ---- SVG SMIL 動畫小工具（純前端、離線可用、無 JS 依賴） ---- */
  // 反覆移動屬性：anim("cx","60;200;60","3s")
  function anim(attr, values, dur, extra) {
    return '<animate attributeName="' + attr + '" values="' + values + '" dur="' + dur +
      '" repeatCount="indefinite"' + (extra || '') + '/>';
  }
  function animT(values, dur, extra) {  // transform 動畫（translate/rotate/scale）
    return '<animateTransform attributeName="transform" type="' + (extra && extra.type || 'translate') +
      '" values="' + values + '" dur="' + dur + '" repeatCount="indefinite"' +
      (extra && extra.add ? ' additive="sum"' : '') + '/>';
  }
  // 沿路徑移動：給一個 <path id> 讓物件跑
  function moveAlong(pathId, dur) {
    return '<animateMotion dur="' + dur + '" repeatCount="indefinite"><mpath href="#' + pathId + '"/></animateMotion>';
  }
  // 脈動（半徑/不透明度）
  function pulse(attr, a, b, dur) { return anim(attr, a + ';' + b + ';' + a, dur); }

  var D = {};

  /* 1-1 數與式：數線與絕對值（距離） */
  D.numberline = function () {
    var y = 90, x0 = 40, x1 = 460, mid = 250;
    var s = '';
    s += line(x0, y, x1, y, C.axis, 2, "arr");
    // 刻度
    for (var i = 0; i <= 8; i++) { var x = x0 + i * 52; s += line(x, y - 5, x, y + 5, C.grid, 1); s += t(x, y + 22, i - 4, { size: 11, fill: C.axis }); }
    // a 與 x 兩點，標距離 |x-a|
    var ax = x0 + 2 * 52, xx = x0 + 6 * 52;
    s += '<circle cx="' + ax + '" cy="' + y + '" r="6" fill="' + C.c + '"/>' + t(ax, y - 14, "a", { fill: C.c, weight: 700 });
    s += '<circle cx="' + xx + '" cy="' + y + '" r="6" fill="' + C.a + '"/>' + t(xx, y - 14, "x", { fill: C.hl, weight: 700 });
    s += '<path d="M' + ax + ',' + (y + 40) + ' L' + xx + ',' + (y + 40) + '" stroke="' + C.b + '" stroke-width="2" marker-end="url(#arrB)" marker-start="url(#arrB)"/>';
    s += t((ax + xx) / 2, y + 58, "|x − a| = 兩點的距離", { fill: C.b, weight: 700 });
    s += t(mid, 24, "絕對值 = 在數線上「離 0 或離某點有多遠」", { size: 14, weight: 700 });
    return svg(500, 170, s);
  };

  /* 1-3 指對數：互為反函數，對 y=x 對稱 */
  D.explog = function () {
    var s = '', ox = 250, oy = 150, sc = 26;
    function X(x) { return ox + x * sc; } function Y(y) { return oy - y * sc; }
    s += line(40, oy, 460, oy, C.axis, 1.5, "arr") + line(ox, 280, ox, 20, C.axis, 1.5, "arr");
    s += t(455, oy + 16, "x", { fill: C.axis }) + t(ox + 14, 28, "y", { fill: C.axis });
    // y = x 虛線
    s += '<line x1="' + X(-4) + '" y1="' + Y(-4) + '" x2="' + X(4.5) + '" y2="' + Y(4.5) + '" stroke="' + C.grid + '" stroke-dasharray="4 4"/>';
    s += t(X(4.2), Y(4.2) - 6, "y=x", { fill: C.axis, size: 11 });
    // 指數 y=2^x
    var e = ''; for (var x = -4; x <= 3.2; x += 0.2) { e += (e ? ' L' : 'M') + X(x) + ',' + Y(Math.pow(2, x)); }
    s += '<path d="' + e + '" fill="none" stroke="' + C.a + '" stroke-width="2.5"/>' + t(X(2.4), Y(Math.pow(2, 2.4)) - 8, "y=2ˣ", { fill: C.hl, weight: 700 });
    // 對數 y=log2 x（指數對 y=x 鏡射）
    var g = ''; for (var u = -4; u <= 3.2; u += 0.2) { var xx = Math.pow(2, u); g += (g ? ' L' : 'M') + X(xx) + ',' + Y(u); }
    s += '<path d="' + g + '" fill="none" stroke="' + C.b + '" stroke-width="2.5"/>' + t(X(4.2), Y(1.2), "y=log₂x", { fill: C.b, weight: 700, anchor: "start" });
    s += t(ox, 14, "指數與對數像照鏡子：沿 y=x 翻過去就重疊", { size: 13, weight: 700 });
    return svg(500, 300, s);
  };

  /* 2-1 數列：等差(加) vs 等比(乘) */
  D.sequence = function () {
    var s = '', y1 = 80, y2 = 190, x0 = 50;
    s += t(250, 24, "等差：每次「＋固定數」；等比：每次「×固定倍」", { size: 13, weight: 700 });
    // 等差 3,6,9,12
    var ad = [3, 6, 9, 12, 15];
    ad.forEach(function (v, i) {
      var x = x0 + i * 95;
      s += '<circle cx="' + x + '" cy="' + y1 + '" r="18" fill="' + C.a + '"/>' + t(x, y1 + 5, v, { weight: 700 });
      if (i) s += t(x - 47, y1 - 24, "+3", { fill: C.b, weight: 700, size: 12 }) + line(x - 77, y1, x - 18, y1, C.b, 1.5, "arrB");
    });
    s += t(x0 - 14, y1 + 5, "等差", { anchor: "end", fill: C.hl, size: 12 });
    // 等比 2,4,8,16
    var gp = [2, 4, 8, 16, 32];
    gp.forEach(function (v, i) {
      var x = x0 + i * 95;
      s += '<circle cx="' + x + '" cy="' + y2 + '" r="18" fill="' + C.c + '"/>' + t(x, y2 + 5, v, { weight: 700, fill: C.paper });
      if (i) s += t(x - 47, y2 - 24, "×2", { fill: C.d, weight: 700, size: 12 }) + line(x - 77, y2, x - 18, y2, C.d, 1.5, "arrC");
    });
    s += t(x0 - 14, y2 + 5, "等比", { anchor: "end", fill: C.c, size: 12 });
    return svg(540, 230, s);
  };

  /* 2-3 機率：樹狀圖 */
  D.probtree = function () {
    var s = '', x0 = 70, xa = 230, xb = 430, yr = 130;
    s += t(250, 22, "機率樹：沿著走「相乘」，分岔加總「相加」", { size: 13, weight: 700 });
    s += '<circle cx="' + x0 + '" cy="' + yr + '" r="16" fill="' + C.a + '"/>' + t(x0, yr + 5, "始", {});
    var ys = [70, 190];
    ['A', "A'"].forEach(function (lab, i) {
      s += line(x0 + 16, yr, xa - 16, ys[i], C.hl, 1.8);
      s += t((x0 + xa) / 2, ys[i] + (i ? 22 : -12), "P=0.6", { size: 11, fill: C.b });
      s += '<circle cx="' + xa + '" cy="' + ys[i] + '" r="16" fill="' + (i ? C.grid : C.b) + '"/>' + t(xa, ys[i] + 5, lab, {});
      var yy = [ys[i] - 45, ys[i] + 45];
      ['B', "B'"].forEach(function (l2, j) {
        s += line(xa + 16, ys[i], xb - 16, yy[j], C.hl, 1.5);
        s += '<circle cx="' + xb + '" cy="' + yy[j] + '" r="14" fill="' + (j ? C.grid : C.c) + '"/>' + t(xb, yy[j] + 5, l2, { fill: j ? C.ink : C.paper });
      });
    });
    return svg(500, 250, s);
  };

  /* 2-4 數據：散布圖 + 迴歸直線 */
  D.regression = function () {
    var s = '', ox = 60, oy = 230, w = 380, h = 190;
    s += t(250, 22, "相關與迴歸：點的趨勢畫一條最貼近的線", { size: 13, weight: 700 });
    s += line(ox, oy, ox + w, oy, C.axis, 1.5, "arr") + line(ox, oy, ox, oy - h, C.axis, 1.5, "arr");
    s += t(ox + w, oy + 16, "x", { fill: C.axis }) + t(ox - 14, oy - h, "y", { fill: C.axis });
    var pts = [[40, 50], [80, 70], [120, 90], [150, 110], [200, 130], [240, 150], [300, 165], [340, 175], [180, 95], [110, 60]];
    pts.forEach(function (p) { s += '<circle cx="' + (ox + p[0]) + '" cy="' + (oy - p[1]) + '" r="4.5" fill="' + C.a + '"/>'; });
    s += line(ox + 20, oy - 40, ox + 360, oy - 185, C.c, 2.5);
    s += t(ox + 300, oy - 150, "迴歸直線", { fill: C.c, weight: 700, anchor: "start" });
    s += '<circle cx="' + (ox + 180) + '" cy="' + (oy - 110) + '" r="6" fill="' + C.d + '"/>' + t(ox + 180, oy - 122, "重心(x̄,ȳ)", { fill: C.d, size: 11 });
    return svg(500, 250, s);
  };

  /* 3-1 三角比：直角三角形 SOH-CAH-TOA */
  D.righttri = function () {
    var s = '', A = [80, 230], B = [400, 230], Cc = [400, 70];
    s += t(250, 24, "SOH-CAH-TOA：sin=對/斜，cos=鄰/斜，tan=對/鄰", { size: 13, weight: 700 });
    s += '<polygon points="' + A + ' ' + B + ' ' + Cc + '" fill="rgba(99,102,241,.12)" stroke="' + C.a + '" stroke-width="2.5"/>';
    s += '<rect x="' + (B[0] - 18) + '" y="' + (B[1] - 18) + '" width="18" height="18" fill="none" stroke="' + C.axis + '"/>';
    s += t((A[0] + B[0]) / 2, B[1] + 20, "鄰邊", { fill: C.b, weight: 700 });
    s += t(B[0] + 30, (B[1] + Cc[1]) / 2, "對邊", { fill: C.c, weight: 700 });
    s += t((A[0] + Cc[0]) / 2 - 20, (A[1] + Cc[1]) / 2 - 6, "斜邊", { fill: C.hl, weight: 700, anchor: "end" });
    s += '<path d="M' + (A[0] + 40) + ',' + A[1] + ' A40,40 0 0,0 ' + (A[0] + 36) + ',' + (A[1] - 17) + '" fill="none" stroke="' + C.d + '" stroke-width="2"/>' + t(A[0] + 52, A[1] - 8, "θ", { fill: C.d, weight: 700 });
    return svg(500, 270, s);
  };

  /* 3-2 三角函數：單位圓 + 正弦波 */
  D.unitcircle = function () {
    var s = '', ox = 130, oy = 150, r = 90, ang = 50, rad = ang * Math.PI / 180;
    var px = ox + r * Math.cos(rad), py = oy - r * Math.sin(rad);
    s += t(250, 22, "單位圓：轉到角 θ，高度=sinθ、橫向=cosθ", { size: 13, weight: 700 });
    s += line(ox - r - 20, oy, ox + r + 20, oy, C.axis, 1.2) + line(ox, oy + r + 20, ox, oy - r - 20, C.axis, 1.2);
    s += '<circle cx="' + ox + '" cy="' + oy + '" r="' + r + '" fill="none" stroke="' + C.grid + '" stroke-width="2"/>';
    s += line(ox, oy, px, py, C.a, 2.5);
    s += line(px, oy, px, py, C.c, 2);   // sin 高度
    s += line(ox, oy, px, oy, C.b, 2);   // cos 橫向
    s += '<circle cx="' + px + '" cy="' + py + '" r="5" fill="' + C.hl + '"/>';
    s += t(px + 30, py - 4, "(cosθ, sinθ)", { fill: C.hl, size: 11, anchor: "start" });
    s += t(px + 12, (oy + py) / 2, "sinθ", { fill: C.c, size: 11, anchor: "start" });
    s += t((ox + px) / 2, oy + 16, "cosθ", { fill: C.b, size: 11 });
    // 正弦波
    var wx = 250, ww = 210; var path = '';
    for (var d = 0; d <= 360; d += 5) { var X = wx + d / 360 * ww, Y = oy - Math.sin(d * Math.PI / 180) * 60; path += (path ? ' L' : 'M') + X + ',' + Y; }
    s += line(wx, oy, wx + ww + 10, oy, C.axis, 1) + '<path d="' + path + '" fill="none" stroke="' + C.a + '" stroke-width="2.5"/>';
    s += t(wx + ww / 2, oy + 78, "y = sinθ 像海浪一樣重複", { size: 11, fill: C.axis });
    return svg(500, 300, s);
  };

  /* 3-3 直線與圓：圓心到直線距離 vs 半徑 */
  D.circleline = function () {
    var s = '', ox = 200, oy = 160, r = 80;
    s += t(250, 22, "比距離 d 與半徑 r：d<r 交、d=r 切、d>r 離", { size: 13, weight: 700 });
    s += '<circle cx="' + ox + '" cy="' + oy + '" r="' + r + '" fill="rgba(34,197,94,.10)" stroke="' + C.b + '" stroke-width="2.5"/>';
    s += '<circle cx="' + ox + '" cy="' + oy + '" r="4" fill="' + C.b + '"/>' + t(ox, oy - 8, "圓心", { size: 11, fill: C.b });
    // 切線（d=r）
    s += line(ox + r + 60, 60, ox - 40, 270, C.c, 2.5);
    s += line(ox, oy, ox + 57, oy - 57, C.d, 2, "arrC");
    s += t(ox + 36, oy - 40, "d", { fill: C.d, weight: 700 });
    s += t(420, 90, "這條線剛好相切", { fill: C.c, size: 11, anchor: "end" });
    return svg(500, 290, s);
  };

  /* 3-4 平面向量：加法（首尾相接）+ 內積投影 */
  D.vector = function () {
    var s = '', ox = 70, oy = 230;
    s += t(250, 22, "向量相加 = 箭頭首尾相接；走到哪就是和", { size: 13, weight: 700 });
    var a = [120, -70], b = [90, 40];
    s += line(ox, oy, ox + a[0], oy + a[1], C.a, 2.5, "arr") + t(ox + a[0] / 2 - 6, oy + a[1] / 2 - 8, "a", { fill: C.hl, weight: 700 });
    s += line(ox + a[0], oy + a[1], ox + a[0] + b[0], oy + a[1] + b[1], C.b, 2.5, "arrB") + t(ox + a[0] + b[0] / 2 + 8, oy + a[1] + b[1] / 2, "b", { fill: C.b, weight: 700, anchor: "start" });
    s += line(ox, oy, ox + a[0] + b[0], oy + a[1] + b[1], C.c, 2.8, "arrC") + t(ox + (a[0] + b[0]) / 2 - 10, oy + (a[1] + b[1]) / 2 + 22, "a+b", { fill: C.c, weight: 700 });
    return svg(500, 270, s);
  };

  /* 4-1 空間向量：3D 坐標軸 */
  D.space3d = function () {
    var s = '', ox = 200, oy = 200;
    s += t(250, 22, "空間 = 平面再加一個「前後 z」軸", { size: 13, weight: 700 });
    s += line(ox, oy, ox + 180, oy, C.d, 2, "arrC") + t(ox + 188, oy + 4, "x", { fill: C.d, anchor: "start" });
    s += line(ox, oy, ox, oy - 160, C.b, 2, "arrB") + t(ox, oy - 168, "z", { fill: C.b });
    s += line(ox, oy, ox - 110, oy + 80, C.a, 2, "arr") + t(ox - 120, oy + 90, "y", { fill: C.hl, anchor: "end" });
    // 一個點 (向量)
    var P = [ox + 110, oy - 90];
    s += line(ox, oy, P[0], P[1], C.c, 2.5, "arrC");
    s += '<circle cx="' + P[0] + '" cy="' + P[1] + '" r="5" fill="' + C.c + '"/>' + t(P[0] + 8, P[1] - 6, "(a,b,c)", { fill: C.c, anchor: "start", size: 12 });
    return svg(500, 250, s);
  };

  /* 4-2 空間平面：法向量垂直於平面 */
  D.plane = function () {
    var s = '', cx = 250, cy = 170;
    s += t(250, 22, "平面有一支垂直插出的箭：法向量 (a,b,c)", { size: 13, weight: 700 });
    s += '<polygon points="120,210 330,160 380,90 170,140" fill="rgba(99,102,241,.18)" stroke="' + C.a + '" stroke-width="2"/>';
    var fx = 250, fy = 150;
    s += line(fx, fy, fx + 70, fy - 95, C.d, 2.8, "arrC") + t(fx + 80, fy - 100, "法向量 n", { fill: C.d, weight: 700, anchor: "start" });
    s += '<circle cx="' + fx + '" cy="' + fy + '" r="4" fill="' + C.d + '"/>';
    s += t(fx - 70, fy + 40, "平面", { fill: C.hl, weight: 700 });
    return svg(500, 250, s);
  };

  /* 4-3 矩陣：線性變換把方格拉伸 */
  D.matrix = function () {
    var s = '', ox = 90, oy = 200, g = 30;
    s += t(250, 22, "矩陣是一台機器：把方格網變形（拉伸/旋轉）", { size: 13, weight: 700 });
    // 原始方格
    for (var i = 0; i <= 3; i++) { s += line(ox + i * g, oy, ox + i * g, oy - 3 * g, C.grid, 1) + line(ox, oy - i * g, ox + 3 * g, oy - i * g, C.grid, 1); }
    s += t(ox + 45, oy + 20, "原本", { fill: C.axis, size: 12 });
    // 箭頭
    s += line(ox + 110, oy - 45, ox + 170, oy - 45, C.hl, 2, "arr") + t(ox + 140, oy - 54, "A·", { fill: C.hl, size: 12 });
    // 變形後（平行四邊形格）
    var bx = ox + 200, by = oy; var ux = 32, uy = -8, vx = 14, vy = -34;
    for (var k = 0; k <= 3; k++) {
      s += line(bx + k * ux, by + k * uy, bx + k * ux + 3 * vx, by + k * uy + 3 * vy, C.a, 1.3);
      s += line(bx + k * vx, by + k * vy, bx + 3 * ux + k * vx, by + 3 * uy + k * vy, C.a, 1.3);
    }
    s += t(bx + 55, oy + 20, "變形後", { fill: C.hl, size: 12 });
    return svg(500, 250, s);
  };

  // 多項式（補 1-2）：函數圖形與根
  D.polyroot = function () {
    var s = '', ox = 250, oy = 150, sc = 32;
    function X(x) { return ox + x * sc; } function Y(y) { return oy - y * sc; }
    s += t(250, 20, "多項式的根 = 圖形和 x 軸的交點", { size: 13, weight: 700 });
    s += line(60, oy, 460, oy, C.axis, 1.5, "arr") + line(ox, 270, ox, 30, C.axis, 1.5, "arr");
    var p = ''; for (var x = -2.4; x <= 2.4; x += 0.1) { var y = 0.5 * (x + 1.5) * (x) * (x - 1.8); p += (p ? ' L' : 'M') + X(x) + ',' + Y(y); }
    s += '<path d="' + p + '" fill="none" stroke="' + C.a + '" stroke-width="2.5"/>';
    [-1.5, 0, 1.8].forEach(function (r) { s += '<circle cx="' + X(r) + '" cy="' + Y(0) + '" r="5" fill="' + C.c + '"/>'; });
    s += t(X(1.8), Y(0) + 20, "根", { fill: C.c, size: 11 });
    return svg(500, 280, s);
  };

  // 排列組合（補 2-2）：排列看順序 vs 組合不看
  D.permcomb = function () {
    var s = '';
    s += t(250, 22, "排列：誰前誰後算不同；組合：挑到同一群算一樣", { size: 13, weight: 700 });
    s += t(130, 60, "排列 (有順序)", { fill: C.hl, weight: 700 });
    ['AB', 'BA', 'AC', 'CA'].forEach(function (p, i) { var x = 50 + (i % 2) * 90, y = 95 + Math.floor(i / 2) * 45; s += '<rect x="' + x + '" y="' + y + '" width="70" height="30" rx="6" fill="' + C.a + '"/>' + t(x + 35, y + 20, p, { weight: 700 }); });
    s += t(380, 60, "組合 (無順序)", { fill: C.b, weight: 700 });
    ['{A,B}', '{A,C}'].forEach(function (p, i) { var y = 95 + i * 45; s += '<rect x="330" y="' + y + '" width="100" height="30" rx="6" fill="' + C.b + '"/>' + t(380, y + 20, p, { weight: 700, fill: C.paper }); });
    s += t(245, 110, "→", { size: 24, fill: C.c }); s += t(245, 155, "→", { size: 24, fill: C.c });
    return svg(500, 210, s);
  };

  /* ============================================================
   * 各科動畫圖解（SVG SMIL，會動）
   * ============================================================ */

  /* 國文・文體流變：唐詩→宋詞→元曲（高亮輪播） */
  D.zhFlow = function () {
    var s = t(250, 26, "文體流變：唐詩 → 宋詞 → 元曲", { size: 14, weight: 700 });
    var labs = ["唐詩", "宋詞", "元曲"], xs = [110, 250, 390];
    labs.forEach(function (lab, i) {
      var begin = (i * 1) + "s";
      s += '<g>' +
        '<rect x="' + (xs[i] - 55) + '" y="80" width="110" height="60" rx="12" fill="' + C.paper + '" stroke="' + C.a + '" stroke-width="3">' +
        '<animate attributeName="fill" values="' + C.paper + ';' + C.a + ';' + C.paper + '" dur="3s" begin="' + begin + '" repeatCount="indefinite"/>' +
        '</rect>' +
        '<text x="' + xs[i] + '" y="118" fill="' + C.ink + '" font-size="20" font-weight="700" text-anchor="middle">' + lab +
        '<animate attributeName="fill" values="' + C.ink + ';' + C.paper + ';' + C.ink + '" dur="3s" begin="' + begin + '" repeatCount="indefinite"/>' +
        '</text></g>';
      if (i < 2) s += '<text x="' + ((xs[i] + xs[i + 1]) / 2) + '" y="118" font-size="22" fill="' + C.d + '" text-anchor="middle">→</text>';
    });
    s += t(250, 175, "字數整齊→詩；長短句配詞牌→詞；有曲牌+襯字→曲", { size: 12, fill: C.axis });
    return svg(500, 200, s);
  };

  /* 國文・閱讀流程：看題→定位→找證據（箭頭流動） */
  D.zhRead = function () {
    var s = t(250, 26, "閱讀解題流程（跟著箭頭走）", { size: 14, weight: 700 });
    var steps = ["看題目", "回文定位", "圈關鍵", "選有依據"], x0 = 60, dx = 130;
    steps.forEach(function (st, i) {
      var x = x0 + i * dx;
      s += '<circle cx="' + x + '" cy="95" r="34" fill="' + (i === 3 ? C.d : C.a) + '"/>' +
        t(x, 100, st, { fill: C.paper, size: 12, weight: 700 });
      if (i < 3) {
        s += '<circle cx="' + (x + 34) + '" cy="95" r="5" fill="' + C.d + '"><animate attributeName="cx" values="' +
          (x + 34) + ';' + (x + dx - 34) + ';' + (x + 34) + '" dur="2s" begin="' + (i * 0.5) + 's" repeatCount="indefinite"/></circle>';
      }
    });
    s += t(250, 165, "答案一定在文章裡，選最有根據的", { size: 12, fill: C.axis });
    return svg(500, 185, s);
  };

  /* 英文・時態時間軸：過去/現在/未來（移動標記） */
  D.enTense = function () {
    var s = t(250, 26, "時態時間軸：看時間副詞選時態", { size: 14, weight: 700 });
    s += line(40, 100, 460, 100, C.axis, 3, "arr");
    [["過去", 110, "yesterday → 過去式"], ["現在", 250, "now → 現在式"], ["未來", 390, "tomorrow → will"]].forEach(function (p) {
      s += line(p[1], 92, p[1], 108, C.axis, 2);
      s += t(p[1], 82, p[0], { weight: 700, size: 14 });
      s += t(p[1], 130, p[2], { size: 10, fill: C.axis });
    });
    // 跑動的「現在」光點
    s += '<circle cy="100" r="8" fill="' + C.d + '"><animate attributeName="cx" values="110;390;110" dur="5s" repeatCount="indefinite"/>' +
      pulse("r", 8, 12, "1s") + '</circle>';
    s += t(250, 165, "since/for→完成式；明確過去時間→過去式", { size: 11, fill: C.axis });
    return svg(500, 185, s);
  };

  /* 英文・字根組字：pre + dict → predict（拼接動畫） */
  D.enRoot = function () {
    var s = t(250, 26, "拆字猜意思：字首 + 字根", { size: 14, weight: 700 });
    // 兩塊滑入合體
    s += '<g><rect x="120" y="80" width="100" height="50" rx="10" fill="' + C.a + '"><animateTransform attributeName="transform" type="translate" values="-120,0;0,0;0,0" dur="3s" repeatCount="indefinite"/></rect>' +
      '<text x="170" y="110" fill="' + C.paper + '" font-size="16" font-weight="700" text-anchor="middle">pre 前<animateTransform attributeName="transform" type="translate" values="-120,0;0,0;0,0" dur="3s" repeatCount="indefinite"/></text></g>';
    s += '<g><rect x="230" y="80" width="100" height="50" rx="10" fill="' + C.d + '"><animateTransform attributeName="transform" type="translate" values="120,0;0,0;0,0" dur="3s" repeatCount="indefinite"/></rect>' +
      '<text x="280" y="110" fill="' + C.paper + '" font-size="16" font-weight="700" text-anchor="middle">dict 說<animateTransform attributeName="transform" type="translate" values="120,0;0,0;0,0" dur="3s" repeatCount="indefinite"/></text></g>';
    s += '<text x="250" y="170" font-size="18" font-weight="700" fill="' + C.ink + '" text-anchor="middle" opacity="0">= predict 預測<animate attributeName="opacity" values="0;0;1;1;0" dur="3s" repeatCount="indefinite"/></text>';
    return svg(500, 190, s);
  };

  /* 物理・等加速：小球加速移動 + v-t 圖 */
  D.phMotion = function () {
    var s = t(250, 24, "等加速運動：速度越來越快", { size: 14, weight: 700 });
    // 軌道
    s += line(40, 80, 460, 80, C.grid, 3);
    s += '<circle cy="80" r="12" fill="' + C.d + '"><animate attributeName="cx" values="50;450;50" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.4 0 1 1;0 0 0.6 1" dur="3s" repeatCount="indefinite"/></circle>';
    // v-t 圖（斜直線 + 掃描點）
    var ox = 70, oy = 230;
    s += line(ox, oy, ox + 360, oy, C.axis, 2, "arr") + line(ox, oy, ox, 120, C.axis, 2, "arr");
    s += t(ox + 360, oy + 16, "t", { fill: C.axis }) + t(ox - 14, 130, "v", { fill: C.axis });
    s += '<line x1="' + ox + '" y1="' + oy + '" x2="' + (ox + 340) + '" y2="140" stroke="' + C.a + '" stroke-width="3"/>';
    s += t(ox + 250, 170, "斜率 = 加速度", { fill: C.a, size: 12, weight: 700 });
    s += '<circle r="6" fill="' + C.d + '"><animateMotion dur="3s" repeatCount="indefinite" path="M' + ox + ',' + oy + ' L' + (ox + 340) + ',140"/></circle>';
    return svg(500, 250, s);
  };

  /* 物理・波動：正弦波橫向傳遞（相位移動） */
  D.phWave = function () {
    var s = t(250, 24, "波動：波形向右傳遞 v = fλ", { size: 14, weight: 700 });
    var mid = 130, amp = 50, pts = [];
    // 用 path + 動畫平移做出「波在跑」
    function wavePath(ph) {
      var d = '';
      for (var x = 0; x <= 500; x += 5) {
        var yy = mid - amp * Math.sin((x / 60) + ph);
        d += (d ? ' L' : 'M') + x + ',' + yy.toFixed(1);
      }
      return d;
    }
    s += '<path fill="none" stroke="' + C.a + '" stroke-width="3" d="' + wavePath(0) + '">' +
      '<animate attributeName="d" dur="2s" repeatCount="indefinite" values="' + wavePath(0) + ';' + wavePath(-Math.PI) + ';' + wavePath(-2 * Math.PI) + '"/></path>';
    // 一個浮標只上下振動（示意介質不前進）
    s += '<circle cx="250" r="8" fill="' + C.d + '"><animate attributeName="cy" values="' + (mid - amp) + ';' + (mid + amp) + ';' + (mid - amp) + '" dur="2s" repeatCount="indefinite"/></circle>';
    s += t(250, 215, "波傳能量，介質只原地振動（紅點）", { size: 12, fill: C.axis });
    return svg(500, 235, s);
  };

  /* 化學・莫耳橋：質量↔莫耳↔粒子（流動） */
  D.chMole = function () {
    var s = t(250, 24, "莫耳是橋樑：質量 ↔ 莫耳 ↔ 粒子", { size: 14, weight: 700 });
    var boxes = [["質量 m", 90, C.a], ["莫耳 n", 250, C.d], ["粒子數", 410, C.a]];
    boxes.forEach(function (bx) {
      s += '<rect x="' + (bx[1] - 60) + '" y="80" width="120" height="56" rx="12" fill="' + bx[2] + '"/>' +
        t(bx[1], 113, bx[0], { fill: C.paper, weight: 700 });
    });
    // 來回流動的小球
    s += '<circle cy="108" r="6" fill="' + C.d + '"><animate attributeName="cx" values="150;190;150" dur="1.5s" repeatCount="indefinite"/></circle>';
    s += '<circle cy="108" r="6" fill="' + C.a + '"><animate attributeName="cx" values="310;350;310" dur="1.5s" begin="0.5s" repeatCount="indefinite"/></circle>';
    s += t(170, 70, "÷M", { size: 12, fill: C.axis }) + t(330, 70, "×Nₐ", { size: 12, fill: C.axis });
    return svg(500, 160, s);
  };

  /* 化學・酸鹼 pH：指示計指針擺動 */
  D.chPH = function () {
    var s = t(250, 24, "pH 值：酸 ← 中性 → 鹼", { size: 14, weight: 700 });
    // 色帶
    for (var i = 0; i <= 14; i++) {
      var x = 50 + i * 28;
      var col = i < 7 ? C.d : (i === 7 ? C.b : C.a);
      s += '<rect x="' + x + '" y="80" width="28" height="36" fill="' + col + '" opacity="' + (0.4 + Math.abs(i - 7) / 20) + '"/>';
      if (i % 2 === 0) s += t(x + 14, 132, i, { size: 10, fill: C.axis });
    }
    // 指針擺動
    s += '<polygon points="0,70 -8,55 8,55" fill="' + C.ink + '"><animateTransform attributeName="transform" type="translate" values="120,0;380,0;120,0" dur="4s" repeatCount="indefinite"/></polygon>';
    s += t(120, 160, "pH<7 酸", { size: 11, fill: C.d }) + t(250, 160, "=7 中", { size: 11, fill: C.b }) + t(380, 160, ">7 鹼", { size: 11, fill: C.a });
    return svg(500, 180, s);
  };

  /* 生物・遺傳旁氏表：Aa×Aa 格子逐一亮起 */
  D.bioPunnett = function () {
    var s = t(250, 24, "旁氏表：Aa × Aa → 3 顯 : 1 隱", { size: 14, weight: 700 });
    var cells = [["AA", C.a], ["Aa", C.a], ["Aa", C.a], ["aa", C.d]];
    var gx = 180, gy = 60, cw = 70;
    s += t(gx + cw, gy - 8, "A", { weight: 700 }) + t(gx + 2 * cw, gy - 8, "a", { weight: 700 });
    s += t(gx - 12, gy + cw - 20, "A", { weight: 700 }) + t(gx - 12, gy + 2 * cw - 20, "a", { weight: 700 });
    cells.forEach(function (c, i) {
      var cx = gx + (i % 2) * cw, cy = gy + Math.floor(i / 2) * cw;
      s += '<rect x="' + cx + '" y="' + cy + '" width="' + cw + '" height="' + cw + '" fill="' + C.paper + '" stroke="' + C.a + '" stroke-width="2">' +
        '<animate attributeName="fill" values="' + C.paper + ';' + c[1] + ';' + C.paper + '" dur="4s" begin="' + (i * 1) + 's" repeatCount="indefinite"/></rect>' +
        t(cx + cw / 2, cy + cw / 2 + 6, c[0], { weight: 700, size: 18 });
    });
    s += t(250, 215, "顯性(紫):隱性(紅) = 3:1", { size: 12, fill: C.axis });
    return svg(500, 235, s);
  };

  /* 生物・光合呼吸循環：CO₂/O₂ 在葉綠體與粒線體間流動 */
  D.bioCycle = function () {
    var s = t(250, 24, "光合 ↔ 呼吸：互為逆反應", { size: 14, weight: 700 });
    s += '<ellipse cx="120" cy="130" rx="70" ry="50" fill="' + C.b + '" opacity="0.5" stroke="' + C.b + '" stroke-width="3"/>' + t(120, 135, "葉綠體", { weight: 700 });
    s += '<ellipse cx="380" cy="130" rx="70" ry="50" fill="' + C.d + '" opacity="0.4" stroke="' + C.d + '" stroke-width="3"/>' + t(380, 135, "粒線體", { weight: 700 });
    // O2 上路往右、CO2 下路往左（循環）
    s += '<text font-size="14" font-weight="700" fill="' + C.a + '">O₂<animateMotion dur="3s" repeatCount="indefinite" path="M150,90 L350,90"/></text>';
    s += '<text font-size="14" font-weight="700" fill="' + C.d + '">CO₂<animateMotion dur="3s" repeatCount="indefinite" path="M350,180 L150,180"/></text>';
    s += line(150, 90, 350, 90, C.grid, 1.5, "arr") + line(350, 180, 150, 180, C.grid, 1.5, "arr");
    s += t(250, 225, "光合放 O₂、呼吸放 CO₂，物質循環", { size: 12, fill: C.axis });
    return svg(500, 245, s);
  };

  /* 地科・地球自轉公轉：地球繞太陽轉 + 自轉 */
  D.esEarth = function () {
    var s = t(250, 24, "自轉(晝夜) + 公轉(四季)", { size: 14, weight: 700 });
    s += '<circle cx="250" cy="140" r="26" fill="' + C.c + '"/>' + t(250, 145, "☀", { size: 22 });
    // 公轉軌道
    s += '<ellipse cx="250" cy="140" rx="160" ry="80" fill="none" stroke="' + C.grid + '" stroke-dasharray="5 5"/>';
    // 地球沿軌道公轉，本體自轉
    s += '<g><animateMotion dur="8s" repeatCount="indefinite" path="M410,140 A160,80 0 1,1 90,140 A160,80 0 1,1 410,140"/>' +
      '<circle r="16" fill="' + C.a + '"/>' +
      '<g><line x1="0" y1="-16" x2="0" y2="16" stroke="' + C.paper + '" stroke-width="2"/>' +
      '<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1s" repeatCount="indefinite"/></g>' +
      '</g>';
    s += t(250, 235, "地球邊自轉邊繞太陽公轉；地軸傾斜→四季", { size: 12, fill: C.axis });
    return svg(500, 255, s);
  };

  /* 地科・板塊隱沒：兩板塊相互推擠（聚合邊界） */
  D.esPlate = function () {
    var s = t(250, 24, "板塊聚合：碰撞推擠造山與地震", { size: 14, weight: 700 });
    // 左板塊往右、右板塊往左
    s += '<g><rect x="20" y="120" width="200" height="60" fill="' + C.a + '" opacity="0.7"/>' +
      '<animateTransform attributeName="transform" type="translate" values="0,0;30,0;0,0" dur="3s" repeatCount="indefinite"/></g>';
    s += '<g><rect x="280" y="120" width="200" height="60" fill="' + C.d + '" opacity="0.6"/>' +
      '<animateTransform attributeName="transform" type="translate" values="0,0;-30,0;0,0" dur="3s" repeatCount="indefinite"/></g>';
    // 中間擠出的山
    s += '<polygon points="230,120 250,70 270,120" fill="' + C.b + '"><animate attributeName="points" values="235,120 250,95 265,120;230,120 250,70 270,120;235,120 250,95 265,120" dur="3s" repeatCount="indefinite"/></polygon>';
    s += line(40, 180, 460, 180, C.grid, 2);
    s += t(120, 210, "←板塊", { size: 12, fill: C.a }) + t(250, 60, "造山", { size: 12, fill: C.b, weight: 700 }) + t(380, 210, "板塊→", { size: 12, fill: C.d });
    return svg(500, 230, s);
  };

  D.render = function (key) {
    if (!key || !D[key]) return "";
    try { return D[key](); } catch (e) { return ""; }
  };
  D.has = function (key) { return !!(key && D[key]); };

  /* ============================================================
   * 科目彩色手繪小徽章（取代單色 emoji）
   * 24x24 viewBox，回傳 inline SVG 字串。
   * ============================================================ */
  function badge(body, bg) {
    return '<svg class="subicon" viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect x="1" y="1" width="22" height="22" rx="7" fill="' + (bg || '#fff') + '" stroke="#4a4036" stroke-width="1.5"/>' +
      body + '</svg>';
  }
  var SUBJECT_ICONS = {
    // 數學A：圓規＋加號（藍底）
    matha: badge('<path d="M12 5 L8 18 M12 5 L16 18" stroke="#2f6f9e" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<circle cx="12" cy="5" r="1.6" fill="#c94f3d"/><text x="17.5" y="9" font-size="6" fill="#c94f3d" font-weight="bold">+</text>', '#dbeaf2'),
    // 國文：毛筆／書（紅底）
    chinese: badge('<rect x="6" y="5" width="12" height="14" rx="1.5" fill="#fff" stroke="#b13c2b" stroke-width="1.3"/>' +
      '<line x1="9" y1="8.5" x2="15" y2="8.5" stroke="#b13c2b" stroke-width="1.1"/><line x1="9" y1="11.5" x2="15" y2="11.5" stroke="#c98" stroke-width="1"/><line x1="9" y1="14.5" x2="13" y2="14.5" stroke="#c98" stroke-width="1"/>', '#fbe6e1'),
    // 英文：ABC（藍底）
    english: badge('<text x="12" y="16" font-size="9" fill="#2f6f9e" font-weight="bold" text-anchor="middle" font-family="system-ui">Aa</text>', '#dbeaf2'),
    // 物理：原子（黃底）
    physics: badge('<circle cx="12" cy="12" r="2" fill="#c94f3d"/>' +
      '<g fill="none" stroke="#7a5da0" stroke-width="1.3"><ellipse cx="12" cy="12" rx="8" ry="3.2"/><ellipse cx="12" cy="12" rx="8" ry="3.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="8" ry="3.2" transform="rotate(120 12 12)"/></g>', '#f3ead7'),
    // 化學：燒瓶（綠底）
    chemistry: badge('<path d="M10 4 v5 L6 17 a1.5 1.5 0 0 0 1.4 2 h9.2 a1.5 1.5 0 0 0 1.4 -2 L14 9 V4" fill="#bfe3c8" stroke="#3f7a52" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<line x1="9.5" y1="4" x2="14.5" y2="4" stroke="#3f7a52" stroke-width="1.6" stroke-linecap="round"/><circle cx="11" cy="15" r="1" fill="#c94f3d"/><circle cx="14" cy="16.5" r="0.8" fill="#d99a3a"/>', '#e6f4ea'),
    // 生物：DNA（粉綠底）
    biology: badge('<g stroke="#3f7a52" stroke-width="1.4" fill="none" stroke-linecap="round"><path d="M9 4 C16 8 8 12 15 16 C8 18 16 20 9 20"/><path d="M15 4 C8 8 16 12 9 16 C16 18 8 20 15 20"/></g>' +
      '<line x1="10" y1="7" x2="14" y2="7.6" stroke="#c94f3d" stroke-width="1.1"/><line x1="10.5" y1="12" x2="13.5" y2="12" stroke="#c94f3d" stroke-width="1.1"/><line x1="10" y1="17" x2="14" y2="16.4" stroke="#c94f3d" stroke-width="1.1"/>', '#e6f4ea'),
    // 地球科學：地球（藍底）
    earth: badge('<circle cx="12" cy="12" r="7.5" fill="#8fb4c9" stroke="#2f6f9e" stroke-width="1.4"/>' +
      '<path d="M6 10 q3 -2 6 0 t6 0" fill="none" stroke="#3f7a52" stroke-width="1.3"/><path d="M7 14 q4 2 9 0" fill="none" stroke="#3f7a52" stroke-width="1.3"/><circle cx="10" cy="9" r="1.4" fill="#5c8a6a"/>', '#dbeaf2')
  };
  D.subjectIcon = function (id) { return SUBJECT_ICONS[id] || ""; };
  D.hasSubjectIcon = function (id) { return !!SUBJECT_ICONS[id]; };

  window.DIAGRAMS = D;
})();
