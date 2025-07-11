/**
 * Advanced Performance Monitor
 * Core Web Vitals tracking and performance optimization monitoring
 * Implements comprehensive performance metrics and optimization recommendations
 */

import { PerformanceMetrics } from './performance/PerformanceMetrics.js';
import { PerformanceAnalysis } from './performance/PerformanceAnalysis.js';

class PerformanceMonitor {
    constructor() {
        this.metrics = new PerformanceMetrics();
        this.analysis = new PerformanceAnalysis(this.metrics);
        
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
        this.metrics.setThresholds(config.thresholds || {});
        
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
        this.observeCoreWebVitals();
        
        // Monitor additional metrics
        this.measureAdditionalMetrics();
        
        // Monitor resource loading
        this.observeResourceTiming();
        
        // Monitor long tasks
        this.observeLongTasks();
        
        console.log('📊 Performance monitoring started');
    }

    /**
     * Observe Core Web Vitals
     */
    observeCoreWebVitals() {
        // LCP
        const lcpObserver = this.metrics.observeLCP((metric, value) => {
            this.logMetric(metric, value);
            this.evaluateMetric(metric, value);
        });
        if (lcpObserver) this.observers.set('LCP', lcpObserver);
        
        // FID
        const fidObserver = this.metrics.observeFID((metric, value) => {
            this.logMetric(metric, value);
            this.evaluateMetric(metric, value);
        });
        if (fidObserver) this.observers.set('FID', fidObserver);
        
        // CLS
        const clsObserver = this.metrics.observeCLS((metric, value) => {
            this.logMetric(metric, value);
            this.evaluateMetric(metric, value);
        });
        if (clsObserver) this.observers.set('CLS', clsObserver);
        
        // FCP
        const fcpObserver = this.metrics.observeFCP((metric, value) => {
            this.logMetric(metric, value);
            this.evaluateMetric(metric, value);
        });
        if (fcpObserver) this.observers.set('FCP', fcpObserver);
    }

    /**
     * Measure additional metrics
     */
    measureAdditionalMetrics() {
        // TTFB
        this.metrics.measureTTFB((metric, value) => {
            this.logMetric(metric, value);
            this.evaluateMetric(metric, value);
        });
        
        // TTI
        this.metrics.measureTTI((metric, value) => {
            this.logMetric(metric, value);
            this.evaluateMetric(metric, value);
        });
        
        // Bundle size
        this.metrics.measureBundleSize((metric, value) => {
            this.logMetric(metric, value);
            this.evaluateMetric(metric, value);
        });
        
        // Load times
        this.metrics.measureLoadTimes((metric, value) => {
            this.logMetric(metric, value);
            this.evaluateMetric(metric, value);
        });
    }

    /**
     * Observe resource timing
     */
    observeResourceTiming() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => this.analyzeResource(entry));
                });
                
                observer.observe({ entryTypes: ['resource'] });
                this.observers.set('resource', observer);
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
                    entries.forEach(entry => {
                        if (entry.duration > 50) { // Tasks longer than 50ms
                            console.warn('Long task detected:', entry);
                        }
                    });
                });
                
                observer.observe({ entryTypes: ['longtask'] });
                this.observers.set('longtask', observer);
            } catch (error) {
                console.warn('Long task observation not supported:', error);
            }
        }
    }

    /**
     * Analyze resource entry
     * @param {PerformanceEntry} entry - Resource entry
     */
    analyzeResource(entry) {
        const loadTime = entry.responseEnd - entry.fetchStart;
        
        if (loadTime > 1000) {
            console.warn('Slow resource detected:', {
                name: entry.name,
                loadTime: loadTime,
                size: entry.transferSize
            });
        }
        
        if (entry.transferSize > 100000) {
            console.warn('Large resource detected:', {
                name: entry.name,
                size: entry.transferSize,
                loadTime: loadTime
            });
        }
    }

    /**
     * Log metric
     * @param {string} metric - Metric name
     * @param {number} value - Metric value
     */
    logMetric(metric, value) {
        const metricData = {
            metric,
            value,
            timestamp: Date.now(),
            url: window.location.href
        };
        
        this.performanceData.push(metricData);
        
        // Store in localStorage for persistence
        try {
            const stored = JSON.parse(localStorage.getItem('performance_metrics') || '[]');
            stored.push(metricData);
            
            // Keep only last 100 entries
            if (stored.length > 100) {
                stored.splice(0, stored.length - 100);
            }
            
            localStorage.setItem('performance_metrics', JSON.stringify(stored));
        } catch (error) {
            console.warn('Failed to store performance metrics:', error);
        }
        
        console.log(`📊 ${metric}: ${value}`);
    }

    /**
     * Evaluate metric
     * @param {string} metric - Metric name
     * @param {number} value - Metric value
     */
    evaluateMetric(metric, value) {
        const status = this.analysis.evaluateMetric(metric, value);
        const recommendations = this.analysis.generateRecommendations(metric, value, status);
        
        if (status === 'poor') {
            console.warn(`⚠️ ${metric} needs improvement:`, recommendations);
        }
    }

    /**
     * Get performance report
     * @returns {Object} Performance report
     */
    getPerformanceReport() {
        return this.analysis.getPerformanceReport();
    }

    /**
     * Generate summary
     * @returns {Object} Performance summary
     */
    generateSummary() {
        const report = this.getPerformanceReport();
        return report.summary;
    }

    /**
     * Get metric status
     * @param {string} metric - Metric name
     * @returns {string} Metric status
     */
    getMetricStatus(metric) {
        const metrics = this.metrics.getMetrics();
        const value = metrics[metric];
        return this.analysis.evaluateMetric(metric, value);
    }

    /**
     * Calculate overall score
     * @returns {number} Overall performance score
     */
    calculateOverallScore() {
        const summary = this.generateSummary();
        return summary.overallScore;
    }

    /**
     * Generate all recommendations
     * @returns {Array} All recommendations
     */
    generateAllRecommendations() {
        const report = this.getPerformanceReport();
        return [...new Set(report.recommendations)]; // Remove duplicates
    }

    /**
     * Analyze resources
     * @returns {Object} Resource analysis
     */
    analyzeResources() {
        return this.analysis.analyzeResources();
    }

    /**
     * Analyze bundle
     * @returns {Object} Bundle analysis
     */
    analyzeBundle() {
        return this.analysis.analyzeBundle();
    }

    /**
     * Send performance report
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
                console.error('Failed to send performance report:', response.status);
            }
        } catch (error) {
            console.error('Error sending performance report:', error);
        }
    }

    /**
     * Stop monitoring
     */
    stopMonitoring() {
        this.isMonitoring = false;
        
        // Disconnect all observers
        this.observers.forEach(observer => {
            if (observer && typeof observer.disconnect === 'function') {
                observer.disconnect();
            }
        });
        
        this.observers.clear();
        console.log('🛑 Performance monitoring stopped');
    }

    /**
     * Get metrics
     * @returns {Object} Current metrics
     */
    getMetrics() {
        return this.metrics.getMetrics();
    }

    /**
     * Get performance data
     * @returns {Array} Performance data history
     */
    getPerformanceData() {
        return [...this.performanceData];
    }
}

export default PerformanceMonitor; 