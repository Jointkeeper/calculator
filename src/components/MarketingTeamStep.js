/**
 * MarketingTeamStep Component для Universal Calculator
 * Пятый шаг формы - анализ текущей маркетинговой команды и gap analysis
 * 
 * @class MarketingTeamStep
 * @author Steamphony Digital Agency
 */
class MarketingTeamStep {
  /**
   * Создает экземпляр MarketingTeamStep
   * 
   * @param {HTMLElement} container - DOM элемент для размещения компонента
   * @param {Object} options - Опции конфигурации
   */
  constructor(container, options = {}) {
    // Валидация входных параметров
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('MarketingTeamStep: container должен быть DOM элементом');
    }

    // Основные свойства
    this.container = container;
    this.currentFormData = null;
    this.selectedTeamSetup = null;
    this.gapAnalysis = null;
    this.steamphonyRecommendations = null;
    this.isRendered = false;
    this.isVisible = false;

    // Колбэки
    this.onSelect = options.onSelect || (() => {});
    this.onNext = options.onNext || (() => {});
    this.onBack = options.onBack || (() => {});

    // Конфигурация
    this.options = {
      enableGapAnalysis: true,
      showRecommendations: true,
      trackAnalytics: true,
      requireSelection: true,
      enableComparison: true,
      ...options
    };

    // Team structures database
    this.teamOptions = this.initializeTeamOptions();

    // Optimization templates
    this.optimizationFactors = {
      cost_efficiency: { weight: 0.4, unit: 'rub_monthly' },
      time_savings: { weight: 0.25, unit: 'hours_weekly' },
      capability_upgrade: { weight: 0.2, unit: 'score' },
      risk_reduction: { weight: 0.15, unit: 'score' }
    };

    // Обработчики событий
    this.handleTeamSelection = this.handleTeamSelection.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    // Инициализация
    this.init();
  }

  /**
   * Инициализация team options database
   * @private
   * @returns {Object} Comprehensive team structures
   */
  initializeTeamOptions() {
    return {
      no_team: {
        id: 'no_team',
        title: 'Занимаемся сами',
        subtitle: 'Владелец/менеджер делает маркетинг',
        description: 'Владелец или менеджер занимается маркетингом в свободное время без специальных знаний',
        monthlyCost: 0,
        timeInvestment: '5-10 часов/неделю',
        timeInvestmentHours: 7.5, // средние часы для расчетов
        capabilities: ['basic_social_media', 'simple_advertising', 'word_of_mouth'],
        limitations: ['no_strategy', 'inconsistent_execution', 'limited_knowledge', 'no_analytics'],
        commonFor: ['small_business', 'startups', 'budget_constraints'],
        painPoints: [
          'Нет времени на маркетинг',
          'Не знаем, что работает',
          'Результаты непредсказуемы',
          'Отвлекаемся от основного бизнеса'
        ],
        riskLevel: 'high',
        effectivenessScore: 2.5,
        scalabilityScore: 1.0,
        professionalismScore: 1.5
      },

      freelancer_parttime: {
        id: 'freelancer_parttime',
        title: 'Фрилансер на проектах',
        subtitle: 'Привлекаем специалистов по задачам',
        description: 'Работа с фрилансерами для конкретных проектов: дизайн, реклама, контент',
        monthlyCost: { min: 15000, max: 40000, average: 25000 },
        timeInvestment: '2-3 часа/неделю управления',
        timeInvestmentHours: 2.5,
        capabilities: ['specific_skills', 'project_based', 'cost_effective', 'flexibility'],
        limitations: ['no_continuity', 'coordination_overhead', 'quality_varies', 'no_strategic_thinking'],
        commonFor: ['growing_business', 'seasonal_needs', 'skill_gaps'],
        painPoints: [
          'Сложно найти хороших специалистов',
          'Нет целостной стратегии',
          'Постоянно нужно контролировать',
          'Разные уровни качества'
        ],
        riskLevel: 'medium-high',
        effectivenessScore: 4.0,
        scalabilityScore: 3.0,
        professionalismScore: 3.5
      },

      inhouse_junior: {
        id: 'inhouse_junior',
        title: 'Младший маркетолог',
        subtitle: 'Штатный сотрудник с базовыми навыками',
        description: 'Молодой специалист с базовым образованием, требует обучения и контроля',
        monthlyCost: { min: 40000, max: 80000, average: 60000 },
        timeInvestment: '1-2 часа/неделю управления',
        timeInvestmentHours: 1.5,
        capabilities: ['daily_operations', 'basic_campaigns', 'content_creation', 'social_media'],
        limitations: ['limited_experience', 'requires_training', 'narrow_expertise', 'mistakes_cost_money'],
        commonFor: ['medium_business', 'consistent_workload', 'growth_stage'],
        painPoints: [
          'Долгое обучение (3-6 месяцев)',
          'Ошибки стоят дорого',
          'Ограниченный опыт',
          'Нужен постоянный контроль'
        ],
        riskLevel: 'medium',
        effectivenessScore: 5.0,
        scalabilityScore: 4.0,
        professionalismScore: 4.0
      },

      inhouse_senior: {
        id: 'inhouse_senior',
        title: 'Опытный маркетолог',
        subtitle: 'Специалист с 3+ лет опыта',
        description: 'Профессиональный маркетолог с proven результатами и стратегическим мышлением',
        monthlyCost: { min: 80000, max: 150000, average: 115000 },
        timeInvestment: '30 минут/неделю',
        timeInvestmentHours: 0.5,
        capabilities: ['strategy_development', 'advanced_campaigns', 'analytics', 'team_leadership'],
        limitations: ['high_cost', 'single_point_failure', 'vacation_coverage', 'narrow_specialization'],
        commonFor: ['established_business', 'complex_needs', 'high_budget'],
        painPoints: [
          'Высокая зарплата',
          'Сложно найти хорошего',
          'Зависимость от одного человека',
          'Отпуска и болезни'
        ],
        riskLevel: 'medium-low',
        effectivenessScore: 7.0,
        scalabilityScore: 5.0,
        professionalismScore: 7.5
      },

      marketing_team: {
        id: 'marketing_team',
        title: 'Команда маркетологов',
        subtitle: 'Полноценный маркетинговый отдел',
        description: 'Команда специалистов: стратег + креативщик + аналитик + SMM-менеджер',
        monthlyCost: { min: 200000, max: 400000, average: 300000 },
        timeInvestment: '1-2 часа/неделю стратегического управления',
        timeInvestmentHours: 1.5,
        capabilities: ['full_marketing_stack', 'specialized_roles', 'scalability', 'innovation'],
        limitations: ['very_high_cost', 'management_overhead', 'office_space', 'coordination_complexity'],
        commonFor: ['large_business', 'multiple_channels', 'enterprise'],
        painPoints: [
          'Очень дорого (300К+/месяц)',
          'Сложно управлять командой',
          'Нужно много работы для загрузки',
          'Офисные расходы'
        ],
        riskLevel: 'low',
        effectivenessScore: 8.5,
        scalabilityScore: 9.0,
        professionalismScore: 8.5
      },

      agency_traditional: {
        id: 'agency_traditional',
        title: 'Традиционное агентство',
        subtitle: 'Внешнее агентство с ретейнером',
        description: 'Классическое маркетинговое агентство с месячным ретейнером и проектной работой',
        monthlyCost: { min: 80000, max: 200000, average: 140000 },
        timeInvestment: '2-4 часа/неделю на коммуникацию',
        timeInvestmentHours: 3.0,
        capabilities: ['external_expertise', 'industry_knowledge', 'tools_access', 'broad_experience'],
        limitations: ['communication_gaps', 'not_focused', 'additional_costs', 'slow_execution'],
        commonFor: ['medium_large_business', 'complex_projects', 'expertise_gaps'],
        painPoints: [
          'Долгие согласования',
          'Не понимают ваш бизнес',
          'Скрытые доплаты',
          'Работают на много клиентов'
        ],
        riskLevel: 'medium',
        effectivenessScore: 6.0,
        scalabilityScore: 6.5,
        professionalismScore: 6.5
      }
    };
  }

  /**
   * Инициализация компонента
   * @private
   */
  init() {
    try {
      this.render();
      this.attachEventListeners();
      
      // Dispatch готовности компонента
      this.dispatchEvent('marketingTeamStepReady', {
        teamOptions: Object.keys(this.teamOptions).length
      });
      
    } catch (error) {
      console.error('MarketingTeamStep: Ошибка инициализации:', error);
      this.renderError(error.message);
    }
  }

  /**
   * Рендеринг HTML структуры
   * @private
   */
  render() {
    const stepHTML = `
      <div class="marketing-team-step" role="region" aria-label="Выбор маркетинговой команды">
        <!-- Header -->
        <div class="step-header">
          <h2 class="step-title">Ваша маркетинговая команда</h2>
          <p class="step-description">
            Расскажите о текущей организации маркетинга в вашем бизнесе
          </p>
          <div class="step-context" id="step-context">
            <!-- Динамически заполняется из formData -->
          </div>
        </div>

        <!-- Team Options -->
        <div class="team-options">
          <h3 class="options-title">Как сейчас организован ваш маркетинг?</h3>
          
          <div class="team-options-grid" role="radiogroup" aria-labelledby="options-title">
            ${this.renderTeamOptions()}
          </div>
        </div>

        <!-- Gap Analysis Section -->
        <div class="gap-analysis-section" id="gap-analysis-section" style="display: none;">
          <div class="analysis-header">
            <h3 class="analysis-title">📊 Анализ вашей ситуации</h3>
            <p class="analysis-subtitle">Сравнение текущего состояния с оптимальным решением</p>
          </div>
          
          <div class="analysis-comparison">
            <div class="current-state">
              <div class="state-header">
                <h4 class="state-title">Сейчас</h4>
                <div class="state-icon current-icon">😔</div>
              </div>
              <div class="state-metrics" id="current-metrics">
                <!-- Динамически заполняется -->
              </div>
            </div>

            <div class="comparison-arrow">
              <div class="arrow-icon">→</div>
              <div class="arrow-label">Переход</div>
            </div>

            <div class="steamphony-state">
              <div class="state-header">
                <h4 class="state-title">С Steamphony</h4>
                <div class="state-icon steamphony-icon">🚀</div>
              </div>
              <div class="state-metrics" id="steamphony-metrics">
                <!-- Динамически заполняется -->
              </div>
            </div>
          </div>

          <!-- Value Propositions -->
          <div class="value-propositions" id="value-propositions">
            <h4 class="propositions-title">💡 Ваши преимущества с Steamphony:</h4>
            <div class="benefits-grid" id="benefits-grid">
              <!-- Динамически генерируемые benefits -->
            </div>
          </div>

          <!-- ROI Projection -->
          <div class="roi-projection" id="roi-projection">
            <h4 class="roi-title">📈 Прогноз возврата инвестиций</h4>
            <div class="roi-timeline" id="roi-timeline">
              <!-- Динамически генерируемые ROI данные -->
            </div>
          </div>
        </div>

        <!-- Validation Error -->
        <div class="validation-error" id="team-validation-error" style="display: none;">
          <div class="error-message">
            <span class="error-icon">⚠️</span>
            <span class="error-text">Выберите текущую организацию маркетинга</span>
          </div>
        </div>

        <!-- Navigation Footer -->
        <div class="step-footer">
          <button type="button" class="btn btn-secondary btn-back" id="team-back-btn">
            <span class="btn-icon">←</span>
            Назад
          </button>
          
          <button type="button" class="btn btn-primary btn-next" id="team-next-btn" disabled>
            Завершить анализ
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
            <span class="trust-icon">💼</span>
            <span class="trust-text">Персональный анализ</span>
          </div>
          <div class="trust-item">
            <span class="trust-icon">🎯</span>
            <span class="trust-text">Точные расчеты</span>
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
   * Рендеринг team options
   * @private
   * @returns {string} HTML team options
   */
  renderTeamOptions() {
    return Object.values(this.teamOptions).map(team => {
      const cost = this.formatTeamCost(team.monthlyCost);
      const costClass = this.getCostClass(team.monthlyCost);
      
      return `
        <div class="team-option ${team.riskLevel}" data-team="${team.id}" role="radio" tabindex="0">
          <input type="radio" name="team_setup" value="${team.id}" id="team-${team.id}" class="team-radio sr-only">
          
          <label for="team-${team.id}" class="team-option-label">
            <div class="option-header">
              <div class="option-info">
                <h4 class="option-title">${team.title}</h4>
                <p class="option-subtitle">${team.subtitle}</p>
              </div>
              
              <div class="option-meta">
                <div class="radio-indicator">
                  <div class="radio-circle">
                    <div class="radio-inner"></div>
                  </div>
                </div>
                <div class="cost-badge ${costClass}">${cost}</div>
              </div>
            </div>
            
            <div class="option-content">
              <p class="option-description">${team.description}</p>
              
              <div class="option-details">
                <div class="detail-item">
                  <span class="detail-icon">⏱️</span>
                  <span class="detail-text">${team.timeInvestment}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📊</span>
                  <span class="detail-text">Эффективность: ${team.effectivenessScore}/10</span>
                </div>
              </div>
              
              <div class="pain-points">
                <span class="pain-points-label">Основные проблемы:</span>
                <div class="pain-points-list">
                  ${team.painPoints.slice(0, 2).map(point => 
                    `<span class="pain-point">• ${point}</span>`
                  ).join('')}
                </div>
              </div>
            </div>
          </label>
        </div>
      `;
    }).join('');
  }

  /**
   * Форматирование стоимости команды
   * @private
   * @param {number|Object} cost - Стоимость команды
   * @returns {string} Отформатированная стоимость
   */
  formatTeamCost(cost) {
    if (cost === 0) return 'Бесплатно';
    if (typeof cost === 'number') return this.formatCurrency(cost) + '/мес';
    if (cost && cost.average) return this.formatCurrency(cost.average) + '/мес';
    if (cost && cost.min && cost.max) {
      return `${this.formatCurrency(cost.min)}-${this.formatCurrency(cost.max)}/мес`;
    }
    return 'По договоренности';
  }

  /**
   * Получение CSS класса для стоимости
   * @private
   * @param {number|Object} cost - Стоимость команды
   * @returns {string} CSS класс
   */
  getCostClass(cost) {
    const monthlyCost = typeof cost === 'number' ? cost : (cost?.average || 0);
    
    if (monthlyCost === 0) return 'cost-free';
    if (monthlyCost < 50000) return 'cost-low';
    if (monthlyCost < 100000) return 'cost-medium';
    if (monthlyCost < 200000) return 'cost-high';
    return 'cost-very-high';
  }

  /**
   * Кэширование DOM элементов
   * @private
   */
  cacheElements() {
    this.elements = {
      step: this.container.querySelector('.marketing-team-step'),
      teamOptions: this.container.querySelectorAll('.team-option'),
      teamRadios: this.container.querySelectorAll('.team-radio'),
      stepContext: this.container.querySelector('#step-context'),
      gapAnalysisSection: this.container.querySelector('#gap-analysis-section'),
      currentMetrics: this.container.querySelector('#current-metrics'),
      steamphonyMetrics: this.container.querySelector('#steamphony-metrics'),
      valuePropositions: this.container.querySelector('#value-propositions'),
      benefitsGrid: this.container.querySelector('#benefits-grid'),
      roiProjection: this.container.querySelector('#roi-projection'),
      roiTimeline: this.container.querySelector('#roi-timeline'),
      nextBtn: this.container.querySelector('#team-next-btn'),
      backBtn: this.container.querySelector('#team-back-btn'),
      validationError: this.container.querySelector('#team-validation-error')
    };
  }

  /**
   * Привязка обработчиков событий
   * @private
   */
  attachEventListeners() {
    if (!this.isRendered) return;

    try {
      // Team option events
      this.elements.teamOptions.forEach(option => {
        option.addEventListener('click', this.handleTeamSelection);
        option.addEventListener('keydown', this.handleKeydown);
      });

      // Radio events
      this.elements.teamRadios.forEach(radio => {
        radio.addEventListener('change', this.handleTeamSelection);
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
      console.error('MarketingTeamStep: Ошибка привязки событий:', error);
    }
  }

  /**
   * Обработка выбора команды
   * @private
   * @param {Event} event - Событие клика/изменения
   */
  handleTeamSelection(event) {
    const target = event.target.closest('.team-option') || event.target;
    const teamId = target.dataset?.team || target.value;
    
    if (!teamId || !this.teamOptions[teamId]) return;

    try {
      // Обновление выбранной команды
      this.selectedTeamSetup = this.teamOptions[teamId];
      
      // Обновление UI состояния
      this.updateTeamSelectionUI(teamId);
      
      // Проведение gap analysis
      if (this.options.enableGapAnalysis) {
        this.performGapAnalysis();
      }
      
      // Генерация рекомендаций
      if (this.options.showRecommendations) {
        this.generateSteamphonyRecommendations();
      }
      
      // Обновление UI с анализом
      this.updateGapAnalysisUI();
      
      // Показ gap analysis section
      this.showGapAnalysisSection();
      
      // Validation и кнопка "Далее"
      this.updateNextButtonState();
      this.hideValidationError();

      // Analytics tracking
      this.trackTeamSelection(teamId);

      // Колбэк выбора
      this.onSelect({
        teamSetup: this.selectedTeamSetup,
        gapAnalysis: this.gapAnalysis,
        recommendations: this.steamphonyRecommendations
      });
      
    } catch (error) {
      console.error('MarketingTeamStep: Ошибка обработки выбора команды:', error);
    }
  }

  /**
   * Обработка keyboard navigation
   * @private
   * @param {KeyboardEvent} event - Событие клавиатуры
   */
  handleKeydown(event) {
    switch (event.key) {
      case ' ':
      case 'Enter':
        if (event.target.classList.contains('team-option')) {
          event.preventDefault();
          const teamId = event.target.dataset.team;
          const radio = this.container.querySelector(`#team-${teamId}`);
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
    const options = Array.from(this.elements.teamOptions);
    const focusedIndex = options.findIndex(option => option === document.activeElement);
    
    if (focusedIndex === -1) {
      options[0]?.focus();
      return;
    }
    
    const nextIndex = isDown 
      ? Math.min(focusedIndex + 1, options.length - 1)
      : Math.max(focusedIndex - 1, 0);
    
    options[nextIndex]?.focus();
  }

  /**
   * Обновление UI выбора команды
   * @private
   * @param {string} teamId - ID выбранной команды
   */
  updateTeamSelectionUI(teamId) {
    // Сброс всех выборов
    this.elements.teamOptions.forEach(option => {
      option.classList.remove('selected');
      option.setAttribute('aria-checked', 'false');
    });

    this.elements.teamRadios.forEach(radio => {
      radio.checked = false;
    });

    // Установка нового выбора
    const selectedOption = this.container.querySelector(`[data-team="${teamId}"]`);
    const selectedRadio = this.container.querySelector(`#team-${teamId}`);

    if (selectedOption) {
      selectedOption.classList.add('selected');
      selectedOption.setAttribute('aria-checked', 'true');
    }

    if (selectedRadio) {
      selectedRadio.checked = true;
    }
  }

  /**
   * Проведение gap analysis
   * @private
   */
  performGapAnalysis() {
    if (!this.selectedTeamSetup || !this.currentFormData) return;

    try {
      const currentTeam = this.selectedTeamSetup;
      const businessData = this.currentFormData;
      
      // Расчет оптимальной команды для бизнеса
      const optimalTeam = this.calculateOptimalTeam(businessData);
      
      // Анализ разрывов
      this.gapAnalysis = {
        current: this.analyzeCurrentState(currentTeam, businessData),
        optimal: this.analyzeSteamphonyState(businessData),
        gaps: this.identifyGaps(currentTeam, businessData),
        savings: this.calculateSavings(currentTeam, businessData),
        improvements: this.calculateImprovements(currentTeam, businessData)
      };

    } catch (error) {
      console.error('MarketingTeamStep: Ошибка gap analysis:', error);
      this.gapAnalysis = null;
    }
  }

  /**
   * Расчет оптимальной команды для бизнеса
   * @private
   * @param {Object} businessData - Данные бизнеса
   * @returns {string} ID оптимальной команды
   */
  calculateOptimalTeam(businessData) {
    const { marketingBudget, businessSize, industry } = businessData;
    const monthlyBudget = marketingBudget?.monthly || 50000;
    
    // Простой алгоритм на основе бюджета и размера бизнеса
    if (monthlyBudget < 30000) {
      return 'freelancer_parttime';
    } else if (monthlyBudget < 80000) {
      return 'inhouse_junior';
    } else if (monthlyBudget < 150000) {
      return 'inhouse_senior';
    } else {
      return 'marketing_team';
    }
  }

  /**
   * Анализ текущего состояния
   * @private
   * @param {Object} currentTeam - Текущая команда
   * @param {Object} businessData - Данные бизнеса
   * @returns {Object} Анализ текущего состояния
   */
  analyzeCurrentState(currentTeam, businessData) {
    const monthlyCost = typeof currentTeam.monthlyCost === 'number' 
      ? currentTeam.monthlyCost 
      : currentTeam.monthlyCost?.average || 0;

    return {
      monthlyCost: monthlyCost,
      timeInvestment: currentTeam.timeInvestmentHours,
      effectivenessScore: currentTeam.effectivenessScore,
      scalabilityScore: currentTeam.scalabilityScore,
      professionalismScore: currentTeam.professionalismScore,
      riskLevel: currentTeam.riskLevel,
      painPoints: currentTeam.painPoints
    };
  }

  /**
   * Анализ состояния с Steamphony
   * @private
   * @param {Object} businessData - Данные бизнеса
   * @returns {Object} Анализ Steamphony состояния
   */
  analyzeSteamphonyState(businessData) {
    return {
      monthlyCost: 0, // Steamphony работает за результат
      timeInvestment: 0.5, // 30 минут в неделю
      effectivenessScore: 9.0,
      scalabilityScore: 9.5,
      professionalismScore: 9.0,
      riskLevel: 'very-low',
      advantages: [
        'Команда экспертов',
        'Проверенные стратегии',
        'Измеримые результаты',
        'Полная прозрачность'
      ]
    };
  }

  /**
   * Идентификация разрывов
   * @private
   * @param {Object} currentTeam - Текущая команда
   * @param {Object} businessData - Данные бизнеса
   * @returns {Array} Список разрывов
   */
  identifyGaps(currentTeam, businessData) {
    const gaps = [];
    
    // Анализ разрывов по эффективности
    if (currentTeam.effectivenessScore < 7) {
      gaps.push({
        type: 'effectiveness',
        severity: 'high',
        title: 'Низкая эффективность маркетинга',
        description: 'Текущий подход не дает максимальных результатов'
      });
    }

    // Анализ временных затрат
    if (currentTeam.timeInvestmentHours > 2) {
      gaps.push({
        type: 'time',
        severity: 'medium',
        title: 'Высокие временные затраты',
        description: 'Слишком много времени тратится на управление маркетингом'
      });
    }

    // Анализ стоимости
    const currentCost = typeof currentTeam.monthlyCost === 'number' 
      ? currentTeam.monthlyCost 
      : currentTeam.monthlyCost?.average || 0;

    if (currentCost > 50000) {
      gaps.push({
        type: 'cost',
        severity: 'high',
        title: 'Высокие затраты на команду',
        description: 'Можно получить лучший результат за меньшие деньги'
      });
    }

    return gaps;
  }

  /**
   * Расчет экономии
   * @private
   * @param {Object} currentTeam - Текущая команда
   * @param {Object} businessData - Данные бизнеса
   * @returns {Object} Расчеты экономии
   */
  calculateSavings(currentTeam, businessData) {
    const currentCost = typeof currentTeam.monthlyCost === 'number' 
      ? currentTeam.monthlyCost 
      : currentTeam.monthlyCost?.average || 0;

    const steamphonyCost = 0; // За результат
    const monthlySavings = currentCost - steamphonyCost;
    const annualSavings = monthlySavings * 12;

    // Расчет экономии времени
    const currentTimeHours = currentTeam.timeInvestmentHours || 0;
    const steamphonyTimeHours = 0.5;
    const timeSavingsWeekly = currentTimeHours - steamphonyTimeHours;
    const timeSavingsMonthly = timeSavingsWeekly * 4.33; // среднее количество недель в месяце

    return {
      cost: {
        monthly: monthlySavings,
        annual: annualSavings,
        percentage: currentCost > 0 ? Math.round((monthlySavings / currentCost) * 100) : 0
      },
      time: {
        weekly: timeSavingsWeekly,
        monthly: timeSavingsMonthly,
        annual: timeSavingsMonthly * 12
      }
    };
  }

  /**
   * Расчет улучшений
   * @private
   * @param {Object} currentTeam - Текущая команда
   * @param {Object} businessData - Данные бизнеса
   * @returns {Object} Расчеты улучшений
   */
  calculateImprovements(currentTeam, businessData) {
    const currentEffectiveness = currentTeam.effectivenessScore;
    const steamphonyEffectiveness = 9.0;
    const effectivenessImprovement = steamphonyEffectiveness - currentEffectiveness;

    const currentProfessionalism = currentTeam.professionalismScore;
    const steamphonyProfessionalism = 9.0;
    const professionalismImprovement = steamphonyProfessionalism - currentProfessionalism;

    return {
      effectiveness: {
        current: currentEffectiveness,
        future: steamphonyEffectiveness,
        improvement: effectivenessImprovement,
        improvementPercentage: Math.round((effectivenessImprovement / currentEffectiveness) * 100)
      },
      professionalism: {
        current: currentProfessionalism,
        future: steamphonyProfessionalism,
        improvement: professionalismImprovement,
        improvementPercentage: Math.round((professionalismImprovement / currentProfessionalism) * 100)
      },
      risk_reduction: {
        from: currentTeam.riskLevel,
        to: 'very-low',
        improvement: 'significant'
      }
    };
  }

  /**
   * Генерация рекомендаций Steamphony
   * @private
   */
  generateSteamphonyRecommendations() {
    if (!this.selectedTeamSetup || !this.gapAnalysis) return;

    try {
      const currentTeam = this.selectedTeamSetup;
      const savings = this.gapAnalysis.savings;
      const improvements = this.gapAnalysis.improvements;

      this.steamphonyRecommendations = {
        valuePropositions: this.generateValuePropositions(currentTeam, savings, improvements),
        successMetrics: this.defineSuccessMetrics(currentTeam),
        roiProjection: this.calculateROIProjection(savings),
        implementationPlan: this.createImplementationRoadmap(currentTeam),
        riskMitigation: this.analyzeRiskMitigation(currentTeam)
      };

    } catch (error) {
      console.error('MarketingTeamStep: Ошибка генерации рекомендаций:', error);
      this.steamphonyRecommendations = null;
    }
  }

  /**
   * Генерация value propositions
   * @private
   * @param {Object} currentTeam - Текущая команда
   * @param {Object} savings - Расчеты экономии
   * @param {Object} improvements - Расчеты улучшений
   * @returns {Array} Value propositions
   */
  generateValuePropositions(currentTeam, savings, improvements) {
    const valueProps = [];

    // Экономические преимущества
    if (savings.cost.monthly > 0) {
      valueProps.push({
        icon: '💰',
        title: `Экономия ${this.formatCurrency(savings.cost.monthly)}/месяц`,
        description: `Годовая экономия: ${this.formatCurrency(savings.cost.annual)}`,
        type: 'cost_savings',
        impact: 'high'
      });
    }

    // Временные преимущества
    if (savings.time.weekly > 0) {
      valueProps.push({
        icon: '⏰',
        title: `Освободите ${Math.round(savings.time.weekly)} часов в неделю`,
        description: `${Math.round(savings.time.monthly)} часов в месяц для основного бизнеса`,
        type: 'time_savings',
        impact: 'high'
      });
    }

    // Улучшение эффективности
    if (improvements.effectiveness.improvement > 0) {
      valueProps.push({
        icon: '📈',
        title: `Повышение эффективности на ${improvements.effectiveness.improvementPercentage}%`,
        description: 'Проверенные стратегии и измеримые результаты',
        type: 'effectiveness',
        impact: 'high'
      });
    }

    // Специфичные для типа команды
    const specificProps = this.getTeamSpecificValueProps(currentTeam.id);
    valueProps.push(...specificProps);

    return valueProps.slice(0, 6); // Максимум 6 value propositions
  }

  /**
   * Специфичные value propositions для типа команды
   * @private
   * @param {string} teamId - ID команды
   * @returns {Array} Специфичные value propositions
   */
  getTeamSpecificValueProps(teamId) {
    const specificProps = {
      no_team: [
        {
          icon: '🎯',
          title: 'Получите профессиональную команду за $0',
          description: 'Команда экспертов работает за результат',
          type: 'team_upgrade',
          impact: 'high'
        },
        {
          icon: '📊',
          title: 'Измеримые результаты с первого месяца',
          description: 'Прозрачная отчетность и KPI',
          type: 'results',
          impact: 'medium'
        }
      ],

      inhouse_senior: [
        {
          icon: '👥',
          title: 'Команда экспертов вместо одного человека',
          description: 'Разные специализации и взаимозаменяемость',
          type: 'team_redundancy',
          impact: 'high'
        },
        {
          icon: '🏖️',
          title: 'Никаких проблем с отпусками и болезнями',
          description: 'Непрерывность маркетинговых процессов',
          type: 'business_continuity',
          impact: 'medium'
        }
      ],

      agency_traditional: [
        {
          icon: '🚀',
          title: 'Прямая коммуникация без посредников',
          description: 'Работаем напрямую с принимающими решения',
          type: 'communication',
          impact: 'medium'
        },
        {
          icon: '🎯',
          title: 'Фокус только на ваших результатах',
          description: 'Не распыляемся на сотни других клиентов',
          type: 'focus',
          impact: 'high'
        }
      ]
    };

    return specificProps[teamId] || specificProps.no_team;
  }

  /**
   * Определение метрик успеха
   * @private
   * @param {Object} currentTeam - Текущая команда
   * @returns {Array} Метрики успеха
   */
  defineSuccessMetrics(currentTeam) {
    return [
      {
        metric: 'Стоимость лида',
        target: 'Снижение на 40-60%',
        timeframe: '2-3 месяца'
      },
      {
        metric: 'Конверсия',
        target: 'Увеличение на 25-50%',
        timeframe: '1-2 месяца'
      },
      {
        metric: 'ROI маркетинга',
        target: 'Увеличение в 2-3 раза',
        timeframe: '3-6 месяцев'
      },
      {
        metric: 'Время на маркетинг',
        target: 'Сокращение на 90%+',
        timeframe: 'Сразу'
      }
    ];
  }

  /**
   * Расчет ROI проекции
   * @private
   * @param {Object} savings - Расчеты экономии
   * @returns {Object} ROI проекция
   */
  calculateROIProjection(savings) {
    const monthlySavings = savings.cost.monthly;
    
    return {
      month_1: {
        savings: monthlySavings,
        roi: monthlySavings > 0 ? 'Безубыточность' : 'Первые результаты'
      },
      month_3: {
        savings: monthlySavings * 3,
        roi: monthlySavings > 0 ? monthlySavings * 3 : 'Устойчивый рост'
      },
      month_6: {
        savings: monthlySavings * 6,
        roi: monthlySavings > 0 ? monthlySavings * 6 : 'Масштабирование'
      },
      month_12: {
        savings: monthlySavings * 12,
        roi: monthlySavings > 0 ? monthlySavings * 12 : 'Стратегическое партнерство'
      }
    };
  }

  /**
   * Создание roadmap внедрения
   * @private
   * @param {Object} currentTeam - Текущая команда
   * @returns {Array} Roadmap внедрения
   */
  createImplementationRoadmap(currentTeam) {
    return [
      {
        phase: 'Неделя 1-2',
        title: 'Анализ и стратегия',
        tasks: [
          'Аудит текущих маркетинговых активностей',
          'Анализ конкурентов и рынка',
          'Разработка персональной стратегии',
          'Настройка систем аналитики'
        ]
      },
      {
        phase: 'Неделя 3-4',
        title: 'Запуск и оптимизация',
        tasks: [
          'Запуск рекламных кампаний',
          'Настройка воронки продаж',
          'A/B тестирование креативов',
          'Первые результаты и корректировки'
        ]
      },
      {
        phase: 'Месяц 2-3',
        title: 'Масштабирование',
        tasks: [
          'Расширение успешных каналов',
          'Автоматизация процессов',
          'Улучшение конверсии',
          'Планирование долгосрочного роста'
        ]
      }
    ];
  }

  /**
   * Анализ снижения рисков
   * @private
   * @param {Object} currentTeam - Текущая команда
   * @returns {Array} Риски и их митигация
   */
  analyzeRiskMitigation(currentTeam) {
    const risks = [];

    if (currentTeam.riskLevel === 'high') {
      risks.push({
        risk: 'Непредсказуемые результаты',
        mitigation: 'Проверенные стратегии и постоянная оптимизация',
        impact: 'high'
      });
    }

    if (currentTeam.id === 'inhouse_senior') {
      risks.push({
        risk: 'Зависимость от одного человека',
        mitigation: 'Команда взаимозаменяемых специалистов',
        impact: 'high'
      });
    }

    if (currentTeam.id === 'agency_traditional') {
      risks.push({
        risk: 'Долгие согласования и коммуникации',
        mitigation: 'Прямая работа с decision makers',
        impact: 'medium'
      });
    }

    return risks;
  }

  /**
   * Обновление UI с gap analysis
   * @private
   */
  updateGapAnalysisUI() {
    if (!this.gapAnalysis || !this.steamphonyRecommendations) return;

    try {
      // Обновление current metrics
      this.updateCurrentMetrics();
      
      // Обновление Steamphony metrics
      this.updateSteamphonyMetrics();
      
      // Обновление value propositions
      this.updateValuePropositions();
      
      // Обновление ROI projection
      this.updateROIProjection();

    } catch (error) {
      console.error('MarketingTeamStep: Ошибка обновления UI analysis:', error);
    }
  }

  /**
   * Обновление current metrics
   * @private
   */
  updateCurrentMetrics() {
    if (!this.elements.currentMetrics || !this.gapAnalysis) return;

    const current = this.gapAnalysis.current;
    
    const metricsHTML = `
      <div class="metric-item">
        <span class="metric-label">Стоимость:</span>
        <span class="metric-value cost-high">${this.formatCurrency(current.monthlyCost)}/мес</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Ваше время:</span>
        <span class="metric-value time-high">${current.timeInvestment} ч/неделю</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Эффективность:</span>
        <span class="metric-value">${current.effectivenessScore}/10</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Риски:</span>
        <span class="metric-value risk-${current.riskLevel}">${this.translateRiskLevel(current.riskLevel)}</span>
      </div>
    `;

    this.elements.currentMetrics.innerHTML = metricsHTML;
  }

  /**
   * Обновление Steamphony metrics
   * @private
   */
  updateSteamphonyMetrics() {
    if (!this.elements.steamphonyMetrics || !this.gapAnalysis) return;

    const steamphony = this.gapAnalysis.optimal;
    
    const metricsHTML = `
      <div class="metric-item">
        <span class="metric-label">Стоимость:</span>
        <span class="metric-value cost-free">За результат</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Ваше время:</span>
        <span class="metric-value time-low">${steamphony.timeInvestment} ч/неделю</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Эффективность:</span>
        <span class="metric-value effectiveness-high">${steamphony.effectivenessScore}/10</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Риски:</span>
        <span class="metric-value risk-very-low">Минимальные</span>
      </div>
    `;

    this.elements.steamphonyMetrics.innerHTML = metricsHTML;
  }

  /**
   * Обновление value propositions
   * @private
   */
  updateValuePropositions() {
    if (!this.elements.benefitsGrid || !this.steamphonyRecommendations) return;

    const valueProps = this.steamphonyRecommendations.valuePropositions;
    
    const benefitsHTML = valueProps.map(prop => `
      <div class="benefit-item ${prop.impact}">
        <div class="benefit-icon">${prop.icon}</div>
        <div class="benefit-content">
          <h5 class="benefit-title">${prop.title}</h5>
          <p class="benefit-description">${prop.description}</p>
        </div>
      </div>
    `).join('');

    this.elements.benefitsGrid.innerHTML = benefitsHTML;
  }

  /**
   * Обновление ROI projection
   * @private
   */
  updateROIProjection() {
    if (!this.elements.roiTimeline || !this.steamphonyRecommendations) return;

    const roiData = this.steamphonyRecommendations.roiProjection;
    
    const timelineHTML = `
      <div class="roi-timeline-grid">
        <div class="roi-period">
          <div class="period-label">1 месяц</div>
          <div class="period-value">${roiData.month_1.roi}</div>
        </div>
        <div class="roi-period">
          <div class="period-label">3 месяца</div>
          <div class="period-value">${typeof roiData.month_3.roi === 'number' ? this.formatCurrency(roiData.month_3.roi) : roiData.month_3.roi}</div>
        </div>
        <div class="roi-period">
          <div class="period-label">6 месяцев</div>
          <div class="period-value">${typeof roiData.month_6.roi === 'number' ? this.formatCurrency(roiData.month_6.roi) : roiData.month_6.roi}</div>
        </div>
        <div class="roi-period">
          <div class="period-label">12 месяцев</div>
          <div class="period-value">${typeof roiData.month_12.roi === 'number' ? this.formatCurrency(roiData.month_12.roi) : roiData.month_12.roi}</div>
        </div>
      </div>
    `;

    this.elements.roiTimeline.innerHTML = timelineHTML;
  }

  /**
   * Показ gap analysis section
   * @private
   */
  showGapAnalysisSection() {
    if (this.elements.gapAnalysisSection) {
      this.elements.gapAnalysisSection.style.display = 'block';
      
      // Анимация появления
      setTimeout(() => {
        this.elements.gapAnalysisSection.style.opacity = '0';
        this.elements.gapAnalysisSection.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
          this.elements.gapAnalysisSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          this.elements.gapAnalysisSection.style.opacity = '1';
          this.elements.gapAnalysisSection.style.transform = 'translateY(0)';
        });
      }, 50);
    }
  }

  /**
   * Обновление состояния кнопки "Далее"
   * @private
   */
  updateNextButtonState() {
    const isValid = this.validateSelection();
    
    if (this.elements.nextBtn) {
      this.elements.nextBtn.disabled = !isValid;
      this.elements.nextBtn.classList.toggle('enabled', isValid);
      this.elements.nextBtn.setAttribute('aria-disabled', !isValid);
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
      // Подготовка данных для сохранения
      const teamData = this.prepareTeamData();

      // Analytics tracking
      this.trackStepCompletion();

      // Сохранение данных в приложении
      this.saveDataToApp(teamData);

      // Колбэк перехода
      this.onNext({
        step: 5,
        teamData: teamData,
        gapAnalysis: this.gapAnalysis,
        recommendations: this.steamphonyRecommendations,
        nextStep: 6
      });
      
    } catch (error) {
      console.error('MarketingTeamStep: Ошибка перехода к следующему шагу:', error);
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
      this.trackEvent('step_5_back', {
        selected_team: this.selectedTeamSetup?.id,
        industry: this.currentFormData?.industry?.key,
        step: 5,
        previous_step: 4,
        timestamp: Date.now()
      });

      // Колбэк возврата
      this.onBack({
        step: 5,
        previousStep: 4
      });
      
    } catch (error) {
      console.error('MarketingTeamStep: Ошибка возврата к предыдущему шагу:', error);
    }
  }

  /**
   * Подготовка данных команды для сохранения
   * @private
   * @returns {Object} Организованные данные команды
   */
  prepareTeamData() {
    return {
      current: {
        id: this.selectedTeamSetup.id,
        title: this.selectedTeamSetup.title,
        monthlyCost: typeof this.selectedTeamSetup.monthlyCost === 'number' 
          ? this.selectedTeamSetup.monthlyCost 
          : this.selectedTeamSetup.monthlyCost?.average || 0,
        timeInvestment: this.selectedTeamSetup.timeInvestment,
        effectivenessScore: this.selectedTeamSetup.effectivenessScore,
        painPoints: this.selectedTeamSetup.painPoints,
        riskLevel: this.selectedTeamSetup.riskLevel
      },
      
      gapAnalysis: this.gapAnalysis,
      
      steamphonyBenefits: {
        valuePropositions: this.steamphonyRecommendations?.valuePropositions || [],
        savings: this.gapAnalysis?.savings || {},
        roiProjection: this.steamphonyRecommendations?.roiProjection || {},
        implementationPlan: this.steamphonyRecommendations?.implementationPlan || []
      },
      
      selectionSummary: {
        selectedAt: Date.now(),
        teamType: this.selectedTeamSetup.id,
        hasGapAnalysis: !!this.gapAnalysis,
        hasRecommendations: !!this.steamphonyRecommendations
      }
    };
  }

  /**
   * Валидация выбора
   * @private
   * @returns {boolean} Результат валидации
   */
  validateSelection() {
    if (this.options.requireSelection) {
      return !!this.selectedTeamSetup;
    }
    return true;
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
      const firstOption = this.elements.teamOptions[0];
      if (firstOption) {
        firstOption.focus();
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
   * @param {Object} teamData - Данные команды
   */
  saveDataToApp(teamData) {
    if (typeof window !== 'undefined' && window.app && window.app.formData) {
      window.app.formData.marketingTeam = teamData;
      
      // Также сохраняем для обратной совместимости
      window.app.data = window.app.data || {};
      window.app.data.marketingTeam = teamData;
    }
  }

  /**
   * Обновление с данными формы
   * @public
   * @param {Object} formData - Данные формы от предыдущих шагов
   */
  updateWithFormData(formData) {
    this.currentFormData = formData;
    
    // Обновление контекста шага
    this.updateStepContext();
    
    // Отправка analytics события
    this.trackEvent('step_5_viewed', {
      industry: formData.industry?.key,
      businessSize: formData.businessSize?.key,
      marketingBudget: formData.marketingBudget?.monthly,
      step: 5,
      timestamp: Date.now()
    });
  }

  /**
   * Обновление контекста шага
   * @private
   */
  updateStepContext() {
    if (!this.elements.stepContext || !this.currentFormData) return;

    const contextHTML = `
      <div class="context-item">
        <span class="context-icon">🏢</span>
        <span class="context-text">${this.currentFormData.industry?.title || 'Отрасль не выбрана'}</span>
      </div>
      <div class="context-item">
        <span class="context-icon">📏</span>
        <span class="context-text">${this.currentFormData.businessSize?.title || 'Размер не выбран'}</span>
      </div>
      <div class="context-item">
        <span class="context-icon">💰</span>
        <span class="context-text">${this.formatCurrency(this.currentFormData.marketingBudget?.monthly || 0)}/мес</span>
      </div>
    `;

    this.elements.stepContext.innerHTML = contextHTML;
  }

  /**
   * Analytics tracking для выбора команды
   * @private
   * @param {string} teamId - ID выбранной команды
   */
  trackTeamSelection(teamId) {
    if (!this.options.trackAnalytics) return;
    
    const team = this.teamOptions[teamId];
    if (!team) return;

    const monthlyCost = typeof team.monthlyCost === 'number' 
      ? team.monthlyCost 
      : team.monthlyCost?.average || 0;

    this.trackEvent('marketing_team_selected', {
      team_id: teamId,
      team_title: team.title,
      monthly_cost: monthlyCost,
      time_investment: team.timeInvestmentHours,
      effectiveness_score: team.effectivenessScore,
      risk_level: team.riskLevel,
      industry: this.currentFormData?.industry?.key,
      business_size: this.currentFormData?.businessSize?.key,
      marketing_budget: this.currentFormData?.marketingBudget?.monthly,
      step: 5,
      timestamp: Date.now()
    });
  }

  /**
   * Analytics tracking для завершения шага
   * @private
   */
  trackStepCompletion() {
    if (!this.options.trackAnalytics) return;

    const savings = this.gapAnalysis?.savings || {};
    const valuePropsCount = this.steamphonyRecommendations?.valuePropositions?.length || 0;

    this.trackEvent('step_5_completed', {
      selected_team: this.selectedTeamSetup?.id,
      team_monthly_cost: this.gapAnalysis?.current?.monthlyCost || 0,
      potential_monthly_savings: savings.cost?.monthly || 0,
      potential_annual_savings: savings.cost?.annual || 0,
      time_savings_weekly: savings.time?.weekly || 0,
      value_propositions_count: valuePropsCount,
      has_gap_analysis: !!this.gapAnalysis,
      has_recommendations: !!this.steamphonyRecommendations,
      industry: this.currentFormData?.industry?.key,
      business_size: this.currentFormData?.businessSize?.key,
      marketing_budget: this.currentFormData?.marketingBudget?.monthly,
      step: 5,
      next_step: 6,
      timestamp: Date.now()
    });
  }

  /**
   * Показ компонента
   * @public
   */
  show() {
    if (this.elements.step) {
      this.elements.step.style.display = 'block';
      this.isVisible = true;
      
      // Анимация появления
      this.elements.step.style.opacity = '0';
      this.elements.step.style.transform = 'translateY(20px)';
      
      requestAnimationFrame(() => {
        this.elements.step.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        this.elements.step.style.opacity = '1';
        this.elements.step.style.transform = 'translateY(0)';
      });
    }
  }

  /**
   * Скрытие компонента
   * @public
   */
  hide() {
    if (this.elements.step) {
      this.elements.step.style.display = 'none';
      this.isVisible = false;
    }
  }

  /**
   * Сброс компонента
   * @public
   */
  reset() {
    this.selectedTeamSetup = null;
    this.gapAnalysis = null;
    this.steamphonyRecommendations = null;
    
    if (this.isRendered) {
      // Сброс выборов
      this.elements.teamOptions.forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-checked', 'false');
      });

      this.elements.teamRadios.forEach(radio => {
        radio.checked = false;
      });
      
      // Скрытие gap analysis
      if (this.elements.gapAnalysisSection) {
        this.elements.gapAnalysisSection.style.display = 'none';
      }
      
      // Сброс UI состояния
      this.updateNextButtonState();
      this.hideValidationError();
    }
  }

  /**
   * Utility методы
   */

  /**
   * Перевод уровня риска
   * @private
   * @param {string} riskLevel - Уровень риска
   * @returns {string} Переведенный уровень риска
   */
  translateRiskLevel(riskLevel) {
    const translations = {
      'very-low': 'Минимальные',
      'low': 'Низкие',
      'medium-low': 'Ниже среднего',
      'medium': 'Средние',
      'medium-high': 'Выше среднего',
      'high': 'Высокие',
      'very-high': 'Критические'
    };
    
    return translations[riskLevel] || 'Неизвестно';
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
      console.log('📊 MarketingTeamStep Analytics:', eventName, params);
      
    } catch (error) {
      console.warn('MarketingTeamStep: Ошибка отправки analytics:', error);
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
          component: 'MarketingTeamStep',
          timestamp: Date.now(),
          ...detail
        },
        bubbles: true,
        cancelable: true
      });
      
      this.container.dispatchEvent(event);
      
    } catch (error) {
      console.warn('MarketingTeamStep: Ошибка dispatch события:', error);
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
      <div class="marketing-team-step-error">
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
   * Уничтожение компонента
   * @public
   */
  destroy() {
    try {
      // Удаление обработчиков событий
      if (this.isRendered) {
        this.elements.teamOptions.forEach(option => {
          option.removeEventListener('click', this.handleTeamSelection);
          option.removeEventListener('keydown', this.handleKeydown);
        });

        this.elements.teamRadios.forEach(radio => {
          radio.removeEventListener('change', this.handleTeamSelection);
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
      this.selectedTeamSetup = null;
      this.gapAnalysis = null;
      this.steamphonyRecommendations = null;
      this.currentFormData = null;
      this.elements = null;
      this.isRendered = false;
      this.isVisible = false;
      
      console.log('🗑️ MarketingTeamStep уничтожен');
      
    } catch (error) {
      console.error('MarketingTeamStep: Ошибка уничтожения:', error);
    }
  }
}

// Экспорт для использования в других модулях
if (typeof window !== 'undefined') {
  window.MarketingTeamStep = MarketingTeamStep;
}

export default MarketingTeamStep; 