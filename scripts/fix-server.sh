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
    
    echo "=== 1. Проверка статуса контейнера ==="
    docker ps -a | grep kreo-it-production || echo "Контейнер не найден"
    
    echo ""
    echo "=== 2. Остановка и удаление всех старых контейнеров ==="
    docker stop kreo-it-production 2>/dev/null || true
    docker rm -f kreo-it-production 2>/dev/null || true
    docker stop $(docker ps -aq --filter "name=kreo") 2>/dev/null || true
    docker rm -f $(docker ps -aq --filter "name=kreo") 2>/dev/null || true
    
    echo ""
    echo "=== 3. Проверка наличия образа ==="
    docker images | grep kreo-it || echo "Образ не найден"
    
    echo ""
    echo "=== 4. Запуск контейнера ==="
    if docker images | grep -q "kreo-it.*production"; then
        docker run -d \
          --name kreo-it-production \
          --restart unless-stopped \
          -p 3001:3000 \
          -e NODE_ENV=production \
          -e PORT=3000 \
          kreo-it:production
        
        echo "Ожидание запуска..."
        sleep 10
        
        echo ""
        echo "=== 5. Проверка статуса ==="
        docker ps | grep kreo-it-production
        
        echo ""
        echo "=== 6. Проверка логов ==="
        docker logs kreo-it-production --tail 30
        
        echo ""
        echo "=== 7. Проверка порта 3001 ==="
        netstat -tlnp 2>/dev/null | grep 3001 || ss -tlnp 2>/dev/null | grep 3001 || echo "Порт не слушается"
        
        echo ""
        echo "=== 8. Проверка доступности изнутри контейнера ==="
        docker exec kreo-it-production wget -q -O- http://localhost:3000 2>&1 | head -10 || echo "Не отвечает"
        
        echo ""
        echo "=== 9. Проверка доступности с хоста ==="
        curl -f -s -m 5 http://localhost:3001 2>&1 | head -10 || echo "Не отвечает на localhost:3001"
    else
        echo "❌ Образ kreo-it:production не найден!"
        echo "Нужно сначала задеплоить образ на сервер"
    fi
    
    echo ""
    echo "=== 10. Проверка Nginx ==="
    sudo nginx -t 2>&1
    sudo systemctl status nginx --no-pager -l | head -10 || echo "Nginx не запущен"
    
    echo ""
    echo "=== 11. Проверка конфигурации Nginx ==="
    if [ -f /etc/nginx/sites-available/kreo.pro ]; then
        echo "Конфигурация найдена:"
        sudo grep -A 3 "location /" /etc/nginx/sites-available/kreo.pro | head -5
    else
        echo "⚠️  Конфигурация Nginx не найдена"
    fi
    
    echo ""
    echo "=== 12. Логи Nginx (последние 20 строк) ==="
    sudo tail -20 /var/log/nginx/kreo.pro.error.log 2>/dev/null || echo "Логи недоступны"
EOF

echo ""
echo -e "${GREEN}✅ Диагностика завершена${NC}"

