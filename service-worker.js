const CACHE_NAME =
  "salto-pocket-v2";

const urlsToCache = [

  "./",

  "./index.html",

  "./style.css",

  "./script.js",

  "./manifest.json",

  "./data/exhibitors.json",

  "./map.html",

  "./js/map-engine.js",

  "./maps/2026/pad1/areas.json",

  "./maps/2026/pad1/map.png",

  "./maps/2026/pad1/raw-map.json",

  "./images/icon-192.png",

  "./images/icon-512.png",

  "./images/SDL26_mappa_V_1.png",

  "./images/SDL26_mappa_V_2.png",

  "./images/SDL26_mappa_V_3.png",

  "./images/SDL26_mappa_V_4.png",

  "./images/SDL26_mappa_V_5.png"

];

self.addEventListener(
  "install",
  event => {

    self.skipWaiting();

    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache =>
          cache.addAll(urlsToCache)
        )
    );

  }
);

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(
      caches.keys()
        .then(names =>
          Promise.all(
            names
              .filter(name =>
                name !== CACHE_NAME
              )
              .map(name =>
                caches.delete(name)
              )
          )
        )
        .then(() =>
          self.clients.claim()
        )
    );

  }
);

self.addEventListener(
  "fetch",
  event => {

    if (
      event.request.method !== "GET"
    ) {
      return;
    }

    event.respondWith(
      fetch(event.request)
        .then(response => {

          const copy =
            response.clone();

          caches.open(CACHE_NAME)
            .then(cache =>
              cache.put(
                event.request,
                copy
              )
            );

          return response;

        })
        .catch(() =>
          caches.match(
            event.request
          )
        )
    );

  }
);
