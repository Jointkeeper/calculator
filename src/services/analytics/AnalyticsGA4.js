/**
 * GA4 интеграция для Analytics
 * @module AnalyticsGA4
 */

/**
 * Класс для работы с Google Analytics 4
 */
export class AnalyticsGA4 {
  constructor(analytics) {
    this.analytics = analytics;
    this.isLoaded = false;
  }

  /**
   * Инициализация GA4
   * @param {string} measurementId - GA4 Measurement ID
   */
  async initializeGA4(measurementId = null) {
    try {
      const id = measurementId || this.analytics.config.measurementId;
      
      if (!id || id === 'G-XXXXXXXXXX') {
        throw new Error('Некорректный GA4 Measurement ID');
      }
      
      this.analytics.log('Инициализация GA4...');
      
      // Загрузка gtag скрипта
      await this.loadGtagScript();
      
      // Инициализация GA4
      if (typeof gtag !== 'undefined') {
        gtag('config', id, {
          anonymize_ip: this.analytics.config.anonymizeIP,
          cookie_domain: this.analytics.config.cookieDomain,
          cookie_flags: 'SameSite=None;Secure'
        });
        
        this.isLoaded = true;
        this.analytics.isGA4Loaded = true;
        
        this.analytics.log('GA4 инициализирован успешно');
        
        // Обработка очереди событий
        await this.analytics.processEventQueue();
      }
      
    } catch (error) {
      this.analytics.handleError('GA4_INIT_ERROR', error);
    }
  }

  /**
   * Загрузка gtag скрипта
   * @private
   */
  loadGtagScript() {
    return new Promise((resolve, reject) => {
      // Проверка, не загружен ли уже скрипт
      if (typeof gtag !== 'undefined') {
        resolve();
        return;
      }
      
      // Создание скрипта
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + this.analytics.config.measurementId;
      
      script.onload = () => {
        // Инициализация gtag функции
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer.push(arguments);
        };
        
        gtag('js', new Date());
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Не удалось загрузить GA4 скрипт'));
      };
      
      // Добавление скрипта на страницу
      document.head.appendChild(script);
    });
  }

  /**
   * Проверка согласия на cookies
   */
  async checkCookieConsent() {
    try {
      const consent = localStorage.getItem(this.analytics.config.consentStorageKey);
      
      if (consent === 'granted') {
        this.analytics.hasConsent = true;
        this.analytics.log('Согласие на analytics получено');
        
        if (this.analytics.config.autoInitialize) {
          await this.initializeGA4();
        }
      } else if (consent === 'denied') {
        this.analytics.hasConsent = false;
        this.analytics.log('Отказ от analytics');
      } else {
        this.analytics.log('Согласие на analytics не получено');
      }
      
    } catch (error) {
      this.analytics.handleError('CONSENT_CHECK_ERROR', error);
    }
  }

  /**
   * Установка согласия на cookies
   * @param {boolean} granted - Предоставлено ли согласие
   */
  async setCookieConsent(granted) {
    try {
      this.analytics.hasConsent = granted;
      
      // Сохранение в localStorage
      localStorage.setItem(
        this.analytics.config.consentStorageKey,
        granted ? 'granted' : 'denied'
      );
      
      if (granted) {
        this.analytics.log('Согласие на analytics предоставлено');
        
        // Инициализация GA4
        await this.initializeGA4();
        
        // Обработка очереди событий
        await this.analytics.processEventQueue();
      } else {
        this.analytics.log('Отказ от analytics');
        this.analytics.clearAnalyticsData();
      }
      
      // Уведомление компонентов
      this.analytics.dispatchEvent('consentChanged', { granted });
      
    } catch (error) {
      this.analytics.handleError('CONSENT_SET_ERROR', error);
    }
  }

  /**
   * Очистка данных analytics
   */
  clearAnalyticsData() {
    try {
      // Очистка очереди событий
      this.analytics.eventQueue = [];
      
      // Очистка счетчиков
      Object.keys(this.analytics.eventCounts).forEach(key => {
        this.analytics.eventCounts[key] = 0;
      });
      
      // Очистка localStorage
      localStorage.removeItem(this.analytics.config.consentStorageKey);
      
      this.analytics.log('Данные analytics очищены');
      
    } catch (error) {
      this.analytics.handleError('CLEAR_DATA_ERROR', error);
    }
  }
} 