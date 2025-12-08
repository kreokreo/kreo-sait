#!/bin/bash

# Скрипт для настройки чистого сервера после переустановки ОС
# Использование: ./scripts/setup-clean-server.sh

set -e

echo "🚀 Настройка чистого сервера после переустановки ОС"

# Загрузка переменных из .env.deploy
if [ -f .env.deploy ]; then
    source .env.deploy
    echo "✅ Переменные загружены из .env.deploy"
else
    echo "❌ Файл .env.deploy не найден!"
    exit 1
fi

SERVER_USER=$(echo $SERVER | cut -d'@' -f1)
SERVER_HOST=$(echo $SERVER | cut -d'@' -f2 | cut -d':' -f1)
SERVER_PORT=$(echo $SERVER | cut -d':' -f2)

echo "📋 Параметры сервера:"
echo "   Пользователь: $SERVER_USER"
echo "   Хост: $SERVER_HOST"
echo "   Порт: $SERVER_PORT"

# Проверка SSH подключения
echo "🔌 Проверка SSH подключения..."
if ssh -i ~/.ssh/kreo_deploy -o ConnectTimeout=5 $SERVER "echo 'OK'" > /dev/null 2>&1; then
    echo "✅ SSH подключение успешно"
else
    echo "❌ Не удалось подключиться к серверу"
    exit 1
fi

echo "📦 Установка необходимого ПО на сервере..."

ssh -i ~/.ssh/kreo_deploy $SERVER << 'ENDSSH'
set -e

# Обновление системы
echo "🔄 Обновление системы..."
apt update && apt upgrade -y

# Установка базовых утилит
echo "📦 Установка базовых утилит..."
apt install -y curl wget git build-essential

# Установка Node.js 20.x
echo "📦 Установка Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Установка PM2
echo "📦 Установка PM2..."
npm install -g pm2

# Установка Nginx
echo "📦 Установка Nginx..."
apt install -y nginx

# Установка Certbot для SSL
echo "📦 Установка Certbot..."
apt install -y certbot python3-certbot-nginx

# Проверка версий
echo "✅ Установленное ПО:"
echo "   Node.js: $(node --version)"
echo "   npm: $(npm --version)"
echo "   PM2: $(pm2 --version)"
echo "   Nginx: $(nginx -v 2>&1)"
echo "   Git: $(git --version)"

# Настройка PM2 для автозапуска
pm2 startup systemd -u root --hp /root
pm2 save

echo "✅ Базовое ПО установлено и настроено"
ENDSSH

echo "✅ Настройка сервера завершена!"
echo ""
echo "📝 Следующие шаги:"
echo "   1. Запустите деплой: npm run deploy"
echo "   2. Настройте Nginx: скопируйте nginx/kreo.pro.conf на сервер"
echo "   3. Установите SSL: certbot --nginx -d kreo.pro -d www.kreo.pro"

