// Service worker – offline shell for MacroSnap
const CACHE_NAME = 'macrosnap-v2.0.0';
const RUNTIME_CACHE = 'macrosnap-runtime';

// Core files to cache during install
const PRECACHE = [
    '/',
    '/login.html',
    '/register.html',
    '/manifest.json'
];

// Install – cache the app shell
self.addEventListener('install', function(e) {
    console.log('[SW] Installing service worker...');
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[SW] Precaching core files');
                return cache.addAll(PRECACHE);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );
});

// Activate – drop old caches
self.addEventListener('activate', function(e) {
    console.log('[SW] Activating service worker...');
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(k => k !== CACHE_NAME && k !== RUNTIME_CACHE)
                    .map(k => {
                        console.log('[SW] Deleting old cache:', k);
                        return caches.delete(k);
                    })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

// Fetch – network-first for API calls, cache-first for everything else
self.addEventListener('fetch', function(e) {
    const url = new URL(e.request.url);
    
    // Always go to network for USDA API requests
    if (url.hostname.includes('api.nal.usda.gov')) {
        e.respondWith(fetch(e.request));
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!e.request.url.startsWith('http')) {
        return;
    }
    
    // Network-first strategy for HTML pages
    if (e.request.mode === 'navigate') {
        e.respondWith(
            fetch(e.request)
                .then(function(response) {
                    // Cache the new version
                    const responseClone = response.clone();
                    caches.open(RUNTIME_CACHE).then(function(cache) {
                        cache.put(e.request, responseClone);
                    });
                    return response;
                })
                .catch(function() {
                    // Fallback to cache if offline
                    return caches.match(e.request);
                })
        );
        return;
    }
    
    // Cache-first for assets (JS, CSS, images, fonts)
    e.respondWith(
        caches.match(e.request).then(function(cached) {
            if (cached) {
                return cached;
            }
            
            return fetch(e.request).then(function(response) {
                // Don't cache if not a success response
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }
                
                // Cache the fetched resource
                const responseClone = response.clone();
                caches.open(RUNTIME_CACHE).then(function(cache) {
                    cache.put(e.request, responseClone);
                });
                
                return response;
            });
        })
    );
});
