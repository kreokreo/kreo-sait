# Инструкция по деплою проекта KREO

## Вариант 1: Деплой на Vercel (Рекомендуется)

### Шаги:

1. **Авторизация в Vercel:**
   ```bash
   vercel login
   ```

2. **Деплой в production:**
   ```bash
   vercel --prod --yes
   ```

3. **Проверка деплоя:**
   После успешного деплоя вы получите URL вида: `https://your-project.vercel.app`

### Настройка домена:
- В панели Vercel добавьте свой домен (например, `kreo.pro`)
- Настройте DNS записи согласно инструкциям Vercel

---

## Вариант 2: Деплой через GitHub Actions

### Требования:
- Настроенные GitHub Secrets:
  - `PRODUCTION_SERVER_HOST`
  - `PRODUCTION_SERVER_USER`
  - `PRODUCTION_SERVER_SSH_KEY`
  - `PRODUCTION_SERVER_PORT` (опционально)

### Шаги:

1. **Закоммитьте изменения:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Автоматический деплой:**
   - GitHub Actions автоматически запустит деплой при пуше в `main`
   - Проверьте статус в разделе "Actions" на GitHub

---

## Вариант 3: Ручной деплой на сервер

### Использование скрипта:

```bash
./scripts/deploy.sh
```

### Ручные шаги:

1. **Сборка проекта:**
   ```bash
   npm run build
   ```

2. **Сборка Docker образа:**
   ```bash
   docker build --build-arg BUILD_MODE=production -t kreo-it:production .
   ```

3. **Сохранение образа:**
   ```bash
   docker save kreo-it:production | gzip > kreo-it-production.tar.gz
   ```

4. **Копирование на сервер:**
   ```bash
   scp kreo-it-production.tar.gz docker-compose.yml user@server:/opt/kreo-it/
   ```

5. **На сервере:**
   ```bash
   cd /opt/kreo-it
   docker load < kreo-it-production.tar.gz
   docker-compose stop landing
   docker-compose rm -f landing
   docker-compose up -d landing
   ```

---

## Проверка работоспособности

После деплоя проверьте:
- ✅ Сайт открывается
- ✅ Все страницы загружаются
- ✅ Изображения отображаются
- ✅ Spline анимации работают
- ✅ Формы отправляются

---

## Откат (Rollback)

### Vercel:
- В панели Vercel можно откатить к предыдущей версии

### GitHub Actions:
- Откат происходит автоматически при ошибке деплоя

### Ручной откат:
```bash
cd /opt/kreo-it
LATEST_BACKUP=$(ls -t backup-*.tar | head -1)
docker load < $LATEST_BACKUP
docker-compose up -d landing
```

