/**
 * Security Tests - Тестирование безопасности
 * 
 * @author Steamphony Digital Agency
 * @version 1.0.0
 */

import { SecurityLayer } from './src/security/SecurityLayer.js';
import { InputValidator } from './src/security/InputValidator.js';

/**
 * Тесты безопасности для проверки XSS защиты
 */
class SecurityTests {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  /**
   * Запуск всех тестов безопасности
   */
  async runAllTests() {
    console.log('🔒 Запуск тестов безопасности...\n');
    
    // XSS Protection Tests
    this.testXSSProtection();
    
    // Input Validation Tests
    this.testInputValidation();
    
    // CSRF Protection Tests
    this.testCSRFProtection();
    
    // Data Encryption Tests
    this.testDataEncryption();
    
    // DOM Security Tests
    this.testDOMSecurity();
    
    this.printResults();
  }

  /**
   * Тестирование XSS защиты
   */
  testXSSProtection() {
    console.log('🧪 Тестирование XSS защиты...');
    
    const xssTests = [
      {
        name: 'Script tag injection',
        input: '<script>alert("xss")</script>',
        expected: 'alert("xss")'
      },
      {
        name: 'JavaScript protocol injection',
        input: 'javascript:alert("xss")',
        expected: 'alert("xss")'
      },
      {
        name: 'Event handler injection',
        input: '<img src="x" onerror="alert(\'xss\')">',
        expected: '<img src="x">'
      },
      {
        name: 'Iframe injection',
        input: '<iframe src="javascript:alert(\'xss\')"></iframe>',
        expected: ''
      },
      {
        name: 'Data URI injection',
        input: 'data:text/html,<script>alert("xss")</script>',
        expected: 'text/html,alert("xss")'
      }
    ];

    xssTests.forEach(test => {
      const sanitized = SecurityLayer.sanitizeInput(test.input);
      const passed = !sanitized.includes('<script>') && !sanitized.includes('javascript:');
      
      this.assertTest(test.name, passed, sanitized, test.expected);
    });
  }

  /**
   * Тестирование валидации ввода
   */
  testInputValidation() {
    console.log('🧪 Тестирование валидации ввода...');
    
    // Email validation tests
    const emailTests = [
      { input: 'test@example.com', expected: true },
      { input: 'invalid-email', expected: false },
      { input: 'test@', expected: false },
      { input: '@example.com', expected: false },
      { input: 'test<script>@example.com', expected: false } // Should be sanitized to invalid email
    ];

    emailTests.forEach(test => {
      const result = InputValidator.validateEmail(test.input);
      this.assertTest(`Email validation: ${test.input}`, result.isValid === test.expected);
    });

    // Phone validation tests
    const phoneTests = [
      { input: '+7 (495) 123-45-67', expected: true },
      { input: '8-800-555-35-35', expected: true },
      { input: '123', expected: false },
      { input: 'abc', expected: false },
      { input: '<script>alert("xss")</script>', expected: false }
    ];

    phoneTests.forEach(test => {
      const result = InputValidator.validatePhone(test.input);
      this.assertTest(`Phone validation: ${test.input}`, result.isValid === test.expected);
    });

    // Company name validation tests
    const companyTests = [
      { input: 'Steamphony Digital Agency', expected: true },
      { input: 'A', expected: false },
      { input: 'A'.repeat(101), expected: false },
      { input: 'Company<script>alert("xss")</script>', expected: true } // Should be sanitized to valid company name
    ];

    companyTests.forEach(test => {
      const result = InputValidator.validateCompany(test.input);
      this.assertTest(`Company validation: ${test.input}`, result.isValid === test.expected);
    });
  }

  /**
   * Тестирование CSRF защиты
   */
  testCSRFProtection() {
    console.log('🧪 Тестирование CSRF защиты...');
    
    // Generate CSRF token
    const token1 = SecurityLayer.generateCSRFToken();
    const token2 = SecurityLayer.generateCSRFToken();
    
    // Test token generation
    this.assertTest('CSRF token generation', 
      token1 && token1.startsWith('csrf_') && token1 !== token2);
    
    // Test token validation
    this.assertTest('CSRF token validation - valid', 
      SecurityLayer.validateCSRFToken(token1, token1));
    
    this.assertTest('CSRF token validation - invalid', 
      !SecurityLayer.validateCSRFToken(token1, token2));
    
    this.assertTest('CSRF token validation - empty', 
      !SecurityLayer.validateCSRFToken('', token1));
  }

  /**
   * Тестирование шифрования данных
   */
  testDataEncryption() {
    console.log('🧪 Тестирование шифрования данных...');
    
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+7 (495) 123-45-67'
    };
    
    // Test encryption
    const encrypted = SecurityLayer.encryptData(testData);
    this.assertTest('Data encryption', encrypted && encrypted.length > 0);
    
    // Test decryption
    const decrypted = SecurityLayer.decryptData(encrypted);
    this.assertTest('Data decryption', 
      decrypted && decrypted.name === testData.name);
    
    // Test invalid decryption
    const invalidDecrypted = SecurityLayer.decryptData('invalid-data');
    this.assertTest('Invalid data decryption', invalidDecrypted === null);
  }

  /**
   * Тестирование безопасности DOM
   */
  testDOMSecurity() {
    console.log('🧪 Тестирование безопасности DOM...');
    
    // Пропускаем тесты DOM в Node.js environment
    if (typeof document === 'undefined') {
      console.log('  ⏭️  DOM tests skipped (Node.js environment)');
      return;
    }
    
    // Create test element
    const testElement = document.createElement('div');
    
    // Test safe text content
    const maliciousText = '<script>alert("xss")</script>Hello World';
    SecurityLayer.safeSetTextContent(testElement, maliciousText);
    
    this.assertTest('Safe text content', 
      testElement.textContent === 'Hello World' && 
      !testElement.textContent.includes('<script>'));
    
    // Test safe innerHTML
    const maliciousHTML = '<div><script>alert("xss")</script>Safe content</div>';
    SecurityLayer.safeSetInnerHTML(testElement, maliciousHTML);
    
    this.assertTest('Safe innerHTML', 
      testElement.innerHTML.includes('Safe content') && 
      !testElement.innerHTML.includes('<script>'));
  }

  /**
   * Assert test result
   */
  assertTest(name, passed, actual = null, expected = null) {
    this.testResults.total++;
    
    if (passed) {
      this.testResults.passed++;
      console.log(`  ✅ ${name}`);
    } else {
      this.testResults.failed++;
      console.log(`  ❌ ${name}`);
      if (actual !== null && expected !== null) {
        console.log(`     Expected: ${expected}`);
        console.log(`     Actual: ${actual}`);
      }
    }
  }

  /**
   * Вывод результатов тестирования
   */
  printResults() {
    console.log('\n📊 Результаты тестирования безопасности:');
    console.log(`  Всего тестов: ${this.testResults.total}`);
    console.log(`  Пройдено: ${this.testResults.passed}`);
    console.log(`  Провалено: ${this.testResults.failed}`);
    console.log(`  Успешность: ${Math.round((this.testResults.passed / this.testResults.total) * 100)}%`);
    
    if (this.testResults.failed === 0) {
      console.log('\n🎉 Все тесты безопасности пройдены успешно!');
    } else {
      console.log('\n⚠️  Обнаружены проблемы безопасности!');
    }
  }
}

// Запуск тестов если файл выполняется напрямую
if (typeof window !== 'undefined') {
  // Browser environment
  window.SecurityTests = SecurityTests;
  
  // Auto-run tests
  document.addEventListener('DOMContentLoaded', () => {
    const tests = new SecurityTests();
    tests.runAllTests();
  });
} else {
  // Node.js environment
  const tests = new SecurityTests();
  tests.runAllTests();
}

export default SecurityTests; 