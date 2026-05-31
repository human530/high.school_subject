/* service worker：離線快取 app 核心檔 + 內建 KaTeX（首次連線後即可完全離線使用）
 * 更新策略：
 *  - app 殼（html/css/js/json）走 network-first → 有網路一定拿到最新版，離線才用快取。
 *  - 字型/KaTeX/圖示等靜態資產走 cache-first（很少變，省流量）。
 *  - 換版時自動 skipWaiting + claim，配合頁面的 controllerchange 自動重載。
 */
var CACHE = "math-a-v12";
var CORE = [
  "./", "./index.html",
  "./css/style.css",
  "./data/curriculum.js", "./data/book1.js", "./data/book2.js", "./data/book3.js", "./data/book4.js",
  "./data/exampoints.js",
  "./data/subj_chinese.js", "./data/subj_english.js", "./data/subj_physics.js",
  "./data/subj_chemistry.js", "./data/subj_biology.js", "./data/subj_earth.js",
  "./js/generator.js", "./js/diagrams.js", "./js/llm.js", "./js/scoring.js", "./js/analytics.js", "./js/exam.js", "./js/app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png",
  // KaTeX 本機 vendor（核心檔；字型 woff2 由 fetch handler 動態快取）
  "./vendor/katex/katex.min.css",
  "./vendor/katex/katex.min.js",
  "./vendor/katex/contrib/auto-render.min.js",
  "./vendor/iansui/iansui-latin.woff2",
  "./vendor/iansui/iansui-tc.woff2"
];

// app 殼：要永遠拿最新版的副檔名 / 路徑
function isAppShell(url) {
  return /\.(html|css|js|webmanifest|json)(\?|$)/.test(url) || url.endsWith("/");
}

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () { }); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// 讓頁面能主動叫 SW 立即接管
self.addEventListener("message", function (e) {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = e.request.url;
  // 不快取 LLM API 呼叫
  if (url.indexOf("api.openai.com") >= 0 || url.indexOf("api.anthropic.com") >= 0) return;

  if (isAppShell(url)) {
    // network-first：有網路拿最新並更新快取，離線才退回快取
    e.respondWith(
      fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy).catch(function () { }); });
        return res;
      }).catch(function () {
        return caches.match(e.request).then(function (hit) {
          return hit || caches.match("./index.html");
        });
      })
    );
    return;
  }

  // 其餘（字型/圖示等）cache-first
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy).catch(function () { }); });
        return res;
      }).catch(function () { return hit; });
    })
  );
});
