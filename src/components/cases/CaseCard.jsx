'use client'

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef } from 'react';

/**
 * Компонент карточки кейса
 * @param {Object} caseItem - Объект кейса
 * @param {number} index - Индекс кейса (для анимации)
 * @param {boolean} showVideo - Показывать ли видео-анимацию
 * @param {boolean} isHovered - Наведена ли мышь на карточку
 * @param {Function} onMouseEnter - Обработчик наведения мыши
 * @param {Function} onMouseLeave - Обработчик ухода мыши
 * @param {Function} videoRefCallback - Callback для установки ref видео элемента (если showVideo = true)
 * @param {string} variant - Вариант отображения: 'grid' | 'list' | 'related'
 */
export default function CaseCard({
    caseItem,
    index = 0,
    showVideo = false,
    isHovered = false,
    onMouseEnter,
    onMouseLeave,
    videoRefCallback,
    variant = 'grid'
}) {
    const [isImageHovered, setIsImageHovered] = useState(false);
    const imageHeightRef = useRef(null);
    // Определяем путь к видео или изображению
    const mediaSrc = showVideo && caseItem.animation 
        ? caseItem.animation 
        : caseItem.image;

    // Варианты отображения
    if (variant === 'list') {
        return (
            <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                className="group"
            >
                <Link href={`/kejsy/${caseItem.slug}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md hover:border-brand/30 hover:bg-white/20 hover:shadow-lg transition-all">
                        {/* Изображение */}
                        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-white/5">
                            <motion.img
                                src={caseItem.image}
                                alt={caseItem.client}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        {/* Контент */}
                        <div className="md:col-span-2 flex flex-col justify-between">
                            <div>
                                {/* Теги */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {caseItem.tags?.slice(0, 3).map(tag => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-gray-600"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Заголовок */}
                                <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-brand transition-colors">
                                    {caseItem.client}
                                </h2>

                                {/* Описание */}
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    {caseItem.description}
                                </p>

                                {/* Результат */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 rounded-full mb-4">
                                    <span className="font-mono text-sm font-bold text-brand">
                                        {caseItem.result}
                                    </span>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="flex items-center gap-2 text-brand group-hover:gap-4 transition-all">
                                <span className="text-sm font-medium">Читать кейс</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.article>
        );
    }

    if (variant === 'related') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
            >
                <Link href={`/kejsy/${caseItem.slug}`}>
                    <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md hover:border-brand/30 hover:bg-white/20 overflow-hidden transition-all">
                        <div className="aspect-[4/3] overflow-hidden bg-white/5">
                            <img
                                src={caseItem.image}
                                alt={caseItem.client}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-5">
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-brand transition-colors">
                                {caseItem.client}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">{caseItem.result}</p>
                            <div className="flex flex-wrap gap-1">
                                {caseItem.tags?.slice(0, 2).map(tag => (
                                    <span key={tag} className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-gray-700">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
    }

    // Вариант по умолчанию: 'grid' (для главной страницы)
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md hover:border-brand/30 hover:bg-white/20 transition-all"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <Link 
                href={`/kejsy/${caseItem.slug}`} 
                className="block w-full h-full"
                onMouseEnter={() => {
                    if (caseItem.id === 'win-win' || caseItem.id === 'dental-deal-clinic' || caseItem.id === 'prodljonka' || caseItem.id === 'marshal-grand-hall') {
                        setIsImageHovered(true);
                    }
                    if (onMouseEnter) onMouseEnter();
                }}
                onMouseLeave={() => {
                    if (caseItem.id === 'win-win' || caseItem.id === 'dental-deal-clinic' || caseItem.id === 'prodljonka' || caseItem.id === 'marshal-grand-hall') {
                        setIsImageHovered(false);
                    }
                    if (onMouseLeave) onMouseLeave();
                }}
            >
                {/* Видео/Изображение контейнер */}
                <div 
                    className={`relative aspect-[4/3] overflow-hidden bg-white/5 ${
                        caseItem.id === 'win-win' || caseItem.id === 'dental-deal-clinic' || caseItem.id === 'prodljonka' || caseItem.id === 'marshal-grand-hall' || caseItem.id === 'velorra' || caseItem.id === 'rubik' || caseItem.id === 'selfler' ? 'bg-white/10' : ''
                    }`}
                >
                    {showVideo && caseItem.animation ? (
                        <video
                            ref={videoRefCallback}
                            src={caseItem.animation}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ 
                                pointerEvents: 'none'
                            }}
                            muted
                            playsInline
                            preload="metadata"
                        />
                    ) : (
                        /* Контейнер для изображения */
                        <div className="absolute inset-0 overflow-hidden">
                            <motion.img
                                src={caseItem.image}
                                alt={caseItem.client}
                                className={`${
                                    caseItem.id === 'win-win' || caseItem.id === 'dental-deal-clinic' || caseItem.id === 'prodljonka' || caseItem.id === 'marshal-grand-hall'
                                        ? 'absolute object-contain h-auto top-0 left-0 w-full object-top' 
                                        : 'absolute w-full h-full object-cover inset-0'
                                }`}
                            onLoad={(e) => {
                                if (caseItem.id === 'win-win' || caseItem.id === 'dental-deal-clinic' || caseItem.id === 'prodljonka' || caseItem.id === 'marshal-grand-hall') {
                                    setTimeout(() => {
                                        const img = e.target;
                                        const container = img.parentElement; // Контейнер с overflow-hidden
                                        if (container) {
                                            // Получаем реальную высоту изображения с учетом масштабирования
                                            const imgRect = img.getBoundingClientRect();
                                            const containerRect = container.getBoundingClientRect();
                                            
                                            // Вычисляем разницу между высотой изображения и высотой контейнера (который уже учитывает отступы рамки)
                                            // Для WIN-WIN и продлёнки нужен меньший запас, для остальных - больший
                                            let extraPadding = 20;
                                            if (caseItem.id === 'win-win') {
                                                extraPadding = 5;
                                            } else if (caseItem.id === 'prodljonka') {
                                                extraPadding = -10; // Отрицательный запас для продлёнки, чтобы ограничить прокрутку
                                            }
                                            
                                            // Базовая разница между высотой изображения и контейнера
                                            const baseScrollAmount = imgRect.height - containerRect.height;
                                            
                                            // Ограничиваем прокрутку, чтобы не было пустого пространства
                                            // Для продлёнки уменьшаем прокрутку, чтобы не было пустого пространства снизу
                                            const scrollAmount = caseItem.id === 'prodljonka' 
                                                ? Math.max(0, baseScrollAmount + extraPadding) 
                                                : baseScrollAmount + extraPadding;
                                            
                                            if (scrollAmount > 0) {
                                                imageHeightRef.current = scrollAmount;
                                            }
                                        }
                                    }, 200);
                                }
                            }}
                            style={
                                caseItem.id === 'win-win' || caseItem.id === 'dental-deal-clinic' || caseItem.id === 'prodljonka' || caseItem.id === 'marshal-grand-hall'
                                    ? {
                                        transform: isImageHovered 
                                            ? imageHeightRef.current 
                                                ? `translateY(-${imageHeightRef.current}px) ${caseItem.id === 'win-win' ? 'scale(1.1)' : 'scale(1.0)'}` 
                                                : caseItem.id === 'win-win'
                                                    ? 'translateY(-60%) scale(1.1)'
                                                    : 'translateY(-85%) scale(1.0)'
                                            : caseItem.id === 'win-win' 
                                                ? 'translateY(0) scale(1.1)' 
                                                : 'translateY(0) scale(1.0)',
                                        transition: 'transform 12s ease-in-out',
                                        transformOrigin: 'top center'
                                    }
                                    : {}
                            }
                            animate={
                                caseItem.id === 'win-win' || caseItem.id === 'dental-deal-clinic' || caseItem.id === 'prodljonka' || caseItem.id === 'marshal-grand-hall'
                                    ? {} 
                                    : { 
                                        scale: isHovered ? 1.05 : 1,
                                        transition: { duration: 0.4, ease: "easeOut" }
                                    }
                            }
                                loading="lazy"
                            />
                        </div>
                    )}
                    
                    {/* Иконка стрелки */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                            opacity: isHovered ? 1 : 0,
                            scale: isHovered ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-4 right-4"
                    >
                        <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <ArrowRight className="w-5 h-5 text-brand" />
                        </div>
                    </motion.div>
                </div>

                {/* Контент */}
                <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                    {/* Теги */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {caseItem.tags?.slice(0, 3).map(tag => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="mb-3">
                        <h3 className="text-xl font-bold mb-1 group-hover:text-brand transition-colors">
                            {caseItem.client}
                        </h3>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 font-mono">{caseItem.service}</p>
                        <motion.div
                            whileHover={{ x: 5 }}
                            className="text-brand"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </motion.div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

