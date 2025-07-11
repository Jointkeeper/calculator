/**
 * Advanced Lazy Loader Utility
 * Dynamic component loading and performance optimization
 * Implements intelligent loading strategies and error handling
 */

class LazyLoader {
    constructor() {
        this.loadedModules = new Map();
        this.loadingModules = new Map();
        this.failedModules = new Map();
        this.loadingCallbacks = new Map();
        this.retryAttempts = new Map();
        this.maxRetries = 3;
        this.loadingTimeout = 10000; // 10 seconds
    }

    /**
     * Lazy load a module with intelligent caching
     * @param {string} modulePath - Path to the module
     * @param {Object} options - Loading options
     * @returns {Promise} Module promise
     */
    async loadModule(modulePath, options = {}) {
        const {
            retryCount = 0,
            timeout = this.loadingTimeout,
            priority = 'normal',
            preload = false
        } = options;

        // Check if already loaded
        if (this.loadedModules.has(modulePath)) {
            return this.loadedModules.get(modulePath);
        }

        // Check if currently loading
        if (this.loadingModules.has(modulePath)) {
            return this.waitForModule(modulePath);
        }

        // Check if failed and retry limit reached
        if (this.failedModules.has(modulePath) && 
            this.retryAttempts.get(modulePath) >= this.maxRetries) {
            throw new Error(`Module ${modulePath} failed to load after ${this.maxRetries} attempts`);
        }

        try {
            // Mark as loading
            this.loadingModules.set(modulePath, true);
            this.retryAttempts.set(modulePath, retryCount);

            // Create loading promise with timeout
            const loadingPromise = this.createLoadingPromise(modulePath, timeout);
            
            // Store callback for other waiting requests
            this.loadingCallbacks.set(modulePath, loadingPromise);

            // Load the module
            const module = await loadingPromise;

            // Cache the loaded module
            this.loadedModules.set(modulePath, module);
            this.loadingModules.delete(modulePath);
            this.loadingCallbacks.delete(modulePath);

            // Log successful load
            this.logModuleLoad(modulePath, 'success');

            return module;

        } catch (error) {
            // Handle loading failure
            this.handleLoadError(modulePath, error, retryCount);
            throw error;
        }
    }

    /**
     * Create loading promise with timeout
     * @param {string} modulePath - Module path
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise} Loading promise
     */
    createLoadingPromise(modulePath, timeout) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error(`Module ${modulePath} loading timeout`));
            }, timeout);

            // Dynamic import with error handling
            import(modulePath)
                .then(module => {
                    clearTimeout(timeoutId);
                    resolve(module.default || module);
                })
                .catch(error => {
                    clearTimeout(timeoutId);
                    reject(error);
                });
        });
    }

    /**
     * Wait for module that's currently loading
     * @param {string} modulePath - Module path
     * @returns {Promise} Module promise
     */
    waitForModule(modulePath) {
        return new Promise((resolve, reject) => {
            const checkInterval = setInterval(() => {
                // Check if module is now loaded
                if (this.loadedModules.has(modulePath)) {
                    clearInterval(checkInterval);
                    resolve(this.loadedModules.get(modulePath));
                    return;
                }

                // Check if module failed to load
                if (this.failedModules.has(modulePath)) {
                    clearInterval(checkInterval);
                    reject(new Error(`Module ${modulePath} failed to load`));
                    return;
                }

                // Check if still loading
                if (!this.loadingModules.has(modulePath)) {
                    clearInterval(checkInterval);
                    reject(new Error(`Module ${modulePath} loading state lost`));
                }
            }, 100);

            // Timeout for waiting
            setTimeout(() => {
                clearInterval(checkInterval);
                reject(new Error(`Timeout waiting for module ${modulePath}`));
            }, this.loadingTimeout);
        });
    }

    /**
     * Handle loading error with retry logic
     * @param {string} modulePath - Module path
     * @param {Error} error - Loading error
     * @param {number} retryCount - Current retry count
     */
    handleLoadError(modulePath, error, retryCount) {
        this.loadingModules.delete(modulePath);
        this.loadingCallbacks.delete(modulePath);

        const currentRetries = this.retryAttempts.get(modulePath) || 0;
        
        if (currentRetries < this.maxRetries) {
            // Retry loading
            this.retryAttempts.set(modulePath, currentRetries + 1);
            
            console.warn(`🔄 Retrying module load: ${modulePath} (attempt ${currentRetries + 1}/${this.maxRetries})`);
            
            // Exponential backoff
            const delay = Math.pow(2, currentRetries) * 1000;
            
            setTimeout(() => {
                this.loadModule(modulePath, { retryCount: currentRetries + 1 });
            }, delay);
        } else {
            // Mark as failed
            this.failedModules.set(modulePath, error);
            this.logModuleLoad(modulePath, 'failed', error);
        }
    }

    /**
     * Preload module for future use
     * @param {string} modulePath - Module path
     * @param {Object} options - Preload options
     */
    preloadModule(modulePath, options = {}) {
        const { priority = 'low' } = options;
        
        // Use requestIdleCallback for low priority preloading
        if (priority === 'low' && window.requestIdleCallback) {
            window.requestIdleCallback(() => {
                this.loadModule(modulePath, { preload: true });
            });
        } else {
            // Immediate preload for high priority
            this.loadModule(modulePath, { preload: true });
        }
    }

    /**
     * Load component with fallback
     * @param {string} componentPath - Component path
     * @param {Object} fallbackComponent - Fallback component
     * @returns {Promise} Component promise
     */
    async loadComponent(componentPath, fallbackComponent = null) {
        try {
            const component = await this.loadModule(componentPath);
            return component;
        } catch (error) {
            console.error(`❌ Component load failed: ${componentPath}`, error);
            
            if (fallbackComponent) {
                console.log(`🔄 Using fallback component for: ${componentPath}`);
                return fallbackComponent;
            }
            
            throw error;
        }
    }

    /**
     * Load multiple modules in parallel
     * @param {Array} modulePaths - Array of module paths
     * @param {Object} options - Loading options
     * @returns {Promise} Array of loaded modules
     */
    async loadModules(modulePaths, options = {}) {
        const { concurrency = 3 } = options;
        
        const results = [];
        const chunks = this.chunkArray(modulePaths, concurrency);
        
        for (const chunk of chunks) {
            const chunkPromises = chunk.map(path => 
                this.loadModule(path, options).catch(error => ({
                    path,
                    error,
                    failed: true
                }))
            );
            
            const chunkResults = await Promise.allSettled(chunkPromises);
            results.push(...chunkResults.map(result => 
                result.status === 'fulfilled' ? result.value : result.reason
            ));
        }
        
        return results;
    }

    /**
     * Split array into chunks
     * @param {Array} array - Array to chunk
     * @param {number} size - Chunk size
     * @returns {Array} Chunked array
     */
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    /**
     * Clear module cache
     * @param {string} modulePath - Module path (optional)
     */
    clearCache(modulePath = null) {
        if (modulePath) {
            this.loadedModules.delete(modulePath);
            this.failedModules.delete(modulePath);
            this.retryAttempts.delete(modulePath);
        } else {
            this.loadedModules.clear();
            this.failedModules.clear();
            this.retryAttempts.clear();
        }
    }

    /**
     * Get loading statistics
     * @returns {Object} Loading statistics
     */
    getStatistics() {
        return {
            loaded: this.loadedModules.size,
            loading: this.loadingModules.size,
            failed: this.failedModules.size,
            retryAttempts: Object.fromEntries(this.retryAttempts),
            cacheHitRate: this.calculateCacheHitRate()
        };
    }

    /**
     * Calculate cache hit rate
     * @returns {number} Cache hit rate percentage
     */
    calculateCacheHitRate() {
        const totalRequests = this.loadedModules.size + this.failedModules.size;
        return totalRequests > 0 ? (this.loadedModules.size / totalRequests) * 100 : 0;
    }

    /**
     * Log module load event
     * @param {string} modulePath - Module path
     * @param {string} status - Load status
     * @param {Error} error - Error object (optional)
     */
    logModuleLoad(modulePath, status, error = null) {
        const event = {
            modulePath,
            status,
            timestamp: new Date().toISOString(),
            error: error ? error.message : null
        };

        // Store in localStorage for monitoring
        try {
            const logs = JSON.parse(localStorage.getItem('lazy_loader_logs') || '[]');
            logs.push(event);
            
            // Keep only recent logs (last 100)
            if (logs.length > 100) {
                logs.splice(0, logs.length - 100);
            }
            
            localStorage.setItem('lazy_loader_logs', JSON.stringify(logs));
        } catch (e) {
            console.error('Failed to log module load event:', e);
        }

        // Console logging
        if (status === 'success') {
            console.log(`✅ Module loaded: ${modulePath}`);
        } else if (status === 'failed') {
            console.error(`❌ Module failed: ${modulePath}`, error);
        }
    }

    /**
     * Initialize lazy loader with configuration
     * @param {Object} config - Configuration object
     */
    initialize(config = {}) {
        this.maxRetries = config.maxRetries || this.maxRetries;
        this.loadingTimeout = config.loadingTimeout || this.loadingTimeout;
        
        // Preload critical modules if specified
        if (config.preloadModules) {
            config.preloadModules.forEach(modulePath => {
                this.preloadModule(modulePath, { priority: 'high' });
            });
        }

        console.log('🚀 LazyLoader initialized with configuration:', config);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyLoader;
} else {
    window.LazyLoader = LazyLoader;
} 