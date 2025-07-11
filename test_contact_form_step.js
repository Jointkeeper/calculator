/**
 * ContactFormStep Test Environment
 * Comprehensive testing for Step 6 of Steamphony Marketing Budget Calculator
 * 
 * Test Coverage:
 * - Component initialization
 * - Form validation
 * - Calculation engine
 * - Analytics tracking
 * - Lead generation
 * - Success state
 * - Mobile responsiveness
 * - Accessibility
 */

// Test Configuration
const TEST_CONFIG = {
  timeout: 10000,
  retries: 3,
  mockData: {
    formData: {
      industry: { key: 'ecommerce', title: 'E-commerce' },
      businessSize: { key: 'medium', title: 'Средний бизнес (10-50 сотрудников)' },
      marketingBudget: { monthly: 150000 },
      marketingTools: { selected: ['google_ads', 'facebook_ads', 'yandex_direct'] },
      marketingTeam: { current: { id: 'inhouse', title: 'Внутренняя команда' } },
      gapAnalysis: {
        savings: {
          cost: { monthly: 45000, annual: 540000 },
          percentage: 30
        }
      }
    },
    contactData: {
      firstName: 'Иван',
      lastName: 'Петров',
      email: 'ivan.petrov@example.com',
      phone: '+7 (999) 123-45-67',
      company: 'ООО "Тестовая Компания"',
      position: 'Маркетинг-директор',
      message: 'Интересует полный анализ маркетингового бюджета',
      gdprConsent: true,
      marketingConsent: true
    }
  }
};

// Mock Analytics Service
class MockAnalytics {
  constructor() {
    this.events = [];
    this.trackEvent = (eventName, data) => {
      this.events.push({ eventName, data, timestamp: Date.now() });
      console.log(`📊 Analytics Event: ${eventName}`, data);
    };
  }
  
  getEvents() {
    return this.events;
  }
  
  clearEvents() {
    this.events = [];
  }
  
  hasEvent(eventName) {
    return this.events.some(event => event.eventName === eventName);
  }
}

// Mock Lead Generation Service
class MockLeadGeneration {
  constructor() {
    this.submissions = [];
    this.sheetsData = [];
    this.emailTemplates = [];
  }
  
  async submitToGoogleSheets(data) {
    this.sheetsData.push(data);
    console.log('📊 Google Sheets Submission:', data);
    return { success: true, id: `sheet_${Date.now()}` };
  }
  
  async sendEmailTemplate(data) {
    this.emailTemplates.push(data);
    console.log('📧 Email Template Sent:', data);
    return { success: true, id: `email_${Date.now()}` };
  }
  
  getSubmissions() {
    return {
      sheets: this.sheetsData,
      emails: this.emailTemplates
    };
  }
  
  clearSubmissions() {
    this.sheetsData = [];
    this.emailTemplates = [];
  }
}

// Test Suite
class ContactFormStepTestSuite {
  constructor() {
    this.analytics = new MockAnalytics();
    this.leadGeneration = new MockLeadGeneration();
    this.testResults = [];
    this.currentTest = null;
  }
  
  // Test Runner
  async runAllTests() {
    console.log('🚀 Starting ContactFormStep Test Suite...');
    console.log('=' .repeat(60));
    
    const tests = [
      'testComponentInitialization',
      'testCalculationEngine',
      'testFormValidation',
      'testAnalyticsTracking',
      'testLeadGeneration',
      'testSuccessState',
      'testMobileResponsiveness',
      'testAccessibility',
      'testEndToEndFlow'
    ];
    
    for (const testName of tests) {
      await this.runTest(testName);
    }
    
    this.generateTestReport();
  }
  
  async runTest(testName) {
    this.currentTest = testName;
    console.log(`\n🧪 Running Test: ${testName}`);
    console.log('-'.repeat(40));
    
    try {
      await this[testName]();
      this.testResults.push({
        test: testName,
        status: 'PASS',
        duration: Date.now() - this.startTime,
        error: null
      });
      console.log(`✅ ${testName} - PASSED`);
    } catch (error) {
      this.testResults.push({
        test: testName,
        status: 'FAIL',
        duration: Date.now() - this.startTime,
        error: error.message
      });
      console.log(`❌ ${testName} - FAILED: ${error.message}`);
    }
  }
  
  // Test 1: Component Initialization
  async testComponentInitialization() {
    this.startTime = Date.now();
    
    // Test ContactFormStep class exists
    if (typeof window.ContactFormStep === 'undefined') {
      throw new Error('ContactFormStep class not found');
    }
    
    // Test component creation
    const contactFormStep = new window.ContactFormStep({
      analytics: this.analytics,
      onSubmit: (data) => console.log('Form submitted:', data),
      onComplete: () => console.log('Calculator completed')
    });
    
    // Test required methods exist
    const requiredMethods = ['show', 'hide', 'updateWithFormData', 'validateForm', 'submitForm'];
    for (const method of requiredMethods) {
      if (typeof contactFormStep[method] !== 'function') {
        throw new Error(`Required method ${method} not found`);
      }
    }
    
    // Test component shows correctly
    contactFormStep.show();
    const element = document.querySelector('.contact-form-step');
    if (!element) {
      throw new Error('Contact form step element not found after show()');
    }
    
    // Test component hides correctly
    contactFormStep.hide();
    const hiddenElement = document.querySelector('.contact-form-step');
    if (hiddenElement && hiddenElement.style.display !== 'none') {
      throw new Error('Contact form step not hidden after hide()');
    }
  }
  
  // Test 2: Calculation Engine
  async testCalculationEngine() {
    this.startTime = Date.now();
    
    const contactFormStep = new window.ContactFormStep({
      analytics: this.analytics
    });
    
    // Test calculation with mock data
    contactFormStep.updateWithFormData(TEST_CONFIG.mockData.formData);
    
    // Verify calculation results exist
    if (!contactFormStep.calculationResults) {
      throw new Error('Calculation results not generated');
    }
    
    const results = contactFormStep.calculationResults;
    
    // Test savings calculations
    if (!results.savings || !results.savings.monthly || !results.savings.annual) {
      throw new Error('Savings calculations missing');
    }
    
    // Test ROI calculations
    if (!results.roi || !results.roi.month3 || !results.roi.month6 || !results.roi.month12) {
      throw new Error('ROI calculations missing');
    }
    
    // Test cost breakdown
    if (!results.costBreakdown || !results.costBreakdown.current || !results.costBreakdown.steamphony) {
      throw new Error('Cost breakdown missing');
    }
    
    // Verify calculations are reasonable
    if (results.savings.monthly <= 0) {
      throw new Error('Monthly savings should be positive');
    }
    
    if (results.roi.month12 <= 0) {
      throw new Error('12-month ROI should be positive');
    }
  }
  
  // Test 3: Form Validation
  async testFormValidation() {
    this.startTime = Date.now();
    
    const contactFormStep = new window.ContactFormStep({
      analytics: this.analytics
    });
    
    contactFormStep.show();
    
    // Test empty form validation
    const emptyValidation = contactFormStep.validateForm({});
    if (emptyValidation.isValid) {
      throw new Error('Empty form should not be valid');
    }
    
    // Test partial form validation
    const partialData = {
      firstName: 'Иван',
      email: 'invalid-email'
    };
    const partialValidation = contactFormStep.validateForm(partialData);
    if (partialValidation.isValid) {
      throw new Error('Form with invalid email should not be valid');
    }
    
    // Test valid form validation
    const validValidation = contactFormStep.validateForm(TEST_CONFIG.mockData.contactData);
    if (!validValidation.isValid) {
      throw new Error('Valid form data should pass validation');
    }
    
    // Test specific field validations
    const testCases = [
      { field: 'email', value: 'invalid', shouldBeValid: false },
      { field: 'email', value: 'test@example.com', shouldBeValid: true },
      { field: 'phone', value: '123', shouldBeValid: false },
      { field: 'phone', value: '+7 (999) 123-45-67', shouldBeValid: true },
      { field: 'firstName', value: '', shouldBeValid: false },
      { field: 'firstName', value: 'Иван', shouldBeValid: true }
    ];
    
    for (const testCase of testCases) {
      const testData = { ...TEST_CONFIG.mockData.contactData };
      testData[testCase.field] = testCase.value;
      
      const validation = contactFormStep.validateForm(testData);
      const fieldValid = !validation.errors[testCase.field];
      
      if (fieldValid !== testCase.shouldBeValid) {
        throw new Error(`Field ${testCase.field} validation failed for value "${testCase.value}"`);
      }
    }
  }
  
  // Test 4: Analytics Tracking
  async testAnalyticsTracking() {
    this.startTime = Date.now();
    
    this.analytics.clearEvents();
    
    const contactFormStep = new window.ContactFormStep({
      analytics: this.analytics
    });
    
    // Test step viewed event
    contactFormStep.show();
    await this.wait(100);
    
    if (!this.analytics.hasEvent('step_6_viewed')) {
      throw new Error('step_6_viewed analytics event not tracked');
    }
    
    // Test form interaction events
    const formData = { firstName: 'Test' };
    contactFormStep.updateWithFormData(formData);
    
    // Test form submission event
    await contactFormStep.submitForm(TEST_CONFIG.mockData.contactData);
    await this.wait(100);
    
    if (!this.analytics.hasEvent('contact_form_submitted')) {
      throw new Error('contact_form_submitted analytics event not tracked');
    }
    
    // Test completion event
    contactFormStep.onComplete();
    await this.wait(100);
    
    if (!this.analytics.hasEvent('calculator_completed')) {
      throw new Error('calculator_completed analytics event not tracked');
    }
    
    // Verify event data structure
    const events = this.analytics.getEvents();
    for (const event of events) {
      if (!event.eventName || !event.data || !event.timestamp) {
        throw new Error('Analytics event missing required fields');
      }
    }
  }
  
  // Test 5: Lead Generation
  async testLeadGeneration() {
    this.startTime = Date.now();
    
    this.leadGeneration.clearSubmissions();
    
    const contactFormStep = new window.ContactFormStep({
      analytics: this.analytics,
      leadGeneration: this.leadGeneration
    });
    
    // Test Google Sheets submission
    const sheetsResult = await contactFormStep.submitToGoogleSheets(TEST_CONFIG.mockData.contactData);
    if (!sheetsResult.success) {
      throw new Error('Google Sheets submission failed');
    }
    
    // Test email template sending
    const emailResult = await contactFormStep.sendEmailTemplate(TEST_CONFIG.mockData.contactData);
    if (!emailResult.success) {
      throw new Error('Email template sending failed');
    }
    
    // Verify submissions were recorded
    const submissions = this.leadGeneration.getSubmissions();
    if (submissions.sheets.length === 0) {
      throw new Error('Google Sheets submission not recorded');
    }
    
    if (submissions.emails.length === 0) {
      throw new Error('Email template not recorded');
    }
    
    // Verify data integrity
    const sheetsData = submissions.sheets[0];
    const emailData = submissions.emails[0];
    
    if (sheetsData.firstName !== TEST_CONFIG.mockData.contactData.firstName) {
      throw new Error('Google Sheets data integrity check failed');
    }
    
    if (emailData.email !== TEST_CONFIG.mockData.contactData.email) {
      throw new Error('Email template data integrity check failed');
    }
  }
  
  // Test 6: Success State
  async testSuccessState() {
    this.startTime = Date.now();
    
    const contactFormStep = new window.ContactFormStep({
      analytics: this.analytics
    });
    
    // Test success state display
    contactFormStep.showSuccessState(TEST_CONFIG.mockData.contactData);
    
    const successElement = document.querySelector('.success-section');
    if (!successElement) {
      throw new Error('Success section not displayed');
    }
    
    // Test success state content
    const successIcon = successElement.querySelector('.success-icon');
    if (!successIcon) {
      throw new Error('Success icon not found');
    }
    
    const successHeader = successElement.querySelector('.success-header h3');
    if (!successHeader || !successHeader.textContent.includes('Спасибо')) {
      throw new Error('Success header not found or incorrect');
    }
    
    // Test next steps timeline
    const timeline = successElement.querySelector('.timeline');
    if (!timeline) {
      throw new Error('Next steps timeline not found');
    }
    
    const timelineItems = timeline.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) {
      throw new Error('Timeline items not found');
    }
    
    // Test social sharing buttons
    const shareButtons = successElement.querySelectorAll('.share-btn');
    if (shareButtons.length === 0) {
      throw new Error('Social sharing buttons not found');
    }
    
    // Test additional resources
    const resources = successElement.querySelectorAll('.resource-link');
    if (resources.length === 0) {
      throw new Error('Additional resources not found');
    }
  }
  
  // Test 7: Mobile Responsiveness
  async testMobileResponsiveness() {
    this.startTime = Date.now();
    
    const contactFormStep = new window.ContactFormStep({
      analytics: this.analytics
    });
    
    contactFormStep.show();
    
    // Test mobile breakpoint (768px)
    await this.simulateMobileViewport(768);
    await this.wait(100);
    
    const mobileElement = document.querySelector('.contact-form-step');
    if (!mobileElement) {
      throw new Error('Contact form step not visible on mobile');
    }
    
    // Test small mobile breakpoint (480px)
    await this.simulateMobileViewport(480);
    await this.wait(100);
    
    const smallMobileElement = document.querySelector('.contact-form-step');
    if (!smallMobileElement) {
      throw new Error('Contact form step not visible on small mobile');
    }
    
    // Test touch targets
    const touchTargets = document.querySelectorAll('input, textarea, button, .share-btn, .resource-link');
    for (const target of touchTargets) {
      const rect = target.getBoundingClientRect();
      if (rect.height < 44 || rect.width < 44) {
        throw new Error(`Touch target too small: ${target.tagName}`);
      }
    }
    
    // Reset viewport
    await this.resetViewport();
  }
  
  // Test 8: Accessibility
  async testAccessibility() {
    this.startTime = Date.now();
    
    const contactFormStep = new window.ContactFormStep({
      analytics: this.analytics
    });
    
    contactFormStep.show();
    
    // Test form labels
    const inputs = document.querySelectorAll('input, textarea');
    for (const input of inputs) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label && input.type !== 'hidden') {
        throw new Error(`Input ${input.name} missing label`);
      }
    }
    
    // Test ARIA attributes
    const form = document.querySelector('.contact-form');
    if (!form.getAttribute('aria-label') && !form.getAttribute('aria-labelledby')) {
      throw new Error('Form missing ARIA label');
    }
    
    // Test error messages
    const errorMessages = document.querySelectorAll('.error-message');
    for (const error of errorMessages) {
      if (!error.getAttribute('role') || error.getAttribute('role') !== 'alert') {
        throw new Error('Error messages should have role="alert"');
      }
    }
    
    // Test keyboard navigation
    const focusableElements = document.querySelectorAll('input, textarea, button, a, select');
    for (const element of focusableElements) {
      if (element.tabIndex < 0 && !element.disabled) {
        throw new Error(`Focusable element ${element.tagName} has negative tabIndex`);
      }
    }
    
    // Test color contrast (basic check)
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, label');
    for (const element of textElements) {
      const style = window.getComputedStyle(element);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      
      if (color === backgroundColor) {
        throw new Error(`Text color same as background: ${element.tagName}`);
      }
    }
  }
  
  // Test 9: End-to-End Flow
  async testEndToEndFlow() {
    this.startTime = Date.now();
    
    this.analytics.clearEvents();
    this.leadGeneration.clearSubmissions();
    
    const contactFormStep = new window.ContactFormStep({
      analytics: this.analytics,
      leadGeneration: this.leadGeneration,
      onSubmit: (data) => console.log('E2E: Form submitted', data),
      onComplete: () => console.log('E2E: Calculator completed')
    });
    
    // Step 1: Show component
    contactFormStep.show();
    await this.wait(100);
    
    // Step 2: Update with form data
    contactFormStep.updateWithFormData(TEST_CONFIG.mockData.formData);
    await this.wait(100);
    
    // Step 3: Fill contact form
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    for (const input of formInputs) {
      if (input.name && TEST_CONFIG.mockData.contactData[input.name]) {
        input.value = TEST_CONFIG.mockData.contactData[input.name];
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    
    // Step 4: Check checkboxes
    const checkboxes = document.querySelectorAll('.contact-form input[type="checkbox"]');
    for (const checkbox of checkboxes) {
      if (checkbox.name === 'gdprConsent' || checkbox.name === 'marketingConsent') {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    
    await this.wait(100);
    
    // Step 5: Submit form
    const submitButton = document.querySelector('.btn-submit');
    if (submitButton) {
      submitButton.click();
      await this.wait(500);
    }
    
    // Step 6: Verify success state
    const successSection = document.querySelector('.success-section');
    if (!successSection) {
      throw new Error('Success section not displayed after form submission');
    }
    
    // Step 7: Verify analytics events
    const expectedEvents = ['step_6_viewed', 'contact_form_submitted', 'calculator_completed'];
    for (const eventName of expectedEvents) {
      if (!this.analytics.hasEvent(eventName)) {
        throw new Error(`Expected analytics event ${eventName} not tracked`);
      }
    }
    
    // Step 8: Verify lead generation
    const submissions = this.leadGeneration.getSubmissions();
    if (submissions.sheets.length === 0 || submissions.emails.length === 0) {
      throw new Error('Lead generation not triggered');
    }
    
    console.log('✅ End-to-end flow completed successfully');
  }
  
  // Utility Methods
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async simulateMobileViewport(width) {
    // Simulate mobile viewport by setting container width
    const container = document.querySelector('#calculator-container');
    if (container) {
      container.style.width = `${width}px`;
      container.style.maxWidth = `${width}px`;
    }
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
  }
  
  async resetViewport() {
    const container = document.querySelector('#calculator-container');
    if (container) {
      container.style.width = '';
      container.style.maxWidth = '';
    }
    window.dispatchEvent(new Event('resize'));
  }
  
  // Test Report Generation
  generateTestReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 CONTACT FORM STEP TEST REPORT');
    console.log('='.repeat(60));
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.status === 'PASS').length;
    const failedTests = this.testResults.filter(r => r.status === 'FAIL').length;
    
    console.log(`\n📈 Test Summary:`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${passedTests} ✅`);
    console.log(`   Failed: ${failedTests} ❌`);
    console.log(`   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (failedTests > 0) {
      console.log(`\n❌ Failed Tests:`);
      this.testResults
        .filter(r => r.status === 'FAIL')
        .forEach(result => {
          console.log(`   - ${result.test}: ${result.error}`);
        });
    }
    
    console.log(`\n✅ Passed Tests:`);
    this.testResults
      .filter(r => r.status === 'PASS')
      .forEach(result => {
        console.log(`   - ${result.test} (${result.duration}ms)`);
      });
    
    // Analytics Summary
    const analyticsEvents = this.analytics.getEvents();
    console.log(`\n📊 Analytics Events Tracked: ${analyticsEvents.length}`);
    analyticsEvents.forEach(event => {
      console.log(`   - ${event.eventName}`);
    });
    
    // Lead Generation Summary
    const submissions = this.leadGeneration.getSubmissions();
    console.log(`\n📧 Lead Generation:`);
    console.log(`   Google Sheets: ${submissions.sheets.length} submissions`);
    console.log(`   Email Templates: ${submissions.emails.length} sent`);
    
    console.log('\n' + '='.repeat(60));
    
    if (failedTests === 0) {
      console.log('🎉 ALL TESTS PASSED! ContactFormStep is ready for production!');
    } else {
      console.log('⚠️  Some tests failed. Please review and fix issues before deployment.');
    }
    
    console.log('='.repeat(60));
  }
}

// Test Environment Setup
function setupTestEnvironment() {
  console.log('🔧 Setting up ContactFormStep Test Environment...');
  
  // Create test container if not exists
  if (!document.querySelector('#calculator-container')) {
    const container = document.createElement('div');
    container.id = 'calculator-container';
    container.style.cssText = `
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    document.body.appendChild(container);
  }
  
  // Create form content container
  if (!document.querySelector('#form-content')) {
    const formContent = document.createElement('div');
    formContent.id = 'form-content';
    document.querySelector('#calculator-container').appendChild(formContent);
  }
  
  // Load required CSS
  if (!document.querySelector('#test-styles')) {
    const link = document.createElement('link');
    link.id = 'test-styles';
    link.rel = 'stylesheet';
    link.href = 'src/styles/main.css';
    document.head.appendChild(link);
  }
  
  console.log('✅ Test environment ready');
}

// Run Tests
async function runContactFormStepTests() {
  setupTestEnvironment();
  
  const testSuite = new ContactFormStepTestSuite();
  await testSuite.runAllTests();
  
  return testSuite.testResults;
}

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ContactFormStepTestSuite,
    MockAnalytics,
    MockLeadGeneration,
    runContactFormStepTests,
    TEST_CONFIG
  };
}

// Auto-run if loaded in browser
if (typeof window !== 'undefined') {
  window.runContactFormStepTests = runContactFormStepTests;
  
  // Run tests when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runContactFormStepTests);
  } else {
    runContactFormStepTests();
  }
} 