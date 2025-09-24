importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');


// Cache isimleri
workbox.core.setCacheNameDetails({
    prefix: '/home/emre',
    suffix: 'v2.0',
    precache: 'precache',
    runtime: 'runtime-cache',
});

// Hemen aktif ol
workbox.core.skipWaiting();
workbox.core.clientsClaim();

// Precache manifest'i yükle
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// -------------------------
// HTML -> NetworkFirst
// -------------------------
workbox.routing.registerRoute(
    /\.html$/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'html-cache',
    })
);

// JS ve CSS -> NetworkFirst
workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'static-resources',
    })
);

// Görseller -> CacheFirst
workbox.routing.registerRoute(
    /assets\/(img|icons)/,
    new workbox.strategies.CacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 gün
            }),
        ],
    })
);

// -------------------------
// CDN'ler -> StaleWhileRevalidate
// -------------------------
workbox.routing.registerRoute(
    /^https?:\/\/(?:cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com)/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'cdn-cache',
    })
);

// Google Fonts (CSS) -> StaleWhileRevalidate
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

// Google Fonts (font dosyaları) -> CacheFirst (1 yıl)
workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 yıl
                maxEntries: 30,
            }),
        ],
    })
);
