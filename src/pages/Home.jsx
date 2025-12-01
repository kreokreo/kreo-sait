import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { CONTACTS } from '@/constants';

export default function HomePage() {
    const services = [
        { id: '01', name: 'AI-ассистенты', desc: 'Чат-боты и голосовые помощники' },
        { id: '02', name: 'Веб-приложения', desc: 'CRM, ERP и автоматизация' },
        { id: '03', name: 'Сайты', desc: 'Лендинги и корпоративные сайты' },
        { id: '04', name: 'Интеграции', desc: 'API, боты, связки сервисов' },
        { id: '05', name: 'Персональная разработка', desc: 'Индивидуальные IT-решения' },
        { id: '06', name: 'Настройка рекламы', desc: 'Яндекс.Директ, VK, таргет' },
    ];

    const cases = [
        { 
            client: 'Ресторанный холдинг', 
            city: 'Курган',
            result: '+40% брони через бота',
            tags: ['CRM', 'Telegram-бот', 'Реклама'],
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80'
        },
        { 
            client: 'Сеть автосервисов', 
            city: 'Тюмень',
            result: '−30% на обработку заявок',
            tags: ['AI-ассистент', 'Интеграции'],
            image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80'
        },
        { 
            client: 'Производство', 
            city: 'Екатеринбург',
            result: 'ERP с нуля за 3 месяца',
            tags: ['Веб-сервис', 'Автоматизация'],
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80'
        },
    ];

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="px-6 md:px-12 py-12 md:py-24">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl"
                >
                    <p className="font-mono text-sm text-red-600 mb-4">IT & AI Agency</p>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
                        Делаем IT-продукты,<br/>
                        <span className="text-gray-400">которые приносят результат</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-xl mb-8">
                        Автоматизация, AI, сайты и сервисы для бизнеса.
                    </p>
                    <a 
                        href={`mailto:${CONTACTS.email}`}
                        className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        Обсудить проект
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </motion.div>
            </section>

            {/* Services */}
            <section className="px-6 md:px-12 py-12 md:py-20 border-t border-gray-100">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <p className="font-mono text-xs text-gray-400 mb-8">Услуги</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, i) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group"
                            >
                                <p className="font-mono text-xs text-gray-300 mb-2">{service.id}</p>
                                <h3 className="text-lg font-semibold mb-1 group-hover:text-red-600 transition-colors">
                                    {service.name}
                                </h3>
                                <p className="text-sm text-gray-500">{service.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Cases */}
            <section className="px-6 md:px-12 py-12 md:py-20 bg-gray-50">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <p className="font-mono text-xs text-gray-400 mb-8">Кейсы</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {cases.map((item, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors group cursor-pointer overflow-hidden"
                                                    >
                                                        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                                                            <img 
                                                                src={item.image} 
                                                                alt={item.client}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <div className="p-5">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div>
                                                                    <h3 className="font-semibold text-lg">{item.client}</h3>
                                                                    <p className="text-sm text-gray-400">{item.city}</p>
                                                                </div>
                                                                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors flex-shrink-0" />
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                {item.tags.map(tag => (
                                                                    <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <p className="font-mono text-sm font-medium text-green-600">{item.result}</p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                </motion.div>
            </section>

            {/* Team */}
            <section className="px-6 md:px-12 py-12 md:py-20 border-t border-gray-100">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <p className="font-mono text-xs text-gray-400 mb-8">Команда</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="w-16 h-16 bg-gray-100 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-gray-300">A</div>
                            <h3 className="font-semibold text-lg">Александр</h3>
                            <p className="text-sm text-gray-500 mb-2">Основатель, стратегия</p>
                            <p className="text-xs text-gray-400">10+ лет в digital</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-gray-100 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-gray-300">М</div>
                            <h3 className="font-semibold text-lg">Михаил</h3>
                            <p className="text-sm text-gray-500 mb-2">Разработка</p>
                            <p className="text-xs text-gray-400">Full-stack, AI</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-gray-100 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-gray-300">Е</div>
                            <h3 className="font-semibold text-lg">Елена</h3>
                            <p className="text-sm text-gray-500 mb-2">Дизайн</p>
                            <p className="text-xs text-gray-400">UI/UX, брендинг</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* CTA */}
            <section className="px-6 md:px-12 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto"
                >
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">Готовы начать?</h2>
                    <p className="text-gray-500 mb-8">
                        Расскажите о задаче — предложим решение за 24 часа
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href={`mailto:${CONTACTS.email}`}
                            className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                            {CONTACTS.email}
                        </a>
                        <a 
                            href={CONTACTS.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 border border-gray-200 px-6 py-3 rounded-full text-sm font-medium hover:border-gray-400 transition-colors"
                        >
                            Telegram
                        </a>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}