/* ============================================================
   Service Worker · Cuaderno de Panadería Años 40
   Estrategia:
   - HTML, CSS, JS: cache-first con actualización en background
   - JSON de datos: network-first (para que se actualicen al recargar)
   ============================================================ */

const CACHE_NAME = 'cuaderno-pan-v1.0.0';
const CACHE_URLS = [
  './',
  './index.html',
  './manifest.json'
];

// Instalación: cachear archivos base
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando…');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activación: limpiar caches viejos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando…');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: estrategias diferenciadas
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // JSON de datos: network-first (para que se actualicen)
  if (url.pathname.includes('/data/') && url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(event.request)
        .then((resp) => {
          // Guardar copia en cache
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Resto: cache-first con actualización en background
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((resp) => {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
        }
        return resp;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
