/**
 * Restaurant Industry Data
 * Данные для ресторанного бизнеса
 */

export const RESTAURANT_INDUSTRY = {
  key: 'restaurant',
  displayName: 'Ресторанный бизнес',
  icon: '🍽️',
  description: 'Рестораны, кафе, бары, доставка еды',
  examples: 'Привлечение гостей, бронирования столиков, онлайн-заказы',
  popular: true,
  searchTerms: ['ресторан', 'кафе', 'бар', 'еда', 'доставка', 'общепит', 'питание'],
  
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
  
  calculations: {
    marketerSalary: { 
      partTime: 1000, 
      fullTime: 1800, 
      senior: 2800, 
      team: 4500 
    },
    toolsMultiplier: 2.5,
    avgRevenuePerCustomer: 35,
    seasonalityFactor: 1.2,
    competitiveIndex: 0.8,
    repeatCustomerRate: 0.65,
    conversionRate: 0.08,
    cpcRange: { min: 0.5, max: 2.5 },
    industryGrowthRate: 0.15
  },
  
  personalizedMessages: {
    savingsMessage: "В ресторанном бизнесе 73% владельцев переплачивают за маркетинг",
    opportunityMessage: "Рестораны с профессиональным digital-продвижением увеличивают проходимость на 40%",
    industryInsight: "Ключевые точки роста: бронирование столиков, доставка, программы лояльности",
    toolsRecommendation: "Обязательно: CRM для бронирований, Instagram Business, система лояльности",
    commonMistakes: "Частые ошибки: игнорирование отзывов, слабая фото-подача блюд, отсутствие онлайн-бронирования"
  },
  
  benchmarks: {
    avgMarketingSpend: 1800,
    avgROI: 3.2,
    digitalizationLevel: 0.6,
    customerAcquisitionCost: 28,
    avgOrderValue: 35,
    repeatVisitRate: 0.65
  }
}; 