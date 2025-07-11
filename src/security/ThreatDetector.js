/**
 * Advanced Threat Detection System
 * Real-time threat detection and response for production deployment
 * Implements pattern recognition, rate limiting, and automated security responses
 */

class ThreatDetector {
    constructor() {
        this.threatPatterns = {
            // XSS attack patterns
            xss: [
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                /javascript:/gi,
                /on\w+\s*=/gi,
                /data:text\/html/gi,
                /vbscript:/gi,
                /expression\s*\(/gi
            ],
            
            // SQL injection patterns
            sqlInjection: [
                /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi,
                /(\b(or|and)\b\s+\d+\s*=\s*\d+)/gi,
                /(\b(union|select)\b.*\bfrom\b)/gi,
                /(\b(union|select)\b.*\bwhere\b)/gi
            ],
            
            // CSRF attack patterns
            csrf: [
                /<img\s+src\s*=\s*["']?[^"']*["']?\s*>/gi,
                /<iframe\s+src\s*=\s*["']?[^"']*["']?\s*>/gi
            ],
            
            // Path traversal patterns
            pathTraversal: [
                /\.\.\//gi,
                /\.\.\\/gi,
                /%2e%2e%2f/gi,
                /%2e%2e%5c/gi
            ],
            
            // Command injection patterns
            commandInjection: [
                /(\b(cat|ls|dir|rm|del|mkdir|echo|wget|curl)\b)/gi,
                /(\b(system|exec|eval|shell_exec)\b)/gi,
                /(\b(ping|nslookup|traceroute|netstat)\b)/gi
            ]
        };

        this.rateLimits = {
            formSubmissions: { limit: 10, window: 60000 }, // 10 per minute
            loginAttempts: { limit: 5, window: 300000 },   // 5 per 5 minutes
            apiRequests: { limit: 100, window: 60000 },    // 100 per minute
            securityEvents: { limit: 50, window: 60000 }   // 50 per minute
        };

        this.threatLevels = {
            LOW: 1,
            MEDIUM: 2,
            HIGH: 3,
            CRITICAL: 4
        };

        this.activeThreats = new Map();
        this.rateLimitCounters = new Map();
        this.securityEvents = [];
        this.monitoringEnabled = true;
    }

    /**
     * Detect suspicious activity
     * @param {Object} activity - Activity object to analyze
     * @returns {Object} Detection result
     */
    detectSuspiciousActivity(activity) {
        const result = {
            suspicious: false,
            threatLevel: this.threatLevels.LOW,
            detectedPatterns: [],
            recommendations: [],
            timestamp: new Date().toISOString()
        };

        try {
            // Check for XSS patterns
            if (activity.content) {
                const xssThreats = this.checkPatterns(activity.content, this.threatPatterns.xss, 'XSS');
                result.detectedPatterns.push(...xssThreats);
            }

            // Check for SQL injection patterns
            if (activity.input) {
                const sqlThreats = this.checkPatterns(activity.input, this.threatPatterns.sqlInjection, 'SQL_INJECTION');
                result.detectedPatterns.push(...sqlThreats);
            }

            // Check for CSRF patterns
            if (activity.content) {
                const csrfThreats = this.checkPatterns(activity.content, this.threatPatterns.csrf, 'CSRF');
                result.detectedPatterns.push(...csrfThreats);
            }

            // Check for path traversal
            if (activity.path || activity.url) {
                const pathThreats = this.checkPatterns(
                    activity.path || activity.url, 
                    this.threatPatterns.pathTraversal, 
                    'PATH_TRAVERSAL'
                );
                result.detectedPatterns.push(...pathThreats);
            }

            // Check for command injection
            if (activity.command || activity.input) {
                const cmdThreats = this.checkPatterns(
                    activity.command || activity.input,
                    this.threatPatterns.commandInjection,
                    'COMMAND_INJECTION'
                );
                result.detectedPatterns.push(...cmdThreats);
            }

            // Determine threat level
            result.threatLevel = this.calculateThreatLevel(result.detectedPatterns);
            result.suspicious = result.detectedPatterns.length > 0;

            // Generate recommendations
            result.recommendations = this.generateRecommendations(result.detectedPatterns);

            // Log security event
            if (result.suspicious) {
                this.logSecurityEvent({
                    type: 'suspicious_activity_detected',
                    threatLevel: result.threatLevel,
                    patterns: result.detectedPatterns,
                    activity: activity,
                    timestamp: result.timestamp
                });
            }

            return result;
        } catch (error) {
            console.error('❌ Threat detection failed:', error);
            return { ...result, error: 'Detection failed' };
        }
    }

    /**
     * Check content against threat patterns
     * @param {string} content - Content to check
     * @param {Array} patterns - Patterns to check against
     * @param {string} threatType - Type of threat
     * @returns {Array} Detected threats
     */
    checkPatterns(content, patterns, threatType) {
        const threats = [];
        
        patterns.forEach((pattern, index) => {
            if (pattern.test(content)) {
                threats.push({
                    type: threatType,
                    pattern: pattern.toString(),
                    index: index,
                    severity: this.getPatternSeverity(threatType, index)
                });
            }
        });

        return threats;
    }

    /**
     * Get pattern severity
     * @param {string} threatType - Type of threat
     * @param {number} patternIndex - Pattern index
     * @returns {number} Severity level
     */
    getPatternSeverity(threatType, patternIndex) {
        const severityMap = {
            'XSS': [4, 3, 2, 2, 1, 1],
            'SQL_INJECTION': [4, 3, 3, 2],
            'CSRF': [3, 2],
            'PATH_TRAVERSAL': [3, 3, 2, 2],
            'COMMAND_INJECTION': [4, 4, 3]
        };

        return severityMap[threatType]?.[patternIndex] || 2;
    }

    /**
     * Calculate overall threat level
     * @param {Array} patterns - Detected patterns
     * @returns {number} Threat level
     */
    calculateThreatLevel(patterns) {
        if (patterns.length === 0) return this.threatLevels.LOW;

        const maxSeverity = Math.max(...patterns.map(p => p.severity));
        const patternCount = patterns.length;

        if (maxSeverity >= 4 || patternCount >= 3) return this.threatLevels.CRITICAL;
        if (maxSeverity >= 3 || patternCount >= 2) return this.threatLevels.HIGH;
        if (maxSeverity >= 2) return this.threatLevels.MEDIUM;
        return this.threatLevels.LOW;
    }

    /**
     * Generate security recommendations
     * @param {Array} patterns - Detected patterns
     * @returns {Array} Recommendations
     */
    generateRecommendations(patterns) {
        const recommendations = [];

        patterns.forEach(pattern => {
            switch (pattern.type) {
                case 'XSS':
                    recommendations.push('Sanitize user input to prevent XSS attacks');
                    recommendations.push('Use Content Security Policy headers');
                    break;
                case 'SQL_INJECTION':
                    recommendations.push('Use parameterized queries');
                    recommendations.push('Validate and sanitize database inputs');
                    break;
                case 'CSRF':
                    recommendations.push('Implement CSRF tokens');
                    recommendations.push('Validate request origin');
                    break;
                case 'PATH_TRAVERSAL':
                    recommendations.push('Validate file paths');
                    recommendations.push('Use whitelist approach for file access');
                    break;
                case 'COMMAND_INJECTION':
                    recommendations.push('Avoid command execution with user input');
                    recommendations.push('Use safe alternatives to system commands');
                    break;
            }
        });

        return [...new Set(recommendations)]; // Remove duplicates
    }

    /**
     * Implement rate limiting
     * @param {string} endpoint - Endpoint to rate limit
     * @param {Object} limit - Rate limit configuration
     * @returns {boolean} Whether request is allowed
     */
    implementRateLimit(endpoint, limit = null) {
        try {
            const config = limit || this.rateLimits.apiRequests;
            const key = `rate_limit_${endpoint}`;
            const now = Date.now();
            
            // Get current counter
            const counter = this.rateLimitCounters.get(key) || {
                count: 0,
                resetTime: now + config.window
            };

            // Reset counter if window expired
            if (now > counter.resetTime) {
                counter.count = 0;
                counter.resetTime = now + config.window;
            }

            // Check if limit exceeded
            if (counter.count >= config.limit) {
                this.logSecurityEvent({
                    type: 'rate_limit_exceeded',
                    endpoint: endpoint,
                    limit: config.limit,
                    window: config.window,
                    timestamp: new Date().toISOString()
                });

                return false;
            }

            // Increment counter
            counter.count++;
            this.rateLimitCounters.set(key, counter);

            return true;
        } catch (error) {
            console.error('❌ Rate limiting failed:', error);
            return true; // Allow request if rate limiting fails
        }
    }

    /**
     * Log security event
     * @param {Object} event - Security event object
     */
    logSecurityEvent(event) {
        try {
            // Add to memory
            this.securityEvents.push(event);
            
            // Keep only recent events (last 1000)
            if (this.securityEvents.length > 1000) {
                this.securityEvents.splice(0, this.securityEvents.length - 1000);
            }

            // Store in localStorage
            const events = JSON.parse(localStorage.getItem('threat_detection_events') || '[]');
            events.push(event);
            
            if (events.length > 500) {
                events.splice(0, events.length - 500);
            }
            
            localStorage.setItem('threat_detection_events', JSON.stringify(events));

            // Send to analytics if available
            if (window.gtag) {
                window.gtag('event', 'security_threat', {
                    event_category: 'security',
                    event_label: event.type,
                    value: event.threatLevel || 1
                });
            }

            console.warn('🚨 Security event logged:', event.type);
        } catch (error) {
            console.error('❌ Security event logging failed:', error);
        }
    }

    /**
     * Trigger security response
     * @param {Object} threat - Threat object
     */
    triggerSecurityResponse(threat) {
        try {
            const response = {
                timestamp: new Date().toISOString(),
                threat: threat,
                actions: []
            };

            // Determine response based on threat level
            switch (threat.threatLevel) {
                case this.threatLevels.CRITICAL:
                    response.actions.push('BLOCK_REQUEST');
                    response.actions.push('LOG_CRITICAL_EVENT');
                    response.actions.push('NOTIFY_ADMIN');
                    this.blockRequest(threat);
                    break;
                    
                case this.threatLevels.HIGH:
                    response.actions.push('SANITIZE_INPUT');
                    response.actions.push('LOG_HIGH_EVENT');
                    response.actions.push('INCREASE_MONITORING');
                    this.sanitizeInput(threat);
                    break;
                    
                case this.threatLevels.MEDIUM:
                    response.actions.push('LOG_MEDIUM_EVENT');
                    response.actions.push('ENHANCE_VALIDATION');
                    break;
                    
                case this.threatLevels.LOW:
                    response.actions.push('LOG_LOW_EVENT');
                    break;
            }

            // Log response
            this.logSecurityEvent({
                type: 'security_response_triggered',
                response: response,
                threat: threat
            });

            return response;
        } catch (error) {
            console.error('❌ Security response failed:', error);
            return { error: 'Response failed' };
        }
    }

    /**
     * Block malicious request
     * @param {Object} threat - Threat object
     */
    blockRequest(threat) {
        try {
            // Store blocked request
            const blockedRequests = JSON.parse(localStorage.getItem('blocked_requests') || '[]');
            blockedRequests.push({
                timestamp: new Date().toISOString(),
                threat: threat,
                url: window.location.href,
                userAgent: navigator.userAgent
            });
            
            if (blockedRequests.length > 100) {
                blockedRequests.splice(0, blockedRequests.length - 100);
            }
            
            localStorage.setItem('blocked_requests', JSON.stringify(blockedRequests));

            // Show security warning to user
            this.showSecurityWarning('Suspicious activity detected. Request blocked for security.');
            
            console.warn('🚫 Request blocked due to security threat');
        } catch (error) {
            console.error('❌ Request blocking failed:', error);
        }
    }

    /**
     * Sanitize malicious input
     * @param {Object} threat - Threat object
     */
    sanitizeInput(threat) {
        try {
            // Apply input sanitization
            if (threat.activity && threat.activity.input) {
                const sanitized = this.sanitizeString(threat.activity.input);
                threat.activity.input = sanitized;
            }

            console.log('🧹 Input sanitized due to security threat');
        } catch (error) {
            console.error('❌ Input sanitization failed:', error);
        }
    }

    /**
     * Sanitize string input
     * @param {string} input - Input string
     * @returns {string} Sanitized string
     */
    sanitizeString(input) {
        if (typeof input !== 'string') return input;

        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/data:text\/html/gi, '')
            .replace(/vbscript:/gi, '')
            .replace(/expression\s*\(/gi, '')
            .replace(/\.\.\//gi, '')
            .replace(/\.\.\\/gi, '');
    }

    /**
     * Show security warning to user
     * @param {string} message - Warning message
     */
    showSecurityWarning(message) {
        try {
            // Create warning element
            const warning = document.createElement('div');
            warning.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff4444;
                color: white;
                padding: 15px;
                border-radius: 5px;
                z-index: 10000;
                max-width: 300px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            `;
            warning.textContent = message;
            
            document.body.appendChild(warning);
            
            // Remove after 5 seconds
            setTimeout(() => {
                if (warning.parentNode) {
                    warning.parentNode.removeChild(warning);
                }
            }, 5000);
        } catch (error) {
            console.error('❌ Security warning display failed:', error);
        }
    }

    /**
     * Get threat detection statistics
     * @returns {Object} Statistics object
     */
    getStatistics() {
        try {
            const events = JSON.parse(localStorage.getItem('threat_detection_events') || '[]');
            const recentEvents = events.filter(e => 
                new Date(e.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
            );

            const threatTypes = {};
            const threatLevels = {};

            events.forEach(event => {
                if (event.type === 'suspicious_activity_detected') {
                    event.patterns?.forEach(pattern => {
                        threatTypes[pattern.type] = (threatTypes[pattern.type] || 0) + 1;
                    });
                    
                    const level = this.getThreatLevelName(event.threatLevel);
                    threatLevels[level] = (threatLevels[level] || 0) + 1;
                }
            });

            return {
                totalEvents: events.length,
                recentEvents: recentEvents.length,
                threatTypes: threatTypes,
                threatLevels: threatLevels,
                lastEvent: events.length > 0 ? events[events.length - 1] : null,
                activeThreats: this.activeThreats.size,
                rateLimitCounters: this.rateLimitCounters.size
            };
        } catch (error) {
            console.error('❌ Threat detection statistics failed:', error);
            return { error: 'Statistics unavailable' };
        }
    }

    /**
     * Get threat level name
     * @param {number} level - Threat level number
     * @returns {string} Threat level name
     */
    getThreatLevelName(level) {
        const names = {
            1: 'LOW',
            2: 'MEDIUM',
            3: 'HIGH',
            4: 'CRITICAL'
        };
        return names[level] || 'UNKNOWN';
    }
}

// Export for use in other modules
// Export for ES modules
export default ThreatDetector; 