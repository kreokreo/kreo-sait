'use client'

import { use } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { allCases } from '@/constants/cases';
import { CONTACTS } from '@/constants';

export default function CasePage({ params }) {
    const { slug } = use(params);
    const caseItem = allCases.find(c => c.slug === slug);

    if (!caseItem) {
        notFound();
    }

    // Похожие кейсы (по тегам)
    const relatedCases = allCases
        .filter(c => 
            c.id !== caseItem.id && 
            c.tags.some(tag => caseItem.tags.includes(tag))
        )
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-white">
            {/* Навигация назад */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 md:px-12 py-4">
                    <Link 
                        href="/kejsy"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-brand transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Все кейсы
                    </Link>
                </div>
            </div>

            {/* Hero кейса */}
            <section className="px-6 md:px-12 py-12 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Теги */}
                    <div className="flex flex-wrap gap-2 mb-6">
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
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        {caseItem.client}
                    </h1>

                    {/* Описание услуги */}
                    {caseItem.service && (
                        <p className="text-lg md:text-xl text-gray-600 mb-6">
                            {caseItem.service}
                        </p>
                    )}

                    {/* Метаданные */}
                    <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-8">
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
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-brand/10 rounded-full mb-8">
                        <span className="font-mono text-lg font-bold text-brand">
                            {caseItem.result}
                        </span>
                    </div>
                </motion.div>
            </section>

            {/* Изображение */}
            <section className="px-6 md:px-12 mb-12 md:mb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
                        <img
                            src={caseItem.image}
                            alt={caseItem.client}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Контент */}
            <section className="px-6 md:px-12 pb-12 md:pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none">
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
                                    <h2 className="text-2xl md:text-3xl font-bold mb-6">С чем клиент пришёл</h2>
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
                                    <h2 className="text-2xl md:text-3xl font-bold mb-6">Как мы к этому подошли</h2>
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
                                    className="mb-12 p-8 bg-gray-50 rounded-2xl"
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold mb-6">Что в итоге получили</h2>
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
                                    <div className="mt-6 pt-6 border-t border-gray-200">
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
                                        className="mb-12 p-8 bg-brand/5 rounded-2xl border border-brand/20"
                                    >
                                        <h2 className="text-2xl md:text-3xl font-bold mb-6">Если вы тоже владелец клиники</h2>
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
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Задача</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
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
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Решение</h2>
                            <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                                {caseItem.content}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mb-12 p-8 bg-gray-50 rounded-2xl"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Результат</h2>
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
            <section className="px-6 md:px-12 py-12 md:py-20 bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Хотите такой же результат?</h2>
                    <p className="text-lg text-gray-600 mb-8">
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
                <section className="px-6 md:px-12 py-12 md:py-20 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8">Похожие кейсы</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedCases.map((relatedCase, i) => (
                                <motion.div
                                    key={relatedCase.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group"
                                >
                                    <Link href={`/kejsy/${relatedCase.slug}`}>
                                        <div className="rounded-xl border border-gray-100 hover:border-brand/30 overflow-hidden transition-all">
                                            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                                                <img
                                                    src={relatedCase.image}
                                                    alt={relatedCase.client}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-semibold text-lg mb-2 group-hover:text-brand transition-colors">
                                                    {relatedCase.client}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-3">{relatedCase.result}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {relatedCase.tags.slice(0, 2).map(tag => (
                                                        <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

