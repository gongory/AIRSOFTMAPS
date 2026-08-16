const CACHE_NAME = "airsoftmaps-cache-v2.03";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./home-mobile.png",
  "./home-wide.png",
  "./AirsoftMaps.ico"
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
  // Asegura que el SW tome el control inmediatamente sin tener que recargar la página
  self.clients.claim();
});

// Interceptar peticiones (Estrategia mixta: actualizaciones automáticas invisibles)
self.addEventListener("fetch", event => {
  // Ignorar peticiones externas (APIs, Firebase, Leaflet, etc.)
  if (!event.request.url.startsWith(self.location.origin)) return;

  // 1. NETWORK FIRST para la página (HTML). Asegura tener SIEMPRE la última versión si hay internet.
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          // Si estamos offline, devuelve la versión en caché
          return caches.match(event.request).then(cached => cached || caches.match("./index.html"));
        })
    );
    return;
  }

  // 2. STALE-WHILE-REVALIDATE para recursos estáticos (imágenes, iconos). Carga ultra-rápida.
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return networkResponse;
        })
        .catch(() => { /* Ignorar errores en modo offline */ });
      
      // Devuelve la caché instantáneamente (si existe), mientras actualiza en segundo plano
      return cachedResponse || fetchPromise;
    })
  );
});

// Escuchar el mensaje del botón "Actualizar" de la app
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
