const CACHE_NAME = "kotoklicker-v5";
const URLS_TO_CACHE = [
  "/KoToKlicKeP-0.2/",
  "/KoToKlicKeP-0.2/index.html",
  "/KoToKlicKeP-0.2/style.css",
  "/KoToKlicKeP-0.2/script.js",
  "/KoToKlicKeP-0.2/icon-192x192.png",
  "/KoToKlicKeP-0.2/icon-512x512.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
