'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const routeNames = {
  '/': 'Главная',
  '/uslugi': 'Услуги',
  '/uslugi/reklama': 'Реклама',
  '/uslugi/razrabotka': 'IT-разработка',
  '/kejsy': 'Кейсы',
  '/o-kompanii': 'О компании',
  '/blog': 'Блог',
  '/kontakty': 'Контакты',
  '/geografiya': 'География работы',
  '/otzyvy': 'Отзывы',
  '/faq': 'Частые вопросы',
  '/partnerstvo': 'Партнёрство',
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
    const name = routeNames[to] || value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

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

