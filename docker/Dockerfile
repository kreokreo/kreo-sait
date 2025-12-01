# Multi-stage build для оптимизации размера образа

# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production=false

# Копируем исходный код
COPY . .

# Собираем приложение
# Режим определяется через build arg
ARG BUILD_MODE=production
ENV NODE_ENV=production
ENV VITE_APP_ENV=production
ENV VITE_APP_URL=https://kreo.pro
ENV VITE_API_URL=https://api.kreo.pro
RUN npm run build:${BUILD_MODE}

# Stage 2: Production
FROM nginx:alpine

# Копируем собранное приложение из builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]

