const CACHE_NAME = 'pocket-tools-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/icon.svg',
  '/tools/unit-converter.html',
  '/tools/unit-converter.js',
  '/tools/unit-converter.css',
  '/tools/timezone-converter.html',
  '/tools/timezone-converter.js',
  '/tools/timezone-converter.css',
  '/tools/typing-speed-test.html',
  '/tools/typing-speed-test.js',
  '/tools/typing-speed-test.css',
  '/tools/character-counter.html',
  '/tools/character-counter.js',
  '/tools/character-counter.css',
  '/tools/percentage-calculator.html',
  '/tools/percentage-calculator.js',
  '/tools/percentage-calculator.css'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching assets');
        return cache.addAll(ASSETS);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});