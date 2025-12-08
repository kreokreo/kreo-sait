// import { Inter, JetBrains_Mono } from 'next/font/google'
import CustomCursor from '@/components/CustomCursor'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import '@/app/globals.css'

// Temporarily disabled Google Fonts due to network issues
// const inter = Inter({ 
//   subsets: ['latin', 'cyrillic'],
//   variable: '--font-inter',
//   display: 'swap',
// })

// const jetbrainsMono = JetBrains_Mono({ 
//   subsets: ['latin', 'cyrillic'],
//   variable: '--font-mono',
//   display: 'swap',
// })

export const metadata = {
  title: 'Kreo - IT & AI Agency',
  description: 'Делаем IT-продукты, которые приносят результат. Автоматизация, AI, сайты и сервисы для бизнеса.',
  keywords: 'IT-разработка, AI, автоматизация, веб-приложения, сайты, CRM, ERP',
  authors: [{ name: 'Kreo' }],
  icons: {
    icon: [
      { url: '/favicon1.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: '/favicon1.png',
    apple: '/favicon1.png',
  },
  openGraph: {
    title: 'Kreo - IT & AI Agency',
    description: 'Делаем IT-продукты, которые приносят результат',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Kreo',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className="">
      <body className="bg-white text-gray-900 font-sans flex flex-col min-h-screen cursor-none">
        <CustomCursor />
        <Header />
        <Breadcrumbs />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

