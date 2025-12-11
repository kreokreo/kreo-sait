'use client'

import { services } from '@/constants';
import { getHomePageCases } from '@/lib/cases';
import { useRef, useState } from 'react';
import LeadForm from '@/components/LeadForm';
import { CaseGrid } from '@/components/cases';
import ServicesGrid from '@/components/ServicesGrid';
import HeroSection from '@/components/sections/HeroSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import ProcessSection from '@/components/sections/ProcessSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import TeamSection from '@/components/sections/TeamSection';
import ManifestSection from '@/components/sections/ManifestSection';
import FinalCTA from '@/components/sections/FinalCTA';

export default function HomePage() {
    const splineBlockRef = useRef(null);
    const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

    // Получаем кейсы для главной страницы (первые 6 + наши проекты)
    const cases = getHomePageCases(6, true);

    return (
        <div className="flex flex-col relative z-10">
            {/* Hero Section с Spline - Spline фиксирован здесь, но фон распространяется дальше */}
            <HeroSection 
                onOpenLeadForm={() => setIsLeadFormOpen(true)}
                splineBlockRef={splineBlockRef}
                    />

            {/* УТП - Почему мы digital AI агентство */}
            <WhyUsSection />

            {/* Кейсы - фон Spline продолжается здесь */}
            <section id="cases" className="relative z-10 w-full bg-transparent overflow-hidden">
                {/* Размытые декоративные круги для эффекта стекла */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-[800px] h-[800px] bg-blue-400/20 rounded-full blur-xl"></div>
                    <div className="absolute top-40 right-20 w-[700px] h-[700px] bg-purple-400/20 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 left-1/4 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-xl"></div>
                    <div className="absolute bottom-40 right-1/3 w-[650px] h-[650px] bg-indigo-400/20 rounded-full blur-xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-blue-300/15 rounded-full blur-xl"></div>
                </div>
                <div className="relative pt-0 px-12 md:px-16 lg:px-24">
                    <CaseGrid cases={cases} showVideo={true} />
                </div>
            </section>

            {/* Блок услуг - блочная структура */}
            <ServicesGrid 
                services={services}
                title="НАШИ УСЛУГИ"
            />

            {/* Процесс работы */}
            <ProcessSection onOpenLeadForm={() => setIsLeadFormOpen(true)} />

            {/* Видео-отзывы */}
            <TestimonialsSection />

            {/* Фото команды и Манифест - на одном уровне */}
            <section className="relative px-6 md:px-16 lg:px-24 py-20 md:py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto">
                    {/* Фото команды */}
                    <TeamSection />
                    
                    {/* Манифест компании */}
                    <ManifestSection />
                </div>
            </section>

            {/* Финальный CTA */}
            <FinalCTA onOpenLeadForm={() => setIsLeadFormOpen(true)} />

            {/* Лид-форма */}
            <LeadForm isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} />
        </div>
    );
}
