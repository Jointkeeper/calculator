/**
 * ===== INTEGRATION TESTS =====
 * 
 * Тесты интеграции Analytics.js + CookieBanner.js + main.js
 * Запуск: копируйте код в браузерную консоль после загрузки страницы
 */

(function() {
    'use strict';
    
    console.log('🧪 Starting Integration Tests...');
    
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
    
    // ==================== INTEGRATION TESTS ====================
    
    test('App instance должен существовать', () => {
        assert(typeof window.app === 'object', 'App instance not found in window.app');
        assert(window.app !== null, 'App instance is null');
    });
    
    test('Оригинальные компоненты должны быть доступны', () => {
        assert(typeof window.app.progressBar === 'object', 
            'ProgressBar component not available');
        assert(typeof window.app.industrySelector === 'object', 
            'IndustrySelector component not available');
        assert(typeof window.app.calculator === 'object', 
            'Calculator component not available');
    });
    
    test('Новые analytics методы должны быть добавлены', () => {
        assert(typeof window.app.getAnalytics === 'function', 
            'getAnalytics method not found');
        assert(typeof window.app.getCookieBanner === 'function', 
            'getCookieBanner method not found');
        assert(typeof window.app.setCookieConsent === 'function', 
            'setCookieConsent method not found');
        assert(typeof window.app.resetCookieConsent === 'function', 
            'resetCookieConsent method not found');
    });
    
    test('Analytics должен быть инициализирован', () => {
        const analytics = window.app.getAnalytics();
        assert(analytics !== null, 'Analytics not initialized');
        assert(typeof analytics.trackEvent === 'function', 
            'Analytics trackEvent method missing');
        assert(typeof analytics.setCookieConsent === 'function', 
            'Analytics setCookieConsent method missing');
    });
    
    test('CookieBanner должен быть инициализирован', () => {
        const cookieBanner = window.app.getCookieBanner();
        assert(cookieBanner !== null, 'CookieBanner not initialized');
        assert(typeof cookieBanner.showBanner === 'function', 
            'CookieBanner showBanner method missing');
        assert(typeof cookieBanner.getPreferences === 'function', 
            'CookieBanner getPreferences method missing');
    });
    
    test('getAppState должен включать analytics данные', () => {
        const appState = window.app.getAppState();
        
        assert(typeof appState === 'object', 'App state should be object');
        assert(typeof appState.components === 'object', 'Components state missing');
        assert(typeof appState.components.analytics === 'boolean', 
            'Analytics component state missing');
        assert(typeof appState.components.cookieBanner === 'boolean', 
            'CookieBanner component state missing');
        assert(typeof appState.analytics === 'object', 
            'Analytics state missing');
        assert(typeof appState.cookieBanner === 'object', 
            'CookieBanner state missing');
    });
    
    test('Оригинальная навигация должна работать', () => {
        const originalStep = window.app.currentStep;
        
        // Test nextStep
        window.app.nextStep();
        assert(window.app.currentStep === originalStep + 1, 
            'nextStep not working after integration');
        
        // Test previousStep
        window.app.previousStep();
        assert(window.app.currentStep === originalStep, 
            'previousStep not working after integration');
    });
    
    test('Analytics должен отслеживать навигацию', () => {
        const analytics = window.app.getAnalytics();
        const initialQueueLength = analytics.eventQueue.length;
        
        // Trigger navigation
        window.app.nextStep();
        
        // Проверяем что события добавлены в очередь
        assert(analytics.eventQueue.length > initialQueueLength, 
            'Navigation events not tracked');
        
        // Return to original state
        window.app.previousStep();
    });
    
    test('STEAMPHONY_CONFIG должен быть доступен', () => {
        assert(typeof window.STEAMPHONY_CONFIG === 'object', 
            'STEAMPHONY_CONFIG not found');
        assert(typeof window.STEAMPHONY_CONFIG.analytics === 'object', 
            'Analytics config missing');
        assert(typeof window.STEAMPHONY_CONFIG.cookieBanner === 'object', 
            'CookieBanner config missing');
    });
    
    test('Global classes должны быть доступны', () => {
        assert(typeof window.SteamphonyAnalytics === 'function', 
            'SteamphonyAnalytics class not global');
        assert(typeof window.SteamphonyCookieBanner === 'function', 
            'SteamphonyCookieBanner class not global');
    });
    
    test('Analytics и CookieBanner должны быть связаны', () => {
        const analytics = window.app.getAnalytics();
        const cookieBanner = window.app.getCookieBanner();
        
        // Проверяем что CookieBanner может управлять Analytics
        const initialConsent = analytics.hasConsent;
        
        // Через CookieBanner
        cookieBanner.acceptAllCookies();
        assert(analytics.hasConsent === true, 
            'CookieBanner not controlling Analytics consent');
        
        // Восстанавливаем состояние
        analytics.setCookieConsent(initialConsent);
    });
    
    test('Error handling должен работать gracefully', () => {
        // Сохраняем оригинальный метод
        const originalTrackEvent = window.app.getAnalytics().trackEvent;
        
        // Ломаем метод
        window.app.getAnalytics().trackEvent = function() {
            throw new Error('Intentional test error');
        };
        
        // Проверяем что приложение не падает
        try {
            window.app.nextStep();
            window.app.previousStep();
            assert(true, 'App continues working despite analytics error');
        } catch (error) {
            assert(false, 'App crashed due to analytics error: ' + error.message);
        }
        
        // Восстанавливаем метод
        window.app.getAnalytics().trackEvent = originalTrackEvent;
    });
    
    test('LocalStorage integration должен работать', () => {
        const cookieBanner = window.app.getCookieBanner();
        
        // Очищаем localStorage
        localStorage.removeItem('steamphony_cookie_preferences');
        
        // Устанавливаем preference
        cookieBanner.acceptAllCookies();
        
        // Проверяем сохранение
        const stored = localStorage.getItem('steamphony_cookie_preferences');
        assert(stored !== null, 'Preferences not saved to localStorage');
        
        const parsed = JSON.parse(stored);
        assert(parsed.analytics === true, 'Analytics preference not saved correctly');
    });
    
    test('Responsive design classes должны быть применены', () => {
        const cookieBanner = window.app.getCookieBanner();
        
        // Показываем banner
        cookieBanner.showBanner();
        
        const bannerElement = document.querySelector('.cookie-banner');
        if (bannerElement) {
            // Проверяем responsive classes
            const computedStyle = window.getComputedStyle(bannerElement);
            assert(computedStyle.position === 'fixed', 
                'Banner should be fixed positioned');
            
            // Cleanup
            cookieBanner.hideBanner();
        }
    });
    
    test('Event listeners должны быть правильно подключены', () => {
        const analytics = window.app.getAnalytics();
        
        // Проверяем что components подключены
        assert(analytics.connectedComponents.has('progressBar'), 
            'ProgressBar not connected to analytics');
        assert(analytics.connectedComponents.has('industrySelector'), 
            'IndustrySelector not connected to analytics');
        assert(analytics.connectedComponents.has('calculator'), 
            'Calculator not connected to analytics');
    });
    
    asyncTest('Cookie consent flow должен работать end-to-end', async () => {
        const analytics = window.app.getAnalytics();
        const cookieBanner = window.app.getCookieBanner();
        
        // Сброс состояния
        analytics.setCookieConsent(false);
        localStorage.removeItem('steamphony_cookie_preferences');
        
        // Показываем banner
        cookieBanner.showBanner();
        
        // Simulate user accepting
        const acceptButton = document.querySelector('.cookie-banner__accept');
        if (acceptButton) {
            acceptButton.click();
            
            // Ждем обработки
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Проверяем результат
            assert(analytics.hasConsent === true, 
                'Consent not set after accept button click');
            
            const bannerElement = document.querySelector('.cookie-banner');
            assert(bannerElement === null || bannerElement.style.display === 'none', 
                'Banner not hidden after accept');
        }
    });
    
    // ==================== TEST RUNNER ====================
    
    async function runTests() {
        console.log('🚀 Running Integration Tests...\n');
        
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
        
        console.log(`\n📊 INTEGRATION TEST RESULTS:`);
        console.log(`   ✅ Passed: ${results.passed}`);
        console.log(`   ❌ Failed: ${results.failed}`);
        console.log(`   📊 Total: ${results.total}`);
        console.log(`   🎯 Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);
        
        if (results.failed === 0) {
            console.log('\n🎉 ALL INTEGRATION TESTS PASSED!');
        } else {
            console.log('\n⚠️  SOME TESTS FAILED - CHECK ERRORS ABOVE');
        }
        
        return results;
    }
    
    // Автоматический запуск если App доступен
    if (typeof window.app !== 'undefined') {
        runTests();
    } else {
        console.log('⚠️  App not found. Make sure the page is loaded.');
        console.log('   Run runIntegrationTests() manually after page load.');
    }
    
    // Глобальный доступ для manual запуска
    window.runIntegrationTests = runTests;
    
})(); 