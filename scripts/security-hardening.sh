#!/bin/bash

# Скрипт для настройки базовой защиты от уязвимостей Next.js
# Использование: ./scripts/security-hardening.sh

set -e

echo "🔒 Настройка базовой защиты сервера"

# Загрузка переменных из .env.deploy
if [ -f .env.deploy ]; then
    source .env.deploy
    echo "✅ Переменные загружены из .env.deploy"
else
    echo "❌ Файл .env.deploy не найден!"
    exit 1
fi

SERVER_USER=$(echo $SERVER | cut -d'@' -f1)
SERVER_HOST=$(echo $SERVER | cut -d'@' -f2 | cut -d':' -f1)
SERVER_PORT=$(echo $SERVER | cut -d':' -f2)

echo "📋 Параметры сервера:"
echo "   Пользователь: $SERVER_USER"
echo "   Хост: $SERVER_HOST"
echo "   Порт: $SERVER_PORT"

# Проверка SSH подключения
echo "🔌 Проверка SSH подключения..."
if ssh -i ~/.ssh/kreo_deploy -o ConnectTimeout=5 $SERVER "echo 'OK'" > /dev/null 2>&1; then
    echo "✅ SSH подключение успешно"
else
    echo "❌ Не удалось подключиться к серверу"
    exit 1
fi

echo "🔒 Настройка файрвола (UFW)..."

ssh -i ~/.ssh/kreo_deploy $SERVER << 'ENDSSH'
set -e

# Установка UFW
if ! command -v ufw &> /dev/null; then
    echo "📦 Установка UFW..."
    apt update && apt install -y ufw
fi

# Настройка правил по умолчанию
echo "🔧 Настройка правил файрвола..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Разрешение необходимых портов
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# Блокировка известных вредоносных IP
echo "🚫 Блокировка вредоносных IP..."
ufw deny out to 176.65.148.246 comment 'Malicious IP 1'
ufw deny out to 194.41.112.90 comment 'Malicious IP 2'

# Включение файрвола
ufw --force enable

echo "✅ Файрвол настроен:"
ufw status numbered
ENDSSH

echo "🛡️ Настройка Fail2ban..."

ssh -i ~/.ssh/kreo_deploy $SERVER << 'ENDSSH'
set -e

# Установка Fail2ban
if ! command -v fail2ban-client &> /dev/null; then
    echo "📦 Установка Fail2ban..."
    apt update && apt install -y fail2ban
fi

# Создание локальной конфигурации
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
destemail = root@localhost
sendername = Fail2Ban
action = %(action_)s

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s
maxretry = 3
bantime = 7200

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
findtime = 600
bantime = 3600
EOF

# Создание фильтра для Nginx
cat > /etc/fail2ban/filter.d/nginx-limit-req.conf << 'EOF'
[Definition]
failregex = limiting requests, excess:.* by zone.*client: <HOST>
ignoreregex =
EOF

# Перезапуск Fail2ban
systemctl restart fail2ban
systemctl enable fail2ban

echo "✅ Fail2ban настроен:"
fail2ban-client status
ENDSSH

echo "📊 Настройка базового мониторинга..."

ssh -i ~/.ssh/kreo_deploy $SERVER << 'ENDSSH'
set -e

# Создание скрипта мониторинга майнеров
cat > /usr/local/bin/check-miners.sh << 'SCRIPT'
#!/bin/bash
# Скрипт для проверки на майнеры

SUSPICIOUS_PROCESSES=$(ps aux | grep -E 'minerd|xmrig|cpuminer|stratum|mining|monero|bitcoin|nicehash|docker-daemon|fghgf|rae4olw' | grep -v grep)

if [ -n "$SUSPICIOUS_PROCESSES" ]; then
    echo "⚠️ Обнаружены подозрительные процессы:"
    echo "$SUSPICIOUS_PROCESSES"
    # Можно добавить отправку уведомления
    exit 1
else
    echo "✅ Подозрительных процессов не обнаружено"
    exit 0
fi
SCRIPT

chmod +x /usr/local/bin/check-miners.sh

# Добавление в cron для ежедневной проверки
(crontab -l 2>/dev/null | grep -v check-miners.sh; echo "0 2 * * * /usr/local/bin/check-miners.sh >> /var/log/miner-check.log 2>&1") | crontab -

echo "✅ Мониторинг настроен"
ENDSSH

echo ""
echo "✅ Базовая защита настроена!"
echo ""
echo "📝 Выполнено:"
echo "   ✅ Файрвол (UFW) настроен и включен"
echo "   ✅ Вредоносные IP заблокированы"
echo "   ✅ Fail2ban установлен и настроен"
echo "   ✅ Базовый мониторинг майнеров настроен"
echo ""
echo "🔍 Проверка:"
echo "   - Файрвол: ssh -i ~/.ssh/kreo_deploy $SERVER 'ufw status'"
echo "   - Fail2ban: ssh -i ~/.ssh/kreo_deploy $SERVER 'fail2ban-client status'"
echo "   - Мониторинг: ssh -i ~/.ssh/kreo_deploy $SERVER '/usr/local/bin/check-miners.sh'"

