'use client'

import { motion } from 'framer-motion';

/**
 * Секция "Фото команды"
 */
export default function TeamSection() {
    const teamMembers = [
        { name: 'Александр', role: 'Основатель, стратегия', position: { top: '20%', left: '15%', width: '12%', height: '25%' } },
        { name: 'Михаил', role: 'Разработка', position: { top: '25%', left: '35%', width: '12%', height: '25%' } },
        { name: 'Елена', role: 'Дизайн', position: { top: '20%', left: '55%', width: '12%', height: '25%' } },
        { name: 'Дмитрий', role: 'Маркетинг', position: { top: '25%', left: '75%', width: '12%', height: '25%' } },
        { name: 'Анна', role: 'Проект-менеджер', position: { top: '55%', left: '25%', width: '12%', height: '25%' } },
        { name: 'Сергей', role: 'Backend разработка', position: { top: '55%', left: '65%', width: '12%', height: '25%' } }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full"
        >
            {/* Интерактивное групповое фото */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100">
                    {/* Групповое фото (плейсхолдер) */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <span className="text-gray-400 text-lg">Групповое фото команды</span>
                    </div>
                    
                    {/* Интерактивные области для каждого человека */}
                    {teamMembers.map((member, i) => (
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
    );
}

