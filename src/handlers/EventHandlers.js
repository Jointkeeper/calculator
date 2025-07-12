/**
 * EventHandlers - Модуль обработки событий приложения
 * Централизованная обработка всех пользовательских взаимодействий
 */

import { AppState } from '../core/AppState.js?v=1.0.2';
import { NavigationManager } from '../managers/NavigationManager.js?v=1.0.2';

class EventHandlers {
    constructor() {
        this.appState = null;
        this.navigationManager = null;
        this.isInitialized = false;
    }

    initialize() {
        if (this.isInitialized) return;
        
        this.appState = AppState.getInstance();
        this.navigationManager = NavigationManager.getInstance();
        this.bindEvents();
        this.isInitialized = true;
    }

    bindEvents() {
        // Обработчики навигации
        document.addEventListener('click', this.handleNavigationClick.bind(this));
        
        // Обработчики форм
        document.addEventListener('submit', this.handleFormSubmit.bind(this));
        document.addEventListener('input', this.handleInputChange.bind(this));
        document.addEventListener('change', this.handleSelectChange.bind(this));
        
        // Обработчики клавиатуры
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Обработчики видимости страницы
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Обработчики загрузки
        window.addEventListener('load', this.handlePageLoad.bind(this));
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }

    handleNavigationClick(event) {
        const target = event.target;
        
        // Навигация по шагам
        if (target.matches('[data-step]')) {
            event.preventDefault();
            const step = parseInt(target.dataset.step);
            this.navigationManager.navigateToStep(step);
            return;
        }

        // Кнопки навигации
        if (target.matches('.nav-btn')) {
            event.preventDefault();
            const action = target.dataset.action;
            
            switch (action) {
                case 'next':
                    this.navigationManager.nextStep();
                    break;
                case 'prev':
                    this.navigationManager.previousStep();
                    break;
                case 'restart':
                    this.navigationManager.restart();
                    break;
            }
            return;
        }

        // Ссылки на внешние ресурсы
        if (target.matches('a[href^="http"]')) {
            this.handleExternalLink(event);
            return;
        }

        // Кнопки действий
        if (target.matches('.action-btn')) {
            const action = target.dataset.action;
            this.handleActionButton(action, event);
            return;
        }
    }

    handleFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Валидация формы
        if (!this.validateForm(form)) {
            return;
        }

        // Обработка данных формы
        this.processFormData(formData, form.dataset.type);
        
        // Переход к следующему шагу
        this.navigationManager.nextStep();
    }

    handleInputChange(event) {
        const input = event.target;
        const value = input.value;
        const field = input.name || input.dataset.field;
        
        // Обновление состояния
        this.appState.updateField(field, value);
        
        // Валидация в реальном времени
        this.validateField(input);
        
        // Автосохранение
        this.appState.autoSave();
    }

    handleSelectChange(event) {
        const select = event.target;
        const value = select.value;
        const field = select.name || select.dataset.field;
        
        // Обновление состояния
        this.appState.updateField(field, value);
        
        // Специальная обработка для индустрии
        if (field === 'industry') {
            this.handleIndustryChange(value);
        }
        
        // Автосохранение
        this.appState.autoSave();
    }

    handleKeydown(event) {
        // Навигация клавишами
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault();
            this.navigationManager.nextStep();
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            this.navigationManager.previousStep();
            return;
        }

        // Горячие клавиши
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 's':
                    event.preventDefault();
                    this.appState.save();
                    break;
                case 'r':
                    event.preventDefault();
                    this.navigationManager.restart();
                    break;
            }
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Страница скрыта - сохраняем состояние
            this.appState.save();
        } else {
            // Страница снова видна - восстанавливаем состояние
            this.appState.restore();
        }
    }

    handlePageLoad() {
        // Инициализация после загрузки страницы
        this.appState.restore();
        this.navigationManager.initialize();
        
        // Аналитика
        this.trackPageView();
    }

    handleBeforeUnload(event) {
        // Сохранение перед уходом со страницы
        this.appState.save();
        
        // Предупреждение о несохраненных данных
        if (this.appState.hasUnsavedChanges()) {
            event.preventDefault();
            event.returnValue = '';
        }
    }

    handleExternalLink(event) {
        const link = event.target;
        const url = link.href;
        
        // Открытие в новой вкладке
        event.preventDefault();
        window.open(url, '_blank', 'noopener,noreferrer');
        
        // Аналитика внешних ссылок
        this.trackExternalLink(url);
    }

    handleActionButton(action, event) {
        switch (action) {
            case 'save':
                this.appState.save();
                this.showNotification('Данные сохранены', 'success');
                break;
            case 'export':
                this.exportData();
                break;
            case 'share':
                this.shareResults();
                break;
            case 'print':
                this.printResults();
                break;
            default:
                console.warn(`Неизвестное действие: ${action}`);
        }
    }

    handleIndustryChange(industry) {
        // Обновление зависимых полей при смене индустрии
        this.appState.updateIndustryDependencies(industry);
        
        // Обновление UI
        this.updateIndustryUI(industry);
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        const field = input.name || input.dataset.field;
        const required = input.hasAttribute('required');
        const pattern = input.pattern;
        const min = input.min;
        const max = input.max;

        // Очистка предыдущих ошибок
        this.clearFieldError(input);

        // Проверка обязательности
        if (required && !value) {
            this.showFieldError(input, 'Это поле обязательно для заполнения');
            return false;
        }

        // Проверка паттерна
        if (pattern && value && !new RegExp(pattern).test(value)) {
            this.showFieldError(input, 'Неверный формат данных');
            return false;
        }

        // Проверка диапазона
        if (min && value && parseFloat(value) < parseFloat(min)) {
            this.showFieldError(input, `Минимальное значение: ${min}`);
            return false;
        }

        if (max && value && parseFloat(value) > parseFloat(max)) {
            this.showFieldError(input, `Максимальное значение: ${max}`);
            return false;
        }

        return true;
    }

    showFieldError(input, message) {
        input.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.dataset.field = input.name || input.dataset.field;
        
        input.parentNode.appendChild(errorDiv);
    }

    clearFieldError(input) {
        input.classList.remove('error');
        
        const errorDiv = input.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    processFormData(formData, type) {
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Обновление состояния приложения
        this.appState.updateFormData(data, type);
    }

    updateIndustryUI(industry) {
        // Обновление UI в зависимости от выбранной индустрии
        const industryElements = document.querySelectorAll('[data-industry]');
        
        industryElements.forEach(element => {
            const elementIndustry = element.dataset.industry;
            if (elementIndustry === industry || elementIndustry === 'all') {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Автоматическое удаление
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    exportData() {
        const data = this.appState.getExportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calculator-data.json';
        a.click();
        
        URL.revokeObjectURL(url);
    }

    shareResults() {
        const results = this.appState.getResults();
        const shareText = `Мой результат: ${results.savings} руб. экономии в год`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Калькулятор экономии маркетинга',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback - копирование в буфер
            navigator.clipboard.writeText(shareText);
            this.showNotification('Результат скопирован в буфер обмена');
        }
    }

    printResults() {
        window.print();
    }

    trackPageView() {
        // Аналитика просмотра страницы
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
    }

    trackExternalLink(url) {
        // Аналитика внешних ссылок
        if (window.gtag) {
            window.gtag('event', 'click', {
                event_category: 'external_link',
                event_label: url
            });
        }
    }
}

// Экспорт класса и синглтона
export { EventHandlers };

// Создаем синглтон, но не инициализируем его сразу
let eventHandlersInstance = null;

export const getEventHandlers = () => {
    if (!eventHandlersInstance) {
        eventHandlersInstance = new EventHandlers();
    }
    return eventHandlersInstance;
}; 