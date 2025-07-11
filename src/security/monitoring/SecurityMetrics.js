/**
 * Метрики безопасности
 * @module SecurityMetrics
 */

/**
 * Класс для работы с метриками безопасности
 */
export class SecurityMetrics {
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

    this.alertThresholds = {
      critical: 5,    // Critical alerts per hour
      high: 15,       // High alerts per hour
      medium: 30,     // Medium alerts per hour
      low: 50         // Low alerts per hour
    };
  }

  /**
   * Обновление метрик безопасности
   */
  updateMetrics() {
    try {
      // Получение событий безопасности
      const securityEvents = JSON.parse(localStorage.getItem('security_events') || '[]');
      const threatEvents = JSON.parse(localStorage.getItem('threat_detection_events') || '[]');
      const cspViolations = JSON.parse(localStorage.getItem('csp_violations') || '[]');
      const blockedRequests = JSON.parse(localStorage.getItem('blocked_requests') || '[]');

      // Расчет недавних событий (последний час)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentSecurityEvents = securityEvents.filter(e => new Date(e.timestamp) > oneHourAgo);
      const recentThreatEvents = threatEvents.filter(e => new Date(e.timestamp) > oneHourAgo);

      // Обновление метрик
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

    } catch (error) {
      console.error('❌ Metrics update failed:', error);
    }
  }

  /**
   * Расчет общего уровня угрозы
   * @param {Array} events - События безопасности
   * @returns {string} Уровень угрозы
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
   * Подсчет активных угроз
   * @returns {number} Количество активных угроз
   */
  countActiveThreats() {
    try {
      const threatEvents = JSON.parse(localStorage.getItem('threat_detection_events') || '[]');
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      return threatEvents.filter(e => 
        new Date(e.timestamp) > oneHourAgo && 
        e.threatLevel >= 3
      ).length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Подсчет нарушений rate limit
   * @param {Array} events - События
   * @returns {number} Количество нарушений
   */
  countRateLimitViolations(events) {
    return events.filter(e => e.type === 'rate_limit_violation').length;
  }

  /**
   * Обновление временной шкалы угроз
   * @param {Array} events - События угроз
   * @returns {Array} Временная шкала
   */
  updateThreatTimeline(events) {
    return events
      .filter(e => e.threatLevel >= 2)
      .map(event => ({
        timestamp: new Date(event.timestamp).toLocaleTimeString(),
        description: this.getEventDescription(event),
        threatLevel: event.threatLevel
      }))
      .slice(-10); // Последние 10 событий
  }

  /**
   * Получение описания события
   * @param {Object} event - Событие
   * @returns {string} Описание
   */
  getEventDescription(event) {
    const descriptions = {
      'xss_attempt': 'XSS Attack Attempt',
      'sql_injection': 'SQL Injection Attempt',
      'csrf_attempt': 'CSRF Attack Attempt',
      'rate_limit_violation': 'Rate Limit Violation',
      'suspicious_activity': 'Suspicious Activity',
      'malicious_script': 'Malicious Script Detection',
      'data_exfiltration': 'Data Exfiltration Attempt'
    };
    
    return descriptions[event.type] || event.type;
  }

  /**
   * Получение метрик
   * @returns {Object} Текущие метрики
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Получение пороговых значений
   * @returns {Object} Пороговые значения
   */
  getThresholds() {
    return { ...this.alertThresholds };
  }

  /**
   * Установка пороговых значений
   * @param {Object} thresholds - Новые пороговые значения
   */
  setThresholds(thresholds) {
    this.alertThresholds = { ...this.alertThresholds, ...thresholds };
  }

  /**
   * Получение статистики
   * @returns {Object} Статистика
   */
  getStatistics() {
    try {
      const securityEvents = JSON.parse(localStorage.getItem('security_events') || '[]');
      const threatEvents = JSON.parse(localStorage.getItem('threat_detection_events') || '[]');
      
      return {
        totalSecurityEvents: securityEvents.length,
        totalThreatEvents: threatEvents.length,
        averageThreatLevel: this.calculateAverageThreatLevel(threatEvents),
        mostCommonThreatType: this.getMostCommonThreatType(threatEvents),
        last24Hours: this.getLast24HoursStats(threatEvents)
      };
    } catch (error) {
      return {
        totalSecurityEvents: 0,
        totalThreatEvents: 0,
        averageThreatLevel: 'LOW',
        mostCommonThreatType: 'none',
        last24Hours: 0
      };
    }
  }

  /**
   * Расчет среднего уровня угрозы
   * @param {Array} events - События
   * @returns {string} Средний уровень
   */
  calculateAverageThreatLevel(events) {
    if (events.length === 0) return 'LOW';
    
    const totalLevel = events.reduce((sum, e) => sum + (e.threatLevel || 1), 0);
    const average = totalLevel / events.length;
    
    if (average >= 3.5) return 'CRITICAL';
    if (average >= 2.5) return 'HIGH';
    if (average >= 1.5) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Получение наиболее частого типа угрозы
   * @param {Array} events - События
   * @returns {string} Тип угрозы
   */
  getMostCommonThreatType(events) {
    if (events.length === 0) return 'none';
    
    const typeCount = {};
    events.forEach(e => {
      typeCount[e.type] = (typeCount[e.type] || 0) + 1;
    });
    
    return Object.keys(typeCount).reduce((a, b) => 
      typeCount[a] > typeCount[b] ? a : b
    );
  }

  /**
   * Получение статистики за последние 24 часа
   * @param {Array} events - События
   * @returns {number} Количество событий
   */
  getLast24HoursStats(events) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return events.filter(e => new Date(e.timestamp) > oneDayAgo).length;
  }
} 