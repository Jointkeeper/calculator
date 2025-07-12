/**
 * ComponentManager - Менеджер компонентов
 * Управляет жизненным циклом UI компонентов
 */

import { AppState } from '../../core/AppState.js?v=1.0.4';

class ComponentManager {
    constructor() {
        this.appState = AppState.getInstance();
        this.components = new Map();
        this.initialized = false;
    }

    /**
     * Инициализация менеджера компонентов
     */
    async initialize() {
        if (this.initialized) return;

        try {
            console.log('🔧 Инициализация ComponentManager...');
            
            // Инициализация базовых компонентов
            await this.initializeProgressBar();
            await this.initializeIndustrySelector();
            await this.initializeBusinessSizeStep();
            await this.initializeMarketingBudgetStep();
            await this.initializeMarketingTeamStep();
            await this.initializeMarketingToolsStep();
            await this.initializeContactFormStep();
            
            this.initialized = true;
            console.log('✅ ComponentManager инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации ComponentManager:', error);
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
                console.warn('⚠️ Контейнер #progress-container не найден, пропускаем инициализацию ProgressBar');
                return;
            }

            const progressBar = {
                update: (step) => {
                    const progressElement = progressContainer.querySelector('.progress-fill');
                    if (progressElement) {
                        const percentage = (step / 6) * 100;
                        progressElement.style.width = `${percentage}%`;
                    }
                },
                setStep: (step) => {
                    const stepText = progressContainer.querySelector('.progress-current');
                    if (stepText) {
                        stepText.textContent = `Шаг ${step} из 6`;
                    }
                    const percentText = progressContainer.querySelector('.progress-percentage');
                    if (percentText) {
                        percentText.textContent = `${Math.round((step / 6) * 100)}% завершено`;
                    }
                }
            };
            
            this.components.set('progressBar', progressBar);
            console.log('✅ ProgressBar инициализирован');
        } catch (error) {
            console.error('❌ Ошибка инициализации ProgressBar:', error);
        }
    }

    /**
     * Инициализация IndustrySelector
     */
    async initializeIndustrySelector() {
        try {
            const formContent = document.getElementById('form-content');
            
            if (!formContent) {
                console.warn('⚠️ Контейнер #form-content не найден, пропускаем инициализацию IndustrySelector');
                return;
            }
            
            const industrySelector = {
                render: () => {
                    formContent.innerHTML = `
                        <div class="calculator-step active">
                            <h3 class="step-title">Выберите вашу отрасль</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="restaurant">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">Рестораны и кафе</h4>
                                        <p class="text-sm text-gray-600 mt-1">Общественное питание</p>
                                    </div>
                                </button>
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="retail">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">Розничная торговля</h4>
                                        <p class="text-sm text-gray-600 mt-1">Магазины и торговля</p>
                                    </div>
                                </button>
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="services">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">Услуги</h4>
                                        <p class="text-sm text-gray-600 mt-1">Сфера услуг</p>
                                    </div>
                                </button>
                            </div>
                            <div class="mt-8 text-center">
                                <p class="text-sm text-gray-600">Выберите отрасль, которая наиболее точно описывает ваш бизнес</p>
                            </div>
                        </div>
                    `;
                    
                    this.setupIndustryEventHandlers();
                }
            };
            
            this.components.set('industrySelector', industrySelector);
            console.log('✅ IndustrySelector инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации IndustrySelector:', error);
        }
    }

    /**
     * Настройка обработчиков событий для IndustrySelector
     */
    setupIndustryEventHandlers() {
        const formContent = document.getElementById('form-content');
        const industryCards = formContent.querySelectorAll('.industry-card');
        industryCards.forEach(card => {
            card.addEventListener('click', () => {
                const industry = card.dataset.industry;
                // Убираем выделение со всех карточек
                industryCards.forEach(c => c.classList.remove('border-steamphony-blue', 'bg-blue-50'));
                // Добавляем выделение к выбранной карточке
                card.classList.add('border-steamphony-blue', 'bg-blue-50');
                // Сохраняем выбор в AppState
                if (window.app && window.app.componentManager) {
                    const title = card.querySelector('h4')?.textContent || industry;
                    window.app.componentManager.appState.updateField('industry', { key: industry, title });
                }
                // Переход к следующему шагу через StepManager
                if (window.app && window.app.stepManager) {
                    window.app.stepManager.nextStep();
                }
            });
        });
    }

    /**
     * Инициализация BusinessSizeStep
     */
    async initializeBusinessSizeStep() {
        try {
            const businessSizeStep = {
                render: () => {
                    const formContent = document.getElementById('form-content');
                    if (!formContent) return;

                    formContent.innerHTML = `
                        <div class="calculator-step active">
                            <h3 class="step-title">Размер вашего бизнеса</h3>
                            <p class="step-description">Выберите количество сотрудников в вашей компании</p>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button class="size-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-size="small">
                                    <div class="text-center">
                                        <h4 class="font-semibold text-gray-900 mb-2">Малый бизнес</h4>
                                        <p class="text-sm text-gray-600">1-10 сотрудников</p>
                                    </div>
                                </button>
                                <button class="size-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-size="medium">
                                    <div class="text-center">
                                        <h4 class="font-semibold text-gray-900 mb-2">Средний бизнес</h4>
                                        <p class="text-sm text-gray-600">11-50 сотрудников</p>
                                    </div>
                                </button>
                                <button class="size-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-size="large">
                                    <div class="text-center">
                                        <h4 class="font-semibold text-gray-900 mb-2">Крупный бизнес</h4>
                                        <p class="text-sm text-gray-600">50+ сотрудников</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    `;
                    
                    this.setupBusinessSizeEventHandlers();
                }
            };
            
            this.components.set('businessSizeStep', businessSizeStep);
            console.log('✅ BusinessSizeStep инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации BusinessSizeStep:', error);
        }
    }

    /**
     * Настройка обработчиков событий для BusinessSizeStep
     */
    setupBusinessSizeEventHandlers() {
        const formContent = document.getElementById('form-content');
        const sizeCards = formContent.querySelectorAll('.size-card');
        
        sizeCards.forEach(card => {
            card.addEventListener('click', () => {
                const size = card.dataset.size;
                // Убираем выделение со всех карточек
                sizeCards.forEach(c => c.classList.remove('border-steamphony-blue', 'bg-blue-50'));
                // Добавляем выделение к выбранной карточке
                card.classList.add('border-steamphony-blue', 'bg-blue-50');
                
                if (window.app && window.app.eventHandler) {
                    window.app.eventHandler.handleBusinessSizeSelect(size);
                    window.app.eventHandler.handleBusinessSizeNext({ size });
                }
            });
        });
    }

    /**
     * Инициализация остальных компонентов (упрощенные версии)
     */
    async initializeMarketingBudgetStep() {
        const marketingBudgetStep = {
            render: () => {
                const formContent = document.getElementById('form-content');
                if (!formContent) return;

                formContent.innerHTML = `
                    <div class="calculator-step active">
                        <h3 class="step-title">Маркетинговый бюджет</h3>
                        <p class="step-description">Укажите ваш текущий месячный бюджет на маркетинг</p>
                        <div class="space-y-4">
                            <input type="range" id="budget-slider" min="50000" max="1000000" step="50000" value="200000" class="w-full">
                            <div class="text-center">
                                <span id="budget-value" class="text-2xl font-bold text-steamphony-primary">200,000 ₽</span>
                                <p class="text-sm text-gray-600">в месяц</p>
                            </div>
                        </div>
                    </div>
                `;
                
                this.setupBudgetEventHandlers();
            }
        };
        
        this.components.set('marketingBudgetStep', marketingBudgetStep);
        console.log('✅ MarketingBudgetStep инициализирован');
    }

    setupBudgetEventHandlers() {
        const slider = document.getElementById('budget-slider');
        const valueDisplay = document.getElementById('budget-value');
        
        if (slider && valueDisplay) {
            slider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                valueDisplay.textContent = `${value.toLocaleString()} ₽`;
            });
            
            // Добавляем кнопки навигации
            const formContent = document.getElementById('form-content');
            const navButtons = document.createElement('div');
            navButtons.className = 'nav-buttons';
            navButtons.innerHTML = `
                <button class="nav-button secondary" onclick="window.app.eventHandler.handleMarketingBudgetBack()">Назад</button>
                <button class="nav-button primary" onclick="window.app.eventHandler.handleMarketingBudgetNext({ budget: ${slider.value} })">Далее</button>
            `;
            formContent.appendChild(navButtons);
        }
    }

    async initializeMarketingTeamStep() {
        const marketingTeamStep = {
            render: () => {
                const formContent = document.getElementById('form-content');
                if (!formContent) return;

                formContent.innerHTML = `
                    <div class="calculator-step active">
                        <h3 class="step-title">Маркетинговая команда</h3>
                        <p class="step-description">Сколько человек работает в вашей маркетинговой команде?</p>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button class="team-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-team="1">
                                <div class="text-center">
                                    <h4 class="font-semibold text-gray-900">1 человек</h4>
                                    <p class="text-sm text-gray-600">Самозанятый</p>
                                </div>
                            </button>
                            <button class="team-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-team="2-5">
                                <div class="text-center">
                                    <h4 class="font-semibold text-gray-900">2-5 человек</h4>
                                    <p class="text-sm text-gray-600">Небольшая команда</p>
                                </div>
                            </button>
                            <button class="team-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-team="5+">
                                <div class="text-center">
                                    <h4 class="font-semibold text-gray-900">5+ человек</h4>
                                    <p class="text-sm text-gray-600">Большая команда</p>
                                </div>
                            </button>
                        </div>
                    </div>
                `;
                
                this.setupTeamEventHandlers();
            }
        };
        
        this.components.set('marketingTeamStep', marketingTeamStep);
        console.log('✅ MarketingTeamStep инициализирован');
    }

    setupTeamEventHandlers() {
        const formContent = document.getElementById('form-content');
        const teamCards = formContent.querySelectorAll('.team-card');
        
        teamCards.forEach(card => {
            card.addEventListener('click', () => {
                const team = card.dataset.team;
                teamCards.forEach(c => c.classList.remove('border-steamphony-blue', 'bg-blue-50'));
                card.classList.add('border-steamphony-blue', 'bg-blue-50');
                
                if (window.app && window.app.eventHandler) {
                    window.app.eventHandler.handleMarketingTeamSelect({ team });
                    window.app.eventHandler.handleMarketingTeamNext({ team });
                }
            });
        });
    }

    async initializeMarketingToolsStep() {
        const marketingToolsStep = {
            render: () => {
                const formContent = document.getElementById('form-content');
                if (!formContent) return;

                formContent.innerHTML = `
                    <div class="calculator-step active">
                        <h3 class="step-title">Маркетинговые инструменты</h3>
                        <p class="step-description">Какие инструменты вы используете для маркетинга?</p>
                        <div class="space-y-3">
                            <label class="flex items-center space-x-3">
                                <input type="checkbox" value="social" class="rounded">
                                <span>Социальные сети</span>
                            </label>
                            <label class="flex items-center space-x-3">
                                <input type="checkbox" value="ads" class="rounded">
                                <span>Контекстная реклама</span>
                            </label>
                            <label class="flex items-center space-x-3">
                                <input type="checkbox" value="seo" class="rounded">
                                <span>SEO</span>
                            </label>
                            <label class="flex items-center space-x-3">
                                <input type="checkbox" value="email" class="rounded">
                                <span>Email-маркетинг</span>
                            </label>
                        </div>
                    </div>
                `;
                
                this.setupToolsEventHandlers();
            }
        };
        
        this.components.set('marketingToolsStep', marketingToolsStep);
        console.log('✅ MarketingToolsStep инициализирован');
    }

    setupToolsEventHandlers() {
        const formContent = document.getElementById('form-content');
        const navButtons = document.createElement('div');
        navButtons.className = 'nav-buttons';
        navButtons.innerHTML = `
            <button class="nav-button secondary" onclick="window.app.eventHandler.handleMarketingToolsBack()">Назад</button>
            <button class="nav-button primary" onclick="window.app.eventHandler.handleMarketingToolsNext({ tools: this.getSelectedTools() })">Далее</button>
        `;
        formContent.appendChild(navButtons);
    }

    async initializeContactFormStep() {
        const contactFormStep = {
            render: () => {
                const formContent = document.getElementById('form-content');
                if (!formContent) return;

                formContent.innerHTML = `
                    <div class="calculator-step active">
                        <h3 class="step-title">Контактная информация</h3>
                        <p class="step-description">Оставьте свои данные для получения результатов</p>
                        <div class="space-y-4">
                            <input type="text" placeholder="Ваше имя" class="w-full p-3 border border-gray-300 rounded-lg">
                            <input type="email" placeholder="Email" class="w-full p-3 border border-gray-300 rounded-lg">
                            <input type="tel" placeholder="Телефон" class="w-full p-3 border border-gray-300 rounded-lg">
                        </div>
                    </div>
                `;
                
                this.setupContactEventHandlers();
            }
        };
        
        this.components.set('contactFormStep', contactFormStep);
        console.log('✅ ContactFormStep инициализирован');
    }

    setupContactEventHandlers() {
        const formContent = document.getElementById('form-content');
        const navButtons = document.createElement('div');
        navButtons.className = 'nav-buttons';
        navButtons.innerHTML = `
            <button class="nav-button secondary" onclick="window.app.eventHandler.handleContactFormBack()">Назад</button>
            <button class="nav-button primary" onclick="window.app.eventHandler.handleContactFormSubmit(this.getContactData())">Получить результаты</button>
        `;
        formContent.appendChild(navButtons);
    }

    /**
     * Получение компонента по имени
     */
    getComponent(name) {
        return this.components.get(name);
    }

    /**
     * Показать компонент
     */
    showComponent(name) {
        const component = this.components.get(name);
        if (component && component.render) {
            component.render();
        }
    }

    /**
     * Сброс всех компонентов
     */
    reset() {
        this.components.clear();
        this.initialized = false;
    }

    /**
     * Уничтожение менеджера
     */
    destroy() {
        this.reset();
    }
}

// Экспорт синглтона
export const componentManager = new ComponentManager();