/* 物理（學測自然）— 力學、能量、電磁、波動光學、近代物理 */
CURRICULUM.beginSubject({ id: "physics", name: "物理", icon: "⚛️" });
CURRICULUM.addBook({
  id: "ph1",
  title: "物理・學測核心",
  chapters: [
    {
      id: "ph_kinematics",
      title: "1. 運動學與牛頓運動定律",
      tags: ["等加速", "v-t圖", "牛頓三定律", "自由落體"],
      fiveYO: "運動學就是描述『東西怎麼動』：多快(速度)、加速多少(加速度)、跑多遠(位移)。" +
        "牛頓定律告訴你『力會怎麼改變運動』：有淨力才會加速。",
      concepts: [
        { h: "等加速公式", b: "$v=v_0+at$、$s=v_0 t+\\frac12 at^2$、$v^2=v_0^2+2as$。" },
        { h: "v-t 圖", b: "斜率=加速度、面積=位移。" },
        { h: "牛頓第二定律", b: "$F=ma$（淨力=質量×加速度）。" },
        { h: "自由落體", b: "$g\\approx9.8\\,m/s^2$，向下等加速。" }
      ],
      tricks: [
        "三個等加速公式選『缺哪個變數就用沒有它的那條』。",
        "v-t 圖看斜率(加速度)與面積(位移)，比硬算快。",
        "受力分析先畫自由體圖，把所有力標上去再求淨力。",
        "$F=ma$：先求淨力(合力)再除以質量得加速度。"
      ],
      formulas: [
        "$v=v_0+at$",
        "$s=v_0t+\\tfrac12at^2$",
        "$v^2=v_0^2+2as$",
        "$F=ma$"
      ],
      problems: [
        { type: "classic", q: "靜止物體以 $a=2\\,m/s^2$ 加速 5 秒，末速為？",
          hint: "$v=v_0+at$，$v_0=0$。",
          sol: "$v=0+2\\times5=10\\,m/s$。",
          answer: "$10\\,m/s$" },
        { type: "gsat", q: "（學測風格）質量 2 kg 物體受淨力 6 N，加速度為？",
          hint: "$F=ma$。",
          sol: "$a=F/m=6/2=3\\,m/s^2$。",
          answer: "$3\\,m/s^2$" }
      ],
      generators: ["phKinematics", "phNewton"]
    },
    {
      id: "ph_energy",
      title: "2. 功、能量與動量",
      tags: ["功", "動能", "位能", "能量守恆", "動量守恆"],
      fiveYO: "功＝用力推東西移動；能量是『做功的本錢』。能量不會消失只會轉換(守恆)；" +
        "碰撞時動量也守恆。",
      concepts: [
        { h: "功", b: "$W=Fd\\cos\\theta$（力與位移同向時 $W=Fd$）。" },
        { h: "動能/位能", b: "$KE=\\frac12 mv^2$、重力位能 $PE=mgh$。" },
        { h: "力學能守恆", b: "無摩擦時 $KE+PE=$ 定值。" },
        { h: "動量守恆", b: "碰撞前後 $\\sum mv$ 不變。" }
      ],
      tricks: [
        "求落下速度用能量守恆 $mgh=\\frac12mv^2 \\Rightarrow v=\\sqrt{2gh}$，免算時間。",
        "碰撞題先寫『動量守恆』$m_1v_1+m_2v_2=$ 定值。",
        "功的正負看力與位移夾角：同向正功、反向負功、垂直零功。",
        "有摩擦時『力學能減少量 = 摩擦生熱』。"
      ],
      formulas: [
        "$W=Fd\\cos\\theta$",
        "$KE=\\tfrac12 mv^2,\\ PE=mgh$",
        "$v=\\sqrt{2gh}$（自由落下）"
      ],
      problems: [
        { type: "classic", q: "質量 2 kg 物體以 3 m/s 運動，動能為？",
          hint: "$KE=\\frac12mv^2$。",
          sol: "$\\frac12\\times2\\times3^2=9\\,J$。",
          answer: "$9\\,J$" },
        { type: "gsat", q: "（學測風格）物體自 5 m 高自由落下，落地速度約為？(g=10)",
          hint: "能量守恆 $v=\\sqrt{2gh}$。",
          sol: "$v=\\sqrt{2\\times10\\times5}=\\sqrt{100}=10\\,m/s$。",
          answer: "$10\\,m/s$" }
      ],
      generators: ["phKinetic", "phFreeFall"]
    },
    {
      id: "ph_em",
      title: "3. 電與磁",
      tags: ["庫侖", "電場", "歐姆定律", "電功率", "電磁感應"],
      fiveYO: "電荷會互相吸引/排斥(庫侖力)；電流推著電荷在電路裡跑。" +
        "電壓、電流、電阻的關係就是歐姆定律。",
      concepts: [
        { h: "歐姆定律", b: "$V=IR$（電壓=電流×電阻）。" },
        { h: "電功率", b: "$P=VI=I^2R=\\frac{V^2}{R}$。" },
        { h: "庫侖定律", b: "$F=k\\frac{q_1q_2}{r^2}$。" },
        { h: "電磁感應", b: "磁場變化會感應電動勢(法拉第定律)。" }
      ],
      tricks: [
        "電路題先用 $V=IR$；串聯電阻相加、並聯倒數相加。",
        "求耗電/發熱用 $P=I^2R$（電阻發熱）。",
        "庫侖力與距離平方成反比：距離加倍，力變 1/4。",
        "感應電流方向用楞次定律：『反抗磁通變化』。"
      ],
      formulas: [
        "$V=IR$",
        "$P=VI=I^2R=\\tfrac{V^2}{R}$",
        "$F=k\\dfrac{q_1q_2}{r^2}$"
      ],
      problems: [
        { type: "classic", q: "電阻 5 Ω 通過 2 A 電流，兩端電壓為？",
          hint: "$V=IR$。",
          sol: "$V=2\\times5=10\\,V$。",
          answer: "$10\\,V$" },
        { type: "gsat", q: "（學測風格）110 V、電阻 55 Ω 的電器，消耗功率為？",
          hint: "$P=V^2/R$。",
          sol: "$P=110^2/55=12100/55=220\\,W$。",
          answer: "$220\\,W$" }
      ],
      generators: ["phOhm", "phPower"]
    },
    {
      id: "ph_wave",
      title: "4. 波動、光與近代物理",
      tags: ["波速", "折射", "都卜勒", "光電效應", "能階"],
      fiveYO: "波會傳遞能量(聲、光)。波速=頻率×波長。光會折射、會干涉；" +
        "近代物理告訴我們光也有粒子性(光子)。",
      concepts: [
        { h: "波速公式", b: "$v=f\\lambda$（波速=頻率×波長）。" },
        { h: "折射", b: "光進入不同介質會轉彎(司乃耳定律 $n_1\\sin\\theta_1=n_2\\sin\\theta_2$)。" },
        { h: "光電效應", b: "光子能量 $E=hf$；超過功函數才打出電子。" },
        { h: "能階", b: "電子躍遷放出/吸收特定能量光子。" }
      ],
      tricks: [
        "波速題直接套 $v=f\\lambda$，三缺一求未知。",
        "光從密介質到疏介質角度變大，反之變小。",
        "光電效應重點：『頻率(顏色)決定能否打出電子』，跟光強無關。",
        "光子能量 $E=hf$，頻率越高(紫外)能量越大。"
      ],
      formulas: [
        "$v=f\\lambda$",
        "$E=hf$",
        "$n_1\\sin\\theta_1=n_2\\sin\\theta_2$"
      ],
      problems: [
        { type: "classic", q: "頻率 500 Hz、波長 0.68 m 的聲波，波速為？",
          hint: "$v=f\\lambda$。",
          sol: "$v=500\\times0.68=340\\,m/s$。",
          answer: "$340\\,m/s$" },
        { type: "gsat", q: "（學測風格）光電效應中，能否打出電子主要取決於光的？(A)強度 (B)頻率 (C)角度",
          hint: "想想 E=hf。",
          sol: "由光子能量 $E=hf$ 決定，故取決於頻率，選 (B)。",
          answer: "(B) 頻率" }
      ],
      generators: ["phWave"]
    }
  ]
});
CURRICULUM.addExamPoints([
  {
    id: "ph_ep_mech", name: "力學整合（運動×牛頓×能量）", freq: 5,
    chapters: ["ph_kinematics", "ph_energy"],
    insight: "力學題的主線：受力分析→F=ma 求加速度→等加速公式或能量守恆求結果。",
    combo: "畫自由體圖→求淨力→F=ma 得 a→需速度/位移用等加速公式；若涉及高度落差直接能量守恆。",
    traps: ["忘記畫自由體圖漏掉某個力", "等加速公式選錯", "有摩擦卻用力學能守恆"]
  },
  {
    id: "ph_ep_em", name: "電路與電功率整合", freq: 4,
    chapters: ["ph_em"],
    insight: "電路一切從 V=IR 出發，發熱/耗電用 P=I²R 或 V²/R。",
    combo: "判串並聯求總電阻→V=IR 求電流→P 公式求功率/發熱。",
    traps: ["串並聯電阻算錯", "功率公式挑錯(用對 I 或 V)", "單位沒換算"]
  }
]);
