#!/bin/bash

# Скрипт для исправления проблем на сервере
# Использование: ./scripts/fix-server.sh

set -e

# Цвета
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Загрузка переменных из .env.deploy
if [ -f .env.deploy ]; then
    set -a
    source .env.deploy
    set +a
    if [[ "$PRODUCTION_SERVER_SSH_KEY" == ~* ]]; then
        PRODUCTION_SERVER_SSH_KEY="${PRODUCTION_SERVER_SSH_KEY/#\~/$HOME}"
    fi
fi

SERVER_HOST=${PRODUCTION_SERVER_HOST}
SERVER_USER=${PRODUCTION_SERVER_USER}
SERVER_SSH_KEY=${PRODUCTION_SERVER_SSH_KEY}
SERVER_PORT=${PRODUCTION_SERVER_PORT:-22}
DEPLOY_PATH=${DEPLOY_PATH:-/opt/kreo-it}

if [ -z "$SERVER_HOST" ] || [ -z "$SERVER_USER" ] || [ -z "$SERVER_SSH_KEY" ]; then
    echo -e "${RED}❌ Не заданы переменные окружения${NC}"
    exit 1
fi

echo -e "${BLUE}🔧 Исправление проблем на сервере...${NC}"
echo ""

ssh -i "$SERVER_SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << 'EOF'
    set -e
    cd /opt/kreo-it
    
    echo "=== 1. Проверка статуса PM2 ==="
    pm2 status kreo-it || echo "Приложение не запущено в PM2"
    
    echo ""
    echo "=== 2. Проверка логов PM2 ==="
    pm2 logs kreo-it --lines 30 --nostream || echo "Логи недоступны"
    
    echo ""
    echo "=== 3. Проверка порта 3000 ==="
    netstat -tlnp 2>/dev/null | grep 3000 || ss -tlnp 2>/dev/null | grep 3000 || echo "Порт 3000 не слушается"
    
    echo ""
    echo "=== 4. Проверка доступности приложения ==="
    curl -f -s -m 5 http://localhost:3000 2>&1 | head -10 || echo "Приложение не отвечает на localhost:3000"
    
    echo ""
    echo "=== 5. Проверка Nginx ==="
    sudo nginx -t 2>&1
    sudo systemctl status nginx --no-pager -l | head -10 || echo "Nginx не запущен"
    
    echo ""
    echo "=== 6. Проверка конфигурации Nginx ==="
    if [ -f /etc/nginx/sites-available/kreo.pro ]; then
        echo "Конфигурация найдена:"
        sudo grep -A 3 "location /" /etc/nginx/sites-available/kreo.pro | head -5
    else
        echo "⚠️  Конфигурация Nginx не найдена"
    fi
    
    echo ""
    echo "=== 7. Логи Nginx (последние 20 строк) ==="
    sudo tail -20 /var/log/nginx/kreo.pro.error.log 2>/dev/null || echo "Логи недоступны"
    
    echo ""
    echo "=== 8. Попытка перезапуска PM2 ==="
    pm2 restart kreo-it || echo "Не удалось перезапустить приложение"
    sleep 5
    pm2 status kreo-it
EOF

echo ""
echo -e "${GREEN}✅ Диагностика завершена${NC}"

