'use client'

import { motion } from 'framer-motion';
import { Zap, DollarSign, Sparkles } from 'lucide-react';

/**
 * Секция "Почему с нами выгодно"
 */
export default function WhyUsSection() {
    return (
        <section className="relative px-6 md:px-16 lg:px-24 pt-0 pb-0">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
            >
                {/* Основные преимущества */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    {/* Быстрее */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group p-8 rounded-2xl border border-gray-100 hover:border-brand/30 hover:shadow-lg transition-all"
                    >
                        <div className="p-3 rounded-xl bg-brand/10 group-hover:bg-brand/20 transition-colors w-fit mb-4">
                            <Zap className="w-6 h-6 text-brand" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-brand transition-colors">
                            Быстрее
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Сокращаем сроки разработки в 2-3 раза за счет автоматизации и оптимизации процессов
                        </p>
                    </motion.div>

                    {/* Дешевле */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -5 }}
                        className="group p-8 rounded-2xl border border-gray-100 hover:border-brand/30 hover:shadow-lg transition-all"
                    >
                        <div className="p-3 rounded-xl bg-brand/10 group-hover:bg-brand/20 transition-colors w-fit mb-4">
                            <DollarSign className="w-6 h-6 text-brand" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-brand transition-colors">
                            Дешевле
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Экономьте до 30-50% бюджета благодаря эффективным решениям и оптимизации расходов
                        </p>
                    </motion.div>

                    {/* Качественнее */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ y: -5 }}
                        className="group p-8 rounded-2xl border border-gray-100 hover:border-brand/30 hover:shadow-lg transition-all"
                    >
                        <div className="p-3 rounded-xl bg-brand/10 group-hover:bg-brand/20 transition-colors w-fit mb-4">
                            <Sparkles className="w-6 h-6 text-brand" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-brand transition-colors">
                            Качественнее
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Получайте надежные решения с гарантией качества и долгосрочной поддержкой
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}

