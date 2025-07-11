/**
 * Метрики производительности
 * @module PerformanceMetrics
 */

/**
 * Класс для работы с метриками производительности
 */
export class PerformanceMetrics {
  constructor() {
    this.metrics = {
      LCP: null, // Largest Contentful Paint
      FID: null, // First Input Delay
      CLS: null, // Cumulative Layout Shift
      FCP: null, // First Contentful Paint
      TTFB: null, // Time to First Byte
      TTI: null, // Time to Interactive
      bundleSize: null,
      loadTime: null,
      domContentLoaded: null,
      windowLoad: null
    };
    
    this.thresholds = {
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
      FCP: { good: 1800, needsImprovement: 3000 },
      TTFB: { good: 800, needsImprovement: 1800 },
      TTI: { good: 3800, needsImprovement: 7300 }
    };
  }

  /**
   * Наблюдение за Largest Contentful Paint (LCP)
   * @param {Function} callback - Колбэк для обработки метрики
   * @returns {PerformanceObserver|null} Наблюдатель
   */
  observeLCP(callback) {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          this.metrics.LCP = lastEntry.startTime;
          callback('LCP', this.metrics.LCP);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        return observer;
      } catch (error) {
        console.warn('LCP observation not supported:', error);
      }
    }
    return null;
  }

  /**
   * Наблюдение за First Input Delay (FID)
   * @param {Function} callback - Колбэк для обработки метрики
   * @returns {PerformanceObserver|null} Наблюдатель
   */
  observeFID(callback) {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.metrics.FID = entry.processingStart - entry.startTime;
            callback('FID', this.metrics.FID);
          });
        });
        
        observer.observe({ entryTypes: ['first-input'] });
        return observer;
      } catch (error) {
        console.warn('FID observation not supported:', error);
      }
    }
    return null;
  }

  /**
   * Наблюдение за Cumulative Layout Shift (CLS)
   * @param {Function} callback - Колбэк для обработки метрики
   * @returns {PerformanceObserver|null} Наблюдатель
   */
  observeCLS(callback) {
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          this.metrics.CLS = clsValue;
          callback('CLS', this.metrics.CLS);
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        return observer;
      } catch (error) {
        console.warn('CLS observation not supported:', error);
      }
    }
    return null;
  }

  /**
   * Наблюдение за First Contentful Paint (FCP)
   * @param {Function} callback - Колбэк для обработки метрики
   * @returns {PerformanceObserver|null} Наблюдатель
   */
  observeFCP(callback) {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0];
          
          this.metrics.FCP = firstEntry.startTime;
          callback('FCP', this.metrics.FCP);
        });
        
        observer.observe({ entryTypes: ['first-contentful-paint'] });
        return observer;
      } catch (error) {
        console.warn('FCP observation not supported:', error);
      }
    }
    return null;
  }

  /**
   * Измерение Time to First Byte (TTFB)
   * @param {Function} callback - Колбэк для обработки метрики
   */
  measureTTFB(callback) {
    if ('performance' in window) {
      const navigationEntry = performance.getEntriesByType('navigation')[0];
      if (navigationEntry) {
        this.metrics.TTFB = navigationEntry.responseStart - navigationEntry.requestStart;
        callback('TTFB', this.metrics.TTFB);
      }
    }
  }

  /**
   * Измерение Time to Interactive (TTI)
   * @param {Function} callback - Колбэк для обработки метрики
   */
  measureTTI(callback) {
    if ('performance' in window) {
      // Упрощенный подход к измерению TTI
      const navigationEntry = performance.getEntriesByType('navigation')[0];
      if (navigationEntry) {
        this.metrics.TTI = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
        callback('TTI', this.metrics.TTI);
      }
    }
  }

  /**
   * Измерение размера бандла
   * @param {Function} callback - Колбэк для обработки метрики
   */
  measureBundleSize(callback) {
    try {
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;
      
      scripts.forEach(script => {
        const url = script.src;
        if (url.includes(window.location.origin)) {
          // Примерная оценка размера
          totalSize += 50; // 50KB на скрипт
        }
      });
      
      this.metrics.bundleSize = totalSize;
      callback('bundleSize', this.metrics.bundleSize);
    } catch (error) {
      console.warn('Bundle size measurement failed:', error);
    }
  }

  /**
   * Измерение времени загрузки
   * @param {Function} callback - Колбэк для обработки метрики
   */
  measureLoadTimes(callback) {
    if ('performance' in window) {
      const navigationEntry = performance.getEntriesByType('navigation')[0];
      if (navigationEntry) {
        this.metrics.loadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
        this.metrics.domContentLoaded = navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart;
        this.metrics.windowLoad = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
        
        callback('loadTime', this.metrics.loadTime);
        callback('domContentLoaded', this.metrics.domContentLoaded);
        callback('windowLoad', this.metrics.windowLoad);
      }
    }
  }

  /**
   * Получение метрик
   * @returns {Object} Все метрики
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Получение пороговых значений
   * @returns {Object} Пороговые значения
   */
  getThresholds() {
    return { ...this.thresholds };
  }

  /**
   * Установка пороговых значений
   * @param {Object} newThresholds - Новые пороговые значения
   */
  setThresholds(newThresholds) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }
} 