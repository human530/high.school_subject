/* 英文（學測）— 起始內容：字彙、文法、閱讀測驗、寫作 */
CURRICULUM.beginSubject({ id: "english", name: "英文", icon: "🔤" });
CURRICULUM.addBook({
  id: "en1",
  title: "English・學測核心",
  chapters: [
    {
      id: "en_vocab",
      title: "1. 字彙與字根字首",
      tags: ["vocabulary", "字根", "字首", "搭配詞"],
      fiveYO: "背單字不要硬背。用『字根字首』拆字＝猜意思；用『搭配詞』記一整組，" +
        "考試看到就反射答對。",
      concepts: [
        { h: "字首", b: "un-/in-(否定)、re-(再)、pre-(前)、ex-(出)、co-(共同)。" },
        { h: "字根", b: "spect(看)、port(帶)、dict(說)、ject(丟)、scrib/script(寫)。" },
        { h: "搭配詞", b: "make a decision、take responsibility、pay attention to——整組記。" }
      ],
      tricks: [
        "不會的字先拆字首+字根猜方向，再看句意微調。",
        "字彙題看『空格前後搭配』：介係詞、動詞常固定配對。",
        "詞性題看空格位置：冠詞後接名詞、be 動詞後常接形容詞。",
        "同義替換題：找選項中與原句『搭配＋詞性』都吻合的。"
      ],
      formulas: [
        "拆字：字首(方向) + 字根(核心義) + 字尾(詞性)",
        "搭配詞整組記：動詞+名詞、動詞+介係詞"
      ],
      problems: [
        { type: "classic", q: "'predict' 的字首 pre- 與字根 dict 合起來是？",
          hint: "pre-=前，dict=說。",
          sol: "事先(pre)說(dict)出來 → 預測 predict。",
          answer: "預測（pre-前 + dict-說）" },
        { type: "gsat", q: "（學測風格）He paid no ____ to the warning. (A)attention (B)attend (C)attentive",
          hint: "pay ____ to 是固定搭配，且空格需名詞。",
          sol: "pay attention to 為固定搭配，空格需名詞，選 (A) attention。",
          answer: "(A) attention" }
      ],
      generators: []
    },
    {
      id: "en_grammar",
      title: "2. 文法（時態・子句・語態）",
      tags: ["時態", "關係子句", "被動", "假設語氣"],
      fiveYO: "文法是『句子的規則』。先看主詞動詞對不對、時間對不對(時態)、" +
        "誰做誰被做(主動被動)，大多數題目就解決了。",
      concepts: [
        { h: "時態", b: "現在完成(have+p.p.)表『到現在的經驗/持續』；過去式表單純過去。" },
        { h: "關係子句", b: "who(人)/which(物)/that(皆可)；非限定用逗號+which。" },
        { h: "被動語態", b: "be + p.p.；受詞變主詞時用被動。" },
        { h: "假設語氣", b: "與現在事實相反：If + 過去式, 主詞 + would + 原形。" }
      ],
      tricks: [
        "時態看『時間副詞』：since/for→完成式；yesterday/ago→過去式。",
        "關係代名詞先判先行詞是人(who)還是物(which)。",
        "看到 by + 行為者，多半是被動語態。",
        "假設語氣口訣：『與現在相反，動詞往後退一格(過去式)』。"
      ],
      formulas: [
        "現在完成：have/has + p.p.",
        "被動：be + p.p. (+ by ...)",
        "與現在相反假設：If + 過去, would + 原形"
      ],
      problems: [
        { type: "classic", q: "I ____ here since 2020. (A)live (B)have lived (C)lived",
          hint: "since 配什麼時態？",
          sol: "since 表『到現在的持續』，用現在完成式，選 (B) have lived。",
          answer: "(B) have lived" },
        { type: "gsat", q: "（學測風格）If I ____ rich, I would travel the world. (A)am (B)were (C)will be",
          hint: "與現在事實相反的假設。",
          sol: "與現在相反假設用過去式(be 動詞用 were)，選 (B) were。",
          answer: "(B) were" }
      ],
      generators: []
    },
    {
      id: "en_reading",
      title: "3. 閱讀測驗與克漏字",
      tags: ["reading", "cloze", "推論", "主旨"],
      fiveYO: "英文閱讀跟中文一樣：答案在文章裡。克漏字看『上下文邏輯＋搭配』，" +
        "閱讀題找『有依據』的選項。",
      concepts: [
        { h: "克漏字", b: "看前後句邏輯(轉折/因果/並列)選連接詞、依語意選詞。" },
        { h: "主旨題", b: "看首段與每段第一句(topic sentence)。" },
        { h: "推論題", b: "由文推得，不可超出原文。" }
      ],
      tricks: [
        "克漏字遇連接詞：however(轉折)、therefore(因果)、moreover(遞進)看邏輯選。",
        "閱讀先讀題目關鍵字，再回原文定位該段。",
        "猜生字用語境：對比句、舉例(such as)能透露字義。",
        "選項與原文『同義改寫』的多半是答案；原文照抄反而可能是陷阱。"
      ],
      formulas: [
        "克漏字：上下文邏輯 + 搭配詞 + 詞性",
        "閱讀流程：題目關鍵字 → 定位段落 → 找依據"
      ],
      problems: [
        { type: "gsat", q: "（學測風格）連接詞題：'It rained; ____, the game was cancelled.' (A)however (B)therefore (C)although",
          hint: "下雨→取消，是因果。",
          sol: "前後為因果關係，用 therefore，選 (B)。",
          answer: "(B) therefore" },
        { type: "classic", q: "閱讀主旨題最該看文章的哪裡？",
          hint: "想想 topic sentence。",
          sol: "看首段與各段第一句(主題句)最快抓到主旨。",
          answer: "首段與各段主題句" }
      ],
      generators: []
    },
    {
      id: "en_writing",
      title: "4. 寫作（看圖／主題作文）",
      tags: ["writing", "translation", "essay"],
      fiveYO: "英文作文要『結構清楚＋句型多變＋少文法錯』。先列大綱再寫，" +
        "用連接詞讓段落流暢，比寫很長更重要。",
      concepts: [
        { h: "段落結構", b: "主題句 → 支持句(細節/例子) → 結論句。" },
        { h: "中譯英", b: "先抓中文句的主詞動詞，套對時態與句型。" },
        { h: "高分句型", b: "適度用關係子句、分詞構句、not only...but also 增加變化。" }
      ],
      tricks: [
        "動筆前花 2 分鐘列大綱(每段一句重點)，方向不會跑掉。",
        "用轉折/因果連接詞(however, as a result)讓文章連貫。",
        "寧可句子正確簡單，也不要複雜但錯誤——文法錯最扣分。",
        "結尾呼應開頭主題，給閱卷者完整感。"
      ],
      formulas: [
        "段落：主題句 + 支持句×2~3 + 結論句",
        "作文骨架：開頭(破題) → 主體(2段) → 結尾(扣題)"
      ],
      problems: [
        { type: "classic", q: "一個英文段落的標準結構是？",
          hint: "topic → support → conclusion。",
          sol: "主題句 → 支持句(例子/細節) → 結論句。",
          answer: "主題句 + 支持句 + 結論句" },
        { type: "gsat", q: "（學測風格）作文要拿高分，下列何者最重要？(A)句子越長越好 (B)結構清楚且文法正確 (C)用很多艱深單字",
          hint: "閱卷重清楚與正確。",
          sol: "結構清楚＋文法正確最關鍵，選 (B)；長句與難字若出錯反而扣分。",
          answer: "(B) 結構清楚且文法正確" }
      ],
      generators: []
    }
  ]
});
CURRICULUM.addExamPoints([
  {
    id: "en_ep_grammar", name: "文法綜合（時態×子句×語態）", freq: 5,
    chapters: ["en_grammar"],
    insight: "文法題九成在考：時態對不對、主動被動、子句連接。先判這三項最快。",
    combo: "看時間副詞定時態 → 判主動/被動(有無 by) → 子句先行詞是人或物選關代。",
    traps: ["時態被時間副詞誤導", "關代人/物用錯", "假設語氣動詞沒退一格"]
  },
  {
    id: "en_ep_reading", name: "閱讀與克漏字整合", freq: 5,
    chapters: ["en_reading", "en_vocab"],
    insight: "閱讀＝定位找依據；克漏字＝上下文邏輯＋搭配詞；字彙是底層燃料。",
    combo: "題目關鍵字→定位段落→看邏輯連接詞與搭配→選同義改寫且有依據者。",
    traps: ["超出原文的推論", "被原文照抄選項誤導", "忽略連接詞的邏輯"]
  }
]);
