/**
 * EventHandler - Модуль обработки событий приложения
 * Централизованная обработка всех событий калькулятора
 */

import { AppState } from '../core/AppState.js';
import { NavigationManager } from '../managers/NavigationManager.js';

class EventHandler {
  constructor() {
    this.appState = AppState.getInstance();
    this.navigationManager = NavigationManager.getInstance();
  }

  /**
   * Обработка выбора отрасли
   */
  handleIndustrySelect(industry) {
    try {
      console.log('🏭 Выбрана отрасль:', industry);
      
      // Обновляем состояние
      this.appState.updateField('industry', industry);
      
      // Отправляем аналитику
      this.trackEvent('industry_selected', {
        industry: industry.key,
        industryName: industry.title
      });
      
    } catch (error) {
      console.error('❌ Ошибка обработки выбора отрасли:', error);
    }
  }

  /**
   * Обработка перехода от выбора отрасли
   */
  handleIndustryNext(selectionData) {
    try {
      console.log('➡️ Переход от выбора отрасли:', selectionData);
      
      // Сохраняем данные
      this.appState.updateField('industry', selectionData.industry);
      
      // Переходим к следующему шагу
      this.navigationManager.nextStep();
      
      // Отправляем аналитику
      this.trackEvent('industry_step_completed', {
        industry: selectionData.industry.key,
        step: 1
      });
      
    } catch (error) {
      console.error('❌ Ошибка обработки перехода от отрасли:', error);
    }
  }

  /**
   * Обработка выбора размера бизнеса
   */
  handleBusinessSizeSelect(size) {
    try {
      console.log('📊 Выбран размер бизнеса:', size);
      
      // Обновляем состояние
      this.appState.updateField('businessSize', size);
      
      // Отправляем аналитику
      this.trackEvent('business_size_selected', {
        size: size.key,
        sizeName: size.title
      });
      
    } catch (error) {
      console.error('❌ Ошибка обработки выбора размера бизнеса:', error);
    }
  }

  /**
   * Обработка перехода от выбора размера бизнеса
   */
  handleBusinessSizeNext(data) {
    try {
      console.log('➡️ Переход от выбора размера бизнеса:', data);
      
      // Сохраняем данные
      this.appState.updateField('businessSize', data.businessSize);
      
      // Переходим к следующему шагу
      this.navigationManager.nextStep();
      
      // Отправляем аналитику
      this.trackEvent('business_size_step_completed', {
        size: data.businessSize.key,
        step: 2
      });
      
    } catch (error) {
      console.error('❌ Ошибка обработки перехода от размера бизнеса:', error);
    }
  }

  /**
   * Обработка возврата к выбору размера бизнеса
   */
  handleBusinessSizeBack(data) {
    try {
      console.log('⬅️ Возврат к выбору размера бизнеса');
      
      // Переходим к предыдущему шагу
      this.navigationManager.previousStep();
      
      // Отправляем аналитику
      this.trackEvent('business_size_step_back', {
        step: 2
      });
      
    } catch (error) {
      console.error('❌ Ошибка обработки возврата к размеру бизнеса:', error);
    }
  }

  /**
   * Обработка выбора маркетингового бюджета
   */
  handleMarketingBudgetSelect(budget) {
    try {
      console.log('💰 Выбран маркетинговый бюджет:', budget);
      
      // Обновляем состояние
      this.appState.updateField('marketingBudget', budget);
      
      // Отправляем аналитику
      this.trackEvent('marketing_budget_selected', {
        budget: budget.monthly,
        budgetRange: budget.range
      });
      
    } catch (error) {
      console.error('❌ Ошибка обработки выбора бюджета:', error);
    }
  }

  /**
   * Обработка перехода от выбора бюджета
   */
  handleMarketingBudgetNext(data) {
    try {
      console.log('➡️ Переход от выбора бюджета:', data);
      
      // Сохраняем данные
      this.appState.updateField('marketingBudget', data.marketingBudget);
      
      // Переходим к следующему шагу
      this.navigationManager.nextStep();
      
      // Отправляем аналитику
      this.trackEvent('marketing_budget_step_completed', {
        budget: data.marketingBudget.monthly,
        step: 3
      });
      
    } catch (error) {
      console.error('❌ Ошибка обработки перехода от бюджета:', error);
    }
  }

  /**
   * Обработка возврата к выбору бюджета
   */
  handleMarketingBudgetBack(data) {
    try {
      console.log('⬅️ Возврат к выбору бюджета');
      
      // Переходим к предыдущему шагу
      this.navigationManager.previousStep();
      
      // Отправляем аналитику
      this.trackEvent('marketing_budget_step_back', {
        step: 3
      });
      
    } catch (error) {
      console.error('❌ Ошибка обработки возврата к бюджету:', error);
    }
  }

  /**
   * Обработка подтверждения отрасли
   */
  handleIndustryConfirmed(detail) {
    try {
      console.log('✅ Отрасль подтверждена:', detail);
      
      // Обновляем состояние
      this.appState.updateField('industryConfirmed', true);
      
      // Отправляем аналитику
      this.trackEvent('industry_confirmed', {
        industry: detail.industry.key
      });
      
    } catch (error) {
      console.error('❌ Ошибка обработки подтверждения отрасли:', error);
    }
  }

  /**
   * Обработка выбора отрасли
   */
  handleIndustrySelected(detail) {
    try {
      console.log('🏭 Отрасль выбрана:', detail);
      
      // Обновляем состояние
      this.appState.updateField('industry', detail.industry);
      
      // Отправляем аналитику
      this.trackEvent('industry_selected', {
        industry: detail.industry.key
      });
      
    } catch (error) {
      console.error('❌ Ошибка обработки выбора отрасли:', error);
    }
  }

  /**
   * Обработка завершения расчета
   */
  handleCalculationComplete(results) {
    try {
      console.log('✅ Расчет завершен:', results);
      
      // Сохраняем результаты
      this.appState.updateField('calculationResults', results);
      
      // Переходим к результатам
      this.navigationManager.goToStep(6);
      
      // Отправляем аналитику
      this.trackEvent('calculation_completed', {
        savings: results.totalSavings,
        roi: results.roi,
        step: 5
      });
      
    } catch (error) {
      console.error('❌ Ошибка обработки завершения расчета:', error);
    }
  }

  /**
   * Обработка ошибки расчета
   */
  handleCalculationError(error) {
    try {
      console.error('❌ Ошибка расчета:', error);
      
      // Показываем ошибку пользователю
      this.showError('Произошла ошибка при расчете. Попробуйте еще раз.');
      
      // Отправляем аналитику
      this.trackEvent('calculation_error', {
        error: error.message,
        step: 5
      });
      
    } catch (err) {
      console.error('❌ Ошибка обработки ошибки расчета:', err);
    }
  }

  /**
   * Обработка навигации по шагам
   */
  handleStepNavigation(step) {
    try {
      console.log('🧭 Навигация к шагу:', step);
      
      // Обновляем текущий шаг
      this.navigationManager.goToStep(step);
      
      // Отправляем аналитику
      this.trackEvent('step_navigation', {
        step: step
      });
      
    } catch (error) {
      console.error('❌ Ошибка обработки навигации:', error);
    }
  }

  /**
   * Переход к следующему шагу
   */
  nextStep() {
    try {
      const currentStep = this.navigationManager.getCurrentStep();
      const nextStep = currentStep + 1;
      
      console.log(`➡️ Переход к шагу ${nextStep}`);
      
      // Проверяем валидность перехода
      if (this.navigationManager.canGoToStep(nextStep)) {
        this.navigationManager.nextStep();
        
        // Отправляем аналитику
        this.trackEvent('step_next', {
          fromStep: currentStep,
          toStep: nextStep
        });
      } else {
        console.warn('⚠️ Невозможно перейти к следующему шагу');
      }
      
    } catch (error) {
      console.error('❌ Ошибка перехода к следующему шагу:', error);
    }
  }

  /**
   * Переход к предыдущему шагу
   */
  previousStep() {
    try {
      const currentStep = this.navigationManager.getCurrentStep();
      const previousStep = currentStep - 1;
      
      console.log(`⬅️ Переход к шагу ${previousStep}`);
      
      // Проверяем валидность перехода
      if (this.navigationManager.canGoToStep(previousStep)) {
        this.navigationManager.previousStep();
        
        // Отправляем аналитику
        this.trackEvent('step_previous', {
          fromStep: currentStep,
          toStep: previousStep
        });
      } else {
        console.warn('⚠️ Невозможно перейти к предыдущему шагу');
      }
      
    } catch (error) {
      console.error('❌ Ошибка перехода к предыдущему шагу:', error);
    }
  }

  /**
   * Обновление шага
   */
  updateStep(step) {
    try {
      console.log(`🔄 Обновление шага ${step}`);
      
      // Обновляем шаг
      this.navigationManager.goToStep(step);
      
      // Отправляем аналитику
      this.trackEvent('step_updated', {
        step: step
      });
      
    } catch (error) {
      console.error('❌ Ошибка обновления шага:', error);
    }
  }

  /**
   * Показ содержимого шага
   */
  showStepContent(step) {
    try {
      console.log(`📋 Показ содержимого шага ${step}`);
      
      // Скрываем все шаги
      this.hideAllSteps();
      
      // Показываем нужный шаг
      const stepElement = document.getElementById(`step-${step}`);
      if (stepElement) {
        stepElement.style.display = 'block';
      }
      
      // Обновляем прогресс-бар
      this.updateProgressBar(step);
      
    } catch (error) {
      console.error('❌ Ошибка показа содержимого шага:', error);
    }
  }

  /**
   * Скрытие всех шагов
   */
  hideAllSteps() {
    try {
      const steps = document.querySelectorAll('[id^="step-"]');
      steps.forEach(step => {
        step.style.display = 'none';
      });
    } catch (error) {
      console.error('❌ Ошибка скрытия шагов:', error);
    }
  }

  /**
   * Обновление прогресс-бара
   */
  updateProgressBar(step) {
    try {
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
        const progress = (step / 6) * 100;
        progressBar.style.width = `${progress}%`;
      }
    } catch (error) {
      console.error('❌ Ошибка обновления прогресс-бара:', error);
    }
  }

  /**
   * Показ ошибки
   */
  showError(message) {
    try {
      const errorContainer = document.getElementById('error-container');
      if (errorContainer) {
        errorContainer.innerHTML = `
          <div class="error-message">
            <h3>Ошибка</h3>
            <p>${message}</p>
          </div>
        `;
        errorContainer.style.display = 'block';
        
        // Автоматически скрываем через 5 секунд
        setTimeout(() => {
          errorContainer.style.display = 'none';
        }, 5000);
      }
    } catch (error) {
      console.error('❌ Ошибка показа ошибки:', error);
    }
  }

  /**
   * Отправка события в аналитику
   */
  trackEvent(eventName, params = {}) {
    try {
      // Отправляем в глобальную аналитику если доступна
      if (window.gtag) {
        window.gtag('event', eventName, params);
      }
      
      // Отправляем в локальную аналитику если доступна
      if (window.app && window.app.analytics) {
        window.app.analytics.trackEvent(eventName, params);
      }
      
      console.log('📊 Событие отправлено:', eventName, params);
      
    } catch (error) {
      console.error('❌ Ошибка отправки события:', error);
    }
  }
}

export default EventHandler; 