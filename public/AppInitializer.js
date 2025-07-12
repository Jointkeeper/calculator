/**
 * AppInitializer - Модуль инициализации приложения
 * Отвечает за инициализацию всех компонентов и сервисов
 */

import { AppState } from './AppState.js';
import { NavigationManager } from '../managers/NavigationManager.js';
import { calculator } from '../core/Calculator.js';
import { getEventHandlers } from '../handlers/EventHandlers.js';
import { uiManager } from '../components/UIManager.js';
import { SecurityLayer } from '../security/index.js';
import Analytics from '../services/Analytics.js';
import CookieBanner from '../components/CookieBanner.js';
import { CSPConfig } from '../security/CSPConfig.js?v=1.0.3';
import { LazyLoader } from '../utils/LazyLoader.js?v=1.0.4';
import { SecurityHeaders } from '../security/SecurityHeaders.js?v=1.0.4';
import { CacheManager } from '../utils/CacheManager.js?v=1.0.4';
import { ThreatDetector } from '../security/ThreatDetector.js?v=1.0.4';
import { SecurityMonitor } from '../security/SecurityMonitor.js?v=1.0.4';

class AppInitializer {
  constructor() {
    this.appState = AppState.getInstance();
    this.navigationManager = NavigationManager.getInstance();
    this.calculator = calculator;
            this.eventHandlers = getEventHandlers();
    this.uiManager = uiManager;
    this.securityLayer = SecurityLayer;
  }

  /**
   * Инициализация приложения
   */
  async initialize() {
    try {
      console.log('🚀 Инициализация приложения...');
      
      // Инициализация базовых компонентов
      await this.initializeAdvancedSecurity();
      await this.initializePerformanceOptimization();
      
      // Скрыть экран загрузки
      this.hideLoadingState();
      
      // Показать кнопку запуска калькулятора
      this.showStartButton();
      
      // Инициализация Event Handlers
      this.eventHandlers.initialize();
      
      // Настройка обработчика кнопки запуска
      this.setupStartButtonHandler();
      
      console.log('✅ Приложение готово к запуску калькулятора');
      
      // Dispatch события готовности
      this.dispatchEvent('appReady', this.appState.getAppState());
      
    } catch (error) {
      console.error('App: Ошибка инициализации компонентов:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Запуск калькулятора после нажатия кнопки
   */
  async startCalculator() {
    try {
      console.log('🎯 Запуск калькулятора...');
      
      // Показать состояние загрузки
      this.showLoadingState();
      
      // Инициализация UI менеджера
      await this.uiManager.initialize();
      
      // Инициализация калькулятора
      await this.initializeCalculator();
      
      // Маркировка как инициализированное
      this.appState.setInitialized(true);
      
      // Переподключение Analytics к компонентам после их инициализации
      this.connectAnalyticsEvents();
      
      // Показать контент калькулятора
      this.showCalculatorContent();
      console.log('[DEBUG] Контент калькулятора показан');
      
      // Скрыть кнопку запуска
      const startButton = document.getElementById('start-calculator');
      if (startButton) {
        startButton.style.display = 'none';
      }
      
      // Явно показать первый шаг через StepManager
      if (window.app && window.app.stepManager) {
        console.log('[DEBUG] Вызов window.app.stepManager.showStep(1)');
        window.app.stepManager.showStep(1);
      } else {
        console.warn('[DEBUG] window.app.stepManager не найден');
        // Прямая инициализация первого шага
        const componentManager = window.app?.componentManager;
        if (componentManager) {
          componentManager.showComponent('industrySelector');
        }
      }
      console.log('✅ Калькулятор успешно запущен');
      
    } catch (error) {
      console.error('❌ Ошибка запуска калькулятора:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Инициализация Advanced Security Features
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
   */
  async initializePerformanceOptimization() {
    try {
      console.log('⚡ Инициализация Performance Optimization Features...');
      
      // Performance optimization configuration
      const performanceConfig = {
        lazyLoading: {
          enabled: true,
          preloadModules: [
            './core/Calculator.js',
            './services/Analytics.js'
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
      await this.cacheManager.initialize({
        ...performanceConfig.caching,
        registerServiceWorker: false // Prevent automatic registration
      });
      
      // Register existing Service Worker
      await this.cacheManager.registerServiceWorker('./sw.js');
      
      // Initialize Performance Monitor
      this.performanceMonitor = new PerformanceMonitor();
      this.performanceMonitor.initialize(performanceConfig.monitoring);
      
      // Set up performance monitoring
      this.setupPerformanceMonitoring();
      
      console.log('✅ Performance Optimization Features инициализированы');
      
    } catch (error) {
      console.error('❌ Ошибка инициализации Performance Optimization Features:', error);
      // Don't throw error - performance features are optional for app functionality
    }
  }

  /**
   * Инициализация Calculator
   */
  async initializeCalculator() {
    try {
      // Используем модульный калькулятор
      this.calculator = calculator;
      
      console.log('✅ Calculator инициализирован');
      
    } catch (error) {
      console.error('Ошибка инициализации Calculator:', error);
      throw error;
    }
  }

  /**
   * Инициализация Analytics и Cookie Banner
   */
  initializeAnalytics() {
    try {
      // Initialize Analytics
      this.analytics = new Analytics({
        trackingId: 'G-XXXXXXXXXX',
        anonymizeIP: true,
        respectDoNotTrack: true,
        enableDebugMode: false
      });
      
      // Initialize Cookie Banner
      this.cookieBanner = new CookieBanner({
        position: 'bottom',
        theme: 'light',
        language: 'ru',
        analytics: this.analytics
      });
      
      // Connect Analytics to ProgressBar
      if (this.progressBar) {
        this.analytics.connectToProgressBar(this.progressBar);
        console.log('🔗 Analytics подключен к ProgressBar');
      }
      
      // Connect Analytics to IndustrySelector
      if (this.industrySelector) {
        this.analytics.connectToIndustrySelector(this.industrySelector);
        console.log('🔗 Analytics подключен к IndustrySelector');
      }
      
      console.log('✅ Analytics и Cookie Banner инициализированы');
      
    } catch (error) {
      console.error('❌ Ошибка инициализации Analytics:', error);
      // Don't throw error - analytics are optional for app functionality
    }
  }

  /**
   * Подключение Analytics событий
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
      
    } catch (error) {
      console.error('❌ Ошибка подключения Analytics событий:', error);
    }
  }

  /**
   * Настройка мониторинга производительности
   */
  setupPerformanceMonitoring() {
    if (!this.performanceMonitor) return;
    
    try {
      // Monitor Core Web Vitals
      this.performanceMonitor.monitorCoreWebVitals();
      
      // Monitor bundle size
      this.performanceMonitor.measureBundleSize();
      
      // Monitor load times
      this.performanceMonitor.monitorLoadTimes();
      
      // Set up performance reporting
      this.performanceMonitor.setupReporting();
      
    } catch (error) {
      console.error('❌ Ошибка настройки мониторинга производительности:', error);
    }
  }

  /**
   * Настройка глобального мониторинга безопасности
   */
  setupGlobalSecurityMonitoring() {
    if (!this.securityMonitor) return;
    
    try {
      // Monitor form submissions
      document.addEventListener('submit', (event) => {
        this.securityMonitor.monitorFormSubmission(event);
      });
      
      // Monitor input activity
      document.addEventListener('input', (event) => {
        this.securityMonitor.monitorInputActivity(event);
      });
      
      // Monitor navigation
      document.addEventListener('click', (event) => {
        this.securityMonitor.monitorNavigation(event);
      });
      
    } catch (error) {
      console.error('❌ Ошибка настройки мониторинга безопасности:', error);
    }
  }

  /**
   * Скрытие состояния загрузки
   */
  hideLoadingState() {
    const loadingElement = document.getElementById('loading-state');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }

  /**
   * Показ состояния загрузки
   */
  showLoadingState() {
    const startButton = document.getElementById('start-calculator');
    const loadingElement = document.getElementById('loading-state');
    
    if (startButton) {
      startButton.style.display = 'none';
    }
    
    if (loadingElement) {
      loadingElement.classList.remove('hidden');
    }
  }

  /**
   * Показ кнопки запуска калькулятора
   */
  showStartButton() {
    const startButton = document.getElementById('start-calculator');
    if (startButton) {
      startButton.style.display = 'block';
    }
  }

  /**
   * Настройка обработчика кнопки запуска
   */
  setupStartButtonHandler() {
    const startButton = document.getElementById('start-calculator-btn');
    if (startButton) {
      startButton.addEventListener('click', async (event) => {
        event.preventDefault();
        
        // Добавляем анимацию нажатия
        startButton.classList.add('scale-95');
        
        // Запускаем калькулятор
        await this.startCalculator();
        
        // Убираем анимацию
        setTimeout(() => {
          startButton.classList.remove('scale-95');
        }, 150);
      });
      
      console.log('✅ Обработчик кнопки запуска настроен');
    }
  }

  /**
   * Показ контента калькулятора
   */
  showCalculatorContent() {
    const calculatorElement = document.getElementById('calculator-content');
    if (calculatorElement) {
      calculatorElement.classList.remove('hidden');
    }
    // Показываем прогресс-бар
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) {
      progressContainer.classList.remove('hidden');
    }
  }

  /**
   * Обработка ошибок инициализации
   */
  handleInitializationError(error) {
    console.error('❌ Критическая ошибка инициализации:', error);
    
    // Показать пользователю сообщение об ошибке
    this.showError('Произошла ошибка при загрузке приложения. Пожалуйста, обновите страницу.');
    
    // Отправить ошибку в аналитику
    if (this.analytics) {
      this.analytics.trackError('initialization_error', error.message);
    }
  }

  /**
   * Показ ошибки пользователю
   */
  showError(message) {
    const errorContainer = document.getElementById('error-state');
    if (errorContainer) {
      errorContainer.classList.remove('hidden');
    }
  }

  /**
   * Dispatch события
   */
  dispatchEvent(eventName, detail = {}) {
    try {
      const event = new CustomEvent(eventName, {
        detail: {
          timestamp: Date.now(),
          ...detail
        },
        bubbles: true,
        cancelable: true
      });
      
      document.dispatchEvent(event);
      
    } catch (error) {
      console.error('❌ Ошибка dispatch события:', error);
    }
  }
}

export default AppInitializer; 