/**
 * ResultsScreen Component - Экран результатов калькулятора
 * Отображает результаты расчета экономии и рекомендации
 * 
 * @class ResultsScreen
 * @author Steamphony Digital Agency
 */

class ResultsScreen {
  constructor(container, options = {}) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('ResultsScreen: container должен быть DOM элементом');
    }

    this.container = container;
    this.results = null;
    this.isRendered = false;

    this.onDownload = options.onDownload || (() => {});
    this.onContact = options.onContact || (() => {});

    this.options = {
      showDownloadButton: true,
      showContactButton: true,
      trackAnalytics: true,
      ...options
    };

    this.handleDownload = this.handleDownload.bind(this);
    this.handleContact = this.handleContact.bind(this);

    this.init();
  }

  /**
   * Инициализация компонента
   */
  init() {
    try {
      this.render();
      this.attachEventListeners();
      this.trackEvent('results_viewed');
    } catch (error) {
      this.handleError('INIT_ERROR', error);
    }
  }

  /**
   * Рендеринг компонента
   */
  render() {
    this.container.innerHTML = `
      <div class="results-screen">
        <div class="results-header text-center mb-8">
          <div class="results-icon mb-6">
            <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h2 class="step-title">Ваши результаты готовы!</h2>
          <p class="step-description">Вот что мы можем для вас сделать</p>
        </div>
        
        <div class="results-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="result-card p-6 bg-white rounded-lg border border-gray-200 text-center">
            <div class="result-icon text-3xl mb-3">💰</div>
            <div class="result-content">
              <h3 class="font-semibold text-steamphony-primary mb-2">Экономия</h3>
              <div class="result-value text-2xl font-bold text-green-600 mb-2" id="savings-value">$0/мес</div>
              <div class="result-description text-sm text-gray-600">Потенциальная экономия с Steamphony</div>
            </div>
          </div>
          
          <div class="result-card p-6 bg-white rounded-lg border border-gray-200 text-center">
            <div class="result-icon text-3xl mb-3">📈</div>
            <div class="result-content">
              <h3 class="font-semibold text-steamphony-primary mb-2">ROI</h3>
              <div class="result-value text-2xl font-bold text-steamphony-secondary mb-2" id="roi-value">0%</div>
              <div class="result-description text-sm text-gray-600">Возврат инвестиций</div>
            </div>
          </div>
          
          <div class="result-card p-6 bg-white rounded-lg border border-gray-200 text-center">
            <div class="result-icon text-3xl mb-3">⏱️</div>
            <div class="result-content">
              <h3 class="font-semibold text-steamphony-primary mb-2">Срок окупаемости</h3>
              <div class="result-value text-2xl font-bold text-steamphony-accent mb-2" id="payback-value">0 мес</div>
              <div class="result-description text-sm text-gray-600">Время до полной окупаемости</div>
            </div>
          </div>
        </div>
        
        <div class="recommendations mb-8">
          <h3 class="text-lg font-semibold text-steamphony-primary mb-4 text-center">Наши рекомендации</h3>
          <div class="trust-grid" id="recommendations-list">
            <div class="trust-item">
              <div class="trust-icon">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="trust-text">Загрузка рекомендаций...</div>
            </div>
          </div>
        </div>

        <div class="action-buttons text-center space-y-4">
          ${this.options.showDownloadButton ? `
            <button class="nav-button primary download-btn">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span>Скачать отчет</span>
            </button>
          ` : ''}
          
          ${this.options.showContactButton ? `
            <button class="nav-button secondary contact-btn">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <span>Связаться с нами</span>
            </button>
          ` : ''}
        </div>
      </div>
    `;

    this.isRendered = true;
  }

  /**
   * Прикрепление обработчиков событий
   */
  attachEventListeners() {
    const downloadBtn = this.container.querySelector('.download-btn');
    const contactBtn = this.container.querySelector('.contact-btn');

    if (downloadBtn) {
      downloadBtn.addEventListener('click', this.handleDownload);
    }

    if (contactBtn) {
      contactBtn.addEventListener('click', this.handleContact);
    }
  }

  /**
   * Обработка скачивания отчета
   */
  handleDownload(event) {
    event.preventDefault();
    
    if (this.results) {
      this.onDownload(this.results);
      this.trackEvent('report_downloaded');
    }
  }

  /**
   * Обработка связи с нами
   */
  handleContact(event) {
    event.preventDefault();
    
    this.onContact();
    this.trackEvent('contact_requested');
  }

  /**
   * Обновление результатов
   */
  updateResults(results) {
    this.results = results;
    
    if (!this.isRendered) return;

    // Обновляем значения
    const savingsElement = this.container.querySelector('#savings-value');
    const roiElement = this.container.querySelector('#roi-value');
    const paybackElement = this.container.querySelector('#payback-value');

    if (savingsElement && results.savings) {
      savingsElement.textContent = this.formatCurrency(results.savings) + '/мес';
    }

    if (roiElement && results.roi) {
      roiElement.textContent = results.roi + '%';
    }

    if (paybackElement && results.paybackPeriod) {
      paybackElement.textContent = results.paybackPeriod + ' мес';
    }

    // Обновляем рекомендации
    this.updateRecommendations(results.recommendations);
  }

  /**
   * Обновление рекомендаций
   */
  updateRecommendations(recommendations = []) {
    const recommendationsElement = this.container.querySelector('#recommendations-list');
    
    if (recommendationsElement && recommendations.length > 0) {
      recommendationsElement.innerHTML = recommendations.map(rec => `
        <div class="trust-item">
          <div class="trust-icon">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="trust-text">${rec}</div>
        </div>
      `).join('');
    }
  }

  /**
   * Форматирование валюты
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
   * Отслеживание событий
   */
  trackEvent(eventName, params = {}) {
    if (!this.options.trackAnalytics) return;

    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, {
          event_category: 'calculator_results',
          event_label: 'results_screen',
          ...params
        });
      }
    } catch (error) {
      console.error('Ошибка отслеживания события:', error);
    }
  }

  /**
   * Обработка ошибок
   */
  handleError(errorCode, error) {
    console.error(`ResultsScreen ${errorCode}:`, error);
  }

  /**
   * Показ компонента
   */
  show() {
    if (this.container) {
      this.container.style.display = 'block';
    }
  }

  /**
   * Скрытие компонента
   */
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  /**
   * Сброс компонента
   */
  reset() {
    this.results = null;
    this.updateResults({});
  }

  /**
   * Уничтожение компонента
   */
  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.isRendered = false;
  }
}

export default ResultsScreen; 