'use client'

import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Users, Award, Play, CheckCircle2, Zap, DollarSign, Sparkles, Rocket, Palette, CheckCircle, Clock } from 'lucide-react';
import Image from 'next/image';
import { CONTACTS } from '@/constants';
import { allCases } from '@/constants/cases';
import dynamic from 'next/dynamic';
import { Suspense, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import LeadForm from '@/components/LeadForm';

// Динамическая загрузка Spline Viewer с отключением SSR
const SplineViewer = dynamic(
  () => import('@/components/SplineViewer'),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function HomePage() {
    const splineBlockRef = useRef(null);
    const [hoveredService, setHoveredService] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
    
    const testimonials = [
        { name: 'Алексей Петров', task: 'Разработка корпоративного сайта' },
        { name: 'Мария Иванова', task: 'Настройка рекламы в Яндекс.Директ' },
        { name: 'Дмитрий Сидоров', task: 'Создание CRM-системы' },
        { name: 'Елена Козлова', task: 'Разработка интернет-магазина' },
        { name: 'Иван Смирнов', task: 'Автоматизация бизнес-процессов' },
        { name: 'Ольга Волкова', task: 'Брендинг и фирменный стиль' },
        { name: 'Сергей Новиков', task: 'Интеграция с внешними сервисами' },
        { name: 'Анна Морозова', task: 'Разработка мобильного приложения' },
        { name: 'Павел Лебедев', task: 'Настройка SEO-продвижения' },
        { name: 'Татьяна Соколова', task: 'Создание чат-бота для поддержки' }
    ];
    
    // Бесконечная карусель
    const handleNext = () => {
        setCarouselIndex((prev) => (prev + 1) % testimonials.length);
    };
    
    const handlePrev = () => {
        setCarouselIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Три направления услуг
    const serviceDirections = [
        {
            id: 'razrabotka',
            title: 'IT-разработка',
            subtitle: 'Создаем цифровые продукты',
            description: 'Сайты, приложения, автоматизация и AI-решения. Разрабатываем веб-приложения, чат-боты, системы автоматизации и интеграции. От MVP до масштабируемых продуктов.',
            detailedDescription: 'Полный цикл разработки: от анализа задач до запуска и поддержки. Используем современные технологии, следим за производительностью и безопасностью. Гибкие методологии и прозрачный процесс.',
            services: [
                { name: 'Сайты', desc: 'Лендинги, корпоративные сайты, интернет-магазины' },
                { name: 'Веб-приложения', desc: 'CRM, ERP, дашборды и внутренние системы' },
                { name: 'Чат-боты', desc: 'Telegram, WhatsApp, VK боты с AI' },
                { name: 'AI-автоматизация', desc: 'Автоматизация процессов с помощью AI' },
                { name: 'CRM', desc: 'Настройка и интеграция CRM-систем' },
                { name: 'Интеграции', desc: 'API, связки сервисов, автоматизация' }
            ],
            icon: Award,
            color: 'from-brand/10 to-blue-500/10',
            hoverColor: 'from-brand/20 to-blue-500/20',
            href: '/uslugi/razrabotka',
            stats: ['Запуск за 2-4 недели', 'Масштабируемая архитектура', 'Техподдержка 24/7']
        },
        {
            id: 'reklama',
            title: 'Реклама',
            subtitle: 'Привлекаем клиентов через все каналы',
            description: 'Настройка и ведение рекламных кампаний во всех каналах. Помогаем бизнесу находить клиентов через Яндекс.Директ, VK, Google Ads, Telegram Ads, SEO и другие каналы. Работаем с любыми бюджетами и нишами.',
            detailedDescription: 'Мы настраиваем рекламу так, чтобы каждый рубль работал на результат. Анализируем аудиторию, тестируем креативы, оптимизируем ставки и масштабируем успешные кампании. Регулярная отчетность и прозрачная аналитика.',
            services: [
                { name: 'Яндекс.Директ', desc: 'Контекстная реклама в поиске и РСЯ' },
                { name: 'VK Реклама', desc: 'Таргетинг в социальной сети' },
                { name: 'Google Ads', desc: 'Реклама в Google и YouTube' },
                { name: 'Telegram Ads', desc: 'Продвижение в Telegram' },
                { name: 'SEO', desc: 'Продвижение в органической выдаче' },
                { name: 'Авито реклама', desc: 'Настройка рекламы на сервисе Авито' }
            ],
            icon: TrendingUp,
            color: 'from-blue-500/10 to-purple-500/10',
            hoverColor: 'from-blue-500/20 to-purple-500/20',
            href: '/uslugi/reklama',
            stats: ['ROI до 500%', 'Снижение стоимости лида на 40%', 'Масштабирование в 3 раза']
        },
        {
            id: 'brending',
            title: 'Брендинг',
            subtitle: 'Создаем узнаваемый образ',
            description: 'Разработка фирменного стиля, логотипов, брендбуков и визуальной идентичности. Помогаем бизнесу выделяться на рынке и создавать эмоциональную связь с аудиторией.',
            detailedDescription: 'Мы создаем бренды, которые запоминаются. От исследования рынка и позиционирования до полного визуального образа. Разрабатываем стратегию бренда, дизайн-систему и руководство по использованию. Ваш бренд становится инструментом роста.',
            services: [
                { name: 'Логотип и фирменный стиль', desc: 'Разработка уникальной визуальной идентичности' },
                { name: 'Брендбук', desc: 'Руководство по использованию бренда' },
                { name: 'Позиционирование', desc: 'Стратегия и позиция на рынке' },
                { name: 'Нейминг', desc: 'Разработка названия и слоганов' },
                { name: 'Дизайн упаковки', desc: 'Оформление продукции и упаковки' },
                { name: 'Веб-дизайн', desc: 'Дизайн сайтов и интерфейсов' }
            ],
            icon: Palette,
            color: 'from-purple-500/10 to-pink-500/10',
            hoverColor: 'from-purple-500/20 to-pink-500/20',
            href: '/uslugi/brending',
            stats: ['Узнаваемость бренда +60%', 'Рост лояльности клиентов', 'Единый визуальный образ']
        }
    ];

    // Целевые аудитории
    const audiences = [
        {
            title: 'Бизнес и предприниматели',
            description: 'Малый и средний бизнес, нуждающийся в digital-решениях',
            icon: Users,
            features: ['Автоматизация процессов', 'Рост продаж', 'Экономия времени']
        },
        {
            title: 'Стартапы и IT-компании',
            description: 'Быстрый запуск MVP и масштабирование продуктов',
            icon: TrendingUp,
            features: ['Разработка с нуля', 'Техническая поддержка', 'Масштабирование']
        },
        {
            title: 'E-commerce и маркетплейсы',
            description: 'Оптимизация продаж и автоматизация процессов',
            icon: Award,
            features: ['Интеграции с площадками', 'Автоматизация заказов', 'Аналитика']
        }
    ];

    // Проекты (наши собственные продукты)
    const ourProjects = [
        {
            id: 'project-1',
            slug: 'project-1',
            client: 'Проект 1',
            title: 'Инновационное решение для бизнеса',
            description: 'Собственный продукт в разработке',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
            result: 'В разработке',
            service: 'Наш продукт',
            tags: ['AI', 'Автоматизация', 'SaaS'],
            isOurProject: true
        },
        {
            id: 'project-2',
            slug: 'project-2',
            client: 'Проект 2',
            title: 'Платформа для эффективной работы',
            description: 'Собственный продукт в разработке',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop&ixlib=rb-4.0.3',
            result: 'В разработке',
            service: 'Наш продукт',
            tags: ['Платформа', 'B2B', 'Интеграции'],
            isOurProject: true
        },
        {
            id: 'project-3',
            slug: 'project-3',
            client: 'Проект 3',
            title: 'Сервис нового поколения',
            description: 'Собственный продукт в разработке',
            image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
            result: 'В разработке',
            service: 'Наш продукт',
            tags: ['Сервис', 'Мобильное', 'Cloud'],
            isOurProject: true
        }
    ];

    // Превью кейсов (первые 6) + наши проекты (3) = 9 всего (3 строки)
    const cases = [...allCases.slice(0, 6), ...ourProjects];


    return (
        <div className="flex flex-col">
            {/* Hero Section с Spline */}
            <section 
                ref={splineBlockRef}
                className="relative w-full h-screen overflow-hidden"
            >
                {/* Контент слева */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute left-12 md:left-24 top-[25%] md:top-[20%] z-20 max-w-4xl pointer-events-none"
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-4 pointer-events-none">
                        <span className="text-brand">Digital-агентство KREO</span>
                    </h1>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-8 pointer-events-none">
                        Разработка и продвижение
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mb-10 leading-relaxed pointer-events-none">
                        От разработки сайтов и автоматизации до настройки рекламы — полный цикл digital-услуг с фокусом на результат
                    </p>
                    <button
                        onClick={() => setIsLeadFormOpen(true)}
                        className="group inline-flex items-center gap-3 bg-brand px-6 py-3 rounded-full text-base font-medium hover:bg-brand-dark transition-all pointer-events-auto"
                    >
                        <span className="text-white">Обсудить проект</span>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                    </button>
                </motion.div>

                {/* Надпись в правом нижнем углу за сплайном */}
                <div className="absolute bottom-8 right-12 md:bottom-16 md:right-24 z-[5] pointer-events-none">
                    <p className="text-xs md:text-sm font-medium text-gray-900 opacity-30">IT & AI Agency</p>
                </div>

                {/* Spline поверх контента */}
                <Suspense fallback={null}>
                    <div className="absolute inset-0 z-10">
                        <SplineViewer 
                            url="https://prod.spline.design/8QniDtyYBfn-Ekh1/scene.splinecode"
                        />
                    </div>
                </Suspense>

                {/* Заголовок Кейсы внизу Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="absolute bottom-6 left-12 md:bottom-12 md:left-24 z-40"
                >
                    <p className="font-mono text-sm text-gray-500 mb-2">Результаты</p>
                    <div className="flex items-end justify-between">
                        <h2 className="text-4xl md:text-6xl font-bold">Кейсы</h2>
                        <Link 
                            href="/kejsy"
                            className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand transition-colors ml-8"
                        >
                            Все кейсы
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Кейсы */}
            <section className="relative w-full bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3">
                        {cases.map((item, i) => (
                            <motion.div
                                key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            className="group relative overflow-hidden"
                        >
                            <Link href={`/kejsy/${item.slug}`} className="block w-full h-full">
                                {/* Изображение */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                    <motion.img 
                                        src={item.image} 
                                        alt={item.client}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                    />
                                    {/* Градиентный оверлей при наведении */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                                    />
                                    
                                    {/* Иконка стрелки */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileHover={{ opacity: 1, scale: 1 }}
                                        className="absolute top-4 right-4"
                                    >
                                        <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                                            <ArrowRight className="w-5 h-5 text-brand" />
                                        </div>
                                    </motion.div>

                                    </div>

                                {/* Контент */}
                                <div className={`p-6 bg-white ${item.isOurProject ? 'bg-gradient-to-b from-white to-brand/5' : ''}`}>
                                    {/* Теги */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {item.tags.slice(0, 3).map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mb-3">
                                        <h3 className="text-xl font-bold mb-1 group-hover:text-brand transition-colors">
                                            {item.client}
                                        </h3>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-500 font-mono">{item.service}</p>
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
                    ))}
                </div>
            </section>

            {/* Обзор услуг - 3 полноэкранных блока */}
            {serviceDirections.map((direction, i) => {
                const Icon = direction.icon;
                // IT-разработка и Брендинг: текст слева, Spline справа
                // Реклама: текст справа, Spline слева
                const isLeft = direction.id === 'razrabotka' || direction.id === 'brending';
                
                return (
                    <section 
                        key={direction.id}
                        className={`relative w-full md:min-h-screen overflow-hidden transition-colors duration-150 ${hoveredService === direction.id ? 'bg-brand/5' : 'bg-transparent'}`}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            onMouseEnter={() => setHoveredService(direction.id)}
                            onMouseLeave={() => setHoveredService(null)}
                            className={`relative z-10 w-full flex flex-col md:min-h-screen md:flex-row ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} min-h-[600px] md:min-h-screen`}
                        >
                                {/* Контентная часть */}
                                <div className={`relative z-20 w-full md:w-1/2 flex items-center py-6 md:py-0 ${isLeft ? 'justify-start px-6 md:pl-16 lg:pl-24' : 'justify-end px-6 md:pr-16 lg:pr-24'}`}>
                                <motion.div
                                    className="w-full"
                                >
                                    <div className="max-w-2xl">
                                        <motion.div
                                            initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 }}
                                            className="mb-6"
                                        >
                                            <p className="font-mono text-sm text-gray-500 mb-2">Направление</p>
                                            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
                                                {direction.title}
                                            </h2>
                                            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-6 md:mb-8">
                                                {direction.subtitle}
                                            </p>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 }}
                                            className="space-y-4 md:space-y-6"
                                        >
                                            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                                {direction.description}
                                            </p>
                                            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                                                {direction.detailedDescription}
                                            </p>
                                        </motion.div>
                                    </div>
                                </motion.div>
                                </div>

                                {/* Визуальная часть - список услуг, статистика и CTA */}
                                <div className={`relative z-10 w-full md:w-1/2 flex items-center py-6 md:py-0 ${isLeft ? 'px-6 md:pr-16 lg:pr-24' : 'px-6 md:pl-16 lg:pl-24'}`}>
                                    <div className="w-full space-y-6 md:space-y-8">
                                        {/* Список услуг */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.4 }}
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
                                        >
                                            {direction.services.map((service, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    viewport={{ once: true }}
                                                    whileHover={{ 
                                                        scale: 1.05, 
                                                        y: -5,
                                                        transition: { duration: 0.15, ease: "easeOut" }
                                                    }}
                                                    transition={{ delay: 0.5 + idx * 0.05, duration: 0.3 }}
                                                    className="p-3 md:p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-brand/30 transition-colors duration-150"
                                                >
                                                    <h4 className="font-semibold text-xs md:text-sm mb-1">{service.name}</h4>
                                                    <p className="text-xs text-gray-500 leading-tight">{service.desc}</p>
                                                </motion.div>
                                            ))}
                                        </motion.div>

                                        {/* Статистика */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.6 }}
                                            className="flex flex-wrap gap-2 md:gap-4"
                                        >
                                            {direction.stats.map((stat, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.7 + idx * 0.1 }}
                                                    className="px-3 md:px-4 py-1.5 md:py-2 bg-brand/10 rounded-full border border-brand/20"
                                                >
                                                    <span className="text-xs md:text-sm font-medium text-brand">{stat}</span>
                                                </motion.div>
                                            ))}
                                        </motion.div>

                                        {/* CTA */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.8 }}
                                        >
                                            <Link href={direction.href} className="group inline-flex items-center gap-2 md:gap-3 px-5 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium transition-all bg-gray-900 text-white hover:bg-brand">
                                                <span>Узнать больше</span>
                                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-white transition-transform group-hover:translate-x-1" />
                                                </div>
                                            </Link>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                    </section>
                );
            })}

            {/* УТП - Почему мы digital AI агентство */}
            <section className="relative px-6 md:px-16 lg:px-24 py-20 md:py-32">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <p className="font-mono text-sm text-gray-500 mb-4">Наше преимущество</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Почему с нами <span className="text-brand">выгодно</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mb-12 leading-relaxed">
                        Получайте качественные решения быстрее и дешевле благодаря современным технологиям и подходу
                    </p>

                    {/* Основные преимущества */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {/* Быстрее */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group p-8 rounded-2xl border border-gray-100 hover:border-brand/30 hover:shadow-lg transition-all"
                        >
                            <div className="p-3 rounded-xl bg-brand/10 group-hover:bg-brand/20 transition-colors w-fit mb-4">
                                <Zap className="w-6 h-6 text-brand" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 group-hover:text-brand transition-colors">
                                Быстрее
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Сокращаем сроки разработки в 2-3 раза за счет автоматизации и оптимизации процессов
                            </p>
                        </motion.div>

                        {/* Дешевле */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ y: -5 }}
                            className="group p-8 rounded-2xl border border-gray-100 hover:border-brand/30 hover:shadow-lg transition-all"
                        >
                            <div className="p-3 rounded-xl bg-brand/10 group-hover:bg-brand/20 transition-colors w-fit mb-4">
                                <DollarSign className="w-6 h-6 text-brand" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 group-hover:text-brand transition-colors">
                                Дешевле
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Экономьте до 30-50% бюджета благодаря эффективным решениям и оптимизации расходов
                            </p>
                        </motion.div>

                        {/* Качественнее */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ y: -5 }}
                            className="group p-8 rounded-2xl border border-gray-100 hover:border-brand/30 hover:shadow-lg transition-all"
                        >
                            <div className="p-3 rounded-xl bg-brand/10 group-hover:bg-brand/20 transition-colors w-fit mb-4">
                                <Sparkles className="w-6 h-6 text-brand" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 group-hover:text-brand transition-colors">
                                Качественнее
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Получайте надежные решения с гарантией качества и долгосрочной поддержкой
                            </p>
                        </motion.div>
                    </div>

                    {/* Детализация УТП */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="p-8 md:p-12 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm"
                    >
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <div className="flex-shrink-0">
                                <div className="p-4 rounded-xl bg-brand/10">
                                    <Rocket className="w-8 h-8 text-brand" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold mb-4">
                                    Максимальная выгода для вашего бизнеса
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Работая с нами, вы получаете оптимальное соотношение цены и качества. Мы используем современные технологии 
                                    и проверенные подходы, чтобы сократить ваши расходы и сроки, не жертвуя качеством. 
                                    Ваш бизнес получает конкурентное преимущество при меньших инвестициях.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Процесс работы */}
            <section className="relative px-6 md:px-16 lg:px-24 py-20 md:py-32">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="max-w-7xl mx-auto"
                >
                    {/* Заголовок блока */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-center mb-16 md:mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            Как мы <span className="text-brand">работаем</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Структурированный процесс с прозрачной отчётностью на каждом этапе
                        </p>
                    </motion.div>

                    {/* Вертикальный таймлайн с шагами - зигзаг */}
                    <div className="relative">
                        {/* SVG зигзагообразная линия - змейка с углами 90 градусов */}
                        <svg 
                            className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 w-full h-full pointer-events-none z-0"
                            style={{ height: '100%' }}
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                        >
                            <defs>
                                <linearGradient id="zigzagGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="hsl(210, 100%, 50%)" stopOpacity="0.25" />
                                    <stop offset="50%" stopColor="hsl(210, 100%, 50%)" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="hsl(210, 100%, 50%)" stopOpacity="0.25" />
                                </linearGradient>
                            </defs>
                            {/* Змейка с углами 90 градусов: упрощенный путь с минимальным количеством узлов - узкая */}
                            {/* Линия начинается выше (ближе к заголовку) и заканчивается у кнопки */}
                            <motion.path
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 2.5, ease: "easeInOut" }}
                                d="M 50 2 
                                   L 50 8
                                   L 35 8
                                   L 35 24
                                   L 50 24
                                   L 50 40
                                   L 65 40
                                   L 65 56
                                   L 50 56
                                   L 50 72
                                   L 35 72
                                   L 35 88
                                   L 50 88
                                   L 50 98
                                   L 50 100"
                                fill="none"
                                stroke="url(#zigzagGradient)"
                                strokeWidth="0.25"
                                strokeLinecap="round"
                                strokeLinejoin="miter"
                            />
                        </svg>
                        
                        {/* Шаги процесса - абсолютное позиционирование для следования за зигзагом */}
                        <div className="relative min-h-[1200px] md:min-h-[1400px]">
                            {[
                                {
                                    step: 1,
                                    title: 'Определяем цели и требования',
                                    description: 'Проводим встречу с командой проекта, изучаем текущую ситуацию, выявляем бизнес-задачи и устанавливаем измеримые показатели эффективности.',
                                    result: 'Техническое задание или бриф проекта',
                                    duration: '1-2 дня'
                                },
                                {
                                    step: 2,
                                    title: 'Изучаем рынок и аудиторию',
                                    description: 'Анализируем конкурентную среду, исследуем целевую аудиторию, проводим аудит существующих решений, выявляем возможности для роста.',
                                    result: 'Аналитический отчёт с рекомендациями',
                                    duration: '2-5 дней'
                                },
                                {
                                    step: 3,
                                    title: 'Разрабатываем план реализации',
                                    description: 'Формируем стратегию достижения целей, выбираем оптимальные инструменты, составляем детальный план работ с указанием сроков и бюджета.',
                                    result: 'Коммерческое предложение и дорожная карта проекта',
                                    duration: '3-5 дней'
                                },
                                {
                                    step: 4,
                                    title: 'Выполняем работы',
                                    description: 'Реализуем согласованное решение, предоставляем еженедельную отчётность, обеспечиваем доступ к системе управления проектами для контроля статуса задач.',
                                    result: 'Готовое к запуску решение',
                                    duration: 'От 2 недель (зависит от проекта)'
                                },
                                {
                                    step: 5,
                                    title: 'Внедряем и оптимизируем',
                                    description: 'Запускаем проект, мониторим показатели эффективности, проводим анализ результатов, вносим улучшения и масштабируем успешные решения.',
                                    result: 'Работающий проект с постоянной оптимизацией',
                                    duration: 'Регулярное сопровождение'
                                }
                            ].map((item, idx) => {
                                const isEven = idx % 2 === 0;
                                // Позиции точек на зигзаге: 35% (слева), 65% (справа) - узкая змейка
                                // Высота каждого шага для позиционирования вдоль зигзага
                                const stepTop = `${8 + idx * 16}%`;
                                // Блоки слева (isEven) и справа (!isEven) с увеличенными отступами для зигзага
                                // Первый блок (idx 0) - дальше влево
                                // Второй блок (idx 1) - дальше вправо
                                // Третий блок (idx 2) - дальше влево
                                // И так далее
                                const leftOffset = idx === 0 && isEven ? 'calc(50% - 40%)' : 
                                                  idx === 2 && isEven ? 'calc(50% - 35%)' : 
                                                  idx === 4 && isEven ? 'calc(50% - 35%)' : 
                                                  isEven ? 'calc(50% - 15%)' : null;
                                const rightOffset = idx === 1 && !isEven ? 'calc(50% - 35%)' : 
                                                    idx === 3 && !isEven ? 'calc(50% - 35%)' : 
                                                    !isEven ? 'calc(50% - 15%)' : null;
                                
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ delay: idx * 0.15, duration: 0.5 }}
                                        className="relative md:absolute w-full md:w-[32%]"
                                        style={{ 
                                            top: stepTop,
                                            ...(isEven ? { left: leftOffset } : { right: rightOffset }),
                                            transform: 'translateY(-50%)'
                                        }}
                                    >
                                        {/* Контент шага - компактный, следующий за линией */}
                                        <motion.div
                                            whileHover={{ x: isEven ? 5 : -5 }}
                                            transition={{ duration: 0.2 }}
                                            className="p-5 md:p-6 rounded-2xl border border-gray-100 hover:border-brand/30 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all"
                                        >
                                                <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-600 mb-4 leading-relaxed">
                                                    {item.description}
                                                </p>
                                                
                                                {/* Результат и срок */}
                                                <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 text-brand flex-shrink-0" />
                                                        <span className="text-sm text-gray-600">{item.result}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-brand/70 flex-shrink-0" />
                                                        <span className="text-sm text-gray-600">{item.duration}</span>
                                                    </div>
                                                </div>
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Вертикальная линия от конца зигзага до кнопки - продолжение зигзага */}
                    <div className="hidden md:block relative">
                        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '-60px', height: '60px', width: '0.25px' }}>
                            <svg className="w-full h-full" viewBox="0 0 1 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="zigzagGradientVertical" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="hsl(210, 100%, 50%)" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="hsl(210, 100%, 50%)" stopOpacity="0.25" />
                                    </linearGradient>
                                </defs>
                                <line x1="0.5" y1="0" x2="0.5" y2="100" stroke="url(#zigzagGradientVertical)" strokeWidth="0.25" />
                            </svg>
                        </div>
                    </div>

                    {/* Кнопка CTA - выровнена с линией */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.9 }}
                        className="mt-12 text-center"
                    >
                        <button
                            onClick={() => setIsLeadFormOpen(true)}
                            className="group inline-flex items-center gap-3 bg-gray-900 px-6 py-3 rounded-full text-base font-medium hover:bg-brand transition-all"
                        >
                            <span className="text-white">Обсудить проект</span>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
                            </div>
                        </button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Видео-отзывы */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="w-full"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-center mb-12 md:mb-16 px-6 md:px-16 lg:px-24"
                    >
                        <p className="font-mono text-sm text-gray-500 mb-4">Отзывы</p>
                        <h2 className="text-3xl md:text-5xl font-bold">Что говорят <span className="text-brand">клиенты</span></h2>
                    </motion.div>
                    
                    {/* Карусель видео-отзывов - бесконечная */}
                    <div className="relative w-full">
                        {/* Контейнер карусели */}
                        <div className="overflow-hidden w-full">
                            <motion.div
                                className="flex"
                                animate={{ x: `-${carouselIndex * (100 / 5)}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                {/* Дублируем элементы для бесконечной прокрутки */}
                                {[...testimonials, ...testimonials, ...testimonials].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/5 group cursor-pointer"
                                    >
                                        {/* Видео-кружок */}
                                        <div className="relative aspect-square rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 mb-3 md:mb-4 border-2 border-gray-200 group-hover:border-brand/50 transition-all mx-auto" style={{ maxWidth: '200px' }}>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Play className="w-8 h-8 md:w-12 md:h-12 text-gray-400 group-hover:text-brand transition-colors" />
                                            </div>
                                            {/* Декоративный градиент при наведении */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-brand/0 to-brand/0 group-hover:from-brand/10 group-hover:to-brand/5 transition-all" />
                                        </div>
                                        
                                        {/* Описание */}
                                        <div className="text-center">
                                            <p className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                                                {item.name}
                                            </p>
                                            <p className="text-xs md:text-sm text-gray-500 leading-tight">
                                                {item.task}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Кнопки навигации */}
                        <div className="flex items-center justify-center gap-4 mt-8 px-6 md:px-16 lg:px-24">
                            <button
                                onClick={handlePrev}
                                className="p-2 rounded-full border border-gray-300 hover:border-brand hover:bg-brand/5 transition-all"
                            >
                                <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
                            </button>
                            
                            {/* Индикаторы */}
                            <div className="flex gap-2">
                                {testimonials.map((_, dot) => (
                                    <button
                                        key={dot}
                                        onClick={() => setCarouselIndex(dot)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            carouselIndex % testimonials.length === dot ? 'bg-brand w-6' : 'bg-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                className="p-2 rounded-full border border-gray-300 hover:border-brand hover:bg-brand/5 transition-all"
                            >
                                <ArrowRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Фото команды - интерактивное групповое фото */}
            <section className="relative px-6 md:px-16 lg:px-24 py-20 md:py-32">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="max-w-7xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-center mb-12 md:mb-16"
                    >
                        <p className="font-mono text-sm text-gray-500 mb-4">Команда</p>
                        <h2 className="text-3xl md:text-5xl font-bold">Кто делает <span className="text-brand">проекты</span></h2>
                    </motion.div>
                    
                    {/* Интерактивное групповое фото */}
                    <div className="relative w-full aspect-video md:aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
                        {/* Групповое фото (плейсхолдер) */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                            <span className="text-gray-400 text-lg">Групповое фото команды</span>
                        </div>
                        
                        {/* Интерактивные области для каждого человека */}
                        {[
                            { name: 'Александр', role: 'Основатель, стратегия', position: { top: '20%', left: '15%', width: '12%', height: '25%' } },
                            { name: 'Михаил', role: 'Разработка', position: { top: '25%', left: '35%', width: '12%', height: '25%' } },
                            { name: 'Елена', role: 'Дизайн', position: { top: '20%', left: '55%', width: '12%', height: '25%' } },
                            { name: 'Дмитрий', role: 'Маркетинг', position: { top: '25%', left: '75%', width: '12%', height: '25%' } },
                            { name: 'Анна', role: 'Проект-менеджер', position: { top: '55%', left: '25%', width: '12%', height: '25%' } },
                            { name: 'Сергей', role: 'Backend разработка', position: { top: '55%', left: '65%', width: '12%', height: '25%' } }
                        ].map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="absolute group cursor-pointer"
                                style={{
                                    top: member.position.top,
                                    left: member.position.left,
                                    width: member.position.width,
                                    height: member.position.height
                                }}
                            >
                                {/* Область наведения */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand/50 rounded-lg transition-all bg-brand/0 group-hover:bg-brand/10" />
                                
                                {/* Информация при наведении */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                                        <p className="font-semibold">{member.name}</p>
                                        <p className="text-xs text-gray-300">{member.role}</p>
                                    </div>
                                    {/* Стрелка */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Манифест компании */}
            <section className="relative px-6 md:px-16 lg:px-24 py-12 md:py-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="max-w-2xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        {/* Декоративная кавычка */}
                        <div className="absolute -top-4 -left-2 md:-top-6 md:-left-4 text-4xl md:text-5xl font-serif text-brand/10 leading-none">
                            &ldquo;
                        </div>
                        
                        <blockquote className="text-lg md:text-xl lg:text-2xl font-medium text-gray-900 leading-relaxed italic relative z-10">
                            Мы верим, что качественная разработка должна быть доступной каждому бизнесу. 
                            Не просто делаем сайты и приложения — мы создаём решения, которые реально меняют 
                            процессы и помогают расти. ИИ для нас не хайп, а инструмент: он помогает 
                            ускорить разработку в разы, сделать её дешевле и открыть возможности, которые 
                            раньше были недоступны. Мы не просто пишем код — мы думаем о том, как ваша 
                            команда будет работать быстрее, а клиенты — получать больше ценности.
                        </blockquote>
                        
                        {/* Подпись */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="mt-6 md:mt-8 flex items-center gap-4"
                        >
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <p className="text-xs md:text-sm text-gray-600 font-medium">
                                Команда KREO
                            </p>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Финальный CTA */}
            <section className="relative px-6 md:px-16 lg:px-24 py-32 md:py-40" style={{ overflow: 'visible' }}>
                    {/* Декоративный фон - выходит за границы контейнера */}
                    <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-brand/3 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-brand/3 rounded-full blur-2xl"></div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="max-w-5xl mx-auto text-center relative z-10"
                    >
                        {/* Заголовок с анимацией */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="mb-6"
                        >
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
                                Готовы <span className="text-brand">начать?</span>
                            </h2>
                        </motion.div>

                        {/* Описание */}
                        <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                        Расскажите о задаче — предложим решение за 24 часа
                        </motion.p>

                        {/* Основные кнопки */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
                        >
                            {/* Кнопка "Обсудить проект" */}
                            <motion.button
                                onClick={() => setIsLeadFormOpen(true)}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative inline-flex items-center justify-center gap-3 bg-brand px-10 py-5 rounded-full text-lg font-semibold text-white overflow-hidden"
                            >
                                {/* Градиентный эффект при наведении */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-brand-light to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                />
                                <span className="relative z-10">Обсудить проект</span>
                                <motion.div
                                    className="relative z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                                    whileHover={{ rotate: 45 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ArrowRight className="w-5 h-5 text-white" />
                                </motion.div>
                            </motion.button>

                            {/* Кнопка Telegram */}
                            <motion.a
                            href={CONTACTS.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="group inline-flex items-center justify-center gap-3 bg-gray-900 px-10 py-5 rounded-full text-lg font-semibold text-white hover:bg-gray-800 transition-all"
                            >
                                <span>Telegram</span>
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                    <ArrowRight className="w-5 h-5 text-white" />
                                </div>
                            </motion.a>
                        </motion.div>

                        {/* Дополнительная ссылка */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="mt-8"
                        >
                            <motion.button
                                onClick={() => setIsLeadFormOpen(true)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="text-base text-gray-500 hover:text-brand transition-colors inline-flex items-center gap-2"
                            >
                                <span>Или заполните форму для быстрого ответа</span>
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </motion.div>
                </motion.div>
            </section>

            {/* Лид-форма */}
            <LeadForm isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} />
        </div>
    );
}
