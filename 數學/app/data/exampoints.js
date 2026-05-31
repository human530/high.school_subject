/* ============================================================
 * exampoints.js — 數A 整合考點（學測高頻、跨章節串連）
 * 每個考點把分散在不同章的觀念整合成「一個會考的主題」，
 * 並串接：相關章節、可練的 generators、學測題、整合解題心法、易錯陷阱。
 * 由 app/exam/analytics 共用。
 * ============================================================ */
var MATHA_EXAMPOINTS = [
  {
    id: "ep_polyineq",
    name: "多項式與不等式整合",
    freq: 4, // 學測出現頻率（1~5 星）
    chapters: ["b1c1", "b1c2"],
    generators: ["quadIneq", "absLinearIneq", "remainderTheorem", "synthFactor"],
    insight:
      "把『因式分解→找根→判正負』串成一條線：解方程式找根、解不等式判區間、" +
      "餘式/因式定理快速找根，全都靠同一招『代入讓它變 0』。",
    combo:
      "看到高次不等式 → 先因式分解（用因式定理試 ±常數因數）→ 標數線判號。" +
      "看到『除以 (x−a) 的餘數』→ 直接代 a，不要真的做除法。",
    traps: ["二次不等式方向（大於取兩端、小於取中間）搞反", "$\\sqrt{x^2}=|x|$ 忘記加絕對值", "有理根沒先猜 ±常數/首項因數"]
  },
  {
    id: "ep_explog",
    name: "指對數的綜合應用",
    freq: 5,
    chapters: ["b1c3"],
    generators: ["logSimplify", "expEquation"],
    insight:
      "對數把『乘除變加減、次方變乘法』，是化簡與比大小的萬用鑰匙；" +
      "常用對數再加上『位數 = ⌊log N⌋＋1』就能秒算大數位數。",
    combo:
      "連乘除 → 取 log 拆開；比大小 → 同取 log 或化同底；求位數 → 算 log 取整數部分＋1。",
    traps: ["真數必須 > 0（定義域）", "換底方向用錯", "$\\log$ 內相加 ≠ 相乘的 log"]
  },
  {
    id: "ep_seq",
    name: "數列級數與規律",
    freq: 4,
    chapters: ["b2c1"],
    generators: ["arithSeq", "geoSum"],
    insight:
      "等差『每次加固定數』、等比『每次乘固定倍』；級數求和記兩把刀：" +
      "等差『(頭+尾)×項數÷2』、無窮等比『首項÷(1−公比)』。",
    combo:
      "先判斷是等差還等比（看差或比是否固定）→ 套對應公式；Σ 連加先拆成已知和公式。",
    traps: ["無窮等比要 $|r|<1$ 才收斂", "項數 n 算錯（含頭含尾）", "把等差當等比硬套"]
  },
  {
    id: "ep_count_prob",
    name: "排列組合 × 機率統計整合",
    freq: 5,
    chapters: ["b2c2", "b2c3", "b2c4"],
    generators: ["permComb", "binomTerm", "diceProb", "drawBalls", "meanStd", "regLine"],
    insight:
      "計數是機率的分母與分子：先用排列/組合『數出情況數』，再變成機率；" +
      "『至少一個』用餘事件、條件機率畫樹狀圖、期望值=各值×機率相加。",
    combo:
      "算機率前先問『順序有沒有差』決定用 P 或 C → 算出有利數/總數 → " +
      "遇到『至少』改算 1−（都沒有）→ 條件/獨立看清楚再乘。",
    traps: ["排列組合混用（順序判斷錯）", "沒獨立卻直接相乘", "標準差用 $\\overline{x^2}-\\bar x^2$ 時平方/平均順序顛倒"]
  },
  {
    id: "ep_triangle",
    name: "解三角形（正餘弦定理＋面積）",
    freq: 5,
    chapters: ["b3c1", "b3c2"],
    generators: ["cosineLaw", "triArea", "amplitude", "radDeg"],
    insight:
      "已知條件決定用哪個定理：兩邊夾角/三邊→餘弦定理；兩角一邊/兩邊一對角→正弦定理；" +
      "面積最常用 $\\frac12 ab\\sin C$。再加疊合 $\\sqrt{a^2+b^2}$ 求最值。",
    combo:
      "畫圖標已知 → 配定理（夾角用餘弦、對角用正弦）→ 要面積就 $\\frac12 ab\\sin C$ → 要最值用疊合。",
    traps: ["正弦定理一對角可能有兩解（鈍/銳）", "角度弧度搞混", "疊合最大值忘了開根號"]
  },
  {
    id: "ep_linecircle",
    name: "直線與圓的位置關係",
    freq: 4,
    chapters: ["b3c3"],
    generators: ["pointLineDist", "circleLine"],
    insight:
      "一切回到『點到直線距離 d』與『半徑 r』比大小：d<r 交、d=r 切、d>r 離；" +
      "切線題用『圓心到線距離 = 半徑』列式，比聯立快很多。",
    combo:
      "圓配方找圓心半徑 → 算圓心到直線距離 → 和 r 比；求切線/弦長都從這個 d 出發。",
    traps: ["一般式沒配方就讀錯圓心", "垂直斜率忘了取負倒數", "距離公式分母漏開根號"]
  },
  {
    id: "ep_vector",
    name: "向量整合（平面＋空間）",
    freq: 5,
    chapters: ["b3c4", "b4c1"],
    generators: ["dotProduct", "perpVector", "dot3D", "dist3D"],
    insight:
      "平面與空間向量算法幾乎一樣（只差一個 z）：內積判垂直/求夾角、" +
      "外積找『同時垂直兩向量』的方向與面積、三重積求體積。",
    combo:
      "判垂直→內積=0；求夾角→內積÷兩長度；求法向量/面積→外積；求體積→三重積。",
    traps: ["內積（純量）與外積（向量）搞混", "夾角忘了除以長度乘積", "空間距離漏掉 z 那一項"]
  },
  {
    id: "ep_space",
    name: "空間平面直線 × 矩陣解聯立",
    freq: 4,
    chapters: ["b4c2", "b4c3"],
    generators: ["planeEq", "pointPlaneDist", "determinant", "matrixSolve"],
    insight:
      "平面方程式係數就是法向量；點到平面距離與點到直線『同款』只是多一項；" +
      "三元一次方程組 = 三平面交點，可用矩陣/行列式（克拉瑪）一次解。",
    combo:
      "求平面→兩向量外積得法向量；判平行垂直→看法向量；解三元一次→寫成 $A\\vec x=\\vec b$ 用反矩陣或行列式。",
    traps: ["法向量與平面上向量搞反", "行列式=0 仍硬解（無唯一解）", "矩陣乘法順序不可交換"]
  }
];

// 註冊到數A 科目；並設為當前全域 EXAMPOINTS（向後相容）
if (window.CURRICULUM && CURRICULUM.beginSubject) {
  CURRICULUM.beginSubject({ id: "matha", name: "數學A", icon: "📐" });
  CURRICULUM.addExamPoints(MATHA_EXAMPOINTS);
}
window.EXAMPOINTS = MATHA_EXAMPOINTS;

/* 工具：考點查找與聚合（一律操作目前的 window.EXAMPOINTS） */
window.EXAMPOINTS_API = {
  byId: function (id) { return (window.EXAMPOINTS || []).filter(function (e) { return e.id === id; })[0] || null; },
  // 某章屬於哪些考點
  forChapter: function (chapterId) {
    return (window.EXAMPOINTS || []).filter(function (e) { return e.chapters.indexOf(chapterId) >= 0; });
  },
  // 考點下可用的 generators（存在於 GENERATORS 才算）
  gens: function (ep) {
    return (ep.generators || []).filter(function (k) { return window.GENERATORS && window.GENERATORS[k]; });
  }
};
