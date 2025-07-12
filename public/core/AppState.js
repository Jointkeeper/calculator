/**
 * App State Management
 * Управление состоянием приложения и данными формы
 */

export class AppState {
  static instance = null;
  
  static getInstance() {
    if (!AppState.instance) {
      AppState.instance = new AppState();
    }
    return AppState.instance;
  }
  
  constructor() {
    // Данные формы
    this.formData = {
      industry: null,
      businessSize: null,
      marketingBudget: null,
      marketingTools: null,
      hasMarketer: null,
      tools: []
    };
    
    // Состояние приложения
    this.currentStep = 1;
    this.totalSteps = 6;
    this.isInitialized = false;
    
    // Компоненты (ссылки на экземпляры)
    this.components = {
      progressBar: null,
      industrySelector: null,
      businessSizeStep: null,
      marketingBudgetStep: null,
      marketingTeamStep: null,
      marketingToolsStep: null,
      contactFormStep: null,
      calculator: null
    };
    
    // Security компоненты
    this.security = {
      cspConfig: null,
      securityHeaders: null,
      threatDetector: null,
      securityMonitor: null
    };
    
    // Performance компоненты
    this.performance = {
      lazyLoader: null,
      cacheManager: null,
      performanceMonitor: null
    };
    
    // Analytics компоненты
    this.analytics = {
      analytics: null,
      cookieBanner: null
    };
    
    // Время начала работы с калькулятором
    this.startTime = Date.now();
    
    // История переходов
    this.navigationHistory = [];
  }

  /**
   * Получить данные формы
   */
  getFormData() {
    return { ...this.formData };
  }

  /**
   * Обновить данные формы
   */
  updateFormData(newData) {
    this.formData = { ...this.formData, ...newData };
    this.dispatchStateChange('formData', this.formData);
  }

  /**
   * Установить конкретное поле формы
   */
  setFormField(field, value) {
    this.formData[field] = value;
    this.dispatchStateChange('formField', { field, value });
  }

  /**
   * Получить текущий шаг
   */
  getCurrentStep() {
    return this.currentStep;
  }

  /**
   * Установить текущий шаг
   */
  setCurrentStep(step) {
    if (step >= 1 && step <= this.totalSteps) {
      const previousStep = this.currentStep;
      this.currentStep = step;
      console.log('[AppState] setCurrentStep:', step, 'from', previousStep);
      // Добавить в историю навигации
      this.navigationHistory.push({
        from: previousStep,
        to: step,
        timestamp: Date.now()
      });
      this.dispatchStateChange('currentStep', { 
        step, 
        previousStep,
        isForward: step > previousStep,
        isBackward: step < previousStep
      });
    }
  }

  /**
   * Перейти к следующему шагу
   */
  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.setCurrentStep(this.currentStep + 1);
      return true;
    }
    return false;
  }

  /**
   * Перейти к предыдущему шагу
   */
  previousStep() {
    if (this.currentStep > 1) {
      this.setCurrentStep(this.currentStep - 1);
      return true;
    }
    return false;
  }

  /**
   * Установить компонент
   */
  setComponent(name, component) {
    if (this.components.hasOwnProperty(name)) {
      this.components[name] = component;
      this.dispatchStateChange('component', { name, component });
    }
  }

  /**
   * Получить компонент
   */
  getComponent(name) {
    return this.components[name] || null;
  }

  /**
   * Установить security компонент
   */
  setSecurityComponent(name, component) {
    if (this.security.hasOwnProperty(name)) {
      this.security[name] = component;
      this.dispatchStateChange('security', { name, component });
    }
  }

  /**
   * Получить security компонент
   */
  getSecurityComponent(name) {
    return this.security[name] || null;
  }

  /**
   * Установить performance компонент
   */
  setPerformanceComponent(name, component) {
    if (this.performance.hasOwnProperty(name)) {
      this.performance[name] = component;
      this.dispatchStateChange('performance', { name, component });
    }
  }

  /**
   * Получить performance компонент
   */
  getPerformanceComponent(name) {
    return this.performance[name] || null;
  }

  /**
   * Установить analytics компонент
   */
  setAnalyticsComponent(name, component) {
    if (this.analytics.hasOwnProperty(name)) {
      this.analytics[name] = component;
      this.dispatchStateChange('analytics', { name, component });
    }
  }

  /**
   * Получить analytics компонент
   */
  getAnalyticsComponent(name) {
    return this.analytics[name] || null;
  }

  /**
   * Установить статус инициализации
   */
  setInitialized(status) {
    this.isInitialized = status;
    this.dispatchStateChange('initialized', status);
  }

  /**
   * Проверить, инициализировано ли приложение
   */
  isAppInitialized() {
    return this.isInitialized;
  }

  /**
   * Получить время работы с калькулятором
   */
  getSessionTime() {
    return Date.now() - this.startTime;
  }

  /**
   * Получить историю навигации
   */
  getNavigationHistory() {
    return [...this.navigationHistory];
  }

  /**
   * Получить полное состояние приложения
   */
  getAppState() {
    return {
      formData: this.getFormData(),
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      isInitialized: this.isInitialized,
      sessionTime: this.getSessionTime(),
      navigationHistory: this.getNavigationHistory(),
      components: {
        progressBar: !!this.components.progressBar,
        industrySelector: !!this.components.industrySelector,
        businessSizeStep: !!this.components.businessSizeStep,
        marketingBudgetStep: !!this.components.marketingBudgetStep,
        marketingTeamStep: !!this.components.marketingTeamStep,
        marketingToolsStep: !!this.components.marketingToolsStep,
        contactFormStep: !!this.components.contactFormStep,
        calculator: !!this.components.calculator
      },
      security: {
        csp: !!this.security.cspConfig,
        headers: !!this.security.securityHeaders,
        threatDetector: !!this.security.threatDetector,
        securityMonitor: !!this.security.securityMonitor
      },
      performance: {
        lazyLoader: !!this.performance.lazyLoader,
        cacheManager: !!this.performance.cacheManager,
        performanceMonitor: !!this.performance.performanceMonitor
      },
      analytics: {
        analytics: !!this.analytics.analytics,
        cookieBanner: !!this.analytics.cookieBanner
      }
    };
  }

  /**
   * Сбросить состояние приложения
   */
  reset() {
    // Сброс данных формы
    this.formData = {
      industry: null,
      businessSize: null,
      marketingBudget: null,
      marketingTools: null,
      hasMarketer: null,
      tools: []
    };
    
    // Сброс состояния
    this.currentStep = 1;
    this.isInitialized = false;
    
    // Сброс времени
    this.startTime = Date.now();
    
    // Сброс истории
    this.navigationHistory = [];
    
    // Сброс компонентов (но не удаляем ссылки)
    Object.keys(this.components).forEach(key => {
      this.components[key] = null;
    });
    
    this.dispatchStateChange('reset', this.getAppState());
  }

  /**
   * Восстановить состояние приложения (reset)
   */
  restore() {
    this.reset();
  }

  /**
   * Dispatch события изменения состояния
   * @private
   */
  dispatchStateChange(type, data) {
    const event = new CustomEvent('appStateChange', {
      detail: { type, data, timestamp: Date.now() }
    });
    document.dispatchEvent(event);
  }

  /**
   * Подписаться на изменения состояния
   */
  subscribe(callback) {
    document.addEventListener('appStateChange', callback);
    return () => {
      document.removeEventListener('appStateChange', callback);
    };
  }
} 