'use client'

import { useState } from 'react';
import LeadForm from '@/components/LeadForm';
import ServiceHero from './ServiceHero';
import ServiceFeatures from './ServiceFeatures';
import ServiceBusinessDirections from './ServiceBusinessDirections';
import ServiceBenefits from './ServiceBenefits';
import ServiceProcess from './ServiceProcess';
import ServiceCases from './ServiceCases';
import ServiceCTA from './ServiceCTA';

/**
 * Шаблон страницы услуги
 * Принимает контент и автоматически рендерит все секции
 * 
 * @param {Object} content - Контент страницы услуги
 * @param {string} content.title - Заголовок услуги
 * @param {string} content.subtitle - Подзаголовок (опционально)
 * @param {string} content.seoDescription - SEO описание
 * @param {string} content.description - Описание (опционально)
 * @param {Array} content.features - Массив особенностей/типов услуги
 * @param {Array} content.benefits - Массив преимуществ
 * @param {Array} content.process - Массив этапов работы
 * @param {Object} content.featuresTypeMap - Маппинг для кликабельных карточек features
 * @param {Object} content.customSections - Дополнительные кастомные секции (опционально)
 */
export default function ServicePageTemplate({ content }) {
    const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

    if (!content) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#E8E8E8]">
            {/* Структурированные данные для SEO (JSON-LD) */}
            {content.structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(content.structuredData) }}
                />
            )}

            {/* Hero секция */}
            <ServiceHero
                title={content.title}
                seoDescription={content.seoDescription}
                description={content.description}
                onOpenLeadForm={() => setIsLeadFormOpen(true)}
                backUrl={content.backUrl}
            />

            {/* Особенности/Типы услуги */}
            {content.features && (
                <ServiceFeatures
                    title={content.featuresTitle || `Особенности разработки ${content.subtitle || 'услуг'}`}
                    description={content.featuresDescription || `При создании ${content.subtitle || 'услуг'} мы используем современные технологии и лучшие практики.`}
                    features={content.features}
                    typeMap={content.featuresTypeMap}
                />
            )}

            {/* Направления бизнеса - отдельная секция */}
            {content.businessDirections && content.businessDirections.length > 0 && (
                <ServiceBusinessDirections
                    directions={content.businessDirections}
                    baseUrl={content.businessDirectionsBaseUrl || ''}
                    title={content.businessDirectionsTitle || 'Направления бизнеса'}
                    description={content.businessDirectionsDescription || 'Мы создаем решения для различных направлений бизнеса. Выберите вашу нишу, чтобы узнать подробнее.'}
                />
            )}

            {/* Преимущества */}
            {content.benefits && (
                <ServiceBenefits
                    title={content.benefitsTitle || `Преимущества разработки в Kreo`}
                    description={content.benefitsDescription}
                    benefits={content.benefits}
                />
            )}

            {/* Процесс работы */}
            {content.process && (
                <ServiceProcess
                    title={content.processTitle || `Этапы разработки: как мы работаем`}
                    description={content.processDescription}
                    process={content.process}
                />
            )}

            {/* Кейсы - перед CTA */}
            {content.cases && content.cases.length > 0 && (
                <ServiceCases
                    cases={content.cases}
                    allCasesUrl={content.allCasesUrl || '/kejsy'}
                    title={content.casesTitle || 'Примеры наших работ'}
                />
            )}

            {/* Кастомные секции */}
            {content.customSections?.map((section, idx) => (
                <section key={idx} className={section.className || "relative w-full px-12 md:px-16 lg:px-24 py-20 md:py-32 bg-transparent z-10"} style={{ overflow: 'visible' }}>
                    {section.content}
                </section>
            ))}

            {/* CTA секция */}
            <ServiceCTA
                title={content.ctaTitle || "Готовы начать проект?"}
                description={content.ctaDescription}
                onOpenLeadForm={() => setIsLeadFormOpen(true)}
            />

            {/* Форма обратной связи */}
            {isLeadFormOpen && (
                <LeadForm
                    isOpen={isLeadFormOpen}
                    onClose={() => setIsLeadFormOpen(false)}
                />
            )}
        </div>
    );
}

