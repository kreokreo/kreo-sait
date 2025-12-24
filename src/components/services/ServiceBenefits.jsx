'use client'

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function ServiceBenefits({ title, description, benefits }) {
    return (
        <section className="relative w-full px-12 md:px-16 lg:px-24 py-20 md:py-32 bg-transparent z-10" style={{ overflow: 'visible' }}>
            {/* Размытые декоративные круги */}
            <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px' }}>
                <div className="absolute top-20 left-[calc(10px+200px)] w-[700px] h-[700px] bg-blue-400/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-[calc(20px+200px)] w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-400/15 rounded-full blur-xl"></div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {benefits.map((benefit, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20"
                        >
                            <Check className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700">{benefit}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

