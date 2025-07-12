/**
 * Content Security Policy Configuration
 * Advanced security layer for production deployment
 * Implements strict CSP directives to prevent XSS, injection attacks
 */

export class CSPConfig {
    constructor() {
        this.cspDirectives = {
            'default-src': ["'self'"],
            'script-src': [
                "'self'",
                "'unsafe-inline'", // Required for dynamic content
                "https://www.googletagmanager.com",
                "https://www.google-analytics.com"
            ],
            'style-src': [
                "'self'",
                "'unsafe-inline'", // Required for Tailwind CSS
                "https://fonts.googleapis.com"
            ],
            'font-src': [
                "'self'",
                "https://fonts.gstatic.com"
            ],
            'img-src': [
                "'self'",
                "data:",
                "https:"
            ],
            'connect-src': [
                "'self'",
                "https://www.google-analytics.com",
                "https://analytics.google.com"
            ],
            'frame-ancestors': ["'none'"], // Prevent clickjacking
            'form-action': ["'self'"],
            'base-uri': ["'self'"],
            'object-src': ["'none'"],
            'media-src': ["'self'"],
            'worker-src': ["'self'"],
            'manifest-src': ["'self'"],
            'upgrade-insecure-requests': []
        };

        this.securityHeaders = {
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
        };

        this.violationReporting = {
            enabled: true,
            endpoint: '/csp-violation-report',
            maxReports: 100
        };
    }

    /**
     * Generate CSP header string
     * @returns {string} CSP header value
     */
    generateCSPHeader() {
        const directives = [];
        
        for (const [directive, sources] of Object.entries(this.cspDirectives)) {
            if (sources.length > 0) {
                directives.push(`${directive} ${sources.join(' ')}`);
            }
        }

        return directives.join('; ');
    }

    /**
     * Apply CSP to document
     * @param {Document} document - Document object
     */
    applyCSPToDocument(document) {
        try {
            // Create CSP meta tag
            const cspMeta = document.createElement('meta');
            cspMeta.httpEquiv = 'Content-Security-Policy';
            cspMeta.content = this.generateCSPHeader();
            
            // Insert at the beginning of head
            const head = document.head;
            if (head.firstChild) {
                head.insertBefore(cspMeta, head.firstChild);
            } else {
                head.appendChild(cspMeta);
            }

            // Set up violation reporting
            if (this.violationReporting.enabled) {
                this.setupViolationReporting(document);
            }

            console.log('🔒 CSP applied successfully');
            return true;
        } catch (error) {
            console.error('❌ CSP application failed:', error);
            return false;
        }
    }

    /**
     * Set up CSP violation reporting
     * @param {Document} document - Document object
     */
    setupViolationReporting(document) {
        try {
            const reportUri = this.violationReporting.endpoint;
            const cspReportMeta = document.createElement('meta');
            cspReportMeta.httpEquiv = 'Content-Security-Policy-Report-Only';
            cspReportMeta.content = `report-uri ${reportUri}`;
            
            document.head.appendChild(cspReportMeta);

            // Listen for CSP violations
            document.addEventListener('securitypolicyviolation', (event) => {
                this.handleCSPViolation(event);
            });

            console.log('📊 CSP violation reporting enabled');
        } catch (error) {
            console.error('❌ CSP violation reporting setup failed:', error);
        }
    }

    /**
     * Handle CSP violation events
     * @param {SecurityPolicyViolationEvent} event - CSP violation event
     */
    handleCSPViolation(event) {
        const violation = {
            timestamp: new Date().toISOString(),
            violatedDirective: event.violatedDirective,
            effectiveDirective: event.effectiveDirective,
            blockedURI: event.blockedURI,
            sourceFile: event.sourceFile,
            lineNumber: event.lineNumber,
            columnNumber: event.columnNumber,
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };

        // Log violation for monitoring
        console.warn('🚨 CSP Violation detected:', violation);
        
        // Send to monitoring system
        this.reportViolation(violation);
    }

    /**
     * Report violation to monitoring system
     * @param {Object} violation - Violation details
     */
    reportViolation(violation) {
        try {
            // Store in localStorage for monitoring
            const violations = JSON.parse(localStorage.getItem('csp_violations') || '[]');
            violations.push(violation);
            
            // Keep only recent violations
            if (violations.length > this.violationReporting.maxReports) {
                violations.splice(0, violations.length - this.violationReporting.maxReports);
            }
            
            localStorage.setItem('csp_violations', JSON.stringify(violations));
            
            // Send to analytics if available
            if (window.gtag) {
                window.gtag('event', 'csp_violation', {
                    event_category: 'security',
                    event_label: violation.violatedDirective,
                    value: 1
                });
            }
        } catch (error) {
            console.error('❌ Violation reporting failed:', error);
        }
    }

    /**
     * Get security headers for server configuration
     * @returns {Object} Security headers object
     */
    getSecurityHeaders() {
        return {
            ...this.securityHeaders,
            'Content-Security-Policy': this.generateCSPHeader()
        };
    }

    /**
     * Validate CSP configuration
     * @returns {Object} Validation result
     */
    validateConfiguration() {
        const issues = [];
        
        // Check for unsafe directives
        if (this.cspDirectives['script-src'].includes("'unsafe-eval'")) {
            issues.push('Unsafe eval detected in script-src');
        }
        
        if (this.cspDirectives['object-src'].includes("'self'")) {
            issues.push('Object-src should be none for maximum security');
        }

        return {
            valid: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 20))
        };
    }

    /**
     * Get CSP statistics
     * @returns {Object} CSP statistics
     */
    getStatistics() {
        try {
            const violations = JSON.parse(localStorage.getItem('csp_violations') || '[]');
            const recentViolations = violations.filter(v => 
                new Date(v.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
            );

            return {
                totalViolations: violations.length,
                recentViolations: recentViolations.length,
                lastViolation: violations.length > 0 ? violations[violations.length - 1] : null,
                configuration: this.validateConfiguration()
            };
        } catch (error) {
            console.error('❌ CSP statistics retrieval failed:', error);
            return { error: 'Statistics unavailable' };
        }
    }
} 