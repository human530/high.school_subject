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
    var a = ri(1, 4), c2 = pick([1, 2, 3]), c1 = ri(-4, 4), c0 = ri(-5, 5); // c2 為非零正整數，確保確實是三次式
    var val = c2 * a * a * a + c1 * a + c0; // f(x)=c2 x^3 + c1 x + c0
    var lead = (c2 === 1 ? "" : c2) + "x^3";  // 首項係數 1 不顯示
    return {
      topic: "餘式定理",
      q: "求 $f(x)=" + lead + termPM(c1, "x") + termPM(c0, "") + "$ 除以 $(x-" + a + ")$ 的餘數。",
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
    var num = deg / g, den = 180 / g;       // 約分後 (num/den)·π
    var coef = num === 1 ? "\\pi" : num + "\\pi";
    var rad = den === 1 ? coef : "\\frac{" + coef + "}{" + den + "}"; // 分母為 1 不顯示分數
    return {
      topic: "弧度換算",
      q: "將 $" + deg + "°$ 換成弧度。",
      hint: "$\\times\\frac{\\pi}{180}$。",
      sol: "$" + deg + "\\cdot\\frac{\\pi}{180}=" + rad + "$。",
      answer: "$" + rad + "$"
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

  /* ---------- 物理 ---------- */
  G.phKinematics = function () {
    var v0 = ri(0, 8), a = ri(1, 5), t = ri(2, 6);
    var v = v0 + a * t;
    return { topic: "等加速運動", q: "初速 $" + v0 + "\\,m/s$，加速度 $" + a + "\\,m/s^2$，經過 $" + t + "$ 秒，末速為？",
      hint: "$v=v_0+at$。", sol: "$v=" + v0 + "+" + a + "\\times" + t + "=" + v + "\\,m/s$。", answer: "$" + v + "\\,m/s$" };
  };
  G.phNewton = function () {
    var m = ri(1, 6), a = ri(1, 6), F = m * a;
    return { topic: "牛頓第二定律", q: "質量 $" + m + "\\,kg$ 物體受淨力 $" + F + "\\,N$，加速度為？",
      hint: "$a=F/m$。", sol: "$a=" + F + "/" + m + "=" + a + "\\,m/s^2$。", answer: "$" + a + "\\,m/s^2$" };
  };
  G.phKinetic = function () {
    var m = ri(1, 5), v = ri(2, 6), ke = 0.5 * m * v * v;
    return { topic: "動能", q: "質量 $" + m + "\\,kg$、速度 $" + v + "\\,m/s$ 的動能為？",
      hint: "$KE=\\frac12 mv^2$。", sol: "$\\frac12\\times" + m + "\\times" + v + "^2=" + fmt(ke) + "\\,J$。", answer: "$" + fmt(ke) + "\\,J$" };
  };
  G.phFreeFall = function () {
    var h = pick([5, 10, 20, 45, 80]); var g = 10; var v = Math.sqrt(2 * g * h);
    return { topic: "自由落體", q: "物體自 $" + h + "\\,m$ 高自由落下，落地速度為？(g=10)",
      hint: "能量守恆 $v=\\sqrt{2gh}$。", sol: "$v=\\sqrt{2\\times10\\times" + h + "}=\\sqrt{" + (2 * g * h) + "}=" + fmt(v) + "\\,m/s$。", answer: "$" + fmt(v) + "\\,m/s$" };
  };
  G.phOhm = function () {
    var I = ri(1, 6), R = ri(2, 10), V = I * R;
    return { topic: "歐姆定律", q: "電阻 $" + R + "\\,\\Omega$ 通過 $" + I + "\\,A$ 電流，電壓為？",
      hint: "$V=IR$。", sol: "$V=" + I + "\\times" + R + "=" + V + "\\,V$。", answer: "$" + V + "\\,V$" };
  };
  G.phPower = function () {
    var I = ri(1, 5), R = ri(2, 8), P = I * I * R;
    return { topic: "電功率", q: "電流 $" + I + "\\,A$ 流過 $" + R + "\\,\\Omega$ 電阻，消耗功率為？",
      hint: "$P=I^2R$。", sol: "$P=" + I + "^2\\times" + R + "=" + P + "\\,W$。", answer: "$" + P + "\\,W$" };
  };
  G.phWave = function () {
    var f = pick([100, 200, 250, 500]), lam = pick([0.5, 0.68, 1, 1.5, 2]); var v = f * lam;
    return { topic: "波速", q: "頻率 $" + f + "\\,Hz$、波長 $" + lam + "\\,m$ 的波，波速為？",
      hint: "$v=f\\lambda$。", sol: "$v=" + f + "\\times" + lam + "=" + fmt(v) + "\\,m/s$。", answer: "$" + fmt(v) + "\\,m/s$" };
  };

  /* ---------- 化學 ---------- */
  G.chMole = function () {
    var M = pick([18, 44, 28, 32, 16, 40]); var n = ri(1, 5); var m = M * n;
    var names = { 18: "H₂O", 44: "CO₂", 28: "N₂", 32: "O₂", 16: "CH₄", 40: "NaOH" };
    return { topic: "莫耳計算", q: "$" + m + "\\,g$ 的 " + names[M] + "（M=" + M + "）是幾莫耳？",
      hint: "$n=m/M$。", sol: "$n=" + m + "/" + M + "=" + n + "\\,mol$。", answer: "$" + n + "\\,mol$" };
  };
  G.chPH = function () {
    var p = ri(1, 6);
    return { topic: "pH 計算", q: "$[H^+]=10^{-" + p + "}\\,M$ 的溶液，pH 為？",
      hint: "$pH=-\\log[H^+]$。", sol: "$pH=-\\log10^{-" + p + "}=" + p + "$（" + (p < 7 ? "酸性" : "中/鹼") + "）。", answer: "$pH=" + p + "$" };
  };

  /* ---------- 國文 ---------- */
  G.zhIdiom = function () {
    var pool = [
      { w: "罄竹難書", m: "罪狀極多（貶義）", good: false },
      { w: "汗牛充棟", m: "書籍極多", good: true },
      { w: "炙手可熱", m: "權勢極盛、氣焰高張（多貶）", good: false },
      { w: "鳳毛麟角", m: "稀少而珍貴", good: true },
      { w: "差強人意", m: "大致還能令人滿意", good: true },
      { w: "首當其衝", m: "最先受到攻擊或災難", good: false },
      { w: "目無全牛", m: "技藝純熟到極點", good: true },
      { w: "曾幾何時", m: "時間過去沒多久", good: true }
    ];
    var it = pick(pool);
    var others = pool.filter(function (p) { return p.w !== it.w; });
    var d1 = pick(others), d2 = pick(others.filter(function (p) { return p.w !== d1.w; }));
    var opts = pick([[it.m, d1.m, d2.m], [d1.m, it.m, d2.m], [d1.m, d2.m, it.m]]);
    var labels = ["(A)", "(B)", "(C)"];
    var ans = labels[opts.indexOf(it.m)];
    return {
      topic: "成語辨義",
      q: "「" + it.w + "」的意思最接近？ " + opts.map(function (o, i) { return labels[i] + o; }).join("　"),
      hint: "先想字面，再判褒貶與適用對象。",
      sol: "「" + it.w + "」意為：" + it.m + "，故選 " + ans + "。",
      answer: ans + " " + it.m
    };
  };
  G.zhPair = function () {
    var pool = [
      { a: "美輪美奐", note: "形容建築高大華美", wrong: "美侖美奐" },
      { a: "張惶失措", wrong: "張皇失措", note: "正確應為『張皇失措』" }
    ];
    // 簡化為字音題
    var words = [
      { w: "強", a: "ㄑㄧㄤˊ", ex: "強壯" }, { w: "強", a: "ㄑㄧㄤˇ", ex: "勉強" },
      { w: "強", a: "ㄐㄧㄤˋ", ex: "倔強" }
    ];
    var it = pick(words);
    return {
      topic: "字音",
      q: "「" + it.ex + "」的「" + it.w + "」讀音為？(A)" + it.a + " (B)其他音",
      hint: "用造詞代入唸唸看。",
      sol: "「" + it.ex + "」的「" + it.w + "」讀作 " + it.a + "，選 (A)。",
      answer: "(A) " + it.a
    };
  };

  /* ---------- 英文 ---------- */
  G.enRoot = function () {
    var pool = [
      { w: "predict", pre: "pre-(前)", root: "dict(說)", m: "預測" },
      { w: "export", pre: "ex-(出)", root: "port(帶)", m: "出口" },
      { w: "inspect", pre: "in-(內)", root: "spect(看)", m: "檢視" },
      { w: "reject", pre: "re-(回)", root: "ject(丟)", m: "拒絕" },
      { w: "describe", pre: "de-(下)", root: "scrib(寫)", m: "描述" },
      { w: "transport", pre: "trans-(跨)", root: "port(帶)", m: "運輸" }
    ];
    var it = pick(pool);
    return {
      topic: "字根字首",
      q: "'" + it.w + "' 由 " + it.pre + " + " + it.root + " 組成，意思最可能是？",
      hint: "把字首與字根的意思合起來。",
      sol: it.pre + " + " + it.root + " → " + it.m + " (" + it.w + ")。",
      answer: it.m + " (" + it.w + ")"
    };
  };
  G.enTense = function () {
    var pool = [
      { adv: "since 2020", t: "have lived", why: "since 表持續到現在 → 現在完成式" },
      { adv: "yesterday", t: "lived", why: "明確過去時間 → 過去式" },
      { adv: "every day", t: "live", why: "習慣 → 現在簡單式" },
      { adv: "right now", t: "am living", why: "此刻進行 → 現在進行式" },
      { adv: "tomorrow", t: "will live", why: "未來 → will + 原形" }
    ];
    var it = pick(pool);
    return {
      topic: "時態判斷",
      q: "I ____ here " + it.adv + ". 動詞 live 該用哪種時態形式？",
      hint: "看時間副詞決定時態。",
      sol: it.why + "，故用 '" + it.t + "'。",
      answer: it.t
    };
  };

  /* ---------- 生物 ---------- */
  G.bioPunnett = function () {
    // Aa × Aa 型或單基因；輸出表現型比例
    var cases = [
      { cross: "Aa × Aa", ratio: "顯性:隱性 = 3:1", geno: "1AA:2Aa:1aa" },
      { cross: "Aa × aa", ratio: "顯性:隱性 = 1:1", geno: "1Aa:1aa" },
      { cross: "AA × aa", ratio: "全為顯性", geno: "全 Aa" }
    ];
    var it = pick(cases);
    return {
      topic: "遺傳比例",
      q: it.cross + " 雜交，後代表現型比例為？",
      hint: "畫旁氏表(Punnett square)數格子。",
      sol: "基因型 " + it.geno + " → 表現型 " + it.ratio + "。",
      answer: it.ratio
    };
  };
  G.bioDNA = function () {
    var a = pick([15, 20, 25, 30, 35, 40]);
    var gc = (100 - 2 * a) / 2;
    return {
      topic: "DNA 配對",
      q: "某 DNA 中腺嘌呤(A)占 " + a + "%，則鳥糞嘌呤(G)占多少%？",
      hint: "A=T、G=C，四者相加 100%。",
      sol: "A=T=" + a + "%，所以 G+C=" + (100 - 2 * a) + "%，G=C=" + gc + "%。",
      answer: gc + "%"
    };
  };
  G.bioEnergy = function () {
    var start = pick([1000, 2000, 5000, 8000]);
    var lv = pick([1, 2]);
    var end = start * Math.pow(0.1, lv);
    return {
      topic: "能量金字塔",
      q: "生產者有 " + start + " 單位能量，依十分之一法則，第 " + (lv + 1) + " 營養階可得約多少能量？",
      hint: "每升一層約剩 10%。",
      sol: start + " × 0.1" + (lv === 2 ? " × 0.1" : "") + " = " + end + " 單位。",
      answer: end + " 單位"
    };
  };

  /* ---------- 地球科學 ---------- */
  G.esLapse = function () {
    var h = pick([1, 2, 3, 4]); var drop = 6.5 * h;
    var ground = pick([20, 25, 30]);
    var top = (ground - drop).toFixed(1);
    return {
      topic: "氣溫遞減率",
      q: "地面氣溫 " + ground + "°C，對流層每升高 1 km 約降 6.5°C，則 " + h + " km 高空氣溫約為？",
      hint: "降溫 = 6.5 × 高度。",
      sol: "降溫 6.5×" + h + "=" + drop + "°C；" + ground + "−" + drop + "=" + top + "°C。",
      answer: top + "°C"
    };
  };
  G.esMoon = function () {
    var pool = [
      { d: "新月(朔)", pos: "月在太陽與地球之間，看不到亮面" },
      { d: "滿月(望)", pos: "地球在太陽與月之間，整面被照亮" },
      { d: "上弦月", pos: "傍晚見於西方天空，右半亮" },
      { d: "下弦月", pos: "清晨見於東方天空，左半亮" }
    ];
    var it = pick(pool);
    return {
      topic: "月相",
      q: "「" + it.d + "」時，月球相對太陽與地球的位置/特徵為？",
      hint: "想三者連線的位置。",
      sol: it.d + "：" + it.pos + "。",
      answer: it.pos
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
