const CACHE_NAME = 'versezero-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/192.png',
  
  '/512.png',
  '/bible.txt',
  // Add other static assets (e.g., CSS, JS files)
];

// Install the service worker and cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate the service worker and clean up old caches
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

// Fetch event: Serve cached files or fetch from network
self.addEventListener('fetch', (event) => {
  // Handle requests for manifest.json
  if (event.request.url.endsWith('/manifest.json')) {
    event.respondWith(
      caches.match('/manifest.json').then((response) => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  // Handle other requests (e.g., bible.txt, HTML, etc.)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Fallback for offline (optional: serve a custom offline page)
        return caches.match('/index.html');
      });
    })
  );
});
