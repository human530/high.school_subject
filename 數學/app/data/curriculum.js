/* ============================================================
 * curriculum.js — 數A 1~4 冊課程資料的容器與工具
 * 各冊內容由 book1.js ~ book4.js 以 CURRICULUM.addBook() 注入。
 * 設計成 classic script（非 ES module），雙擊 index.html 即可運作，
 * 不依賴 fetch / 伺服器，方便離線與 GitHub Pages。
 * ============================================================ */
window.CURRICULUM = {
  books: [],
  addBook: function (book) { this.books.push(book); },

  /* 攤平成「所有章節」的陣列，附上冊別資訊 */
  allChapters: function () {
    var out = [];
    this.books.forEach(function (b) {
      b.chapters.forEach(function (c) {
        out.push(Object.assign({ bookId: b.id, bookTitle: b.title }, c));
      });
    });
    return out;
  },

  chapterById: function (id) {
    return this.allChapters().filter(function (c) { return c.id === id; })[0] || null;
  },

  /* 整本書所有題目（含每章 classic / gsat）攤平 */
  allProblems: function () {
    var out = [];
    this.allChapters().forEach(function (c) {
      (c.problems || []).forEach(function (p, i) {
        out.push(Object.assign({ chapterId: c.id, chapterTitle: c.title, idx: i }, p));
      });
    });
    return out;
  }
};
