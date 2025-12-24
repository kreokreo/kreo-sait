'use client'

import { use } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { getCaseBySlug, getRelatedCases } from '@/lib/cases';
import { CONTACTS } from '@/constants';
import { CaseCard } from '@/components/cases';

export default function CasePage({ params }) {
    const { slug } = use(params);
    const caseItem = getCaseBySlug(slug);

    if (!caseItem) {
        notFound();
    }

    // Похожие кейсы (по тегам)
    const relatedCases = getRelatedCases(caseItem.id, 3);

    return (
        <div className="min-h-screen bg-[#E8E8E8]">
            {/* Hero кейса */}
            <section className="relative w-full px-12 md:px-16 lg:px-24 py-12 md:py-20 bg-transparent overflow-hidden z-10" style={{ overflow: 'visible' }}>
                {/* Размытые декоративные круги */}
                <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px' }}>
                    <div className="absolute top-20 left-[calc(10%+200px)] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-xl"></div>
                    <div className="absolute top-40 right-[calc(20px+200px)] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 left-[calc(25%+200px)] w-[550px] h-[550px] bg-cyan-400/20 rounded-full blur-xl"></div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative max-w-7xl mx-auto z-10"
                >
                    {/* Минималистичная стрелка назад */}
                    <Link 
                        href="/kejsy"
                        className="inline-flex items-center justify-center w-10 h-10 mb-6 text-gray-600 hover:text-brand hover:bg-white/10 rounded-full transition-all group"
                        aria-label="Вернуться к кейсам"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    {/* Теги */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {caseItem.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-medium text-gray-700"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Заголовок */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
                        {caseItem.client}
                    </h1>

                    {/* Описание услуги */}
                    {caseItem.service && (
                        <p className="text-lg md:text-xl text-gray-700 mb-6">
                            {caseItem.service}
                        </p>
                    )}

                    {/* Метаданные */}
                    <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-8">
                        {caseItem.location && (
                            <div className="flex items-center gap-2">
                                <span>{caseItem.location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(caseItem.date).toLocaleDateString('ru-RU', { 
                                year: 'numeric', 
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {caseItem.duration}
                        </div>
                    </div>

                    {/* Результат */}
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8">
                        <span className="font-mono text-lg font-bold text-brand">
                            {caseItem.result}
                        </span>
                    </div>
                </motion.div>
            </section>

            {/* Изображение */}
            <section className="relative w-full px-12 md:px-16 lg:px-24 mb-12 md:mb-20 bg-transparent overflow-hidden z-10" style={{ overflow: 'visible' }}>
                {/* Размытые декоративные круги */}
                <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px' }}>
                    <div className="absolute top-10 right-[calc(25%+200px)] w-[400px] h-[400px] bg-indigo-400/15 rounded-full blur-xl"></div>
                    <div className="absolute bottom-10 left-[calc(33.33%+200px)] w-[350px] h-[350px] bg-pink-400/15 rounded-full blur-xl"></div>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative max-w-7xl mx-auto z-10"
                >
                    <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                        <img
                            src={caseItem.image}
                            alt={caseItem.client}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Контент */}
            <section className="relative w-full px-12 md:px-16 lg:px-24 pb-12 md:pb-20 bg-transparent overflow-hidden z-10" style={{ overflow: 'visible' }}>
                {/* Размытые декоративные круги */}
                <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px' }}>
                    <div className="absolute top-20 left-[calc(10px+200px)] w-[700px] h-[700px] bg-blue-400/20 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 right-[calc(20px+200px)] w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-400/15 rounded-full blur-xl"></div>
                </div>
                <div className="relative max-w-7xl mx-auto z-10">
                    <div className="prose prose-lg max-w-4xl mx-auto">
                        {/* Расширенный контент с разделами */}
                        {caseItem.detailedContent ? (
                            <>
                                {/* Задача */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="mb-12"
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">С чем клиент пришёл</h2>
                                    <div className="text-lg text-gray-700 leading-relaxed">
                                        {caseItem.detailedContent.problem.split('\n\n').map((paragraph, pIdx) => {
                                            if (!paragraph.trim()) return null;
                                            const lines = paragraph.split('\n');
                                            return (
                                                <div key={pIdx} className="mb-6">
                                                    {lines.map((line, lIdx) => {
                                                        const trimmed = line.trim();
                                                        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                                                            return <p key={lIdx} className="font-semibold text-gray-900 mb-3">{trimmed.replace(/\*\*/g, '')}</p>;
                                                        }
                                                        if (trimmed) {
                                                            return <p key={lIdx} className="mb-2">{trimmed}</p>;
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Подход */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="mb-12"
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Как мы к этому подошли</h2>
                                    <div className="text-lg text-gray-700 leading-relaxed">
                                        {caseItem.detailedContent.approach.split('\n\n').map((paragraph, pIdx) => {
                                            if (!paragraph.trim()) return null;
                                            const lines = paragraph.split('\n');
                                            return (
                                                <div key={pIdx} className="mb-6">
                                                    {lines.map((line, lIdx) => {
                                                        const trimmed = line.trim();
                                                        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                                                            return <h3 key={lIdx} className="font-semibold text-gray-900 text-xl mt-6 mb-3">{trimmed.replace(/\*\*/g, '')}</h3>;
                                                        }
                                                        if (trimmed.startsWith('•')) {
                                                            return <p key={lIdx} className="ml-4 mb-2">{trimmed}</p>;
                                                        }
                                                        if (trimmed.startsWith('-')) {
                                                            return <p key={lIdx} className="ml-8 mb-2 text-gray-600">{trimmed}</p>;
                                                        }
                                                        if (trimmed) {
                                                            return <p key={lIdx} className="mb-2">{trimmed}</p>;
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Результаты */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-12 p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl"
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Что в итоге получили</h2>
                                    <div className="text-lg text-gray-700 leading-relaxed">
                                        {caseItem.detailedContent.result.split('\n').map((line, i) => {
                                            const trimmed = line.trim();
                                            if (trimmed.startsWith('•')) {
                                                return <p key={i} className="ml-4 mb-3">{trimmed}</p>;
                                            }
                                            if (trimmed) {
                                                return <p key={i} className="mb-3">{trimmed}</p>;
                                            }
                                            return null;
                                        })}
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-white/20">
                                        <div className="text-3xl md:text-4xl font-bold text-brand mb-2">
                                            {caseItem.result}
                                        </div>
                                        <p className="text-gray-600">
                                            Достигнуто за период работы: {caseItem.duration}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* CTA для клиник */}
                                {caseItem.detailedContent.cta && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 }}
                                        className="mb-12 p-8 bg-brand/10 backdrop-blur-md border border-brand/20 rounded-2xl"
                                    >
                                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Если вы тоже владелец клиники</h2>
                                        <div className="text-lg text-gray-700 leading-relaxed">
                                            {caseItem.detailedContent.cta.split('\n\n').map((paragraph, pIdx) => {
                                                if (!paragraph.trim()) return null;
                                                const lines = paragraph.split('\n');
                                                return (
                                                    <div key={pIdx} className="mb-4">
                                                        {lines.map((line, lIdx) => {
                                                            const trimmed = line.trim();
                                                            if (trimmed.startsWith('•')) {
                                                                return <p key={lIdx} className="ml-4 mb-2">{trimmed}</p>;
                                                            }
                                                            if (trimmed) {
                                                                return <p key={lIdx} className="mb-2">{trimmed}</p>;
                                                            }
                                                            return null;
                                                        })}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Простой формат для старых кейсов */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Задача</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                {caseItem.description}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="mb-12"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Решение</h2>
                            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                                {caseItem.content}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mb-12 p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Результат</h2>
                            <div className="text-4xl md:text-5xl font-bold text-brand mb-2">
                                {caseItem.result}
                            </div>
                            <p className="text-gray-600">
                                Достигнуто за период работы: {caseItem.duration}
                            </p>
                        </motion.div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative w-full px-12 md:px-16 lg:px-24 py-12 md:py-20 bg-transparent overflow-hidden z-10" style={{ overflow: 'visible' }}>
                {/* Размытые декоративные круги */}
                <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px' }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-brand/3 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-brand/3 rounded-full blur-2xl"></div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative max-w-7xl mx-auto text-center z-10"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Хотите такой же результат?</h2>
                    <p className="text-lg text-gray-700 mb-8">
                        Обсудим ваш проект и предложим решение
                    </p>
                    <Link
                        href={`mailto:${CONTACTS.email}`}
                        className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-8 py-4 rounded-full text-base font-medium hover:bg-brand-dark transition-all"
                    >
                        Обсудить проект
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                    </Link>
                </motion.div>
            </section>

            {/* Похожие кейсы */}
            {relatedCases.length > 0 && (
                <section className="relative w-full px-12 md:px-16 lg:px-24 py-12 md:py-20 bg-transparent overflow-hidden z-10" style={{ overflow: 'visible' }}>
                    {/* Размытые декоративные круги */}
                    <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px' }}>
                        <div className="absolute top-20 left-[calc(10px+200px)] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-xl"></div>
                        <div className="absolute bottom-20 right-[calc(20px+200px)] w-[550px] h-[550px] bg-purple-400/20 rounded-full blur-xl"></div>
                    </div>
                    <div className="relative max-w-7xl mx-auto z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Похожие кейсы</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedCases.map((relatedCase, i) => (
                                <CaseCard
                                    key={relatedCase.id}
                                    caseItem={relatedCase}
                                    index={i}
                                    variant="related"
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

