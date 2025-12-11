'use client'

import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';

// Динамическая загрузка Spline Viewer с отключением SSR
const SplineViewer = dynamic(
    () => import('@/components/SplineViewer'),
    { 
        ssr: false,
        loading: () => null
    }
);

/**
 * Hero секция с Spline 3D сценой
 * @param {Function} onOpenLeadForm - Callback для открытия формы обратной связи
 * @param {Object} splineBlockRef - Ref для блока Spline
 */
export default function HeroSection({ onOpenLeadForm, splineBlockRef }) {
    return (
        <section 
            ref={splineBlockRef}
            className="relative w-full h-screen overflow-hidden"
        >
            {/* Spline внутри Hero-блока - прокручивается вместе со страницей */}
            <Suspense fallback={null}>
                <div className="absolute inset-0 z-0">
                    <SplineViewer 
                        url="https://prod.spline.design/z86pV7BXa2dCQKsp/scene.splinecode"
                        mobileUrl="https://prod.spline.design/kWSSBGwPnjzwpyix/scene.splinecode"
                    />
                </div>
            </Suspense>

            {/* Контейнер с контентом */}
            <div className="relative z-10 h-full">
                {/* Левый контейнер - весь контент */}
                <div className="relative flex flex-col justify-center items-start p-12 md:p-16 lg:p-24 pointer-events-none h-full">
                    {/* Центрированный контент */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="pointer-events-none w-full"
                    >
                        <div className="mb-4 pointer-events-none">
                            <span 
                                className="inline-block font-mono font-medium text-gray-700 bg-gray-100/50 px-3 py-1.5 rounded-md border border-gray-200/50 whitespace-nowrap"
                                style={{ fontSize: 'clamp(0.75rem, 1vw, 0.875rem)' }}
                            >
                                Разработка и продвижение
                            </span>
                        </div>
                        <h1 
                            className="font-bold tracking-tight leading-[1.1] mb-8 pointer-events-none whitespace-nowrap text-gray-900"
                            style={{ fontSize: 'clamp(2rem, 4vw, 3.75rem)' }}
                        >
                            Digital-агентство KREO
                        </h1>
                        <p 
                            className="text-gray-700 mb-10 leading-relaxed pointer-events-none max-w-2xl"
                            style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.125rem)' }}
                        >
                            От разработки сайтов и веб-приложений до AI-автоматизации и настройки контекстной рекламы — мы создаем полный цикл digital-решений для вашего бизнеса. Разработка, продвижение, интеграции и оптимизация процессов с измеримым результатом и фокусом на рост вашей компании.
                        </p>
                        <button
                            onClick={onOpenLeadForm}
                            className="group inline-flex items-center gap-3 bg-brand px-6 py-3 rounded-full font-medium hover:bg-brand-dark transition-all pointer-events-auto"
                            style={{ fontSize: 'clamp(0.875rem, 1vw, 1rem)' }}
                        >
                            <span className="text-white">Обсудить проект</span>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                        </button>
                    </motion.div>
                    
                    {/* Ссылка на кейсы внизу слева */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="absolute bottom-12 md:bottom-16 lg:bottom-24 left-12 md:left-16 lg:left-24 pointer-events-auto"
                    >
                        <Link 
                            href="#cases" 
                            className="group inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                            style={{ fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)' }}
                        >
                            <span>Кейсы</span>
                            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </div>

        </section>
    );
}

