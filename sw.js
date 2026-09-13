/* C2E service worker — offline access to tour info, checklist, itinerary.
   Strategy: network-first for pages & code (always fresh when online),
   cache-first for images. Bump CACHE when assets change. */
const CACHE = 'c2e-v26';
const CORE = [
  './',
  'index.html',
  'style.css?v=26',
  'script.js?v=26',
  'image/logo-face.png',
  'image/icon-192.png',
  'image/icon-512.png',
  'image/thumbnail.png',
  'image/kakao-qr.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // let cross-origin (fonts, map tiles, youtube) hit network

  const isCode = /\.(?:css|js)(?:\?|$)/.test(url.pathname + url.search);

  // Pages & code: network-first so online always gets the latest; cache is the offline fallback
  if (req.mode === 'navigate' || isCode) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('index.html')))
    );
    return;
  }

  // Everything else (images, manifest): cache-first
  e.respondWith(
    caches.match(req).then((cached) =>
      cached ||
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => cached)
    )
  );
});
