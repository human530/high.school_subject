/* 第四冊（高二下・數A）：空間向量、空間中的平面與直線、矩陣 */
CURRICULUM.addBook({
  id: "b4",
  title: "第四冊・空間向量 / 空間平面直線 / 矩陣",
  chapters: [
    /* ---------------------------------------------------------- 4-1 */
    {
      id: "b4c1",
      title: "1. 空間向量",
      tags: ["空間坐標", "內積", "外積", "體積"],
      diagram: "space3d",
      fiveYO:
        "把平面的『左右、上下』再加一個『前後』，就變成立體空間。" +
        "空間向量就是『立體世界裡帶箭頭的箭』，多了一個 z 座標而已，算法跟平面幾乎一樣。",
      concepts: [
        { h: "空間坐標與距離", b: "兩點距離 $=\\sqrt{(\\Delta x)^2+(\\Delta y)^2+(\\Delta z)^2}$。" },
        { h: "內積", b: "$\\vec a\\cdot\\vec b=a_1b_1+a_2b_2+a_3b_3=|\\vec a||\\vec b|\\cos\\theta$。" },
        { h: "外積", b: "$\\vec a\\times\\vec b$ 同時垂直 $\\vec a,\\vec b$；$|\\vec a\\times\\vec b|$ = 平行四邊形面積。" },
        { h: "體積", b: "平行六面體體積 $=|\\vec a\\cdot(\\vec b\\times\\vec c)|$（純量三重積）。" }
      ],
      tricks: [
        "要找『同時垂直兩向量』的方向 → 外積，秒殺。",
        "三角形面積 $=\\frac12|\\vec{AB}\\times\\vec{AC}|$。",
        "四面體體積 $=\\frac16|$三重積$|$。",
        "內積、垂直、夾角的算法跟平面完全一樣，只是多一項。"
      ],
      formulas: [
        "$\\vec a\\cdot\\vec b=a_1b_1+a_2b_2+a_3b_3$",
        "$|\\vec a\\times\\vec b|=|\\vec a||\\vec b|\\sin\\theta$",
        "四面體 $V=\\frac16|\\vec a\\cdot(\\vec b\\times\\vec c)|$"
      ],
      problems: [
        { type: "classic", q: "$A(1,0,2),B(3,1,4)$，求 $|\\overline{AB}|$。",
          hint: "座標差平方和開根。",
          sol: "$\\sqrt{2^2+1^2+2^2}=\\sqrt9=3$。",
          answer: "$3$" },
        { type: "classic", q: "$\\vec a=(1,2,2),\\vec b=(2,-1,0)$，求 $\\vec a\\cdot\\vec b$。",
          hint: "三項相乘相加。",
          sol: "$2-2+0=0$（互相垂直）。",
          answer: "$0$" },
        { type: "gsat", q: "（學測風格）$\\vec a=(1,0,0),\\vec b=(0,1,0)$，求 $\\vec a\\times\\vec b$。",
          hint: "外積結果同時垂直兩者。",
          sol: "$\\vec a\\times\\vec b=(0,0,1)$。",
          answer: "$(0,0,1)$" }
      ],
      generators: ["dot3D", "dist3D"]
    },

    /* ---------------------------------------------------------- 4-2 */
    {
      id: "b4c2",
      title: "2. 空間中的平面與直線",
      tags: ["平面方程式", "法向量", "點面距離", "三元一次"],
      diagram: "plane",
      fiveYO:
        "一張無限大的平板就是『平面』。每個平面都有一支垂直插出來的箭（法向量），" +
        "只要知道平面上一點和這支箭，就能寫出平面的方程式。",
      concepts: [
        { h: "平面方程式", b: "法向量 $(a,b,c)$、過點 $(x_0,y_0,z_0)$：$a(x-x_0)+b(y-y_0)+c(z-z_0)=0$。" },
        { h: "點到平面距離", b: "$d=\\dfrac{|ax_0+by_0+cz_0+d_0|}{\\sqrt{a^2+b^2+c^2}}$。" },
        { h: "兩平面夾角", b: "用兩法向量夾角：$\\cos\\theta=\\frac{\\vec{n_1}\\cdot\\vec{n_2}}{|\\vec{n_1}||\\vec{n_2}|}$。" },
        { h: "三元一次方程組", b: "可用消去法 / 行列式（克拉瑪公式）求三平面交點。" }
      ],
      tricks: [
        "平面方程式係數 $(a,b,c)$ 就是法向量，一眼讀出。",
        "兩平面平行 ⇔ 法向量平行；垂直 ⇔ 法向量內積 0。",
        "點到平面距離公式與點到直線『同款』，只是多一項 z。",
        "求平面：拿兩向量外積得法向量，最直接。"
      ],
      formulas: [
        "平面 $ax+by+cz=d$，法向量 $(a,b,c)$",
        "$d=\\dfrac{|ax_0+by_0+cz_0-d|}{\\sqrt{a^2+b^2+c^2}}$"
      ],
      problems: [
        { type: "classic", q: "求過 $(1,2,3)$ 且法向量 $(2,-1,2)$ 的平面方程式。",
          hint: "$a(x-x_0)+b(y-y_0)+c(z-z_0)=0$。",
          sol: "$2(x-1)-1(y-2)+2(z-3)=0\\Rightarrow 2x-y+2z-6=0$。",
          answer: "$2x-y+2z-6=0$" },
        { type: "classic", q: "原點到平面 $2x+y+2z=9$ 的距離。",
          hint: "點面距離公式。",
          sol: "$\\frac{|{-9}|}{\\sqrt{4+1+4}}=\\frac{9}{3}=3$。",
          answer: "$3$" },
        { type: "gsat", q: "（學測風格）兩平面 $x+y+z=1$ 與 $x-y+z=3$ 的夾角餘弦。",
          hint: "用法向量 $(1,1,1),(1,-1,1)$ 內積。",
          sol: "$\\cos\\theta=\\frac{1-1+1}{\\sqrt3\\sqrt3}=\\frac13$。",
          answer: "$\\frac13$" }
      ],
      generators: ["planeEq", "pointPlaneDist"]
    },

    /* ---------------------------------------------------------- 4-3 */
    {
      id: "b4c3",
      title: "3. 矩陣",
      tags: ["矩陣運算", "反矩陣", "行列式", "線性變換"],
      diagram: "matrix",
      fiveYO:
        "矩陣就是『把數字排成方格表』。它像一台機器，把一個點（座標）吃進去，" +
        "吐出一個被搬動、放大或旋轉後的新點。",
      concepts: [
        { h: "矩陣乘法", b: "$(AB)_{ij}$ = A 的第 $i$ 列點 B 的第 $j$ 行。注意 $AB\\ne BA$。" },
        { h: "2×2 行列式", b: "$\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=ad-bc$。" },
        { h: "反矩陣", b: "$A^{-1}=\\dfrac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$（$ad-bc\\ne0$）。" },
        { h: "解聯立 / 線性變換", b: "$A\\vec x=\\vec b\\Rightarrow\\vec x=A^{-1}\\vec b$；矩陣可表示旋轉、伸縮等變換。" }
      ],
      tricks: [
        "2×2 反矩陣口訣：『主對調、副變號、再除行列式』。",
        "行列式 = 0 ⇔ 沒有反矩陣 ⇔ 聯立無唯一解。",
        "矩陣乘法不可交換，順序千萬別亂換。",
        "行列式幾何意義 = 面積/體積的伸縮倍率。"
      ],
      formulas: [
        "$\\det=ad-bc$",
        "$A^{-1}=\\frac1{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$"
      ],
      problems: [
        { type: "classic", q: "求 $\\begin{pmatrix}2&1\\\\3&4\\end{pmatrix}$ 的行列式。",
          hint: "$ad-bc$。",
          sol: "$2\\cdot4-1\\cdot3=5$。",
          answer: "$5$" },
        { type: "classic", q: "求 $A=\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}$ 的反矩陣。",
          hint: "$ad-bc=-2$，套口訣。",
          sol: "$A^{-1}=\\frac{1}{-2}\\begin{pmatrix}4&-2\\\\-3&1\\end{pmatrix}=\\begin{pmatrix}-2&1\\\\1.5&-0.5\\end{pmatrix}$。",
          answer: "$\\begin{pmatrix}-2&1\\\\\\frac32&-\\frac12\\end{pmatrix}$" },
        { type: "gsat", q: "（學測風格）用反矩陣解 $\\begin{cases}x+2y=5\\\\3x+4y=11\\end{cases}$。",
          hint: "$A\\vec x=\\vec b$，$\\vec x=A^{-1}\\vec b$。",
          sol: "$\\det=-2$，$A^{-1}=\\frac{1}{-2}\\begin{pmatrix}4&-2\\\\-3&1\\end{pmatrix}$。$\\vec x=A^{-1}\\binom{5}{11}=\\frac{1}{-2}\\binom{20-22}{-15+11}=\\frac{1}{-2}\\binom{-2}{-4}=\\binom{1}{2}$。",
          answer: "$x=1,\\ y=2$" }
      ],
      generators: ["determinant", "matrixSolve"]
    }
  ]
});
