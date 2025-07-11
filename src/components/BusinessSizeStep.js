/**
 * BusinessSizeStep Component - Упрощенная версия
 * Второй шаг формы - выбор размера бизнеса
 * 
 * @class BusinessSizeStep
 * @author Steamphony Digital Agency
 */

import { getIndustryConfig } from '../data/industries.js';

class BusinessSizeStep {
  constructor(container, options = {}) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('BusinessSizeStep: container должен быть DOM элементом');
    }

    this.container = container;
    this.selectedSize = null;
    this.industryKey = null;
    this.isRendered = false;

    this.onSelect = options.onSelect || (() => {});
    this.onNext = options.onNext || (() => {});
    this.onBack = options.onBack || (() => {});

    this.options = {
      enableValidation: true,
      showDescription: true,
      trackAnalytics: true,
      ...options
    };

    this.handleSizeSelect = this.handleSizeSelect.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    this.init();
  }

  /**
   * Инициализация компонента
   */
  init() {
    try {
      this.industryKey = this.getSelectedIndustry();
      this.render();
      this.attachEventListeners();
      this.trackEvent('step_2_viewed');
    } catch (error) {
      this.handleError('INIT_ERROR', error);
    }
  }

  /**
   * Получение выбранной отрасли
   */
  getSelectedIndustry() {
    if (typeof window !== 'undefined' && window.app && window.app.formData) {
      return window.app.formData.industry?.key || 'other';
    }
    return 'other';
  }

  /**
   * Получение опций размеров для текущей отрасли
   */
  getCurrentSizeOptions() {
    const industryConfig = getIndustryConfig(this.industryKey);
    return industryConfig?.sizeOptions || this.getDefaultSizeOptions();
  }

  /**
   * Получение опций размеров по умолчанию
   */
  getDefaultSizeOptions() {
    return [
      {
        value: 'small',
        label: 'Малый бизнес',
        description: '1-10 сотрудников, местный рынок',
        multiplier: 0.8,
        avgRevenue: 50000,
        employeesCount: '1-10'
      },
      {
        value: 'medium',
        label: 'Средний бизнес',
        description: '10-50 сотрудников, региональный рынок',
        multiplier: 1.2,
        avgRevenue: 120000,
        employeesCount: '10-50'
      },
      {
        value: 'large',
        label: 'Крупный бизнес',
        description: '50+ сотрудников, национальный рынок',
        multiplier: 1.8,
        avgRevenue: 300000,
        employeesCount: '50+'
      }
    ];
  }

  /**
   * Рендеринг компонента
   */
  render() {
    const sizeOptions = this.getCurrentSizeOptions();
    const industryTitle = this.getIndustryTitle();
    
    this.container.innerHTML = `
      <div class="business-size-step">
        <div class="step-header">
          <h2>Размер вашего бизнеса</h2>
          <p>${industryTitle}</p>
        </div>

        <div class="size-options">
          ${this.renderSizeOptions(sizeOptions)}
        </div>

        <div class="step-navigation">
          <button type="button" class="btn btn-secondary back-btn">Назад</button>
          <button type="button" class="btn btn-primary next-btn" disabled>Далее</button>
        </div>
      </div>
    `;

    this.isRendered = true;
  }

  /**
   * Рендеринг опций размеров
   */
  renderSizeOptions(options) {
    return options.map(option => `
      <div class="size-option" data-size-value="${option.value}">
        <div class="size-header">
          <h3>${option.label}</h3>
          <p class="size-description">${option.description}</p>
        </div>
        
        <div class="size-metrics">
          <div class="metric">
            <span class="label">Сотрудники:</span>
            <span class="value">${option.employeesCount}</span>
          </div>
          <div class="metric">
            <span class="label">Средний доход:</span>
            <span class="value">${this.formatCurrency(option.avgRevenue)}/год</span>
          </div>
          <div class="metric">
            <span class="label">Множитель:</span>
            <span class="value">${option.multiplier}x</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Прикрепление обработчиков событий
   */
  attachEventListeners() {
    const sizeOptions = this.container.querySelectorAll('.size-option');
    const nextBtn = this.container.querySelector('.next-btn');
    const backBtn = this.container.querySelector('.back-btn');

    sizeOptions.forEach(option => {
      option.addEventListener('click', this.handleSizeSelect);
    });

    if (nextBtn) nextBtn.addEventListener('click', this.handleNextClick);
    if (backBtn) backBtn.addEventListener('click', this.handleBackClick);

    document.addEventListener('keydown', this.handleKeydown);
  }

  /**
   * Обработка выбора размера
   */
  handleSizeSelect(event) {
    const sizeOption = event.currentTarget;
    const sizeValue = sizeOption.dataset.sizeValue;

    // Убираем выделение со всех опций
    this.container.querySelectorAll('.size-option').forEach(option => {
      option.classList.remove('selected');
    });

    // Выделяем выбранную опцию
    sizeOption.classList.add('selected');
    this.selectedSize = sizeValue;

    // Обновляем состояние кнопки "Далее"
    this.updateNextButtonState();

    this.onSelect(sizeValue);
    this.trackSizeSelection(sizeValue);
  }

  /**
   * Обработка нажатия клавиш
   */
  handleKeydown(event) {
    if (event.key === 'Enter' && this.selectedSize) {
      this.handleNextClick();
    } else if (event.key === 'Escape') {
      this.handleBackClick();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      this.navigateWithArrows(event.key === 'ArrowDown');
    }
  }

  /**
   * Навигация стрелками
   */
  navigateWithArrows(isDown) {
    const sizeOptions = Array.from(this.container.querySelectorAll('.size-option'));
    const currentIndex = sizeOptions.findIndex(option => option.classList.contains('selected'));
    
    let nextIndex;
    if (currentIndex === -1) {
      nextIndex = isDown ? 0 : sizeOptions.length - 1;
    } else {
      nextIndex = isDown 
        ? (currentIndex + 1) % sizeOptions.length 
        : (currentIndex - 1 + sizeOptions.length) % sizeOptions.length;
    }
    
    sizeOptions[nextIndex].click();
  }

  /**
   * Обновление состояния кнопки "Далее"
   */
  updateNextButtonState() {
    const nextBtn = this.container.querySelector('.next-btn');
    if (nextBtn) {
      nextBtn.disabled = !this.selectedSize;
    }
  }

  /**
   * Обработка нажатия "Далее"
   */
  handleNextClick(event) {
    if (!this.selectedSize) {
      this.showValidationError('Пожалуйста, выберите размер бизнеса');
      return;
    }

    try {
      const sizeData = this.prepareSizeData();
      this.saveDataToApp(sizeData);
      this.trackStepCompletion();
      this.onNext(sizeData);
    } catch (error) {
      this.handleError('NEXT_ERROR', error);
    }
  }

  /**
   * Обработка нажатия "Назад"
   */
  handleBackClick(event) {
    try {
      this.onBack();
    } catch (error) {
      this.handleError('BACK_ERROR', error);
    }
  }

  /**
   * Подготовка данных размера
   */
  prepareSizeData() {
    const sizeOptions = this.getCurrentSizeOptions();
    const selectedOption = sizeOptions.find(option => option.value === this.selectedSize);
    
    if (!selectedOption) {
      throw new Error('Неизвестный размер бизнеса');
    }

    return {
      key: this.selectedSize,
      label: selectedOption.label,
      description: selectedOption.description,
      multiplier: selectedOption.multiplier,
      avgRevenue: selectedOption.avgRevenue,
      employeesCount: selectedOption.employeesCount
    };
  }

  /**
   * Сохранение данных в приложение
   */
  saveDataToApp(sizeData) {
    if (window.app && window.app.appState) {
      window.app.appState.updateField('businessSize', sizeData);
    }
  }

  /**
   * Получение названия отрасли
   */
  getIndustryTitle() {
    const industryConfig = getIndustryConfig(this.industryKey);
    return industryConfig?.displayName || 'Выберите размер вашего бизнеса';
  }

  /**
   * Форматирование валюты
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Показ ошибки валидации
   */
  showValidationError(message) {
    const errorElement = this.container.querySelector('.validation-error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  /**
   * Скрытие ошибки валидации
   */
  hideValidationError() {
    const errorElement = this.container.querySelector('.validation-error');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  /**
   * Отслеживание события
   */
  trackEvent(eventName, params = {}) {
    if (!this.options.trackAnalytics) return;

    try {
      if (window.gtag) {
        window.gtag('event', eventName, {
          step: 2,
          industry: this.industryKey,
          ...params
        });
      }
    } catch (error) {
      console.error('Ошибка отслеживания события:', error);
    }
  }

  /**
   * Отслеживание выбора размера
   */
  trackSizeSelection(sizeValue) {
    this.trackEvent('size_selected', {
      size_value: sizeValue,
      industry: this.industryKey
    });
  }

  /**
   * Отслеживание завершения шага
   */
  trackStepCompletion() {
    this.trackEvent('step_completed', {
      step_name: 'business_size',
      selected_size: this.selectedSize
    });
  }

  /**
   * Обработка ошибок
   */
  handleError(errorCode, error) {
    console.error(`BusinessSizeStep Error [${errorCode}]:`, error);
    this.showError(`Ошибка: ${error.message}`);
  }

  /**
   * Показ ошибки
   */
  showError(message) {
    const errorContainer = this.container.querySelector('.error-container');
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="error-message">
          <h3>Ошибка</h3>
          <p>${message}</p>
        </div>
      `;
      errorContainer.style.display = 'block';
    }
  }

  /**
   * Получение выбранного размера
   */
  getSelectedSize() {
    return this.selectedSize;
  }

  /**
   * Установка размера
   */
  setSelectedSize(sizeValue) {
    const sizeOption = this.container.querySelector(`[data-size-value="${sizeValue}"]`);
    if (sizeOption) {
      sizeOption.click();
    }
  }

  /**
   * Показ компонента
   */
  show() {
    this.container.style.display = 'block';
  }

  /**
   * Скрытие компонента
   */
  hide() {
    this.container.style.display = 'none';
  }

  /**
   * Сброс компонента
   */
  reset() {
    this.selectedSize = null;
    
    this.container.querySelectorAll('.size-option').forEach(option => {
      option.classList.remove('selected');
    });
    
    this.updateNextButtonState();
  }

  /**
   * Уничтожение компонента
   */
  destroy() {
    try {
      document.removeEventListener('keydown', this.handleKeydown);
      this.container.innerHTML = '';
      this.isRendered = false;
    } catch (error) {
      console.error('Ошибка уничтожения BusinessSizeStep:', error);
    }
  }
}

export default BusinessSizeStep; 