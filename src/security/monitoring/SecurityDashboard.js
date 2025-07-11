/**
 * Дашборд безопасности
 * @module SecurityDashboard
 */

/**
 * Класс для управления дашбордом безопасности
 */
export class SecurityDashboard {
  constructor() {
    this.element = null;
  }

  /**
   * Создание дашборда
   * @param {Document} document - Объект документа
   */
  createDashboard(document) {
    try {
      // Создание контейнера дашборда
      this.element = document.createElement('div');
      this.element.id = 'security-dashboard';
      this.element.style.cssText = `
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

      // Создание содержимого дашборда
      this.element.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h3 style="margin: 0; color: #00ff00;">🔒 Security Monitor</h3>
          <button id="close-dashboard" style="background: #ff4444; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer;">×</button>
        </div>
        <div id="security-metrics"></div>
        <div id="security-alerts" style="margin-top: 10px;"></div>
        <div id="threat-timeline" style="margin-top: 10px;"></div>
      `;

      // Добавление в документ
      document.body.appendChild(this.element);

      // Настройка кнопки закрытия
      const closeBtn = this.element.querySelector('#close-dashboard');
      closeBtn.addEventListener('click', () => {
        this.element.style.display = 'none';
      });

      // Настройка горячих клавиш (Ctrl+Shift+S)
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
          e.preventDefault();
          this.toggle();
        }
      });

      console.log('📊 Security dashboard created');
      return true;
    } catch (error) {
      console.error('❌ Dashboard setup failed:', error);
      return false;
    }
  }

  /**
   * Переключение видимости дашборда
   */
  toggle() {
    if (this.element) {
      const isVisible = this.element.style.display !== 'none';
      this.element.style.display = isVisible ? 'none' : 'block';
      return !isVisible;
    }
    return false;
  }

  /**
   * Обновление дашборда
   * @param {Object} metrics - Метрики безопасности
   * @param {Array} alerts - Оповещения
   * @param {Array} timeline - Временная шкала угроз
   */
  update(metrics, alerts, timeline) {
    if (!this.element) return;

    // Обновление метрик
    const metricsElement = this.element.querySelector('#security-metrics');
    if (metricsElement) {
      metricsElement.innerHTML = this.renderMetrics(metrics);
    }

    // Обновление оповещений
    const alertsElement = this.element.querySelector('#security-alerts');
    if (alertsElement) {
      alertsElement.innerHTML = this.renderAlerts(alerts);
    }

    // Обновление временной шкалы
    const timelineElement = this.element.querySelector('#threat-timeline');
    if (timelineElement) {
      timelineElement.innerHTML = this.renderTimeline(timeline);
    }
  }

  /**
   * Рендеринг метрик
   * @param {Object} metrics - Метрики
   * @returns {string} HTML метрик
   */
  renderMetrics(metrics) {
    const threatColor = this.getThreatLevelColor(metrics.threatLevel);
    
    return `
      <div style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Security Events:</span>
          <span style="color: #ffaa00;">${metrics.securityEvents}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Threat Level:</span>
          <span style="color: ${threatColor};">${metrics.threatLevel}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Active Threats:</span>
          <span style="color: #ff4444;">${metrics.activeThreats}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Blocked Requests:</span>
          <span style="color: #ffaa00;">${metrics.blockedRequests}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>CSP Violations:</span>
          <span style="color: #ffaa00;">${metrics.cspViolations}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Last Update:</span>
          <span style="color: #888;">${new Date(metrics.lastUpdate).toLocaleTimeString()}</span>
        </div>
      </div>
    `;
  }

  /**
   * Рендеринг оповещений
   * @param {Array} alerts - Оповещения
   * @returns {string} HTML оповещений
   */
  renderAlerts(alerts) {
    if (alerts.length === 0) {
      return '<div style="color: #00ff00;">✅ No active alerts</div>';
    }

    const recentAlerts = alerts.slice(-5); // Последние 5 оповещений
    
    return `
      <div style="margin-bottom: 5px; font-weight: bold;">Recent Alerts:</div>
      ${recentAlerts.map(alert => `
        <div style="margin-bottom: 3px; padding: 3px; background: ${this.getAlertColor(alert.level)}; border-radius: 3px;">
          <div style="font-size: 10px;">${alert.timestamp}</div>
          <div>${alert.message}</div>
        </div>
      `).join('')}
    `;
  }

  /**
   * Рендеринг временной шкалы
   * @param {Array} timeline - Временная шкала
   * @returns {string} HTML временной шкалы
   */
  renderTimeline(timeline) {
    if (timeline.length === 0) {
      return '<div style="color: #00ff00;">✅ No recent threats</div>';
    }

    const recentEvents = timeline.slice(-3); // Последние 3 события
    
    return `
      <div style="margin-bottom: 5px; font-weight: bold;">Recent Threats:</div>
      ${recentEvents.map(event => `
        <div style="margin-bottom: 3px; padding: 3px; background: #333; border-radius: 3px;">
          <div style="font-size: 10px;">${event.timestamp}</div>
          <div>${event.description}</div>
        </div>
      `).join('')}
    `;
  }

  /**
   * Получение цвета уровня угрозы
   * @param {string} level - Уровень угрозы
   * @returns {string} Цвет
   */
  getThreatLevelColor(level) {
    const colors = {
      'LOW': '#00ff00',
      'MEDIUM': '#ffaa00',
      'HIGH': '#ff4444',
      'CRITICAL': '#ff0000'
    };
    return colors[level] || '#ffffff';
  }

  /**
   * Получение цвета оповещения
   * @param {string} level - Уровень оповещения
   * @returns {string} Цвет
   */
  getAlertColor(level) {
    const colors = {
      'low': '#333333',
      'medium': '#ffaa00',
      'high': '#ff4444',
      'critical': '#ff0000'
    };
    return colors[level] || '#333333';
  }

  /**
   * Уничтожение дашборда
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    }
  }
} 