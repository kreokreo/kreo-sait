#!/bin/bash

# Скрипт для проверки состояния сервера и диагностики проблем
# Использование: ./scripts/check-server.sh

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

echo -e "${BLUE}🔍 Диагностика сервера...${NC}"
echo ""

ssh -i "$SERVER_SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << EOF
    echo "=== Статус Docker контейнеров ==="
    cd $DEPLOY_PATH
    docker compose ps
    
    echo ""
    echo "=== Статус контейнера landing ==="
    docker compose ps landing
    
    echo ""
    echo "=== Логи контейнера landing (последние 50 строк) ==="
    docker compose logs landing --tail 50
    
    echo ""
    echo "=== Проверка порта 3001 ==="
    netstat -tlnp 2>/dev/null | grep 3001 || ss -tlnp 2>/dev/null | grep 3001 || echo "Порт 3001 не слушается"
    
    echo ""
    echo "=== Проверка доступности изнутри контейнера ==="
    docker exec kreo-it-production wget -q -O- http://localhost:3000 2>&1 | head -5 || echo "Не удалось подключиться"
    
    echo ""
    echo "=== Проверка доступности с хоста ==="
    curl -f -s -m 5 http://localhost:3001 2>&1 | head -5 || echo "Не удалось подключиться к localhost:3001"
    
    echo ""
    echo "=== Статус Nginx ==="
    sudo systemctl status nginx --no-pager -l | head -20 || echo "Nginx не запущен"
    
    echo ""
    echo "=== Ошибки Nginx (последние 20 строк) ==="
    sudo tail -20 /var/log/nginx/kreo.pro.error.log 2>/dev/null || echo "Логи недоступны"
    
    echo ""
    echo "=== Конфигурация Nginx ==="
    sudo nginx -t 2>&1 || echo "Ошибка в конфигурации Nginx"
    
    echo ""
    echo "=== Проверка конфигурации kreo.pro ==="
    sudo cat /etc/nginx/sites-available/kreo.pro | grep -A 5 "location /" || echo "Конфигурация не найдена"
EOF

echo ""
echo -e "${GREEN}✅ Диагностика завершена${NC}"

