/**
 * ===== ANALYTICS.JS UNIT TESTS =====
 * 
 * Автоматизированные тесты для проверки функциональности Analytics.js
 * Запуск: копируйте код в браузерную консоль после загрузки страницы
 */

(function() {
    'use strict';
    
    console.log('🧪 Starting Analytics.js Unit Tests...');
    
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
    
    // ==================== TESTS ====================
    
    test('Analytics class должен быть загружен', () => {
        assert(typeof window.SteamphonyAnalytics === 'function', 
            'Analytics class not found in window.SteamphonyAnalytics');
    });
    
    test('Analytics instance должен создаваться', () => {
        const analytics = new window.SteamphonyAnalytics({
            measurementId: 'G-TEST',
            debugMode: true
        });
        
        assert(analytics !== undefined, 'Analytics instance is undefined');
        assert(typeof analytics.trackEvent === 'function', 'trackEvent method missing');
        assert(typeof analytics.setCookieConsent === 'function', 'setCookieConsent method missing');
    });
    
    test('Начальное состояние должно быть корректным', () => {
        const analytics = new window.SteamphonyAnalytics({
            measurementId: 'G-TEST',
            debugMode: true
        });
        
        assert(analytics.hasConsent === false, 'Initial consent should be false');
        assert(Array.isArray(analytics.eventQueue), 'Event queue should be array');
        assert(analytics.eventQueue.length === 0, 'Event queue should be empty initially');
    });
    
    test('События должны добавляться в очередь без consent', () => {
        const analytics = new window.SteamphonyAnalytics({
            measurementId: 'G-TEST',
            debugMode: true,
            consentRequired: true
        });
        
        const initialQueueLength = analytics.eventQueue.length;
        
        analytics.trackEvent('test_event', { test: true });
        
        assert(analytics.eventQueue.length === initialQueueLength + 1, 
            'Event was not added to queue');
    });
    
    test('setCookieConsent должен устанавливать consent', () => {
        const analytics = new window.SteamphonyAnalytics({
            measurementId: 'G-TEST',
            debugMode: true
        });
        
        analytics.setCookieConsent(true);
        assert(analytics.hasConsent === true, 'Consent not set to true');
        
        analytics.setCookieConsent(false);
        assert(analytics.hasConsent === false, 'Consent not set to false');
    });
    
    test('getAnalyticsStats должен возвращать статистику', () => {
        const analytics = new window.SteamphonyAnalytics({
            measurementId: 'G-TEST',
            debugMode: true
        });
        
        const stats = analytics.getAnalyticsStats();
        
        assert(typeof stats === 'object', 'Stats should be object');
        assert(typeof stats.hasConsent === 'boolean', 'hasConsent should be boolean');
        assert(typeof stats.queuedEvents === 'number', 'queuedEvents should be number');
        assert(typeof stats.eventCounts === 'object', 'eventCounts should be object');
    });
    
    test('connectToProgressBar должен подключаться к компоненту', () => {
        const analytics = new window.SteamphonyAnalytics({
            measurementId: 'G-TEST',
            debugMode: true
        });
        
        const mockProgressBar = {
            addEventListener: (event, callback) => {
                // Mock implementation
            }
        };
        
        // Не должно падать
        try {
            analytics.connectToProgressBar(mockProgressBar);
            assert(true, 'connectToProgressBar completed without error');
        } catch (error) {
            assert(false, 'connectToProgressBar threw error: ' + error.message);
        }
    });
    
    test('trackCalculatorStep должен отслеживать шаги', () => {
        const analytics = new window.SteamphonyAnalytics({
            measurementId: 'G-TEST',
            debugMode: true
        });
        
        const initialQueueLength = analytics.eventQueue.length;
        
        analytics.trackCalculatorStep(2, { direction: 'forward' });
        
        assert(analytics.eventQueue.length === initialQueueLength + 1, 
            'Calculator step event not tracked');
    });
    
    test('trackIndustrySelection должен отслеживать выбор отрасли', () => {
        const analytics = new window.SteamphonyAnalytics({
            measurementId: 'G-TEST',
            debugMode: true
        });
        
        const initialQueueLength = analytics.eventQueue.length;
        
        analytics.trackIndustrySelection('restaurant', { 
            name: 'Ресторан', 
            category: 'Общепит' 
        });
        
        assert(analytics.eventQueue.length === initialQueueLength + 1, 
            'Industry selection event not tracked');
    });
    
    test('Конфигурация должна применяться корректно', () => {
        const config = {
            measurementId: 'G-CUSTOM',
            debugMode: false,
            consentRequired: false,
            dataRetention: 30
        };
        
        const analytics = new window.SteamphonyAnalytics(config);
        
        assert(analytics.config.measurementId === 'G-CUSTOM', 
            'measurementId not set correctly');
        assert(analytics.config.debugMode === false, 
            'debugMode not set correctly');
        assert(analytics.config.consentRequired === false, 
            'consentRequired not set correctly');
    });
    
    test('destroy должен очищать ресурсы', () => {
        const analytics = new window.SteamphonyAnalytics({
            measurementId: 'G-TEST',
            debugMode: true
        });
        
        // Добавляем события
        analytics.trackEvent('test_before_destroy', { test: true });
        
        // Уничтожаем
        analytics.destroy();
        
        // Проверяем очистку
        assert(analytics.eventQueue.length === 0, 'Event queue not cleared');
        assert(analytics.connectedComponents.size === 0, 'Connected components not cleared');
    });
    
    // ==================== TEST RUNNER ====================
    
    function runTests() {
        console.log('🚀 Running Analytics.js Unit Tests...\n');
        
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
        
        console.log(`\n📊 ANALYTICS.JS UNIT TEST RESULTS:`);
        console.log(`   ✅ Passed: ${results.passed}`);
        console.log(`   ❌ Failed: ${results.failed}`);
        console.log(`   📊 Total: ${results.total}`);
        console.log(`   🎯 Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);
        
        if (results.failed === 0) {
            console.log('\n🎉 ALL ANALYTICS.JS TESTS PASSED!');
        } else {
            console.log('\n⚠️  SOME TESTS FAILED - CHECK ERRORS ABOVE');
        }
        
        return results;
    }
    
    // Автоматический запуск если Analytics доступен
    if (typeof window.SteamphonyAnalytics !== 'undefined') {
        runTests();
    } else {
        console.log('⚠️  Analytics class not found. Make sure the page is loaded.');
        console.log('   Run runAnalyticsTests() manually after page load.');
    }
    
    // Глобальный доступ для manual запуска
    window.runAnalyticsTests = runTests;
    
})(); 