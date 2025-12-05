#!/bin/bash

# Скрипт для добавления SSH ключа на сервер через пароль
# Использование: ./scripts/setup-server-ssh.sh

set -e

# Цвета
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔐 Настройка SSH ключа на сервере${NC}"
echo ""

# Данные сервера
SERVER_HOST="46.149.67.149"
SERVER_USER="root"
SERVER_PASSWORD="bRKSJ8+wuGEi.A"
SSH_KEY_PATH="$HOME/.ssh/kreo_deploy.pub"

# Проверка наличия публичного ключа
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo -e "${RED}❌ Публичный ключ не найден: $SSH_KEY_PATH${NC}"
    exit 1
fi

# Читаем публичный ключ
PUBLIC_KEY=$(cat "$SSH_KEY_PATH")

echo -e "${BLUE}📋 Информация:${NC}"
echo "   Сервер: $SERVER_USER@$SERVER_HOST"
echo "   Ключ: $SSH_KEY_PATH"
echo ""

# Проверяем, установлен ли sshpass
if command -v sshpass &> /dev/null; then
    echo -e "${BLUE}✅ sshpass установлен, используем автоматическое подключение${NC}"
    echo ""
    
    # Добавляем ключ через sshpass
    sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" << EOF
        mkdir -p ~/.ssh
        chmod 700 ~/.ssh
        echo "$PUBLIC_KEY" >> ~/.ssh/authorized_keys
        chmod 600 ~/.ssh/authorized_keys
        echo "✅ SSH ключ добавлен"
EOF
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ SSH ключ успешно добавлен на сервер!${NC}"
        echo ""
        echo -e "${BLUE}🔍 Проверка подключения...${NC}"
        ssh -i "$HOME/.ssh/kreo_deploy" -o ConnectTimeout=5 "$SERVER_USER@$SERVER_HOST" "echo '✅ Подключение по ключу работает!'" 2>&1
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Все готово! Теперь можно использовать:${NC}"
            echo "   npm run deploy"
        fi
    else
        echo -e "${RED}❌ Ошибка при добавлении ключа${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  sshpass не установлен${NC}"
    echo ""
    echo "Установите sshpass для автоматического подключения:"
    echo "   brew install hudochenkov/sshpass/sshpass  # macOS"
    echo "   или"
    echo "   sudo apt install sshpass  # Linux"
    echo ""
    echo "Или выполните вручную через веб-консоль:"
    echo ""
    echo "ssh $SERVER_USER@$SERVER_HOST"
    echo "# Введите пароль: $SERVER_PASSWORD"
    echo ""
    echo "mkdir -p ~/.ssh"
    echo "chmod 700 ~/.ssh"
    echo "echo '$PUBLIC_KEY' >> ~/.ssh/authorized_keys"
    echo "chmod 600 ~/.ssh/authorized_keys"
    exit 1
fi

