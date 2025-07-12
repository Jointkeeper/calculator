/**
 * Обработчики событий CookieBanner
 * @module CookieBannerHandlers
 */

/**
 * Класс обработчиков событий CookieBanner
 */
export class CookieBannerHandlers {
  constructor(banner) {
    this.banner = banner;
  }

  /**
   * Обработка принятия всех cookies
   */
  async handleAcceptAll() {
    try {
      this.banner.log('Приняты все cookies');
      
      await this.banner.savePreferences({
        essential: true,
        analytics: true
      });
      
      await this.banner.analytics.setCookieConsent(true);
      await this.banner.hide();
      
      this.banner.dispatchEvent('cookiesAccepted', { all: true });
      
    } catch (error) {
      this.banner.handleError('ACCEPT_ALL_ERROR', error);
    }
  }

  /**
   * Обработка отказа от опциональных cookies
   * @param {boolean} showBanner - Показывать ли banner
   */
  async handleDeclineOptional(showBanner = true) {
    try {
      this.banner.log('Отказано от опциональных cookies');
      
      await this.banner.savePreferences({
        essential: true,
        analytics: false
      });
      
      await this.banner.analytics.setCookieConsent(false);
      
      if (showBanner) {
        await this.banner.hide();
      }
      
      this.banner.dispatchEvent('cookiesDeclined', { essential: true, analytics: false });
      
    } catch (error) {
      this.banner.handleError('DECLINE_ERROR', error);
    }
  }

  /**
   * Обработка настройки cookies
   */
  async handleCustomizeSettings() {
    try {
      this.banner.log('Открытие настроек cookies');
      await this.banner.showSettingsModal();
      
    } catch (error) {
      this.banner.handleError('CUSTOMIZE_ERROR', error);
    }
  }

  /**
   * Обработка закрытия модального окна
   */
  async handleModalClose() {
    try {
      if (this.banner.modalElement) {
        this.banner.modalElement.classList.remove('visible');
        setTimeout(() => {
          if (this.banner.modalElement && this.banner.modalElement.parentNode) {
            this.banner.modalElement.parentNode.removeChild(this.banner.modalElement);
            this.banner.modalElement = null;
          }
        }, 300);
        
        this.banner.isModalVisible = false;
        this.banner.log('Модальное окно настроек закрыто');
      }
      
    } catch (error) {
      this.banner.handleError('MODAL_CLOSE_ERROR', error);
    }
  }

  /**
   * Обработка сохранения настроек
   */
  async handleSaveSettings() {
    try {
      const form = this.banner.modalElement?.querySelector('form');
      if (!form) return;
      
      const formData = new FormData(form);
      const preferences = {
        essential: true, // Essential cookies всегда включены
        analytics: formData.get('analytics') === 'on'
      };
      
      this.banner.log('Сохранение настроек cookies:', preferences);
      
      await this.banner.savePreferences(preferences);
      await this.banner.analytics.setCookieConsent(preferences.analytics);
      
      await this.handleModalClose();
      await this.banner.hide();
      
      this.banner.dispatchEvent('settingsSaved', preferences);
      
    } catch (error) {
      this.banner.handleError('SAVE_SETTINGS_ERROR', error);
    }
  }

  /**
   * Обработка нажатия клавиш
   * @param {KeyboardEvent} event - Событие клавиатуры
   */
  handleKeydown(event) {
    // ESC для закрытия модального окна
    if (event.key === 'Escape' && this.banner.isModalVisible) {
      this.handleModalClose();
    }
  }

  /**
   * Обработка изменения размера окна
   */
  handleResize() {
    if (this.banner.element) {
      // Пересчет позиции при изменении размера окна
      this.banner.applyChildStyles();
    }
  }
} 