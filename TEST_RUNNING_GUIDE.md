# 🧪 Руководство по запуску тестов

## Исправленные проблемы

✅ **Переведены на ES модули** - все тесты теперь используют `import` вместо `require`  
✅ **Добавлена поддержка Node.js** - тесты работают в браузере и Node.js  
✅ **Создан недостающий модуль** - `src/utils/test-module.js`  
✅ **Настроен package.json** - добавлен `"type": "module"`  

## Запуск тестов

### Все тесты сразу
```bash
npm test
```

### Отдельные тесты
```bash
# Тесты безопасности
npm run test:security

# Тесты производительности  
npm run test:performance

# Тесты GDPR
npm run test:gdpr
```

### Ручной запуск
```bash
# Node.js (рекомендуется)
node test_advanced_security.js
node test_performance_optimization.js
node test_gdpr_compliance.js

# Браузер (для GDPR тестов)
# Откройте test_gdpr_compliance.js в браузере
```

## Что исправлено

### 1. test_advanced_security.js
- ✅ Заменен `require('jsdom')` на `await import('jsdom')`
- ✅ Убраны fallback CommonJS импорты
- ✅ Добавлена обработка ошибок импорта

### 2. test_performance_optimization.js  
- ✅ Заменен `require('jsdom')` на `await import('jsdom')`
- ✅ Заменены `require()` на `await import()` для всех модулей
- ✅ Создан `src/utils/test-module.js` для тестирования LazyLoader

### 3. test_gdpr_compliance.js
- ✅ Добавлена поддержка Node.js с jsdom
- ✅ Созданы mock-объекты для `window.app`, `localStorage`, `navigator`
- ✅ Тесты работают в браузере и Node.js

### 4. package.json
- ✅ Добавлен `"type": "module"` для ES модулей
- ✅ Добавлены npm scripts для удобного запуска тестов

## Ожидаемые результаты

### ✅ Успешный запуск
```
🧪 Starting Advanced Security Features Test Suite...
🔧 Initializing security components...
✅ Security components initialized
📋 Testing CSP Configuration...
✅ CSP header generation
✅ CSP default-src directive
...
```

### ❌ Возможные проблемы
- **Модули не найдены** - проверьте пути к файлам в `src/`
- **jsdom не установлен** - выполните `npm install`
- **Node.js версия** - требуется Node.js 18+ для ES модулей

## Структура тестов

```
test_advanced_security.js      # Тесты CSP, заголовков, угроз
test_performance_optimization.js # Тесты LazyLoader, CacheManager, PerformanceMonitor  
test_gdpr_compliance.js        # Тесты GDPR соответствия
src/utils/test-module.js       # Тестовый модуль для LazyLoader
```

## Следующие шаги

1. Запустите `npm test` для проверки всех тестов
2. Исправьте любые оставшиеся ошибки
3. Добавьте новые тесты по мере развития проекта 