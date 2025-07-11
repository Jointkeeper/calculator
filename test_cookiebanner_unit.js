/**
 * ===== COOKIEBANNER.JS UNIT TESTS =====
 * 
 * Автоматизированные тесты для проверки функциональности CookieBanner.js
 * Запуск: копируйте код в браузерную консоль после загрузки страницы
 */

(function() {
    'use strict';
    
    console.log('🧪 Starting CookieBanner.js Unit Tests...');
    
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
    
    // Cleanup helper
    function cleanupBanner() {
        const existingBanner = document.querySelector('.cookie-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
    }
    
    // Mock Analytics для тестов
    class MockAnalytics {
        constructor() {
            this.hasConsent = false;
            this.events = [];
        }
        
        setCookieConsent(consent) {
            this.hasConsent = consent;
        }
        
        trackEvent(eventName, params) {
            this.events.push({ eventName, params });
        }
    }
    
    // ==================== TESTS ====================
    
    test('CookieBanner class должен быть загружен', () => {
        assert(typeof window.SteamphonyCookieBanner === 'function', 
            'CookieBanner class not found in window.SteamphonyCookieBanner');
    });
    
    test('CookieBanner instance должен создаваться', () => {
        const mockAnalytics = new MockAnalytics();
        const cookieBanner = new window.SteamphonyCookieBanner(mockAnalytics, {
            autoShow: false
        });
        
        assert(cookieBanner !== undefined, 'CookieBanner instance is undefined');
        assert(typeof cookieBanner.showBanner === 'function', 'showBanner method missing');
        assert(typeof cookieBanner.hideBanner === 'function', 'hideBanner method missing');
        assert(typeof cookieBanner.getPreferences === 'function', 'getPreferences method missing');
    });
    
    test('Banner должен создавать DOM элементы', () => {
        cleanupBanner();
        
        const mockAnalytics = new MockAnalytics();
        const cookieBanner = new window.SteamphonyCookieBanner(mockAnalytics, {
            autoShow: false
        });
        
        cookieBanner.showBanner();
        
        const bannerElement = document.querySelector('.cookie-banner');
        assert(bannerElement !== null, 'Banner DOM element not created');
        
        const acceptButton = bannerElement.querySelector('.cookie-banner__accept');
        const declineButton = bannerElement.querySelector('.cookie-banner__decline');
        
        assert(acceptButton !== null, 'Accept button not found');
        assert(declineButton !== null, 'Decline button not found');
        
        cleanupBanner();
    });
    
    test('Banner должен скрываться при hideBanner', () => {
        cleanupBanner();
        
        const mockAnalytics = new MockAnalytics();
        const cookieBanner = new window.SteamphonyCookieBanner(mockAnalytics, {
            autoShow: false
        });
        
        cookieBanner.showBanner();
        let bannerElement = document.querySelector('.cookie-banner');
        assert(bannerElement !== null, 'Banner should be visible');
        
        cookieBanner.hideBanner();
        
        // Проверяем через короткий timeout для анимации
        setTimeout(() => {
            bannerElement = document.querySelector('.cookie-banner');
            assert(bannerElement === null || bannerElement.style.display === 'none', 
                'Banner should be hidden');
        }, 100);
        
        cleanupBanner();
    });
    
    test('Accept button должен устанавливать consent', () => {
        cleanupBanner();
        
        const mockAnalytics = new MockAnalytics();
        const cookieBanner = new window.SteamphonyCookieBanner(mockAnalytics, {
            autoShow: false
        });
        
        cookieBanner.showBanner();
        
        const acceptButton = document.querySelector('.cookie-banner__accept');
        assert(acceptButton !== null, 'Accept button not found');
        
        // Simulate click
        acceptButton.click();
        
        assert(mockAnalytics.hasConsent === true, 'Consent not set after accept');
        
        cleanupBanner();
    });
    
    test('Decline button должен отклонять consent', () => {
        cleanupBanner();
        
        const mockAnalytics = new MockAnalytics();
        const cookieBanner = new window.SteamphonyCookieBanner(mockAnalytics, {
            autoShow: false
        });
        
        cookieBanner.showBanner();
        
        const declineButton = document.querySelector('.cookie-banner__decline');
        assert(declineButton !== null, 'Decline button not found');
        
        // Simulate click
        declineButton.click();
        
        assert(mockAnalytics.hasConsent === false, 'Consent incorrectly set after decline');
        
        cleanupBanner();
    });
    
    test('getPreferences должен возвращать правильные данные', () => {
        const mockAnalytics = new MockAnalytics();
        const cookieBanner = new window.SteamphonyCookieBanner(mockAnalytics, {
            autoShow: false
        });
        
        const preferences = cookieBanner.getPreferences();
        
        assert(typeof preferences === 'object', 'Preferences should be object');
        assert(typeof preferences.analytics === 'boolean', 'Analytics preference should be boolean');
        assert(typeof preferences.timestamp === 'number', 'Timestamp should be number');
    });
    
    test('localStorage должен сохранять предпочтения', () => {
        const mockAnalytics = new MockAnalytics();
        const cookieBanner = new window.SteamphonyCookieBanner(mockAnalytics, {
            autoShow: false
        });
        
        // Симулируем принятие cookies
        cookieBanner.acceptAllCookies();
        
        const storedPreferences = localStorage.getItem('steamphony_cookie_preferences');
        assert(storedPreferences !== null, 'Preferences not stored in localStorage');
        
        const parsed = JSON.parse(storedPreferences);
        assert(parsed.analytics === true, 'Analytics preference not saved correctly');
    });
    
    test('resetConsent должен сбрасывать состояние', () => {
        const mockAnalytics = new MockAnalytics();
        const cookieBanner = new window.SteamphonyCookieBanner(mockAnalytics, {
            autoShow: false
        });
        
        // Сначала принимаем
        cookieBanner.acceptAllCookies();
        assert(mockAnalytics.hasConsent === true, 'Consent should be true');
        
        // Затем сбрасываем
        cookieBanner.resetConsent();
        
        const preferences = cookieBanner.getPreferences();
        assert(preferences.analytics === false, 'Analytics consent should be reset');
    });
    
    test('Конфигурация должна применяться корректно', () => {
        const config = {
            position: 'top',
            theme: 'dark',
            language: 'en',
            autoShow: false
        };
        
        const mockAnalytics = new MockAnalytics();
        const cookieBanner = new window.SteamphonyCookieBanner(mockAnalytics, config);
        
        assert(cookieBanner.config.position === 'top', 'Position not set correctly');
        assert(cookieBanner.config.theme === 'dark', 'Theme not set correctly');
        assert(cookieBanner.config.language === 'en', 'Language not set correctly');
        assert(cookieBanner.config.autoShow === false, 'AutoShow not set correctly');
    });
    
    test('Banner должен поддерживать keyboard navigation', () => {
        cleanupBanner();
        
        const mockAnalytics = new MockAnalytics();
        const cookieBanner = new window.SteamphonyCookieBanner(mockAnalytics, {
            autoShow: false
        });
        
        cookieBanner.showBanner();
        
        const acceptButton = document.querySelector('.cookie-banner__accept');
        const declineButton = document.querySelector('.cookie-banner__decline');
        
        // Проверяем tabindex
        assert(acceptButton.tabIndex >= 0, 'Accept button not keyboard accessible');
        assert(declineButton.tabIndex >= 0, 'Decline button not keyboard accessible');
        
        // Проверяем focus
        acceptButton.focus();
        assert(document.activeElement === acceptButton, 'Accept button not focusable');
        
        cleanupBanner();
    });
    
    test('Banner должен иметь ARIA attributes', () => {
        cleanupBanner();
        
        const mockAnalytics = new MockAnalytics();
        const cookieBanner = new window.SteamphonyCookieBanner(mockAnalytics, {
            autoShow: false
        });
        
        cookieBanner.showBanner();
        
        const bannerElement = document.querySelector('.cookie-banner');
        
        // Проверяем ARIA attributes
        assert(bannerElement.getAttribute('role') !== null, 'Banner missing role attribute');
        assert(bannerElement.getAttribute('aria-label') !== null, 'Banner missing aria-label');
        
        cleanupBanner();
    });
    
    test('destroy должен очищать ресурсы', () => {
        cleanupBanner();
        
        const mockAnalytics = new MockAnalytics();
        const cookieBanner = new window.SteamphonyCookieBanner(mockAnalytics, {
            autoShow: false
        });
        
        cookieBanner.showBanner();
        let bannerElement = document.querySelector('.cookie-banner');
        assert(bannerElement !== null, 'Banner should be visible before destroy');
        
        cookieBanner.destroy();
        
        bannerElement = document.querySelector('.cookie-banner');
        assert(bannerElement === null, 'Banner should be removed after destroy');
    });
    
    // ==================== TEST RUNNER ====================
    
    function runTests() {
        console.log('🚀 Running CookieBanner.js Unit Tests...\n');
        
        tests.forEach((test, index) => {
            try {
                test.testFunction();
                console.log(`✅ Test ${index + 1}: ${test.description}`);
                results.passed++;
            } catch (error) {
                console.error(`❌ Test ${index + 1}: ${test.description}`);
                console.error(`   Error: ${error.message}`);
                results.failed++;
            }
            results.total++;
        });
        
        // Cleanup после всех тестов
        cleanupBanner();
        
        console.log(`\n📊 COOKIEBANNER.JS UNIT TEST RESULTS:`);
        console.log(`   ✅ Passed: ${results.passed}`);
        console.log(`   ❌ Failed: ${results.failed}`);
        console.log(`   📊 Total: ${results.total}`);
        console.log(`   🎯 Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);
        
        if (results.failed === 0) {
            console.log('\n🎉 ALL COOKIEBANNER.JS TESTS PASSED!');
        } else {
            console.log('\n⚠️  SOME TESTS FAILED - CHECK ERRORS ABOVE');
        }
        
        return results;
    }
    
    // Автоматический запуск если CookieBanner доступен
    if (typeof window.SteamphonyCookieBanner !== 'undefined') {
        runTests();
    } else {
        console.log('⚠️  CookieBanner class not found. Make sure the page is loaded.');
        console.log('   Run runCookieBannerTests() manually after page load.');
    }
    
    // Глобальный доступ для manual запуска
    window.runCookieBannerTests = runTests;
    
})(); 