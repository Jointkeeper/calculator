/**
 * Security Headers Implementation
 * Advanced HTTP security headers for production deployment
 * Implements comprehensive security headers to prevent various attacks
 */

class SecurityHeaders {
    constructor() {
        this.headers = {
            // Prevent clickjacking attacks
            'X-Frame-Options': 'DENY',
            
            // Prevent MIME type sniffing
            'X-Content-Type-Options': 'nosniff',
            
            // Control referrer information
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            
            // XSS protection
            'X-XSS-Protection': '1; mode=block',
            
            // HTTPS enforcement
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
            
            // Feature policy restrictions
            'Permissions-Policy': this.generatePermissionsPolicy(),
            
            // Cache control for sensitive pages
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            
            // Pragma for backward compatibility
            'Pragma': 'no-cache',
            
            // Expires header
            'Expires': '0',
            
            // Content type security
            'X-Download-Options': 'noopen',
            
            // IE security
            'X-Permitted-Cross-Domain-Policies': 'none'
        };

        this.cspConfig = null;
        this.monitoringEnabled = true;
    }

    /**
     * Generate comprehensive permissions policy
     * @returns {string} Permissions policy string
     */
    generatePermissionsPolicy() {
        const policies = [
            'accelerometer=()',
            'ambient-light-sensor=()',
            'autoplay=()',
            'battery=()',
            'camera=()',
            'cross-origin-isolated=()',
            'display-capture=()',
            'document-domain=()',
            'encrypted-media=()',
            'execution-while-not-rendered=()',
            'execution-while-out-of-viewport=()',
            'fullscreen=()',
            'geolocation=()',
            'gyroscope=()',
            'keyboard-map=()',
            'magnetometer=()',
            'microphone=()',
            'midi=()',
            'navigation-override=()',
            'payment=()',
            'picture-in-picture=()',
            'publickey-credentials-get=()',
            'screen-wake-lock=()',
            'sync-xhr=()',
            'usb=()',
            'web-share=()',
            'xr-spatial-tracking=()'
        ];

        return policies.join(', ');
    }

    /**
     * Set CSP configuration
     * @param {CSPConfig} cspConfig - CSP configuration instance
     */
    setCSPConfig(cspConfig) {
        this.cspConfig = cspConfig;
        if (cspConfig) {
            this.headers['Content-Security-Policy'] = cspConfig.generateCSPHeader();
        }
    }

    /**
     * Get all security headers
     * @returns {Object} Complete headers object
     */
    getAllHeaders() {
        return { ...this.headers };
    }

    /**
     * Apply headers to document (for client-side implementation)
     * @param {Document} document - Document object
     */
    applyToDocument(document) {
        try {
            // Apply CSP if available
            if (this.cspConfig) {
                this.cspConfig.applyCSPToDocument(document);
            }

            // Set up security monitoring
            if (this.monitoringEnabled) {
                this.setupSecurityMonitoring(document);
            }

            console.log('🔒 Security headers applied to document');
            return true;
        } catch (error) {
            console.error('❌ Security headers application failed:', error);
            return false;
        }
    }

    /**
     * Set up security monitoring
     * @param {Document} document - Document object
     */
    setupSecurityMonitoring(document) {
        try {
            // Monitor for security-related events
            this.monitorFrameAttempts(document);
            this.monitorXSSAttempts(document);
            this.monitorFeaturePolicyViolations(document);
            
            console.log('📊 Security monitoring enabled');
        } catch (error) {
            console.error('❌ Security monitoring setup failed:', error);
        }
    }

    /**
     * Monitor frame embedding attempts
     * @param {Document} document - Document object
     */
    monitorFrameAttempts(document) {
        // Check if page is in frame
        if (window.top !== window.self) {
            const violation = {
                type: 'frame_embedding_attempt',
                timestamp: new Date().toISOString(),
                url: window.location.href,
                referrer: document.referrer,
                userAgent: navigator.userAgent
            };

            this.logSecurityEvent(violation);
            
            // Try to break out of frame
            try {
                window.top.location = window.location;
            } catch (e) {
                // Frame busting failed, log the attempt
                console.warn('🚨 Frame embedding detected, busting failed');
            }
        }
    }

    /**
     * Monitor XSS attempts
     * @param {Document} document - Document object
     */
    monitorXSSAttempts(document) {
        // Monitor for suspicious script injection patterns
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.checkForXSSPatterns(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Check for XSS patterns in DOM elements
     * @param {Element} element - DOM element to check
     */
    checkForXSSPatterns(element) {
        const suspiciousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /data:text\/html/gi
        ];

        const elementHTML = element.outerHTML || element.innerHTML || '';
        
        suspiciousPatterns.forEach((pattern, index) => {
            if (pattern.test(elementHTML)) {
                const violation = {
                    type: 'xss_attempt',
                    timestamp: new Date().toISOString(),
                    pattern: pattern.toString(),
                    element: element.tagName,
                    url: window.location.href,
                    userAgent: navigator.userAgent
                };

                this.logSecurityEvent(violation);
                console.warn('🚨 XSS pattern detected:', pattern.toString());
            }
        });
    }

    /**
     * Monitor feature policy violations
     * @param {Document} document - Document object
     */
    monitorFeaturePolicyViolations(document) {
        // Monitor for feature policy violations
        const features = [
            'camera',
            'microphone',
            'geolocation',
            'payment',
            'fullscreen'
        ];

        features.forEach(feature => {
            if (navigator[feature]) {
                const violation = {
                    type: 'feature_policy_violation',
                    timestamp: new Date().toISOString(),
                    feature: feature,
                    url: window.location.href,
                    userAgent: navigator.userAgent
                };

                this.logSecurityEvent(violation);
            }
        });
    }

    /**
     * Log security event
     * @param {Object} event - Security event object
     */
    logSecurityEvent(event) {
        try {
            // Store in localStorage
            const events = JSON.parse(localStorage.getItem('security_events') || '[]');
            events.push(event);
            
            // Keep only recent events (last 100)
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            
            localStorage.setItem('security_events', JSON.stringify(events));
            
            // Send to analytics if available
            if (window.gtag) {
                window.gtag('event', 'security_violation', {
                    event_category: 'security',
                    event_label: event.type,
                    value: 1
                });
            }

            console.warn('🚨 Security event logged:', event.type);
        } catch (error) {
            console.error('❌ Security event logging failed:', error);
        }
    }

    /**
     * Get security statistics
     * @returns {Object} Security statistics
     */
    getSecurityStatistics() {
        try {
            const events = JSON.parse(localStorage.getItem('security_events') || '[]');
            const recentEvents = events.filter(e => 
                new Date(e.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
            );

            const eventTypes = {};
            events.forEach(event => {
                eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
            });

            return {
                totalEvents: events.length,
                recentEvents: recentEvents.length,
                eventTypes: eventTypes,
                lastEvent: events.length > 0 ? events[events.length - 1] : null,
                headers: this.getAllHeaders()
            };
        } catch (error) {
            console.error('❌ Security statistics retrieval failed:', error);
            return { error: 'Statistics unavailable' };
        }
    }

    /**
     * Validate security configuration
     * @returns {Object} Validation result
     */
    validateConfiguration() {
        const issues = [];
        const warnings = [];

        // Check for critical security headers
        const criticalHeaders = [
            'X-Frame-Options',
            'X-Content-Type-Options',
            'X-XSS-Protection'
        ];

        criticalHeaders.forEach(header => {
            if (!this.headers[header]) {
                issues.push(`Missing critical header: ${header}`);
            }
        });

        // Check for HTTPS enforcement
        if (!this.headers['Strict-Transport-Security']) {
            warnings.push('HSTS header not configured');
        }

        // Check CSP configuration
        if (!this.cspConfig) {
            warnings.push('CSP configuration not set');
        }

        return {
            valid: issues.length === 0,
            issues: issues,
            warnings: warnings,
            score: Math.max(0, 100 - (issues.length * 25) - (warnings.length * 10))
        };
    }

    /**
     * Generate server configuration
     * @returns {Object} Server configuration object
     */
    generateServerConfig() {
        return {
            headers: this.getAllHeaders(),
            validation: this.validateConfiguration(),
            recommendations: this.generateRecommendations()
        };
    }

    /**
     * Generate security recommendations
     * @returns {Array} Array of recommendations
     */
    generateRecommendations() {
        const recommendations = [];

        if (!this.headers['Strict-Transport-Security']) {
            recommendations.push('Enable HSTS for HTTPS enforcement');
        }

        if (!this.cspConfig) {
            recommendations.push('Implement Content Security Policy');
        }

        if (this.headers['X-Frame-Options'] !== 'DENY') {
            recommendations.push('Set X-Frame-Options to DENY for maximum security');
        }

        return recommendations;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityHeaders;
} else {
    window.SecurityHeaders = SecurityHeaders;
} 