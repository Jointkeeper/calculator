/**
 * Обработка событий Analytics
 * @module AnalyticsEvents
 */

/**
 * Класс для обработки событий Analytics
 */
export class AnalyticsEvents {
  constructor(analytics) {
    this.analytics = analytics;
    this.eventHandlers = new Map();
  }

  /**
   * Отслеживание события калькулятора
   * @param {string} eventName - Название события
   * @param {Object} params - Параметры события
   * @param {Object} options - Опции
   */
  trackEvent(eventName, params = {}, options = {}) {
    try {
      // Санитизация параметров
      const sanitizedParams = this.sanitizeEventParams(params);
      
      // Добавление метаданных
      const eventData = {
        event_name: eventName,
        timestamp: Date.now(),
        session_id: this.analytics.sessionId,
        page_load_time: this.analytics.pageLoadTime,
        ...sanitizedParams
      };
      
      // Проверка согласия
      if (!this.analytics.hasConsent) {
        this.addToEventQueue(eventData);
        return;
      }
      
      // Отправка события
      this.sendGA4Event(eventName, eventData);
      
      // Обновление счетчиков
      this.updateEventCounts(eventName);
      
      this.analytics.log(`Событие отслежено: ${eventName}`, eventData);
      
    } catch (error) {
      this.analytics.handleError('TRACK_EVENT_ERROR', error, { eventName, params });
    }
  }

  /**
   * Отслеживание шага калькулятора
   * @param {string} step - Шаг калькулятора
   * @param {Object} data - Данные шага
   */
  trackCalculatorStep(step, data = {}) {
    const stepName = this.getStepName(step);
    this.trackEvent('calculator_step_completed', {
      step_name: stepName,
      step_number: step,
      ...data
    });
  }

  /**
   * Отслеживание выбора отрасли
   * @param {string} industry - Выбранная отрасль
   * @param {Object} industryData - Данные отрасли
   */
  trackIndustrySelection(industry, industryData = {}) {
    this.trackEvent('industry_selected', {
      industry_name: industry,
      industry_category: industryData.category || 'unknown',
      ...industryData
    });
  }

  /**
   * Отслеживание завершения расчета
   * @param {Object} results - Результаты расчета
   */
  trackCalculationCompleted(results = {}) {
    this.trackEvent('calculation_completed', {
      total_savings: results.totalSavings || 0,
      monthly_savings: results.monthlySavings || 0,
      annual_savings: results.annualSavings || 0,
      tools_count: results.toolsCount || 0,
      ...results
    });
  }

  /**
   * Отслеживание генерации лида
   * @param {Object} leadData - Данные лида
   */
  trackLeadGenerated(leadData = {}) {
    this.trackEvent('lead_generated', {
      lead_source: 'calculator',
      lead_type: 'budget_savings',
      ...leadData
    });
  }

  /**
   * Отслеживание ошибки
   * @param {string} errorType - Тип ошибки
   * @param {string} errorMessage - Сообщение об ошибке
   */
  trackError(errorType, errorMessage) {
    this.trackEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      timestamp: Date.now()
    });
  }

  /**
   * Санитизация параметров события
   * @private
   * @param {Object} params - Параметры для санитизации
   * @returns {Object} Санитизированные параметры
   */
  sanitizeEventParams(params) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(params)) {
      // Удаление PII данных
      if (this.isPII(key)) {
        sanitized[key] = this.hashString(String(value));
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  /**
   * Проверка на PII данные
   * @private
   * @param {string} key - Ключ для проверки
   * @returns {boolean} Является ли PII
   */
  isPII(key) {
    const piiKeys = ['email', 'phone', 'name', 'address', 'ip'];
    return piiKeys.some(piiKey => key.toLowerCase().includes(piiKey));
  }

  /**
   * Хеширование строки
   * @private
   * @param {string} str - Строка для хеширования
   * @returns {string} Хеш строки
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return 'hash_' + Math.abs(hash).toString(36);
  }

  /**
   * Добавление события в очередь
   * @private
   * @param {Object} event - Событие для добавления
   */
  addToEventQueue(event) {
    if (this.analytics.eventQueue.length >= this.analytics.config.eventQueueLimit) {
      this.analytics.eventQueue.shift(); // Удаляем самое старое событие
    }
    this.analytics.eventQueue.push(event);
  }

  /**
   * Отправка события в GA4
   * @private
   * @param {string} eventName - Название события
   * @param {Object} params - Параметры события
   */
  async sendGA4Event(eventName, params) {
    if (!this.analytics.isGA4Loaded || typeof gtag === 'undefined') {
      this.addToEventQueue({ event_name: eventName, ...params });
      return;
    }
    
    try {
      gtag('event', eventName, params);
    } catch (error) {
      this.analytics.handleError('GA4_SEND_ERROR', error, { eventName, params });
    }
  }

  /**
   * Обновление счетчиков событий
   * @private
   * @param {string} eventName - Название события
   */
  updateEventCounts(eventName) {
    if (this.analytics.eventCounts[eventName] !== undefined) {
      this.analytics.eventCounts[eventName]++;
    }
  }

  /**
   * Получение названия шага
   * @private
   * @param {string} step - Номер шага
   * @returns {string} Название шага
   */
  getStepName(step) {
    const stepNames = {
      '1': 'industry_selection',
      '2': 'business_size',
      '3': 'marketing_budget',
      '4': 'marketing_team',
      '5': 'marketing_tools',
      '6': 'contact_form'
    };
    return stepNames[step] || `step_${step}`;
  }
} 