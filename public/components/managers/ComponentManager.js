/**
 * ComponentManager - Менеджер компонентов
 * Управляет жизненным циклом UI компонентов
 */

import { AppState } from '../../core/AppState.js?v=1.0.4';
import ContactFormStep from '../ContactFormStep.js';

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
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="ecommerce">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">E-commerce</h4>
                                        <p class="text-sm text-gray-600 mt-1">Интернет-магазины</p>
                                    </div>
                                </button>
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="consulting">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">Консалтинг</h4>
                                        <p class="text-sm text-gray-600 mt-1">Бизнес-консультации</p>
                                    </div>
                                </button>
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="education">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">Образование</h4>
                                        <p class="text-sm text-gray-600 mt-1">Онлайн и офлайн обучение</p>
                                    </div>
                                </button>
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="healthcare">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">Здравоохранение</h4>
                                        <p class="text-sm text-gray-600 mt-1">Медицинские услуги</p>
                                    </div>
                                </button>
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="realestate">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">Недвижимость</h4>
                                        <p class="text-sm text-gray-600 mt-1">Агентства недвижимости</p>
                                    </div>
                                </button>
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="finance">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">Финансы</h4>
                                        <p class="text-sm text-gray-600 mt-1">Банки, страховые компании</p>
                                    </div>
                                </button>
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="manufacturing">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"/>
                                                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">Производство</h4>
                                        <p class="text-sm text-gray-600 mt-1">Промышленное производство</p>
                                    </div>
                                </button>
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="technology">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">Технологии</h4>
                                        <p class="text-sm text-gray-600 mt-1">IT и программное обеспечение</p>
                                    </div>
                                </button>
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="automotive">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">Автомобильная отрасль</h4>
                                        <p class="text-sm text-gray-600 mt-1">Автосервисы, дилеры</p>
                                    </div>
                                </button>
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="beauty">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">Красота и здоровье</h4>
                                        <p class="text-sm text-gray-600 mt-1">Салоны красоты, фитнес</p>
                                    </div>
                                </button>
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="entertainment">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v1H8a1 1 0 00-1 1v1a1 1 0 01-1 1H2V6z"/>
                                                <path d="M2 12a2 2 0 012-2h1a1 1 0 011 1v1a1 1 0 01-1 1H4a2 2 0 01-2-2z"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">Развлечения</h4>
                                        <p class="text-sm text-gray-600 mt-1">Кинотеатры, развлекательные центры</p>
                                    </div>
                                </button>
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="travel">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">Туризм</h4>
                                        <p class="text-sm text-gray-600 mt-1">Туристические агентства</p>
                                    </div>
                                </button>
                                <button class="industry-card p-4 border border-gray-200 rounded-lg hover:border-steamphony-blue hover:bg-blue-50 transition-colors" data-industry="custom">
                                    <div class="text-center">
                                        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"/>
                                            </svg>
                                        </div>
                                        <h4 class="font-medium text-gray-900">Другая отрасль</h4>
                                        <p class="text-sm text-gray-600 mt-1">Укажите свою отрасль</p>
                                        <input type="text" id="custom-industry" placeholder="Введите название отрасли" class="w-full p-2 mt-2 border border-gray-300 rounded-lg" style="display: none;">
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
        const customInput = document.getElementById('custom-industry');
        
        industryCards.forEach(card => {
            card.addEventListener('click', () => {
                const industry = card.dataset.industry;
                
                // Убираем выделение со всех карточек
                industryCards.forEach(c => c.classList.remove('border-steamphony-blue', 'bg-blue-50'));
                // Добавляем выделение к выбранной карточке
                card.classList.add('border-steamphony-blue', 'bg-blue-50');
                
                // Специальная обработка для "Другая отрасль"
                if (industry === 'custom') {
                    if (customInput) {
                        customInput.style.display = 'block';
                        customInput.focus();
                        // Не переходим автоматически, ждем ввода
                        return;
                    }
                } else {
                    // Скрываем поле ввода для других вариантов
                    if (customInput) {
                        customInput.style.display = 'none';
                        customInput.value = '';
                    }
                }
                
                // Сохраняем выбор в AppState
                const appState = window.app?.componentManager?.appState;
                console.log('window.app.componentManager.appState:', appState);
                if (typeof appState?.setFormField === 'function') {
                    const title = card.querySelector('h4')?.textContent || industry;
                    appState.setFormField('industry', { key: industry, title });
                } else {
                    console.error('❌ appState.setFormField не функция!', appState);
                }
                
                // Переход к следующему шагу через StepManager
                if (window.app && window.app.stepManager) {
                    window.app.stepManager.nextStep();
                } else {
                    console.warn('StepManager не найден, используем прямой переход');
                    // Прямой переход к следующему шагу
                    const currentStep = window.app?.componentManager?.appState?.getCurrentStep() || 1;
                    const nextStep = Math.min(currentStep + 1, 6);
                    if (window.app?.componentManager?.appState) {
                        window.app.componentManager.appState.setCurrentStep(nextStep);
                    }
                }
            });
        });
        
        // Обработчик для поля ввода
        if (customInput) {
            customInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && this.value.trim()) {
                    // Сохраняем кастомную отрасль
                    const appState = window.app?.componentManager?.appState;
                    console.log('window.app.componentManager.appState:', appState);
                    if (typeof appState?.setFormField === 'function') {
                        appState.setFormField('industry', { 
                            key: 'custom', 
                            title: this.value.trim() 
                        });
                    } else {
                        console.error('❌ appState.setFormField не функция!', appState);
                    }
                    
                    // Переход к следующему шагу при нажатии Enter
                    setTimeout(() => {
                        if (window.app && window.app.stepManager) {
                            window.app.stepManager.nextStep();
                        }
                    }, 500);
                }
            });
            
            customInput.addEventListener('blur', function() {
                if (this.value.trim()) {
                    // Сохраняем кастомную отрасль
                    const appState = window.app?.componentManager?.appState;
                    console.log('window.app.componentManager.appState:', appState);
                    if (typeof appState?.setFormField === 'function') {
                        appState.setFormField('industry', { 
                            key: 'custom', 
                            title: this.value.trim() 
                        });
                    } else {
                        console.error('❌ appState.setFormField не функция!', appState);
                    }
                    
                    // Переход к следующему шагу при потере фокуса
                    setTimeout(() => {
                        if (window.app && window.app.stepManager) {
                            window.app.stepManager.nextStep();
                        }
                    }, 500);
                }
            });
        }
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
                
                // Сохраняем выбор в AppState
                if (window.app && window.app.componentManager) {
                    window.app.componentManager.appState.setFormField('businessSize', size);
                }
                
                // Переход к следующему шагу
                if (window.app && window.app.stepManager) {
                    window.app.stepManager.nextStep();
                } else {
                    console.warn('StepManager не найден, используем прямой переход');
                    const currentStep = window.app?.componentManager?.appState?.getCurrentStep() || 2;
                    const nextStep = Math.min(currentStep + 1, 6);
                    if (window.app?.componentManager?.appState) {
                        window.app.componentManager.appState.setCurrentStep(nextStep);
                    }
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
                <button class="nav-button secondary" onclick="window.app.stepManager.previousStep()">Назад</button>
                <button class="nav-button primary" onclick="window.app.stepManager.nextStep()">Далее</button>
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
                
                // Сохраняем выбор в AppState
                if (window.app && window.app.componentManager) {
                    window.app.componentManager.appState.setFormField('team', team);
                }
                
                // Переход к следующему шагу
                if (window.app && window.app.stepManager) {
                    window.app.stepManager.nextStep();
                } else {
                    console.warn('StepManager не найден, используем прямой переход');
                    const currentStep = window.app?.componentManager?.appState?.getCurrentStep() || 4;
                    const nextStep = Math.min(currentStep + 1, 6);
                    if (window.app?.componentManager?.appState) {
                        window.app.componentManager.appState.setCurrentStep(nextStep);
                    }
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
                        <div class="tools-grid">
                            <div class="tool-card">
                                <input type="checkbox" id="social" value="social">
                                <label for="social">
                                    <h4>Социальные сети</h4>
                                    <p>Instagram, Facebook, VK</p>
                                </label>
                            </div>
                            <div class="tool-card">
                                <input type="checkbox" id="ads" value="ads">
                                <label for="ads">
                                    <h4>Контекстная реклама</h4>
                                    <p>Яндекс.Директ, Google Ads</p>
                                </label>
                            </div>
                            <div class="tool-card">
                                <input type="checkbox" id="seo" value="seo">
                                <label for="seo">
                                    <h4>SEO</h4>
                                    <p>Поисковая оптимизация</p>
                                </label>
                            </div>
                            <div class="tool-card">
                                <input type="checkbox" id="email" value="email">
                                <label for="email">
                                    <h4>Email-маркетинг</h4>
                                    <p>Рассылки по email</p>
                                </label>
                            </div>
                            <div class="tool-card">
                                <input type="checkbox" id="content" value="content">
                                <label for="content">
                                    <h4>Контент-маркетинг</h4>
                                    <p>Блоги, статьи, видео</p>
                                </label>
                            </div>
                            <div class="tool-card">
                                <input type="checkbox" id="influencer" value="influencer">
                                <label for="influencer">
                                    <h4>Инфлюенсер-маркетинг</h4>
                                    <p>Работа с блогерами</p>
                                </label>
                            </div>
                            <div class="tool-card">
                                <input type="checkbox" id="affiliate" value="affiliate">
                                <label for="affiliate">
                                    <h4>Партнерский маркетинг</h4>
                                    <p>Партнерские программы</p>
                                </label>
                            </div>
                            <div class="tool-card">
                                <input type="checkbox" id="events" value="events">
                                <label for="events">
                                    <h4>Ивент-маркетинг</h4>
                                    <p>Мероприятия и выставки</p>
                                </label>
                            </div>
                            <div class="tool-card">
                                <input type="checkbox" id="pr" value="pr">
                                <label for="pr">
                                    <h4>PR и медиа</h4>
                                    <p>Связи с общественностью</p>
                                </label>
                            </div>
                            <div class="tool-card">
                                <input type="checkbox" id="retargeting" value="retargeting">
                                <label for="retargeting">
                                    <h4>Ретаргетинг</h4>
                                    <p>Повторное таргетирование</p>
                                </label>
                            </div>
                            <div class="tool-card">
                                <input type="checkbox" id="crm" value="crm">
                                <label for="crm">
                                    <h4>CRM системы</h4>
                                    <p>Управление клиентами</p>
                                </label>
                            </div>
                            <div class="tool-card">
                                <input type="checkbox" id="analytics" value="analytics">
                                <label for="analytics">
                                    <h4>Аналитика</h4>
                                    <p>Яндекс.Метрика, GA</p>
                                </label>
                            </div>
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
        const toolCards = formContent.querySelectorAll('.tool-card');
        
        toolCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Не переключаем чекбокс если кликнули на сам чекбокс
                if (e.target.type === 'checkbox') return;
                
                const checkbox = card.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                
                // Обновляем стили
                if (checkbox.checked) {
                    card.style.borderColor = '#8B4513';
                    card.style.background = '#f0f0f0';
                } else {
                    card.style.borderColor = '#ddd';
                    card.style.background = 'white';
                }
                
                // Сохраняем выбор в AppState
                if (window.app && window.app.componentManager) {
                    const selectedTools = Array.from(formContent.querySelectorAll('input[type="checkbox"]:checked'))
                        .map(cb => cb.value);
                    window.app.componentManager.appState.setFormField('tools', selectedTools);
                }
            });
        });
        
        // Добавляем кнопки навигации
        const navButtons = document.createElement('div');
        navButtons.className = 'nav-buttons';
        navButtons.innerHTML = `
            <button class="nav-button secondary" onclick="window.app.stepManager.previousStep()">Назад</button>
            <button class="nav-button primary" onclick="window.app.stepManager.nextStep()">Далее</button>
        `;
        formContent.appendChild(navButtons);
    }

    async initializeContactFormStep() {
        const formContent = document.getElementById('form-content');
        if (!formContent) {
            console.warn('⚠️ Контейнер #form-content не найден, пропускаем инициализацию ContactFormStep');
            return;
        }
        // Создаем экземпляр настоящего класса ContactFormStep
        const contactFormStep = new ContactFormStep(formContent);
        this.components.set('contactFormStep', contactFormStep);
        console.log('[ComponentManager] contactFormStep создан:', contactFormStep);
    }

    setupContactEventHandlers() {
        const formContent = document.getElementById('form-content');
        const navButtons = document.createElement('div');
        navButtons.className = 'nav-buttons';
        navButtons.innerHTML = `
            <button class="nav-button secondary" onclick="window.app.stepManager.previousStep()">Назад</button>
            <button class="nav-button primary" onclick="window.app.stepManager.onCalculatorComplete()">Получить результаты</button>
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