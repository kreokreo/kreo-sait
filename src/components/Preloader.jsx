'use client'

import { useEffect, useState } from 'react';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Минимальное время показа прелоадера (уменьшено для быстрого отклика)
        const minDisplayTime = 300;
        const startTime = Date.now();

        // Функция для скрытия прелоадера
        const hidePreloader = () => {
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, minDisplayTime - elapsed);

            // Используем requestAnimationFrame для плавности
            requestAnimationFrame(() => {
                setTimeout(() => {
                    setIsLoading(false);
                    // Задержка перед полным скрытием для плавного исчезновения
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            setIsVisible(false);
                        }, 300);
                    });
                }, remainingTime);
            });
        };

        // Проверяем состояние загрузки страницы
        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            // Ждем полной загрузки страницы
            window.addEventListener('load', hidePreloader, { once: true });
            
            // Также проверяем DOMContentLoaded для более быстрого отклика
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    // Небольшая задержка для рендеринга основного контента
                    setTimeout(hidePreloader, 200);
                }, { once: true });
            }
            
            // Fallback таймер на случай, если события не сработают
            const fallbackTimer = setTimeout(() => {
                hidePreloader();
            }, 2000);

            return () => {
                window.removeEventListener('load', hidePreloader);
                clearTimeout(fallbackTimer);
            };
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div
            data-preloader
            className="fixed inset-0 z-[9999] bg-[#E8E8E8] flex items-center justify-center"
            style={{ 
                opacity: isLoading ? 1 : 0,
                transition: 'opacity 0.3s ease-out',
                pointerEvents: isLoading ? 'auto' : 'none'
            }}
        >
            <div className="relative">
                {/* Кружок загрузки вокруг логотипа - упрощенная версия без framer-motion */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                        className="w-48 h-48 md:w-56 md:h-56 animate-spin"
                        viewBox="0 0 200 200"
                        style={{ animationDuration: '2s' }}
                    >
                        <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="150 400"
                            className="text-brand/30"
                        />
                        <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="60 490"
                            className="text-brand"
                            style={{
                                strokeDashoffset: '60',
                                animation: 'dash 1.5s ease-in-out infinite',
                                animationName: 'dash'
                            }}
                        />
                    </svg>
                </div>
                
                {/* Логотип в центре */}
                <div className="relative w-32 h-16 md:w-40 md:h-20 z-10 flex items-center justify-center">
                    <img 
                        src="/logo.png"
                        alt="KREO Logo"
                        className="w-full h-full object-contain"
                        style={{
                            filter: 'brightness(0) saturate(100%) invert(48%) sepia(100%) saturate(5000%) hue-rotate(190deg) brightness(1.1) contrast(1.2)'
                        }}
                        loading="eager"
                        fetchPriority="high"
                    />
                </div>
            </div>
        </div>
    );
}

