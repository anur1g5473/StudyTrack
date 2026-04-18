/**
 * StudyTrack Service Worker — Offline-First PWA
 *
 * Strategy:
 *  - Static assets (JS/CSS/HTML)  : Cache-First (pre-cached on install)
 *  - App shell (/)                : Network-First, cached fallback
 *  - Google Fonts                 : Stale-While-Revalidate
 *  - Supabase REST/Auth           : Network-Only (real-time accuracy)
 *  - Background Sync              : Flush offline mutation queue on reconnect
 */

const CACHE_VERSION = 'studytrack-v3';
const FONT_CACHE    = 'studytrack-fonts-v1';

// Assets baked into the Vite single-file build
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-192x192-maskable.png',
  '/icons/icon-512x512-maskable.png',
];

// ── Install: pre-cache app shell ──────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch((err) =>
        console.warn('[SW] Pre-cache partial failure:', err)
      )
    ).then(() => self.skipWaiting())
  );
});

// ── Activate: purge old caches ────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION && k !== FONT_CACHE)
            .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: route-aware caching strategies ─────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Skip non-GET
  if (event.request.method !== 'GET') return;

  // 2. Supabase REST / Auth / Realtime — Network Only
  //    Let the app handle failures; never serve stale auth data.
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  // 3. Google Fonts — Stale-While-Revalidate
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(event.request, FONT_CACHE));
    return;
  }

  // 4. App shell / HTML navigation — Network-First, cache fallback
  if (event.request.mode === 'navigate' || url.pathname === '/') {
    event.respondWith(networkFirstWithCacheFallback(event.request));
    return;
  }

  // 5. Static JS/CSS assets — Cache-First (Vite hashes guarantee freshness)
  if (
    url.pathname.match(/\.(js|css|woff2?|ttf|otf|png|svg|ico|webp|jpg)$/)
  ) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // 6. Everything else — Network-First
  event.respondWith(networkFirstWithCacheFallback(event.request));
});

// ── Background Sync ───────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'studytrack-sync') {
    event.waitUntil(notifyClientsToSync());
  }
});

// Tell the open app window to flush its queue
async function notifyClientsToSync() {
  const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const client of allClients) {
    client.postMessage({ type: 'FLUSH_QUEUE' });
  }
}

// ── Caching Helpers ───────────────────────────────────────────

/** Cache-First: serve from cache, update cache in background. */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.status === 200) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

/** Network-First: try network, fall back to cache, then offline page. */
async function networkFirstWithCacheFallback(request) {
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.status === 200) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch {
    const cached = await caches.match(request) ?? await caches.match('/');
    return cached ?? offlinePage();
  }
}

/** Stale-While-Revalidate: serve cache immediately, update cache in background. */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkFetch = fetch(request).then((fresh) => {
    if (fresh && fresh.status === 200) cache.put(request, fresh.clone());
    return fresh;
  }).catch(() => cached);
  return cached ?? networkFetch;
}

/** Minimal offline fallback page — rendered entirely inline. */
function offlinePage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>StudyTrack — Offline</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{
      font-family:'Inter',system-ui,sans-serif;
      background:radial-gradient(ellipse at 15% 25%,#1e1040 0%,#0d0d1f 50%,#000310 100%);
      color:#e2e8f0;
      display:flex;align-items:center;justify-content:center;
      min-height:100vh;padding:24px;
    }
    .card{
      max-width:360px;width:100%;text-align:center;
      background:rgba(255,255,255,0.08);
      border:1px solid rgba(255,255,255,0.2);
      border-bottom-color:rgba(255,255,255,0.05);
      border-radius:24px;
      box-shadow:0 8px 32px rgba(0,0,0,0.8),inset 0 1px 0 rgba(255,255,255,0.16);
      padding:40px 32px;
      backdrop-filter:blur(20px);
    }
    .icon{font-size:56px;margin-bottom:20px}
    h1{font-size:22px;font-weight:700;margin-bottom:10px;letter-spacing:-0.02em}
    p{color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin-bottom:24px}
    .pill{
      display:inline-flex;align-items:center;gap:8px;
      background:rgba(99,102,241,0.2);border:1px solid rgba(99,102,241,0.35);
      border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;
      color:#c4b5fd;
    }
    .dot{
      width:8px;height:8px;border-radius:50%;
      background:#f87171;box-shadow:0 0 8px #f87171;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">📡</div>
    <h1>You're Offline</h1>
    <p>StudyTrack is caching your data for offline access. Any changes you make will sync automatically when your connection is restored.</p>
    <span class="pill"><span class="dot"></span> No Connection</span>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

// ── Push Notifications ────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json?.() ?? { title: 'StudyTrack', body: 'You have a new notification' };
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'StudyTrack', {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      tag: 'studytrack',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((list) => {
      if (list.length > 0) return list[0].focus();
      return clients.openWindow('/');
    })
  );
});
