/**
 * Privacy-First Analytics Service для калькулятора экономии Steamphony
 * GDPR-compliant GA4 интеграция с event queuing и consent management
 * 
 * @class Analytics
 * @author Steamphony Digital Agency
 * @version 1.0.0
 */

/**
 * Конфигурация по умолчанию
 * @private
 */
const DEFAULT_CONFIG = {
  measurementId: 'G-PLACEHOLDER', // Заменить на реальный ID
  cookieDomain: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
  consentStorageKey: 'steamphony_analytics_consent',
  eventQueueLimit: 50,
  debugMode: false,
  autoInitialize: false,
  trackingOptOut: false,
  sessionTimeout: 30 * 60 * 1000, // 30 минут
  anonymizeIP: true,
  dataRetention: 14 // месяцев
};

/**
 * Privacy-First Analytics Service
 * Обеспечивает GDPR-compliant отслеживание событий калькулятора
 */
class Analytics {
  /**
   * Создает экземпляр Analytics
   * 
   * @param {Object} config - Конфигурация analytics
   * @param {string} config.measurementId - GA4 Measurement ID
   * @param {string} config.cookieDomain - Домен для cookies
   * @param {string} config.consentStorageKey - Ключ для хранения согласия
   * @param {number} config.eventQueueLimit - Лимит очереди событий
   * @param {boolean} config.debugMode - Режим отладки
   * @param {boolean} config.autoInitialize - Автоматическая инициализация
   * @param {boolean} config.trackingOptOut - Отказ от отслеживания
   * @param {number} config.sessionTimeout - Таймаут сессии (мс)
   * @param {boolean} config.anonymizeIP - Анонимизация IP
   * @param {number} config.dataRetention - Срок хранения данных (месяцы)
   */
  constructor(config = {}) {
    // Основные свойства
    this.isInitialized = false;
    this.hasConsent = false;
    this.isGA4Loaded = false;
    this.config = this.validateConfig({ ...DEFAULT_CONFIG, ...config });
    
    // Очередь событий для отправки после получения согласия
    this.eventQueue = [];
    
    // Метрики сессии
    this.sessionStartTime = Date.now();
    this.sessionId = this.generateSessionId();
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
    
    // Обработчики событий
    this.eventHandlers = new Map();
    
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
      if (!this.isBrowserSupported()) {
        throw new Error('Browser не поддерживает необходимые API');
      }
      
      // Проверка существующего согласия
      await this.checkCookieConsent();
      
      // Настройка глобальных обработчиков
      this.setupGlobalHandlers();
      
      // Отметка времени загрузки страницы
      this.pageLoadTime = Date.now() - this.sessionStartTime;
      
      this.isInitialized = true;
      
      // Автоматическая инициализация если включена
      if (this.config.autoInitialize && this.hasConsent) {
        await this.initializeGA4();
      }
      
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
   * Валидация конфигурации
   * @private
   * @param {Object} config - Конфигурация для валидации
   * @returns {Object} Валидированная конфигурация
   */
  validateConfig(config) {
    const validated = { ...config };
    
    // Валидация measurementId
    if (!validated.measurementId || typeof validated.measurementId !== 'string') {
      console.warn('Analytics: Некорректный measurementId, используется placeholder');
      validated.measurementId = 'G-PLACEHOLDER';
    }
    
    // Валидация числовых значений
    if (typeof validated.eventQueueLimit !== 'number' || validated.eventQueueLimit < 1) {
      validated.eventQueueLimit = 50;
    }
    
    if (typeof validated.sessionTimeout !== 'number' || validated.sessionTimeout < 60000) {
      validated.sessionTimeout = 30 * 60 * 1000;
    }
    
    if (typeof validated.dataRetention !== 'number' || validated.dataRetention < 1) {
      validated.dataRetention = 14;
    }
    
    return validated;
  }

  /**
   * Проверка поддержки браузера
   * @private
   * @returns {boolean} Поддерживается ли браузер
   */
  isBrowserSupported() {
    return (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined' &&
      typeof localStorage !== 'undefined' &&
      typeof fetch !== 'undefined' &&
      typeof Promise !== 'undefined'
    );
  }

  /**
   * Генерация ID сессии
   * @private
   * @returns {string} Уникальный ID сессии
   */
  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
    
    // Обработка ошибок
    window.addEventListener('error', (event) => {
      this.trackError('JS_ERROR', event.error?.message || 'Unknown error');
    });
  }

  /**
   * Инициализация GA4
   * @private
   * @param {string} measurementId - GA4 Measurement ID (опционально)
   * @returns {Promise<boolean>} Успешность инициализации
   */
  async initializeGA4(measurementId = null) {
    if (this.isGA4Loaded) {
      this.log('GA4 уже загружен');
      return true;
    }
    
    if (!this.hasConsent) {
      this.log('Нет согласия для загрузки GA4');
      return false;
    }
    
    try {
      const id = measurementId || this.config.measurementId;
      
      this.log(`Инициализация GA4 с ID: ${id}`);
      
      // Загрузка gtag script
      await this.loadGtagScript();
      
      // Конфигурация GA4
      window.gtag('config', id, {
        anonymize_ip: this.config.anonymizeIP,
        cookie_domain: this.config.cookieDomain,
        cookie_expires: 60 * 60 * 24 * 365, // 1 год
        send_page_view: false, // Отправим вручную
        data_retention: this.config.dataRetention + 'months'
      });
      
      // Отправка первого события
      this.sendGA4Event('session_start', {
        session_id: this.sessionId,
        page_load_time: this.pageLoadTime
      });
      
      this.isGA4Loaded = true;
      this.log('GA4 успешно инициализирован');
      
      // Обработка очереди событий
      await this.processEventQueue();
      
      return true;
      
    } catch (error) {
      console.error('Ошибка инициализации GA4:', error);
      this.handleError('GA4_INIT_ERROR', error);
      return false;
    }
  }

  /**
   * Загрузка gtag script
   * @private
   * @returns {Promise<void>}
   */
  loadGtagScript() {
    return new Promise((resolve, reject) => {
      // Проверка если gtag уже загружен
      if (typeof window.gtag === 'function') {
        resolve();
        return;
      }
      
      // Инициализация dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      
      // Загрузка script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
      
      script.onload = () => {
        this.log('Gtag script загружен успешно');
        resolve();
      };
      
      script.onerror = () => {
        const error = new Error('Не удалось загрузить gtag script');
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * Проверка согласия на использование cookies
   * @public
   * @returns {Promise<boolean>} Есть ли согласие
   */
  async checkCookieConsent() {
    try {
      const consent = localStorage.getItem(this.config.consentStorageKey);
      
      if (consent !== null) {
        this.hasConsent = consent === 'true';
        this.log(`Найдено сохраненное согласие: ${this.hasConsent}`);
        
        if (this.hasConsent) {
          await this.initializeGA4();
        }
      } else {
        this.log('Согласие не найдено');
        this.hasConsent = false;
      }
      
      return this.hasConsent;
      
    } catch (error) {
      console.error('Ошибка проверки согласия:', error);
      this.hasConsent = false;
      return false;
    }
  }

  /**
   * Установка согласия на использование cookies
   * @public
   * @param {boolean} granted - Предоставлено ли согласие
   * @returns {Promise<boolean>} Успешность установки
   */
  async setCookieConsent(granted) {
    try {
      this.log(`Установка согласия: ${granted}`);
      
      // Сохранение в localStorage
      localStorage.setItem(this.config.consentStorageKey, granted.toString());
      
      const wasConsented = this.hasConsent;
      this.hasConsent = granted;
      
      if (granted && !wasConsented) {
        // Согласие получено впервые
        await this.initializeGA4();
        this.trackEvent('consent_granted', {
          method: 'manual',
          timestamp: Date.now()
        });
      } else if (!granted && wasConsented) {
        // Согласие отозвано
        this.clearAnalyticsData();
        this.trackEvent('consent_revoked', {
          method: 'manual',
          timestamp: Date.now()
        });
      }
      
      // Отправка события изменения согласия
      this.dispatchEvent('consentChanged', {
        granted,
        wasConsented,
        eventQueueLength: this.eventQueue.length
      });
      
      return true;
      
    } catch (error) {
      console.error('Ошибка установки согласия:', error);
      this.handleError('CONSENT_ERROR', error);
      return false;
    }
  }

  /**
   * Очистка данных analytics (right to be forgotten)
   * @public
   */
  clearAnalyticsData() {
    try {
      this.log('Очистка данных analytics...');
      
      // Очистка localStorage
      localStorage.removeItem(this.config.consentStorageKey);
      
      // Очистка очереди событий
      this.eventQueue = [];
      
      // Сброс счетчиков
      Object.keys(this.eventCounts).forEach(key => {
        this.eventCounts[key] = 0;
      });
      
      // Отправка команды удаления в GA4 (если загружен)
      if (this.isGA4Loaded && typeof window.gtag === 'function') {
        window.gtag('config', this.config.measurementId, {
          send_page_view: false,
          anonymize_ip: true
        });
      }
      
      this.hasConsent = false;
      this.log('Данные analytics очищены');
      
    } catch (error) {
      console.error('Ошибка очистки данных:', error);
      this.handleError('CLEAR_DATA_ERROR', error);
    }
  }

  /**
   * Отслеживание события с проверкой privacy
   * @public
   * @param {string} eventName - Название события
   * @param {Object} params - Параметры события
   * @param {Object} options - Дополнительные опции
   * @returns {boolean} Успешность отслеживания
   */
  trackEvent(eventName, params = {}, options = {}) {
    try {
      // Валидация параметров
      if (!eventName || typeof eventName !== 'string') {
        throw new Error('Некорректное название события');
      }
      
      // Проверка opt-out
      if (this.config.trackingOptOut) {
        this.log(`Отслеживание отключено для события: ${eventName}`);
        return false;
      }
      
      // Подготовка события
      const event = {
        name: eventName,
        params: this.sanitizeEventParams(params),
        timestamp: Date.now(),
        sessionId: this.sessionId,
        source: 'analytics_service'
      };
      
      // Добавление метаданных
      if (options.category) event.params.event_category = options.category;
      if (options.label) event.params.event_label = options.label;
      if (options.value) event.params.value = options.value;
      
      this.log(`Отслеживание события: ${eventName}`, event.params);
      
      // Обновление счетчика
      if (this.eventCounts.hasOwnProperty(eventName)) {
        this.eventCounts[eventName]++;
      }
      
      if (this.hasConsent && this.isGA4Loaded) {
        // Немедленная отправка
        this.sendGA4Event(event.name, event.params);
      } else {
        // Добавление в очередь
        this.addToEventQueue(event);
      }
      
      // Отправка внутреннего события
      this.dispatchEvent('eventTracked', {
        eventName,
        hasConsent: this.hasConsent,
        queued: !this.hasConsent || !this.isGA4Loaded
      });
      
      return true;
      
    } catch (error) {
      console.error('Ошибка отслеживания события:', error);
      this.handleError('TRACK_EVENT_ERROR', error, { eventName, params });
      return false;
    }
  }

  /**
   * Санитизация параметров события (удаление PII)
   * @private
   * @param {Object} params - Исходные параметры
   * @returns {Object} Санитизированные параметры
   */
  sanitizeEventParams(params) {
    const sanitized = { ...params };
    
    // Список полей с потенциально персональными данными
    const piiFields = ['email', 'phone', 'name', 'address', 'ip', 'user_id'];
    
    piiFields.forEach(field => {
      if (sanitized[field]) {
        // Хэширование или удаление PII
        if (typeof sanitized[field] === 'string') {
          sanitized[field] = this.hashString(sanitized[field]);
        } else {
          delete sanitized[field];
        }
      }
    });
    
    // Ограничение длины строк
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string' && sanitized[key].length > 100) {
        sanitized[key] = sanitized[key].substring(0, 100);
      }
    });
    
    return sanitized;
  }

  /**
   * Простое хэширование строки
   * @private
   * @param {string} str - Строка для хэширования
   * @returns {string} Хэш строки
   */
  hashString(str) {
    let hash = 0;
    if (str.length === 0) return hash.toString();
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
    // Проверка лимита очереди
    if (this.eventQueue.length >= this.config.eventQueueLimit) {
      this.eventQueue.shift(); // Удаление самого старого события
      this.log('Очередь событий переполнена, удалено старое событие');
    }
    
    this.eventQueue.push(event);
    this.log(`Событие добавлено в очередь. Размер очереди: ${this.eventQueue.length}`);
  }

  /**
   * Обработка очереди событий
   * @private
   * @returns {Promise<void>}
   */
  async processEventQueue() {
    if (!this.hasConsent || !this.isGA4Loaded || this.eventQueue.length === 0) {
      return;
    }
    
    this.log(`Обработка очереди событий: ${this.eventQueue.length} событий`);
    
    try {
      const events = [...this.eventQueue];
      this.eventQueue = [];
      
      for (const event of events) {
        await this.sendGA4Event(event.name, event.params);
        
        // Небольшая задержка между событиями
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      this.log('Очередь событий обработана успешно');
      
    } catch (error) {
      console.error('Ошибка обработки очереди событий:', error);
      this.handleError('QUEUE_PROCESSING_ERROR', error);
    }
  }

  /**
   * Отправка события в GA4
   * @private
   * @param {string} eventName - Название события
   * @param {Object} params - Параметры события
   * @returns {Promise<void>}
   */
  async sendGA4Event(eventName, params) {
    if (!this.isGA4Loaded || typeof window.gtag !== 'function') {
      throw new Error('GA4 не загружен');
    }
    
    try {
      window.gtag('event', eventName, {
        ...params,
        send_to: this.config.measurementId
      });
      
      this.log(`Событие отправлено в GA4: ${eventName}`, params);
      
    } catch (error) {
      console.error('Ошибка отправки события в GA4:', error);
      throw error;
    }
  }

  /**
   * Принудительная отправка всех событий из очереди
   * @public
   */
  flushEventQueue() {
    if (this.eventQueue.length > 0) {
      this.log(`Принудительная отправка очереди: ${this.eventQueue.length} событий`);
      this.processEventQueue();
    }
  }

  // =============================================================================
  // СПЕЦИФИЧНЫЕ МЕТОДЫ ДЛЯ КАЛЬКУЛЯТОРА
  // =============================================================================

  /**
   * Отслеживание шага калькулятора
   * @public
   * @param {number} step - Номер шага (1-6)
   * @param {Object} data - Данные шага
   */
  trackCalculatorStep(step, data = {}) {
    this.trackEvent('step_completed', {
      step_number: step,
      step_name: this.getStepName(step),
      ...data
    }, {
      category: 'calculator',
      label: `step_${step}`
    });
  }

  /**
   * Отслеживание выбора отрасли
   * @public
   * @param {string} industry - Ключ отрасли
   * @param {Object} industryData - Данные отрасли
   */
  trackIndustrySelection(industry, industryData = {}) {
    this.trackEvent('industry_selected', {
      industry_key: industry,
      industry_name: industryData.displayName || industry,
      is_popular: industryData.popular || false,
      search_used: industryData.searchUsed || false
    }, {
      category: 'calculator',
      label: industry
    });
  }

  /**
   * Отслеживание завершения расчета
   * @public
   * @param {Object} results - Результаты расчета
   */
  trackCalculationCompleted(results = {}) {
    const sanitizedResults = {
      industry: results.industry?.key || 'unknown',
      business_size: results.businessSize || 'unknown',
      savings_amount: results.savings?.total ? Math.round(results.savings.total) : 0,
      roi_improvement: results.roi?.improvement || 0,
      has_recommendations: !!(results.recommendations?.length),
      calculation_time: results.calculationTime || 0
    };
    
    this.trackEvent('calculation_completed', sanitizedResults, {
      category: 'calculator',
      value: sanitizedResults.savings_amount
    });
  }

  /**
   * Отслеживание генерации лида
   * @public
   * @param {Object} leadData - Данные лида (без PII)
   */
  trackLeadGenerated(leadData = {}) {
    const sanitizedData = {
      industry: leadData.industry || 'unknown',
      business_size: leadData.businessSize || 'unknown',
      marketing_budget: leadData.marketingBudget || 'unknown',
      lead_source: 'calculator',
      has_email: !!leadData.email,
      has_phone: !!leadData.phone
    };
    
    this.trackEvent('lead_generated', sanitizedData, {
      category: 'conversion',
      value: 1
    });
  }

  /**
   * Отслеживание ошибки
   * @public
   * @param {string} errorType - Тип ошибки
   * @param {string} errorMessage - Сообщение об ошибке
   */
  trackError(errorType, errorMessage) {
    this.trackEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage.substring(0, 100), // Ограничение длины
      page_url: window.location.pathname,
      user_agent: navigator.userAgent.substring(0, 100)
    }, {
      category: 'error'
    });
  }

  /**
   * Получение названия шага
   * @private
   * @param {number} step - Номер шага
   * @returns {string} Название шага
   */
  getStepName(step) {
    const stepNames = {
      1: 'industry_selection',
      2: 'business_size',
      3: 'marketing_budget',
      4: 'current_tools',
      5: 'marketer_type',
      6: 'contact_info'
    };
    
    return stepNames[step] || 'unknown_step';
  }

  // =============================================================================
  // ИНТЕГРАЦИЯ С КОМПОНЕНТАМИ
  // =============================================================================

  /**
   * Подключение к ProgressBar компоненту
   * @public
   * @param {Object} progressBarInstance - Экземпляр ProgressBar
   */
  connectToProgressBar(progressBarInstance) {
    if (!progressBarInstance || this.connectedComponents.progressBar) {
      return;
    }
    
    this.log('Подключение к ProgressBar...');
    
    try {
      // Получение контейнера ProgressBar
      const container = progressBarInstance.container;
      
      if (container) {
        // Слушаем события изменения шага
        container.addEventListener('stepChanged', (event) => {
          this.trackCalculatorStep(event.detail.newStep, {
            previous_step: event.detail.previousStep,
            navigation_source: event.detail.source || 'unknown'
          });
        });
        
        // Слушаем клики по шагам
        container.addEventListener('stepClicked', (event) => {
          this.trackEvent('step_navigation', {
            target_step: event.detail.step,
            current_step: progressBarInstance.getCurrentStep(),
            navigation_type: 'click'
          });
        });
        
        this.connectedComponents.progressBar = progressBarInstance;
        this.log('ProgressBar подключен успешно');
      }
      
    } catch (error) {
      console.error('Ошибка подключения ProgressBar:', error);
      this.handleError('PROGRESSBAR_CONNECTION_ERROR', error);
    }
  }

  /**
   * Подключение к IndustrySelector компоненту
   * @public
   * @param {Object} industrySelectorInstance - Экземпляр IndustrySelector
   */
  connectToIndustrySelector(industrySelectorInstance) {
    if (!industrySelectorInstance || this.connectedComponents.industrySelector) {
      return;
    }
    
    this.log('Подключение к IndustrySelector...');
    
    try {
      const container = industrySelectorInstance.container;
      
      if (container) {
        // Слушаем выбор отрасли
        container.addEventListener('industrySelected', (event) => {
          this.trackIndustrySelection(event.detail.industryKey, {
            ...event.detail.industry,
            searchUsed: event.detail.searchUsed || false
          });
        });
        
        // Слушаем подтверждение выбора
        container.addEventListener('industryConfirmed', (event) => {
          this.trackEvent('industry_confirmed', {
            industry_key: event.detail.industryKey,
            custom_value: event.detail.customValue || null
          });
        });
        
        // Слушаем использование поиска
        container.addEventListener('searchUsed', (event) => {
          this.trackEvent('industry_search', {
            search_query: event.detail.query?.substring(0, 50) || '',
            results_count: event.detail.resultsCount || 0
          });
        });
        
        this.connectedComponents.industrySelector = industrySelectorInstance;
        this.log('IndustrySelector подключен успешно');
      }
      
    } catch (error) {
      console.error('Ошибка подключения IndustrySelector:', error);
      this.handleError('INDUSTRYSELECTOR_CONNECTION_ERROR', error);
    }
  }

  /**
   * Подключение к Calculator компоненту
   * @public
   * @param {Object} calculatorInstance - Экземпляр Calculator
   */
  connectToCalculator(calculatorInstance) {
    if (!calculatorInstance || this.connectedComponents.calculator) {
      return;
    }
    
    this.log('Подключение к Calculator...');
    
    try {
      // Слушаем завершение расчетов
      calculatorInstance.addEventListener('calculationComplete', (event) => {
        this.trackCalculationCompleted(event.detail);
      });
      
      // Слушаем ошибки расчетов
      calculatorInstance.addEventListener('calculationError', (event) => {
        this.trackError('CALCULATION_ERROR', event.detail.error || 'Unknown calculation error');
      });
      
      // Слушаем начало расчета
      calculatorInstance.addEventListener('calculationStarted', (event) => {
        this.trackEvent('calculation_started', {
          industry: event.detail.industry || 'unknown',
          input_method: event.detail.method || 'form'
        });
      });
      
      this.connectedComponents.calculator = calculatorInstance;
      this.log('Calculator подключен успешно');
      
    } catch (error) {
      console.error('Ошибка подключения Calculator:', error);
      this.handleError('CALCULATOR_CONNECTION_ERROR', error);
    }
  }

  // =============================================================================
  // УТИЛИТЫ И ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // =============================================================================

  /**
   * Обработка ошибок
   * @private
   * @param {string} errorCode - Код ошибки
   * @param {Error} error - Объект ошибки
   * @param {Object} context - Контекст ошибки
   */
  handleError(errorCode, error, context = {}) {
    const errorInfo = {
      code: errorCode,
      message: error.message || 'Unknown error',
      timestamp: Date.now(),
      context
    };
    
    // Логирование ошибки
    console.error(`Analytics Error [${errorCode}]:`, errorInfo);
    
    // Отправка внутреннего события
    this.dispatchEvent('analyticsError', errorInfo);
    
    // Попытка отследить ошибку если возможно
    if (this.isInitialized && !errorCode.includes('TRACK_EVENT_ERROR')) {
      this.trackError(errorCode, error.message);
    }
  }

  /**
   * Отправка внутреннего события
   * @private
   * @param {string} eventName - Название события
   * @param {Object} detail - Детали события
   */
  dispatchEvent(eventName, detail = {}) {
    try {
      const event = new CustomEvent(`analytics:${eventName}`, {
        detail,
        bubbles: true,
        cancelable: true
      });
      
      if (typeof document !== 'undefined') {
        document.dispatchEvent(event);
      }
      
      // Вызов зарегистрированных обработчиков
      if (this.eventHandlers.has(eventName)) {
        const handlers = this.eventHandlers.get(eventName);
        handlers.forEach(handler => {
          try {
            handler(detail);
          } catch (error) {
            console.error('Ошибка в обработчике события:', error);
          }
        });
      }
      
    } catch (error) {
      console.error('Ошибка отправки внутреннего события:', error);
    }
  }

  /**
   * Регистрация обработчика внутренних событий
   * @public
   * @param {string} eventName - Название события
   * @param {Function} handler - Обработчик события
   */
  addEventListener(eventName, handler) {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }
    
    this.eventHandlers.get(eventName).push(handler);
  }

  /**
   * Удаление обработчика событий
   * @public
   * @param {string} eventName - Название события
   * @param {Function} handler - Обработчик для удаления
   */
  removeEventListener(eventName, handler) {
    if (this.eventHandlers.has(eventName)) {
      const handlers = this.eventHandlers.get(eventName);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Логирование с проверкой debug режима
   * @private
   * @param {string} message - Сообщение для логирования
   * @param {*} data - Дополнительные данные
   */
  log(message, data = null) {
    if (this.config.debugMode) {
      if (data) {
        console.log(`[Analytics] ${message}`, data);
      } else {
        console.log(`[Analytics] ${message}`);
      }
    }
  }

  /**
   * Получение статистики сервиса
   * @public
   * @returns {Object} Статистика аналитики
   */
  getAnalyticsStats() {
    return {
      isInitialized: this.isInitialized,
      hasConsent: this.hasConsent,
      isGA4Loaded: this.isGA4Loaded,
      sessionId: this.sessionId,
      sessionDuration: Date.now() - this.sessionStartTime,
      eventCounts: { ...this.eventCounts },
      queuedEvents: this.eventQueue.length,
      connectedComponents: Object.keys(this.connectedComponents).filter(
        key => this.connectedComponents[key] !== null
      ),
      config: {
        measurementId: this.config.measurementId,
        debugMode: this.config.debugMode,
        trackingOptOut: this.config.trackingOptOut
      }
    };
  }

  /**
   * Установка debug режима
   * @public
   * @param {boolean} enabled - Включить ли debug режим
   */
  setDebugMode(enabled) {
    this.config.debugMode = !!enabled;
    this.log(`Debug режим ${enabled ? 'включен' : 'выключен'}`);
  }

  /**
   * Установка opt-out для отслеживания
   * @public
   * @param {boolean} optOut - Отказаться ли от отслеживания
   */
  setTrackingOptOut(optOut) {
    this.config.trackingOptOut = !!optOut;
    this.log(`Отслеживание ${optOut ? 'отключено' : 'включено'}`);
    
    if (optOut) {
      this.clearAnalyticsData();
    }
  }

  /**
   * Уничтожение сервиса analytics
   * @public
   */
  destroy() {
    try {
      this.log('Уничтожение Analytics сервиса...');
      
      // Отправка оставшихся событий
      this.flushEventQueue();
      
      // Отключение от компонентов
      Object.keys(this.connectedComponents).forEach(key => {
        this.connectedComponents[key] = null;
      });
      
      // Очистка обработчиков событий
      this.eventHandlers.clear();
      
      // Очистка очереди
      this.eventQueue = [];
      
      // Сброс флагов
      this.isInitialized = false;
      this.isGA4Loaded = false;
      
      this.log('Analytics сервис уничтожен');
      
    } catch (error) {
      console.error('Ошибка уничтожения Analytics сервиса:', error);
    }
  }
}

// Экспорт класса
export default Analytics;

// Глобальная доступность для тестирования
if (typeof window !== 'undefined') {
  window.Analytics = Analytics;
}

// Экспорт конфигурации по умолчанию
export { DEFAULT_CONFIG as AnalyticsConfig }; 