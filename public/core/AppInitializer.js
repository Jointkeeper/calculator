/**
 * AppInitializer - Модуль инициализации приложения
 * Отвечает за инициализацию всех компонентов и сервисов
 */

import { AppState } from './AppState.js';
import { NavigationManager } from '../managers/NavigationManager.js';
import { calculator } from './Calculator.js';
import { getEventHandlers } from '../handlers/EventHandlers.js';
import { uiManager } from '../components/UIManager.js';

class AppInitializer {
  constructor() {
    this.appState = AppState.getInstance();
    this.navigationManager = NavigationManager.getInstance();
    this.calculator = calculator;
    this.eventHandlers = getEventHandlers();
    this.uiManager = uiManager;
  }

  /**
   * Инициализация приложения
   */
  async initialize() {
    try {
      console.log('🚀 Инициализация приложения...');
      
      // Скрыть экран загрузки
      this.hideLoadingState();
      
      // Показать кнопку запуска калькулятора
      this.showStartButton();
      
      // Инициализация Event Handlers
      this.eventHandlers.initialize();
      
      // Настройка обработчика кнопки запуска
      this.setupStartButtonHandler();
      
      console.log('✅ Приложение готово к запуску калькулятора');
      
      // Dispatch события готовности
      this.dispatchEvent('appReady', this.appState.getAppState());
      
    } catch (error) {
      console.error('App: Ошибка инициализации компонентов:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Запуск калькулятора после нажатия кнопки
   */
  async startCalculator() {
    try {
      console.log('🎯 Запуск калькулятора...');
      
      // Показать состояние загрузки
      this.showLoadingState();
      
      // Инициализация UI менеджера
      await this.uiManager.initialize();
      // Явно назначаем window.app.componentManager и stepManager сразу после инициализации
      if (this.uiManager.setupComponentConnections) {
        this.uiManager.setupComponentConnections();
      }
      
      // Инициализация калькулятора
      await this.initializeCalculator();
      
      // Маркировка как инициализированное
      this.appState.setInitialized(true);
      
      // Показать контент калькулятора
      this.showCalculatorContent();
      console.log('[DEBUG] Контент калькулятора показан');
      
      // Скрыть кнопку запуска
      const startButton = document.getElementById('start-calculator');
      if (startButton) {
        startButton.style.display = 'none';
      }
      
      // Явно показать первый шаг через StepManager
      if (window.app && window.app.stepManager) {
        console.log('[DEBUG] Вызов window.app.stepManager.showStep(1)');
        window.app.stepManager.showStep(1);
      } else {
        console.warn('[DEBUG] window.app.stepManager не найден');
        // Прямая инициализация первого шага
        const componentManager = window.app?.componentManager;
        if (componentManager) {
          componentManager.showComponent('industrySelector');
        }
      }
      console.log('✅ Калькулятор успешно запущен');
      
    } catch (error) {
      console.error('❌ Ошибка запуска калькулятора:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Инициализация Calculator
   */
  async initializeCalculator() {
    try {
      // Используем модульный калькулятор
      this.calculator = calculator;
      
      console.log('✅ Calculator инициализирован');
      
    } catch (error) {
      console.error('Ошибка инициализации Calculator:', error);
      throw error;
    }
  }

  /**
   * Скрытие состояния загрузки
   */
  hideLoadingState() {
    const loadingElement = document.getElementById('loading-state');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }

  /**
   * Показ состояния загрузки
   */
  showLoadingState() {
    const startButton = document.getElementById('start-calculator');
    const loadingElement = document.getElementById('loading-state');
    
    if (startButton) {
      startButton.style.display = 'none';
    }
    
    if (loadingElement) {
      loadingElement.classList.remove('hidden');
    }
  }

  /**
   * Показ кнопки запуска калькулятора
   */
  showStartButton() {
    const startButton = document.getElementById('start-calculator');
    if (startButton) {
      startButton.style.display = 'block';
    }
  }

  /**
   * Настройка обработчика кнопки запуска
   */
  setupStartButtonHandler() {
    const startButton = document.getElementById('start-calculator-btn');
    if (startButton) {
      startButton.addEventListener('click', async (event) => {
        event.preventDefault();
        
        // Добавляем анимацию нажатия
        startButton.classList.add('scale-95');
        
        // Запускаем калькулятор
        await this.startCalculator();
        
        // Убираем анимацию
        setTimeout(() => {
          startButton.classList.remove('scale-95');
        }, 150);
      });
      
      console.log('✅ Обработчик кнопки запуска настроен');
    }
  }

  /**
   * Показ контента калькулятора
   */
  showCalculatorContent() {
    const calculatorElement = document.getElementById('calculator-content');
    if (calculatorElement) {
      calculatorElement.classList.remove('hidden');
    }
    // Показываем прогресс-бар
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) {
      progressContainer.classList.remove('hidden');
    }
  }

  /**
   * Обработка ошибок инициализации
   */
  handleInitializationError(error) {
    console.error('❌ Критическая ошибка инициализации:', error);
    
    // Показать пользователю сообщение об ошибке
    this.showError('Произошла ошибка при загрузке приложения. Пожалуйста, обновите страницу.');
  }

  /**
   * Показ ошибки пользователю
   */
  showError(message) {
    const errorContainer = document.getElementById('error-state');
    if (errorContainer) {
      errorContainer.classList.remove('hidden');
    }
  }

  /**
   * Dispatch события
   */
  dispatchEvent(eventName, detail = {}) {
    try {
      const event = new CustomEvent(eventName, {
        detail: {
          timestamp: Date.now(),
          ...detail
        },
        bubbles: true,
        cancelable: true
      });
      
      document.dispatchEvent(event);
      
    } catch (error) {
      console.error('❌ Ошибка dispatch события:', error);
    }
  }
}

export default AppInitializer; 