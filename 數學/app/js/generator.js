/* ============================================================
 * generator.js — 引擎①：離線參數化題庫
 * 每個 generator 回傳 {q, hint, sol, answer, topic}
 * 數字隨機，但盡量讓答案為整數/最簡，方便自我檢查。
 * ============================================================ */
(function () {
  function ri(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; } // 含端點整數
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  function sign(n) { return n < 0 ? "-" : "+"; }

  var G = {};

  /* ---------- 第一冊 ---------- */
  G.absLinearIneq = function () {
    var a = ri(2, 5), b = ri(1, 9), r = ri(3, 12);
    var lo = (b - r) / a, hi = (b + r) / a;
    return {
      topic: "絕對值不等式",
      q: "解不等式 $|" + a + "x-" + b + "|\\le" + r + "$。",
      hint: "$|A|\\le r\\Rightarrow -r\\le A\\le r$。",
      sol: "$-" + r + "\\le " + a + "x-" + b + "\\le " + r + "$ ⇒ " +
        (b - r) + "\\le " + a + "x\\le " + (b + r) + "$ ⇒ $" +
        fmt(lo) + "\\le x\\le " + fmt(hi) + "$。",
      answer: "$" + fmt(lo) + "\\le x\\le " + fmt(hi) + "$"
    };
  };
  G.quadIneq = function () {
    var p = ri(-5, 0), q = ri(1, 6); // 兩根 p<q
    var b = -(p + q), c = p * q;
    return {
      topic: "二次不等式",
      q: "解 $x^2" + termPM(b, "x") + termPM(c, "") + "<0$。",
      hint: "因式分解找兩根，小於取中間。",
      sol: "$(x-(" + p + "))(x-(" + q + "))<0$，兩根 $" + p + "," + q + "$，取中間 ⇒ $" + p + "<x<" + q + "$。",
      answer: "$" + p + "<x<" + q + "$"
    };
  };
  G.remainderTheorem = function () {
    var a = ri(1, 4), c2 = ri(-3, 3), c1 = ri(-4, 4), c0 = ri(-5, 5);
    var val = c2 * a * a * a + c1 * a + c0; // f(x)=c2 x^3 + c1 x + c0
    return {
      topic: "餘式定理",
      q: "求 $f(x)=" + c2 + "x^3" + termPM(c1, "x") + termPM(c0, "") + "$ 除以 $(x-" + a + ")$ 的餘數。",
      hint: "餘數 = $f(" + a + ")$，直接代入。",
      sol: "$f(" + a + ")=" + c2 + "\\cdot" + a + "^3" + termPM(c1 * a, "") + termPM(c0, "") + "=" + val + "$。",
      answer: "$" + val + "$"
    };
  };
  G.synthFactor = function () {
    var root = ri(-3, 3) || 1, k;
    // f(x)=x^3 + b x + c, 使 (x-root) 為因式: f(root)=0 -> c = -(root^3 + b*root)
    var b = ri(-5, 5); var c = -(root * root * root + b * root);
    return {
      topic: "因式定理",
      q: "已知 $(x-(" + root + "))$ 是 $f(x)=x^3" + termPM(b, "x") + "+k$ 的因式，求常數 $k$。",
      hint: "因式定理：$f(" + root + ")=0$。",
      sol: "$f(" + root + ")=" + (root * root * root) + termPM(b * root, "") + "+k=0\\Rightarrow k=" + c + "$。",
      answer: "$k=" + c + "$"
    };
  };
  G.logSimplify = function () {
    var base = pick([2, 3, 5, 10]), n = ri(2, 4);
    var val = Math.pow(base, n);
    return {
      topic: "對數化簡",
      q: "計算 $\\log_{" + base + "} " + val + "$。",
      hint: "把 " + val + " 寫成 $" + base + "$ 的次方。",
      sol: "$" + val + "=" + base + "^{" + n + "}$，故 $\\log_{" + base + "}" + base + "^{" + n + "}=" + n + "$。",
      answer: "$" + n + "$"
    };
  };
  G.expEquation = function () {
    var base = pick([2, 3, 5]), x = ri(2, 5);
    var val = Math.pow(base, x);
    return {
      topic: "指數方程式",
      q: "解 $" + base + "^x=" + val + "$。",
      hint: "兩邊化成同底比次方。",
      sol: "$" + base + "^x=" + base + "^{" + x + "}\\Rightarrow x=" + x + "$。",
      answer: "$x=" + x + "$"
    };
  };

  /* ---------- 第二冊 ---------- */
  G.arithSeq = function () {
    var a1 = ri(1, 8), d = ri(2, 6), n = ri(8, 15);
    var an = a1 + (n - 1) * d, sn = n * (a1 + an) / 2;
    return {
      topic: "等差數列",
      q: "等差數列 $a_1=" + a1 + ",\\ d=" + d + "$，求 $a_{" + n + "}$ 與 $S_{" + n + "}$。",
      hint: "$a_n=a_1+(n-1)d$；$S_n=\\frac{n(a_1+a_n)}2$。",
      sol: "$a_{" + n + "}=" + a1 + "+" + (n - 1) + "\\cdot" + d + "=" + an + "$；$S_{" + n + "}=\\frac{" + n + "(" + a1 + "+" + an + ")}2=" + sn + "$。",
      answer: "$a_{" + n + "}=" + an + ",\\ S_{" + n + "}=" + sn + "$"
    };
  };
  G.geoSum = function () {
    var a1 = pick([8, 9, 12, 16, 27]), r = pick(["1/2", "1/3", "2/3"]);
    var rv = r === "1/2" ? 0.5 : r === "1/3" ? 1 / 3 : 2 / 3;
    var S = a1 / (1 - rv);
    return {
      topic: "無窮等比和",
      q: "求無窮等比級數 $" + a1 + "+" + a1 + "\\cdot(" + r + ")+\\cdots$（公比 $" + r + "$）之和。",
      hint: "$|r|<1$ 時 $S=\\frac{a_1}{1-r}$。",
      sol: "$S=\\dfrac{" + a1 + "}{1-" + r + "}=" + fmt(S) + "$。",
      answer: "$" + fmt(S) + "$"
    };
  };
  G.permComb = function () {
    var n = ri(5, 9), r = ri(2, 3), perm = pick([true, false]);
    var P = 1; for (var i = 0; i < r; i++) P *= (n - i);
    var fact = 1; for (var j = 1; j <= r; j++) fact *= j;
    var C = P / fact;
    return {
      topic: perm ? "排列" : "組合",
      q: "從 " + n + " 人中選 " + r + " 人" + (perm ? "排成一列" : "當代表（不分先後）") + "，有幾種？",
      hint: perm ? "順序有差 → 排列 $P^n_r$。" : "順序無差 → 組合 $C^n_r$。",
      sol: perm
        ? "$P^{" + n + "}_{" + r + "}=" + Array.from({ length: r }, function (_, k) { return n - k; }).join("\\cdot") + "=" + P + "$。"
        : "$C^{" + n + "}_{" + r + "}=\\frac{" + P + "}{" + fact + "}=" + C + "$。",
      answer: "$" + (perm ? P : C) + "$"
    };
  };
  G.binomTerm = function () {
    var a = ri(2, 3), n = ri(4, 6), pw = ri(1, n - 1);
    // (a x + 1)^n 中 x^pw 係數 = C(n,pw) a^pw
    var r = pw; var C = comb(n, r); var coef = C * Math.pow(a, r);
    return {
      topic: "二項式定理",
      q: "求 $(" + a + "x+1)^{" + n + "}$ 展開式中 $x^{" + pw + "}$ 的係數。",
      hint: "第 $r+1$ 項 $C^n_r(" + a + "x)^{r}$，取 $r=" + pw + "$。",
      sol: "$C^{" + n + "}_{" + r + "}(" + a + ")^{" + r + "}=" + C + "\\cdot" + Math.pow(a, r) + "=" + coef + "$。",
      answer: "$" + coef + "$"
    };
  };
  G.diceProb = function () {
    var target = ri(4, 10);
    var ways = 0; for (var x = 1; x <= 6; x++)for (var y = 1; y <= 6; y++) if (x + y === target) ways++;
    var g = gcd(ways, 36);
    return {
      topic: "骰子機率",
      q: "擲兩顆公正骰子，點數和為 " + target + " 的機率。",
      hint: "樣本 36 種，數出符合的組合數。",
      sol: "符合的有 " + ways + " 種，機率 $\\frac{" + ways + "}{36}=\\frac{" + (ways / g) + "}{" + (36 / g) + "}$。",
      answer: "$\\frac{" + (ways / g) + "}{" + (36 / g) + "}$"
    };
  };
  G.drawBalls = function () {
    var red = ri(3, 5), white = ri(2, 4), tot = red + white;
    var num = comb(red, 2), den = comb(tot, 2), g = gcd(num, den);
    return {
      topic: "取球機率",
      q: "袋中 " + red + " 紅 " + white + " 白共 " + tot + " 球，一次取 2 球，皆為紅球的機率。",
      hint: "$\\frac{C^{紅}_2}{C^{總}_2}$。",
      sol: "$\\frac{C^{" + red + "}_2}{C^{" + tot + "}_2}=\\frac{" + num + "}{" + den + "}=\\frac{" + (num / g) + "}{" + (den / g) + "}$。",
      answer: "$\\frac{" + (num / g) + "}{" + (den / g) + "}$"
    };
  };
  G.meanStd = function () {
    var start = ri(1, 5), d = ri(1, 3), n = 5;
    var arr = []; for (var i = 0; i < n; i++) arr.push(start + i * d);
    var mean = arr.reduce(function (a, b) { return a + b; }, 0) / n;
    var v = arr.reduce(function (a, b) { return a + b * b; }, 0) / n - mean * mean;
    return {
      topic: "平均與標準差",
      q: "資料 " + arr.join(", ") + " 的平均數與標準差。",
      hint: "$\\sigma^2=\\overline{x^2}-\\bar x^2$。",
      sol: "$\\bar x=" + fmt(mean) + "$；變異數 $=" + fmt(v) + "$，標準差 $=" + fmt(Math.sqrt(v)) + "$。",
      answer: "$\\bar x=" + fmt(mean) + ",\\ \\sigma=" + fmt(Math.sqrt(v)) + "$"
    };
  };
  G.regLine = function () {
    var sx = ri(2, 6), sy = ri(2, 6), r = pick([0.5, 0.6, 0.8, -0.5, -0.4]);
    var slope = r * sy / sx;
    return {
      topic: "迴歸直線",
      q: "$x$ 標準差 " + sx + "、$y$ 標準差 " + sy + "、相關係數 $r=" + r + "$，求 $y$ 對 $x$ 迴歸直線斜率。",
      hint: "斜率 $=r\\frac{\\sigma_y}{\\sigma_x}$。",
      sol: "$" + r + "\\times\\frac{" + sy + "}{" + sx + "}=" + fmt(slope) + "$。",
      answer: "$" + fmt(slope) + "$"
    };
  };

  /* ---------- 第三冊 ---------- */
  G.cosineLaw = function () {
    var a = ri(3, 8), b = ri(3, 8), C = pick([60, 120]);
    var cosC = C === 60 ? 0.5 : -0.5;
    var c2 = a * a + b * b - 2 * a * b * cosC;
    return {
      topic: "餘弦定理",
      q: "三角形兩邊 $a=" + a + ",b=" + b + "$，夾角 $C=" + C + "°$，求第三邊 $c$。",
      hint: "$c^2=a^2+b^2-2ab\\cos C$。",
      sol: "$c^2=" + (a * a) + "+" + (b * b) + "-2\\cdot" + a + "\\cdot" + b + "\\cdot(" + cosC + ")=" + c2 + "$，$c=\\sqrt{" + c2 + "}=" + fmt(Math.sqrt(c2)) + "$。",
      answer: "$c=" + fmt(Math.sqrt(c2)) + "$"
    };
  };
  G.triArea = function () {
    var a = ri(4, 10), b = ri(4, 10), C = pick([30, 90, 150]);
    var sinC = C === 90 ? 1 : 0.5;
    var area = 0.5 * a * b * sinC;
    return {
      topic: "三角形面積",
      q: "三角形 $a=" + a + ",b=" + b + ",C=" + C + "°$，求面積。",
      hint: "$\\frac12 ab\\sin C$。",
      sol: "$\\frac12\\cdot" + a + "\\cdot" + b + "\\cdot" + sinC + "=" + fmt(area) + "$。",
      answer: "$" + fmt(area) + "$"
    };
  };
  G.radDeg = function () {
    var deg = pick([30, 45, 60, 120, 135, 150, 180, 270]);
    var g = gcd(deg, 180);
    return {
      topic: "弧度換算",
      q: "將 $" + deg + "°$ 換成弧度。",
      hint: "$\\times\\frac{\\pi}{180}$。",
      sol: "$" + deg + "\\cdot\\frac{\\pi}{180}=\\frac{" + (deg / g) + "\\pi}{" + (180 / g) + "}$。",
      answer: "$\\frac{" + (deg / g) + "\\pi}{" + (180 / g) + "}$"
    };
  };
  G.amplitude = function () {
    var a = ri(2, 8), b = ri(2, 8);
    var amp = Math.sqrt(a * a + b * b);
    return {
      topic: "正餘弦疊合",
      q: "求 $" + a + "\\sin\\theta+" + b + "\\cos\\theta$ 的最大值。",
      hint: "疊合最大值 $=\\sqrt{a^2+b^2}$。",
      sol: "$\\sqrt{" + (a * a) + "+" + (b * b) + "}=\\sqrt{" + (a * a + b * b) + "}=" + fmt(amp) + "$。",
      answer: "$" + fmt(amp) + "$"
    };
  };
  G.pointLineDist = function () {
    var a = ri(1, 4), b = ri(1, 4), c = ri(-6, 6), x0 = ri(-3, 3), y0 = ri(-3, 3);
    var num = Math.abs(a * x0 + b * y0 + c), den = Math.sqrt(a * a + b * b);
    return {
      topic: "點到直線距離",
      q: "點 $(" + x0 + "," + y0 + ")$ 到直線 $" + a + "x" + termPM(b, "y") + termPM(c, "") + "=0$ 的距離。",
      hint: "$d=\\frac{|ax_0+by_0+c|}{\\sqrt{a^2+b^2}}$。",
      sol: "$\\frac{|" + (a * x0) + termPM(b * y0, "") + termPM(c, "") + "|}{\\sqrt{" + (a * a + b * b) + "}}=\\frac{" + num + "}{\\sqrt{" + (a * a + b * b) + "}}=" + fmt(num / den) + "$。",
      answer: "$\\frac{" + num + "}{\\sqrt{" + (a * a + b * b) + "}}$"
    };
  };
  G.circleLine = function () {
    var r = ri(2, 6);
    return {
      topic: "圓與切線",
      q: "圓 $x^2+y^2=" + (r * r) + "$ 與直線 $x+y=k$ 相切，求 $k$。",
      hint: "圓心 (0,0) 到直線距離 = 半徑。",
      sol: "$\\frac{|k|}{\\sqrt2}=" + r + "\\Rightarrow|k|=" + r + "\\sqrt2$，$k=\\pm" + r + "\\sqrt2$。",
      answer: "$k=\\pm" + r + "\\sqrt2$"
    };
  };
  G.dotProduct = function () {
    var a1 = ri(1, 5), a2 = ri(1, 5), b1 = ri(1, 5), b2 = ri(1, 5);
    var dot = a1 * b1 + a2 * b2, len = Math.sqrt(a1 * a1 + a2 * a2);
    return {
      topic: "向量內積",
      q: "$\\vec a=(" + a1 + "," + a2 + "),\\vec b=(" + b1 + "," + b2 + ")$，求 $\\vec a\\cdot\\vec b$ 與 $|\\vec a|$。",
      hint: "內積座標相乘相加；長度為平方和開根。",
      sol: "$\\vec a\\cdot\\vec b=" + (a1 * b1) + "+" + (a2 * b2) + "=" + dot + "$；$|\\vec a|=\\sqrt{" + (a1 * a1 + a2 * a2) + "}=" + fmt(len) + "$。",
      answer: "$\\vec a\\cdot\\vec b=" + dot + ",\\ |\\vec a|=" + fmt(len) + "$"
    };
  };
  G.perpVector = function () {
    var a1 = ri(2, 5), b1 = ri(1, 5), b2 = ri(1, 5);
    // a=(a1,k), b=(b1,b2), 垂直 -> a1*b1 + k*b2 =0 -> k = -a1*b1/b2 ; 取整除
    var k = -(a1 * b1) / b2;
    while (!Number.isInteger(k)) { b2 = ri(1, 5); k = -(a1 * b1) / b2; }
    return {
      topic: "向量垂直",
      q: "求使 $\\vec a=(" + a1 + ",k)$ 與 $\\vec b=(" + b1 + "," + b2 + ")$ 垂直的 $k$。",
      hint: "垂直 ⇔ 內積 = 0。",
      sol: "$" + (a1 * b1) + "+" + b2 + "k=0\\Rightarrow k=" + k + "$。",
      answer: "$k=" + k + "$"
    };
  };

  /* ---------- 第四冊 ---------- */
  G.dot3D = function () {
    var a = [ri(1, 4), ri(1, 4), ri(1, 4)], b = [ri(1, 4), ri(1, 4), ri(1, 4)];
    var dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    return {
      topic: "空間向量內積",
      q: "$\\vec a=(" + a + "),\\vec b=(" + b + ")$，求 $\\vec a\\cdot\\vec b$。",
      hint: "三項相乘相加。",
      sol: "$" + a[0] + "\\cdot" + b[0] + "+" + a[1] + "\\cdot" + b[1] + "+" + a[2] + "\\cdot" + b[2] + "=" + dot + "$。",
      answer: "$" + dot + "$"
    };
  };
  G.dist3D = function () {
    // 製造畢氏整數距離: 用隨機後直接算
    var A = [ri(0, 3), ri(0, 3), ri(0, 3)];
    var d = pick([[2, 1, 2], [1, 2, 2], [2, 2, 1], [3, 0, 4], [0, 3, 4]]);
    var B = [A[0] + d[0], A[1] + d[1], A[2] + d[2]];
    var dist = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
    return {
      topic: "空間兩點距離",
      q: "$A(" + A + "),B(" + B + ")$，求 $|\\overline{AB}|$。",
      hint: "座標差平方和開根。",
      sol: "$\\sqrt{" + (d[0] * d[0]) + "+" + (d[1] * d[1]) + "+" + (d[2] * d[2]) + "}=\\sqrt{" + (d[0] * d[0] + d[1] * d[1] + d[2] * d[2]) + "}=" + fmt(dist) + "$。",
      answer: "$" + fmt(dist) + "$"
    };
  };
  G.planeEq = function () {
    var n = [ri(1, 3), ri(-3, 3), ri(1, 3)], p = [ri(-2, 2), ri(-2, 2), ri(-2, 2)];
    var d = n[0] * p[0] + n[1] * p[1] + n[2] * p[2];
    return {
      topic: "平面方程式",
      q: "求過 $(" + p + ")$ 且法向量 $(" + n + ")$ 的平面方程式。",
      hint: "$a(x-x_0)+b(y-y_0)+c(z-z_0)=0$。",
      sol: "$" + n[0] + "x" + termPM(n[1], "y") + termPM(n[2], "z") + "=" + d + "$。",
      answer: "$" + n[0] + "x" + termPM(n[1], "y") + termPM(n[2], "z") + "=" + d + "$"
    };
  };
  G.pointPlaneDist = function () {
    var n = pick([[2, 1, 2], [1, 2, 2], [2, 2, 1]]), d = ri(3, 12) * 3;
    // 點取原點，距離 = |d|/3
    var dist = d / Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
    return {
      topic: "點到平面距離",
      q: "原點到平面 $" + n[0] + "x+" + n[1] + "y+" + n[2] + "z=" + d + "$ 的距離。",
      hint: "$d=\\frac{|...|}{\\sqrt{a^2+b^2+c^2}}$。",
      sol: "$\\frac{" + d + "}{\\sqrt{" + (n[0] * n[0] + n[1] * n[1] + n[2] * n[2]) + "}}=\\frac{" + d + "}{3}=" + fmt(dist) + "$。",
      answer: "$" + fmt(dist) + "$"
    };
  };
  G.determinant = function () {
    var a = ri(1, 6), b = ri(1, 6), c = ri(1, 6), d = ri(1, 6);
    return {
      topic: "行列式",
      q: "求 $\\det\\begin{pmatrix}" + a + "&" + b + "\\\\" + c + "&" + d + "\\end{pmatrix}$。",
      hint: "$ad-bc$。",
      sol: "$" + a + "\\cdot" + d + "-" + b + "\\cdot" + c + "=" + (a * d - b * c) + "$。",
      answer: "$" + (a * d - b * c) + "$"
    };
  };
  G.matrixSolve = function () {
    var x = ri(1, 4), y = ri(1, 4);
    var a = 1, b = ri(1, 3), c = ri(2, 4), d = ri(1, 3);
    while (a * d - b * c === 0) { d = ri(1, 4); }
    var e = a * x + b * y, f = c * x + d * y;
    return {
      topic: "矩陣解聯立",
      q: "用反矩陣解 $\\begin{cases}" + a + "x+" + b + "y=" + e + "\\\\" + c + "x+" + d + "y=" + f + "\\end{cases}$。",
      hint: "$\\vec x=A^{-1}\\vec b$，$\\det=ad-bc$。",
      sol: "$\\det=" + (a * d - b * c) + "$，解得 $x=" + x + ",\\ y=" + y + "$。",
      answer: "$x=" + x + ",\\ y=" + y + "$"
    };
  };

  /* ---------- 工具 ---------- */
  function comb(n, r) { var p = 1, f = 1; for (var i = 0; i < r; i++) { p *= (n - i); f *= (i + 1); } return p / f; }
  function fmt(x) {
    if (Number.isInteger(x)) return String(x);
    var r = Math.round(x * 1000) / 1000;
    return String(r);
  }
  function termPM(coef, v) {
    if (coef === 0) return "";
    var s = coef > 0 ? "+" : "-";
    var a = Math.abs(coef);
    if (v && a === 1) return s + v;
    return s + a + v;
  }

  window.GENERATORS = G;
  window.GENERATOR_KEYS = Object.keys(G);
})();
