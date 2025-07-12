/**
 * Конфигурация CookieBanner
 * @module CookieBannerConfig
 */

/**
 * Конфигурация по умолчанию
 */
export const DEFAULT_CONFIG = {
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
 * Валидация конфигурации
 * @param {Object} config - Конфигурация для валидации
 * @returns {Object} Валидированная конфигурация
 */
export function validateConfig(config) {
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
 * Проверка поддержки браузера
 * @returns {boolean} Поддерживается ли браузер
 */
export function isBrowserSupported() {
  return typeof window !== 'undefined' && 
         typeof document !== 'undefined' && 
         typeof localStorage !== 'undefined';
}

/**
 * Проверка Do Not Track
 * @returns {boolean} Включен ли DNT
 */
export function isDNTEnabled() {
  return navigator.doNotTrack === '1' || 
         window.doNotTrack === '1' || 
         document.cookie.includes('DNT=1');
}

/**
 * Загрузка сохраненных предпочтений
 * @param {string} storageKey - Ключ для хранения
 * @returns {Object} Предпочтения
 */
export function loadPreferences(storageKey) {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Ошибка загрузки предпочтений, используем значения по умолчанию');
  }
  
  return {
    essential: true,
    analytics: false,
    timestamp: null
  };
}

/**
 * Сохранение предпочтений
 * @param {Object} preferences - Предпочтения для сохранения
 * @param {string} storageKey - Ключ для хранения
 */
export function savePreferences(preferences, storageKey) {
  try {
    const dataToSave = {
      ...preferences,
      timestamp: Date.now()
    };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('Ошибка сохранения предпочтений:', error);
    return false;
  }
} 