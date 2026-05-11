// ========================================
// 英文學習 App - 核心邏輯
// 簡化版 SM-2 間隔重複演算法 + 拼字練習
// 資料用 localStorage 儲存
// ========================================

const STORAGE_KEY = "english_learning_app_v1";
const DAILY_GOAL = 10;

// 間隔重複設定:Level 1~5 對應「下次複習的天數延遲」
// Level 1=當天,2=1 天後,3=3 天後,4=7 天後,5=30 天後
const SRS_INTERVALS = {
  1: 0,
  2: 1,
  3: 3,
  4: 7,
  5: 30,
};

const LEVEL_NAMES = {
  1: "剛學",
  2: "熟悉",
  3: "熟練",
  4: "精通",
  5: "長期記憶",
};

// ========================================
// 資料模型
// ========================================

function getDefaultState() {
  return {
    progress: {},
    stats: {
      totalCorrect: 0,
      totalWrong: 0,
      dailyCorrect: 0,
      dailyWrong: 0,
      dailyDate: todayStr(),
      streak: 0,
      lastActiveDate: null,
    },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    return { ...getDefaultState(), ...parsed };
  } catch (e) {
    console.warn("讀取資料失敗,使用預設值", e);
    return getDefaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

// ========================================
// 工具函式
// ========================================

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function daysBetween(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString();
}

function normalizeAnswer(s) {
  return (s || "").trim().toLowerCase();
}

// ========================================
// 每日重置 & 連續天數
// ========================================

function maybeResetDailyStats() {
  const today = todayStr();
  if (state.stats.dailyDate !== today) {
    state.stats.dailyCorrect = 0;
    state.stats.dailyWrong = 0;
    state.stats.dailyDate = today;
    saveState();
  }
}

function updateStreak() {
  const today = todayStr();
  const last = state.stats.lastActiveDate;

  if (!last) {
    state.stats.streak = 1;
  } else if (last !== today) {
    const diff = daysBetween(last, today);
    if (diff === 1) {
      state.stats.streak += 1;
    } else if (diff > 1) {
      state.stats.streak = 1;
    }
  }
  state.stats.lastActiveDate = today;
  saveState();
}

// ========================================
// 取得單字進度紀錄
// getProgress 只讀,getOrCreateProgress 才會建立
// 避免在統計時把未學過的單字也算進去
// ========================================

function getProgress(wordId) {
  return state.progress[wordId] || null;
}

function getOrCreateProgress(wordId) {
  if (!state.progress[wordId]) {
    state.progress[wordId] = {
      level: 1,
      lastReviewed: null,
      nextReview: new Date().toISOString(),
      correctCount: 0,
      wrongCount: 0,
      lastResultCorrect: null,
    };
  }
  return state.progress[wordId];
}

// ========================================
// 取得當前該複習的單字佇列
// 沒學過 → 視為待學;已學過且 nextReview <= now → 待複習
// ========================================

function getDueWords() {
  const now = Date.now();
  const due = [];

  for (const word of WORDS_DATA) {
    const p = getProgress(word.id);
    if (!p) {
      due.push({
        word,
        progress: { level: 1, nextReview: null, lastResultCorrect: null, correctCount: 0, wrongCount: 0 },
        isNew: true,
      });
    } else {
      const nextTime = new Date(p.nextReview).getTime();
      if (nextTime <= now) {
        due.push({ word, progress: p, isNew: false });
      }
    }
  }

  // 排序:剛答錯的優先 → level 低的優先 → 已學過優先於新單字
  due.sort((a, b) => {
    if (a.progress.lastResultCorrect === false && b.progress.lastResultCorrect !== false) return -1;
    if (b.progress.lastResultCorrect === false && a.progress.lastResultCorrect !== false) return 1;
    if (a.progress.level !== b.progress.level) return a.progress.level - b.progress.level;
    if (a.isNew !== b.isNew) return a.isNew ? 1 : -1;
    return 0;
  });

  return due;
}

// ========================================
// 處理答對 / 答錯
// ========================================

function markCorrect(word) {
  const p = getOrCreateProgress(word.id);
  p.level = Math.min(5, p.level + 1);
  p.correctCount += 1;
  p.lastReviewed = new Date().toISOString();
  p.nextReview = addDays(new Date(), SRS_INTERVALS[p.level]);
  p.lastResultCorrect = true;

  state.stats.totalCorrect += 1;
  state.stats.dailyCorrect += 1;
  saveState();
}

function markWrong(word) {
  const p = getOrCreateProgress(word.id);
  p.level = 1;
  p.wrongCount += 1;
  p.lastReviewed = new Date().toISOString();
  // 答錯的當天再次出現
  p.nextReview = new Date().toISOString();
  p.lastResultCorrect = false;

  state.stats.totalWrong += 1;
  state.stats.dailyWrong += 1;
  saveState();
}

// ========================================
// UI: 分頁切換
// ========================================

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b === btn));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.toggle("active", c.id === target));

    if (target === "stats") renderStats();
    if (target === "wrong") renderWrongList();
  });
});

// ========================================
// UI: 練習頁
// ========================================

let currentWord = null;
let currentQueue = [];
let dailyAnswered = 0;

function refreshQueue() {
  currentQueue = getDueWords();
}

function loadNextWord() {
  const card = document.getElementById("practiceCard");
  const feedback = document.getElementById("feedback");
  feedback.className = "feedback";
  feedback.innerHTML = "";

  const input = document.getElementById("answerInput");
  input.value = "";
  input.className = "answer-input";
  input.disabled = false;

  document.getElementById("hintArea").textContent = "";

  if (currentQueue.length === 0) {
    refreshQueue();
  }

  if (currentQueue.length === 0) {
    showCompletion();
    return;
  }

  const next = currentQueue.shift();
  currentWord = next.word;

  document.getElementById("chineseDisplay").textContent =
    `${currentWord.chinese}`;
  document.getElementById("posBadge").textContent = currentWord.pos;
  document.getElementById("levelBadge").textContent =
    `Lv.${next.progress.level} · ${LEVEL_NAMES[next.progress.level]}`;

  input.focus();
}

function showCompletion() {
  const card = document.getElementById("practiceCard");
  card.innerHTML = `
    <div class="completion-message">
      <div class="completion-emoji">🎉</div>
      <div class="completion-title">太棒了!今天的進度都完成了!</div>
      <div class="completion-desc">已完成 ${dailyAnswered} 題練習,明天再回來複習吧!</div>
      <button class="submit-btn" onclick="location.reload()">重新開始</button>
    </div>
  `;
  document.querySelector(".tool-row").style.display = "none";
}

function showFeedback(correct, word, userInput) {
  const feedback = document.getElementById("feedback");
  const input = document.getElementById("answerInput");

  if (correct) {
    feedback.className = "feedback correct show";
    feedback.innerHTML = `
      <div class="feedback-answer">✅ 答對了!</div>
      <div><strong>${word.english}</strong> — ${word.chinese}</div>
      <div class="feedback-example">"${word.example}"</div>
      <div class="feedback-translation">${word.translation}</div>
    `;
    input.classList.add("correct");
    showOverlay("✅");
  } else {
    feedback.className = "feedback wrong show";
    feedback.innerHTML = `
      <div class="feedback-answer">❌ 正確答案是 <strong>${word.english}</strong></div>
      <div style="color: var(--text-secondary); font-size: 0.9rem;">你輸入了:${userInput || "(空白)"}</div>
      <div class="feedback-example">"${word.example}"</div>
      <div class="feedback-translation">${word.translation}</div>
    `;
    input.classList.add("shake");
    setTimeout(() => input.classList.remove("shake"), 500);
    showOverlay("❌");
  }
}

function showOverlay(icon) {
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = `<div class="overlay-icon">${icon}</div>`;
  overlay.classList.add("show");
  setTimeout(() => overlay.classList.remove("show"), 600);
}

// 提交答案
document.getElementById("answerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentWord) return;

  const input = document.getElementById("answerInput");
  const userAnswer = normalizeAnswer(input.value);
  const correctAnswer = normalizeAnswer(currentWord.english);

  if (userAnswer === "") return;

  const isCorrect = userAnswer === correctAnswer;

  if (isCorrect) {
    markCorrect(currentWord);
  } else {
    markWrong(currentWord);
  }

  showFeedback(isCorrect, currentWord, input.value);
  input.disabled = true;
  dailyAnswered += 1;
  updateProgress();
  updateStreakUI();

  // 1.5 秒後進入下一題(答錯時延長到 2.5 秒,讓使用者看清楚)
  setTimeout(() => loadNextWord(), isCorrect ? 1500 : 2500);
});

// 提示功能:顯示前 2 個字母 + 字數
document.getElementById("hintBtn").addEventListener("click", () => {
  if (!currentWord) return;
  const word = currentWord.english;
  const visible = Math.min(2, word.length);
  const masked = word.slice(0, visible) + " " + "_ ".repeat(Math.max(0, word.length - visible));
  document.getElementById("hintArea").textContent = `${masked.trim()}  (${word.length} 字)`;
});

// 跳過
document.getElementById("skipBtn").addEventListener("click", () => {
  if (!currentWord) return;
  // 跳過視為答錯(避免投機)
  markWrong(currentWord);
  showFeedback(false, currentWord, "(跳過)");
  document.getElementById("answerInput").disabled = true;
  dailyAnswered += 1;
  updateProgress();
  setTimeout(() => loadNextWord(), 2500);
});

// ========================================
// UI: 今日進度條
// ========================================

function updateProgress() {
  const done = Math.min(dailyAnswered, DAILY_GOAL);
  const pct = (done / DAILY_GOAL) * 100;
  document.getElementById("progressFill").style.width = `${pct}%`;
  document.getElementById("progressText").textContent = `${done} / ${DAILY_GOAL}`;
}

function updateStreakUI() {
  document.getElementById("streakDays").textContent = state.stats.streak;
}

// ========================================
// UI: 統計頁
// ========================================

function renderStats() {
  maybeResetDailyStats();

  document.getElementById("todayCorrect").textContent = state.stats.dailyCorrect;
  document.getElementById("todayWrong").textContent = state.stats.dailyWrong;

  const totalLearned = Object.keys(state.progress).length;
  document.getElementById("totalLearned").textContent = totalLearned;

  const totalAttempts = state.stats.totalCorrect + state.stats.totalWrong;
  const accuracy = totalAttempts > 0
    ? Math.round((state.stats.totalCorrect / totalAttempts) * 100)
    : null;
  document.getElementById("accuracyRate").textContent =
    accuracy !== null ? `${accuracy}%` : "—";

  // 熟練度分布
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const wordId in state.progress) {
    const lv = state.progress[wordId].level;
    if (dist[lv] !== undefined) dist[lv] += 1;
  }
  const max = Math.max(1, ...Object.values(dist));
  const distHtml = [1, 2, 3, 4, 5].map(lv => {
    const count = dist[lv];
    const pct = (count / max) * 100;
    return `
      <div class="level-row">
        <span class="level-name">Lv.${lv} ${LEVEL_NAMES[lv]}</span>
        <div class="level-bar-wrap">
          <div class="level-bar lv${lv}" style="width: ${pct}%"></div>
        </div>
        <span class="level-count">${count}</span>
      </div>
    `;
  }).join("");
  document.getElementById("levelDistribution").innerHTML = distHtml;

  // 目標進度(預估學測級分)
  const goalTotal = 7000;
  const goalPct = Math.min(100, (totalLearned / goalTotal) * 100);
  document.getElementById("goalText").textContent = `${totalLearned} / ${goalTotal}`;
  document.getElementById("goalFill").style.width = `${goalPct}%`;

  const estLevel = estimateExamLevel(totalLearned);
  document.getElementById("goalHint").textContent =
    `預估學測級分:${estLevel} 級 · 連續 ${state.stats.streak} 天加油!`;
}

function estimateExamLevel(learned) {
  // 粗估:1500=9 級,3000=12 級,5000=14 級,7000=15 級
  if (learned < 500) return "5-7";
  if (learned < 1500) return "8-9";
  if (learned < 3000) return "10-12";
  if (learned < 5000) return "13-14";
  return "15";
}

// 重置資料
document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("確定要重置所有學習資料嗎?此動作無法復原!")) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
});

// ========================================
// UI: 錯題本
// ========================================

function renderWrongList() {
  const container = document.getElementById("wrongList");
  const wrong = [];

  for (const word of WORDS_DATA) {
    const p = state.progress[word.id];
    if (p && p.wrongCount > 0) {
      wrong.push({ word, progress: p });
    }
  }

  wrong.sort((a, b) => b.progress.wrongCount - a.progress.wrongCount);

  if (wrong.length === 0) {
    container.innerHTML = `
      <div class="wrong-empty">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🌟</div>
        <div>還沒有錯題,繼續加油!</div>
      </div>
    `;
    return;
  }

  container.innerHTML = wrong.map(({ word, progress }) => `
    <div class="wrong-card">
      <div class="wrong-word">${word.english} <span style="color: var(--text-muted); font-weight: 400; font-size: 0.85rem;">${word.pos}</span></div>
      <div class="wrong-meaning">${word.chinese}</div>
      <div class="wrong-stat">答錯 ${progress.wrongCount} 次 · 目前 Lv.${progress.level}</div>
    </div>
  `).join("");
}

// ========================================
// 啟動
// ========================================

function init() {
  maybeResetDailyStats();
  updateStreak();
  updateStreakUI();
  dailyAnswered = state.stats.dailyCorrect + state.stats.dailyWrong;
  updateProgress();
  refreshQueue();
  loadNextWord();
}

init();
