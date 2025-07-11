/**
 * Security Monitoring Dashboard
 * Real-time security metrics and threat assessment for production deployment
 * Provides comprehensive security visibility and alert management
 */

import { SecurityDashboard } from './monitoring/SecurityDashboard.js';
import { SecurityMetrics } from './monitoring/SecurityMetrics.js';

class SecurityMonitor {
    constructor() {
        this.metrics = new SecurityMetrics();
        this.dashboard = new SecurityDashboard();
        
        this.alerts = [];
        this.threatTimeline = [];
        this.monitoringEnabled = true;
        this.updateInterval = null;
    }

    /**
     * Initialize security monitoring
     * @param {Document} document - Document object
     */
    initialize(document) {
        try {
            this.dashboard.createDashboard(document);
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
        this.metrics.updateMetrics();
        this.threatTimeline = this.metrics.updateThreatTimeline(
            JSON.parse(localStorage.getItem('threat_detection_events') || '[]')
        );
    }

    /**
     * Update dashboard
     */
    updateDashboard() {
        const currentMetrics = this.metrics.getMetrics();
        this.dashboard.update(currentMetrics, this.alerts, this.threatTimeline);
    }

    /**
     * Toggle dashboard visibility
     */
    toggleDashboard() {
        return this.dashboard.toggle();
    }

    /**
     * Setup alert system
     */
    setupAlertSystem() {
        try {
            // Check for new alerts every 10 seconds
            setInterval(() => {
                this.checkForNewAlerts();
            }, 10000);

            console.log('🚨 Alert system initialized');
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
                    const alert = this.createAlert(event);
                    this.alerts.push(alert);
                    this.showAlertNotification(alert);
                }
            });
            
            // Keep only recent alerts (last 50)
            this.alerts = this.alerts.slice(-50);
            
        } catch (error) {
            console.error('❌ Alert check failed:', error);
        }
    }

    /**
     * Get recent security events
     * @returns {Array} Recent events
     */
    getRecentSecurityEvents() {
        try {
            const events = JSON.parse(localStorage.getItem('security_events') || '[]');
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            return events.filter(e => new Date(e.timestamp) > oneHourAgo);
        } catch (error) {
            return [];
        }
    }

    /**
     * Check if alert should be created
     * @param {Object} event - Security event
     * @returns {boolean} Should create alert
     */
    shouldCreateAlert(event) {
        // Don't create duplicate alerts
        const existingAlert = this.alerts.find(a => 
            a.eventId === event.id && 
            new Date(a.timestamp) > new Date(Date.now() - 5 * 60 * 1000) // 5 minutes
        );
        
        if (existingAlert) return false;
        
        // Create alert for high threat levels
        return event.threatLevel >= 3;
    }

    /**
     * Create alert
     * @param {Object} event - Security event
     * @returns {Object} Alert object
     */
    createAlert(event) {
        const alert = {
            id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            eventId: event.id,
            level: this.getThreatLevelName(event.threatLevel),
            message: this.getAlertMessage(event),
            timestamp: new Date().toISOString(),
            acknowledged: false
        };
        
        console.warn(`🚨 Security Alert [${alert.level}]: ${alert.message}`);
        return alert;
    }

    /**
     * Get alert message
     * @param {Object} event - Security event
     * @returns {string} Alert message
     */
    getAlertMessage(event) {
        const messages = {
            'xss_attempt': 'XSS attack attempt detected',
            'sql_injection': 'SQL injection attempt detected',
            'csrf_attempt': 'CSRF attack attempt detected',
            'rate_limit_violation': 'Rate limit violation detected',
            'suspicious_activity': 'Suspicious activity detected',
            'malicious_script': 'Malicious script detected',
            'data_exfiltration': 'Data exfiltration attempt detected'
        };
        
        return messages[event.type] || `Security threat detected: ${event.type}`;
    }

    /**
     * Get threat level name
     * @param {number} level - Threat level
     * @returns {string} Threat level name
     */
    getThreatLevelName(level) {
        const levels = {
            1: 'low',
            2: 'medium',
            3: 'high',
            4: 'critical'
        };
        return levels[level] || 'low';
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
                background: #ff4444;
                color: white;
                padding: 15px;
                border-radius: 5px;
                z-index: 10000;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: slideIn 0.3s ease-out;
            `;
            
            notification.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 5px;">🚨 Security Alert</div>
                <div style="font-size: 12px; margin-bottom: 5px;">${alert.level.toUpperCase()}</div>
                <div style="font-size: 11px;">${alert.message}</div>
                <button onclick="this.parentElement.remove()" style="position: absolute; top: 5px; right: 5px; background: none; border: none; color: white; cursor: pointer;">×</button>
            `;
            
            document.body.appendChild(notification);
            
            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 10000);
            
        } catch (error) {
            console.error('❌ Notification display failed:', error);
        }
    }

    /**
     * Check alert thresholds
     */
    checkAlertThresholds() {
        try {
            const thresholds = this.metrics.getThresholds();
            const recentAlerts = this.alerts.filter(a => 
                new Date(a.timestamp) > new Date(Date.now() - 60 * 60 * 1000)
            );
            
            Object.entries(thresholds).forEach(([level, threshold]) => {
                const levelAlerts = recentAlerts.filter(a => a.level === level);
                
                if (levelAlerts.length >= threshold) {
                    this.createThresholdAlert(level, levelAlerts.length, threshold);
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
     * @param {number} threshold - Threshold value
     */
    createThresholdAlert(level, count, threshold) {
        const alert = {
            id: `threshold_${Date.now()}`,
            level: level,
            message: `Alert threshold exceeded: ${count} ${level} alerts in the last hour (threshold: ${threshold})`,
            timestamp: new Date().toISOString(),
            acknowledged: false
        };
        
        this.alerts.push(alert);
        this.showAlertNotification(alert);
    }

    /**
     * Get statistics
     * @returns {Object} Security statistics
     */
    getStatistics() {
        return this.metrics.getStatistics();
    }

    /**
     * Stop monitoring
     */
    stopMonitoring() {
        this.monitoringEnabled = false;
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        this.dashboard.destroy();
        console.log('🛑 Security monitoring stopped');
    }
}

export default SecurityMonitor; 