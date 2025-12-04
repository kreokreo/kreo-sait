#!/bin/bash

# Быстрый деплой: пушит в git и параллельно деплоит на сервер
# Использование: ./scripts/deploy-fast.sh [commit message]

set -e

echo "🚀 Быстрый деплой: Git + Server параллельно"
echo ""

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

# Проверка переменных
if [ -z "$SERVER_HOST" ] || [ -z "$SERVER_USER" ] || [ -z "$SERVER_SSH_KEY" ]; then
    echo -e "${RED}❌ Не заданы переменные окружения${NC}"
    exit 1
fi

# Сообщение коммита
COMMIT_MSG=${1:-"chore: деплой $(date +%Y-%m-%d\ %H:%M:%S)"}

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

# Функция для деплоя на сервер
deploy_to_server() {
    echo -e "${BLUE}📤 Копирование файлов на сервер...${NC}"
    scp -i "$SERVER_SSH_KEY" -P "$SERVER_PORT" \
        kreo-it-production.tar.gz \
        docker-compose.yml \
        docker/nginx-production.conf \
        "$SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/" || return 1

    echo -e "${BLUE}🚀 Деплой на сервере...${NC}"
    ssh -i "$SERVER_SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << EOF
        set -e
        cd $DEPLOY_PATH
        
        # Загрузка образа и деплой
        docker load < kreo-it-production.tar.gz
        
        # Остановка и удаление старого контейнера
        docker stop kreo-it-production 2>/dev/null || true
        docker rm -f kreo-it-production 2>/dev/null || true
        
        # Запуск нового контейнера
        docker run -d \
          --name kreo-it-production \
          --restart unless-stopped \
          -p 3001:3000 \
          -e NODE_ENV=production \
          -e PORT=3000 \
          kreo-it:production
        
        # Обновление Nginx
        if [ -f nginx-production.conf ]; then
          sudo cp nginx-production.conf /etc/nginx/sites-available/kreo.pro
          [ -L /etc/nginx/sites-enabled/kreo.pro ] || sudo ln -s /etc/nginx/sites-available/kreo.pro /etc/nginx/sites-enabled/kreo.pro
          sudo nginx -t && sudo systemctl reload nginx
        fi
        
        # Очистка
        docker image prune -f
EOF
}

# Функция для пуша в git
push_to_git() {
    echo -e "${BLUE}📝 Коммит и пуш в Git...${NC}"
    
    # Проверяем, есть ли изменения
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠️  Нет изменений для коммита${NC}"
        return 0
    fi
    
    git add -A
    git commit -m "$COMMIT_MSG" || echo "Нет изменений для коммита"
    git push origin main || echo "Ошибка пуша в git (не критично)"
}

# Запускаем деплой и пуш параллельно
echo -e "${BLUE}⚡ Запуск деплоя и пуша в Git параллельно...${NC}"
echo ""

# Запускаем деплой в фоне
deploy_to_server &
DEPLOY_PID=$!

# Запускаем пуш в git
push_to_git &
GIT_PID=$!

# Ждем завершения обоих процессов
wait $DEPLOY_PID
DEPLOY_EXIT=$?

wait $GIT_PID
GIT_EXIT=$?

# Проверяем результаты
if [ $DEPLOY_EXIT -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Деплой на сервер успешен!${NC}"
else
    echo ""
    echo -e "${RED}❌ Ошибка деплоя на сервер${NC}"
fi

if [ $GIT_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Пуш в Git успешен!${NC}"
else
    echo -e "${YELLOW}⚠️  Проблемы с Git (не критично)${NC}"
fi

# Очистка
echo ""
echo -e "${BLUE}🧹 Очистка временных файлов...${NC}"
rm -f kreo-it-production.tar.gz

if [ $DEPLOY_EXIT -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Готово! Сайт должен быть доступен на https://kreo.pro${NC}"
    exit 0
else
    exit 1
fi

