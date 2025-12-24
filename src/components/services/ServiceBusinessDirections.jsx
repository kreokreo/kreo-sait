'use client'

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * Компонент для отображения направлений бизнеса
 * @param {Array} directions - Массив направлений бизнеса
 * @param {string} baseUrl - Базовый URL для ссылок (например, '/uslugi/sites/landing')
 * @param {string} title - Заголовок секции
 * @param {string} description - Описание секции
 */
export default function ServiceBusinessDirections({ 
    directions = [], 
    baseUrl = '',
    title = 'Направления бизнеса',
    description = 'Мы создаем решения для различных направлений бизнеса. Выберите вашу нишу, чтобы узнать подробнее.'
}) {
    if (!directions || directions.length === 0) {
        return null;
    }

    return (
        <section className="relative w-full px-12 md:px-16 lg:px-24 py-20 md:py-32 bg-transparent z-10" style={{ overflow: 'visible' }}>
            {/* Размытые декоративные круги */}
            <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px' }}>
                <div className="absolute top-10 right-[calc(25%+200px)] w-[400px] h-[400px] bg-indigo-400/15 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 left-[calc(33.33%+200px)] w-[350px] h-[350px] bg-pink-400/15 rounded-full blur-xl"></div>
            </div>
            <div className="relative max-w-7xl mx-auto z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-lg text-gray-700 max-w-3xl">
                            {description}
                        </p>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {directions.map((direction, idx) => {
                        const directionUrl = `${baseUrl}/${direction.id}`;

                        return (
                            <motion.div
                                key={direction.id || idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <Link
                                    href={directionUrl}
                                    className="group block p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-brand/30 hover:bg-white/20 transition-all"
                                >
                                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-brand transition-colors">
                                        {direction.name}
                                    </h3>
                                    {direction.description && (
                                        <p className="text-gray-700 leading-relaxed mb-4">
                                            {direction.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 text-brand text-sm font-medium">
                                        <span>Подробнее</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}


