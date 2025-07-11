/**
 * IndustrySelector Component для Universal Calculator
 * Первый шаг формы - выбор отрасли бизнеса
 * 
 * @class IndustrySelector
 * @author Steamphony Digital Agency
 */
class IndustrySelector {
  /**
   * Создает экземпляр IndustrySelector
   * 
   * @param {HTMLElement} container - DOM элемент для размещения компонента
   * @param {Object} options - Опции конфигурации
   */
  constructor(container, options = {}) {
    // Валидация входных параметров
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('IndustrySelector: container должен быть DOM элементом');
    }

    // Основные свойства
    this.container = container;
    this.selectedIndustry = null;
    this.filteredIndustries = [];
    this.searchTerm = '';
    this.isRendered = false;

    // Колбэки
    this.onSelect = options.onSelect || (() => {});
    this.onNext = options.onNext || (() => {});
    this.onSearch = options.onSearch || (() => {});

    // Конфигурация
    this.options = {
      showPopularSection: true,
      enableSearch: true,
      enableCustomInput: true,
      popularLimit: 4,
      minSearchLength: 2,
      ...options
    };

    // Hardcoded данные 8 отраслей
    this.industries = {
      restaurant: {
        key: 'restaurant',
        icon: '🍽️',
        title: 'Ресторанный бизнес',
        description: 'Рестораны, кафе, бары, доставка еды',
        examples: 'Привлечение гостей, бронирования столиков, онлайн-заказы',
        popular: true,
        searchTerms: ['ресторан', 'кафе', 'бар', 'еда', 'доставка', 'общепит', 'питание'],
        metrics: {
          avgBudget: 150000,
          avgSavings: 30,
          roiMultiplier: 1.2
        }
      },
      beauty: {
        key: 'beauty',
        icon: '💅',
        title: 'Красота и wellness',
        description: 'Салоны красоты, СПА, фитнес, массаж',
        examples: 'Запись клиентов, продвижение услуг, лояльность',
        popular: true,
        searchTerms: ['салон', 'красота', 'спа', 'фитнес', 'массаж', 'косметология', 'wellness'],
        metrics: {
          avgBudget: 120000,
          avgSavings: 35,
          roiMultiplier: 1.4
        }
      },
      retail: {
        key: 'retail',
        icon: '🛍️',
        title: 'Ритейл и торговля',
        description: 'Магазины, интернет-магазины, маркетплейсы',
        examples: 'Продажи, конверсия, удержание клиентов',
        popular: true,
        searchTerms: ['магазин', 'торговля', 'ритейл', 'ecommerce', 'интернет-магазин', 'маркетплейс'],
        metrics: {
          avgBudget: 200000,
          avgSavings: 25,
          roiMultiplier: 1.3
        }
      },
      services: {
        key: 'services',
        icon: '🏥',
        title: 'Услуги',
        description: 'Медицина, образование, консалтинг, ремонт',
        examples: 'Поиск клиентов, доверие, экспертность',
        popular: true,
        searchTerms: ['медицина', 'образование', 'консалтинг', 'услуги', 'ремонт', 'стоматология'],
        metrics: {
          avgBudget: 180000,
          avgSavings: 40,
          roiMultiplier: 1.6
        }
      },
      b2b: {
        key: 'b2b',
        icon: '🏗️',
        title: 'B2B сфера',
        description: 'Производство, логистика, IT, оборудование',
        examples: 'Лидогенерация, длинный цикл продаж, экспертность',
        popular: false,
        searchTerms: ['производство', 'логистика', 'it', 'b2b', 'оборудование', 'промышленность'],
        metrics: {
          avgBudget: 300000,
          avgSavings: 45,
          roiMultiplier: 1.8
        }
      },
      realestate: {
        key: 'realestate',
        icon: '🏠',
        title: 'Недвижимость',
        description: 'Агентства, девелопмент, аренда, управление',
        examples: 'Продажи объектов, доверие, геотаргетинг',
        popular: false,
        searchTerms: ['недвижимость', 'агентство', 'девелопмент', 'аренда', 'квартиры', 'дома'],
        metrics: {
          avgBudget: 250000,
          avgSavings: 35,
          roiMultiplier: 1.5
        }
      },
      finance: {
        key: 'finance',
        icon: '💼',
        title: 'Финансы',
        description: 'Банки, страхование, инвестиции, кредиты',
        examples: 'Привлечение клиентов, доверие, финансовая грамотность',
        popular: false,
        searchTerms: ['банк', 'финансы', 'страхование', 'кредит', 'инвестиции', 'займы'],
        metrics: {
          avgBudget: 400000,
          avgSavings: 30,
          roiMultiplier: 1.7
        }
      },
      other: {
        key: 'other',
        icon: '🎯',
        title: 'Другое',
        description: 'Укажите вашу отрасль',
        examples: 'Индивидуальный подход и персонализация',
        popular: false,
        searchTerms: ['другое', 'прочее', 'иное', 'специфическое'],
        metrics: {
          avgBudget: 150000,
          avgSavings: 30,
          roiMultiplier: 1.2
        },
        customInput: true
      }
    };

    // Обработчики событий
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleCardKeydown = this.handleCardKeydown.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleCustomInput = this.handleCustomInput.bind(this);

    // Инициализация
    this.init();
  }

  /**
   * Инициализация компонента
   * @private
   */
  init() {
    try {
      this.filteredIndustries = Object.values(this.industries);
      this.render();
      this.attachEventListeners();
      
      // Dispatch готовности компонента
      this.dispatchEvent('industrySelectorReady', {
        totalIndustries: Object.keys(this.industries).length,
        popularIndustries: this.getPopularIndustries().length
      });
    } catch (error) {
      console.error('IndustrySelector: Ошибка инициализации:', error);
      this.renderError(error.message);
    }
  }

  /**
   * Рендеринг HTML структуры
   * @private
   */
  render() {
    const selectorHTML = `
      <div class="industry-selector" role="region" aria-label="Выбор отрасли бизнеса">
        <!-- Header -->
        <div class="selector-header">
          <h2 class="selector-title">Выберите вашу отрасль</h2>
          <p class="selector-description">
            Это поможет нам подготовить персонализированный расчет экономии для вашего бизнеса
          </p>
        </div>

        <!-- Search -->
        ${this.options.enableSearch ? this.renderSearch() : ''}

        <!-- Popular Industries -->
        ${this.options.showPopularSection ? this.renderPopularSection() : ''}

        <!-- All Industries -->
        <div class="industries-section">
          <h3 class="section-title">Все отрасли</h3>
          <div class="industries-grid" role="grid" aria-label="Список отраслей">
            ${this.renderIndustryCards()}
          </div>
        </div>

        <!-- Custom Input (hidden by default) -->
        <div class="custom-input-section" id="custom-input-section" style="display: none;">
          <div class="custom-input-wrapper">
            <label for="custom-industry-input" class="form-label">
              Укажите вашу отрасль
            </label>
            <input 
              type="text" 
              id="custom-industry-input" 
              class="form-input custom-industry-input"
              placeholder="Например: Автосервис, Туризм, Транспорт..."
              maxlength="50"
              aria-describedby="custom-input-help"
            >
            <div id="custom-input-help" class="form-help">
              Опишите специфику вашего бизнеса в 2-3 словах
            </div>
            <div class="custom-input-error" id="custom-input-error" role="alert" aria-live="polite"></div>
          </div>
        </div>

        <!-- Next Button -->
        <div class="selector-actions">
          <button 
            type="button" 
            class="btn btn-primary btn-lg selector-next-btn" 
            id="industry-next-btn"
            disabled
            aria-describedby="next-btn-help"
          >
            Продолжить
            <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <div id="next-btn-help" class="form-help">
            Выберите отрасль для продолжения
          </div>
        </div>

        <!-- Trust Signals -->
        <div class="selector-trust">
          <div class="trust-item">
            <span class="trust-icon">🔒</span>
            <span class="trust-text">100% конфиденциально</span>
          </div>
          <div class="trust-item">
            <span class="trust-icon">⚡</span>
            <span class="trust-text">Расчет за 3 минуты</span>
          </div>
          <div class="trust-item">
            <span class="trust-icon">🎯</span>
            <span class="trust-text">Персонализированный результат</span>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = selectorHTML;
    this.cacheElements();
    this.isRendered = true;
  }

  /**
   * Рендеринг search секции
   * @private
   * @returns {string} HTML search секции
   */
  renderSearch() {
    return `
      <div class="search-section">
        <div class="search-wrapper">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              type="text" 
              class="search-input" 
              id="industry-search"
              placeholder="Поиск по отрасли..."
              aria-label="Поиск отрасли"
              autocomplete="off"
            >
            <button 
              type="button" 
              class="search-clear" 
              id="search-clear"
              aria-label="Очистить поиск"
              style="display: none;"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Рендеринг секции популярных отраслей
   * @private
   * @returns {string} HTML популярных отраслей
   */
  renderPopularSection() {
    const popularIndustries = this.getPopularIndustries();
    
    if (popularIndustries.length === 0) {
      return '';
    }

    return `
      <div class="popular-section">
        <h3 class="section-title">
          <span class="section-icon">🔥</span>
          Популярные отрасли
        </h3>
        <div class="popular-grid" role="grid" aria-label="Популярные отрасли">
          ${popularIndustries.map(industry => this.renderIndustryCard(industry, true)).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Рендеринг карточек отраслей
   * @private
   * @returns {string} HTML карточек
   */
  renderIndustryCards() {
    return this.filteredIndustries
      .filter(industry => !industry.popular || !this.options.showPopularSection)
      .map(industry => this.renderIndustryCard(industry))
      .join('');
  }

  /**
   * Рендеринг отдельной карточки отрасли
   * @private
   * @param {Object} industry - Данные отрасли
   * @param {boolean} isPopular - Является ли популярной
   * @returns {string} HTML карточки
   */
  renderIndustryCard(industry, isPopular = false) {
    const isSelected = this.selectedIndustry?.key === industry.key;
    const cardClasses = [
      'industry-card',
      isSelected ? 'selected' : '',
      isPopular ? 'popular' : '',
      industry.key === 'other' ? 'custom' : ''
    ].filter(Boolean).join(' ');

    return `
      <div 
        class="${cardClasses}"
        data-industry="${industry.key}"
        role="button"
        tabindex="0"
        aria-pressed="${isSelected}"
        aria-describedby="industry-${industry.key}-desc"
      >
        <div class="card-header">
          <div class="card-icon" role="img" aria-label="${industry.title}">${industry.icon}</div>
          ${isSelected ? '<div class="card-checkmark" aria-hidden="true">✓</div>' : ''}
          ${isPopular ? '<div class="card-badge">Популярно</div>' : ''}
        </div>
        
        <div class="card-content">
          <h4 class="card-title">${industry.title}</h4>
          <p class="card-description" id="industry-${industry.key}-desc">
            ${industry.description}
          </p>
          <div class="card-examples">
            <span class="examples-label">Задачи:</span>
            <span class="examples-text">${industry.examples}</span>
          </div>
        </div>

        <div class="card-footer">
          <div class="card-metrics">
            <div class="metric">
              <span class="metric-value">${industry.metrics.avgSavings}%</span>
              <span class="metric-label">средняя экономия</span>
            </div>
            <div class="metric">
              <span class="metric-value">${industry.metrics.roiMultiplier}x</span>
              <span class="metric-label">ROI</span>
            </div>
          </div>
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
      searchInput: this.container.querySelector('#industry-search'),
      searchClear: this.container.querySelector('#search-clear'),
      industryCards: this.container.querySelectorAll('.industry-card'),
      industriesGrid: this.container.querySelector('.industries-grid'),
      popularGrid: this.container.querySelector('.popular-grid'),
      nextBtn: this.container.querySelector('#industry-next-btn'),
      customInputSection: this.container.querySelector('#custom-input-section'),
      customInput: this.container.querySelector('#custom-industry-input'),
      customInputError: this.container.querySelector('#custom-input-error'),
      nextBtnHelp: this.container.querySelector('#next-btn-help')
    };
  }

  /**
   * Подключение обработчиков событий
   * @private
   */
  attachEventListeners() {
    // Search functionality
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener('input', this.handleSearch);
      this.elements.searchClear.addEventListener('click', () => this.clearSearch());
    }

    // Industry cards
    this.elements.industryCards.forEach(card => {
      card.addEventListener('click', this.handleCardClick);
      card.addEventListener('keydown', this.handleCardKeydown);
    });

    // Next button
    if (this.elements.nextBtn) {
      this.elements.nextBtn.addEventListener('click', this.handleNextClick);
    }

    // Custom input
    if (this.elements.customInput) {
      this.elements.customInput.addEventListener('input', this.handleCustomInput);
      this.elements.customInput.addEventListener('blur', this.validateCustomInput.bind(this));
    }
  }

  /**
   * Обработка поиска
   * @private
   * @param {Event} event - Событие input
   */
  handleSearch(event) {
    const query = event.target.value.trim().toLowerCase();
    this.searchTerm = query;

    // Показать/скрыть кнопку очистки
    if (this.elements.searchClear) {
      this.elements.searchClear.style.display = query ? 'flex' : 'none';
    }

    // Фильтрация отраслей
    this.filterIndustries(query);
    
    // Dispatch события поиска
    this.dispatchEvent('searchPerformed', {
      query,
      resultsCount: this.filteredIndustries.length
    });
  }

  /**
   * Фильтрация отраслей по поисковому запросу
   * @private
   * @param {string} query - Поисковый запрос
   */
  filterIndustries(query) {
    if (!query || query.length < this.options.minSearchLength) {
      this.filteredIndustries = Object.values(this.industries);
    } else {
      this.filteredIndustries = Object.values(this.industries).filter(industry => {
        const searchableText = [
          industry.title,
          industry.description,
          industry.examples,
          ...industry.searchTerms
        ].join(' ').toLowerCase();
        
        return searchableText.includes(query);
      });
    }

    // Обновить отображение
    this.updateIndustriesDisplay();
  }

  /**
   * Обновление отображения отраслей
   * @private
   */
  updateIndustriesDisplay() {
    if (!this.elements.industriesGrid) return;

    const filteredNonPopular = this.filteredIndustries.filter(
      industry => !industry.popular || !this.options.showPopularSection
    );

    this.elements.industriesGrid.innerHTML = 
      filteredNonPopular.map(industry => this.renderIndustryCard(industry)).join('');

    // Перезапуск обработчиков для новых элементов
    this.reattachCardListeners();

    // Показать сообщение "не найдено"
    if (this.filteredIndustries.length === 0) {
      this.showNoResults();
    }
  }

  /**
   * Перезапуск обработчиков для карточек
   * @private
   */
  reattachCardListeners() {
    this.elements.industryCards = this.container.querySelectorAll('.industry-card');
    this.elements.industryCards.forEach(card => {
      card.addEventListener('click', this.handleCardClick);
      card.addEventListener('keydown', this.handleCardKeydown);
    });
  }

  /**
   * Показать сообщение "не найдено"
   * @private
   */
  showNoResults() {
    const noResultsHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3 class="no-results-title">Не найдено</h3>
        <p class="no-results-text">
          Попробуйте изменить поисковый запрос или выберите "Другое" для индивидуального расчета
        </p>
        <button type="button" class="btn btn-outline btn-sm" onclick="this.parentElement.parentElement.querySelector('#industry-search').value = ''; this.parentElement.parentElement.querySelector('#industry-search').dispatchEvent(new Event('input'))">
          Очистить поиск
        </button>
      </div>
    `;
    
    this.elements.industriesGrid.innerHTML = noResultsHTML;
  }

  /**
   * Очистка поиска
   * @private
   */
  clearSearch() {
    if (this.elements.searchInput) {
      this.elements.searchInput.value = '';
      this.elements.searchInput.focus();
    }
    
    if (this.elements.searchClear) {
      this.elements.searchClear.style.display = 'none';
    }
    
    this.searchTerm = '';
    this.filterIndustries('');
  }

  /**
   * Обработка клика по карточке
   * @private
   * @param {Event} event - Событие клика
   */
  handleCardClick(event) {
    const card = event.currentTarget;
    const industryKey = card.dataset.industry;
    
    if (industryKey) {
      this.selectIndustry(industryKey);
    }
  }

  /**
   * Обработка клавиатурной навигации по карточкам
   * @private
   * @param {KeyboardEvent} event - Событие клавиатуры
   */
  handleCardKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleCardClick(event);
    }
  }

  /**
   * Выбор отрасли
   * @public
   * @param {string} industryKey - Ключ отрасли
   */
  selectIndustry(industryKey) {
    const industry = this.industries[industryKey];
    
    if (!industry) {
      console.warn(`IndustrySelector: Неизвестная отрасль ${industryKey}`);
      return;
    }

    // Сохранить выбор
    this.selectedIndustry = industry;

    // Обновить визуальные состояния
    this.updateSelectionState();

    // Показать/скрыть custom input
    if (industry.customInput) {
      this.showCustomInput();
    } else {
      this.hideCustomInput();
    }

    // Активировать кнопку Next
    this.enableNextButton();

    // Вызвать колбэк
    this.onSelect(industryKey, industry);

    // Dispatch события
    this.dispatchEvent('industrySelected', {
      industryKey,
      industry,
      hasCustomInput: !!industry.customInput
    });
  }

  /**
   * Обновление визуального состояния выбора
   * @private
   */
  updateSelectionState() {
    this.elements.industryCards.forEach(card => {
      const isSelected = card.dataset.industry === this.selectedIndustry?.key;
      
      card.classList.toggle('selected', isSelected);
      card.setAttribute('aria-pressed', isSelected);
      
      // Обновить checkmark
      const existingCheckmark = card.querySelector('.card-checkmark');
      if (isSelected && !existingCheckmark) {
        const checkmark = document.createElement('div');
        checkmark.className = 'card-checkmark';
        checkmark.setAttribute('aria-hidden', 'true');
        checkmark.textContent = '✓';
        card.querySelector('.card-header').appendChild(checkmark);
      } else if (!isSelected && existingCheckmark) {
        existingCheckmark.remove();
      }
    });
  }

  /**
   * Показать custom input
   * @private
   */
  showCustomInput() {
    if (this.elements.customInputSection) {
      this.elements.customInputSection.style.display = 'block';
      this.elements.customInput.focus();
    }
  }

  /**
   * Скрыть custom input
   * @private
   */
  hideCustomInput() {
    if (this.elements.customInputSection) {
      this.elements.customInputSection.style.display = 'none';
      this.elements.customInput.value = '';
      this.clearCustomInputError();
    }
  }

  /**
   * Обработка ввода в custom input
   * @private
   * @param {Event} event - Событие input
   */
  handleCustomInput(event) {
    const value = event.target.value.trim();
    
    if (this.selectedIndustry?.customInput) {
      this.selectedIndustry.customValue = value;
      this.selectedIndustry.title = value || 'Другое';
      
      // Валидация
      if (value.length >= 2) {
        this.enableNextButton();
        this.clearCustomInputError();
      } else {
        this.disableNextButton();
        this.showCustomInputError('Укажите отрасль (минимум 2 символа)');
      }
    }
  }

  /**
   * Валидация custom input
   * @private
   */
  validateCustomInput() {
    if (!this.selectedIndustry?.customInput) return true;
    
    const value = this.elements.customInput.value.trim();
    
    if (value.length < 2) {
      this.showCustomInputError('Укажите отрасль (минимум 2 символа)');
      return false;
    }
    
    if (value.length > 50) {
      this.showCustomInputError('Слишком длинное название (максимум 50 символов)');
      return false;
    }
    
    this.clearCustomInputError();
    return true;
  }

  /**
   * Показать ошибку custom input
   * @private
   * @param {string} message - Сообщение об ошибке
   */
  showCustomInputError(message) {
    if (this.elements.customInputError) {
      this.elements.customInputError.textContent = message;
      this.elements.customInputError.style.display = 'block';
    }
    
    if (this.elements.customInput) {
      this.elements.customInput.classList.add('error');
    }
  }

  /**
   * Очистить ошибку custom input
   * @private
   */
  clearCustomInputError() {
    if (this.elements.customInputError) {
      this.elements.customInputError.style.display = 'none';
    }
    
    if (this.elements.customInput) {
      this.elements.customInput.classList.remove('error');
    }
  }

  /**
   * Активировать кнопку Next
   * @private
   */
  enableNextButton() {
    if (this.elements.nextBtn) {
      this.elements.nextBtn.disabled = false;
      this.elements.nextBtn.classList.add('enabled');
    }
    
    if (this.elements.nextBtnHelp) {
      this.elements.nextBtnHelp.textContent = 'Нажмите для продолжения';
    }
  }

  /**
   * Деактивировать кнопку Next
   * @private
   */
  disableNextButton() {
    if (this.elements.nextBtn) {
      this.elements.nextBtn.disabled = true;
      this.elements.nextBtn.classList.remove('enabled');
    }
    
    if (this.elements.nextBtnHelp) {
      this.elements.nextBtnHelp.textContent = 'Выберите отрасль для продолжения';
    }
  }

  /**
   * Обработка клика по кнопке Next
   * @private
   * @param {Event} event - Событие клика
   */
  handleNextClick(event) {
    event.preventDefault();
    
    if (!this.selectedIndustry) {
      this.showError('Выберите отрасль для продолжения');
      return;
    }
    
    // Валидация custom input
    if (this.selectedIndustry.customInput && !this.validateCustomInput()) {
      return;
    }
    
    const selectionData = {
      industryKey: this.selectedIndustry.key,
      industry: this.selectedIndustry,
      customValue: this.selectedIndustry.customValue || null,
      metrics: this.selectedIndustry.metrics,
      timestamp: new Date().toISOString()
    };
    
    // Вызвать колбэк
    this.onNext(selectionData);
    
    // Dispatch события
    this.dispatchEvent('industryConfirmed', selectionData);
  }

  /**
   * Получение популярных отраслей
   * @private
   * @returns {Array} Массив популярных отраслей
   */
  getPopularIndustries() {
    return Object.values(this.industries)
      .filter(industry => industry.popular)
      .slice(0, this.options.popularLimit);
  }

  /**
   * Получение данных выбранной отрасли
   * @public
   * @returns {Object|null} Данные отрасли или null
   */
  getSelectedIndustry() {
    return this.selectedIndustry;
  }

  /**
   * Программная установка выбранной отрасли
   * @public
   * @param {string} industryKey - Ключ отрасли
   */
  setSelectedIndustry(industryKey) {
    this.selectIndustry(industryKey);
  }

  /**
   * Сброс выбора
   * @public
   */
  reset() {
    this.selectedIndustry = null;
    this.clearSearch();
    this.hideCustomInput();
    this.disableNextButton();
    this.updateSelectionState();
  }

  /**
   * Показать ошибку
   * @private
   * @param {string} message - Сообщение об ошибке
   */
  showError(message) {
    // Можно добавить toast notification или другой способ отображения ошибок
    console.error('IndustrySelector:', message);
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
   * Рендеринг ошибки
   * @private
   * @param {string} message - Сообщение об ошибке
   */
  renderError(message) {
    this.container.innerHTML = `
      <div class="industry-selector-error">
        <div class="error-icon">⚠️</div>
        <div class="error-message">
          <h3>Ошибка загрузки селектора отраслей</h3>
          <p>${message}</p>
          <button onclick="location.reload()" class="btn btn-primary btn-sm">
            Обновить страницу
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Уничтожение компонента
   * @public
   */
  destroy() {
    // Удаление обработчиков событий
    if (this.elements.searchInput) {
      this.elements.searchInput.removeEventListener('input', this.handleSearch);
    }
    
    if (this.elements.searchClear) {
      this.elements.searchClear.removeEventListener('click', this.clearSearch);
    }
    
    this.elements.industryCards.forEach(card => {
      card.removeEventListener('click', this.handleCardClick);
      card.removeEventListener('keydown', this.handleCardKeydown);
    });
    
    if (this.elements.nextBtn) {
      this.elements.nextBtn.removeEventListener('click', this.handleNextClick);
    }
    
    if (this.elements.customInput) {
      this.elements.customInput.removeEventListener('input', this.handleCustomInput);
    }
    
    // Очистка DOM
    this.container.innerHTML = '';
    
    // Dispatch события уничтожения
    this.dispatchEvent('industrySelectorDestroyed', {
      selectedIndustry: this.selectedIndustry
    });
  }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IndustrySelector;
}

// Глобальная доступность
if (typeof window !== 'undefined') {
  window.IndustrySelector = IndustrySelector;
} 