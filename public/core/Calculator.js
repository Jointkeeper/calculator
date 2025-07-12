/**
 * Calculator - Модуль расчетов
 * Централизованная логика всех вычислений калькулятора
 */

import { INDUSTRY_CONFIG } from '../data/industries.js';

class Calculator {
    constructor() {
        this.industries = Object.values(INDUSTRY_CONFIG);
        this.defaultRates = {
            cpc: 50, // средний CPC в рублях
            conversion: 0.02, // 2% конверсия
            customerLifetime: 12, // месяцев
            averageOrder: 5000, // рублей
            roi: 3.5, // ROI 350%
            efficiencyGain: 0.3, // 30% повышение эффективности
            automationSavings: 0.25, // 25% экономия от автоматизации
            optimizationSavings: 0.2 // 20% экономия от оптимизации
        };
    }

    /**
     * Основной расчет экономии
     */
    calculateSavings(data) {
        const {
            industry,
            businessSize,
            marketingBudget,
            teamSize,
            tools,
            currentEfficiency
        } = data;

        // Базовые расчеты
        const baseCalculations = this.calculateBaseMetrics(data);
        
        // Расчеты по индустрии
        const industryCalculations = this.calculateIndustryMetrics(industry, baseCalculations);
        
        // Расчеты по размеру бизнеса
        const sizeCalculations = this.calculateSizeMetrics(businessSize, industryCalculations);
        
        // Расчеты команды
        const teamCalculations = this.calculateTeamMetrics(teamSize, sizeCalculations);
        
        // Расчеты инструментов
        const toolsCalculations = this.calculateToolsMetrics(tools, teamCalculations);
        
        // Финальные расчеты
        const finalCalculations = this.calculateFinalMetrics(toolsCalculations, currentEfficiency);

        return {
            ...finalCalculations,
            breakdown: this.generateBreakdown(data, finalCalculations),
            recommendations: this.generateRecommendations(data, finalCalculations)
        };
    }

    /**
     * Базовые метрики
     */
    calculateBaseMetrics(data) {
        const { marketingBudget, industry } = data;
        
        // Средние показатели по индустрии
        const industryData = this.industries.find(ind => ind.id === industry) || this.industries[0];
        
        return {
            monthlyBudget: marketingBudget,
            annualBudget: marketingBudget * 12,
            industryCPC: industryData.avgCpc || this.defaultRates.cpc,
            industryConversion: industryData.avgConversion || this.defaultRates.conversion,
            industryROI: industryData.avgRoi || this.defaultRates.roi
        };
    }

    /**
     * Метрики по индустрии
     */
    calculateIndustryMetrics(industry, baseMetrics) {
        const industryData = this.industries.find(ind => ind.id === industry);
        if (!industryData) return baseMetrics;

        const multiplier = industryData.efficiencyMultiplier || 1;
        
        return {
            ...baseMetrics,
            industryEfficiency: multiplier,
            adjustedBudget: baseMetrics.monthlyBudget * multiplier,
            industrySavings: baseMetrics.monthlyBudget * (multiplier - 1)
        };
    }

    /**
     * Метрики по размеру бизнеса
     */
    calculateSizeMetrics(businessSize, industryMetrics) {
        const sizeMultipliers = {
            'small': { efficiency: 0.8, savings: 0.15 },
            'medium': { efficiency: 1.0, savings: 0.25 },
            'large': { efficiency: 1.2, savings: 0.35 }
        };

        const multiplier = sizeMultipliers[businessSize] || sizeMultipliers.medium;
        
        return {
            ...industryMetrics,
            sizeEfficiency: multiplier.efficiency,
            sizeSavings: industryMetrics.monthlyBudget * multiplier.savings,
            adjustedEfficiency: industryMetrics.industryEfficiency * multiplier.efficiency
        };
    }

    /**
     * Метрики команды
     */
    calculateTeamMetrics(teamSize, sizeMetrics) {
        const teamEfficiency = this.calculateTeamEfficiency(teamSize);
        const teamSavings = this.calculateTeamSavings(teamSize, sizeMetrics.monthlyBudget);
        
        return {
            ...sizeMetrics,
            teamEfficiency,
            teamSavings,
            totalEfficiency: sizeMetrics.adjustedEfficiency * teamEfficiency
        };
    }

    /**
     * Эффективность команды
     */
    calculateTeamEfficiency(teamSize) {
        const teamEfficiencies = {
            1: 0.6,   // 1 человек - низкая эффективность
            2: 0.75,  // 2 человека - средняя эффективность
            3: 0.85,  // 3 человека - хорошая эффективность
            4: 0.9,   // 4 человека - высокая эффективность
            5: 0.95   // 5+ человек - максимальная эффективность
        };

        return teamEfficiencies[teamSize] || teamEfficiencies[5];
    }

    /**
     * Экономия от команды
     */
    calculateTeamSavings(teamSize, monthlyBudget) {
        const teamCosts = {
            1: 0.1,  // 10% бюджета на команду
            2: 0.15, // 15% бюджета на команду
            3: 0.2,  // 20% бюджета на команду
            4: 0.25, // 25% бюджета на команду
            5: 0.3   // 30% бюджета на команду
        };

        const teamCost = teamCosts[teamSize] || teamCosts[5];
        return monthlyBudget * teamCost;
    }

    /**
     * Метрики инструментов
     */
    calculateToolsMetrics(tools, teamMetrics) {
        const toolsEfficiency = this.calculateToolsEfficiency(tools);
        const toolsSavings = this.calculateToolsSavings(tools, teamMetrics.monthlyBudget);
        
        return {
            ...teamMetrics,
            toolsEfficiency,
            toolsSavings,
            finalEfficiency: teamMetrics.totalEfficiency * toolsEfficiency
        };
    }

    /**
     * Эффективность инструментов
     */
    calculateToolsEfficiency(tools) {
        const toolEfficiencies = {
            'analytics': 1.1,    // +10% эффективность
            'automation': 1.2,   // +20% эффективность
            'optimization': 1.15, // +15% эффективность
            'crm': 1.05,         // +5% эффективность
            'social': 1.08,      // +8% эффективность
            'email': 1.12,       // +12% эффективность
            'seo': 1.18,         // +18% эффективность
            'ppc': 1.25          // +25% эффективность
        };

        let totalEfficiency = 1;
        tools.forEach(tool => {
            totalEfficiency *= (toolEfficiencies[tool] || 1);
        });

        // Ограничиваем максимальную эффективность
        return Math.min(totalEfficiency, 2.0);
    }

    /**
     * Экономия от инструментов
     */
    calculateToolsSavings(tools, monthlyBudget) {
        const toolSavings = {
            'analytics': 0.05,    // 5% экономии
            'automation': 0.15,   // 15% экономии
            'optimization': 0.12, // 12% экономии
            'crm': 0.03,          // 3% экономии
            'social': 0.08,       // 8% экономии
            'email': 0.1,         // 10% экономии
            'seo': 0.2,           // 20% экономии
            'ppc': 0.25           // 25% экономии
        };

        let totalSavings = 0;
        tools.forEach(tool => {
            totalSavings += monthlyBudget * (toolSavings[tool] || 0);
        });

        return totalSavings;
    }

    /**
     * Финальные метрики
     */
    calculateFinalMetrics(toolsMetrics, currentEfficiency) {
        const efficiencyGain = toolsMetrics.finalEfficiency - (currentEfficiency || 0.7);
        const monthlySavings = toolsMetrics.monthlyBudget * efficiencyGain;
        const annualSavings = monthlySavings * 12;
        
        // ROI расчет
        const totalInvestment = toolsMetrics.monthlyBudget * 12;
        const roi = (annualSavings / totalInvestment) * 100;
        
        // Дополнительная экономия
        const additionalSavings = this.calculateAdditionalSavings(toolsMetrics);
        
        return {
            ...toolsMetrics,
            efficiencyGain,
            monthlySavings,
            annualSavings,
            totalSavings: annualSavings + additionalSavings,
            roi,
            additionalSavings,
            paybackPeriod: this.calculatePaybackPeriod(annualSavings, totalInvestment)
        };
    }

    /**
     * Дополнительная экономия
     */
    calculateAdditionalSavings(toolsMetrics) {
        const { monthlyBudget, teamSavings, toolsSavings, sizeSavings } = toolsMetrics;
        
        // Экономия от автоматизации
        const automationSavings = monthlyBudget * this.defaultRates.automationSavings;
        
        // Экономия от оптимизации
        const optimizationSavings = monthlyBudget * this.defaultRates.optimizationSavings;
        
        // Экономия времени команды
        const timeSavings = teamSavings * 0.5; // 50% от экономии команды
        
        return (automationSavings + optimizationSavings + timeSavings) * 12;
    }

    /**
     * Период окупаемости
     */
    calculatePaybackPeriod(annualSavings, totalInvestment) {
        if (annualSavings <= 0) return Infinity;
        return totalInvestment / annualSavings;
    }

    /**
     * Генерация детализации
     */
    generateBreakdown(data, calculations) {
        return {
            budget: {
                monthly: calculations.monthlyBudget,
                annual: calculations.annualBudget,
                adjusted: calculations.adjustedBudget
            },
            efficiency: {
                industry: calculations.industryEfficiency,
                size: calculations.sizeEfficiency,
                team: calculations.teamEfficiency,
                tools: calculations.toolsEfficiency,
                total: calculations.finalEfficiency,
                gain: calculations.efficiencyGain
            },
            savings: {
                industry: calculations.industrySavings,
                size: calculations.sizeSavings,
                team: calculations.teamSavings,
                tools: calculations.toolsSavings,
                additional: calculations.additionalSavings,
                monthly: calculations.monthlySavings,
                annual: calculations.annualSavings,
                total: calculations.totalSavings
            },
            metrics: {
                roi: calculations.roi,
                paybackPeriod: calculations.paybackPeriod,
                customerLifetime: this.defaultRates.customerLifetime,
                averageOrder: this.defaultRates.averageOrder
            }
        };
    }

    /**
     * Генерация рекомендаций
     */
    generateRecommendations(data, calculations) {
        const recommendations = [];

        // Рекомендации по эффективности
        if (calculations.finalEfficiency < 1.0) {
            recommendations.push({
                type: 'efficiency',
                priority: 'high',
                title: 'Повысить эффективность маркетинга',
                description: 'Текущая эффективность ниже среднего. Рекомендуем внедрить дополнительные инструменты.',
                impact: 'Потенциальная экономия: ' + this.formatCurrency(calculations.monthlySavings * 0.3)
            });
        }

        // Рекомендации по команде
        if (data.teamSize < 2) {
            recommendations.push({
                type: 'team',
                priority: 'medium',
                title: 'Расширить команду',
                description: 'Добавление специалиста может повысить эффективность на 15-20%.',
                impact: 'Потенциальная экономия: ' + this.formatCurrency(calculations.monthlyBudget * 0.15)
            });
        }

        // Рекомендации по инструментам
        const missingTools = this.getMissingTools(data.tools);
        if (missingTools.length > 0) {
            recommendations.push({
                type: 'tools',
                priority: 'high',
                title: 'Внедрить дополнительные инструменты',
                description: `Рекомендуем добавить: ${missingTools.join(', ')}`,
                impact: 'Потенциальная экономия: ' + this.formatCurrency(calculations.toolsSavings * 0.5)
            });
        }

        // Рекомендации по бюджету
        if (calculations.roi < 200) {
            recommendations.push({
                type: 'budget',
                priority: 'medium',
                title: 'Оптимизировать бюджет',
                description: 'ROI ниже среднего. Рекомендуем пересмотреть распределение бюджета.',
                impact: 'Потенциальная экономия: ' + this.formatCurrency(calculations.monthlyBudget * 0.1)
            });
        }

        return recommendations;
    }

    /**
     * Получение отсутствующих инструментов
     */
    getMissingTools(currentTools) {
        const allTools = ['analytics', 'automation', 'optimization', 'crm', 'social', 'email', 'seo', 'ppc'];
        return allTools.filter(tool => !currentTools.includes(tool));
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
     * Валидация данных
     */
    validateData(data) {
        const errors = [];

        if (!data.marketingBudget || data.marketingBudget <= 0) {
            errors.push('Бюджет маркетинга должен быть больше 0');
        }

        if (!data.industry) {
            errors.push('Необходимо выбрать индустрию');
        }

        if (!data.businessSize) {
            errors.push('Необходимо указать размер бизнеса');
        }

        if (!data.teamSize || data.teamSize < 1) {
            errors.push('Размер команды должен быть не менее 1');
        }

        if (!data.tools || data.tools.length === 0) {
            errors.push('Необходимо выбрать хотя бы один инструмент');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// Экспорт синглтона
export const calculator = new Calculator(); 