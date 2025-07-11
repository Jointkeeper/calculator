/**
 * GDPR-Compliant Cookie Banner Component
 * Обеспечивает explicit consent для analytics cookies согласно GDPR Article 7
 * 
 * @class CookieBanner
 * @author Steamphony Digital Agency
 * @version 3.0.0 - Modular architecture
 */

import { getStyles, applyStyles, addHoverEffects } from './CookieBanner/styles.js';
import { getTexts } from './CookieBanner/texts.js';
import { DEFAULT_CONFIG, validateConfig, isBrowserSupported, isDNTEnabled, loadPreferences, savePreferences } from './CookieBanner/CookieBannerConfig.js';
import { CookieBannerHandlers } from './CookieBanner/CookieBannerHandlers.js';

/**
 * GDPR-Compliant Cookie Banner
 */
class CookieBanner {
  constructor(analyticsService, config = {}) {
    if (!analyticsService) {
      throw new Error('CookieBanner: analyticsService обязателен');
    }

    this.analytics = analyticsService;
    this.config = validateConfig({ ...DEFAULT_CONFIG, ...config });
    this.texts = getTexts(this.config.language);
    
    this.isVisible = false;
    this.isModalVisible = false;
    this.element = null;
    this.modalElement = null;
    this.preferences = null;
    
    this.handlers = new CookieBannerHandlers(this);
    
    this.boundHandlers = {
      handleAcceptAll: this.handlers.handleAcceptAll.bind(this.handlers),
      handleDeclineOptional: this.handlers.handleDeclineOptional.bind(this.handlers),
      handleCustomizeSettings: this.handlers.handleCustomizeSettings.bind(this.handlers),
      handleModalClose: this.handlers.handleModalClose.bind(this.handlers),
      handleSaveSettings: this.handlers.handleSaveSettings.bind(this.handlers),
      handleKeydown: this.handlers.handleKeydown.bind(this.handlers),
      handleResize: this.handlers.handleResize.bind(this.handlers)
    };
    
    this.init();
  }

  /**
   * Инициализация компонента
   */
  async init() {
    try {
      this.log('Инициализация CookieBanner...');
      
      if (!isBrowserSupported()) {
        throw new Error('Browser не поддерживает необходимые API');
      }
      
      this.preferences = loadPreferences(this.config.storageKey);
      
      if (this.config.respectDNT && isDNTEnabled()) {
        this.log('Do Not Track обнаружен, отказываемся от отслеживания');
        await this.handlers.handleDeclineOptional(false);
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
   * Настройка глобальных обработчиков
   */
  setupGlobalHandlers() {
    window.addEventListener('keydown', this.boundHandlers.handleKeydown);
    window.addEventListener('resize', this.boundHandlers.handleResize);
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
          this.element = null;
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
    const styles = getStyles(this.config);
    const bannerHTML = `
      <div class="cookie-banner" style="${styles.banner}">
        <div class="cookie-content" style="${styles.content}">
          <div class="cookie-text" style="${styles.text}">
            ${this.texts.message}
          </div>
          <div class="cookie-buttons" style="${styles.buttons}">
            <button class="cookie-btn decline" style="${styles.declineBtn}">
              ${this.texts.decline}
            </button>
            <button class="cookie-btn customize" style="${styles.customizeBtn}">
              ${this.texts.customize}
            </button>
            <button class="cookie-btn accept" style="${styles.acceptBtn}">
              ${this.texts.accept}
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', bannerHTML);
    this.element = document.querySelector('.cookie-banner');
    
    applyStyles(this.element, styles);
    addHoverEffects(this.element);
  }

  /**
   * Применение стилей к дочерним элементам
   */
  applyChildStyles() {
    if (!this.element) return;
    
    const theme = this.getCurrentTheme();
    const styles = getStyles({ ...this.config, theme });
    applyStyles(this.element, styles);
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
   * Привязка обработчиков событий
   */
  attachEventListeners() {
    if (!this.element) return;
    
    this.element.querySelector('.accept').addEventListener('click', this.boundHandlers.handleAcceptAll);
    this.element.querySelector('.decline').addEventListener('click', this.boundHandlers.handleDeclineOptional);
    this.element.querySelector('.customize').addEventListener('click', this.boundHandlers.handleCustomizeSettings);
  }

  /**
   * Показ модального окна настроек
   */
  async showSettingsModal() {
    if (this.isModalVisible) return;
    
    try {
      this.createSettingsModal();
      this.applyModalStyles();
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
    const modalHTML = `
      <div class="cookie-modal-overlay">
        <div class="cookie-modal" style="${getStyles(this.config).modal}">
          <div class="modal-header">
            <h3>${this.texts.settingsTitle}</h3>
            <button class="modal-close">&times;</button>
          </div>
          <form class="modal-form">
            <div class="setting-group">
              <label class="setting-label">
                <input type="checkbox" name="analytics" ${this.preferences.analytics ? 'checked' : ''}>
                ${this.texts.analyticsLabel}
              </label>
              <p class="setting-description">${this.texts.analyticsDescription}</p>
            </div>
            <div class="modal-buttons">
              <button type="button" class="modal-cancel">${this.texts.cancel}</button>
              <button type="submit" class="modal-save">${this.texts.save}</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modalElement = document.querySelector('.cookie-modal-overlay');
  }

  /**
   * Применение стилей модального окна
   */
  applyModalStyles() {
    if (!this.modalElement) return;
    
    const styles = getStyles(this.config);
    applyStyles(this.modalElement, styles.modalOverlay);
    applyStyles(this.modalElement.querySelector('.cookie-modal'), styles.modal);
  }

  /**
   * Привязка обработчиков событий модального окна
   */
  attachModalEventListeners() {
    if (!this.modalElement) return;
    
    this.modalElement.querySelector('.modal-close').addEventListener('click', this.boundHandlers.handleModalClose);
    this.modalElement.querySelector('.modal-cancel').addEventListener('click', this.boundHandlers.handleModalClose);
    this.modalElement.querySelector('.modal-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.boundHandlers.handleSaveSettings();
    });
  }

  /**
   * Сохранение предпочтений
   * @param {Object} preferences - Предпочтения для сохранения
   */
  async savePreferences(preferences) {
    const success = savePreferences(preferences, this.config.storageKey);
    if (success) {
      this.preferences = { ...preferences, timestamp: Date.now() };
      this.log('Предпочтения сохранены:', preferences);
    }
    return success;
  }

  /**
   * Получение текущих предпочтений
   * @returns {Object} Текущие предпочтения
   */
  getPreferences() {
    return { ...this.preferences };
  }

  /**
   * Сброс согласия
   */
  async resetConsent() {
    try {
      localStorage.removeItem(this.config.storageKey);
      this.preferences = {
        essential: true,
        analytics: false,
        timestamp: null
      };
      
      await this.analytics.setCookieConsent(false);
      
      this.log('Согласие сброшено');
      this.dispatchEvent('consentReset');
      
    } catch (error) {
      this.handleError('RESET_ERROR', error);
    }
  }

  /**
   * Обновление конфигурации
   * @param {Object} newConfig - Новая конфигурация
   */
  updateConfig(newConfig) {
    this.config = validateConfig({ ...this.config, ...newConfig });
    this.texts = getTexts(this.config.language);
    this.log('Конфигурация обновлена:', this.config);
  }

  /**
   * Обработка ошибок
   * @param {string} errorCode - Код ошибки
   * @param {Error} error - Объект ошибки
   */
  handleError(errorCode, error) {
    console.error(`CookieBanner Error [${errorCode}]:`, error);
    this.dispatchEvent('error', { code: errorCode, message: error.message });
  }

  /**
   * Отправка события
   * @param {string} eventName - Название события
   * @param {Object} detail - Детали события
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(`cookieBanner:${eventName}`, {
      detail: {
        timestamp: Date.now(),
        ...detail
      }
    });
    
    document.dispatchEvent(event);
  }

  /**
   * Логирование
   * @param {string} message - Сообщение
   * @param {*} data - Данные
   */
  log(message, data = null) {
    if (this.config.debugMode) {
      console.log(`[CookieBanner] ${message}`, data || '');
    }
  }

  /**
   * Уничтожение компонента
   */
  destroy() {
    try {
      // Удаление обработчиков
      window.removeEventListener('keydown', this.boundHandlers.handleKeydown);
      window.removeEventListener('resize', this.boundHandlers.handleResize);
      
      // Удаление элементов
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      
      if (this.modalElement && this.modalElement.parentNode) {
        this.modalElement.parentNode.removeChild(this.modalElement);
      }
      
      this.element = null;
      this.modalElement = null;
      this.isVisible = false;
      this.isModalVisible = false;
      
      this.log('CookieBanner уничтожен');
      
    } catch (error) {
      console.error('Ошибка при уничтожении CookieBanner:', error);
    }
  }
}

export default CookieBanner; 