/**
 * Advanced Performance Monitor
 * Core Web Vitals tracking and performance optimization monitoring
 * Implements comprehensive performance metrics and optimization recommendations
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            LCP: null, // Largest Contentful Paint
            FID: null, // First Input Delay
            CLS: null, // Cumulative Layout Shift
            FCP: null, // First Contentful Paint
            TTFB: null, // Time to First Byte
            TTI: null, // Time to Interactive
            bundleSize: null,
            loadTime: null,
            domContentLoaded: null,
            windowLoad: null
        };
        
        this.thresholds = {
            LCP: { good: 2500, needsImprovement: 4000 },
            FID: { good: 100, needsImprovement: 300 },
            CLS: { good: 0.1, needsImprovement: 0.25 },
            FCP: { good: 1800, needsImprovement: 3000 },
            TTFB: { good: 800, needsImprovement: 1800 },
            TTI: { good: 3800, needsImprovement: 7300 }
        };
        
        this.observers = new Map();
        this.performanceData = [];
        this.isMonitoring = false;
        this.reportingEndpoint = null;
    }

    /**
     * Initialize performance monitoring
     * @param {Object} config - Configuration object
     */
    initialize(config = {}) {
        this.reportingEndpoint = config.reportingEndpoint;
        this.thresholds = { ...this.thresholds, ...config.thresholds };
        
        // Wait for page load to start monitoring
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startMonitoring());
        } else {
            this.startMonitoring();
        }
        
        console.log('🚀 PerformanceMonitor initialized');
    }

    /**
     * Start performance monitoring
     */
    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        
        // Monitor Core Web Vitals
        this.observeLCP();
        this.observeFID();
        this.observeCLS();
        this.observeFCP();
        
        // Monitor additional metrics
        this.measureTTFB();
        this.measureTTI();
        this.measureBundleSize();
        this.measureLoadTimes();
        
        // Monitor resource loading
        this.observeResourceTiming();
        
        // Monitor long tasks
        this.observeLongTasks();
        
        console.log('📊 Performance monitoring started');
    }

    /**
     * Observe Largest Contentful Paint (LCP)
     */
    observeLCP() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    
                    this.metrics.LCP = lastEntry.startTime;
                    this.logMetric('LCP', this.metrics.LCP);
                    this.evaluateMetric('LCP', this.metrics.LCP);
                });
                
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
                this.observers.set('LCP', observer);
            } catch (error) {
                console.warn('LCP observation not supported:', error);
            }
        }
    }

    /**
     * Observe First Input Delay (FID)
     */
    observeFID() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        this.metrics.FID = entry.processingStart - entry.startTime;
                        this.logMetric('FID', this.metrics.FID);
                        this.evaluateMetric('FID', this.metrics.FID);
                    });
                });
                
                observer.observe({ entryTypes: ['first-input'] });
                this.observers.set('FID', observer);
            } catch (error) {
                console.warn('FID observation not supported:', error);
            }
        }
    }

    /**
     * Observe Cumulative Layout Shift (CLS)
     */
    observeCLS() {
        if ('PerformanceObserver' in window) {
            try {
                let clsValue = 0;
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    
                    this.metrics.CLS = clsValue;
                    this.logMetric('CLS', this.metrics.CLS);
                    this.evaluateMetric('CLS', this.metrics.CLS);
                });
                
                observer.observe({ entryTypes: ['layout-shift'] });
                this.observers.set('CLS', observer);
            } catch (error) {
                console.warn('CLS observation not supported:', error);
            }
        }
    }

    /**
     * Observe First Contentful Paint (FCP)
     */
    observeFCP() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const firstEntry = entries[0];
                    
                    this.metrics.FCP = firstEntry.startTime;
                    this.logMetric('FCP', this.metrics.FCP);
                    this.evaluateMetric('FCP', this.metrics.FCP);
                });
                
                observer.observe({ entryTypes: ['first-contentful-paint'] });
                this.observers.set('FCP', observer);
            } catch (error) {
                console.warn('FCP observation not supported:', error);
            }
        }
    }

    /**
     * Measure Time to First Byte (TTFB)
     */
    measureTTFB() {
        if ('performance' in window) {
            const navigationEntry = performance.getEntriesByType('navigation')[0];
            if (navigationEntry) {
                this.metrics.TTFB = navigationEntry.responseStart - navigationEntry.requestStart;
                this.logMetric('TTFB', this.metrics.TTFB);
                this.evaluateMetric('TTFB', this.metrics.TTFB);
            }
        }
    }

    /**
     * Measure Time to Interactive (TTI)
     */
    measureTTI() {
        if ('performance' in window) {
            // TTI is complex to measure, using a simplified approach
            const navigationEntry = performance.getEntriesByType('navigation')[0];
            if (navigationEntry) {
                this.metrics.TTI = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
                this.logMetric('TTI', this.metrics.TTI);
                this.evaluateMetric('TTI', this.metrics.TTI);
            }
        }
    }

    /**
     * Measure bundle size
     */
    measureBundleSize() {
        if ('performance' in window) {
            const resources = performance.getEntriesByType('resource');
            const jsResources = resources.filter(resource => 
                resource.name.endsWith('.js') || resource.initiatorType === 'script'
            );
            
            const totalSize = jsResources.reduce((total, resource) => {
                return total + (resource.transferSize || 0);
            }, 0);
            
            this.metrics.bundleSize = totalSize;
            this.logMetric('BundleSize', totalSize);
            
            // Convert to KB for readability
            const bundleSizeKB = (totalSize / 1024).toFixed(2);
            console.log(`📦 Total bundle size: ${bundleSizeKB} KB`);
        }
    }

    /**
     * Measure load times
     */
    measureLoadTimes() {
        if ('performance' in window) {
            const navigationEntry = performance.getEntriesByType('navigation')[0];
            if (navigationEntry) {
                this.metrics.loadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
                this.metrics.domContentLoaded = navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart;
                this.metrics.windowLoad = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
                
                this.logMetric('LoadTime', this.metrics.loadTime);
                this.logMetric('DOMContentLoaded', this.metrics.domContentLoaded);
                this.logMetric('WindowLoad', this.metrics.windowLoad);
            }
        }
    }

    /**
     * Observe resource timing
     */
    observeResourceTiming() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        this.analyzeResource(entry);
                    });
                });
                
                observer.observe({ entryTypes: ['resource'] });
                this.observers.set('ResourceTiming', observer);
            } catch (error) {
                console.warn('Resource timing observation not supported:', error);
            }
        }
    }

    /**
     * Observe long tasks
     */
    observeLongTasks() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        if (entry.duration > 50) { // Tasks longer than 50ms
                            console.warn('🐌 Long task detected:', {
                                duration: entry.duration,
                                startTime: entry.startTime,
                                name: entry.name
                            });
                        }
                    });
                });
                
                observer.observe({ entryTypes: ['longtask'] });
                this.observers.set('LongTasks', observer);
            } catch (error) {
                console.warn('Long task observation not supported:', error);
            }
        }
    }

    /**
     * Analyze resource performance
     * @param {PerformanceEntry} entry - Resource entry
     */
    analyzeResource(entry) {
        const resourceData = {
            name: entry.name,
            duration: entry.duration,
            transferSize: entry.transferSize,
            initiatorType: entry.initiatorType,
            startTime: entry.startTime
        };
        
        // Check for slow resources
        if (entry.duration > 1000) { // Resources taking more than 1 second
            console.warn('🐌 Slow resource detected:', resourceData);
        }
        
        // Check for large resources
        if (entry.transferSize > 500000) { // Resources larger than 500KB
            console.warn('📦 Large resource detected:', resourceData);
        }
    }

    /**
     * Log metric with timestamp
     * @param {string} metric - Metric name
     * @param {number} value - Metric value
     */
    logMetric(metric, value) {
        const metricData = {
            metric,
            value,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.performanceData.push(metricData);
        
        // Keep only recent data (last 100 entries)
        if (this.performanceData.length > 100) {
            this.performanceData.splice(0, this.performanceData.length - 100);
        }
        
        // Store in localStorage for persistence
        try {
            localStorage.setItem('performance_metrics', JSON.stringify(this.performanceData));
        } catch (error) {
            console.warn('Failed to store performance metrics:', error);
        }
    }

    /**
     * Evaluate metric against thresholds
     * @param {string} metric - Metric name
     * @param {number} value - Metric value
     */
    evaluateMetric(metric, value) {
        const threshold = this.thresholds[metric];
        if (!threshold) return;
        
        let status = 'good';
        let emoji = '✅';
        
        if (value > threshold.needsImprovement) {
            status = 'poor';
            emoji = '❌';
        } else if (value > threshold.good) {
            status = 'needs-improvement';
            emoji = '⚠️';
        }
        
        console.log(`${emoji} ${metric}: ${value}ms (${status})`);
        
        // Generate optimization recommendations
        if (status !== 'good') {
            this.generateRecommendations(metric, value, status);
        }
    }

    /**
     * Generate optimization recommendations
     * @param {string} metric - Metric name
     * @param {number} value - Metric value
     * @param {string} status - Performance status
     */
    generateRecommendations(metric, value, status) {
        const recommendations = {
            LCP: [
                'Optimize server response times',
                'Use CDN for static assets',
                'Implement lazy loading for images',
                'Optimize critical rendering path'
            ],
            FID: [
                'Reduce JavaScript execution time',
                'Split long tasks',
                'Optimize event handlers',
                'Use web workers for heavy computations'
            ],
            CLS: [
                'Set explicit dimensions for images and videos',
                'Avoid inserting content above existing content',
                'Use transform animations instead of layout-triggering properties'
            ],
            FCP: [
                'Optimize server response times',
                'Minimize critical resources',
                'Eliminate render-blocking resources',
                'Optimize CSS delivery'
            ],
            TTFB: [
                'Optimize server response times',
                'Use CDN',
                'Implement caching strategies',
                'Optimize database queries'
            ],
            TTI: [
                'Reduce JavaScript bundle size',
                'Implement code splitting',
                'Optimize third-party scripts',
                'Use service workers for caching'
            ]
        };
        
        const metricRecommendations = recommendations[metric] || [];
        console.log(`💡 ${metric} optimization recommendations:`, metricRecommendations);
    }

    /**
     * Get performance report
     * @returns {Object} Performance report
     */
    getPerformanceReport() {
        const report = {
            timestamp: Date.now(),
            url: window.location.href,
            metrics: this.metrics,
            summary: this.generateSummary(),
            recommendations: this.generateAllRecommendations(),
            resourceAnalysis: this.analyzeResources(),
            bundleAnalysis: this.analyzeBundle()
        };
        
        return report;
    }

    /**
     * Generate performance summary
     * @returns {Object} Performance summary
     */
    generateSummary() {
        const summary = {
            coreWebVitals: {
                LCP: this.getMetricStatus('LCP'),
                FID: this.getMetricStatus('FID'),
                CLS: this.getMetricStatus('CLS')
            },
            additionalMetrics: {
                FCP: this.getMetricStatus('FCP'),
                TTFB: this.getMetricStatus('TTFB'),
                TTI: this.getMetricStatus('TTI')
            },
            overallScore: this.calculateOverallScore()
        };
        
        return summary;
    }

    /**
     * Get metric status
     * @param {string} metric - Metric name
     * @returns {Object} Metric status
     */
    getMetricStatus(metric) {
        const value = this.metrics[metric];
        const threshold = this.thresholds[metric];
        
        if (!value || !threshold) {
            return { status: 'unknown', value: null };
        }
        
        let status = 'good';
        if (value > threshold.needsImprovement) {
            status = 'poor';
        } else if (value > threshold.good) {
            status = 'needs-improvement';
        }
        
        return { status, value };
    }

    /**
     * Calculate overall performance score
     * @returns {number} Overall score (0-100)
     */
    calculateOverallScore() {
        const coreMetrics = ['LCP', 'FID', 'CLS'];
        let score = 0;
        let validMetrics = 0;
        
        coreMetrics.forEach(metric => {
            const status = this.getMetricStatus(metric);
            if (status.value !== null) {
                validMetrics++;
                switch (status.status) {
                    case 'good':
                        score += 100;
                        break;
                    case 'needs-improvement':
                        score += 50;
                        break;
                    case 'poor':
                        score += 0;
                        break;
                }
            }
        });
        
        return validMetrics > 0 ? Math.round(score / validMetrics) : 0;
    }

    /**
     * Generate all optimization recommendations
     * @returns {Array} All recommendations
     */
    generateAllRecommendations() {
        const recommendations = [];
        
        Object.keys(this.metrics).forEach(metric => {
            if (this.metrics[metric] !== null) {
                const status = this.getMetricStatus(metric);
                if (status.status !== 'good') {
                    recommendations.push({
                        metric,
                        status: status.status,
                        value: status.value,
                        priority: status.status === 'poor' ? 'high' : 'medium'
                    });
                }
            }
        });
        
        return recommendations;
    }

    /**
     * Analyze resource performance
     * @returns {Object} Resource analysis
     */
    analyzeResources() {
        if (!('performance' in window)) {
            return { error: 'Performance API not supported' };
        }
        
        const resources = performance.getEntriesByType('resource');
        const analysis = {
            totalResources: resources.length,
            slowResources: resources.filter(r => r.duration > 1000).length,
            largeResources: resources.filter(r => r.transferSize > 500000).length,
            averageLoadTime: resources.reduce((sum, r) => sum + r.duration, 0) / resources.length
        };
        
        return analysis;
    }

    /**
     * Analyze bundle performance
     * @returns {Object} Bundle analysis
     */
    analyzeBundle() {
        if (!('performance' in window)) {
            return { error: 'Performance API not supported' };
        }
        
        const resources = performance.getEntriesByType('resource');
        const jsResources = resources.filter(r => 
            r.name.endsWith('.js') || r.initiatorType === 'script'
        );
        
        const analysis = {
            totalJSFiles: jsResources.length,
            totalSize: jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
            averageSize: jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0) / jsResources.length,
            largestFile: Math.max(...jsResources.map(r => r.transferSize || 0))
        };
        
        return analysis;
    }

    /**
     * Send performance report to endpoint
     * @param {string} endpoint - Reporting endpoint
     */
    async sendPerformanceReport(endpoint = null) {
        const reportEndpoint = endpoint || this.reportingEndpoint;
        if (!reportEndpoint) {
            console.warn('No reporting endpoint configured');
            return;
        }
        
        try {
            const report = this.getPerformanceReport();
            const response = await fetch(reportEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(report)
            });
            
            if (response.ok) {
                console.log('📊 Performance report sent successfully');
            } else {
                console.error('❌ Failed to send performance report');
            }
        } catch (error) {
            console.error('❌ Error sending performance report:', error);
        }
    }

    /**
     * Stop performance monitoring
     */
    stopMonitoring() {
        this.isMonitoring = false;
        
        // Disconnect all observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        
        this.observers.clear();
        console.log('🛑 Performance monitoring stopped');
    }

    /**
     * Get current metrics
     * @returns {Object} Current metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }

    /**
     * Get performance data history
     * @returns {Array} Performance data history
     */
    getPerformanceData() {
        return [...this.performanceData];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
} else {
    window.PerformanceMonitor = PerformanceMonitor;
} 