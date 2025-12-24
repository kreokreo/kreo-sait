'use client'

import { use } from 'react';
import { notFound } from 'next/navigation';
import { services } from '@/constants/services';
import { servicesContentMap } from '@/constants/servicesContent';
import { getCasesByService } from '@/lib/cases';
import { ServicePageTemplate } from '@/components/services';

export default function ServicePage({ params }) {
    const { slug } = use(params);
    
    // Находим услугу по slug
    const service = services.find(s => s.id === slug);

    if (!service) {
        notFound();
    }

    // Получаем контент для услуги
    const content = servicesContentMap[slug];

    if (!content) {
        notFound();
    }

    // Добавляем SEO описание в structuredData
    if (content.structuredData) {
        content.structuredData.description = content.seoDescription || content.description;
    }

    // Получаем кейсы для этой услуги
    const cases = getCasesByService(slug, 3);

    // Добавляем кейсы в контент
    const contentWithCases = {
        ...content,
        cases: cases,
        allCasesUrl: '/kejsy', // Можно добавить фильтры в URL позже
        casesTitle: 'Примеры наших работ'
    };

    return <ServicePageTemplate content={contentWithCases} />;
}
