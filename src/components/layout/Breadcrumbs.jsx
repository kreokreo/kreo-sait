'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const routeNames = {
  '/': 'Главная',
  '/uslugi': 'Услуги',
  '/uslugi/reklama': 'Реклама',
  '/uslugi/razrabotka': 'IT-разработка',
  '/uslugi/sites': 'Сайты',
  '/uslugi/sites/landing': 'Лендинги',
  '/uslugi/sites/corporate': 'Корпоративные сайты',
  '/uslugi/sites/ecommerce': 'Интернет-магазины',
  '/uslugi/sites/pwa': 'PWA приложения',
  '/kejsy': 'Кейсы',
  '/o-kompanii': 'О компании',
  '/blog': 'Блог',
  '/kontakty': 'Контакты',
  '/geografiya': 'География работы',
  '/otzyvy': 'Отзывы',
  '/faq': 'Частые вопросы',
  '/partnerstvo': 'Партнёрство',
};

// Маппинг для динамических путей услуг
const serviceNames = {
  'sites': 'Сайты',
  'web-apps': 'Веб-приложения',
  'chatbots': 'Чат-боты',
  'ai-automation': 'AI-автоматизация',
  'crm': 'CRM',
  'integrations': 'Интеграции',
  'telegram-ads': 'Telegram Ads',
  'yandex-direct': 'Яндекс.Директ',
  'seo': 'SEO',
  'avito': 'Авито реклама',
  'vk-ads': 'VK Реклама',
  'google-ads': 'Google Ads',
};

// Маппинг для типов сайтов
const siteTypeNames = {
  'landing': 'Лендинги',
  'corporate': 'Корпоративные сайты',
  'ecommerce': 'Интернет-магазины',
  'pwa': 'PWA приложения',
};

// Маппинг для направлений бизнеса
const businessDirectionNames = {
  // Лендинги
  'dentistry': 'Для стоматологии',
  'restaurant': 'Для ресторанов',
  'ecommerce': 'Для интернет-магазинов',
  'medical': 'Для медицинских клиник',
  'education': 'Для образовательных учреждений',
  'real-estate': 'Для недвижимости',
  'construction': 'Для строительства',
  'b2b': 'Для B2B услуг',
  'entertainment': 'Для развлечений',
  'automotive': 'Для автомобильного бизнеса',
  // Корпоративные сайты
  'medicine': 'Для медицины',
  'trade': 'Для торговли',
  // Интернет-магазины
  'clothing': 'Для одежды',
  'construction-materials': 'Для стройматериалов',
  'electronics': 'Для электроники',
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathnames = pathname.split('/').filter((x) => x);

  // Не показываем на главной странице
  if (pathname === '/') {
    return null;
  }

  const breadcrumbs = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    
    // Определяем название для пути
    let name = routeNames[to];
    
    // Если не найдено в routeNames, проверяем специальные случаи
    if (!name) {
      // Для путей типа /uslugi/sites/landing/dentistry (направления бизнеса)
      if (pathnames[0] === 'uslugi' && pathnames[1] === 'sites' && pathnames[2] && pathnames[3]) {
        name = businessDirectionNames[pathnames[3]] || value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
      }
      // Для путей типа /uslugi/sites/landing (типы сайтов)
      else if (pathnames[0] === 'uslugi' && pathnames[1] === 'sites' && pathnames[2]) {
        name = siteTypeNames[pathnames[2]] || value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
      }
      // Для путей типа /uslugi/sites
      else if (pathnames[0] === 'uslugi' && pathnames[1]) {
        name = serviceNames[pathnames[1]] || value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
      }
      // Для других случаев - используем значение из пути с заглавной буквы
      else {
        name = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
      }
    }

    return {
      to,
      name,
      isLast: index === pathnames.length - 1,
    };
  });

  return (
    <nav className="container mx-auto px-6 md:px-12 py-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            href="/"
            className="text-gray-500 hover:text-black transition-colors flex items-center"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.to} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {crumb.isLast ? (
              <span className="text-black font-medium">{crumb.name}</span>
            ) : (
              <Link
                href={crumb.to}
                className="text-gray-500 hover:text-black transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

