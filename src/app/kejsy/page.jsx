'use client'

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { getAllTags } from '@/constants/cases';
import { getFilteredCases } from '@/lib/cases';
import { CaseCard } from '@/components/cases';

export default function CasesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const allTags = getAllTags();

    // Фильтрация кейсов
    const filteredCases = useMemo(() => {
        return getFilteredCases({
            searchQuery,
            tags: selectedTags
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
                            <CaseCard
                                key={caseItem.id}
                                caseItem={caseItem}
                                index={i}
                                variant="list"
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

