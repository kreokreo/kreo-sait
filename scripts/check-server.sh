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

ssh -i "$SERVER_SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << 'EOF'
    DEPLOY_PATH=${DEPLOY_PATH:-/opt/kreo-it}
    cd $DEPLOY_PATH || exit 1
    
    echo "=== Все Docker контейнеры ==="
    docker ps -a
    
    echo ""
    echo "=== Контейнер kreo-it-production (детально) ==="
    docker ps -a | grep kreo-it-production || echo "❌ Контейнер не найден!"
    
    echo ""
    echo "=== Статус контейнера (inspect) ==="
    docker inspect kreo-it-production --format='Status: {{.State.Status}}, Running: {{.State.Running}}, ExitCode: {{.State.ExitCode}}' 2>&1 || echo "Не удалось получить статус"
    
    echo ""
    echo "=== Логи контейнера (последние 100 строк) ==="
    docker logs kreo-it-production --tail 100 2>&1 || echo "Логи недоступны"
    
    echo ""
    echo "=== Содержимое /app в контейнере ==="
    docker exec kreo-it-production ls -la /app 2>&1 | head -30 || echo "Не удалось проверить содержимое"
    
    echo ""
    echo "=== Проверка server.js ==="
    docker exec kreo-it-production test -f /app/server.js && echo "✅ server.js найден" || echo "❌ server.js НЕ найден!"
    docker exec kreo-it-production ls -lh /app/server.js 2>&1 || echo "Файл не найден"
    
    echo ""
    echo "=== Процессы в контейнере ==="
    docker exec kreo-it-production ps aux 2>&1 || echo "Не удалось проверить процессы"
    
    echo ""
    echo "=== Проверка порта 3000 внутри контейнера ==="
    docker exec kreo-it-production netstat -tlnp 2>&1 | grep 3000 || docker exec kreo-it-production ss -tlnp 2>&1 | grep 3000 || echo "Порт 3000 не слушается внутри контейнера"
    
    echo ""
    echo "=== Проверка порта 3001 на хосте ==="
    netstat -tlnp 2>/dev/null | grep 3001 || ss -tlnp 2>/dev/null | grep 3001 || echo "Порт 3001 не слушается на хосте"
    
    echo ""
    echo "=== Проверка доступности изнутри контейнера ==="
    docker exec kreo-it-production wget -q -O- http://localhost:3000 2>&1 | head -10 || echo "❌ Не удалось подключиться изнутри контейнера"
    
    echo ""
    echo "=== Проверка доступности с хоста (localhost:3001) ==="
    curl -v -m 5 http://localhost:3001 2>&1 | head -20 || echo "❌ Не удалось подключиться к localhost:3001"
    
    echo ""
    echo "=== Статус Nginx ==="
    sudo systemctl status nginx --no-pager -l | head -30 || echo "Nginx не запущен"
    
    echo ""
    echo "=== Ошибки Nginx (последние 30 строк) ==="
    sudo tail -30 /var/log/nginx/kreo.pro.error.log 2>/dev/null || echo "Логи недоступны"
    
    echo ""
    echo "=== Access логи Nginx (последние 10 строк) ==="
    sudo tail -10 /var/log/nginx/kreo.pro.access.log 2>/dev/null || echo "Access логи недоступны"
    
    echo ""
    echo "=== Конфигурация Nginx (проверка синтаксиса) ==="
    sudo nginx -t 2>&1 || echo "❌ Ошибка в конфигурации Nginx"
    
    echo ""
    echo "=== Конфигурация kreo.pro (proxy настройки) ==="
    sudo cat /etc/nginx/sites-available/kreo.pro 2>/dev/null | grep -A 10 "location /" || echo "Конфигурация не найдена"
    
    echo ""
    echo "=== Проверка доступности через Nginx ==="
    curl -v -H "Host: kreo.pro" http://localhost 2>&1 | head -20 || echo "Не удалось проверить через Nginx"
EOF

echo ""
echo -e "${GREEN}✅ Диагностика завершена${NC}"

