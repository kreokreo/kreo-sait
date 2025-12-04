#!/bin/bash

# Скрипт для настройки SSL для app.kreo.pro
# Использование: ./scripts/setup-app-domain.sh

set -e

echo "🔍 Проверка DNS для app.kreo.pro..."

# Проверка DNS
EXPECTED_IP="31.130.155.38"
CURRENT_IP=$(dig A app.kreo.pro +short | head -1)

if [ "$CURRENT_IP" != "$EXPECTED_IP" ]; then
    echo "⚠️  DNS еще не распространился"
    echo "   Текущий IP: $CURRENT_IP"
    echo "   Ожидается: $EXPECTED_IP"
    echo ""
    echo "Подождите еще несколько минут и запустите скрипт снова"
    exit 1
fi

echo "✅ DNS обновился! IP: $CURRENT_IP"
echo ""

# Получение SSL сертификата
echo "🔒 Получение SSL сертификата..."
ssh -i ~/.ssh/kreo-timeweb -o StrictHostKeyChecking=no root@31.130.155.38 \
    "certbot certonly --nginx -d app.kreo.pro --non-interactive --agree-tos --email info@kreo.pro --redirect"

echo ""
echo "✅ SSL сертификат получен!"

# Обновление Nginx конфигурации для HTTPS
echo "📝 Обновление Nginx конфигурации..."
ssh -i ~/.ssh/kreo-timeweb -o StrictHostKeyChecking=no root@31.130.155.38 << 'EOF'
cat > /etc/nginx/sites-available/app.kreo.pro << 'NGINX_CONFIG'
# Редирект HTTP на HTTPS
server {
    listen 80;
    server_name app.kreo.pro;
    return 301 https://app.kreo.pro$request_uri;
}

# HTTPS конфигурация для app.kreo.pro
server {
    listen 443 ssl http2;
    server_name app.kreo.pro;

    ssl_certificate /etc/letsencrypt/live/app.kreo.pro/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.kreo.pro/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend приложение
    location / {
        proxy_pass http://localhost:8082;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_CONFIG

nginx -t && systemctl reload nginx
EOF

echo ""
echo "✅ Nginx обновлен и перезагружен!"
echo ""
echo "🌐 Поддомен app.kreo.pro готов к использованию!"
echo "   - HTTP: http://app.kreo.pro (редирект на HTTPS)"
echo "   - HTTPS: https://app.kreo.pro"

