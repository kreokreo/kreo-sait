/**
 * Маппинг направлений бизнеса для разных типов сайтов
 * Используется для роутинга и генерации страниц
 */

// Направления для лендингов
export const landingDirections = {
    'dentistry': {
        id: 'dentistry',
        name: 'Для стоматологии',
        title: 'Лендинги для стоматологии',
        description: 'Одностраничные сайты для стоматологических клиник с фокусом на запись пациентов и продвижение услуг'
    },
    'restaurant': {
        id: 'restaurant',
        name: 'Для ресторанов',
        title: 'Лендинги для ресторанов',
        description: 'Лендинги для ресторанов, кафе и заведений общественного питания с бронированием столиков и акциями'
    },
    'ecommerce': {
        id: 'ecommerce',
        name: 'Для интернет-магазинов',
        title: 'Лендинги для интернет-магазинов',
        description: 'Высококонверсионные лендинги для запуска рекламных кампаний интернет-магазинов'
    },
    'medical': {
        id: 'medical',
        name: 'Для медицинских клиник',
        title: 'Лендинги для медицинских клиник',
        description: 'Лендинги для медицинских клиник с акцентом на запись пациентов и представление услуг'
    },
    'education': {
        id: 'education',
        name: 'Для образовательных учреждений',
        title: 'Лендинги для образовательных учреждений',
        description: 'Лендинги для школ, курсов, тренингов с фокусом на запись и регистрацию'
    },
    'real-estate': {
        id: 'real-estate',
        name: 'Для недвижимости',
        title: 'Лендинги для недвижимости',
        description: 'Лендинги для агентств недвижимости и застройщиков с поиском объектов и заявками'
    },
    'construction': {
        id: 'construction',
        name: 'Для строительства',
        title: 'Лендинги для строительства',
        description: 'Лендинги для строительных компаний и ремонта с расчетом стоимости и заявками'
    },
    'b2b': {
        id: 'b2b',
        name: 'Для B2B услуг',
        title: 'Лендинги для B2B услуг',
        description: 'Лендинги для B2B компаний с фокусом на консультации и заявки от бизнеса'
    },
    'entertainment': {
        id: 'entertainment',
        name: 'Для развлечений',
        title: 'Лендинги для развлечений',
        description: 'Лендинги для event-агентств, банкетных залов, кинотеатров с бронированием и акциями'
    },
    'automotive': {
        id: 'automotive',
        name: 'Для автомобильного бизнеса',
        title: 'Лендинги для автомобильного бизнеса',
        description: 'Лендинги для автосалонов, автосервисов, автомоек с записью и акциями'
    }
};

// Направления для корпоративных сайтов
export const corporateDirections = {
    'medicine': {
        id: 'medicine',
        name: 'Для медицины',
        title: 'Корпоративные сайты для медицины',
        description: 'Многостраничные сайты для медицинских клиник с представлением услуг, врачей и компании'
    },
    'restaurant': {
        id: 'restaurant',
        name: 'Для ресторанов',
        title: 'Корпоративные сайты для ресторанов',
        description: 'Сайты для ресторанов с меню, информацией о заведении и бронированием'
    },
    'trade': {
        id: 'trade',
        name: 'Для торговли',
        title: 'Корпоративные сайты для торговли',
        description: 'Сайты для торговых компаний с каталогом и представлением бизнеса'
    },
    'b2b': {
        id: 'b2b',
        name: 'Для B2B услуг',
        title: 'Корпоративные сайты для B2B',
        description: 'Сайты для B2B компаний с услугами, кейсами и портфолио'
    }
};

// Направления для интернет-магазинов
export const ecommerceDirections = {
    'clothing': {
        id: 'clothing',
        name: 'Для одежды',
        title: 'Интернет-магазины одежды',
        description: 'Полнофункциональные магазины одежды и обуви с каталогом, корзиной и оплатой'
    },
    'construction-materials': {
        id: 'construction-materials',
        name: 'Для стройматериалов',
        title: 'Интернет-магазины стройматериалов',
        description: 'Магазины стройматериалов с каталогом, калькулятором и доставкой'
    },
    'electronics': {
        id: 'electronics',
        name: 'Для электроники',
        title: 'Интернет-магазины электроники',
        description: 'Магазины электроники и техники с каталогом, сравнением и характеристиками'
    }
};

// Направления для PWA приложений
export const pwaDirections = {
    'restaurant': {
        id: 'restaurant',
        name: 'Для ресторанов',
        title: 'PWA приложения для ресторанов',
        description: 'PWA приложения для ресторанов с меню, заказом и push-уведомлениями'
    },
    'ecommerce': {
        id: 'ecommerce',
        name: 'Для интернет-магазинов',
        title: 'PWA приложения для интернет-магазинов',
        description: 'PWA приложения для магазинов с каталогом, корзиной и офлайн-режимом'
    },
    'education': {
        id: 'education',
        name: 'Для образования',
        title: 'PWA приложения для образования',
        description: 'PWA приложения для онлайн-образования с курсами и офлайн-контентом'
    }
};

// Общий маппинг всех направлений по типам сайтов
export const businessDirectionsMap = {
    landing: landingDirections,
    corporate: corporateDirections,
    ecommerce: ecommerceDirections,
    pwa: pwaDirections
};

// Получить все направления для типа сайта
export function getDirectionsForSiteType(siteType) {
    return businessDirectionsMap[siteType] || {};
}

// Получить направление по ID и типу
export function getDirection(siteType, directionId) {
    const directions = businessDirectionsMap[siteType];
    return directions?.[directionId] || null;
}


