# 🔒 **SECURITY SPECIALIST TECHNICAL SPECIFICATION**
## Steamphony Marketing Budget Calculator - Security Implementation

**Роль:** Senior Security Developer (External Contractor)  
**Бюджет:** $7,000  
**Срок:** 5 рабочих дней  
**Отчетность:** Web Development Lead  

---

## 🎯 **MISSION OBJECTIVE**

Реализовать комплексную систему безопасности для калькулятора маркетингового бюджета, устранив все критические уязвимости и обеспечив соответствие современным стандартам безопасности.

---

## 📊 **CURRENT SECURITY ASSESSMENT**

### **Критические уязвимости (BLOCKERS):**

#### **1. XSS VULNERABILITIES**
```yaml
HIGH_RISK_AREAS:
  - ContactFormStep.js: 759 строк без input sanitization
  - Calculator.js: 1413 строк с прямой обработкой user input
  - Analytics.js: 1000+ строк без XSS protection
  
SPECIFIC_ISSUES:
  - User input отображается без sanitization
  - Form data вставляется в DOM без validation
  - Analytics events содержат unsanitized data
```

#### **2. CSRF VULNERABILITIES**
```yaml
HIGH_RISK_AREAS:
  - Form submissions без CSRF tokens
  - Google Sheets integration без proper validation
  - Email submission без CSRF protection
  
SPECIFIC_ISSUES:
  - No CSRF tokens в form submissions
  - No validation of request origin
  - Cross-origin requests без proper headers
```

#### **3. DATA EXPOSURE RISKS**
```yaml
HIGH_RISK_AREAS:
  - Form data в localStorage без encryption
  - Analytics events содержат sensitive business data
  - Session data exposed в browser storage
  
SPECIFIC_ISSUES:
  - Business data stored in plain text
  - No encryption for sensitive information
  - Analytics tracking без data anonymization
```

---

## 🛡️ **SECURITY IMPLEMENTATION PLAN**

### **PHASE 1: XSS PROTECTION (Day 1-2)**

#### **1.1 Input Sanitization Layer**
```javascript
// NEW: src/security/SecurityLayer.js
import DOMPurify from 'dompurify';

export class SecurityLayer {
  /**
   * Sanitize user input to prevent XSS attacks
   * @param {string} input - Raw user input
   * @param {Object} options - Sanitization options
   * @returns {string} - Sanitized input
   */
  static sanitizeInput(input, options = {}) {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    const defaultOptions = {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
      ALLOWED_ATTR: ['href', 'target'],
      KEEP_CONTENT: true
    };
    
    return DOMPurify.sanitize(input, { ...defaultOptions, ...options });
  }
  
  /**
   * Sanitize HTML content for safe DOM insertion
   * @param {string} html - HTML content
   * @returns {string} - Sanitized HTML
   */
  static sanitizeHTML(html) {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
  }
  
  /**
   * Validate and sanitize email addresses
   * @param {string} email - Email address
   * @returns {string|null} - Sanitized email or null if invalid
   */
  static sanitizeEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = this.sanitizeInput(email, { ALLOWED_TAGS: [] });
    
    return emailRegex.test(sanitized) ? sanitized : null;
  }
}
```

#### **1.2 Input Validation Service**
```javascript
// NEW: src/security/InputValidator.js
export class InputValidator {
  /**
   * Validate business data input
   * @param {Object} data - Business data object
   * @returns {Object} - Validation result
   */
  static validateBusinessData(data) {
    const errors = {};
    
    // Validate company name
    if (data.companyName) {
      const sanitized = SecurityLayer.sanitizeInput(data.companyName);
      if (sanitized.length < 2 || sanitized.length > 100) {
        errors.companyName = 'Company name must be 2-100 characters';
      }
    }
    
    // Validate email
    if (data.email) {
      const sanitized = SecurityLayer.sanitizeEmail(data.email);
      if (!sanitized) {
        errors.email = 'Invalid email format';
      }
    }
    
    // Validate phone
    if (data.phone) {
      const sanitized = SecurityLayer.sanitizeInput(data.phone);
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(sanitized.replace(/\s/g, ''))) {
        errors.phone = 'Invalid phone format';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData: this.sanitizeData(data)
    };
  }
  
  /**
   * Sanitize all data fields
   * @param {Object} data - Raw data object
   * @returns {Object} - Sanitized data object
   */
  static sanitizeData(data) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = SecurityLayer.sanitizeInput(value);
      } else if (typeof value === 'number') {
        sanitized[key] = Number.isFinite(value) ? value : 0;
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}
```

### **PHASE 2: CSRF PROTECTION (Day 2-3)**

#### **2.1 CSRF Token Management**
```javascript
// NEW: src/security/CSRFProtection.js
export class CSRFProtection {
  constructor() {
    this.token = null;
    this.tokenName = 'steamphony-csrf-token';
    this.init();
  }
  
  /**
   * Initialize CSRF protection
   */
  init() {
    this.generateToken();
    this.setupTokenRefresh();
  }
  
  /**
   * Generate new CSRF token
   * @returns {string} - Generated token
   */
  generateToken() {
    this.token = crypto.randomUUID();
    this.storeToken();
    return this.token;
  }
  
  /**
   * Store token in secure storage
   */
  storeToken() {
    try {
      sessionStorage.setItem(this.tokenName, this.token);
    } catch (error) {
      console.error('Failed to store CSRF token:', error);
    }
  }
  
  /**
   * Get current CSRF token
   * @returns {string} - Current token
   */
  getToken() {
    if (!this.token) {
      this.token = sessionStorage.getItem(this.tokenName) || this.generateToken();
    }
    return this.token;
  }
  
  /**
   * Validate CSRF token
   * @param {string} token - Token to validate
   * @returns {boolean} - Validation result
   */
  validateToken(token) {
    return token === this.getToken();
  }
  
  /**
   * Setup automatic token refresh
   */
  setupTokenRefresh() {
    // Refresh token every 30 minutes
    setInterval(() => {
      this.generateToken();
    }, 30 * 60 * 1000);
  }
}
```

#### **2.2 Form Security Integration**
```javascript
// NEW: src/security/FormSecurity.js
import { CSRFProtection } from './CSRFProtection.js';
import { SecurityLayer } from './SecurityLayer.js';

export class FormSecurity {
  constructor() {
    this.csrfProtection = new CSRFProtection();
  }
  
  /**
   * Secure form submission
   * @param {Object} formData - Form data
   * @param {string} endpoint - Submission endpoint
   * @returns {Promise} - Submission result
   */
  async secureSubmit(formData, endpoint) {
    // Add CSRF token
    const secureData = {
      ...formData,
      _csrf: this.csrfProtection.getToken()
    };
    
    // Sanitize all input data
    const sanitizedData = this.sanitizeFormData(secureData);
    
    // Validate data
    const validation = this.validateFormData(sanitizedData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`);
    }
    
    // Submit with security headers
    return this.submitWithHeaders(sanitizedData, endpoint);
  }
  
  /**
   * Sanitize form data
   * @param {Object} data - Form data
   * @returns {Object} - Sanitized data
   */
  sanitizeFormData(data) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (key === '_csrf') {
        sanitized[key] = value; // Don't sanitize CSRF token
      } else if (typeof value === 'string') {
        sanitized[key] = SecurityLayer.sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeFormData(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
  
  /**
   * Submit with security headers
   * @param {Object} data - Sanitized data
   * @param {string} endpoint - Endpoint URL
   * @returns {Promise} - Submission result
   */
  async submitWithHeaders(data, endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.csrfProtection.getToken(),
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Submission failed: ${response.status}`);
    }
    
    return response.json();
  }
}
```

### **PHASE 3: DATA PROTECTION (Day 3-4)**

#### **3.1 Secure Storage Service**
```javascript
// NEW: src/security/SecureStorage.js
export class SecureStorage {
  constructor() {
    this.encryptionKey = this.generateEncryptionKey();
  }
  
  /**
   * Generate encryption key
   * @returns {string} - Encryption key
   */
  generateEncryptionKey() {
    return crypto.randomUUID();
  }
  
  /**
   * Encrypt sensitive data
   * @param {string} data - Data to encrypt
   * @returns {string} - Encrypted data
   */
  encrypt(data) {
    // Simple encryption for demo (use proper encryption in production)
    return btoa(encodeURIComponent(JSON.stringify(data)));
  }
  
  /**
   * Decrypt sensitive data
   * @param {string} encryptedData - Encrypted data
   * @returns {Object} - Decrypted data
   */
  decrypt(encryptedData) {
    try {
      return JSON.parse(decodeURIComponent(atob(encryptedData)));
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }
  
  /**
   * Store sensitive data securely
   * @param {string} key - Storage key
   * @param {Object} data - Data to store
   */
  secureStore(key, data) {
    try {
      const encrypted = this.encrypt(data);
      sessionStorage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      console.error('Secure storage failed:', error);
    }
  }
  
  /**
   * Retrieve sensitive data securely
   * @param {string} key - Storage key
   * @returns {Object|null} - Retrieved data
   */
  secureRetrieve(key) {
    try {
      const encrypted = sessionStorage.getItem(`secure_${key}`);
      return encrypted ? this.decrypt(encrypted) : null;
    } catch (error) {
      console.error('Secure retrieval failed:', error);
      return null;
    }
  }
  
  /**
   * Clear all secure data
   */
  clearSecureData() {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('secure_')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Clear secure data failed:', error);
    }
  }
}
```

#### **3.2 Analytics Data Protection**
```javascript
// NEW: src/security/AnalyticsProtection.js
export class AnalyticsProtection {
  /**
   * Sanitize analytics data
   * @param {Object} data - Analytics data
   * @returns {Object} - Sanitized analytics data
   */
  static sanitizeAnalyticsData(data) {
    const sanitized = {};
    
    // Remove sensitive information
    const sensitiveFields = ['email', 'phone', 'companyName', 'personalData'];
    
    for (const [key, value] of Object.entries(data)) {
      if (sensitiveFields.includes(key)) {
        // Hash sensitive data for analytics
        sanitized[key] = this.hashData(value);
      } else if (typeof value === 'string') {
        sanitized[key] = SecurityLayer.sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeAnalyticsData(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
  
  /**
   * Hash sensitive data
   * @param {string} data - Data to hash
   * @returns {string} - Hashed data
   */
  static hashData(data) {
    // Simple hash for demo (use proper hashing in production)
    return btoa(data).substring(0, 8);
  }
  
  /**
   * Anonymize IP addresses
   * @param {string} ip - IP address
   * @returns {string} - Anonymized IP
   */
  static anonymizeIP(ip) {
    if (!ip) return '';
    
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.*.*`;
    }
    
    return ip;
  }
}
```

### **PHASE 4: SECURITY HEADERS & CONFIGURATION (Day 4-5)**

#### **4.1 Security Headers Configuration**
```javascript
// NEW: src/security/SecurityHeaders.js
export class SecurityHeaders {
  /**
   * Configure security headers for the application
   */
  static configureHeaders() {
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://www.google-analytics.com",
      "frame-ancestors 'none'",
      "form-action 'self'"
    ].join('; ');
    
    // Set CSP meta tag
    this.setMetaTag('csp', csp);
    
    // Other security headers
    this.setSecurityHeaders();
  }
  
  /**
   * Set security meta tags
   * @param {string} name - Meta tag name
   * @param {string} content - Meta tag content
   */
  static setMetaTag(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    
    meta.content = content;
  }
  
  /**
   * Set additional security headers
   */
  static setSecurityHeaders() {
    // X-Frame-Options
    this.setMetaTag('X-Frame-Options', 'DENY');
    
    // X-Content-Type-Options
    this.setMetaTag('X-Content-Type-Options', 'nosniff');
    
    // Referrer Policy
    this.setMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');
  }
}
```

#### **4.2 Security Configuration**
```javascript
// NEW: src/security/SecurityConfig.js
export const SecurityConfig = {
  // XSS Protection
  XSS: {
    ENABLED: true,
    SANITIZE_ALL_INPUTS: true,
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href', 'target']
  },
  
  // CSRF Protection
  CSRF: {
    ENABLED: true,
    TOKEN_REFRESH_INTERVAL: 30 * 60 * 1000, // 30 minutes
    VALIDATE_ALL_FORMS: true
  },
  
  // Data Protection
  DATA_PROTECTION: {
    ENCRYPT_SENSITIVE_DATA: true,
    ANONYMIZE_ANALYTICS: true,
    CLEAR_DATA_ON_LOGOUT: true
  },
  
  // Headers
  HEADERS: {
    CSP_ENABLED: true,
    HSTS_ENABLED: true,
    X_FRAME_OPTIONS: 'DENY'
  }
};
```

---

## 🔧 **INTEGRATION REQUIREMENTS**

### **Component Integration Points**

#### **1. Calculator.js Integration**
```javascript
// Update Calculator.js to use security layer
import { SecurityLayer } from '../security/SecurityLayer.js';
import { InputValidator } from '../security/InputValidator.js';

// In constructor
this.securityLayer = SecurityLayer;
this.inputValidator = InputValidator;

// In validateFormData method
validateFormData(formData) {
  const validation = this.inputValidator.validateBusinessData(formData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`);
  }
  return validation.sanitizedData;
}
```

#### **2. ContactFormStep.js Integration**
```javascript
// Update ContactFormStep.js to use security layer
import { FormSecurity } from '../security/FormSecurity.js';
import { SecureStorage } from '../security/SecureStorage.js';

// In constructor
this.formSecurity = new FormSecurity();
this.secureStorage = new SecureStorage();

// In handleFormSubmission method
async handleFormSubmission(e) {
  e.preventDefault();
  
  const formData = this.getFormDataFromDOM();
  
  try {
    const result = await this.formSecurity.secureSubmit(
      formData, 
      '/api/submit-lead'
    );
    
    // Store sensitive data securely
    this.secureStorage.secureStore('lead_data', formData);
    
    this.showSuccessState();
  } catch (error) {
    this.handleSubmissionError(error);
  }
}
```

#### **3. Analytics.js Integration**
```javascript
// Update Analytics.js to use security layer
import { AnalyticsProtection } from '../security/AnalyticsProtection.js';

// In trackEvent method
trackEvent(eventName, params = {}) {
  // Sanitize analytics data
  const sanitizedParams = AnalyticsProtection.sanitizeAnalyticsData(params);
  
  // Send sanitized data to analytics
  gtag('event', eventName, sanitizedParams);
}
```

---

## 🧪 **TESTING REQUIREMENTS**

### **Security Testing Suite**
```javascript
// NEW: tests/security/SecurityTests.test.js
import { SecurityLayer } from '../../src/security/SecurityLayer.js';
import { CSRFProtection } from '../../src/security/CSRFProtection.js';
import { FormSecurity } from '../../src/security/FormSecurity.js';

describe('Security Tests', () => {
  describe('XSS Protection', () => {
    it('should sanitize malicious input', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = SecurityLayer.sanitizeInput(maliciousInput);
      expect(sanitized).not.toContain('<script>');
    });
    
    it('should prevent script injection', () => {
      const scriptInput = 'javascript:alert("xss")';
      const sanitized = SecurityLayer.sanitizeInput(scriptInput);
      expect(sanitized).not.toContain('javascript:');
    });
  });
  
  describe('CSRF Protection', () => {
    it('should generate valid CSRF tokens', () => {
      const csrf = new CSRFProtection();
      const token = csrf.getToken();
      expect(token).toBeTruthy();
      expect(csrf.validateToken(token)).toBe(true);
    });
    
    it('should reject invalid CSRF tokens', () => {
      const csrf = new CSRFProtection();
      expect(csrf.validateToken('invalid-token')).toBe(false);
    });
  });
  
  describe('Form Security', () => {
    it('should sanitize form data', () => {
      const formSecurity = new FormSecurity();
      const maliciousData = {
        name: '<script>alert("xss")</script>',
        email: 'test@example.com'
      };
      
      const sanitized = formSecurity.sanitizeFormData(maliciousData);
      expect(sanitized.name).not.toContain('<script>');
      expect(sanitized.email).toBe('test@example.com');
    });
  });
});
```

---

## 📋 **DELIVERABLES CHECKLIST**

### **Code Deliverables**
- [ ] `src/security/SecurityLayer.js` - XSS protection implementation
- [ ] `src/security/InputValidator.js` - Input validation service
- [ ] `src/security/CSRFProtection.js` - CSRF token management
- [ ] `src/security/FormSecurity.js` - Secure form submission
- [ ] `src/security/SecureStorage.js` - Encrypted data storage
- [ ] `src/security/AnalyticsProtection.js` - Analytics data protection
- [ ] `src/security/SecurityHeaders.js` - Security headers configuration
- [ ] `src/security/SecurityConfig.js` - Security configuration

### **Integration Deliverables**
- [ ] Updated `Calculator.js` with security integration
- [ ] Updated `ContactFormStep.js` with security integration
- [ ] Updated `Analytics.js` with security integration
- [ ] All components using security layer

### **Testing Deliverables**
- [ ] `tests/security/SecurityTests.test.js` - Security testing suite
- [ ] XSS protection tests
- [ ] CSRF protection tests
- [ ] Input validation tests
- [ ] Data encryption tests

### **Documentation Deliverables**
- [ ] Security implementation guide
- [ ] Security configuration documentation
- [ ] Integration instructions
- [ ] Security testing guide

### **Security Audit Deliverables**
- [ ] Penetration testing report
- [ ] Vulnerability assessment report
- [ ] Security compliance checklist
- [ ] Risk mitigation recommendations

---

## ✅ **SUCCESS CRITERIA**

### **Security Metrics**
- [ ] Zero critical vulnerabilities detected
- [ ] XSS protection active on all user inputs
- [ ] CSRF protection implemented on all forms
- [ ] Sensitive data encrypted in storage
- [ ] Security headers properly configured

### **Code Quality Metrics**
- [ ] All security modules <300 lines
- [ ] Comprehensive error handling
- [ ] Proper logging and monitoring
- [ ] Clean code principles followed
- [ ] Documentation complete

### **Testing Metrics**
- [ ] Security test coverage >90%
- [ ] All security tests passing
- [ ] Penetration testing successful
- [ ] No false positives in security scans

---

## 🚀 **IMMEDIATE NEXT STEPS**

### **Day 1: Setup & Planning**
1. **Codebase access** - Get access to repository
2. **Security assessment** - Run initial vulnerability scan
3. **Architecture review** - Understand current security gaps
4. **Implementation plan** - Create detailed implementation timeline

### **Day 2-3: Core Implementation**
1. **XSS protection** - Implement input sanitization
2. **CSRF protection** - Add token management
3. **Form security** - Secure all form submissions

### **Day 4-5: Integration & Testing**
1. **Component integration** - Update all components
2. **Security testing** - Implement test suite
3. **Penetration testing** - Conduct security audit
4. **Documentation** - Complete all documentation

**🎯 Ready для начала security implementation! 🔒** 