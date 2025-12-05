#!/bin/bash

# Скрипт для деплоя проекта на сервер
# Использование: ./scripts/deploy.sh [ветка]

set -e

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Деплой проекта на сервер${NC}"
echo ""

# Проверка наличия .env.deploy
if [ ! -f .env.deploy ]; then
    echo -e "${RED}❌ Ошибка: файл .env.deploy не найден${NC}"
    echo ""
    echo "Создайте файл .env.deploy со следующим содержимым:"
    echo "PRODUCTION_SERVER_HOST=your-server-ip"
    echo "PRODUCTION_SERVER_USER=your-username"
    echo "PRODUCTION_SERVER_SSH_KEY=~/.ssh/your_key"
    echo "PRODUCTION_SERVER_PORT=22"
    echo "DEPLOY_PATH=/opt/kreo-it"
    exit 1
fi

# Загрузка переменных из .env.deploy
echo -e "${BLUE}📋 Загрузка переменных из .env.deploy${NC}"
set -a
source .env.deploy
set +a

# Разворачиваем ~ в полный путь для SSH ключа
if [[ "$PRODUCTION_SERVER_SSH_KEY" == ~* ]]; then
    PRODUCTION_SERVER_SSH_KEY="${PRODUCTION_SERVER_SSH_KEY/#\~/$HOME}"
fi

# Проверка наличия необходимых переменных
if [ -z "$PRODUCTION_SERVER_HOST" ] || [ -z "$PRODUCTION_SERVER_USER" ] || [ -z "$PRODUCTION_SERVER_SSH_KEY" ]; then
    echo -e "${RED}❌ Ошибка: Не заданы переменные окружения для деплоя${NC}"
    echo ""
    echo "Проверьте файл .env.deploy"
    exit 1
fi

SERVER_HOST=${PRODUCTION_SERVER_HOST}
SERVER_USER=${PRODUCTION_SERVER_USER}
SERVER_SSH_KEY=${PRODUCTION_SERVER_SSH_KEY}
SERVER_PORT=${PRODUCTION_SERVER_PORT:-22}
DEPLOY_PATH=${DEPLOY_PATH:-/opt/kreo-it}

# Получаем ветку для деплоя
if [ -z "$1" ]; then
    BRANCH=$(git branch --show-current)
    if [ -z "$BRANCH" ]; then
        BRANCH="main"
    fi
else
    BRANCH="$1"
fi

echo -e "${BLUE}📋 Параметры деплоя:${NC}"
echo "   Сервер: $SERVER_USER@$SERVER_HOST:$SERVER_PORT"
echo "   Ветка: $BRANCH"
echo "   Путь на сервере: $DEPLOY_PATH"
echo ""

# Проверка SSH подключения
echo -e "${BLUE}🔌 Проверка SSH подключения...${NC}"
if ! ssh -i "$SERVER_SSH_KEY" -p "$SERVER_PORT" -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" "echo 'SSH OK'" > /dev/null 2>&1; then
    echo -e "${RED}❌ Ошибка: Не удалось подключиться к серверу${NC}"
    echo ""
    echo "Проверьте:"
    echo "  1. SSH ключ: $SERVER_SSH_KEY"
    echo "  2. Доступность сервера: $SERVER_HOST"
    echo "  3. Пользователь: $SERVER_USER"
    exit 1
fi

echo -e "${GREEN}✅ SSH подключение успешно${NC}"
echo ""

# Проверка, что мы в git репозитории
if [ ! -d .git ]; then
    echo -e "${RED}❌ Ошибка: это не git репозиторий${NC}"
    exit 1
fi

# Проверяем, что ветка существует
if ! git rev-parse --verify "$BRANCH" > /dev/null 2>&1; then
    echo -e "${RED}❌ Ошибка: ветка $BRANCH не найдена${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Шаг 1: Сборка проекта...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка сборки проекта${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Сборка завершена${NC}"
echo ""

# Проверка, что сборка прошла успешно
if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Ошибка: папка .next не найдена после сборки${NC}"
    exit 1
fi

echo -e "${BLUE}📤 Шаг 2: Подготовка файлов для деплоя...${NC}"

# Создаем временную папку для архивации
TEMP_DIR=$(mktemp -d)
echo "Создание архива в $TEMP_DIR..."

# Копируем необходимые файлы и папки (без node_modules - установим на сервере)
cp -r .next "$TEMP_DIR/"
cp -r public "$TEMP_DIR/"
cp package.json "$TEMP_DIR/"
cp package-lock.json "$TEMP_DIR/" 2>/dev/null || true
cp next.config.js "$TEMP_DIR/" 2>/dev/null || true

# Создаем архив
ARCHIVE_NAME="kreo-it-deploy-$(date +%Y%m%d-%H%M%S).tar.gz"
cd "$TEMP_DIR"
tar -czf "../$ARCHIVE_NAME" .
cd - > /dev/null
ARCHIVE_PATH="$TEMP_DIR/../$ARCHIVE_NAME"

echo -e "${GREEN}✅ Архив создан: $ARCHIVE_NAME${NC}"
echo ""

# Копируем архив на сервер
echo -e "${BLUE}📤 Шаг 3: Копирование архива на сервер...${NC}"
scp -i "$SERVER_SSH_KEY" -P "$SERVER_PORT" \
    "$ARCHIVE_PATH" \
    "$SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка копирования файлов на сервер${NC}"
    rm -rf "$TEMP_DIR" "$ARCHIVE_PATH"
    exit 1
fi

echo -e "${GREEN}✅ Файлы скопированы${NC}"
echo ""

# Копируем Nginx конфигурацию (если есть)
if [ -f "docker/nginx-production.conf" ]; then
    echo -e "${BLUE}📋 Копирование Nginx конфигурации...${NC}"
    scp -i "$SERVER_SSH_KEY" -P "$SERVER_PORT" \
        docker/nginx-production.conf \
        "$SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/" 2>/dev/null || echo -e "${YELLOW}⚠️  Nginx конфигурация не скопирована${NC}"
fi

echo ""

# Деплой на сервере
echo -e "${BLUE}🚀 Шаг 4: Деплой на сервере...${NC}"
ssh -i "$SERVER_SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << EOF
    set -e
    DEPLOY_PATH=${DEPLOY_PATH:-/opt/kreo-it}
    ARCHIVE_NAME="$ARCHIVE_NAME"
    
    cd $DEPLOY_PATH || { echo "❌ Директория $DEPLOY_PATH не существует!"; exit 1; }
    
    echo "=== Распаковка архива ==="
    tar -xzf "$ARCHIVE_NAME" -C .
    
    echo ""
    echo "=== Установка зависимостей ==="
    # Устанавливаем все зависимости (включая dev для сборки, если нужно)
    npm ci || npm install
    
    echo ""
    echo "=== Остановка старого процесса ==="
    pm2 stop kreo-it 2>/dev/null || true
    pm2 delete kreo-it 2>/dev/null || true
    
    echo ""
    echo "=== Запуск приложения через PM2 ==="
    
    # Проверяем, установлен ли PM2
    if ! command -v pm2 &> /dev/null; then
        echo "Установка PM2..."
        npm install -g pm2
    fi
    
    # Запускаем приложение через PM2
    # Используем next start для production
    PORT=3000 NODE_ENV=production HOSTNAME=0.0.0.0 pm2 start npm --name kreo-it -- start
    
    # Или можно использовать напрямую node, если есть server.js
    # PORT=3000 NODE_ENV=production HOSTNAME=0.0.0.0 pm2 start server.js --name kreo-it || \
    # PORT=3000 NODE_ENV=production HOSTNAME=0.0.0.0 pm2 start npm --name kreo-it -- start
    
    # Сохраняем конфигурацию PM2
    pm2 save
    pm2 startup 2>/dev/null || true
    
    echo ""
    echo "=== Ожидание запуска (10 секунд) ==="
    sleep 10
    
    echo ""
    echo "=== Проверка статуса ==="
    pm2 status kreo-it
    
    echo ""
    echo "=== Проверка доступности ==="
    for i in {1..5}; do
        if curl -f -s -m 5 http://localhost:3000 > /dev/null 2>&1; then
            echo "✅ Приложение доступно на порту 3000!"
            break
        fi
        echo "Попытка $i/5: ждем..."
        sleep 3
    done
    
    echo ""
    echo "=== Очистка старых архивов ==="
    rm -f kreo-it-deploy-*.tar.gz
    
    echo ""
    echo "=== Финальная проверка ==="
    pm2 logs kreo-it --lines 10 --nostream
EOF

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка деплоя на сервере${NC}"
    rm -rf "$TEMP_DIR" "$ARCHIVE_PATH"
    exit 1
fi

# Очистка локальных временных файлов
echo ""
echo -e "${BLUE}🧹 Очистка временных файлов...${NC}"
rm -rf "$TEMP_DIR" "$ARCHIVE_PATH"

echo ""
echo -e "${GREEN}✅ Деплой успешно завершен!${NC}"
echo ""
echo -e "${YELLOW}📋 Информация:${NC}"
echo "   Ветка: $BRANCH"
echo "   Сервер: $SERVER_USER@$SERVER_HOST"
echo "   Путь: $DEPLOY_PATH"
echo ""
echo -e "${YELLOW}🌐 Сайт должен быть доступен по адресу:${NC}"
echo "   https://kreo.pro"
echo ""
