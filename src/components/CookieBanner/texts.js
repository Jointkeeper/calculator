/**
 * CookieBanner Texts Module
 * Локализованные тексты для CookieBanner компонента
 */

export const TEXTS = {
  ru: {
    title: 'Мы используем cookies',
    description: 'Мы используем cookies для улучшения вашего опыта использования калькулятора и анализа его эффективности. Ваша конфиденциальность важна для нас.',
    essential: 'Только необходимые',
    acceptAll: 'Принять все',
    customize: 'Настроить',
    saveSettings: 'Сохранить настройки',
    close: 'Закрыть',
    // Категории cookies
    essentialTitle: 'Необходимые cookies',
    essentialDesc: 'Обеспечивают базовую функциональность сайта. Всегда активны.',
    analyticsTitle: 'Аналитические cookies',
    analyticsDesc: 'Помогают нам понять, как вы используете калькулятор, для улучшения сервиса.',
    // Дополнительные тексты
    privacyPolicy: 'Политика конфиденциальности',
    learnMore: 'Узнать больше',
    yourChoice: 'Ваш выбор',
    alwaysActive: 'Всегда активно',
    // Accessibility
    bannerAriaLabel: 'Уведомление о cookies',
    closeModalLabel: 'Закрыть настройки cookies',
    toggleLabel: 'Переключить согласие на аналитические cookies'
  },
  
  en: {
    title: 'We use cookies',
    description: 'We use cookies to improve your experience with the calculator and analyze its effectiveness. Your privacy is important to us.',
    essential: 'Essential only',
    acceptAll: 'Accept all',
    customize: 'Customize',
    saveSettings: 'Save settings',
    close: 'Close',
    // Cookie categories
    essentialTitle: 'Essential cookies',
    essentialDesc: 'Provide basic website functionality. Always active.',
    analyticsTitle: 'Analytics cookies',
    analyticsDesc: 'Help us understand how you use the calculator to improve our service.',
    // Additional texts
    privacyPolicy: 'Privacy Policy',
    learnMore: 'Learn more',
    yourChoice: 'Your choice',
    alwaysActive: 'Always active',
    // Accessibility
    bannerAriaLabel: 'Cookie notification',
    closeModalLabel: 'Close cookie settings',
    toggleLabel: 'Toggle analytics cookies consent'
  }
};

export const getTexts = (language = 'ru') => {
  return TEXTS[language] || TEXTS.ru;
}; 