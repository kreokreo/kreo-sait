#!/bin/bash

# Скрипт для коммита и пуша изменений в Git
# Использование: ./scripts/git-push.sh [описание изменений] [ветка]

set -e

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📝 Git Push - Коммит и пуш изменений${NC}"
echo ""

# Проверка, что мы в git репозитории
if [ ! -d .git ]; then
    echo -e "${RED}❌ Ошибка: это не git репозиторий${NC}"
    exit 1
fi

# Получаем описание коммита
if [ -z "$1" ]; then
    echo -e "${YELLOW}Введите описание изменений:${NC}"
    read -r COMMIT_MSG
else
    COMMIT_MSG="$1"
fi

if [ -z "$COMMIT_MSG" ]; then
    echo -e "${RED}❌ Ошибка: описание изменений не может быть пустым${NC}"
    exit 1
fi

# Получаем ветку
if [ -z "$2" ]; then
    BRANCH=$(git branch --show-current)
    if [ -z "$BRANCH" ]; then
        BRANCH="main"
    fi
else
    BRANCH="$2"
fi

echo -e "${BLUE}📋 Информация:${NC}"
echo "   Ветка: $BRANCH"
echo "   Описание: $COMMIT_MSG"
echo ""

# Проверяем, есть ли изменения
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Нет изменений для коммита${NC}"
    exit 0
fi

# Показываем изменения
echo -e "${BLUE}📊 Изменения:${NC}"
git status --short
echo ""

# Подтверждение
echo -e "${YELLOW}Продолжить? (y/n):${NC}"
read -r CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo -e "${YELLOW}Отменено${NC}"
    exit 0
fi

# Добавляем все изменения
echo -e "${BLUE}📦 Добавление изменений...${NC}"
git add -A

# Коммит
echo -e "${BLUE}💾 Создание коммита...${NC}"
git commit -m "$COMMIT_MSG"

# Проверяем, существует ли ветка на удаленном репозитории
if git ls-remote --heads origin "$BRANCH" | grep -q "$BRANCH"; then
    echo -e "${BLUE}📤 Отправка изменений в ветку $BRANCH...${NC}"
    git push origin "$BRANCH"
else
    echo -e "${BLUE}📤 Создание новой ветки $BRANCH на удаленном репозитории...${NC}"
    git push -u origin "$BRANCH"
fi

echo ""
echo -e "${GREEN}✅ Изменения успешно отправлены в Git!${NC}"
echo ""
echo -e "${YELLOW}📋 Информация:${NC}"
echo "   Ветка: $BRANCH"
echo "   Коммит: $(git rev-parse --short HEAD)"
echo "   URL: $(git remote get-url origin)"
echo ""

