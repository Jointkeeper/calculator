/**
 * StepManager - Менеджер шагов калькулятора
 * Управляет навигацией между шагами и отображением
 */

import { AppState } from '../../core/AppState.js?v=1.0.4';
import { NavigationManager } from '../../managers/NavigationManager.js?v=1.0.4';

class StepManager {
    constructor() {
        this.appState = AppState.getInstance();
        this.navigationManager = NavigationManager.getInstance();
        this.currentStep = 1;
        this.totalSteps = 6;
        this.stepComponents = new Map();
    }

    /**
     * Инициализация менеджера шагов
     */
    async initialize() {
        try {
            console.log('🎯 Инициализация StepManager...');
            
            // Настройка компонентов шагов
            this.setupStepComponents();
            
            // Подписка на изменения состояния
            this.subscribeToStateChanges();
            
            // Показываем первый шаг
            this.showStep(1);
            
            console.log('✅ StepManager инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации StepManager:', error);
            throw error;
        }
    }

    /**
     * Настройка компонентов шагов
     */
    setupStepComponents() {
        this.stepComponents.set(1, 'industrySelector');
        this.stepComponents.set(2, 'businessSizeStep');
        this.stepComponents.set(3, 'marketingBudgetStep');
        this.stepComponents.set(4, 'marketingTeamStep');
        this.stepComponents.set(5, 'marketingToolsStep');
        this.stepComponents.set(6, 'contactFormStep');
    }

    /**
     * Подписка на изменения состояния
     */
    subscribeToStateChanges() {
        this.appState.subscribe('currentStep', (step) => {
            this.updateStepDisplay(step);
        });
    }

    /**
     * Обновление отображения шага
     */
    updateStepDisplay(step) {
        try {
            // Обновляем прогресс-бар
            this.updateProgressBar(step);
            
            // Обновляем заголовок страницы
            this.updatePageTitle(step);
            
            // Показываем соответствующий компонент
            this.showStepComponent(step);
            
        } catch (error) {
            console.error('❌ Ошибка обновления отображения шага:', error);
        }
    }

    /**
     * Обновление прогресс-бара
     */
    updateProgressBar(step) {
        const progressBar = window.app?.componentManager?.getComponent('progressBar');
        if (progressBar) {
            progressBar.update(step);
            progressBar.setStep(step);
        }
    }

    /**
     * Обновление заголовка страницы
     */
    updatePageTitle(step) {
        const titles = {
            1: 'Выбор отрасли',
            2: 'Размер бизнеса',
            3: 'Маркетинговый бюджет',
            4: 'Маркетинговая команда',
            5: 'Маркетинговые инструменты',
            6: 'Контактная информация'
        };
        
        const title = titles[step] || 'Калькулятор экономии';
        document.title = `${title} - Steamphony`;
    }

    /**
     * Показать компонент шага
     */
    showStepComponent(step) {
        try {
            // Скрываем все шаги
            this.hideAllSteps();
            
            // Показываем нужный шаг
            const componentName = this.stepComponents.get(step);
            if (componentName) {
                const componentManager = window.app?.componentManager;
                if (componentManager) {
                    componentManager.showComponent(componentName);
                }
            }
            
            this.currentStep = step;
            
        } catch (error) {
            console.error('❌ Ошибка показа компонента шага:', error);
        }
    }

    /**
     * Скрыть все шаги
     */
    hideAllSteps() {
        const formContent = document.getElementById('form-content');
        if (formContent) {
            const steps = formContent.querySelectorAll('.calculator-step');
            steps.forEach(step => {
                step.classList.remove('active');
            });
        }
    }

    /**
     * Показать конкретный шаг
     */
    showStep(step) {
        if (step >= 1 && step <= this.totalSteps) {
            this.appState.setCurrentStep(step);
        }
    }

    /**
     * Следующий шаг
     */
    nextStep() {
        const nextStep = Math.min(this.currentStep + 1, this.totalSteps);
        this.showStep(nextStep);
    }

    /**
     * Предыдущий шаг
     */
    previousStep() {
        const prevStep = Math.max(this.currentStep - 1, 1);
        this.showStep(prevStep);
    }

    /**
     * Переход к конкретному шагу
     */
    goToStep(step) {
        this.showStep(step);
    }

    /**
     * Получение текущего шага
     */
    getCurrentStep() {
        return this.currentStep;
    }

    /**
     * Получение общего количества шагов
     */
    getTotalSteps() {
        return this.totalSteps;
    }

    /**
     * Проверка, является ли шаг последним
     */
    isLastStep() {
        return this.currentStep === this.totalSteps;
    }

    /**
     * Проверка, является ли шаг первым
     */
    isFirstStep() {
        return this.currentStep === 1;
    }

    /**
     * Обработка завершения калькулятора
     */
    onCalculatorComplete() {
        try {
            console.log('🎉 Калькулятор завершен!');
            
            // Показываем результаты
            this.showResults();
            
            // Обновляем состояние
            this.appState.setCalculatorCompleted(true);
            
        } catch (error) {
            console.error('❌ Ошибка завершения калькулятора:', error);
        }
    }

    /**
     * Показать результаты
     */
    showResults() {
        const formContent = document.getElementById('form-content');
        if (!formContent) return;

        const formData = this.appState.getFormData();
        const results = this.calculateResults(formData);

        formContent.innerHTML = `
            <div class="calculator-step active">
                <div class="results-container">
                    <div class="savings-amount">${this.formatCurrency(results.totalSavings)}</div>
                    <div class="savings-label">Ваша потенциальная экономия в месяц</div>
                    
                    <div class="savings-breakdown">
                        <div class="breakdown-item">
                            <span class="breakdown-label">Экономия на инструментах</span>
                            <span class="breakdown-value">${this.formatCurrency(results.toolsSavings)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">Экономия на времени</span>
                            <span class="breakdown-value">${this.formatCurrency(results.timeSavings)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">Экономия на ошибках</span>
                            <span class="breakdown-value">${this.formatCurrency(results.errorSavings)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">Общая экономия</span>
                            <span class="breakdown-value">${this.formatCurrency(results.totalSavings)}</span>
                        </div>
                    </div>
                    
                    <div class="mt-8">
                        <p class="text-gray-600 mb-4">Получите детальный отчет с рекомендациями</p>
                        <button class="nav-button primary" onclick="window.app.eventHandler.handleGetReport()">
                            Получить отчет
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Расчет результатов
     */
    calculateResults(formData) {
        const budget = formData.budget || 200000;
        const teamSize = formData.team || '1';
        
        // Простая логика расчета экономии
        const toolsSavings = budget * 0.15; // 15% экономии на инструментах
        const timeSavings = budget * 0.25; // 25% экономии времени
        const errorSavings = budget * 0.10; // 10% экономии на ошибках
        
        const totalSavings = toolsSavings + timeSavings + errorSavings;
        
        return {
            toolsSavings: Math.round(toolsSavings),
            timeSavings: Math.round(timeSavings),
            errorSavings: Math.round(errorSavings),
            totalSavings: Math.round(totalSavings)
        };
    }

    /**
     * Форматирование валюты
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Сброс менеджера шагов
     */
    reset() {
        this.currentStep = 1;
        this.stepComponents.clear();
        this.setupStepComponents();
    }

    /**
     * Уничтожение менеджера
     */
    destroy() {
        this.reset();
    }
}

// Экспорт синглтона
export const stepManager = new StepManager();