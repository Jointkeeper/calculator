/**
 * ProgressBar Component для Universal Calculator
 * Управляет прогрессом 6-шагового процесса расчета
 * 
 * @class ProgressBar
 * @author Steamphony Digital Agency
 */
class ProgressBar {
  /**
   * Создает экземпляр ProgressBar
   * 
   * @param {HTMLElement} container - DOM элемент для размещения компонента
   * @param {number} totalSteps - Общее количество шагов (по умолчанию 6)
   * @param {Object} options - Дополнительные опции
   */
  constructor(container, totalSteps = 6, options = {}) {
    // Валидация входных параметров
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('ProgressBar: container должен быть DOM элементом');
    }

    if (totalSteps < 1 || totalSteps > 10) {
      throw new Error('ProgressBar: totalSteps должен быть от 1 до 10');
    }

    // Основные свойства
    this.container = container;
    this.totalSteps = totalSteps;
    this.currentStep = 1;
    this.isAnimating = false;

    // Конфигурация шагов
    this.steps = [
      { id: 1, title: 'Отрасль', shortTitle: 'Отрасль', icon: '🏢', description: 'Выберите вашу отрасль' },
      { id: 2, title: 'Размер', shortTitle: 'Размер', icon: '📊', description: 'Укажите размер компании' },
      { id: 3, title: 'Бюджет', shortTitle: 'Бюджет', icon: '💰', description: 'Текущий маркетинговый бюджет' },
      { id: 4, title: 'Инструменты', shortTitle: 'Инструменты', icon: '🛠️', description: 'Используемые инструменты' },
      { id: 5, title: 'Результат', shortTitle: 'Результат', icon: '📈', description: 'Расчет экономии' },
      { id: 6, title: 'Контакты', shortTitle: 'Контакты', icon: '📞', description: 'Оставьте контакты' }
    ];

    // Опции конфигурации
    this.options = {
      animationDuration: 300,
      allowClickNavigation: true,
      showPercentage: true,
      showStepNumbers: true,
      enableKeyboardNavigation: true,
      trackAnalytics: true,
      ...options
    };

    // Обработчики событий
    this.handleStepClick = this.handleStepClick.bind(this);
    this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);

    // Инициализация
    this.init();
  }

  /**
   * Инициализация компонента
   * @private
   */
  init() {
    try {
      this.render();
      this.attachEventListeners();
      this.updateProgress(this.currentStep, { animate: false });
      
      // Dispatch готовности компонента
      this.dispatchEvent('progressBarReady', {
        totalSteps: this.totalSteps,
        currentStep: this.currentStep
      });
    } catch (error) {
      console.error('ProgressBar: Ошибка инициализации:', error);
      this.renderError(error.message);
    }
  }

  /**
   * Рендеринг HTML структуры
   * @private
   */
  render() {
    const progressHTML = `
      <div class="progress-bar-wrapper" role="progressbar" 
           aria-valuemin="1" 
           aria-valuemax="${this.totalSteps}" 
           aria-valuenow="${this.currentStep}"
           aria-label="Прогресс заполнения калькулятора">
        
        <!-- Progress Info -->
        <div class="progress-info">
          <div class="progress-text">
            <span class="progress-current">Шаг ${this.currentStep} из ${this.totalSteps}</span>
            ${this.options.showPercentage ? `<span class="progress-percentage">${this.getPercentage()}% завершено</span>` : ''}
          </div>
          <div class="progress-description">
            <span class="progress-step-title">${this.steps[this.currentStep - 1].title}</span>
            <span class="progress-step-description">${this.steps[this.currentStep - 1].description}</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-track">
          <div class="progress-fill" style="width: ${this.getPercentage()}%"></div>
        </div>

        <!-- Step Indicators -->
        <div class="progress-steps">
          ${this.steps.map(step => this.renderStep(step)).join('')}
        </div>
      </div>
    `;

    this.container.innerHTML = progressHTML;
    this.cacheElements();
  }

  /**
   * Рендеринг отдельного шага
   * @private
   * @param {Object} step - Данные шага
   * @returns {string} HTML шага
   */
  renderStep(step) {
    const isCompleted = step.id < this.currentStep;
    const isCurrent = step.id === this.currentStep;
    const isClickable = this.options.allowClickNavigation && (isCompleted || isCurrent);

    return `
      <div class="progress-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isClickable ? 'clickable' : ''}"
           data-step="${step.id}"
           ${isClickable ? 'tabindex="0"' : ''}
           role="button"
           aria-label="${step.title}${isCompleted ? ' (завершен)' : isCurrent ? ' (текущий)' : ''}"
           aria-current="${isCurrent ? 'step' : 'false'}">
        
        <div class="step-indicator">
          ${isCompleted ? 
            '<svg class="step-check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>' :
            this.options.showStepNumbers ? `<span class="step-number">${step.id}</span>` : `<span class="step-icon">${step.icon}</span>`
          }
        </div>
        
        <div class="step-label">
          <span class="step-title">${step.title}</span>
          <span class="step-title-mobile">${step.shortTitle}</span>
        </div>
      </div>
    `;
  }

  /**
   * Кэширование DOM элементов
   * @private
   */
  cacheElements() {
    this.elements = {
      wrapper: this.container.querySelector('.progress-bar-wrapper'),
      progressFill: this.container.querySelector('.progress-fill'),
      progressText: this.container.querySelector('.progress-current'),
      progressPercentage: this.container.querySelector('.progress-percentage'),
      progressTitle: this.container.querySelector('.progress-step-title'),
      progressDescription: this.container.querySelector('.progress-step-description'),
      steps: this.container.querySelectorAll('.progress-step')
    };
  }

  /**
   * Подключение обработчиков событий
   * @private
   */
  attachEventListeners() {
    // Click navigation
    if (this.options.allowClickNavigation) {
      this.elements.steps.forEach(step => {
        step.addEventListener('click', this.handleStepClick);
        step.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleStepClick(e);
          }
        });
      });
    }

    // Keyboard navigation
    if (this.options.enableKeyboardNavigation) {
      this.container.addEventListener('keydown', this.handleKeyboardNavigation);
    }
  }

  /**
   * Обработка клика по шагу
   * @private
   * @param {Event} event - Событие клика
   */
  handleStepClick(event) {
    const stepElement = event.currentTarget;
    const stepNumber = parseInt(stepElement.dataset.step);
    
    if (this.isValidNavigation(stepNumber)) {
      this.updateProgress(stepNumber, { source: 'click' });
    }
  }

  /**
   * Обработка клавиатурной навигации
   * @private
   * @param {KeyboardEvent} event - Событие клавиатуры
   */
  handleKeyboardNavigation(event) {
    if (this.isAnimating) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        this.nextStep();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.previousStep();
        break;
      case 'Home':
        event.preventDefault();
        this.updateProgress(1, { source: 'keyboard' });
        break;
      case 'End':
        event.preventDefault();
        this.updateProgress(this.totalSteps, { source: 'keyboard' });
        break;
    }
  }

  /**
   * Проверка валидности навигации
   * @private
   * @param {number} targetStep - Целевой шаг
   * @returns {boolean} Можно ли перейти к шагу
   */
  isValidNavigation(targetStep) {
    return targetStep >= 1 && 
           targetStep <= this.totalSteps && 
           targetStep <= this.currentStep + 1 && // Можно идти только вперед на 1 шаг или назад
           !this.isAnimating;
  }

  /**
   * Обновление прогресса
   * @public
   * @param {number} newStep - Новый шаг (1-6)
   * @param {Object} options - Опции обновления
   */
  updateProgress(newStep, options = {}) {
    const config = {
      animate: true,
      source: 'api',
      ...options
    };

    // Валидация
    if (newStep < 1 || newStep > this.totalSteps) {
      console.warn(`ProgressBar: Неверный шаг ${newStep}. Допустимы шаги от 1 до ${this.totalSteps}`);
      return;
    }

    if (this.isAnimating && config.animate) {
      console.warn('ProgressBar: Анимация уже выполняется');
      return;
    }

    const previousStep = this.currentStep;
    this.currentStep = newStep;

    // Обновление UI
    this.updateProgressUI(config.animate);

    // Dispatch события
    this.dispatchEvent('stepNavigated', {
      previousStep,
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      percentage: this.getPercentage(),
      source: config.source
    });

    // Analytics tracking
    if (this.options.trackAnalytics) {
      this.trackAnalytics(previousStep, this.currentStep, config.source);
    }
  }

  /**
   * Обновление UI элементов
   * @private
   * @param {boolean} animate - Использовать анимацию
   */
  updateProgressUI(animate = true) {
    if (animate) {
      this.isAnimating = true;
    }

    // Обновление progress bar
    const percentage = this.getPercentage();
    this.elements.progressFill.style.width = `${percentage}%`;

    // Обновление текстовой информации
    this.elements.progressText.textContent = `Шаг ${this.currentStep} из ${this.totalSteps}`;
    
    if (this.elements.progressPercentage) {
      this.elements.progressPercentage.textContent = `${percentage}% завершено`;
    }

    // Обновление заголовка и описания
    const currentStepData = this.steps[this.currentStep - 1];
    this.elements.progressTitle.textContent = currentStepData.title;
    this.elements.progressDescription.textContent = currentStepData.description;

    // Обновление ARIA атрибутов
    this.elements.wrapper.setAttribute('aria-valuenow', this.currentStep);

    // Обновление классов шагов
    this.elements.steps.forEach((stepElement, index) => {
      const stepNumber = index + 1;
      const isCompleted = stepNumber < this.currentStep;
      const isCurrent = stepNumber === this.currentStep;

      stepElement.classList.toggle('completed', isCompleted);
      stepElement.classList.toggle('current', isCurrent);
      stepElement.setAttribute('aria-current', isCurrent ? 'step' : 'false');

      // Обновление иконки/номера шага
      const indicator = stepElement.querySelector('.step-indicator');
      if (isCompleted) {
        indicator.innerHTML = '<svg class="step-check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>';
      } else if (this.options.showStepNumbers) {
        indicator.innerHTML = `<span class="step-number">${stepNumber}</span>`;
      } else {
        indicator.innerHTML = `<span class="step-icon">${this.steps[index].icon}</span>`;
      }
    });

    // Завершение анимации
    if (animate) {
      setTimeout(() => {
        this.isAnimating = false;
      }, this.options.animationDuration);
    }
  }

  /**
   * Переход к следующему шагу
   * @public
   * @returns {boolean} Успешность перехода
   */
  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.updateProgress(this.currentStep + 1, { source: 'next' });
      return true;
    }
    return false;
  }

  /**
   * Переход к предыдущему шагу
   * @public
   * @returns {boolean} Успешность перехода
   */
  previousStep() {
    if (this.currentStep > 1) {
      this.updateProgress(this.currentStep - 1, { source: 'previous' });
      return true;
    }
    return false;
  }

  /**
   * Сброс прогресса к первому шагу
   * @public
   */
  reset() {
    this.updateProgress(1, { source: 'reset' });
  }

  /**
   * Получение текущего шага
   * @public
   * @returns {number} Текущий шаг
   */
  getCurrentStep() {
    return this.currentStep;
  }

  /**
   * Получение процента завершения
   * @public
   * @returns {number} Процент завершения
   */
  getPercentage() {
    return Math.round((this.currentStep / this.totalSteps) * 100);
  }

  /**
   * Получение информации о прогрессе
   * @public
   * @returns {Object} Объект с информацией о прогрессе
   */
  getProgressInfo() {
    return {
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      percentage: this.getPercentage(),
      isCompleted: this.currentStep === this.totalSteps,
      currentStepData: this.steps[this.currentStep - 1]
    };
  }

  /**
   * Установка опций
   * @public
   * @param {Object} newOptions - Новые опции
   */
  setOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    this.render(); // Перерендеринг с новыми опциями
  }

  /**
   * Уничтожение компонента
   * @public
   */
  destroy() {
    // Удаление обработчиков событий
    this.elements.steps.forEach(step => {
      step.removeEventListener('click', this.handleStepClick);
    });
    
    this.container.removeEventListener('keydown', this.handleKeyboardNavigation);
    
    // Очистка DOM
    this.container.innerHTML = '';
    
    // Dispatch события уничтожения
    this.dispatchEvent('progressBarDestroyed', {
      finalStep: this.currentStep,
      totalSteps: this.totalSteps
    });
  }

  /**
   * Отправка пользовательского события
   * @private
   * @param {string} eventName - Название события
   * @param {Object} detail - Данные события
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });
    
    this.container.dispatchEvent(event);
  }

  /**
   * Трекинг аналитики
   * @private
   * @param {number} from - Предыдущий шаг
   * @param {number} to - Текущий шаг
   * @param {string} source - Источник перехода
   */
  trackAnalytics(from, to, source) {
    // Placeholder для Google Analytics / Яндекс.Метрики
    if (typeof gtag !== 'undefined') {
      gtag('event', 'progress_navigation', {
        event_category: 'Calculator',
        event_label: `Step ${from} to ${to}`,
        custom_parameter_1: source,
        value: to
      });
    }
    
    // Placeholder для Яндекс.Метрики
    if (typeof ym !== 'undefined') {
      ym('reachGoal', 'progress_step', {
        step: to,
        previous_step: from,
        source: source
      });
    }
  }

  /**
   * Рендеринг ошибки
   * @private
   * @param {string} message - Сообщение об ошибке
   */
  renderError(message) {
    this.container.innerHTML = `
      <div class="progress-bar-error">
        <div class="error-icon">⚠️</div>
        <div class="error-message">
          <h3>Ошибка загрузки прогресс-бара</h3>
          <p>${message}</p>
          <button onclick="location.reload()" class="btn btn-primary btn-sm">
            Обновить страницу
          </button>
        </div>
      </div>
    `;
  }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProgressBar;
}

// Глобальная доступность
if (typeof window !== 'undefined') {
  window.ProgressBar = ProgressBar;
} 