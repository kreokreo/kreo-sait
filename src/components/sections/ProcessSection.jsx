'use client'

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/**
 * Секция "Процесс работы"
 * @param {Function} onOpenLeadForm - Callback для открытия формы обратной связи
 */
export default function ProcessSection({ onOpenLeadForm }) {
    const processSteps = [
        {
            step: 1,
            title: 'Анализ и планирование',
            description: 'Изучаем ваши задачи и требования, анализируем текущую ситуацию и формируем детальный план реализации с согласованными сроками и бюджетом.'
        },
        {
            step: 2,
            title: 'Реализация',
            description: 'Наша команда специалистов выполняет работу по согласованному плану. Ваш личный менеджер проекта координирует процессы, обеспечивает коммуникацию и регулярную отчётность.'
        },
        {
            step: 3,
            title: 'Запуск и сопровождение',
            description: 'Внедряем готовое решение и обеспечиваем стабильную работу. Мониторим результаты, анализируем эффективность и вносим улучшения при необходимости.'
        }
    ];

    return (
        <section className="relative z-10 w-full pt-20 md:pt-32 pb-0 bg-transparent" style={{ overflow: 'visible' }}>
            {/* Размытые декоративные круги для эффекта стекла */}
            <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px', top: '-100px', bottom: '-100px' }}>
                <div className="absolute top-20 left-[calc(10px+200px)] w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-[calc(20px+200px)] w-[350px] h-[350px] bg-cyan-400/20 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-400/15 rounded-full blur-xl"></div>
            </div>

            <div className="relative w-full px-6 md:px-16 lg:px-24">
                {/* Заголовок */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 md:mb-16"
                >
                    <p className="font-mono text-sm text-gray-600 mb-4">Наш процесс</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Как мы <span className="text-brand">работаем</span>
                    </h2>
                    <p className="text-lg text-gray-700 max-w-3xl mb-6 leading-relaxed">
                        Структурированный процесс с прозрачной отчётностью на каждом этапе
                    </p>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-8">
                        <p className="text-base text-gray-600 max-w-3xl leading-relaxed flex-1">
                            Наш индивидуальный подход к каждому проекту включает большую команду специалистов и личного менеджера проекта, с которым можно закрыть любой вопрос. Вы всегда знаете, что происходит с вашим проектом, и можете оперативно решать любые задачи.
                        </p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex-shrink-0"
                        >
                            <button
                                onClick={onOpenLeadForm}
                                className="group inline-flex items-center gap-3 bg-brand px-6 py-3 rounded-full text-base font-medium hover:bg-brand/90 transition-all"
                            >
                                <span className="text-white">Обсудить проект</span>
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
                                </div>
                            </button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Сетка шагов */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
                    {processSteps.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-brand/30 hover:bg-white/20 transition-all"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-brand mb-4">
                                {item.step}
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">
                                {item.title}
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

