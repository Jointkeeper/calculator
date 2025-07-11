/**
 * IndustryUtils - Utility класс для работы с конфигурацией отраслей
 * Предоставляет методы для получения, валидации и расчетов данных отраслей
 * 
 * @class IndustryUtils
 * @author Steamphony Digital Agency
 */

import { 
  INDUSTRY_CONFIG, 
  POPULAR_INDUSTRIES, 
  ALL_INDUSTRIES, 
  CALCULATION_CONSTANTS,
  getIndustryConfig,
  getAllIndustries,
  getPopularIndustries,
  validateIndustryConfig 
} from '../data/industries.js';

export class IndustryUtils {
  /**
   * Получить конфигурацию отрасли по ключу
   * @param {string} industryKey - Ключ отрасли
   * @returns {Object|null} Конфигурация отрасли или null
   */
  static getIndustry(industryKey) {
    if (!industryKey || typeof industryKey !== 'string') {
      console.warn('IndustryUtils.getIndustry: Invalid industryKey provided');
      return null;
    }
    
    return getIndustryConfig(industryKey);
  }

  /**
   * Получить все отрасли
   * @returns {Object} Все конфигурации отраслей
   */
  static getAllIndustries() {
    return getAllIndustries();
  }

  /**
   * Получить популярные отрасли
   * @returns {Array} Массив популярных отраслей
   */
  static getPopularIndustries() {
    return getPopularIndustries();
  }

  /**
   * Получить непопулярные отрасли
   * @returns {Array} Массив непопулярных отраслей
   */
  static getNonPopularIndustries() {
    return ALL_INDUSTRIES
      .filter(key => !POPULAR_INDUSTRIES.includes(key))
      .map(key => INDUSTRY_CONFIG[key])
      .filter(Boolean);
  }

  /**
   * Получить отрасли по поисковому запросу
   * @param {string} query - Поисковый запрос
   * @returns {Array} Массив найденных отраслей
   */
  static searchIndustries(query) {
    if (!query || typeof query !== 'string') {
      return Object.values(INDUSTRY_CONFIG);
    }

    const searchTerm = query.toLowerCase().trim();
    
    return Object.values(INDUSTRY_CONFIG).filter(industry => {
      const searchableText = [
        industry.displayName,
        industry.description,
        industry.examples,
        ...(industry.searchTerms || [])
      ].join(' ').toLowerCase();
      
      return searchableText.includes(searchTerm);
    });
  }

  /**
   * Получить размеры бизнеса для отрасли
   * @param {string} industryKey - Ключ отрасли
   * @returns {Array} Массив размеров бизнеса
   */
  static getBusinessSizes(industryKey) {
    const industry = this.getIndustry(industryKey);
    return industry?.sizeOptions || [];
  }

  /**
   * Получить конкретный размер бизнеса
   * @param {string} industryKey - Ключ отрасли
   * @param {string} sizeValue - Значение размера
   * @returns {Object|null} Конфигурация размера или null
   */
  static getBusinessSize(industryKey, sizeValue) {
    const sizes = this.getBusinessSizes(industryKey);
    return sizes.find(size => size.value === sizeValue) || null;
  }

  /**
   * Получить диапазоны бюджета для отрасли и размера бизнеса
   * @param {string} industryKey - Ключ отрасли
   * @param {string} businessSize - Размер бизнеса
   * @returns {Array} Массив диапазонов бюджета
   */
  static getBudgetRanges(industryKey, businessSize) {
    const industry = this.getIndustry(industryKey);
    
    if (!industry?.marketingBudgetRanges) {
      return [];
    }
    
    return industry.marketingBudgetRanges[businessSize] || [];
  }

  /**
   * Получить конкретный бюджетный диапазон
   * @param {string} industryKey - Ключ отрасли
   * @param {string} businessSize - Размер бизнеса
   * @param {string} budgetRange - Диапазон бюджета
   * @returns {Object|null} Конфигурация диапазона или null
   */
  static getBudgetRange(industryKey, businessSize, budgetRange) {
    const ranges = this.getBudgetRanges(industryKey, businessSize);
    return ranges.find(range => range.range === budgetRange) || null;
  }

  /**
   * Получить конфигурацию расчетов для отрасли
   * @param {string} industryKey - Ключ отрасли
   * @returns {Object|null} Конфигурация расчетов или null
   */
  static getCalculationConfig(industryKey) {
    const industry = this.getIndustry(industryKey);
    return industry?.calculations || null;
  }

  /**
   * Получить персонализированные сообщения для отрасли
   * @param {string} industryKey - Ключ отрасли
   * @returns {Object|null} Персонализированные сообщения или null
   */
  static getPersonalizedMessages(industryKey) {
    const industry = this.getIndustry(industryKey);
    return industry?.personalizedMessages || null;
  }

  /**
   * Получить benchmarks для отрасли
   * @param {string} industryKey - Ключ отрасли
   * @returns {Object|null} Benchmarks или null
   */
  static getBenchmarks(industryKey) {
    const industry = this.getIndustry(industryKey);
    return industry?.benchmarks || null;
  }

  /**
   * Валидация целостности конфигурации
   * @returns {Object} Результат валидации
   */
  static validateConfig() {
    return validateIndustryConfig();
  }

  /**
   * Проверка существования отрасли
   * @param {string} industryKey - Ключ отрасли
   * @returns {boolean} Существует ли отрасль
   */
  static industryExists(industryKey) {
    return ALL_INDUSTRIES.includes(industryKey);
  }

  /**
   * Проверка является ли отрасль популярной
   * @param {string} industryKey - Ключ отрасли
   * @returns {boolean} Является ли популярной
   */
  static isPopularIndustry(industryKey) {
    return POPULAR_INDUSTRIES.includes(industryKey);
  }

  /**
   * Проверка поддерживает ли отрасль кастомный ввод
   * @param {string} industryKey - Ключ отрасли
   * @returns {boolean} Поддерживает ли кастомный ввод
   */
  static hasCustomInput(industryKey) {
    const industry = this.getIndustry(industryKey);
    return Boolean(industry?.customInput);
  }

  /**
   * Получить статистику по отраслям
   * @returns {Object} Статистика отраслей
   */
  static getIndustryStats() {
    const allIndustries = Object.values(INDUSTRY_CONFIG);
    
    return {
      total: allIndustries.length,
      popular: POPULAR_INDUSTRIES.length,
      nonPopular: allIndustries.length - POPULAR_INDUSTRIES.length,
      withCustomInput: allIndustries.filter(industry => industry.customInput).length,
      avgSizeOptions: Math.round(
        allIndustries.reduce((acc, industry) => acc + (industry.sizeOptions?.length || 0), 0) / allIndustries.length
      ),
      avgBudgetRanges: Math.round(
        allIndustries.reduce((acc, industry) => {
          const ranges = industry.marketingBudgetRanges || {};
          const totalRanges = Object.values(ranges).reduce((sum, rangeArray) => sum + rangeArray.length, 0);
          return acc + totalRanges;
        }, 0) / allIndustries.length
      )
    };
  }

  /**
   * Получить рекомендуемый размер бизнеса на основе параметров
   * @param {string} industryKey - Ключ отрасли
   * @param {number} employeeCount - Количество сотрудников
   * @param {number} revenue - Годовая выручка
   * @returns {Object|null} Рекомендуемый размер бизнеса
   */
  static getRecommendedBusinessSize(industryKey, employeeCount, revenue) {
    const sizes = this.getBusinessSizes(industryKey);
    
    if (!sizes.length) return null;
    
    // Поиск по количеству сотрудников
    let recommendedSize = null;
    
    for (const size of sizes) {
      const employees = size.employeesCount;
      
      // Парсинг диапазонов сотрудников
      if (employees.includes('-')) {
        const [min, max] = employees.split('-').map(s => parseInt(s.replace(/\D/g, '')));
        if (employeeCount >= min && employeeCount <= max) {
          recommendedSize = size;
          break;
        }
      } else if (employees.includes('+')) {
        const min = parseInt(employees.replace(/\D/g, ''));
        if (employeeCount >= min) {
          recommendedSize = size;
        }
      } else if (employees === '1') {
        if (employeeCount === 1) {
          recommendedSize = size;
          break;
        }
      }
    }
    
    // Если не найден по сотрудникам, ищем по выручке
    if (!recommendedSize && revenue) {
      recommendedSize = sizes.reduce((closest, current) => {
        const currentDiff = Math.abs(current.avgRevenue - revenue);
        const closestDiff = Math.abs(closest.avgRevenue - revenue);
        return currentDiff < closestDiff ? current : closest;
      });
    }
    
    return recommendedSize || sizes[0];
  }

  /**
   * Получить рекомендуемый бюджетный диапазон
   * @param {string} industryKey - Ключ отрасли
   * @param {string} businessSize - Размер бизнеса
   * @param {number} currentBudget - Текущий бюджет
   * @returns {Object|null} Рекомендуемый диапазон
   */
  static getRecommendedBudgetRange(industryKey, businessSize, currentBudget) {
    const ranges = this.getBudgetRanges(industryKey, businessSize);
    
    if (!ranges.length) return null;
    
    // Поиск диапазона, в который попадает текущий бюджет
    for (const range of ranges) {
      const [min, max] = range.range.split('-').map(s => {
        const num = parseInt(s.replace(/\D/g, ''));
        return s.includes('+') ? Infinity : num;
      });
      
      if (currentBudget >= min && currentBudget <= max) {
        return range;
      }
    }
    
    // Если не найден точный диапазон, возвращаем ближайший
    return ranges.reduce((closest, current) => {
      const currentDiff = Math.abs(current.value - currentBudget);
      const closestDiff = Math.abs(closest.value - currentBudget);
      return currentDiff < closestDiff ? current : closest;
    });
  }

  /**
   * Расчет стоимости маркетолога для отрасли
   * @param {string} industryKey - Ключ отрасли
   * @param {string} marketerType - Тип маркетолога
   * @returns {number} Стоимость маркетолога
   */
  static getMarketerCost(industryKey, marketerType) {
    const calculations = this.getCalculationConfig(industryKey);
    
    if (!calculations?.marketerSalary) return 0;
    
    return calculations.marketerSalary[marketerType] || 0;
  }

  /**
   * Расчет стоимости инструментов для отрасли
   * @param {string} industryKey - Ключ отрасли
   * @param {number} baseCost - Базовая стоимость
   * @returns {number} Стоимость инструментов
   */
  static getToolsCost(industryKey, baseCost = 100) {
    const calculations = this.getCalculationConfig(industryKey);
    
    if (!calculations?.toolsMultiplier) return baseCost;
    
    return Math.round(baseCost * calculations.toolsMultiplier);
  }

  /**
   * Расчет потенциальной экономии
   * @param {string} industryKey - Ключ отрасли
   * @param {string} businessSize - Размер бизнеса
   * @param {number} currentBudget - Текущий бюджет
   * @returns {Object} Данные экономии
   */
  static calculatePotentialSavings(industryKey, businessSize, currentBudget) {
    const industry = this.getIndustry(industryKey);
    const sizeConfig = this.getBusinessSize(industryKey, businessSize);
    const budgetRange = this.getRecommendedBudgetRange(industryKey, businessSize, currentBudget);
    
    if (!industry || !sizeConfig || !budgetRange) {
      return {
        totalSavings: 0,
        percentageSavings: 0,
        monthlyMarketerCost: 0,
        monthlyToolsCost: 0,
        optimizedBudget: currentBudget,
        error: 'Insufficient data for calculation'
      };
    }
    
    const calculations = industry.calculations;
    const benchmarks = industry.benchmarks;
    
    // Расчет стоимости маркетолога
    const marketerCost = this.getMarketerCost(industryKey, 'fullTime');
    
    // Расчет стоимости инструментов
    const toolsCost = this.getToolsCost(industryKey);
    
    // Расчет оптимизированного бюджета
    const optimizedBudget = Math.round(currentBudget * budgetRange.effectiveness);
    
    // Расчет экономии
    const totalSavings = currentBudget - optimizedBudget;
    const percentageSavings = Math.round((totalSavings / currentBudget) * 100);
    
    // Расчет ROI
    const projectedRevenue = optimizedBudget * (calculations.avgRevenuePerCustomer / 100);
    const roi = Math.round((projectedRevenue / optimizedBudget) * 10) / 10;
    
    return {
      totalSavings: Math.max(0, totalSavings),
      percentageSavings: Math.max(0, percentageSavings),
      monthlyMarketerCost: marketerCost,
      monthlyToolsCost: toolsCost,
      optimizedBudget,
      currentBudget,
      projectedRevenue: Math.round(projectedRevenue),
      roi,
      industryBenchmarks: {
        avgMarketingSpend: benchmarks.avgMarketingSpend,
        avgROI: benchmarks.avgROI,
        customerAcquisitionCost: benchmarks.customerAcquisitionCost
      }
    };
  }

  /**
   * Генерация персонализированных рекомендаций
   * @param {string} industryKey - Ключ отрасли
   * @param {string} businessSize - Размер бизнеса
   * @param {number} currentBudget - Текущий бюджет
   * @returns {Object} Персонализированные рекомендации
   */
  static generateRecommendations(industryKey, businessSize, currentBudget) {
    const industry = this.getIndustry(industryKey);
    const messages = this.getPersonalizedMessages(industryKey);
    const benchmarks = this.getBenchmarks(industryKey);
    const savings = this.calculatePotentialSavings(industryKey, businessSize, currentBudget);
    
    if (!industry || !messages) {
      return {
        title: 'Рекомендации недоступны',
        message: 'Не удалось загрузить данные для вашей отрасли',
        recommendations: []
      };
    }
    
    const recommendations = [];
    
    // Анализ бюджета относительно benchmarks
    if (currentBudget > benchmarks.avgMarketingSpend * 1.5) {
      recommendations.push({
        type: 'budget',
        priority: 'high',
        title: 'Оптимизация бюджета',
        description: `Ваш бюджет значительно превышает средний по отрасли ($${benchmarks.avgMarketingSpend}). Рекомендуем оптимизировать расходы.`,
        action: 'Провести аудит маркетинговых активностей'
      });
    }
    
    // Рекомендации по инструментам
    recommendations.push({
      type: 'tools',
      priority: 'medium',
      title: 'Рекомендуемые инструменты',
      description: messages.toolsRecommendation,
      action: 'Внедрить рекомендованные инструменты'
    });
    
    // Типичные ошибки отрасли
    if (messages.commonMistakes) {
      recommendations.push({
        type: 'mistakes',
        priority: 'medium',
        title: 'Избегайте типичных ошибок',
        description: messages.commonMistakes,
        action: 'Проверить и исправить указанные проблемы'
      });
    }
    
    // Возможности роста
    recommendations.push({
      type: 'growth',
      priority: 'high',
      title: 'Возможности роста',
      description: messages.industryInsight,
      action: 'Сфокусироваться на ключевых точках роста'
    });
    
    return {
      title: `Рекомендации для ${industry.displayName}`,
      message: messages.opportunityMessage,
      savingsMessage: messages.savingsMessage,
      potentialSavings: savings,
      recommendations
    };
  }

  /**
   * Экспорт данных отрасли в JSON
   * @param {string} industryKey - Ключ отрасли
   * @returns {string} JSON строка с данными отрасли
   */
  static exportIndustryData(industryKey) {
    const industry = this.getIndustry(industryKey);
    
    if (!industry) {
      throw new Error(`Industry '${industryKey}' not found`);
    }
    
    return JSON.stringify(industry, null, 2);
  }

  /**
   * Получить краткую информацию об отрасли
   * @param {string} industryKey - Ключ отрасли
   * @returns {Object|null} Краткая информация
   */
  static getIndustrySummary(industryKey) {
    const industry = this.getIndustry(industryKey);
    
    if (!industry) return null;
    
    return {
      key: industry.key,
      displayName: industry.displayName,
      icon: industry.icon,
      description: industry.description,
      popular: industry.popular || false,
      customInput: industry.customInput || false,
      sizeOptionsCount: industry.sizeOptions?.length || 0,
      avgMarketingSpend: industry.benchmarks?.avgMarketingSpend || 0,
      avgROI: industry.benchmarks?.avgROI || 0,
      competitiveIndex: industry.calculations?.competitiveIndex || 0
    };
  }

  /**
   * Получить сравнительные данные отраслей
   * @param {Array} industryKeys - Массив ключей отраслей для сравнения
   * @returns {Object} Сравнительные данные
   */
  static compareIndustries(industryKeys) {
    const comparison = {
      industries: [],
      metrics: {
        avgMarketingSpend: [],
        avgROI: [],
        customerAcquisitionCost: [],
        competitiveIndex: []
      }
    };
    
    for (const key of industryKeys) {
      const industry = this.getIndustry(key);
      if (!industry) continue;
      
      const summary = this.getIndustrySummary(key);
      comparison.industries.push(summary);
      
      if (industry.benchmarks) {
        comparison.metrics.avgMarketingSpend.push(industry.benchmarks.avgMarketingSpend);
        comparison.metrics.avgROI.push(industry.benchmarks.avgROI);
        comparison.metrics.customerAcquisitionCost.push(industry.benchmarks.customerAcquisitionCost);
      }
      
      if (industry.calculations) {
        comparison.metrics.competitiveIndex.push(industry.calculations.competitiveIndex);
      }
    }
    
    // Расчет средних значений
    for (const [metric, values] of Object.entries(comparison.metrics)) {
      if (values.length > 0) {
        comparison.metrics[metric] = {
          values,
          average: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100,
          min: Math.min(...values),
          max: Math.max(...values)
        };
      }
    }
    
    return comparison;
  }

  /**
   * Получить топ отрасли по метрике
   * @param {string} metric - Метрика для сортировки
   * @param {number} limit - Лимит результатов
   * @returns {Array} Топ отрасли
   */
  static getTopIndustries(metric = 'avgROI', limit = 5) {
    const industries = Object.values(INDUSTRY_CONFIG);
    
    const sorted = industries
      .filter(industry => industry.benchmarks && industry.benchmarks[metric])
      .sort((a, b) => b.benchmarks[metric] - a.benchmarks[metric])
      .slice(0, limit);
    
    return sorted.map(industry => ({
      key: industry.key,
      displayName: industry.displayName,
      icon: industry.icon,
      value: industry.benchmarks[metric]
    }));
  }
}

// Экспорт константы для использования в других модулях
export { CALCULATION_CONSTANTS };

// Экспорт для глобального использования
if (typeof window !== 'undefined') {
  window.IndustryUtils = IndustryUtils;
}

export default IndustryUtils; 