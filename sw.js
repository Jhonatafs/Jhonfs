const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1"];
const IS_LOCALHOST = LOCAL_HOSTS.includes(self.location.hostname);
const BUILD_VERSION = "06884758f9f89b2c0355c1937c59e8a82e83b4b8";
const CACHE_NAME = `jhonfs-ecosystem-${BUILD_VERSION}`;
const GAME_ROUTE = "/projects/busca-binaria/";
const GAME_ROUTE_NO_SLASH = "/projects/busca-binaria";
const GAME_MANIFEST = "/projects/busca-binaria/manifest.json";

const VERSIONED_ASSET_PATHS = new Set([
  "/css/global.css",
  "/css/variables.css",
  "/css/landing.css",
  "/css/blog.css",
  "/css/blog-post.css",
  "/css/projects.css",
  "/css/binary-search-game.css",
  "/js/blog-filters.js",
  "/js/blog-code-blocks.js",
  "/js/theme-engine.js",
  "/js/navigation.js",
  "/js/pwa-register.js",
  "/js/name-animation-control.js",
  "/js/binary-search-game.js"
]);

function versionedAsset(asset) {
  return VERSIONED_ASSET_PATHS.has(asset) ? `${asset}?v=${BUILD_VERSION}` : asset;
}

const CORE_ASSETS = [
  "/",
  "/blog/",
  "/projects/",
  GAME_ROUTE,
  "/css/global.css",
  "/css/variables.css",
  "/css/landing.css",
  "/css/blog.css",
  "/css/blog-post.css",
  "/css/projects.css",
  "/js/blog-filters.js",
  "/js/blog-code-blocks.js",
  "/js/theme-engine.js",
  "/js/navigation.js",
  "/js/pwa-register.js",
  "/js/name-animation-control.js",
  "/manifest.json",
  "/favicon.ico",
  "/favicon.svg",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/favicon-96x96.png",
  "/apple-touch-icon.png",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png"
].map(versionedAsset);

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
].map(versionedAsset);

const PRECACHE_ASSETS = Array.from(new Set([...CORE_ASSETS, ...GAME_ASSETS]));
const GAME_STATIC_PATHS = new Set([
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
]);

function cacheResponse(request, response) {
  if (!response || !response.ok) {
    return response;
  }

  const responseClone = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
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

function networkFirst(request, fallbackUrl = "/") {
  return fetch(request, { cache: "no-cache" })
    .then((networkResponse) => cacheResponse(request, networkResponse))
    .catch(() => caches.match(request)
      .then((cachedResponse) => cachedResponse || caches.match(fallbackUrl)));
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
        .then((clients) => clients.forEach((client) => client.navigate(client.url)))
    );
    return;
  }

  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((clients) => clients.forEach((client) => client.navigate(client.url)))
  );
});

self.addEventListener("fetch", (event) => {
  if (IS_LOCALHOST || event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (requestUrl.pathname.startsWith("/admin/") || requestUrl.pathname.startsWith("/sanctum/")) {
    return;
  }

  if (event.request.mode === "navigate") {
    const fallbackUrl = requestUrl.pathname === GAME_ROUTE_NO_SLASH ? GAME_ROUTE : "/";
    event.respondWith(networkFirst(event.request, fallbackUrl));
    return;
  }

  if (GAME_STATIC_PATHS.has(requestUrl.pathname)) {
    event.respondWith(cacheFirst(event.request));
  }
});
