/**
 * Marketing Teams Data - Данные маркетинговых команд
 * Централизованное хранение всех вариантов команд и их характеристик
 */

export const TEAM_OPTIONS = {
  no_team: {
    id: 'no_team',
    title: 'Занимаемся сами',
    subtitle: 'Владелец/менеджер делает маркетинг',
    description: 'Владелец или менеджер занимается маркетингом в свободное время без специальных знаний',
    monthlyCost: 0,
    timeInvestment: '5-10 часов/неделю',
    timeInvestmentHours: 7.5,
    capabilities: ['basic_social_media', 'simple_advertising', 'word_of_mouth'],
    limitations: ['no_strategy', 'inconsistent_execution', 'limited_knowledge', 'no_analytics'],
    commonFor: ['small_business', 'startups', 'budget_constraints'],
    painPoints: [
      'Нет времени на маркетинг',
      'Не знаем, что работает',
      'Результаты непредсказуемы',
      'Отвлекаемся от основного бизнеса'
    ],
    riskLevel: 'high',
    effectivenessScore: 2.5,
    scalabilityScore: 1.0,
    professionalismScore: 1.5
  },

  freelancer_parttime: {
    id: 'freelancer_parttime',
    title: 'Фрилансер на проектах',
    subtitle: 'Привлекаем специалистов по задачам',
    description: 'Работа с фрилансерами для конкретных проектов: дизайн, реклама, контент',
    monthlyCost: { min: 15000, max: 40000, average: 25000 },
    timeInvestment: '2-3 часа/неделю управления',
    timeInvestmentHours: 2.5,
    capabilities: ['specific_skills', 'project_based', 'cost_effective', 'flexibility'],
    limitations: ['no_continuity', 'coordination_overhead', 'quality_varies', 'no_strategic_thinking'],
    commonFor: ['growing_business', 'seasonal_needs', 'skill_gaps'],
    painPoints: [
      'Сложно найти хороших специалистов',
      'Нет целостной стратегии',
      'Постоянно нужно контролировать',
      'Разные уровни качества'
    ],
    riskLevel: 'medium-high',
    effectivenessScore: 4.0,
    scalabilityScore: 3.0,
    professionalismScore: 3.5
  },

  inhouse_junior: {
    id: 'inhouse_junior',
    title: 'Младший маркетолог',
    subtitle: 'Штатный сотрудник с базовыми навыками',
    description: 'Молодой специалист с базовым образованием, требует обучения и контроля',
    monthlyCost: { min: 40000, max: 80000, average: 60000 },
    timeInvestment: '1-2 часа/неделю управления',
    timeInvestmentHours: 1.5,
    capabilities: ['daily_operations', 'basic_campaigns', 'content_creation', 'social_media'],
    limitations: ['limited_experience', 'requires_training', 'narrow_expertise', 'mistakes_cost_money'],
    commonFor: ['medium_business', 'consistent_workload', 'growth_stage'],
    painPoints: [
      'Долгое обучение (3-6 месяцев)',
      'Ошибки стоят дорого',
      'Ограниченный опыт',
      'Нужен постоянный контроль'
    ],
    riskLevel: 'medium',
    effectivenessScore: 5.0,
    scalabilityScore: 4.0,
    professionalismScore: 4.0
  },

  inhouse_senior: {
    id: 'inhouse_senior',
    title: 'Опытный маркетолог',
    subtitle: 'Специалист с 3+ лет опыта',
    description: 'Профессиональный маркетолог с proven результатами и стратегическим мышлением',
    monthlyCost: { min: 80000, max: 150000, average: 115000 },
    timeInvestment: '30 минут/неделю',
    timeInvestmentHours: 0.5,
    capabilities: ['strategy_development', 'advanced_campaigns', 'analytics', 'team_leadership'],
    limitations: ['high_cost', 'single_point_failure', 'vacation_coverage', 'narrow_specialization'],
    commonFor: ['established_business', 'complex_needs', 'high_budget'],
    painPoints: [
      'Высокая зарплата',
      'Сложно найти хорошего',
      'Зависимость от одного человека',
      'Отпуска и болезни'
    ],
    riskLevel: 'medium-low',
    effectivenessScore: 7.0,
    scalabilityScore: 5.0,
    professionalismScore: 7.5
  },

  marketing_team: {
    id: 'marketing_team',
    title: 'Команда маркетологов',
    subtitle: 'Полноценный маркетинговый отдел',
    description: 'Команда специалистов: стратег + креативщик + аналитик + SMM-менеджер',
    monthlyCost: { min: 200000, max: 400000, average: 300000 },
    timeInvestment: '1-2 часа/неделю стратегического управления',
    timeInvestmentHours: 1.5,
    capabilities: ['full_marketing_stack', 'specialized_roles', 'scalability', 'innovation'],
    limitations: ['very_high_cost', 'management_overhead', 'office_space', 'coordination_complexity'],
    commonFor: ['large_business', 'multiple_channels', 'enterprise'],
    painPoints: [
      'Очень дорого (300К+/месяц)',
      'Сложно управлять командой',
      'Нужно много работы для загрузки',
      'Офисные расходы'
    ],
    riskLevel: 'low',
    effectivenessScore: 8.5,
    scalabilityScore: 9.0,
    professionalismScore: 8.5
  },

  agency_traditional: {
    id: 'agency_traditional',
    title: 'Традиционное агентство',
    subtitle: 'Внешнее агентство с ретейнером',
    description: 'Классическое маркетинговое агентство с месячным ретейнером и проектной работой',
    monthlyCost: { min: 80000, max: 200000, average: 140000 },
    timeInvestment: '2-4 часа/неделю на коммуникацию',
    timeInvestmentHours: 3.0,
    capabilities: ['external_expertise', 'industry_knowledge', 'tools_access', 'broad_experience'],
    limitations: ['communication_gaps', 'not_focused', 'additional_costs', 'slow_execution'],
    commonFor: ['medium_large_business', 'complex_projects', 'expertise_gaps'],
    painPoints: [
      'Долгие согласования',
      'Не всегда понимают бизнес',
      'Дополнительные расходы',
      'Медленная реализация'
    ],
    riskLevel: 'medium',
    effectivenessScore: 6.5,
    scalabilityScore: 6.0,
    professionalismScore: 7.0
  },

  steamphony_agency: {
    id: 'steamphony_agency',
    title: 'Steamphony Digital Agency',
    subtitle: 'Современное digital-агентство',
    description: 'Полноценное digital-агентство с фокусом на результат и ROI',
    monthlyCost: { min: 50000, max: 120000, average: 85000 },
    timeInvestment: '1-2 часа/неделю стратегического управления',
    timeInvestmentHours: 1.5,
    capabilities: [
      'full_digital_stack',
      'data_driven_approach',
      'performance_marketing',
      'continuous_optimization',
      'transparent_reporting'
    ],
    limitations: ['external_dependency', 'communication_required', 'industry_specific'],
    commonFor: ['all_business_sizes', 'growth_focused', 'roi_conscious'],
    painPoints: [
      'Нужно время на вхождение в проект',
      'Требуется четкое ТЗ',
      'Зависимость от внешней команды'
    ],
    riskLevel: 'low',
    effectivenessScore: 8.0,
    scalabilityScore: 8.5,
    professionalismScore: 8.0
  }
};

export const OPTIMIZATION_FACTORS = {
  cost_efficiency: { weight: 0.4, unit: 'rub_monthly' },
  time_savings: { weight: 0.25, unit: 'hours_weekly' },
  capability_upgrade: { weight: 0.2, unit: 'score' },
  risk_reduction: { weight: 0.15, unit: 'score' }
};

export const RISK_LEVELS = {
  low: { label: 'Низкий', color: '#38a169', score: 1 },
  'medium-low': { label: 'Средне-низкий', color: '#68d391', score: 2 },
  medium: { label: 'Средний', color: '#f6ad55', score: 3 },
  'medium-high': { label: 'Средне-высокий', color: '#fc8181', score: 4 },
  high: { label: 'Высокий', color: '#e53e3e', score: 5 }
};

/**
 * Получение команды по ID
 */
export const getTeamById = (teamId) => {
  return TEAM_OPTIONS[teamId] || null;
};

/**
 * Получение всех команд
 */
export const getAllTeams = () => {
  return Object.values(TEAM_OPTIONS);
};

/**
 * Форматирование стоимости команды
 */
export const formatTeamCost = (cost) => {
  if (cost === 0) return 'Бесплатно';
  
  if (typeof cost === 'object') {
    if (cost.min === cost.max) {
      return `${cost.min.toLocaleString()} ₽/мес`;
    }
    return `${cost.min.toLocaleString()} - ${cost.max.toLocaleString()} ₽/мес`;
  }
  
  return `${cost.toLocaleString()} ₽/мес`;
};

/**
 * Получение CSS класса для стоимости
 */
export const getCostClass = (cost) => {
  if (cost === 0) return 'cost-free';
  
  const avgCost = typeof cost === 'object' ? cost.average : cost;
  
  if (avgCost < 50000) return 'cost-low';
  if (avgCost < 150000) return 'cost-medium';
  return 'cost-high';
};

/**
 * Анализ текущего состояния команды
 */
export const analyzeCurrentState = (currentTeam, businessData) => {
  const team = getTeamById(currentTeam);
  if (!team) return null;
  
  return {
    cost: typeof team.monthlyCost === 'object' ? team.monthlyCost.average : team.monthlyCost,
    timeInvestment: team.timeInvestmentHours,
    effectiveness: team.effectivenessScore,
    scalability: team.scalabilityScore,
    professionalism: team.professionalismScore,
    riskLevel: team.riskLevel,
    painPoints: team.painPoints
  };
};

/**
 * Анализ состояния с Steamphony
 */
export const analyzeSteamphonyState = (businessData) => {
  const steamphony = getTeamById('steamphony_agency');
  
  return {
    cost: steamphony.monthlyCost.average,
    timeInvestment: steamphony.timeInvestmentHours,
    effectiveness: steamphony.effectivenessScore,
    scalability: steamphony.scalabilityScore,
    professionalism: steamphony.professionalismScore,
    riskLevel: steamphony.riskLevel,
    advantages: steamphony.capabilities
  };
};

/**
 * Выявление пробелов между текущим и целевым состоянием
 */
export const identifyGaps = (currentTeam, businessData) => {
  const current = analyzeCurrentState(currentTeam, businessData);
  const steamphony = analyzeSteamphonyState(businessData);
  
  if (!current) return null;
  
  return {
    costSavings: current.cost - steamphony.cost,
    timeSavings: current.timeInvestment - steamphony.timeInvestment,
    effectivenessGain: steamphony.effectiveness - current.effectiveness,
    scalabilityGain: steamphony.scalability - current.scalability,
    professionalismGain: steamphony.professionalism - current.professionalism,
    riskReduction: RISK_LEVELS[current.riskLevel].score - RISK_LEVELS[steamphony.riskLevel].score
  };
};

/**
 * Расчет экономии
 */
export const calculateSavings = (currentTeam, businessData) => {
  const gaps = identifyGaps(currentTeam, businessData);
  if (!gaps) return null;
  
  const monthlySavings = gaps.costSavings;
  const annualSavings = monthlySavings * 12;
  const timeSavingsHours = gaps.timeSavings * 52; // недели в году
  
  return {
    monthly: monthlySavings,
    annual: annualSavings,
    timeSavings: timeSavingsHours,
    timeSavingsValue: timeSavingsHours * 2000 // примерная стоимость часа
  };
};

/**
 * Расчет улучшений
 */
export const calculateImprovements = (currentTeam, businessData) => {
  const gaps = identifyGaps(currentTeam, businessData);
  if (!gaps) return null;
  
  return {
    effectiveness: gaps.effectivenessGain,
    scalability: gaps.scalabilityGain,
    professionalism: gaps.professionalismGain,
    riskReduction: gaps.riskReduction
  };
};

/**
 * Генерация рекомендаций Steamphony
 */
export const generateSteamphonyRecommendations = () => {
  return {
    immediate: [
      'Бесплатный аудит текущего маркетинга',
      'Разработка стратегии digital-маркетинга',
      'Настройка аналитики и отчетности'
    ],
    shortTerm: [
      'Запуск первых кампаний',
      'Оптимизация существующих каналов',
      'Обучение команды'
    ],
    longTerm: [
      'Масштабирование успешных каналов',
      'Автоматизация процессов',
      'Постоянная оптимизация'
    ]
  };
};

/**
 * Генерация ценностных предложений
 */
export const generateValuePropositions = (currentTeam, savings, improvements) => {
  const team = getTeamById(currentTeam);
  if (!team) return [];
  
  const valueProps = [];
  
  if (savings && savings.monthly > 0) {
    valueProps.push({
      type: 'cost',
      title: 'Экономия бюджета',
      value: `${savings.monthly.toLocaleString()} ₽/мес`,
      description: 'Снижение затрат на маркетинг при повышении эффективности'
    });
  }
  
  if (savings && savings.timeSavings > 0) {
    valueProps.push({
      type: 'time',
      title: 'Экономия времени',
      value: `${Math.round(savings.timeSavings)} часов/год`,
      description: 'Высвобождение времени для развития бизнеса'
    });
  }
  
  if (improvements && improvements.effectiveness > 0) {
    valueProps.push({
      type: 'effectiveness',
      title: 'Повышение эффективности',
      value: `+${improvements.effectiveness.toFixed(1)} баллов`,
      description: 'Улучшение результатов маркетинговых кампаний'
    });
  }
  
  return valueProps;
};

/**
 * Получение специфичных ценностных предложений для команды
 */
export const getTeamSpecificValueProps = (teamId) => {
  const team = getTeamById(teamId);
  if (!team) return [];
  
  const specificProps = {
    no_team: [
      'Профессиональный подход к маркетингу',
      'Стратегическое планирование',
      'Измеримые результаты'
    ],
    freelancer_parttime: [
      'Целостная стратегия',
      'Координация всех каналов',
      'Постоянная поддержка'
    ],
    inhouse_junior: [
      'Опытная команда',
      'Быстрый результат',
      'Снижение рисков'
    ],
    inhouse_senior: [
      'Дополнительные компетенции',
      'Масштабирование',
      'Инновационные подходы'
    ],
    marketing_team: [
      'Оптимизация затрат',
      'Фокус на результат',
      'Гибкость в масштабировании'
    ],
    agency_traditional: [
      'Современные digital-подходы',
      'Прозрачная отчетность',
      'Быстрая реализация'
    ]
  };
  
  return specificProps[teamId] || [];
};

/**
 * Определение метрик успеха
 */
export const defineSuccessMetrics = (currentTeam) => {
  const team = getTeamById(currentTeam);
  if (!team) return [];
  
  return [
    {
      metric: 'ROI маркетинга',
      current: 'Низкий/неизмеряемый',
      target: '3-5x',
      timeframe: '3-6 месяцев'
    },
    {
      metric: 'Конверсия',
      current: 'Базовая',
      target: '+50%',
      timeframe: '2-4 месяца'
    },
    {
      metric: 'Стоимость привлечения',
      current: 'Высокая',
      target: '-30%',
      timeframe: '1-3 месяца'
    },
    {
      metric: 'Время до результата',
      current: 'Долгое',
      target: 'Быстрое',
      timeframe: '1-2 месяца'
    }
  ];
};

/**
 * Расчет проекции ROI
 */
export const calculateROIProjection = (savings) => {
  if (!savings) return null;
  
  const monthlyInvestment = 85000; // средняя стоимость Steamphony
  const monthlySavings = savings.monthly;
  
  return {
    monthlyROI: ((monthlySavings - monthlyInvestment) / monthlyInvestment) * 100,
    breakEvenMonths: monthlyInvestment / monthlySavings,
    annualROI: ((savings.annual - (monthlyInvestment * 12)) / (monthlyInvestment * 12)) * 100
  };
}; 