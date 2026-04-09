const CACHE_NAME = 'studytrack-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        console.log('Could not cache all assets');
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Supabase API calls - always go to network
  if (request.url.includes('supabase')) {
    event.respondWith(fetch(request));
    return;
  }

  // For everything else: try network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fall back to cache if network fails
        return caches.match(request).then((response) => {
          return response || createOfflinePage();
        });
      })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New notification from StudyTrack',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: 'studytrack-notification',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification('StudyTrack', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If app is already open, focus it
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      // Otherwise, open the app
      return clients.openWindow('/');
    })
  );
});

// Create offline fallback page
function createOfflinePage() {
  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>StudyTrack - Offline</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0a0a1a;
            color: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
          }
          .container {
            text-align: center;
            max-width: 400px;
          }
          .icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 10px;
            font-weight: 600;
          }
          p {
            color: #94a3b8;
            font-size: 14px;
            line-height: 1.6;
          }
          .tips {
            margin-top: 30px;
            padding: 20px;
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.2);
            border-radius: 12px;
            text-align: left;
          }
          .tips h3 {
            font-size: 14px;
            margin-bottom: 10px;
            color: #a78bfa;
          }
          .tips ul {
            font-size: 12px;
            color: #cbd5e1;
            list-position: inside;
          }
          .tips li {
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">📡</div>
          <h1>You're Offline</h1>
          <p>StudyTrack requires an internet connection to sync your data with the server. Your session data is saved locally while offline.</p>
          <div class="tips">
            <h3>What you can do:</h3>
            <ul>
              <li>View your cached subjects and notes</li>
              <li>Review your progress offline</li>
              <li>Check your achievement list</li>
            </ul>
          </div>
        </div>
      </body>
    </html>`,
    {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }
  );
}
