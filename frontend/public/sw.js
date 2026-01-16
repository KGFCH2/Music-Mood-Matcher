/* eslint-disable no-undef */
const CACHE_NAME = 'music-mood-matcher-v2' // Incremented version to force update
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/music.png',
]

// Install Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Immediately take over from older versions
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        // Log but don't fail installation
        console.warn('SW: Pre-caching failed (likely dev mode):', err);
      });
    })
  );
});

// Fetch from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // 1. Only process GET requests
  if (event.request.method !== 'GET') return;

  // 2. Bypass Service Worker entirely for dev tools and HMR
  const url = new URL(event.request.url);
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    if (url.pathname.includes('@vite') ||
      url.pathname.includes('@react-refresh') ||
      url.pathname.includes('/src/') ||
      url.pathname.includes('node_modules')) {
      return;
    }
  }

  // 3. Asset handling
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached if found
        if (response) return response;

        // Otherwise fetch from network
        return fetch(event.request)
          .catch((err) => {
            // Handle network failure
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            // Return empty response instead of failing promise
            return new Response('Network error', { status: 408 });
          });
      })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName)
            }
          })
        )
      }),
      self.clients.claim()
    ])
  )
})
