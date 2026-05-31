/* service worker：離線快取 app 核心檔 + 內建 KaTeX（首次連線後即可完全離線使用） */
var CACHE = "math-a-v5";
var CORE = [
  "./", "./index.html",
  "./css/style.css",
  "./data/curriculum.js", "./data/book1.js", "./data/book2.js", "./data/book3.js", "./data/book4.js",
  "./js/generator.js", "./js/diagrams.js", "./js/llm.js", "./js/scoring.js", "./js/analytics.js", "./js/exam.js", "./js/app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png",
  // KaTeX 本機 vendor（核心檔；字型 woff2 由 fetch handler 動態快取）
  "./vendor/katex/katex.min.css",
  "./vendor/katex/katex.min.js",
  "./vendor/katex/contrib/auto-render.min.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    // 個別加入，避免單一資源失敗導致整體失敗
    return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () { }); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  // 不快取 LLM API 呼叫
  if (e.request.url.indexOf("api.openai.com") >= 0 || e.request.url.indexOf("api.anthropic.com") >= 0) return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) {
        // 動態快取同源資源（含 KaTeX woff2 字型），下次離線可用
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy).catch(function () { }); });
        return res;
      }).catch(function () { return hit; });
    })
  );
});
