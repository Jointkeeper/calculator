/**
 * Main Application Entry Point - Production Version
 * Универсальный калькулятор экономии маркетингового бюджета
 * 
 * @author Steamphony Digital Agency
 * @version 4.0.0 - Production design integration
 */

// Глобальный объект приложения
window.app = {
    currentStep: 0,
    totalSteps: 6,
    formData: {},

    /**
     * Инициализация приложения
     */
    init() {
        console.log('🚀 Инициализация приложения...');
        this.initializeProductionHandlers();
    },

    /**
     * Инициализация обработчиков для production-дизайна
     */
    initializeProductionHandlers() {
        // Обработчик кнопки "Начать расчет"
        const startButton = document.getElementById('start-calculator-btn');
        if (startButton) {
            startButton.addEventListener('click', () => {
                this.showStep(1);
            });
        }

        // Обработчики для опций
        document.addEventListener('click', (e) => {
            if (e.target.closest('.option-button')) {
                const optionButton = e.target.closest('.option-button');
                // Проверяем, есть ли у кнопки onclick атрибут
                // Если есть - не обрабатываем, так как обработчик уже вызван через onclick
                if (optionButton.hasAttribute('onclick')) {
                    return;
                }
                // Если нет onclick - обрабатываем здесь
                if (optionButton.parentNode.classList.contains('multiple-choice')) {
                    this.toggleOption(optionButton);
                } else {
                    this.selectOption(optionButton);
                }
            }
        });

        console.log('✅ Обработчики событий инициализированы');
    },

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
        
        // Скрыть все шаги
        const allSteps = document.querySelectorAll('.calculator-step');
        allSteps.forEach(step => {
            step.classList.remove('active');
        });

        // Показать нужный шаг
        const targetStep = document.getElementById(`step-${stepNumber}`);
        if (targetStep) {
            targetStep.classList.add('active');
            this.currentStep = stepNumber - 1;
            this.updateProgress();
            
            // Если это шаг 6 - рассчитываем и показываем результаты
            if (stepNumber === 6) {
                this.calculateResults();
            }
            
            console.log(`📋 Показан шаг ${stepNumber}`);
        }
    },

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
    },

    /**
     * Переключить опцию (для множественного выбора)
     */
    toggleOption(element) {
        element.classList.toggle('selected');
        console.log('🎯 Toggle option:', element.querySelector('.option-title').textContent, 
                    'Selected:', element.classList.contains('selected'));
    },

    /**
     * Собрать данные формы
     */
    collectFormData() {
        const formData = {
            industry: null,
            businessSize: null,
            budget: null,
            tools: [],
            marketingTeam: null
        };

        // Шаг 1: Отрасль
        const industrySelected = document.querySelector('#step-1 .option-button.selected');
        if (industrySelected) {
            formData.industry = industrySelected.querySelector('.option-title').textContent;
        }

        // Шаг 2: Размер бизнеса
        const sizeSelected = document.querySelector('#step-2 .option-button.selected');
        if (sizeSelected) {
            formData.businessSize = sizeSelected.querySelector('.option-title').textContent;
        }

        // Шаг 3: Бюджет
        const budgetSelected = document.querySelector('#step-3 .option-button.selected');
        if (budgetSelected) {
            const budgetText = budgetSelected.querySelector('.option-title').textContent;
            // Извлекаем числовое значение из текста
            if (budgetText.includes('До 100')) {
                formData.budget = 50000;
            } else if (budgetText.includes('100 000 – 500 000')) {
                formData.budget = 300000;
            } else if (budgetText.includes('500 000 – 1 000 000')) {
                formData.budget = 750000;
            } else if (budgetText.includes('Более 1 000 000')) {
                formData.budget = 1500000;
            }
        }

        // Шаг 4: Инструменты
        const toolsSelected = document.querySelectorAll('#step-4 .option-button.selected');
        toolsSelected.forEach(tool => {
            formData.tools.push(tool.querySelector('.option-title').textContent);
        });

        // Шаг 5: Команда
        const teamSelected = document.querySelector('#step-5 .option-button.selected');
        if (teamSelected) {
            formData.marketingTeam = teamSelected.querySelector('.option-title').textContent;
        }

        this.formData = formData;
        return formData;
    },

    /**
     * Рассчитать результаты
     */
    calculateResults() {
        const formData = this.collectFormData();
        console.log('📊 Данные формы:', formData);

        // Базовые расчеты
        const currentBudget = formData.budget || 100000;
        
        // Коэффициенты экономии в зависимости от отрасли
        const industrySavings = {
            '🍽️ Рестораны и кафе': 0.35,
            '🛍️ Розничная торговля': 0.30,
            '🔧 Услуги': 0.25,
            '🏥 Медицина и красота': 0.40,
            '🎓 Образование': 0.45
        };

        // Коэффициент экономии в зависимости от размера бизнеса
        const sizeSavings = {
            '👥 До 5 сотрудников': 0.20,
            '🏢 Малый бизнес': 0.25,
            '🏬 Средний бизнес': 0.30,
            '🏭 Крупный бизнес': 0.35,
            '🌟 Корпорация': 0.40
        };

        // Коэффициент в зависимости от команды
        const teamCoefficient = {
            '👨‍💼 Да, есть штатный маркетолог': 0.15,
            '🤝 Нет, все на аутсорсе': 0.25,
            '🔧 Нет, занимаюсь сам(а)': 0.35,
            '❌ Нет, не занимаемся': 0.45
        };

        // Расчет экономии
        const industryCoef = industrySavings[formData.industry] || 0.30;
        const sizeCoef = sizeSavings[formData.businessSize] || 0.25;
        const teamCoef = teamCoefficient[formData.marketingTeam] || 0.25;
        
        // Дополнительная экономия от инструментов
        const toolsCoef = Math.min(formData.tools.length * 0.03, 0.15);
        
        // Общий коэффициент экономии
        const totalCoef = (industryCoef + sizeCoef + teamCoef + toolsCoef) / 4;
        
        // Расчет итоговых значений
        const monthlySavings = Math.round(currentBudget * totalCoef);
        const steamphonyCost = Math.round(currentBudget * 0.15); // 15% от бюджета
        const roi = Math.round((monthlySavings / steamphonyCost) * 100);
        const paybackPeriod = Math.round(steamphonyCost / monthlySavings);

        // Обновляем значения на странице
        const savingsElement = document.getElementById('savings-value');
        const roiElement = document.getElementById('roi-value');
        const paybackElement = document.getElementById('payback-value');

        if (savingsElement) {
            savingsElement.textContent = `${monthlySavings.toLocaleString('ru-RU')} ₽/мес`;
        }
        if (roiElement) {
            roiElement.textContent = `${roi}%`;
        }
        if (paybackElement) {
            paybackElement.textContent = `${paybackPeriod} мес`;
        }

        // Обновляем рекомендации
        const recommendations = this.generateRecommendations(formData);
        const recommendationsList = document.getElementById('recommendations-list');
        if (recommendationsList) {
            recommendationsList.innerHTML = recommendations.map(rec => 
                `<div style="padding: 12px 16px; background: white; border-radius: 8px; font-size: 14px; color: #374151;">• ${rec}</div>`
            ).join('');
        }

        console.log('💰 Результаты расчета:', {
            monthlySavings,
            roi,
            paybackPeriod,
            steamphonyCost
        });
    },

    /**
     * Генерация рекомендаций
     */
    generateRecommendations(formData) {
        const recommendations = [];

        // Рекомендации по отрасли
        if (formData.industry && formData.industry.includes('Рестораны')) {
            recommendations.push('Внедрение системы онлайн-бронирования и доставки');
            recommendations.push('Оптимизация локального SEO и работа с отзывами');
        } else if (formData.industry && formData.industry.includes('Розничная')) {
            recommendations.push('Развитие омниканальных продаж');
            recommendations.push('Внедрение программы лояльности');
        }

        // Рекомендации по команде
        if (formData.marketingTeam && formData.marketingTeam.includes('занимаюсь сам')) {
            recommendations.push('Автоматизация рутинных маркетинговых задач');
            recommendations.push('Внедрение системы аналитики для принятия решений');
        }

        // Рекомендации по инструментам
        if (formData.tools.length < 3) {
            recommendations.push('Расширение набора маркетинговых инструментов');
        } else if (formData.tools.length > 5) {
            recommendations.push('Оптимизация и интеграция существующих инструментов');
        }

        // Общие рекомендации
        recommendations.push('Регулярный аудит эффективности маркетинговых кампаний');
        
        return recommendations.slice(0, 4); // Возвращаем максимум 4 рекомендации
    },

    /**
     * Обновить прогресс
     */
    updateProgress() {
        const progressPercentage = ((this.currentStep + 1) / this.totalSteps) * 100;
        
        const stepIndicator = document.querySelector('.step-indicator');
        const progressFill = document.querySelector('.progress-fill');
        const dots = document.querySelectorAll('.step-dot');
        
        if (stepIndicator) {
            stepIndicator.textContent = `Шаг ${this.currentStep + 1} из ${this.totalSteps}`;
        }
        
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
        
        dots.forEach((dot, index) => {
            dot.classList.remove('active', 'completed');
            if (index === this.currentStep) {
                dot.classList.add('active');
            } else if (index < this.currentStep) {
                dot.classList.add('completed');
            }
        });
    },

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
};

// Инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app.init();
    });
} else {
    window.app.init();
}

console.log('🎯 Production калькулятор загружен'); 