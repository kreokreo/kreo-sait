/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'prod.spline.design'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'prod.spline.design',
      },
    ],
  },
  // Оптимизация для production
  compress: true,
  poweredByHeader: false,
  // Отключаем DevTools в режиме разработки
  devIndicators: {
    position: 'bottom-right',
  },
  // Для Docker (только для production build)
  output: 'standalone', // Включаем для Docker деплоя
}

module.exports = nextConfig

