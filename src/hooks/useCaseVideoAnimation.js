import { useEffect, useRef } from 'react';

/**
 * Хук для управления видео-анимацией кейсов при наведении
 * @param {number} totalCases - Общее количество кейсов
 * @param {number|null} hoveredCase - Индекс наведенного кейса (null если нет)
 * @returns {Object} Объект с refs для видео элементов
 */
export function useCaseVideoAnimation(totalCases, hoveredCase) {
    const videoRefs = useRef({});
    const reverseAnimationRefs = useRef({});
    const videoPlayState = useRef({});

    useEffect(() => {
        for (let i = 0; i < totalCases; i++) {
            const video = videoRefs.current[i];
            if (!video) continue;

            // Останавливаем обратную анимацию если она была запущена
            if (reverseAnimationRefs.current[i]) {
                cancelAnimationFrame(reverseAnimationRefs.current[i]);
                reverseAnimationRefs.current[i] = null;
            }

            if (hoveredCase === i) {
                // При наведении - загружаем и проигрываем видео
                videoPlayState.current[i] = true;
                const playForward = () => {
                    // Если видео еще не загружено, загружаем его
                    if (video.readyState === 0) {
                        video.load();
                        video.addEventListener('loadeddata', () => {
                            video.currentTime = 0;
                            video.play().catch(() => {});
                            
                            // Останавливаем на последнем кадре
                            const handleTimeUpdate = () => {
                                if (video.currentTime >= video.duration - 0.05) {
                                    video.pause();
                                    video.currentTime = video.duration;
                                    video.removeEventListener('timeupdate', handleTimeUpdate);
                                }
                            };
                            video.addEventListener('timeupdate', handleTimeUpdate);
                        }, { once: true });
                    } else if (video.readyState >= 2) { // HAVE_CURRENT_DATA
                        video.currentTime = 0;
                        video.play().catch(() => {});
                        
                        // Останавливаем на последнем кадре
                        const handleTimeUpdate = () => {
                            if (video.currentTime >= video.duration - 0.05) {
                                video.pause();
                                video.currentTime = video.duration;
                                video.removeEventListener('timeupdate', handleTimeUpdate);
                            }
                        };
                        video.addEventListener('timeupdate', handleTimeUpdate);
                    } else {
                        // Ждем загрузки видео
                        video.addEventListener('loadeddata', playForward, { once: true });
                    }
                };
                playForward();
            } else {
                // Если мышь ушла или наведен другой кейс - возвращаем к началу
                const wasPlaying = videoPlayState.current[i] || false;
                videoPlayState.current[i] = false;
                
                const reversePlay = () => {
                    if (!video.duration || video.duration === 0 || video.readyState < 2) {
                        video.pause();
                        if (video.readyState >= 2) {
                            video.currentTime = 0;
                        }
                        reverseAnimationRefs.current[i] = null;
                        return;
                    }
                    
                    const currentTime = video.currentTime || 0;
                    if (currentTime > 0.05) {
                        // Плавная обратная перемотка (шаг 0.05 секунды)
                        video.currentTime = Math.max(0, currentTime - 0.05);
                        reverseAnimationRefs.current[i] = requestAnimationFrame(reversePlay);
                    } else {
                        // Дошли до начала, останавливаем
                        video.pause();
                        video.currentTime = 0;
                        reverseAnimationRefs.current[i] = null;
                    }
                };
                
                // Запускаем обратную перемотку только если видео проигрывалось
                if (wasPlaying) {
                    const checkAndReverse = () => {
                        if (video.readyState >= 2 && video.duration > 0) {
                            const currentTime = video.currentTime || 0;
                            if (currentTime > 0.05) {
                                reverseAnimationRefs.current[i] = requestAnimationFrame(reversePlay);
                            } else {
                                video.pause();
                                video.currentTime = 0;
                            }
                        } else {
                            if (video.readyState < 2) {
                                video.addEventListener('loadedmetadata', checkAndReverse, { once: true });
                            }
                        }
                    };
                    checkAndReverse();
                } else {
                    // Видео не проигрывалось, просто устанавливаем на начало и останавливаем
                    video.pause();
                    if (video.readyState >= 2) {
                        video.currentTime = 0;
                    } else if (video.readyState >= 1) {
                        // Если метаданные загружены, устанавливаем первый кадр
                        video.currentTime = 0;
                    }
                }
            }
        }
        
        // Cleanup при размонтировании
        return () => {
            for (let i = 0; i < totalCases; i++) {
                if (reverseAnimationRefs.current[i]) {
                    cancelAnimationFrame(reverseAnimationRefs.current[i]);
                    reverseAnimationRefs.current[i] = null;
                }
            }
        };
    }, [hoveredCase, totalCases]);

    return { videoRefs, reverseAnimationRefs, videoPlayState };
}

