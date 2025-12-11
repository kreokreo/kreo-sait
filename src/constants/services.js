import { Code, Globe, Bot, Zap, Settings, Link2, TrendingUp, Search, Megaphone, MessageSquare, ShoppingCart } from 'lucide-react';

/**
 * Список услуг для главной страницы
 */
export const services = [
    {
        id: 'sites',
        title: 'Сайты',
        description: 'Лендинги, корпоративные сайты, интернет-магазины. Современный дизайн и высокая производительность.',
        icon: Globe
    },
    {
        id: 'web-apps',
        title: 'Веб-приложения',
        description: 'CRM, ERP, дашборды и внутренние системы. Масштабируемые решения для бизнеса.',
        icon: Code
    },
    {
        id: 'chatbots',
        title: 'Чат-боты',
        description: 'Telegram, WhatsApp, VK боты с AI. Автоматизация коммуникаций и обработки запросов.',
        icon: Bot
    },
    {
        id: 'ai-automation',
        title: 'AI-автоматизация',
        description: 'Автоматизация процессов с помощью искусственного интеллекта. Ускорение работы в разы.',
        icon: Zap
    },
    {
        id: 'crm',
        title: 'CRM',
        description: 'Настройка и интеграция CRM-систем. Управление клиентами и продажами.',
        icon: Settings
    },
    {
        id: 'integrations',
        title: 'Интеграции',
        description: 'API, связки сервисов, автоматизация. Соединяем ваши инструменты в единую систему.',
        icon: Link2
    },
    {
        id: 'telegram-ads',
        title: 'Telegram Ads',
        description: 'Продвижение в Telegram. Охват активной аудитории мессенджера.',
        icon: Megaphone
    },
    {
        id: 'yandex-direct',
        title: 'Яндекс.Директ',
        description: 'Контекстная реклама в поиске и РСЯ. Привлечение целевой аудитории.',
        icon: TrendingUp
    },
    {
        id: 'seo',
        title: 'SEO',
        description: 'Продвижение в органической выдаче. Долгосрочный рост трафика и конверсий.',
        icon: TrendingUp
    },
    {
        id: 'avito',
        title: 'Авито реклама',
        description: 'Настройка рекламы на сервисе Авито. Увеличение продаж на маркетплейсе.',
        icon: ShoppingCart
    },
    {
        id: 'vk-ads',
        title: 'VK Реклама',
        description: 'Таргетинг в социальной сети. Точное попадание в целевую аудиторию.',
        icon: MessageSquare
    },
    {
        id: 'google-ads',
        title: 'Google Ads',
        description: 'Реклама в Google и YouTube. Масштабирование бизнеса через поиск и видео.',
        icon: Search
    }
];

