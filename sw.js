// Offline support for 字里 Zili.
// App files: served from cache, refreshed in the background.
// Reading texts (reading/*) and word lists (data/*): network first, so new texts show up right away; cache is the offline fallback.
// Only caches named "zili-…" are touched: other apps on the same site keep theirs.
const CACHE = "zili-v17";
const DICT = "zili-dict-v3"; // dictionary and stroke files: cache first (they only change when DICT is bumped)
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./fonts/fonts.css", "./vendor/pinyin-pro.js"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("zili-") && k !== CACHE && k !== DICT).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch API calls
  if (url.pathname.includes("/dict/") || url.pathname.includes("/strokes/")) {
    e.respondWith(caches.open(DICT).then(async c => {
      const hit = await c.match(req, { ignoreSearch: true });
      if (hit) return hit;
      const res = await fetch(req);
      if (res && res.ok) c.put(req, res.clone());
      return res;
    }));
    return;
  }
  if (url.pathname.includes("/reading/") || url.pathname.includes("/data/")) {
    const key = url.origin + url.pathname; // ignore the cache-busting query
    e.respondWith(
      fetch(req).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)); }
        return res;
      }).catch(() => caches.match(key))
    );
    return;
  }
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const fresh = fetch(req).then(res => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
