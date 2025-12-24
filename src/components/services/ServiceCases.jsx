'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CaseCard } from '@/components/cases';

/**
 * Компонент для отображения кейсов на странице услуги
 * @param {Array} cases - Массив кейсов для отображения
 * @param {string} allCasesUrl - URL для кнопки "Больше кейсов" (с фильтрами)
 * @param {string} title - Заголовок секции
 */
export default function ServiceCases({ 
    cases = [], 
    allCasesUrl = '/kejsy',
    title = 'Примеры наших работ'
}) {
    if (!cases || cases.length === 0) {
        return null;
    }

    return (
        <section className="relative w-full px-12 md:px-16 lg:px-24 py-20 md:py-32 bg-transparent z-10" style={{ overflow: 'visible' }}>
            {/* Размытые декоративные круги */}
            <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px' }}>
                <div className="absolute top-20 left-[calc(10px+200px)] w-[700px] h-[700px] bg-blue-400/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-[calc(20px+200px)] w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-400/15 rounded-full blur-xl"></div>
            </div>
            <div className="relative max-w-7xl mx-auto z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 flex items-end justify-between"
                >
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
                            {title}
                        </h2>
                        <p className="text-lg text-gray-700 max-w-3xl">
                            Реальные проекты с измеримыми результатами
                        </p>
                    </div>
                    <Link
                        href={allCasesUrl}
                        className="hidden md:flex items-center gap-2 text-brand hover:text-brand-dark transition-colors font-medium"
                    >
                        <span>Больше кейсов</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>

                {/* Сетка кейсов */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
                    {cases.map((caseItem, index) => (
                        <CaseCard
                            key={caseItem.id}
                            caseItem={caseItem}
                            index={index}
                            variant="grid"
                            showVideo={false}
                            isHovered={false}
                            onMouseEnter={() => {}}
                            onMouseLeave={() => {}}
                            videoRefCallback={() => {}}
                        />
                    ))}
                </div>

                {/* Кнопка "Больше кейсов" для мобильных */}
                <div className="md:hidden text-center">
                    <Link
                        href={allCasesUrl}
                        className="inline-flex items-center gap-2 text-brand hover:text-brand-dark transition-colors font-medium"
                    >
                        <span>Больше кейсов</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

