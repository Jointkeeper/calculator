# 📊 Analytics.js - Privacy-First GA4 Service

**Размер:** 1,074 строки, 35.2KB  
**Статус:** ✅ Готов к использованию  
**Compliance:** GDPR-compliant  

---

## 🎯 **QUICK START**

### **1. Инициализация:**
```javascript
import Analytics from './src/services/Analytics.js';

// Создание с конфигурацией
const analytics = new Analytics({
  measurementId: 'G-YOUR-MEASUREMENT-ID', // Заменить на реальный
  debugMode: true, // Включить для разработки
  autoInitialize: false // Ручное управление согласием
});
```

### **2. Управление согласием:**
```javascript
// Проверка существующего согласия
const hasConsent = await analytics.checkCookieConsent();

// Установка согласия (показать после cookie banner)
await analytics.setCookieConsent(true); // Автоматически инициализирует GA4

// Отзыв согласия (right to be forgotten)
await analytics.setCookieConsent(false); // Очищает все данные
```

### **3. Интеграция с компонентами:**
```javascript
// В main.js после инициализации компонентов
analytics.connectToProgressBar(window.app.progressBar);
analytics.connectToIndustrySelector(window.app.industrySelector);
analytics.connectToCalculator(window.app.calculator);
```

---

## 🔧 **FEATURES**

### **Privacy-First подход:**
- ✅ **NO tracking без согласия**
- ✅ **Event queuing** до получения разрешения
- ✅ **PII sanitization** - автоматическое удаление персональных данных
- ✅ **Right to be forgotten** - полная очистка данных
- ✅ **IP anonymization** - анонимизация IP адресов

### **GDPR Compliance:**
- ✅ **Explicit consent** - явное согласие пользователя
- ✅ **Data retention limits** - ограниченное время хранения
- ✅ **Granular control** - точное управление данными
- ✅ **Audit trail** - логирование всех действий

### **Technical Features:**
- ✅ **Event queuing** - очередь до 50 событий
- ✅ **Error handling** - graceful degradation
- ✅ **Browser compatibility** - современные браузеры
- ✅ **Bundle optimization** - эффективная загрузка
- ✅ **Session tracking** - отслеживание сессий

---

## 📈 **ОТСЛЕЖИВАЕМЫЕ СОБЫТИЯ**

### **Автоматические события:**
```javascript
// При подключении к компонентам отслеживаются автоматически:
analytics.connectToProgressBar(progressBar);    // step_completed, step_navigation
analytics.connectToIndustrySelector(selector);  // industry_selected, industry_search
analytics.connectToCalculator(calculator);      // calculation_started, calculation_completed
```

### **Ручные события:**
```javascript
// Специфичные события калькулятора
analytics.trackCalculatorStep(2, { business_size: 'medium' });
analytics.trackIndustrySelection('restaurant', { popular: true });
analytics.trackCalculationCompleted({ savings: 15000, roi: 2.5 });
analytics.trackLeadGenerated({ industry: 'restaurant', source: 'calculator' });

// Общие события
analytics.trackEvent('custom_event', { param1: 'value1' });
analytics.trackError('VALIDATION_ERROR', 'Invalid input data');
```

---

## ⚙️ **КОНФИГУРАЦИЯ**

### **Основные параметры:**
```javascript
const config = {
  measurementId: 'G-PLACEHOLDER',     // GA4 Measurement ID
  debugMode: false,                   // Debug логирование
  autoInitialize: false,              // Автоинициализация при согласии
  eventQueueLimit: 50,               // Лимит очереди событий
  trackingOptOut: false,             // Глобальный opt-out
  sessionTimeout: 30 * 60 * 1000,    // 30 минут таймаут сессии
  anonymizeIP: true,                 // Анонимизация IP
  dataRetention: 14                  // Месяцы хранения данных
};
```

### **GDPR настройки:**
```javascript
const gdprConfig = {
  consentStorageKey: 'steamphony_analytics_consent', // Ключ localStorage
  cookieDomain: window.location.hostname,             // Домен cookies
  dataRetention: 14                                   // Месяцы хранения
};
```

---

## 🧪 **TESTING & DEBUG**

### **Debug режим:**
```javascript
// Включение debug режима
analytics.setDebugMode(true);

// Проверка статистики
const stats = analytics.getAnalyticsStats();
console.log('Analytics stats:', stats);

// Слушание внутренних событий
analytics.addEventListener('analyticsReady', (data) => {
  console.log('Analytics готов:', data);
});

analytics.addEventListener('consentChanged', (data) => {
  console.log('Согласие изменено:', data);
});
```

### **Тестирование в консоли:**
```javascript
// Проверка инициализации
console.log('Analytics:', window.Analytics);
console.log('Instance:', analytics);

// Тест событий
analytics.trackEvent('test_event', { test: true });

// Проверка очереди
console.log('Queued events:', analytics.eventQueue.length);

// Статистика
console.log('Stats:', analytics.getAnalyticsStats());
```

---

## 🔗 **ИНТЕГРАЦИЯ С MAIN.JS**

### **Добавить в main.js:**
```javascript
// В начале файла
import Analytics from './services/Analytics.js';

// В конструкторе App класса
constructor() {
  // ... existing code ...
  
  // Инициализация Analytics
  this.analytics = new Analytics({
    measurementId: 'G-YOUR-ID',
    debugMode: true,
    autoInitialize: false
  });
}

// В методе initializeComponents()
async initializeComponents() {
  // ... existing code ...
  
  // Подключение Analytics к компонентам
  this.connectAnalytics();
}

// Новый метод для подключения Analytics
connectAnalytics() {
  try {
    if (this.analytics) {
      this.analytics.connectToProgressBar(this.progressBar);
      this.analytics.connectToIndustrySelector(this.industrySelector);
      this.analytics.connectToCalculator(this.calculator);
      
      console.log('✅ Analytics подключен к компонентам');
    }
  } catch (error) {
    console.error('Ошибка подключения Analytics:', error);
  }
}
```

---

## 🚀 **PRODUCTION CHECKLIST**

### **Перед запуском:**
1. ✅ **Заменить measurementId** на реальный GA4 ID
2. ✅ **Отключить debugMode** (установить в `false`)
3. ✅ **Добавить cookie banner** для получения согласия
4. ✅ **Протестировать GDPR flow** (согласие/отзыв)
5. ✅ **Проверить отправку событий** в GA4
6. ✅ **Настроить data retention** в GA4 консоли

### **Cookie Banner Integration:**
```javascript
// Пример интеграции с cookie banner
function handleCookieConsent(accepted) {
  analytics.setCookieConsent(accepted);
  
  if (accepted) {
    // Начать отслеживание
    analytics.trackEvent('consent_granted', { source: 'cookie_banner' });
  }
}
```

---

## 🛠️ **MAINTENANCE**

### **Мониторинг:**
- Проверяйте логи ошибок в браузере
- Мониторьте размер очереди событий
- Отслеживайте performance impact

### **Updates:**
- Обновляйте конфигурацию data retention
- Проверяйте совместимость с новыми версиями GA4
- Адаптируйте под изменения GDPR требований

---

## 📞 **SUPPORT**

**Документация:** Полная JSDoc документация в коде  
**Тестирование:** `window.Analytics` доступен для debug  
**Логирование:** Включите `debugMode: true` для отладки  

**События для мониторинга:**
- `analytics:analyticsReady` - готовность сервиса
- `analytics:consentChanged` - изменение согласия  
- `analytics:analyticsError` - ошибки сервиса

---

*Создано для Steamphony Digital Agency Calculator*  
*GDPR-compliant • Privacy-First • Production-Ready* 