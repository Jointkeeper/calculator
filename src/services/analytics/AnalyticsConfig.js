/**
 * Конфигурация Analytics Service
 * @module AnalyticsConfig
 */

/**
 * Конфигурация по умолчанию
 */
export const DEFAULT_CONFIG = {
  measurementId: 'G-XXXXXXXXXX', // Steamphony GA4 Measurement ID
  cookieDomain: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
  consentStorageKey: 'steamphony_analytics_consent',
  eventQueueLimit: 50,
  debugMode: false,
  autoInitialize: false,
  trackingOptOut: false,
  sessionTimeout: 30 * 60 * 1000, // 30 минут
  anonymizeIP: true,
  dataRetention: 14 // месяцев
};

/**
 * Валидация конфигурации
 * @param {Object} config - Конфигурация для валидации
 * @returns {Object} Валидированная конфигурация
 */
export function validateConfig(config) {
  const validated = { ...config };
  
  // Валидация measurementId
  if (!validated.measurementId || typeof validated.measurementId !== 'string') {
    console.warn('Analytics: Некорректный measurementId, используется fallback');
    validated.measurementId = 'G-XXXXXXXXXX';
  }
  
  // Валидация числовых значений
  if (typeof validated.eventQueueLimit !== 'number' || validated.eventQueueLimit < 1) {
    validated.eventQueueLimit = 50;
  }
  
  if (typeof validated.sessionTimeout !== 'number' || validated.sessionTimeout < 60000) {
    validated.sessionTimeout = 30 * 60 * 1000;
  }
  
  if (typeof validated.dataRetention !== 'number' || validated.dataRetention < 1) {
    validated.dataRetention = 14;
  }
  
  return validated;
}

/**
 * Проверка поддержки браузера
 * @returns {boolean} Поддерживается ли браузер
 */
export function isBrowserSupported() {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof localStorage !== 'undefined' &&
    typeof fetch !== 'undefined' &&
    typeof Promise !== 'undefined'
  );
}

/**
 * Генерация ID сессии
 * @returns {string} Уникальный ID сессии
 */
export function generateSessionId() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
} 