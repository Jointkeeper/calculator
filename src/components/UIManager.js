/**
 * UIManager - Модуль управления UI компонентами
 * Централизованное управление интерфейсом приложения
 * Версия 2.0 - Модульная архитектура
 */

import { AppState } from '../core/AppState.js?v=1.0.4';
import { NavigationManager } from '../managers/NavigationManager.js?v=1.0.4';
import { componentManager } from './managers/ComponentManager.js?v=1.0.4';
import { stepManager } from './managers/StepManager.js?v=1.0.4';

class UIManager {
    constructor() {
        this.appState = AppState.getInstance();
        this.navigationManager = NavigationManager.getInstance();
        this.componentManager = componentManager;
        this.stepManager = stepManager;
        this.initialized = false;
    }

    /**
     * Инициализация UI менеджера
     */
    async initialize() {
        if (this.initialized) return;

        try {
            console.log('🎨 Инициализация UIManager v2.0...');
            
            // Инициализация подменеджеров
            await this.componentManager.initialize();
            await this.stepManager.initialize();
            
            // Настройка связей между компонентами
            this.setupComponentConnections();
            
            // Подписка на изменения состояния
            this.subscribeToStateChanges();
            
            this.initialized = true;
            console.log('✅ UIManager v2.0 инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации UIManager:', error);
            throw error;
        }
    }

    /**
     * Настройка связей между компонентами
     */
    setupComponentConnections() {
        try {
            // Делаем менеджеры доступными глобально для совместимости
            window.app = window.app || {};
            window.app.componentManager = this.componentManager;
            window.app.stepManager = this.stepManager;
            
            console.log('🔗 Связи между компонентами настроены');
        } catch (error) {
            console.error('❌ Ошибка настройки связей:', error);
        }
    }

    /**
     * Подписка на изменения состояния
     */
    subscribeToStateChanges() {
        this.appState.subscribe('formData', (formData) => {
            this.updateFormDataDisplay(formData);
        });

        this.appState.subscribe('calculatorCompleted', (completed) => {
            if (completed) {
                this.onCalculatorComplete();
            }
        });
    }

    /**
     * Обновление отображения данных формы
     */
    updateFormDataDisplay(formData) {
        // Логика обновления отображения данных формы
        console.log('📊 Обновление отображения данных формы:', formData);
    }

    /**
     * Обработка завершения калькулятора
     */
    onCalculatorComplete() {
        this.stepManager.onCalculatorComplete();
    }

    /**
     * Получение компонента по имени
     */
    getComponent(name) {
        return this.componentManager.getComponent(name);
    }

    /**
     * Показать компонент
     */
    showComponent(name) {
        this.componentManager.showComponent(name);
    }

    /**
     * Показать шаг
     */
    showStep(step) {
        this.stepManager.showStep(step);
    }

    /**
     * Следующий шаг
     */
    nextStep() {
        this.stepManager.nextStep();
    }

    /**
     * Предыдущий шаг
     */
    previousStep() {
        this.stepManager.previousStep();
    }

    /**
     * Получение текущего шага
     */
    getCurrentStep() {
        return this.stepManager.getCurrentStep();
    }

    /**
     * Сброс UI менеджера
     */
    reset() {
        this.componentManager.reset();
        this.stepManager.reset();
        this.initialized = false;
    }

    /**
     * Уничтожение UI менеджера
     */
    destroy() {
        this.componentManager.destroy();
        this.stepManager.destroy();
        this.reset();
    }
}

// Экспорт синглтона
export const uiManager = new UIManager();