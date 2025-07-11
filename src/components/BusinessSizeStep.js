/**
 * BusinessSizeStep Component для Universal Calculator
 * Второй шаг формы - выбор размера бизнеса
 * 
 * @class BusinessSizeStep
 * @author Steamphony Digital Agency
 */
class BusinessSizeStep {
  /**
   * Создает экземпляр BusinessSizeStep
   * 
   * @param {HTMLElement} container - DOM элемент для размещения компонента
   * @param {Object} options - Опции конфигурации
   */
  constructor(container, options = {}) {
    // Валидация входных параметров
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('BusinessSizeStep: container должен быть DOM элементом');
    }

    // Основные свойства
    this.container = container;
    this.selectedSize = null;
    this.industryKey = null;
    this.isRendered = false;

    // Колбэки
    this.onSelect = options.onSelect || (() => {});
    this.onNext = options.onNext || (() => {});
    this.onBack = options.onBack || (() => {});

    // Конфигурация
    this.options = {
      enableValidation: true,
      showDescription: true,
      trackAnalytics: true,
      ...options
    };

    // Данные размеров бизнеса по отраслям
    this.businessSizes = {
      restaurant: {
        title: 'Выберите размер вашего ресторана/кафе',
        description: 'Это поможет нам точнее рассчитать маркетинговый бюджет',
        options: [
          {
            value: 'small_restaurant',
            title: '1-20 посадочных мест',
            description: 'Небольшое кафе или семейный ресторан',
            metrics: { baseBudget: 50000, savingsMultiplier: 1.2 }
          },
          {
            value: 'medium_restaurant',
            title: '21-50 посадочных мест',
            description: 'Средний ресторан с хорошей проходимостью',
            metrics: { baseBudget: 120000, savingsMultiplier: 1.3 }
          },
          {
            value: 'large_restaurant',
            title: '51-100 посадочных мест',
            description: 'Крупный ресторан или несколько залов',
            metrics: { baseBudget: 250000, savingsMultiplier: 1.4 }
          },
          {
            value: 'chain_restaurant',
            title: 'Более 100 мест или сеть заведений',
            description: 'Сетевой ресторан или крупная франшиза',
            metrics: { baseBudget: 500000, savingsMultiplier: 1.6 }
          }
        ]
      },
      beauty: {
        title: 'Выберите размер вашего салона красоты',
        description: 'Количество рабочих мест поможет персонализировать расчеты',
        options: [
          {
            value: 'small_salon',
            title: '1-3 рабочих места',
            description: 'Небольшой салон или домашняя студия',
            metrics: { baseBudget: 40000, savingsMultiplier: 1.3 }
          },
          {
            value: 'medium_salon',
            title: '4-8 рабочих мест',
            description: 'Салон среднего размера с командой мастеров',
            metrics: { baseBudget: 100000, savingsMultiplier: 1.4 }
          },
          {
            value: 'large_salon',
            title: '9-15 рабочих мест',
            description: 'Крупный салон или SPA-центр',
            metrics: { baseBudget: 200000, savingsMultiplier: 1.5 }
          },
          {
            value: 'chain_salon',
            title: 'Более 15 мест или сеть салонов',
            description: 'Сетевой салон или крупный wellness-центр',
            metrics: { baseBudget: 400000, savingsMultiplier: 1.7 }
          }
        ]
      },
      retail: {
        title: 'Выберите размер вашего торгового бизнеса',
        description: 'Масштаб поможет определить оптимальную маркетинговую стратегию',
        options: [
          {
            value: 'small_retail',
            title: 'Небольшой магазин (1-2 точки)',
            description: 'Локальный магазин или интернет-магазин',
            metrics: { baseBudget: 60000, savingsMultiplier: 1.2 }
          },
          {
            value: 'medium_retail',
            title: 'Средний ритейл (3-10 точек)',
            description: 'Региональная сеть или крупный магазин',
            metrics: { baseBudget: 150000, savingsMultiplier: 1.3 }
          },
          {
            value: 'large_retail',
            title: 'Крупный ритейл (10+ точек)',
            description: 'Федеральная сеть или маркетплейс',
            metrics: { baseBudget: 350000, savingsMultiplier: 1.4 }
          },
          {
            value: 'enterprise_retail',
            title: 'Корпоративный ритейл',
            description: 'Крупная торговая сеть или холдинг',
            metrics: { baseBudget: 800000, savingsMultiplier: 1.6 }
          }
        ]
      },
      // Универсальные размеры для остальных отраслей
      default: {
        title: 'Выберите размер вашего бизнеса',
        description: 'Количество сотрудников поможет персонализировать расчеты',
        options: [
          {
            value: 'small_business',
            title: 'Малый бизнес (1-10 сотрудников)',
            description: 'Небольшая команда, локальный рынок',
            metrics: { baseBudget: 70000, savingsMultiplier: 1.3 }
          },
          {
            value: 'medium_business',
            title: 'Средний бизнес (11-50 сотрудников)',
            description: 'Развивающаяся компания, региональное присутствие',
            metrics: { baseBudget: 180000, savingsMultiplier: 1.4 }
          },
          {
            value: 'large_business',
            title: 'Крупный бизнес (51-200 сотрудников)',
            description: 'Устоявшаяся компания, мультирегиональность',
            metrics: { baseBudget: 400000, savingsMultiplier: 1.5 }
          },
          {
            value: 'enterprise',
            title: 'Корпорация (200+ сотрудников)',
            description: 'Крупная корпорация, федеральный масштаб',
            metrics: { baseBudget: 1000000, savingsMultiplier: 1.7 }
          }
        ]
      }
    };

    // Обработчики событий
    this.handleSizeSelect = this.handleSizeSelect.bind(this);
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
      // Получаем выбранную отрасль из приложения
      this.industryKey = this.getSelectedIndustry();
      
      this.render();
      this.attachEventListeners();
      
      // Отправка analytics события
      this.trackEvent('step_2_viewed', {
        industry: this.industryKey,
        step: 2,
        timestamp: Date.now()
      });
      
      // Dispatch готовности компонента
      this.dispatchEvent('businessSizeStepReady', {
        industry: this.industryKey,
        options: this.getCurrentSizeOptions().length
      });
      
    } catch (error) {
      console.error('BusinessSizeStep: Ошибка инициализации:', error);
      this.renderError(error.message);
    }
  }

  /**
   * Получение выбранной отрасли из приложения
   * @private
   * @returns {string} Ключ отрасли
   */
  getSelectedIndustry() {
    // Получаем отрасль из global app state
    if (typeof window !== 'undefined' && window.app && window.app.formData) {
      return window.app.formData.industry?.key || window.app.formData.industryKey || 'default';
    }
    return 'default';
  }

  /**
   * Получение опций размера для текущей отрасли
   * @private
   * @returns {Array} Массив опций размера
   */
  getCurrentSizeOptions() {
    const sizeData = this.businessSizes[this.industryKey] || this.businessSizes.default;
    return sizeData.options;
  }

  /**
   * Получение заголовка и описания для текущей отрасли
   * @private
   * @returns {Object} Объект с title и description
   */
  getCurrentSizeData() {
    return this.businessSizes[this.industryKey] || this.businessSizes.default;
  }

  /**
   * Рендеринг HTML структуры
   * @private
   */
  render() {
    const sizeData = this.getCurrentSizeData();
    
    const stepHTML = `
      <div class="business-size-step" role="region" aria-label="Выбор размера бизнеса">
        <!-- Header -->
        <div class="step-header">
          <h2 class="step-title">${sizeData.title}</h2>
          ${this.options.showDescription ? `
            <p class="step-description">${sizeData.description}</p>
          ` : ''}
        </div>

        <!-- Business Size Options -->
        <div class="size-options-section">
          ${this.renderSizeOptions()}
        </div>

        <!-- Validation Error -->
        <div class="validation-error" id="size-validation-error" style="display: none;">
          <div class="error-message">
            <span class="error-icon">⚠️</span>
            <span class="error-text">Пожалуйста, выберите размер вашего бизнеса</span>
          </div>
        </div>

        <!-- Navigation Footer -->
        <div class="step-footer">
          <button type="button" class="btn btn-secondary btn-back" id="size-back-btn">
            <span class="btn-icon">←</span>
            Назад
          </button>
          
          <button type="button" class="btn btn-primary btn-next" id="size-next-btn" disabled>
            Далее
            <span class="btn-icon">→</span>
          </button>
        </div>

        <!-- Trust Indicators -->
        <div class="step-trust">
          <div class="trust-item">
            <span class="trust-icon">🔒</span>
            <span class="trust-text">Данные защищены</span>
          </div>
          <div class="trust-item">
            <span class="trust-icon">⚡</span>
            <span class="trust-text">Быстрый расчет</span>
          </div>
          <div class="trust-item">
            <span class="trust-icon">📊</span>
            <span class="trust-text">Точные данные</span>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = stepHTML;
    this.isRendered = true;
    
    // Cache DOM elements
    this.cacheElements();
  }

  /**
   * Рендеринг опций размера бизнеса
   * @private
   * @returns {string} HTML строка с опциями
   */
  renderSizeOptions() {
    const options = this.getCurrentSizeOptions();
    
    const optionsHTML = options.map((option, index) => `
      <div class="size-option" data-value="${option.value}">
        <label class="size-option-label" for="size-${option.value}">
          <input 
            type="radio" 
            id="size-${option.value}" 
            name="business-size" 
            value="${option.value}"
            class="size-radio"
            aria-describedby="desc-${option.value}"
          >
          <div class="size-option-content">
            <div class="size-option-header">
              <h3 class="size-option-title">${option.title}</h3>
              <div class="size-radio-indicator">
                <div class="radio-circle">
                  <div class="radio-inner"></div>
                </div>
              </div>
            </div>
            <p class="size-option-description" id="desc-${option.value}">
              ${option.description}
            </p>
          </div>
        </label>
      </div>
    `).join('');

    return `
      <div class="size-options-grid" role="radiogroup" aria-labelledby="step-title">
        ${optionsHTML}
      </div>
    `;
  }

  /**
   * Кэширование DOM элементов
   * @private
   */
  cacheElements() {
    this.elements = {
      step: this.container.querySelector('.business-size-step'),
      sizeOptions: this.container.querySelectorAll('.size-option'),
      radioInputs: this.container.querySelectorAll('.size-radio'),
      nextBtn: this.container.querySelector('#size-next-btn'),
      backBtn: this.container.querySelector('#size-back-btn'),
      validationError: this.container.querySelector('#size-validation-error')
    };
  }

  /**
   * Привязка обработчиков событий
   * @private
   */
  attachEventListeners() {
    if (!this.isRendered) return;

    try {
      // Radio buttons click handlers
      this.elements.radioInputs.forEach(radio => {
        radio.addEventListener('change', this.handleSizeSelect);
        radio.addEventListener('keydown', this.handleKeydown);
      });

      // Size option click handlers (для клика по всей карточке)
      this.elements.sizeOptions.forEach(option => {
        option.addEventListener('click', (event) => {
          const radio = option.querySelector('.size-radio');
          if (radio && event.target !== radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
          }
        });
      });

      // Navigation buttons
      if (this.elements.nextBtn) {
        this.elements.nextBtn.addEventListener('click', this.handleNextClick);
      }

      if (this.elements.backBtn) {
        this.elements.backBtn.addEventListener('click', this.handleBackClick);
      }

      // Keyboard navigation
      this.elements.step.addEventListener('keydown', this.handleKeydown);
      
    } catch (error) {
      console.error('BusinessSizeStep: Ошибка привязки событий:', error);
    }
  }

  /**
   * Обработка выбора размера бизнеса
   * @private
   * @param {Event} event - Событие change
   */
  handleSizeSelect(event) {
    try {
      const selectedValue = event.target.value;
      const sizeOption = this.getCurrentSizeOptions().find(opt => opt.value === selectedValue);
      
      if (!sizeOption) return;

      // Сохранение выбора
      this.selectedSize = {
        key: selectedValue,
        ...sizeOption
      };

      // Обновление UI
      this.updateSelectionState();
      
      // Скрытие ошибки валидации
      this.hideValidationError();
      
      // Активация кнопки "Далее"
      this.enableNextButton();

      // Analytics tracking
      this.trackEvent('business_size_selected', {
        size: selectedValue,
        industry: this.industryKey,
        step: 2,
        timestamp: Date.now(),
        metrics: sizeOption.metrics
      });

      // Колбэк выбора
      this.onSelect(this.selectedSize);
      
    } catch (error) {
      console.error('BusinessSizeStep: Ошибка выбора размера:', error);
    }
  }

  /**
   * Обработка нажатия клавиш
   * @private
   * @param {KeyboardEvent} event - Событие клавиатуры
   */
  handleKeydown(event) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        if (event.target.classList.contains('size-radio')) {
          // Space/Enter на radio button - уже обрабатывается браузером
          return;
        }
        if (event.target.closest('.size-option')) {
          event.preventDefault();
          const radio = event.target.closest('.size-option').querySelector('.size-radio');
          if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
          }
        }
        break;
        
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        this.navigateWithArrows(event.key === 'ArrowDown');
        break;
    }
  }

  /**
   * Навигация с помощью стрелок
   * @private
   * @param {boolean} isDown - Направление (true = вниз, false = вверх)
   */
  navigateWithArrows(isDown) {
    const radios = Array.from(this.elements.radioInputs);
    const currentIndex = radios.findIndex(radio => radio.checked);
    
    let nextIndex;
    if (currentIndex === -1) {
      nextIndex = isDown ? 0 : radios.length - 1;
    } else {
      nextIndex = isDown 
        ? (currentIndex + 1) % radios.length
        : (currentIndex - 1 + radios.length) % radios.length;
    }
    
    radios[nextIndex].focus();
    radios[nextIndex].checked = true;
    radios[nextIndex].dispatchEvent(new Event('change'));
  }

  /**
   * Обновление состояния выбора в UI
   * @private
   */
  updateSelectionState() {
    this.elements.sizeOptions.forEach(option => {
      const radio = option.querySelector('.size-radio');
      const isSelected = radio && radio.checked;
      
      option.classList.toggle('selected', isSelected);
      option.setAttribute('aria-selected', isSelected);
    });
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
      this.trackEvent('step_2_completed', {
        selectedSize: this.selectedSize.key,
        industry: this.industryKey,
        step: 2,
        timestamp: Date.now(),
        nextStep: 3
      });

      // Сохранение данных в приложении
      this.saveDataToApp();

      // Колбэк перехода
      this.onNext({
        step: 2,
        businessSize: this.selectedSize,
        industry: this.industryKey,
        nextStep: 3
      });
      
    } catch (error) {
      console.error('BusinessSizeStep: Ошибка перехода к следующему шагу:', error);
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
      this.trackEvent('step_2_back', {
        industry: this.industryKey,
        step: 2,
        timestamp: Date.now(),
        previousStep: 1
      });

      // Колбэк возврата
      this.onBack({
        step: 2,
        previousStep: 1
      });
      
    } catch (error) {
      console.error('BusinessSizeStep: Ошибка возврата к предыдущему шагу:', error);
    }
  }

  /**
   * Валидация выбора
   * @private
   * @returns {boolean} Результат валидации
   */
  validateSelection() {
    return this.selectedSize !== null;
  }

  /**
   * Показ ошибки валидации
   * @private
   */
  showValidationError() {
    if (this.elements.validationError) {
      this.elements.validationError.style.display = 'block';
      this.elements.validationError.setAttribute('aria-live', 'polite');
      
      // Фокус на первую опцию для accessibility
      const firstRadio = this.elements.radioInputs[0];
      if (firstRadio) {
        firstRadio.focus();
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
   * Активация кнопки "Далее"
   * @private
   */
  enableNextButton() {
    if (this.elements.nextBtn) {
      this.elements.nextBtn.disabled = false;
      this.elements.nextBtn.classList.add('enabled');
      this.elements.nextBtn.setAttribute('aria-disabled', 'false');
    }
  }

  /**
   * Деактивация кнопки "Далее"
   * @private
   */
  disableNextButton() {
    if (this.elements.nextBtn) {
      this.elements.nextBtn.disabled = true;
      this.elements.nextBtn.classList.remove('enabled');
      this.elements.nextBtn.setAttribute('aria-disabled', 'true');
    }
  }

  /**
   * Сохранение данных в приложении
   * @private
   */
  saveDataToApp() {
    if (typeof window !== 'undefined' && window.app && window.app.formData) {
      window.app.formData.businessSize = this.selectedSize;
      
      // Также сохраняем для обратной совместимости
      window.app.data = window.app.data || {};
      window.app.data.businessSize = this.selectedSize;
    }
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
      console.log('📊 BusinessSizeStep Analytics:', eventName, params);
      
    } catch (error) {
      console.warn('BusinessSizeStep: Ошибка отправки analytics:', error);
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
          component: 'BusinessSizeStep',
          timestamp: Date.now(),
          ...detail
        },
        bubbles: true,
        cancelable: true
      });
      
      this.container.dispatchEvent(event);
      
    } catch (error) {
      console.warn('BusinessSizeStep: Ошибка dispatch события:', error);
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
      <div class="business-size-step-error">
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
   * Получение выбранного размера
   * @public
   * @returns {Object|null} Выбранный размер или null
   */
  getSelectedSize() {
    return this.selectedSize;
  }

  /**
   * Установка выбранного размера программно
   * @public
   * @param {string} sizeKey - Ключ размера
   */
  setSelectedSize(sizeKey) {
    const radio = this.container.querySelector(`input[value="${sizeKey}"]`);
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));
    }
  }

  /**
   * Сброс компонента
   * @public
   */
  reset() {
    this.selectedSize = null;
    
    if (this.isRendered) {
      // Сброс radio buttons
      this.elements.radioInputs.forEach(radio => {
        radio.checked = false;
      });
      
      // Сброс UI состояния
      this.elements.sizeOptions.forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-selected', 'false');
      });
      
      // Деактивация кнопки
      this.disableNextButton();
      
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
        this.elements.radioInputs.forEach(radio => {
          radio.removeEventListener('change', this.handleSizeSelect);
          radio.removeEventListener('keydown', this.handleKeydown);
        });

        if (this.elements.nextBtn) {
          this.elements.nextBtn.removeEventListener('click', this.handleNextClick);
        }

        if (this.elements.backBtn) {
          this.elements.backBtn.removeEventListener('click', this.handleBackClick);
        }

        if (this.elements.step) {
          this.elements.step.removeEventListener('keydown', this.handleKeydown);
        }
      }

      // Очистка DOM
      this.container.innerHTML = '';
      
      // Очистка ссылок
      this.selectedSize = null;
      this.elements = null;
      this.isRendered = false;
      
      console.log('🗑️ BusinessSizeStep уничтожен');
      
    } catch (error) {
      console.error('BusinessSizeStep: Ошибка уничтожения:', error);
    }
  }
}

// Экспорт для использования в других модулях
if (typeof window !== 'undefined') {
  window.BusinessSizeStep = BusinessSizeStep;
}

export default BusinessSizeStep; 