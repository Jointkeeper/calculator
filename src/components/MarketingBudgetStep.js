/**
 * MarketingBudgetStep Component для Universal Calculator
 * Третий шаг формы - выбор маркетингового бюджета
 * 
 * @class MarketingBudgetStep
 * @author Steamphony Digital Agency
 */
class MarketingBudgetStep {
  /**
   * Создает экземпляр MarketingBudgetStep
   * 
   * @param {HTMLElement} container - DOM элемент для размещения компонента
   * @param {Object} options - Опции конфигурации
   */
  constructor(container, options = {}) {
    // Валидация входных параметров
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('MarketingBudgetStep: container должен быть DOM элементом');
    }

    // Основные свойства
    this.container = container;
    this.currentIndustry = null;
    this.currentBusinessSize = null;
    this.selectedBudget = null;
    this.potentialSavings = 0;
    this.isRendered = false;

    // Колбэки
    this.onSelect = options.onSelect || (() => {});
    this.onNext = options.onNext || (() => {});
    this.onBack = options.onBack || (() => {});

    // Конфигурация
    this.options = {
      enableValidation: true,
      showSavingsPreview: true,
      trackAnalytics: true,
      animateSliders: true,
      showBudgetBreakdown: true,
      ...options
    };

    // Industry-specific budget ranges
    this.budgetRanges = {
      restaurant: {
        small_restaurant: { min: 5000, max: 25000, recommended: 15000, step: 1000 },
        medium_restaurant: { min: 20000, max: 60000, recommended: 40000, step: 2000 },
        large_restaurant: { min: 50000, max: 150000, recommended: 100000, step: 5000 },
        chain_restaurant: { min: 100000, max: 300000, recommended: 200000, step: 10000 }
      },
      beauty: {
        small_salon: { min: 3000, max: 20000, recommended: 12000, step: 500 },
        medium_salon: { min: 15000, max: 50000, recommended: 30000, step: 1000 },
        large_salon: { min: 40000, max: 120000, recommended: 80000, step: 2000 },
        chain_salon: { min: 80000, max: 250000, recommended: 150000, step: 5000 }
      },
      retail: {
        small_retail: { min: 8000, max: 30000, recommended: 18000, step: 1000 },
        medium_retail: { min: 25000, max: 70000, recommended: 45000, step: 2000 },
        large_retail: { min: 60000, max: 180000, recommended: 120000, step: 5000 },
        enterprise_retail: { min: 150000, max: 500000, recommended: 300000, step: 10000 }
      },
      services: {
        small_business: { min: 5000, max: 25000, recommended: 15000, step: 1000 },
        medium_business: { min: 20000, max: 65000, recommended: 40000, step: 2000 },
        large_business: { min: 55000, max: 160000, recommended: 110000, step: 5000 },
        enterprise: { min: 120000, max: 400000, recommended: 250000, step: 10000 }
      },
      b2b: {
        small_business: { min: 10000, max: 40000, recommended: 25000, step: 1000 },
        medium_business: { min: 35000, max: 100000, recommended: 65000, step: 2000 },
        large_business: { min: 80000, max: 250000, recommended: 150000, step: 5000 },
        enterprise: { min: 200000, max: 800000, recommended: 500000, step: 20000 }
      },
      realestate: {
        small_business: { min: 8000, max: 35000, recommended: 20000, step: 1000 },
        medium_business: { min: 30000, max: 80000, recommended: 55000, step: 2000 },
        large_business: { min: 70000, max: 200000, recommended: 130000, step: 5000 },
        enterprise: { min: 180000, max: 600000, recommended: 400000, step: 15000 }
      },
      finance: {
        small_business: { min: 15000, max: 50000, recommended: 30000, step: 1000 },
        medium_business: { min: 40000, max: 120000, recommended: 80000, step: 2000 },
        large_business: { min: 100000, max: 300000, recommended: 200000, step: 5000 },
        enterprise: { min: 250000, max: 1000000, recommended: 600000, step: 25000 }
      },
      default: {
        small_business: { min: 5000, max: 30000, recommended: 18000, step: 1000 },
        medium_business: { min: 25000, max: 70000, recommended: 45000, step: 2000 },
        large_business: { min: 60000, max: 180000, recommended: 120000, step: 5000 },
        enterprise: { min: 140000, max: 450000, recommended: 280000, step: 10000 }
      }
    };

    // Savings calculation factors по отраслям
    this.savingsFactors = {
      restaurant: { base: 0.35, efficiency: 0.15, technology: 0.10 },
      beauty: { base: 0.40, efficiency: 0.20, technology: 0.12 },
      retail: { base: 0.30, efficiency: 0.12, technology: 0.08 },
      services: { base: 0.45, efficiency: 0.18, technology: 0.15 },
      b2b: { base: 0.50, efficiency: 0.22, technology: 0.18 },
      realestate: { base: 0.38, efficiency: 0.16, technology: 0.12 },
      finance: { base: 0.42, efficiency: 0.20, technology: 0.16 },
      default: { base: 0.35, efficiency: 0.15, technology: 0.10 }
    };

    // Обработчики событий
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleSliderInput = this.handleSliderInput.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    // Инициализация
    this.init();
  }

  /**
   * Инициализация компонента
   * @private
   */
  init() {
    try {
      // Получаем данные из предыдущих шагов
      this.loadPreviousStepData();
      
      this.render();
      this.attachEventListeners();
      
      // Отправка analytics события
      this.trackEvent('step_3_viewed', {
        industry: this.currentIndustry?.key,
        businessSize: this.currentBusinessSize?.key,
        step: 3,
        timestamp: Date.now()
      });
      
      // Dispatch готовности компонента
      this.dispatchEvent('marketingBudgetStepReady', {
        industry: this.currentIndustry?.key,
        businessSize: this.currentBusinessSize?.key,
        budgetRange: this.getCurrentBudgetRange()
      });
      
    } catch (error) {
      console.error('MarketingBudgetStep: Ошибка инициализации:', error);
      this.renderError(error.message);
    }
  }

  /**
   * Загрузка данных из предыдущих шагов
   * @private
   */
  loadPreviousStepData() {
    if (typeof window !== 'undefined' && window.app && window.app.formData) {
      this.currentIndustry = window.app.formData.industry;
      this.currentBusinessSize = window.app.formData.businessSize;
    }

    // Fallback значения если данные отсутствуют
    if (!this.currentIndustry) {
      this.currentIndustry = { key: 'default', title: 'Другое' };
    }
    if (!this.currentBusinessSize) {
      this.currentBusinessSize = { key: 'medium_business', title: 'Средний бизнес' };
    }
  }

  /**
   * Получение диапазона бюджета для текущей отрасли и размера
   * @private
   * @returns {Object} Диапазон бюджета
   */
  getCurrentBudgetRange() {
    const industryKey = this.currentIndustry.key || 'default';
    const sizeKey = this.currentBusinessSize.key || 'medium_business';
    
    const industryRanges = this.budgetRanges[industryKey] || this.budgetRanges.default;
    return industryRanges[sizeKey] || industryRanges.medium_business || industryRanges.small_business;
  }

  /**
   * Рендеринг HTML структуры
   * @private
   */
  render() {
    const budgetRange = this.getCurrentBudgetRange();
    const industryTitle = this.getIndustryTitle();
    
    const stepHTML = `
      <div class="marketing-budget-step" role="region" aria-label="Выбор маркетингового бюджета">
        <!-- Header -->
        <div class="step-header">
          <h2 class="step-title">Ваш маркетинговый бюджет</h2>
          <p class="step-description">
            Сколько ${industryTitle} тратит на маркетинг ежемесячно?
          </p>
          <div class="step-context">
            <span class="context-item">
              <span class="context-icon">🏢</span>
              <span class="context-text">${this.currentIndustry.title}</span>
            </span>
            <span class="context-item">
              <span class="context-icon">📊</span>
              <span class="context-text">${this.currentBusinessSize.title}</span>
            </span>
          </div>
        </div>

        <!-- Budget Slider Section -->
        <div class="budget-slider-section">
          <div class="slider-group">
            <div class="slider-header">
              <label for="budget-slider" class="slider-label">
                Текущий месячный бюджет на маркетинг
              </label>
              <div class="budget-display">
                <span class="budget-value" id="budget-value">
                  ${this.formatCurrency(budgetRange.recommended)}
                </span>
                <span class="budget-period">/месяц</span>
              </div>
            </div>
            
            <div class="slider-container">
              <div class="slider-track">
                <input 
                  type="range" 
                  id="budget-slider" 
                  class="budget-slider"
                  min="${budgetRange.min}"
                  max="${budgetRange.max}"
                  step="${budgetRange.step}"
                  value="${budgetRange.recommended}"
                  aria-describedby="budget-description"
                >
                <div class="slider-fill" id="slider-fill"></div>
                <div class="slider-thumb-tooltip" id="slider-tooltip">
                  ${this.formatCurrency(budgetRange.recommended)}
                </div>
              </div>
              
              <div class="slider-labels">
                <span class="slider-label-min">${this.formatCurrency(budgetRange.min)}</span>
                <span class="slider-label-recommended">
                  Рекомендуемый: ${this.formatCurrency(budgetRange.recommended)}
                </span>
                <span class="slider-label-max">${this.formatCurrency(budgetRange.max)}</span>
              </div>
            </div>
          </div>

          <!-- Budget Breakdown -->
          ${this.options.showBudgetBreakdown ? this.renderBudgetBreakdown(budgetRange.recommended) : ''}
        </div>

        <!-- Savings Preview -->
        ${this.options.showSavingsPreview ? this.renderSavingsPreview(budgetRange.recommended) : ''}

        <!-- Validation Error -->
        <div class="validation-error" id="budget-validation-error" style="display: none;">
          <div class="error-message">
            <span class="error-icon">⚠️</span>
            <span class="error-text">Пожалуйста, укажите ваш текущий маркетинговый бюджет</span>
          </div>
        </div>

        <!-- Navigation Footer -->
        <div class="step-footer">
          <button type="button" class="btn btn-secondary btn-back" id="budget-back-btn">
            <span class="btn-icon">←</span>
            Назад
          </button>
          
          <button type="button" class="btn btn-primary btn-next" id="budget-next-btn">
            Далее
            <span class="btn-icon">→</span>
          </button>
        </div>

        <!-- Trust Indicators -->
        <div class="step-trust">
          <div class="trust-item">
            <span class="trust-icon">🔒</span>
            <span class="trust-text">Конфиденциально</span>
          </div>
          <div class="trust-item">
            <span class="trust-icon">⚡</span>
            <span class="trust-text">Моментальный расчет</span>
          </div>
          <div class="trust-item">
            <span class="trust-icon">💰</span>
            <span class="trust-text">Реальная экономия</span>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = stepHTML;
    this.isRendered = true;
    
    // Cache DOM elements
    this.cacheElements();
    
    // Initialize slider
    this.initializeSlider();
  }

  /**
   * Получение заголовка отрасли для контекста
   * @private
   * @returns {string} Заголовок отрасли
   */
  getIndustryTitle() {
    const titles = {
      restaurant: 'ваш ресторан',
      beauty: 'ваш салон красоты', 
      retail: 'ваш магазин',
      services: 'ваша компания',
      b2b: 'ваш B2B бизнес',
      realestate: 'ваше агентство недвижимости',
      finance: 'ваша финансовая компания',
      default: 'ваш бизнес'
    };
    
    return titles[this.currentIndustry.key] || titles.default;
  }

  /**
   * Рендеринг breakdown бюджета
   * @private
   * @param {number} totalBudget - Общий бюджет
   * @returns {string} HTML breakdown
   */
  renderBudgetBreakdown(totalBudget) {
    const breakdown = this.calculateBudgetBreakdown(totalBudget);
    
    return `
      <div class="budget-breakdown">
        <h4 class="breakdown-title">Примерное распределение бюджета:</h4>
        <div class="breakdown-items">
          <div class="breakdown-item">
            <div class="breakdown-category">
              <span class="category-icon">📢</span>
              <span class="category-name">Реклама и продвижение</span>
            </div>
            <div class="breakdown-amount" id="breakdown-advertising">
              ${this.formatCurrency(breakdown.advertising)}
            </div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-category">
              <span class="category-icon">👥</span>
              <span class="category-name">Зарплата маркетологов</span>
            </div>
            <div class="breakdown-amount" id="breakdown-staff">
              ${this.formatCurrency(breakdown.staff)}
            </div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-category">
              <span class="category-icon">🛠️</span>
              <span class="category-name">Инструменты и софт</span>
            </div>
            <div class="breakdown-amount" id="breakdown-tools">
              ${this.formatCurrency(breakdown.tools)}
            </div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-category">
              <span class="category-icon">📊</span>
              <span class="category-name">Аналитика и исследования</span>
            </div>
            <div class="breakdown-amount" id="breakdown-analytics">
              ${this.formatCurrency(breakdown.analytics)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Рендеринг preview экономии
   * @private
   * @param {number} currentBudget - Текущий бюджет
   * @returns {string} HTML preview
   */
  renderSavingsPreview(currentBudget) {
    const savings = this.calculatePotentialSavings(currentBudget);
    
    return `
      <div class="savings-preview">
        <div class="savings-header">
          <h3 class="savings-title">💰 Потенциальная экономия с Steamphony:</h3>
          <div class="savings-amount" id="savings-amount">
            ${this.formatCurrency(savings.total)}<span class="savings-period">/месяц</span>
          </div>
        </div>
        
        <div class="savings-breakdown">
          <div class="savings-item">
            <span class="savings-category">Оптимизация рекламы:</span>
            <span class="savings-value" id="savings-ads">+${this.formatCurrency(savings.advertising)}</span>
          </div>
          <div class="savings-item">
            <span class="savings-category">Автоматизация процессов:</span>
            <span class="savings-value" id="savings-efficiency">+${this.formatCurrency(savings.efficiency)}</span>
          </div>
          <div class="savings-item">
            <span class="savings-category">Современные технологии:</span>
            <span class="savings-value" id="savings-technology">+${this.formatCurrency(savings.technology)}</span>
          </div>
        </div>
        
        <div class="savings-footer">
          <div class="savings-percentage">
            Экономия: <strong>${savings.percentage}%</strong> от текущего бюджета
          </div>
          <div class="savings-note">
            * При сохранении или улучшении текущих результатов
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Расчет breakdown бюджета
   * @private
   * @param {number} totalBudget - Общий бюджет
   * @returns {Object} Breakdown по категориям
   */
  calculateBudgetBreakdown(totalBudget) {
    // Стандартное распределение бюджета (может варьироваться по отраслям)
    const breakdown = {
      advertising: Math.round(totalBudget * 0.55), // 55% - реклама
      staff: Math.round(totalBudget * 0.30),       // 30% - зарплата
      tools: Math.round(totalBudget * 0.10),       // 10% - инструменты
      analytics: Math.round(totalBudget * 0.05)    // 5% - аналитика
    };
    
    // Корректировка для точного соответствия общему бюджету
    const total = breakdown.advertising + breakdown.staff + breakdown.tools + breakdown.analytics;
    const difference = totalBudget - total;
    breakdown.advertising += difference; // Добавляем разницу к рекламе
    
    return breakdown;
  }

  /**
   * Расчет потенциальной экономии
   * @private
   * @param {number} currentBudget - Текущий бюджет
   * @returns {Object} Детализированная экономия
   */
  calculatePotentialSavings(currentBudget) {
    const industryKey = this.currentIndustry.key || 'default';
    const factors = this.savingsFactors[industryKey] || this.savingsFactors.default;
    
    const savings = {
      advertising: Math.round(currentBudget * factors.base),
      efficiency: Math.round(currentBudget * factors.efficiency),
      technology: Math.round(currentBudget * factors.technology)
    };
    
    savings.total = savings.advertising + savings.efficiency + savings.technology;
    savings.percentage = Math.round((savings.total / currentBudget) * 100);
    
    return savings;
  }

  /**
   * Инициализация слайдера
   * @private
   */
  initializeSlider() {
    if (!this.elements.slider) return;
    
    const budgetRange = this.getCurrentBudgetRange();
    
    // Установка начального значения
    this.selectedBudget = {
      monthly: budgetRange.recommended,
      range: budgetRange,
      breakdown: this.calculateBudgetBreakdown(budgetRange.recommended),
      potentialSavings: this.calculatePotentialSavings(budgetRange.recommended)
    };
    
    // Обновление UI
    this.updateSliderFill();
    this.updateTooltipPosition();
    
    // Начальный расчет экономии
    this.updateSavingsPreview(budgetRange.recommended);
    this.updateBudgetBreakdown(budgetRange.recommended);
  }

  /**
   * Кэширование DOM элементов
   * @private
   */
  cacheElements() {
    this.elements = {
      step: this.container.querySelector('.marketing-budget-step'),
      slider: this.container.querySelector('#budget-slider'),
      sliderFill: this.container.querySelector('#slider-fill'),
      sliderTooltip: this.container.querySelector('#slider-tooltip'),
      budgetValue: this.container.querySelector('#budget-value'),
      nextBtn: this.container.querySelector('#budget-next-btn'),
      backBtn: this.container.querySelector('#budget-back-btn'),
      validationError: this.container.querySelector('#budget-validation-error'),
      savingsAmount: this.container.querySelector('#savings-amount'),
      breakdownItems: {
        advertising: this.container.querySelector('#breakdown-advertising'),
        staff: this.container.querySelector('#breakdown-staff'),
        tools: this.container.querySelector('#breakdown-tools'),
        analytics: this.container.querySelector('#breakdown-analytics')
      },
      savingsItems: {
        total: this.container.querySelector('#savings-amount'),
        ads: this.container.querySelector('#savings-ads'),
        efficiency: this.container.querySelector('#savings-efficiency'),
        technology: this.container.querySelector('#savings-technology')
      }
    };
  }

  /**
   * Привязка обработчиков событий
   * @private
   */
  attachEventListeners() {
    if (!this.isRendered) return;

    try {
      // Slider events
      if (this.elements.slider) {
        this.elements.slider.addEventListener('input', this.handleSliderInput);
        this.elements.slider.addEventListener('change', this.handleSliderChange);
        this.elements.slider.addEventListener('keydown', this.handleKeydown);
      }

      // Navigation buttons
      if (this.elements.nextBtn) {
        this.elements.nextBtn.addEventListener('click', this.handleNextClick);
      }

      if (this.elements.backBtn) {
        this.elements.backBtn.addEventListener('click', this.handleBackClick);
      }

      // Touch events for mobile
      if (this.elements.slider) {
        this.elements.slider.addEventListener('touchstart', this.handleSliderInput);
        this.elements.slider.addEventListener('touchmove', this.handleSliderInput);
      }
      
    } catch (error) {
      console.error('MarketingBudgetStep: Ошибка привязки событий:', error);
    }
  }

  /**
   * Обработка real-time изменений слайдера
   * @private
   * @param {Event} event - Событие input
   */
  handleSliderInput(event) {
    const value = parseInt(event.target.value);
    
    // Обновление UI в реальном времени
    this.updateBudgetDisplay(value);
    this.updateSliderFill();
    this.updateTooltipPosition();
    
    // Обновление расчетов
    if (this.options.showSavingsPreview) {
      this.updateSavingsPreview(value);
    }
    
    if (this.options.showBudgetBreakdown) {
      this.updateBudgetBreakdown(value);
    }
    
    // Analytics tracking для real-time changes
    this.trackEvent('budget_slider_changed', {
      budget: value,
      industry: this.currentIndustry?.key,
      businessSize: this.currentBusinessSize?.key,
      step: 3,
      timestamp: Date.now()
    });
  }

  /**
   * Обработка финального выбора бюджета
   * @private
   * @param {Event} event - Событие change
   */
  handleSliderChange(event) {
    const value = parseInt(event.target.value);
    
    // Сохранение выбора
    this.selectedBudget = {
      monthly: value,
      range: this.getCurrentBudgetRange(),
      breakdown: this.calculateBudgetBreakdown(value),
      potentialSavings: this.calculatePotentialSavings(value)
    };

    // Скрытие ошибки валидации
    this.hideValidationError();

    // Analytics tracking для selection
    this.trackEvent('budget_selected', {
      budget: value,
      industry: this.currentIndustry?.key,
      businessSize: this.currentBusinessSize?.key,
      step: 3,
      potentialSavings: this.selectedBudget.potentialSavings.total,
      timestamp: Date.now()
    });

    // Колбэк выбора
    this.onSelect(this.selectedBudget);
  }

  /**
   * Обработка keyboard navigation
   * @private
   * @param {KeyboardEvent} event - Событие клавиатуры
   */
  handleKeydown(event) {
    const budgetRange = this.getCurrentBudgetRange();
    const currentValue = parseInt(this.elements.slider.value);
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        const newMin = Math.max(currentValue - budgetRange.step, budgetRange.min);
        this.elements.slider.value = newMin;
        this.elements.slider.dispatchEvent(new Event('input'));
        break;
        
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        const newMax = Math.min(currentValue + budgetRange.step, budgetRange.max);
        this.elements.slider.value = newMax;
        this.elements.slider.dispatchEvent(new Event('input'));
        break;
        
      case 'Home':
        event.preventDefault();
        this.elements.slider.value = budgetRange.min;
        this.elements.slider.dispatchEvent(new Event('input'));
        break;
        
      case 'End':
        event.preventDefault();
        this.elements.slider.value = budgetRange.max;
        this.elements.slider.dispatchEvent(new Event('input'));
        break;
    }
  }

  /**
   * Обновление отображения бюджета
   * @private
   * @param {number} value - Значение бюджета
   */
  updateBudgetDisplay(value) {
    if (this.elements.budgetValue) {
      this.elements.budgetValue.textContent = this.formatCurrency(value);
    }
    
    if (this.elements.sliderTooltip) {
      this.elements.sliderTooltip.textContent = this.formatCurrency(value);
    }
  }

  /**
   * Обновление заливки слайдера
   * @private
   */
  updateSliderFill() {
    if (!this.elements.slider || !this.elements.sliderFill) return;
    
    const slider = this.elements.slider;
    const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    
    // Обновление background слайдера для visual feedback
    slider.style.background = `linear-gradient(to right, #3182ce 0%, #3182ce ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
    
    // Обновление отдельной заливки если есть
    if (this.elements.sliderFill) {
      this.elements.sliderFill.style.width = `${percentage}%`;
    }
  }

  /**
   * Обновление позиции tooltip
   * @private
   */
  updateTooltipPosition() {
    if (!this.elements.slider || !this.elements.sliderTooltip) return;
    
    const slider = this.elements.slider;
    const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    
    // Позиционирование tooltip относительно thumb
    this.elements.sliderTooltip.style.left = `${percentage}%`;
  }

  /**
   * Обновление preview экономии
   * @private
   * @param {number} currentBudget - Текущий бюджет
   */
  updateSavingsPreview(currentBudget) {
    const savings = this.calculatePotentialSavings(currentBudget);
    
    // Обновление основной суммы экономии
    if (this.elements.savingsAmount) {
      this.elements.savingsAmount.innerHTML = `
        ${this.formatCurrency(savings.total)}<span class="savings-period">/месяц</span>
      `;
    }
    
    // Обновление breakdown экономии
    if (this.elements.savingsItems.ads) {
      this.elements.savingsItems.ads.textContent = `+${this.formatCurrency(savings.advertising)}`;
    }
    if (this.elements.savingsItems.efficiency) {
      this.elements.savingsItems.efficiency.textContent = `+${this.formatCurrency(savings.efficiency)}`;
    }
    if (this.elements.savingsItems.technology) {
      this.elements.savingsItems.technology.textContent = `+${this.formatCurrency(savings.technology)}`;
    }
    
    // Обновление процента экономии
    const percentageElement = this.container.querySelector('.savings-percentage strong');
    if (percentageElement) {
      percentageElement.textContent = `${savings.percentage}%`;
    }
  }

  /**
   * Обновление breakdown бюджета
   * @private
   * @param {number} totalBudget - Общий бюджет
   */
  updateBudgetBreakdown(totalBudget) {
    const breakdown = this.calculateBudgetBreakdown(totalBudget);
    
    // Обновление каждой категории
    if (this.elements.breakdownItems.advertising) {
      this.elements.breakdownItems.advertising.textContent = this.formatCurrency(breakdown.advertising);
    }
    if (this.elements.breakdownItems.staff) {
      this.elements.breakdownItems.staff.textContent = this.formatCurrency(breakdown.staff);
    }
    if (this.elements.breakdownItems.tools) {
      this.elements.breakdownItems.tools.textContent = this.formatCurrency(breakdown.tools);
    }
    if (this.elements.breakdownItems.analytics) {
      this.elements.breakdownItems.analytics.textContent = this.formatCurrency(breakdown.analytics);
    }
  }

  /**
   * Обработка клика "Далее"
   * @private
   * @param {Event} event - Событие клика
   */
  handleNextClick(event) {
    event.preventDefault();
    
    if (!this.validateSelection()) {
      this.showValidationError();
      return;
    }

    try {
      // Analytics tracking
      this.trackEvent('step_3_completed', {
        selectedBudget: this.selectedBudget.monthly,
        industry: this.currentIndustry?.key,
        businessSize: this.currentBusinessSize?.key,
        step: 3,
        nextStep: 4,
        potentialSavings: this.selectedBudget.potentialSavings.total,
        timestamp: Date.now()
      });

      // Сохранение данных в приложении
      this.saveDataToApp();

      // Колбэк перехода
      this.onNext({
        step: 3,
        marketingBudget: this.selectedBudget,
        industry: this.currentIndustry,
        businessSize: this.currentBusinessSize,
        nextStep: 4
      });
      
    } catch (error) {
      console.error('MarketingBudgetStep: Ошибка перехода к следующему шагу:', error);
      this.showError('Произошла ошибка. Попробуйте еще раз.');
    }
  }

  /**
   * Обработка клика "Назад"
   * @private
   * @param {Event} event - Событие клика
   */
  handleBackClick(event) {
    event.preventDefault();
    
    try {
      // Analytics tracking
      this.trackEvent('step_3_back', {
        industry: this.currentIndustry?.key,
        businessSize: this.currentBusinessSize?.key,
        step: 3,
        previousStep: 2,
        timestamp: Date.now()
      });

      // Колбэк возврата
      this.onBack({
        step: 3,
        previousStep: 2
      });
      
    } catch (error) {
      console.error('MarketingBudgetStep: Ошибка возврата к предыдущему шагу:', error);
    }
  }

  /**
   * Валидация выбора
   * @private
   * @returns {boolean} Результат валидации
   */
  validateSelection() {
    return this.selectedBudget !== null && this.selectedBudget.monthly > 0;
  }

  /**
   * Показ ошибки валидации
   * @private
   */
  showValidationError() {
    if (this.elements.validationError) {
      this.elements.validationError.style.display = 'block';
      this.elements.validationError.setAttribute('aria-live', 'polite');
      
      // Фокус на слайдер для accessibility
      if (this.elements.slider) {
        this.elements.slider.focus();
      }
    }
  }

  /**
   * Скрытие ошибки валидации
   * @private
   */
  hideValidationError() {
    if (this.elements.validationError) {
      this.elements.validationError.style.display = 'none';
    }
  }

  /**
   * Сохранение данных в приложении
   * @private
   */
  saveDataToApp() {
    if (typeof window !== 'undefined' && window.app && window.app.formData) {
      window.app.formData.marketingBudget = this.selectedBudget;
      
      // Также сохраняем для обратной совместимости
      window.app.data = window.app.data || {};
      window.app.data.marketingBudget = this.selectedBudget;
    }
  }

  /**
   * Форматирование валюты
   * @private
   * @param {number} amount - Сумма
   * @returns {string} Отформатированная сумма
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Отправка analytics события
   * @private
   * @param {string} eventName - Название события
   * @param {Object} params - Параметры события
   */
  trackEvent(eventName, params = {}) {
    if (!this.options.trackAnalytics) return;
    
    try {
      // Через глобальную analytics службу
      if (typeof window !== 'undefined' && window.app && window.app.analytics) {
        window.app.analytics.trackEvent(eventName, params);
      }
      
      // Для отладки
      console.log('📊 MarketingBudgetStep Analytics:', eventName, params);
      
    } catch (error) {
      console.warn('MarketingBudgetStep: Ошибка отправки analytics:', error);
    }
  }

  /**
   * Dispatch кастомного события
   * @private
   * @param {string} eventName - Название события
   * @param {Object} detail - Данные события
   */
  dispatchEvent(eventName, detail = {}) {
    try {
      const event = new CustomEvent(eventName, {
        detail: {
          component: 'MarketingBudgetStep',
          timestamp: Date.now(),
          ...detail
        },
        bubbles: true,
        cancelable: true
      });
      
      this.container.dispatchEvent(event);
      
    } catch (error) {
      console.warn('MarketingBudgetStep: Ошибка dispatch события:', error);
    }
  }

  /**
   * Показ общей ошибки
   * @private
   * @param {string} message - Текст ошибки
   */
  showError(message) {
    // Создаем временное уведомление об ошибке
    const errorHTML = `
      <div class="step-error" style="margin-top: 1rem; padding: 1rem; background: #fee; border: 1px solid #fcc; border-radius: 0.5rem; color: #c00;">
        <strong>Ошибка:</strong> ${message}
      </div>
    `;
    
    // Добавляем в конец step
    if (this.elements.step) {
      this.elements.step.insertAdjacentHTML('beforeend', errorHTML);
      
      // Автоматически скрываем через 5 секунд
      setTimeout(() => {
        const errorElement = this.elements.step.querySelector('.step-error');
        if (errorElement) {
          errorElement.remove();
        }
      }, 5000);
    }
  }

  /**
   * Рендеринг ошибки инициализации
   * @private
   * @param {string} message - Текст ошибки
   */
  renderError(message) {
    const errorHTML = `
      <div class="marketing-budget-step-error">
        <div class="error-icon">⚠️</div>
        <div class="error-message">
          <h3>Ошибка загрузки</h3>
          <p>${message}</p>
          <button type="button" class="btn btn-primary" onclick="location.reload()">
            Обновить страницу
          </button>
        </div>
      </div>
    `;
    
    this.container.innerHTML = errorHTML;
  }

  /**
   * Показ компонента
   * @public
   */
  show() {
    if (this.elements.step) {
      this.elements.step.style.display = 'block';
      
      // Анимация появления
      if (this.options.animateSliders) {
        this.elements.step.style.opacity = '0';
        this.elements.step.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
          this.elements.step.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          this.elements.step.style.opacity = '1';
          this.elements.step.style.transform = 'translateY(0)';
        });
      }
    }
  }

  /**
   * Скрытие компонента
   * @public
   */
  hide() {
    if (this.elements.step) {
      this.elements.step.style.display = 'none';
    }
  }

  /**
   * Получение выбранного бюджета
   * @public
   * @returns {Object|null} Выбранный бюджет или null
   */
  getSelectedBudget() {
    return this.selectedBudget;
  }

  /**
   * Установка бюджета программно
   * @public
   * @param {number} budgetValue - Значение бюджета
   */
  setSelectedBudget(budgetValue) {
    if (this.elements.slider) {
      this.elements.slider.value = budgetValue;
      this.elements.slider.dispatchEvent(new Event('change'));
    }
  }

  /**
   * Сброс компонента
   * @public
   */
  reset() {
    this.selectedBudget = null;
    
    if (this.isRendered) {
      const budgetRange = this.getCurrentBudgetRange();
      
      // Сброс слайдера к рекомендуемому значению
      if (this.elements.slider) {
        this.elements.slider.value = budgetRange.recommended;
        this.elements.slider.dispatchEvent(new Event('input'));
      }
      
      // Скрытие ошибок
      this.hideValidationError();
    }
  }

  /**
   * Уничтожение компонента
   * @public
   */
  destroy() {
    try {
      // Удаление обработчиков событий
      if (this.isRendered) {
        if (this.elements.slider) {
          this.elements.slider.removeEventListener('input', this.handleSliderInput);
          this.elements.slider.removeEventListener('change', this.handleSliderChange);
          this.elements.slider.removeEventListener('keydown', this.handleKeydown);
        }

        if (this.elements.nextBtn) {
          this.elements.nextBtn.removeEventListener('click', this.handleNextClick);
        }

        if (this.elements.backBtn) {
          this.elements.backBtn.removeEventListener('click', this.handleBackClick);
        }
      }

      // Очистка DOM
      this.container.innerHTML = '';
      
      // Очистка ссылок
      this.selectedBudget = null;
      this.elements = null;
      this.isRendered = false;
      
      console.log('🗑️ MarketingBudgetStep уничтожен');
      
    } catch (error) {
      console.error('MarketingBudgetStep: Ошибка уничтожения:', error);
    }
  }
}

// Экспорт для использования в других модулях
if (typeof window !== 'undefined') {
  window.MarketingBudgetStep = MarketingBudgetStep;
}

export default MarketingBudgetStep; 