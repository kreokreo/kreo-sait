'use client'

import { use } from 'react';
import { notFound } from 'next/navigation';
import { siteTypesContent } from '@/constants/siteTypesContent';
import { getDirectionsForSiteType } from '@/constants/businessDirections';
import { getFilteredCases } from '@/lib/cases';
import { ServicePageTemplate } from '@/components/services';

export default function SiteTypePage({ params }) {
    const { type } = use(params);
    
    const content = siteTypesContent[type];

    if (!content) {
        notFound();
    }

    // Получаем направления бизнеса для этого типа сайта
    const directions = getDirectionsForSiteType(type);
    const directionsArray = Object.values(directions);

    // Получаем кейсы для этого типа сайта
    // Маппинг типов сайтов на теги
    const typeTags = {
        'landing': ['Лендинг', 'Сайт'],
        'corporate': ['Корпоративный', 'Сайт'],
        'ecommerce': ['Интернет-магазин', 'Сайт'],
        'pwa': ['PWA', 'Веб-приложение']
    };
    const tags = typeTags[type] || ['Сайт'];
    const cases = getFilteredCases({ tags, limit: 3 });

    // Преобразуем контент в формат шаблона
    const templateContent = {
        title: content.title,
        subtitle: content.subtitle,
        seoDescription: content.seoDescription,
        description: content.description,
        // Features - только особенности разработки (без направлений)
        features: content.features.map(feature => ({
            title: feature,
            description: ''
        })),
        featuresTitle: `Особенности разработки ${content.subtitle.toLowerCase()}`,
        featuresDescription: `При создании ${content.subtitle.toLowerCase()} мы используем современные технологии и лучшие практики, что обеспечивает высокую производительность и отличные результаты для бизнеса.`,
        // Направления бизнеса - отдельная секция
        businessDirections: directionsArray,
        businessDirectionsBaseUrl: `/uslugi/sites/${type}`,
        businessDirectionsTitle: `Для кого мы создаем ${content.subtitle.toLowerCase()}`,
        businessDirectionsDescription: `Мы создаем ${content.subtitle.toLowerCase()} для различных направлений бизнеса. Выберите вашу нишу, чтобы узнать подробнее.`,
        benefits: content.benefits,
        benefitsTitle: `Преимущества разработки в Kreo`,
        process: content.process,
        processTitle: `Этапы разработки: как мы работаем`,
        processDescription: `Процесс создания ${content.subtitle.toLowerCase()} включает несколько ключевых этапов, каждый из которых важен для достижения оптимального результата.`,
        ctaTitle: 'Готовы начать проект?',
        ctaDescription: `Обсудите ваш проект с нами и получите персональное предложение по разработке ${content.subtitle.toLowerCase()}`,
        structuredData: content.structuredData,
        backUrl: '/uslugi/sites', // Кнопка "Назад" ведет на страницу услуг по сайтам
        // Кейсы
        cases: cases,
        allCasesUrl: '/kejsy',
        casesTitle: 'Примеры наших работ'
    };

    return <ServicePageTemplate content={templateContent} />;
}
