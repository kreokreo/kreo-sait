'use client'

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ServiceFeatures({ 
    title, 
    description, 
    features, 
    typeMap = null // Маппинг для кликабельных карточек { title: 'url' }
}) {
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
                    {features.map((feature, idx) => {
                        // Обрабатываем как объект, так и строку
                        const featureTitle = typeof feature === 'string' ? feature : (feature.title || '');
                        const featureDescription = typeof feature === 'string' ? '' : (feature.description || '');
                        const featureUrl = typeMap?.[featureTitle];
                        const hasLink = !!featureUrl;

                        const cardContent = (
                            <>
                                {featureTitle && (
                                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-brand transition-colors">
                                        {featureTitle}
                                    </h3>
                                )}
                                {featureDescription && (
                                    <p className="text-gray-700 leading-relaxed">
                                        {featureDescription}
                                    </p>
                                )}
                                {hasLink && (
                                    <div className="mt-4 flex items-center gap-2 text-brand text-sm font-medium">
                                        <span>Подробнее</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                )}
                            </>
                        );

                        return hasLink ? (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <Link
                                    href={featureUrl}
                                    className="group block p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-brand/30 hover:bg-white/20 transition-all"
                                >
                                    {cardContent}
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-brand/30 hover:bg-white/20 transition-all"
                            >
                                {cardContent}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

