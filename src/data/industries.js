/**
 * Industries Data Configuration для Universal Calculator
 * Центральная конфигурация данных для отраслей бизнеса
 * 
 * @version 2.0.0 - Modular architecture
 * @author Steamphony Digital Agency
 */

// Импорт отраслей
import { RESTAURANT_INDUSTRY } from './industries/restaurant.js';

/**
 * Конфигурация отраслей с детальными данными
 * @type {Object}
 */
export const INDUSTRY_CONFIG = {
  restaurant: RESTAURANT_INDUSTRY,
  
  beauty: {
    key: 'beauty',
    displayName: 'Красота и wellness',
    icon: '💅',
    description: 'Салоны красоты, СПА, фитнес, массаж',
    examples: 'Запись клиентов, продвижение услуг, программы лояльности',
    popular: true,
    searchTerms: ['салон', 'красота', 'спа', 'фитнес', 'массаж', 'косметология', 'wellness'],
    
    sizeOptions: [
      { value: 'solo', label: 'Индивидуальный мастер', description: 'Кабинет, домашние визиты', multiplier: 0.5, avgRevenue: 15000, employeesCount: '1' },
      { value: 'small', label: 'Небольшой салон', description: '2-5 мастеров, стандартные услуги', multiplier: 0.8, avgRevenue: 35000, employeesCount: '2-5' },
      { value: 'medium', label: 'Средний салон', description: '5-15 мастеров, широкий спектр услуг', multiplier: 1.2, avgRevenue: 70000, employeesCount: '5-15' },
      { value: 'large', label: 'Крупный салон/СПА', description: '15+ мастеров, премиум услуги', multiplier: 1.8, avgRevenue: 150000, employeesCount: '15-30' },
      { value: 'network', label: 'Сеть салонов', description: 'Несколько точек, франшиза', multiplier: 2.8, avgRevenue: 400000, employeesCount: '30+' }
    ],
    
    marketingBudgetRanges: {
      solo: [
        { range: '0-300', value: 150, label: '$0-300 (социальные сети)', effectiveness: 0.7 },
        { range: '300-600', value: 450, label: '$300-600 (соцсети + реклама)', effectiveness: 0.8 },
        { range: '600-1000', value: 800, label: '$600-1000 (комплексное продвижение)', effectiveness: 0.85 },
        { range: '1000-1500', value: 1250, label: '$1000-1500 (профессиональный маркетинг)', effectiveness: 0.9 },
        { range: '1500+', value: 2000, label: '$1500+ (максимальное покрытие)', effectiveness: 0.95 }
      ],
      small: [
        { range: '300-800', value: 550, label: '$300-800 (базовый маркетинг)', effectiveness: 0.65 },
        { range: '800-1500', value: 1150, label: '$800-1500 (активное продвижение)', effectiveness: 0.8 },
        { range: '1500-2500', value: 2000, label: '$1500-2500 (комплексный маркетинг)', effectiveness: 0.9 },
        { range: '2500-4000', value: 3250, label: '$2500-4000 (профессиональная команда)', effectiveness: 0.95 },
        { range: '4000+', value: 6000, label: '$4000+ (агентство + внутренняя команда)', effectiveness: 0.98 }
      ],
      medium: [
        { range: '800-2000', value: 1400, label: '$800-2000 (базовый маркетинг)', effectiveness: 0.7 },
        { range: '2000-4000', value: 3000, label: '$2000-4000 (активное продвижение)', effectiveness: 0.85 },
        { range: '4000-7000', value: 5500, label: '$4000-7000 (комплексный маркетинг)', effectiveness: 0.92 },
        { range: '7000-12000', value: 9500, label: '$7000-12000 (профессиональная команда)', effectiveness: 0.96 },
        { range: '12000+', value: 18000, label: '$12000+ (агентство + команда)', effectiveness: 0.98 }
      ],
      large: [
        { range: '2000-5000', value: 3500, label: '$2000-5000 (стартовый маркетинг)', effectiveness: 0.75 },
        { range: '5000-10000', value: 7500, label: '$5000-10000 (активное продвижение)', effectiveness: 0.88 },
        { range: '10000-18000', value: 14000, label: '$10000-18000 (профессиональный маркетинг)', effectiveness: 0.94 },
        { range: '18000-30000', value: 24000, label: '$18000-30000 (премиум продвижение)', effectiveness: 0.97 },
        { range: '30000+', value: 50000, label: '$30000+ (максимальное покрытие)', effectiveness: 0.99 }
      ],
      network: [
        { range: '5000-15000', value: 10000, label: '$5000-15000 (базовый маркетинг сети)', effectiveness: 0.8 },
        { range: '15000-30000', value: 22500, label: '$15000-30000 (активное продвижение)', effectiveness: 0.9 },
        { range: '30000-50000', value: 40000, label: '$30000-50000 (профессиональная команда)', effectiveness: 0.95 },
        { range: '50000-80000', value: 65000, label: '$50000-80000 (агентство + команда)', effectiveness: 0.98 },
        { range: '80000+', value: 120000, label: '$80000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ]
    },
    
    calculations: {
      marketerSalary: { partTime: 800, fullTime: 1500, senior: 2500, team: 4000 },
      toolsMultiplier: 2.0,
      avgRevenuePerCustomer: 120,
      seasonalityFactor: 1.1,
      competitiveIndex: 0.7,
      repeatCustomerRate: 0.75,
      conversionRate: 0.12,
      cpcRange: { min: 0.8, max: 3.0 },
      industryGrowthRate: 0.12
    },
    
    personalizedMessages: {
      savingsMessage: "В beauty-индустрии 68% салонов переплачивают за маркетинг",
      opportunityMessage: "Салоны с digital-продвижением увеличивают клиентскую базу на 45%",
      industryInsight: "Ключевые точки роста: онлайн-запись, Instagram, программы лояльности",
      toolsRecommendation: "Обязательно: система онлайн-записи, Instagram Business, CRM для клиентов",
      commonMistakes: "Частые ошибки: слабые фото работ, отсутствие онлайн-записи, игнорирование отзывов"
    },
    
    benchmarks: {
      avgMarketingSpend: 1200,
      avgROI: 3.8,
      digitalizationLevel: 0.5,
      customerAcquisitionCost: 45,
      avgOrderValue: 120,
      repeatVisitRate: 0.75
    }
  },

  retail: {
    key: 'retail',
    displayName: 'Розничная торговля',
    icon: '🛍️',
    description: 'Магазины, торговые центры, онлайн-магазины',
    examples: 'Привлечение покупателей, увеличение продаж, программы лояльности',
    popular: true,
    searchTerms: ['магазин', 'торговля', 'розница', 'продажи', 'товары', 'покупки'],
    
    sizeOptions: [
      { value: 'small', label: 'Небольшой магазин', description: '1-5 сотрудников, местный бизнес', multiplier: 0.8, avgRevenue: 40000, employeesCount: '1-5' },
      { value: 'medium', label: 'Средний магазин', description: '5-15 сотрудников, стабильный поток', multiplier: 1.2, avgRevenue: 80000, employeesCount: '5-15' },
      { value: 'large', label: 'Крупный магазин', description: '15+ сотрудников, премиум сегмент', multiplier: 1.8, avgRevenue: 180000, employeesCount: '15-30' },
      { value: 'chain', label: 'Сеть магазинов', description: 'Несколько точек, франшиза', multiplier: 2.5, avgRevenue: 500000, employeesCount: '30+' }
    ],
    
    marketingBudgetRanges: {
      small: [
        { range: '0-800', value: 400, label: '$0-800 (социальные сети)', effectiveness: 0.65 },
        { range: '800-1500', value: 1150, label: '$800-1500 (реклама + SMM)', effectiveness: 0.8 },
        { range: '1500-3000', value: 2250, label: '$1500-3000 (комплексное продвижение)', effectiveness: 0.88 },
        { range: '3000-5000', value: 4000, label: '$3000-5000 (профессиональный маркетинг)', effectiveness: 0.93 },
        { range: '5000+', value: 8000, label: '$5000+ (максимальное покрытие)', effectiveness: 0.97 }
      ],
      medium: [
        { range: '800-2000', value: 1400, label: '$800-2000 (базовый маркетинг)', effectiveness: 0.7 },
        { range: '2000-4000', value: 3000, label: '$2000-4000 (активное продвижение)', effectiveness: 0.85 },
        { range: '4000-7000', value: 5500, label: '$4000-7000 (комплексный маркетинг)', effectiveness: 0.92 },
        { range: '7000-12000', value: 9500, label: '$7000-12000 (профессиональная команда)', effectiveness: 0.96 },
        { range: '12000+', value: 20000, label: '$12000+ (агентство + команда)', effectiveness: 0.98 }
      ],
      large: [
        { range: '2000-6000', value: 4000, label: '$2000-6000 (стартовый маркетинг)', effectiveness: 0.75 },
        { range: '6000-12000', value: 9000, label: '$6000-12000 (активное продвижение)', effectiveness: 0.88 },
        { range: '12000-20000', value: 16000, label: '$12000-20000 (профессиональный маркетинг)', effectiveness: 0.94 },
        { range: '20000-35000', value: 27500, label: '$20000-35000 (премиум продвижение)', effectiveness: 0.97 },
        { range: '35000+', value: 60000, label: '$35000+ (максимальное покрытие)', effectiveness: 0.99 }
      ],
      chain: [
        { range: '5000-20000', value: 12500, label: '$5000-20000 (базовый маркетинг сети)', effectiveness: 0.8 },
        { range: '20000-40000', value: 30000, label: '$20000-40000 (активное продвижение)', effectiveness: 0.9 },
        { range: '40000-70000', value: 55000, label: '$40000-70000 (профессиональная команда)', effectiveness: 0.95 },
        { range: '70000-120000', value: 95000, label: '$70000-120000 (агентство + команда)', effectiveness: 0.98 },
        { range: '120000+', value: 200000, label: '$120000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ]
    },
    
    calculations: {
      marketerSalary: { partTime: 1200, fullTime: 2000, senior: 3200, team: 5000 },
      toolsMultiplier: 3.0,
      avgRevenuePerCustomer: 85,
      seasonalityFactor: 1.3,
      competitiveIndex: 0.9,
      repeatCustomerRate: 0.55,
      conversionRate: 0.15,
      cpcRange: { min: 0.6, max: 2.0 },
      industryGrowthRate: 0.08
    },
    
    personalizedMessages: {
      savingsMessage: "В розничной торговле 71% магазинов переплачивают за маркетинг",
      opportunityMessage: "Магазины с digital-продвижением увеличивают продажи на 35%",
      industryInsight: "Ключевые точки роста: онлайн-каталог, программы лояльности, email-маркетинг",
      toolsRecommendation: "Обязательно: онлайн-каталог, система лояльности, email-маркетинг",
      commonMistakes: "Частые ошибки: слабые фото товаров, отсутствие онлайн-каталога, игнорирование отзывов"
    },
    
    benchmarks: {
      avgMarketingSpend: 2500,
      avgROI: 2.8,
      digitalizationLevel: 0.7,
      customerAcquisitionCost: 35,
      avgOrderValue: 85,
      repeatVisitRate: 0.55
    }
  },

  services: {
    key: 'services',
    displayName: 'Услуги и сервисы',
    icon: '🔧',
    description: 'Ремонт, клининговые услуги, консультации',
    examples: 'Привлечение клиентов, увеличение заказов, расширение услуг',
    popular: true,
    searchTerms: ['услуги', 'ремонт', 'клининг', 'консультации', 'сервис', 'помощь'],
    
    sizeOptions: [
      { value: 'solo', label: 'Индивидуальный мастер', description: 'Один специалист, выездные услуги', multiplier: 0.6, avgRevenue: 20000, employeesCount: '1' },
      { value: 'small', label: 'Небольшая команда', description: '2-5 специалистов, местные услуги', multiplier: 0.9, avgRevenue: 45000, employeesCount: '2-5' },
      { value: 'medium', label: 'Средняя компания', description: '5-15 специалистов, широкий спектр', multiplier: 1.3, avgRevenue: 90000, employeesCount: '5-15' },
      { value: 'large', label: 'Крупная компания', description: '15+ специалистов, премиум услуги', multiplier: 2.0, avgRevenue: 200000, employeesCount: '15-30' }
    ],
    
    marketingBudgetRanges: {
      solo: [
        { range: '0-400', value: 200, label: '$0-400 (социальные сети)', effectiveness: 0.7 },
        { range: '400-800', value: 600, label: '$400-800 (соцсети + реклама)', effectiveness: 0.8 },
        { range: '800-1500', value: 1150, label: '$800-1500 (комплексное продвижение)', effectiveness: 0.85 },
        { range: '1500-2500', value: 2000, label: '$1500-2500 (профессиональный маркетинг)', effectiveness: 0.9 },
        { range: '2500+', value: 3500, label: '$2500+ (максимальное покрытие)', effectiveness: 0.95 }
      ],
      small: [
        { range: '400-1000', value: 700, label: '$400-1000 (базовый маркетинг)', effectiveness: 0.65 },
        { range: '1000-2000', value: 1500, label: '$1000-2000 (активное продвижение)', effectiveness: 0.8 },
        { range: '2000-3500', value: 2750, label: '$2000-3500 (комплексный маркетинг)', effectiveness: 0.9 },
        { range: '3500-6000', value: 4750, label: '$3500-6000 (профессиональная команда)', effectiveness: 0.95 },
        { range: '6000+', value: 10000, label: '$6000+ (агентство + команда)', effectiveness: 0.98 }
      ],
      medium: [
        { range: '1000-2500', value: 1750, label: '$1000-2500 (базовый маркетинг)', effectiveness: 0.7 },
        { range: '2500-5000', value: 3750, label: '$2500-5000 (активное продвижение)', effectiveness: 0.85 },
        { range: '5000-8000', value: 6500, label: '$5000-8000 (комплексный маркетинг)', effectiveness: 0.92 },
        { range: '8000-15000', value: 11500, label: '$8000-15000 (профессиональная команда)', effectiveness: 0.96 },
        { range: '15000+', value: 25000, label: '$15000+ (агентство + команда)', effectiveness: 0.98 }
      ],
      large: [
        { range: '2500-6000', value: 4250, label: '$2500-6000 (стартовый маркетинг)', effectiveness: 0.75 },
        { range: '6000-12000', value: 9000, label: '$6000-12000 (активное продвижение)', effectiveness: 0.88 },
        { range: '12000-20000', value: 16000, label: '$12000-20000 (профессиональный маркетинг)', effectiveness: 0.94 },
        { range: '20000-35000', value: 27500, label: '$20000-35000 (премиум продвижение)', effectiveness: 0.97 },
        { range: '35000+', value: 60000, label: '$35000+ (максимальное покрытие)', effectiveness: 0.99 }
      ]
    },
    
    calculations: {
      marketerSalary: { partTime: 900, fullTime: 1600, senior: 2600, team: 4200 },
      toolsMultiplier: 2.2,
      avgRevenuePerCustomer: 150,
      seasonalityFactor: 1.0,
      competitiveIndex: 0.6,
      repeatCustomerRate: 0.70,
      conversionRate: 0.10,
      cpcRange: { min: 0.7, max: 2.8 },
      industryGrowthRate: 0.10
    },
    
    personalizedMessages: {
      savingsMessage: "В сфере услуг 69% компаний переплачивают за маркетинг",
      opportunityMessage: "Сервисные компании с digital-продвижением увеличивают заказы на 50%",
      industryInsight: "Ключевые точки роста: онлайн-заказ, отзывы клиентов, программы лояльности",
      toolsRecommendation: "Обязательно: система онлайн-заказа, сбор отзывов, CRM для клиентов",
      commonMistakes: "Частые ошибки: отсутствие онлайн-заказа, игнорирование отзывов, слабая фото-подача работ"
    },
    
    benchmarks: {
      avgMarketingSpend: 1500,
      avgROI: 4.2,
      digitalizationLevel: 0.4,
      customerAcquisitionCost: 60,
      avgOrderValue: 150,
      repeatVisitRate: 0.70
    }
  },

  ecommerce: {
    key: 'ecommerce',
    displayName: 'E-commerce',
    icon: '🛒',
    description: 'Онлайн-магазины, маркетплейсы, dropshipping',
    examples: 'Увеличение продаж, привлечение трафика, конверсия',
    popular: true,
    searchTerms: ['интернет-магазин', 'ecommerce', 'онлайн-продажи', 'маркетплейс', 'dropshipping'],
    
    sizeOptions: [
      { value: 'startup', label: 'Стартап', description: 'Новый проект, тестирование ниши', multiplier: 0.5, avgRevenue: 15000, employeesCount: '1-3' },
      { value: 'small', label: 'Небольшой магазин', description: 'Стабильные продажи, 1-5 сотрудников', multiplier: 0.8, avgRevenue: 35000, employeesCount: '1-5' },
      { value: 'medium', label: 'Средний магазин', description: 'Растущий бизнес, 5-15 сотрудников', multiplier: 1.2, avgRevenue: 80000, employeesCount: '5-15' },
      { value: 'large', label: 'Крупный магазин', description: 'Успешный бизнес, 15+ сотрудников', multiplier: 1.8, avgRevenue: 200000, employeesCount: '15-30' }
    ],
    
    marketingBudgetRanges: {
      startup: [
        { range: '0-500', value: 250, label: '$0-500 (социальные сети)', effectiveness: 0.6 },
        { range: '500-1000', value: 750, label: '$500-1000 (реклама + SMM)', effectiveness: 0.75 },
        { range: '1000-2000', value: 1500, label: '$1000-2000 (комплексное продвижение)', effectiveness: 0.85 },
        { range: '2000-3500', value: 2750, label: '$2000-3500 (профессиональный маркетинг)', effectiveness: 0.9 },
        { range: '3500+', value: 5000, label: '$3500+ (максимальное покрытие)', effectiveness: 0.95 }
      ],
      small: [
        { range: '500-1500', value: 1000, label: '$500-1500 (базовый маркетинг)', effectiveness: 0.65 },
        { range: '1500-3000', value: 2250, label: '$1500-3000 (активное продвижение)', effectiveness: 0.8 },
        { range: '3000-5000', value: 4000, label: '$3000-5000 (комплексный маркетинг)', effectiveness: 0.9 },
        { range: '5000-8000', value: 6500, label: '$5000-8000 (профессиональная команда)', effectiveness: 0.95 },
        { range: '8000+', value: 12000, label: '$8000+ (агентство + команда)', effectiveness: 0.98 }
      ],
      medium: [
        { range: '1500-4000', value: 2750, label: '$1500-4000 (базовый маркетинг)', effectiveness: 0.7 },
        { range: '4000-8000', value: 6000, label: '$4000-8000 (активное продвижение)', effectiveness: 0.85 },
        { range: '8000-15000', value: 11500, label: '$8000-15000 (комплексный маркетинг)', effectiveness: 0.92 },
        { range: '15000-25000', value: 20000, label: '$15000-25000 (профессиональная команда)', effectiveness: 0.96 },
        { range: '25000+', value: 40000, label: '$25000+ (агентство + команда)', effectiveness: 0.98 }
      ],
      large: [
        { range: '4000-10000', value: 7000, label: '$4000-10000 (стартовый маркетинг)', effectiveness: 0.75 },
        { range: '10000-20000', value: 15000, label: '$10000-20000 (активное продвижение)', effectiveness: 0.88 },
        { range: '20000-35000', value: 27500, label: '$20000-35000 (профессиональный маркетинг)', effectiveness: 0.94 },
        { range: '35000-60000', value: 47500, label: '$35000-60000 (премиум продвижение)', effectiveness: 0.97 },
        { range: '60000+', value: 100000, label: '$60000+ (максимальное покрытие)', effectiveness: 0.99 }
      ]
    },
    
    calculations: {
      marketerSalary: { partTime: 1000, fullTime: 1800, senior: 2800, team: 4500 },
      toolsMultiplier: 4.0,
      avgRevenuePerCustomer: 75,
      seasonalityFactor: 1.4,
      competitiveIndex: 0.9,
      repeatCustomerRate: 0.45,
      conversionRate: 0.02,
      cpcRange: { min: 0.3, max: 1.5 },
      industryGrowthRate: 0.20
    },
    
    personalizedMessages: {
      savingsMessage: "В e-commerce 76% магазинов переплачивают за маркетинг",
      opportunityMessage: "Онлайн-магазины с профессиональным продвижением увеличивают продажи на 60%",
      industryInsight: "Ключевые точки роста: конверсия, повторные покупки, email-маркетинг",
      toolsRecommendation: "Обязательно: аналитика, email-маркетинг, ретаргетинг",
      commonMistakes: "Частые ошибки: слабые фото товаров, сложный процесс покупки, отсутствие отзывов"
    },
    
    benchmarks: {
      avgMarketingSpend: 3000,
      avgROI: 2.5,
      digitalizationLevel: 0.9,
      customerAcquisitionCost: 25,
      avgOrderValue: 75,
      repeatVisitRate: 0.45
    }
  },

  education: {
    key: 'education',
    displayName: 'Образование',
    icon: '📚',
    description: 'Курсы, тренинги, онлайн-обучение',
    examples: 'Привлечение учеников, продажа курсов, образовательные программы',
    popular: false,
    searchTerms: ['образование', 'курсы', 'обучение', 'тренинги', 'школа', 'университет'],
    
    sizeOptions: [
      { value: 'individual', label: 'Индивидуальный преподаватель', description: 'Частные уроки, онлайн-курсы', multiplier: 0.6, avgRevenue: 25000, employeesCount: '1' },
      { value: 'small', label: 'Небольшая школа', description: '2-5 преподавателей, местные курсы', multiplier: 0.9, avgRevenue: 60000, employeesCount: '2-5' },
      { value: 'medium', label: 'Средняя школа', description: '5-15 преподавателей, широкий спектр', multiplier: 1.3, avgRevenue: 120000, employeesCount: '5-15' },
      { value: 'large', label: 'Крупная школа', description: '15+ преподавателей, премиум программы', multiplier: 2.0, avgRevenue: 300000, employeesCount: '15-30' }
    ],
    
    marketingBudgetRanges: {
      individual: [
        { range: '0-300', value: 150, label: '$0-300 (социальные сети)', effectiveness: 0.7 },
        { range: '300-600', value: 450, label: '$300-600 (соцсети + реклама)', effectiveness: 0.8 },
        { range: '600-1200', value: 900, label: '$600-1200 (комплексное продвижение)', effectiveness: 0.85 },
        { range: '1200-2000', value: 1600, label: '$1200-2000 (профессиональный маркетинг)', effectiveness: 0.9 },
        { range: '2000+', value: 3000, label: '$2000+ (максимальное покрытие)', effectiveness: 0.95 }
      ],
      small: [
        { range: '300-800', value: 550, label: '$300-800 (базовый маркетинг)', effectiveness: 0.65 },
        { range: '800-1500', value: 1150, label: '$800-1500 (активное продвижение)', effectiveness: 0.8 },
        { range: '1500-2500', value: 2000, label: '$1500-2500 (комплексный маркетинг)', effectiveness: 0.9 },
        { range: '2500-4000', value: 3250, label: '$2500-4000 (профессиональная команда)', effectiveness: 0.95 },
        { range: '4000+', value: 6000, label: '$4000+ (агентство + команда)', effectiveness: 0.98 }
      ],
      medium: [
        { range: '800-2000', value: 1400, label: '$800-2000 (базовый маркетинг)', effectiveness: 0.7 },
        { range: '2000-4000', value: 3000, label: '$2000-4000 (активное продвижение)', effectiveness: 0.85 },
        { range: '4000-7000', value: 5500, label: '$4000-7000 (комплексный маркетинг)', effectiveness: 0.92 },
        { range: '7000-12000', value: 9500, label: '$7000-12000 (профессиональная команда)', effectiveness: 0.96 },
        { range: '12000+', value: 20000, label: '$12000+ (агентство + команда)', effectiveness: 0.98 }
      ],
      large: [
        { range: '2000-5000', value: 3500, label: '$2000-5000 (стартовый маркетинг)', effectiveness: 0.75 },
        { range: '5000-10000', value: 7500, label: '$5000-10000 (активное продвижение)', effectiveness: 0.88 },
        { range: '10000-18000', value: 14000, label: '$10000-18000 (профессиональный маркетинг)', effectiveness: 0.94 },
        { range: '18000-30000', value: 24000, label: '$18000-30000 (премиум продвижение)', effectiveness: 0.97 },
        { range: '30000+', value: 50000, label: '$30000+ (максимальное покрытие)', effectiveness: 0.99 }
      ]
    },
    
    calculations: {
      marketerSalary: { partTime: 800, fullTime: 1400, senior: 2200, team: 3500 },
      toolsMultiplier: 2.8,
      avgRevenuePerCustomer: 200,
      seasonalityFactor: 1.1,
      competitiveIndex: 0.5,
      repeatCustomerRate: 0.80,
      conversionRate: 0.08,
      cpcRange: { min: 0.5, max: 2.0 },
      industryGrowthRate: 0.15
    },
    
    personalizedMessages: {
      savingsMessage: "В образовании 65% школ переплачивают за маркетинг",
      opportunityMessage: "Образовательные учреждения с digital-продвижением увеличивают набор на 55%",
      industryInsight: "Ключевые точки роста: онлайн-курсы, программы лояльности, отзывы учеников",
      toolsRecommendation: "Обязательно: система онлайн-записи, отзывы учеников, email-маркетинг",
      commonMistakes: "Частые ошибки: слабые фото занятий, отсутствие отзывов, сложная запись"
    },
    
    benchmarks: {
      avgMarketingSpend: 1800,
      avgROI: 4.5,
      digitalizationLevel: 0.6,
      customerAcquisitionCost: 80,
      avgOrderValue: 200,
      repeatVisitRate: 0.80
    }
  },

  other: {
    key: 'other',
    displayName: 'Другое',
    icon: '🏢',
    description: 'Другие отрасли бизнеса',
    examples: 'Привлечение клиентов, увеличение продаж, развитие бизнеса',
    popular: false,
    searchTerms: ['другое', 'бизнес', 'компания', 'предприятие'],
    
    sizeOptions: [
      { value: 'small', label: 'Небольшой бизнес', description: '1-10 сотрудников, местный рынок', multiplier: 0.8, avgRevenue: 50000, employeesCount: '1-10' },
      { value: 'medium', label: 'Средний бизнес', description: '10-50 сотрудников, региональный рынок', multiplier: 1.2, avgRevenue: 120000, employeesCount: '10-50' },
      { value: 'large', label: 'Крупный бизнес', description: '50+ сотрудников, национальный рынок', multiplier: 1.8, avgRevenue: 300000, employeesCount: '50+' }
    ],
    
    marketingBudgetRanges: {
      small: [
        { range: '0-1000', value: 500, label: '$0-1000 (базовый маркетинг)', effectiveness: 0.6 },
        { range: '1000-2000', value: 1500, label: '$1000-2000 (активное продвижение)', effectiveness: 0.75 },
        { range: '2000-4000', value: 3000, label: '$2000-4000 (комплексный маркетинг)', effectiveness: 0.85 },
        { range: '4000-7000', value: 5500, label: '$4000-7000 (профессиональный маркетинг)', effectiveness: 0.9 },
        { range: '7000+', value: 10000, label: '$7000+ (максимальное покрытие)', effectiveness: 0.95 }
      ],
      medium: [
        { range: '1000-3000', value: 2000, label: '$1000-3000 (базовый маркетинг)', effectiveness: 0.65 },
        { range: '3000-6000', value: 4500, label: '$3000-6000 (активное продвижение)', effectiveness: 0.8 },
        { range: '6000-12000', value: 9000, label: '$6000-12000 (комплексный маркетинг)', effectiveness: 0.9 },
        { range: '12000-20000', value: 16000, label: '$12000-20000 (профессиональная команда)', effectiveness: 0.95 },
        { range: '20000+', value: 35000, label: '$20000+ (агентство + команда)', effectiveness: 0.98 }
      ],
      large: [
        { range: '3000-8000', value: 5500, label: '$3000-8000 (стартовый маркетинг)', effectiveness: 0.7 },
        { range: '8000-15000', value: 11500, label: '$8000-15000 (активное продвижение)', effectiveness: 0.85 },
        { range: '15000-25000', value: 20000, label: '$15000-25000 (профессиональный маркетинг)', effectiveness: 0.92 },
        { range: '25000-40000', value: 32500, label: '$25000-40000 (премиум продвижение)', effectiveness: 0.96 },
        { range: '40000+', value: 70000, label: '$40000+ (максимальное покрытие)', effectiveness: 0.99 }
      ]
    },
    
    calculations: {
      marketerSalary: { partTime: 1000, fullTime: 1800, senior: 2800, team: 4500 },
      toolsMultiplier: 2.5,
      avgRevenuePerCustomer: 100,
      seasonalityFactor: 1.0,
      competitiveIndex: 0.7,
      repeatCustomerRate: 0.60,
      conversionRate: 0.05,
      cpcRange: { min: 0.5, max: 2.0 },
      industryGrowthRate: 0.10
    },
    
    personalizedMessages: {
      savingsMessage: "В среднем 70% компаний переплачивают за маркетинг",
      opportunityMessage: "Компании с профессиональным digital-продвижением увеличивают продажи на 40%",
      industryInsight: "Ключевые точки роста: digital-маркетинг, автоматизация, аналитика",
      toolsRecommendation: "Обязательно: аналитика, CRM, email-маркетинг",
      commonMistakes: "Частые ошибки: отсутствие стратегии, слабая аналитика, неэффективные каналы"
    },
    
    benchmarks: {
      avgMarketingSpend: 2000,
      avgROI: 3.0,
      digitalizationLevel: 0.5,
      customerAcquisitionCost: 50,
      avgOrderValue: 100,
      repeatVisitRate: 0.60
    }
  }
};

/**
 * Получение конфигурации отрасли по ключу
 */
export function getIndustryConfig(industryKey) {
  return INDUSTRY_CONFIG[industryKey] || null;
}

/**
 * Получение всех отраслей
 */
export function getAllIndustries() {
  return Object.values(INDUSTRY_CONFIG);
}

/**
 * Получение популярных отраслей
 */
export function getPopularIndustries() {
  return Object.values(INDUSTRY_CONFIG).filter(industry => industry.popular);
}

/**
 * Валидация конфигурации отраслей
 */
export function validateIndustryConfig() {
  const errors = [];
  
  Object.entries(INDUSTRY_CONFIG).forEach(([key, industry]) => {
    if (!industry.key || !industry.displayName) {
      errors.push(`Industry ${key}: missing required fields`);
    }
    
    if (!industry.sizeOptions || industry.sizeOptions.length === 0) {
      errors.push(`Industry ${key}: missing size options`);
    }
    
    if (!industry.marketingBudgetRanges) {
      errors.push(`Industry ${key}: missing budget ranges`);
    }
  });
  
  return errors.length === 0 ? true : errors;
}

// Автоматическая валидация при загрузке модуля
if (typeof window !== 'undefined') {
  const validation = validateIndustryConfig();
  if (!validation) {
    console.error('Industries configuration validation failed:', validation);
  }
  console.log(`✅ Industries configuration loaded: ${Object.values(INDUSTRY_CONFIG).length} industries`);
} 