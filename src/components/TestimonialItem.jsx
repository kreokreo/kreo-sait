'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Компонент для видео/фото отзыва
 * @param {Object} item - Объект отзыва { type: 'video' | 'image', src: string }
 * @param {number} width - Фиксированная ширина элемента в пикселях
 */
export default function TestimonialItem({ item, width }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const videoRef = useRef(null);
    
    // Проверка монтирования для Portal
    useEffect(() => {
        setMounted(true);
    }, []);

    // Загружаем превью (первый кадр) для видео - только метаданные
    useEffect(() => {
        if (item.type === 'video' && videoRef.current && !shouldLoadVideo) {
            const video = videoRef.current;
            const handleLoadedMetadata = () => {
                // Устанавливаем на первый кадр для превью
                video.currentTime = 0.1;
            };
            
            video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
            
            return () => {
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    }, [item.type, item.src, shouldLoadVideo]);
    
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
                className={`flex-shrink-0 group cursor-pointer ${!width ? 'w-1/2 md:w-1/3 lg:w-1/5' : ''}`}
                style={width ? { width: `${width}px` } : undefined}
                onClick={() => {
                    if (item.type === 'video' && videoRef.current) {
                        // Загружаем видео полностью только при первом клике
                        if (!shouldLoadVideo) {
                            setShouldLoadVideo(true);
                            // Перезагружаем видео с полной загрузкой
                            videoRef.current.load();
                            // Небольшая задержка для загрузки перед воспроизведением
                            setTimeout(() => {
                                if (videoRef.current) {
                                    videoRef.current.play().catch(() => {
                                        // Игнорируем ошибки автовоспроизведения
                                    });
                                    setIsPlaying(true);
                                }
                            }, 200);
                        } else {
                            // Переключаем воспроизведение/паузу
                            if (isPlaying) {
                                videoRef.current.pause();
                                setIsPlaying(false);
                            } else {
                                videoRef.current.play();
                                setIsPlaying(true);
                            }
                        }
                    } else if (item.type === 'image') {
                        setIsImageExpanded(true);
                    }
                }}
            >
                {/* Видео/Фото-кружок в стеклянном контейнере */}
                <div className="relative aspect-square rounded-full overflow-hidden bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border-2 border-white/30 group-hover:border-brand/50 group-hover:bg-white/30 transition-all mx-auto shadow-lg group-hover:shadow-xl" style={{ maxWidth: '280px' }}>
                    {item.type === 'video' ? (
                        <>
                            {/* Видео элемент - показывает первый кадр как превью, загружается полностью при клике */}
                            <video
                                ref={videoRef}
                                className="absolute inset-0 w-full h-full object-cover"
                                src={item.src}
                                loop={shouldLoadVideo}
                                playsInline
                                muted
                                preload={shouldLoadVideo ? "auto" : "metadata"}
                                onLoadedMetadata={() => {
                                    // Устанавливаем на первый кадр для превью
                                    if (!shouldLoadVideo && videoRef.current) {
                                        videoRef.current.currentTime = 0.1;
                                    }
                                }}
                            />
                            
                            {/* Иконка Play - показываем если видео не играет */}
                            {!isPlaying && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all z-10">
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

