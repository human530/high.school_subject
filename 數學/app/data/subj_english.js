/* 英文（學測）— 起始內容：字彙、文法、閱讀測驗、寫作 */
CURRICULUM.beginSubject({ id: "english", name: "英文", icon: "🔤" });
CURRICULUM.addBook({
  id: "en1",
  title: "English・學測核心",
  chapters: [
    {
      id: "en_vocab",
      diagram: "enRoot",
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
      generators: ["enRoot"]
    },
    {
      id: "en_grammar",
      diagram: "enTense",
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
      generators: ["enTense"]
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
    },
    {
      id: "en_phrasal",
      title: "5. 片語動詞與介系詞搭配",
      tags: ["phrasal verb", "片語動詞", "介系詞", "搭配"],
      fiveYO: "英文很多『動詞+小字(介系詞/副詞)』合起來意思就變了，像 give up=放棄。" +
        "這些要整組記，考試常考用哪個小字。",
      concepts: [
        { h: "片語動詞", b: "look up(查詢)、give up(放棄)、put off(延後)、carry out(執行)；動詞+介副詞。" },
        { h: "固定介系詞", b: "depend on、be interested in、be afraid of、result in/from——介系詞固定不能換。" },
        { h: "可分/不可分", b: "look it up(代名詞要夾中間)；look after him(不可分，不能拆)。" },
        { h: "近義辨析", b: "result in(導致結果) vs result from(起因於)；方向相反勿混。" }
      ],
      tricks: [
        "空格只有介系詞選項時，回想動詞的固定搭配(depend ON、consist OF)。",
        "代名詞當受詞時，可分片語動詞要『動詞+代名詞+介副詞』(turn it off)。",
        "result in 後接『結果』、result from 後接『原因』，看語意定方向。",
        "be 動詞/形容詞後的介系詞多為固定搭配(interested IN、good AT)，整組背。",
        "看到片語動詞先想中文核心義，再用上下文確認。"
      ],
      formulas: [
        "片語動詞 = 動詞 + 介系詞/副詞 (整組記語意)",
        "判斷流程：先看動詞 → 回想固定搭配介系詞 → 用句意確認方向",
        "可分片語：動詞 + 代名詞 + 介副詞 (turn it off)"
      ],
      problems: [
        { type: "classic", q: "'give up' 與 'put off' 各是什麼意思？",
          hint: "up=放棄方向，off=延後。",
          sol: "give up = 放棄；put off = 延後、拖延。皆為動詞+介副詞的片語動詞。",
          answer: "give up=放棄；put off=延後" },
        { type: "gsat", q: "（學測風格）Success often ____ hard work. (A)results in (B)results from (C)depends",
          hint: "成功『起因於』努力，看方向。",
          sol: "成功是『結果』，努力是『原因』，結果起因於原因用 result from，選 (B) results from。",
          answer: "(B) results from" },
        { type: "gsat", q: "（學測風格）I don't know this word; let me ____ in the dictionary. (A)look up it (B)look it up (C)look up at it",
          hint: "受詞是代名詞 it，可分片語要夾中間。",
          sol: "look up 為可分片語動詞，受詞為代名詞時須放中間：look it up，選 (B)。",
          answer: "(B) look it up" }
      ],
      generators: []
    },
    {
      id: "en_transition",
      title: "6. 連接詞與篇章銜接",
      tags: ["conjunction", "transition", "連接詞", "篇章"],
      fiveYO: "連接詞是『句子和句子之間的橋』。看清楚前後是『轉折、因果還是並列』，" +
        "就能選對橋，文章也才連得順。",
      concepts: [
        { h: "邏輯分類", b: "轉折(however/although)、因果(therefore/because)、遞進(moreover)、對比(while/whereas)。" },
        { h: "詞性差異", b: "although/because 接子句；however/therefore 是副詞要加分號或句點；despite 接名詞。" },
        { h: "成對連接詞", b: "not only...but also、either...or、neither...nor、both...and——主動詞一致要小心。" },
        { h: "篇章銜接", b: "段落間用 first/in addition/in conclusion 等指示語引導讀者。" }
      ],
      tricks: [
        "先判前後句邏輯關係(轉折/因果/並列)，再選對應連接詞。",
        "however/therefore 是副詞，前面要分號或句號，不能像 but 直接連兩句。",
        "although 與 but 不能同句並用(中式英文陷阱)；二擇一。",
        "despite/in spite of 後接名詞或動名詞；although 後接完整子句。",
        "成對連接詞 not only...but also 注意倒裝與動詞單複數一致。"
      ],
      formulas: [
        "判斷流程：前後句邏輯(轉折/因果/並列) → 選對應連接詞 → 檢查詞性接法",
        "副詞性連接：句子; however, 句子 (分號 + 逗號)",
        "讓步：Although + 子句 = Despite + 名詞 (語意同，接法不同)"
      ],
      problems: [
        { type: "classic", q: "although 與 despite 在用法上最大的差別是？",
          hint: "後面接什麼？",
          sol: "although 後接完整子句(主詞+動詞)；despite/in spite of 後接名詞或動名詞。",
          answer: "although接子句、despite接名詞" },
        { type: "gsat", q: "（學測風格）____ it was raining, they decided to go hiking. (A)Despite (B)Although (C)However",
          hint: "後面是完整子句 it was raining。",
          sol: "後接完整子句且表讓步，用 Although；Despite 須接名詞，However 是副詞。選 (B) Although。",
          answer: "(B) Although" },
        { type: "gsat", q: "（學測風格）The plan was risky; ____, the team chose to proceed. (A)therefore (B)nevertheless (C)because",
          hint: "計畫有風險『但仍』執行，是轉折。",
          sol: "前後為轉折(雖有風險仍進行)，用副詞 nevertheless，前有分號相連，選 (B)。",
          answer: "(B) nevertheless" }
      ],
      generators: []
    },
    {
      id: "en_c2e",
      title: "7. 中譯英技巧",
      tags: ["translation", "中譯英", "句型", "寫作"],
      fiveYO: "中譯英不是逐字翻，而是先找中文句的『主詞和動詞』，套對英文句型和時態，" +
        "再把細節補上。對而通順比華麗重要。",
      concepts: [
        { h: "抓主幹", b: "先找中文的主詞、動詞、受詞，確立英文句的骨架再加修飾。" },
        { h: "時態語態", b: "依時間副詞定時態；『被』字句或無明確主詞時考慮被動語態。" },
        { h: "常見句型", b: "It is + adj. + to V、There is/are、so...that、not only...but also。" },
        { h: "中式英文", b: "避免逐字直譯，如『很有興趣』是 be interested in 而非 have interest very。" }
      ],
      tricks: [
        "先寫出英文主詞+動詞主幹，再掛上時間、地點、原因等修飾語。",
        "中文無主詞句(如『據說…』)常用 It is said that 或被動處理。",
        "看到『越來越…』用 more and more / 比較級+and+比較級。",
        "寧用會的簡單句型寫對，也不硬翻複雜句而出文法錯。",
        "翻完回頭檢查：主動詞一致、時態、單複數、冠詞。"
      ],
      formulas: [
        "翻譯流程：抓主詞動詞 → 定時態語態 → 套句型 → 補修飾 → 檢查",
        "It is + 形容詞 + to + 原形 (做某事是…的)",
        "so + 形容詞/副詞 + that + 子句 (如此…以致於)"
      ],
      problems: [
        { type: "classic", q: "中譯英第一步最該先做什麼？",
          hint: "先別急著逐字翻。",
          sol: "先抓出中文句的主詞與動詞(主幹)，確立英文句骨架，再補時態與修飾。",
          answer: "先抓主詞與動詞(句子主幹)" },
        { type: "gsat", q: "（學測風格）『學英文對學生來說很重要。』下列翻譯何者最佳？(A)Learn English is very important to student. (B)It is important for students to learn English. (C)English learn is important student.",
          hint: "用 It is + adj. + for + 人 + to V 句型。",
          sol: "用虛主詞 It is important for students to learn English，主詞動詞與句型皆正確，選 (B)。",
          answer: "(B) It is important for students to learn English." }
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
  },
  {
    id: "en_ep_collocation", name: "片語動詞與介系詞搭配", freq: 4,
    chapters: ["en_phrasal", "en_vocab"],
    insight: "字彙題與克漏字常考固定搭配：動詞配哪個介系詞、片語動詞的語意與可分性。",
    combo: "先看空格前的動詞或形容詞 → 回想其固定介系詞 → 代名詞受詞記得夾在可分片語中間。",
    traps: ["介系詞固定搭配記錯(depend on)", "result in/from 方向相反混用", "可分片語代名詞位置擺錯"]
  },
  {
    id: "en_ep_cohesion", name: "連接詞邏輯與篇章銜接", freq: 5,
    chapters: ["en_transition", "en_reading"],
    insight: "克漏字與閱讀大量考連接詞：判斷前後句的轉折/因果/並列，並注意連接詞詞性接法。",
    combo: "判前後邏輯關係 → 選對應連接詞 → 檢查接法(although接子句、despite接名詞、however加分號)。",
    traps: ["although 與 but 同句並用", "however 當對等連接詞誤用", "despite 後誤接子句"]
  }
]);
