/**
 * Security Monitoring Dashboard
 * Real-time security metrics and threat assessment for production deployment
 * Provides comprehensive security visibility and alert management
 */

class SecurityMonitor {
    constructor() {
        this.metrics = {
            securityEvents: 0,
            threatLevel: 'LOW',
            activeThreats: 0,
            blockedRequests: 0,
            cspViolations: 0,
            rateLimitViolations: 0,
            lastUpdate: new Date().toISOString()
        };

        this.alerts = [];
        this.threatTimeline = [];
        this.monitoringEnabled = true;
        this.alertThresholds = {
            critical: 5,    // Critical alerts per hour
            high: 15,       // High alerts per hour
            medium: 30,     // Medium alerts per hour
            low: 50         // Low alerts per hour
        };

        this.updateInterval = null;
        this.dashboardElement = null;
    }

    /**
     * Initialize security monitoring
     * @param {Document} document - Document object
     */
    initialize(document) {
        try {
            this.setupDashboard(document);
            this.startRealTimeMonitoring();
            this.setupAlertSystem();
            
            console.log('🔒 Security monitoring initialized');
            return true;
        } catch (error) {
            console.error('❌ Security monitoring initialization failed:', error);
            return false;
        }
    }

    /**
     * Set up security dashboard
     * @param {Document} document - Document object
     */
    setupDashboard(document) {
        try {
            // Create dashboard container
            this.dashboardElement = document.createElement('div');
            this.dashboardElement.id = 'security-dashboard';
            this.dashboardElement.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                width: 300px;
                background: #1a1a1a;
                color: #ffffff;
                border-radius: 8px;
                padding: 15px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                border: 1px solid #333;
                max-height: 400px;
                overflow-y: auto;
                display: none;
            `;

            // Create dashboard content
            this.dashboardElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h3 style="margin: 0; color: #00ff00;">🔒 Security Monitor</h3>
                    <button id="close-dashboard" style="background: #ff4444; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer;">×</button>
                </div>
                <div id="security-metrics"></div>
                <div id="security-alerts" style="margin-top: 10px;"></div>
                <div id="threat-timeline" style="margin-top: 10px;"></div>
            `;

            // Add to document
            document.body.appendChild(this.dashboardElement);

            // Setup close button
            const closeBtn = this.dashboardElement.querySelector('#close-dashboard');
            closeBtn.addEventListener('click', () => {
                this.dashboardElement.style.display = 'none';
            });

            // Setup keyboard shortcut (Ctrl+Shift+S)
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                    e.preventDefault();
                    this.toggleDashboard();
                }
            });

            console.log('📊 Security dashboard created');
        } catch (error) {
            console.error('❌ Dashboard setup failed:', error);
        }
    }

    /**
     * Toggle dashboard visibility
     */
    toggleDashboard() {
        if (this.dashboardElement) {
            const isVisible = this.dashboardElement.style.display !== 'none';
            this.dashboardElement.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                this.updateDashboard();
            }
        }
    }

    /**
     * Start real-time monitoring
     */
    startRealTimeMonitoring() {
        try {
            // Update metrics every 5 seconds
            this.updateInterval = setInterval(() => {
                this.updateMetrics();
                this.updateDashboard();
                this.checkAlertThresholds();
            }, 5000);

            console.log('⏱️ Real-time monitoring started');
        } catch (error) {
            console.error('❌ Real-time monitoring failed:', error);
        }
    }

    /**
     * Update security metrics
     */
    updateMetrics() {
        try {
            // Get security events
            const securityEvents = JSON.parse(localStorage.getItem('security_events') || '[]');
            const threatEvents = JSON.parse(localStorage.getItem('threat_detection_events') || '[]');
            const cspViolations = JSON.parse(localStorage.getItem('csp_violations') || '[]');
            const blockedRequests = JSON.parse(localStorage.getItem('blocked_requests') || '[]');

            // Calculate recent events (last hour)
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const recentSecurityEvents = securityEvents.filter(e => new Date(e.timestamp) > oneHourAgo);
            const recentThreatEvents = threatEvents.filter(e => new Date(e.timestamp) > oneHourAgo);

            // Update metrics
            this.metrics = {
                securityEvents: recentSecurityEvents.length,
                threatEvents: recentThreatEvents.length,
                threatLevel: this.calculateOverallThreatLevel(recentThreatEvents),
                activeThreats: this.countActiveThreats(),
                blockedRequests: blockedRequests.length,
                cspViolations: cspViolations.length,
                rateLimitViolations: this.countRateLimitViolations(recentThreatEvents),
                lastUpdate: new Date().toISOString()
            };

            // Update threat timeline
            this.updateThreatTimeline(recentThreatEvents);

        } catch (error) {
            console.error('❌ Metrics update failed:', error);
        }
    }

    /**
     * Calculate overall threat level
     * @param {Array} events - Security events
     * @returns {string} Threat level
     */
    calculateOverallThreatLevel(events) {
        if (events.length === 0) return 'LOW';

        const criticalCount = events.filter(e => e.threatLevel === 4).length;
        const highCount = events.filter(e => e.threatLevel === 3).length;
        const mediumCount = events.filter(e => e.threatLevel === 2).length;

        if (criticalCount > 0) return 'CRITICAL';
        if (highCount > 2) return 'HIGH';
        if (mediumCount > 5 || highCount > 0) return 'MEDIUM';
        return 'LOW';
    }

    /**
     * Count active threats
     * @returns {number} Active threat count
     */
    countActiveThreats() {
        try {
            const events = JSON.parse(localStorage.getItem('threat_detection_events') || '[]');
            const recentEvents = events.filter(e => 
                new Date(e.timestamp) > new Date(Date.now() - 30 * 60 * 1000) // Last 30 minutes
            );
            return recentEvents.length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Count rate limit violations
     * @param {Array} events - Security events
     * @returns {number} Rate limit violation count
     */
    countRateLimitViolations(events) {
        return events.filter(e => e.type === 'rate_limit_exceeded').length;
    }

    /**
     * Update threat timeline
     * @param {Array} events - Security events
     */
    updateThreatTimeline(events) {
        try {
            this.threatTimeline = events
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 10) // Keep last 10 events
                .map(event => ({
                    timestamp: new Date(event.timestamp).toLocaleTimeString(),
                    type: event.type,
                    threatLevel: event.threatLevel || 'UNKNOWN',
                    description: this.getEventDescription(event)
                }));
        } catch (error) {
            console.error('❌ Threat timeline update failed:', error);
        }
    }

    /**
     * Get event description
     * @param {Object} event - Security event
     * @returns {string} Event description
     */
    getEventDescription(event) {
        switch (event.type) {
            case 'suspicious_activity_detected':
                return `Suspicious activity: ${event.patterns?.length || 0} patterns detected`;
            case 'rate_limit_exceeded':
                return `Rate limit exceeded for ${event.endpoint || 'unknown endpoint'}`;
            case 'xss_attempt':
                return 'XSS attack attempt detected';
            case 'frame_embedding_attempt':
                return 'Frame embedding attempt detected';
            case 'feature_policy_violation':
                return `Feature policy violation: ${event.feature || 'unknown feature'}`;
            default:
                return event.type || 'Unknown event';
        }
    }

    /**
     * Update dashboard display
     */
    updateDashboard() {
        if (!this.dashboardElement) return;

        try {
            const metricsElement = this.dashboardElement.querySelector('#security-metrics');
            const alertsElement = this.dashboardElement.querySelector('#security-alerts');
            const timelineElement = this.dashboardElement.querySelector('#threat-timeline');

            // Update metrics
            metricsElement.innerHTML = `
                <div style="margin-bottom: 8px;">
                    <span style="color: #00ff00;">Threat Level:</span> 
                    <span style="color: ${this.getThreatLevelColor(this.metrics.threatLevel)}; font-weight: bold;">
                        ${this.metrics.threatLevel}
                    </span>
                </div>
                <div style="margin-bottom: 4px;">
                    <span style="color: #ffff00;">Security Events:</span> ${this.metrics.securityEvents}
                </div>
                <div style="margin-bottom: 4px;">
                    <span style="color: #ff8800;">Threat Events:</span> ${this.metrics.threatEvents}
                </div>
                <div style="margin-bottom: 4px;">
                    <span style="color: #ff4444;">Active Threats:</span> ${this.metrics.activeThreats}
                </div>
                <div style="margin-bottom: 4px;">
                    <span style="color: #ff4444;">Blocked Requests:</span> ${this.metrics.blockedRequests}
                </div>
                <div style="margin-bottom: 4px;">
                    <span style="color: #ff8800;">CSP Violations:</span> ${this.metrics.cspViolations}
                </div>
                <div style="margin-bottom: 4px;">
                    <span style="color: #ff8800;">Rate Limit Violations:</span> ${this.metrics.rateLimitViolations}
                </div>
                <div style="font-size: 10px; color: #888; margin-top: 8px;">
                    Last Update: ${new Date(this.metrics.lastUpdate).toLocaleTimeString()}
                </div>
            `;

            // Update alerts
            alertsElement.innerHTML = `
                <div style="color: #00ff00; margin-bottom: 5px;">🚨 Active Alerts (${this.alerts.length})</div>
                ${this.alerts.slice(0, 3).map(alert => `
                    <div style="margin-bottom: 3px; padding: 2px; background: ${this.getAlertColor(alert.level)}; border-radius: 3px;">
                        <span style="font-size: 10px;">${alert.timestamp}</span><br>
                        <span style="font-size: 11px;">${alert.message}</span>
                    </div>
                `).join('')}
                ${this.alerts.length > 3 ? `<div style="color: #888; font-size: 10px;">+${this.alerts.length - 3} more alerts</div>` : ''}
            `;

            // Update timeline
            timelineElement.innerHTML = `
                <div style="color: #00ff00; margin-bottom: 5px;">📊 Recent Threats</div>
                ${this.threatTimeline.map(event => `
                    <div style="margin-bottom: 2px; font-size: 10px;">
                        <span style="color: ${this.getThreatLevelColor(event.threatLevel)};">●</span>
                        <span style="color: #888;">${event.timestamp}</span>
                        <span style="color: #fff;">${event.description}</span>
                    </div>
                `).join('')}
            `;

        } catch (error) {
            console.error('❌ Dashboard update failed:', error);
        }
    }

    /**
     * Get threat level color
     * @param {string} level - Threat level
     * @returns {string} Color code
     */
    getThreatLevelColor(level) {
        const colors = {
            'LOW': '#00ff00',
            'MEDIUM': '#ffff00',
            'HIGH': '#ff8800',
            'CRITICAL': '#ff4444'
        };
        return colors[level] || '#888';
    }

    /**
     * Get alert color
     * @param {string} level - Alert level
     * @returns {string} Color code
     */
    getAlertColor(level) {
        const colors = {
            'LOW': '#333',
            'MEDIUM': '#442200',
            'HIGH': '#442200',
            'CRITICAL': '#440000'
        };
        return colors[level] || '#333';
    }

    /**
     * Setup alert system
     */
    setupAlertSystem() {
        try {
            // Monitor for security events
            window.addEventListener('storage', (e) => {
                if (e.key && e.key.includes('security') || e.key.includes('threat') || e.key.includes('csp')) {
                    this.checkForNewAlerts();
                }
            });

            console.log('🚨 Alert system configured');
        } catch (error) {
            console.error('❌ Alert system setup failed:', error);
        }
    }

    /**
     * Check for new alerts
     */
    checkForNewAlerts() {
        try {
            const recentEvents = this.getRecentSecurityEvents();
            
            recentEvents.forEach(event => {
                if (this.shouldCreateAlert(event)) {
                    this.createAlert(event);
                }
            });
        } catch (error) {
            console.error('❌ Alert check failed:', error);
        }
    }

    /**
     * Get recent security events
     * @returns {Array} Recent security events
     */
    getRecentSecurityEvents() {
        try {
            const events = JSON.parse(localStorage.getItem('threat_detection_events') || '[]');
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            return events.filter(e => new Date(e.timestamp) > oneHourAgo);
        } catch (error) {
            return [];
        }
    }

    /**
     * Check if event should create alert
     * @param {Object} event - Security event
     * @returns {boolean} Should create alert
     */
    shouldCreateAlert(event) {
        // Check if alert already exists for this event
        const existingAlert = this.alerts.find(a => 
            a.eventId === event.timestamp && a.type === event.type
        );

        if (existingAlert) return false;

        // Create alert based on threat level
        const threatLevel = event.threatLevel || 1;
        return threatLevel >= 3; // HIGH or CRITICAL
    }

    /**
     * Create security alert
     * @param {Object} event - Security event
     */
    createAlert(event) {
        try {
            const alert = {
                id: Date.now(),
                timestamp: new Date().toLocaleTimeString(),
                level: this.getThreatLevelName(event.threatLevel || 1),
                message: this.getAlertMessage(event),
                eventId: event.timestamp,
                type: event.type
            };

            this.alerts.unshift(alert);

            // Keep only recent alerts (last 50)
            if (this.alerts.length > 50) {
                this.alerts = this.alerts.slice(0, 50);
            }

            // Show alert notification
            this.showAlertNotification(alert);

            console.warn('🚨 Security alert created:', alert.message);
        } catch (error) {
            console.error('❌ Alert creation failed:', error);
        }
    }

    /**
     * Get alert message
     * @param {Object} event - Security event
     * @returns {string} Alert message
     */
    getAlertMessage(event) {
        switch (event.type) {
            case 'suspicious_activity_detected':
                return `High threat activity detected: ${event.patterns?.length || 0} patterns`;
            case 'rate_limit_exceeded':
                return `Rate limit exceeded: ${event.endpoint || 'unknown endpoint'}`;
            case 'xss_attempt':
                return 'XSS attack attempt blocked';
            case 'frame_embedding_attempt':
                return 'Frame embedding attempt detected';
            default:
                return `Security event: ${event.type}`;
        }
    }

    /**
     * Get threat level name
     * @param {number} level - Threat level
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

    /**
     * Show alert notification
     * @param {Object} alert - Alert object
     */
    showAlertNotification(alert) {
        try {
            // Create notification element
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${this.getAlertColor(alert.level)};
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 10001;
                max-width: 300px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                border-left: 4px solid ${this.getThreatLevelColor(alert.level)};
            `;
            
            notification.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 5px;">🚨 Security Alert</div>
                <div style="font-size: 12px;">${alert.message}</div>
                <div style="font-size: 10px; margin-top: 5px; opacity: 0.8;">${alert.timestamp}</div>
            `;
            
            document.body.appendChild(notification);
            
            // Remove after 8 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 8000);
        } catch (error) {
            console.error('❌ Alert notification failed:', error);
        }
    }

    /**
     * Check alert thresholds
     */
    checkAlertThresholds() {
        try {
            const recentAlerts = this.alerts.filter(a => 
                new Date(a.timestamp) > new Date(Date.now() - 60 * 60 * 1000)
            );

            const alertCounts = {
                CRITICAL: recentAlerts.filter(a => a.level === 'CRITICAL').length,
                HIGH: recentAlerts.filter(a => a.level === 'HIGH').length,
                MEDIUM: recentAlerts.filter(a => a.level === 'MEDIUM').length,
                LOW: recentAlerts.filter(a => a.level === 'LOW').length
            };

            // Check if thresholds exceeded
            Object.entries(alertCounts).forEach(([level, count]) => {
                const threshold = this.alertThresholds[level.toLowerCase()];
                if (count >= threshold) {
                    this.createThresholdAlert(level, count, threshold);
                }
            });
        } catch (error) {
            console.error('❌ Threshold check failed:', error);
        }
    }

    /**
     * Create threshold alert
     * @param {string} level - Alert level
     * @param {number} count - Alert count
     * @param {number} threshold - Threshold limit
     */
    createThresholdAlert(level, count, threshold) {
        const alert = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            level: level,
            message: `Alert threshold exceeded: ${count} ${level} alerts in the last hour (limit: ${threshold})`,
            type: 'threshold_exceeded'
        };

        this.alerts.unshift(alert);
        console.warn('🚨 Threshold alert created:', alert.message);
    }

    /**
     * Get security monitoring statistics
     * @returns {Object} Statistics object
     */
    getStatistics() {
        try {
            return {
                metrics: this.metrics,
                alerts: {
                    total: this.alerts.length,
                    recent: this.alerts.filter(a => 
                        new Date(a.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                    ).length,
                    byLevel: this.alerts.reduce((acc, alert) => {
                        acc[alert.level] = (acc[alert.level] || 0) + 1;
                        return acc;
                    }, {})
                },
                timeline: this.threatTimeline,
                monitoring: {
                    enabled: this.monitoringEnabled,
                    lastUpdate: this.metrics.lastUpdate
                }
            };
        } catch (error) {
            console.error('❌ Statistics retrieval failed:', error);
            return { error: 'Statistics unavailable' };
        }
    }

    /**
     * Stop monitoring
     */
    stopMonitoring() {
        try {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }

            if (this.dashboardElement && this.dashboardElement.parentNode) {
                this.dashboardElement.parentNode.removeChild(this.dashboardElement);
                this.dashboardElement = null;
            }

            console.log('🛑 Security monitoring stopped');
        } catch (error) {
            console.error('❌ Monitoring stop failed:', error);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityMonitor;
} else {
    window.SecurityMonitor = SecurityMonitor;
} 