#!/bin/bash

# Скрипт для деплоя одной командой
# Использование: ./scripts/deploy-one-command.sh

set -e

echo "🚀 Деплой проекта KREO одной командой"
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Загрузка переменных из .env.deploy если файл существует
if [ -f .env.deploy ]; then
    echo -e "${BLUE}📋 Загрузка переменных из .env.deploy${NC}"
    set -a
    source .env.deploy
    set +a
    # Разворачиваем ~ в полный путь для SSH ключа
    if [[ "$PRODUCTION_SERVER_SSH_KEY" == ~* ]]; then
        PRODUCTION_SERVER_SSH_KEY="${PRODUCTION_SERVER_SSH_KEY/#\~/$HOME}"
    fi
fi

# Проверка наличия необходимых переменных окружения
if [ -z "$PRODUCTION_SERVER_HOST" ] || [ -z "$PRODUCTION_SERVER_USER" ] || [ -z "$PRODUCTION_SERVER_SSH_KEY" ]; then
    echo -e "${RED}❌ Ошибка: Не заданы переменные окружения для деплоя${NC}"
    echo ""
    echo "Создайте файл .env.deploy со следующим содержимым:"
    echo "PRODUCTION_SERVER_HOST=your-server-ip"
    echo "PRODUCTION_SERVER_USER=your-username"
    echo "PRODUCTION_SERVER_SSH_KEY=~/.ssh/id_rsa"
    echo "PRODUCTION_SERVER_PORT=22"
    echo ""
    echo "Или экспортируйте переменные:"
    echo "export PRODUCTION_SERVER_HOST=your-server-ip"
    echo "export PRODUCTION_SERVER_USER=your-username"
    echo "export PRODUCTION_SERVER_SSH_KEY=~/.ssh/id_rsa"
    exit 1
fi

SERVER_HOST=${PRODUCTION_SERVER_HOST}
SERVER_USER=${PRODUCTION_SERVER_USER}
SERVER_SSH_KEY=${PRODUCTION_SERVER_SSH_KEY}
SERVER_PORT=${PRODUCTION_SERVER_PORT:-22}
DEPLOY_PATH=${DEPLOY_PATH:-/opt/kreo-it}

echo -e "${BLUE}📦 Шаг 1: Сборка проекта...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка сборки проекта${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Сборка завершена${NC}"
echo ""

echo -e "${BLUE}🐳 Шаг 2: Сборка Docker образа...${NC}"
docker build -f docker/Dockerfile -t kreo-it:production .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка сборки Docker образа${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker образ собран${NC}"
echo ""

echo -e "${BLUE}💾 Шаг 3: Сохранение образа...${NC}"
docker save kreo-it:production | gzip > kreo-it-production.tar.gz

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка сохранения образа${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Образ сохранен${NC}"
echo ""

echo -e "${BLUE}📤 Шаг 4: Копирование файлов на сервер...${NC}"
scp -i "$SERVER_SSH_KEY" -P "$SERVER_PORT" \
    kreo-it-production.tar.gz \
    docker-compose.yml \
    "$SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка копирования файлов на сервер${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Файлы скопированы${NC}"
echo ""

echo -e "${BLUE}📋 Шаг 4.1: Копирование Nginx конфигурации...${NC}"
scp -i "$SERVER_SSH_KEY" -P "$SERVER_PORT" \
    docker/nginx-production.conf \
    "$SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/"

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Предупреждение: Не удалось скопировать Nginx конфигурацию${NC}"
    echo "   Продолжаем деплой, но Nginx не будет обновлен"
else
    echo -e "${GREEN}✅ Nginx конфигурация скопирована${NC}"
fi
echo ""

echo -e "${BLUE}🚀 Шаг 5: Деплой на сервере...${NC}"
ssh -i "$SERVER_SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << 'EOF'
    set -e
    DEPLOY_PATH=${DEPLOY_PATH:-/opt/kreo-it}
    cd $DEPLOY_PATH || { echo "❌ Директория $DEPLOY_PATH не существует!"; exit 1; }
    
    echo "=== Загрузка Docker образа ==="
    docker load < kreo-it-production.tar.gz || true
    
    echo ""
    echo "=== Остановка и удаление старого контейнера ==="
    docker stop kreo-it-production 2>/dev/null || true
    docker rm -f kreo-it-production 2>/dev/null || true
    
    echo ""
    echo "=== Запуск нового контейнера ==="
    CONTAINER_ID=$(docker run -d \
      --name kreo-it-production \
      --restart unless-stopped \
      -p 3001:3000 \
      -e NODE_ENV=production \
      -e PORT=3000 \
      kreo-it:production 2>&1) || {
      echo "❌ Ошибка запуска контейнера: $CONTAINER_ID"
      exit 1
    }
    
    echo "Контейнер запущен: $CONTAINER_ID"
    
    echo ""
    echo "Ожидание запуска контейнера (20 секунд)..."
    sleep 20
    
    echo ""
    echo "=== Проверка статуса контейнера ==="
    docker ps -a | grep kreo-it-production || echo "❌ Контейнер не найден!"
    
    if ! docker ps | grep -q "kreo-it-production"; then
      echo "❌ Контейнер не запущен! Логи:"
      docker logs kreo-it-production --tail 50 2>&1 || echo "Логи недоступны"
      exit 1
    fi
    
    echo ""
    echo "=== Проверка доступности приложения ==="
    for i in {1..5}; do
      if curl -f -s -m 5 http://localhost:3001 > /dev/null 2>&1; then
        echo "✅ Приложение доступно на порту 3001!"
        break
      fi
      echo "Попытка $i/5: ждем..."
      sleep 3
    done
    
    echo ""
    echo "=== Обновление Nginx конфигурации ==="
    if [ -f nginx-production.conf ]; then
        echo "Содержимое nginx-production.conf (proxy_pass):"
        grep -A 2 "proxy_pass" nginx-production.conf | head -5
        
        echo ""
        echo "Копирование конфигурации:"
        sudo cp -v nginx-production.conf /etc/nginx/sites-available/kreo.pro
        
        echo ""
        echo "Удаление старого симлинка:"
        sudo rm -f /etc/nginx/sites-enabled/kreo.pro
        
        echo ""
        echo "Создание нового симлинка:"
        sudo ln -sf /etc/nginx/sites-available/kreo.pro /etc/nginx/sites-enabled/kreo.pro
        
        echo ""
        echo "Проверка конфигурации Nginx:"
        sudo nginx -t 2>&1
        
        if [ $? -ne 0 ]; then
          echo "❌ Ошибка в конфигурации Nginx!"
          exit 1
        fi
        
        echo ""
        echo "ПОЛНАЯ перезагрузка Nginx (restart):"
        sudo systemctl restart nginx 2>&1
        
        if [ $? -ne 0 ]; then
          echo "❌ Ошибка перезапуска Nginx!"
          sudo systemctl status nginx --no-pager -l | head -20
          exit 1
        fi
        
        echo ""
        echo "Ожидание запуска Nginx (3 секунды)..."
        sleep 3
        
        echo ""
        echo "Проверка финальной конфигурации:"
        sudo nginx -T 2>&1 | grep -B 2 -A 5 "server_name kreo.pro" | grep -A 3 "proxy_pass" | head -10
        
        echo ""
        echo "✅ Nginx конфигурация обновлена и перезапущена"
    else
        echo "⚠️  Nginx конфигурация не найдена, пропускаем обновление"
    fi
    
    echo ""
    echo "=== Очистка старых образов ==="
    docker image prune -f
    
    echo ""
    echo "=== Финальная проверка ==="
    echo "Статус контейнера:"
    docker ps | grep kreo-it-production
    
    echo ""
    echo "Проверка доступности через Nginx:"
    curl -f -s -m 5 http://localhost:3001 > /dev/null 2>&1 && echo "✅ Приложение доступно!" || echo "⚠️  Приложение недоступно"
EOF

DEPLOY_EXIT=$?

if [ $DEPLOY_EXIT -ne 0 ]; then
    echo -e "${RED}❌ Ошибка деплоя на сервере${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Деплой успешно завершен!${NC}"
echo ""
echo -e "${YELLOW}📋 Проверьте статус на сервере:${NC}"
echo "   ssh -i $SERVER_SSH_KEY -p $SERVER_PORT $SERVER_USER@$SERVER_HOST"
echo "   cd $DEPLOY_PATH && docker ps | grep kreo-it-production"
echo ""
echo -e "${YELLOW}🌐 Сайт должен быть доступен по адресу:${NC}"
echo "   https://kreo.pro"
echo ""
echo -e "${BLUE}💡 Для проверки логов контейнера:${NC}"
echo "   ssh -i $SERVER_SSH_KEY -p $SERVER_PORT $SERVER_USER@$SERVER_HOST 'docker logs kreo-it-production --tail 50'"
echo ""

# Очистка локальных файлов
echo -e "${BLUE}🧹 Очистка временных файлов...${NC}"
rm -f kreo-it-production.tar.gz

echo -e "${GREEN}✅ Готово!${NC}"

