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
      
      // Инициализация обработчиков событий для production-дизайна
      this.initializeProductionHandlers();
      
      // Глобальный доступ для тестирования
      if (typeof window !== 'undefined') {
        window.app = this;
      }
      
    } catch (error) {
      console.error('App: Ошибка инициализации компонентов:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Инициализация обработчиков для production-дизайна
   * @private
   */
  initializeProductionHandlers() {
    // Обработчик кнопки "Начать расчет"
    const startButton = document.getElementById('start-calculator-btn');
    if (startButton) {
      startButton.addEventListener('click', () => {
        this.showStep(1);
      });
    }

    // Обработчики для опций (если они есть на странице)
    document.addEventListener('click', (e) => {
      if (e.target.closest('.option-button')) {
        const optionButton = e.target.closest('.option-button');
        this.selectOption(optionButton);
      }
    });
  }

  /**
   * Показать шаг калькулятора
   */
  showStep(stepNumber) {
    const startScreen = document.getElementById('start-screen');
    const progressBar = document.getElementById('progress-bar');
    const calculatorContent = document.getElementById('calculator-content');
    
    if (startScreen) {
      startScreen.style.display = 'none';
    }
    
    if (progressBar) {
      progressBar.classList.add('visible');
    }
    
    if (calculatorContent) {
      calculatorContent.classList.remove('hidden');
    }
    
    // Обновить прогресс
    this.updateProgress(stepNumber - 1, 6);
    
    // Показать соответствующий шаг через UIManager
    this.uiManager.showStep(stepNumber);
  }

  /**
   * Выбрать опцию
   */
  selectOption(element) {
    // Убрать выделение с соседних элементов
    const parent = element.parentNode;
    if (parent) {
      parent.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('selected');
      });
    }
    // Добавить выделение к выбранному элементу
    element.classList.add('selected');
  }

  /**
   * Переключить опцию (для множественного выбора)
   */
  toggleOption(element) {
    element.classList.toggle('selected');
  }

  /**
   * Обновить прогресс
   */
  updateProgress(currentStep, totalSteps) {
    const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
    
    const stepIndicator = document.querySelector('.step-indicator');
    const progressPercentageEl = document.querySelector('.progress-percentage');
    const progressFill = document.querySelector('.progress-fill');
    const dots = document.querySelectorAll('.step-dot');
    
    if (stepIndicator) {
      stepIndicator.textContent = `Шаг ${currentStep + 1} из ${totalSteps}`;
    }
    
    if (progressPercentageEl) {
      progressPercentageEl.textContent = `${Math.round(progressPercentage)}% завершено`;
    }
    
    if (progressFill) {
      progressFill.style.width = `${progressPercentage}%`;
    }
    
    dots.forEach((dot, index) => {
      dot.classList.remove('active', 'completed');
      if (index === currentStep) {
        dot.classList.add('active');
      } else if (index < currentStep) {
        dot.classList.add('completed');
      }
    });
  }

  /**
   * Показать результаты
   */
  showResults() {
    // Скрыть все шаги
    const allSteps = document.querySelectorAll('.calculator-step');
    allSteps.forEach(step => {
      step.classList.remove('active');
    });
    
    // Скрыть прогресс-бар
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.classList.remove('visible');
    }
    
    // Показать экран результатов
    const resultsScreen = document.getElementById('results-screen');
    if (resultsScreen) {
      resultsScreen.style.display = 'block';
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