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

# Устанавливаем правильные права
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

# Проверяем наличие server.js перед запуском
CMD ["sh", "-c", "if [ -f server.js ]; then node server.js; else echo 'ERROR: server.js not found!' && ls -la && exit 1; fi"]
