/**
 * App Initializer Module
 * Отвечает за инициализацию всех компонентов приложения
 */

import { SecurityInitializer } from './SecurityInitializer.js';
import { PerformanceInitializer } from './PerformanceInitializer.js';
import { ComponentInitializer } from './ComponentInitializer.js';

export class AppInitializer {
  constructor(app) {
    this.app = app;
    this.securityInitializer = new SecurityInitializer(app);
    this.performanceInitializer = new PerformanceInitializer(app);
    this.componentInitializer = new ComponentInitializer(app);
  }

  /**
   * Инициализация приложения
   */
  async initialize() {
    try {
      console.log('🚀 Инициализация приложения...');
      
      // Инициализация Advanced Security Features
      await this.securityInitializer.initialize();
      
      // Инициализация Performance Optimization Features
      await this.performanceInitializer.initialize();
      
      // Скрыть экран загрузки
      this.hideLoadingState();
      
      // Показать контент калькулятора
      this.showCalculatorContent();
      
      // Инициализация всех компонентов
      await this.componentInitializer.initialize();
      
      // Настройка связей между компонентами
      this.setupComponentConnections();
      
      // Маркировка как инициализированное
      this.app.isInitialized = true;
      
      // Переподключение Analytics к компонентам после их инициализации
      this.app.connectAnalyticsEvents();
      
      // Глобальный доступ для тестирования
      if (typeof window !== 'undefined') {
        window.app = this.app;
      }
      
      console.log('✅ Приложение успешно инициализировано');
      
      // Dispatch события готовности
      this.dispatchAppReadyEvent();
      
    } catch (error) {
      console.error('AppInitializer: Ошибка инициализации:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Настройка связей между компонентами
   * @private
   */
  setupComponentConnections() {
    // Связывание событий между компонентами
    if (this.app.progressBar) {
      this.app.progressBar.addEventListener('stepChange', (event) => {
        this.app.handleStepNavigation(event.detail.step);
      });
    }

    if (this.app.industrySelector) {
      this.app.industrySelector.addEventListener('industrySelect', (event) => {
        this.app.handleIndustrySelect(event.detail.industry);
      });
      
      this.app.industrySelector.addEventListener('industryNext', (event) => {
        this.app.handleIndustryNext(event.detail);
      });
    }

    if (this.app.calculator) {
      this.app.calculator.addEventListener('calculationComplete', (event) => {
        this.app.handleCalculationComplete(event.detail);
      });
      
      this.app.calculator.addEventListener('calculationError', (event) => {
        this.app.handleCalculationError(event.detail);
      });
    }
  }

  /**
   * Скрыть экран загрузки
   * @private
   */
  hideLoadingState() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }

  /**
   * Показать контент калькулятора
   * @private
   */
  showCalculatorContent() {
    const calculatorContent = document.getElementById('calculator-content');
    if (calculatorContent) {
      calculatorContent.style.display = 'block';
    }
  }

  /**
   * Dispatch события готовности приложения
   * @private
   */
  dispatchAppReadyEvent() {
    this.app.dispatchEvent('appReady', {
      components: {
        progressBar: !!this.app.progressBar,
        industrySelector: !!this.app.industrySelector,
        calculator: !!this.app.calculator,
        analytics: !!this.app.analytics,
        cookieBanner: !!this.app.cookieBanner,
        security: {
          csp: !!this.app.cspConfig,
          headers: !!this.app.securityHeaders,
          threatDetector: !!this.app.threatDetector,
          securityMonitor: !!this.app.securityMonitor
        },
        performance: {
          lazyLoader: !!this.app.lazyLoader,
          cacheManager: !!this.app.cacheManager,
          performanceMonitor: !!this.app.performanceMonitor
        }
      }
    });
  }

  /**
   * Обработка ошибок инициализации
   * @private
   */
  handleInitializationError(error) {
    console.error('AppInitializer: Критическая ошибка инициализации:', error);
    
    // Показать пользователю сообщение об ошибке
    this.showError('Произошла ошибка при загрузке приложения. Пожалуйста, обновите страницу.');
    
    // Отправить ошибку в аналитику
    if (this.app.analytics) {
      this.app.analytics.trackEvent('app_initialization_error', {
        error: error.message,
        stack: error.stack
      });
    }
  }

  /**
   * Показать ошибку пользователю
   * @private
   */
  showError(message) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="error-message">
          <h3>Ошибка</h3>
          <p>${message}</p>
          <button onclick="location.reload()">Обновить страницу</button>
        </div>
      `;
      errorContainer.style.display = 'block';
    }
  }
} 