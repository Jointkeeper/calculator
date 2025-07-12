/**
 * Service Worker for Steamphony Calculator
 * Advanced caching strategies and performance optimization
 */

const CACHE_NAME = 'steamphony-calculator-v1';
const STATIC_ASSETS = [
    '/',
    '/public/index.html',
    '/src/main.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Caching static assets:', STATIC_ASSETS);
                return cache.addAll(STATIC_ASSETS).catch(error => {
                    console.error('❌ Cache addAll failed:', error);
                    // Continue installation even if caching fails
                    return Promise.resolve();
                });
            })
            .then(() => {
                console.log('✅ Service Worker installed');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Service Worker installation failed:', error);
                // Continue installation even if caching fails
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker activating...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Cache-first strategy for static assets
    if (isStaticAsset(request)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Network-first strategy for API responses
    if (isApiRequest(request)) {
        event.respondWith(networkFirst(request));
        return;
    }

    // No-cache strategy for user data
    if (isUserData(request)) {
        event.respondWith(noCache(request));
        return;
    }

    // Background sync for analytics
    if (isAnalyticsRequest(request)) {
        event.respondWith(backgroundSync(request));
        return;
    }

    // Default: network-first
    event.respondWith(networkFirst(request));
});

// Background sync event
self.addEventListener('sync', (event) => {
    if (event.tag === 'analytics-sync') {
        console.log('📊 Background sync for analytics');
        event.waitUntil(syncAnalytics());
    }
});

// Push event for notifications
self.addEventListener('push', (event) => {
    console.log('📱 Push notification received');
    const options = {
        body: event.data ? event.data.text() : 'New update available',
        icon: '/assets/icon-192x192.png',
        badge: '/assets/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Steamphony Calculator', options)
    );
});

// Helper functions
function isStaticAsset(request) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2'];
    const url = new URL(request.url);
    return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
           url.pathname === '/' ||
           url.pathname === '/public/index.html';
}

function isApiRequest(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith('/api/') ||
           url.pathname.includes('analytics') ||
           url.pathname.includes('tracking');
}

function isUserData(request) {
    const url = new URL(request.url);
    return url.pathname.includes('user') ||
           url.pathname.includes('profile') ||
           url.pathname.includes('settings');
}

function isAnalyticsRequest(request) {
    const url = new URL(request.url);
    return url.pathname.includes('analytics') ||
           url.pathname.includes('gtag') ||
           url.pathname.includes('google-analytics');
}

// Cache-first strategy
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Cache-first strategy failed:', error);
        return new Response('Offline content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network-first strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }

        return new Response('Network error and no cached content', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// No-cache strategy
async function noCache(request) {
    try {
        return await fetch(request);
    } catch (error) {
        console.error('No-cache strategy failed:', error);
        return new Response('User data not available offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Background sync strategy
async function backgroundSync(request) {
    try {
        // Try to send immediately
        const response = await fetch(request);
        return response;
    } catch (error) {
        console.log('Analytics request failed, queuing for background sync');
        
        // Queue for background sync
        const queue = await getAnalyticsQueue();
        queue.push({
            url: request.url,
            method: request.method,
            headers: Object.fromEntries(request.headers.entries()),
            timestamp: Date.now()
        });
        
        await setAnalyticsQueue(queue);
        
        // Request background sync
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            await self.registration.sync.register('analytics-sync');
        }
        
        return new Response('Queued for background sync', {
            status: 202,
            statusText: 'Accepted'
        });
    }
}

// Background sync analytics
async function syncAnalytics() {
    const queue = await getAnalyticsQueue();
    
    for (const item of queue) {
        try {
            await fetch(item.url, {
                method: item.method,
                headers: item.headers
            });
        } catch (error) {
            console.error('Background sync failed for:', item.url, error);
        }
    }
    
    // Clear queue after sync
    await setAnalyticsQueue([]);
}

// Analytics queue management
async function getAnalyticsQueue() {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match('/analytics-queue');
    return response ? await response.json() : [];
}

async function setAnalyticsQueue(queue) {
    const cache = await caches.open(CACHE_NAME);
    const response = new Response(JSON.stringify(queue));
    await cache.put('/analytics-queue', response);
} 