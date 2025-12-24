'use client'

import { motion } from 'framer-motion';
import { Code, Globe, Bot, Zap, Settings, Link2, TrendingUp, Search, Megaphone, MessageSquare, ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * Компонент сетки услуг в минималистичном стиле
 * @param {Array} services - Массив услуг
 * @param {string} title - Заголовок блока
 * @param {boolean} showAllServicesButton - Показывать ли кнопку "Все услуги"
 */
export default function ServicesGrid({ 
    services = [], 
    title = 'НАШИ УСЛУГИ',
    showAllServicesButton = false
}) {

    return (
        <section 
            className="relative z-10 w-full py-20 md:py-32 bg-transparent overflow-hidden"
        >
            {/* Размытые декоративные круги для эффекта стекла */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-20 w-[350px] h-[350px] bg-pink-400/20 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-400/15 rounded-full blur-xl"></div>
            </div>
            <div className="relative w-full px-6 md:px-16 lg:px-24">
                {/* Заголовок */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="font-mono text-sm text-gray-600 mb-4">Полный диджитал набор</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Наши <span className="text-brand">услуги</span>
                    </h2>
                    <p className="text-lg text-gray-700 max-w-3xl mb-12 leading-relaxed">
                        Получайте качественные решения быстрее и дешевле благодаря современным технологиям и подходу
                    </p>
                </motion.div>
            </div>
            
            {/* Сетка услуг с разными размерами - на всю ширину как у кейсов */}
            <div className="w-full px-12 md:px-16 lg:px-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 auto-rows-fr">
                    {services.map((service, index) => {
                        // Определяем размеры для разных элементов по ID услуги
                        const getGridClasses = (serviceId, idx) => {
                            // Сайты - 2 блока по ширине (на md и lg экранах)
                            if (serviceId === 'sites') return 'md:col-span-2 lg:col-span-2';
                            
                            // AI-автоматизация - 1 блок (обычный)
                            if (serviceId === 'ai-automation') return '';
                            
                            // SEO - 1 блок (обычный)
                            if (serviceId === 'seo') return '';
                            
                            // Яндекс.Директ - 2 блока по ширине (на md и lg экранах)
                            if (serviceId === 'yandex-direct') return 'md:col-span-2 lg:col-span-2';
                            
                            // Остальные - обычные
                            return '';
                        };

                        // Определяем, есть ли страница для этой услуги
                        const hasPage = service.id === 'sites'; // Пока только для сайтов

                        const cardContent = (
                            <>
                                {/* Иконка - в правом нижнем углу */}
                                <div className="absolute bottom-4 right-4 text-gray-900 opacity-60">
                                    {service.icon && (
                                        <service.icon className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
                                    )}
                                </div>

                                {/* Название услуги */}
                                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand transition-colors pr-12">
                                    {service.title}
                                </h3>

                                {/* Описание */}
                                {service.description && (
                                    <p className="text-sm text-gray-700 leading-relaxed pr-12">
                                        {service.description}
                                    </p>
                                )}
                            </>
                        );

                        const motionProps = {
                            initial: { opacity: 0, y: 20 },
                            whileInView: { opacity: 1, y: 0 },
                            viewport: { once: true },
                            transition: { delay: index * 0.05, duration: 0.5 },
                            whileHover: { y: -2 }
                        };

                        const gridClasses = getGridClasses(service.id, index);
                        
                        return hasPage ? (
                            <motion.div
                                key={service.id || index}
                                {...motionProps}
                                className={gridClasses}
                            >
                                <Link
                                    href={`/uslugi/${service.id}`}
                                    className="group relative block p-8 md:p-10 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md hover:border-brand/30 hover:bg-white transition-all duration-300 h-full"
                                >
                                    {cardContent}
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={service.id || index}
                                {...motionProps}
                                className={`group relative p-8 md:p-10 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md hover:border-brand/30 hover:bg-white transition-all duration-300 ${gridClasses}`}
                            >
                                {cardContent}
                            </motion.div>
                        );
                    })}
                    
                    {/* Кнопка "Все услуги" - интегрирована в сетку в правом нижнем углу */}
                    {showAllServicesButton && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: services.length * 0.05, duration: 0.5 }}
                            whileHover={{ y: -2 }}
                        >
                            <Link
                                href="/uslugi"
                                className="group relative block p-8 md:p-10 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md hover:border-brand/30 hover:bg-white transition-all duration-300 h-full"
                            >
                                {/* Иконка - в правом нижнем углу */}
                                <div className="absolute bottom-4 right-4 text-gray-900 opacity-60">
                                    <ArrowRight className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
                                </div>
                                
                                {/* Название */}
                                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand transition-colors pr-12">
                                    Все услуги
                                </h3>
                                
                                {/* Описание */}
                                <p className="text-sm text-gray-700 leading-relaxed pr-12">
                                    Посмотреть полный список наших услуг
                                </p>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}

