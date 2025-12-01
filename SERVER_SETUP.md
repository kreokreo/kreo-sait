# Руководство по настройке VPS сервера

## 📋 Требования

- VPS сервер (Ubuntu 20.04+ или Debian 11+)
- Минимум 1GB RAM, 10GB диска
- Root доступ или sudo права
- Домены настроены и указывают на IP сервера

## 🚀 Быстрая настройка

### 1. Подключение к серверу

```bash
ssh root@your-server-ip
```

### 2. Запуск скрипта настройки

```bash
# Скачать и запустить скрипт
curl -fsSL https://raw.githubusercontent.com/your-repo/kreo-it/main/scripts/setup-server.sh | bash

# Или вручную:
bash scripts/setup-server.sh
```

### 3. Настройка DNS

Убедитесь, что DNS записи настроены:
- `test.kreo.pro` → A запись на IP сервера
- `kreo.pro` → A запись на IP сервера
- `www.kreo.pro` → CNAME на `kreo.pro`

### 4. Получение SSL сертификатов

```bash
# Для тестового домена
certbot --nginx -d test.kreo.pro

# Для продакшен домена
certbot --nginx -d kreo.pro -d www.kreo.pro
```

Certbot автоматически настроит Nginx для HTTPS.

### 5. Настройка Nginx

```bash
# Копируем конфигурации
cp docker/nginx-test.conf /etc/nginx/sites-available/test.kreo.pro
cp docker/nginx-production.conf /etc/nginx/sites-available/kreo.pro

# Создаем симлинки
ln -s /etc/nginx/sites-available/test.kreo.pro /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/kreo.pro /etc/nginx/sites-enabled/

# Проверяем конфигурацию
nginx -t

# Перезапускаем Nginx
systemctl reload nginx
```

### 6. Настройка GitHub Secrets

В настройках репозитория GitHub добавьте Secrets:

**Для тестового окружения:**
- `TEST_SERVER_HOST` - IP или домен сервера
- `TEST_SERVER_USER` - пользователь для SSH (обычно root)
- `TEST_SERVER_SSH_KEY` - приватный SSH ключ
- `TEST_SERVER_PORT` - порт SSH (обычно 22)

**Для продакшен окружения:**
- `PRODUCTION_SERVER_HOST` - IP или домен сервера
- `PRODUCTION_SERVER_USER` - пользователь для SSH
- `PRODUCTION_SERVER_SSH_KEY` - приватный SSH ключ
- `PRODUCTION_SERVER_PORT` - порт SSH

**Опционально (для Docker Hub):**
- `DOCKER_USERNAME` - логин Docker Hub
- `DOCKER_PASSWORD` - пароль Docker Hub

### 7. Первый деплой

#### Через GitHub Actions (рекомендуется):
1. Запушьте код в `develop` branch для тестового деплоя
2. Запушьте код в `main` branch для продакшен деплоя

#### Вручную:
```bash
# На локальной машине
./scripts/deploy.sh test

# Скопировать файлы на сервер
scp kreo-it-test.tar.gz docker-compose.yml docker/nginx-test.conf user@server:/opt/kreo-it/

# На сервере
cd /opt/kreo-it
docker load < kreo-it-test.tar.gz
docker-compose up -d test
```

## 🔧 Структура на сервере

```
/opt/kreo-it/
├── docker-compose.yml
├── nginx-test.conf
├── nginx-production.conf
├── kreo-it-test.tar.gz
├── kreo-it-production.tar.gz
└── backup-*.tar (бэкапы)

/var/www/kreo-it/
├── test/
│   └── dist/          # Статика для test.kreo.pro (если не используем Docker)
└── production/
    └── dist/          # Статика для kreo.pro (если не используем Docker)

/etc/nginx/
├── sites-available/
│   ├── test.kreo.pro.conf
│   └── kreo.pro.conf
└── sites-enabled/
    ├── test.kreo.pro.conf -> ../sites-available/test.kreo.pro.conf
    └── kreo.pro.conf -> ../sites-available/kreo.pro.conf
```

## 🔍 Проверка работоспособности

### Проверка Docker контейнеров
```bash
docker ps
docker logs kreo-it-test
docker logs kreo-it-production
```

### Проверка Nginx
```bash
nginx -t
systemctl status nginx
```

### Проверка сайтов
```bash
curl http://localhost:8080/health  # Тестовый
curl http://localhost:8081/health  # Продакшен
```

### Проверка SSL
```bash
curl -I https://test.kreo.pro
curl -I https://kreo.pro
```

## 🔄 Обновление

### Автоматическое (через GitHub Actions)
Просто запушьте изменения в соответствующий branch.

### Ручное обновление
```bash
cd /opt/kreo-it
git pull  # Если используете git на сервере
docker-compose pull
docker-compose up -d
```

## 🛠️ Устранение неполадок

### Контейнер не запускается
```bash
docker logs kreo-it-test
docker-compose logs test
```

### Nginx ошибки
```bash
tail -f /var/log/nginx/error.log
nginx -t
```

### Проблемы с SSL
```bash
certbot certificates
certbot renew --dry-run
```

### Очистка Docker
```bash
docker system prune -a
docker volume prune
```

## 📊 Мониторинг

### Логи
```bash
# Docker логи
docker-compose logs -f

# Nginx логи
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Ресурсы
```bash
docker stats
df -h
free -h
```

## 🔐 Безопасность

1. **Firewall**: Настройте UFW
```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

2. **SSH**: Отключите вход по паролю, используйте ключи
3. **Обновления**: Регулярно обновляйте систему
4. **Мониторинг**: Настройте алерты на сбои

## 📞 Поддержка

При возникновении проблем проверьте:
1. Логи Docker контейнеров
2. Логи Nginx
3. Статус сервисов
4. DNS настройки
5. SSL сертификаты

