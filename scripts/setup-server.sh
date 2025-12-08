#!/bin/bash

# Скрипт для первоначальной настройки VPS сервера
# Запускать на сервере с правами root или через sudo

set -e

echo "🔧 Настройка VPS сервера для Kreo IT"

# Обновление системы
echo "📦 Обновление системы..."
apt-get update
apt-get upgrade -y

# Установка Node.js 20.x
if ! command -v node &> /dev/null; then
    echo "📦 Установка Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Установка PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 Установка PM2..."
    npm install -g pm2
fi

# Установка Nginx
if ! command -v nginx &> /dev/null; then
    echo "🌐 Установка Nginx..."
    apt-get install -y nginx
fi

# Установка Certbot для SSL
if ! command -v certbot &> /dev/null; then
    echo "🔒 Установка Certbot..."
    apt-get install -y certbot python3-certbot-nginx
fi

# Создание структуры директорий
echo "📁 Создание структуры директорий..."
mkdir -p /opt/kreo-it
mkdir -p /var/www/kreo-it/production
mkdir -p /var/log/nginx

# Настройка прав
chown -R $USER:$USER /opt/kreo-it
chown -R www-data:www-data /var/www/kreo-it

# Настройка PM2 для автозапуска
echo "⚙️ Настройка автозапуска PM2..."
pm2 startup systemd -u root --hp /root
pm2 save

echo "✅ Настройка сервера завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Настройте DNS записи для домена kreo.pro"
echo "2. Получите SSL сертификат:"
echo "   certbot --nginx -d kreo.pro -d www.kreo.pro"
echo "3. Скопируйте конфигурацию Nginx:"
echo "   cp nginx/kreo.pro.conf /etc/nginx/sites-available/kreo.pro"
echo "   ln -s /etc/nginx/sites-available/kreo.pro /etc/nginx/sites-enabled/"
echo "4. Перезапустите Nginx:"
echo "   nginx -t && systemctl reload nginx"

