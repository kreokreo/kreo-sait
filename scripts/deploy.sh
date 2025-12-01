#!/bin/bash

# Скрипт для ручного деплоя на сервер
# Использование: ./scripts/deploy.sh

set -e

echo "🚀 Начинаем деплой в продакшен окружение"

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Шаг 1: Сборка
echo -e "${BLUE}📦 Шаг 1: Сборка проекта...${NC}"
npm run build:production
IMAGE_TAG="kreo-it:production"
BUILD_MODE="production"

# Шаг 2: Сборка Docker образа
echo -e "${BLUE}🐳 Шаг 2: Сборка Docker образа...${NC}"
docker build --build-arg BUILD_MODE=$BUILD_MODE -t $IMAGE_TAG .

# Шаг 3: Сохранение образа
echo -e "${BLUE}💾 Шаг 3: Сохранение образа...${NC}"
docker save $IMAGE_TAG | gzip > kreo-it-production.tar.gz

echo -e "${GREEN}✅ Локальная сборка завершена!${NC}"
echo ""
echo "📋 Следующие шаги для деплоя на сервер:"
echo "1. Скопируйте файлы на сервер:"
echo "   scp kreo-it-production.tar.gz docker-compose.yml docker/nginx-production.conf user@server:/opt/kreo-it/"
echo ""
echo "2. На сервере выполните:"
echo "   cd /opt/kreo-it"
echo "   docker load < kreo-it-production.tar.gz"
echo "   docker-compose stop production"
echo "   docker-compose rm -f production"
echo "   docker-compose up -d production"
echo ""
echo "Или используйте автоматический деплой через GitHub Actions"

