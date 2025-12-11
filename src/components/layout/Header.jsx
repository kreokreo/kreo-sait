'use client'

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Услуги', href: '/uslugi' },
  { name: 'Кейсы', href: '/kejsy' },
  { name: 'О компании', href: '/o-kompanii' },
  { name: 'Блог', href: '/blog' },
  { name: 'Контакты', href: '/kontakty' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Отслеживаем скролл для показа меню после первого блока (Spline)
    const handleScroll = () => {
      // Показываем меню когда прокрутили больше половины высоты экрана
      const scrollY = window.scrollY || window.pageYOffset;
      setIsVisible(scrollY > window.innerHeight * 0.5);
    };

    // Проверяем сразу при загрузке
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
    <motion.header
          key="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <nav className="container mx-auto px-6 md:px-12 py-4 md:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-20 h-8 md:w-24 md:h-10">
              <Image 
                src="/logo.png"
                alt="KREO Logo"
                fill
                sizes="(max-width: 768px) 80px, 96px"
                className="object-contain"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(48%) sepia(100%) saturate(5000%) hue-rotate(190deg) brightness(1.1) contrast(1.2)'
                }}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                               (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive 
                      ? "text-black" 
                      : "text-gray-700 hover:text-black"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-black transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-gray-100"
          >
            <div className="flex flex-col gap-4 pt-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                                 (item.href !== '/' && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={false}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-base font-medium transition-colors",
                      isActive 
                        ? "text-black" 
                        : "text-gray-700 hover:text-black"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
      )}
    </AnimatePresence>
  );
}

