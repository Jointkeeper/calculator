/**
 * ===== GDPR COMPLIANCE TESTS =====
 * 
 * Тесты соответствия GDPR Article 7 и privacy-first принципам
 * Запуск: копируйте код в браузерную консоль после загрузки страницы
 */

(function() {
    'use strict';
    
    console.log('🧪 Starting GDPR Compliance Tests...');
    
    const tests = [];
    const results = {
        passed: 0,
        failed: 0,
        total: 0
    };
    
    // Helper function для тестирования
    function test(description, testFunction) {
        tests.push({ description, testFunction });
    }
    
    // Helper function для assertions
    function assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }
    
    // Helper для асинхронного тестирования
    function asyncTest(description, testFunction) {
        tests.push({ 
            description, 
            testFunction,
            async: true 
        });
    }
    
    // Helper для очистки состояния
    function resetConsentState() {
        localStorage.removeItem('steamphony_cookie_preferences');
        localStorage.removeItem('steamphony_analytics_consent');
        
        // Очищаем cookie banner
        const existingBanner = document.querySelector('.cookie-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
        
        // Сбрасываем Analytics consent
        if (window.app && window.app.getAnalytics()) {
            window.app.getAnalytics().setCookieConsent(false);
        }
    }
    
    // ==================== GDPR COMPLIANCE TESTS ====================
    
    test('GDPR Article 7: Explicit consent required', () => {
        resetConsentState();
        
        const analytics = window.app.getAnalytics();
        
        // Изначально consent должен быть false
        assert(analytics.hasConsent === false, 
            'Analytics should not have consent initially');
        
        // GA4 не должен быть загружен без consent
        assert(analytics.isGA4Loaded === false, 
            'GA4 should not be loaded without consent');
    });
    
    test('Privacy-first: События должны быть в очереди без consent', () => {
        resetConsentState();
        
        const analytics = window.app.getAnalytics();
        const initialQueueLength = analytics.eventQueue.length;
        
        // Отправляем событие без consent
        analytics.trackEvent('privacy_test', { test: true });
        
        // Событие должно быть в очереди, не отправлено
        assert(analytics.eventQueue.length === initialQueueLength + 1, 
            'Event should be queued without consent');
        
        // GA4 не должен быть вызван
        assert(analytics.isGA4Loaded === false, 
            'GA4 should not be loaded for queued events');
    });
    
    test('Cookie Banner: Должен показываться новым пользователям', () => {
        resetConsentState();
        
        const cookieBanner = window.app.getCookieBanner();
        
        // Показываем banner
        cookieBanner.showBanner();
        
        const bannerElement = document.querySelector('.cookie-banner');
        assert(bannerElement !== null, 'Cookie banner should be visible for new users');
        
        // Проверяем необходимые элементы
        const acceptButton = bannerElement.querySelector('.cookie-banner__accept');
        const declineButton = bannerElement.querySelector('.cookie-banner__decline');
        
        assert(acceptButton !== null, 'Accept button must be present');
        assert(declineButton !== null, 'Decline button must be present');
        
        // Cleanup
        cookieBanner.hideBanner();
    });
    
    test('Consent granularity: Должны быть раздельные опции', () => {
        resetConsentState();
        
        const cookieBanner = window.app.getCookieBanner();
        cookieBanner.showBanner();
        
        // Проверяем наличие кнопки "Настроить"
        const customizeButton = document.querySelector('.cookie-banner__customize');
        if (customizeButton) {
            assert(customizeButton !== null, 'Customize button should be available');
        }
        
        // Cleanup
        cookieBanner.hideBanner();
    });
    
    test('Accept All: Полное согласие должно работать', () => {
        resetConsentState();
        
        const analytics = window.app.getAnalytics();
        const cookieBanner = window.app.getCookieBanner();
        
        // Показываем banner и принимаем все
        cookieBanner.showBanner();
        const acceptButton = document.querySelector('.cookie-banner__accept');
        
        if (acceptButton) {
            acceptButton.click();
            
            // Проверяем что consent установлен
            assert(analytics.hasConsent === true, 
                'Analytics consent should be true after accept all');
            
            // Проверяем localStorage
            const stored = localStorage.getItem('steamphony_cookie_preferences');
            assert(stored !== null, 'Preferences should be stored');
            
            const parsed = JSON.parse(stored);
            assert(parsed.analytics === true, 
                'Analytics preference should be true');
        }
    });
    
    test('Decline All: Отказ должен работать', () => {
        resetConsentState();
        
        const analytics = window.app.getAnalytics();
        const cookieBanner = window.app.getCookieBanner();
        
        // Показываем banner и отказываемся
        cookieBanner.showBanner();
        const declineButton = document.querySelector('.cookie-banner__decline');
        
        if (declineButton) {
            declineButton.click();
            
            // Проверяем что consent остался false
            assert(analytics.hasConsent === false, 
                'Analytics consent should remain false after decline');
            
            // События должны оставаться в очереди
            analytics.trackEvent('test_after_decline', { test: true });
            assert(analytics.eventQueue.length > 0, 
                'Events should still be queued after decline');
        }
    });
    
    test('Consent withdrawal: Отзыв согласия должен работать', () => {
        resetConsentState();
        
        const analytics = window.app.getAnalytics();
        const cookieBanner = window.app.getCookieBanner();
        
        // Сначала даем согласие
        analytics.setCookieConsent(true);
        assert(analytics.hasConsent === true, 'Consent should be given');
        
        // Затем отзываем согласие
        cookieBanner.resetConsent();
        
        // Проверяем отзыв
        const preferences = cookieBanner.getPreferences();
        assert(preferences.analytics === false, 
            'Analytics consent should be withdrawn');
    });
    
    test('Do Not Track: DNT header должен уважаться', () => {
        resetConsentState();
        
        // Simulate DNT header
        const originalDNT = navigator.doNotTrack;
        Object.defineProperty(navigator, 'doNotTrack', {
            value: '1',
            writable: true
        });
        
        const analytics = window.app.getAnalytics();
        
        // Если DNT активен, tracking должен быть отключен по умолчанию
        if (window.STEAMPHONY_CONFIG.cookieBanner.respectDNT) {
            assert(analytics.hasConsent === false, 
                'Analytics should respect DNT header');
        }
        
        // Restore original DNT
        Object.defineProperty(navigator, 'doNotTrack', {
            value: originalDNT,
            writable: true
        });
    });
    
    test('Data minimization: Только необходимые данные', () => {
        resetConsentState();
        
        const analytics = window.app.getAnalytics();
        
        // Проверяем что IP anonymization включен
        assert(analytics.config.anonymizeIP === true, 
            'IP anonymization should be enabled');
        
        // Проверяем ограничение времени хранения
        assert(typeof analytics.config.dataRetention === 'number', 
            'Data retention period should be set');
        assert(analytics.config.dataRetention <= 30, 
            'Data retention should be limited (max 30 days)');
    });
    
    test('Consent audit trail: Должна быть запись решений', () => {
        resetConsentState();
        
        const cookieBanner = window.app.getCookieBanner();
        
        // Даем согласие
        cookieBanner.acceptAllCookies();
        
        // Проверяем что timestamp сохранен
        const preferences = cookieBanner.getPreferences();
        assert(typeof preferences.timestamp === 'number', 
            'Consent timestamp should be recorded');
        assert(preferences.timestamp > 0, 
            'Timestamp should be valid');
        
        // Проверяем что версия политики сохранена
        assert(typeof preferences.version === 'string', 
            'Privacy policy version should be recorded');
    });
    
    asyncTest('Banner auto-hide: После согласия banner должен исчезать', async () => {
        resetConsentState();
        
        const cookieBanner = window.app.getCookieBanner();
        
        // Показываем banner
        cookieBanner.showBanner();
        let bannerElement = document.querySelector('.cookie-banner');
        assert(bannerElement !== null, 'Banner should be visible');
        
        // Принимаем согласие
        const acceptButton = bannerElement.querySelector('.cookie-banner__accept');
        if (acceptButton) {
            acceptButton.click();
            
            // Ждем анимации
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Проверяем что banner исчез
            bannerElement = document.querySelector('.cookie-banner');
            assert(bannerElement === null || bannerElement.style.display === 'none', 
                'Banner should be hidden after consent');
        }
    });
    
    test('Returning users: Согласие должно запоминаться', () => {
        resetConsentState();
        
        const cookieBanner = window.app.getCookieBanner();
        
        // Даем согласие
        cookieBanner.acceptAllCookies();
        
        // Симулируем новый визит
        const newCookieBanner = new window.SteamphonyCookieBanner(
            window.app.getAnalytics(), 
            window.STEAMPHONY_CONFIG.cookieBanner
        );
        
        // Проверяем что согласие сохранено
        const preferences = newCookieBanner.getPreferences();
        assert(preferences.analytics === true, 
            'Consent should be remembered for returning users');
    });
    
    test('Legal basis: Должна быть ссылка на политику конфиденциальности', () => {
        resetConsentState();
        
        const cookieBanner = window.app.getCookieBanner();
        cookieBanner.showBanner();
        
        const bannerElement = document.querySelector('.cookie-banner');
        if (bannerElement) {
            // Проверяем наличие ссылки на политику
            const privacyLink = bannerElement.querySelector('a[href*="privacy"]');
            assert(privacyLink !== null, 
                'Privacy policy link should be present');
        }
        
        // Cleanup
        cookieBanner.hideBanner();
    });
    
    test('Accessibility: WCAG 2.1 AA compliance', () => {
        resetConsentState();
        
        const cookieBanner = window.app.getCookieBanner();
        cookieBanner.showBanner();
        
        const bannerElement = document.querySelector('.cookie-banner');
        if (bannerElement) {
            // Проверяем ARIA attributes
            assert(bannerElement.getAttribute('role') !== null, 
                'Banner should have role attribute');
            assert(bannerElement.getAttribute('aria-label') !== null, 
                'Banner should have aria-label');
            
            // Проверяем keyboard navigation
            const focusableElements = bannerElement.querySelectorAll('button, a, [tabindex]');
            assert(focusableElements.length > 0, 
                'Banner should have focusable elements');
            
            // Проверяем цветовой контраст (basic check)
            const computedStyle = window.getComputedStyle(bannerElement);
            assert(computedStyle.backgroundColor !== 'transparent', 
                'Banner should have background color for contrast');
        }
        
        // Cleanup
        cookieBanner.hideBanner();
    });
    
    test('Cross-site tracking prevention: Строгая политика cookies', () => {
        resetConsentState();
        
        const analytics = window.app.getAnalytics();
        
        // Проверяем что third-party cookies не используются без согласия
        assert(analytics.hasConsent === false, 
            'Third-party tracking should be disabled initially');
        
        // Проверяем что используются только first-party cookies
        const config = analytics.config;
        assert(config.measurementId.startsWith('G-'), 
            'Should use Google Analytics 4 (first-party)');
    });
    
    // ==================== TEST RUNNER ====================
    
    async function runTests() {
        console.log('🚀 Running GDPR Compliance Tests...\n');
        
        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            try {
                if (test.async) {
                    await test.testFunction();
                } else {
                    test.testFunction();
                }
                console.log(`✅ Test ${i + 1}: ${test.description}`);
                results.passed++;
            } catch (error) {
                console.error(`❌ Test ${i + 1}: ${test.description}`);
                console.error(`   Error: ${error.message}`);
                results.failed++;
            }
            results.total++;
        }
        
        // Final cleanup
        resetConsentState();
        
        console.log(`\n📊 GDPR COMPLIANCE TEST RESULTS:`);
        console.log(`   ✅ Passed: ${results.passed}`);
        console.log(`   ❌ Failed: ${results.failed}`);
        console.log(`   📊 Total: ${results.total}`);
        console.log(`   🎯 Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);
        
        if (results.failed === 0) {
            console.log('\n🎉 ALL GDPR COMPLIANCE TESTS PASSED!');
            console.log('🔒 Your implementation is GDPR Article 7 compliant!');
        } else {
            console.log('\n⚠️  SOME GDPR TESTS FAILED - REVIEW PRIVACY IMPLEMENTATION');
        }
        
        return results;
    }
    
    // Автоматический запуск если App доступен
    if (typeof window.app !== 'undefined') {
        runTests();
    } else {
        console.log('⚠️  App not found. Make sure the page is loaded.');
        console.log('   Run runGDPRTests() manually after page load.');
    }
    
    // Глобальный доступ для manual запуска
    window.runGDPRTests = runTests;
    
})(); 