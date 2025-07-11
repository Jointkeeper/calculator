/**
 * IndustrySelector Component - Упрощенная версия
 * Первый шаг формы - выбор отрасли бизнеса
 * 
 * @class IndustrySelector
 * @author Steamphony Digital Agency
 */

import { getAllIndustries, getPopularIndustries } from '../data/industries.js';

class IndustrySelector {
  constructor(container, options = {}) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('IndustrySelector: container должен быть DOM элементом');
    }

    this.container = container;
    this.selectedIndustry = null;
    this.filteredIndustries = [];
    this.searchTerm = '';
    this.isRendered = false;

    this.onSelect = options.onSelect || (() => {});
    this.onNext = options.onNext || (() => {});
    this.onSearch = options.onSearch || (() => {});

    this.options = {
      showPopularSection: true,
      enableSearch: true,
      enableCustomInput: true,
      popularLimit: 4,
      minSearchLength: 2,
      ...options
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    this.init();
  }

  /**
   * Инициализация компонента
   */
  init() {
    try {
      this.industries = getAllIndustries();
      this.filteredIndustries = this.industries;
      this.render();
      this.attachEventListeners();
      this.trackEvent('step_1_viewed');
    } catch (error) {
      this.handleError('INIT_ERROR', error);
    }
  }

  /**
   * Рендеринг компонента
   */
  render() {
    this.container.innerHTML = `
      <div class="industry-selector">
        <div class="selector-header">
          <h2>Выберите вашу отрасль</h2>
          <p>Это поможет нам дать более точные рекомендации</p>
        </div>

        ${this.options.enableSearch ? this.renderSearch() : ''}

        ${this.options.showPopularSection ? this.renderPopularSection() : ''}

        <div class="industries-grid">
          ${this.renderIndustryCards()}
        </div>

        <div class="step-navigation">
          <button type="button" class="btn btn-primary next-btn" disabled>Далее</button>
        </div>
      </div>
    `;

    this.isRendered = true;
  }

  /**
   * Рендеринг поиска
   */
  renderSearch() {
    return `
      <div class="search-container">
        <div class="search-input-wrapper">
          <input type="text" 
                 class="search-input" 
                 placeholder="Поиск отрасли..."
                 aria-label="Поиск отрасли">
          <button type="button" class="search-clear" style="display: none;">✕</button>
        </div>
      </div>
    `;
  }

  /**
   * Рендеринг популярных отраслей
   */
  renderPopularSection() {
    const popularIndustries = getPopularIndustries().slice(0, this.options.popularLimit);
    
    if (popularIndustries.length === 0) return '';

    return `
      <div class="popular-section">
        <h3>Популярные отрасли</h3>
        <div class="popular-grid">
          ${popularIndustries.map(industry => this.renderIndustryCard(industry, true)).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Рендеринг карточек отраслей
   */
  renderIndustryCards() {
    if (this.filteredIndustries.length === 0) {
      return `
        <div class="no-results">
          <p>По вашему запросу ничего не найдено</p>
          <button type="button" class="btn btn-secondary clear-search">Очистить поиск</button>
        </div>
      `;
    }

    return this.filteredIndustries.map(industry => this.renderIndustryCard(industry)).join('');
  }

  /**
   * Рендеринг карточки отрасли
   */
  renderIndustryCard(industry, isPopular = false) {
    const isSelected = this.selectedIndustry?.key === industry.key;
    const cardClass = `industry-card ${isPopular ? 'popular' : ''} ${isSelected ? 'selected' : ''}`;
    
    return `
      <div class="${cardClass}" 
           data-industry-key="${industry.key}" 
           tabindex="0" 
           role="button" 
           aria-label="Выбрать ${industry.displayName}">
        <div class="card-icon">${industry.icon}</div>
        <div class="card-content">
          <h3 class="card-title">${industry.displayName}</h3>
          <p class="card-description">${industry.description}</p>
          <p class="card-examples">${industry.examples}</p>
        </div>
        ${isSelected ? '<div class="selection-indicator">✓</div>' : ''}
      </div>
    `;
  }

  /**
   * Прикрепление обработчиков событий
   */
  attachEventListeners() {
    const searchInput = this.container.querySelector('.search-input');
    const searchClear = this.container.querySelector('.search-clear');
    const clearSearch = this.container.querySelector('.clear-search');
    const industryCards = this.container.querySelectorAll('.industry-card');
    const nextBtn = this.container.querySelector('.next-btn');

    if (searchInput) {
      searchInput.addEventListener('input', this.handleSearch);
      searchInput.addEventListener('keydown', this.handleKeydown);
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => this.clearSearch());
    }

    if (clearSearch) {
      clearSearch.addEventListener('click', () => this.clearSearch());
    }

    industryCards.forEach(card => {
      card.addEventListener('click', this.handleCardClick);
      card.addEventListener('keydown', this.handleKeydown);
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', this.handleNextClick);
    }

    document.addEventListener('keydown', this.handleKeydown);
  }

  /**
   * Обработка поиска
   */
  handleSearch(event) {
    const query = event.target.value.trim();
    this.searchTerm = query;
    
    const searchClear = this.container.querySelector('.search-clear');
    if (searchClear) {
      searchClear.style.display = query ? 'block' : 'none';
    }

    if (query.length >= this.options.minSearchLength) {
      this.filterIndustries(query);
    } else {
      this.filteredIndustries = this.industries;
    }

    this.updateIndustriesDisplay();
    this.onSearch(query);
  }

  /**
   * Фильтрация отраслей
   */
  filterIndustries(query) {
    const lowerQuery = query.toLowerCase();
    
    this.filteredIndustries = this.industries.filter(industry => {
      // Поиск по названию
      if (industry.displayName.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Поиск по описанию
      if (industry.description.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Поиск по примерам
      if (industry.examples.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Поиск по ключевым словам
      if (industry.searchTerms && industry.searchTerms.some(term => 
        term.toLowerCase().includes(lowerQuery)
      )) {
        return true;
      }
      
      return false;
    });
  }

  /**
   * Обновление отображения отраслей
   */
  updateIndustriesDisplay() {
    const industriesGrid = this.container.querySelector('.industries-grid');
    if (industriesGrid) {
      industriesGrid.innerHTML = this.renderIndustryCards();
      this.reattachCardListeners();
    }
  }

  /**
   * Повторное прикрепление обработчиков карточек
   */
  reattachCardListeners() {
    const industryCards = this.container.querySelectorAll('.industry-card');
    industryCards.forEach(card => {
      card.addEventListener('click', this.handleCardClick);
      card.addEventListener('keydown', this.handleKeydown);
    });
  }

  /**
   * Очистка поиска
   */
  clearSearch() {
    const searchInput = this.container.querySelector('.search-input');
    if (searchInput) {
      searchInput.value = '';
      this.searchTerm = '';
    }
    
    const searchClear = this.container.querySelector('.search-clear');
    if (searchClear) {
      searchClear.style.display = 'none';
    }
    
    this.filteredIndustries = this.industries;
    this.updateIndustriesDisplay();
  }

  /**
   * Обработка клика по карточке
   */
  handleCardClick(event) {
    const card = event.currentTarget;
    const industryKey = card.dataset.industryKey;
    this.selectIndustry(industryKey);
  }

  /**
   * Обработка нажатия клавиш
   */
  handleKeydown(event) {
    if (event.key === 'Enter') {
      if (event.target.classList.contains('industry-card')) {
        const industryKey = event.target.dataset.industryKey;
        this.selectIndustry(industryKey);
      } else if (this.selectedIndustry) {
        this.handleNextClick();
      }
    } else if (event.key === 'Escape') {
      this.clearSearch();
    }
  }

  /**
   * Выбор отрасли
   */
  selectIndustry(industryKey) {
    const industry = this.industries.find(ind => ind.key === industryKey);
    if (!industry) return;

    this.selectedIndustry = industry;
    this.updateSelectionState();
    this.enableNextButton();
    this.onSelect(industry);
    this.trackIndustrySelection(industry);
  }

  /**
   * Обновление состояния выбора
   */
  updateSelectionState() {
    const industryCards = this.container.querySelectorAll('.industry-card');
    
    industryCards.forEach(card => {
      const isSelected = card.dataset.industryKey === this.selectedIndustry?.key;
      card.classList.toggle('selected', isSelected);
      
      const indicator = card.querySelector('.selection-indicator');
      if (isSelected) {
        if (!indicator) {
          card.insertAdjacentHTML('beforeend', '<div class="selection-indicator">✓</div>');
        }
      } else {
        if (indicator) {
          indicator.remove();
        }
      }
    });
  }

  /**
   * Включение кнопки "Далее"
   */
  enableNextButton() {
    const nextBtn = this.container.querySelector('.next-btn');
    if (nextBtn) {
      nextBtn.disabled = false;
    }
  }

  /**
   * Выключение кнопки "Далее"
   */
  disableNextButton() {
    const nextBtn = this.container.querySelector('.next-btn');
    if (nextBtn) {
      nextBtn.disabled = true;
    }
  }

  /**
   * Обработка нажатия "Далее"
   */
  handleNextClick(event) {
    if (!this.selectedIndustry) {
      this.showValidationError('Пожалуйста, выберите отрасль');
      return;
    }

    try {
      const industryData = this.prepareIndustryData();
      this.saveDataToApp(industryData);
      this.trackStepCompletion();
      this.onNext(industryData);
    } catch (error) {
      this.handleError('NEXT_ERROR', error);
    }
  }

  /**
   * Подготовка данных отрасли
   */
  prepareIndustryData() {
    return {
      key: this.selectedIndustry.key,
      title: this.selectedIndustry.displayName,
      icon: this.selectedIndustry.icon,
      description: this.selectedIndustry.description,
      examples: this.selectedIndustry.examples,
      popular: this.selectedIndustry.popular,
      searchTerms: this.selectedIndustry.searchTerms
    };
  }

  /**
   * Сохранение данных в приложение
   */
  saveDataToApp(industryData) {
    if (window.app && window.app.appState) {
      window.app.appState.updateField('industry', industryData);
    }
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
    try {
      if (window.gtag) {
        window.gtag('event', eventName, {
          step: 1,
          ...params
        });
      }
    } catch (error) {
      console.error('Ошибка отслеживания события:', error);
    }
  }

  /**
   * Отслеживание выбора отрасли
   */
  trackIndustrySelection(industry) {
    this.trackEvent('industry_selected', {
      industry_key: industry.key,
      industry_name: industry.displayName,
      is_popular: industry.popular
    });
  }

  /**
   * Отслеживание завершения шага
   */
  trackStepCompletion() {
    this.trackEvent('step_completed', {
      step_name: 'industry_selection',
      selected_industry: this.selectedIndustry?.key
    });
  }

  /**
   * Обработка ошибок
   */
  handleError(errorCode, error) {
    console.error(`IndustrySelector Error [${errorCode}]:`, error);
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
   * Получение выбранной отрасли
   */
  getSelectedIndustry() {
    return this.selectedIndustry;
  }

  /**
   * Установка отрасли
   */
  setSelectedIndustry(industryKey) {
    this.selectIndustry(industryKey);
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
    this.selectedIndustry = null;
    this.searchTerm = '';
    this.filteredIndustries = this.industries;
    
    const searchInput = this.container.querySelector('.search-input');
    if (searchInput) {
      searchInput.value = '';
    }
    
    this.updateSelectionState();
    this.disableNextButton();
    this.updateIndustriesDisplay();
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
      console.error('Ошибка уничтожения IndustrySelector:', error);
    }
  }
}

export default IndustrySelector; 