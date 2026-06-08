/* 第三冊（高二上・數A）：三角、三角函數、直線與圓、平面向量 */
CURRICULUM.addBook({
  id: "b3",
  title: "第三冊・三角 / 三角函數 / 直線與圓 / 平面向量",
  chapters: [
    /* ---------------------------------------------------------- 3-1 */
    {
      id: "b3c1",
      title: "1. 三角比與正餘弦定理",
      tags: ["三角比", "正弦定理", "餘弦定理", "面積"],
      diagram: "righttri",
      deep: [
        { h: "學測陷阱：SSA 兩解問題", b: "正弦定理在『兩邊一對角(SSA)』時可能有兩個解(銳角或鈍角)，要回頭檢驗是否都成立。面積最常用 ½·ab·sinC，別只記底×高。" },
        { h: "解題步驟：依已知選定理", b: "先畫圖標已知：有『兩邊夾角』或『三邊』用餘弦定理；有『兩角一邊』或『兩邊一對角』用正弦定理。最大角一定對最大邊。" },
        { h: "技巧：海龍公式", b: "已知三邊求面積可用海龍公式 √(s(s−a)(s−b)(s−c))，s=(a+b+c)/2，免先求角。" }
      ],
      fiveYO:
        "直角三角形裡，sin、cos、tan 就是『邊長的比例』。" +
        "口訣 SOH-CAH-TOA：sin=對/斜、cos=鄰/斜、tan=對/鄰。記住這個就會一半了。",
      concepts: [
        { h: "銳角三角比", b: "$\\sin\\theta=\\frac{對}{斜}$、$\\cos\\theta=\\frac{鄰}{斜}$、$\\tan\\theta=\\frac{對}{鄰}$。" },
        { h: "特殊角", b: "$\\sin30°=\\frac12,\\sin45°=\\frac{\\sqrt2}2,\\sin60°=\\frac{\\sqrt3}2$（cos 反過來）。" },
        { h: "正弦定理", b: "$\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}=\\dfrac{c}{\\sin C}=2R$（R 為外接圓半徑）。" },
        { h: "餘弦定理", b: "$c^2=a^2+b^2-2ab\\cos C$，已知兩邊夾角求第三邊。" },
        { h: "面積", b: "$\\text{面積}=\\frac12 ab\\sin C$。" }
      ],
      tricks: [
        "已知兩角一邊 / 兩邊一對角 → 用正弦定理。",
        "已知兩邊夾角 / 三邊 → 用餘弦定理。",
        "求面積最常用 $\\frac12 ab\\sin C$（兩邊一夾角）。",
        "$\\sin^2\\theta+\\cos^2\\theta=1$ 是化簡萬用鑰匙。"
      ],
      formulas: [
        "$\\sin^2\\theta+\\cos^2\\theta=1$",
        "$\\dfrac{a}{\\sin A}=2R$",
        "$c^2=a^2+b^2-2ab\\cos C$"
      ],
      problems: [
        { type: "classic", q: "三角形兩邊 $a=5,b=8$，夾角 $C=60°$，求第三邊 $c$。",
          hint: "餘弦定理。",
          sol: "$c^2=25+64-2\\cdot5\\cdot8\\cdot\\frac12=89-40=49$，$c=7$。",
          answer: "$c=7$" },
        { type: "classic", q: "三角形 $a=6,b=8,C=30°$，求面積。",
          hint: "$\\frac12 ab\\sin C$。",
          sol: "$\\frac12\\cdot6\\cdot8\\cdot\\frac12=12$。",
          answer: "$12$" },
        { type: "gsat", q: "（學測風格）三角形 $A=45°,B=60°,a=\\sqrt6$，求 $b$。",
          hint: "正弦定理 $\\frac{a}{\\sin A}=\\frac{b}{\\sin B}$。",
          sol: "$b=a\\cdot\\frac{\\sin B}{\\sin A}=\\sqrt6\\cdot\\frac{\\sqrt3/2}{\\sqrt2/2}=\\sqrt6\\cdot\\frac{\\sqrt3}{\\sqrt2}=\\sqrt9=3$。",
          answer: "$b=3$" }
      ],
      generators: ["cosineLaw", "triArea"]
    },

    /* ---------------------------------------------------------- 3-2 */
    {
      id: "b3c2",
      title: "2. 三角函數（弧度、圖形、和差角、疊合）",
      tags: ["弧度", "和差角", "倍角", "疊合", "週期"],
      diagram: "unitcircle",
      deep: [
        { h: "學測陷阱：弧度與疊合開根號", b: "弧長 rθ、扇形面積 ½r²θ 的 θ 必須用弧度。疊合 a·sinx+b·cosx 的最大值是 √(a²+b²)，常見錯誤是忘了開根號。" },
        { h: "解題步驟：化簡再求值", b: "用和差角、倍角公式化簡後再求值或週期；cos2θ 有三種版本，挑與題目同名(sin 或 cos)的那一個代最快。" },
        { h: "技巧：週期與極值", b: "y=sin(kx) 的週期 = 2π/k；a·sinx+b·cosx 的值域是 [−√(a²+b²), √(a²+b²)]，求最值直接用。" }
      ],
      fiveYO:
        "把角度想成『繞圈圈轉了多少』。弧度是用『繞的弧長』來量角，整圈 $360°=2\\pi$ 弧度。" +
        "sin、cos 的圖形就像海浪，上上下下不斷重複。",
      concepts: [
        { h: "弧度量", b: "$180°=\\pi$ 弧度；弧長 $=r\\theta$，扇形面積 $=\\frac12 r^2\\theta$（$\\theta$ 用弧度）。" },
        { h: "和差角公式", b: "$\\sin(A\\pm B)=\\sin A\\cos B\\pm\\cos A\\sin B$；$\\cos(A\\pm B)=\\cos A\\cos B\\mp\\sin A\\sin B$。" },
        { h: "倍角公式", b: "$\\sin2\\theta=2\\sin\\theta\\cos\\theta$；$\\cos2\\theta=2\\cos^2\\theta-1=1-2\\sin^2\\theta$。" },
        { h: "正餘弦疊合", b: "$a\\sin\\theta+b\\cos\\theta=\\sqrt{a^2+b^2}\\sin(\\theta+\\varphi)$，最大值 $\\sqrt{a^2+b^2}$。" }
      ],
      tricks: [
        "角度↔弧度：乘 $\\frac{\\pi}{180}$ 或 $\\frac{180}{\\pi}$，搞混就想『半圈=π=180°』。",
        "疊合求最大最小值：直接 $\\pm\\sqrt{a^2+b^2}$，秒殺。",
        "$\\cos2\\theta$ 三個版本挑『跟題目同名(sin或cos)』的那個用。",
        "和差角『sin 同號、cos 異號』（符號口訣）。"
      ],
      formulas: [
        "$180°=\\pi\\text{ rad}$",
        "$\\sin(A+B)=\\sin A\\cos B+\\cos A\\sin B$",
        "$a\\sin x+b\\cos x=\\sqrt{a^2+b^2}\\sin(x+\\varphi)$"
      ],
      problems: [
        { type: "classic", q: "將 $120°$ 換成弧度。",
          hint: "$\\times\\frac{\\pi}{180}$。",
          sol: "$120\\cdot\\frac{\\pi}{180}=\\frac{2\\pi}{3}$。",
          answer: "$\\frac{2\\pi}{3}$" },
        { type: "classic", q: "求 $\\sin75°$ 之值。",
          hint: "$75°=45°+30°$，用和角。",
          sol: "$\\sin45\\cos30+\\cos45\\sin30=\\frac{\\sqrt2}2\\cdot\\frac{\\sqrt3}2+\\frac{\\sqrt2}2\\cdot\\frac12=\\frac{\\sqrt6+\\sqrt2}4$。",
          answer: "$\\frac{\\sqrt6+\\sqrt2}4$" },
        { type: "gsat", q: "（學測風格）求 $3\\sin\\theta+4\\cos\\theta$ 的最大值。",
          hint: "疊合：最大值 $\\sqrt{a^2+b^2}$。",
          sol: "$\\sqrt{3^2+4^2}=5$。",
          answer: "$5$" }
      ],
      generators: ["radDeg", "amplitude"]
    },

    /* ---------------------------------------------------------- 3-3 */
    {
      id: "b3c3",
      title: "3. 直線與圓",
      tags: ["斜率", "直線方程式", "點到直線距離", "圓"],
      diagram: "circleline",
      deep: [
        { h: "學測陷阱：先配方再讀圓心", b: "一般式 x²+y²+Dx+Ey+F=0 必須先配方，圓心是 (−D/2, −E/2)、半徑 √((D/2)²+(E/2)²−F)，不配方就讀錯。垂直斜率取『負倒數』。" },
        { h: "解題步驟：一切回到 d 與 r", b: "直線與圓的位置只看『圓心到直線距離 d 與半徑 r』：d<r 相交、d=r 相切、d>r 相離；切線與弦長都從這個 d 出發，比聯立快很多。" },
        { h: "技巧：弦長公式", b: "弦長 = 2√(r²−d²)。求切線時用『圓心到直線距離 = 半徑』列式；點到直線距離公式是本單元最大送分點，務必背熟。" }
      ],
      fiveYO:
        "直線的『斜率』就是『往右走一步，往上爬幾步』——越陡斜率越大。" +
        "圓就是『離某個中心點一樣遠的所有點』，那個固定的距離叫半徑。",
      concepts: [
        { h: "斜率與直線", b: "斜率 $m=\\frac{y_2-y_1}{x_2-x_1}$；點斜式 $y-y_1=m(x-x_1)$。" },
        { h: "平行與垂直", b: "平行 $m_1=m_2$；垂直 $m_1 m_2=-1$。" },
        { h: "點到直線距離", b: "$d=\\dfrac{|ax_0+by_0+c|}{\\sqrt{a^2+b^2}}$。" },
        { h: "圓方程式", b: "$(x-h)^2+(y-k)^2=r^2$，圓心 $(h,k)$、半徑 $r$。" },
        { h: "圓與直線", b: "比較『圓心到直線距離 $d$』與『半徑 $r$』：$d<r$ 相交、$d=r$ 相切、$d>r$ 相離。" }
      ],
      tricks: [
        "垂直 → 斜率相乘 $=-1$（互為負倒數）。",
        "切線問題：用『圓心到直線距離 = 半徑』列式，比聯立快。",
        "一般式 $x^2+y^2+Dx+Ey+F=0$ 配方找圓心 $(-\\frac D2,-\\frac E2)$。",
        "點到直線距離公式背熟，是直線單元最大送分點。"
      ],
      formulas: [
        "$m=\\dfrac{\\Delta y}{\\Delta x}$",
        "$d=\\dfrac{|ax_0+by_0+c|}{\\sqrt{a^2+b^2}}$",
        "$(x-h)^2+(y-k)^2=r^2$"
      ],
      problems: [
        { type: "classic", q: "求過 $(1,2)$ 且與 $3x+4y=0$ 垂直的直線。",
          hint: "原斜率 $-\\frac34$，垂直斜率 $\\frac43$。",
          sol: "$y-2=\\frac43(x-1)\\Rightarrow 4x-3y+2=0$。",
          answer: "$4x-3y+2=0$" },
        { type: "classic", q: "點 $(2,3)$ 到直線 $3x+4y-1=0$ 的距離。",
          hint: "套距離公式。",
          sol: "$\\frac{|6+12-1|}{\\sqrt{9+16}}=\\frac{17}{5}$。",
          answer: "$\\frac{17}{5}$" },
        { type: "gsat", q: "（學測風格）圓 $x^2+y^2=25$ 與直線 $x+y=k$ 相切，求 $k$。",
          hint: "圓心 (0,0) 到直線距離 = 半徑 5。",
          sol: "$\\frac{|k|}{\\sqrt2}=5\\Rightarrow|k|=5\\sqrt2$，$k=\\pm5\\sqrt2$。",
          answer: "$k=\\pm5\\sqrt2$" }
      ],
      generators: ["pointLineDist", "circleLine"]
    },

    /* ---------------------------------------------------------- 3-4 */
    {
      id: "b3c4",
      title: "4. 平面向量",
      tags: ["向量", "內積", "夾角", "分點"],
      diagram: "vector",
      deep: [
        { h: "學測陷阱：內積是純量", b: "內積 a·b 算出來是一個數(純量)，不是向量。求夾角要用 cosθ = a·b /(|a|·|b|)，記得除以兩個長度的乘積，不能只用 a·b。" },
        { h: "解題步驟：垂直與投影", b: "判垂直直接看『內積=0』；a 在 b 上的投影量 = a·b/|b|。分點公式要分清內分(在線段內)與外分(在延長線上)。" },
        { h: "技巧：長度轉內積", b: "|a±b|² = |a|² ± 2(a·b) + |b|²，把『長度／距離』問題轉成內積計算，常一步解開夾角與邊長題。" }
      ],
      fiveYO:
        "向量就是『一個帶箭頭的箭』，它同時記住『方向』和『長度』。" +
        "兩個箭相加，就是把第二個箭接在第一個箭的尾巴後面，看最後到哪裡。",
      concepts: [
        { h: "向量加減與係數", b: "座標相加減；$k\\vec a$ 把長度變 $|k|$ 倍。" },
        { h: "內積", b: "$\\vec a\\cdot\\vec b=|\\vec a||\\vec b|\\cos\\theta=a_1b_1+a_2b_2$。" },
        { h: "夾角與垂直", b: "$\\cos\\theta=\\dfrac{\\vec a\\cdot\\vec b}{|\\vec a||\\vec b|}$；垂直 ⇔ $\\vec a\\cdot\\vec b=0$。" },
        { h: "分點公式", b: "$P$ 分 $\\overline{AB}$ 為 $m:n$，則 $P=\\dfrac{n\\vec A+m\\vec B}{m+n}$。" }
      ],
      tricks: [
        "判垂直：內積 = 0，最快。",
        "求夾角：內積除以兩長度，套 $\\cos\\theta$。",
        "中點 = 兩端點座標平均；分點記『對角加權』。",
        "$|\\vec a|^2=\\vec a\\cdot\\vec a$，求長度平方就點自己。"
      ],
      formulas: [
        "$\\vec a\\cdot\\vec b=a_1b_1+a_2b_2$",
        "$\\cos\\theta=\\dfrac{\\vec a\\cdot\\vec b}{|\\vec a||\\vec b|}$",
        "$\\vec a\\perp\\vec b\\iff\\vec a\\cdot\\vec b=0$"
      ],
      problems: [
        { type: "classic", q: "$\\vec a=(3,4),\\vec b=(1,2)$，求 $\\vec a\\cdot\\vec b$ 與 $|\\vec a|$。",
          hint: "內積座標相乘相加；長度平方和開根。",
          sol: "$\\vec a\\cdot\\vec b=3+8=11$；$|\\vec a|=\\sqrt{9+16}=5$。",
          answer: "$\\vec a\\cdot\\vec b=11,\\ |\\vec a|=5$" },
        { type: "classic", q: "求使 $\\vec a=(2,k)$ 與 $\\vec b=(3,-1)$ 垂直的 $k$。",
          hint: "內積 = 0。",
          sol: "$6-k=0\\Rightarrow k=6$。",
          answer: "$k=6$" },
        { type: "gsat", q: "（學測風格）$\\vec a=(1,\\sqrt3),\\vec b=(\\sqrt3,1)$，求兩向量夾角。",
          hint: "$\\cos\\theta=\\frac{\\vec a\\cdot\\vec b}{|\\vec a||\\vec b|}$。",
          sol: "$\\vec a\\cdot\\vec b=\\sqrt3+\\sqrt3=2\\sqrt3$，$|\\vec a|=|\\vec b|=2$，$\\cos\\theta=\\frac{2\\sqrt3}4=\\frac{\\sqrt3}2$，$\\theta=30°$。",
          answer: "$30°$" }
      ],
      generators: ["dotProduct", "perpVector"]
    }
  ]
});
