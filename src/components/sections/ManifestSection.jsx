'use client'

import { motion } from 'framer-motion';

/**
 * Секция "Манифест компании"
 */
export default function ManifestSection() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full flex flex-col justify-center"
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
                        <p className="text-xs md:text-sm text-gray-700 font-medium">
                            Команда KREO
                        </p>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    </motion.div>
                </motion.div>
        </motion.div>
    );
}

