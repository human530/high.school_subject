/* ============================================================
 * diagrams.js — 圖解分析教學：純 SVG 手繪圖（離線、零相依）
 * 每個 key 對應一張說明該章核心觀念的圖，回傳 SVG 字串。
 * 設計成「看圖就懂」：大字、箭頭、顏色標註、白話文字標籤。
 * 在 app.js 章節頁以 DIAGRAMS.render(chapter.diagram) 插入。
 * ============================================================ */
(function () {
  // 共用樣式：深色背景上的亮色線條
  var C = {
    axis: "#8b93c9", grid: "#2c3160", ink: "#e8eaf6",
    a: "#6366f1", b: "#22c55e", c: "#f59e0b", d: "#ef4444",
    hl: "#a5b4fc", paper: "#0c0f24"
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

  D.render = function (key) {
    if (!key || !D[key]) return "";
    try { return D[key](); } catch (e) { return ""; }
  };
  D.has = function (key) { return !!(key && D[key]); };

  window.DIAGRAMS = D;
})();
