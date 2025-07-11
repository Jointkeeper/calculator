/**
 * Main Application Entry Point
 * Универсальный калькулятор экономии маркетингового бюджета
 * 
 * @author Steamphony Digital Agency
 * @version 3.0.0 - Modular architecture with managers
 */

// Импорт основных компонентов
import { UniversalSavingsCalculator } from './components/Calculator.js';

// Импорт Analytics и CookieBanner
import Analytics from './services/Analytics.js';
import CookieBanner from './components/CookieBanner.js';

// Импорт Security Layer
import { SecurityLayer } from './security/index.js';

// Импорт новых модулей
import { AppState } from './core/AppState.js';
import { NavigationManager } from './managers/NavigationManager.js';

/**
 * Главный класс приложения
 * Координирует работу всех модулей и менеджеров
 */
class App {
  constructor() {
    // Инициализация состояния приложения
    this.appState = new AppState();
    
    // Инициализация менеджеров
    this.navigationManager = new NavigationManager(this.appState);
    
    // Security layer
    this.securityLayer = SecurityLayer;
    
    // Инициализация
    this.init();
    
    // Инициализация Analytics и Cookie Banner
    this.initializeAnalytics();
  }

  /**
   * Инициализация приложения
   * @private
   */
  init() {
    try {
      // Проверка готовности DOM
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
      } else {
        this.initializeComponents();
      }
    } catch (error) {
      console.error('App: Ошибка инициализации:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Инициализация всех компонентов
   * @private
   */
  async initializeComponents() {
    try {
      console.log('🚀 Инициализация приложения...');
      
      // Инициализация компонентов (оставляем существующую логику)
      await this.initializeAdvancedSecurity();
      await this.initializePerformanceOptimization();
      
      // Скрыть экран загрузки
      this.hideLoadingState();
      
      // Показать контент калькулятора
      this.showCalculatorContent();
      
      // Инициализация компонентов
      await this.initializeProgressBar();
      await this.initializeIndustrySelector();
      await this.initializeBusinessSizeStep();
      await this.initializeMarketingBudgetStep();
      await this.initializeMarketingTeamStep();
      await this.initializeContactFormStep();
      await this.initializeCalculator();
      
      // Настройка связей между компонентами
      this.setupComponentConnections();
      
      // Маркировка как инициализированное
      this.appState.setInitialized(true);
      
      // Переподключение Analytics к компонентам после их инициализации
      this.connectAnalyticsEvents();
      
      // Глобальный доступ для тестирования
      if (typeof window !== 'undefined') {
        window.app = this;
      }
      
      console.log('✅ Приложение успешно инициализировано');
      
      // Dispatch события готовности
      this.dispatchEvent('appReady', this.appState.getAppState());
      
    } catch (error) {
      console.error('App: Ошибка инициализации компонентов:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Инициализация Advanced Security Features
   * @private
   */
  async initializeAdvancedSecurity() {
    try {
      console.log('🔒 Инициализация Advanced Security Features...');
      
      // Initialize CSP Configuration
      this.cspConfig = new CSPConfig();
      this.cspConfig.applyCSPToDocument(document);
      
      // Initialize Security Headers
      this.securityHeaders = new SecurityHeaders();
      this.securityHeaders.setCSPConfig(this.cspConfig);
      this.securityHeaders.applyToDocument(document);
      
      // Initialize Threat Detector
      this.threatDetector = new ThreatDetector();
      
      // Initialize Security Monitor
      this.securityMonitor = new SecurityMonitor();
      this.securityMonitor.initialize(document);
      
      // Set up global security monitoring
      this.setupGlobalSecurityMonitoring();
      
      console.log('✅ Advanced Security Features инициализированы');
      
    } catch (error) {
      console.error('❌ Ошибка инициализации Advanced Security Features:', error);
      // Don't throw error - security features are optional for app functionality
    }
  }

  /**
   * Инициализация Performance Optimization Features
   * @private
   */
  async initializePerformanceOptimization() {
    try {
      console.log('⚡ Инициализация Performance Optimization Features...');
      
      // Performance optimization configuration
      const performanceConfig = {
        lazyLoading: {
          enabled: true,
          preloadModules: [
            './src/components/Calculator.js',
            './src/services/Analytics.js'
          ],
          maxRetries: 3,
          loadingTimeout: 10000
        },
        caching: {
          enabled: true,
          serviceWorker: true,
          strategies: {
            staticAssets: 'cache-first',
            apiResponses: 'network-first',
            analytics: 'background-sync'
          }
        },
        monitoring: {
          enabled: true,
          coreWebVitals: true,
          bundleAnalysis: true,
          reportingEndpoint: '/api/performance'
        }
      };
      
      // Initialize LazyLoader
      this.lazyLoader = new LazyLoader();
      this.lazyLoader.initialize(performanceConfig.lazyLoading);
      
      // Initialize CacheManager
      this.cacheManager = new CacheManager();
      await this.cacheManager.initialize(performanceConfig.caching);
      
      // Create and register Service Worker
      const serviceWorkerScript = this.cacheManager.createServiceWorkerScript();
      const serviceWorkerBlob = new Blob([serviceWorkerScript], { type: 'application/javascript' });
      const serviceWorkerUrl = URL.createObjectURL(serviceWorkerBlob);
      await this.cacheManager.registerServiceWorker(serviceWorkerUrl);
      
      // Initialize PerformanceMonitor
      this.performanceMonitor = new PerformanceMonitor();
      this.performanceMonitor.initialize(performanceConfig.monitoring);
      
      // Setup performance monitoring
      this.setupPerformanceMonitoring();
      
      console.log('✅ Performance Optimization Features инициализированы');
      
    } catch (error) {
      console.error('❌ Ошибка инициализации Performance Optimization Features:', error);
      // Don't throw error - performance features are optional for app functionality
    }
  }

  /**
   * Setup performance monitoring
   * @private
   */
  setupPerformanceMonitoring() {
    try {
      // Monitor bundle loading performance
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.reportPerformanceMetrics();
        }, 1000);
      });
      
      // Monitor user interactions for performance impact
      document.addEventListener('click', (event) => {
        this.monitorInteractionPerformance(event);
      });
      
      console.log('📊 Performance monitoring установлен');
      
    } catch (error) {
      console.error('❌ Ошибка установки performance monitoring:', error);
    }
  }

  /**
   * Report performance metrics
   * @private
   */
  reportPerformanceMetrics() {
    try {
      if (!this.performanceMonitor) return;
      
      const report = this.performanceMonitor.getPerformanceReport();
      console.log('📊 Performance Report:', report);
      
      // Send report to analytics
      if (this.analytics) {
        this.analytics.track('performance_metrics', report);
      }
      
    } catch (error) {
      console.error('❌ Ошибка отправки performance report:', error);
    }
  }

  /**
   * Monitor interaction performance
   * @param {Event} event - User interaction event
   * @private
   */
  monitorInteractionPerformance(event) {
    try {
      if (!this.performanceMonitor) return;
      
      const startTime = performance.now();
      
      // Measure interaction response time
      requestAnimationFrame(() => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        if (responseTime > 16) { // Longer than one frame (16ms)
          console.warn('🐌 Slow interaction detected:', {
            element: event.target,
            responseTime: responseTime.toFixed(2) + 'ms'
          });
        }
      });
      
    } catch (error) {
      console.error('❌ Ошибка мониторинга interaction performance:', error);
    }
  }

  /**
   * Setup global security monitoring
   * @private
   */
  setupGlobalSecurityMonitoring() {
    try {
      // Monitor form submissions
      document.addEventListener('submit', (event) => {
        this.monitorFormSubmission(event);
      });
      
      // Monitor input changes for suspicious activity
      document.addEventListener('input', (event) => {
        this.monitorInputActivity(event);
      });
      
      // Monitor navigation for potential threats
      window.addEventListener('beforeunload', (event) => {
        this.monitorNavigation(event);
      });
      
      console.log('🔍 Global security monitoring установлен');
      
    } catch (error) {
      console.error('❌ Ошибка установки global security monitoring:', error);
    }
  }

  /**
   * Monitor form submission for threats
   * @param {Event} event - Form submission event
   * @private
   */
  monitorFormSubmission(event) {
    try {
      if (!this.threatDetector) return;
      
      const form = event.target;
      const formData = new FormData(form);
      
      // Check rate limiting
      if (!this.threatDetector.implementRateLimit('form_submission', this.threatDetector.rateLimits.formSubmissions)) {
        event.preventDefault();
        console.warn('🚫 Form submission rate limit exceeded');
        return;
      }
      
      // Check for suspicious activity
      const activity = {
        type: 'form_submission',
        form: form.id || form.className,
        inputs: Object.fromEntries(formData.entries()),
        url: window.location.href,
        timestamp: new Date().toISOString()
      };
      
      const threatResult = this.threatDetector.detectSuspiciousActivity(activity);
      
      if (threatResult.suspicious) {
        console.warn('🚨 Suspicious form submission detected:', threatResult);
        this.threatDetector.triggerSecurityResponse(threatResult);
        
        // For critical threats, prevent submission
        if (threatResult.threatLevel >= 4) {
          event.preventDefault();
          return;
        }
      }
      
    } catch (error) {
      console.error('❌ Form submission monitoring failed:', error);
    }
  }

  /**
   * Monitor input activity for threats
   * @param {Event} event - Input event
   * @private
   */
  monitorInputActivity(event) {
    try {
      if (!this.threatDetector) return;
      
      const input = event.target;
      const value = input.value;
      
      // Only check for obvious threats in real-time
      if (value && value.length > 10) {
        const activity = {
          type: 'input_activity',
          input: input.name || input.id,
          content: value,
          url: window.location.href,
          timestamp: new Date().toISOString()
        };
        
        const threatResult = this.threatDetector.detectSuspiciousActivity(activity);
        
        if (threatResult.suspicious && threatResult.threatLevel >= 4) {
          console.warn('🚨 Critical threat detected in input:', threatResult);
          this.threatDetector.triggerSecurityResponse(threatResult);
        }
      }
      
    } catch (error) {
      console.error('❌ Input activity monitoring failed:', error);
    }
  }

  /**
   * Monitor navigation for threats
   * @param {Event} event - Navigation event
   * @private
   */
  monitorNavigation(event) {
    try {
      if (!this.threatDetector) return;
      
      const activity = {
        type: 'navigation',
        url: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      };
      
      const threatResult = this.threatDetector.detectSuspiciousActivity(activity);
      
      if (threatResult.suspicious) {
        console.warn('🚨 Suspicious navigation detected:', threatResult);
        this.threatDetector.triggerSecurityResponse(threatResult);
      }
      
    } catch (error) {
      console.error('❌ Navigation monitoring failed:', error);
    }
  }

  /**
   * Get security statistics
   * @returns {Object} Security statistics
   */
  getSecurityStatistics() {
    try {
      return {
        csp: this.cspConfig?.getStatistics() || null,
        headers: this.securityHeaders?.getSecurityStatistics() || null,
        threatDetector: this.threatDetector?.getStatistics() || null,
        securityMonitor: this.securityMonitor?.getStatistics() || null
      };
    } catch (error) {
      console.error('❌ Security statistics retrieval failed:', error);
      return { error: 'Statistics unavailable' };
    }
  }

  /**
   * Toggle security dashboard
   */
  toggleSecurityDashboard() {
    if (this.securityMonitor) {
      this.securityMonitor.toggleDashboard();
    }
  }

  /**
   * Инициализация ProgressBar
   * @private
   */
  async initializeProgressBar() {
    try {
      const progressContainer = document.getElementById('progress-container');
      
      if (!progressContainer) {
        throw new Error('Не найден контейнер #progress-container для ProgressBar');
      }
      
      // ProgressBar доступен через window (не ES6 модуль)
      if (typeof window.ProgressBar === 'undefined') {
        throw new Error('ProgressBar класс не найден в window');
      }
      
      this.progressBar = new window.ProgressBar(progressContainer, this.totalSteps, {
        allowClickNavigation: true,
        showPercentage: true,
        enableKeyboardNavigation: true,
        trackAnalytics: true
      });
      
      console.log('✅ ProgressBar инициализирован');
      
    } catch (error) {
      console.error('Ошибка инициализации ProgressBar:', error);
      throw error;
    }
  }

  /**
   * Инициализация IndustrySelector
   * @private
   */
  async initializeIndustrySelector() {
    try {
      const formContent = document.getElementById('form-content');
      
      if (!formContent) {
        // Создаем form-content если его нет
        const calculatorContent = document.getElementById('calculator-content');
        if (calculatorContent) {
          calculatorContent.innerHTML = '<div id="form-content"></div>';
        } else {
          throw new Error('Не найден контейнер для размещения формы');
        }
      }
      
      const formContainer = document.getElementById('form-content');
      
      // IndustrySelector доступен через window (не ES6 модуль)
      if (typeof window.IndustrySelector === 'undefined') {
        throw new Error('IndustrySelector класс не найден в window');
      }
      
      this.industrySelector = new window.IndustrySelector(formContainer, {
        onSelect: (industry) => this.handleIndustrySelect(industry),
        onNext: (selectionData) => this.handleIndustryNext(selectionData),
        showPopularSection: true,
        enableSearch: true
      });
      
      console.log('✅ IndustrySelector инициализирован');
      
    } catch (error) {
      console.error('Ошибка инициализации IndustrySelector:', error);
      throw error;
    }
  }

  /**
   * Инициализация BusinessSizeStep
   * @private
   */
  async initializeBusinessSizeStep() {
    try {
      const formContent = document.getElementById('form-content');
      
      if (!formContent) {
        throw new Error('Не найден контейнер #form-content для BusinessSizeStep');
      }
      
      // BusinessSizeStep доступен через window (не ES6 модуль)
      if (typeof window.BusinessSizeStep === 'undefined') {
        throw new Error('BusinessSizeStep класс не найден в window');
      }
      
      this.businessSizeStep = new window.BusinessSizeStep(formContent, {
        onSelect: (size) => this.handleBusinessSizeSelect(size),
        onNext: (data) => this.handleBusinessSizeNext(data),
        onBack: (data) => this.handleBusinessSizeBack(data),
        trackAnalytics: true
      });
      
      console.log('✅ BusinessSizeStep инициализирован');
      
    } catch (error) {
      console.error('Ошибка инициализации BusinessSizeStep:', error);
      throw error;
    }
  }

  /**
   * Инициализация MarketingBudgetStep
   * @private
   */
  async initializeMarketingBudgetStep() {
    try {
      const formContent = document.getElementById('form-content');
      
      if (!formContent) {
        throw new Error('Не найден контейнер #form-content для MarketingBudgetStep');
      }
      
      // MarketingBudgetStep доступен через window (не ES6 модуль)
      if (typeof window.MarketingBudgetStep === 'undefined') {
        throw new Error('MarketingBudgetStep класс не найден в window');
      }
      
      this.marketingBudgetStep = new window.MarketingBudgetStep(formContent, {
        onSelect: (budget) => this.handleMarketingBudgetSelect(budget),
        onNext: (data) => this.handleMarketingBudgetNext(data),
        onBack: (data) => this.handleMarketingBudgetBack(data),
        trackAnalytics: true
      });
      
      console.log('✅ MarketingBudgetStep инициализирован');
      
    } catch (error) {
      console.error('Ошибка инициализации MarketingBudgetStep:', error);
      throw error;
    }
  }

  /**
   * Инициализация Calculator
   * @private
   */
  async initializeCalculator() {
    try {
      this.calculator = new UniversalSavingsCalculator({
        enableAnalytics: true,
        validationStrict: true,
        steamphonyDiscount: 0.35
      });
      
      console.log('✅ Calculator инициализирован');
      
    } catch (error) {
      console.error('Ошибка инициализации Calculator:', error);
      throw error;
    }
  }

  /**
   * Настройка связей между компонентами
   * @private
   */
  setupComponentConnections() {
    try {
      // Слушатели событий ProgressBar
      if (this.progressBar) {
        const progressContainer = document.getElementById('progress-container');
        
        progressContainer.addEventListener('stepClicked', (event) => {
          this.handleStepNavigation(event.detail.step);
        });
      }
      
      // Слушатели событий IndustrySelector
      if (this.industrySelector) {
        const formContainer = document.getElementById('form-content');
        
        formContainer.addEventListener('industryConfirmed', (event) => {
          this.handleIndustryConfirmed(event.detail);
        });
        
        formContainer.addEventListener('industrySelected', (event) => {
          this.handleIndustrySelected(event.detail);
        });
      }
      
      // Слушатели событий Calculator
      if (this.calculator) {
        this.calculator.addEventListener('calculationComplete', (event) => {
          this.handleCalculationComplete(event.detail);
        });
        
        this.calculator.addEventListener('calculationError', (event) => {
          this.handleCalculationError(event.detail);
        });
      }
      
      console.log('✅ Связи между компонентами настроены');
      
    } catch (error) {
      console.error('Ошибка настройки связей:', error);
    }
  }

  /**
   * Обработка выбора отрасли
   * @private
   * @param {Object} industry - Данные отрасли
   */
  handleIndustrySelect(industry) {
    console.log('📊 Выбрана отрасль:', industry);
    this.formData.industry = industry;
  }

  /**
   * Обработка подтверждения отрасли и перехода к следующему шагу
   * @private
   * @param {Object} selectionData - Данные выбора
   */
  handleIndustryNext(selectionData) {
    console.log('➡️ Переход к следующему шагу:', selectionData);
    
    // Сохранение данных
    this.formData.industry = selectionData.industry;
    this.formData.industryKey = selectionData.industryKey;
    
    // Analytics tracking для выбора отрасли
    if (this.analytics) {
      try {
        this.analytics.trackIndustrySelection(selectionData.industryKey, {
          ...selectionData.industry,
          method: selectionData.method || 'form_selection',
          custom_value: selectionData.customValue || null
        });
      } catch (error) {
        console.warn('⚠️ Ошибка отслеживания выбора отрасли:', error);
      }
    }
    
    // Обновление прогресса
    this.nextStep();
  }

  /**
   * Обработка выбора размера бизнеса
   * @private
   * @param {Object} size - Данные размера
   */
  handleBusinessSizeSelect(size) {
    console.log('📏 Размер бизнеса выбран:', size);
    // Временное сохранение для валидации
    this.formData.businessSize = size;
  }

  /**
   * Обработка перехода к следующему шагу в BusinessSizeStep
   * @private
   * @param {Object} data - Данные перехода
   */
  handleBusinessSizeNext(data) {
    console.log('➡️ Переход к следующему шагу из BusinessSizeStep:', data);
    
    // Сохранение данных
    this.formData.businessSize = data.businessSize;
    
    // Analytics tracking для выбора размера бизнеса
    if (this.analytics) {
      try {
        this.analytics.trackEvent('business_size_completed', {
          size: data.businessSize.key,
          industry: data.industry,
          step: data.step,
          next_step: data.nextStep,
          metrics: data.businessSize.metrics
        });
      } catch (error) {
        console.warn('⚠️ Ошибка отслеживания размера бизнеса:', error);
      }
    }
    
    // Переход к следующему шагу
    this.nextStep();
  }

  /**
   * Обработка возврата к предыдущему шагу в BusinessSizeStep
   * @private
   * @param {Object} data - Данные возврата
   */
  handleBusinessSizeBack(data) {
    console.log('⬅️ Возврат к предыдущему шагу из BusinessSizeStep:', data);
    
    // Analytics tracking для возврата
    if (this.analytics) {
      try {
        this.analytics.trackEvent('business_size_back', {
          step: data.step,
          previous_step: data.previousStep
        });
      } catch (error) {
        console.warn('⚠️ Ошибка отслеживания возврата:', error);
      }
    }
    
    // Переход к предыдущему шагу
    this.previousStep();
  }

  /**
   * Обработка выбора маркетингового бюджета
   * @private
   * @param {Object} budget - Данные бюджета
   */
  handleMarketingBudgetSelect(budget) {
    console.log('💰 Маркетинговый бюджет выбран:', budget);
    // Временное сохранение для валидации
    this.formData.marketingBudget = budget;
  }

  /**
   * Обработка перехода к следующему шагу в MarketingBudgetStep
   * @private
   * @param {Object} data - Данные перехода
   */
  handleMarketingBudgetNext(data) {
    console.log('➡️ Переход к следующему шагу из MarketingBudgetStep:', data);
    
    // Сохранение данных
    this.formData.marketingBudget = data.marketingBudget;
    
    // Analytics tracking для выбора бюджета
    if (this.analytics) {
      try {
        this.analytics.trackEvent('marketing_budget_completed', {
          budget: data.marketingBudget.monthly,
          industry: data.industry?.key,
          businessSize: data.businessSize?.key,
          step: data.step,
          next_step: data.nextStep,
          potentialSavings: data.marketingBudget.potentialSavings?.total
        });
      } catch (error) {
        console.warn('⚠️ Ошибка отслеживания маркетингового бюджета:', error);
      }
    }
    
    // Переход к следующему шагу
    this.nextStep();
  }

  /**
   * Обработка возврата к предыдущему шагу в MarketingBudgetStep
   * @private
   * @param {Object} data - Данные возврата
   */
  handleMarketingBudgetBack(data) {
    console.log('⬅️ Возврат к предыдущему шагу из MarketingBudgetStep:', data);
    
    // Analytics tracking для возврата
    if (this.analytics) {
      try {
        this.analytics.trackEvent('marketing_budget_back', {
          step: data.step,
          previous_step: data.previousStep
        });
      } catch (error) {
        console.warn('⚠️ Ошибка отслеживания возврата:', error);
      }
    }
    
    // Переход к предыдущему шагу
    this.previousStep();
  }

  /**
   * Обработка подтверждения отрасли
   * @private
   * @param {Object} detail - Детали события
   */
  handleIndustryConfirmed(detail) {
    console.log('✅ Отрасль подтверждена:', detail);
    this.formData.industry = detail.industry;
  }

  /**
   * Обработка выбора отрасли (без подтверждения)
   * @private
   * @param {Object} detail - Детали события
   */
  handleIndustrySelected(detail) {
    console.log('🎯 Отрасль выбрана:', detail);
  }

  /**
   * Обработка завершения расчета
   * @private
   * @param {Object} results - Результаты расчета
   */
  handleCalculationComplete(results) {
    console.log('💰 Расчет завершен:', results);
    
    // Переход к экрану результатов
    this.showResults(results);
  }

  /**
   * Обработка ошибки расчета
   * @private
   * @param {Object} error - Данные ошибки
   */
  handleCalculationError(error) {
    console.error('❌ Ошибка расчета:', error);
    this.showError('Ошибка при выполнении расчета. Попробуйте еще раз.');
  }

  /**
   * Обработка навигации по шагам
   * @private
   * @param {number} step - Номер шага
   */
  handleStepNavigation(step) {
    console.log(`🔄 Переход к шагу ${step}`);
    
    if (step > 0 && step <= this.totalSteps) {
      this.currentStep = step;
      this.updateStep(step);
    }
  }

  /**
   * Переход к следующему шагу
   * @public
   */
  nextStep() {
    const success = this.navigationManager.nextStep();
    
    // Analytics tracking
    if (success && this.analytics) {
      try {
        const currentStep = this.appState.getCurrentStep();
        this.analytics.trackCalculatorStep(currentStep, {
          direction: 'forward',
          timestamp: Date.now(),
          previous_step: currentStep - 1
        });
      } catch (error) {
        console.warn('⚠️ Ошибка отслеживания перехода к следующему шагу:', error);
      }
    }
    
    return success;
  }

  /**
   * Переход к предыдущему шагу
   * @public
   */
  previousStep() {
    const success = this.navigationManager.previousStep();
    
    // Analytics tracking
    if (success && this.analytics) {
      try {
        const currentStep = this.appState.getCurrentStep();
        this.analytics.trackCalculatorStep(currentStep, {
          direction: 'backward',
          timestamp: Date.now(),
          previous_step: currentStep + 1
        });
      } catch (error) {
        console.warn('⚠️ Ошибка отслеживания перехода к предыдущему шагу:', error);
      }
    }
    
    return success;
  }

  /**
   * Обновление текущего шага
   * @private
   * @param {number} step - Номер шага
   */
  updateStep(step) {
    // Обновление ProgressBar
    if (this.progressBar) {
      this.progressBar.updateProgress(step);
    }
    
    // Обновление содержимого формы
    this.showStepContent(step);
    
    console.log(`📍 Обновлен шаг: ${step}`);
  }

  /**
   * Отображение содержимого шага
   * @private
   * @param {number} step - Номер шага
   */
  showStepContent(step) {
    try {
      switch (step) {
        case 1:
          this.showIndustrySelector();
          break;
        case 2:
          this.showBusinessSizeStep();
          break;
        case 3:
          this.showMarketingBudgetStep();
          break;
        case 4:
          // TODO: Показать MarketingToolsStep
          console.log('🚧 MarketingToolsStep в разработке');
          break;
        case 5:
          // TODO: Показать MarketingTeamStep
          console.log('🚧 MarketingTeamStep в разработке');
          break;
        case 6:
          // TODO: Показать ContactFormStep
          console.log('🚧 ContactFormStep в разработке');
          break;
        default:
          console.warn(`⚠️ Неизвестный шаг: ${step}`);
      }
    } catch (error) {
      console.error('Ошибка показа содержимого шага:', error);
    }
  }

  /**
   * Показ IndustrySelector
   * @private
   */
  showIndustrySelector() {
    const formContent = document.getElementById('form-content');
    if (!formContent) return;

    // Скрыть другие компоненты и показать IndustrySelector
    if (this.industrySelector) {
      this.industrySelector.container.style.display = 'block';
    }
    
    if (this.businessSizeStep) {
      this.businessSizeStep.container.style.display = 'none';
    }
    
    if (this.marketingBudgetStep) {
      this.marketingBudgetStep.container.style.display = 'none';
    }
    
    console.log('🎯 Показан IndustrySelector');
  }

  /**
   * Показ BusinessSizeStep
   * @private
   */
  showBusinessSizeStep() {
    const formContent = document.getElementById('form-content');
    if (!formContent) return;

    // Скрыть другие компоненты и показать BusinessSizeStep
    if (this.industrySelector) {
      this.industrySelector.container.style.display = 'none';
    }
    
    if (this.businessSizeStep) {
      this.businessSizeStep.container.style.display = 'block';
    }
    
    if (this.marketingBudgetStep) {
      this.marketingBudgetStep.container.style.display = 'none';
    }
    
    console.log('📏 Показан BusinessSizeStep');
  }

  /**
   * Показ MarketingBudgetStep
   * @private
   */
  showMarketingBudgetStep() {
    const formContent = document.getElementById('form-content');
    if (!formContent) return;

    // Скрыть другие компоненты и показать MarketingBudgetStep
    if (this.industrySelector) {
      this.industrySelector.container.style.display = 'none';
    }
    
    if (this.businessSizeStep) {
      this.businessSizeStep.container.style.display = 'none';
    }
    
    if (this.marketingBudgetStep) {
      this.marketingBudgetStep.container.style.display = 'block';
    }
    
    console.log('💰 Показан MarketingBudgetStep');
  }

  /**
   * Скрытие экрана загрузки
   * @private
   */
  hideLoadingState() {
    const loadingState = document.getElementById('loading-state');
    if (loadingState) {
      loadingState.style.display = 'none';
    }
  }

  /**
   * Показ контента калькулятора
   * @private
   */
  showCalculatorContent() {
    const calculatorContent = document.getElementById('calculator-content');
    if (calculatorContent) {
      calculatorContent.classList.remove('hidden');
    }
  }

  /**
   * Отображение результатов
   * @private
   * @param {Object} results - Результаты расчета
   */
  showResults(results) {
    // TODO: Реализовать отображение результатов
    console.log('📈 Показать результаты:', results);
  }

  /**
   * Отображение ошибки
   * @private
   * @param {string} message - Сообщение об ошибке
   */
  showError(message) {
    const errorState = document.getElementById('error-state');
    if (errorState) {
      errorState.classList.remove('hidden');
      const errorMessage = errorState.querySelector('.error-message p');
      if (errorMessage) {
        errorMessage.textContent = message;
      }
    }
  }

  /**
   * Обработка ошибки инициализации
   * @private
   * @param {Error} error - Ошибка
   */
  handleInitializationError(error) {
    console.error('💥 Критическая ошибка инициализации:', error);
    
    // Скрыть экран загрузки
    this.hideLoadingState();
    
    // Показать ошибку
    this.showError(`Ошибка загрузки приложения: ${error.message}`);
    
    // Dispatch события ошибки
    this.dispatchEvent('appInitializationError', { error: error.message });
  }

  /**
   * Отправка пользовательского события
   * @private
   * @param {string} eventName - Название события
   * @param {Object} detail - Данные события
   */
  dispatchEvent(eventName, detail = {}) {
    try {
      const event = new CustomEvent(eventName, {
        detail,
        bubbles: true,
        cancelable: true
      });
      
      document.dispatchEvent(event);
    } catch (error) {
      console.error('Ошибка отправки события:', error);
    }
  }

  /**
   * Получение данных формы
   * @public
   * @returns {Object} Данные формы
   */
  getFormData() {
    return this.appState.getFormData();
  }

  /**
   * Получение состояния приложения
   * @public
   * @returns {Object} Состояние приложения
   */
  getAppState() {
    return this.appState.getAppState();
  }
      analytics: this.analytics ? {
        hasConsent: this.analytics.hasConsent,
        isGA4Loaded: this.analytics.isGA4Loaded,
        queuedEvents: this.analytics.eventQueue?.length || 0
      } : null,
      cookieBanner: this.cookieBanner ? {
        preferences: this.cookieBanner.getPreferences(),
        isVisible: this.cookieBanner.isVisible
      } : null
    };
  }

  /**
   * Сброс приложения
   * @public
   */
  reset() {
    try {
      // Сброс данных формы
      this.formData = {
        industry: null,
        businessSize: null,
        marketingBudget: null,
        marketingTools: null,
        hasMarketer: null,
        tools: []
      };
      
      // Сброс шага
      this.currentStep = 1;
      
      // Сброс компонентов
      if (this.progressBar) {
        this.progressBar.reset();
      }
      
      if (this.industrySelector) {
        this.industrySelector.reset();
      }
      
      if (this.businessSizeStep) {
        this.businessSizeStep.reset();
      }
      
      if (this.marketingBudgetStep) {
        this.marketingBudgetStep.reset();
      }
      
      console.log('🔄 Приложение сброшено');
      
    } catch (error) {
      console.error('Ошибка сброса приложения:', error);
    }
  }

  /**
   * Инициализация Analytics и CookieBanner
   * @private
   */
  initializeAnalytics() {
    try {
      console.log('🔗 Инициализация Analytics и CookieBanner...');
      
      // Получение конфигурации из window
      const analyticsConfig = window.STEAMPHONY_CONFIG?.analytics || {};
      const cookieBannerConfig = window.STEAMPHONY_CONFIG?.cookieBanner || {};
      
      // Инициализация Analytics
      this.analytics = new Analytics(analyticsConfig);
      
      // Инициализация CookieBanner с Analytics
      this.cookieBanner = new CookieBanner(this.analytics, cookieBannerConfig);
      
      // Подключение Analytics к компонентам
      this.connectAnalyticsEvents();
      
      // Глобальный доступ для тестирования
      if (typeof window !== 'undefined') {
        window.analytics = this.analytics;
        window.cookieBanner = this.cookieBanner;
      }
      
      console.log('✅ Analytics и CookieBanner инициализированы');
      
    } catch (error) {
      console.warn('⚠️ Ошибка инициализации Analytics:', error);
      // Graceful degradation - приложение продолжает работать без analytics
      this.analytics = null;
      this.cookieBanner = null;
    }
  }

  /**
   * Подключение Analytics к компонентам
   * @private
   */
  connectAnalyticsEvents() {
    if (!this.analytics) return;
    
    try {
      // Подключение к ProgressBar
      if (this.progressBar) {
        this.analytics.connectToProgressBar(this.progressBar);
        console.log('🔗 Analytics подключен к ProgressBar');
      }
      
      // Подключение к IndustrySelector
      if (this.industrySelector) {
        this.analytics.connectToIndustrySelector(this.industrySelector);
        console.log('🔗 Analytics подключен к IndustrySelector');
      }
      
      // Подключение к BusinessSizeStep
      if (this.businessSizeStep) {
        this.analytics.connectToBusinessSizeStep(this.businessSizeStep);
        console.log('🔗 Analytics подключен к BusinessSizeStep');
      }
      
      // Подключение к MarketingBudgetStep
      if (this.marketingBudgetStep) {
        this.analytics.connectToMarketingBudgetStep(this.marketingBudgetStep);
        console.log('🔗 Analytics подключен к MarketingBudgetStep');
      }
      
      // Подключение к Calculator
      if (this.calculator) {
        this.analytics.connectToCalculator(this.calculator);
        console.log('🔗 Analytics подключен к Calculator');
      }
      
      // Слушание событий готовности компонентов
      document.addEventListener('appReady', () => {
        this.trackApplicationReady();
      });
      
    } catch (error) {
      console.warn('⚠️ Ошибка подключения Analytics к компонентам:', error);
    }
  }

  /**
   * Отслеживание готовности приложения
   * @private
   */
  trackApplicationReady() {
    if (this.analytics) {
      try {
        this.analytics.trackEvent('calculator_started', {
          components_loaded: {
            progressBar: !!this.progressBar,
            industrySelector: !!this.industrySelector,
            businessSizeStep: !!this.businessSizeStep,
            marketingBudgetStep: !!this.marketingBudgetStep,
            calculator: !!this.calculator
          },
          total_steps: this.totalSteps,
          session_start: Date.now()
        });
      } catch (error) {
        console.warn('⚠️ Ошибка отслеживания готовности приложения:', error);
      }
    }
  }

  /**
   * Получение Analytics instance
   * @public
   * @returns {Object|null} Analytics instance или null
   */
  getAnalytics() {
    return this.analytics;
  }

  /**
   * Получение CookieBanner instance
   * @public  
   * @returns {Object|null} CookieBanner instance или null
   */
  getCookieBanner() {
    return this.cookieBanner;
  }

  /**
   * Программное управление согласием на cookies
   * @public
   * @param {boolean} consent - Согласие на analytics cookies
   */
  async setCookieConsent(consent) {
    try {
      if (this.analytics) {
        await this.analytics.setCookieConsent(consent);
      }
      
      if (this.cookieBanner) {
        // Скрываем banner после установки согласия
        await this.cookieBanner.hideBanner();
      }
      
    } catch (error) {
      console.warn('⚠️ Ошибка установки согласия на cookies:', error);
    }
  }

  /**
   * Сброс согласия на cookies (показать banner снова)
   * @public
   */
  async resetCookieConsent() {
    try {
      if (this.cookieBanner) {
        await this.cookieBanner.resetConsent();
      }
    } catch (error) {
      console.warn('⚠️ Ошибка сброса согласия на cookies:', error);
    }
  }

  /**
   * Уничтожение приложения
   * @public
   */
  destroy() {
    try {
      // Уничтожение компонентов
      if (this.progressBar) {
        this.progressBar.destroy();
      }
      
      if (this.industrySelector) {
        this.industrySelector.destroy();
      }
      
      if (this.businessSizeStep) {
        this.businessSizeStep.destroy();
      }
      
      if (this.marketingBudgetStep) {
        this.marketingBudgetStep.destroy();
      }
      
      if (this.calculator) {
        this.calculator.destroy();
      }
      
      // Уничтожение Analytics и CookieBanner
      if (this.analytics) {
        this.analytics.destroy();
      }
      
      if (this.cookieBanner) {
        this.cookieBanner.destroy();
      }
      
      // Очистка ссылок
      this.progressBar = null;
      this.industrySelector = null;
      this.calculator = null;
      this.analytics = null;
      this.cookieBanner = null;
      
      // Удаление из window
      if (typeof window !== 'undefined') {
        if (window.app === this) {
          delete window.app;
        }
        if (window.analytics === this.analytics) {
          delete window.analytics;
        }
        if (window.cookieBanner === this.cookieBanner) {
          delete window.cookieBanner;
        }
      }
      
      console.log('🗑️ Приложение уничтожено');
      
    } catch (error) {
      console.error('Ошибка уничтожения приложения:', error);
    }
  }

  // Marketing Tools Step integration
  initializeMarketingToolsStep() {
    const marketingToolsContainer = document.querySelector('#marketing-tools-step');
    
    if (!marketingToolsContainer) {
      console.error('Marketing Tools Step container not found');
      return;
    }

    this.marketingToolsStep = new MarketingToolsStep(marketingToolsContainer, {
      onSelect: (data) => {
        this.handleMarketingToolsSelect(data);
      },
      onNext: (data) => {
        this.handleMarketingToolsNext(data);
      },
      onBack: (data) => {
        this.handleMarketingToolsBack(data);
      },
      trackAnalytics: true
    });
  }

  // Marketing Tools Step event handlers
  handleMarketingToolsSelect(data) {
    console.log('Marketing Tools selected:', data);
    
    // Update progress if needed
    if (this.progressBar) {
      this.progressBar.setProgress(66); // 4 out of 6 steps = 66%
    }
    
    // Save data to formData
    this.formData.marketingTools = data;
    
    // Update UI with selection summary
    this.updateSelectionSummary(data);
  }

  handleMarketingToolsNext(data) {
    console.log('Marketing Tools Step: Next clicked', data);
    
    // Save marketing tools data
    this.formData.marketingTools = data.marketingTools;
    
    // Update progress
    if (this.progressBar) {
      this.progressBar.setCurrentStep(5);
      this.progressBar.setProgress(83); // 5 out of 6 steps = 83%
    }
    
    // Hide current step and show next
    this.hideMarketingToolsStep();
    this.showMarketingTeamStep();
    
    // Analytics tracking
    if (this.analytics) {
      this.analytics.trackEvent('step_4_to_5_transition', {
        selected_tools: data.marketingTools.selected || [],
        total_tools: data.marketingTools.selected?.length || 0,
        estimated_cost: data.marketingTools.estimatedMonthlyCost || 0,
        optimization_opportunities: data.marketingTools.optimizationOpportunities?.length || 0,
        industry: this.formData.industry?.key,
        business_size: this.formData.businessSize?.key,
        marketing_budget: this.formData.marketingBudget?.monthly,
        step: 4,
        next_step: 5,
        timestamp: Date.now()
      });
    }
  }

  handleMarketingToolsBack(data) {
    console.log('Marketing Tools Step: Back clicked', data);
    
    // Update progress
    if (this.progressBar) {
      this.progressBar.setCurrentStep(3);
      this.progressBar.setProgress(50); // 3 out of 6 steps = 50%
    }
    
    // Hide current step and show previous
    this.hideMarketingToolsStep();
    this.showMarketingBudgetStep();
    
    // Analytics tracking
    if (this.analytics) {
      this.analytics.trackEvent('step_4_to_3_back', {
        selected_tools: data.selectedTools || [],
        total_tools: data.totalSelected || 0,
        industry: this.formData.industry?.key,
        business_size: this.formData.businessSize?.key,
        step: 4,
        previous_step: 3,
        timestamp: Date.now()
      });
    }
  }

  // Marketing Tools Step display methods
  showMarketingToolsStep() {
    console.log('Showing Marketing Tools Step');
    
    // Initialize if not already done
    if (!this.marketingToolsStep) {
      this.initializeMarketingToolsStep();
    }
    
    // Hide all other steps
    this.hideAllSteps();
    
    // Show marketing tools step
    const marketingToolsContainer = document.querySelector('#marketing-tools-step');
    if (marketingToolsContainer) {
      marketingToolsContainer.style.display = 'block';
      
      // Show the component
      if (this.marketingToolsStep) {
        this.marketingToolsStep.show();
      }
    }
    
    // Update progress
    if (this.progressBar) {
      this.progressBar.setCurrentStep(4);
      this.progressBar.setProgress(66); // 4 out of 6 steps = 66%
    }
    
    // Update page title
    document.title = 'Маркетинговые инструменты - Steamphony Calculator';
    
    // Analytics tracking
    if (this.analytics) {
      this.analytics.trackEvent('step_4_viewed', {
        industry: this.formData.industry?.key,
        business_size: this.formData.businessSize?.key,
        marketing_budget: this.formData.marketingBudget?.monthly,
        step: 4,
        timestamp: Date.now()
      });
    }
  }

  hideMarketingToolsStep() {
    const marketingToolsContainer = document.querySelector('#marketing-tools-step');
    if (marketingToolsContainer) {
      marketingToolsContainer.style.display = 'none';
      
      // Hide the component
      if (this.marketingToolsStep) {
        this.marketingToolsStep.hide();
      }
    }
  }

  // Update selection summary helper
  updateSelectionSummary(data) {
    if (!data || !data.selectedTools) return;
    
    const summary = {
      totalSelected: data.selectedTools.length,
      estimatedCost: data.estimatedCost || 0,
      byCategory: {}
    };
    
    // Calculate tools by category
    if (data.selectedTools.length > 0) {
      // Count by category based on selected tools
      data.selectedTools.forEach(toolId => {
        const toolElement = document.querySelector(`input[value="${toolId}"]`);
        if (toolElement) {
          const category = toolElement.dataset.category;
          if (category) {
            summary.byCategory[category] = (summary.byCategory[category] || 0) + 1;
          }
        }
      });
    }
    
    // Update UI elements with summary
    this.updateToolsSummaryUI(summary);
  }

  updateToolsSummaryUI(summary) {
    // Update category counters
    Object.entries(summary.byCategory).forEach(([category, count]) => {
      const counter = document.querySelector(`#counter-${category}`);
      if (counter) {
        const selectedSpan = counter.querySelector('.selected-count');
        if (selectedSpan) {
          selectedSpan.textContent = count;
        }
      }
    });
    
    // Update selection summary
    const selectionSummary = document.querySelector('#selection-summary');
    if (selectionSummary) {
      const summaryCount = selectionSummary.querySelector('#summary-count');
      const summaryCost = selectionSummary.querySelector('#summary-cost .cost-amount');
      
      if (summaryCount) {
        const toolText = this.pluralizeTools(summary.totalSelected);
        summaryCount.textContent = `${summary.totalSelected} ${toolText}`;
      }
      
      if (summaryCost) {
        summaryCost.textContent = this.formatCurrency(summary.estimatedCost) + '/месяц';
      }
      
      // Show/hide summary based on selection
      selectionSummary.style.display = summary.totalSelected > 0 ? 'block' : 'none';
    }
  }

  // Helper method for pluralizing tools
  pluralizeTools(count) {
    if (count % 10 === 1 && count % 100 !== 11) return 'инструмент';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'инструмента';
    return 'инструментов';
  }

  // Format currency helper
  formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Инициализация MarketingTeamStep
   * @private
   */
  async initializeMarketingTeamStep() {
    try {
      const formContent = document.getElementById('form-content');
      
      if (!formContent) {
        throw new Error('Не найден контейнер #form-content для MarketingTeamStep');
      }
      
      // MarketingTeamStep доступен через window (не ES6 модуль)
      if (typeof window.MarketingTeamStep === 'undefined') {
        throw new Error('MarketingTeamStep класс не найден в window');
      }
      
      this.marketingTeamStep = new window.MarketingTeamStep(formContent, {
        onSelect: (data) => this.handleMarketingTeamSelect(data),
        onNext: (data) => this.handleMarketingTeamNext(data),
        onBack: (data) => this.handleMarketingTeamBack(data),
        trackAnalytics: true
      });
      
      console.log('✅ MarketingTeamStep инициализирован');
      
    } catch (error) {
      console.error('Ошибка инициализации MarketingTeamStep:', error);
      throw error;
    }
  }

  // Marketing Team Step event handlers
  handleMarketingTeamSelect(data) {
    console.log('Marketing Team selected:', data);
    
    // Update progress if needed
    if (this.progressBar) {
      this.progressBar.setProgress(83); // 5 out of 6 steps = 83%
    }
    
    // Save data to formData
    this.formData.marketingTeamData = data;
    
    // Update UI with gap analysis
    this.updateGapAnalysisDisplay(data);
  }

  handleMarketingTeamNext(data) {
    console.log('Marketing Team Step: Next clicked', data);
    
    // Save marketing team data
    this.formData.marketingTeam = data.teamData;
    this.formData.gapAnalysis = data.gapAnalysis;
    this.formData.steamphonyRecommendations = data.recommendations;
    
    // Update progress
    if (this.progressBar) {
      this.progressBar.setCurrentStep(6);
      this.progressBar.setProgress(100); // 6 out of 6 steps = 100%
    }
    
    // Hide current step and show next
    this.hideMarketingTeamStep();
    this.showContactFormStep();
    
    // Analytics tracking
    if (this.analytics) {
      this.analytics.trackEvent('step_5_to_6_transition', {
        selected_team: data.teamData?.current?.id,
        team_monthly_cost: data.teamData?.current?.monthlyCost || 0,
        potential_monthly_savings: data.gapAnalysis?.savings?.cost?.monthly || 0,
        potential_annual_savings: data.gapAnalysis?.savings?.cost?.annual || 0,
        value_propositions_count: data.recommendations?.valuePropositions?.length || 0,
        industry: this.formData.industry?.key,
        business_size: this.formData.businessSize?.key,
        marketing_budget: this.formData.marketingBudget?.monthly,
        step: 5,
        next_step: 6,
        timestamp: Date.now()
      });
    }
  }

  handleMarketingTeamBack(data) {
    console.log('Marketing Team Step: Back clicked', data);
    
    // Update progress
    if (this.progressBar) {
      this.progressBar.setCurrentStep(4);
      this.progressBar.setProgress(66); // 4 out of 6 steps = 66%
    }
    
    // Hide current step and show previous
    this.hideMarketingTeamStep();
    this.showMarketingToolsStep();
    
    // Analytics tracking
    if (this.analytics) {
      this.analytics.trackEvent('step_5_to_4_back', {
        selected_team: data.selectedTeam || null,
        industry: this.formData.industry?.key,
        business_size: this.formData.businessSize?.key,
        step: 5,
        previous_step: 4,
        timestamp: Date.now()
      });
    }
  }

  // Marketing Team Step display methods
  showMarketingTeamStep() {
    console.log('Showing Marketing Team Step');
    
    // Initialize if not already done
    if (!this.marketingTeamStep) {
      this.initializeMarketingTeamStep();
    }
    
    // Hide all other steps
    this.hideAllSteps();
    
    // Update component with form data
    if (this.marketingTeamStep && this.formData) {
      this.marketingTeamStep.updateWithFormData(this.formData);
    }
    
    // Show the component
    if (this.marketingTeamStep) {
      this.marketingTeamStep.show();
    }
    
    // Update progress
    if (this.progressBar) {
      this.progressBar.setCurrentStep(5);
      this.progressBar.setProgress(83); // 5 out of 6 steps = 83%
    }
    
    // Update page title
    document.title = 'Маркетинговая команда - Steamphony Calculator';
    
    // Analytics tracking
    if (this.analytics) {
      this.analytics.trackEvent('step_5_viewed', {
        industry: this.formData.industry?.key,
        business_size: this.formData.businessSize?.key,
        marketing_budget: this.formData.marketingBudget?.monthly,
        marketing_tools_count: this.formData.marketingTools?.selected?.length || 0,
        step: 5,
        timestamp: Date.now()
      });
    }
  }

  hideMarketingTeamStep() {
    if (this.marketingTeamStep) {
      this.marketingTeamStep.hide();
    }
  }

  // Gap analysis display helper
  updateGapAnalysisDisplay(data) {
    if (!data || !data.gapAnalysis) return;
    
    const analysis = data.gapAnalysis;
    const recommendations = data.recommendations;
    
    // Update summary display if exists
    const summaryDisplay = document.querySelector('#team-analysis-summary');
    if (summaryDisplay) {
      const savingsAmount = analysis.savings?.cost?.monthly || 0;
      const timeHours = analysis.savings?.time?.weekly || 0;
      
      summaryDisplay.innerHTML = `
        <div class="analysis-summary-item">
          <span class="summary-label">Потенциальная экономия:</span>
          <span class="summary-value">${this.formatCurrency(savingsAmount)}/месяц</span>
        </div>
        <div class="analysis-summary-item">
          <span class="summary-label">Экономия времени:</span>
          <span class="summary-value">${Math.round(timeHours)} часов/неделю</span>
        </div>
        <div class="analysis-summary-item">
          <span class="summary-label">Преимуществ выявлено:</span>
          <span class="summary-value">${recommendations?.valuePropositions?.length || 0}</span>
        </div>
      `;
    }
  }

  /**
   * Инициализация ContactFormStep
   * @private
   */
  async initializeContactFormStep() {
    try {
      const formContent = document.getElementById('form-content');
      
      if (!formContent) {
        throw new Error('Не найден контейнер #form-content для ContactFormStep');
      }
      
      // ContactFormStep доступен через window (не ES6 модуль)
      if (typeof window.ContactFormStep === 'undefined') {
        throw new Error('ContactFormStep класс не найден в window');
      }
      
      this.contactFormStep = new window.ContactFormStep({
        analytics: this.analytics,
        onSubmit: (contactData) => this.handleContactFormSubmit(contactData),
        onComplete: () => this.onCalculatorComplete()
      });
      
      console.log('✅ ContactFormStep инициализирован');
      
    } catch (error) {
      console.error('Ошибка инициализации ContactFormStep:', error);
      throw error;
    }
  }

  // ContactFormStep display methods
  showContactFormStep() {
    console.log('Showing Contact Form Step (Step 6)');
    
    // Initialize if not already done
    if (!this.contactFormStep) {
      this.initializeContactFormStep();
    }
    
    // Hide all other steps
    this.hideAllSteps();
    
    // Show contact form step
    if (this.contactFormStep) {
      this.contactFormStep.show();
      
      // Update with form data
      if (this.formData) {
        this.contactFormStep.updateWithFormData(this.formData);
      }
    }
    
    // Update progress to 100%
    if (this.progressBar) {
      this.progressBar.setCurrentStep(6);
      this.progressBar.setProgress(100); // 6 out of 6 steps = 100%
      this.progressBar.markComplete();
    }
    
    // Update page title
    document.title = 'Результаты анализа - Steamphony Calculator';
    
    // Analytics tracking
    if (this.analytics) {
      this.analytics.trackEvent('step_6_viewed', {
        industry: this.formData?.industry?.key,
        business_size: this.formData?.businessSize?.key,
        marketing_budget: this.formData?.marketingBudget?.monthly,
        marketing_tools_count: this.formData?.marketingTools?.selected?.length || 0,
        team_type: this.formData?.marketingTeam?.current?.id,
        step: 6,
        timestamp: Date.now()
      });
    }
  }

  hideContactFormStep() {
    if (this.contactFormStep) {
      this.contactFormStep.hide();
    }
  }

  // ContactFormStep event handlers
  handleContactFormSubmit(contactData) {
    console.log('Contact Form submitted:', contactData);
    
    // Save contact data
    this.formData.contactInfo = contactData;
    
    // Analytics tracking
    if (this.analytics) {
      this.analytics.trackEvent('contact_form_submitted', {
        ...this.getAnalyticsContext(),
        contact_data: {
          has_name: !!contactData.firstName,
          has_phone: !!contactData.phone,
          has_email: !!contactData.email,
          has_company: !!contactData.company,
          gdpr_consent: contactData.gdprConsent,
          marketing_consent: contactData.marketingConsent
        },
        step: 6,
        timestamp: Date.now()
      });
    }
  }

  onCalculatorComplete() {
    console.log('🎉 Calculator completed!');
    
    // Final analytics event
    if (this.analytics) {
      this.analytics.trackEvent('calculator_completed', {
        ...this.getAnalyticsContext(),
        total_steps: 6,
        completion_rate: 100,
        lead_quality: 'qualified',
        conversion_value: this.contactFormStep?.calculationResults?.savings?.annual || 0,
        completion_time: this.calculateCompletionTime(),
        timestamp: Date.now()
      });
    }
    
    // Enable restart functionality
    this.enableRestart();
    
    // Dispatch completion event
    this.dispatchEvent('calculatorComplete', {
      formData: this.formData,
      calculationResults: this.contactFormStep?.calculationResults,
      contactInfo: this.formData?.contactInfo,
      completionTime: this.calculateCompletionTime()
    });
  }

  calculateCompletionTime() {
    if (!this.startTime) return 0;
    return Math.round((Date.now() - this.startTime) / 1000); // seconds
  }

  enableRestart() {
    // Add restart button or functionality
    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Начать заново';
    restartBtn.className = 'btn btn-primary restart-btn';
    restartBtn.onclick = () => this.restart();
    
    // Add to page
    const container = document.querySelector('#calculator-container');
    if (container) {
      container.appendChild(restartBtn);
    }
  }

  restart() {
    // Reset all data and go back to step 1
    this.formData = {};
    this.reset();
    this.showIndustryStep();
    
    // Remove restart button
    const restartBtn = document.querySelector('.restart-btn');
    if (restartBtn) {
      restartBtn.remove();
    }
  }

  // Placeholder for ContactFormStep (Step 6)
  showContactFormStep() {
    console.log('Showing Contact Form Step (Step 6)');
    
    // Hide all other steps
    this.hideAllSteps();
    
    // Temporary implementation - will be implemented in next iteration
    const tempContactForm = document.createElement('div');
    tempContactForm.id = 'temp-contact-form';
    tempContactForm.innerHTML = `
      <div style="text-align: center; padding: 3rem; background: white; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 2rem auto; max-width: 800px;">
        <h2 style="color: #2563eb; margin-bottom: 1rem;">🎉 Анализ завершен!</h2>
        <p style="font-size: 1.25rem; margin-bottom: 2rem; color: #64748b;">
          Мы проанализировали ваш бизнес и готовы предложить персональные рекомендации.
        </p>
        
        <div style="background: #f0f8ff; border: 1px solid #bfdbfe; border-radius: 0.5rem; padding: 1.5rem; margin: 2rem 0;">
          <h3 style="color: #1e40af; margin-bottom: 1rem;">Ваши результаты анализа:</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; text-align: left;">
            <div>
              <strong>Отрасль:</strong> ${this.formData.industry?.title || 'Не выбрана'}
            </div>
            <div>
              <strong>Размер бизнеса:</strong> ${this.formData.businessSize?.title || 'Не выбран'}
            </div>
            <div>
              <strong>Маркетинговый бюджет:</strong> ${this.formatCurrency(this.formData.marketingBudget?.monthly || 0)}/мес
            </div>
            <div>
              <strong>Инструментов используется:</strong> ${this.formData.marketingTools?.selected?.length || 0}
            </div>
            <div>
              <strong>Текущая команда:</strong> ${this.formData.marketingTeam?.current?.title || 'Не выбрана'}
            </div>
            <div>
              <strong>Потенциальная экономия:</strong> ${this.formatCurrency(this.formData.gapAnalysis?.savings?.cost?.monthly || 0)}/мес
            </div>
          </div>
        </div>
        
        <div style="margin: 2rem 0;">
          <h4 style="color: #059669; margin-bottom: 1rem;">Contact Form Step (Step 6) будет реализован следующим</h4>
          <p style="color: #64748b;">
            Здесь будет форма для сбора контактных данных и отправки результатов анализа.
          </p>
        </div>
        
        <button onclick="location.reload()" style="background: #2563eb; color: white; padding: 0.75rem 2rem; border: none; border-radius: 0.5rem; font-size: 1rem; cursor: pointer;">
          Начать заново
        </button>
      </div>
    `;
    
    // Remove any existing temp contact form
    const existingTemp = document.querySelector('#temp-contact-form');
    if (existingTemp) {
      existingTemp.remove();
    }
    
    // Add to container
    const container = document.querySelector('#calculator-container') || document.body;
    container.appendChild(tempContactForm);
    
    // Update page title
    document.title = 'Результаты анализа - Steamphony Calculator';
  }
}

// Запуск приложения
const app = new App();

// Экспорт для тестирования
export default App; 