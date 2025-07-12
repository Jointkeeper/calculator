/**
 * Security Initializer Module
 * Отвечает за инициализацию всех компонентов безопасности
 */

import CSPConfig from '../security/CSPConfig.js';
import SecurityHeaders from '../security/SecurityHeaders.js';
import ThreatDetector from '../security/ThreatDetector.js';
import SecurityMonitor from '../security/SecurityMonitor.js';

export class SecurityInitializer {
  constructor(app) {
    this.app = app;
  }

  /**
   * Инициализация Advanced Security Features
   */
  async initialize() {
    try {
      console.log('🔒 Инициализация Advanced Security Features...');
      
      // Initialize CSP Configuration
      this.app.cspConfig = new CSPConfig();
      this.app.cspConfig.applyCSPToDocument(document);
      
      // Initialize Security Headers
      this.app.securityHeaders = new SecurityHeaders();
      this.app.securityHeaders.setCSPConfig(this.app.cspConfig);
      this.app.securityHeaders.applyToDocument(document);
      
      // Initialize Threat Detector
      this.app.threatDetector = new ThreatDetector();
      this.app.threatDetector.initialize();
      
      // Initialize Security Monitor
      this.app.securityMonitor = new SecurityMonitor();
      this.app.securityMonitor.initialize();
      
      // Setup global security monitoring
      this.setupGlobalSecurityMonitoring();
      
      console.log('✅ Advanced Security Features инициализированы');
      
    } catch (error) {
      console.error('SecurityInitializer: Ошибка инициализации безопасности:', error);
      throw error;
    }
  }

  /**
   * Настройка глобального мониторинга безопасности
   * @private
   */
  setupGlobalSecurityMonitoring() {
    // Мониторинг отправки форм
    document.addEventListener('submit', (event) => {
      this.monitorFormSubmission(event);
    });

    // Мониторинг активности ввода
    document.addEventListener('input', (event) => {
      this.monitorInputActivity(event);
    });

    // Мониторинг навигации
    document.addEventListener('click', (event) => {
      this.monitorNavigation(event);
    });

    // Мониторинг производительности взаимодействий
    document.addEventListener('click', (event) => {
      this.monitorInteractionPerformance(event);
    });
  }

  /**
   * Мониторинг отправки форм
   * @private
   */
  monitorFormSubmission(event) {
    try {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      
      // Проверка на подозрительную активность
      const threatLevel = this.app.threatDetector.analyzeFormSubmission(formDataObj);
      
      if (threatLevel > 0.7) {
        console.warn('🚨 Высокий уровень угрозы при отправке формы:', threatLevel);
        this.app.securityMonitor.logThreat('form_submission', {
          threatLevel,
          formData: formDataObj,
          timestamp: new Date().toISOString()
        });
      }
      
      // Отслеживание в аналитике
      if (this.app.analytics) {
        this.app.analytics.trackEvent('form_submission', {
          form_id: event.target.id || 'unknown',
          threat_level: threatLevel
        });
      }
      
    } catch (error) {
      console.error('SecurityInitializer: Ошибка мониторинга формы:', error);
    }
  }

  /**
   * Мониторинг активности ввода
   * @private
   */
  monitorInputActivity(event) {
    try {
      const input = event.target;
      const value = input.value;
      
      // Проверка на подозрительные паттерны ввода
      const threatLevel = this.app.threatDetector.analyzeInputPattern(value);
      
      if (threatLevel > 0.8) {
        console.warn('🚨 Подозрительный паттерн ввода:', threatLevel);
        this.app.securityMonitor.logThreat('input_pattern', {
          threatLevel,
          inputType: input.type,
          value: value.substring(0, 100), // Ограничиваем длину для безопасности
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      console.error('SecurityInitializer: Ошибка мониторинга ввода:', error);
    }
  }

  /**
   * Мониторинг навигации
   * @private
   */
  monitorNavigation(event) {
    try {
      const target = event.target;
      
      // Проверка на подозрительные ссылки
      if (target.tagName === 'A' && target.href) {
        const threatLevel = this.app.threatDetector.analyzeUrl(target.href);
        
        if (threatLevel > 0.6) {
          console.warn('🚨 Подозрительная ссылка:', target.href);
          this.app.securityMonitor.logThreat('suspicious_link', {
            threatLevel,
            url: target.href,
            timestamp: new Date().toISOString()
          });
        }
      }
      
    } catch (error) {
      console.error('SecurityInitializer: Ошибка мониторинга навигации:', error);
    }
  }

  /**
   * Мониторинг производительности взаимодействий
   * @private
   */
  monitorInteractionPerformance(event) {
    try {
      const startTime = performance.now();
      
      // Отложенная проверка производительности
      setTimeout(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (duration > 100) { // Если взаимодействие заняло больше 100мс
          console.warn('⚠️ Медленное взаимодействие:', duration + 'ms');
          
          if (this.app.analytics) {
            this.app.analytics.trackEvent('slow_interaction', {
              duration,
              element: event.target.tagName,
              eventType: event.type
            });
          }
        }
      }, 0);
      
    } catch (error) {
      console.error('SecurityInitializer: Ошибка мониторинга производительности:', error);
    }
  }

  /**
   * Получение статистики безопасности
   */
  getSecurityStatistics() {
    try {
      const cspStats = this.app.cspConfig ? this.app.cspConfig.getStatistics() : {};
      const headersStats = this.app.securityHeaders ? this.app.securityHeaders.getSecurityStatistics() : {};
      const threatStats = this.app.threatDetector ? this.app.threatDetector.getStatistics() : {};
      const monitorStats = this.app.securityMonitor ? this.app.securityMonitor.getStatistics() : {};
      
      return {
        csp: cspStats,
        headers: headersStats,
        threats: threatStats,
        monitoring: monitorStats,
        overall: {
          threatsDetected: threatStats.totalThreats || 0,
          violationsBlocked: cspStats.totalViolations || 0,
          securityScore: this.calculateSecurityScore()
        }
      };
    } catch (error) {
      console.error('SecurityInitializer: Ошибка получения статистики:', error);
      return { error: 'Statistics unavailable' };
    }
  }

  /**
   * Расчет общего показателя безопасности
   * @private
   */
  calculateSecurityScore() {
    try {
      let score = 100;
      
      // Уменьшаем оценку за обнаруженные угрозы
      const threatStats = this.app.threatDetector ? this.app.threatDetector.getStatistics() : {};
      const threatCount = threatStats.totalThreats || 0;
      score -= Math.min(threatCount * 5, 30); // Максимум -30 за угрозы
      
      // Уменьшаем оценку за CSP нарушения
      const cspStats = this.app.cspConfig ? this.app.cspConfig.getStatistics() : {};
      const violationCount = cspStats.totalViolations || 0;
      score -= Math.min(violationCount * 2, 20); // Максимум -20 за нарушения
      
      return Math.max(score, 0); // Не меньше 0
    } catch (error) {
      console.error('SecurityInitializer: Ошибка расчета безопасности:', error);
      return 0;
    }
  }

  /**
   * Переключение дашборда безопасности
   */
  toggleSecurityDashboard() {
    try {
      const dashboard = document.getElementById('security-dashboard');
      if (dashboard) {
        const isVisible = dashboard.style.display !== 'none';
        dashboard.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
          this.updateSecurityDashboard();
        }
      }
    } catch (error) {
      console.error('SecurityInitializer: Ошибка переключения дашборда:', error);
    }
  }

  /**
   * Обновление дашборда безопасности
   * @private
   */
  updateSecurityDashboard() {
    try {
      const dashboard = document.getElementById('security-dashboard');
      if (!dashboard) return;
      
      const stats = this.getSecurityStatistics();
      
      dashboard.innerHTML = `
        <div class="security-dashboard">
          <h3>🔒 Security Dashboard</h3>
          <div class="security-stats">
            <div class="stat">
              <span class="label">Security Score:</span>
              <span class="value">${stats.overall.securityScore}/100</span>
            </div>
            <div class="stat">
              <span class="label">Threats Detected:</span>
              <span class="value">${stats.overall.threatsDetected}</span>
            </div>
            <div class="stat">
              <span class="label">Violations Blocked:</span>
              <span class="value">${stats.overall.violationsBlocked}</span>
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      console.error('SecurityInitializer: Ошибка обновления дашборда:', error);
    }
  }
} 