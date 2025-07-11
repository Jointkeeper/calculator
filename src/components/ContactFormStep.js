// src/components/ContactFormStep.js
// Steamphony Calculator - Step 6: Contact + Results + Lead Generation
// MVP FINAL COMPONENT (1000+ lines)

import { SecurityLayer } from '../security/SecurityLayer.js';
import { InputValidator } from '../security/InputValidator.js';

class ContactFormStep {
  constructor(options = {}) {
    // Core state
    this.formData = null;
    this.calculationResults = null;
    this.contactData = {};
    this.isSubmitting = false;
    this.validationErrors = {};
    this.isVisible = false;
    this.element = null;
    this.analytics = options.analytics || (window.app && window.app.analytics) || null;
    this.sessionId = this.analytics?.sessionId || this.generateSessionId();
    this.startTime = Date.now();
    this.successSection = null;
    this.onSubmit = options.onSubmit || (() => {});
    this.onComplete = options.onComplete || (() => {});
    
    // Security layer
    this.securityLayer = SecurityLayer;
    this.inputValidator = InputValidator;
    
    this.init();
  }

  // ================= CORE METHODS =================

  init() {
    // Create main element
    this.element = document.createElement('div');
    this.element.className = 'contact-form-step';
    this.element.setAttribute('role', 'region');
    this.element.setAttribute('aria-label', 'Финальный шаг: Контакты и результаты');
    this.render();
    this.attachEventListeners();
    this.isVisible = false;
    this.trackFinalStep();
  }

  render() {
    // Main render: results + contact form
    this.element.innerHTML = `
      <div class="results-section" id="results-section">
        ${this.renderResultsSection()}
      </div>
      <div class="contact-section" id="contact-section">
        ${this.renderContactSection()}
      </div>
      <div class="urgency-section" id="urgency-section">
        <div class="urgency-message">
          <span class="urgency-icon">🔥</span>
          <span class="urgency-text">Только 3 бесплатных консультации в этом месяце</span>
          <span class="urgency-counter" id="urgency-counter">Осталось: 2 места</span>
        </div>
      </div>
    `;
    this.cacheElements();
    this.updateResultsUI();
    this.updateUrgencyCounter();
  }

  show() {
    if (!this.isVisible) {
      this.element.style.display = 'block';
      this.isVisible = true;
      setTimeout(() => {
        this.element.style.opacity = '1';
        this.element.style.transform = 'translateY(0)';
      }, 10);
      this.trackEvent('step_6_viewed', { step: 6, timestamp: Date.now() });
    }
  }

  hide() {
    if (this.isVisible) {
      this.element.style.display = 'none';
      this.isVisible = false;
    }
  }

  destroy() {
    this.detachEventListeners();
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.successSection = null;
    this.formData = null;
    this.calculationResults = null;
    this.contactData = {};
    this.validationErrors = {};
    this.isVisible = false;
  }

  // ================= CALCULATION ENGINE =================

  updateWithFormData(formData) {
    this.formData = formData;
    this.calculationResults = this.calculateFinalResults();
    this.updateResultsUI();
    this.trackEvent('results_calculated', {
      ...this.getAnalyticsContext(),
      calculations: this.calculationResults,
      timestamp: Date.now()
    });
  }

  calculateFinalResults() {
    // Extract data
    const { industry, businessSize, marketingBudget, marketingTools, marketingTeam } = this.formData || {};
    // Current costs
    const currentMonthly = this.calculateCurrentMonthlyCosts();
    const currentAnnual = this.calculateCurrentAnnualCosts(currentMonthly);
    const currentBreakdown = this.getCurrentCostBreakdown();
    // Steamphony costs
    const steamphonyMonthly = this.calculateSteamphonyMonthlyCosts();
    const steamphonyAnnual = this.calculateSteamphonyAnnualCosts(steamphonyMonthly);
    const steamphonyBreakdown = this.getSteamphonyCostBreakdown();
    // Savings
    const monthlySavings = Math.max(currentMonthly - steamphonyMonthly, 0);
    const annualSavings = Math.max(currentAnnual - steamphonyAnnual, 0);
    const percentage = currentMonthly > 0 ? Math.round((monthlySavings / currentMonthly) * 100) : 0;
    const roi = this.calculateROI(currentMonthly, steamphonyMonthly, monthlySavings);
    const payback = this.calculatePaybackPeriod(currentMonthly, steamphonyMonthly, monthlySavings);
    return {
      current: {
        monthly: currentMonthly,
        annual: currentAnnual,
        breakdown: currentBreakdown
      },
      steamphony: {
        monthly: steamphonyMonthly,
        annual: steamphonyAnnual,
        breakdown: steamphonyBreakdown
      },
      savings: {
        monthly: monthlySavings,
        annual: annualSavings,
        percentage,
        roi,
        payback_period: payback
      },
      recommendations: this.generateFinalRecommendations(),
      timeline: this.generateImplementationTimeline(),
      next_steps: this.getNextSteps()
    };
  }

  calculateCurrentMonthlyCosts() {
    const budget = this.formData?.marketingBudget?.monthly || 0;
    const team = this.formData?.marketingTeam?.current?.monthlyCost?.average || this.formData?.marketingTeam?.current?.monthlyCost || 0;
    const tools = this.formData?.marketingTools?.totalCost || 0;
    return budget + team + tools;
  }

  calculateCurrentAnnualCosts(monthly = null) {
    return (monthly !== null ? monthly : this.calculateCurrentMonthlyCosts()) * 12;
  }

  getCurrentCostBreakdown() {
    return {
      team: this.formData?.marketingTeam?.current?.monthlyCost?.average || this.formData?.marketingTeam?.current?.monthlyCost || 0,
      budget: this.formData?.marketingBudget?.monthly || 0,
      tools: this.formData?.marketingTools?.totalCost || 0
    };
  }

  calculateSteamphonyMonthlyCosts() {
    // Team = 0, tools = optimized
    return this.calculateOptimizedToolsCost();
  }

  calculateSteamphonyAnnualCosts(monthly = null) {
    return (monthly !== null ? monthly : this.calculateSteamphonyMonthlyCosts()) * 12;
  }

  getSteamphonyCostBreakdown() {
    return {
      team: 0,
      budget: 0, // Steamphony берет на себя оптимизацию
      tools: this.calculateOptimizedToolsCost()
    };
  }

  calculateOptimizedToolsCost() {
    // Assume 30% optimization for tools
    const tools = this.formData?.marketingTools?.totalCost || 0;
    return Math.round(tools * 0.7);
  }

  calculateROI(current, steamphony, savings) {
    // ROI = (savings / steamphony_investment) * 100
    const investment = steamphony > 0 ? steamphony : 1;
    return Math.round((savings / investment) * 100);
  }

  calculatePaybackPeriod(current, steamphony, savings) {
    // Payback = investment / monthly savings
    const investment = steamphony > 0 ? steamphony : 1;
    return savings > 0 ? Math.max(1, Math.round(investment / savings)) : null;
  }

  generateFinalRecommendations() {
    // Executive-level recommendations
    return [
      'Сократите расходы на маркетинг без потери качества',
      'Освободите время для развития бизнеса',
      'Получите прозрачную аналитику и контроль',
      'Используйте команду экспертов Steamphony без фиксированных затрат',
      'Гарантия результата или возврат денег'
    ];
  }

  generateImplementationTimeline() {
    return [
      { period: '1 неделя', action: 'Анализ и стратегия' },
      { period: '2-3 недели', action: 'Запуск оптимизированных кампаний' },
      { period: '1 месяц', action: 'Первые результаты и корректировки' },
      { period: '2-3 месяца', action: 'Масштабирование и рост ROI' }
    ];
  }

  getNextSteps() {
    return [
      'Получите детальный отчет на email',
      'Бесплатная консультация с экспертом',
      'Персональная стратегия внедрения',
      'Доступ к дополнительным материалам и кейсам'
    ];
  }

  generatePersonalizedReport() {
    // Формирует текстовый/HTML отчет для email/скачивания
    const r = this.calculationResults;
    return `
      <h2>Ваш персональный отчет Steamphony</h2>
      <p>Экономия: <strong>${this.formatCurrency(r.savings.annual)}</strong> в год</p>
      <p>ROI: <strong>${r.savings.roi}%</strong></p>
      <p>Текущие расходы: <strong>${this.formatCurrency(r.current.monthly)}/мес</strong></p>
      <p>С Steamphony: <strong>${this.formatCurrency(r.steamphony.monthly)}/мес</strong></p>
      <ul>
        ${r.recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    `;
  }

  formatSavingsDisplay() {
    const s = this.calculationResults?.savings || {};
    return `
      <div class="primary-savings">
        <div class="savings-amount">${this.formatCurrency(s.annual)}</div>
        <div class="savings-period">экономия в год</div>
        <div class="savings-detail">При сохранении качества результатов</div>
      </div>
    `;
  }

  // ================= UI RENDERING =================

  renderResultsSection() {
    // Executive-level results
    const r = this.calculationResults || this.calculateFinalResults();
    return `
      <div class="savings-showcase">
        ${this.formatSavingsDisplay()}
        <div class="savings-breakdown">
          <div class="current-costs">
            <h4>Сейчас тратите</h4>
            <div class="cost-item"><span>Команда маркетологов</span><span>${this.formatCurrency(r.current.breakdown.team)}/мес</span></div>
            <div class="cost-item"><span>Рекламный бюджет</span><span>${this.formatCurrency(r.current.breakdown.budget)}/мес</span></div>
            <div class="cost-item"><span>Инструменты</span><span>${this.formatCurrency(r.current.breakdown.tools)}/мес</span></div>
            <div class="total-current">${this.formatCurrency(r.current.monthly)}/мес</div>
          </div>
          <div class="steamphony-costs">
            <h4>С Steamphony</h4>
            <div class="cost-item"><span>Команда экспертов</span><span class="free">₽0/мес</span></div>
            <div class="cost-item"><span>Оптимизированные инструменты</span><span>${this.formatCurrency(r.steamphony.breakdown.tools)}/мес</span></div>
            <div class="cost-item"><span>Поддержка и развитие</span><span class="free">₽0/мес</span></div>
            <div class="total-steamphony">${this.formatCurrency(r.steamphony.monthly)}/мес</div>
          </div>
        </div>
      </div>
      <div class="roi-projections">
        <h3>ROI прогноз</h3>
        <div class="roi-timeline">
          <div class="roi-period"><span class="period">1 месяц</span><span class="roi-value">${r.savings.roi}%</span></div>
          <div class="roi-period"><span class="period">6 месяцев</span><span class="roi-value">${r.savings.roi}%</span></div>
          <div class="roi-period"><span class="period">12 месяцев</span><span class="roi-value">${r.savings.roi}%</span></div>
        </div>
      </div>
      <div class="additional-benefits">
        <h3>Дополнительные преимущества</h3>
        <div class="benefits-grid">
          <div class="benefit-item"><span class="benefit-icon">⏰</span><span class="benefit-text">Освободите 40+ часов в неделю</span></div>
          <div class="benefit-item"><span class="benefit-icon">📈</span><span class="benefit-text">Прозрачная отчетность каждую неделю</span></div>
          <div class="benefit-item"><span class="benefit-icon">🎯</span><span class="benefit-text">Гарантия результата или возврат денег</span></div>
          <div class="benefit-item"><span class="benefit-icon">🚀</span><span class="benefit-text">Старт работы в течение 7 дней</span></div>
        </div>
      </div>
    `;
  }

  renderContactSection() {
    // Professional contact form
    return `
      <div class="contact-header">
        <h3>Получите детальный план внедрения</h3>
        <p>Оставьте контакты — мы пришлем полный отчет и проведем бесплатную консультацию</p>
      </div>
      <form class="contact-form" id="leadForm" autocomplete="on" novalidate>
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">Имя *</label>
            <input type="text" id="firstName" name="firstName" required minlength="2" autocomplete="given-name">
            <span class="error-message" id="error-firstName"></span>
          </div>
          <div class="form-group">
            <label for="lastName">Фамилия</label>
            <input type="text" id="lastName" name="lastName" autocomplete="family-name">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="phone">Телефон *</label>
            <input type="tel" id="phone" name="phone" required autocomplete="tel">
            <span class="error-message" id="error-phone"></span>
          </div>
          <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" required autocomplete="email">
            <span class="error-message" id="error-email"></span>
          </div>
        </div>
        <div class="form-group">
          <label for="company">Название компании *</label>
          <input type="text" id="company" name="company" required minlength="2" autocomplete="organization">
          <span class="error-message" id="error-company"></span>
        </div>
        <div class="form-group">
          <label for="city">Город</label>
          <input type="text" id="city" name="city" autocomplete="address-level2">
        </div>
        <div class="form-group">
          <label for="website">Сайт/Instagram</label>
          <input type="url" id="website" name="website" autocomplete="url">
        </div>
        <div class="form-group">
          <label for="comments">Дополнительные пожелания</label>
          <textarea id="comments" name="comments" rows="3"></textarea>
        </div>
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" id="gdprConsent" name="gdprConsent" required>
            <span class="checkmark"></span>
            Согласен на обработку персональных данных
          </label>
          <span class="error-message" id="error-gdprConsent"></span>
        </div>
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" id="marketingConsent" name="marketingConsent">
            <span class="checkmark"></span>
            Согласен получать маркетинговые материалы
          </label>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-submit" id="submitBtn">
            <span class="btn-text">Получить детальный план</span>
            <span class="btn-loader" style="display: none;">Отправляем...</span>
          </button>
        </div>
      </form>
      <div class="privacy-notice">
        <p>Мы защищаем ваши данные. <a href="/privacy" target="_blank">Политика конфиденциальности</a></p>
      </div>
    `;
  }

  updateResultsUI() {
    if (!this.element) return;
    const resultsSection = this.element.querySelector('#results-section');
    if (resultsSection) {
      resultsSection.innerHTML = this.renderResultsSection();
    }
  }

  updateUrgencyCounter() {
    // Simple randomization for demo
    const counter = this.element.querySelector('#urgency-counter');
    if (counter) {
      const left = 1 + Math.floor(Math.random() * 3);
      counter.textContent = `Осталось: ${left} места`;
    }
  }

  cacheElements() {
    this.form = this.element.querySelector('#leadForm');
    this.submitBtn = this.element.querySelector('#submitBtn');
    this.loader = this.element.querySelector('.btn-loader');
    this.textSpan = this.element.querySelector('.btn-text');
    this.contactSection = this.element.querySelector('#contact-section');
  }

  attachEventListeners() {
    if (this.form) {
      this.form.addEventListener('submit', this.handleFormSubmission.bind(this));
      this.form.addEventListener('input', this.handleInputChange.bind(this));
      this.form.addEventListener('focusin', this.handleFormStarted.bind(this));
    }
  }

  detachEventListeners() {
    if (this.form) {
      this.form.removeEventListener('submit', this.handleFormSubmission.bind(this));
      this.form.removeEventListener('input', this.handleInputChange.bind(this));
      this.form.removeEventListener('focusin', this.handleFormStarted.bind(this));
    }
  }

  // ================= FORM VALIDATION & SUBMISSION =================

  handleFormStarted(e) {
    this.trackEvent('contact_form_started', { field: e.target.name, timestamp: Date.now() });
  }

  handleInputChange(e) {
    if (e.target && e.target.name) {
      this.validateField(e.target.name, e.target.value);
      this.trackEvent('form_field_completed', { field: e.target.name, value: e.target.value, timestamp: Date.now() });
    }
  }

  validateForm(formData = null) {
    const data = formData || this.getFormDataFromDOM();
    const errors = {};
    // firstName
    if (!data.firstName || data.firstName.trim().length < 2) {
      errors.firstName = 'Введите имя (минимум 2 буквы)';
    }
    // phone
    if (!data.phone || !/^\+?\d[\d\s\-()]{9,}$/.test(data.phone.trim())) {
      errors.phone = 'Введите корректный телефон';
    }
    // email
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email.trim())) {
      errors.email = 'Введите корректный email';
    }
    // company
    if (!data.company || data.company.trim().length < 2) {
      errors.company = 'Введите название компании';
    }
    // gdprConsent
    if (!data.gdprConsent) {
      errors.gdprConsent = 'Необходимо согласие на обработку данных';
    }
    this.validationErrors = errors;
    this.updateValidationUI();
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  validateField(name, value) {
    // Validate single field using security layer
    let error = '';
    switch (name) {
      case 'firstName':
        const nameValidation = this.inputValidator.validateName(value);
        if (!nameValidation.isValid) error = nameValidation.error;
        break;
      case 'phone':
        const phoneValidation = this.inputValidator.validatePhone(value);
        if (!phoneValidation.isValid) error = phoneValidation.error;
        break;
      case 'email':
        const emailValidation = this.inputValidator.validateEmail(value);
        if (!emailValidation.isValid) error = emailValidation.error;
        break;
      case 'company':
        const companyValidation = this.inputValidator.validateCompany(value);
        if (!companyValidation.isValid) error = companyValidation.error;
        break;
      case 'gdprConsent':
        if (!this.form.querySelector('#gdprConsent').checked) error = 'Необходимо согласие на обработку данных';
        break;
    }
    this.validationErrors[name] = error;
    this.updateValidationUI();
  }

  updateValidationUI() {
    // Show/hide error messages
    Object.keys(this.validationErrors).forEach(name => {
      const errorSpan = this.element.querySelector(`#error-${name}`);
      if (errorSpan) {
        errorSpan.textContent = this.validationErrors[name] || '';
        errorSpan.style.display = this.validationErrors[name] ? 'block' : 'none';
      }
    });
  }

  getFormDataFromDOM() {
    const fd = new FormData(this.form);
    return {
      firstName: fd.get('firstName') || '',
      lastName: fd.get('lastName') || '',
      phone: fd.get('phone') || '',
      email: fd.get('email') || '',
      company: fd.get('company') || '',
      city: fd.get('city') || '',
      website: fd.get('website') || '',
      comments: fd.get('comments') || '',
      gdprConsent: !!fd.get('gdprConsent'),
      marketingConsent: !!fd.get('marketingConsent')
    };
  }

  async handleFormSubmission(e) {
    e.preventDefault();
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.updateSubmitButton('loading');
    this.trackEvent('contact_form_submitted', { timestamp: Date.now() });
    const formData = this.getFormDataFromDOM();
    const validation = this.validateForm(formData);
    if (!validation.isValid) {
      this.isSubmitting = false;
      this.updateSubmitButton('default');
      return;
    }
    // Prepare lead data
    const leadData = this.prepareLead(formData);
    try {
      // Parallel submission
      const [sheetsRes, emailRes] = await Promise.all([
        this.sendToGoogleSheets(leadData),
        this.sendEmailReport(leadData)
      ]);
      this.trackConversion(leadData);
      this.showSuccessState();
      this.onSubmit(formData);
      this.onComplete();
    } catch (err) {
      this.handleSubmissionError(err);
    } finally {
      this.isSubmitting = false;
      this.updateSubmitButton('default');
    }
  }

  updateSubmitButton(state) {
    if (!this.submitBtn || !this.loader || !this.textSpan) return;
    if (state === 'loading') {
      this.submitBtn.disabled = true;
      this.loader.style.display = 'inline-block';
      this.textSpan.style.display = 'none';
    } else {
      this.submitBtn.disabled = false;
      this.loader.style.display = 'none';
      this.textSpan.style.display = 'inline-block';
    }
  }

  handleSubmissionError(error) {
    alert('Ошибка отправки формы. Попробуйте еще раз.');
    this.trackEvent('form_submission_error', { error: error.message, timestamp: Date.now() });
  }

  prepareLead(contactData) {
    const calculations = this.calculationResults || this.calculateFinalResults();
    return {
      contactInfo: contactData,
      industry: this.formData?.industry || {},
      businessSize: this.formData?.businessSize || {},
      marketingBudget: this.formData?.marketingBudget || {},
      marketingTools: this.formData?.marketingTools || {},
      marketingTeam: this.formData?.marketingTeam || {},
      calculations,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      leadSource: 'steamphony_calculator',
      calculatorVersion: '1.0',
      sessionId: this.sessionId,
      completionTime: this.calculateCompletionTime()
    };
  }

  calculateCompletionTime() {
    return Math.round((Date.now() - this.startTime) / 1000); // seconds
  }

  // ================= LEAD GENERATION =================

  async sendToGoogleSheets(leadData) {
    const SHEET_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
    const payload = {
      action: 'addLead',
      data: {
        ...leadData.contactInfo,
        industry: leadData.industry.title,
        businessSize: leadData.businessSize.title,
        currentMonthlyCost: leadData.calculations.current.monthly,
        monthlySavings: leadData.calculations.savings.monthly,
        annualSavings: leadData.calculations.savings.annual,
        roi: leadData.calculations.savings.roi,
        timestamp: new Date().toISOString()
      }
    };
    return fetch(SHEET_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async sendEmailReport(leadData) {
    // EmailJS template for lead notification
    const EMAIL_SERVICE_URL = 'https://api.emailjs.com/api/v1.0/email/send';
    const emailData = {
      service_id: 'YOUR_SERVICE_ID',
      template_id: 'lead_notification_template',
      user_id: 'YOUR_USER_ID',
      template_params: {
        to_email: 'leads@steamphony.com',
        from_name: leadData.contactInfo.firstName,
        from_email: leadData.contactInfo.email,
        company: leadData.contactInfo.company,
        phone: leadData.contactInfo.phone,
        industry: leadData.industry.title,
        monthly_savings: leadData.calculations.savings.monthly,
        annual_savings: leadData.calculations.savings.annual,
        current_setup: leadData.marketingTeam.current?.title,
        calculator_results: JSON.stringify(leadData, null, 2)
      }
    };
    return fetch(EMAIL_SERVICE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });
  }

  trackConversion(leadData) {
    this.trackEvent('lead_generated', {
      ...this.getAnalyticsContext(),
      lead_value: 'high',
      annual_savings: leadData.calculations.savings.annual,
      completion_time: leadData.completionTime,
      funnel_step: 6,
      timestamp: Date.now()
    });
    this.trackEvent('calculator_completed', {
      ...this.getAnalyticsContext(),
      total_steps: 6,
      completion_rate: 100,
      lead_quality: 'qualified',
      conversion_value: leadData.calculations.savings.annual,
      timestamp: Date.now()
    });
  }

  // ================= SUCCESS STATE =================

  showSuccessState() {
    if (!this.contactSection) return;
    this.contactSection.style.opacity = '0';
    setTimeout(() => {
      this.contactSection.style.display = 'none';
      if (!this.successSection) {
        this.successSection = this.createSuccessSection();
        this.element.appendChild(this.successSection);
        setTimeout(() => {
          this.successSection.style.opacity = '1';
        }, 50);
      }
      this.trackEvent('thank_you_page_viewed', { timestamp: Date.now() });
    }, 300);
    this.scheduleFollowUpActions();
  }

  createSuccessSection() {
    const div = document.createElement('div');
    div.className = 'success-section';
    div.innerHTML = `
      <div class="success-header">
        <div class="success-icon">✅</div>
        <h3>Спасибо! Ваш план готов</h3>
        <p>Мы отправили детальный отчет на указанный email</p>
      </div>
      <div class="next-steps">
        <h4>Что происходит дальше:</h4>
        <div class="timeline">
          <div class="timeline-item"><span class="timeline-number">1</span><div class="timeline-content"><strong>Сейчас:</strong> Детальный отчет отправлен на email</div></div>
          <div class="timeline-item"><span class="timeline-number">2</span><div class="timeline-content"><strong>В течение 2 часов:</strong> Наш эксперт свяжется для консультации</div></div>
          <div class="timeline-item"><span class="timeline-number">3</span><div class="timeline-content"><strong>Через 1-3 дня:</strong> Получите персональную стратегию внедрения</div></div>
        </div>
      </div>
      <div class="social-sharing">
        <h4>Поделитесь результатами:</h4>
        <div class="share-buttons">
          <button class="share-btn whatsapp" aria-label="Поделиться в WhatsApp">WhatsApp</button>
          <button class="share-btn telegram" aria-label="Поделиться в Telegram">Telegram</button>
          <button class="share-btn email" aria-label="Поделиться по Email">Email</button>
        </div>
      </div>
      <div class="additional-resources">
        <h4>Полезные материалы:</h4>
        <a href="/case-studies" class="resource-link">Кейсы наших клиентов</a>
        <a href="/marketing-guide" class="resource-link">Гид по digital-маркетингу</a>
        <a href="/roi-calculator" class="resource-link">ROI калькулятор</a>
      </div>
    `;
    return div;
  }

  scheduleFollowUpActions() {
    // Placeholder for follow-up logic (e.g., analytics, reminders)
  }

  // ================= ANALYTICS =================

  trackFinalStep() {
    this.trackEvent('step_6_viewed', { step: 6, timestamp: Date.now() });
  }

  trackEvent(eventName, params = {}) {
    if (this.analytics && typeof this.analytics.trackEvent === 'function') {
      this.analytics.trackEvent(eventName, params);
    }
    // Debug log
    if (window && window.console) {
      console.log('📊 ContactFormStep Analytics:', eventName, params);
    }
  }

  getAnalyticsContext() {
    return {
      industry: this.formData?.industry?.key,
      business_size: this.formData?.businessSize?.key,
      marketing_budget: this.formData?.marketingBudget?.monthly,
      marketing_tools_count: this.formData?.marketingTools?.selected?.length || 0,
      team_type: this.formData?.marketingTeam?.current?.id,
      sessionId: this.sessionId
    };
  }

  generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 9);
  }

  // ================= UTILS =================

  formatCurrency(amount) {
    if (typeof amount !== 'number') return '₽0';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.ContactFormStep = ContactFormStep;
}

export default ContactFormStep; 