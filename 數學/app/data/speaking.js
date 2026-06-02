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

/* ===== 擴充句庫（追加） ===== */
window.SPEAKING = (window.SPEAKING || []).concat([
  // 日常會話
  { en: "Long time no see! How have you been?", zh: "好久不見！你最近好嗎？", cat: "日常會話", tip: "How have you been 連音 /hævjuːbɪn/。" },
  { en: "Have a great day! See you tomorrow.", zh: "祝你有美好的一天！明天見。", cat: "日常會話", tip: "great day 兩個重音，tomorrow 重音在中。" },
  { en: "Sorry to bother you, but could you help me?", zh: "抱歉打擾，但你可以幫我嗎？", cat: "日常會話", tip: "bother 念 /ˈbɑːðər/，注意 th。" },
  { en: "It's my pleasure. Anytime.", zh: "這是我的榮幸，隨時樂意。", cat: "日常會話", tip: "pleasure 念 /ˈpleʒər/。" },
  // 校園生活
  { en: "I'm a little nervous about the exam next week.", zh: "我對下週的考試有點緊張。", cat: "校園生活", tip: "nervous 念 /ˈnɜːrvəs/，about 連音。" },
  { en: "Don't worry. We can review together.", zh: "別擔心，我們可以一起複習。", cat: "校園生活", tip: "review 重音在後 /rɪˈvjuː/。" },
  { en: "Could you explain this question to me?", zh: "你可以跟我解釋這題嗎？", cat: "校園生活", tip: "explain 重音在後，question /ˈkwestʃən/。" },
  { en: "I joined the English speaking club this semester.", zh: "我這學期加入了英語會話社。", cat: "校園生活", tip: "semester 重音在中 /sɪˈmestər/。" },
  // 旅遊購物
  { en: "Could I have the menu, please?", zh: "可以給我菜單嗎？", cat: "旅遊購物", tip: "menu 念 /ˈmenjuː/。" },
  { en: "I'll take this one. Do you accept credit cards?", zh: "我要買這個，你們收信用卡嗎？", cat: "旅遊購物", tip: "credit cards 連音，accept 重音在後。" },
  { en: "Where can I check in for my flight?", zh: "我可以在哪裡辦理登機？", cat: "旅遊購物", tip: "check in 連音，flight 母音長。" },
  { en: "Is there a bus that goes downtown?", zh: "有公車到市中心嗎？", cat: "旅遊購物", tip: "downtown 兩個重音，that goes 連音。" },
  // 意見表達
  { en: "I think we should look at both sides of the issue.", zh: "我認為我們應該看問題的兩面。", cat: "意見表達", tip: "issue 念 /ˈɪʃuː/，both sides 清楚。" },
  { en: "To be honest, I'm not sure about that.", zh: "老實說，我對那不太確定。", cat: "意見表達", tip: "To be honest h 不發音 /ˈɑːnɪst/。" },
  { en: "That makes sense, but let me think about it.", zh: "那有道理，但讓我想想。", cat: "意見表達", tip: "makes sense 連音 /meɪksens/。" },
  { en: "I'd say it depends on the situation.", zh: "我會說那要看情況。", cat: "意見表達", tip: "depends on 連音，situation 四音節。" },
  // 學測句型
  { en: "No matter how hard it is, I will never give up.", zh: "不論多難，我都絕不放棄。", cat: "學測句型", tip: "No matter how 句型，give up 連音。" },
  { en: "It was not until last year that I started running.", zh: "直到去年我才開始跑步。", cat: "學測句型", tip: "It was not until...that 強調句。" },
  { en: "Reading not only broadens our minds but also relaxes us.", zh: "閱讀不僅開闊心胸，也讓我們放鬆。", cat: "學測句型", tip: "not only...but also 對稱平行。" },
  { en: "The harder you work, the luckier you get.", zh: "你越努力，就越幸運。", cat: "學測句型", tip: "比較級平行句，luckier /ˈlʌkiər/。" },
  // 電話與網路（新主題）
  { en: "Hello, may I speak to Mr. Lee, please?", zh: "你好，請問李先生在嗎？", cat: "電話與網路", tip: "may I speak to 連音，禮貌語氣。" },
  { en: "Could you hold on a second? I'll transfer your call.", zh: "可以稍等一下嗎？我幫你轉接。", cat: "電話與網路", tip: "hold on 連音，transfer 重音在後。" },
  { en: "My internet connection is really slow today.", zh: "我今天的網路連線真的很慢。", cat: "電話與網路", tip: "connection /kəˈnekʃn/，slow 母音長。" },
  { en: "Can you send me the file by email?", zh: "你可以用電子郵件把檔案寄給我嗎？", cat: "電話與網路", tip: "send me 連音，email 兩個重音。" },
  // 緊急與健康（新主題）
  { en: "I don't feel well. I think I have a fever.", zh: "我不太舒服，我想我發燒了。", cat: "緊急與健康", tip: "feel well 清楚，fever /ˈfiːvər/。" },
  { en: "Excuse me, where is the nearest hospital?", zh: "不好意思，最近的醫院在哪裡？", cat: "緊急與健康", tip: "nearest 重音在前，hospital h 要發。" },
  { en: "Please call an ambulance right away!", zh: "請立刻叫救護車！", cat: "緊急與健康", tip: "ambulance /ˈæmbjələns/，right away 連音。" },
  { en: "Take care of yourself and get some rest.", zh: "好好照顧自己，多休息。", cat: "緊急與健康", tip: "Take care of 連音 /teɪkkeərəv/。" }
]);

/* ===== 多輪情境對話 ===== */
/* turns[].who: "partner"（對方，由 App 範讀）/ "you"（換你開口，語音評分） */
window.DIALOGUES = [
  {
    id: "dlg_cafe", title: "在咖啡廳點餐", cat: "生活情境",
    scene: "你走進一間咖啡廳，店員上前招呼。請依中文提示開口點餐。",
    turns: [
      { who: "partner", en: "Hi! Welcome to Sunny Cafe. What can I get for you?", zh: "嗨！歡迎光臨陽光咖啡，需要點什麼？" },
      { who: "you", en: "I'd like a medium latte, please.", zh: "我想要一杯中杯拿鐵。", tip: "I'd like 念 /aɪd laɪk/，latte /ˈlɑːteɪ/。" },
      { who: "partner", en: "Sure. Would you like it hot or iced?", zh: "好的，要熱的還是冰的？" },
      { who: "you", en: "Iced, please. And can I add some sugar?", zh: "冰的，謝謝。可以加一點糖嗎？", tip: "add some 連音 /ædsəm/。" },
      { who: "partner", en: "Of course. Anything else?", zh: "當然，還需要別的嗎？" },
      { who: "you", en: "That's all. How much is it?", zh: "就這些，多少錢？", tip: "How much is it 連音 /haʊmʌtʃɪzɪt/。" },
      { who: "partner", en: "It's 120 dollars. Here's your latte. Enjoy!", zh: "一共 120 元，這是你的拿鐵，請慢用！" }
    ]
  },
  {
    id: "dlg_directions", title: "向路人問路", cat: "生活情境",
    scene: "你在陌生城市迷路了，想到火車站。請向路人問路。",
    turns: [
      { who: "you", en: "Excuse me, how can I get to the train station?", zh: "不好意思，請問怎麼去火車站？", tip: "get to 連音 /ɡetə/。" },
      { who: "partner", en: "Sure. Go straight and turn left at the second corner.", zh: "好的，直走然後在第二個路口左轉。" },
      { who: "you", en: "Is it far from here?", zh: "離這裡遠嗎？", tip: "far from 連音，here 收尾。" },
      { who: "partner", en: "Not really. It's about a five-minute walk.", zh: "不會，大約走五分鐘。" },
      { who: "you", en: "Thank you so much for your help!", zh: "非常感謝你的幫忙！", tip: "so much 加強，help 清楚。" },
      { who: "partner", en: "No problem. Have a safe trip!", zh: "不客氣，旅途平安！" }
    ]
  },
  {
    id: "dlg_doctor", title: "看醫生", cat: "生活情境",
    scene: "你感冒不舒服去看醫生，醫生詢問你的症狀。",
    turns: [
      { who: "partner", en: "Good morning. What seems to be the problem?", zh: "早安，哪裡不舒服呢？" },
      { who: "you", en: "I have a sore throat and a runny nose.", zh: "我喉嚨痛又流鼻水。", tip: "sore throat /θroʊt/，runny nose 連音。" },
      { who: "partner", en: "How long have you had these symptoms?", zh: "這些症狀多久了？" },
      { who: "you", en: "For about three days.", zh: "大約三天了。", tip: "For about 連音 /fərəˈbaʊt/。" },
      { who: "partner", en: "Do you have a fever?", zh: "有發燒嗎？" },
      { who: "you", en: "Yes, a little. I also feel tired.", zh: "有一點，我也覺得很累。", tip: "a little 連音，tired /ˈtaɪərd/。" },
      { who: "partner", en: "Okay. Take this medicine and drink plenty of water.", zh: "好，吃這個藥並多喝水。" }
    ]
  },
  {
    id: "dlg_airport", title: "機場報到", cat: "旅遊情境",
    scene: "你在機場櫃台辦理登機手續，地勤人員為你服務。",
    turns: [
      { who: "partner", en: "Good afternoon. May I see your passport, please?", zh: "午安，可以看一下你的護照嗎？" },
      { who: "you", en: "Sure, here you are.", zh: "當然，在這裡。", tip: "here you are 連音 /hɪrjuːɑːr/。" },
      { who: "partner", en: "Would you prefer a window or an aisle seat?", zh: "你想要靠窗還是走道的位子？" },
      { who: "you", en: "A window seat, please.", zh: "靠窗的位子，謝謝。", tip: "window 重音在前，seat 母音長。" },
      { who: "partner", en: "Do you have any bags to check in?", zh: "有行李要托運嗎？" },
      { who: "you", en: "Yes, I have one suitcase.", zh: "有，我有一個行李箱。", tip: "suitcase /ˈsuːtkeɪs/。" },
      { who: "partner", en: "All set. Your gate is B12. Have a nice flight!", zh: "都好了，你的登機門是 B12，祝旅途愉快！" }
    ]
  },
  {
    id: "dlg_interview", title: "大學面試自我介紹", cat: "升學情境",
    scene: "個人申請大學面試，教授請你自我介紹並回答問題。",
    turns: [
      { who: "partner", en: "Welcome. Could you introduce yourself briefly?", zh: "歡迎，可以簡短自我介紹嗎？" },
      { who: "you", en: "Hello, my name is Wang Ming. I'm interested in medicine.", zh: "你好，我叫王明，我對醫學有興趣。", tip: "interested 重音在前，medicine /ˈmedɪsɪn/。" },
      { who: "partner", en: "Why do you want to study in our department?", zh: "你為什麼想念我們系？" },
      { who: "you", en: "Because I want to help people and save lives.", zh: "因為我想幫助別人、拯救生命。", tip: "save lives 連音，lives 念 /laɪvz/。" },
      { who: "partner", en: "What is your greatest strength?", zh: "你最大的優點是什麼？" },
      { who: "you", en: "I am hardworking and good at solving problems.", zh: "我很努力，也擅長解決問題。", tip: "good at 連音 /ɡʊdæt/。" },
      { who: "partner", en: "Great. Thank you. We'll let you know the result soon.", zh: "很好，謝謝你，我們會盡快通知結果。" }
    ]
  },
  {
    id: "dlg_weekend", title: "和朋友約週末", cat: "生活情境",
    scene: "朋友打電話來想約你週末出去，你和他討論計畫。",
    turns: [
      { who: "partner", en: "Hey! Are you free this weekend?", zh: "嘿！你這週末有空嗎？" },
      { who: "you", en: "Yes, I'm free on Saturday afternoon.", zh: "有，我星期六下午有空。", tip: "Saturday 重音在前，afternoon 重音在後。" },
      { who: "partner", en: "Cool. Do you want to watch a movie?", zh: "太好了，你想去看電影嗎？" },
      { who: "you", en: "Sounds great. What time should we meet?", zh: "聽起來不錯，我們幾點碰面？", tip: "Sounds great 連音，meet 母音長。" },
      { who: "partner", en: "How about two o'clock at the theater?", zh: "兩點在電影院如何？" },
      { who: "you", en: "Perfect. See you there!", zh: "太好了，到時候見！", tip: "See you there 連音 /siːjuːðer/。" }
    ]
  }
];
