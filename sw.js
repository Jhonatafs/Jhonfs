const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1"];
const IS_LOCALHOST = LOCAL_HOSTS.includes(self.location.hostname);
const CACHE_NAME = "jhonfs-ecosystem-v12";
const GAME_ROUTE = "/projects/busca-binaria/";
const GAME_ROUTE_NO_SLASH = "/projects/busca-binaria";
const GAME_MANIFEST = "/projects/busca-binaria/manifest.json";

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
  "/js/blog-filters.js",
  "/js/theme-engine.js",
  "/js/navigation.js",
  "/js/pwa-register.js",
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

const GAME_ASSETS = [
  GAME_ROUTE,
  GAME_MANIFEST,
  "/css/global.css",
  "/css/variables.css",
  "/css/binary-search-game.css",
  "/js/theme-engine.js",
  "/js/navigation.js",
  "/js/pwa-register.js",
  "/js/binary-search-game.js",
  "/fonts/FiraCode-VF.ttf",
  "/fonts/SymbolsNerdFontMono-Regular.ttf",
  "/audio/victory-perfect.mp3",
  "/audio/victory-late.mp3",
  "/favicon.ico",
  "/favicon.svg",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/favicon-96x96.png",
  "/apple-touch-icon.png",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png"
];

const PRECACHE_ASSETS = Array.from(new Set([...CORE_ASSETS, ...GAME_ASSETS]));
const GAME_STATIC_ASSETS = new Set(GAME_ASSETS.filter((asset) => asset !== GAME_ROUTE));

function isGameRoute(pathname) {
  return pathname === GAME_ROUTE || pathname === GAME_ROUTE_NO_SLASH;
}

function cacheResponse(request, response) {
  if (!response || !response.ok) {
    return response;
  }

  const responseClone = response.clone();
  caches.open(CACHE_NAME).then((cache) => {
    cache.put(request, responseClone);
  });

  return response;
}

function cacheFirst(request) {
  return caches.match(request).then((cachedResponse) => {
    if (cachedResponse) {
      return cachedResponse;
    }

    return fetch(request).then((networkResponse) => cacheResponse(request, networkResponse));
  });
}

function gamePageNetworkFirst(request) {
  return fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.ok) {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(GAME_ROUTE, responseClone);
        });
      }

      return networkResponse;
    })
    .catch(() => (
      caches.match(request)
        .then((cachedResponse) => cachedResponse || caches.match(GAME_ROUTE))
        .then((cachedResponse) => cachedResponse || caches.match("/"))
    ));
}

function networkFirst(request) {
  return fetch(request)
    .then((networkResponse) => cacheResponse(request, networkResponse))
    .catch(() => caches.match(request));
}

self.addEventListener("install", (event) => {
  if (IS_LOCALHOST) {
    self.skipWaiting();
    return;
  }

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
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

  if (event.request.mode === "navigate" && isGameRoute(requestUrl.pathname)) {
    event.respondWith(gamePageNetworkFirst(event.request));
    return;
  }

  if (
    requestUrl.pathname === "/blog/" ||
    requestUrl.pathname === "/blog" ||
    requestUrl.pathname === "/js/blog-filters.js" ||
    requestUrl.pathname === "/css/blog.css"
  ) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (GAME_STATIC_ASSETS.has(requestUrl.pathname)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => cacheResponse(event.request, networkResponse))
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }

          return undefined;
        });
    })
  );
});
