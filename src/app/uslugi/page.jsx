'use client'

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Code, Globe, Bot, Zap, Settings, Link2, TrendingUp, Megaphone, MessageSquare, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { services } from '@/constants/services';

export default function ServicesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Категории услуг
    const categories = [
        { id: 'all', name: 'Все услуги' },
        { id: 'development', name: 'Разработка' },
        { id: 'advertising', name: 'Реклама' }
    ];

    // Определяем категорию для каждой услуги
    const getServiceCategory = (serviceId) => {
        const devServices = ['sites', 'web-apps', 'chatbots', 'ai-automation', 'crm', 'integrations'];
        return devServices.includes(serviceId) ? 'development' : 'advertising';
    };

    // Фильтрация услуг
    const filteredServices = useMemo(() => {
        return services.filter(service => {
            const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                service.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || getServiceCategory(service.id) === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    // Определяем, есть ли страница для услуги
    const hasPage = (serviceId) => {
        return serviceId === 'sites'; // Пока только для сайтов
    };

    return (
        <div className="min-h-screen bg-[#E8E8E8] relative">
            {/* Общие декоративные круги для всей страницы */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-xl"></div>
                <div className="absolute top-40 right-20 w-[350px] h-[350px] bg-pink-400/20 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-400/15 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 left-1/4 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-40 right-1/3 w-[250px] h-[250px] bg-purple-400/10 rounded-full blur-xl"></div>
                <div className="absolute top-[60%] left-20 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-20 w-[350px] h-[350px] bg-cyan-400/20 rounded-full blur-xl"></div>
            </div>

            {/* Hero секция */}
            <section className="relative px-12 md:px-16 lg:px-24 py-20 md:py-32 bg-transparent z-10">
                <div className="relative max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="font-mono text-sm text-gray-600 mb-4">Наши услуги</p>
                        <h1 className="text-3xl md:text-5xl font-bold mb-6">
                            Полный спектр <span className="text-brand">digital-услуг</span>
                        </h1>
                        <p className="text-lg text-gray-700 max-w-3xl mb-12 leading-relaxed">
                            От разработки сайтов и веб-приложений до настройки рекламы и AI-автоматизации. Мы предлагаем комплексные решения для развития вашего бизнеса в digital-пространстве.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Поиск и фильтры */}
            <section className="relative px-12 md:px-16 lg:px-24 py-8 md:py-12 bg-transparent z-10">
                <div className="relative max-w-7xl mx-auto">
                    {/* Поиск в стеклянном контейнере */}
                    <div className="mb-6">
                        <div className="p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Поиск по услугам..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-10 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-gray-900 placeholder-gray-500"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/50 rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4 text-gray-400" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Категории */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    selectedCategory === category.id
                                        ? 'bg-brand text-white'
                                        : 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-700 hover:bg-white/20 hover:border-brand/30'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Результаты поиска */}
                    {filteredServices.length > 0 && (
                        <p className="text-sm text-gray-600">
                            Найдено услуг: {filteredServices.length}
                        </p>
                    )}
                </div>
            </section>

            {/* Сетка услуг */}
            <section className="relative px-12 md:px-16 lg:px-24 py-12 md:py-20 bg-transparent z-10">
                {filteredServices.length === 0 ? (
                    <div className="relative max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
                        >
                            <p className="text-lg text-gray-700 mb-4">Услуги не найдены</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                }}
                                className="text-brand hover:underline"
                            >
                                Сбросить фильтры
                            </button>
                        </motion.div>
                    </div>
                ) : (
                    <div className="relative max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                            {filteredServices.map((service, index) => {
                                const ServiceIcon = service.icon;
                                const isClickable = hasPage(service.id);

                                const cardContent = (
                                    <>
                                        {/* Иконка - в правом нижнем углу как в ServicesGrid */}
                                        <div className="absolute bottom-4 right-4 text-gray-900 opacity-60">
                                            <ServiceIcon className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
                                        </div>

                                        {/* Название услуги */}
                                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand transition-colors pr-12">
                                            {service.title}
                                        </h3>

                                        {/* Описание */}
                                        <p className="text-sm text-gray-700 leading-relaxed pr-12">
                                            {service.description}
                                        </p>
                                    </>
                                );

                                return isClickable ? (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05, duration: 0.5 }}
                                        whileHover={{ y: -2 }}
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
                                        key={service.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05, duration: 0.5 }}
                                        whileHover={{ y: -2 }}
                                        className="group relative p-8 md:p-10 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md hover:border-brand/30 hover:bg-white transition-all duration-300"
                                    >
                                        {cardContent}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

