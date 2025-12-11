'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CONTACTS } from '@/constants';
import { Mail, Send } from 'lucide-react';

const footerLinks = {
  services: [
    { name: 'Реклама', href: '/uslugi/reklama' },
    { name: 'IT-разработка', href: '/uslugi/razrabotka' },
  ],
  company: [
    { name: 'О компании', href: '/o-kompanii' },
    { name: 'Кейсы', href: '/kejsy' },
    { name: 'Блог', href: '/blog' },
    { name: 'География', href: '/geografiya' },
  ],
  legal: [
    { name: 'Политика конфиденциальности', href: '/politika-konfidencialnosti' },
    { name: 'Пользовательское соглашение', href: '/polzovatelskoe-soglashenie' },
  ],
};

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[#E8E8E8] border-t border-gray-200"
    >
      <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-black">Kreo</span>
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              Делаем IT-продукты, которые приносят результат
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${CONTACTS.email}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
              >
                <Mail className="w-4 h-4" />
                {CONTACTS.email}
              </a>
              <a
                href={CONTACTS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
              >
                <Send className="w-4 h-4" />
                Telegram
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-4">Услуги</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-4">Компания</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-4">Правовая информация</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Партнёры */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            {['Яндекс', 'Google', 'VK', 'Telegram', 'Bitrix24', 'amoCRM'].map((partner, i) => (
              <div
                key={i}
                className="flex items-center justify-center"
              >
                <span className="text-xs text-gray-400">{partner}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Kreo. Все права защищены.
            </p>
            <p className="text-xs text-gray-500">
              IT & AI Agency
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

