'use client'

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { testimonials } from '@/constants';
import TestimonialItem from '@/components/TestimonialItem';

/**
 * Секция "Видео-отзывы"
 */
export default function TestimonialsSection() {
    const [carouselIndex, setCarouselIndex] = useState(0);
    
    // Бесконечная карусель
    const handleNext = () => {
        if (testimonials.length === 0) return;
        setCarouselIndex((prev) => (prev + 1) % testimonials.length);
    };
    
    const handlePrev = () => {
        if (testimonials.length === 0) return;
        setCarouselIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="relative z-10 w-full py-20 md:py-32 bg-transparent overflow-hidden">
            {/* Размытые декоративные круги для эффекта стекла */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-20 w-[350px] h-[350px] bg-cyan-400/20 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-400/15 rounded-full blur-xl"></div>
            </div>

            <div className="relative w-full px-6 md:px-16 lg:px-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 md:mb-16"
                >
                    <p className="font-mono text-sm text-gray-600 mb-4">Отзывы</p>
                    <h2 className="text-3xl md:text-5xl font-bold">Что говорят <span className="text-brand">клиенты</span></h2>
                </motion.div>
                
                {/* Карусель видео-отзывов - бесконечная */}
                <div className="relative w-full">
                    {/* Контейнер карусели */}
                    <div className="overflow-hidden w-full">
                        <motion.div
                            className="flex gap-1 md:gap-2"
                            animate={{ x: testimonials.length > 0 ? `-${carouselIndex * (100 / testimonials.length)}%` : '0%' }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            {/* Дублируем элементы для бесконечной прокрутки */}
                            {testimonials.length > 0 && [...testimonials, ...testimonials, ...testimonials].map((item, idx) => (
                                <TestimonialItem key={idx} item={item} />
                            ))}
                        </motion.div>
                    </div>

                    {/* Кнопки навигации */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={handlePrev}
                            className="p-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md hover:border-brand/30 hover:bg-white/20 transition-all"
                        >
                            <ArrowRight className="w-5 h-5 text-gray-700 rotate-180" />
                        </button>
                        
                        {/* Индикаторы */}
                        {testimonials.length > 0 && (
                            <div className="flex gap-2">
                                {testimonials.map((_, dot) => (
                                    <button
                                        key={dot}
                                        onClick={() => setCarouselIndex(dot)}
                                        className={`h-2 rounded-full transition-all ${
                                            testimonials.length > 0 && carouselIndex % testimonials.length === dot ? 'bg-brand w-6' : 'bg-gray-400 w-2'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleNext}
                            className="p-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md hover:border-brand/30 hover:bg-white/20 transition-all"
                        >
                            <ArrowRight className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

