/**
 * Navigation Manager
 * Управление навигацией между шагами калькулятора
 */

export class NavigationManager {
  constructor(appState) {
    this.appState = appState;
    this.stepHandlers = new Map();
    this.setupStepHandlers();
  }

  /**
   * Настройка обработчиков для каждого шага
   * @private
   */
  setupStepHandlers() {
    this.stepHandlers.set(1, {
      show: () => this.showIndustrySelector(),
      hide: () => this.hideIndustrySelector(),
      validate: () => this.validateIndustryStep()
    });

    this.stepHandlers.set(2, {
      show: () => this.showBusinessSizeStep(),
      hide: () => this.hideBusinessSizeStep(),
      validate: () => this.validateBusinessSizeStep()
    });

    this.stepHandlers.set(3, {
      show: () => this.showMarketingBudgetStep(),
      hide: () => this.hideMarketingBudgetStep(),
      validate: () => this.validateMarketingBudgetStep()
    });

    this.stepHandlers.set(4, {
      show: () => this.showMarketingToolsStep(),
      hide: () => this.hideMarketingToolsStep(),
      validate: () => this.validateMarketingToolsStep()
    });

    this.stepHandlers.set(5, {
      show: () => this.showMarketingTeamStep(),
      hide: () => this.hideMarketingTeamStep(),
      validate: () => this.validateMarketingTeamStep()
    });

    this.stepHandlers.set(6, {
      show: () => this.showContactFormStep(),
      hide: () => this.hideContactFormStep(),
      validate: () => this.validateContactFormStep()
    });
  }

  /**
   * Перейти к следующему шагу
   */
  nextStep() {
    const currentStep = this.appState.getCurrentStep();
    const handler = this.stepHandlers.get(currentStep);
    
    if (handler && handler.validate()) {
      // Скрыть текущий шаг
      handler.hide();
      
      // Перейти к следующему
      const nextStep = currentStep + 1;
      this.appState.setCurrentStep(nextStep);
      
      // Показать следующий шаг
      const nextHandler = this.stepHandlers.get(nextStep);
      if (nextHandler) {
        nextHandler.show();
      }
      
      // Обновить прогресс-бар
      this.updateProgressBar(nextStep);
      
      return true;
    }
    
    return false;
  }

  /**
   * Перейти к предыдущему шагу
   */
  previousStep() {
    const currentStep = this.appState.getCurrentStep();
    const handler = this.stepHandlers.get(currentStep);
    
    if (handler) {
      // Скрыть текущий шаг
      handler.hide();
      
      // Перейти к предыдущему
      const previousStep = currentStep - 1;
      this.appState.setCurrentStep(previousStep);
      
      // Показать предыдущий шаг
      const previousHandler = this.stepHandlers.get(previousStep);
      if (previousHandler) {
        previousHandler.show();
      }
      
      // Обновить прогресс-бар
      this.updateProgressBar(previousStep);
      
      return true;
    }
    
    return false;
  }

  /**
   * Перейти к конкретному шагу
   */
  goToStep(step) {
    if (step >= 1 && step <= this.appState.totalSteps) {
      const currentStep = this.appState.getCurrentStep();
      const currentHandler = this.stepHandlers.get(currentStep);
      
      if (currentHandler) {
        currentHandler.hide();
      }
      
      this.appState.setCurrentStep(step);
      
      const targetHandler = this.stepHandlers.get(step);
      if (targetHandler) {
        targetHandler.show();
      }
      
      this.updateProgressBar(step);
      
      return true;
    }
    
    return false;
  }

  /**
   * Показать шаг выбора отрасли
   * @private
   */
  showIndustrySelector() {
    const industrySelector = this.appState.getComponent('industrySelector');
    if (industrySelector) {
      industrySelector.show();
    }
    
    // Скрыть остальные шаги
    this.hideAllSteps();
    
    // Показать контейнер отрасли
    const container = document.getElementById('industry-selector-container');
    if (container) {
      container.style.display = 'block';
    }
  }

  /**
   * Скрыть шаг выбора отрасли
   * @private
   */
  hideIndustrySelector() {
    const container = document.getElementById('industry-selector-container');
    if (container) {
      container.style.display = 'none';
    }
  }

  /**
   * Показать шаг размера бизнеса
   * @private
   */
  showBusinessSizeStep() {
    const businessSizeStep = this.appState.getComponent('businessSizeStep');
    if (businessSizeStep) {
      businessSizeStep.show();
    }
    
    // Скрыть остальные шаги
    this.hideAllSteps();
    
    // Показать контейнер размера бизнеса
    const container = document.getElementById('business-size-container');
    if (container) {
      container.style.display = 'block';
    }
  }

  /**
   * Скрыть шаг размера бизнеса
   * @private
   */
  hideBusinessSizeStep() {
    const container = document.getElementById('business-size-container');
    if (container) {
      container.style.display = 'none';
    }
  }

  /**
   * Показать шаг маркетингового бюджета
   * @private
   */
  showMarketingBudgetStep() {
    const marketingBudgetStep = this.appState.getComponent('marketingBudgetStep');
    if (marketingBudgetStep) {
      marketingBudgetStep.show();
    }
    
    // Скрыть остальные шаги
    this.hideAllSteps();
    
    // Показать контейнер бюджета
    const container = document.getElementById('marketing-budget-container');
    if (container) {
      container.style.display = 'block';
    }
  }

  /**
   * Скрыть шаг маркетингового бюджета
   * @private
   */
  hideMarketingBudgetStep() {
    const container = document.getElementById('marketing-budget-container');
    if (container) {
      container.style.display = 'none';
    }
  }

  /**
   * Показать шаг маркетинговых инструментов
   * @private
   */
  showMarketingToolsStep() {
    const marketingToolsStep = this.appState.getComponent('marketingToolsStep');
    if (marketingToolsStep) {
      marketingToolsStep.show();
    }
    
    // Скрыть остальные шаги
    this.hideAllSteps();
    
    // Показать контейнер инструментов
    const container = document.getElementById('marketing-tools-container');
    if (container) {
      container.style.display = 'block';
    }
  }

  /**
   * Скрыть шаг маркетинговых инструментов
   * @private
   */
  hideMarketingToolsStep() {
    const container = document.getElementById('marketing-tools-container');
    if (container) {
      container.style.display = 'none';
    }
  }

  /**
   * Показать шаг маркетинговой команды
   * @private
   */
  showMarketingTeamStep() {
    const marketingTeamStep = this.appState.getComponent('marketingTeamStep');
    if (marketingTeamStep) {
      marketingTeamStep.show();
    }
    
    // Скрыть остальные шаги
    this.hideAllSteps();
    
    // Показать контейнер команды
    const container = document.getElementById('marketing-team-container');
    if (container) {
      container.style.display = 'block';
    }
  }

  /**
   * Скрыть шаг маркетинговой команды
   * @private
   */
  hideMarketingTeamStep() {
    const container = document.getElementById('marketing-team-container');
    if (container) {
      container.style.display = 'none';
    }
  }

  /**
   * Показать шаг контактной формы
   * @private
   */
  showContactFormStep() {
    const contactFormStep = this.appState.getComponent('contactFormStep');
    if (contactFormStep) {
      contactFormStep.show();
    }
    
    // Скрыть остальные шаги
    this.hideAllSteps();
    
    // Показать контейнер контактной формы
    const container = document.getElementById('contact-form-container');
    if (container) {
      container.style.display = 'block';
    }
  }

  /**
   * Скрыть шаг контактной формы
   * @private
   */
  hideContactFormStep() {
    const container = document.getElementById('contact-form-container');
    if (container) {
      container.style.display = 'none';
    }
  }

  /**
   * Скрыть все шаги
   * @private
   */
  hideAllSteps() {
    const containers = [
      'industry-selector-container',
      'business-size-container',
      'marketing-budget-container',
      'marketing-tools-container',
      'marketing-team-container',
      'contact-form-container'
    ];
    
    containers.forEach(containerId => {
      const container = document.getElementById(containerId);
      if (container) {
        container.style.display = 'none';
      }
    });
  }

  /**
   * Обновить прогресс-бар
   * @private
   */
  updateProgressBar(step) {
    const progressBar = this.appState.getComponent('progressBar');
    if (progressBar) {
      progressBar.updateProgress(step, this.appState.totalSteps);
    }
  }

  /**
   * Валидация шага выбора отрасли
   * @private
   */
  validateIndustryStep() {
    const formData = this.appState.getFormData();
    return formData.industry !== null && formData.industry !== '';
  }

  /**
   * Валидация шага размера бизнеса
   * @private
   */
  validateBusinessSizeStep() {
    const formData = this.appState.getFormData();
    return formData.businessSize !== null && formData.businessSize !== '';
  }

  /**
   * Валидация шага маркетингового бюджета
   * @private
   */
  validateMarketingBudgetStep() {
    const formData = this.appState.getFormData();
    return formData.marketingBudget !== null && formData.marketingBudget !== '';
  }

  /**
   * Валидация шага маркетинговых инструментов
   * @private
   */
  validateMarketingToolsStep() {
    const formData = this.appState.getFormData();
    return formData.tools && formData.tools.length > 0;
  }

  /**
   * Валидация шага маркетинговой команды
   * @private
   */
  validateMarketingTeamStep() {
    const formData = this.appState.getFormData();
    return formData.hasMarketer !== null;
  }

  /**
   * Валидация шага контактной формы
   * @private
   */
  validateContactFormStep() {
    // Контактная форма может быть необязательной
    return true;
  }

  /**
   * Получить информацию о текущем шаге
   */
  getCurrentStepInfo() {
    const currentStep = this.appState.getCurrentStep();
    const handler = this.stepHandlers.get(currentStep);
    
    return {
      step: currentStep,
      totalSteps: this.appState.totalSteps,
      canGoNext: handler ? handler.validate() : false,
      canGoPrevious: currentStep > 1,
      isFirstStep: currentStep === 1,
      isLastStep: currentStep === this.appState.totalSteps
    };
  }

  /**
   * Получить статистику навигации
   */
  getNavigationStats() {
    const history = this.appState.getNavigationHistory();
    
    return {
      totalNavigations: history.length,
      forwardNavigations: history.filter(h => h.isForward).length,
      backwardNavigations: history.filter(h => h.isBackward).length,
      averageTimePerStep: this.calculateAverageTimePerStep(history),
      mostVisitedStep: this.findMostVisitedStep(history)
    };
  }

  /**
   * Рассчитать среднее время на шаг
   * @private
   */
  calculateAverageTimePerStep(history) {
    if (history.length < 2) return 0;
    
    const totalTime = history.reduce((sum, entry, index) => {
      if (index > 0) {
        return sum + (entry.timestamp - history[index - 1].timestamp);
      }
      return sum;
    }, 0);
    
    return totalTime / (history.length - 1);
  }

  /**
   * Найти наиболее посещаемый шаг
   * @private
   */
  findMostVisitedStep(history) {
    const stepCounts = {};
    
    history.forEach(entry => {
      stepCounts[entry.to] = (stepCounts[entry.to] || 0) + 1;
    });
    
    let mostVisited = 1;
    let maxCount = 0;
    
    Object.entries(stepCounts).forEach(([step, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostVisited = parseInt(step);
      }
    });
    
    return { step: mostVisited, visits: maxCount };
  }
} 