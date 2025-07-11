/**
 * GDPR-Compliant Cookie Banner Component
 * Обеспечивает explicit consent для analytics cookies согласно GDPR Article 7
 * 
 * @class CookieBanner
 * @author Steamphony Digital Agency
 * @version 1.0.0
 */

/**
 * Design tokens для consistent styling
 * @private
 */
const DESIGN_TOKENS = {
  colors: {
    background: '#ffffff',
    backgroundDark: '#1a202c',
    text: '#2d3748',
    textLight: '#4a5568',
    textDark: '#e2e8f0',
    primary: '#3182ce',      // Accept button
    primaryHover: '#2c5aa0',
    secondary: '#e2e8f0',    // Decline button
    secondaryHover: '#cbd5e0',
    accent: '#805ad5',       // Customize button
    accentHover: '#6b46c1',
    border: '#e2e8f0',
    overlay: 'rgba(0, 0, 0, 0.5)',
    success: '#38a169',
    warning: '#d69e2e'
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: '8px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  zIndex: {
    banner: 9999,
    modal: 10000
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

/**
 * Конфигурация по умолчанию
 * @private
 */
const DEFAULT_CONFIG = {
  position: 'bottom', // bottom, top
  theme: 'light', // light, dark, auto
  language: 'ru',
  showOnLoad: true,
  autoShow: true,
  respectDNT: true, // Respect Do Not Track header
  cookieExpiry: 365, // days
  storageKey: 'steamphony_cookie_preferences',
      privacyPolicyUrl: 'https://steamphony.com/privacy-policy',
  contactEmail: 'privacy@steamphony.com',
  companyName: 'Steamphony Digital Agency'
};

/**
 * Текстовые ресурсы для локализации
 * @private
 */
const TEXTS = {
  ru: {
    title: 'Мы используем cookies',
    description: 'Мы используем cookies для улучшения вашего опыта использования калькулятора и анализа его эффективности. Ваша конфиденциальность важна для нас.',
    essential: 'Только необходимые',
    acceptAll: 'Принять все',
    customize: 'Настроить',
    saveSettings: 'Сохранить настройки',
    close: 'Закрыть',
    // Категории cookies
    essentialTitle: 'Необходимые cookies',
    essentialDesc: 'Обеспечивают базовую функциональность сайта. Всегда активны.',
    analyticsTitle: 'Аналитические cookies',
    analyticsDesc: 'Помогают нам понять, как вы используете калькулятор, для улучшения сервиса.',
    // Дополнительные тексты
    privacyPolicy: 'Политика конфиденциальности',
    learnMore: 'Узнать больше',
    yourChoice: 'Ваш выбор',
    alwaysActive: 'Всегда активно',
    // Accessibility
    bannerAriaLabel: 'Уведомление о cookies',
    closeModalLabel: 'Закрыть настройки cookies',
    toggleLabel: 'Переключить согласие на аналитические cookies'
  }
};

/**
 * GDPR-Compliant Cookie Banner
 * Обеспечивает explicit consent с полной accessibility поддержкой
 */
class CookieBanner {
  /**
   * Создает экземпляр CookieBanner
   * 
   * @param {Object} analyticsService - Экземпляр Analytics service
   * @param {Object} config - Конфигурация banner
   */
  constructor(analyticsService, config = {}) {
    // Проверка обязательных параметров
    if (!analyticsService) {
      throw new Error('CookieBanner: analyticsService обязателен');
    }

    // Основные свойства
    this.analytics = analyticsService;
    this.config = this.validateConfig({ ...DEFAULT_CONFIG, ...config });
    this.texts = TEXTS[this.config.language] || TEXTS.ru;
    
    // Состояние компонента
    this.isVisible = false;
    this.isModalVisible = false;
    this.element = null;
    this.modalElement = null;
    this.preferences = null;
    
    // Обработчики событий
    this.boundHandlers = {
      handleAcceptAll: this.handleAcceptAll.bind(this),
      handleDeclineOptional: this.handleDeclineOptional.bind(this),
      handleCustomizeSettings: this.handleCustomizeSettings.bind(this),
      handleModalClose: this.handleModalClose.bind(this),
      handleSaveSettings: this.handleSaveSettings.bind(this),
      handleKeydown: this.handleKeydown.bind(this),
      handleResize: this.handleResize.bind(this)
    };
    
    // Инициализация
    this.init();
  }

  /**
   * Валидация конфигурации
   * @private
   * @param {Object} config - Конфигурация для валидации
   * @returns {Object} Валидированная конфигурация
   */
  validateConfig(config) {
    const validated = { ...config };
    
    // Валидация позиции
    if (!['top', 'bottom'].includes(validated.position)) {
      validated.position = 'bottom';
    }
    
    // Валидация темы
    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      validated.theme = 'light';
    }
    
    // Валидация языка
    if (!TEXTS[validated.language]) {
      validated.language = 'ru';
    }
    
    // Валидация числовых значений
    if (typeof validated.cookieExpiry !== 'number' || validated.cookieExpiry < 1) {
      validated.cookieExpiry = 365;
    }
    
    return validated;
  }

  /**
   * Инициализация компонента
   * @private
   */
  async init() {
    try {
      this.log('Инициализация CookieBanner...');
      
      // Проверка browser support
      if (!this.isBrowserSupported()) {
        throw new Error('Browser не поддерживает необходимые API');
      }
      
      // Загрузка сохраненных предпочтений
      await this.loadPreferences();
      
      // Проверка Do Not Track
      if (this.config.respectDNT && this.isDNTEnabled()) {
        this.log('Do Not Track обнаружен, отказываемся от отслеживания');
        await this.handleDeclineOptional(false); // Без показа banner
        return;
      }
      
      // Настройка глобальных обработчиков
      this.setupGlobalHandlers();
      
      // Автоматический показ если нужно
      if (this.config.autoShow && this.shouldShow()) {
        await this.show();
      }
      
      this.log('CookieBanner инициализирован успешно');
      
      // Отправка события готовности
      this.dispatchEvent('cookieBannerReady', {
        shouldShow: this.shouldShow(),
        hasPreferences: !!this.preferences
      });
      
    } catch (error) {
      console.error('Ошибка инициализации CookieBanner:', error);
      this.handleError('INIT_ERROR', error);
    }
  }

  /**
   * Проверка поддержки браузера
   * @private
   * @returns {boolean}
   */
  isBrowserSupported() {
    return (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined' &&
      typeof localStorage !== 'undefined' &&
      'querySelector' in document &&
      'addEventListener' in window
    );
  }

  /**
   * Проверка Do Not Track
   * @private
   * @returns {boolean}
   */
  isDNTEnabled() {
    return (
      navigator.doNotTrack === '1' ||
      window.doNotTrack === '1' ||
      navigator.msDoNotTrack === '1'
    );
  }

  /**
   * Настройка глобальных обработчиков
   * @private
   */
  setupGlobalHandlers() {
    // Keyboard navigation
    document.addEventListener('keydown', this.boundHandlers.handleKeydown);
    
    // Responsive handling
    window.addEventListener('resize', this.boundHandlers.handleResize);
    
    // Theme detection
    if (this.config.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        this.updateTheme(e.matches ? 'dark' : 'light');
      });
    }
  }

  /**
   * Загрузка сохраненных предпочтений
   * @private
   * @returns {Promise<void>}
   */
  async loadPreferences() {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      
      if (stored) {
        this.preferences = JSON.parse(stored);
        this.log('Загружены сохраненные предпочтения:', this.preferences);
        
        // Применение предпочтений к analytics
        if (this.preferences.analytics !== undefined) {
          await this.analytics.setCookieConsent(this.preferences.analytics);
        }
      }
      
    } catch (error) {
      console.error('Ошибка загрузки предпочтений:', error);
      this.preferences = null;
    }
  }

  /**
   * Проверка нужно ли показывать banner
   * @public
   * @returns {boolean}
   */
  shouldShow() {
    // Не показывать если уже есть сохраненные предпочтения
    if (this.preferences && this.preferences.timestamp) {
      const daysSinceConsent = (Date.now() - this.preferences.timestamp) / (1000 * 60 * 60 * 24);
      
      // Показать снова если прошло больше срока действия cookies
      if (daysSinceConsent > this.config.cookieExpiry) {
        this.log('Согласие истекло, показываем banner снова');
        return true;
      }
      
      return false;
    }
    
    return true;
  }

  /**
   * Отображение banner с анимацией
   * @public
   * @returns {Promise<void>}
   */
  async show() {
    if (this.isVisible) {
      return;
    }
    
    try {
      this.log('Показ cookie banner...');
      
      // Создание DOM элемента если нужно
      if (!this.element) {
        this.render();
      }
      
      // Добавление в DOM
      document.body.appendChild(this.element);
      
      // Форсированный reflow для анимации
      this.element.offsetHeight;
      
      // Показ с анимацией
      this.element.classList.add('cookie-banner--visible');
      this.isVisible = true;
      
      // Focus management для accessibility
      this.setInitialFocus();
      
      // Отправка события
      this.dispatchEvent('cookieBannerShown');
      
      this.log('Cookie banner показан');
      
    } catch (error) {
      console.error('Ошибка показа banner:', error);
      this.handleError('SHOW_ERROR', error);
    }
  }

  /**
   * Скрытие banner с анимацией
   * @public
   * @returns {Promise<void>}
   */
  async hide() {
    if (!this.isVisible) {
      return;
    }
    
    try {
      this.log('Скрытие cookie banner...');
      
      // Анимация скрытия
      this.element.classList.remove('cookie-banner--visible');
      
      // Ожидание завершения анимации
      await new Promise(resolve => {
        setTimeout(resolve, 300);
      });
      
      // Удаление из DOM
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      
      this.isVisible = false;
      
      // Отправка события
      this.dispatchEvent('cookieBannerHidden');
      
      this.log('Cookie banner скрыт');
      
    } catch (error) {
      console.error('Ошибка скрытия banner:', error);
    }
  }

  /**
   * Создание DOM структуры banner
   * @private
   */
  render() {
    // Создание основного контейнера
    this.element = document.createElement('div');
    this.element.className = 'cookie-banner';
    this.element.setAttribute('role', 'banner');
    this.element.setAttribute('aria-label', this.texts.bannerAriaLabel);
    this.element.setAttribute('aria-live', 'polite');
    
    // Применение стилей
    this.applyStyles(this.element, this.getStyles().banner);
    
    // Создание внутренней структуры
    this.element.innerHTML = `
      <div class="cookie-banner__content">
        <div class="cookie-banner__text">
          <h3 class="cookie-banner__title">${this.texts.title}</h3>
          <p class="cookie-banner__description">${this.texts.description}</p>
          <p class="cookie-banner__links">
            <a href="${this.config.privacyPolicyUrl}" target="_blank" rel="noopener noreferrer" class="cookie-banner__link">
              ${this.texts.privacyPolicy}
            </a>
          </p>
        </div>
        <div class="cookie-banner__actions">
          <button type="button" class="cookie-banner__btn cookie-banner__btn--decline" data-action="decline">
            ${this.texts.essential}
          </button>
          <button type="button" class="cookie-banner__btn cookie-banner__btn--customize" data-action="customize">
            ${this.texts.customize}
          </button>
          <button type="button" class="cookie-banner__btn cookie-banner__btn--accept" data-action="accept">
            ${this.texts.acceptAll}
          </button>
        </div>
      </div>
    `;
    
    // Применение стилей к дочерним элементам
    this.applyChildStyles();
    
    // Подключение обработчиков событий
    this.attachEventListeners();
  }

  /**
   * Применение стилей к дочерним элементам
   * @private
   */
  applyChildStyles() {
    const styles = this.getStyles();
    
    // Content wrapper
    const content = this.element.querySelector('.cookie-banner__content');
    this.applyStyles(content, styles.content);
    
    // Text section
    const textSection = this.element.querySelector('.cookie-banner__text');
    this.applyStyles(textSection, styles.textSection);
    
    // Title
    const title = this.element.querySelector('.cookie-banner__title');
    this.applyStyles(title, styles.title);
    
    // Description
    const description = this.element.querySelector('.cookie-banner__description');
    this.applyStyles(description, styles.description);
    
    // Links section
    const links = this.element.querySelector('.cookie-banner__links');
    this.applyStyles(links, styles.links);
    
    // Privacy policy link
    const link = this.element.querySelector('.cookie-banner__link');
    this.applyStyles(link, styles.link);
    
    // Actions section
    const actions = this.element.querySelector('.cookie-banner__actions');
    this.applyStyles(actions, styles.actions);
    
    // Buttons
    const buttons = this.element.querySelectorAll('.cookie-banner__btn');
    buttons.forEach((btn, index) => {
      if (btn.dataset.action === 'accept') {
        this.applyStyles(btn, { ...styles.button, ...styles.buttonAccept });
      } else if (btn.dataset.action === 'decline') {
        this.applyStyles(btn, { ...styles.button, ...styles.buttonDecline });
      } else {
        this.applyStyles(btn, { ...styles.button, ...styles.buttonCustomize });
      }
      
      // Hover effects
      this.addHoverEffects(btn);
    });
  }

  /**
   * Добавление hover эффектов для кнопок
   * @private
   * @param {HTMLElement} button - Кнопка
   */
  addHoverEffects(button) {
    const action = button.dataset.action;
    const styles = this.getStyles();
    
    button.addEventListener('mouseenter', () => {
      if (action === 'accept') {
        Object.assign(button.style, styles.buttonAcceptHover);
      } else if (action === 'decline') {
        Object.assign(button.style, styles.buttonDeclineHover);
      } else {
        Object.assign(button.style, styles.buttonCustomizeHover);
      }
    });
    
    button.addEventListener('mouseleave', () => {
      if (action === 'accept') {
        Object.assign(button.style, { ...styles.button, ...styles.buttonAccept });
      } else if (action === 'decline') {
        Object.assign(button.style, { ...styles.button, ...styles.buttonDecline });
      } else {
        Object.assign(button.style, { ...styles.button, ...styles.buttonCustomize });
      }
    });
    
    // Focus effects для accessibility
    button.addEventListener('focus', () => {
      button.style.outline = `2px solid ${DESIGN_TOKENS.colors.primary}`;
      button.style.outlineOffset = '2px';
    });
    
    button.addEventListener('blur', () => {
      button.style.outline = 'none';
      button.style.outlineOffset = '0';
    });
  }

  /**
   * Получение стилей компонента
   * @private
   * @returns {Object} Объект со стилями
   */
  getStyles() {
    const isDark = this.getCurrentTheme() === 'dark';
    const tokens = DESIGN_TOKENS;
    
    return {
      banner: {
        position: 'fixed',
        [this.config.position]: '0',
        left: '0',
        right: '0',
        backgroundColor: isDark ? tokens.colors.backgroundDark : tokens.colors.background,
        color: isDark ? tokens.colors.textDark : tokens.colors.text,
        boxShadow: this.config.position === 'bottom' ? 
          '0 -4px 20px rgba(0, 0, 0, 0.1)' : 
          '0 4px 20px rgba(0, 0, 0, 0.1)',
        zIndex: tokens.zIndex.banner.toString(),
        transform: this.config.position === 'bottom' ? 
          'translateY(100%)' : 
          'translateY(-100%)',
        transition: `transform ${tokens.transitions.normal}`,
        borderTop: this.config.position === 'bottom' ? 
          `1px solid ${tokens.colors.border}` : 'none',
        borderBottom: this.config.position === 'top' ? 
          `1px solid ${tokens.colors.border}` : 'none'
      },
      
      content: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${tokens.spacing.lg} ${tokens.spacing.md}`,
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing.lg,
        '@media (min-width: 768px)': {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }
      },
      
      textSection: {
        flex: '1',
        marginRight: tokens.spacing.lg
      },
      
      title: {
        fontSize: '1.25rem',
        fontWeight: '600',
        margin: '0 0 8px 0',
        color: isDark ? tokens.colors.textDark : tokens.colors.text
      },
      
      description: {
        fontSize: '0.95rem',
        lineHeight: '1.5',
        margin: '0 0 8px 0',
        color: isDark ? tokens.colors.textDark : tokens.colors.textLight
      },
      
      links: {
        margin: '0'
      },
      
      link: {
        color: tokens.colors.primary,
        textDecoration: 'underline',
        fontSize: '0.875rem',
        cursor: 'pointer'
      },
      
      actions: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing.sm,
        '@media (min-width: 480px)': {
          flexDirection: 'row'
        }
      },
      
      button: {
        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
        border: 'none',
        borderRadius: tokens.borderRadius,
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: `all ${tokens.transitions.fast}`,
        minWidth: '120px',
        outline: 'none'
      },
      
      buttonAccept: {
        backgroundColor: tokens.colors.primary,
        color: 'white'
      },
      
      buttonAcceptHover: {
        backgroundColor: tokens.colors.primaryHover,
        transform: 'translateY(-1px)'
      },
      
      buttonDecline: {
        backgroundColor: tokens.colors.secondary,
        color: tokens.colors.text
      },
      
      buttonDeclineHover: {
        backgroundColor: tokens.colors.secondaryHover,
        transform: 'translateY(-1px)'
      },
      
      buttonCustomize: {
        backgroundColor: 'transparent',
        color: tokens.colors.accent,
        border: `1px solid ${tokens.colors.accent}`
      },
      
      buttonCustomizeHover: {
        backgroundColor: tokens.colors.accent,
        color: 'white',
        transform: 'translateY(-1px)'
      }
    };
  }

  /**
   * Применение стилей к элементу (CSS-in-JS)
   * @private
   * @param {HTMLElement} element - Элемент
   * @param {Object} styles - Стили для применения
   */
  applyStyles(element, styles) {
    if (!element || !styles) return;
    
    Object.keys(styles).forEach(property => {
      if (property.startsWith('@media')) {
        // Обработка media queries через CSS если нужно
        return;
      }
      
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      element.style.setProperty(cssProperty, styles[property]);
    });
  }

  /**
   * Получение текущей темы
   * @private
   * @returns {string} Текущая тема (light/dark)
   */
  getCurrentTheme() {
    if (this.config.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.config.theme;
  }

  /**
   * Обновление темы
   * @private
   * @param {string} theme - Новая тема
   */
  updateTheme(theme) {
    if (this.element && this.isVisible) {
      this.applyChildStyles(); // Пересоздание стилей с новой темой
    }
  }

  /**
   * Подключение обработчиков событий
   * @private
   */
  attachEventListeners() {
    if (!this.element) return;
    
    // Обработчики кнопок
    const buttons = this.element.querySelectorAll('.cookie-banner__btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const action = button.dataset.action;
        
        switch (action) {
          case 'accept':
            this.boundHandlers.handleAcceptAll();
            break;
          case 'decline':
            this.boundHandlers.handleDeclineOptional();
            break;
          case 'customize':
            this.boundHandlers.handleCustomizeSettings();
            break;
        }
      });
    });
  }

  /**
   * Установка начального фокуса для accessibility
   * @private
   */
  setInitialFocus() {
    if (!this.element) return;
    
    // Фокус на первую кнопку (Decline) для accessibility
    const firstButton = this.element.querySelector('.cookie-banner__btn--decline');
    if (firstButton) {
      setTimeout(() => {
        firstButton.focus();
      }, 100);
    }
  }

  // =============================================================================
  // ОБРАБОТЧИКИ ДЕЙСТВИЙ ПОЛЬЗОВАТЕЛЯ
  // =============================================================================

  /**
   * Обработка "Принять все"
   * @private
   */
  async handleAcceptAll() {
    try {
      this.log('Пользователь принял все cookies');
      
      const preferences = {
        essential: true,
        analytics: true,
        timestamp: Date.now(),
        version: '1.0',
        method: 'accept_all'
      };
      
      // Сохранение предпочтений
      await this.savePreferences(preferences);
      
      // Включение analytics
      await this.analytics.setCookieConsent(true);
      
      // Скрытие banner
      await this.hide();
      
      // Отправка события
      this.dispatchEvent('cookieConsentChanged', {
        preferences,
        action: 'accept_all'
      });
      
    } catch (error) {
      console.error('Ошибка обработки "Принять все":', error);
      this.handleError('ACCEPT_ALL_ERROR', error);
    }
  }

  /**
   * Обработка "Только необходимые"
   * @private
   * @param {boolean} showBanner - Показывать ли banner (по умолчанию true)
   */
  async handleDeclineOptional(showBanner = true) {
    try {
      this.log('Пользователь отклонил опциональные cookies');
      
      const preferences = {
        essential: true,
        analytics: false,
        timestamp: Date.now(),
        version: '1.0',
        method: 'decline_optional'
      };
      
      // Сохранение предпочтений
      await this.savePreferences(preferences);
      
      // Отключение analytics
      await this.analytics.setCookieConsent(false);
      
      // Скрытие banner если нужно
      if (showBanner) {
        await this.hide();
      }
      
      // Отправка события
      this.dispatchEvent('cookieConsentChanged', {
        preferences,
        action: 'decline_optional'
      });
      
    } catch (error) {
      console.error('Ошибка обработки "Только необходимые":', error);
      this.handleError('DECLINE_ERROR', error);
    }
  }

  /**
   * Обработка "Настроить"
   * @private
   */
  async handleCustomizeSettings() {
    try {
      this.log('Открытие настроек cookies');
      
      // Создание модального окна настроек
      await this.showSettingsModal();
      
      // Отправка события
      this.dispatchEvent('cookieSettingsOpened');
      
    } catch (error) {
      console.error('Ошибка открытия настроек:', error);
      this.handleError('CUSTOMIZE_ERROR', error);
    }
  }

  /**
   * Показ модального окна настроек
   * @private
   * @returns {Promise<void>}
   */
  async showSettingsModal() {
    if (this.isModalVisible) {
      return;
    }
    
    // Создание модального окна
    this.createSettingsModal();
    
    // Добавление в DOM
    document.body.appendChild(this.modalElement);
    
    // Анимация появления
    this.modalElement.offsetHeight; // Форсированный reflow
    this.modalElement.classList.add('cookie-modal--visible');
    
    this.isModalVisible = true;
    
    // Focus trap для accessibility
    this.setupModalFocusTrap();
  }

  /**
   * Создание модального окна настроек
   * @private
   */
  createSettingsModal() {
    const currentPrefs = this.preferences || { essential: true, analytics: false };
    
    this.modalElement = document.createElement('div');
    this.modalElement.className = 'cookie-modal';
    this.modalElement.setAttribute('role', 'dialog');
    this.modalElement.setAttribute('aria-labelledby', 'cookie-modal-title');
    this.modalElement.setAttribute('aria-modal', 'true');
    
    this.modalElement.innerHTML = `
      <div class="cookie-modal__overlay" data-action="close"></div>
      <div class="cookie-modal__content">
        <header class="cookie-modal__header">
          <h2 id="cookie-modal-title" class="cookie-modal__title">${this.texts.yourChoice}</h2>
          <button type="button" class="cookie-modal__close" data-action="close" aria-label="${this.texts.closeModalLabel}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </header>
        
        <div class="cookie-modal__body">
          <!-- Essential cookies -->
          <div class="cookie-category">
            <div class="cookie-category__header">
              <h3 class="cookie-category__title">${this.texts.essentialTitle}</h3>
              <div class="cookie-toggle cookie-toggle--disabled">
                <span class="cookie-toggle__label">${this.texts.alwaysActive}</span>
              </div>
            </div>
            <p class="cookie-category__description">${this.texts.essentialDesc}</p>
          </div>
          
          <!-- Analytics cookies -->
          <div class="cookie-category">
            <div class="cookie-category__header">
              <h3 class="cookie-category__title">${this.texts.analyticsTitle}</h3>
              <label class="cookie-toggle">
                <input type="checkbox" 
                       class="cookie-toggle__input" 
                       data-category="analytics"
                       ${currentPrefs.analytics ? 'checked' : ''}
                       aria-label="${this.texts.toggleLabel}">
                <span class="cookie-toggle__slider"></span>
              </label>
            </div>
            <p class="cookie-category__description">${this.texts.analyticsDesc}</p>
          </div>
        </div>
        
        <footer class="cookie-modal__footer">
          <button type="button" class="cookie-modal__btn cookie-modal__btn--secondary" data-action="close">
            ${this.texts.close}
          </button>
          <button type="button" class="cookie-modal__btn cookie-modal__btn--primary" data-action="save">
            ${this.texts.saveSettings}
          </button>
        </footer>
      </div>
    `;
    
    // Применение стилей модального окна
    this.applyModalStyles();
    
    // Подключение обработчиков
    this.attachModalEventListeners();
  }

  /**
   * Применение стилей модального окна
   * @private
   */
  applyModalStyles() {
    const isDark = this.getCurrentTheme() === 'dark';
    const tokens = DESIGN_TOKENS;
    
    const modalStyles = {
      modal: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        zIndex: tokens.zIndex.modal.toString(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: tokens.spacing.md,
        opacity: '0',
        visibility: 'hidden',
        transition: `all ${tokens.transitions.normal}`
      },
      
      overlay: {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: tokens.colors.overlay,
        cursor: 'pointer'
      },
      
      content: {
        position: 'relative',
        backgroundColor: isDark ? tokens.colors.backgroundDark : tokens.colors.background,
        color: isDark ? tokens.colors.textDark : tokens.colors.text,
        borderRadius: tokens.borderRadius,
        boxShadow: tokens.boxShadow,
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        transform: 'translateY(20px) scale(0.95)',
        transition: `transform ${tokens.transitions.normal}`
      }
    };
    
    // Применение базовых стилей
    this.applyStyles(this.modalElement, modalStyles.modal);
    
    const overlay = this.modalElement.querySelector('.cookie-modal__overlay');
    const content = this.modalElement.querySelector('.cookie-modal__content');
    
    this.applyStyles(overlay, modalStyles.overlay);
    this.applyStyles(content, modalStyles.content);
    
    // Детальные стили для элементов модального окна
    this.applyDetailedModalStyles();
  }

  /**
   * Применение детальных стилей модального окна
   * @private
   */
  applyDetailedModalStyles() {
    const isDark = this.getCurrentTheme() === 'dark';
    const tokens = DESIGN_TOKENS;
    
    // Header
    const header = this.modalElement.querySelector('.cookie-modal__header');
    this.applyStyles(header, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: tokens.spacing.lg,
      borderBottom: `1px solid ${tokens.colors.border}`
    });
    
    // Title
    const title = this.modalElement.querySelector('.cookie-modal__title');
    this.applyStyles(title, {
      fontSize: '1.25rem',
      fontWeight: '600',
      margin: '0'
    });
    
    // Close button
    const closeBtn = this.modalElement.querySelector('.cookie-modal__close');
    this.applyStyles(closeBtn, {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: tokens.spacing.xs,
      borderRadius: tokens.borderRadius,
      color: isDark ? tokens.colors.textDark : tokens.colors.textLight
    });
    
    // Body
    const body = this.modalElement.querySelector('.cookie-modal__body');
    this.applyStyles(body, {
      padding: tokens.spacing.lg,
      maxHeight: '400px',
      overflow: 'auto'
    });
    
    // Cookie categories
    const categories = this.modalElement.querySelectorAll('.cookie-category');
    categories.forEach(category => {
      this.applyStyles(category, {
        marginBottom: tokens.spacing.lg,
        padding: tokens.spacing.md,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.borderRadius
      });
      
      const header = category.querySelector('.cookie-category__header');
      this.applyStyles(header, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: tokens.spacing.sm
      });
      
      const title = category.querySelector('.cookie-category__title');
      this.applyStyles(title, {
        fontSize: '1rem',
        fontWeight: '500',
        margin: '0'
      });
      
      const description = category.querySelector('.cookie-category__description');
      this.applyStyles(description, {
        fontSize: '0.875rem',
        color: isDark ? tokens.colors.textDark : tokens.colors.textLight,
        margin: '0',
        lineHeight: '1.5'
      });
    });
    
    // Toggles
    this.styleToggles();
    
    // Footer
    const footer = this.modalElement.querySelector('.cookie-modal__footer');
    this.applyStyles(footer, {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: tokens.spacing.sm,
      padding: tokens.spacing.lg,
      borderTop: `1px solid ${tokens.colors.border}`
    });
    
    // Footer buttons
    const footerButtons = this.modalElement.querySelectorAll('.cookie-modal__btn');
    footerButtons.forEach(btn => {
      const isPrimary = btn.classList.contains('cookie-modal__btn--primary');
      
      this.applyStyles(btn, {
        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
        border: 'none',
        borderRadius: tokens.borderRadius,
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: `all ${tokens.transitions.fast}`,
        backgroundColor: isPrimary ? tokens.colors.primary : tokens.colors.secondary,
        color: isPrimary ? 'white' : tokens.colors.text
      });
      
      // Hover effects
      btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = isPrimary ? 
          tokens.colors.primaryHover : 
          tokens.colors.secondaryHover;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = isPrimary ? 
          tokens.colors.primary : 
          tokens.colors.secondary;
      });
    });
  }

  /**
   * Стилизация переключателей
   * @private
   */
  styleToggles() {
    const tokens = DESIGN_TOKENS;
    
    const toggles = this.modalElement.querySelectorAll('.cookie-toggle');
    toggles.forEach(toggle => {
      const isDisabled = toggle.classList.contains('cookie-toggle--disabled');
      
      this.applyStyles(toggle, {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing.sm
      });
      
      if (isDisabled) {
        const label = toggle.querySelector('.cookie-toggle__label');
        this.applyStyles(label, {
          fontSize: '0.75rem',
          color: tokens.colors.textLight,
          backgroundColor: tokens.colors.secondary,
          padding: `2px ${tokens.spacing.xs}`,
          borderRadius: '4px'
        });
      } else {
        // Styled checkbox
        const input = toggle.querySelector('.cookie-toggle__input');
        const slider = toggle.querySelector('.cookie-toggle__slider');
        
        this.applyStyles(input, {
          position: 'absolute',
          opacity: '0',
          cursor: 'pointer'
        });
        
        this.applyStyles(slider, {
          position: 'relative',
          display: 'inline-block',
          width: '48px',
          height: '24px',
          backgroundColor: input.checked ? tokens.colors.primary : tokens.colors.secondary,
          borderRadius: '24px',
          transition: `background-color ${tokens.transitions.fast}`,
          cursor: 'pointer'
        });
        
        // Create slider thumb
        slider.innerHTML = '<span class="cookie-toggle__thumb"></span>';
        const thumb = slider.querySelector('.cookie-toggle__thumb');
        
        this.applyStyles(thumb, {
          position: 'absolute',
          top: '2px',
          left: input.checked ? '26px' : '2px',
          width: '20px',
          height: '20px',
          backgroundColor: 'white',
          borderRadius: '50%',
          transition: `left ${tokens.transitions.fast}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
        });
        
        // Toggle functionality
        input.addEventListener('change', () => {
          slider.style.backgroundColor = input.checked ? 
            tokens.colors.primary : 
            tokens.colors.secondary;
          thumb.style.left = input.checked ? '26px' : '2px';
        });
      }
    });
  }

  /**
   * Подключение обработчиков модального окна
   * @private
   */
  attachModalEventListeners() {
    if (!this.modalElement) return;
    
    // Кнопки закрытия
    const closeButtons = this.modalElement.querySelectorAll('[data-action="close"]');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', this.boundHandlers.handleModalClose);
    });
    
    // Кнопка сохранения
    const saveButton = this.modalElement.querySelector('[data-action="save"]');
    if (saveButton) {
      saveButton.addEventListener('click', this.boundHandlers.handleSaveSettings);
    }
  }

  /**
   * Настройка focus trap для модального окна
   * @private
   */
  setupModalFocusTrap() {
    const focusableElements = this.modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    firstElement?.focus();
    
    this.modalElement.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    });
  }

  /**
   * Закрытие модального окна
   * @private
   */
  async handleModalClose() {
    if (!this.isModalVisible) return;
    
    try {
      // Анимация скрытия
      this.modalElement.classList.remove('cookie-modal--visible');
      
      // Ожидание завершения анимации
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Удаление из DOM
      if (this.modalElement && this.modalElement.parentNode) {
        this.modalElement.parentNode.removeChild(this.modalElement);
      }
      
      this.modalElement = null;
      this.isModalVisible = false;
      
      // Возврат фокуса
      const customizeButton = this.element?.querySelector('[data-action="customize"]');
      customizeButton?.focus();
      
      this.dispatchEvent('cookieSettingsClosed');
      
    } catch (error) {
      console.error('Ошибка закрытия модального окна:', error);
    }
  }

  /**
   * Сохранение настроек из модального окна
   * @private
   */
  async handleSaveSettings() {
    try {
      // Получение состояния toggles
      const analyticsToggle = this.modalElement.querySelector('[data-category="analytics"]');
      
      const preferences = {
        essential: true, // Всегда true
        analytics: analyticsToggle ? analyticsToggle.checked : false,
        timestamp: Date.now(),
        version: '1.0',
        method: 'customize'
      };
      
      this.log('Сохранение пользовательских настроек:', preferences);
      
      // Сохранение предпочтений
      await this.savePreferences(preferences);
      
      // Применение к analytics service
      await this.analytics.setCookieConsent(preferences.analytics);
      
      // Закрытие модального окна
      await this.handleModalClose();
      
      // Скрытие banner
      await this.hide();
      
      // Отправка события
      this.dispatchEvent('cookieConsentChanged', {
        preferences,
        action: 'customize'
      });
      
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
      this.handleError('SAVE_SETTINGS_ERROR', error);
    }
  }

  /**
   * Сохранение предпочтений в localStorage
   * @private
   * @param {Object} preferences - Предпочтения для сохранения
   * @returns {Promise<void>}
   */
  async savePreferences(preferences) {
    try {
      // Добавление метаданных
      const dataToSave = {
        ...preferences,
        userAgent: navigator.userAgent.substring(0, 100),
        timestamp: Date.now(),
        version: '1.0'
      };
      
      // Сохранение в localStorage
      localStorage.setItem(this.config.storageKey, JSON.stringify(dataToSave));
      
      // Обновление внутреннего состояния
      this.preferences = dataToSave;
      
      this.log('Предпочтения сохранены:', dataToSave);
      
    } catch (error) {
      console.error('Ошибка сохранения предпочтений:', error);
      throw error;
    }
  }

  // =============================================================================
  // KEYBOARD NAVIGATION
  // =============================================================================

  /**
   * Обработка клавиатурных событий
   * @private
   * @param {KeyboardEvent} event - Событие клавиатуры
   */
  handleKeydown(event) {
    // Escape закрывает модальное окно
    if (event.key === 'Escape') {
      if (this.isModalVisible) {
        this.handleModalClose();
      } else if (this.isVisible) {
        // Можно добавить возможность закрытия banner по Escape
        // this.hide();
      }
    }
  }

  /**
   * Обработка изменения размера окна
   * @private
   */
  handleResize() {
    // Можно добавить адаптивную логику если нужно
  }

  // =============================================================================
  // PUBLIC API
  // =============================================================================

  /**
   * Программное отображение banner
   * @public
   * @returns {Promise<void>}
   */
  async showBanner() {
    return this.show();
  }

  /**
   * Программное скрытие banner
   * @public
   * @returns {Promise<void>}
   */
  async hideBanner() {
    return this.hide();
  }

  /**
   * Получение текущих предпочтений
   * @public
   * @returns {Object|null} Текущие предпочтения
   */
  getPreferences() {
    return this.preferences ? { ...this.preferences } : null;
  }

  /**
   * Сброс согласия (показать banner снова)
   * @public
   * @returns {Promise<void>}
   */
  async resetConsent() {
    try {
      this.log('Сброс согласия...');
      
      // Очистка localStorage
      localStorage.removeItem(this.config.storageKey);
      this.preferences = null;
      
      // Сброс analytics
      await this.analytics.clearAnalyticsData();
      
      // Показ banner
      if (this.shouldShow()) {
        await this.show();
      }
      
      this.dispatchEvent('cookieConsentReset');
      
    } catch (error) {
      console.error('Ошибка сброса согласия:', error);
      this.handleError('RESET_CONSENT_ERROR', error);
    }
  }

  /**
   * Обновление конфигурации
   * @public
   * @param {Object} newConfig - Новая конфигурация
   */
  updateConfig(newConfig) {
    this.config = this.validateConfig({ ...this.config, ...newConfig });
    this.texts = TEXTS[this.config.language] || TEXTS.ru;
    
    // Перерендер если видим
    if (this.isVisible) {
      this.hide().then(() => this.show());
    }
  }

  // =============================================================================
  // UTILITIES
  // =============================================================================

  /**
   * Обработка ошибок
   * @private
   * @param {string} errorCode - Код ошибки
   * @param {Error} error - Объект ошибки
   */
  handleError(errorCode, error) {
    const errorInfo = {
      code: errorCode,
      message: error.message || 'Unknown error',
      timestamp: Date.now(),
      component: 'CookieBanner'
    };
    
    console.error(`CookieBanner Error [${errorCode}]:`, errorInfo);
    
    // Отправка события ошибки
    this.dispatchEvent('cookieBannerError', errorInfo);
  }

  /**
   * Отправка события
   * @private
   * @param {string} eventName - Название события
   * @param {Object} detail - Детали события
   */
  dispatchEvent(eventName, detail = {}) {
    try {
      const event = new CustomEvent(`cookieBanner:${eventName}`, {
        detail,
        bubbles: true,
        cancelable: true
      });
      
      document.dispatchEvent(event);
      
    } catch (error) {
      console.error('Ошибка отправки события:', error);
    }
  }

  /**
   * Логирование с проверкой debug режима
   * @private
   * @param {string} message - Сообщение
   * @param {*} data - Дополнительные данные
   */
  log(message, data = null) {
    if (this.config.debugMode || this.analytics?.config?.debugMode) {
      if (data) {
        console.log(`[CookieBanner] ${message}`, data);
      } else {
        console.log(`[CookieBanner] ${message}`);
      }
    }
  }

  /**
   * Уничтожение компонента
   * @public
   */
  destroy() {
    try {
      this.log('Уничтожение CookieBanner...');
      
      // Удаление обработчиков событий
      document.removeEventListener('keydown', this.boundHandlers.handleKeydown);
      window.removeEventListener('resize', this.boundHandlers.handleResize);
      
      // Скрытие элементов
      if (this.isVisible) {
        this.hide();
      }
      
      if (this.isModalVisible) {
        this.handleModalClose();
      }
      
      // Очистка ссылок
      this.element = null;
      this.modalElement = null;
      this.analytics = null;
      
      this.log('CookieBanner уничтожен');
      
    } catch (error) {
      console.error('Ошибка уничтожения CookieBanner:', error);
    }
  }
}

// CSS для видимости banner и модального окна
const dynamicCSS = `
.cookie-banner--visible {
  transform: translateY(0) !important;
}

.cookie-modal--visible {
  opacity: 1 !important;
  visibility: visible !important;
}

.cookie-modal--visible .cookie-modal__content {
  transform: translateY(0) scale(1) !important;
}

@media (max-width: 768px) {
  .cookie-banner__content {
    flex-direction: column !important;
    gap: 16px !important;
  }
  
  .cookie-banner__actions {
    flex-direction: column !important;
  }
  
  .cookie-modal__content {
    margin: 16px !important;
    max-height: calc(100vh - 32px) !important;
  }
}

@media (max-width: 480px) {
  .cookie-banner__actions {
    gap: 8px !important;
  }
  
  .cookie-banner__btn {
    min-width: auto !important;
  }
}
`;

// Вставка CSS в head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = dynamicCSS;
  document.head.appendChild(styleElement);
}

// Экспорт класса
export default CookieBanner;

// Глобальная доступность для тестирования
if (typeof window !== 'undefined') {
  window.CookieBanner = CookieBanner;
}

// Экспорт конфигурации
export { DEFAULT_CONFIG as CookieBannerConfig, DESIGN_TOKENS }; 