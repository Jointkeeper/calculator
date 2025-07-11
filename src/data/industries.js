/**
 * Industries Data Configuration для Universal Calculator
 * Центральная конфигурация данных для 8 отраслей бизнеса
 * 
 * @version 1.0.0
 * @author Steamphony Digital Agency
 */

/**
 * Конфигурация отраслей с детальными данными
 * @type {Object}
 */
export const INDUSTRY_CONFIG = {
  restaurant: {
    // Базовая информация
    key: 'restaurant',
    displayName: 'Ресторанный бизнес',
    icon: '🍽️',
    description: 'Рестораны, кафе, бары, доставка еды',
    examples: 'Привлечение гостей, бронирования столиков, онлайн-заказы',
    popular: true,
    searchTerms: ['ресторан', 'кафе', 'бар', 'еда', 'доставка', 'общепит', 'питание'],
    
    // Размеры бизнеса с multipliers
    sizeOptions: [
      { 
        value: 'small', 
        label: 'Небольшое заведение', 
        description: '1-20 мест, семейный бизнес',
        multiplier: 0.7,
        avgRevenue: 25000,
        employeesCount: '1-5'
      },
      { 
        value: 'medium', 
        label: 'Средний ресторан', 
        description: '20-50 мест, стабильный поток',
        multiplier: 1.0,
        avgRevenue: 60000,
        employeesCount: '6-15'
      },
      { 
        value: 'large', 
        label: 'Крупное заведение', 
        description: '50+ мест, премиум сегмент',
        multiplier: 1.5,
        avgRevenue: 120000,
        employeesCount: '16-35'
      },
      { 
        value: 'chain', 
        label: 'Сеть заведений', 
        description: 'Несколько точек, франшиза',
        multiplier: 2.5,
        avgRevenue: 300000,
        employeesCount: '35+'
      }
    ],
    
    // Диапазоны маркетинг-бюджетов по размерам (USD)
    marketingBudgetRanges: {
      small: [
        { range: '0-500', value: 250, label: '$0-500 (только реклама в соцсетях)', effectiveness: 0.6 },
        { range: '500-1000', value: 750, label: '$500-1000 (реклама + базовый SMM)', effectiveness: 0.75 },
        { range: '1000-2000', value: 1500, label: '$1000-2000 (комплексное продвижение)', effectiveness: 0.85 },
        { range: '2000-3500', value: 2750, label: '$2000-3500 (профессиональный маркетинг)', effectiveness: 0.9 },
        { range: '3500+', value: 5000, label: '$3500+ (максимальное покрытие)', effectiveness: 0.95 }
      ],
      medium: [
        { range: '500-1500', value: 1000, label: '$500-1500 (базовый маркетинг)', effectiveness: 0.65 },
        { range: '1500-3000', value: 2250, label: '$1500-3000 (активное продвижение)', effectiveness: 0.8 },
        { range: '3000-5000', value: 4000, label: '$3000-5000 (комплексный маркетинг)', effectiveness: 0.9 },
        { range: '5000-8000', value: 6500, label: '$5000-8000 (профессиональная команда)', effectiveness: 0.95 },
        { range: '8000+', value: 12000, label: '$8000+ (агентство + внутренняя команда)', effectiveness: 0.98 }
      ],
      large: [
        { range: '2000-5000', value: 3500, label: '$2000-5000 (стартовый маркетинг)', effectiveness: 0.7 },
        { range: '5000-8000', value: 6500, label: '$5000-8000 (активное продвижение)', effectiveness: 0.85 },
        { range: '8000-12000', value: 10000, label: '$8000-12000 (профессиональный маркетинг)', effectiveness: 0.92 },
        { range: '12000-20000', value: 16000, label: '$12000-20000 (премиум продвижение)', effectiveness: 0.96 },
        { range: '20000+', value: 30000, label: '$20000+ (максимальное покрытие)', effectiveness: 0.99 }
      ],
      chain: [
        { range: '5000-15000', value: 10000, label: '$5000-15000 (базовый маркетинг сети)', effectiveness: 0.75 },
        { range: '15000-25000', value: 20000, label: '$15000-25000 (активное продвижение)', effectiveness: 0.88 },
        { range: '25000-40000', value: 32500, label: '$25000-40000 (профессиональная команда)', effectiveness: 0.94 },
        { range: '40000-60000', value: 50000, label: '$40000-60000 (агентство + команда)', effectiveness: 0.97 },
        { range: '60000+', value: 100000, label: '$60000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ]
    },
    
    // Коэффициенты для расчетов
    calculations: {
      marketerSalary: { 
        partTime: 1000, 
        fullTime: 1800, 
        senior: 2800, 
        team: 4500 
      },
      toolsMultiplier: 2.5, // Рестораны тратят умеренно на софт
      avgRevenuePerCustomer: 35,
      seasonalityFactor: 1.2,
      competitiveIndex: 0.8,
      repeatCustomerRate: 0.65,
      conversionRate: 0.08,
      cpcRange: { min: 0.5, max: 2.5 },
      industryGrowthRate: 0.15
    },
    
    // Персонализированные сообщения
    personalizedMessages: {
      savingsMessage: "В ресторанном бизнесе 73% владельцев переплачивают за маркетинг",
      opportunityMessage: "Рестораны с профессиональным digital-продвижением увеличивают проходимость на 40%",
      industryInsight: "Ключевые точки роста: бронирование столиков, доставка, программы лояльности",
      toolsRecommendation: "Обязательно: CRM для бронирований, Instagram Business, система лояльности",
      commonMistakes: "Частые ошибки: игнорирование отзывов, слабая фото-подача блюд, отсутствие онлайн-бронирования"
    },
    
    // Industry benchmarks
    benchmarks: {
      avgMarketingSpend: 1800,
      avgROI: 3.2,
      digitalizationLevel: 0.6,
      customerAcquisitionCost: 28,
      avgOrderValue: 35,
      repeatVisitRate: 0.65
    }
  },

  beauty: {
    // Базовая информация
    key: 'beauty',
    displayName: 'Красота и wellness',
    icon: '💅',
    description: 'Салоны красоты, СПА, фитнес, массаж',
    examples: 'Запись клиентов, продвижение услуг, программы лояльности',
    popular: true,
    searchTerms: ['салон', 'красота', 'спа', 'фитнес', 'массаж', 'косметология', 'wellness'],
    
    // Размеры бизнеса с multipliers
    sizeOptions: [
      { 
        value: 'solo', 
        label: 'Индивидуальный мастер', 
        description: 'Кабинет, домашние визиты',
        multiplier: 0.5,
        avgRevenue: 15000,
        employeesCount: '1'
      },
      { 
        value: 'small', 
        label: 'Небольшой салон', 
        description: '2-5 мастеров, стандартные услуги',
        multiplier: 0.8,
        avgRevenue: 35000,
        employeesCount: '2-5'
      },
      { 
        value: 'medium', 
        label: 'Средний салон', 
        description: '5-15 мастеров, широкий спектр услуг',
        multiplier: 1.2,
        avgRevenue: 70000,
        employeesCount: '5-15'
      },
      { 
        value: 'large', 
        label: 'Крупный салон/СПА', 
        description: '15+ мастеров, премиум услуги',
        multiplier: 1.8,
        avgRevenue: 150000,
        employeesCount: '15-30'
      },
      { 
        value: 'network', 
        label: 'Сеть салонов', 
        description: 'Несколько точек, франшиза',
        multiplier: 2.8,
        avgRevenue: 400000,
        employeesCount: '30+'
      }
    ],
    
    // Диапазоны маркетинг-бюджетов по размерам (USD)
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
        { range: '1000-2500', value: 1750, label: '$1000-2500 (стартовый маркетинг)', effectiveness: 0.7 },
        { range: '2500-4000', value: 3250, label: '$2500-4000 (активное продвижение)', effectiveness: 0.85 },
        { range: '4000-6000', value: 5000, label: '$4000-6000 (профессиональный маркетинг)', effectiveness: 0.92 },
        { range: '6000-10000', value: 8000, label: '$6000-10000 (премиум продвижение)', effectiveness: 0.96 },
        { range: '10000+', value: 15000, label: '$10000+ (максимальное покрытие)', effectiveness: 0.99 }
      ],
      large: [
        { range: '3000-6000', value: 4500, label: '$3000-6000 (базовый маркетинг)', effectiveness: 0.75 },
        { range: '6000-10000', value: 8000, label: '$6000-10000 (активное продвижение)', effectiveness: 0.88 },
        { range: '10000-15000', value: 12500, label: '$10000-15000 (профессиональная команда)', effectiveness: 0.94 },
        { range: '15000-25000', value: 20000, label: '$15000-25000 (агентство + команда)', effectiveness: 0.97 },
        { range: '25000+', value: 40000, label: '$25000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ],
      network: [
        { range: '8000-20000', value: 14000, label: '$8000-20000 (базовый маркетинг сети)', effectiveness: 0.75 },
        { range: '20000-35000', value: 27500, label: '$20000-35000 (активное продвижение)', effectiveness: 0.88 },
        { range: '35000-50000', value: 42500, label: '$35000-50000 (профессиональная команда)', effectiveness: 0.94 },
        { range: '50000-80000', value: 65000, label: '$50000-80000 (агентство + команда)', effectiveness: 0.97 },
        { range: '80000+', value: 120000, label: '$80000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ]
    },
    
    // Коэффициенты для расчетов
    calculations: {
      marketerSalary: { 
        partTime: 1200, 
        fullTime: 2000, 
        senior: 3200, 
        team: 5000 
      },
      toolsMultiplier: 2.8, // Салоны активно используют CRM, системы записи
      avgRevenuePerCustomer: 85,
      seasonalityFactor: 1.1,
      competitiveIndex: 0.9,
      repeatCustomerRate: 0.78,
      conversionRate: 0.12,
      cpcRange: { min: 0.8, max: 4.0 },
      industryGrowthRate: 0.22
    },
    
    // Персонализированные сообщения
    personalizedMessages: {
      savingsMessage: "В beauty-индустрии 68% салонов тратят маркетинг-бюджет неэффективно",
      opportunityMessage: "Салоны с профессиональным digital-маркетингом увеличивают клиентскую базу на 55%",
      industryInsight: "Ключевые точки роста: онлайн-запись, программы лояльности, влияние в Instagram",
      toolsRecommendation: "Обязательно: CRM для записи клиентов, Instagram Business, программа лояльности",
      commonMistakes: "Частые ошибки: плохие фото работ, нет онлайн-записи, игнорирование отзывов"
    },
    
    // Industry benchmarks
    benchmarks: {
      avgMarketingSpend: 2200,
      avgROI: 4.1,
      digitalizationLevel: 0.75,
      customerAcquisitionCost: 45,
      avgOrderValue: 85,
      repeatVisitRate: 0.78
    }
  },

  retail: {
    // Базовая информация
    key: 'retail',
    displayName: 'Ритейл и торговля',
    icon: '🛍️',
    description: 'Магазины, интернет-магазины, маркетплейсы',
    examples: 'Продажи, конверсия, удержание клиентов',
    popular: true,
    searchTerms: ['магазин', 'торговля', 'ритейл', 'ecommerce', 'интернет-магазин', 'маркетплейс'],
    
    // Размеры бизнеса с multipliers
    sizeOptions: [
      { 
        value: 'micro', 
        label: 'Микро-бизнес', 
        description: 'Небольшой магазин, индивидуальный предприниматель',
        multiplier: 0.6,
        avgRevenue: 30000,
        employeesCount: '1-3'
      },
      { 
        value: 'small', 
        label: 'Небольшой магазин', 
        description: 'Локальная торговля, семейный бизнес',
        multiplier: 0.9,
        avgRevenue: 80000,
        employeesCount: '3-10'
      },
      { 
        value: 'medium', 
        label: 'Средний ритейл', 
        description: 'Несколько точек, онлайн + оффлайн',
        multiplier: 1.3,
        avgRevenue: 200000,
        employeesCount: '10-25'
      },
      { 
        value: 'large', 
        label: 'Крупный ритейл', 
        description: 'Сеть магазинов, крупный e-commerce',
        multiplier: 2.0,
        avgRevenue: 500000,
        employeesCount: '25-100'
      },
      { 
        value: 'enterprise', 
        label: 'Корпоративный ритейл', 
        description: 'Федеральные сети, маркетплейсы',
        multiplier: 3.5,
        avgRevenue: 1200000,
        employeesCount: '100+'
      }
    ],
    
    // Диапазоны маркетинг-бюджетов по размерам (USD)
    marketingBudgetRanges: {
      micro: [
        { range: '0-500', value: 250, label: '$0-500 (соцсети + минимальная реклама)', effectiveness: 0.6 },
        { range: '500-1000', value: 750, label: '$500-1000 (таргетированная реклама)', effectiveness: 0.75 },
        { range: '1000-2000', value: 1500, label: '$1000-2000 (комплексное продвижение)', effectiveness: 0.85 },
        { range: '2000-3000', value: 2500, label: '$2000-3000 (профессиональный маркетинг)', effectiveness: 0.9 },
        { range: '3000+', value: 4000, label: '$3000+ (максимальное покрытие)', effectiveness: 0.95 }
      ],
      small: [
        { range: '800-2000', value: 1400, label: '$800-2000 (базовый маркетинг)', effectiveness: 0.65 },
        { range: '2000-4000', value: 3000, label: '$2000-4000 (активное продвижение)', effectiveness: 0.8 },
        { range: '4000-7000', value: 5500, label: '$4000-7000 (комплексный маркетинг)', effectiveness: 0.9 },
        { range: '7000-12000', value: 9500, label: '$7000-12000 (профессиональная команда)', effectiveness: 0.95 },
        { range: '12000+', value: 18000, label: '$12000+ (агентство + внутренняя команда)', effectiveness: 0.98 }
      ],
      medium: [
        { range: '3000-7000', value: 5000, label: '$3000-7000 (стартовый маркетинг)', effectiveness: 0.7 },
        { range: '7000-12000', value: 9500, label: '$7000-12000 (активное продвижение)', effectiveness: 0.85 },
        { range: '12000-20000', value: 16000, label: '$12000-20000 (профессиональный маркетинг)', effectiveness: 0.92 },
        { range: '20000-35000', value: 27500, label: '$20000-35000 (премиум продвижение)', effectiveness: 0.96 },
        { range: '35000+', value: 50000, label: '$35000+ (максимальное покрытие)', effectiveness: 0.99 }
      ],
      large: [
        { range: '10000-25000', value: 17500, label: '$10000-25000 (базовый маркетинг)', effectiveness: 0.75 },
        { range: '25000-40000', value: 32500, label: '$25000-40000 (активное продвижение)', effectiveness: 0.88 },
        { range: '40000-60000', value: 50000, label: '$40000-60000 (профессиональная команда)', effectiveness: 0.94 },
        { range: '60000-100000', value: 80000, label: '$60000-100000 (агентство + команда)', effectiveness: 0.97 },
        { range: '100000+', value: 150000, label: '$100000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ],
      enterprise: [
        { range: '25000-60000', value: 42500, label: '$25000-60000 (базовый корпоративный маркетинг)', effectiveness: 0.78 },
        { range: '60000-100000', value: 80000, label: '$60000-100000 (активное продвижение)', effectiveness: 0.9 },
        { range: '100000-150000', value: 125000, label: '$100000-150000 (профессиональная команда)', effectiveness: 0.95 },
        { range: '150000-250000', value: 200000, label: '$150000-250000 (агентство + команда)', effectiveness: 0.98 },
        { range: '250000+', value: 400000, label: '$250000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ]
    },
    
    // Коэффициенты для расчетов
    calculations: {
      marketerSalary: { 
        partTime: 1100, 
        fullTime: 1900, 
        senior: 3000, 
        team: 4800 
      },
      toolsMultiplier: 3.2, // Ритейл требует много инструментов
      avgRevenuePerCustomer: 65,
      seasonalityFactor: 1.4,
      competitiveIndex: 0.95,
      repeatCustomerRate: 0.45,
      conversionRate: 0.06,
      cpcRange: { min: 0.3, max: 3.0 },
      industryGrowthRate: 0.18
    },
    
    // Персонализированные сообщения
    personalizedMessages: {
      savingsMessage: "В ритейле 81% компаний тратят маркетинг-бюджет неэффективно",
      opportunityMessage: "Ритейлеры с профессиональным digital-маркетингом увеличивают продажи на 47%",
      industryInsight: "Ключевые точки роста: конверсия сайта, retention маркетинг, персонализация",
      toolsRecommendation: "Обязательно: CRM, email-автоматизация, веб-аналитика, ретаргетинг",
      commonMistakes: "Частые ошибки: плохая конверсия сайта, отсутствие ретаргетинга, игнорирование retention"
    },
    
    // Industry benchmarks
    benchmarks: {
      avgMarketingSpend: 5200,
      avgROI: 2.8,
      digitalizationLevel: 0.85,
      customerAcquisitionCost: 35,
      avgOrderValue: 65,
      repeatVisitRate: 0.45
    }
  },

  services: {
    // Базовая информация
    key: 'services',
    displayName: 'Услуги',
    icon: '🏥',
    description: 'Медицина, образование, консалтинг, ремонт',
    examples: 'Поиск клиентов, доверие, экспертность',
    popular: true,
    searchTerms: ['медицина', 'образование', 'консалтинг', 'услуги', 'ремонт', 'стоматология'],
    
    // Размеры бизнеса с multipliers
    sizeOptions: [
      { 
        value: 'solo', 
        label: 'Индивидуальный специалист', 
        description: 'Врач, юрист, консультант',
        multiplier: 0.6,
        avgRevenue: 40000,
        employeesCount: '1'
      },
      { 
        value: 'small', 
        label: 'Небольшая клиника/студия', 
        description: '2-5 специалистов',
        multiplier: 0.9,
        avgRevenue: 90000,
        employeesCount: '2-5'
      },
      { 
        value: 'medium', 
        label: 'Средняя клиника/центр', 
        description: '5-15 специалистов',
        multiplier: 1.4,
        avgRevenue: 200000,
        employeesCount: '5-15'
      },
      { 
        value: 'large', 
        label: 'Крупная клиника/центр', 
        description: '15+ специалистов, несколько направлений',
        multiplier: 2.1,
        avgRevenue: 450000,
        employeesCount: '15-50'
      },
      { 
        value: 'network', 
        label: 'Сеть клиник/центров', 
        description: 'Несколько точек, федеральная сеть',
        multiplier: 3.2,
        avgRevenue: 800000,
        employeesCount: '50+'
      }
    ],
    
    // Диапазоны маркетинг-бюджетов по размерам (USD)
    marketingBudgetRanges: {
      solo: [
        { range: '0-800', value: 400, label: '$0-800 (соцсети + минимальная реклама)', effectiveness: 0.65 },
        { range: '800-1500', value: 1150, label: '$800-1500 (таргетированная реклама)', effectiveness: 0.78 },
        { range: '1500-2500', value: 2000, label: '$1500-2500 (комплексное продвижение)', effectiveness: 0.88 },
        { range: '2500-4000', value: 3250, label: '$2500-4000 (профессиональный маркетинг)', effectiveness: 0.92 },
        { range: '4000+', value: 6000, label: '$4000+ (максимальное покрытие)', effectiveness: 0.96 }
      ],
      small: [
        { range: '1000-2500', value: 1750, label: '$1000-2500 (базовый маркетинг)', effectiveness: 0.7 },
        { range: '2500-5000', value: 3750, label: '$2500-5000 (активное продвижение)', effectiveness: 0.82 },
        { range: '5000-8000', value: 6500, label: '$5000-8000 (комплексный маркетинг)', effectiveness: 0.9 },
        { range: '8000-12000', value: 10000, label: '$8000-12000 (профессиональная команда)', effectiveness: 0.95 },
        { range: '12000+', value: 18000, label: '$12000+ (агентство + внутренняя команда)', effectiveness: 0.98 }
      ],
      medium: [
        { range: '3000-8000', value: 5500, label: '$3000-8000 (стартовый маркетинг)', effectiveness: 0.72 },
        { range: '8000-15000', value: 11500, label: '$8000-15000 (активное продвижение)', effectiveness: 0.86 },
        { range: '15000-25000', value: 20000, label: '$15000-25000 (профессиональный маркетинг)', effectiveness: 0.93 },
        { range: '25000-40000', value: 32500, label: '$25000-40000 (премиум продвижение)', effectiveness: 0.97 },
        { range: '40000+', value: 60000, label: '$40000+ (максимальное покрытие)', effectiveness: 0.99 }
      ],
      large: [
        { range: '8000-20000', value: 14000, label: '$8000-20000 (базовый маркетинг)', effectiveness: 0.75 },
        { range: '20000-35000', value: 27500, label: '$20000-35000 (активное продвижение)', effectiveness: 0.88 },
        { range: '35000-55000', value: 45000, label: '$35000-55000 (профессиональная команда)', effectiveness: 0.94 },
        { range: '55000-80000', value: 67500, label: '$55000-80000 (агентство + команда)', effectiveness: 0.97 },
        { range: '80000+', value: 120000, label: '$80000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ],
      network: [
        { range: '20000-50000', value: 35000, label: '$20000-50000 (базовый маркетинг сети)', effectiveness: 0.78 },
        { range: '50000-80000', value: 65000, label: '$50000-80000 (активное продвижение)', effectiveness: 0.9 },
        { range: '80000-120000', value: 100000, label: '$80000-120000 (профессиональная команда)', effectiveness: 0.95 },
        { range: '120000-200000', value: 160000, label: '$120000-200000 (агентство + команда)', effectiveness: 0.98 },
        { range: '200000+', value: 300000, label: '$200000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ]
    },
    
    // Коэффициенты для расчетов
    calculations: {
      marketerSalary: { 
        partTime: 1300, 
        fullTime: 2200, 
        senior: 3500, 
        team: 5500 
      },
      toolsMultiplier: 2.1, // Услуги требуют CRM, но не так много инструментов
      avgRevenuePerCustomer: 250,
      seasonalityFactor: 1.05,
      competitiveIndex: 0.7,
      repeatCustomerRate: 0.85,
      conversionRate: 0.15,
      cpcRange: { min: 1.2, max: 8.0 },
      industryGrowthRate: 0.12
    },
    
    // Персонализированные сообщения
    personalizedMessages: {
      savingsMessage: "В сфере услуг 76% компаний тратят маркетинг-бюджет неэффективно",
      opportunityMessage: "Сервисные компании с профессиональным маркетингом увеличивают клиентскую базу на 65%",
      industryInsight: "Ключевые точки роста: экспертность, доверие, отзывы, репутация",
      toolsRecommendation: "Обязательно: CRM, управление репутацией, контент-маркетинг, email-автоматизация",
      commonMistakes: "Частые ошибки: слабая экспертность, мало отзывов, нет системы CRM"
    },
    
    // Industry benchmarks
    benchmarks: {
      avgMarketingSpend: 4800,
      avgROI: 5.2,
      digitalizationLevel: 0.65,
      customerAcquisitionCost: 120,
      avgOrderValue: 250,
      repeatVisitRate: 0.85
    }
  },

  b2b: {
    // Базовая информация
    key: 'b2b',
    displayName: 'B2B сфера',
    icon: '🏗️',
    description: 'Производство, логистика, IT, оборудование',
    examples: 'Лидогенерация, длинный цикл продаж, экспертность',
    popular: false,
    searchTerms: ['производство', 'логистика', 'it', 'b2b', 'оборудование', 'промышленность'],
    
    // Размеры бизнеса с multipliers
    sizeOptions: [
      { 
        value: 'startup', 
        label: 'Стартап/малый бизнес', 
        description: 'До 10 сотрудников, локальный рынок',
        multiplier: 0.7,
        avgRevenue: 150000,
        employeesCount: '1-10'
      },
      { 
        value: 'small', 
        label: 'Малый B2B бизнес', 
        description: '10-50 сотрудников, региональный рынок',
        multiplier: 1.0,
        avgRevenue: 500000,
        employeesCount: '10-50'
      },
      { 
        value: 'medium', 
        label: 'Средний B2B бизнес', 
        description: '50-200 сотрудников, межрегиональный рынок',
        multiplier: 1.6,
        avgRevenue: 1200000,
        employeesCount: '50-200'
      },
      { 
        value: 'large', 
        label: 'Крупный B2B бизнес', 
        description: '200+ сотрудников, федеральный рынок',
        multiplier: 2.4,
        avgRevenue: 3000000,
        employeesCount: '200-500'
      },
      { 
        value: 'enterprise', 
        label: 'Корпоративный B2B', 
        description: '500+ сотрудников, международный рынок',
        multiplier: 3.8,
        avgRevenue: 8000000,
        employeesCount: '500+'
      }
    ],
    
    // Диапазоны маркетинг-бюджетов по размерам (USD)
    marketingBudgetRanges: {
      startup: [
        { range: '1000-3000', value: 2000, label: '$1000-3000 (контент + минимальная реклама)', effectiveness: 0.65 },
        { range: '3000-6000', value: 4500, label: '$3000-6000 (контент + лидогенерация)', effectiveness: 0.78 },
        { range: '6000-10000', value: 8000, label: '$6000-10000 (комплексный маркетинг)', effectiveness: 0.85 },
        { range: '10000-15000', value: 12500, label: '$10000-15000 (профессиональный маркетинг)', effectiveness: 0.9 },
        { range: '15000+', value: 20000, label: '$15000+ (максимальное покрытие)', effectiveness: 0.94 }
      ],
      small: [
        { range: '5000-12000', value: 8500, label: '$5000-12000 (базовый B2B маркетинг)', effectiveness: 0.7 },
        { range: '12000-20000', value: 16000, label: '$12000-20000 (активная лидогенерация)', effectiveness: 0.82 },
        { range: '20000-30000', value: 25000, label: '$20000-30000 (комплексный маркетинг)', effectiveness: 0.88 },
        { range: '30000-45000', value: 37500, label: '$30000-45000 (профессиональная команда)', effectiveness: 0.93 },
        { range: '45000+', value: 65000, label: '$45000+ (агентство + внутренняя команда)', effectiveness: 0.97 }
      ],
      medium: [
        { range: '15000-35000', value: 25000, label: '$15000-35000 (стартовый маркетинг)', effectiveness: 0.72 },
        { range: '35000-60000', value: 47500, label: '$35000-60000 (активное продвижение)', effectiveness: 0.85 },
        { range: '60000-90000', value: 75000, label: '$60000-90000 (профессиональный маркетинг)', effectiveness: 0.91 },
        { range: '90000-130000', value: 110000, label: '$90000-130000 (премиум продвижение)', effectiveness: 0.95 },
        { range: '130000+', value: 180000, label: '$130000+ (максимальное покрытие)', effectiveness: 0.98 }
      ],
      large: [
        { range: '40000-80000', value: 60000, label: '$40000-80000 (базовый корпоративный маркетинг)', effectiveness: 0.75 },
        { range: '80000-130000', value: 105000, label: '$80000-130000 (активное продвижение)', effectiveness: 0.87 },
        { range: '130000-200000', value: 165000, label: '$130000-200000 (профессиональная команда)', effectiveness: 0.93 },
        { range: '200000-300000', value: 250000, label: '$200000-300000 (агентство + команда)', effectiveness: 0.96 },
        { range: '300000+', value: 450000, label: '$300000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ],
      enterprise: [
        { range: '100000-200000', value: 150000, label: '$100000-200000 (базовый корпоративный маркетинг)', effectiveness: 0.78 },
        { range: '200000-350000', value: 275000, label: '$200000-350000 (активное продвижение)', effectiveness: 0.89 },
        { range: '350000-500000', value: 425000, label: '$350000-500000 (профессиональная команда)', effectiveness: 0.94 },
        { range: '500000-800000', value: 650000, label: '$500000-800000 (агентство + команда)', effectiveness: 0.97 },
        { range: '800000+', value: 1200000, label: '$800000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ]
    },
    
    // Коэффициенты для расчетов
    calculations: {
      marketerSalary: { 
        partTime: 1800, 
        fullTime: 3200, 
        senior: 4800, 
        team: 7500 
      },
      toolsMultiplier: 4.2, // B2B требует много специализированных инструментов
      avgRevenuePerCustomer: 25000,
      seasonalityFactor: 1.08,
      competitiveIndex: 0.6,
      repeatCustomerRate: 0.92,
      conversionRate: 0.04,
      cpcRange: { min: 2.5, max: 25.0 },
      industryGrowthRate: 0.19
    },
    
    // Персонализированные сообщения
    personalizedMessages: {
      savingsMessage: "В B2B сфере 84% компаний тратят маркетинг-бюджет неэффективно",
      opportunityMessage: "B2B компании с профессиональным маркетингом увеличивают лидогенерацию на 78%",
      industryInsight: "Ключевые точки роста: контент-маркетинг, лидогенерация, экспертность, нетворкинг",
      toolsRecommendation: "Обязательно: CRM, маркетинг-автоматизация, аналитика, контент-платформа",
      commonMistakes: "Частые ошибки: слабый контент, нет lead nurturing, игнорирование аналитики"
    },
    
    // Industry benchmarks
    benchmarks: {
      avgMarketingSpend: 85000,
      avgROI: 6.8,
      digitalizationLevel: 0.78,
      customerAcquisitionCost: 1200,
      avgOrderValue: 25000,
      repeatVisitRate: 0.92
    }
  },

  realestate: {
    // Базовая информация
    key: 'realestate',
    displayName: 'Недвижимость',
    icon: '🏠',
    description: 'Агентства, девелопмент, аренда, управление',
    examples: 'Продажи объектов, доверие, геотаргетинг',
    popular: false,
    searchTerms: ['недвижимость', 'агентство', 'девелопмент', 'аренда', 'квартиры', 'дома'],
    
    // Размеры бизнеса с multipliers
    sizeOptions: [
      { 
        value: 'solo', 
        label: 'Индивидуальный агент', 
        description: 'Риелтор-индивидуал',
        multiplier: 0.5,
        avgRevenue: 80000,
        employeesCount: '1'
      },
      { 
        value: 'small', 
        label: 'Небольшое агентство', 
        description: '2-10 агентов',
        multiplier: 0.8,
        avgRevenue: 200000,
        employeesCount: '2-10'
      },
      { 
        value: 'medium', 
        label: 'Среднее агентство', 
        description: '10-30 агентов, несколько офисов',
        multiplier: 1.3,
        avgRevenue: 500000,
        employeesCount: '10-30'
      },
      { 
        value: 'large', 
        label: 'Крупное агентство', 
        description: '30+ агентов, региональная сеть',
        multiplier: 2.0,
        avgRevenue: 1200000,
        employeesCount: '30-100'
      },
      { 
        value: 'developer', 
        label: 'Девелопер', 
        description: 'Строительство и продажа недвижимости',
        multiplier: 3.5,
        avgRevenue: 5000000,
        employeesCount: '50+'
      }
    ],
    
    // Диапазоны маркетинг-бюджетов по размерам (USD)
    marketingBudgetRanges: {
      solo: [
        { range: '500-1500', value: 1000, label: '$500-1500 (соцсети + минимальная реклама)', effectiveness: 0.65 },
        { range: '1500-3000', value: 2250, label: '$1500-3000 (таргетированная реклама)', effectiveness: 0.78 },
        { range: '3000-5000', value: 4000, label: '$3000-5000 (комплексное продвижение)', effectiveness: 0.85 },
        { range: '5000-8000', value: 6500, label: '$5000-8000 (профессиональный маркетинг)', effectiveness: 0.9 },
        { range: '8000+', value: 12000, label: '$8000+ (максимальное покрытие)', effectiveness: 0.95 }
      ],
      small: [
        { range: '2000-5000', value: 3500, label: '$2000-5000 (базовый маркетинг)', effectiveness: 0.7 },
        { range: '5000-10000', value: 7500, label: '$5000-10000 (активное продвижение)', effectiveness: 0.82 },
        { range: '10000-18000', value: 14000, label: '$10000-18000 (комплексный маркетинг)', effectiveness: 0.88 },
        { range: '18000-30000', value: 24000, label: '$18000-30000 (профессиональная команда)', effectiveness: 0.93 },
        { range: '30000+', value: 45000, label: '$30000+ (агентство + внутренняя команда)', effectiveness: 0.97 }
      ],
      medium: [
        { range: '8000-18000', value: 13000, label: '$8000-18000 (стартовый маркетинг)', effectiveness: 0.72 },
        { range: '18000-30000', value: 24000, label: '$18000-30000 (активное продвижение)', effectiveness: 0.85 },
        { range: '30000-50000', value: 40000, label: '$30000-50000 (профессиональный маркетинг)', effectiveness: 0.91 },
        { range: '50000-80000', value: 65000, label: '$50000-80000 (премиум продвижение)', effectiveness: 0.95 },
        { range: '80000+', value: 120000, label: '$80000+ (максимальное покрытие)', effectiveness: 0.98 }
      ],
      large: [
        { range: '20000-40000', value: 30000, label: '$20000-40000 (базовый корпоративный маркетинг)', effectiveness: 0.75 },
        { range: '40000-70000', value: 55000, label: '$40000-70000 (активное продвижение)', effectiveness: 0.87 },
        { range: '70000-100000', value: 85000, label: '$70000-100000 (профессиональная команда)', effectiveness: 0.93 },
        { range: '100000-150000', value: 125000, label: '$100000-150000 (агентство + команда)', effectiveness: 0.96 },
        { range: '150000+', value: 220000, label: '$150000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ],
      developer: [
        { range: '50000-100000', value: 75000, label: '$50000-100000 (базовый девелоперский маркетинг)', effectiveness: 0.78 },
        { range: '100000-200000', value: 150000, label: '$100000-200000 (активное продвижение)', effectiveness: 0.89 },
        { range: '200000-350000', value: 275000, label: '$200000-350000 (профессиональная команда)', effectiveness: 0.94 },
        { range: '350000-500000', value: 425000, label: '$350000-500000 (агентство + команда)', effectiveness: 0.97 },
        { range: '500000+', value: 750000, label: '$500000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ]
    },
    
    // Коэффициенты для расчетов
    calculations: {
      marketerSalary: { 
        partTime: 1400, 
        fullTime: 2300, 
        senior: 3600, 
        team: 5800 
      },
      toolsMultiplier: 2.8, // Недвижимость требует CRM, аналитики, визуализации
      avgRevenuePerCustomer: 8500,
      seasonalityFactor: 1.15,
      competitiveIndex: 0.85,
      repeatCustomerRate: 0.25,
      conversionRate: 0.02,
      cpcRange: { min: 1.5, max: 12.0 },
      industryGrowthRate: 0.08
    },
    
    // Персонализированные сообщения
    personalizedMessages: {
      savingsMessage: "В сфере недвижимости 79% агентств тратят маркетинг-бюджет неэффективно",
      opportunityMessage: "Агентства с профессиональным маркетингом увеличивают продажи на 52%",
      industryInsight: "Ключевые точки роста: геотаргетинг, визуализация, доверие, отзывы",
      toolsRecommendation: "Обязательно: CRM, геотаргетинг, виртуальные туры, управление репутацией",
      commonMistakes: "Частые ошибки: плохие фото объектов, слабый геотаргетинг, нет виртуальных туров"
    },
    
    // Industry benchmarks
    benchmarks: {
      avgMarketingSpend: 25000,
      avgROI: 4.5,
      digitalizationLevel: 0.68,
      customerAcquisitionCost: 850,
      avgOrderValue: 8500,
      repeatVisitRate: 0.25
    }
  },

  finance: {
    // Базовая информация
    key: 'finance',
    displayName: 'Финансы',
    icon: '💼',
    description: 'Банки, страхование, инвестиции, кредиты',
    examples: 'Привлечение клиентов, доверие, финансовая грамотность',
    popular: false,
    searchTerms: ['банк', 'финансы', 'страхование', 'кредит', 'инвестиции', 'займы'],
    
    // Размеры бизнеса с multipliers
    sizeOptions: [
      { 
        value: 'advisor', 
        label: 'Финансовый консультант', 
        description: 'Индивидуальный финансовый советник',
        multiplier: 0.6,
        avgRevenue: 120000,
        employeesCount: '1-2'
      },
      { 
        value: 'small', 
        label: 'Небольшая финансовая компания', 
        description: 'Брокерская, кредитная организация',
        multiplier: 1.0,
        avgRevenue: 350000,
        employeesCount: '3-15'
      },
      { 
        value: 'medium', 
        label: 'Средняя финансовая компания', 
        description: 'Региональный банк, страховая компания',
        multiplier: 1.7,
        avgRevenue: 900000,
        employeesCount: '15-50'
      },
      { 
        value: 'large', 
        label: 'Крупная финансовая компания', 
        description: 'Федеральный банк, крупная страховая',
        multiplier: 2.8,
        avgRevenue: 2500000,
        employeesCount: '50-200'
      },
      { 
        value: 'enterprise', 
        label: 'Корпоративные финансы', 
        description: 'Системообразующий банк, госкорпорация',
        multiplier: 4.5,
        avgRevenue: 10000000,
        employeesCount: '200+'
      }
    ],
    
    // Диапазоны маркетинг-бюджетов по размерам (USD)
    marketingBudgetRanges: {
      advisor: [
        { range: '1000-3000', value: 2000, label: '$1000-3000 (контент + минимальная реклама)', effectiveness: 0.65 },
        { range: '3000-6000', value: 4500, label: '$3000-6000 (таргетированная реклама)', effectiveness: 0.78 },
        { range: '6000-10000', value: 8000, label: '$6000-10000 (комплексное продвижение)', effectiveness: 0.85 },
        { range: '10000-15000', value: 12500, label: '$10000-15000 (профессиональный маркетинг)', effectiveness: 0.9 },
        { range: '15000+', value: 20000, label: '$15000+ (максимальное покрытие)', effectiveness: 0.95 }
      ],
      small: [
        { range: '5000-12000', value: 8500, label: '$5000-12000 (базовый маркетинг)', effectiveness: 0.7 },
        { range: '12000-25000', value: 18500, label: '$12000-25000 (активное продвижение)', effectiveness: 0.82 },
        { range: '25000-40000', value: 32500, label: '$25000-40000 (комплексный маркетинг)', effectiveness: 0.88 },
        { range: '40000-60000', value: 50000, label: '$40000-60000 (профессиональная команда)', effectiveness: 0.93 },
        { range: '60000+', value: 85000, label: '$60000+ (агентство + внутренняя команда)', effectiveness: 0.97 }
      ],
      medium: [
        { range: '20000-45000', value: 32500, label: '$20000-45000 (стартовый маркетинг)', effectiveness: 0.72 },
        { range: '45000-80000', value: 62500, label: '$45000-80000 (активное продвижение)', effectiveness: 0.85 },
        { range: '80000-120000', value: 100000, label: '$80000-120000 (профессиональный маркетинг)', effectiveness: 0.91 },
        { range: '120000-180000', value: 150000, label: '$120000-180000 (премиум продвижение)', effectiveness: 0.95 },
        { range: '180000+', value: 250000, label: '$180000+ (максимальное покрытие)', effectiveness: 0.98 }
      ],
      large: [
        { range: '80000-150000', value: 115000, label: '$80000-150000 (базовый корпоративный маркетинг)', effectiveness: 0.75 },
        { range: '150000-250000', value: 200000, label: '$150000-250000 (активное продвижение)', effectiveness: 0.87 },
        { range: '250000-400000', value: 325000, label: '$250000-400000 (профессиональная команда)', effectiveness: 0.93 },
        { range: '400000-600000', value: 500000, label: '$400000-600000 (агентство + команда)', effectiveness: 0.96 },
        { range: '600000+', value: 850000, label: '$600000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ],
      enterprise: [
        { range: '200000-400000', value: 300000, label: '$200000-400000 (базовый корпоративный маркетинг)', effectiveness: 0.78 },
        { range: '400000-700000', value: 550000, label: '$400000-700000 (активное продвижение)', effectiveness: 0.89 },
        { range: '700000-1000000', value: 850000, label: '$700000-1000000 (профессиональная команда)', effectiveness: 0.94 },
        { range: '1000000-1500000', value: 1250000, label: '$1000000-1500000 (агентство + команда)', effectiveness: 0.97 },
        { range: '1500000+', value: 2000000, label: '$1500000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ]
    },
    
    // Коэффициенты для расчетов
    calculations: {
      marketerSalary: { 
        partTime: 2000, 
        fullTime: 3500, 
        senior: 5200, 
        team: 8500 
      },
      toolsMultiplier: 3.8, // Финансы требуют много специализированного софта
      avgRevenuePerCustomer: 1200,
      seasonalityFactor: 1.02,
      competitiveIndex: 0.95,
      repeatCustomerRate: 0.88,
      conversionRate: 0.03,
      cpcRange: { min: 3.0, max: 35.0 },
      industryGrowthRate: 0.06
    },
    
    // Персонализированные сообщения
    personalizedMessages: {
      savingsMessage: "В финансовой сфере 87% компаний тратят маркетинг-бюджет неэффективно",
      opportunityMessage: "Финансовые компании с профессиональным маркетингом увеличивают клиентскую базу на 43%",
      industryInsight: "Ключевые точки роста: доверие, экспертность, персонализация, обучение клиентов",
      toolsRecommendation: "Обязательно: CRM, маркетинг-автоматизация, контент-платформа, аналитика",
      commonMistakes: "Частые ошибки: сложный язык, слабое доверие, нет персонализации"
    },
    
    // Industry benchmarks
    benchmarks: {
      avgMarketingSpend: 180000,
      avgROI: 3.8,
      digitalizationLevel: 0.92,
      customerAcquisitionCost: 450,
      avgOrderValue: 1200,
      repeatVisitRate: 0.88
    }
  },

  other: {
    // Базовая информация
    key: 'other',
    displayName: 'Другое',
    icon: '🎯',
    description: 'Укажите вашу отрасль',
    examples: 'Индивидуальный подход и персонализация',
    popular: false,
    searchTerms: ['другое', 'прочее', 'иное', 'специфическое'],
    customInput: true,
    
    // Размеры бизнеса с multipliers (универсальные)
    sizeOptions: [
      { 
        value: 'micro', 
        label: 'Микро-бизнес', 
        description: '1-5 сотрудников',
        multiplier: 0.6,
        avgRevenue: 50000,
        employeesCount: '1-5'
      },
      { 
        value: 'small', 
        label: 'Малый бизнес', 
        description: '5-20 сотрудников',
        multiplier: 0.9,
        avgRevenue: 150000,
        employeesCount: '5-20'
      },
      { 
        value: 'medium', 
        label: 'Средний бизнес', 
        description: '20-100 сотрудников',
        multiplier: 1.3,
        avgRevenue: 400000,
        employeesCount: '20-100'
      },
      { 
        value: 'large', 
        label: 'Крупный бизнес', 
        description: '100+ сотрудников',
        multiplier: 2.0,
        avgRevenue: 1000000,
        employeesCount: '100+'
      }
    ],
    
    // Диапазоны маркетинг-бюджетов по размерам (USD) - универсальные
    marketingBudgetRanges: {
      micro: [
        { range: '0-1000', value: 500, label: '$0-1000 (минимальный маркетинг)', effectiveness: 0.6 },
        { range: '1000-2500', value: 1750, label: '$1000-2500 (базовое продвижение)', effectiveness: 0.75 },
        { range: '2500-5000', value: 3750, label: '$2500-5000 (активный маркетинг)', effectiveness: 0.85 },
        { range: '5000-8000', value: 6500, label: '$5000-8000 (профессиональный маркетинг)', effectiveness: 0.9 },
        { range: '8000+', value: 12000, label: '$8000+ (максимальное покрытие)', effectiveness: 0.95 }
      ],
      small: [
        { range: '1000-5000', value: 3000, label: '$1000-5000 (базовый маркетинг)', effectiveness: 0.65 },
        { range: '5000-10000', value: 7500, label: '$5000-10000 (активное продвижение)', effectiveness: 0.8 },
        { range: '10000-18000', value: 14000, label: '$10000-18000 (комплексный маркетинг)', effectiveness: 0.9 },
        { range: '18000-30000', value: 24000, label: '$18000-30000 (профессиональная команда)', effectiveness: 0.95 },
        { range: '30000+', value: 45000, label: '$30000+ (агентство + внутренняя команда)', effectiveness: 0.98 }
      ],
      medium: [
        { range: '5000-15000', value: 10000, label: '$5000-15000 (стартовый маркетинг)', effectiveness: 0.7 },
        { range: '15000-30000', value: 22500, label: '$15000-30000 (активное продвижение)', effectiveness: 0.85 },
        { range: '30000-50000', value: 40000, label: '$30000-50000 (профессиональный маркетинг)', effectiveness: 0.92 },
        { range: '50000-80000', value: 65000, label: '$50000-80000 (премиум продвижение)', effectiveness: 0.96 },
        { range: '80000+', value: 120000, label: '$80000+ (максимальное покрытие)', effectiveness: 0.99 }
      ],
      large: [
        { range: '20000-50000', value: 35000, label: '$20000-50000 (базовый корпоративный маркетинг)', effectiveness: 0.75 },
        { range: '50000-100000', value: 75000, label: '$50000-100000 (активное продвижение)', effectiveness: 0.88 },
        { range: '100000-150000', value: 125000, label: '$100000-150000 (профессиональная команда)', effectiveness: 0.94 },
        { range: '150000-250000', value: 200000, label: '$150000-250000 (агентство + команда)', effectiveness: 0.97 },
        { range: '250000+', value: 400000, label: '$250000+ (корпоративный маркетинг)', effectiveness: 0.99 }
      ]
    },
    
    // Коэффициенты для расчетов (универсальные)
    calculations: {
      marketerSalary: { 
        partTime: 1200, 
        fullTime: 2000, 
        senior: 3200, 
        team: 5000 
      },
      toolsMultiplier: 2.5, // Средний показатель
      avgRevenuePerCustomer: 150,
      seasonalityFactor: 1.1,
      competitiveIndex: 0.75,
      repeatCustomerRate: 0.6,
      conversionRate: 0.08,
      cpcRange: { min: 0.8, max: 5.0 },
      industryGrowthRate: 0.15
    },
    
    // Персонализированные сообщения
    personalizedMessages: {
      savingsMessage: "В большинстве отраслей 75% компаний тратят маркетинг-бюджет неэффективно",
      opportunityMessage: "Компании с профессиональным маркетингом увеличивают продажи на 40%",
      industryInsight: "Ключевые точки роста: персонализация, аналитика, автоматизация, клиентский опыт",
      toolsRecommendation: "Обязательно: CRM, веб-аналитика, email-маркетинг, социальные сети",
      commonMistakes: "Частые ошибки: отсутствие стратегии, слабая аналитика, игнорирование клиентского опыта"
    },
    
    // Industry benchmarks (средние показатели)
    benchmarks: {
      avgMarketingSpend: 15000,
      avgROI: 3.5,
      digitalizationLevel: 0.7,
      customerAcquisitionCost: 80,
      avgOrderValue: 150,
      repeatVisitRate: 0.6
    }
  }
};

/**
 * Список популярных отраслей
 * @type {Array}
 */
export const POPULAR_INDUSTRIES = ['restaurant', 'beauty', 'retail', 'services'];

/**
 * Список всех доступных отраслей
 * @type {Array}
 */
export const ALL_INDUSTRIES = Object.keys(INDUSTRY_CONFIG);

/**
 * Константы для расчетов
 * @type {Object}
 */
export const CALCULATION_CONSTANTS = {
  // Глобальные мультипликаторы
  GLOBAL_MULTIPLIERS: {
    INFLATION_RATE: 1.08,
    MARKET_GROWTH_RATE: 1.15,
    DIGITAL_TRANSFORMATION_BONUS: 1.25
  },
  
  // Диапазоны эффективности
  EFFECTIVENESS_RANGES: {
    POOR: { min: 0.4, max: 0.6 },
    FAIR: { min: 0.6, max: 0.75 },
    GOOD: { min: 0.75, max: 0.9 },
    EXCELLENT: { min: 0.9, max: 1.0 }
  },
  
  // Типы маркетологов и их стоимость
  MARKETER_TYPES: {
    PART_TIME: 'partTime',
    FULL_TIME: 'fullTime',  
    SENIOR: 'senior',
    TEAM: 'team'
  },
  
  // Размеры бизнеса
  BUSINESS_SIZES: {
    MICRO: ['micro', 'solo'],
    SMALL: ['small'],
    MEDIUM: ['medium'],
    LARGE: ['large'],
    ENTERPRISE: ['enterprise', 'chain', 'network', 'developer']
  }
};

/**
 * Функция для получения конфигурации отрасли
 * @param {string} industryKey - Ключ отрасли
 * @returns {Object|null} Конфигурация отрасли или null
 */
export function getIndustryConfig(industryKey) {
  return INDUSTRY_CONFIG[industryKey] || null;
}

/**
 * Функция для получения всех отраслей
 * @returns {Object} Все конфигурации отраслей
 */
export function getAllIndustries() {
  return INDUSTRY_CONFIG;
}

/**
 * Функция для получения популярных отраслей
 * @returns {Array} Массив популярных отраслей
 */
export function getPopularIndustries() {
  return POPULAR_INDUSTRIES.map(key => INDUSTRY_CONFIG[key]).filter(Boolean);
}

/**
 * Функция для валидации конфигурации
 * @returns {Object} Результат валидации
 */
export function validateIndustryConfig() {
  const errors = [];
  const warnings = [];
  
  for (const [key, config] of Object.entries(INDUSTRY_CONFIG)) {
    // Проверка обязательных полей
    const requiredFields = ['key', 'displayName', 'icon', 'description', 'sizeOptions', 'marketingBudgetRanges', 'calculations'];
    
    for (const field of requiredFields) {
      if (!config[field]) {
        errors.push(`Missing required field '${field}' in industry '${key}'`);
      }
    }
    
    // Проверка размеров бизнеса
    if (config.sizeOptions && config.sizeOptions.length < 2) {
      warnings.push(`Industry '${key}' has less than 2 business size options`);
    }
    
    // Проверка бюджетных диапазонов
    if (config.marketingBudgetRanges) {
      for (const [size, ranges] of Object.entries(config.marketingBudgetRanges)) {
        if (!ranges || ranges.length < 3) {
          warnings.push(`Industry '${key}' size '${size}' has less than 3 budget ranges`);
        }
      }
    }
    
    // Проверка коэффициентов
    if (config.calculations) {
      const requiredCalcFields = ['marketerSalary', 'toolsMultiplier', 'avgRevenuePerCustomer'];
      for (const field of requiredCalcFields) {
        if (!config.calculations[field]) {
          errors.push(`Missing calculation field '${field}' in industry '${key}'`);
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalIndustries: Object.keys(INDUSTRY_CONFIG).length
  };
}

// Автоматическая валидация при загрузке модуля
if (typeof window !== 'undefined') {
  const validation = validateIndustryConfig();
  if (!validation.isValid) {
    console.error('Industries configuration validation failed:', validation.errors);
  }
  if (validation.warnings.length > 0) {
    console.warn('Industries configuration warnings:', validation.warnings);
  }
  console.log(`✅ Industries configuration loaded: ${validation.totalIndustries} industries`);
} 