/**
 * MarketingTeamStep Component - Упрощенная версия
 * Пятый шаг формы - анализ текущей маркетинговой команды и gap analysis
 * 
 * @class MarketingTeamStep
 * @author Steamphony Digital Agency
 */

import {
  TEAM_OPTIONS,
  getTeamById,
  formatTeamCost,
  getCostClass,
  analyzeCurrentState,
  analyzeSteamphonyState,
  identifyGaps,
  calculateSavings,
  calculateImprovements,
  generateSteamphonyRecommendations,
  generateValuePropositions,
  getTeamSpecificValueProps,
  defineSuccessMetrics,
  calculateROIProjection
} from '../data/marketingTeams.js';

class MarketingTeamStep {
  constructor(container, options = {}) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('MarketingTeamStep: container должен быть DOM элементом');
    }

    this.container = container;
    this.currentFormData = null;
    this.selectedTeamSetup = null;
    this.gapAnalysis = null;
    this.steamphonyRecommendations = null;
    this.isRendered = false;
    this.isVisible = false;

    this.onSelect = options.onSelect || (() => {});
    this.onNext = options.onNext || (() => {});
    this.onBack = options.onBack || (() => {});

    this.options = {
      enableGapAnalysis: true,
      showRecommendations: true,
      trackAnalytics: true,
      requireSelection: true,
      enableComparison: true,
      ...options
    };

    this.handleTeamSelection = this.handleTeamSelection.bind(this);
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
      this.render();
      this.attachEventListeners();
      this.log('MarketingTeamStep инициализирован');
    } catch (error) {
      this.handleError('INIT_ERROR', error);
    }
  }

  /**
   * Рендеринг компонента
   */
  render() {
    if (this.isRendered) return;

    this.container.innerHTML = `
      <div class="calculator-step active">
        <h2 class="step-title">Ваша маркетинговая команда</h2>
        <p class="step-description">Выберите, как сейчас организован ваш маркетинг</p>

        <div class="options-grid">
          ${this.renderTeamOptions()}
        </div>

        <div class="gap-analysis mt-8" style="display: none;">
          <h3 class="text-lg font-semibold text-steamphony-primary mb-4">Анализ возможностей</h3>
          <div class="analysis-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="current-state p-4 bg-gray-50 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-3">Текущее состояние</h4>
              <div class="metrics"></div>
            </div>
            <div class="steamphony-state p-4 bg-steamphony-light rounded-lg">
              <h4 class="font-medium text-steamphony-primary mb-3">С Steamphony</h4>
              <div class="metrics"></div>
            </div>
          </div>
          
          <div class="value-propositions mb-6">
            <h4 class="font-medium text-steamphony-primary mb-3">Ваши выгоды</h4>
            <div class="props-grid grid grid-cols-1 md:grid-cols-3 gap-4"></div>
          </div>
          
          <div class="recommendations">
            <h4 class="font-medium text-steamphony-primary mb-3">Рекомендации</h4>
            <div class="recs-list"></div>
          </div>
        </div>

        <div class="step-navigation">
          <button type="button" class="nav-button secondary back-btn">Назад</button>
          <button type="button" class="nav-button primary next-btn" disabled>Далее</button>
        </div>
      </div>
    `;

    this.isRendered = true;
  }

  /**
   * Рендеринг опций команд
   */
  renderTeamOptions() {
    return Object.values(TEAM_OPTIONS).map(team => `
      <button class="option-button" data-team-id="${team.id}">
        <div class="option-content">
          <h3 class="option-title">${team.title}</h3>
          <p class="text-sm text-steamphony-secondary mb-2">${team.subtitle}</p>
          <p class="option-description">${team.description}</p>
          
          <div class="team-metrics mt-4 space-y-2">
            <div class="metric flex justify-between items-center">
              <span class="text-sm text-gray-600">Стоимость:</span>
              <span class="font-medium ${getCostClass(team.monthlyCost)}">${formatTeamCost(team.monthlyCost)}</span>
            </div>
            <div class="metric flex justify-between items-center">
              <span class="text-sm text-gray-600">Время управления:</span>
              <span class="font-medium text-steamphony-primary">${team.timeInvestment}</span>
            </div>
            <div class="metric flex justify-between items-center">
              <span class="text-sm text-gray-600">Риск:</span>
              <span class="font-medium text-steamphony-primary">${this.translateRiskLevel(team.riskLevel)}</span>
            </div>
          </div>
          
          <div class="team-pain-points mt-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Основные проблемы:</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              ${team.painPoints.map(point => `<li>• ${point}</li>`).join('')}
            </ul>
          </div>
        </div>
      </button>
    `).join('');
  }

  /**
   * Прикрепление обработчиков событий
   */
  attachEventListeners() {
    const teamOptions = this.container.querySelectorAll('.option-button');
    const nextBtn = this.container.querySelector('.next-btn');
    const backBtn = this.container.querySelector('.back-btn');

    teamOptions.forEach(option => {
      option.addEventListener('click', this.handleTeamSelection);
    });

    if (nextBtn) nextBtn.addEventListener('click', this.handleNextClick);
    if (backBtn) backBtn.addEventListener('click', this.handleBackClick);

    document.addEventListener('keydown', this.handleKeydown);
  }

  /**
   * Обработка выбора команды
   */
  handleTeamSelection(event) {
    const teamOption = event.currentTarget;
    const teamId = teamOption.dataset.teamId;

    // Убираем выделение со всех опций
    this.container.querySelectorAll('.option-button').forEach(option => {
      option.classList.remove('selected');
    });

    // Выделяем выбранную опцию
    teamOption.classList.add('selected');
    this.selectedTeamSetup = teamId;

    // Обновляем состояние кнопки "Далее"
    this.updateNextButtonState();

    // Показываем анализ
    if (this.options.enableGapAnalysis) {
      this.performGapAnalysis();
    }

    this.onSelect(teamId);
    this.trackTeamSelection(teamId);
  }

  /**
   * Обработка нажатия клавиш
   */
  handleKeydown(event) {
    if (event.key === 'Enter' && this.selectedTeamSetup) {
      this.handleNextClick();
    } else if (event.key === 'Escape') {
      this.handleBackClick();
    }
  }

  /**
   * Обновление состояния кнопки "Далее"
   */
  updateNextButtonState() {
    const nextBtn = this.container.querySelector('.next-btn');
    if (nextBtn) {
      nextBtn.disabled = !this.selectedTeamSetup;
    }
  }

  /**
   * Выполнение gap analysis
   */
  performGapAnalysis() {
    if (!this.selectedTeamSetup || !this.currentFormData) return;

    try {
      const currentState = analyzeCurrentState(this.selectedTeamSetup, this.currentFormData);
      const steamphonyState = analyzeSteamphonyState(this.currentFormData);
      const gaps = identifyGaps(this.selectedTeamSetup, this.currentFormData);
      const savings = calculateSavings(this.selectedTeamSetup, this.currentFormData);
      const improvements = calculateImprovements(this.selectedTeamSetup, this.currentFormData);

      this.gapAnalysis = {
        currentState,
        steamphonyState,
        gaps,
        savings,
        improvements
      };

      this.updateGapAnalysisUI();
      this.showGapAnalysisSection();

    } catch (error) {
      this.handleError('GAP_ANALYSIS_ERROR', error);
    }
  }

  /**
   * Обновление UI gap analysis
   */
  updateGapAnalysisUI() {
    if (!this.gapAnalysis) return;

    const { currentState, steamphonyState, savings, improvements } = this.gapAnalysis;

    // Обновляем метрики текущего состояния
    const currentMetrics = this.container.querySelector('.current-state .metrics');
    if (currentMetrics) {
      currentMetrics.innerHTML = `
        <div class="metric">
          <span class="label">Стоимость:</span>
          <span class="value">${this.formatCurrency(currentState.cost)}/мес</span>
        </div>
        <div class="metric">
          <span class="label">Время:</span>
          <span class="value">${currentState.timeInvestment}ч/нед</span>
        </div>
        <div class="metric">
          <span class="label">Эффективность:</span>
          <span class="value">${currentState.effectiveness}/10</span>
        </div>
      `;
    }

    // Обновляем метрики Steamphony
    const steamphonyMetrics = this.container.querySelector('.steamphony-state .metrics');
    if (steamphonyMetrics) {
      steamphonyMetrics.innerHTML = `
        <div class="metric">
          <span class="label">Стоимость:</span>
          <span class="value">${this.formatCurrency(steamphonyState.cost)}/мес</span>
        </div>
        <div class="metric">
          <span class="label">Время:</span>
          <span class="value">${steamphonyState.timeInvestment}ч/нед</span>
        </div>
        <div class="metric">
          <span class="label">Эффективность:</span>
          <span class="value">${steamphonyState.effectiveness}/10</span>
        </div>
      `;
    }

    // Обновляем ценностные предложения
    if (savings && improvements) {
      const valueProps = generateValuePropositions(this.selectedTeamSetup, savings, improvements);
      const propsGrid = this.container.querySelector('.props-grid');
      
      if (propsGrid) {
        propsGrid.innerHTML = valueProps.map(prop => `
          <div class="value-prop ${prop.type}">
            <h5>${prop.title}</h5>
            <div class="value">${prop.value}</div>
            <p>${prop.description}</p>
          </div>
        `).join('');
      }
    }

    // Обновляем рекомендации
    const recommendations = generateSteamphonyRecommendations();
    const recsList = this.container.querySelector('.recs-list');
    
    if (recsList) {
      recsList.innerHTML = `
        <div class="recs-section">
          <h5>Немедленно:</h5>
          <ul>${recommendations.immediate.map(rec => `<li>${rec}</li>`).join('')}</ul>
        </div>
        <div class="recs-section">
          <h5>Краткосрочно:</h5>
          <ul>${recommendations.shortTerm.map(rec => `<li>${rec}</li>`).join('')}</ul>
        </div>
        <div class="recs-section">
          <h5>Долгосрочно:</h5>
          <ul>${recommendations.longTerm.map(rec => `<li>${rec}</li>`).join('')}</ul>
        </div>
      `;
    }
  }

  /**
   * Показ секции gap analysis
   */
  showGapAnalysisSection() {
    const gapAnalysis = this.container.querySelector('.gap-analysis');
    if (gapAnalysis) {
      gapAnalysis.style.display = 'block';
    }
  }

  /**
   * Обработка нажатия "Далее"
   */
  handleNextClick(event) {
    if (!this.selectedTeamSetup) {
      this.showValidationError('Пожалуйста, выберите вариант команды');
      return;
    }

    try {
      const teamData = this.prepareTeamData();
      this.saveDataToApp(teamData);
      this.trackStepCompletion();
      this.onNext(teamData);
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
   * Подготовка данных команды
   */
  prepareTeamData() {
    const team = getTeamById(this.selectedTeamSetup);
    if (!team) throw new Error('Неизвестная команда');

    return {
      teamId: this.selectedTeamSetup,
      teamName: team.title,
      monthlyCost: typeof team.monthlyCost === 'object' ? team.monthlyCost.average : team.monthlyCost,
      timeInvestment: team.timeInvestmentHours,
      effectivenessScore: team.effectivenessScore,
      scalabilityScore: team.scalabilityScore,
      professionalismScore: team.professionalismScore,
      riskLevel: team.riskLevel,
      painPoints: team.painPoints,
      gapAnalysis: this.gapAnalysis
    };
  }

  /**
   * Сохранение данных в приложение
   */
  saveDataToApp(teamData) {
    if (window.app && window.app.appState) {
      window.app.appState.updateField('marketingTeam', teamData);
    }
  }

  /**
   * Обновление с данными формы
   */
  updateWithFormData(formData) {
    this.currentFormData = formData;
    
    if (this.selectedTeamSetup && this.options.enableGapAnalysis) {
      this.performGapAnalysis();
    }
  }

  /**
   * Отслеживание выбора команды
   */
  trackTeamSelection(teamId) {
    if (!this.options.trackAnalytics) return;

    try {
      if (window.gtag) {
        window.gtag('event', 'team_selected', {
          team_id: teamId,
          step: 4
        });
      }
    } catch (error) {
      console.error('Ошибка отслеживания выбора команды:', error);
    }
  }

  /**
   * Отслеживание завершения шага
   */
  trackStepCompletion() {
    if (!this.options.trackAnalytics) return;

    try {
      if (window.gtag) {
        window.gtag('event', 'step_completed', {
          step: 4,
          step_name: 'marketing_team',
          team_selected: this.selectedTeamSetup
        });
      }
    } catch (error) {
      console.error('Ошибка отслеживания завершения шага:', error);
    }
  }

  /**
   * Показ компонента
   */
  show() {
    this.container.style.display = 'block';
    this.isVisible = true;
  }

  /**
   * Скрытие компонента
   */
  hide() {
    this.container.style.display = 'none';
    this.isVisible = false;
  }

  /**
   * Сброс компонента
   */
  reset() {
    this.selectedTeamSetup = null;
    this.gapAnalysis = null;
    
    this.container.querySelectorAll('.option-button').forEach(option => {
      option.classList.remove('selected');
    });
    
    const gapAnalysis = this.container.querySelector('.gap-analysis');
    if (gapAnalysis) {
      gapAnalysis.style.display = 'none';
    }
    
    this.updateNextButtonState();
  }

  /**
   * Перевод уровня риска
   */
  translateRiskLevel(riskLevel) {
    const translations = {
      low: 'Низкий',
      'medium-low': 'Средне-низкий',
      medium: 'Средний',
      'medium-high': 'Средне-высокий',
      high: 'Высокий'
    };
    return translations[riskLevel] || riskLevel;
  }

  /**
   * Форматирование валюты
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU').format(amount);
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
   * Обработка ошибок
   */
  handleError(errorCode, error) {
    console.error(`MarketingTeamStep Error [${errorCode}]:`, error);
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
   * Логирование
   */
  log(message, data = null) {
    if (this.options.debug) {
      console.log(`[MarketingTeamStep] ${message}`, data || '');
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
      this.isVisible = false;
    } catch (error) {
      console.error('Ошибка уничтожения MarketingTeamStep:', error);
    }
  }
}

export default MarketingTeamStep; 