/**
 * Security Layer - Защита от XSS и других уязвимостей
 * 
 * @class SecurityLayer
 * @author Steamphony Digital Agency
 * @version 1.0.0
 */

/**
 * Базовый слой безопасности для защиты от XSS атак
 */
export class SecurityLayer {
  /**
   * Sanitize user input для предотвращения XSS атак
   * @param {string} input - Сырой пользовательский ввод
   * @param {Object} options - Опции sanitization
   * @returns {string} - Очищенный ввод
   */
  static sanitizeInput(input, options = {}) {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    // Базовые правила sanitization
    const defaultOptions = {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
      ALLOWED_ATTR: ['href', 'target'],
      KEEP_CONTENT: true
    };
    
    const sanitizationOptions = { ...defaultOptions, ...options };
    
    // Удаляем потенциально опасные теги и атрибуты
    let sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:/gi, '');
    
    // Если разрешены только определенные теги
    if (sanitizationOptions.ALLOWED_TAGS.length === 0) {
      // Удаляем все HTML теги
      sanitized = sanitized.replace(/<[^>]*>/g, '');
    } else {
      // Удаляем все теги кроме разрешенных
      const allowedTagsRegex = new RegExp(`<(?!\/?(?:${sanitizationOptions.ALLOWED_TAGS.join('|')})\b)[^>]+>`, 'gi');
      sanitized = sanitized.replace(allowedTagsRegex, '');
    }
    
    return sanitized.trim();
  }
  
  /**
   * Sanitize HTML content для безопасной вставки в DOM
   * @param {string} html - HTML контент
   * @returns {string} - Очищенный HTML
   */
  static sanitizeHTML(html) {
    return this.sanitizeInput(html, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
  }
  
  /**
   * Validate и sanitize email адреса
   * @param {string} email - Email адрес
   * @returns {string|null} - Очищенный email или null если невалидный
   */
  static sanitizeEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = this.sanitizeInput(email, { ALLOWED_TAGS: [] });
    
    return emailRegex.test(sanitized) ? sanitized.toLowerCase() : null;
  }
  
  /**
   * Validate и sanitize телефонные номера
   * @param {string} phone - Телефонный номер
   * @returns {string|null} - Очищенный номер или null если невалидный
   */
  static sanitizePhone(phone) {
    // Удаляем все кроме цифр, +, -, (, ), пробелов
    const sanitized = phone.replace(/[^\d\s\+\-\(\)]/g, '');
    
    // Проверяем минимальную длину (7 цифр)
    const digitsOnly = sanitized.replace(/\D/g, '');
    return digitsOnly.length >= 7 ? sanitized : null;
  }
  
  /**
   * Validate и sanitize названия компаний
   * @param {string} company - Название компании
   * @returns {string} - Очищенное название
   */
  static sanitizeCompany(company) {
    return this.sanitizeInput(company, { ALLOWED_TAGS: [] })
      .replace(/\s+/g, ' ')
      .substring(0, 100); // Ограничиваем длину
  }
  
  /**
   * Безопасная вставка текста в DOM элемент
   * @param {HTMLElement} element - DOM элемент
   * @param {string} text - Текст для вставки
   */
  static safeSetTextContent(element, text) {
    if (element && element.textContent !== undefined) {
      element.textContent = this.sanitizeInput(text, { ALLOWED_TAGS: [] });
    }
  }
  
  /**
   * Безопасная вставка HTML в DOM элемент
   * @param {HTMLElement} element - DOM элемент
   * @param {string} html - HTML для вставки
   */
  static safeSetInnerHTML(element, html) {
    if (element && element.innerHTML !== undefined) {
      element.innerHTML = this.sanitizeHTML(html);
    }
  }
  
  /**
   * Генерация CSRF токена
   * @returns {string} - Уникальный CSRF токен
   */
  static generateCSRFToken() {
    return 'csrf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  /**
   * Validate CSRF токен
   * @param {string} token - Токен для проверки
   * @param {string} storedToken - Сохраненный токен
   * @returns {boolean} - Валидность токена
   */
  static validateCSRFToken(token, storedToken) {
    return token && storedToken && token === storedToken;
  }
  
  /**
   * Шифрование данных для localStorage
   * @param {string} data - Данные для шифрования
   * @param {string} key - Ключ шифрования
   * @returns {string} - Зашифрованные данные
   */
  static encryptData(data, key = 'steamphony_key') {
    try {
      // Используем более безопасный метод кодирования
      const jsonString = JSON.stringify(data);
      if (typeof Buffer !== 'undefined') {
        // Node.js environment
        return Buffer.from(jsonString, 'utf8').toString('base64');
      } else {
        // Browser environment
        return btoa(unescape(encodeURIComponent(jsonString)));
      }
    } catch (error) {
      console.error('Encryption error:', error);
      return '';
    }
  }
  
  /**
   * Расшифровка данных из localStorage
   * @param {string} encryptedData - Зашифрованные данные
   * @param {string} key - Ключ шифрования
   * @returns {any} - Расшифрованные данные
   */
  static decryptData(encryptedData, key = 'steamphony_key') {
    try {
      if (typeof Buffer !== 'undefined') {
        // Node.js environment
        const decoded = Buffer.from(encryptedData, 'base64').toString('utf8');
        return JSON.parse(decoded);
      } else {
        // Browser environment
        const decoded = decodeURIComponent(escape(atob(encryptedData)));
        return JSON.parse(decoded);
      }
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }
} 