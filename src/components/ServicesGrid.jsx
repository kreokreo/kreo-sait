'use client'

import { motion } from 'framer-motion';
import { Code, Globe, Bot, Zap, Settings, Link2, TrendingUp, Search, Megaphone, MessageSquare, ShoppingCart } from 'lucide-react';

/**
 * Компонент сетки услуг в минималистичном стиле
 * @param {Array} services - Массив услуг
 * @param {string} title - Заголовок блока
 */
export default function ServicesGrid({ 
    services = [], 
    title = 'НАШИ УСЛУГИ'
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
                        // Определяем размеры для разных элементов
                        // Некоторые занимают 2 колонки по ширине, некоторые 2 строки по высоте
                        const getGridClasses = (idx) => {
                            // Элемент 0 (Сайты) - занимает 2 строки по высоте
                            if (idx === 0) return 'md:row-span-2';
                            
                            // Элементы 1-2 - обычные
                            if (idx < 3) return '';
                            
                            // Элемент 3 - занимает 2 колонки
                            if (idx === 3) return 'md:col-span-2';
                            
                            // Элемент 4 - обычный
                            if (idx === 4) return '';
                            
                            // Элемент 5 (Интеграции) - обычный
                            if (idx === 5) return '';
                            
                            // Элемент 6 (Telegram Ads) - обычный
                            if (idx === 6) return '';
                            
                            // Элемент 7 (Яндекс.Директ) - занимает 2 колонки
                            if (idx === 7) return 'md:col-span-2';
                            
                            // Элемент 8 (SEO) - обычный
                            if (idx === 8) return '';
                            
                            // Элемент 9 (Авито) - обычный
                            if (idx === 9) return '';
                            
                            // Остальные - обычные
                            return '';
                        };

                        return (
                            <motion.div
                                key={service.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.5 }}
                                whileHover={{ y: -2 }}
                                className={`group relative p-8 md:p-10 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md hover:border-brand/30 hover:bg-white transition-all duration-300 ${getGridClasses(index)}`}
                            >
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
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

