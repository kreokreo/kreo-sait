'use client'

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ServiceCTA({ title, description, onOpenLeadForm }) {
    return (
        <section className="relative w-full px-12 md:px-16 lg:px-24 py-20 md:py-32 bg-transparent z-10" style={{ overflow: 'visible' }}>
            {/* Декоративный фон */}
            <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px' }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-brand/3 rounded-full blur-2xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-brand/3 rounded-full blur-2xl"></div>
            </div>
            <div className="relative max-w-7xl mx-auto z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center p-8 md:p-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                            {description}
                        </p>
                    )}
                    <button
                        onClick={onOpenLeadForm}
                        className="group inline-flex items-center gap-3 bg-brand px-8 py-4 rounded-full text-base font-medium hover:bg-brand/90 transition-all"
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

