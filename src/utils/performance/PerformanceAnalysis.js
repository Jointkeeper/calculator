/**
 * Анализ производительности
 * @module PerformanceAnalysis
 */

/**
 * Класс для анализа производительности
 */
export class PerformanceAnalysis {
  constructor(metrics) {
    this.metrics = metrics;
  }

  /**
   * Оценка метрики
   * @param {string} metric - Название метрики
   * @param {number} value - Значение метрики
   * @returns {string} Статус метрики
   */
  evaluateMetric(metric, value) {
    const thresholds = this.metrics.getThresholds();
    const metricThresholds = thresholds[metric];
    
    if (!metricThresholds || value === null || value === undefined) {
      return 'unknown';
    }
    
    if (value <= metricThresholds.good) {
      return 'good';
    } else if (value <= metricThresholds.needsImprovement) {
      return 'needs-improvement';
    } else {
      return 'poor';
    }
  }

  /**
   * Генерация рекомендаций
   * @param {string} metric - Название метрики
   * @param {number} value - Значение метрики
   * @param {string} status - Статус метрики
   * @returns {Array} Рекомендации
   */
  generateRecommendations(metric, value, status) {
    const recommendations = [];
    
    switch (metric) {
      case 'LCP':
        if (status === 'poor') {
          recommendations.push('Оптимизируйте изображения и используйте lazy loading');
          recommendations.push('Минимизируйте время загрузки сервера');
          recommendations.push('Используйте CDN для статических ресурсов');
        }
        break;
        
      case 'FID':
        if (status === 'poor') {
          recommendations.push('Разделите длинные задачи на более мелкие');
          recommendations.push('Оптимизируйте JavaScript код');
          recommendations.push('Используйте Web Workers для тяжелых вычислений');
        }
        break;
        
      case 'CLS':
        if (status === 'poor') {
          recommendations.push('Установите фиксированные размеры для изображений');
          recommendations.push('Избегайте вставки контента поверх существующего');
          recommendations.push('Используйте CSS transform вместо изменения layout');
        }
        break;
        
      case 'FCP':
        if (status === 'poor') {
          recommendations.push('Оптимизируйте критический путь рендеринга');
          recommendations.push('Минимизируйте CSS и JavaScript');
          recommendations.push('Используйте preload для критических ресурсов');
        }
        break;
        
      case 'TTFB':
        if (status === 'poor') {
          recommendations.push('Оптимизируйте серверную производительность');
          recommendations.push('Используйте кэширование на сервере');
          recommendations.push('Рассмотрите использование CDN');
        }
        break;
        
      case 'TTI':
        if (status === 'poor') {
          recommendations.push('Уменьшите размер JavaScript бандла');
          recommendations.push('Используйте code splitting');
          recommendations.push('Оптимизируйте загрузку сторонних скриптов');
        }
        break;
    }
    
    return recommendations;
  }

  /**
   * Генерация отчета о производительности
   * @returns {Object} Отчет о производительности
   */
  getPerformanceReport() {
    const metrics = this.metrics.getMetrics();
    const report = {
      metrics: {},
      summary: {},
      recommendations: []
    };
    
    // Анализ каждой метрики
    Object.keys(metrics).forEach(metric => {
      const value = metrics[metric];
      const status = this.evaluateMetric(metric, value);
      
      report.metrics[metric] = {
        value,
        status,
        recommendations: this.generateRecommendations(metric, value, status)
      };
      
      report.recommendations.push(...report.metrics[metric].recommendations);
    });
    
    // Генерация сводки
    report.summary = this.generateSummary(report.metrics);
    
    return report;
  }

  /**
   * Генерация сводки
   * @param {Object} metrics - Метрики
   * @returns {Object} Сводка
   */
  generateSummary(metrics) {
    const coreWebVitals = ['LCP', 'FID', 'CLS'];
    const additionalMetrics = ['FCP', 'TTFB', 'TTI'];
    
    const coreScore = coreWebVitals.filter(metric => 
      metrics[metric] && metrics[metric].status === 'good'
    ).length;
    
    const additionalScore = additionalMetrics.filter(metric => 
      metrics[metric] && metrics[metric].status === 'good'
    ).length;
    
    const overallScore = Math.round((coreScore + additionalScore) / (coreWebVitals.length + additionalMetrics.length) * 100);
    
    return {
      overallScore,
      coreWebVitals: coreScore,
      additionalMetrics: additionalScore,
      totalMetrics: coreWebVitals.length + additionalMetrics.length
    };
  }

  /**
   * Анализ ресурсов
   * @returns {Object} Анализ ресурсов
   */
  analyzeResources() {
    if (!('performance' in window)) {
      return { error: 'Performance API not supported' };
    }
    
    const resources = performance.getEntriesByType('resource');
    const analysis = {
      totalResources: resources.length,
      slowResources: 0,
      largeResources: 0,
      averageLoadTime: 0
    };
    
    let totalLoadTime = 0;
    
    resources.forEach(resource => {
      const loadTime = resource.responseEnd - resource.fetchStart;
      totalLoadTime += loadTime;
      
      if (loadTime > 1000) { // Медленные ресурсы (>1s)
        analysis.slowResources++;
      }
      
      if (resource.transferSize > 100000) { // Большие ресурсы (>100KB)
        analysis.largeResources++;
      }
    });
    
    analysis.averageLoadTime = totalLoadTime / resources.length;
    
    return analysis;
  }

  /**
   * Анализ бандла
   * @returns {Object} Анализ бандла
   */
  analyzeBundle() {
    const scripts = document.querySelectorAll('script[src]');
    const analysis = {
      totalJSFiles: scripts.length,
      totalSize: 0,
      averageSize: 0,
      largestFile: 0
    };
    
    let totalSize = 0;
    let largestSize = 0;
    
    scripts.forEach(script => {
      const url = script.src;
      if (url.includes(window.location.origin)) {
        const estimatedSize = 50; // Примерная оценка
        totalSize += estimatedSize;
        largestSize = Math.max(largestSize, estimatedSize);
      }
    });
    
    analysis.totalSize = totalSize;
    analysis.averageSize = totalSize / scripts.length;
    analysis.largestFile = largestSize;
    
    return analysis;
  }
} 