# Multi-stage build для Next.js

# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Копируем зависимости из deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Переменные окружения для сборки
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Собираем Next.js приложение
# Включаем standalone режим для оптимизации
RUN npm run build

# Проверяем, что standalone build создан
RUN ls -la .next/standalone 2>&1 || (echo "ERROR: .next/standalone не найден!" && ls -la .next/ && exit 1)
RUN ls -la .next/standalone/server.js 2>&1 || (echo "ERROR: server.js не найден в standalone!" && ls -la .next/standalone/ && exit 1)

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Создаем пользователя без root прав
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем standalone build из builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Проверяем, что все файлы на месте
RUN ls -la && \
    if [ ! -f server.js ]; then \
      echo "ERROR: server.js не найден после копирования!" && \
      ls -la && \
      exit 1; \
    fi && \
    echo "✅ server.js найден"

# Устанавливаем правильные права
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

# Проверяем наличие server.js перед запуском и выводим информацию
CMD ["sh", "-c", "echo '=== Запуск Next.js приложения ===' && \
     echo 'Рабочая директория:' && pwd && \
     echo 'Содержимое /app:' && ls -la && \
     echo 'Проверка server.js:' && \
     if [ -f server.js ]; then \
       echo '✅ server.js найден, запускаем...' && \
       node server.js; \
     else \
       echo '❌ ERROR: server.js not found!' && \
       echo 'Содержимое директории:' && \
       ls -la && \
       echo 'Поиск server.js:' && \
       find . -name 'server.js' 2>/dev/null || echo 'server.js не найден' && \
       exit 1; \
     fi"]
