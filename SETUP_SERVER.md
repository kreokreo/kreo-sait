# Настройка нового сервера для деплоя

## Шаг 1: Добавление SSH ключа на сервер

Ваш публичный SSH ключ:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGTDld5sd8GPdxaatC4WO8pz/9Zd9CEvptahN+dLqvXV kreo-deploy-20251205
```

### Вариант 1: Через веб-консоль сервера

1. Откройте веб-консоль сервера в панели управления
2. Войдите как `root` с паролем: `bRKSJ8+wuGEi.A`
3. Выполните команды:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGTDld5sd8GPdxaatC4WO8pz/9Zd9CEvptahN+dLqvXV kreo-deploy-20251205" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Вариант 2: Через SSH с паролем (первый раз)

```bash
ssh root@46.149.67.149
# Введите пароль: bRKSJ8+wuGEi.A

# Затем выполните:
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGTDld5sd8GPdxaatC4WO8pz/9Zd9CEvptahN+dLqvXV kreo-deploy-20251205" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
exit
```

## Шаг 2: Проверка подключения

После добавления ключа проверьте подключение:

```bash
ssh -i ~/.ssh/kreo_deploy root@46.149.67.149 "echo 'SSH работает!'"
```

## Шаг 3: Установка необходимого ПО на сервере

Подключитесь к серверу и выполните:

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Установка Git
apt install -y git

# Установка PM2
npm install -g pm2

# Установка Nginx
apt install -y nginx

# Проверка версий
node --version
npm --version
pm2 --version
```

## Шаг 4: Первый деплой

После настройки сервера выполните:

```bash
npm run deploy
```

## Данные сервера

- **IP**: 46.149.67.149
- **Пользователь**: root
- **SSH ключ**: ~/.ssh/kreo_deploy

**Важно**: После переустановки ОС добавьте SSH ключ через веб-консоль Timeweb или используйте скрипт `./scripts/setup-server-ssh.sh`.

