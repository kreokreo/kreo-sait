'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function LeadForm({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Здесь будет логика отправки формы
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
            setFormData({ name: '', email: '', phone: '', message: '' });
            onClose();
        }, 1000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />
                    
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div 
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 pointer-events-auto relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Кнопка закрытия */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>

                            {/* Заголовок */}
                            <div className="mb-6">
                                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                                    Обсудим ваш <span className="text-brand">проект</span>
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    Заполните форму, и мы свяжемся с вами в течение 24 часов
                                </p>
                            </div>

                            {/* Форма */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Имя */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Имя
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                                            placeholder="Ваше имя"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                {/* Телефон */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Телефон
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                                            placeholder="+7 (999) 123-45-67"
                                        />
                                    </div>
                                </div>

                                {/* Сообщение */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Сообщение
                                    </label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all resize-none"
                                            placeholder="Расскажите о вашем проекте..."
                                        />
                                    </div>
                                </div>

                                {/* Кнопка отправки */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gray-900 text-white py-3 px-6 rounded-full font-medium hover:bg-brand transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Отправка...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Отправить</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

