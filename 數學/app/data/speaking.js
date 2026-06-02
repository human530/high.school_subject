/* ============================================================
 * speaking.js — 英文口語練習句庫（離線可用）
 * 每句：en 英文、zh 中文、cat 類別、tip 口說提示（連音/重音/常見錯誤）。
 * 搭配瀏覽器 Web Speech API：TTS 範讀 + 語音辨識評分（見 app.js viewSpeak）。
 * ============================================================ */
window.SPEAKING = [
  // ===== 日常會話 =====
  { en: "How are you doing today?", zh: "你今天過得如何？", cat: "日常會話", tip: "doing 的 -ing 輕讀，today 重音在後。" },
  { en: "Nice to meet you. I'm a high school student.", zh: "很高興認識你，我是高中生。", cat: "日常會話", tip: "Nice to 連音念成 /naɪstə/。" },
  { en: "Could you say that again, please?", zh: "可以請你再說一次嗎？", cat: "日常會話", tip: "禮貌語氣，句尾 please 語調下降。" },
  { en: "I'm sorry, I didn't catch what you said.", zh: "抱歉，我沒聽清楚你說的話。", cat: "日常會話", tip: "didn't 的 t 幾乎不發音，catch 重音。" },
  { en: "Thank you so much for your help.", zh: "非常感謝你的幫忙。", cat: "日常會話", tip: "so much 加強語氣，help 收尾清楚。" },
  { en: "No problem. You're welcome.", zh: "沒問題，不客氣。", cat: "日常會話", tip: "problem 念 /ˈprɑːbləm/，別念成 ploblem。" },

  // ===== 校園生活 =====
  { en: "What time does the next class start?", zh: "下一節課幾點開始？", cat: "校園生活", tip: "does the 連音，start 的 r 要捲舌。" },
  { en: "I have to finish my homework before dinner.", zh: "我得在晚餐前寫完作業。", cat: "校園生活", tip: "have to 念 /hæftə/，homework 重音在前。" },
  { en: "Can I borrow your notes for a moment?", zh: "我可以借一下你的筆記嗎？", cat: "校園生活", tip: "borrow 別念成 borow，注意雙 r。" },
  { en: "I'm preparing for the GSAT this year.", zh: "我今年正在準備學測。", cat: "校園生活", tip: "preparing 重音在 -par-，GSAT 逐字母念。" },
  { en: "Let's study together at the library after school.", zh: "放學後我們一起去圖書館讀書吧。", cat: "校園生活", tip: "library 三音節 /ˈlaɪbreri/，別吞音。" },

  // ===== 旅遊購物 =====
  { en: "Excuse me, how can I get to the train station?", zh: "不好意思，請問怎麼去火車站？", cat: "旅遊購物", tip: "get to 連音 /ɡetə/，station 念 /ˈsteɪʃn/。" },
  { en: "How much does this one cost?", zh: "這個多少錢？", cat: "旅遊購物", tip: "does this 連音，cost 母音短促。" },
  { en: "I'd like a cup of coffee, please.", zh: "我想要一杯咖啡，謝謝。", cat: "旅遊購物", tip: "I'd like 念 /aɪd laɪk/，cup of 連音 /kʌpəv/。" },
  { en: "Do you have this in a smaller size?", zh: "這個有小一點的尺寸嗎？", cat: "旅遊購物", tip: "smaller 比較級 -er 輕讀，size 尾音 z。" },

  // ===== 意見表達（口說／面試常用）=====
  { en: "In my opinion, reading helps us think more clearly.", zh: "在我看來，閱讀幫助我們思考得更清楚。", cat: "意見表達", tip: "opinion 重音 /əˈpɪnjən/，clearly 收尾清楚。" },
  { en: "I agree with you, but I have a different idea.", zh: "我同意你，但我有不同的想法。", cat: "意見表達", tip: "agree with 連音，different 念兩或三音節皆可。" },
  { en: "On the one hand it's cheap; on the other hand it's slow.", zh: "一方面它便宜，另一方面它很慢。", cat: "意見表達", tip: "對比句型，兩個 hand 都要清楚停頓。" },
  { en: "That's a good point, and I'd like to add something.", zh: "這是個好觀點，我想補充一些。", cat: "意見表達", tip: "point 尾音 t 輕收，add 母音短。" },
  { en: "Personally, I prefer learning by doing.", zh: "就我個人而言，我比較喜歡做中學。", cat: "意見表達", tip: "Personally 重音在前，prefer 重音在後。" },

  // ===== 學測高分句型（口說化練習）=====
  { en: "Not only is it useful, but it is also fun.", zh: "它不僅有用，而且很有趣。", cat: "學測句型", tip: "Not only 倒裝句，is 提前；語調先升後降。" },
  { en: "The more you practice, the better you become.", zh: "你練習得越多，就變得越好。", cat: "學測句型", tip: "The more...the better 句型，兩個 the 輕讀。" },
  { en: "It is important for students to manage their time well.", zh: "對學生來說，管理好時間很重要。", cat: "學測句型", tip: "It is...for...to 句型，important 別漏 -por-。" },
  { en: "If I had more time, I would travel around the world.", zh: "如果我有更多時間，我會環遊世界。", cat: "學測句型", tip: "假設語氣 would，had/would 重讀表假設。" },
  { en: "Learning English opens the door to the world.", zh: "學英文為你打開通往世界的大門。", cat: "學測句型", tip: "opens 的 s 念 /z/，world 捲舌收尾。" }
];
