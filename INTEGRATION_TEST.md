# 🧪 Integration Test Guide

**Analytics.js + CookieBanner.js интеграция в main.js**

---

## 🚀 **QUICK TEST**

### **1. Откройте public/index.html в браузере**

### **2. Проверьте в консоли DevTools:**

```javascript
// ✅ Проверка инициализации
console.log('App:', window.app);
console.log('Analytics:', window.analytics);
console.log('CookieBanner:', window.cookieBanner);

// ✅ Проверка состояния приложения
console.log('App State:', window.app.getAppState());

// ✅ Проверка Analytics статистики
console.log('Analytics Stats:', window.analytics?.getAnalyticsStats());

// ✅ Проверка Cookie Banner предпочтений
console.log('Cookie Preferences:', window.cookieBanner?.getPreferences());
```

### **3. Ожидаемые результаты:**
- ✅ Cookie banner появляется автоматически
- ✅ Analytics инициализирован (без consent пока)
- ✅ События добавляются в очередь
- ✅ Все компоненты подключены

---

## 🍪 **GDPR FLOW TEST**

### **1. Тест "Принять все":**
```javascript
// Кликните "Принять все" в cookie banner
// Затем проверьте:
console.log('Consent granted:', window.analytics.hasConsent);
console.log('GA4 loaded:', window.analytics.isGA4Loaded);
console.log('Queued events processed:', window.analytics.eventQueue.length === 0);
```

### **2. Тест "Только необходимые":**
```javascript
// Обновите страницу, кликните "Только необходимые"
// Затем проверьте:
console.log('Consent denied:', window.analytics.hasConsent === false);
console.log('GA4 not loaded:', window.analytics.isGA4Loaded === false);
console.log('Events queued:', window.analytics.eventQueue.length > 0);
```

### **3. Тест "Настроить":**
```javascript
// Кликните "Настроить", переключите аналитику, сохраните
// Проверьте результат в localStorage:
console.log('Stored preferences:', localStorage.getItem('steamphony_cookie_preferences'));
```

---

## 📊 **ANALYTICS TRACKING TEST**

### **1. Тест навигации по шагам:**
```javascript
// Выберите отрасль и перейдите к следующему шагу
// В консоли должны появиться:
// "📊 Выбрана отрасль: restaurant"
// "➡️ Переход к следующему шагу: ..."
// "🔄 Переход к шагу 2"

// Проверьте отслеживание:
window.analytics.eventCounts.industry_selected; // должно быть > 0
window.analytics.eventCounts.step_completed; // должно быть > 0
```

### **2. Тест отслеживания событий:**
```javascript
// Проверьте автоматические события:
window.analytics.trackEvent('test_event', { test: true });

// Если согласие дано - событие отправлено
// Если нет согласия - событие в очереди
console.log('Event queue:', window.analytics.eventQueue);
```

---

## 🔗 **COMPONENT INTEGRATION TEST**

### **1. Проверка подключения компонентов:**
```javascript
// Должны быть подключены все компоненты:
console.log('Connected components:', window.analytics.connectedComponents);

// Ожидаемый результат:
// {
//   progressBar: ProgressBarInstance,
//   industrySelector: IndustrySelectorInstance,
//   calculator: CalculatorInstance
// }
```

### **2. Тест событий компонентов:**
```javascript
// При клике по шагам в ProgressBar должны логироваться:
// "Analytics: step_navigation"

// При выборе отрасли должны логироваться:
// "Analytics: industry_selected"
// "Analytics: industry_confirmed"
```

---

## 🛠️ **ERROR HANDLING TEST**

### **1. Тест graceful degradation:**
```javascript
// Отключите интернет и обновите страницу
// Приложение должно работать без analytics:
console.log('App works without analytics:', window.app.isInitialized);
console.log('Analytics failed gracefully:', window.analytics === null);
```

### **2. Тест с неправильной конфигурацией:**
```javascript
// Измените в HTML конфигурацию на неправильную:
window.STEAMPHONY_CONFIG.analytics.measurementId = 'INVALID-ID';

// Перезагрузите - должны увидеть warning, но приложение работает
```

---

## 📱 **RESPONSIVE TEST**

### **1. Тест на мобильных устройствах:**
- Откройте DevTools → Toggle device toolbar
- Проверьте iPhone/Android размеры
- Cookie banner должен адаптироваться
- Кнопки должны быть touch-friendly

### **2. Тест keyboard navigation:**
- Tab через элементы cookie banner
- Enter для активации кнопок
- Escape для закрытия modal
- Проверьте focus indicators

---

## ⚠️ **TROUBLESHOOTING**

### **Если не работает:**

1. **Проверьте console errors:**
```javascript
// Должны быть только warnings, не errors
// OK: "⚠️ Analytics failed: ..."
// NOT OK: "Uncaught TypeError: ..."
```

2. **Проверьте file paths:**
```javascript
// Убедитесь что импорты работают:
window.SteamphonyAnalytics; // должен быть класс
window.SteamphonyCookieBanner; // должен быть класс
```

3. **Проверьте CORS:**
```javascript
// Запускайте через HTTP server, не file://
// Используйте Live Server в VS Code
```

---

## ✅ **SUCCESS CRITERIA**

### **Интеграция успешна если:**
- ✅ Cookie banner показывается автоматически
- ✅ Analytics инициализируется без errors
- ✅ События отслеживаются корректно
- ✅ GDPR flow работает (accept/decline/customize)
- ✅ Graceful degradation при ошибках
- ✅ Responsive design работает
- ✅ Keyboard navigation работает
- ✅ Все компоненты подключены к analytics

### **Финальная проверка:**
```javascript
// Всё работает если этот код не выдает errors:
const state = window.app.getAppState();
console.log('✅ Integration successful:', {
  app: state.isInitialized,
  analytics: !!state.analytics,
  cookieBanner: !!state.cookieBanner,
  components: Object.values(state.components).every(c => c === true)
});
```

---

*Интеграция выполнена без breaking changes*  
*Все существующие функции сохранены*  
*Analytics работает в privacy-first режиме* 