/**
 * MarketingToolsStep Component для Universal Calculator
 * Четвертый шаг формы - выбор используемых маркетинговых инструментов
 * 
 * @class MarketingToolsStep
 * @author Steamphony Digital Agency
 */
class MarketingToolsStep {
  /**
   * Создает экземпляр MarketingToolsStep
   * 
   * @param {HTMLElement} container - DOM элемент для размещения компонента
   * @param {Object} options - Опции конфигурации
   */
  constructor(container, options = {}) {
    // Валидация входных параметров
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('MarketingToolsStep: container должен быть DOM элементом');
    }

    // Основные свойства
    this.container = container;
    this.selectedTools = new Set();
    this.currentIndustry = null;
    this.currentBusinessSize = null;
    this.currentBudget = null;
    this.optimizationOpportunities = [];
    this.isRendered = false;

    // Колбэки
    this.onSelect = options.onSelect || (() => {});
    this.onNext = options.onNext || (() => {});
    this.onBack = options.onBack || (() => {});

    // Конфигурация
    this.options = {
      enableValidation: true,
      showOptimizationSuggestions: true,
      trackAnalytics: true,
      requireMinimumSelection: true,
      minimumTools: 1,
      ...options
    };

    // Industry-specific marketing tools database
    this.marketingTools = {
      advertising: {
        universal: [
          { 
            id: 'instagram_ads', 
            name: 'Instagram/Facebook Ads', 
            cost: 'included', 
            popularity: 85,
            monthlyEstimate: 15000,
            description: 'Реклама в социальных сетях Meta'
          },
          { 
            id: 'google_ads', 
            name: 'Google Ads (Контекст)', 
            cost: 'per_click', 
            popularity: 70,
            monthlyEstimate: 20000,
            description: 'Контекстная реклама в поиске Google'
          },
          { 
            id: 'yandex_direct', 
            name: 'Яндекс.Директ', 
            cost: 'per_click', 
            popularity: 65,
            monthlyEstimate: 18000,
            description: 'Контекстная реклама в Яндексе'
          },
          { 
            id: 'vk_ads', 
            name: 'ВКонтакте реклама', 
            cost: 'included', 
            popularity: 45,
            monthlyEstimate: 8000,
            description: 'Реклама в социальной сети ВК'
          },
          { 
            id: 'youtube_ads', 
            name: 'YouTube реклама', 
            cost: 'per_view', 
            popularity: 40,
            monthlyEstimate: 12000,
            description: 'Видеореклама на YouTube'
          }
        ],
        restaurant: [
          { 
            id: 'delivery_platforms', 
            name: 'Реклама на доставке (Яндекс.Еда, Delivery Club)', 
            cost: 'commission', 
            popularity: 90,
            monthlyEstimate: 25000,
            description: 'Продвижение в приложениях доставки еды'
          },
          { 
            id: 'local_media', 
            name: 'Местные медиа и афиши', 
            cost: 'fixed', 
            popularity: 40,
            monthlyEstimate: 5000,
            description: 'Реклама в районных изданиях'
          },
          { 
            id: 'food_bloggers', 
            name: 'Коллаборации с фуд-блогерами', 
            cost: 'variable', 
            popularity: 60,
            monthlyEstimate: 10000,
            description: 'Обзоры от популярных фуд-блогеров'
          }
        ],
        beauty: [
          { 
            id: 'booking_platforms', 
            name: 'Реклама на Yclients/ZOON', 
            cost: 'commission', 
            popularity: 75,
            monthlyEstimate: 8000,
            description: 'Продвижение в сервисах онлайн-записи'
          },
          { 
            id: 'beauty_influencer', 
            name: 'Коллаборации с бьюти-блогерами', 
            cost: 'variable', 
            popularity: 65,
            monthlyEstimate: 15000,
            description: 'Обзоры услуг от beauty-инфлюенсеров'
          },
          { 
            id: 'local_beauty_media', 
            name: 'Специализированные beauty-порталы', 
            cost: 'fixed', 
            popularity: 35,
            monthlyEstimate: 3000,
            description: 'Реклама в тематических изданиях'
          }
        ],
        retail: [
          { 
            id: 'marketplace_ads', 
            name: 'Реклама на маркетплейсах (Wildberries, Ozon)', 
            cost: 'commission', 
            popularity: 85,
            monthlyEstimate: 30000,
            description: 'Продвижение товаров на торговых площадках'
          },
          { 
            id: 'shopping_ads', 
            name: 'Google Shopping / Яндекс.Маркет', 
            cost: 'per_click', 
            popularity: 60,
            monthlyEstimate: 22000,
            description: 'Товарная реклама в поисковиках'
          },
          { 
            id: 'retargeting_ads', 
            name: 'Ретаргетинг и динамические объявления', 
            cost: 'per_click', 
            popularity: 50,
            monthlyEstimate: 12000,
            description: 'Показ товаров заинтересованным пользователям'
          }
        ]
      },
      crm_analytics: {
        universal: [
          { 
            id: 'google_analytics', 
            name: 'Google Analytics', 
            cost: 'free', 
            popularity: 80,
            monthlyEstimate: 0,
            description: 'Бесплатная веб-аналитика от Google'
          },
          { 
            id: 'yandex_metrica', 
            name: 'Яндекс.Метрика', 
            cost: 'free', 
            popularity: 75,
            monthlyEstimate: 0,
            description: 'Бесплатная веб-аналитика от Яндекса'
          },
          { 
            id: 'amocrm', 
            name: 'amoCRM', 
            cost: 'subscription', 
            popularity: 50,
            monthlyEstimate: 3000,
            description: 'CRM-система для управления клиентами'
          },
          { 
            id: 'bitrix24', 
            name: 'Битрикс24', 
            cost: 'subscription', 
            popularity: 45,
            monthlyEstimate: 4000,
            description: 'Комплексная CRM и бизнес-платформа'
          },
          { 
            id: 'calltouch', 
            name: 'Calltouch / Roistat', 
            cost: 'subscription', 
            popularity: 35,
            monthlyEstimate: 5000,
            description: 'Сквозная аналитика и call tracking'
          }
        ],
        restaurant: [
          { 
            id: 'r_keeper', 
            name: 'R-Keeper POS', 
            cost: 'license', 
            popularity: 60,
            monthlyEstimate: 8000,
            description: 'Ресторанная учетная система'
          },
          { 
            id: 'poster', 
            name: 'Poster POS', 
            cost: 'subscription', 
            popularity: 40,
            monthlyEstimate: 3000,
            description: 'Облачная POS-система для ресторанов'
          },
          { 
            id: 'loyverse', 
            name: 'Loyverse (лояльность)', 
            cost: 'freemium', 
            popularity: 30,
            monthlyEstimate: 2000,
            description: 'Система лояльности для заведений'
          }
        ],
        beauty: [
          { 
            id: 'yclients', 
            name: 'Yclients (CRM + запись)', 
            cost: 'subscription', 
            popularity: 85,
            monthlyEstimate: 2500,
            description: 'Система онлайн-записи и CRM для салонов'
          },
          { 
            id: 'beauty_crm', 
            name: 'Специализированная Beauty CRM', 
            cost: 'subscription', 
            popularity: 35,
            monthlyEstimate: 4000,
            description: 'CRM системы для индустрии красоты'
          },
          { 
            id: 'salon_analytics', 
            name: 'Аналитика эффективности мастеров', 
            cost: 'subscription', 
            popularity: 25,
            monthlyEstimate: 3000,
            description: 'Система анализа работы специалистов'
          }
        ],
        retail: [
          { 
            id: 'retail_crm', 
            name: 'Retail CRM (МойСклад, Эвотор)', 
            cost: 'subscription', 
            popularity: 70,
            monthlyEstimate: 5000,
            description: 'CRM для торговых предприятий'
          },
          { 
            id: 'inventory_system', 
            name: 'Система управления складом', 
            cost: 'subscription', 
            popularity: 60,
            monthlyEstimate: 8000,
            description: 'Учет товаров и складских операций'
          }
        ]
      },
      content_design: {
        universal: [
          { 
            id: 'canva', 
            name: 'Canva', 
            cost: 'freemium', 
            popularity: 70,
            monthlyEstimate: 1000,
            description: 'Онлайн-дизайн графики и постов'
          },
          { 
            id: 'photoshop', 
            name: 'Adobe Photoshop', 
            cost: 'subscription', 
            popularity: 45,
            monthlyEstimate: 2000,
            description: 'Профессиональный графический редактор'
          },
          { 
            id: 'figma', 
            name: 'Figma', 
            cost: 'freemium', 
            popularity: 35,
            monthlyEstimate: 1500,
            description: 'Дизайн интерфейсов и прототипирование'
          },
          { 
            id: 'freelance_designer', 
            name: 'Дизайнер на фрилансе', 
            cost: 'per_project', 
            popularity: 60,
            monthlyEstimate: 15000,
            description: 'Внешний дизайнер для создания контента'
          },
          { 
            id: 'stock_photos', 
            name: 'Shutterstock / Freepik', 
            cost: 'subscription', 
            popularity: 50,
            monthlyEstimate: 2000,
            description: 'Стоковые фотографии и графика'
          },
          { 
            id: 'video_editing', 
            name: 'Видеомонтаж (DaVinci/Premiere)', 
            cost: 'subscription', 
            popularity: 30,
            monthlyEstimate: 3000,
            description: 'ПО для создания видеоконтента'
          }
        ]
      },
      email_sms: {
        universal: [
          { 
            id: 'mailchimp', 
            name: 'Mailchimp', 
            cost: 'freemium', 
            popularity: 40,
            monthlyEstimate: 3000,
            description: 'Email-маркетинг платформа'
          },
          { 
            id: 'sendsay', 
            name: 'Sendsay', 
            cost: 'subscription', 
            popularity: 30,
            monthlyEstimate: 2500,
            description: 'Российская платформа email-рассылок'
          },
          { 
            id: 'sms_sending', 
            name: 'SMS-рассылки (SMS.ru, UniSender)', 
            cost: 'per_message', 
            popularity: 55,
            monthlyEstimate: 4000,
            description: 'Сервисы массовых SMS-уведомлений'
          },
          { 
            id: 'push_notifications', 
            name: 'Push-уведомления', 
            cost: 'subscription', 
            popularity: 25,
            monthlyEstimate: 2000,
            description: 'Web/app push-уведомления'
          },
          { 
            id: 'telegram_bot', 
            name: 'Telegram-бот для клиентов', 
            cost: 'development', 
            popularity: 35,
            monthlyEstimate: 5000,
            description: 'Автоматизация общения через Telegram'
          },
          { 
            id: 'whatsapp_business', 
            name: 'WhatsApp Business API', 
            cost: 'per_message', 
            popularity: 40,
            monthlyEstimate: 3500,
            description: 'Автоматические сообщения в WhatsApp'
          }
        ]
      }
    };

    // Optimization opportunities templates
    this.optimizationTemplates = {
      consolidation: {
        icon: '🔄',
        type: 'Консолидация',
        savingsMultiplier: 0.15
      },
      automation: {
        icon: '🤖',
        type: 'Автоматизация',
        savingsMultiplier: 0.25
      },
      strategy: {
        icon: '💡',
        type: 'Стратегия',
        savingsMultiplier: 0.20
      },
      missing_tool: {
        icon: '📈',
        type: 'Упущенная возможность',
        savingsMultiplier: 0.10
      },
      cost_reduction: {
        icon: '💰',
        type: 'Снижение затрат',
        savingsMultiplier: 0.18
      }
    };

    // Обработчики событий
    this.handleToolToggle = this.handleToolToggle.bind(this);
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
      
      // Начальный расчет optimization opportunities
      this.updateOptimizationSuggestions();
      
      // Отправка analytics события
      this.trackEvent('step_4_viewed', {
        industry: this.currentIndustry?.key,
        businessSize: this.currentBusinessSize?.key,
        budget: this.currentBudget?.monthly,
        step: 4,
        timestamp: Date.now()
      });
      
      // Dispatch готовности компонента
      this.dispatchEvent('marketingToolsStepReady', {
        industry: this.currentIndustry?.key,
        businessSize: this.currentBusinessSize?.key,
        availableTools: this.getAvailableToolsCount()
      });
      
    } catch (error) {
      console.error('MarketingToolsStep: Ошибка инициализации:', error);
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
      this.currentBudget = window.app.formData.marketingBudget;
    }

    // Fallback значения если данные отсутствуют
    if (!this.currentIndustry) {
      this.currentIndustry = { key: 'default', title: 'Другое' };
    }
    if (!this.currentBusinessSize) {
      this.currentBusinessSize = { key: 'medium_business', title: 'Средний бизнес' };
    }
    if (!this.currentBudget) {
      this.currentBudget = { monthly: 50000, breakdown: {} };
    }
  }

  /**
   * Получение доступных инструментов для текущей отрасли
   * @private
   * @returns {Object} Организованные по категориям инструменты
   */
  getAvailableTools() {
    const industryKey = this.currentIndustry.key || 'default';
    const tools = {};

    // Объединяем universal tools с industry-specific
    Object.keys(this.marketingTools).forEach(category => {
      tools[category] = [
        ...this.marketingTools[category].universal,
        ...(this.marketingTools[category][industryKey] || [])
      ];
      
      // Сортируем по популярности
      tools[category].sort((a, b) => b.popularity - a.popularity);
    });

    return tools;
  }

  /**
   * Подсчет общего количества доступных инструментов
   * @private
   * @returns {number} Количество инструментов
   */
  getAvailableToolsCount() {
    const tools = this.getAvailableTools();
    return Object.values(tools).reduce((total, category) => total + category.length, 0);
  }

  /**
   * Рендеринг HTML структуры
   * @private
   */
  render() {
    const availableTools = this.getAvailableTools();
    const industryTitle = this.getIndustryTitle();
    
    const stepHTML = `
      <div class="marketing-tools-step" role="region" aria-label="Выбор маркетинговых инструментов">
        <!-- Header -->
        <div class="step-header">
          <h2 class="step-title">Какие маркетинговые инструменты используете?</h2>
          <p class="step-description">
            Отметьте всё, что применяет ${industryTitle} сейчас. Это поможет найти возможности для оптимизации.
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
            <span class="context-item">
              <span class="context-icon">💰</span>
              <span class="context-text">${this.formatCurrency(this.currentBudget.monthly)}/мес</span>
            </span>
          </div>
        </div>

        <!-- Tools Categories -->
        <div class="tools-categories">
          ${this.renderToolCategory('advertising', '📱 Реклама и продвижение', availableTools.advertising)}
          ${this.renderToolCategory('crm_analytics', '📊 CRM и аналитика', availableTools.crm_analytics)}
          ${this.renderToolCategory('content_design', '🎨 Контент и дизайн', availableTools.content_design)}
          ${this.renderToolCategory('email_sms', '📧 Email и SMS маркетинг', availableTools.email_sms)}
        </div>

        <!-- Optimization Preview -->
        ${this.options.showOptimizationSuggestions ? this.renderOptimizationPreview() : ''}

        <!-- Selection Summary -->
        <div class="selection-summary" id="selection-summary" style="display: none;">
          <div class="summary-header">
            <h3 class="summary-title">Выбранные инструменты</h3>
            <div class="summary-count" id="summary-count">0 инструментов</div>
          </div>
          <div class="summary-cost" id="summary-cost">
            Примерная стоимость: <span class="cost-amount">0 ₽/месяц</span>
          </div>
        </div>

        <!-- Validation Error -->
        <div class="validation-error" id="tools-validation-error" style="display: none;">
          <div class="error-message">
            <span class="error-icon">⚠️</span>
            <span class="error-text">Выберите хотя бы один маркетинговый инструмент</span>
          </div>
        </div>

        <!-- Navigation Footer -->
        <div class="step-footer">
          <button type="button" class="btn btn-secondary btn-back" id="tools-back-btn">
            <span class="btn-icon">←</span>
            Назад
          </button>
          
          <button type="button" class="btn btn-primary btn-next" id="tools-next-btn" disabled>
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
            <span class="trust-icon">💡</span>
            <span class="trust-text">Персональные рекомендации</span>
          </div>
          <div class="trust-item">
            <span class="trust-icon">📈</span>
            <span class="trust-text">Оптимизация затрат</span>
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
   * Рендеринг категории инструментов
   * @private
   * @param {string} categoryId - ID категории
   * @param {string} categoryTitle - Заголовок категории
   * @param {Array} tools - Инструменты категории
   * @returns {string} HTML категории
   */
  renderToolCategory(categoryId, categoryTitle, tools) {
    if (!tools || tools.length === 0) return '';

    const toolsHTML = tools.map(tool => this.renderToolCheckbox(categoryId, tool)).join('');

    return `
      <div class="tool-category" data-category="${categoryId}">
        <div class="category-header">
          <h3 class="category-title">${categoryTitle}</h3>
          <div class="category-counter" id="counter-${categoryId}">
            <span class="selected-count">0</span> из <span class="total-count">${tools.length}</span>
          </div>
        </div>
        
        <div class="tools-grid" role="group" aria-labelledby="category-${categoryId}">
          ${toolsHTML}
        </div>
      </div>
    `;
  }

  /**
   * Рендеринг checkbox для инструмента
   * @private
   * @param {string} categoryId - ID категории
   * @param {Object} tool - Данные инструмента
   * @returns {string} HTML checkbox
   */
  renderToolCheckbox(categoryId, tool) {
    const popularityClass = tool.popularity >= 60 ? 'popular' : '';
    const costBadge = this.getCostBadge(tool.cost);

    return `
      <div class="tool-item ${popularityClass}" data-tool="${tool.id}" data-category="${categoryId}">
        <label class="tool-label" for="tool-${tool.id}">
          <input 
            type="checkbox" 
            id="tool-${tool.id}" 
            class="tool-checkbox"
            value="${tool.id}"
            data-category="${categoryId}"
            data-cost="${tool.monthlyEstimate}"
            aria-describedby="desc-${tool.id}"
          >
          
          <div class="tool-content">
            <div class="tool-header">
              <div class="tool-info">
                <h4 class="tool-name">${tool.name}</h4>
                <p class="tool-description" id="desc-${tool.id}">${tool.description}</p>
              </div>
              
              <div class="tool-meta">
                <div class="checkbox-indicator">
                  <div class="checkbox-box">
                    <svg class="checkbox-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                </div>
                ${costBadge}
              </div>
            </div>
            
            <div class="tool-stats">
              <div class="popularity-bar">
                <div class="popularity-fill" style="width: ${tool.popularity}%"></div>
              </div>
              <span class="popularity-text">${tool.popularity}% используют</span>
              
              <div class="tool-cost">
                <span class="cost-label">~</span>
                <span class="cost-amount">${this.formatCurrency(tool.monthlyEstimate)}/мес</span>
              </div>
            </div>
          </div>
        </label>
      </div>
    `;
  }

  /**
   * Получение badge для типа стоимости
   * @private
   * @param {string} costType - Тип стоимости
   * @returns {string} HTML badge
   */
  getCostBadge(costType) {
    const badges = {
      free: '<span class="cost-badge free">Бесплатно</span>',
      freemium: '<span class="cost-badge freemium">Freemium</span>',
      subscription: '<span class="cost-badge subscription">Подписка</span>',
      per_click: '<span class="cost-badge per-click">За клик</span>',
      per_message: '<span class="cost-badge per-message">За сообщение</span>',
      commission: '<span class="cost-badge commission">Комиссия</span>',
      license: '<span class="cost-badge license">Лицензия</span>',
      included: '<span class="cost-badge included">В бюджете</span>',
      variable: '<span class="cost-badge variable">Договорная</span>',
      per_project: '<span class="cost-badge per-project">За проект</span>',
      development: '<span class="cost-badge development">Разработка</span>'
    };

    return badges[costType] || '';
  }

  /**
   * Рендеринг optimization preview
   * @private
   * @returns {string} HTML optimization section
   */
  renderOptimizationPreview() {
    return `
      <div class="optimization-preview" id="optimization-preview" style="display: none;">
        <div class="optimization-header">
          <h3 class="optimization-title">💡 Возможности для оптимизации</h3>
          <div class="total-savings" id="total-savings">
            Экономия: <span class="savings-amount">0 ₽/месяц</span>
          </div>
        </div>
        
        <div class="optimization-suggestions" id="optimization-suggestions">
          <!-- Динамически генерируемые suggestions -->
        </div>
        
        <div class="optimization-footer">
          <p class="optimization-note">
            * Рекомендации основаны на анализе вашего текущего tool stack
          </p>
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
      step: this.container.querySelector('.marketing-tools-step'),
      toolCheckboxes: this.container.querySelectorAll('.tool-checkbox'),
      toolItems: this.container.querySelectorAll('.tool-item'),
      categoryCounters: this.container.querySelectorAll('[id^="counter-"]'),
      selectionSummary: this.container.querySelector('#selection-summary'),
      summaryCount: this.container.querySelector('#summary-count'),
      summaryCost: this.container.querySelector('#summary-cost'),
      optimizationPreview: this.container.querySelector('#optimization-preview'),
      optimizationSuggestions: this.container.querySelector('#optimization-suggestions'),
      totalSavings: this.container.querySelector('#total-savings'),
      nextBtn: this.container.querySelector('#tools-next-btn'),
      backBtn: this.container.querySelector('#tools-back-btn'),
      validationError: this.container.querySelector('#tools-validation-error')
    };
  }

  /**
   * Привязка обработчиков событий
   * @private
   */
  attachEventListeners() {
    if (!this.isRendered) return;

    try {
      // Checkbox events
      this.elements.toolCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', this.handleToolToggle);
        checkbox.addEventListener('keydown', this.handleKeydown);
      });

      // Tool item click events (для клика по всей карточке)
      this.elements.toolItems.forEach(item => {
        item.addEventListener('click', (event) => {
          const checkbox = item.querySelector('.tool-checkbox');
          if (checkbox && event.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
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
      console.error('MarketingToolsStep: Ошибка привязки событий:', error);
    }
  }

  /**
   * Обработка toggle инструмента
   * @private
   * @param {Event} event - Событие change
   */
  handleToolToggle(event) {
    const checkbox = event.target;
    const toolId = checkbox.value;
    const categoryId = checkbox.dataset.category;
    const toolCost = parseInt(checkbox.dataset.cost) || 0;
    const isSelected = checkbox.checked;

    try {
      // Обновление выбранных инструментов
      if (isSelected) {
        this.selectedTools.add(toolId);
      } else {
        this.selectedTools.delete(toolId);
      }

      // Обновление UI
      this.updateToolItemState(checkbox.closest('.tool-item'), isSelected);
      this.updateCategoryCounter(categoryId);
      this.updateSelectionSummary();
      this.updateOptimizationSuggestions();
      
      // Validation и кнопка "Далее"
      this.updateNextButtonState();
      this.hideValidationError();

      // Analytics tracking
      this.trackEvent(isSelected ? 'marketing_tool_selected' : 'marketing_tool_deselected', {
        tool_id: toolId,
        category: categoryId,
        cost: toolCost,
        industry: this.currentIndustry?.key,
        step: 4,
        total_selected: this.selectedTools.size,
        timestamp: Date.now()
      });

      // Колбэк выбора
      this.onSelect({
        selectedTools: Array.from(this.selectedTools),
        totalSelected: this.selectedTools.size,
        estimatedCost: this.calculateTotalCost()
      });
      
    } catch (error) {
      console.error('MarketingToolsStep: Ошибка обработки выбора инструмента:', error);
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
        if (event.target.classList.contains('tool-checkbox')) {
          // Space на checkbox - обрабатывается браузером
          return;
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
    const checkboxes = Array.from(this.elements.toolCheckboxes);
    const focusedIndex = checkboxes.findIndex(cb => cb === document.activeElement);
    
    if (focusedIndex === -1) {
      // Если нет фокуса, фокусируем первый checkbox
      checkboxes[0]?.focus();
      return;
    }
    
    const nextIndex = isDown 
      ? Math.min(focusedIndex + 1, checkboxes.length - 1)
      : Math.max(focusedIndex - 1, 0);
    
    checkboxes[nextIndex]?.focus();
  }

  /**
   * Обновление состояния tool item
   * @private
   * @param {HTMLElement} toolItem - Элемент инструмента
   * @param {boolean} isSelected - Выбран ли инструмент
   */
  updateToolItemState(toolItem, isSelected) {
    if (!toolItem) return;
    
    toolItem.classList.toggle('selected', isSelected);
    toolItem.setAttribute('aria-selected', isSelected);
  }

  /**
   * Обновление счетчика категории
   * @private
   * @param {string} categoryId - ID категории
   */
  updateCategoryCounter(categoryId) {
    const counter = this.container.querySelector(`#counter-${categoryId}`);
    if (!counter) return;

    const categoryCheckboxes = this.container.querySelectorAll(`input[data-category="${categoryId}"]`);
    const selectedCount = Array.from(categoryCheckboxes).filter(cb => cb.checked).length;
    const totalCount = categoryCheckboxes.length;

    const selectedSpan = counter.querySelector('.selected-count');
    if (selectedSpan) {
      selectedSpan.textContent = selectedCount;
    }

    // Анимация обновления счетчика
    counter.classList.add('updating');
    setTimeout(() => counter.classList.remove('updating'), 300);
  }

  /**
   * Обновление summary выбранных инструментов
   * @private
   */
  updateSelectionSummary() {
    const selectedCount = this.selectedTools.size;
    const totalCost = this.calculateTotalCost();

    // Показ/скрытие summary
    if (this.elements.selectionSummary) {
      this.elements.selectionSummary.style.display = selectedCount > 0 ? 'block' : 'none';
    }

    // Обновление количества
    if (this.elements.summaryCount) {
      const toolText = this.pluralizeTools(selectedCount);
      this.elements.summaryCount.textContent = `${selectedCount} ${toolText}`;
    }

    // Обновление стоимости
    if (this.elements.summaryCost) {
      const costSpan = this.elements.summaryCost.querySelector('.cost-amount');
      if (costSpan) {
        costSpan.textContent = `${this.formatCurrency(totalCost)}/месяц`;
      }
    }
  }

  /**
   * Склонение слова "инструмент"
   * @private
   * @param {number} count - Количество
   * @returns {string} Склоненное слово
   */
  pluralizeTools(count) {
    if (count % 10 === 1 && count % 100 !== 11) return 'инструмент';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'инструмента';
    return 'инструментов';
  }

  /**
   * Расчет общей стоимости выбранных инструментов
   * @private
   * @returns {number} Общая стоимость
   */
  calculateTotalCost() {
    let totalCost = 0;
    
    this.selectedTools.forEach(toolId => {
      const checkbox = this.container.querySelector(`input[value="${toolId}"]`);
      if (checkbox) {
        const cost = parseInt(checkbox.dataset.cost) || 0;
        totalCost += cost;
      }
    });

    return totalCost;
  }

  /**
   * Обновление optimization suggestions
   * @private
   */
  updateOptimizationSuggestions() {
    if (!this.options.showOptimizationSuggestions || !this.elements.optimizationPreview) return;

    const opportunities = this.calculateOptimizationOpportunities();
    const hasOpportunities = opportunities.length > 0;

    // Показ/скрытие optimization preview
    this.elements.optimizationPreview.style.display = hasOpportunities ? 'block' : 'none';

    if (hasOpportunities) {
      this.renderOptimizationSuggestions(opportunities);
      this.updateTotalSavings(opportunities);
      
      // Analytics tracking
      this.trackEvent('optimization_suggestion_viewed', {
        suggestions_count: opportunities.length,
        total_savings: opportunities.reduce((sum, opp) => sum + opp.savings, 0),
        industry: this.currentIndustry?.key,
        step: 4,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Расчет optimization opportunities
   * @private
   * @returns {Array} Массив возможностей оптимизации
   */
  calculateOptimizationOpportunities() {
    const opportunities = [];
    const selectedToolsArray = Array.from(this.selectedTools);
    const budget = this.currentBudget.monthly;
    const industry = this.currentIndustry.key;

    // Tool overlap analysis
    if (selectedToolsArray.includes('instagram_ads') && selectedToolsArray.includes('facebook_ads')) {
      opportunities.push({
        type: 'consolidation',
        savings: Math.round(budget * 0.12),
        title: 'Объедините рекламу в Meta Business',
        description: 'Единая кампания Facebook + Instagram сэкономит до 12% бюджета',
        icon: this.optimizationTemplates.consolidation.icon
      });
    }

    // Analytics tools redundancy
    if (selectedToolsArray.includes('google_analytics') && 
        selectedToolsArray.includes('yandex_metrica') && 
        selectedToolsArray.includes('calltouch')) {
      opportunities.push({
        type: 'consolidation',
        savings: Math.round(budget * 0.08),
        title: 'Упростите аналитику',
        description: 'Выберите 1-2 основных системы аналитики вместо множества',
        icon: this.optimizationTemplates.consolidation.icon
      });
    }

    // Industry-specific optimizations
    if (industry === 'restaurant') {
      if (selectedToolsArray.includes('delivery_platforms')) {
        opportunities.push({
          type: 'strategy',
          savings: Math.round(budget * 0.25),
          title: 'Собственная доставка',
          description: 'Развитие собственной доставки снизит комиссии агрегаторов на 25%',
          icon: this.optimizationTemplates.strategy.icon
        });
      }
    }

    if (industry === 'beauty') {
      if (selectedToolsArray.includes('yclients') && selectedToolsArray.includes('beauty_crm')) {
        opportunities.push({
          type: 'consolidation',
          savings: Math.round(budget * 0.15),
          title: 'Одна CRM система',
          description: 'Yclients покрывает большинство потребностей beauty-бизнеса',
          icon: this.optimizationTemplates.consolidation.icon
        });
      }
    }

    if (industry === 'retail') {
      if (!selectedToolsArray.includes('google_analytics') && !selectedToolsArray.includes('yandex_metrica')) {
        opportunities.push({
          type: 'missing_tool',
          savings: Math.round(budget * 0.18),
          title: 'Добавьте веб-аналитику',
          description: 'Отслеживание покупателей повысит эффективность рекламы на 18%',
          icon: this.optimizationTemplates.missing_tool.icon
        });
      }
    }

    // Automation opportunities
    if (selectedToolsArray.includes('freelance_designer') && selectedToolsArray.length >= 5) {
      opportunities.push({
        type: 'automation',
        savings: Math.round(budget * 0.20),
        title: 'Автоматизируйте контент',
        description: 'Шаблоны и AI-инструменты заменят часть работы дизайнера',
        icon: this.optimizationTemplates.automation.icon
      });
    }

    // Email/SMS optimization
    if (selectedToolsArray.includes('mailchimp') && selectedToolsArray.includes('sendsay')) {
      opportunities.push({
        type: 'cost_reduction',
        savings: Math.round(budget * 0.10),
        title: 'Одна email-платформа',
        description: 'Объединение email-рассылок в одном сервисе',
        icon: this.optimizationTemplates.cost_reduction.icon
      });
    }

    // Missing essential tools
    if (selectedToolsArray.length >= 3 && !selectedToolsArray.includes('amocrm') && 
        !selectedToolsArray.includes('bitrix24') && !selectedToolsArray.includes('yclients')) {
      opportunities.push({
        type: 'missing_tool',
        savings: Math.round(budget * 0.15),
        title: 'Добавьте CRM систему',
        description: 'Учет клиентов повысит повторные продажи на 15%',
        icon: this.optimizationTemplates.missing_tool.icon
      });
    }

    // Сортируем по potential savings
    return opportunities.sort((a, b) => b.savings - a.savings).slice(0, 4); // Максимум 4 suggestions
  }

  /**
   * Рендеринг optimization suggestions
   * @private
   * @param {Array} opportunities - Возможности оптимизации
   */
  renderOptimizationSuggestions(opportunities) {
    if (!this.elements.optimizationSuggestions) return;

    const suggestionsHTML = opportunities.map(opp => `
      <div class="optimization-suggestion" data-type="${opp.type}">
        <div class="suggestion-icon">${opp.icon}</div>
        <div class="suggestion-content">
          <h4 class="suggestion-title">${opp.title}</h4>
          <p class="suggestion-description">${opp.description}</p>
        </div>
        <div class="suggestion-savings">
          <span class="savings-amount">+${this.formatCurrency(opp.savings)}</span>
          <span class="savings-period">/месяц</span>
        </div>
      </div>
    `).join('');

    this.elements.optimizationSuggestions.innerHTML = suggestionsHTML;
  }

  /**
   * Обновление общей экономии
   * @private
   * @param {Array} opportunities - Возможности оптимизации
   */
  updateTotalSavings(opportunities) {
    if (!this.elements.totalSavings) return;

    const totalSavings = opportunities.reduce((sum, opp) => sum + opp.savings, 0);
    const savingsSpan = this.elements.totalSavings.querySelector('.savings-amount');
    
    if (savingsSpan) {
      savingsSpan.textContent = `${this.formatCurrency(totalSavings)}/месяц`;
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
      const marketingToolsData = this.prepareMarketingToolsData();

      // Analytics tracking
      this.trackEvent('step_4_completed', {
        selected_tools: Array.from(this.selectedTools),
        total_tools: this.selectedTools.size,
        estimated_cost: this.calculateTotalCost(),
        optimization_opportunities: this.optimizationOpportunities.length,
        industry: this.currentIndustry?.key,
        step: 4,
        next_step: 5,
        timestamp: Date.now()
      });

      // Сохранение данных в приложении
      this.saveDataToApp(marketingToolsData);

      // Колбэк перехода
      this.onNext({
        step: 4,
        marketingTools: marketingToolsData,
        industry: this.currentIndustry,
        businessSize: this.currentBusinessSize,
        budget: this.currentBudget,
        nextStep: 5
      });
      
    } catch (error) {
      console.error('MarketingToolsStep: Ошибка перехода к следующему шагу:', error);
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
      this.trackEvent('step_4_back', {
        selected_tools: Array.from(this.selectedTools),
        total_tools: this.selectedTools.size,
        industry: this.currentIndustry?.key,
        step: 4,
        previous_step: 3,
        timestamp: Date.now()
      });

      // Колбэк возврата
      this.onBack({
        step: 4,
        previousStep: 3
      });
      
    } catch (error) {
      console.error('MarketingToolsStep: Ошибка возврата к предыдущему шагу:', error);
    }
  }

  /**
   * Подготовка данных marketing tools для сохранения
   * @private
   * @returns {Object} Организованные данные инструментов
   */
  prepareMarketingToolsData() {
    const selectedToolsArray = Array.from(this.selectedTools);
    const categories = {};
    const toolDetails = [];

    // Организуем selected tools по категориям
    selectedToolsArray.forEach(toolId => {
      const checkbox = this.container.querySelector(`input[value="${toolId}"]`);
      if (checkbox) {
        const categoryId = checkbox.dataset.category;
        const cost = parseInt(checkbox.dataset.cost) || 0;
        const toolName = checkbox.closest('.tool-item').querySelector('.tool-name').textContent;

        if (!categories[categoryId]) {
          categories[categoryId] = [];
        }
        
        categories[categoryId].push(toolId);
        toolDetails.push({
          id: toolId,
          name: toolName,
          category: categoryId,
          monthlyEstimate: cost
        });
      }
    });

    return {
      selected: selectedToolsArray,
      categories: categories,
      toolDetails: toolDetails,
      estimatedMonthlyCost: this.calculateTotalCost(),
      optimizationOpportunities: this.optimizationOpportunities,
      potentialSavings: this.optimizationOpportunities.reduce((sum, opp) => sum + opp.savings, 0),
      selectionSummary: {
        totalSelected: selectedToolsArray.length,
        byCategory: Object.fromEntries(
          Object.entries(categories).map(([cat, tools]) => [cat, tools.length])
        )
      }
    };
  }

  /**
   * Валидация выбора
   * @private
   * @returns {boolean} Результат валидации
   */
  validateSelection() {
    if (this.options.requireMinimumSelection) {
      return this.selectedTools.size >= this.options.minimumTools;
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
      
      // Фокус на первый checkbox для accessibility
      const firstCheckbox = this.elements.toolCheckboxes[0];
      if (firstCheckbox) {
        firstCheckbox.focus();
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
   * @param {Object} marketingToolsData - Данные инструментов
   */
  saveDataToApp(marketingToolsData) {
    if (typeof window !== 'undefined' && window.app && window.app.formData) {
      window.app.formData.marketingTools = marketingToolsData;
      
      // Также сохраняем для обратной совместимости
      window.app.data = window.app.data || {};
      window.app.data.marketingTools = marketingToolsData;
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
      console.log('📊 MarketingToolsStep Analytics:', eventName, params);
      
    } catch (error) {
      console.warn('MarketingToolsStep: Ошибка отправки analytics:', error);
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
          component: 'MarketingToolsStep',
          timestamp: Date.now(),
          ...detail
        },
        bubbles: true,
        cancelable: true
      });
      
      this.container.dispatchEvent(event);
      
    } catch (error) {
      console.warn('MarketingToolsStep: Ошибка dispatch события:', error);
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
      <div class="marketing-tools-step-error">
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
    }
  }

  /**
   * Получение выбранных инструментов
   * @public
   * @returns {Set} Выбранные инструменты
   */
  getSelectedTools() {
    return new Set(this.selectedTools);
  }

  /**
   * Установка выбранных инструментов программно
   * @public
   * @param {Array} toolIds - Массив ID инструментов
   */
  setSelectedTools(toolIds) {
    // Сброс текущего выбора
    this.selectedTools.clear();
    this.elements.toolCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
      this.updateToolItemState(checkbox.closest('.tool-item'), false);
    });

    // Установка новых значений
    toolIds.forEach(toolId => {
      const checkbox = this.container.querySelector(`input[value="${toolId}"]`);
      if (checkbox) {
        checkbox.checked = true;
        this.selectedTools.add(toolId);
        this.updateToolItemState(checkbox.closest('.tool-item'), true);
      }
    });

    // Обновление UI
    this.updateAllCategoryCounters();
    this.updateSelectionSummary();
    this.updateOptimizationSuggestions();
    this.updateNextButtonState();
  }

  /**
   * Обновление всех счетчиков категорий
   * @private
   */
  updateAllCategoryCounters() {
    const categories = ['advertising', 'crm_analytics', 'content_design', 'email_sms'];
    categories.forEach(categoryId => {
      this.updateCategoryCounter(categoryId);
    });
  }

  /**
   * Сброс компонента
   * @public
   */
  reset() {
    this.selectedTools.clear();
    this.optimizationOpportunities = [];
    
    if (this.isRendered) {
      // Сброс checkboxes
      this.elements.toolCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
        this.updateToolItemState(checkbox.closest('.tool-item'), false);
      });
      
      // Сброс UI состояния
      this.updateAllCategoryCounters();
      this.updateSelectionSummary();
      this.updateOptimizationSuggestions();
      this.updateNextButtonState();
      
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
        this.elements.toolCheckboxes.forEach(checkbox => {
          checkbox.removeEventListener('change', this.handleToolToggle);
          checkbox.removeEventListener('keydown', this.handleKeydown);
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
      this.selectedTools.clear();
      this.optimizationOpportunities = [];
      this.elements = null;
      this.isRendered = false;
      
      console.log('🗑️ MarketingToolsStep уничтожен');
      
    } catch (error) {
      console.error('MarketingToolsStep: Ошибка уничтожения:', error);
    }
  }
}

// Экспорт для использования в других модулях
if (typeof window !== 'undefined') {
  window.MarketingToolsStep = MarketingToolsStep;
}

export default MarketingToolsStep; 