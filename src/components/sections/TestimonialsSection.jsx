'use client'

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { testimonials } from '@/constants';
import TestimonialItem from '@/components/TestimonialItem';

/**
 * Секция "Видео-отзывы"
 */
export default function TestimonialsSection() {
    const [carouselIndex, setCarouselIndex] = useState(0);
    const containerRef = useRef(null);
    const glassContainerRef = useRef(null);
    const [itemWidth, setItemWidth] = useState(0);
    const [gap, setGap] = useState(8); // 0.5rem = 8px
    
    // Расчет ширины элемента на основе контейнера
    useEffect(() => {
        const updateItemWidth = () => {
            if (!containerRef.current || !glassContainerRef.current) return;
            
            // containerRef теперь имеет ширину равную стеклянному контейнеру (благодаря отрицательным margin)
            const containerWidth = containerRef.current.offsetWidth;
            
            // Определяем количество видимых элементов
            let visibleCount = 2; // mobile
            if (window.innerWidth >= 1024) visibleCount = 5; // lg
            else if (window.innerWidth >= 768) visibleCount = 3; // md
            
            const gapValue = window.innerWidth >= 768 ? 12 : 8; // md:gap-3 (12px), base: gap-2 (8px)
            setGap(gapValue);
            
            // Ширина элемента = (ширина контейнера - (gap * (visibleCount - 1))) / visibleCount
            const calculatedWidth = (containerWidth - (gapValue * (visibleCount - 1))) / visibleCount;
            setItemWidth(Math.max(calculatedWidth, 100)); // Минимальная ширина 100px
        };
        
        // Небольшая задержка для правильного расчета после рендера
        const timeoutId = setTimeout(updateItemWidth, 100);
        updateItemWidth();
        window.addEventListener('resize', updateItemWidth);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updateItemWidth);
        };
    }, []);
    
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
        <section className="relative z-10 w-full pt-0 pb-20 md:pb-32 bg-transparent" style={{ overflow: 'visible' }}>
            {/* Размытые декоративные круги для эффекта стекла - используем те же, что в ProcessSection */}
            <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px', top: '-100px', bottom: '-100px' }}>
                <div className="absolute top-20 left-[calc(10px+200px)] w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-[calc(20px+200px)] w-[350px] h-[350px] bg-cyan-400/20 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-400/15 rounded-full blur-xl"></div>
            </div>

            <div className="relative w-full px-6 md:px-16 lg:px-24">
                {/* Карусель видео-отзывов в стеклянном контейнере */}
                <div className="relative w-full">
                    {/* Заголовок "Отзывы" без отступов над контейнером */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="font-mono text-sm text-gray-600 mb-0"
                    >
                        Отзывы
                    </motion.p>
                    {/* Стеклянный контейнер для карусели */}
                    <div ref={glassContainerRef} className="mt-0 p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                        {/* Контейнер карусели - используем отрицательные margin для компенсации padding */}
                        <div 
                            ref={containerRef} 
                            className="overflow-x-hidden overflow-y-visible -mx-6 md:-mx-8 w-[calc(100%+3rem)] md:w-[calc(100%+4rem)]"
                        >
                            <motion.div
                                className="flex flex-nowrap gap-2 md:gap-3 px-6 md:px-8"
                                animate={{ 
                                    x: testimonials.length > 0 && itemWidth > 0
                                        ? `-${carouselIndex * (itemWidth + gap)}px` 
                                        : '0px'
                                }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                style={{ willChange: 'transform' }}
                            >
                                {/* Дублируем элементы для бесконечной прокрутки */}
                                {testimonials.length > 0 && [...testimonials, ...testimonials, ...testimonials].map((item, idx) => (
                                    <TestimonialItem key={idx} item={item} width={itemWidth} />
                                ))}
                            </motion.div>
                        </div>

                        {/* Кнопки навигации */}
                        <div className="flex items-center justify-center gap-4 mt-6 md:mt-8">
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
            </div>
        </section>
    );
}

