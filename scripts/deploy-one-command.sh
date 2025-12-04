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

# Проверка наличия необходимых переменных окружения
if [ -z "$PRODUCTION_SERVER_HOST" ] || [ -z "$PRODUCTION_SERVER_USER" ] || [ -z "$PRODUCTION_SERVER_SSH_KEY" ]; then
    echo -e "${RED}❌ Ошибка: Не заданы переменные окружения для деплоя${NC}"
    echo ""
    echo "Создайте файл .env.deploy со следующим содержимым:"
    echo "PRODUCTION_SERVER_HOST=your-server-ip"
    echo "PRODUCTION_SERVER_USER=your-username"
    echo "PRODUCTION_SERVER_SSH_KEY=/path/to/ssh/key"
    echo "PRODUCTION_SERVER_PORT=22"
    echo ""
    echo "Или экспортируйте переменные:"
    echo "export PRODUCTION_SERVER_HOST=your-server-ip"
    echo "export PRODUCTION_SERVER_USER=your-username"
    echo "export PRODUCTION_SERVER_SSH_KEY=/path/to/ssh/key"
    exit 1
fi

# Загрузка переменных из .env.deploy если файл существует
if [ -f .env.deploy ]; then
    echo -e "${BLUE}📋 Загрузка переменных из .env.deploy${NC}"
    export $(cat .env.deploy | grep -v '^#' | xargs)
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
ssh -i "$SERVER_SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << EOF
    set -e
    cd $DEPLOY_PATH
    
    echo "Загрузка Docker образа..."
    docker load < kreo-it-production.tar.gz || true
    
    echo "Остановка текущего контейнера..."
    docker compose stop landing || true
    docker compose rm -f landing || true
    
    echo "Запуск нового контейнера..."
    docker compose up -d landing
    
    echo "Ожидание запуска контейнера..."
    sleep 10
    
    echo "Проверка статуса контейнера..."
    docker compose ps landing
    
    echo "Обновление Nginx конфигурации..."
    if [ -f nginx-production.conf ]; then
        sudo cp nginx-production.conf /etc/nginx/sites-available/kreo.pro
        if [ ! -L /etc/nginx/sites-enabled/kreo.pro ]; then
            sudo ln -s /etc/nginx/sites-available/kreo.pro /etc/nginx/sites-enabled/kreo.pro
        fi
        echo "Проверка конфигурации Nginx..."
        sudo nginx -t && sudo systemctl reload nginx || echo "⚠️  Ошибка перезагрузки Nginx"
    else
        echo "⚠️  Nginx конфигурация не найдена, пропускаем обновление"
    fi
    
    echo "Очистка старых образов..."
    docker system prune -f
EOF

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка деплоя на сервере${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Деплой успешно завершен!${NC}"
echo ""
echo -e "${YELLOW}📋 Проверьте статус на сервере:${NC}"
echo "   ssh -i $SERVER_SSH_KEY -p $SERVER_PORT $SERVER_USER@$SERVER_HOST"
echo "   cd $DEPLOY_PATH && docker compose ps"
echo ""
echo -e "${YELLOW}🌐 Сайт должен быть доступен по адресу:${NC}"
echo "   https://kreo.pro"
echo ""

# Очистка локальных файлов
echo -e "${BLUE}🧹 Очистка временных файлов...${NC}"
rm -f kreo-it-production.tar.gz

echo -e "${GREEN}✅ Готово!${NC}"

