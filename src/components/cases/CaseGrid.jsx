'use client'

import { useState } from 'react';
import CaseCard from './CaseCard';
import { useCaseVideoAnimation } from '@/hooks/useCaseVideoAnimation';

/**
 * Компонент сетки кейсов с поддержкой видео-анимации
 * @param {Array} cases - Массив кейсов для отображения
 * @param {boolean} showVideo - Показывать ли видео-анимацию при наведении
 * @param {string} className - Дополнительные CSS классы
 */
export default function CaseGrid({ cases, showVideo = false, className = '' }) {
    const [hoveredCase, setHoveredCase] = useState(null);
    const { videoRefs } = useCaseVideoAnimation(cases.length, hoveredCase);

    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 ${className}`}>
            {cases.map((caseItem, i) => (
                <CaseCard
                    key={caseItem.id || i}
                    caseItem={caseItem}
                    index={i}
                    showVideo={showVideo}
                    isHovered={hoveredCase === i}
                    onMouseEnter={() => setHoveredCase(i)}
                    onMouseLeave={() => setHoveredCase(null)}
                    videoRefCallback={(el) => {
                        if (el) {
                            videoRefs.current[i] = el;
                            // Устанавливаем первый кадр при загрузке
                            const initVideo = () => {
                                el.currentTime = 0;
                                el.pause();
                            };
                            if (el.readyState >= 2) {
                                initVideo();
                            } else {
                                el.addEventListener('loadeddata', initVideo, { once: true });
                                el.addEventListener('loadedmetadata', initVideo, { once: true });
                            }
                        }
                    }}
                    variant="grid"
                />
            ))}
        </div>
    );
}

