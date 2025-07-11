/**
 * Advanced Cache Manager
 * Service Worker implementation with intelligent caching strategies
 * Implements cache-first, network-first, and background sync for optimal performance
 */

class CacheManager {
    constructor() {
        this.cacheName = 'steamphony-calculator-v1';
        this.cacheStrategies = {
            STATIC_ASSETS: 'cache-first',
            API_RESPONSES: 'network-first',
            USER_DATA: 'no-cache',
            ANALYTICS: 'background-sync'
        };
        
        this.cacheConfig = {
            staticAssets: {
                maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
                maxEntries: 100
            },
            apiResponses: {
                maxAge: 5 * 60 * 1000, // 5 minutes
                maxEntries: 50
            },
            analytics: {
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                maxEntries: 1000
            }
        };

        this.serviceWorker = null;
        this.isRegistered = false;
        this.backgroundSyncQueue = [];
    }

    /**
     * Register Service Worker
     * @param {string} swPath - Service Worker path
     * @returns {Promise} Registration promise
     */
    async registerServiceWorker(swPath = '/sw.js') {
        try {
            if ('serviceWorker' in navigator) {
                this.serviceWorker = await navigator.serviceWorker.register(swPath);
                this.isRegistered = true;
                
                console.log('✅ Service Worker registered:', this.serviceWorker);
                
                // Listen for updates
                this.serviceWorker.addEventListener('updatefound', () => {
                    console.log('🔄 Service Worker update found');
                });
                
                return this.serviceWorker;
            } else {
                throw new Error('Service Worker not supported');
            }
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
            throw error;
        }
    }

    /**
     * Create Service Worker script
     * @returns {string} Service Worker script content
     */
    createServiceWorkerScript() {
        return `
            const CACHE_NAME = '${this.cacheName}';
            const STATIC_ASSETS = [
                '/',
                '/index.html',
                '/styles.css',
                '/src/main.js',
                '/src/components/Calculator.js',
                '/src/security/CSPConfig.js',
                '/src/security/SecurityHeaders.js',
                '/src/security/ThreatDetector.js',
                '/src/security/SecurityMonitor.js'
            ];

            // Install event - cache static assets
            self.addEventListener('install', (event) => {
                console.log('🔧 Service Worker installing...');
                event.waitUntil(
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            console.log('📦 Caching static assets');
                            return cache.addAll(STATIC_ASSETS);
                        })
                        .then(() => {
                            console.log('✅ Service Worker installed');
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
                if (this.isStaticAsset(request)) {
                    event.respondWith(this.cacheFirst(request));
                    return;
                }

                // Network-first strategy for API responses
                if (this.isApiRequest(request)) {
                    event.respondWith(this.networkFirst(request));
                    return;
                }

                // No-cache strategy for user data
                if (this.isUserData(request)) {
                    event.respondWith(this.noCache(request));
                    return;
                }

                // Background sync for analytics
                if (this.isAnalyticsRequest(request)) {
                    event.respondWith(this.backgroundSync(request));
                    return;
                }

                // Default: network-first
                event.respondWith(this.networkFirst(request));
            });

            // Background sync event
            self.addEventListener('sync', (event) => {
                if (event.tag === 'analytics-sync') {
                    console.log('📊 Background sync for analytics');
                    event.waitUntil(this.syncAnalytics());
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

            // Helper methods
            function isStaticAsset(request) {
                const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2'];
                const url = new URL(request.url);
                return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
                       url.pathname === '/' ||
                       url.pathname === '/index.html';
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
                    const queue = await this.getAnalyticsQueue();
                    queue.push({
                        url: request.url,
                        method: request.method,
                        headers: Object.fromEntries(request.headers.entries()),
                        timestamp: Date.now()
                    });
                    
                    await this.setAnalyticsQueue(queue);
                    
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
                const queue = await this.getAnalyticsQueue();
                
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
                await this.setAnalyticsQueue([]);
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
        `;
    }

    /**
     * Cache a resource with specified strategy
     * @param {Request} request - Request object
     * @param {string} strategy - Caching strategy
     * @returns {Promise} Cached response
     */
    async cacheResource(request, strategy = 'cache-first') {
        const cache = await caches.open(this.cacheName);
        
        switch (strategy) {
            case 'cache-first':
                return this.cacheFirst(request, cache);
            case 'network-first':
                return this.networkFirst(request, cache);
            case 'no-cache':
                return this.noCache(request);
            case 'background-sync':
                return this.backgroundSync(request);
            default:
                return this.networkFirst(request, cache);
        }
    }

    /**
     * Cache-first strategy implementation
     * @param {Request} request - Request object
     * @param {Cache} cache - Cache object
     * @returns {Promise} Response
     */
    async cacheFirst(request, cache) {
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

    /**
     * Network-first strategy implementation
     * @param {Request} request - Request object
     * @param {Cache} cache - Cache object
     * @returns {Promise} Response
     */
    async networkFirst(request, cache) {
        try {
            const networkResponse = await fetch(request);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        } catch (error) {
            console.log('Network failed, trying cache:', error);
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

    /**
     * No-cache strategy implementation
     * @param {Request} request - Request object
     * @returns {Promise} Response
     */
    async noCache(request) {
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

    /**
     * Background sync strategy implementation
     * @param {Request} request - Request object
     * @returns {Promise} Response
     */
    async backgroundSync(request) {
        try {
            const response = await fetch(request);
            return response;
        } catch (error) {
            console.log('Analytics request failed, queuing for background sync');
            
            // Queue for background sync
            this.backgroundSyncQueue.push({
                url: request.url,
                method: request.method,
                headers: Object.fromEntries(request.headers.entries()),
                timestamp: Date.now()
            });
            
            // Request background sync
            if (this.serviceWorker && 'sync' in window.ServiceWorkerRegistration.prototype) {
                await this.serviceWorker.sync.register('analytics-sync');
            }
            
            return new Response('Queued for background sync', {
                status: 202,
                statusText: 'Accepted'
            });
        }
    }

    /**
     * Clear cache
     * @param {string} cacheName - Cache name (optional)
     * @returns {Promise} Clear promise
     */
    async clearCache(cacheName = null) {
        try {
            const cacheNames = await caches.keys();
            const cachesToDelete = cacheName ? 
                cacheNames.filter(name => name === cacheName) : 
                cacheNames;
            
            await Promise.all(
                cachesToDelete.map(name => caches.delete(name))
            );
            
            console.log('🗑️ Cache cleared:', cacheName || 'all');
        } catch (error) {
            console.error('❌ Cache clear failed:', error);
            throw error;
        }
    }

    /**
     * Get cache statistics
     * @returns {Promise} Cache statistics
     */
    async getCacheStatistics() {
        try {
            const cacheNames = await caches.keys();
            const stats = {};
            
            for (const cacheName of cacheNames) {
                const cache = await caches.open(cacheName);
                const keys = await cache.keys();
                stats[cacheName] = {
                    entries: keys.length,
                    size: await this.calculateCacheSize(cache)
                };
            }
            
            return {
                totalCaches: cacheNames.length,
                caches: stats,
                backgroundSyncQueue: this.backgroundSyncQueue.length
            };
        } catch (error) {
            console.error('❌ Cache statistics failed:', error);
            return { error: 'Statistics unavailable' };
        }
    }

    /**
     * Calculate cache size
     * @param {Cache} cache - Cache object
     * @returns {Promise} Cache size in bytes
     */
    async calculateCacheSize(cache) {
        try {
            const keys = await cache.keys();
            let totalSize = 0;
            
            for (const key of keys) {
                const response = await cache.match(key);
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                }
            }
            
            return totalSize;
        } catch (error) {
            console.error('❌ Cache size calculation failed:', error);
            return 0;
        }
    }

    /**
     * Initialize cache manager
     * @param {Object} config - Configuration object
     * @returns {Promise} Initialization promise
     */
    async initialize(config = {}) {
        try {
            // Merge configuration
            this.cacheConfig = { ...this.cacheConfig, ...config.cacheConfig };
            
            // Register Service Worker
            if (config.registerServiceWorker !== false) {
                await this.registerServiceWorker(config.serviceWorkerPath);
            }
            
            console.log('🚀 CacheManager initialized with configuration:', config);
        } catch (error) {
            console.error('❌ CacheManager initialization failed:', error);
            throw error;
        }
    }
}

// Export for ES modules
export default CacheManager; 