/**
 * MarketingBudgetStep Component - Упрощенная версия
 * Третий шаг формы - выбор маркетингового бюджета
 * 
 * @class MarketingBudgetStep
 * @author Steamphony Digital Agency
 */

import { getIndustryConfig } from '../data/industries.js';

class MarketingBudgetStep {
  constructor(container, options = {}) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('MarketingBudgetStep: container должен быть DOM элементом');
    }

    this.container = container;
    this.currentIndustry = null;
    this.currentBusinessSize = null;
    this.selectedBudget = null;
    this.potentialSavings = 0;
    this.isRendered = false;

    this.onSelect = options.onSelect || (() => {});
    this.onNext = options.onNext || (() => {});
    this.onBack = options.onBack || (() => {});

    this.options = {
      enableValidation: true,
      showSavingsPreview: true,
      trackAnalytics: true,
      animateSliders: true,
      showBudgetBreakdown: true,
      ...options
    };

    this.handleSliderChange = this.handleSliderChange.bind(this);
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
      this.loadPreviousStepData();
      this.render();
      this.attachEventListeners();
      this.trackEvent('step_3_viewed');
    } catch (error) {
      this.handleError('INIT_ERROR', error);
    }
  }

  /**
   * Загрузка данных из предыдущих шагов
   */
  loadPreviousStepData() {
    if (typeof window !== 'undefined' && window.app && window.app.formData) {
      this.currentIndustry = window.app.formData.industry;
      this.currentBusinessSize = window.app.formData.businessSize;
    }

    if (!this.currentIndustry) {
      this.currentIndustry = { key: 'other', title: 'Другое' };
    }
    if (!this.currentBusinessSize) {
      this.currentBusinessSize = { key: 'medium', title: 'Средний бизнес' };
    }
  }

  /**
   * Получение диапазона бюджета для текущей отрасли и размера
   */
  getCurrentBudgetRange() {
    const industryConfig = getIndustryConfig(this.currentIndustry.key);
    if (!industryConfig || !industryConfig.marketingBudgetRanges) {
      return this.getDefaultBudgetRange();
    }

    const sizeKey = this.currentBusinessSize.key;
    const ranges = industryConfig.marketingBudgetRanges[sizeKey];
    
    if (!ranges || ranges.length === 0) {
      return this.getDefaultBudgetRange();
    }

    return {
      ranges: ranges,
      min: Math.min(...ranges.map(r => r.value)),
      max: Math.max(...ranges.map(r => r.value)),
      recommended: ranges[Math.floor(ranges.length / 2)].value,
      step: Math.floor((Math.max(...ranges.map(r => r.value)) - Math.min(...ranges.map(r => r.value))) / 100)
    };
  }

  /**
   * Получение диапазона бюджета по умолчанию
   */
  getDefaultBudgetRange() {
    return {
      ranges: [
        { range: '0-1000', value: 500, label: '$0-1000 (базовый маркетинг)', effectiveness: 0.6 },
        { range: '1000-3000', value: 2000, label: '$1000-3000 (активное продвижение)', effectiveness: 0.75 },
        { range: '3000-6000', value: 4500, label: '$3000-6000 (комплексный маркетинг)', effectiveness: 0.85 },
        { range: '6000-10000', value: 8000, label: '$6000-10000 (профессиональный маркетинг)', effectiveness: 0.9 },
        { range: '10000+', value: 15000, label: '$10000+ (максимальное покрытие)', effectiveness: 0.95 }
      ],
      min: 500,
      max: 15000,
      recommended: 4500,
      step: 100
    };
  }

  /**
   * Рендеринг компонента
   */
  render() {
    const budgetRange = this.getCurrentBudgetRange();
    const industryTitle = this.getIndustryTitle();
    
    this.container.innerHTML = `
      <div class="calculator-step active">
        <h2 class="step-title">Ваш маркетинговый бюджет</h2>
        <p class="step-description">Сколько ${industryTitle} тратит на маркетинг ежемесячно?</p>

        <div class="budget-selection mb-8">
          <div class="budget-slider-container">
            <input type="range" 
                   class="custom-input budget-slider" 
                   min="${budgetRange.min}" 
                   max="${budgetRange.max}" 
                   value="${budgetRange.recommended}" 
                   step="${budgetRange.step}">
            <div class="slider-fill"></div>
            <div class="slider-tooltip"></div>
          </div>
          
          <div class="budget-display text-center mt-4">
            <span class="text-3xl font-bold text-steamphony-primary budget-value">${this.formatCurrency(budgetRange.recommended)}</span>
            <span class="text-lg text-gray-600 budget-period">/месяц</span>
          </div>
        </div>

        <div class="options-grid">
          ${this.renderBudgetOptions(budgetRange.ranges)}
        </div>

        <div class="savings-preview mt-8" style="display: none;">
          <h3 class="text-lg font-semibold text-steamphony-primary mb-4">Потенциальная экономия с Steamphony</h3>
          <div class="savings-amount text-2xl font-bold text-green-600 mb-2"></div>
          <div class="savings-breakdown text-sm text-gray-600"></div>
        </div>

        <div class="step-navigation">
          <button type="button" class="nav-button secondary back-btn">Назад</button>
          <button type="button" class="nav-button primary next-btn">Далее</button>
        </div>
      </div>
    `;

    this.isRendered = true;
  }

  /**
   * Рендеринг опций бюджета
   */
  renderBudgetOptions(ranges) {
    return ranges.map(range => `
      <button class="option-button" data-value="${range.value}">
        <div class="option-content">
          <h3 class="option-title">${range.range}</h3>
          <p class="option-description">${range.label}</p>
          <div class="text-sm text-steamphony-secondary mt-2">
            Эффективность: ${Math.round(range.effectiveness * 100)}%
          </div>
        </div>
      </button>
    `).join('');
  }

  /**
   * Прикрепление обработчиков событий
   */
  attachEventListeners() {
    const slider = this.container.querySelector('.budget-slider');
    const budgetOptions = this.container.querySelectorAll('.option-button');
    const nextBtn = this.container.querySelector('.next-btn');
    const backBtn = this.container.querySelector('.back-btn');

    if (slider) {
      slider.addEventListener('input', this.handleSliderChange);
      slider.addEventListener('change', this.handleSliderChange);
    }

    budgetOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const value = parseInt(e.currentTarget.dataset.value);
        this.selectBudget(value);
      });
    });

    if (nextBtn) nextBtn.addEventListener('click', this.handleNextClick);
    if (backBtn) backBtn.addEventListener('click', this.handleBackClick);

    document.addEventListener('keydown', this.handleKeydown);
  }

  /**
   * Обработка изменения слайдера
   */
  handleSliderChange(event) {
    const value = parseInt(event.target.value);
    this.selectBudget(value);
  }

  /**
   * Выбор бюджета
   */
  selectBudget(value) {
    this.selectedBudget = value;
    
    // Обновляем слайдер
    const slider = this.container.querySelector('.budget-slider');
    if (slider) {
      slider.value = value;
    }
    
    // Обновляем отображение
    this.updateBudgetDisplay(value);
    this.updateSliderFill();
    
    // Показываем предварительный просмотр экономии
    if (this.options.showSavingsPreview) {
      this.updateSavingsPreview(value);
    }
    
    this.onSelect(value);
  }

  /**
   * Обновление отображения бюджета
   */
  updateBudgetDisplay(value) {
    const budgetValue = this.container.querySelector('.budget-value');
    if (budgetValue) {
      budgetValue.textContent = this.formatCurrency(value);
    }
  }

  /**
   * Обновление заполнения слайдера
   */
  updateSliderFill() {
    const slider = this.container.querySelector('.budget-slider');
    const fill = this.container.querySelector('.slider-fill');
    
    if (slider && fill) {
      const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
      fill.style.width = percentage + '%';
    }
  }

  /**
   * Обновление предварительного просмотра экономии
   */
  updateSavingsPreview(currentBudget) {
    const savingsPreview = this.container.querySelector('.savings-preview');
    const savingsAmount = this.container.querySelector('.savings-amount');
    const savingsBreakdown = this.container.querySelector('.savings-breakdown');
    
    if (!savingsPreview || !savingsAmount || !savingsBreakdown) return;

    const savings = this.calculatePotentialSavings(currentBudget);
    const breakdown = this.calculateSavingsBreakdown(currentBudget);

    savingsAmount.innerHTML = `
      <div class="savings-main">
        <span class="savings-label">Экономия:</span>
        <span class="savings-value">${this.formatCurrency(savings.total)}/мес</span>
      </div>
    `;

    savingsBreakdown.innerHTML = `
      <div class="breakdown-item">
        <span class="label">Оптимизация расходов:</span>
        <span class="value">${this.formatCurrency(breakdown.optimization)}</span>
      </div>
      <div class="breakdown-item">
        <span class="label">Повышение эффективности:</span>
        <span class="value">${this.formatCurrency(breakdown.efficiency)}</span>
      </div>
      <div class="breakdown-item">
        <span class="label">Автоматизация процессов:</span>
        <span class="value">${this.formatCurrency(breakdown.automation)}</span>
      </div>
    `;

    savingsPreview.style.display = 'block';
  }

  /**
   * Расчет потенциальной экономии
   */
  calculatePotentialSavings(currentBudget) {
    const industryConfig = getIndustryConfig(this.currentIndustry.key);
    const baseSavingsRate = industryConfig?.benchmarks?.avgROI ? 0.35 : 0.30;
    
    return {
      total: Math.round(currentBudget * baseSavingsRate),
      percentage: Math.round(baseSavingsRate * 100)
    };
  }

  /**
   * Расчет разбивки экономии
   */
  calculateSavingsBreakdown(currentBudget) {
    const total = this.calculatePotentialSavings(currentBudget).total;
    
    return {
      optimization: Math.round(total * 0.5),
      efficiency: Math.round(total * 0.3),
      automation: Math.round(total * 0.2)
    };
  }

  /**
   * Обработка нажатия клавиш
   */
  handleKeydown(event) {
    if (event.key === 'Enter' && this.selectedBudget) {
      this.handleNextClick();
    } else if (event.key === 'Escape') {
      this.handleBackClick();
    }
  }

  /**
   * Обработка нажатия "Далее"
   */
  handleNextClick(event) {
    if (!this.selectedBudget) {
      this.showValidationError('Пожалуйста, выберите бюджет');
      return;
    }

    try {
      const budgetData = this.prepareBudgetData();
      this.saveDataToApp(budgetData);
      this.trackStepCompletion();
      this.onNext(budgetData);
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
   * Подготовка данных бюджета
   */
  prepareBudgetData() {
    const budgetRange = this.getCurrentBudgetRange();
    const selectedRange = budgetRange.ranges.find(range => range.value === this.selectedBudget);
    
    return {
      budget: this.selectedBudget,
      budgetRange: selectedRange?.range || 'custom',
      budgetLabel: selectedRange?.label || 'Пользовательский бюджет',
      effectiveness: selectedRange?.effectiveness || 0.8,
      potentialSavings: this.calculatePotentialSavings(this.selectedBudget),
      savingsBreakdown: this.calculateSavingsBreakdown(this.selectedBudget)
    };
  }

  /**
   * Сохранение данных в приложение
   */
  saveDataToApp(budgetData) {
    if (window.app && window.app.appState) {
      window.app.appState.updateField('marketingBudget', budgetData);
    }
  }

  /**
   * Получение названия отрасли
   */
  getIndustryTitle() {
    return this.currentIndustry?.title || 'ваш бизнес';
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
          step: 3,
          industry: this.currentIndustry?.key,
          businessSize: this.currentBusinessSize?.key,
          ...params
        });
      }
    } catch (error) {
      console.error('Ошибка отслеживания события:', error);
    }
  }

  /**
   * Отслеживание завершения шага
   */
  trackStepCompletion() {
    this.trackEvent('step_completed', {
      step_name: 'marketing_budget',
      selected_budget: this.selectedBudget
    });
  }

  /**
   * Обработка ошибок
   */
  handleError(errorCode, error) {
    console.error(`MarketingBudgetStep Error [${errorCode}]:`, error);
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
   * Получение выбранного бюджета
   */
  getSelectedBudget() {
    return this.selectedBudget;
  }

  /**
   * Установка бюджета
   */
  setSelectedBudget(budgetValue) {
    this.selectBudget(budgetValue);
  }

  /**
   * Сброс компонента
   */
  reset() {
    this.selectedBudget = null;
    const slider = this.container.querySelector('.budget-slider');
    if (slider) {
      const budgetRange = this.getCurrentBudgetRange();
      slider.value = budgetRange.recommended;
      this.updateBudgetDisplay(budgetRange.recommended);
      this.updateSliderFill();
    }
    
    const savingsPreview = this.container.querySelector('.savings-preview');
    if (savingsPreview) {
      savingsPreview.style.display = 'none';
    }
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
      console.error('Ошибка уничтожения MarketingBudgetStep:', error);
    }
  }
}

export default MarketingBudgetStep; 