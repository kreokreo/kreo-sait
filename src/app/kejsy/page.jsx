'use client'

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { allCases, getAllTags } from '@/constants/cases';

export default function CasesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const allTags = getAllTags();

    // Фильтрация кейсов
    const filteredCases = useMemo(() => {
        return allCases.filter(caseItem => {
            // Поиск по тексту
            const matchesSearch = searchQuery === '' || 
                caseItem.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                caseItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                caseItem.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                caseItem.service.toLowerCase().includes(searchQuery.toLowerCase());

            // Фильтрация по тегам
            const matchesTags = selectedTags.length === 0 || 
                selectedTags.some(tag => caseItem.tags.includes(tag));

            return matchesSearch && matchesTags;
        });
    }, [searchQuery, selectedTags]);

    const toggleTag = (tag) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero секция */}
            <section className="relative px-6 md:px-12 py-20 md:py-32 border-b border-gray-100">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl"
                >
                    <p className="font-mono text-sm text-gray-500 mb-4">Кейсы</p>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Результаты нашей работы
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Реальные проекты с измеримыми результатами для бизнеса
                    </p>
                </motion.div>
            </section>

            {/* Поиск и фильтры */}
            <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 md:px-12 py-6">
                <div className="max-w-7xl mx-auto">
                    {/* Поиск */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Поиск по кейсам..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Теги */}
                    <div className="flex flex-wrap gap-2">
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    selectedTags.includes(tag)
                                        ? 'bg-brand text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                        {selectedTags.length > 0 && (
                            <button
                                onClick={() => setSelectedTags([])}
                                className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Сбросить
                            </button>
                        )}
                    </div>

                    {/* Результаты поиска */}
                    {filteredCases.length > 0 && (
                        <p className="mt-4 text-sm text-gray-500">
                            Найдено кейсов: {filteredCases.length}
                        </p>
                    )}
                </div>
            </section>

            {/* Список кейсов */}
            <section className="px-6 md:px-12 py-12 md:py-20">
                {filteredCases.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-lg text-gray-500 mb-4">Кейсы не найдены</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedTags([]);
                            }}
                            className="text-brand hover:underline"
                        >
                            Сбросить фильтры
                        </button>
                    </motion.div>
                ) : (
                    <div className="max-w-7xl mx-auto space-y-8">
                        {filteredCases.map((caseItem, i) => (
                            <motion.article
                                key={caseItem.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1 }}
                                className="group"
                            >
                                <Link href={`/kejsy/${caseItem.slug}`}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 rounded-2xl border border-gray-100 hover:border-brand/30 hover:shadow-lg transition-all">
                                        {/* Изображение */}
                                        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                                            <motion.img
                                                src={caseItem.image}
                                                alt={caseItem.client}
                                                className="w-full h-full object-cover"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>

                                        {/* Контент */}
                                        <div className="md:col-span-2 flex flex-col justify-between">
                                            <div>
                                                {/* Теги */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {caseItem.tags.map(tag => (
                                                        <span
                                                            key={tag}
                                                            className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Заголовок */}
                                                <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-brand transition-colors">
                                                    {caseItem.client}
                                                </h2>

                                                {/* Описание */}
                                                <p className="text-gray-600 mb-4 leading-relaxed">
                                                    {caseItem.description}
                                                </p>

                                                {/* Метаданные */}
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(caseItem.date).toLocaleDateString('ru-RU', { 
                                                            year: 'numeric', 
                                                            month: 'long' 
                                                        })}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        {caseItem.duration}
                                                    </div>
                                                </div>

                                                {/* Результат */}
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 rounded-full mb-4">
                                                    <span className="font-mono text-sm font-bold text-brand">
                                                        {caseItem.result}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <div className="flex items-center gap-2 text-brand group-hover:gap-4 transition-all">
                                                <span className="text-sm font-medium">Читать кейс</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

