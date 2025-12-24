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
        <div className="min-h-screen bg-[#E8E8E8]">
            {/* Hero секция */}
            <section className="relative w-full py-20 md:py-32 bg-transparent z-10" style={{ overflow: 'visible' }}>
                {/* Размытые декоративные круги для эффекта стекла - на всю ширину, выходят за границы */}
                <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px' }}>
                    <div className="absolute top-20 left-[calc(10%+200px)] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-xl"></div>
                    <div className="absolute top-40 right-[calc(20px+200px)] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 left-[calc(25%+200px)] w-[550px] h-[550px] bg-cyan-400/20 rounded-full blur-xl"></div>
                </div>
                {/* Контент внутри контейнера */}
                <div className="relative px-12 md:px-16 lg:px-24 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-7xl mx-auto"
                    >
                        <p className="font-mono text-sm text-gray-600 mb-4">Кейсы</p>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
                            Результаты нашей <span className="text-brand">работы</span>
                        </h1>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Реальные проекты с измеримыми результатами для бизнеса
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Поиск и фильтры */}
            <section className="relative w-full py-8 md:py-12 bg-transparent z-10" style={{ overflow: 'visible' }}>
                {/* Размытые декоративные круги - на всю ширину, выходят за границы */}
                <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px' }}>
                    <div className="absolute top-10 right-[calc(25%+200px)] w-[400px] h-[400px] bg-indigo-400/15 rounded-full blur-xl"></div>
                    <div className="absolute bottom-10 left-[calc(33.33%+200px)] w-[350px] h-[350px] bg-pink-400/15 rounded-full blur-xl"></div>
                </div>
                {/* Контент внутри контейнера */}
                <div className="relative px-12 md:px-16 lg:px-24 z-10">
                    <div className="max-w-7xl mx-auto">
                    {/* Поиск в стеклянном контейнере */}
                    <div className="mb-6">
                        <div className="p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Поиск по кейсам..."
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

                    {/* Теги */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    selectedTags.includes(tag)
                                        ? 'bg-brand text-white'
                                        : 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-700 hover:bg-white/20 hover:border-brand/30'
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                        {selectedTags.length > 0 && (
                            <button
                                onClick={() => setSelectedTags([])}
                                className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-md border border-white/20 text-gray-700 hover:bg-white/20 hover:border-brand/30 transition-all flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Сбросить
                            </button>
                        )}
                    </div>

                    {/* Результаты поиска */}
                    {filteredCases.length > 0 && (
                        <p className="text-sm text-gray-600">
                            Найдено кейсов: {filteredCases.length}
                        </p>
                    )}
                    </div>
                </div>
            </section>

            {/* Список кейсов */}
            <section className="relative w-full py-12 md:py-20 bg-transparent z-10" style={{ overflow: 'visible' }}>
                {/* Размытые декоративные круги - на всю ширину, выходят за границы */}
                <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px' }}>
                    <div className="absolute top-20 left-[calc(10px+200px)] w-[700px] h-[700px] bg-blue-400/20 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 right-[calc(20px+200px)] w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-400/15 rounded-full blur-xl"></div>
                </div>
                {/* Контент внутри контейнера */}
                <div className="relative px-12 md:px-16 lg:px-24 z-10">
                    <div className="max-w-7xl mx-auto">
                    {filteredCases.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <p className="text-lg text-gray-600 mb-4">Кейсы не найдены</p>
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
                        <div className="space-y-8">
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
                    </div>
                </div>
            </section>
        </div>
    );
}

