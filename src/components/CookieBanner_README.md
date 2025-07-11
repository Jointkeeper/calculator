# 🍪 CookieBanner.js - GDPR Cookie Consent Component

**Размер:** 1,631 строка, 50.4KB  
**Статус:** ✅ Production Ready  
**Compliance:** GDPR Article 7 ✅  
**Accessibility:** WCAG 2.1 AA ✅  

---

## 🎯 **QUICK START**

### **1. Инициализация с Analytics.js:**
```javascript
import CookieBanner from './src/components/CookieBanner.js';
import Analytics from './src/services/Analytics.js';

// Создание Analytics service
const analytics = new Analytics({
  measurementId: 'G-YOUR-ID',
  debugMode: true
});

// Создание Cookie Banner
const cookieBanner = new CookieBanner(analytics, {
  position: 'bottom',     // bottom или top
  theme: 'light',         // light, dark, auto
  language: 'ru',         // язык интерфейса
  autoShow: true,         // автоматический показ
  respectDNT: true        // уважение к Do Not Track
});
```

### **2. Интеграция в main.js:**
```javascript
// В App класс добавить:
constructor() {
  // ... existing code ...
  
  // Инициализация Analytics
  this.analytics = new Analytics({ ... });
  
  // Инициализация Cookie Banner
  this.cookieBanner = new CookieBanner(this.analytics, {
    autoShow: true,
    debugMode: true
  });
}
```

---

## 🔧 **FEATURES**

### **GDPR Compliance:**
- ✅ **Article 7 compliance** - explicit consent
- ✅ **Clear consent options** - Accept All / Decline Optional / Customize
- ✅ **Granular control** - по категориям cookies
- ✅ **Easy withdrawal** - простой отзыв согласия
- ✅ **No pre-ticked boxes** - честные настройки по умолчанию

### **Accessibility (WCAG 2.1 AA):**
- ✅ **Keyboard navigation** - Tab, Enter, Escape
- ✅ **Screen reader support** - ARIA labels и roles
- ✅ **Focus management** - правильная последовательность фокуса
- ✅ **High contrast support** - поддержка высокого контраста
- ✅ **Focus trap** - в модальном окне

### **Technical Excellence:**
- ✅ **CSS-in-JS styling** - нет внешних зависимостей
- ✅ **Responsive design** - mobile и desktop
- ✅ **Smooth animations** - slide-up/down, fade effects
- ✅ **Theme support** - light/dark/auto
- ✅ **Do Not Track** - уважение к DNT header

---

## 🎨 **UI COMPONENTS**

### **Main Banner:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🍪 Мы используем cookies                                   │
│ Помогаем улучшить сервис через анализ использования        │
│ Политика конфиденциальности                                │
│                                                             │
│ [Только необходимые] [Настроить] [Принять все]            │
└─────────────────────────────────────────────────────────────┘
```

### **Settings Modal:**
```
┌─────────────────────────────────────────────────────────────┐
│ × Ваш выбор                                                │
├─────────────────────────────────────────────────────────────┤
│ 📋 Необходимые cookies                    [Всегда активно] │
│ Обеспечивают базовую функциональность                     │
│                                                             │
│ 📊 Аналитические cookies                            [○ ○]  │
│ Помогают понять использование калькулятора                 │
├─────────────────────────────────────────────────────────────┤
│                                          [Закрыть] [Сохранить] │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ **КОНФИГУРАЦИЯ**

### **Основные параметры:**
```javascript
const config = {
  position: 'bottom',              // 'top' или 'bottom'
  theme: 'light',                  // 'light', 'dark', 'auto'
  language: 'ru',                  // язык интерфейса
  showOnLoad: true,                // показать при загрузке
  autoShow: true,                  // автоматический показ
  respectDNT: true,                // уважение к Do Not Track
  cookieExpiry: 365,              // дни жизни согласия
  storageKey: 'steamphony_cookie_preferences',
  privacyPolicyUrl: '/privacy',    // ссылка на политику
  contactEmail: 'privacy@steamphony.com',
  companyName: 'Steamphony Digital Agency'
};
```

### **Design Tokens:**
```javascript
const DESIGN_TOKENS = {
  colors: {
    primary: '#3182ce',      // Accept button
    secondary: '#e2e8f0',    // Decline button  
    accent: '#805ad5',       // Customize button
    background: '#ffffff',
    text: '#2d3748'
  },
  spacing: { xs: '8px', sm: '12px', md: '16px', lg: '24px' },
  borderRadius: '8px',
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)'
  }
};
```

---

## 📱 **RESPONSIVE DESIGN**

### **Desktop (768px+):**
- Горизонтальная компоновка
- Кнопки в ряд
- Полные тексты

### **Tablet (480px - 768px):**
- Вертикальная компоновка
- Кнопки в колонку
- Адаптивные отступы

### **Mobile (<480px):**
- Компактные кнопки
- Оптимизированные тексты
- Touch-friendly интерфейс

---

## 🎭 **ANIMATIONS**

### **Banner появление:**
```css
transform: translateY(100%) → translateY(0)
transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

### **Modal появление:**
```css
opacity: 0 → 1
transform: translateY(20px) scale(0.95) → translateY(0) scale(1)
transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

### **Button hover:**
```css
transform: translateY(0) → translateY(-1px)
transition: 150ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 🔗 **INTEGRATION EVENTS**

### **Слушание событий:**
```javascript
// Готовность компонента
document.addEventListener('cookieBanner:cookieBannerReady', (e) => {
  console.log('Banner ready:', e.detail);
});

// Изменение согласия
document.addEventListener('cookieBanner:cookieConsentChanged', (e) => {
  console.log('Consent changed:', e.detail.preferences);
  console.log('Action:', e.detail.action); // accept_all, decline_optional, customize
});

// Показ/скрытие
document.addEventListener('cookieBanner:cookieBannerShown', () => {
  console.log('Banner shown');
});

document.addEventListener('cookieBanner:cookieBannerHidden', () => {
  console.log('Banner hidden');
});

// Ошибки
document.addEventListener('cookieBanner:cookieBannerError', (e) => {
  console.error('Banner error:', e.detail);
});
```

---

## 🧪 **TESTING**

### **Ручное тестирование:**
```javascript
// Проверка инициализации
console.log('CookieBanner:', window.CookieBanner);
console.log('Instance:', cookieBanner);

// Получение предпочтений
console.log('Preferences:', cookieBanner.getPreferences());

// Программное управление
cookieBanner.showBanner();     // Показать banner
cookieBanner.hideBanner();     // Скрыть banner
cookieBanner.resetConsent();   // Сбросить согласие

// Обновление конфигурации
cookieBanner.updateConfig({ 
  theme: 'dark',
  position: 'top' 
});
```

### **Accessibility тестирование:**
1. **Keyboard navigation** - Tab, Shift+Tab, Enter, Escape
2. **Screen reader** - проверить ARIA labels
3. **Focus indicators** - видимые рамки фокуса
4. **High contrast** - режим высокого контраста

---

## 📋 **GDPR CHECKLIST**

### **Обязательные требования:**
- ✅ **Explicit consent** - четкое согласие пользователя
- ✅ **Freely given** - без принуждения
- ✅ **Specific** - по категориям cookies
- ✅ **Informed** - понятные описания
- ✅ **Withdrawable** - возможность отозвать согласие

### **Категории cookies:**
- ✅ **Essential** - всегда активны, нет согласия
- ✅ **Analytics** - требует согласия, можно отключить

### **Пользовательские права:**
- ✅ **Right to information** - ясная информация
- ✅ **Right to withdraw** - простой отзыв согласия
- ✅ **Right to be forgotten** - полная очистка данных

---

## 🚀 **PRODUCTION CHECKLIST**

### **Перед запуском:**
1. ✅ **Протестировать все сценарии** (Accept/Decline/Customize)
2. ✅ **Проверить accessibility** (keyboard, screen reader)
3. ✅ **Тестировать responsive** (mobile, tablet, desktop)
4. ✅ **Настроить правильные URL** (privacy policy)
5. ✅ **Перевести тексты** если нужны другие языки
6. ✅ **Интегрировать с Analytics.js**

### **Мониторинг:**
- Логи согласий в localStorage
- События в Analytics
- Ошибки в консоли браузера

---

## 🛠️ **CUSTOMIZATION**

### **Добавление языков:**
```javascript
const TEXTS = {
  en: {
    title: 'We use cookies',
    description: 'We use cookies to improve your experience...',
    // ... rest of translations
  },
  de: {
    title: 'Wir verwenden Cookies',
    // ... German translations
  }
};
```

### **Кастомные стили:**
```javascript
const customConfig = {
  colors: {
    primary: '#your-brand-color',
    background: '#your-bg-color'
  }
};

const banner = new CookieBanner(analytics, customConfig);
```

---

## 📞 **SUPPORT**

**Документация:** Полная JSDoc в коде  
**Тестирование:** `window.CookieBanner` для debug  
**События:** Полный event-driven API  

**Основные методы:**
- `showBanner()` - показать banner
- `hideBanner()` - скрыть banner  
- `getPreferences()` - получить настройки
- `resetConsent()` - сбросить согласие
- `destroy()` - уничтожить компонент

---

*Создано для Steamphony Digital Agency Calculator*  
*GDPR Article 7 Compliant • WCAG 2.1 AA • Production Ready* 