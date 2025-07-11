/**
 * Security Module Exports
 * Центральный экспорт всех security компонентов
 * 
 * @author Steamphony Digital Agency
 * @version 1.0.0
 */

export { SecurityLayer } from './SecurityLayer.js';
export { InputValidator } from './InputValidator.js';

// Re-export commonly used functions for convenience
export const {
  sanitizeInput,
  sanitizeHTML,
  sanitizeEmail,
  sanitizePhone,
  sanitizeCompany,
  safeSetTextContent,
  safeSetInnerHTML,
  generateCSRFToken,
  validateCSRFToken,
  encryptData,
  decryptData
} = await import('./SecurityLayer.js').then(m => m.SecurityLayer);

export const {
  validateEmail,
  validatePhone,
  validateCompany,
  validateName,
  validateURL,
  validateBusinessData,
  validateContactData,
  validateFormData
} = await import('./InputValidator.js').then(m => m.InputValidator); 