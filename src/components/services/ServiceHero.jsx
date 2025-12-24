'use client'

import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ServiceHero({ title, seoDescription, description, onOpenLeadForm, backUrl = '/uslugi' }) {
    return (
        <section className="relative w-full px-12 md:px-16 lg:px-24 py-12 md:py-20 bg-transparent z-10" style={{ overflow: 'visible' }}>
            {/* Размытые декоративные круги для эффекта стекла */}
            <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px' }}>
                <div className="absolute top-20 left-[calc(10%+200px)] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-xl"></div>
                <div className="absolute top-40 right-[calc(20px+200px)] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 left-[calc(25%+200px)] w-[550px] h-[550px] bg-cyan-400/20 rounded-full blur-xl"></div>
            </div>
            <div className="relative max-w-7xl mx-auto z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Кнопка назад */}
                    <Link 
                        href={backUrl}
                        className="inline-flex items-center justify-center w-10 h-10 mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gray-700 hover:text-brand hover:border-brand/30 hover:bg-white/20 transition-all"
                        aria-label="Назад"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
                        {title}
                    </h1>

                    <div className="text-lg md:text-xl text-gray-700 max-w-4xl mb-8 leading-relaxed">
                        <p className="mb-4">
                            {seoDescription}
                        </p>
                        {description && (
                            <p className="text-base text-gray-600">
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onOpenLeadForm}
                        className="group inline-flex items-center gap-3 bg-brand px-6 py-3 rounded-full text-base font-medium hover:bg-brand-dark transition-all"
                    >
                        <span className="text-white">Обсудить проект</span>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
                        </div>
                    </button>
                </motion.div>
            </div>
        </section>
    );
}

