const CACHE_NAME = "airsoftmaps-cache-v1.32";
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/home-mobile.png",
  "/home-wide.png"
];

// Instalar y cachear
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activar y limpiar caches viejos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== "airsoftmaps-offline")
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request).catch(() => caches.match("/index.html"))
      );
    })
  );
});

// Escuchar el mensaje del botón "Actualizar" de la app
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
