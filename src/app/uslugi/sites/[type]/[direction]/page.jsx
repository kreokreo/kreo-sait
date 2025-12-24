'use client'

import { use } from 'react';
import { notFound } from 'next/navigation';
import { getDirection } from '@/constants/businessDirections';
import { siteTypesContent } from '@/constants/siteTypesContent';
import { getFilteredCases } from '@/lib/cases';
import { ServicePageTemplate } from '@/components/services';

export default function BusinessDirectionPage({ params }) {
    const { type, direction } = use(params);
    
    // Получаем контент типа сайта
    const siteTypeContent = siteTypesContent[type];
    if (!siteTypeContent) {
        notFound();
    }
    
    // Получаем направление бизнеса
    const directionData = getDirection(type, direction);
    if (!directionData) {
        notFound();
    }
    
    // Получаем кейсы для этого направления бизнеса
    // Маппинг направлений на теги
    const directionTags = {
        'dentistry': ['Стоматология', 'Медицина'],
        'medical': ['Медицина', 'Клиника'],
        'restaurant': ['Ресторан', 'Кафе'],
        'ecommerce': ['Интернет-магазин', 'E-commerce'],
        'education': ['Образование', 'Школа'],
        'real-estate': ['Недвижимость'],
        'construction': ['Строительство'],
        'b2b': ['B2B'],
        'entertainment': ['Ивенты', 'Развлечения'],
        'automotive': ['Автомобильный']
    };
    
    // Теги для типа сайта
    const typeTags = {
        'landing': ['Лендинг', 'Сайт'],
        'corporate': ['Корпоративный', 'Сайт'],
        'ecommerce': ['Интернет-магазин', 'Сайт'],
        'pwa': ['PWA', 'Веб-приложение']
    };
    
    const tags = [
        ...(directionTags[direction] || []),
        ...(typeTags[type] || ['Сайт'])
    ];
    
    const cases = getFilteredCases({ tags, limit: 3 });
    
    // Формируем контент для страницы-заглушки
    const templateContent = {
        title: directionData.title,
        subtitle: directionData.description,
        seoDescription: `${directionData.title}. ${directionData.description}. Разработка от Kreo.`,
        description: directionData.description,
        features: [
            'Современный дизайн',
            'Высокая производительность',
            'Адаптивная верстка',
            'SEO-оптимизация',
            'Интеграции с CRM и аналитикой',
            'Быстрая загрузка'
        ],
        featuresTitle: `Особенности разработки ${directionData.name.toLowerCase()}`,
        featuresDescription: `При создании ${directionData.name.toLowerCase()} мы используем современные технологии и лучшие практики.`,
        benefits: [
            'Профессиональная разработка',
            'Современные технологии',
            'Оптимизация для бизнеса',
            'Поддержка и развитие'
        ],
        benefitsTitle: `Преимущества разработки в Kreo`,
        process: siteTypeContent.process || [
            {
                step: '1',
                title: 'Анализ и планирование',
                description: 'Изучаем ваш бизнес и формируем техническое задание.'
            },
            {
                step: '2',
                title: 'Разработка',
                description: 'Создаем дизайн и разрабатываем решение.'
            },
            {
                step: '3',
                title: 'Тестирование',
                description: 'Проводим тестирование и оптимизацию.'
            },
            {
                step: '4',
                title: 'Запуск',
                description: 'Запускаем проект и обеспечиваем поддержку.'
            }
        ],
        processTitle: `Этапы разработки: как мы работаем`,
        processDescription: `Процесс создания ${directionData.name.toLowerCase()} включает несколько ключевых этапов.`,
        ctaTitle: 'Готовы начать проект?',
        ctaDescription: `Обсудите ваш проект с нами и получите персональное предложение по разработке ${directionData.name.toLowerCase()}.`,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": directionData.title,
            "provider": {
                "@type": "Organization",
                "name": "Kreo",
                "url": "https://kreo.pro"
            },
            "areaServed": "RU"
        },
        backUrl: `/uslugi/sites/${type}`, // Кнопка "Назад" ведет на страницу типа сайта
        // Кейсы
        cases: cases,
        allCasesUrl: '/kejsy',
        casesTitle: 'Примеры наших работ'
    };

    return <ServicePageTemplate content={templateContent} />;
}

