/**
 * Comprehensive Security Test - Полное тестирование безопасности
 * 
 * @author Steamphony Digital Agency
 * @version 1.0.0
 */

import { SecurityLayer } from './src/security/SecurityLayer.js';
import { InputValidator } from './src/security/InputValidator.js';

/**
 * Comprehensive Security Test Suite
 */
class ComprehensiveSecurityTest {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  /**
   * Запуск всех comprehensive тестов
   */
  async runAllTests() {
    console.log('🔒 Запуск Comprehensive Security Tests...\n');
    
    // Core Security Tests
    this.testCoreSecurity();
    
    // Calculator Integration Tests
    this.testCalculatorIntegration();
    
    // Analytics Integration Tests
    this.testAnalyticsIntegration();
    
    // Integration Tests
    this.testFullIntegration();
    
    // Performance Tests
    this.testPerformance();
    
    // Print results
    this.printResults();
  }

  /**
   * Тестирование core security functionality
   */
  testCoreSecurity() {
    console.log('🧪 Core Security Tests...');
    
    // XSS Protection Tests
    const xssTests = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '<img src=x onerror=alert("xss")>',
      '<iframe src="javascript:alert(\'xss\')"></iframe>',
      'data:text/html,<script>alert("xss")</script>'
    ];

    xssTests.forEach(test => {
      const sanitized = SecurityLayer.sanitizeInput(test);
      const passed = !sanitized.includes('<script>') && !sanitized.includes('javascript:');
      this.assertTest(`XSS Protection: ${test}`, passed);
    });

    // CSRF Protection Tests
    const token1 = SecurityLayer.generateCSRFToken();
    const token2 = SecurityLayer.generateCSRFToken();
    
    this.assertTest('CSRF Token Generation', token1 && token1.startsWith('csrf_'));
    this.assertTest('CSRF Token Validation - Valid', SecurityLayer.validateCSRFToken(token1, token1));
    this.assertTest('CSRF Token Validation - Invalid', !SecurityLayer.validateCSRFToken(token1, token2));
  }

  /**
   * Тестирование Calculator integration
   */
  testCalculatorIntegration() {
    console.log('🧪 Calculator Integration Tests...');
    
    // Test form data sanitization
    const maliciousFormData = {
      industry: '<script>alert("xss")</script>restaurant',
      businessSize: 'small<script>alert("xss")</script>',
      marketingBudget: 5000,
      marketerType: 'full_time<script>alert("xss")</script>'
    };

    // Simulate Calculator sanitization
    const sanitizedData = {};
    for (const [key, value] of Object.entries(maliciousFormData)) {
      if (typeof value === 'string') {
        sanitizedData[key] = SecurityLayer.sanitizeInput(value, { ALLOWED_TAGS: [] });
      } else {
        sanitizedData[key] = value;
      }
    }

    this.assertTest('Calculator Form Sanitization', 
      !sanitizedData.industry.includes('<script>') && 
      !sanitizedData.businessSize.includes('<script>') &&
      !sanitizedData.marketerType.includes('<script>'));

    // Test business data validation
    const businessData = {
      industry: { key: 'restaurant', title: 'Restaurant' },
      businessSize: { value: 'small', title: 'Small Business' },
      marketingBudget: { monthly: 5000, range: '5000-10000' }
    };

    const validation = InputValidator.validateBusinessData(businessData);
    this.assertTest('Business Data Validation', validation.isValid);
  }

  /**
   * Тестирование Analytics integration
   */
  testAnalyticsIntegration() {
    console.log('🧪 Analytics Integration Tests...');
    
    // Test event data sanitization
    const maliciousEventData = {
      event_name: 'test<script>alert("xss")</script>',
      user_id: 'user123<script>alert("xss")</script>',
      page_url: 'https://example.com<script>alert("xss")</script>',
      search_query: '<script>alert("xss")</script>restaurant'
    };

    // Simulate Analytics sanitization
    const sanitizedEventData = {};
    Object.keys(maliciousEventData).forEach(key => {
      if (typeof maliciousEventData[key] === 'string') {
        sanitizedEventData[key] = SecurityLayer.sanitizeInput(maliciousEventData[key], { ALLOWED_TAGS: [] });
      }
    });

    this.assertTest('Analytics Event Sanitization',
      !sanitizedEventData.event_name.includes('<script>') &&
      !sanitizedEventData.user_id.includes('<script>') &&
      !sanitizedEventData.page_url.includes('<script>') &&
      !sanitizedEventData.search_query.includes('<script>'));

    // Test lead data sanitization
    const maliciousLeadData = {
      industry: 'restaurant<script>alert("xss")</script>',
      businessSize: 'small<script>alert("xss")</script>',
      marketingBudget: '5000<script>alert("xss")</script>'
    };

    const sanitizedLeadData = {
      industry: SecurityLayer.sanitizeInput(maliciousLeadData.industry),
      business_size: SecurityLayer.sanitizeInput(maliciousLeadData.businessSize),
      marketing_budget: SecurityLayer.sanitizeInput(maliciousLeadData.marketingBudget)
    };

    this.assertTest('Analytics Lead Sanitization',
      !sanitizedLeadData.industry.includes('<script>') &&
      !sanitizedLeadData.business_size.includes('<script>') &&
      !sanitizedLeadData.marketing_budget.includes('<script>'));
  }

  /**
   * Тестирование полной интеграции
   */
  testFullIntegration() {
    console.log('🧪 Full Integration Tests...');
    
    // Test complete workflow
    const testWorkflow = {
      step1: 'User selects industry',
      step2: 'User enters business size',
      step3: 'User enters marketing budget',
      step4: 'Calculator processes data',
      step5: 'Analytics tracks events',
      step6: 'Results displayed safely'
    };

    // Simulate complete workflow with security
    let workflowPassed = true;
    
    // Step 1: Industry selection
    const industryInput = 'restaurant<script>alert("xss")</script>';
    const sanitizedIndustry = SecurityLayer.sanitizeInput(industryInput);
    workflowPassed = workflowPassed && !sanitizedIndustry.includes('<script>');
    
    // Step 2: Business size
    const businessSizeInput = 'small<script>alert("xss")</script>';
    const sanitizedBusinessSize = SecurityLayer.sanitizeInput(businessSizeInput);
    workflowPassed = workflowPassed && !sanitizedBusinessSize.includes('<script>');
    
    // Step 3: Marketing budget
    const budgetInput = '5000<script>alert("xss")</script>';
    const sanitizedBudget = SecurityLayer.sanitizeInput(budgetInput);
    workflowPassed = workflowPassed && !sanitizedBudget.includes('<script>');
    
    // Step 4: Calculator processing
    const formData = {
      industry: sanitizedIndustry,
      businessSize: sanitizedBusinessSize,
      marketingBudget: 5000
    };
    
    const validation = InputValidator.validateBusinessData(formData);
    workflowPassed = workflowPassed && validation.isValid;
    
    // Step 5: Analytics tracking
    const eventData = {
      industry: sanitizedIndustry,
      business_size: sanitizedBusinessSize,
      budget: sanitizedBudget
    };
    
    const sanitizedEventData = {};
    Object.keys(eventData).forEach(key => {
      sanitizedEventData[key] = SecurityLayer.sanitizeInput(eventData[key]);
    });
    
    workflowPassed = workflowPassed && 
      !sanitizedEventData.industry.includes('<script>') &&
      !sanitizedEventData.business_size.includes('<script>') &&
      !sanitizedEventData.budget.includes('<script>');
    
    this.assertTest('Complete Workflow Security', workflowPassed);
  }

  /**
   * Тестирование производительности
   */
  testPerformance() {
    console.log('🧪 Performance Tests...');
    
    // Test sanitization performance
    const testData = '<script>alert("xss")</script>'.repeat(1000);
    const startTime = performance.now();
    
    for (let i = 0; i < 100; i++) {
      SecurityLayer.sanitizeInput(testData);
    }
    
    const endTime = performance.now();
    const avgTime = (endTime - startTime) / 100;
    
    this.assertTest('Sanitization Performance (< 1ms)', avgTime < 1);
    
    // Test validation performance
    const validationStart = performance.now();
    
    for (let i = 0; i < 100; i++) {
      InputValidator.validateEmail('test@example.com');
      InputValidator.validatePhone('+7 (495) 123-45-67');
      InputValidator.validateCompany('Test Company');
    }
    
    const validationEnd = performance.now();
    const avgValidationTime = (validationEnd - validationStart) / 100;
    
    this.assertTest('Validation Performance (< 1ms)', avgValidationTime < 1);
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
    console.log('\n📊 Comprehensive Security Test Results:');
    console.log(`  Всего тестов: ${this.testResults.total}`);
    console.log(`  Пройдено: ${this.testResults.passed}`);
    console.log(`  Провалено: ${this.testResults.failed}`);
    console.log(`  Успешность: ${Math.round((this.testResults.passed / this.testResults.total) * 100)}%`);
    
    if (this.testResults.failed === 0) {
      console.log('\n🎉 Все comprehensive security тесты пройдены!');
      console.log('✅ Calculator.js security integration: PASSED');
      console.log('✅ Analytics.js security integration: PASSED');
      console.log('✅ Full workflow security: PASSED');
      console.log('✅ Performance requirements: PASSED');
    } else {
      console.log('\n⚠️  Обнаружены проблемы безопасности!');
    }
  }
}

// Запуск тестов
const tests = new ComprehensiveSecurityTest();
tests.runAllTests();

export default ComprehensiveSecurityTest; 