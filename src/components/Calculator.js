/**
 * UniversalSavingsCalculator - Универсальный калькулятор экономии
 * Финальный компонент для расчета экономии маркетингового бюджета
 * Использует конфигурации всех 8 отраслей для персонализированных расчетов
 * 
 * @class UniversalSavingsCalculator
 * @author Steamphony Digital Agency
 * @version 1.0.0
 */

import { INDUSTRY_CONFIG, CALCULATION_CONSTANTS } from '../data/industries.js';
import { IndustryUtils } from '../utils/IndustryUtils.js';

export class UniversalSavingsCalculator {
  /**
   * Создает экземпляр UniversalSavingsCalculator
   * 
   * @param {Object} options - Опции конфигурации
   */
  constructor(options = {}) {
    // Основные конфигурации
    this.industries = INDUSTRY_CONFIG;
    this.utils = IndustryUtils;
    this.constants = CALCULATION_CONSTANTS;
    
    // Опции калькулятора
    this.options = {
      currency: 'USD',
      steamphonyDiscount: 0.35, // 35% скидка на инструменты
      managementFee: 0, // $0 за управление - ключевое УТП!
      defaultGrowthMultiplier: 1.4, // 40% рост по умолчанию
      validationStrict: true,
      enableAnalytics: true,
      ...options
    };

    // Маркетинговые инструменты с базовыми ценами (USD/месяц)
    this.marketingTools = {
      facebook_ads: {
        name: 'Facebook/Instagram Business',
        category: 'social_media',
        basePrice: 200,
        description: 'Реклама в социальных сетях',
        necessity: 'high'
      },
      google_ads: {
        name: 'Google Ads',
        category: 'paid_advertising',
        basePrice: 300,
        description: 'Контекстная реклама Google',
        necessity: 'high'
      },
      crm_system: {
        name: 'CRM система',
        category: 'customer_management',
        basePrice: 150,
        description: 'Управление клиентами',
        necessity: 'high'
      },
      email_marketing: {
        name: 'Email маркетинг',
        category: 'email_automation',
        basePrice: 80,
        description: 'Автоматизация email рассылок',
        necessity: 'medium'
      },
      analytics: {
        name: 'Веб-аналитика',
        category: 'analytics',
        basePrice: 120,
        description: 'Google Analytics, Яндекс.Метрика',
        necessity: 'high'
      },
      social_media_management: {
        name: 'SMM платформа',
        category: 'social_media',
        basePrice: 100,
        description: 'Управление социальными сетями',
        necessity: 'medium'
      },
      content_creation: {
        name: 'Контент-платформа',
        category: 'content',
        basePrice: 180,
        description: 'Создание и планирование контента',
        necessity: 'medium'
      },
      landing_builder: {
        name: 'Конструктор лендингов',
        category: 'websites',
        basePrice: 90,
        description: 'Создание посадочных страниц',
        necessity: 'medium'
      },
      chatbot: {
        name: 'Чат-бот',
        category: 'automation',
        basePrice: 70,
        description: 'Автоматизация общения с клиентами',
        necessity: 'low'
      },
      call_tracking: {
        name: 'Коллтрекинг',
        category: 'analytics',
        basePrice: 110,
        description: 'Отслеживание звонков',
        necessity: 'medium'
      },
      reputation_management: {
        name: 'Управление репутацией',
        category: 'reputation',
        basePrice: 130,
        description: 'Мониторинг отзывов и репутации',
        necessity: 'medium'
      },
      seo_tools: {
        name: 'SEO инструменты',
        category: 'seo',
        basePrice: 160,
        description: 'Продвижение в поисковых системах',
        necessity: 'medium'
      },
      retargeting: {
        name: 'Ретаргетинг',
        category: 'paid_advertising',
        basePrice: 140,
        description: 'Возврат потерянных клиентов',
        necessity: 'medium'
      },
      video_marketing: {
        name: 'Видео-маркетинг',
        category: 'content',
        basePrice: 200,
        description: 'Создание и продвижение видео',
        necessity: 'low'
      },
      marketplace_tools: {
        name: 'Инструменты маркетплейсов',
        category: 'ecommerce',
        basePrice: 170,
        description: 'Управление продажами на маркетплейсах',
        necessity: 'low'
      },
      loyalty_program: {
        name: 'Программа лояльности',
        category: 'customer_retention',
        basePrice: 120,
        description: 'Удержание и возврат клиентов',
        necessity: 'medium'
      },
      ab_testing: {
        name: 'A/B тестирование',
        category: 'optimization',
        basePrice: 95,
        description: 'Тестирование и оптимизация',
        necessity: 'low'
      },
      influencer_platform: {
        name: 'Платформа инфлюенсеров',
        category: 'influencer',
        basePrice: 250,
        description: 'Работа с блогерами и инфлюенсерами',
        necessity: 'low'
      },
      marketing_automation: {
        name: 'Маркетинг автоматизация',
        category: 'automation',
        basePrice: 220,
        description: 'Комплексная автоматизация маркетинга',
        necessity: 'medium'
      },
      competitor_analysis: {
        name: 'Анализ конкурентов',
        category: 'analytics',
        basePrice: 85,
        description: 'Мониторинг конкурентов',
        necessity: 'low'
      }
    };

    // Типы маркетологов и их средние зарплаты
    this.marketerTypes = {
      none: {
        name: 'Нет штатного маркетолога',
        monthlyCost: 0,
        efficiency: 0.3,
        description: 'Маркетинг ведет руководитель или случайные исполнители'
      },
      part_time: {
        name: 'Маркетолог на неполный день',
        monthlyCost: 1200,
        efficiency: 0.6,
        description: '2-4 часа в день, базовые задачи'
      },
      full_time: {
        name: 'Штатный маркетолог',
        monthlyCost: 2000,
        efficiency: 0.8,
        description: 'Полный рабочий день, широкий спектр задач'
      },
      senior: {
        name: 'Старший маркетолог',
        monthlyCost: 3200,
        efficiency: 0.9,
        description: 'Опытный специалист, стратегическое планирование'
      },
      team: {
        name: 'Команда маркетинга',
        monthlyCost: 5000,
        efficiency: 0.95,
        description: '2-3 специалиста, полное покрытие задач'
      }
    };

    // Обработчики событий
    this.eventHandlers = new Map();
    
    // Кэш для оптимизации
    this.calculationCache = new Map();
    
    // Счетчик расчетов для аналитики
    this.calculationCount = 0;
    
    // Инициализация
    this.init();
  }

  /**
   * Инициализация калькулятора
   * @private
   */
  init() {
    try {
      // Валидация конфигурации отраслей
      const validation = this.utils.validateConfig();
      if (!validation.isValid) {
        console.error('Calculator: Industries configuration is invalid:', validation.errors);
        throw new Error('Invalid industries configuration');
      }

      // Dispatch готовности калькулятора
      this.dispatchEvent('calculatorReady', {
        industriesCount: validation.totalIndustries,
        toolsCount: Object.keys(this.marketingTools).length,
        version: '1.0.0'
      });

      console.log('✅ UniversalSavingsCalculator initialized successfully');
    } catch (error) {
      console.error('Calculator: Initialization failed:', error);
      this.dispatchEvent('calculatorError', { error: error.message });
    }
  }

  /**
   * ГЛАВНЫЙ МЕТОД РАСЧЕТА ЭКОНОМИИ
   * Выполняет полный расчет экономии на основе входных данных
   * 
   * @param {Object} formData - Данные формы калькулятора
   * @returns {Object} Результаты расчета экономии
   */
  calculate(formData) {
    try {
      this.calculationCount++;
      
      // Dispatch начала расчета
      this.dispatchEvent('calculationStarted', {
        formData,
        calculationId: this.calculationCount
      });

      // 1. Валидация входных данных
      const validationResult = this.validateFormData(formData);
      if (!validationResult.isValid) {
        throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
      }

      // 2. Получение конфигурации отрасли
      const industryConfig = this.utils.getIndustry(formData.industry);
      if (!industryConfig) {
        throw new Error(`Industry '${formData.industry}' not found`);
      }

      // 3. Нормализация данных
      const normalizedData = this.normalizeFormData(formData, industryConfig);

      // 4. Расчет текущих расходов клиента
      const currentCosts = this.calculateCurrentCosts(normalizedData, industryConfig);

      // 5. Расчет предложения Steamphony
      const ourOffer = this.calculateOurOffer(normalizedData, industryConfig);

      // 6. Расчет экономии
      const savings = this.calculateSavings(currentCosts, ourOffer);

      // 7. Расчет ROI и прогнозов
      const roiAnalysis = this.calculateROI(normalizedData, industryConfig, savings);

      // 8. Генерация персонализированных инсайтов
      const insights = this.generateInsights(normalizedData, industryConfig, {
        currentCosts,
        ourOffer,
        savings,
        roiAnalysis
      });

      // 9. Генерация рекомендаций
      const recommendations = this.generateRecommendations(normalizedData, industryConfig, {
        currentCosts,
        ourOffer,
        savings,
        roiAnalysis
      });

      // 10. Формирование финального результата
      const calculationResults = {
        meta: {
          calculationId: this.calculationCount,
          timestamp: new Date().toISOString(),
          industry: industryConfig.displayName,
          businessSize: normalizedData.businessSize,
          currency: this.options.currency
        },
        input: normalizedData,
        breakdown: {
          currentCosts,
          ourOffer,
          savings
        },
        analysis: {
          roi: roiAnalysis,
          insights,
          recommendations
        },
        summary: {
          monthlySavings: savings.monthly.total,
          yearlySavings: savings.yearly.total,
          savingsPercentage: savings.percentage,
          roi: roiAnalysis.totalROI,
          paybackPeriod: roiAnalysis.paybackMonths,
          projectedGrowth: roiAnalysis.revenueGrowth.percentage
        }
      };

      // Кэширование результата
      const cacheKey = this.generateCacheKey(formData);
      this.calculationCache.set(cacheKey, calculationResults);

      // Аналитика
      if (this.options.enableAnalytics) {
        this.trackCalculation(calculationResults);
      }

      // Dispatch завершения расчета
      this.dispatchEvent('calculationCompleted', calculationResults);

      return calculationResults;

    } catch (error) {
      console.error('Calculator: Calculation failed:', error);
      
      const errorResult = {
        error: true,
        message: error.message,
        timestamp: new Date().toISOString(),
        calculationId: this.calculationCount
      };

      this.dispatchEvent('calculationError', errorResult);
      return errorResult;
    }
  }

  /**
   * РАСЧЕТ ТЕКУЩИХ РАСХОДОВ КЛИЕНТА
   * Анализирует все компоненты текущих маркетинговых расходов
   * 
   * @param {Object} formData - Нормализованные данные формы
   * @param {Object} industryConfig - Конфигурация отрасли
   * @returns {Object} Детализация текущих расходов
   */
  calculateCurrentCosts(formData, industryConfig) {
    const businessSizeMultiplier = this.getBusinessSizeMultiplier(formData.industry, formData.businessSize);
    const toolsMultiplier = industryConfig.calculations.toolsMultiplier;

    // 1. Зарплата маркетолога
    const marketerCost = this.calculateMarketerCost(formData.marketerType, formData.industry, businessSizeMultiplier);

    // 2. Стоимость инструментов
    const toolsCost = this.calculateToolsCost(formData.currentTools || [], toolsMultiplier, businessSizeMultiplier);

    // 3. Рекламные расходы
    const advertisingBudget = formData.marketingBudget - marketerCost.monthly - toolsCost.monthly;
    const advertisingCost = {
      monthly: Math.max(0, advertisingBudget),
      yearly: Math.max(0, advertisingBudget * 12),
      percentage: Math.round((Math.max(0, advertisingBudget) / formData.marketingBudget) * 100)
    };

    // 4. Прочие расходы (10% от общего бюджета)
    const miscCost = {
      monthly: Math.round(formData.marketingBudget * 0.1),
      yearly: Math.round(formData.marketingBudget * 0.1 * 12),
      percentage: 10,
      description: 'Обучение, конференции, материалы, прочие расходы'
    };

    // Общие текущие расходы
    const totalMonthlyCost = marketerCost.monthly + toolsCost.monthly + advertisingCost.monthly + miscCost.monthly;
    const totalYearlyCost = totalMonthlyCost * 12;

    return {
      marketer: marketerCost,
      tools: toolsCost,
      advertising: advertisingCost,
      misc: miscCost,
      total: {
        monthly: totalMonthlyCost,
        yearly: totalYearlyCost
      },
      breakdown: {
        marketerPercentage: Math.round((marketerCost.monthly / totalMonthlyCost) * 100),
        toolsPercentage: Math.round((toolsCost.monthly / totalMonthlyCost) * 100),
        advertisingPercentage: Math.round((advertisingCost.monthly / totalMonthlyCost) * 100),
        miscPercentage: Math.round((miscCost.monthly / totalMonthlyCost) * 100)
      }
    };
  }

  /**
   * РАСЧЕТ ПРЕДЛОЖЕНИЯ STEAMPHONY
   * Рассчитывает стоимость услуг Steamphony (УТП: $0 за управление)
   * 
   * @param {Object} formData - Нормализованные данные формы
   * @param {Object} industryConfig - Конфигурация отрасли
   * @returns {Object} Структура предложения Steamphony
   */
  calculateOurOffer(formData, industryConfig) {
    const businessSizeMultiplier = this.getBusinessSizeMultiplier(formData.industry, formData.businessSize);
    const toolsMultiplier = industryConfig.calculations.toolsMultiplier;

    // 1. УПРАВЛЕНИЕ = $0 (ключевое УТП!)
    const managementCost = {
      monthly: this.options.managementFee,
      yearly: this.options.managementFee * 12,
      description: 'Полное управление маркетингом включено бесплатно',
      utp: true
    };

    // 2. Инструменты со скидкой 35%
    const recommendedTools = this.getRecommendedTools(formData.industry, formData.businessSize);
    const toolsCostWithDiscount = this.calculateToolsCost(
      recommendedTools, 
      toolsMultiplier, 
      businessSizeMultiplier,
      this.options.steamphonyDiscount
    );

    // 3. Рекламный бюджет остается тем же (но эффективность выше)
    const advertisingBudget = formData.marketingBudget - toolsCostWithDiscount.monthly;
    const advertisingCost = {
      monthly: Math.max(0, advertisingBudget),
      yearly: Math.max(0, advertisingBudget * 12),
      description: 'Профессиональное управление рекламными кампаниями'
    };

    // 4. Дополнительные услуги включены бесплатно
    const includedServices = {
      strategy: { name: 'Маркетинговая стратегия', value: 500 },
      analytics: { name: 'Ежемесячная аналитика', value: 300 },
      optimization: { name: 'Постоянная оптимизация', value: 400 },
      support: { name: 'Техническая поддержка', value: 200 },
      consulting: { name: 'Консультации экспертов', value: 350 }
    };

    const totalIncludedValue = Object.values(includedServices).reduce((sum, service) => sum + service.value, 0);

    // Общая стоимость предложения
    const totalMonthlyCost = managementCost.monthly + toolsCostWithDiscount.monthly + advertisingCost.monthly;
    const totalYearlyCost = totalMonthlyCost * 12;

    return {
      management: managementCost,
      tools: toolsCostWithDiscount,
      advertising: advertisingCost,
      includedServices: {
        services: includedServices,
        totalValue: totalIncludedValue,
        description: 'Включено бесплатно в наше предложение'
      },
      total: {
        monthly: totalMonthlyCost,
        yearly: totalYearlyCost
      },
      savings: {
        toolsDiscount: toolsCostWithDiscount.discount,
        managementFree: 'Управление маркетингом бесплатно',
        includedValue: totalIncludedValue
      }
    };
  }

  /**
   * РАСЧЕТ ЭКОНОМИИ
   * Сравнивает текущие расходы с предложением Steamphony
   * 
   * @param {Object} currentCosts - Текущие расходы клиента
   * @param {Object} ourOffer - Предложение Steamphony
   * @returns {Object} Детализация экономии
   */
  calculateSavings(currentCosts, ourOffer) {
    // Месячная экономия
    const monthlySavings = {
      marketer: currentCosts.marketer.monthly - ourOffer.management.monthly,
      tools: currentCosts.tools.monthly - ourOffer.tools.monthly,
      management: currentCosts.misc.monthly, // Прочие расходы экономим полностью
      total: currentCosts.total.monthly - ourOffer.total.monthly
    };

    // Годовая экономия
    const yearlySavings = {
      marketer: monthlySavings.marketer * 12,
      tools: monthlySavings.tools * 12,
      management: monthlySavings.management * 12,
      total: monthlySavings.total * 12
    };

    // Процент экономии
    const savingsPercentage = Math.round((monthlySavings.total / currentCosts.total.monthly) * 100);

    // Экономия за 3 года (часто используется в B2B)
    const threeYearSavings = yearlySavings.total * 3;

    // Дополнительная ценность от включенных услуг
    const additionalValue = {
      monthly: ourOffer.includedServices.totalValue,
      yearly: ourOffer.includedServices.totalValue * 12,
      description: 'Дополнительная ценность от бесплатных услуг'
    };

    return {
      monthly: monthlySavings,
      yearly: yearlySavings,
      threeYear: threeYearSavings,
      percentage: savingsPercentage,
      additionalValue,
      breakdown: {
        marketerSavings: {
          amount: monthlySavings.marketer,
          description: 'Экономия на зарплате маркетолога'
        },
        toolsSavings: {
          amount: monthlySavings.tools,
          description: 'Экономия на инструментах (скидки)'
        },
        managementSavings: {
          amount: monthlySavings.management,
          description: 'Экономия на прочих расходах'
        }
      }
    };
  }

  /**
   * РАСЧЕТ ROI И ПРОГНОЗОВ РОСТА
   * Анализирует потенциальный рост выручки и ROI от сотрудничества
   * 
   * @param {Object} formData - Нормализованные данные формы
   * @param {Object} industryConfig - Конфигурация отрасли
   * @param {Object} savings - Данные экономии
   * @returns {Object} Анализ ROI и прогнозы
   */
  calculateROI(formData, industryConfig, savings) {
    const calculations = industryConfig.calculations;
    const benchmarks = industryConfig.benchmarks;

    // 1. Текущая выручка
    const currentRevenue = {
      monthly: (formData.newClientsPerMonth || 20) * (formData.averageCheck || calculations.avgRevenuePerCustomer),
      yearly: 0
    };
    currentRevenue.yearly = currentRevenue.monthly * 12;

    // 2. Прогнозируемый рост выручки
    // Факторы роста зависят от отрасли и digitalization level
    const growthFactors = {
      professionalManagement: 1.25, // 25% от профессионального управления
      betterTargeting: 1.15, // 15% от улучшенного таргетинга
      optimization: 1.12, // 12% от постоянной оптимизации
      industryMultiplier: 1 + (calculations.industryGrowthRate || 0.15), // Industry-specific рост
      digitalization: benchmarks.digitalizationLevel < 0.7 ? 1.2 : 1.1 // Дополнительный рост для слабо диджитализированных отраслей
    };

    const totalGrowthMultiplier = Object.values(growthFactors).reduce((acc, factor) => acc * factor, 1);
    const conservativeGrowthMultiplier = Math.min(totalGrowthMultiplier, 1.6); // Максимум 60% роста

    const projectedRevenue = {
      monthly: Math.round(currentRevenue.monthly * conservativeGrowthMultiplier),
      yearly: Math.round(currentRevenue.yearly * conservativeGrowthMultiplier)
    };

    const revenueGrowth = {
      monthly: projectedRevenue.monthly - currentRevenue.monthly,
      yearly: projectedRevenue.yearly - currentRevenue.yearly,
      percentage: Math.round((conservativeGrowthMultiplier - 1) * 100),
      multiplier: conservativeGrowthMultiplier
    };

    // 3. ROI расчеты
    const totalBenefit = revenueGrowth.yearly + savings.yearly.total;
    const totalInvestment = formData.marketingBudget * 12; // Годовой маркетинг бюджет

    const roi = {
      totalROI: Math.round((totalBenefit / totalInvestment) * 100),
      savingsROI: Math.round((savings.yearly.total / totalInvestment) * 100),
      growthROI: Math.round((revenueGrowth.yearly / totalInvestment) * 100),
      description: 'ROI от экономии и роста выручки'
    };

    // 4. Payback period
    const monthlyBenefit = (revenueGrowth.monthly + savings.monthly.total);
    const paybackMonths = monthlyBenefit > 0 ? Math.ceil(totalInvestment / 12 / monthlyBenefit) : 12;

    // 5. Сравнение с industry benchmarks
    const industryComparison = {
      currentROI: Math.round((currentRevenue.yearly / totalInvestment) * 100),
      industryAvgROI: benchmarks.avgROI * 100,
      projectedROI: roi.totalROI,
      improvement: roi.totalROI - (benchmarks.avgROI * 100)
    };

    // 6. Долгосрочные прогнозы (3 года)
    const longTermProjection = {
      year1: projectedRevenue.yearly,
      year2: Math.round(projectedRevenue.yearly * 1.15), // 15% дополнительный рост
      year3: Math.round(projectedRevenue.yearly * 1.32), // Накопительный эффект
      totalGrowth: Math.round(projectedRevenue.yearly * 1.32) - currentRevenue.yearly
    };

    return {
      currentRevenue,
      projectedRevenue,
      revenueGrowth,
      roi,
      paybackMonths,
      industryComparison,
      longTermProjection,
      growthFactors,
      summary: {
        monthlyBenefit,
        yearlyBenefit: totalBenefit,
        totalROI: roi.totalROI,
        paybackPeriod: `${paybackMonths} месяцев`
      }
    };
  }

  /**
   * ГЕНЕРАЦИЯ ПЕРСОНАЛИЗИРОВАННЫХ ИНСАЙТОВ
   * Создает insights специфичные для отрасли и ситуации клиента
   * 
   * @param {Object} formData - Нормализованные данные формы
   * @param {Object} industryConfig - Конфигурация отрасли
   * @param {Object} calculations - Результаты всех расчетов
   * @returns {Object} Персонализированные инсайты
   */
  generateInsights(formData, industryConfig, calculations) {
    const messages = industryConfig.personalizedMessages;
    const benchmarks = industryConfig.benchmarks;
    const { currentCosts, savings, roiAnalysis } = calculations;

    const insights = {
      industry: {
        message: messages.savingsMessage,
        opportunity: messages.opportunityMessage,
        keyGrowthAreas: messages.industryInsight
      },
      budget: this.analyzeBudgetEfficiency(formData, benchmarks, currentCosts),
      competition: this.analyzeCompetitivePosition(formData, industryConfig, roiAnalysis),
      growth: this.analyzeGrowthPotential(formData, industryConfig, roiAnalysis),
      risks: this.analyzeRisks(formData, industryConfig, currentCosts),
      personalized: this.generatePersonalizedMessage(formData, industryConfig, savings)
    };

    return insights;
  }

  /**
   * ГЕНЕРАЦИЯ РЕКОМЕНДАЦИЙ И NEXT STEPS
   * Создает конкретные action items для клиента
   * 
   * @param {Object} formData - Нормализованные данные формы
   * @param {Object} industryConfig - Конфигурация отрасли
   * @param {Object} calculations - Результаты всех расчетов
   * @returns {Object} Рекомендации и план действий
   */
  generateRecommendations(formData, industryConfig, calculations) {
    const messages = industryConfig.personalizedMessages;
    const { currentCosts, savings, roiAnalysis } = calculations;
    
    const recommendations = [];

    // 1. Приоритетные рекомендации на основе экономии
    if (savings.percentage > 30) {
      recommendations.push({
        type: 'cost_optimization',
        priority: 'high',
        title: 'Критическая неэффективность бюджета',
        description: `Вы переплачиваете ${savings.percentage}% от маркетинг-бюджета. Это серьезная проблема, требующая немедленного решения.`,
        action: 'Немедленный аудит и оптимизация расходов',
        expectedBenefit: `Экономия $${savings.monthly.total}/месяц`,
        timeline: '1-2 недели',
        impact: 'Высокое'
      });
    }

    // 2. Рекомендации по инструментам
    recommendations.push({
      type: 'tools',
      priority: 'medium',
      title: 'Оптимизация маркетинговых инструментов',
      description: messages.toolsRecommendation,
      action: 'Внедрить рекомендованный стек инструментов',
      expectedBenefit: `Экономия $${savings.monthly.tools}/месяц на инструментах`,
      timeline: '2-4 недели',
      impact: 'Среднее'
    });

    // 3. Рекомендации по росту
    if (roiAnalysis.revenueGrowth.percentage > 25) {
      recommendations.push({
        type: 'growth',
        priority: 'high',
        title: 'Упущенные возможности роста',
        description: `Ваш потенциал роста ${roiAnalysis.revenueGrowth.percentage}% не реализуется из-за неэффективного маркетинга.`,
        action: 'Профессионализация маркетинговых процессов',
        expectedBenefit: `+$${roiAnalysis.revenueGrowth.monthly}/месяц выручки`,
        timeline: '1-3 месяца',
        impact: 'Очень высокое'
      });
    }

    // 4. Отраслевые рекомендации
    if (messages.commonMistakes) {
      recommendations.push({
        type: 'industry_specific',
        priority: 'medium',
        title: 'Типичные ошибки отрасли',
        description: messages.commonMistakes,
        action: 'Проверить и исправить указанные проблемы',
        expectedBenefit: 'Повышение эффективности на 15-25%',
        timeline: '2-6 недель',
        impact: 'Среднее'
      });
    }

    // 5. Рекомендации по ROI
    if (roiAnalysis.paybackMonths > 6) {
      recommendations.push({
        type: 'roi_optimization',
        priority: 'medium',
        title: 'Длительный payback period',
        description: `Текущий payback period ${roiAnalysis.paybackMonths} месяцев слишком длинный для эффективного маркетинга.`,
        action: 'Оптимизация маркетинговой воронки и конверсий',
        expectedBenefit: `Сокращение payback до 3-4 месяцев`,
        timeline: '1-2 месяца',
        impact: 'Высокое'
      });
    }

    // Next Steps (план действий)
    const nextSteps = [
      {
        step: 1,
        title: 'Бесплатный аудит',
        description: 'Проведем детальный аудит вашего текущего маркетинга',
        duration: '1-2 дня',
        deliverable: 'Отчет с конкретными рекомендациями'
      },
      {
        step: 2,
        title: 'Стратегический план',
        description: 'Разработаем персональную стратегию оптимизации',
        duration: '3-5 дней',
        deliverable: 'Пошаговый план внедрения'
      },
      {
        step: 3,
        title: 'Пилотный проект',
        description: 'Запустим пилот на 1 месяц для проверки эффективности',
        duration: '1 месяц',
        deliverable: 'Результаты и корректировки'
      },
      {
        step: 4,
        title: 'Полное внедрение',
        description: 'Перейдем к полному управлению вашим маркетингом',
        duration: 'Ongoing',
        deliverable: 'Постоянный рост и оптимизация'
      }
    ];

    return {
      summary: {
        totalRecommendations: recommendations.length,
        highPriority: recommendations.filter(r => r.priority === 'high').length,
        expectedTotalBenefit: savings.monthly.total + roiAnalysis.revenueGrowth.monthly
      },
      recommendations: recommendations.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }),
      nextSteps,
      timeline: {
        immediate: recommendations.filter(r => r.timeline.includes('недел')),
        shortTerm: recommendations.filter(r => r.timeline.includes('месяц')),
        longTerm: recommendations.filter(r => r.timeline.includes('месяцев'))
      }
    };
  }

  // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

  /**
   * Валидация входных данных формы
   * @param {Object} formData - Данные формы
   * @returns {Object} Результат валидации
   */
  validateFormData(formData) {
    const errors = [];
    const warnings = [];

    // Обязательные поля
    const requiredFields = {
      industry: 'Отрасль бизнеса',
      businessSize: 'Размер бизнеса',
      marketingBudget: 'Маркетинговый бюджет'
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        errors.push(`${name} обязателен для заполнения`);
      }
    }

    // Проверка существования отрасли
    if (formData.industry && !this.utils.industryExists(formData.industry)) {
      errors.push(`Отрасль '${formData.industry}' не поддерживается`);
    }

    // Проверка размера бизнеса
    if (formData.industry && formData.businessSize) {
      const sizes = this.utils.getBusinessSizes(formData.industry);
      const sizeExists = sizes.some(size => size.value === formData.businessSize);
      if (!sizeExists) {
        errors.push(`Размер бизнеса '${formData.businessSize}' не доступен для отрасли '${formData.industry}'`);
      }
    }

    // Проверка бюджета
    if (formData.marketingBudget !== undefined) {
      if (typeof formData.marketingBudget === 'number') {
        if (formData.marketingBudget < 0) {
          errors.push('Маркетинговый бюджет не может быть отрицательным');
        }
        if (formData.marketingBudget < 500) {
          warnings.push('Слишком низкий маркетинговый бюджет для эффективных расчетов');
        }
        if (formData.marketingBudget > 100000) {
          warnings.push('Очень высокий бюджет, рекомендуем индивидуальную консультацию');
        }
      }
    }

    // Проверка типа маркетолога
    if (formData.marketerType && !this.marketerTypes[formData.marketerType]) {
      errors.push(`Тип маркетолога '${formData.marketerType}' не поддерживается`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fieldCount: Object.keys(formData).length
    };
  }

  /**
   * Нормализация данных формы
   * @param {Object} formData - Исходные данные формы
   * @param {Object} industryConfig - Конфигурация отрасли
   * @returns {Object} Нормализованные данные
   */
  normalizeFormData(formData, industryConfig) {
    const normalized = { ...formData };

    // Нормализация бюджета из строки диапазона в число
    if (typeof normalized.marketingBudget === 'string') {
      const budgetRange = this.utils.getBudgetRange(
        normalized.industry, 
        normalized.businessSize, 
        normalized.marketingBudget
      );
      normalized.marketingBudget = budgetRange ? budgetRange.value : 1000;
    }

    // Значения по умолчанию
    normalized.marketerType = normalized.marketerType || 'none';
    normalized.currentTools = normalized.currentTools || [];
    normalized.newClientsPerMonth = normalized.newClientsPerMonth || 20;
    normalized.averageCheck = normalized.averageCheck || industryConfig.calculations.avgRevenuePerCustomer;

    return normalized;
  }

  /**
   * Получение мультипликатора размера бизнеса
   * @param {string} industry - Отрасль
   * @param {string} businessSize - Размер бизнеса
   * @returns {number} Мультипликатор
   */
  getBusinessSizeMultiplier(industry, businessSize) {
    const sizeConfig = this.utils.getBusinessSize(industry, businessSize);
    return sizeConfig ? sizeConfig.multiplier : 1.0;
  }

  /**
   * Расчет стоимости маркетолога
   * @param {string} marketerType - Тип маркетолога
   * @param {string} industry - Отрасль
   * @param {number} sizeMultiplier - Мультипликатор размера
   * @returns {Object} Стоимость маркетолога
   */
  calculateMarketerCost(marketerType, industry, sizeMultiplier) {
    const baseType = this.marketerTypes[marketerType];
    if (!baseType) {
      return { monthly: 0, yearly: 0, efficiency: 0, description: 'Не указан' };
    }

    // Получаем industry-specific зарплату маркетолога
    const industryMarketerCost = this.utils.getMarketerCost(industry, marketerType) || baseType.monthlyCost;
    const adjustedCost = Math.round(industryMarketerCost * sizeMultiplier);

    return {
      type: marketerType,
      name: baseType.name,
      monthly: adjustedCost,
      yearly: adjustedCost * 12,
      efficiency: baseType.efficiency,
      description: baseType.description,
      industryAdjusted: industryMarketerCost !== baseType.monthlyCost
    };
  }

  /**
   * Расчет стоимости инструментов
   * @param {Array} tools - Список инструментов
   * @param {number} industryMultiplier - Мультипликатор отрасли
   * @param {number} sizeMultiplier - Мультипликатор размера
   * @param {number} discount - Скидка (для предложения Steamphony)
   * @returns {Object} Стоимость инструментов
   */
  calculateToolsCost(tools, industryMultiplier, sizeMultiplier, discount = 0) {
    let totalCost = 0;
    const toolsBreakdown = [];

    for (const toolKey of tools) {
      const tool = this.marketingTools[toolKey];
      if (!tool) continue;

      const adjustedPrice = Math.round(tool.basePrice * industryMultiplier * sizeMultiplier);
      const discountedPrice = Math.round(adjustedPrice * (1 - discount));
      const savings = adjustedPrice - discountedPrice;

      toolsBreakdown.push({
        key: toolKey,
        name: tool.name,
        category: tool.category,
        originalPrice: adjustedPrice,
        discountedPrice,
        savings,
        necessity: tool.necessity
      });

      totalCost += discountedPrice;
    }

    const originalTotal = toolsBreakdown.reduce((sum, tool) => sum + tool.originalPrice, 0);
    const totalSavings = originalTotal - totalCost;

    return {
      monthly: totalCost,
      yearly: totalCost * 12,
      tools: toolsBreakdown,
      discount: {
        percentage: Math.round(discount * 100),
        amount: totalSavings,
        description: discount > 0 ? `Скидка ${Math.round(discount * 100)}% на все инструменты` : null
      },
      originalCost: {
        monthly: originalTotal,
        yearly: originalTotal * 12
      }
    };
  }

  /**
   * Получение рекомендуемых инструментов для отрасли
   * @param {string} industry - Отрасль
   * @param {string} businessSize - Размер бизнеса
   * @returns {Array} Список рекомендуемых инструментов
   */
  getRecommendedTools(industry, businessSize) {
    const industryConfig = this.utils.getIndustry(industry);
    const sizeConfig = this.utils.getBusinessSize(industry, businessSize);
    
    // Базовые инструменты для всех
    let recommendedTools = ['crm_system', 'analytics', 'facebook_ads'];

    // Добавляем инструменты в зависимости от отрасли
    switch (industry) {
      case 'restaurant':
        recommendedTools.push('social_media_management', 'reputation_management', 'loyalty_program');
        break;
      case 'beauty':
        recommendedTools.push('social_media_management', 'reputation_management', 'loyalty_program');
        break;
      case 'retail':
        recommendedTools.push('email_marketing', 'retargeting', 'marketplace_tools');
        break;
      case 'services':
        recommendedTools.push('reputation_management', 'content_creation', 'call_tracking');
        break;
      case 'b2b':
        recommendedTools.push('content_creation', 'marketing_automation', 'competitor_analysis');
        break;
      case 'realestate':
        recommendedTools.push('landing_builder', 'call_tracking', 'retargeting');
        break;
      case 'finance':
        recommendedTools.push('content_creation', 'marketing_automation', 'reputation_management');
        break;
      default:
        recommendedTools.push('email_marketing', 'social_media_management');
    }

    // Добавляем инструменты в зависимости от размера бизнеса
    if (sizeConfig && sizeConfig.multiplier > 1.5) {
      recommendedTools.push('marketing_automation', 'ab_testing', 'competitor_analysis');
    }

    // Удаляем дубликаты
    return [...new Set(recommendedTools)];
  }

  /**
   * Анализ эффективности бюджета
   * @param {Object} formData - Данные формы
   * @param {Object} benchmarks - Бенчмарки отрасли
   * @param {Object} currentCosts - Текущие расходы
   * @returns {Object} Анализ бюджета
   */
  analyzeBudgetEfficiency(formData, benchmarks, currentCosts) {
    const budgetVsBenchmark = formData.marketingBudget / benchmarks.avgMarketingSpend;
    
    let efficiency = 'normal';
    let message = '';

    if (budgetVsBenchmark < 0.7) {
      efficiency = 'low';
      message = `Ваш бюджет на ${Math.round((1 - budgetVsBenchmark) * 100)}% ниже среднего по отрасли. Это ограничивает возможности роста.`;
    } else if (budgetVsBenchmark > 1.5) {
      efficiency = 'overspending';
      message = `Ваш бюджет на ${Math.round((budgetVsBenchmark - 1) * 100)}% выше среднего по отрасли. Возможна неэффективность расходов.`;
    } else {
      efficiency = 'optimal';
      message = 'Размер бюджета соответствует среднему по отрасли.';
    }

    return {
      efficiency,
      message,
      benchmarkComparison: budgetVsBenchmark,
      distribution: {
        marketer: currentCosts.breakdown.marketerPercentage,
        tools: currentCosts.breakdown.toolsPercentage,
        advertising: currentCosts.breakdown.advertisingPercentage,
        misc: currentCosts.breakdown.miscPercentage
      }
    };
  }

  /**
   * Анализ конкурентной позиции
   * @param {Object} formData - Данные формы
   * @param {Object} industryConfig - Конфигурация отрасли
   * @param {Object} roiAnalysis - Анализ ROI
   * @returns {Object} Анализ конкурентной позиции
   */
  analyzeCompetitivePosition(formData, industryConfig, roiAnalysis) {
    const competitiveIndex = industryConfig.calculations.competitiveIndex;
    const digitalizationLevel = industryConfig.benchmarks.digitalizationLevel;

    let position = 'average';
    let message = '';

    if (roiAnalysis.industryComparison.currentROI < roiAnalysis.industryComparison.industryAvgROI * 0.8) {
      position = 'behind';
      message = 'Вы отстаете от конкурентов по эффективности маркетинга.';
    } else if (roiAnalysis.industryComparison.currentROI > roiAnalysis.industryComparison.industryAvgROI * 1.2) {
      position = 'ahead';
      message = 'Ваша эффективность выше среднего по отрасли.';
    } else {
      position = 'average';
      message = 'Ваши показатели соответствуют среднему по отрасли.';
    }

    return {
      position,
      message,
      competitiveIndex,
      digitalizationLevel,
      opportunities: digitalizationLevel < 0.7 ? 
        'Отрасль слабо диджитализирована - большие возможности для роста' :
        'Высокая конкуренция - нужна точная стратегия'
    };
  }

  /**
   * Анализ потенциала роста
   * @param {Object} formData - Данные формы
   * @param {Object} industryConfig - Конфигурация отрасли
   * @param {Object} roiAnalysis - Анализ ROI
   * @returns {Object} Анализ потенциала роста
   */
  analyzeGrowthPotential(formData, industryConfig, roiAnalysis) {
    const growthRate = industryConfig.calculations.industryGrowthRate;
    const seasonalityFactor = industryConfig.calculations.seasonalityFactor;

    let potential = 'medium';
    let message = '';

    if (roiAnalysis.revenueGrowth.percentage > 40) {
      potential = 'high';
      message = `Очень высокий потенциал роста ${roiAnalysis.revenueGrowth.percentage}%. Упускаете значительные возможности.`;
    } else if (roiAnalysis.revenueGrowth.percentage > 25) {
      potential = 'medium';
      message = `Хороший потенциал роста ${roiAnalysis.revenueGrowth.percentage}%. Есть возможности для улучшения.`;
    } else {
      potential = 'low';
      message = `Ограниченный потенциал роста ${roiAnalysis.revenueGrowth.percentage}%. Фокус на оптимизации.`;
    }

    return {
      potential,
      message,
      growthRate,
      seasonalityFactor,
      projectedGrowth: roiAnalysis.revenueGrowth.percentage,
      timeframe: roiAnalysis.paybackMonths < 6 ? 'Быстрый результат' : 'Долгосрочный рост'
    };
  }

  /**
   * Анализ рисков
   * @param {Object} formData - Данные формы
   * @param {Object} industryConfig - Конфигурация отрасли
   * @param {Object} currentCosts - Текущие расходы
   * @returns {Object} Анализ рисков
   */
  analyzeRisks(formData, industryConfig, currentCosts) {
    const risks = [];

    // Риск зависимости от одного маркетолога
    if (formData.marketerType === 'full_time' || formData.marketerType === 'senior') {
      risks.push({
        type: 'dependency',
        level: 'medium',
        description: 'Высокая зависимость от одного специалиста',
        mitigation: 'Документирование процессов и backup планы'
      });
    }

    // Риск неэффективного распределения бюджета
    if (currentCosts.breakdown.advertisingPercentage < 50) {
      risks.push({
        type: 'budget_distribution',
        level: 'high',
        description: 'Слишком много средств тратится на зарплаты и инструменты вместо рекламы',
        mitigation: 'Оптимизация структуры расходов'
      });
    }

    // Риск отставания от конкурентов
    const digitalizationLevel = industryConfig.benchmarks.digitalizationLevel;
    if (digitalizationLevel > 0.8 && (!formData.currentTools || formData.currentTools.length < 3)) {
      risks.push({
        type: 'digitalization',
        level: 'high',
        description: 'Отставание в диджитализации в высококонкурентной отрасли',
        mitigation: 'Срочное внедрение современных инструментов'
      });
    }

    return {
      totalRisks: risks.length,
      highRisk: risks.filter(r => r.level === 'high').length,
      mediumRisk: risks.filter(r => r.level === 'medium').length,
      risks,
      overallRiskLevel: risks.some(r => r.level === 'high') ? 'high' : 
                       risks.some(r => r.level === 'medium') ? 'medium' : 'low'
    };
  }

  /**
   * Генерация персонализированного сообщения
   * @param {Object} formData - Данные формы
   * @param {Object} industryConfig - Конфигурация отрасли
   * @param {Object} savings - Данные экономии
   * @returns {Object} Персонализированное сообщение
   */
  generatePersonalizedMessage(formData, industryConfig, savings) {
    const businessSizeLabels = {
      micro: 'микро-бизнеса',
      small: 'малого бизнеса',
      medium: 'среднего бизнеса', 
      large: 'крупного бизнеса',
      enterprise: 'корпоративного уровня'
    };

    const sizeLabel = businessSizeLabels[formData.businessSize] || 'вашего бизнеса';

    return {
      greeting: `Для ${industryConfig.displayName.toLowerCase()} ${sizeLabel}`,
      mainMessage: `Мы можем сэкономить $${savings.monthly.total} в месяц ($${savings.yearly.total} в год) от вашего маркетинг-бюджета без потери качества.`,
      keyBenefit: savings.percentage > 25 ? 
        `Это ${savings.percentage}% экономия - значительная оптимизация для вашей отрасли.` :
        `Экономия ${savings.percentage}% позволит реинвестировать средства в рост.`,
      cta: 'Начнем с бесплатного аудита вашего текущего маркетинга?'
    };
  }

  /**
   * Быстрый расчет (упрощенная версия)
   * @param {string} industry - Отрасль
   * @param {string} businessSize - Размер бизнеса
   * @param {number} budget - Бюджет
   * @returns {Object} Упрощенные результаты
   */
  quickCalculate(industry, businessSize, budget) {
    const formData = {
      industry,
      businessSize,
      marketingBudget: budget,
      marketerType: 'full_time'
    };

    const result = this.calculate(formData);
    
    return {
      monthlySavings: result.summary?.monthlySavings || 0,
      yearlySavings: result.summary?.yearlySavings || 0,
      savingsPercentage: result.summary?.savingsPercentage || 0,
      roi: result.summary?.roi || 0
    };
  }

  /**
   * Получение доступных инструментов для отрасли
   * @param {string} industry - Отрасль
   * @returns {Array} Список доступных инструментов
   */
  getAvailableTools(industry) {
    const recommendedTools = this.getRecommendedTools(industry, 'medium');
    
    return Object.entries(this.marketingTools)
      .map(([key, tool]) => ({
        key,
        ...tool,
        recommended: recommendedTools.includes(key)
      }))
      .sort((a, b) => {
        // Сначала рекомендуемые, потом по важности
        if (a.recommended && !b.recommended) return -1;
        if (!a.recommended && b.recommended) return 1;
        
        const necessityOrder = { high: 3, medium: 2, low: 1 };
        return necessityOrder[b.necessity] - necessityOrder[a.necessity];
      });
  }

  /**
   * Генерация ключа для кэширования
   * @param {Object} formData - Данные формы
   * @returns {string} Ключ кэша
   */
  generateCacheKey(formData) {
    const keyData = {
      industry: formData.industry,
      businessSize: formData.businessSize,
      marketingBudget: formData.marketingBudget,
      marketerType: formData.marketerType
    };
    
    return JSON.stringify(keyData);
  }

  /**
   * Трекинг расчета для аналитики
   * @param {Object} results - Результаты расчета
   * @private
   */
  trackCalculation(results) {
    // Placeholder для аналитики
    if (typeof gtag !== 'undefined') {
      gtag('event', 'calculation_completed', {
        event_category: 'Calculator',
        event_label: results.meta.industry,
        value: results.summary.monthlySavings,
        custom_parameter_1: results.meta.businessSize,
        custom_parameter_2: results.summary.savingsPercentage
      });
    }
  }

  /**
   * Подписка на события
   * @param {string} eventName - Название события
   * @param {Function} handler - Обработчик события
   */
  addEventListener(eventName, handler) {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }
    this.eventHandlers.get(eventName).push(handler);
  }

  /**
   * Отписка от событий
   * @param {string} eventName - Название события
   * @param {Function} handler - Обработчик события
   */
  removeEventListener(eventName, handler) {
    if (this.eventHandlers.has(eventName)) {
      const handlers = this.eventHandlers.get(eventName);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Отправка события
   * @param {string} eventName - Название события
   * @param {Object} detail - Данные события
   * @private
   */
  dispatchEvent(eventName, detail = {}) {
    if (this.eventHandlers.has(eventName)) {
      this.eventHandlers.get(eventName).forEach(handler => {
        try {
          handler(detail);
        } catch (error) {
          console.error(`Error in event handler for ${eventName}:`, error);
        }
      });
    }
  }

  /**
   * Очистка кэша
   */
  clearCache() {
    this.calculationCache.clear();
  }

  /**
   * Получение статистики калькулятора
   * @returns {Object} Статистика
   */
  getStats() {
    return {
      calculationsPerformed: this.calculationCount,
      cacheSize: this.calculationCache.size,
      availableIndustries: Object.keys(this.industries).length,
      availableTools: Object.keys(this.marketingTools).length
    };
  }

  /**
   * Уничтожение калькулятора
   */
  destroy() {
    this.clearCache();
    this.eventHandlers.clear();
    this.dispatchEvent('calculatorDestroyed', {
      finalStats: this.getStats()
    });
  }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UniversalSavingsCalculator;
}

// Глобальная доступность
if (typeof window !== 'undefined') {
  window.UniversalSavingsCalculator = UniversalSavingsCalculator;
}

export default UniversalSavingsCalculator; 