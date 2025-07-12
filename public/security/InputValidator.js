/**
 * Input Validator - Валидация пользовательского ввода
 * 
 * @class InputValidator
 * @author Steamphony Digital Agency
 * @version 1.0.0
 */

import { SecurityLayer } from './SecurityLayer.js';

/**
 * Сервис валидации пользовательского ввода
 */
export class InputValidator {
  /**
   * Validate email адрес
   * @param {string} email - Email для валидации
   * @returns {Object} - Результат валидации
   */
  static validateEmail(email) {
    const sanitized = SecurityLayer.sanitizeEmail(email);
    
    if (!sanitized) {
      return {
        isValid: false,
        error: 'Введите корректный email адрес',
        sanitized: null
      };
    }
    
    return {
      isValid: true,
      error: null,
      sanitized
    };
  }
  
  /**
   * Validate телефонный номер
   * @param {string} phone - Телефон для валидации
   * @returns {Object} - Результат валидации
   */
  static validatePhone(phone) {
    const sanitized = SecurityLayer.sanitizePhone(phone);
    
    if (!sanitized) {
      return {
        isValid: false,
        error: 'Введите корректный номер телефона',
        sanitized: null
      };
    }
    
    return {
      isValid: true,
      error: null,
      sanitized
    };
  }
  
  /**
   * Validate название компании
   * @param {string} company - Название компании
   * @returns {Object} - Результат валидации
   */
  static validateCompany(company) {
    const sanitized = SecurityLayer.sanitizeCompany(company);
    
    if (!sanitized || sanitized.length < 2) {
      return {
        isValid: false,
        error: 'Название компании должно содержать минимум 2 символа',
        sanitized: null
      };
    }
    
    if (sanitized.length > 100) {
      return {
        isValid: false,
        error: 'Название компании слишком длинное',
        sanitized: null
      };
    }
    
    return {
      isValid: true,
      error: null,
      sanitized
    };
  }
  
  /**
   * Validate имя пользователя
   * @param {string} name - Имя пользователя
   * @returns {Object} - Результат валидации
   */
  static validateName(name) {
    const sanitized = SecurityLayer.sanitizeInput(name, { ALLOWED_TAGS: [] })
      .replace(/\s+/g, ' ')
      .trim();
    
    if (!sanitized || sanitized.length < 2) {
      return {
        isValid: false,
        error: 'Имя должно содержать минимум 2 символа',
        sanitized: null
      };
    }
    
    if (sanitized.length > 50) {
      return {
        isValid: false,
        error: 'Имя слишком длинное',
        sanitized: null
      };
    }
    
    // Проверяем на допустимые символы
    const nameRegex = /^[а-яёa-z\s\-']+$/i;
    if (!nameRegex.test(sanitized)) {
      return {
        isValid: false,
        error: 'Имя содержит недопустимые символы',
        sanitized: null
      };
    }
    
    return {
      isValid: true,
      error: null,
      sanitized
    };
  }
  
  /**
   * Validate URL
   * @param {string} url - URL для валидации
   * @returns {Object} - Результат валидации
   */
  static validateURL(url) {
    if (!url || url.trim() === '') {
      return {
        isValid: true, // URL не обязателен
        error: null,
        sanitized: ''
      };
    }
    
    const sanitized = SecurityLayer.sanitizeInput(url, { ALLOWED_TAGS: [] });
    
    try {
      // Проверяем корректность URL
      new URL(sanitized.startsWith('http') ? sanitized : `https://${sanitized}`);
      
      return {
        isValid: true,
        error: null,
        sanitized
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Введите корректный URL',
        sanitized: null
      };
    }
  }
  
  /**
   * Validate бизнес данные
   * @param {Object} data - Бизнес данные
   * @returns {Object} - Результат валидации
   */
  static validateBusinessData(data) {
    const errors = {};
    const sanitizedData = {};
    
    // Validate industry
    if (!data.industry || !data.industry.key) {
      errors.industry = 'Выберите отрасль';
    } else {
      sanitizedData.industry = {
        key: SecurityLayer.sanitizeInput(data.industry.key, { ALLOWED_TAGS: [] }),
        title: SecurityLayer.sanitizeInput(data.industry.title, { ALLOWED_TAGS: [] })
      };
    }
    
    // Validate business size
    if (!data.businessSize || !data.businessSize.value) {
      errors.businessSize = 'Выберите размер бизнеса';
    } else {
      sanitizedData.businessSize = {
        value: SecurityLayer.sanitizeInput(data.businessSize.value, { ALLOWED_TAGS: [] }),
        title: SecurityLayer.sanitizeInput(data.businessSize.title, { ALLOWED_TAGS: [] })
      };
    }
    
    // Validate marketing budget
    if (!data.marketingBudget || typeof data.marketingBudget.monthly !== 'number') {
      errors.marketingBudget = 'Укажите маркетинговый бюджет';
    } else {
      sanitizedData.marketingBudget = {
        monthly: Math.max(0, data.marketingBudget.monthly),
        range: SecurityLayer.sanitizeInput(data.marketingBudget.range, { ALLOWED_TAGS: [] })
      };
    }
    
    // Validate marketing tools
    if (data.marketingTools && data.marketingTools.selected) {
      sanitizedData.marketingTools = {
        selected: data.marketingTools.selected.map(tool => 
          SecurityLayer.sanitizeInput(tool, { ALLOWED_TAGS: [] })
        ).filter(Boolean)
      };
    }
    
    // Validate marketing team
    if (data.marketingTeam && data.marketingTeam.current) {
      sanitizedData.marketingTeam = {
        current: {
          id: SecurityLayer.sanitizeInput(data.marketingTeam.current.id, { ALLOWED_TAGS: [] }),
          title: SecurityLayer.sanitizeInput(data.marketingTeam.current.title, { ALLOWED_TAGS: [] })
        }
      };
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData
    };
  }
  
  /**
   * Validate контактные данные
   * @param {Object} data - Контактные данные
   * @returns {Object} - Результат валидации
   */
  static validateContactData(data) {
    const errors = {};
    const sanitizedData = {};
    
    // Validate first name
    const firstNameValidation = this.validateName(data.firstName);
    if (!firstNameValidation.isValid) {
      errors.firstName = firstNameValidation.error;
    } else {
      sanitizedData.firstName = firstNameValidation.sanitized;
    }
    
    // Validate last name (optional)
    if (data.lastName) {
      const lastNameValidation = this.validateName(data.lastName);
      if (lastNameValidation.isValid) {
        sanitizedData.lastName = lastNameValidation.sanitized;
      }
    }
    
    // Validate phone
    const phoneValidation = this.validatePhone(data.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error;
    } else {
      sanitizedData.phone = phoneValidation.sanitized;
    }
    
    // Validate email
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
    } else {
      sanitizedData.email = emailValidation.sanitized;
    }
    
    // Validate company
    const companyValidation = this.validateCompany(data.company);
    if (!companyValidation.isValid) {
      errors.company = companyValidation.error;
    } else {
      sanitizedData.company = companyValidation.sanitized;
    }
    
    // Validate city (optional)
    if (data.city) {
      sanitizedData.city = SecurityLayer.sanitizeInput(data.city, { ALLOWED_TAGS: [] })
        .substring(0, 50);
    }
    
    // Validate website (optional)
    const websiteValidation = this.validateURL(data.website);
    if (websiteValidation.isValid) {
      sanitizedData.website = websiteValidation.sanitized;
    }
    
    // Validate comments (optional)
    if (data.comments) {
      sanitizedData.comments = SecurityLayer.sanitizeInput(data.comments, { ALLOWED_TAGS: [] })
        .substring(0, 500);
    }
    
    // Validate GDPR consent
    if (!data.gdprConsent) {
      errors.gdprConsent = 'Необходимо согласие на обработку персональных данных';
    } else {
      sanitizedData.gdprConsent = true;
    }
    
    // Marketing consent (optional)
    sanitizedData.marketingConsent = !!data.marketingConsent;
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData
    };
  }
  
  /**
   * Validate все данные формы
   * @param {Object} formData - Все данные формы
   * @returns {Object} - Результат валидации
   */
  static validateFormData(formData) {
    const businessValidation = this.validateBusinessData(formData);
    const contactValidation = this.validateContactData(formData);
    
    const allErrors = {
      ...businessValidation.errors,
      ...contactValidation.errors
    };
    
    const allData = {
      ...businessValidation.sanitizedData,
      ...contactValidation.sanitizedData
    };
    
    return {
      isValid: Object.keys(allErrors).length === 0,
      errors: allErrors,
      sanitizedData: allData
    };
  }
} 