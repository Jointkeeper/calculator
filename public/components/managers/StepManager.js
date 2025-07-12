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
        this.appState.subscribe((event) => {
            if (event.detail.type === 'currentStep') {
                let step = event.detail.data;
                if (typeof step === 'object' && step !== null && 'step' in step) {
                    step = step.step;
                }
                this.updateStepDisplay(Number(step));
            }
        });
    }

    /**
     * Обновление отображения шага
     */
    updateStepDisplay(step) {
        if (typeof step === 'object' && step !== null && 'step' in step) {
            step = step.step;
        }
        step = Number(step);
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
                console.log('🔍 StepManager: window.app.componentManager =', componentManager);
                console.log('🔍 StepManager: window.app =', window.app);
                
                if (componentManager && typeof componentManager.showComponent === 'function') {
                    componentManager.showComponent(componentName);
                    console.log(`✅ Показан компонент: ${componentName} для шага ${step}`);
                } else {
                    console.warn('❌ ComponentManager не найден или showComponent не функция - используем fallback');
                    // Fallback: прямая инициализация компонента
                    this.initializeComponentFallback(componentName, step);
                }
            } else {
                console.warn(`❌ Компонент для шага ${step} не найден`);
            }
            
            this.currentStep = step;
            
        } catch (error) {
            console.error('❌ Ошибка показа компонента шага:', error);
        }
    }

    /**
     * Fallback инициализация компонента
     */
    initializeComponentFallback(componentName, step) {
        try {
            console.log(`🔄 Fallback инициализация компонента: ${componentName}`);
            const formContent = document.getElementById('form-content');
            if (!formContent) {
                console.error('❌ #form-content не найден для fallback');
                return;
            }
            
            // Простая fallback логика для каждого компонента
            switch (componentName) {
                case 'industrySelector':
                    this.renderIndustrySelectorFallback(formContent);
                    break;
                case 'businessSizeStep':
                    this.renderBusinessSizeFallback(formContent);
                    break;
                case 'marketingBudgetStep':
                    this.renderBudgetFallback(formContent);
                    break;
                case 'marketingTeamStep':
                    this.renderTeamFallback(formContent);
                    break;
                case 'marketingToolsStep':
                    this.renderToolsFallback(formContent);
                    break;
                case 'contactFormStep':
                    this.renderContactFallback(formContent);
                    break;
                default:
                    console.warn(`❌ Неизвестный компонент для fallback: ${componentName}`);
            }
        } catch (error) {
            console.error('❌ Ошибка fallback инициализации:', error);
        }
    }

    /**
     * Fallback рендер IndustrySelector
     */
    renderIndustrySelectorFallback(formContent) {
        formContent.innerHTML = `
            <div class="calculator-step active">
                <h3 class="step-title">Выберите вашу отрасль</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="restaurant">
                        <div class="text-center">
                            <h4 class="font-medium text-gray-900">Рестораны и кафе</h4>
                            <p class="text-sm text-gray-600 mt-1">Общественное питание</p>
                        </div>
                    </button>
                    <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="retail">
                        <div class="text-center">
                            <h4 class="font-medium text-gray-900">Розничная торговля</h4>
                            <p class="text-sm text-gray-600 mt-1">Магазины и торговля</p>
                        </div>
                    </button>
                    <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="services">
                        <div class="text-center">
                            <h4 class="font-medium text-gray-900">Услуги</h4>
                            <p class="text-sm text-gray-600 mt-1">Сфера услуг</p>
                        </div>
                    </button>
                </div>
                <div class="mt-8 text-center">
                    <button class="nav-button primary" onclick="window.app.stepManager.nextStep()">Далее</button>
                </div>
            </div>
        `;
        
        // Простые обработчики событий
        const industryCards = formContent.querySelectorAll('.industry-card');
        industryCards.forEach(card => {
            card.addEventListener('click', () => {
                industryCards.forEach(c => c.classList.remove('border-steamphony-blue', 'bg-blue-50'));
                card.classList.add('border-steamphony-blue', 'bg-blue-50');
                setTimeout(() => {
                    if (window.app?.stepManager) {
                        window.app.stepManager.nextStep();
                    }
                }, 300);
            });
        });
    }

    /**
     * Fallback рендер BusinessSize
     */
    renderBusinessSizeFallback(formContent) {
        formContent.innerHTML = `
            <div class="calculator-step active">
                <h3 class="step-title">Размер вашего бизнеса</h3>
                <p class="step-description">Выберите количество сотрудников в вашей компании</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button class="size-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-size="small">
                        <h4 class="font-medium text-gray-900">1-10 сотрудников</h4>
                        <p class="text-sm text-gray-600">Малый бизнес</p>
                    </button>
                    <button class="size-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-size="medium">
                        <h4 class="font-medium text-gray-900">11-50 сотрудников</h4>
                        <p class="text-sm text-gray-600">Средний бизнес</p>
                    </button>
                    <button class="size-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-size="large">
                        <h4 class="font-medium text-gray-900">50+ сотрудников</h4>
                        <p class="text-sm text-gray-600">Крупный бизнес</p>
                    </button>
                </div>
                <div class="mt-8 flex justify-between">
                    <button class="nav-button secondary" onclick="window.app.stepManager.previousStep()">Назад</button>
                    <button class="nav-button primary" onclick="window.app.stepManager.nextStep()">Далее</button>
                </div>
            </div>
        `;
        
        const sizeCards = formContent.querySelectorAll('.size-card');
        sizeCards.forEach(card => {
            card.addEventListener('click', () => {
                sizeCards.forEach(c => c.classList.remove('border-steamphony-blue', 'bg-blue-50'));
                card.classList.add('border-steamphony-blue', 'bg-blue-50');
            });
        });
    }

    /**
     * Fallback рендер Budget
     */
    renderBudgetFallback(formContent) {
        formContent.innerHTML = `
            <div class="calculator-step active">
                <h3 class="step-title">Маркетинговый бюджет</h3>
                <p class="step-description">Укажите ваш ежемесячный бюджет на маркетинг</p>
                <div class="space-y-4">
                    <input type="range" min="50000" max="1000000" step="50000" value="200000" class="w-full" id="budget-slider">
                    <div class="text-center">
                        <span class="text-2xl font-bold text-steamphony-blue" id="budget-display">200 000 ₽</span>
                        <p class="text-sm text-gray-600">в месяц</p>
                    </div>
                </div>
                <div class="mt-8 flex justify-between">
                    <button class="nav-button secondary" onclick="window.app.stepManager.previousStep()">Назад</button>
                    <button class="nav-button primary" onclick="window.app.stepManager.nextStep()">Далее</button>
                </div>
            </div>
        `;
        
        const slider = formContent.querySelector('#budget-slider');
        const display = formContent.querySelector('#budget-display');
        if (slider && display) {
            slider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                display.textContent = new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                    minimumFractionDigits: 0
                }).format(value);
            });
        }
    }

    /**
     * Fallback рендер Team
     */
    renderTeamFallback(formContent) {
        formContent.innerHTML = `
            <div class="calculator-step active">
                <h3 class="step-title">Маркетинговая команда</h3>
                <p class="step-description">Есть ли у вас маркетолог в штате?</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button class="team-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-team="yes">
                        <h4 class="font-medium text-gray-900">Да, есть маркетолог</h4>
                        <p class="text-sm text-gray-600">В штате или на аутсорсе</p>
                    </button>
                    <button class="team-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-team="no">
                        <h4 class="font-medium text-gray-900">Нет, маркетолога нет</h4>
                        <p class="text-sm text-gray-600">Делаем маркетинг сами</p>
                    </button>
                </div>
                <div class="mt-8 flex justify-between">
                    <button class="nav-button secondary" onclick="window.app.stepManager.previousStep()">Назад</button>
                    <button class="nav-button primary" onclick="window.app.stepManager.nextStep()">Далее</button>
                </div>
            </div>
        `;
        
        const teamCards = formContent.querySelectorAll('.team-card');
        teamCards.forEach(card => {
            card.addEventListener('click', () => {
                teamCards.forEach(c => c.classList.remove('border-steamphony-blue', 'bg-blue-50'));
                card.classList.add('border-steamphony-blue', 'bg-blue-50');
            });
        });
    }

    /**
     * Fallback рендер Tools
     */
    renderToolsFallback(formContent) {
        formContent.innerHTML = `
            <div class="calculator-step active">
                <h3 class="step-title">Маркетинговые инструменты</h3>
                <p class="step-description">Какие инструменты вы используете?</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="tool-card p-4 border border-gray-200 rounded-lg">
                        <input type="checkbox" id="social" value="social">
                        <label for="social">
                            <h4>Социальные сети</h4>
                            <p>Instagram, VK, Telegram</p>
                        </label>
                    </div>
                    <div class="tool-card p-4 border border-gray-200 rounded-lg">
                        <input type="checkbox" id="ads" value="ads">
                        <label for="ads">
                            <h4>Контекстная реклама</h4>
                            <p>Яндекс.Директ, Google Ads</p>
                        </label>
                    </div>
                    <div class="tool-card p-4 border border-gray-200 rounded-lg">
                        <input type="checkbox" id="seo" value="seo">
                        <label for="seo">
                            <h4>SEO</h4>
                            <p>Поисковая оптимизация</p>
                        </label>
                    </div>
                    <div class="tool-card p-4 border border-gray-200 rounded-lg">
                        <input type="checkbox" id="email" value="email">
                        <label for="email">
                            <h4>Email-маркетинг</h4>
                            <p>Рассылки по email</p>
                        </label>
                    </div>
                </div>
                <div class="mt-8 flex justify-between">
                    <button class="nav-button secondary" onclick="window.app.stepManager.previousStep()">Назад</button>
                    <button class="nav-button primary" onclick="window.app.stepManager.nextStep()">Далее</button>
                </div>
            </div>
        `;
        
        const toolCards = formContent.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.type === 'checkbox') return;
                const checkbox = card.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                if (checkbox.checked) {
                    card.style.borderColor = '#8B4513';
                    card.style.background = '#f0f0f0';
                } else {
                    card.style.borderColor = '#ddd';
                    card.style.background = 'white';
                }
            });
        });
    }

    /**
     * Fallback рендер Contact
     */
    renderContactFallback(formContent) {
        formContent.innerHTML = `
            <div class="calculator-step active">
                <h3 class="step-title">Контактная информация</h3>
                <p class="step-description">Оставьте свои данные для получения результатов</p>
                <div class="space-y-4">
                    <input type="text" placeholder="Ваше имя" class="w-full p-3 border border-gray-300 rounded-lg">
                    <input type="email" placeholder="Email" class="w-full p-3 border border-gray-300 rounded-lg">
                    <input type="tel" placeholder="Телефон" class="w-full p-3 border border-gray-300 rounded-lg">
                </div>
                <div class="mt-8 flex justify-between">
                    <button class="nav-button secondary" onclick="window.app.stepManager.previousStep()">Назад</button>
                    <button class="nav-button primary" onclick="window.app.stepManager.onCalculatorComplete()">Получить результаты</button>
                </div>
            </div>
        `;
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
        console.log('[StepManager] showResults вызван');
        // Получаем контейнер и экземпляр ContactFormStep
        const formContent = document.getElementById('form-content');
        if (!formContent) return;

        // Получаем/создаём экземпляр ContactFormStep
        let contactFormStep = window.app?.componentManager?.getComponent('contactFormStep');
        console.log('[StepManager] contactFormStep из componentManager:', contactFormStep);
        if (!contactFormStep) {
            // Если не найден, создаём вручную (fallback)
            const ContactFormStep = window.ContactFormStep || (window.app?.componentManager?.ContactFormStep);
            console.log('[StepManager] ContactFormStep класс:', ContactFormStep);
            if (ContactFormStep) {
                contactFormStep = new ContactFormStep(formContent);
                window.app.componentManager.setComponent('contactFormStep', contactFormStep);
                console.log('[StepManager] ContactFormStep создан вручную:', contactFormStep);
            } else {
                // Fallback: просто показываем старый результат
                console.log('[StepManager] Fallback: ContactFormStep не найден, рендерим простую форму');
                formContent.innerHTML = '<div class="calculator-step active"><h3>Результаты не удалось отобразить</h3></div>';
                return;
            }
        }

        // Получаем данные формы и рассчитываем результаты
        const formData = this.appState.getFormData();
        console.log('[StepManager] formData из AppState:', formData);
        
        // Явно вызываем updateWithFormData для обновления данных и расчета
        if (typeof contactFormStep.updateWithFormData === 'function') {
            console.log('[StepManager] Вызываю updateWithFormData с данными:', formData);
            contactFormStep.updateWithFormData(formData);
        } else {
            console.log('[StepManager] updateWithFormData не найден, устанавливаю данные вручную:', formData);
            contactFormStep.formData = formData;
            contactFormStep.calculationResults = contactFormStep.calculateResults();
            if (typeof contactFormStep.updateResultsUI === 'function') {
                contactFormStep.updateResultsUI();
            }
        }
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