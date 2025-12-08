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
  // Standalone режим для оптимизированного production деплоя
  // Позволяет запускать приложение без node_modules
  output: 'standalone',
  // Исправление проблем с vendor chunks
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Оптимизация для framer-motion
  transpilePackages: ['framer-motion'],
}

module.exports = nextConfig

