'use client'

import { services } from '@/constants';
import { getHomePageCases } from '@/lib/cases';
import { useRef, useState, lazy, Suspense, useMemo, useEffect } from 'react';
import LeadForm from '@/components/LeadForm';

// Lazy load всех компонентов для оптимизации первоначальной загрузки
const HeroSection = lazy(() => import('@/components/sections/HeroSection'));
const WhyUsSection = lazy(() => import('@/components/sections/WhyUsSection'));
const CaseGrid = lazy(() => import('@/components/cases').then(mod => ({ default: mod.CaseGrid })));
const ServicesGrid = lazy(() => import('@/components/ServicesGrid'));
const ProcessSection = lazy(() => import('@/components/sections/ProcessSection'));
const TestimonialsSection = lazy(() => import('@/components/sections/TestimonialsSection'));
const TeamSection = lazy(() => import('@/components/sections/TeamSection'));
const ManifestSection = lazy(() => import('@/components/sections/ManifestSection'));
const FinalCTA = lazy(() => import('@/components/sections/FinalCTA'));

export default function HomePage() {
    const splineBlockRef = useRef(null);
    const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
    const [shouldLoadContent, setShouldLoadContent] = useState(false);

    // Мемоизируем кейсы, чтобы не пересчитывать при каждом рендере
    const cases = useMemo(() => getHomePageCases(6, true), []);
    
    // Мемоизируем отфильтрованные услуги
    const filteredServices = useMemo(() => 
        services.filter(s => !['integrations', 'google-ads', 'avito'].includes(s.id)), 
        []
    );

    // Откладываем загрузку контента до завершения первоначального рендеринга
    useEffect(() => {
        // Простая задержка для загрузки контента после первоначального рендера
        if (typeof window !== 'undefined') {
            // Используем несколько кадров для плавности
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // Загружаем контент после того, как браузер отрисует прелоадер
                    setTimeout(() => {
                        setShouldLoadContent(true);
                    }, 100);
                });
            });
        }
    }, []);

    return (
        <div className="flex flex-col relative z-10">
            {/* Hero Section с Spline - загружается первым */}
            <Suspense fallback={<div className="w-full h-screen" />}>
                <HeroSection 
                    onOpenLeadForm={() => setIsLeadFormOpen(true)}
                    splineBlockRef={splineBlockRef}
                />
            </Suspense>

            {shouldLoadContent && (
                <>
                    {/* УТП - Почему мы digital AI агентство */}
                    <Suspense fallback={<div className="min-h-[400px]" />}>
                        <WhyUsSection />
                    </Suspense>

                    {/* Кейсы - фон Spline продолжается здесь */}
                    <section id="cases" className="relative z-10 w-full pb-20 md:pb-32 bg-transparent" style={{ overflow: 'visible' }}>
                        {/* Размытые декоративные круги для эффекта стекла - загружаются с задержкой */}
                        <div className="absolute inset-0 pointer-events-none" style={{ willChange: 'transform', overflow: 'visible', left: '-200px', right: '-200px', top: '-100px', bottom: '-100px' }}>
                            <div className="absolute top-20 left-[calc(10px+200px)] w-[800px] h-[800px] bg-blue-400/20 rounded-full blur-xl" style={{ willChange: 'transform' }}></div>
                            <div className="absolute top-40 right-[calc(20px+200px)] w-[700px] h-[700px] bg-purple-400/20 rounded-full blur-xl" style={{ willChange: 'transform' }}></div>
                            <div className="absolute bottom-20 left-[calc(25%+200px)] w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-xl" style={{ willChange: 'transform' }}></div>
                            <div className="absolute bottom-40 right-[calc(33.33%+200px)] w-[650px] h-[650px] bg-indigo-400/20 rounded-full blur-xl" style={{ willChange: 'transform' }}></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-blue-300/15 rounded-full blur-xl" style={{ willChange: 'transform' }}></div>
                        </div>
                        <div className="relative pt-0 px-12 md:px-16 lg:px-24">
                            <Suspense fallback={<div className="min-h-[600px]" />}>
                                <CaseGrid cases={cases} showVideo={true} />
                            </Suspense>
                        </div>
                    </section>

                    {/* Блок услуг - блочная структура */}
                    <Suspense fallback={<div className="min-h-[600px]" />}>
                        <ServicesGrid 
                            services={filteredServices}
                            title="НАШИ УСЛУГИ"
                            showAllServicesButton={true}
                        />
                    </Suspense>

                    {/* Процесс работы и отзывы - объединенный блок */}
                    <Suspense fallback={<div className="min-h-[400px]" />}>
                        <ProcessSection onOpenLeadForm={() => setIsLeadFormOpen(true)} />
                    </Suspense>
                    <Suspense fallback={<div className="min-h-[400px]" />}>
                        <TestimonialsSection />
                    </Suspense>

            {/* Фото команды и Манифест - на одном уровне */}
            <section className="relative px-6 md:px-16 lg:px-24 py-20 md:py-32" style={{ overflow: 'visible' }}>
                {/* Размытые декоративные круги */}
                <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', left: '-200px', right: '-200px' }}>
                    <div className="absolute top-10 right-[calc(25%+200px)] w-[400px] h-[400px] bg-indigo-400/15 rounded-full blur-xl"></div>
                    <div className="absolute bottom-10 left-[calc(33.33%+200px)] w-[350px] h-[350px] bg-pink-400/15 rounded-full blur-xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-xl"></div>
                </div>
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto z-10">
                    {/* Фото команды */}
                    <Suspense fallback={<div className="min-h-[400px]" />}>
                        <TeamSection />
                    </Suspense>
                    
                    {/* Манифест компании */}
                    <Suspense fallback={<div className="min-h-[400px]" />}>
                        <ManifestSection />
                    </Suspense>
                </div>
            </section>

            {/* Финальный CTA */}
            <Suspense fallback={null}>
                <FinalCTA onOpenLeadForm={() => setIsLeadFormOpen(true)} />
            </Suspense>

                </>
            )}

            {/* Лид-форма */}
            <LeadForm isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} />
        </div>
    );
}
