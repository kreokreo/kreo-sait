// Утилиты для работы с кейсами

import { allCases } from '@/constants/cases';

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

    // Применяем лимит
    if (limit) {
        filtered = filtered.slice(0, limit);
    }

    return filtered;
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

