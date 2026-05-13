const CACHE_NAME =
  "salto-pocket-v1";

const urlsToCache = [

  "/",

  "/index.html",

  "/style.css",

  "/script.js",

  "/manifest.json",

  "/data/exhibitors.json",

  "/images/icon-192.png",

  "/images/icon-512.png",

  "/images/SDL26_mappa_V_1.png",

  "/images/SDL26_mappa_V_2.png",

  "/images/SDL26_mappa_V_3.png",

  "/images/SDL26_mappa_V_4.png",

  "/images/SDL26_mappa_V_5.png"

];

/* =========================
   INSTALL
========================= */

self.addEventListener(
  "install",
  (event) => {

    event.waitUntil(

      caches.open(CACHE_NAME)
        .then(cache => {

          return cache.addAll(
            urlsToCache
          );

        })

    );

  }
);

/* =========================
   FETCH
========================= */

self.addEventListener(
  "fetch",
  (event) => {

    event.respondWith(

      caches.match(event.request)
        .then(response => {

          return (
            response
            ||
            fetch(event.request)
          );

        })

    );

  }
);
