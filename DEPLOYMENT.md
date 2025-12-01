# Руководство по деплою Kreo IT

## 🎯 Обзор

Проект деплоится на два домена:
- **test.kreo.pro** - тестовое окружение
- **kreo.pro** - продакшен окружение

## 📋 Варианты деплоя

### Вариант 1: VPS сервер с Docker (Рекомендуется)

#### Требования
- VPS сервер (Ubuntu 20.04+)
- Docker и Docker Compose установлены
- Домены настроены и указывают на сервер
- SSL сертификаты (Let's Encrypt)

#### Структура на сервере
```
/var/www/
├── kreo-it/
│   ├── test/          # test.kreo.pro
│   │   └── dist/
│   └── production/     # kreo.pro
│       └── dist/
└── nginx/
    └── sites-available/
        ├── test.kreo.pro.conf
        └── kreo.pro.conf
```

#### Процесс деплоя
1. GitHub Actions собирает проект
2. Создается Docker образ
3. Образ деплоится на сервер
4. Nginx обновляет конфигурацию
5. Перезапуск контейнеров

### Вариант 2: Статический хостинг (Vercel/Netlify)

#### Плюсы
- Автоматический SSL
- CDN из коробки
- Простой деплой
- Бесплатный план для старта

#### Минусы
- Меньше контроля
- Ограничения для сложных SEO задач

#### Настройка
1. Подключить репозиторий к Vercel/Netlify
2. Настроить переменные окружения
3. Настроить кастомные домены
4. Автоматический деплой при пуше

### Вариант 3: Гибридный (Рекомендуется для масштабирования)

- **Frontend**: Vercel/Netlify для статики
- **Backend API**: Отдельный сервер (когда появится)
- **База данных**: Отдельный сервис

## 🔧 Настройка окружений

### Переменные окружения

#### .env.test (test.kreo.pro)
```env
VITE_APP_ENV=test
VITE_APP_URL=https://test.kreo.pro
VITE_API_URL=https://api-test.kreo.pro
VITE_GA_ID=G-XXXXXXXXXX
```

#### .env.production (kreo.pro)
```env
VITE_APP_ENV=production
VITE_APP_URL=https://kreo.pro
VITE_API_URL=https://api.kreo.pro
VITE_GA_ID=G-YYYYYYYYYY
```

## 🐳 Docker конфигурация

### Dockerfile
```dockerfile
# Multi-stage build для оптимизации
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  test:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: kreo-it-test
    ports:
      - "8080:80"
    volumes:
      - ./dist-test:/usr/share/nginx/html
    environment:
      - NODE_ENV=test

  production:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: kreo-it-production
    ports:
      - "8081:80"
    volumes:
      - ./dist-production:/usr/share/nginx/html
    environment:
      - NODE_ENV=production
```

## 🌐 Nginx конфигурация

### test.kreo.pro.conf
```nginx
server {
    listen 80;
    server_name test.kreo.pro;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name test.kreo.pro;

    ssl_certificate /etc/letsencrypt/live/test.kreo.pro/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/test.kreo.pro/privkey.pem;

    root /var/www/kreo-it/test/dist;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Кеширование
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA роутинг
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### kreo.pro.conf
```nginx
# Аналогично, но для production домена
# Более строгие настройки безопасности
# Более агрессивное кеширование
```

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

#### .github/workflows/deploy-test.yml
```yaml
name: Deploy to Test

on:
  push:
    branches: [ develop, test ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build:test
        env:
          VITE_APP_ENV: test
      - name: Deploy to server
        # SSH deploy или Docker push
```

#### .github/workflows/deploy-production.yml
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build:production
        env:
          VITE_APP_ENV: production
      - name: Deploy to server
        # SSH deploy или Docker push
```

## 📝 Скрипты деплоя

### deploy.sh
```bash
#!/bin/bash
ENV=$1

if [ "$ENV" = "test" ]; then
    npm run build:test
    # Копирование на сервер
elif [ "$ENV" = "production" ]; then
    npm run build:production
    # Копирование на сервер
fi
```

## ✅ Чеклист перед деплоем

- [ ] Переменные окружения настроены
- [ ] SSL сертификаты установлены
- [ ] Домены настроены и указывают на сервер
- [ ] Nginx конфигурация проверена
- [ ] Docker образы собраны
- [ ] Тесты пройдены
- [ ] SEO метатеги проверены
- [ ] Производительность проверена
- [ ] Мобильная версия проверена

## 🔍 Мониторинг после деплоя

1. Проверить доступность сайта
2. Проверить SSL сертификат
3. Проверить скорость загрузки (PageSpeed Insights)
4. Проверить индексацию (Google Search Console)
5. Проверить аналитику (Google Analytics)

