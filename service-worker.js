const CACHE_NAME = "emre-blog-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/assets/css/main.css",
    "/assets/js/main.js",
    // Önemli sayfalar ve varlıklar
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
