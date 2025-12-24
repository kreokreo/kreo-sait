// Утилиты для работы с кейсами

import { allCases } from '@/constants/cases';

/**
 * Перемешать массив случайным образом (Fisher-Yates shuffle)
 * @param {Array} array - Массив для перемешивания
 * @returns {Array} Перемешанный массив
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Получить кейсы с фильтрацией
 * @param {Object} filters - Объект с фильтрами
 * @param {string} filters.searchQuery - Поисковый запрос
 * @param {string[]} filters.tags - Массив выбранных тегов
 * @param {string} filters.direction - Направление (razrabotka/reklama)
 * @param {number} filters.limit - Лимит количества кейсов
 * @returns {Array} Отфильтрованный массив кейсов
 */
export function getFilteredCases(filters = {}) {
    const {
        searchQuery = '',
        tags = [],
        direction = null,
        limit = null,
        excludeIds = []
    } = filters;

    let filtered = allCases.filter(caseItem => {
        // Исключаем кейсы по ID
        if (excludeIds.includes(caseItem.id)) {
            return false;
        }

        // Поиск по тексту
        const matchesSearch = !searchQuery || 
            caseItem.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            caseItem.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            caseItem.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            caseItem.service?.toLowerCase().includes(searchQuery.toLowerCase());

        // Фильтрация по тегам
        const matchesTags = tags.length === 0 || 
            tags.some(tag => caseItem.tags?.includes(tag));

        // Фильтрация по направлению
        const matchesDirection = !direction || caseItem.direction === direction;

        return matchesSearch && matchesTags && matchesDirection;
    });

    // Перемешиваем массив для рандомного выбора
    const shuffled = shuffleArray(filtered);

    // Применяем лимит
    if (limit) {
        return shuffled.slice(0, limit);
    }

    return shuffled;
}

/**
 * Получить похожие кейсы по тегам
 * @param {string} caseId - ID текущего кейса
 * @param {number} limit - Максимальное количество похожих кейсов
 * @returns {Array} Массив похожих кейсов
 */
export function getRelatedCases(caseId, limit = 3) {
    const currentCase = allCases.find(c => c.id === caseId);
    if (!currentCase || !currentCase.tags) {
        return [];
    }

    return allCases
        .filter(c => 
            c.id !== caseId && 
            c.tags?.some(tag => currentCase.tags.includes(tag))
        )
        .slice(0, limit);
}

/**
 * Получить кейс по slug
 * @param {string} slug - Slug кейса
 * @returns {Object|null} Объект кейса или null
 */
export function getCaseBySlug(slug) {
    return allCases.find(c => c.slug === slug) || null;
}

/**
 * Получить кейсы по услуге
 * @param {string} serviceId - ID услуги (sites, web-apps, chatbots и т.д.)
 * @param {number} limit - Максимальное количество кейсов
 * @returns {Array} Массив кейсов для услуги (рандомно выбранные)
 */
export function getCasesByService(serviceId, limit = 3) {
    // Маппинг услуг на теги и ключевые слова
    const serviceTags = {
        'sites': ['Сайт', 'Лендинг', 'Корпоративный', 'Интернет-магазин'],
        'web-apps': ['Веб-приложение', 'PWA', 'Платформа'],
        'chatbots': ['Telegram-бот', 'Чат-бот', 'Автоматизация'],
        'ai-automation': ['AI', 'Автоматизация', 'Искусственный интеллект'],
        'crm': ['CRM', 'Управление клиентами'],
        'integrations': ['Интеграции', 'API'],
        'yandex-direct': ['Яндекс.Директ', 'Контекстная реклама', 'Реклама'],
        'seo': ['SEO', 'Продвижение'],
        'telegram-ads': ['Telegram Ads', 'Реклама'],
        'vk-ads': ['VK Реклама', 'Реклама'],
        'google-ads': ['Google Ads', 'Реклама'],
        'avito': ['Авито', 'Реклама']
    };

    const tags = serviceTags[serviceId] || [];
    
    if (tags.length === 0) {
        return [];
    }

    // Фильтруем кейсы по тегам или по service
    const filtered = allCases.filter(caseItem => {
        // Проверяем теги
        const matchesTags = tags.some(tag => 
            caseItem.tags?.some(caseTag => 
                caseTag.toLowerCase().includes(tag.toLowerCase()) ||
                tag.toLowerCase().includes(caseTag.toLowerCase())
            )
        );
        
        // Проверяем service
        const matchesService = caseItem.service && tags.some(tag =>
            caseItem.service.toLowerCase().includes(tag.toLowerCase())
        );

        return matchesTags || matchesService;
    });

    // Перемешиваем и берем нужное количество
    const shuffled = shuffleArray(filtered);
    return shuffled.slice(0, limit);
}

/**
 * Получить кейсы для главной страницы
 * @param {number} casesLimit - Количество кейсов из allCases (не используется, порядок задан явно)
 * @param {boolean} includeOurProjects - Включать ли наши проекты
 * @returns {Array} Массив кейсов для главной страницы
 */
export function getHomePageCases(casesLimit = 6, includeOurProjects = true) {
    // Порядок кейсов на главной странице:
    // 1. Сначала наши проекты (Velorra, Selfler, Рубик)
    // 2. Потом остальные: Платформа, WIN-WIN, ТГ бот, Маршал, Продлёнка, Дентал
    
    const orderedCaseIds = [
        // Наши проекты (должны быть первыми)
        'velorra',
        'selfler', 
        'rubik',
        // Остальные кейсы в указанном порядке
        'platforma',
        'win-win',
        'omar-khayyam-bot',
        'marshal-grand-hall',
        'prodljonka',
        'dental-deal-clinic'
    ];
    
    // Создаем Map для быстрого поиска кейсов по ID
    const casesMap = new Map(allCases.map(c => [c.id, c]));
    
    // Собираем кейсы в нужном порядке
    const orderedCases = orderedCaseIds
        .map(id => casesMap.get(id))
        .filter(c => c !== undefined); // Убираем несуществующие кейсы
    
    // Если нужно включить наши проекты, возвращаем только их + остальные
    if (includeOurProjects) {
        return orderedCases;
    }
    
    // Если не нужно включать наши проекты, возвращаем только остальные
    return orderedCases.filter(c => !c.isOurProject);
}

