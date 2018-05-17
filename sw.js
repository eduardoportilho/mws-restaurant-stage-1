var CACHE_NAME = 'mws-restaurant';
var filesToCache = [
    "/index.html",
    "/restaurant.html",
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg'
];

// Install service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(filesToCache);
        }).catch(error => {
            console.log("Cache add failed", error);
        })
    );
});

// Check for cached resources
self.addEventListener('fetch', event => {
    const url = event.request.url;
    event.respondWith(
        caches.match(event.request).then(response => {
            // Resource found in cache, return it
            if (response) {
                console.log('Cache hit:', url);
                return response;
            }
            // Resource not found, request it
            console.log('Cache miss:', url);
            return fetch(event.request).then(response => {
                let clonedResponse = response.clone();
                // Cache the requested resource
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, clonedResponse);
                }).catch(error => {
                    console.log(`Cache insert failed for ${url}`, error);
                });
                return response;
            }).catch(error => {
                console.log(`Request failed for ${url}`, error);
            });
        }).catch(error => {
            console.log(`Cache match failed for ${url}`, error);
        })
    );
});