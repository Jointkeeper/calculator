/**
 * Privacy-First Analytics Service для калькулятора экономии Steamphony
 * GDPR-compliant GA4 интеграция с event queuing и consent management
 * 
 * @class Analytics
 * @author Steamphony Digital Agency
 * @version 2.0.0
 */

import { SecurityLayer } from '../security/index.js';
import { DEFAULT_CONFIG, validateConfig, isBrowserSupported, generateSessionId } from './analytics/AnalyticsConfig.js';
import { AnalyticsEvents } from './analytics/AnalyticsEvents.js';
import { AnalyticsGA4 } from './analytics/AnalyticsGA4.js';

/**
 * Privacy-First Analytics Service
 * Обеспечивает GDPR-compliant отслеживание событий калькулятора
 */
class Analytics {
  /**
   * Создает экземпляр Analytics
   * 
   * @param {Object} config - Конфигурация analytics
   */
  constructor(config = {}) {
    // Основные свойства
    this.isInitialized = false;
    this.hasConsent = false;
    this.isGA4Loaded = false;
    this.config = validateConfig({ ...DEFAULT_CONFIG, ...config });
    
    // Очередь событий для отправки после получения согласия
    this.eventQueue = [];
    
    // Метрики сессии
    this.sessionStartTime = Date.now();
    this.sessionId = generateSessionId();
    this.pageLoadTime = null;
    
    // Счетчики событий
    this.eventCounts = {
      calculator_started: 0,
      step_completed: 0,
      industry_selected: 0,
      calculation_completed: 0,
      lead_generated: 0
    };
    
    // Подключенные компоненты
    this.connectedComponents = {
      progressBar: null,
      industrySelector: null,
      calculator: null
    };
    
    // Модули
    this.events = new AnalyticsEvents(this);
    this.ga4 = new AnalyticsGA4(this);
    
    // Security layer
    this.securityLayer = SecurityLayer;
    
    // Инициализация
    this.init();
  }

  /**
   * Инициализация analytics сервиса
   * @private
   */
  async init() {
    try {
      this.log('Инициализация Analytics сервиса...');
      
      // Проверка browser support
      if (!isBrowserSupported()) {
        throw new Error('Browser не поддерживает необходимые API');
      }
      
      // Проверка существующего согласия
      await this.ga4.checkCookieConsent();
      
      // Настройка глобальных обработчиков
      this.setupGlobalHandlers();
      
      // Отметка времени загрузки страницы
      this.pageLoadTime = Date.now() - this.sessionStartTime;
      
      this.isInitialized = true;
      
      this.log('Analytics сервис инициализирован успешно');
      
      // Отправка события готовности
      this.dispatchEvent('analyticsReady', {
        hasConsent: this.hasConsent,
        isGA4Loaded: this.isGA4Loaded,
        queuedEvents: this.eventQueue.length
      });
      
    } catch (error) {
      console.error('Ошибка инициализации Analytics:', error);
      this.handleError('INIT_ERROR', error);
    }
  }

  /**
   * Настройка глобальных обработчиков событий
   * @private
   */
  setupGlobalHandlers() {
    // Обработка закрытия страницы
    window.addEventListener('beforeunload', () => {
      this.flushEventQueue();
    });
    
    // Обработка видимости страницы
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushEventQueue();
      }
    });
  }

  /**
   * Отслеживание события
   * @param {string} eventName - Название события
   * @param {Object} params - Параметры события
   * @param {Object} options - Опции
   */
  trackEvent(eventName, params = {}, options = {}) {
    this.events.trackEvent(eventName, params, options);
  }

  /**
   * Отслеживание шага калькулятора
   * @param {string} step - Шаг калькулятора
   * @param {Object} data - Данные шага
   */
  trackCalculatorStep(step, data = {}) {
    this.events.trackCalculatorStep(step, data);
  }

  /**
   * Отслеживание выбора отрасли
   * @param {string} industry - Выбранная отрасль
   * @param {Object} industryData - Данные отрасли
   */
  trackIndustrySelection(industry, industryData = {}) {
    this.events.trackIndustrySelection(industry, industryData);
  }

  /**
   * Отслеживание завершения расчета
   * @param {Object} results - Результаты расчета
   */
  trackCalculationCompleted(results = {}) {
    this.events.trackCalculationCompleted(results);
  }

  /**
   * Отслеживание генерации лида
   * @param {Object} leadData - Данные лида
   */
  trackLeadGenerated(leadData = {}) {
    this.events.trackLeadGenerated(leadData);
  }

  /**
   * Отслеживание ошибки
   * @param {string} errorType - Тип ошибки
   * @param {string} errorMessage - Сообщение об ошибке
   */
  trackError(errorType, errorMessage) {
    this.events.trackError(errorType, errorMessage);
  }

  /**
   * Обработка очереди событий
   */
  async processEventQueue() {
    if (!this.hasConsent || this.eventQueue.length === 0) {
      return;
    }
    
    const eventsToProcess = [...this.eventQueue];
    this.eventQueue = [];
    
    for (const event of eventsToProcess) {
      try {
        await this.events.sendGA4Event(event.event_name, event);
      } catch (error) {
        this.handleError('QUEUE_PROCESS_ERROR', error, { event });
      }
    }
  }

  /**
   * Очистка очереди событий
   */
  flushEventQueue() {
    if (this.eventQueue.length > 0) {
      this.processEventQueue();
    }
  }

  /**
   * Подключение к ProgressBar
   * @param {Object} progressBarInstance - Экземпляр ProgressBar
   */
  connectToProgressBar(progressBarInstance) {
    this.connectedComponents.progressBar = progressBarInstance;
    
    if (progressBarInstance && typeof progressBarInstance.addEventListener === 'function') {
      progressBarInstance.addEventListener('stepChanged', (event) => {
        this.trackCalculatorStep(event.detail.step, event.detail);
      });
    }
  }

  /**
   * Подключение к IndustrySelector
   * @param {Object} industrySelectorInstance - Экземпляр IndustrySelector
   */
  connectToIndustrySelector(industrySelectorInstance) {
    this.connectedComponents.industrySelector = industrySelectorInstance;
    
    if (industrySelectorInstance && typeof industrySelectorInstance.addEventListener === 'function') {
      industrySelectorInstance.addEventListener('industrySelected', (event) => {
        this.trackIndustrySelection(event.detail.industry, event.detail);
      });
    }
  }

  /**
   * Подключение к Calculator
   * @param {Object} calculatorInstance - Экземпляр Calculator
   */
  connectToCalculator(calculatorInstance) {
    this.connectedComponents.calculator = calculatorInstance;
    
    if (calculatorInstance && typeof calculatorInstance.addEventListener === 'function') {
      calculatorInstance.addEventListener('calculationCompleted', (event) => {
        this.trackCalculationCompleted(event.detail);
      });
      
      calculatorInstance.addEventListener('leadGenerated', (event) => {
        this.trackLeadGenerated(event.detail);
      });
    }
  }

  /**
   * Обработка ошибок
   * @param {string} errorCode - Код ошибки
   * @param {Error} error - Объект ошибки
   * @param {Object} context - Контекст ошибки
   */
  handleError(errorCode, error, context = {}) {
    const errorInfo = {
      code: errorCode,
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      ...context
    };
    
    console.error('Analytics Error:', errorInfo);
    
    // Отслеживание ошибки
    this.trackError(errorCode, error.message);
    
    // Уведомление компонентов
    this.dispatchEvent('analyticsError', errorInfo);
  }

  /**
   * Отправка события
   * @param {string} eventName - Название события
   * @param {Object} detail - Детали события
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(`analytics:${eventName}`, {
      detail: {
        timestamp: Date.now(),
        sessionId: this.sessionId,
        ...detail
      }
    });
    
    document.dispatchEvent(event);
  }

  /**
   * Логирование
   * @param {string} message - Сообщение
   * @param {*} data - Данные
   */
  log(message, data = null) {
    if (this.config.debugMode) {
      console.log(`[Analytics] ${message}`, data || '');
    }
  }

  /**
   * Получение статистики
   * @returns {Object} Статистика analytics
   */
  getAnalyticsStats() {
    return {
      isInitialized: this.isInitialized,
      hasConsent: this.hasConsent,
      isGA4Loaded: this.isGA4Loaded,
      sessionId: this.sessionId,
      sessionDuration: Date.now() - this.sessionStartTime,
      pageLoadTime: this.pageLoadTime,
      eventCounts: { ...this.eventCounts },
      queuedEvents: this.eventQueue.length,
      connectedComponents: Object.keys(this.connectedComponents).filter(
        key => this.connectedComponents[key] !== null
      )
    };
  }

  /**
   * Установка режима отладки
   * @param {boolean} enabled - Включить/выключить отладку
   */
  setDebugMode(enabled) {
    this.config.debugMode = enabled;
    this.log(`Режим отладки ${enabled ? 'включен' : 'выключен'}`);
  }

  /**
   * Установка отказа от отслеживания
   * @param {boolean} optOut - Отказаться от отслеживания
   */
  setTrackingOptOut(optOut) {
    this.config.trackingOptOut = optOut;
    this.log(`Отказ от отслеживания ${optOut ? 'включен' : 'выключен'}`);
  }

  /**
   * Уничтожение экземпляра
   */
  destroy() {
    try {
      this.flushEventQueue();
      
      // Очистка обработчиков
      this.connectedComponents = {
        progressBar: null,
        industrySelector: null,
        calculator: null
      };
      
      this.isInitialized = false;
      this.log('Analytics сервис уничтожен');
      
    } catch (error) {
      console.error('Ошибка при уничтожении Analytics:', error);
    }
  }
}

export default Analytics; 