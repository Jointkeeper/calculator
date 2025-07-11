/**
 * Marketing Tools Data - Данные маркетинговых инструментов
 * Централизованное хранение всех инструментов по категориям и отраслям
 */

export const MARKETING_TOOLS = {
  advertising: {
    universal: [
      { 
        id: 'instagram_ads', 
        name: 'Instagram/Facebook Ads', 
        cost: 'included', 
        popularity: 85,
        monthlyEstimate: 15000,
        description: 'Реклама в социальных сетях Meta'
      },
      { 
        id: 'google_ads', 
        name: 'Google Ads (Контекст)', 
        cost: 'per_click', 
        popularity: 70,
        monthlyEstimate: 20000,
        description: 'Контекстная реклама в поиске Google'
      },
      { 
        id: 'yandex_direct', 
        name: 'Яндекс.Директ', 
        cost: 'per_click', 
        popularity: 65,
        monthlyEstimate: 18000,
        description: 'Контекстная реклама в Яндексе'
      },
      { 
        id: 'vk_ads', 
        name: 'ВКонтакте реклама', 
        cost: 'included', 
        popularity: 45,
        monthlyEstimate: 8000,
        description: 'Реклама в социальной сети ВК'
      },
      { 
        id: 'youtube_ads', 
        name: 'YouTube реклама', 
        cost: 'per_view', 
        popularity: 40,
        monthlyEstimate: 12000,
        description: 'Видеореклама на YouTube'
      }
    ],
    restaurant: [
      { 
        id: 'delivery_platforms', 
        name: 'Реклама на доставке (Яндекс.Еда, Delivery Club)', 
        cost: 'commission', 
        popularity: 90,
        monthlyEstimate: 25000,
        description: 'Продвижение в приложениях доставки еды'
      },
      { 
        id: 'local_media', 
        name: 'Местные медиа и афиши', 
        cost: 'fixed', 
        popularity: 40,
        monthlyEstimate: 5000,
        description: 'Реклама в районных изданиях'
      },
      { 
        id: 'food_bloggers', 
        name: 'Коллаборации с фуд-блогерами', 
        cost: 'variable', 
        popularity: 60,
        monthlyEstimate: 10000,
        description: 'Обзоры от популярных фуд-блогеров'
      }
    ],
    beauty: [
      { 
        id: 'booking_platforms', 
        name: 'Реклама на Yclients/ZOON', 
        cost: 'commission', 
        popularity: 75,
        monthlyEstimate: 8000,
        description: 'Продвижение в сервисах онлайн-записи'
      },
      { 
        id: 'beauty_influencer', 
        name: 'Коллаборации с бьюти-блогерами', 
        cost: 'variable', 
        popularity: 65,
        monthlyEstimate: 15000,
        description: 'Обзоры услуг от beauty-инфлюенсеров'
      },
      { 
        id: 'local_beauty_media', 
        name: 'Специализированные beauty-порталы', 
        cost: 'fixed', 
        popularity: 35,
        monthlyEstimate: 3000,
        description: 'Реклама в тематических изданиях'
      }
    ],
    retail: [
      { 
        id: 'marketplace_ads', 
        name: 'Реклама на маркетплейсах (Wildberries, Ozon)', 
        cost: 'commission', 
        popularity: 85,
        monthlyEstimate: 30000,
        description: 'Продвижение товаров на торговых площадках'
      },
      { 
        id: 'shopping_ads', 
        name: 'Google Shopping / Яндекс.Маркет', 
        cost: 'per_click', 
        popularity: 60,
        monthlyEstimate: 22000,
        description: 'Товарная реклама в поисковиках'
      },
      { 
        id: 'retargeting_ads', 
        name: 'Ретаргетинг и динамические объявления', 
        cost: 'per_click', 
        popularity: 50,
        monthlyEstimate: 12000,
        description: 'Показ товаров заинтересованным пользователям'
      }
    ]
  },
  crm_analytics: {
    universal: [
      { 
        id: 'google_analytics', 
        name: 'Google Analytics', 
        cost: 'free', 
        popularity: 80,
        monthlyEstimate: 0,
        description: 'Бесплатная веб-аналитика от Google'
      },
      { 
        id: 'yandex_metrica', 
        name: 'Яндекс.Метрика', 
        cost: 'free', 
        popularity: 75,
        monthlyEstimate: 0,
        description: 'Бесплатная веб-аналитика от Яндекса'
      },
      { 
        id: 'amocrm', 
        name: 'amoCRM', 
        cost: 'subscription', 
        popularity: 50,
        monthlyEstimate: 3000,
        description: 'CRM-система для управления клиентами'
      },
      { 
        id: 'bitrix24', 
        name: 'Битрикс24', 
        cost: 'subscription', 
        popularity: 45,
        monthlyEstimate: 4000,
        description: 'Комплексная CRM-система'
      }
    ]
  },
  automation: {
    universal: [
      { 
        id: 'email_automation', 
        name: 'Email-автоматизация', 
        cost: 'subscription', 
        popularity: 60,
        monthlyEstimate: 2000,
        description: 'Автоматические email-рассылки'
      },
      { 
        id: 'chatbot', 
        name: 'Чат-бот', 
        cost: 'subscription', 
        popularity: 40,
        monthlyEstimate: 1500,
        description: 'Автоматические ответы в чате'
      },
      { 
        id: 'lead_scoring', 
        name: 'Lead Scoring', 
        cost: 'subscription', 
        popularity: 35,
        monthlyEstimate: 3000,
        description: 'Оценка качества лидов'
      }
    ]
  },
  content: {
    universal: [
      { 
        id: 'content_calendar', 
        name: 'Контент-календарь', 
        cost: 'subscription', 
        popularity: 55,
        monthlyEstimate: 1000,
        description: 'Планирование контента'
      },
      { 
        id: 'design_tools', 
        name: 'Инструменты дизайна', 
        cost: 'subscription', 
        popularity: 65,
        monthlyEstimate: 2500,
        description: 'Canva, Figma и другие'
      },
      { 
        id: 'video_editing', 
        name: 'Видеоредакторы', 
        cost: 'subscription', 
        popularity: 45,
        monthlyEstimate: 3000,
        description: 'Создание видео-контента'
      }
    ]
  }
};

export const TOOL_CATEGORIES = {
  advertising: {
    id: 'advertising',
    title: 'Реклама и продвижение',
    description: 'Инструменты для привлечения клиентов',
    icon: '📢'
  },
  crm_analytics: {
    id: 'crm_analytics',
    title: 'CRM и аналитика',
    description: 'Управление клиентами и анализ данных',
    icon: '📊'
  },
  automation: {
    id: 'automation',
    title: 'Автоматизация',
    description: 'Автоматизация маркетинговых процессов',
    icon: '🤖'
  },
  content: {
    id: 'content',
    title: 'Контент',
    description: 'Создание и управление контентом',
    icon: '✍️'
  }
};

export const COST_TYPES = {
  free: {
    label: 'Бесплатно',
    color: 'success',
    description: 'Без дополнительных затрат'
  },
  included: {
    label: 'Включено',
    color: 'info',
    description: 'Входит в базовый пакет'
  },
  subscription: {
    label: 'Подписка',
    color: 'warning',
    description: 'Ежемесячная оплата'
  },
  per_click: {
    label: 'За клик',
    color: 'primary',
    description: 'Оплата за переходы'
  },
  per_view: {
    label: 'За просмотр',
    color: 'primary',
    description: 'Оплата за просмотры'
  },
  commission: {
    label: 'Комиссия',
    color: 'secondary',
    description: 'Процент с продаж'
  },
  fixed: {
    label: 'Фиксированная',
    color: 'dark',
    description: 'Фиксированная стоимость'
  },
  variable: {
    label: 'Переменная',
    color: 'light',
    description: 'Зависит от объема'
  }
};

/**
 * Получить инструменты для отрасли
 */
export function getToolsForIndustry(industry, category = 'universal') {
  const tools = MARKETING_TOOLS[category];
  if (!tools) return [];
  
  // Сначала возвращаем универсальные инструменты
  const universalTools = tools.universal || [];
  
  // Затем добавляем специфичные для отрасли
  const industryTools = tools[industry] || [];
  
  return [...universalTools, ...industryTools];
}

/**
 * Получить все доступные инструменты
 */
export function getAllTools() {
  const allTools = [];
  
  Object.keys(MARKETING_TOOLS).forEach(category => {
    Object.keys(MARKETING_TOOLS[category]).forEach(industry => {
      allTools.push(...MARKETING_TOOLS[category][industry]);
    });
  });
  
  return allTools;
}

/**
 * Получить инструмент по ID
 */
export function getToolById(toolId) {
  const allTools = getAllTools();
  return allTools.find(tool => tool.id === toolId);
}

/**
 * Получить категорию инструмента
 */
export function getToolCategory(toolId) {
  for (const [categoryId, category] of Object.entries(MARKETING_TOOLS)) {
    for (const [industry, tools] of Object.entries(category)) {
      if (tools.find(tool => tool.id === toolId)) {
        return categoryId;
      }
    }
  }
  return null;
}

/**
 * Получить рекомендуемые инструменты для отрасли
 */
export function getRecommendedTools(industry, businessSize) {
  const recommendations = [];
  
  // Базовые рекомендации для всех отраслей
  recommendations.push('google_analytics');
  recommendations.push('yandex_metrica');
  
  // Специфичные рекомендации по отрасли
  switch (industry) {
    case 'restaurant':
      recommendations.push('delivery_platforms');
      recommendations.push('instagram_ads');
      break;
    case 'beauty':
      recommendations.push('booking_platforms');
      recommendations.push('beauty_influencer');
      break;
    case 'retail':
      recommendations.push('marketplace_ads');
      recommendations.push('google_ads');
      break;
    default:
      recommendations.push('instagram_ads');
      recommendations.push('google_ads');
  }
  
  // Рекомендации по размеру бизнеса
  if (businessSize === 'large') {
    recommendations.push('amocrm');
    recommendations.push('email_automation');
  }
  
  return recommendations;
}

/**
 * Рассчитать стоимость инструментов
 */
export function calculateToolsCost(selectedTools, industry, businessSize) {
  let totalCost = 0;
  const breakdown = [];
  
  selectedTools.forEach(toolId => {
    const tool = getToolById(toolId);
    if (tool) {
      // Применяем мультипликаторы по отрасли и размеру
      let cost = tool.monthlyEstimate;
      
      // Мультипликатор по размеру бизнеса
      const sizeMultiplier = {
        small: 0.7,
        medium: 1.0,
        large: 1.3
      }[businessSize] || 1.0;
      
      cost *= sizeMultiplier;
      
      breakdown.push({
        tool,
        cost: Math.round(cost)
      });
      
      totalCost += cost;
    }
  });
  
  return {
    total: Math.round(totalCost),
    breakdown
  };
} 