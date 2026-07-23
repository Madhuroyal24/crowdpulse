// ============================================================
// CrowdPulse PWA Engine — Service Worker v2.0
// Offline Caching, App Shell Persistence & Push Notification Handler
// ============================================================

const CACHE_NAME = 'crowdpulse-app-v2.0';
const DYNAMIC_CACHE_NAME = 'crowdpulse-dynamic-v2.0';

// Essential App Shell Resources to pre-cache on install
const APP_SHELL_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './firebase-config.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-functions-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js'
];

// Install Event — Pre-cache App Shell
self.addEventListener('install', event => {
  console.log('[CrowdPulse SW] Installing App Shell…');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[CrowdPulse SW] Pre-caching critical assets');
      return cache.addAll(APP_SHELL_ASSETS).catch(err => {
        console.warn('[CrowdPulse SW] Pre-cache warning (some assets fetched runtime):', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event — Clean up old caches & claim clients
self.addEventListener('activate', event => {
  console.log('[CrowdPulse SW] Activating new Service Worker…');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
            console.log('[CrowdPulse SW] Purging old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event — Network-first for API data, Stale-While-Revalidate for static assets
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET requests (POST, PUT, DELETE cannot be cached directly)
  if (req.method !== 'GET') return;

  // Firestore / Firebase API calls — bypass cache or network-only
  if (url.hostname.includes('firestore.googleapis.com') ||
      url.hostname.includes('firebaseinstallations.googleapis.com') ||
      url.hostname.includes('identitytoolkit.googleapis.com')) {
    return;
  }

  // App Navigation / HTML Requests — Network-first, fallback to cached index.html
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(networkRes => {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('./index.html', resClone));
          return networkRes;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Static Assets (CSS, JS, Fonts, Images) — Stale-While-Revalidate Strategy
  event.respondWith(
    caches.match(req).then(cachedRes => {
      const fetchPromise = fetch(req).then(networkRes => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(DYNAMIC_CACHE_NAME).then(cache => cache.put(req, resClone));
        }
        return networkRes;
      }).catch(err => {
        console.log('[CrowdPulse SW] Network fetch failed, returning cached fallback if available');
      });

      return cachedRes || fetchPromise;
    })
  );
});

// Push Notifications Event (FCM Background Notifications)
self.addEventListener('push', event => {
  console.log('[CrowdPulse SW] Push Notification Received:', event);

  let data = { title: 'CrowdPulse Alert', body: 'New crowd level update available!' };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    if (event.data) data.body = event.data.text();
  }

  const options = {
    body: data.body || data.notification?.body || 'Check live crowd predictions.',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%233b82f6"/><text y=".8em" x="15" font-size="70">⚡</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>',
    vibrate: [100, 50, 100],
    data: data.data || { url: './#dashboard' },
    actions: [
      { action: 'open', title: '👁️ View Live Status' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || data.notification?.title || 'CrowdPulse', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || './#dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
