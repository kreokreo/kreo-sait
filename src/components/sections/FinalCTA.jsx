'use client'

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CONTACTS } from '@/constants';

/**
 * Финальный CTA блок
 * @param {Function} onOpenLeadForm - Callback для открытия формы обратной связи
 */
export default function FinalCTA({ onOpenLeadForm }) {
    return (
        <section className="relative px-6 md:px-16 lg:px-24 py-32 md:py-40" style={{ overflow: 'visible' }}>
            {/* Декоративный фон - выходит за границы контейнера */}
            <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-brand/3 rounded-full blur-2xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-brand/3 rounded-full blur-2xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="max-w-5xl mx-auto text-center relative z-10"
            >
                {/* Заголовок с анимацией */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
                        Готовы <span className="text-brand">начать?</span>
                    </h2>
                </motion.div>

                {/* Описание */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                    Расскажите о задаче — предложим решение за 24 часа
                </motion.p>

                {/* Основные кнопки */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
                >
                    {/* Кнопка "Обсудить проект" */}
                    <motion.button
                        onClick={onOpenLeadForm}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative inline-flex items-center justify-center gap-3 bg-brand px-10 py-5 rounded-full text-lg font-semibold text-white overflow-hidden"
                    >
                        {/* Градиентный эффект при наведении */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-brand-light to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        <span className="relative z-10">Обсудить проект</span>
                        <motion.div
                            className="relative z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                            whileHover={{ rotate: 45 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ArrowRight className="w-5 h-5 text-white" />
                        </motion.div>
                    </motion.button>

                    {/* Кнопка Telegram */}
                    <motion.a
                        href={CONTACTS.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group inline-flex items-center justify-center gap-3 bg-gray-900 px-10 py-5 rounded-full text-lg font-semibold text-white hover:bg-gray-800 transition-all"
                    >
                        <span>Telegram</span>
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                    </motion.a>
                </motion.div>

                {/* Дополнительная ссылка */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-8"
                >
                    <motion.button
                        onClick={onOpenLeadForm}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-base text-gray-500 hover:text-brand transition-colors inline-flex items-center gap-2"
                    >
                        <span>Или заполните форму для быстрого ответа</span>
                        <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </motion.div>
            </motion.div>
        </section>
    );
}

