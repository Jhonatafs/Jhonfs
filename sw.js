const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1"];
const IS_LOCALHOST = LOCAL_HOSTS.includes(self.location.hostname);
const CACHE_NAME = "jhonfs-ecosystem-v4";

const CORE_ASSETS = [
  "/",
  "/blog/",
  "/projects/",
  "/projects/busca-binaria/",
  "/css/global.css",
  "/css/variables.css",
  "/css/landing.css",
  "/css/blog.css",
  "/css/blog-post.css",
  "/css/binary-search-game.css",
  "/js/theme-engine.js",
  "/js/navigation.js",
  "/js/binary-search-game.js",
  "/manifest.json",
  "/favicon.ico",
  "/favicon.svg",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/favicon-96x96.png",
  "/apple-touch-icon.png",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png"
];

self.addEventListener("install", (event) => {
  if (IS_LOCALHOST) {
    self.skipWaiting();
    return;
  }

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  if (IS_LOCALHOST) {
    event.waitUntil(
      caches.keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .then(() => self.registration.unregister())
        .then(() => self.clients.matchAll())
        .then((clients) => {
          clients.forEach((client) => {
            client.navigate(client.url);
          });
        })
    );
    return;
  }

  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (IS_LOCALHOST) {
    return;
  }

  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (requestUrl.pathname.startsWith("/admin/") || requestUrl.pathname.startsWith("/sanctum/")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }

          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }

          return undefined;
        });
    })
  );
});
