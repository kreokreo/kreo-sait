# Настройка Git и GitHub

## ✅ Текущий статус

- ✅ Git репозиторий инициализирован
- ✅ Git конфигурация настроена (user: kreokreo)
- ✅ Remote origin настроен: `https://github.com/kreokreo/kreo-it.git`
- ✅ Ветка переименована в `main`
- ⚠️ Репозиторий на GitHub еще не создан

## 📋 Следующие шаги

### 1. Создать репозиторий на GitHub

1. Откройте https://github.com/new
2. **Repository name**: `kreo-it`
3. **Description**: `Kreo IT - Landing Page для IT & AI Agency`
4. **Visibility**: Private (рекомендуется) или Public
5. **НЕ** добавляйте README, .gitignore или license (уже есть)
6. Нажмите **"Create repository"**

### 2. Запушить код на GitHub

После создания репозитория выполните:

```bash
# Добавить все файлы
git add .

# Создать коммит
git commit -m "Initial commit: Kreo IT landing page with VPS deployment setup"

# Запушить на GitHub
git push -u origin main
```

### 3. Настроить GitHub Secrets

После пуша настройте Secrets для автоматического деплоя:

**Settings → Secrets and variables → Actions → New repository secret**

Добавьте:
- `PRODUCTION_SERVER_HOST` = `31.130.155.38`
- `PRODUCTION_SERVER_USER` = `root`
- `PRODUCTION_SERVER_SSH_KEY` = (приватный ключ из `~/.ssh/kreo-timeweb`)
- `PRODUCTION_SERVER_PORT` = `22`

### 4. Проверить GitHub Actions

После настройки Secrets:
- Перейдите в **Actions** в GitHub
- Проверьте, что workflow `deploy-production.yml` виден
- При следующем пуше в `main` автоматически запустится деплой

## 🔐 Альтернатива: SSH для GitHub

Если хотите использовать SSH вместо HTTPS:

```bash
# Изменить remote на SSH
git remote set-url origin git@github.com:kreokreo/kreo-it.git

# Проверить
git remote -v
```

Для этого нужен SSH ключ для GitHub (отдельный от ключа для сервера).

## 📝 Текущая конфигурация

```bash
# Проверить remote
git remote -v
# origin  https://github.com/kreokreo/kreo-it.git

# Проверить ветку
git branch
# * main

# Проверить статус
git status
```

## ✅ После создания репозитория

Выполните команды для первого пуша:

```bash
git add .
git commit -m "Initial commit: Kreo IT landing page"
git push -u origin main
```

После этого GitHub Actions автоматически задеплоит проект на сервер при каждом пуше в `main`!

