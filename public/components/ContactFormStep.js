/**
 * ContactFormStep Component - Упрощенная версия
 * Финальный шаг формы - контакты и результаты
 * 
 * @class ContactFormStep
 * @author Steamphony Digital Agency
 */

class ContactFormStep {
  constructor(container, options = {}) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('ContactFormStep: container должен быть DOM элементом');
    }

    this.container = container;
    this.formData = null;
    this.calculationResults = null;
    this.contactData = {};
    this.isSubmitting = false;
    this.validationErrors = {};
    this.isRendered = false;

    this.onSubmit = options.onSubmit || (() => {});
    this.onComplete = options.onComplete || (() => {});

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    this.init();
  }

  /**
   * Инициализация компонента
   */
  init() {
    try {
      this.render();
      this.attachEventListeners();
      this.trackEvent('step_6_viewed');
    } catch (error) {
      this.handleError('INIT_ERROR', error);
    }
  }

  /**
   * Рендеринг компонента
   */
  render() {
    this.container.innerHTML = `
      <div class="calculator-step active">
        <div class="results-section mb-8">
          ${this.renderResultsSection()}
        </div>
        
        <div class="contact-section mb-8">
          ${this.renderContactSection()}
        </div>
        
        <div class="urgency-section p-4 bg-gradient-to-r from-steamphony-coral to-steamphony-accent rounded-lg text-white text-center">
          <div class="urgency-message flex items-center justify-center space-x-2">
            <span class="urgency-icon text-xl">🔥</span>
            <span class="urgency-text font-medium">Только 3 бесплатных консультации в этом месяце</span>
            <span class="urgency-counter bg-white text-steamphony-coral px-2 py-1 rounded-full text-sm font-bold">Осталось: 2 места</span>
          </div>
        </div>
      </div>
    `;

    this.isRendered = true;
  }

  /**
   * Рендеринг секции результатов
   */
  renderResultsSection() {
    return `
      <div class="results-header text-center mb-6">
        <h2 class="step-title">Ваши результаты</h2>
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
      
      <div class="recommendations">
        <h3 class="text-lg font-semibold text-steamphony-primary mb-4">Наши рекомендации</h3>
        <div class="recs-list space-y-3" id="recommendations-list">
          <div class="rec-item p-3 bg-steamphony-light rounded-lg text-sm">Загрузка рекомендаций...</div>
        </div>
      </div>
    `;
  }

  /**
   * Рендеринг секции контактов
   */
  renderContactSection() {
    return `
      <div class="contact-header text-center mb-6">
        <h2 class="step-title">Получите персональный отчет</h2>
        <p class="step-description">Оставьте контакты для получения детального анализа</p>
      </div>
      
      <form class="contact-form" id="contact-form">
        <div class="form-row">
          <div class="form-group">
            <label for="name" class="form-label">Имя *</label>
            <input type="text" id="name" name="name" class="form-input" required>
            <div class="error-message text-red-500 text-sm mt-1" id="name-error"></div>
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">Email *</label>
            <input type="email" id="email" name="email" class="form-input" required>
            <div class="error-message text-red-500 text-sm mt-1" id="email-error"></div>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="phone" class="form-label">Телефон</label>
            <input type="tel" id="phone" name="phone" class="form-input">
            <div class="error-message text-red-500 text-sm mt-1" id="phone-error"></div>
          </div>
          
          <div class="form-group">
            <label for="company" class="form-label">Компания</label>
            <input type="text" id="company" name="company" class="form-input">
            <div class="error-message text-red-500 text-sm mt-1" id="company-error"></div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="message" class="form-label">Дополнительная информация</label>
          <textarea id="message" name="message" rows="3" class="form-input"></textarea>
          <div class="error-message text-red-500 text-sm mt-1" id="message-error"></div>
        </div>
        
        <div class="form-actions text-center mt-6">
          <button type="submit" class="nav-button primary submit-btn" disabled>
            Получить отчет
          </button>
        </div>
      </form>
    `;
  }

  /**
   * Прикрепление обработчиков событий
   */
  attachEventListeners() {
    const form = this.container.querySelector('#contact-form');
    const inputs = this.container.querySelectorAll('input, textarea');

    if (form) {
      form.addEventListener('submit', this.handleSubmit);
    }

    inputs.forEach(input => {
      input.addEventListener('input', this.handleInputChange);
      input.addEventListener('blur', this.handleInputChange);
    });

    document.addEventListener('keydown', this.handleKeydown);
  }

  /**
   * Обработка изменения полей
   */
  handleInputChange(event) {
    const field = event.target;
    const name = field.name;
    const value = field.value.trim();

    this.validateField(name, value);
    this.updateSubmitButton();
  }

  /**
   * Валидация поля
   */
  validateField(name, value) {
    const errorElement = this.container.querySelector(`#${name}-error`);
    let error = '';

    switch (name) {
      case 'name':
        if (!value) {
          error = 'Имя обязательно для заполнения';
        } else if (value.length < 2) {
          error = 'Имя должно содержать минимум 2 символа';
        }
        break;

      case 'email':
        if (!value) {
          error = 'Email обязателен для заполнения';
        } else if (!this.isValidEmail(value)) {
          error = 'Введите корректный email';
        }
        break;

      case 'phone':
        if (value && !this.isValidPhone(value)) {
          error = 'Введите корректный номер телефона';
        }
        break;

      case 'company':
        if (value && value.length < 2) {
          error = 'Название компании должно содержать минимум 2 символа';
        }
        break;
    }

    if (errorElement) {
      errorElement.textContent = error;
      errorElement.style.display = error ? 'block' : 'none';
    }

    if (error) {
      this.validationErrors[name] = error;
    } else {
      delete this.validationErrors[name];
    }
  }

  /**
   * Проверка email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Проверка телефона
   */
  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Обновление кнопки отправки
   */
  updateSubmitButton() {
    const submitBtn = this.container.querySelector('.submit-btn');
    const hasErrors = Object.keys(this.validationErrors).length > 0;
    const hasRequiredFields = this.hasRequiredFields();

    if (submitBtn) {
      submitBtn.disabled = hasErrors || !hasRequiredFields;
    }
  }

  /**
   * Проверка обязательных полей
   */
  hasRequiredFields() {
    const name = this.container.querySelector('#name')?.value?.trim();
    const email = this.container.querySelector('#email')?.value?.trim();
    return name && email;
  }

  /**
   * Обработка отправки формы
   */
  async handleSubmit(event) {
    event.preventDefault();

    if (this.isSubmitting) return;

    try {
      this.isSubmitting = true;
      this.updateSubmitButton();

      const formData = this.getFormData();
      const leadData = this.prepareLeadData(formData);

      await this.submitLead(leadData);
      this.showSuccessState();
      this.onComplete(leadData);

    } catch (error) {
      this.handleSubmissionError(error);
    } finally {
      this.isSubmitting = false;
      this.updateSubmitButton();
    }
  }

  /**
   * Получение данных формы
   */
  getFormData() {
    const form = this.container.querySelector('#contact-form');
    const formData = new FormData(form);
    
    return {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      message: formData.get('message')
    };
  }

  /**
   * Подготовка данных лида
   */
  prepareLeadData(formData) {
    return {
      ...formData,
      timestamp: new Date().toISOString(),
      sessionId: this.generateSessionId(),
      calculationResults: this.calculationResults,
      formData: this.formData
    };
  }

  /**
   * Отправка лида
   */
  async submitLead(leadData) {
    // Здесь должна быть реальная отправка данных
    console.log('Отправка лида:', leadData);
    
    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.trackConversion(leadData);
  }

  /**
   * Показ состояния успеха
   */
  showSuccessState() {
    this.container.innerHTML = `
      <div class="success-section">
        <div class="success-icon">✅</div>
        <h2>Спасибо за заявку!</h2>
        <p>Мы отправили персональный отчет на ваш email</p>
        <div class="success-details">
          <p>Наш специалист свяжется с вами в течение 24 часов</p>
          <p>Проверьте папку "Спам", если не получили письмо</p>
        </div>
        <div class="success-actions">
          <button type="button" class="nav-button secondary" onclick="window.location.reload()">
            Пройти калькулятор еще раз
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Обработка ошибки отправки
   */
  handleSubmissionError(error) {
    console.error('Ошибка отправки формы:', error);
    
    const submitBtn = this.container.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.textContent = 'Ошибка отправки. Попробуйте еще раз';
      submitBtn.disabled = false;
    }
  }

  /**
   * Обновление с данными формы
   */
  updateWithFormData(formData) {
    this.formData = formData;
    this.calculationResults = this.calculateResults();
    this.updateResultsUI();
  }

  /**
   * Расчет результатов
   */
  calculateResults() {
    console.log('[ContactFormStep] calculateResults input:', this.formData);
    if (!this.formData) return null;

    const currentCosts = this.calculateCurrentCosts();
    const steamphonyCosts = this.calculateSteamphonyCosts();
    const savings = Math.max(currentCosts - steamphonyCosts, 0);
    const roi = steamphonyCosts > 0 ? Math.round((savings / steamphonyCosts) * 100) : 0;
    const payback = steamphonyCosts > 0 ? Math.round(steamphonyCosts / savings) : 0;

    return {
      currentCosts,
      steamphonyCosts,
      savings,
      roi,
      payback,
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * Расчет текущих затрат
   */
  calculateCurrentCosts() {
    console.log('[ContactFormStep] calculateCurrentCosts - formData:', this.formData);
    
    // Получаем бюджет из marketingBudget.budget (как сохраняет MarketingBudgetStep)
    const budget = this.formData?.marketingBudget?.budget || 0;
    console.log('[ContactFormStep] budget:', budget);
    
    // Получаем стоимость команды из marketingTeam.monthlyCost (как сохраняет MarketingTeamStep)
    const team = this.formData?.marketingTeam?.monthlyCost || 0;
    console.log('[ContactFormStep] team cost:', team);
    
    // Получаем стоимость инструментов из marketingTools.estimatedMonthlyCost (как сохраняет MarketingToolsStep)
    const tools = this.formData?.marketingTools?.estimatedMonthlyCost || 0;
    console.log('[ContactFormStep] tools cost:', tools);
    
    const total = budget + team + tools;
    console.log('[ContactFormStep] total current costs:', total);
    return total;
  }

  /**
   * Расчет затрат Steamphony
   */
  calculateSteamphonyCosts() {
    // Получаем стоимость инструментов
    const tools = this.formData?.marketingTools?.estimatedMonthlyCost || 0;
    const steamphonyCost = Math.round(tools * 0.7); // 30% оптимизация
    console.log('[ContactFormStep] Steamphony costs:', steamphonyCost, 'from tools:', tools);
    return steamphonyCost;
  }

  /**
   * Генерация рекомендаций
   */
  generateRecommendations() {
    return [
      'Оптимизация маркетингового бюджета',
      'Автоматизация процессов',
      'Повышение эффективности команды',
      'Внедрение аналитики'
    ];
  }

  /**
   * Обновление UI результатов
   */
  updateResultsUI() {
    if (!this.calculationResults) return;

    const { savings, roi, payback, recommendations } = this.calculationResults;

    const savingsElement = this.container.querySelector('#savings-value');
    const roiElement = this.container.querySelector('#roi-value');
    const paybackElement = this.container.querySelector('#payback-value');
    const recommendationsElement = this.container.querySelector('#recommendations-list');

    if (savingsElement) {
      savingsElement.textContent = this.formatCurrency(savings) + '/мес';
    }

    if (roiElement) {
      roiElement.textContent = roi + '%';
    }

    if (paybackElement) {
      paybackElement.textContent = payback + ' мес';
    }

    if (recommendationsElement) {
      recommendationsElement.innerHTML = recommendations.map(rec => 
        `<div class="rec-item p-3 bg-steamphony-light rounded-lg text-sm">• ${rec}</div>`
      ).join('');
    }
  }

  /**
   * Обработка нажатия клавиш
   */
  handleKeydown(event) {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
      event.preventDefault();
      const submitBtn = this.container.querySelector('.submit-btn');
      if (submitBtn && !submitBtn.disabled) {
        submitBtn.click();
      }
    }
  }

  /**
   * Отслеживание события
   */
  trackEvent(eventName, params = {}) {
    try {
      if (window.gtag) {
        window.gtag('event', eventName, {
          step: 6,
          ...params
        });
      }
    } catch (error) {
      console.error('Ошибка отслеживания события:', error);
    }
  }

  /**
   * Отслеживание конверсии
   */
  trackConversion(leadData) {
    this.trackEvent('lead_submitted', {
      lead_email: leadData.email,
      lead_name: leadData.name,
      calculation_savings: this.calculationResults?.savings || 0
    });
  }

  /**
   * Генерация ID сессии
   */
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
   * Обработка ошибок
   */
  handleError(errorCode, error) {
    console.error(`ContactFormStep Error [${errorCode}]:`, error);
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
   * Сброс компонента
   */
  reset() {
    const form = this.container.querySelector('#contact-form');
    if (form) {
      form.reset();
    }
    
    this.validationErrors = {};
    this.updateSubmitButton();
    
    // Очищаем ошибки
    const errorMessages = this.container.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
      error.style.display = 'none';
    });
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
      console.error('Ошибка уничтожения ContactFormStep:', error);
    }
  }
}

export default ContactFormStep;
window.ContactFormStep = ContactFormStep; 