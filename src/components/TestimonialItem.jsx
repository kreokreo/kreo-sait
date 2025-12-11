'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Компонент для видео/фото отзыва
 * @param {Object} item - Объект отзыва { type: 'video' | 'image', src: string }
 */
export default function TestimonialItem({ item }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);
    const videoRef = useRef(null);
    
    // Проверка монтирования для Portal
    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Закрытие по Escape и блокировка скролла
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isImageExpanded) {
                setIsImageExpanded(false);
            }
        };
        
        if (isImageExpanded) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
            document.body.style.cursor = 'default';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
            document.body.style.cursor = '';
        };
    }, [isImageExpanded]);
    
    return (
        <>
            <div
                className="flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/5 group cursor-pointer"
                onClick={() => {
                    if (item.type === 'video' && videoRef.current) {
                        if (isPlaying) {
                            videoRef.current.pause();
                            setIsPlaying(false);
                        } else {
                            videoRef.current.play();
                            setIsPlaying(true);
                        }
                    } else if (item.type === 'image') {
                        setIsImageExpanded(true);
                    }
                }}
            >
                {/* Видео/Фото-кружок */}
                <div className="relative aspect-square rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200 group-hover:border-brand/50 transition-all mx-auto" style={{ maxWidth: '280px' }}>
                    {item.type === 'video' ? (
                        <>
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                src={item.src}
                                loop
                                playsInline
                                preload="metadata"
                            />
                            {/* Иконка Play */}
                            {!isPlaying && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
                                    <Play className="w-8 h-8 md:w-12 md:h-12 text-white/90 group-hover:text-brand transition-colors" />
                                </div>
                            )}
                        </>
                    ) : (
                        <img
                            className="w-full h-full object-cover"
                            src={item.src}
                            alt="Отзыв"
                        />
                    )}
                    {/* Декоративный градиент при наведении */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand/0 to-brand/0 group-hover:from-brand/10 group-hover:to-brand/5 transition-all" />
                </div>
            </div>
            
            {/* Модальное окно с увеличенным изображением - рендерится через Portal */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isImageExpanded && item.type === 'image' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 cursor-pointer"
                            style={{
                                background: 'rgba(0, 0, 0, 0.85)',
                                backdropFilter: 'blur(8px)'
                            }}
                            onClick={() => setIsImageExpanded(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="relative max-w-2xl w-full max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden cursor-default"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="relative w-full h-full flex items-center justify-center p-4">
                                    <img
                                        className="w-full h-full object-contain rounded-lg"
                                        src={item.src}
                                        alt="Отзыв"
                                    />
                                </div>
                                <button
                                    onClick={() => setIsImageExpanded(false)}
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 z-10 cursor-pointer"
                                    aria-label="Закрыть"
                                >
                                    <svg
                                        className="w-5 h-5 text-gray-900"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}

