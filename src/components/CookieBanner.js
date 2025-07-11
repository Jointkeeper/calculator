/**
 * GDPR-Compliant Cookie Banner Component
 * Обеспечивает explicit consent для analytics cookies согласно GDPR Article 7
 * 
 * @class CookieBanner
 * @author Steamphony Digital Agency
 * @version 2.0.0 - Modular architecture
 */

import { getStyles, applyStyles, addHoverEffects } from './CookieBanner/styles.js';
import { getTexts } from './CookieBanner/texts.js';

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  position: 'bottom',
  theme: 'light',
  language: 'ru',
  showOnLoad: true,
  autoShow: true,
  respectDNT: true,
  cookieExpiry: 365,
  storageKey: 'steamphony_cookie_preferences',
  privacyPolicyUrl: 'https://steamphony.com/privacy-policy',
  contactEmail: 'privacy@steamphony.com',
  companyName: 'Steamphony Digital Agency'
};

/**
 * GDPR-Compliant Cookie Banner
 */
class CookieBanner {
  constructor(analyticsService, config = {}) {
    if (!analyticsService) {
      throw new Error('CookieBanner: analyticsService обязателен');
    }

    this.analytics = analyticsService;
    this.config = this.validateConfig({ ...DEFAULT_CONFIG, ...config });
    this.texts = getTexts(this.config.language);
    
    this.isVisible = false;
    this.isModalVisible = false;
    this.element = null;
    this.modalElement = null;
    this.preferences = null;
    
    this.boundHandlers = {
      handleAcceptAll: this.handleAcceptAll.bind(this),
      handleDeclineOptional: this.handleDeclineOptional.bind(this),
      handleCustomizeSettings: this.handleCustomizeSettings.bind(this),
      handleModalClose: this.handleModalClose.bind(this),
      handleSaveSettings: this.handleSaveSettings.bind(this),
      handleKeydown: this.handleKeydown.bind(this),
      handleResize: this.handleResize.bind(this)
    };
    
    this.init();
  }

  /**
   * Валидация конфигурации
   */
  validateConfig(config) {
    const validated = { ...config };
    
    if (!['top', 'bottom'].includes(validated.position)) {
      validated.position = 'bottom';
    }
    
    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      validated.theme = 'light';
    }
    
    if (typeof validated.cookieExpiry !== 'number' || validated.cookieExpiry < 1) {
      validated.cookieExpiry = 365;
    }
    
    return validated;
  }

  /**
   * Инициализация компонента
   */
  async init() {
    try {
      this.log('Инициализация CookieBanner...');
      
      if (!this.isBrowserSupported()) {
        throw new Error('Browser не поддерживает необходимые API');
      }
      
      await this.loadPreferences();
      
      if (this.config.respectDNT && this.isDNTEnabled()) {
        this.log('Do Not Track обнаружен, отказываемся от отслеживания');
        await this.handleDeclineOptional(false);
        return;
      }
      
      this.setupGlobalHandlers();
      
      if (this.shouldShow()) {
        await this.show();
      }
      
      this.log('CookieBanner инициализирован');
      
    } catch (error) {
      this.handleError('INIT_ERROR', error);
    }
  }

  /**
   * Проверка поддержки браузера
   */
  isBrowserSupported() {
    return typeof window !== 'undefined' && 
           typeof document !== 'undefined' && 
           typeof localStorage !== 'undefined';
  }

  /**
   * Проверка Do Not Track
   */
  isDNTEnabled() {
    return navigator.doNotTrack === '1' || 
           window.doNotTrack === '1' || 
           document.cookie.includes('DNT=1');
  }

  /**
   * Настройка глобальных обработчиков
   */
  setupGlobalHandlers() {
    window.addEventListener('keydown', this.boundHandlers.handleKeydown);
    window.addEventListener('resize', this.boundHandlers.handleResize);
  }

  /**
   * Загрузка сохраненных предпочтений
   */
  async loadPreferences() {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        this.preferences = JSON.parse(stored);
        this.log('Загружены сохраненные предпочтения:', this.preferences);
      } else {
        this.preferences = {
          essential: true,
          analytics: false,
          timestamp: null
        };
      }
    } catch (error) {
      this.log('Ошибка загрузки предпочтений, используем значения по умолчанию');
      this.preferences = {
        essential: true,
        analytics: false,
        timestamp: null
      };
    }
  }

  /**
   * Проверка необходимости показа banner
   */
  shouldShow() {
    if (!this.config.autoShow) return false;
    if (this.preferences.timestamp) return false;
    return true;
  }

  /**
   * Показ banner
   */
  async show() {
    if (this.isVisible) return;
    
    try {
      this.render();
      this.attachEventListeners();
      
      // Анимация появления
      requestAnimationFrame(() => {
        this.element.classList.add('visible');
        this.isVisible = true;
      });
      
      this.log('CookieBanner показан');
      this.dispatchEvent('bannerShown');
      
    } catch (error) {
      this.handleError('SHOW_ERROR', error);
    }
  }

  /**
   * Скрытие banner
   */
  async hide() {
    if (!this.isVisible) return;
    
    try {
      this.element.classList.remove('visible');
      
      setTimeout(() => {
        if (this.element && this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
        this.isVisible = false;
      }, 300);
      
      this.log('CookieBanner скрыт');
      this.dispatchEvent('bannerHidden');
      
    } catch (error) {
      this.handleError('HIDE_ERROR', error);
    }
  }

  /**
   * Рендеринг banner
   */
  render() {
    const styles = getStyles(this.getCurrentTheme());
    
    this.element = document.createElement('div');
    this.element.id = 'steamphony-cookie-banner';
    this.element.className = 'steamphony-cookie-banner';
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-label', this.texts.bannerAriaLabel);
    
    this.element.innerHTML = `
      <div class="container">
        <div class="content">
          <h3 class="title">${this.texts.title}</h3>
          <p class="description">${this.texts.description}</p>
        </div>
        <div class="buttons">
          <button type="button" class="btn btn-secondary" data-action="decline">
            ${this.texts.essential}
          </button>
          <button type="button" class="btn btn-accent" data-action="customize">
            ${this.texts.customize}
          </button>
          <button type="button" class="btn btn-primary" data-action="accept">
            ${this.texts.acceptAll}
          </button>
        </div>
      </div>
    `;
    
    applyStyles(this.element, styles.banner);
    this.applyChildStyles();
    
    document.body.appendChild(this.element);
  }

  /**
   * Применение стилей к дочерним элементам
   */
  applyChildStyles() {
    const styles = getStyles(this.getCurrentTheme());
    
    const container = this.element.querySelector('.container');
    const content = this.element.querySelector('.content');
    const title = this.element.querySelector('.title');
    const description = this.element.querySelector('.description');
    const buttons = this.element.querySelector('.buttons');
    
    applyStyles(container, styles.container);
    applyStyles(content, styles.content);
    applyStyles(title, styles.title);
    applyStyles(description, styles.description);
    applyStyles(buttons, styles.buttons);
    
    // Стили для кнопок
    const btnElements = this.element.querySelectorAll('.btn');
    btnElements.forEach((btn, index) => {
      applyStyles(btn, styles.button);
      
      if (btn.classList.contains('btn-primary')) {
        applyStyles(btn, styles.buttonPrimary);
        btn.classList.add('primary');
      } else if (btn.classList.contains('btn-secondary')) {
        applyStyles(btn, styles.buttonSecondary);
        btn.classList.add('secondary');
      } else if (btn.classList.contains('btn-accent')) {
        applyStyles(btn, styles.buttonAccent);
        btn.classList.add('accent');
      }
      
      addHoverEffects(btn);
    });
  }

  /**
   * Получение текущей темы
   */
  getCurrentTheme() {
    if (this.config.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.config.theme;
  }

  /**
   * Прикрепление обработчиков событий
   */
  attachEventListeners() {
    const acceptBtn = this.element.querySelector('[data-action="accept"]');
    const declineBtn = this.element.querySelector('[data-action="decline"]');
    const customizeBtn = this.element.querySelector('[data-action="customize"]');
    
    if (acceptBtn) acceptBtn.addEventListener('click', this.boundHandlers.handleAcceptAll);
    if (declineBtn) declineBtn.addEventListener('click', this.boundHandlers.handleDeclineOptional);
    if (customizeBtn) customizeBtn.addEventListener('click', this.boundHandlers.handleCustomizeSettings);
  }

  /**
   * Обработка принятия всех cookies
   */
  async handleAcceptAll() {
    try {
      this.preferences = {
        essential: true,
        analytics: true,
        timestamp: Date.now()
      };
      
      await this.savePreferences(this.preferences);
      await this.hide();
      
      this.analytics.enableTracking();
      this.log('Все cookies приняты');
      this.dispatchEvent('cookiesAccepted', { analytics: true });
      
    } catch (error) {
      this.handleError('ACCEPT_ERROR', error);
    }
  }

  /**
   * Обработка отказа от опциональных cookies
   */
  async handleDeclineOptional(showBanner = true) {
    try {
      this.preferences = {
        essential: true,
        analytics: false,
        timestamp: Date.now()
      };
      
      await this.savePreferences(this.preferences);
      
      if (showBanner) {
        await this.hide();
      }
      
      this.analytics.disableTracking();
      this.log('От опциональных cookies отказались');
      this.dispatchEvent('cookiesDeclined', { analytics: false });
      
    } catch (error) {
      this.handleError('DECLINE_ERROR', error);
    }
  }

  /**
   * Обработка настройки cookies
   */
  async handleCustomizeSettings() {
    try {
      await this.showSettingsModal();
    } catch (error) {
      this.handleError('CUSTOMIZE_ERROR', error);
    }
  }

  /**
   * Показ модального окна настроек
   */
  async showSettingsModal() {
    if (this.isModalVisible) return;
    
    try {
      this.createSettingsModal();
      this.attachModalEventListeners();
      
      requestAnimationFrame(() => {
        this.modalElement.classList.add('visible');
        this.isModalVisible = true;
      });
      
      this.log('Модальное окно настроек показано');
      
    } catch (error) {
      this.handleError('MODAL_SHOW_ERROR', error);
    }
  }

  /**
   * Создание модального окна настроек
   */
  createSettingsModal() {
    const styles = getStyles(this.getCurrentTheme());
    
    this.modalElement = document.createElement('div');
    this.modalElement.className = 'steamphony-cookie-modal';
    this.modalElement.setAttribute('role', 'dialog');
    this.modalElement.setAttribute('aria-modal', 'true');
    this.modalElement.setAttribute('aria-label', this.texts.bannerAriaLabel);
    
    this.modalElement.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">${this.texts.title}</h2>
          <button type="button" class="close-button" aria-label="${this.texts.closeModalLabel}">
            ×
          </button>
        </div>
        
        <div class="modal-body">
          <div class="category">
            <div class="category-header">
              <div>
                <h3 class="category-title">${this.texts.essentialTitle}</h3>
                <p class="category-description">${this.texts.essentialDesc}</p>
              </div>
              <button type="button" class="toggle" disabled>
                <span class="toggle-thumb"></span>
              </button>
            </div>
          </div>
          
          <div class="category">
            <div class="category-header">
              <div>
                <h3 class="category-title">${this.texts.analyticsTitle}</h3>
                <p class="category-description">${this.texts.analyticsDesc}</p>
              </div>
              <button type="button" class="toggle" data-category="analytics">
                <span class="toggle-thumb"></span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <a href="${this.config.privacyPolicyUrl}" class="link" target="_blank">
            ${this.texts.privacyPolicy}
          </a>
          <button type="button" class="btn btn-primary" data-action="save">
            ${this.texts.saveSettings}
          </button>
        </div>
      </div>
    `;
    
    applyStyles(this.modalElement, styles.modal);
    this.applyModalStyles();
    
    document.body.appendChild(this.modalElement);
  }

  /**
   * Применение стилей к модальному окну
   */
  applyModalStyles() {
    const styles = getStyles(this.getCurrentTheme());
    
    const modalContent = this.modalElement.querySelector('.modal-content');
    const modalHeader = this.modalElement.querySelector('.modal-header');
    const modalTitle = this.modalElement.querySelector('.modal-title');
    const closeButton = this.modalElement.querySelector('.close-button');
    const categories = this.modalElement.querySelectorAll('.category');
    const toggles = this.modalElement.querySelectorAll('.toggle');
    const modalFooter = this.modalElement.querySelector('.modal-footer');
    const saveButton = this.modalElement.querySelector('[data-action="save"]');
    
    applyStyles(modalContent, styles.modalContent);
    applyStyles(modalHeader, styles.modalHeader);
    applyStyles(modalTitle, styles.modalTitle);
    applyStyles(closeButton, styles.closeButton);
    applyStyles(modalFooter, styles.modalFooter);
    
    if (saveButton) {
      applyStyles(saveButton, styles.button);
      applyStyles(saveButton, styles.buttonPrimary);
    }
    
    categories.forEach(category => {
      applyStyles(category, styles.category);
      
      const categoryHeader = category.querySelector('.category-header');
      const categoryTitle = category.querySelector('.category-title');
      const categoryDescription = category.querySelector('.category-description');
      
      applyStyles(categoryHeader, styles.categoryHeader);
      applyStyles(categoryTitle, styles.categoryTitle);
      applyStyles(categoryDescription, styles.categoryDescription);
    });
    
    toggles.forEach(toggle => {
      applyStyles(toggle, styles.toggle);
      
      const thumb = toggle.querySelector('.toggle-thumb');
      applyStyles(thumb, styles.toggleThumb);
      
      if (toggle.dataset.category === 'analytics') {
        if (this.preferences.analytics) {
          toggle.classList.add('active');
          thumb.classList.add('active');
        }
      }
    });
  }

  /**
   * Прикрепление обработчиков событий к модальному окну
   */
  attachModalEventListeners() {
    const closeButton = this.modalElement.querySelector('.close-button');
    const saveButton = this.modalElement.querySelector('[data-action="save"]');
    const analyticsToggle = this.modalElement.querySelector('[data-category="analytics"]');
    
    if (closeButton) closeButton.addEventListener('click', this.boundHandlers.handleModalClose);
    if (saveButton) saveButton.addEventListener('click', this.boundHandlers.handleSaveSettings);
    
    if (analyticsToggle) {
      analyticsToggle.addEventListener('click', () => {
        const isActive = analyticsToggle.classList.contains('active');
        analyticsToggle.classList.toggle('active');
        analyticsToggle.querySelector('.toggle-thumb').classList.toggle('active');
      });
    }
  }

  /**
   * Обработка закрытия модального окна
   */
  async handleModalClose() {
    try {
      this.modalElement.classList.remove('visible');
      
      setTimeout(() => {
        if (this.modalElement && this.modalElement.parentNode) {
          this.modalElement.parentNode.removeChild(this.modalElement);
        }
        this.isModalVisible = false;
      }, 300);
      
      this.log('Модальное окно настроек закрыто');
      
    } catch (error) {
      this.handleError('MODAL_CLOSE_ERROR', error);
    }
  }

  /**
   * Обработка сохранения настроек
   */
  async handleSaveSettings() {
    try {
      const analyticsToggle = this.modalElement.querySelector('[data-category="analytics"]');
      const analyticsEnabled = analyticsToggle.classList.contains('active');
      
      this.preferences = {
        essential: true,
        analytics: analyticsEnabled,
        timestamp: Date.now()
      };
      
      await this.savePreferences(this.preferences);
      await this.handleModalClose();
      await this.hide();
      
      if (analyticsEnabled) {
        this.analytics.enableTracking();
      } else {
        this.analytics.disableTracking();
      }
      
      this.log('Настройки cookies сохранены');
      this.dispatchEvent('cookiesCustomized', { analytics: analyticsEnabled });
      
    } catch (error) {
      this.handleError('SAVE_ERROR', error);
    }
  }

  /**
   * Сохранение предпочтений
   */
  async savePreferences(preferences) {
    try {
      const data = {
        ...preferences,
        version: '1.0',
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
      this.log('Предпочтения сохранены:', data);
      
    } catch (error) {
      this.log('Ошибка сохранения предпочтений:', error);
      throw error;
    }
  }

  /**
   * Обработка нажатий клавиш
   */
  handleKeydown(event) {
    if (event.key === 'Escape') {
      if (this.isModalVisible) {
        this.handleModalClose();
      }
    }
  }

  /**
   * Обработка изменения размера окна
   */
  handleResize() {
    // Пересчет позиций при необходимости
  }

  /**
   * Получение предпочтений
   */
  getPreferences() {
    return { ...this.preferences };
  }

  /**
   * Сброс согласия
   */
  async resetConsent() {
    try {
      this.preferences = {
        essential: true,
        analytics: false,
        timestamp: null
      };
      
      localStorage.removeItem(this.config.storageKey);
      this.analytics.disableTracking();
      
      this.log('Согласие сброшено');
      this.dispatchEvent('consentReset');
      
    } catch (error) {
      this.handleError('RESET_ERROR', error);
    }
  }

  /**
   * Обновление конфигурации
   */
  updateConfig(newConfig) {
    this.config = this.validateConfig({ ...this.config, ...newConfig });
    this.texts = getTexts(this.config.language);
    
    this.log('Конфигурация обновлена:', this.config);
  }

  /**
   * Обработка ошибок
   */
  handleError(errorCode, error) {
    console.error(`CookieBanner Error [${errorCode}]:`, error);
    this.dispatchEvent('error', { code: errorCode, error: error.message });
  }

  /**
   * Отправка событий
   */
  dispatchEvent(eventName, detail = {}) {
    try {
      const event = new CustomEvent(`cookieBanner:${eventName}`, {
        detail: {
          timestamp: Date.now(),
          ...detail
        },
        bubbles: true,
        cancelable: true
      });
      
      document.dispatchEvent(event);
      
    } catch (error) {
      console.error('Ошибка отправки события:', error);
    }
  }

  /**
   * Логирование
   */
  log(message, data = null) {
    if (this.config.debug) {
      console.log(`[CookieBanner] ${message}`, data || '');
    }
  }

  /**
   * Уничтожение компонента
   */
  destroy() {
    try {
      window.removeEventListener('keydown', this.boundHandlers.handleKeydown);
      window.removeEventListener('resize', this.boundHandlers.handleResize);
      
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      
      if (this.modalElement && this.modalElement.parentNode) {
        this.modalElement.parentNode.removeChild(this.modalElement);
      }
      
      this.log('CookieBanner уничтожен');
      
    } catch (error) {
      console.error('Ошибка уничтожения CookieBanner:', error);
    }
  }
}

export default CookieBanner; 