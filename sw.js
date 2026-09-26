const CACHE_NAME = "airsoftmaps-cache-v2.15.4";
const ASSETS = [
  "./",
  "./index.html",
  "./terms.html",
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
  // Asegura que el SW tome el control inmediatamente sin tener que recargar la pÃ¡gina
  self.clients.claim();
});

// Interceptar peticiones (Estrategia mixta: actualizaciones automÃ¡ticas invisibles)
self.addEventListener("fetch", event => {
  // Ignorar peticiones externas (APIs, Firebase, Leaflet, etc.)
  if (!event.request.url.startsWith(self.location.origin)) return;

  // 1. NETWORK FIRST para la pÃ¡gina (HTML). Asegura tener SIEMPRE la Ãºltima versiÃ³n si hay internet.
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          // Si estamos offline, devuelve la versiÃ³n en cachÃ©
          return caches.match(event.request).then(cached => cached || caches.match("./index.html"));
        })
    );
    return;
  }

  // 2. STALE-WHILE-REVALIDATE para recursos estÃ¡ticos (imÃ¡genes, iconos). Carga ultra-rÃ¡pida.
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return networkResponse;
        })
        .catch(() => { /* Ignorar errores en modo offline */ });

      // Devuelve la cachÃ© instantÃ¡neamente (si existe), mientras actualiza en segundo plano
      return cachedResponse || fetchPromise;
    })
  );
});

// Escuchar el mensaje del botÃ³n "Actualizar" de la app
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

