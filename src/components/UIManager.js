/**
 * UIManager - Модуль управления UI компонентами
 * Централизованное управление интерфейсом приложения
 */

import { AppState } from '../core/AppState.js';
import { NavigationManager } from '../managers/NavigationManager.js';

class UIManager {
    constructor() {
        this.appState = AppState.getInstance();
        this.navigationManager = NavigationManager.getInstance();
        this.components = new Map();
        this.initialized = false;
    }

    /**
     * Инициализация UI менеджера
     */
    async initialize() {
        if (this.initialized) return;

        try {
            console.log('🎨 Инициализация UIManager...');
            
            // Инициализация базовых компонентов
            await this.initializeProgressBar();
            await this.initializeIndustrySelector();
            await this.initializeBusinessSizeStep();
            await this.initializeMarketingBudgetStep();
            await this.initializeMarketingTeamStep();
            await this.initializeMarketingToolsStep();
            await this.initializeContactFormStep();
            
            // Настройка связей между компонентами
            this.setupComponentConnections();
            
            // Подписка на изменения состояния
            this.subscribeToStateChanges();
            
            this.initialized = true;
            console.log('✅ UIManager инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации UIManager:', error);
            throw error;
        }
    }

    /**
     * Инициализация ProgressBar
     */
    async initializeProgressBar() {
        try {
            const progressContainer = document.getElementById('progress-container');
            
            if (!progressContainer) {
                throw new Error('Не найден контейнер #progress-container');
            }
            
            if (typeof window.ProgressBar === 'undefined') {
                throw new Error('ProgressBar класс не найден');
            }
            
            const progressBar = new window.ProgressBar(progressContainer, 6, {
                allowClickNavigation: true,
                showPercentage: true,
                enableKeyboardNavigation: true,
                trackAnalytics: true
            });
            
            this.components.set('progressBar', progressBar);
            console.log('✅ ProgressBar инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации ProgressBar:', error);
            throw error;
        }
    }

    /**
     * Инициализация IndustrySelector
     */
    async initializeIndustrySelector() {
        try {
            const formContent = document.getElementById('form-content');
            
            if (!formContent) {
                throw new Error('Не найден контейнер #form-content');
            }
            
            if (typeof window.IndustrySelector === 'undefined') {
                throw new Error('IndustrySelector класс не найден');
            }
            
            const industrySelector = new window.IndustrySelector(formContent, {
                onSelect: (industry) => this.handleIndustrySelect(industry),
                onNext: (selectionData) => this.handleIndustryNext(selectionData),
                showPopularSection: true,
                enableSearch: true
            });
            
            this.components.set('industrySelector', industrySelector);
            console.log('✅ IndustrySelector инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации IndustrySelector:', error);
            throw error;
        }
    }

    /**
     * Инициализация BusinessSizeStep
     */
    async initializeBusinessSizeStep() {
        try {
            const formContent = document.getElementById('form-content');
            
            if (!formContent) {
                throw new Error('Не найден контейнер #form-content');
            }
            
            if (typeof window.BusinessSizeStep === 'undefined') {
                throw new Error('BusinessSizeStep класс не найден');
            }
            
            const businessSizeStep = new window.BusinessSizeStep(formContent, {
                onSelect: (size) => this.handleBusinessSizeSelect(size),
                onNext: (data) => this.handleBusinessSizeNext(data),
                onBack: (data) => this.handleBusinessSizeBack(data),
                trackAnalytics: true
            });
            
            this.components.set('businessSizeStep', businessSizeStep);
            console.log('✅ BusinessSizeStep инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации BusinessSizeStep:', error);
            throw error;
        }
    }

    /**
     * Инициализация MarketingBudgetStep
     */
    async initializeMarketingBudgetStep() {
        try {
            const formContent = document.getElementById('form-content');
            
            if (!formContent) {
                throw new Error('Не найден контейнер #form-content');
            }
            
            if (typeof window.MarketingBudgetStep === 'undefined') {
                throw new Error('MarketingBudgetStep класс не найден');
            }
            
            const marketingBudgetStep = new window.MarketingBudgetStep(formContent, {
                onSelect: (budget) => this.handleMarketingBudgetSelect(budget),
                onNext: (data) => this.handleMarketingBudgetNext(data),
                onBack: (data) => this.handleMarketingBudgetBack(data),
                trackAnalytics: true
            });
            
            this.components.set('marketingBudgetStep', marketingBudgetStep);
            console.log('✅ MarketingBudgetStep инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации MarketingBudgetStep:', error);
            throw error;
        }
    }

    /**
     * Инициализация MarketingTeamStep
     */
    async initializeMarketingTeamStep() {
        try {
            const formContent = document.getElementById('form-content');
            
            if (!formContent) {
                throw new Error('Не найден контейнер #form-content');
            }
            
            if (typeof window.MarketingTeamStep === 'undefined') {
                throw new Error('MarketingTeamStep класс не найден');
            }
            
            const marketingTeamStep = new window.MarketingTeamStep(formContent, {
                onSelect: (data) => this.handleMarketingTeamSelect(data),
                onNext: (data) => this.handleMarketingTeamNext(data),
                onBack: (data) => this.handleMarketingTeamBack(data),
                trackAnalytics: true
            });
            
            this.components.set('marketingTeamStep', marketingTeamStep);
            console.log('✅ MarketingTeamStep инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации MarketingTeamStep:', error);
            throw error;
        }
    }

    /**
     * Инициализация MarketingToolsStep
     */
    async initializeMarketingToolsStep() {
        try {
            const formContent = document.getElementById('form-content');
            
            if (!formContent) {
                throw new Error('Не найден контейнер #form-content');
            }
            
            if (typeof window.MarketingToolsStep === 'undefined') {
                throw new Error('MarketingToolsStep класс не найден');
            }
            
            const marketingToolsStep = new window.MarketingToolsStep(formContent, {
                onSelect: (data) => this.handleMarketingToolsSelect(data),
                onNext: (data) => this.handleMarketingToolsNext(data),
                onBack: (data) => this.handleMarketingToolsBack(data),
                trackAnalytics: true
            });
            
            this.components.set('marketingToolsStep', marketingToolsStep);
            console.log('✅ MarketingToolsStep инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации MarketingToolsStep:', error);
            throw error;
        }
    }

    /**
     * Инициализация ContactFormStep
     */
    async initializeContactFormStep() {
        try {
            if (typeof window.ContactFormStep === 'undefined') {
                throw new Error('ContactFormStep класс не найден');
            }
            
            const contactFormStep = new window.ContactFormStep({
                analytics: window.analytics,
                onSubmit: (contactData) => this.handleContactFormSubmit(contactData),
                onComplete: () => this.onCalculatorComplete()
            });
            
            this.components.set('contactFormStep', contactFormStep);
            console.log('✅ ContactFormStep инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации ContactFormStep:', error);
            throw error;
        }
    }

    /**
     * Настройка связей между компонентами
     */
    setupComponentConnections() {
        try {
            // Слушатели событий ProgressBar
            const progressBar = this.components.get('progressBar');
            if (progressBar) {
                const progressContainer = document.getElementById('progress-container');
                if (progressContainer) {
                    progressContainer.addEventListener('stepClicked', (event) => {
                        this.handleStepNavigation(event.detail.step);
                    });
                }
            }
            
            // Слушатели событий IndustrySelector
            const industrySelector = this.components.get('industrySelector');
            if (industrySelector) {
                const formContainer = document.getElementById('form-content');
                if (formContainer) {
                    formContainer.addEventListener('industryConfirmed', (event) => {
                        this.handleIndustryConfirmed(event.detail);
                    });
                    
                    formContainer.addEventListener('industrySelected', (event) => {
                        this.handleIndustrySelected(event.detail);
                    });
                }
            }
            
            console.log('✅ Связи между компонентами настроены');
            
        } catch (error) {
            console.error('❌ Ошибка настройки связей:', error);
        }
    }

    /**
     * Подписка на изменения состояния
     */
    subscribeToStateChanges() {
        // Подписка на изменения шага
        this.appState.subscribe('stepChanged', (step) => {
            this.updateStepDisplay(step);
        });
        
        // Подписка на изменения данных формы
        this.appState.subscribe('formDataChanged', (formData) => {
            this.updateFormDataDisplay(formData);
        });
        
        // Подписка на изменения результатов
        this.appState.subscribe('resultsChanged', (results) => {
            this.updateResultsDisplay(results);
        });
    }

    /**
     * Обновление отображения шага
     */
    updateStepDisplay(step) {
        try {
            // Обновление ProgressBar
            const progressBar = this.components.get('progressBar');
            if (progressBar) {
                progressBar.updateProgress(step);
            }
            
            // Показ соответствующего компонента
            this.showStepComponent(step);
            
            // Обновление заголовка страницы
            this.updatePageTitle(step);
            
            console.log(`📍 Обновлен шаг: ${step}`);
            
        } catch (error) {
            console.error('❌ Ошибка обновления отображения шага:', error);
        }
    }

    /**
     * Показ компонента шага
     */
    showStepComponent(step) {
        try {
            // Скрыть все компоненты
            this.hideAllComponents();
            
            // Показать нужный компонент
            switch (step) {
                case 1:
                    this.showComponent('industrySelector');
                    break;
                case 2:
                    this.showComponent('businessSizeStep');
                    break;
                case 3:
                    this.showComponent('marketingBudgetStep');
                    break;
                case 4:
                    this.showComponent('marketingToolsStep');
                    break;
                case 5:
                    this.showComponent('marketingTeamStep');
                    break;
                case 6:
                    this.showComponent('contactFormStep');
                    break;
                default:
                    console.warn(`⚠️ Неизвестный шаг: ${step}`);
            }
            
        } catch (error) {
            console.error('❌ Ошибка показа компонента шага:', error);
        }
    }

    /**
     * Скрытие всех компонентов
     */
    hideAllComponents() {
        this.components.forEach((component, name) => {
            if (component && typeof component.hide === 'function') {
                component.hide();
            } else if (component && component.container) {
                component.container.style.display = 'none';
            }
        });
    }

    /**
     * Показ компонента
     */
    showComponent(componentName) {
        const component = this.components.get(componentName);
        if (component) {
            if (typeof component.show === 'function') {
                component.show();
            } else if (component.container) {
                component.container.style.display = 'block';
            }
            
            // Обновление данных компонента
            this.updateComponentData(componentName);
        }
    }

    /**
     * Обновление данных компонента
     */
    updateComponentData(componentName) {
        const component = this.components.get(componentName);
        const formData = this.appState.getFormData();
        
        if (component && typeof component.updateWithFormData === 'function') {
            component.updateWithFormData(formData);
        }
    }

    /**
     * Обновление заголовка страницы
     */
    updatePageTitle(step) {
        const titles = {
            1: 'Выбор отрасли - Steamphony Calculator',
            2: 'Размер бизнеса - Steamphony Calculator',
            3: 'Маркетинговый бюджет - Steamphony Calculator',
            4: 'Маркетинговые инструменты - Steamphony Calculator',
            5: 'Маркетинговая команда - Steamphony Calculator',
            6: 'Результаты анализа - Steamphony Calculator'
        };
        
        document.title = titles[step] || 'Steamphony Calculator';
    }

    /**
     * Обновление отображения данных формы
     */
    updateFormDataDisplay(formData) {
        // Обновление всех компонентов с новыми данными
        this.components.forEach((component, name) => {
            if (component && typeof component.updateWithFormData === 'function') {
                component.updateWithFormData(formData);
            }
        });
    }

    /**
     * Обновление отображения результатов
     */
    updateResultsDisplay(results) {
        const contactFormStep = this.components.get('contactFormStep');
        if (contactFormStep && typeof contactFormStep.updateWithResults === 'function') {
            contactFormStep.updateWithResults(results);
        }
    }

    /**
     * Обработчики событий компонентов
     */
    handleIndustrySelect(industry) {
        console.log('📊 Выбрана отрасль:', industry);
        this.appState.updateField('industry', industry);
    }

    handleIndustryNext(selectionData) {
        console.log('➡️ Переход к следующему шагу:', selectionData);
        
        this.appState.updateFormData(selectionData);
        this.navigationManager.nextStep();
    }

    handleBusinessSizeSelect(size) {
        console.log('📏 Размер бизнеса выбран:', size);
        this.appState.updateField('businessSize', size);
    }

    handleBusinessSizeNext(data) {
        console.log('➡️ Переход к следующему шагу из BusinessSizeStep:', data);
        
        this.appState.updateFormData(data);
        this.navigationManager.nextStep();
    }

    handleBusinessSizeBack(data) {
        console.log('⬅️ Возврат к предыдущему шагу из BusinessSizeStep:', data);
        this.navigationManager.previousStep();
    }

    handleMarketingBudgetSelect(budget) {
        console.log('💰 Маркетинговый бюджет выбран:', budget);
        this.appState.updateField('marketingBudget', budget);
    }

    handleMarketingBudgetNext(data) {
        console.log('➡️ Переход к следующему шагу из MarketingBudgetStep:', data);
        
        this.appState.updateFormData(data);
        this.navigationManager.nextStep();
    }

    handleMarketingBudgetBack(data) {
        console.log('⬅️ Возврат к предыдущему шагу из MarketingBudgetStep:', data);
        this.navigationManager.previousStep();
    }

    handleMarketingTeamSelect(data) {
        console.log('👥 Маркетинговая команда выбрана:', data);
        this.appState.updateField('marketingTeam', data);
    }

    handleMarketingTeamNext(data) {
        console.log('➡️ Переход к следующему шагу из MarketingTeamStep:', data);
        
        this.appState.updateFormData(data);
        this.navigationManager.nextStep();
    }

    handleMarketingTeamBack(data) {
        console.log('⬅️ Возврат к предыдущему шагу из MarketingTeamStep:', data);
        this.navigationManager.previousStep();
    }

    handleMarketingToolsSelect(data) {
        console.log('🛠️ Маркетинговые инструменты выбраны:', data);
        this.appState.updateField('marketingTools', data);
    }

    handleMarketingToolsNext(data) {
        console.log('➡️ Переход к следующему шагу из MarketingToolsStep:', data);
        
        this.appState.updateFormData(data);
        this.navigationManager.nextStep();
    }

    handleMarketingToolsBack(data) {
        console.log('⬅️ Возврат к предыдущему шагу из MarketingToolsStep:', data);
        this.navigationManager.previousStep();
    }

    handleContactFormSubmit(contactData) {
        console.log('📝 Форма контактов отправлена:', contactData);
        this.appState.updateField('contactInfo', contactData);
    }

    handleIndustryConfirmed(detail) {
        console.log('✅ Отрасль подтверждена:', detail);
        this.appState.updateField('industry', detail.industry);
    }

    handleIndustrySelected(detail) {
        console.log('🎯 Отрасль выбрана:', detail);
    }

    handleStepNavigation(step) {
        console.log(`🔄 Переход к шагу ${step}`);
        this.navigationManager.navigateToStep(step);
    }

    onCalculatorComplete() {
        console.log('🎉 Калькулятор завершен!');
        
        // Dispatch события завершения
        const event = new CustomEvent('calculatorComplete', {
            detail: {
                formData: this.appState.getFormData(),
                results: this.appState.getResults(),
                completionTime: Date.now()
            },
            bubbles: true
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Получение компонента
     */
    getComponent(name) {
        return this.components.get(name);
    }

    /**
     * Сброс всех компонентов
     */
    reset() {
        this.components.forEach((component, name) => {
            if (component && typeof component.reset === 'function') {
                component.reset();
            }
        });
    }

    /**
     * Уничтожение UI менеджера
     */
    destroy() {
        this.components.forEach((component, name) => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        this.components.clear();
        this.initialized = false;
    }
}

// Экспорт синглтона
export const uiManager = new UIManager(); 