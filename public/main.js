/**
 * Main Application Entry Point
 * Универсальный калькулятор экономии маркетингового бюджета
 * 
 * @author Steamphony Digital Agency
 * @version 4.0.0 - Modular architecture with event handlers
 */

// Импорт модулей
import AppInitializer from './core/AppInitializer.js';
import EventHandler from './handlers/EventHandler.js';
import { AppState } from './core/AppState.js';
import { NavigationManager } from './managers/NavigationManager.js';
import { calculator } from './core/Calculator.js';
import { uiManager } from './components/UIManager.js';

/**
 * Главный класс приложения
 * Координирует работу всех модулей и менеджеров
 */
class App {
  constructor() {
    // Инициализация состояния приложения
    this.appState = AppState.getInstance();
    
    // Инициализация менеджеров
    this.navigationManager = NavigationManager.getInstance();
    
    // Инициализация модулей
    this.initializer = new AppInitializer();
    this.eventHandler = new EventHandler();
    this.calculator = calculator;
    this.uiManager = uiManager;
    
    // Инициализация
    this.init();
  }

  /**
   * Инициализация приложения
   * @private
   */
  init() {
    try {
      // Проверка готовности DOM
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
      } else {
        this.initializeComponents();
      }
    } catch (error) {
      console.error('App: Ошибка инициализации:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Инициализация всех компонентов
   * @private
   */
  async initializeComponents() {
    try {
      // Инициализация через AppInitializer
      await this.initializer.initialize();
      
      // Инициализация UI Manager (создает componentManager и stepManager)
      await this.uiManager.initialize();
      
      // Глобальный доступ для тестирования
      if (typeof window !== 'undefined') {
        window.app = this;
        // Добавляем менеджеры в глобальный объект
        window.app.componentManager = this.uiManager.componentManager;
        window.app.stepManager = this.uiManager.stepManager;
      }
      
    } catch (error) {
      console.error('App: Ошибка инициализации компонентов:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Обработка ошибок инициализации
   * @private
   */
  handleInitializationError(error) {
    console.error('❌ Критическая ошибка инициализации:', error);
    
    // Показать пользователю сообщение об ошибке
    this.showError('Произошла ошибка при загрузке приложения. Пожалуйста, обновите страницу.');
  }

  /**
   * Показ ошибки пользователю
   * @private
   */
  showError(message) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="error-message">
          <h3>Ошибка</h3>
          <p>${message}</p>
          <button onclick="location.reload()">Обновить страницу</button>
        </div>
      `;
      errorContainer.style.display = 'block';
    }
  }

  /**
   * Получение данных формы
   */
  getFormData() {
    return this.appState.getAppState();
  }

  /**
   * Получение состояния приложения
   */
  getAppState() {
    return this.appState.getAppState();
  }

  /**
   * Делегирование обработки событий к EventHandler
   */
  handleIndustrySelect(industry) {
    return this.eventHandler.handleIndustrySelect(industry);
  }

  handleIndustryNext(selectionData) {
    return this.eventHandler.handleIndustryNext(selectionData);
  }

  handleBusinessSizeSelect(size) {
    return this.eventHandler.handleBusinessSizeSelect(size);
  }

  handleBusinessSizeNext(data) {
    return this.eventHandler.handleBusinessSizeNext(data);
  }

  handleBusinessSizeBack(data) {
    return this.eventHandler.handleBusinessSizeBack(data);
  }

  handleMarketingBudgetSelect(budget) {
    return this.eventHandler.handleMarketingBudgetSelect(budget);
  }

  handleMarketingBudgetNext(data) {
    return this.eventHandler.handleMarketingBudgetNext(data);
  }

  handleMarketingBudgetBack(data) {
    return this.eventHandler.handleMarketingBudgetBack(data);
  }

  handleIndustryConfirmed(detail) {
    return this.eventHandler.handleIndustryConfirmed(detail);
  }

  handleIndustrySelected(detail) {
    return this.eventHandler.handleIndustrySelected(detail);
  }

  handleCalculationComplete(results) {
    return this.eventHandler.handleCalculationComplete(results);
  }

  handleCalculationError(error) {
    return this.eventHandler.handleCalculationError(error);
  }

  handleStepNavigation(step) {
    return this.eventHandler.handleStepNavigation(step);
  }

  nextStep() {
    return this.eventHandler.nextStep();
  }

  previousStep() {
    return this.eventHandler.previousStep();
  }

  updateStep(step) {
    return this.eventHandler.updateStep(step);
  }

  showStepContent(step) {
    return this.eventHandler.showStepContent(step);
  }
}

// Создание и экспорт экземпляра приложения
const app = new App();
export default app; 