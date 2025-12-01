#!/bin/bash

# Скрипт для первоначальной настройки VPS сервера
# Запускать на сервере с правами root или через sudo

set -e

echo "🔧 Настройка VPS сервера для Kreo IT"

# Обновление системы
echo "📦 Обновление системы..."
apt-get update
apt-get upgrade -y

# Установка Docker
if ! command -v docker &> /dev/null; then
    echo "🐳 Установка Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Установка Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Установка Docker Compose..."
    apt-get install -y docker-compose-plugin
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

# Создание systemd service для автоматического запуска
echo "⚙️ Настройка автозапуска..."
cat > /etc/systemd/system/kreo-it.service << EOF
[Unit]
Description=Kreo IT Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/kreo-it
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable kreo-it.service

echo "✅ Настройка сервера завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Настройте DNS записи для домена kreo.pro"
echo "2. Получите SSL сертификат:"
echo "   certbot --nginx -d kreo.pro -d www.kreo.pro"
echo "3. Скопируйте конфигурацию Nginx:"
echo "   cp docker/nginx-production.conf /etc/nginx/sites-available/kreo.pro"
echo "   ln -s /etc/nginx/sites-available/kreo.pro /etc/nginx/sites-enabled/"
echo "4. Перезапустите Nginx:"
echo "   nginx -t && systemctl reload nginx"

