/**
 * UIManager - Модуль управления UI компонентами
 * Централизованное управление интерфейсом приложения
 */

import { AppState } from '../core/AppState.js?v=1.0.3';
import { NavigationManager } from '../managers/NavigationManager.js?v=1.0.3';

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
            
            // Показываем первый шаг
            console.log('🎯 Показываем первый шаг...');
            this.showStepComponent(1);
            console.log('✅ Первый шаг показан');
            
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
                console.warn('⚠️ Контейнер #progress-container не найден, пропускаем инициализацию ProgressBar');
                return;
            }
            // Обновлённая логика для нового дизайна
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
            // Не прерываем инициализацию из-за ошибки ProgressBar
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
            
            // Создаем простой селектор отраслей
            const industrySelector = {
                render: () => {
                    formContent.innerHTML = `
                        <div class="calculator-step active">
                            <h3 class="text-xl font-semibold text-gray-900 mb-6">Выберите вашу отрасль</h3>
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
                    
                    // Добавляем обработчики событий
                    const industryCards = formContent.querySelectorAll('.industry-card');
                    industryCards.forEach(card => {
                        card.addEventListener('click', () => {
                            const industry = card.dataset.industry;
                            
                            // Убираем выделение со всех карточек
                            industryCards.forEach(c => c.classList.remove('border-steamphony-blue', 'bg-blue-50'));
                            
                            // Добавляем выделение к выбранной карточке
                            card.classList.add('border-steamphony-blue', 'bg-blue-50');
                            
                            // Вызываем обработчик
                            this.handleIndustrySelect(industry);
                        });
                    });
                }
            };
            
            this.components.set('industrySelector', industrySelector);
            console.log('✅ IndustrySelector инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации IndustrySelector:', error);
            // Не прерываем инициализацию из-за ошибки IndustrySelector
        }
    }

    /**
     * Инициализация BusinessSizeStep
     */
    async initializeBusinessSizeStep() {
        try {
            const formContent = document.getElementById('form-content');
            
            if (!formContent) {
                console.warn('⚠️ Контейнер #form-content не найден, пропускаем инициализацию BusinessSizeStep');
                return;
            }
            
            // Создаем простой компонент выбора размера бизнеса
            const businessSizeStep = {
                render: () => {
                    formContent.innerHTML = `
                        <div class="calculator-step">
                            <h3 class="text-xl font-semibold text-gray-900 mb-6">Какой у вас размер бизнеса?</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button class="size-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-size="small">
                                    <div class="text-center">
                                        <h4 class="font-medium text-gray-900 mb-2">Малый бизнес</h4>
                                        <p class="text-sm text-gray-600">1-10 сотрудников</p>
                                    </div>
                                </button>
                                <button class="size-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-size="medium">
                                    <div class="text-center">
                                        <h4 class="font-medium text-gray-900 mb-2">Средний бизнес</h4>
                                        <p class="text-sm text-gray-600">11-50 сотрудников</p>
                                    </div>
                                </button>
                                <button class="size-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-size="large">
                                    <div class="text-center">
                                        <h4 class="font-medium text-gray-900 mb-2">Крупный бизнес</h4>
                                        <p class="text-sm text-gray-600">50+ сотрудников</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    `;
                    
                    // Добавляем обработчики событий
                    const sizeCards = formContent.querySelectorAll('.size-card');
                    sizeCards.forEach(card => {
                        card.addEventListener('click', () => {
                            const size = card.dataset.size;
                            
                            // Убираем выделение со всех карточек
                            sizeCards.forEach(c => c.classList.remove('border-steamphony-blue', 'bg-blue-50'));
                            
                            // Добавляем выделение к выбранной карточке
                            card.classList.add('border-steamphony-blue', 'bg-blue-50');
                            
                            // Вызываем обработчик
                            this.handleBusinessSizeSelect(size);
                        });
                    });
                }
            };
            
            this.components.set('businessSizeStep', businessSizeStep);
            console.log('✅ BusinessSizeStep инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации BusinessSizeStep:', error);
            // Не прерываем инициализацию из-за ошибки BusinessSizeStep
        }
    }

    /**
     * Инициализация MarketingBudgetStep
     */
    async initializeMarketingBudgetStep() {
        try {
            const formContent = document.getElementById('form-content');
            
            if (!formContent) {
                console.warn('⚠️ Контейнер #form-content не найден, пропускаем инициализацию MarketingBudgetStep');
                return;
            }
            
            // Создаем простой компонент выбора бюджета
            const marketingBudgetStep = {
                render: () => {
                    formContent.innerHTML = `
                        <div class="calculator-step">
                            <h3 class="text-xl font-semibold text-gray-900 mb-6">Какой у вас месячный бюджет на маркетинг?</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button class="budget-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-budget="50000">
                                    <div class="text-center">
                                        <h4 class="font-medium text-gray-900 mb-2">До 50 000 ₽</h4>
                                        <p class="text-sm text-gray-600">Небольшой бюджет</p>
                                    </div>
                                </button>
                                <button class="budget-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-budget="150000">
                                    <div class="text-center">
                                        <h4 class="font-medium text-gray-900 mb-2">50 000 - 150 000 ₽</h4>
                                        <p class="text-sm text-gray-600">Средний бюджет</p>
                                    </div>
                                </button>
                                <button class="budget-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-budget="300000">
                                    <div class="text-center">
                                        <h4 class="font-medium text-gray-900 mb-2">150 000 - 300 000 ₽</h4>
                                        <p class="text-sm text-gray-600">Большой бюджет</p>
                                    </div>
                                </button>
                                <button class="budget-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-budget="500000">
                                    <div class="text-center">
                                        <h4 class="font-medium text-gray-900 mb-2">Более 300 000 ₽</h4>
                                        <p class="text-sm text-gray-600">Крупный бюджет</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    `;
                    
                    // Добавляем обработчики событий
                    const budgetCards = formContent.querySelectorAll('.budget-card');
                    budgetCards.forEach(card => {
                        card.addEventListener('click', () => {
                            const budget = card.dataset.budget;
                            
                            // Убираем выделение со всех карточек
                            budgetCards.forEach(c => c.classList.remove('border-steamphony-blue', 'bg-blue-50'));
                            
                            // Добавляем выделение к выбранной карточке
                            card.classList.add('border-steamphony-blue', 'bg-blue-50');
                            
                            // Вызываем обработчик
                            this.handleMarketingBudgetSelect(budget);
                        });
                    });
                }
            };
            
            this.components.set('marketingBudgetStep', marketingBudgetStep);
            console.log('✅ MarketingBudgetStep инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации MarketingBudgetStep:', error);
            // Не прерываем инициализацию из-за ошибки MarketingBudgetStep
        }
    }

    /**
     * Инициализация MarketingTeamStep
     */
    async initializeMarketingTeamStep() {
        try {
            const formContent = document.getElementById('form-content');
            
            if (!formContent) {
                console.warn('⚠️ Контейнер #form-content не найден, пропускаем инициализацию MarketingTeamStep');
                return;
            }
            
            // Создаем простой компонент выбора команды
            const marketingTeamStep = {
                render: () => {
                    formContent.innerHTML = `
                        <div class="calculator-step">
                            <h3 class="text-xl font-semibold text-gray-900 mb-6">Сколько человек в вашей маркетинговой команде?</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button class="team-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-team="1">
                                    <div class="text-center">
                                        <h4 class="font-medium text-gray-900 mb-2">1 человек</h4>
                                        <p class="text-sm text-gray-600">Маркетолог-одиночка</p>
                                    </div>
                                </button>
                                <button class="team-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-team="2">
                                    <div class="text-center">
                                        <h4 class="font-medium text-gray-900 mb-2">2-3 человека</h4>
                                        <p class="text-sm text-gray-600">Небольшая команда</p>
                                    </div>
                                </button>
                                <button class="team-card p-6 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-team="4">
                                    <div class="text-center">
                                        <h4 class="font-medium text-gray-900 mb-2">4+ человека</h4>
                                        <p class="text-sm text-gray-600">Большая команда</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    `;
                    
                    // Добавляем обработчики событий
                    const teamCards = formContent.querySelectorAll('.team-card');
                    teamCards.forEach(card => {
                        card.addEventListener('click', () => {
                            const team = card.dataset.team;
                            
                            // Убираем выделение со всех карточек
                            teamCards.forEach(c => c.classList.remove('border-steamphony-blue', 'bg-blue-50'));
                            
                            // Добавляем выделение к выбранной карточке
                            card.classList.add('border-steamphony-blue', 'bg-blue-50');
                            
                            // Вызываем обработчик
                            this.handleMarketingTeamSelect({ teamSize: parseInt(team) });
                        });
                    });
                }
            };
            
            this.components.set('marketingTeamStep', marketingTeamStep);
            console.log('✅ MarketingTeamStep инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации MarketingTeamStep:', error);
            // Не прерываем инициализацию из-за ошибки MarketingTeamStep
        }
    }

    /**
     * Инициализация MarketingToolsStep
     */
    async initializeMarketingToolsStep() {
        try {
            const formContent = document.getElementById('form-content');
            
            if (!formContent) {
                console.warn('⚠️ Контейнер #form-content не найден, пропускаем инициализацию MarketingToolsStep');
                return;
            }
            
            // Создаем простой компонент выбора инструментов
            const marketingToolsStep = {
                render: () => {
                    formContent.innerHTML = `
                        <div class="calculator-step">
                            <h3 class="text-xl font-semibold text-gray-900 mb-6">Какие маркетинговые инструменты вы используете?</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label class="tool-checkbox p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors cursor-pointer">
                                    <input type="checkbox" class="mr-3" data-tool="analytics">
                                    <span class="font-medium text-gray-900">Аналитика (Google Analytics)</span>
                                </label>
                                <label class="tool-checkbox p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors cursor-pointer">
                                    <input type="checkbox" class="mr-3" data-tool="automation">
                                    <span class="font-medium text-gray-900">Автоматизация</span>
                                </label>
                                <label class="tool-checkbox p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors cursor-pointer">
                                    <input type="checkbox" class="mr-3" data-tool="crm">
                                    <span class="font-medium text-gray-900">CRM система</span>
                                </label>
                                <label class="tool-checkbox p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors cursor-pointer">
                                    <input type="checkbox" class="mr-3" data-tool="social">
                                    <span class="font-medium text-gray-900">Социальные сети</span>
                                </label>
                            </div>
                        </div>
                    `;
                    
                    // Добавляем обработчики событий
                    const toolCheckboxes = formContent.querySelectorAll('.tool-checkbox input');
                    toolCheckboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', () => {
                            const selectedTools = Array.from(toolCheckboxes)
                                .filter(cb => cb.checked)
                                .map(cb => cb.dataset.tool);
                            
                            // Вызываем обработчик
                            this.handleMarketingToolsSelect({ tools: selectedTools });
                        });
                    });
                }
            };
            
            this.components.set('marketingToolsStep', marketingToolsStep);
            console.log('✅ MarketingToolsStep инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации MarketingToolsStep:', error);
            // Не прерываем инициализацию из-за ошибки MarketingToolsStep
        }
    }

    /**
     * Инициализация ContactFormStep
     */
    async initializeContactFormStep() {
        try {
            const formContent = document.getElementById('form-content');
            
            if (!formContent) {
                console.warn('⚠️ Контейнер #form-content не найден, пропускаем инициализацию ContactFormStep');
                return;
            }
            
            // Создаем простой компонент контактной формы
            const contactFormStep = {
                render: () => {
                    formContent.innerHTML = `
                        <div class="calculator-step">
                            <h3 class="text-xl font-semibold text-gray-900 mb-6">Оставьте контакты для получения результатов</h3>
                            <form class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                                    <input type="text" name="name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-steamphony-blue">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" name="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-steamphony-blue">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                                    <input type="tel" name="phone" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-steamphony-blue">
                                </div>
                                <button type="submit" class="nav-button primary w-full">
                                    Получить результаты
                                </button>
                            </form>
                        </div>
                    `;
                    
                    // Добавляем обработчик отправки формы
                    const form = formContent.querySelector('form');
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const formData = new FormData(form);
                        const contactData = {
                            name: formData.get('name'),
                            email: formData.get('email'),
                            phone: formData.get('phone')
                        };
                        
                        // Вызываем обработчик
                        this.handleContactFormSubmit(contactData);
                    });
                }
            };
            
            this.components.set('contactFormStep', contactFormStep);
            console.log('✅ ContactFormStep инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации ContactFormStep:', error);
            // Не прерываем инициализацию из-за ошибки ContactFormStep
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
        this.appState.subscribe((event) => {
            const { type, data } = event.detail;
            if (type === 'currentStep' || type === 'stepChanged') {
                this.updateStepDisplay(this.appState.getCurrentStep());
            } else if (type === 'formData' || type === 'formDataChanged') {
                this.updateFormDataDisplay(this.appState.getFormData());
            } else if (type === 'results' || type === 'resultsChanged') {
                this.updateResultsDisplay(data);
            }
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
                progressBar.update(step);
                progressBar.setStep(step); // Обновляем текст шага
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
            console.log(`🎯 Показываем шаг ${step}...`);
            
            // Скрыть все компоненты
            this.hideAllComponents();
            
            // Показать нужный компонент
            switch (step) {
                case 1:
                    console.log('🎯 Показываем industrySelector...');
                    this.showComponent('industrySelector');
                    break;
                case 2:
                    console.log('🎯 Показываем businessSizeStep...');
                    this.showComponent('businessSizeStep');
                    break;
                case 3:
                    console.log('🎯 Показываем marketingBudgetStep...');
                    this.showComponent('marketingBudgetStep');
                    break;
                case 4:
                    console.log('🎯 Показываем marketingToolsStep...');
                    this.showComponent('marketingToolsStep');
                    break;
                case 5:
                    console.log('🎯 Показываем marketingTeamStep...');
                    this.showComponent('marketingTeamStep');
                    break;
                case 6:
                    console.log('🎯 Показываем contactFormStep...');
                    this.showComponent('contactFormStep');
                    break;
                default:
                    console.warn(`⚠️ Неизвестный шаг: ${step}`);
            }
            
            console.log(`✅ Шаг ${step} показан`);
            
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
        console.log(`🎯 Показываем компонент: ${componentName}`);
        const component = this.components.get(componentName);
        console.log(`🎯 Компонент найден:`, component);
        
        if (component) {
            if (typeof component.show === 'function') {
                console.log(`🎯 Вызываем component.show()`);
                component.show();
            } else if (component.container) {
                console.log(`🎯 Показываем container`);
                component.container.style.display = 'block';
            } else if (typeof component.render === 'function') {
                console.log(`🎯 Вызываем component.render()`);
                // Для наших простых компонентов
                component.render();
            }
            
            // Обновление данных компонента
            this.updateComponentData(componentName);
            console.log(`✅ Компонент ${componentName} показан`);
        } else {
            console.warn(`⚠️ Компонент ${componentName} не найден`);
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