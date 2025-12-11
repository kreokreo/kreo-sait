'use client'

import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const cursorRef = useRef(null);
    const cursorDotRef = useRef(null);

    useEffect(() => {
        let animationFrameId;
        
        const handleMouseMove = (e) => {
            // Используем requestAnimationFrame для плавной анимации
            animationFrameId = requestAnimationFrame(() => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
            
            const target = e.target;
            const isClickable = 
                target.tagName === 'A' || 
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                window.getComputedStyle(target).cursor === 'pointer';
            
            setIsPointer(isClickable);
            });
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, []);

    // Плавное следование курсора с задержкой
    useEffect(() => {
        if (!cursorRef.current || !cursorDotRef.current) return;

        const cursor = cursorRef.current;
        const dot = cursorDotRef.current;
        
        let currentX = position.x;
        let currentY = position.y;
        let dotX = position.x;
        let dotY = position.y;

        const animate = () => {
            // Внешний курсор следует с небольшой задержкой
            currentX += (position.x - currentX) * 0.1;
            currentY += (position.y - currentY) * 0.1;
            
            // Внутренняя точка следует быстрее
            dotX += (position.x - dotX) * 0.3;
            dotY += (position.y - dotY) * 0.3;

            cursor.style.left = `${currentX}px`;
            cursor.style.top = `${currentY}px`;
            
            dot.style.left = `${dotX}px`;
            dot.style.top = `${dotY}px`;

            requestAnimationFrame(animate);
        };

        animate();
    }, [position]);

    // Не показываем на мобильных устройствах
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    return (
        <>
            {/* Внешний курсор - большое кольцо */}
        <div
                ref={cursorRef}
                className="fixed pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    width: isPointer ? '48px' : '32px',
                    height: isPointer ? '48px' : '32px',
                    opacity: isVisible ? 1 : 0,
                    transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`,
                    transition: 'width 0.3s ease-out, height 0.3s ease-out, transform 0.1s ease-out, opacity 0.2s ease-out',
                    left: position.x,
                    top: position.y,
                }}
            >
                <div 
                    className="w-full h-full rounded-full border-2 border-white"
                    style={{
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                    }}
                />
            </div>

            {/* Внутренняя точка */}
            <div
                ref={cursorDotRef}
                className="fixed w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
            style={{
                    left: position.x - 4,
                    top: position.y - 4,
                opacity: isVisible ? 1 : 0,
                    transform: `scale(${isClicking ? 0.5 : 1})`,
                    transition: 'transform 0.1s ease-out, opacity 0.2s ease-out',
            }}
        />
        </>
    );
}