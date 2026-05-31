/* ============================================================
 * curriculum.js — 多科課程容器（國/英/數A/物/化/生/地科）
 * 每科 = 一個 subject，內含 books[] 與 exampoints[]。
 * 既有的 allChapters/chapterById/allProblems/books 一律操作「目前選中的科目」，
 * 因此所有功能（教學/練習/模擬考/級分/分析/整合考點）自動套用到每一科。
 * 設計成 classic script，雙擊 index.html 即可運作。
 * ============================================================ */
window.CURRICULUM = {
  subjects: [],          // 有序：[{id,name,icon,books:[],exampoints:[]}]
  _byId: {},
  active: null,
  _building: null,

  /* 開始定義一個科目（之後的 addBook/addExamPoints 都歸這科） */
  beginSubject: function (meta) {
    var s = this._byId[meta.id];
    if (!s) {
      s = { id: meta.id, name: meta.name, icon: meta.icon || "📘", books: [], exampoints: [] };
      this._byId[meta.id] = s;
      this.subjects.push(s);
    } else {
      if (meta.name) s.name = meta.name;
      if (meta.icon) s.icon = meta.icon;
    }
    this._building = s.id;
    if (!this.active) this.active = s.id;
    return s;
  },

  /* 取得目前正在建構的科目；數A 的 book 檔沒呼叫 beginSubject，預設建立數A */
  _cur: function () {
    if (!this._building) this.beginSubject({ id: "matha", name: "數學A", icon: "📐" });
    return this._byId[this._building];
  },

  addBook: function (book) { this._cur().books.push(book); },
  addExamPoints: function (arr) { var s = this._cur(); s.exampoints = s.exampoints.concat(arr || []); },

  /* 切換目前科目，同步全域 EXAMPOINTS（給 exam/analytics 用） */
  setActive: function (id) {
    if (!this._byId[id]) return false;
    this.active = id;
    try { localStorage.setItem("subject_active", id); } catch (e) { }
    window.EXAMPOINTS = this._byId[id].exampoints;
    return true;
  },
  activeSubject: function () { return this._byId[this.active] || null; },
  subjectList: function () {
    return this.subjects.map(function (s) {
      return { id: s.id, name: s.name, icon: s.icon, chapters: s.books.reduce(function (n, b) { return n + b.chapters.length; }, 0) };
    });
  },

  /* 啟動時還原上次選的科目；並確保 window.EXAMPOINTS 同步 */
  initActive: function () {
    var saved = null;
    try { saved = localStorage.getItem("subject_active"); } catch (e) { }
    if (saved && this._byId[saved]) this.active = saved;
    if (!this.active && this.subjects.length) this.active = this.subjects[0].id;
    if (this.active) window.EXAMPOINTS = this._byId[this.active].exampoints;
  },

  /* ---- 以下皆作用於「目前選中的科目」（向後相容） ---- */
  get books() { var s = this._byId[this.active]; return s ? s.books : []; },

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
    // 跨全科目尋找（連結可能來自任何科），但預設先找當前科
    var hit = this.allChapters().filter(function (c) { return c.id === id; })[0];
    if (hit) return hit;
    for (var i = 0; i < this.subjects.length; i++) {
      var s = this.subjects[i];
      for (var j = 0; j < s.books.length; j++) {
        var b = s.books[j];
        for (var k = 0; k < b.chapters.length; k++) {
          if (b.chapters[k].id === id) return Object.assign({ bookId: b.id, bookTitle: b.title, subjectId: s.id }, b.chapters[k]);
        }
      }
    }
    return null;
  },

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
