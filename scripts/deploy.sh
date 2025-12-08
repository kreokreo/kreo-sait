#!/bin/bash

# Скрипт для деплоя проекта на сервер из Git репозитория
# Использование: ./scripts/deploy.sh [ветка]

set -e

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Деплой проекта на сервер из Git${NC}"
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
    echo "GIT_REPO_URL=https://github.com/kreokreo/kreo-sait.git"
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
GIT_REPO_URL=${GIT_REPO_URL:-https://github.com/kreokreo/kreo-sait.git}

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
echo "   Репозиторий: $GIT_REPO_URL"
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

# Деплой на сервере
echo -e "${BLUE}🚀 Деплой на сервере...${NC}"
ssh -i "$SERVER_SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << EOF
    set -e
    DEPLOY_PATH=${DEPLOY_PATH:-/opt/kreo-it}
    GIT_REPO_URL="$GIT_REPO_URL"
    BRANCH="$BRANCH"
    
    echo "=== Создание директории для деплоя ==="
    mkdir -p $DEPLOY_PATH
    cd $DEPLOY_PATH
    
    echo ""
    echo "=== Клонирование/обновление репозитория ==="
    if [ -d ".git" ]; then
        echo "Репозиторий уже существует, обновляем..."
        git fetch origin
        git reset --hard origin/\$BRANCH
        git clean -fd
    else
        echo "Клонируем репозиторий..."
        git clone -b \$BRANCH \$GIT_REPO_URL .
    fi
    
    echo ""
    echo "=== Проверка текущей ветки ==="
    git branch --show-current
    git log --oneline -1
    
    echo ""
    echo "=== Установка зависимостей ==="
    npm ci || npm install
    
    echo ""
    echo "=== Сборка проекта ==="
    NODE_ENV=production npm run build
    
    if [ ! -d ".next" ]; then
        echo "❌ Ошибка: папка .next не найдена после сборки"
        exit 1
    fi
    
    echo ""
    echo "=== Остановка старого процесса ==="
    pm2 stop kreo-it 2>/dev/null || true
    pm2 delete kreo-it 2>/dev/null || true
    
    echo ""
    echo "=== Установка PM2 (если нужно) ==="
    if ! command -v pm2 &> /dev/null; then
        echo "Установка PM2..."
        npm install -g pm2
    fi
    
    echo ""
    echo "=== Копирование статических файлов для standalone режима ==="
    if [ -d ".next/standalone" ]; then
        if [ -d ".next/static" ]; then
            echo "Копируем статические файлы в standalone..."
            cp -r .next/static .next/standalone/.next/ 2>/dev/null || true
            echo "✅ Статические файлы скопированы"
        fi
        if [ -d "public" ]; then
            echo "Копируем public директорию в standalone..."
            cp -r public .next/standalone/ 2>/dev/null || true
            echo "✅ Public директория скопирована"
        fi
    fi
    
    echo ""
    echo "=== Запуск приложения через PM2 ==="
    # Проверяем, есть ли standalone build
    if [ -f ".next/standalone/server.js" ]; then
        echo "Используем standalone build..."
        PORT=3000 NODE_ENV=production HOSTNAME=0.0.0.0 pm2 start .next/standalone/server.js --name kreo-it
    else
        echo "Используем npm start..."
        PORT=3000 NODE_ENV=production HOSTNAME=0.0.0.0 pm2 start npm --name kreo-it -- start
    fi
    
    # Сохраняем конфигурацию PM2
    pm2 save
    pm2 startup 2>/dev/null || true
    
    echo ""
    echo "=== Ожидание запуска (15 секунд) ==="
    sleep 15
    
    echo ""
    echo "=== Проверка статуса PM2 ==="
    pm2 status kreo-it
    
    echo ""
    echo "=== Проверка доступности приложения ==="
    for i in {1..10}; do
        if curl -f -s -m 5 http://localhost:3000 > /dev/null 2>&1; then
            echo "✅ Приложение доступно на порту 3000!"
            break
        fi
        echo "Попытка $i/10: ждем..."
        sleep 3
    done
    
    if ! curl -f -s -m 5 http://localhost:3000 > /dev/null 2>&1; then
        echo "⚠️  Приложение не отвечает, проверьте логи:"
        pm2 logs kreo-it --lines 20 --nostream
    fi
    
    echo ""
    echo "=== Настройка Nginx ==="
    
    # Проверяем наличие SSL сертификата
    if [ -f "/etc/letsencrypt/live/kreo.pro/fullchain.pem" ]; then
        echo "✅ SSL сертификат найден, используем полную конфигурацию"
        NGINX_CONF="nginx/kreo.pro.conf"
    else
        echo "⚠️  SSL сертификат не найден, используем временную конфигурацию (HTTP)"
        NGINX_CONF="nginx/kreo.pro.conf.temp"
        
        # Создаем временную конфигурацию если её нет
        if [ ! -f "$NGINX_CONF" ]; then
            echo "Создание временной конфигурации..."
            cat > /tmp/kreo.pro.conf.temp << 'NGINX_TEMP'
server {
    listen 80;
    server_name kreo.pro www.kreo.pro;

    location / {
        proxy_pass http://127.0.0.1:3000;
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
NGINX_TEMP
            NGINX_CONF="/tmp/kreo.pro.conf.temp"
        fi
    fi
    
    # Копируем конфигурацию Nginx
    if [ -f "$NGINX_CONF" ]; then
        echo "Копирование конфигурации Nginx..."
        sudo cp "$NGINX_CONF" /etc/nginx/sites-available/kreo.pro
        sudo rm -f /etc/nginx/sites-enabled/kreo.pro
        sudo ln -sf /etc/nginx/sites-available/kreo.pro /etc/nginx/sites-enabled/kreo.pro
        
        # Проверяем конфигурацию
        if sudo nginx -t 2>/dev/null; then
            echo "✅ Конфигурация Nginx валидна"
            sudo systemctl restart nginx
            echo "✅ Nginx перезапущен"
        else
            echo "⚠️  Ошибка в конфигурации Nginx"
            sudo nginx -t
        fi
    else
        echo "⚠️  Конфигурация Nginx не найдена"
    fi
    
    # Инструкции по установке SSL
    if [ ! -f "/etc/letsencrypt/live/kreo.pro/fullchain.pem" ]; then
        echo ""
        echo "=== Инструкции по установке SSL ==="
        echo "После настройки DNS выполните на сервере:"
        echo "  sudo apt install certbot python3-certbot-nginx -y"
        echo "  sudo certbot --nginx -d kreo.pro -d www.kreo.pro"
        echo ""
        echo "Или вручную:"
        echo "  sudo certbot certonly --standalone -d kreo.pro -d www.kreo.pro"
        echo "  sudo cp nginx/kreo.pro.conf /etc/nginx/sites-available/kreo.pro"
        echo "  sudo nginx -t && sudo systemctl restart nginx"
    fi
    
    echo ""
    echo "=== Финальная проверка ==="
    echo "Статус PM2:"
    pm2 status kreo-it
    
    echo ""
    echo "Последние логи:"
    pm2 logs kreo-it --lines 10 --nostream
EOF

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка деплоя на сервере${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Деплой успешно завершен!${NC}"
echo ""
echo -e "${YELLOW}📋 Информация:${NC}"
echo "   Репозиторий: $GIT_REPO_URL"
echo "   Ветка: $BRANCH"
echo "   Сервер: $SERVER_USER@$SERVER_HOST"
echo "   Путь: $DEPLOY_PATH"
echo ""
echo -e "${YELLOW}🌐 Сайт должен быть доступен по адресу:${NC}"
echo "   https://kreo.pro"
echo ""
echo -e "${BLUE}💡 Полезные команды для проверки:${NC}"
echo "   ssh -i $SERVER_SSH_KEY -p $SERVER_PORT $SERVER_USER@$SERVER_HOST 'cd $DEPLOY_PATH && pm2 status'"
echo "   ssh -i $SERVER_SSH_KEY -p $SERVER_PORT $SERVER_USER@$SERVER_HOST 'cd $DEPLOY_PATH && pm2 logs kreo-it'"
echo ""
