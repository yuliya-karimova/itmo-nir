# Пошаговая инструкция по развертыванию на Railway

## Развертывание обоих проектов (BDUI и Classic)

Да, можно развернуть оба проекта на Railway одновременно! Нужно создать **два отдельных проекта**.

---

## Подготовка

### Шаг 1: Установка Railway CLI

```bash
# Установите Railway CLI
npm i -g @railway/cli

# Или через Homebrew (macOS)
brew install railway

# Проверьте установку
railway --version
```

### Шаг 2: Вход в Railway

```bash
railway login
# Откроется браузер для авторизации
```

### Шаг 3: Подготовка репозитория

```bash
# Убедитесь, что проект в Git
cd /Users/me/mine/itmo/web/itmo-nir
git status

# Если еще не в Git, инициализируйте:
git init
git add .
git commit -m "Initial commit"

# Создайте ОДИН репозиторий на GitHub и подключите:
git remote add origin https://github.com/yourusername/itmo-nir.git
git push -u origin main

# Важно: Один репозиторий содержит обе папки:
# - bdui/
# - classic/
```

**Структура репозитория:**
```
itmo-nir/
├── bdui/              # BDUI проект
│   ├── docker-compose.yml
│   ├── backend/
│   ├── bff/
│   ├── frontend/
│   └── admin/
├── classic/           # Classic проект
│   ├── docker-compose.yml
│   ├── backend/
│   └── frontend/
└── README.md
```

---

## Развертывание BDUI проекта

### Шаг 1: Создание проекта BDUI

**Важно:** Можно использовать один репозиторий для обоих проектов!

**Через веб-интерфейс (рекомендуется):**

1. Зайдите на https://railway.app
2. Нажмите "New Project"
3. Выберите "Deploy from GitHub repo"
4. Выберите ваш репозиторий `itmo-nir`
5. **Настройте Root Directory:**
   - В настройках проекта укажите `bdui/` как корневую папку
   - Railway будет искать docker-compose.yml в папке `bdui/`
6. Назовите проект: "BDUI Comparison"

**Или через CLI:**

```bash
cd bdui

# Инициализация Railway проекта
railway init

# Выберите:
# - Create a new project
# - Название: "BDUI Comparison"
# - Подключите GitHub репозиторий (один и тот же для обоих проектов)
```

### Шаг 2: Настройка переменных окружения

Railway автоматически определит docker-compose.yml, но нужно настроить переменные:

```bash
# Установите переменные для каждого сервиса
railway variables set PORT=3001 --service backend
railway variables set NODE_ENV=production --service backend

railway variables set PORT=3002 --service bff
railway variables set NODE_ENV=production --service bff
railway variables set BACKEND_URL=${{backend.RAILWAY_PRIVATE_URL}} --service bff

railway variables set REACT_APP_BFF_URL=${{bff.RAILWAY_PUBLIC_URL}} --service frontend

railway variables set REACT_APP_BACKEND_URL=${{backend.RAILWAY_PUBLIC_URL}} --service admin
```

**Или через веб-интерфейс:**
1. Зайдите на https://railway.app
2. Откройте проект "BDUI Comparison"
3. Для каждого сервиса (backend, bff, frontend, admin):
   - Откройте вкладку "Variables"
   - Добавьте переменные окружения

### Шаг 3: Деплой BDUI

```bash
# Railway автоматически определит docker-compose.yml
railway up

# Или через веб-интерфейс:
# - Railway автоматически задеплоит при push в GitHub
# - Или нажмите "Deploy" вручную
```

### Шаг 4: Получение URL

```bash
# Получите публичные URL для каждого сервиса
railway domain

# Или через веб-интерфейс:
# - Каждый сервис получит свой URL вида:
#   - backend: https://bdui-backend-production.up.railway.app
#   - bff: https://bdui-bff-production.up.railway.app
#   - frontend: https://bdui-frontend-production.up.railway.app
#   - admin: https://bdui-admin-production.up.railway.app
```

**Важно:** После получения URL нужно обновить переменные окружения:
- Frontend: `REACT_APP_BFF_URL` = URL BFF сервиса
- Admin: `REACT_APP_BACKEND_URL` = URL Backend сервиса
- BFF: `BACKEND_URL` = внутренний URL Backend (используйте `${{backend.RAILWAY_PRIVATE_URL}}`)

---

## Развертывание Classic проекта

### Шаг 1: Создание проекта Classic

**Через веб-интерфейс (рекомендуется):**

1. На Railway Dashboard нажмите "New Project"
2. Выберите "Deploy from GitHub repo"
3. **Выберите тот же репозиторий** `itmo-nir` (тот же, что и для BDUI!)
4. **Настройте Root Directory:**
   - Укажите `classic/` как корневую папку
   - Railway будет искать docker-compose.yml в папке `classic/`
5. Назовите проект: "Classic Comparison"

**Или через CLI:**

```bash
cd ../classic

# Инициализация нового Railway проекта
railway init

# Выберите:
# - Create a new project
# - Название: "Classic Comparison"
# - Подключите тот же GitHub репозиторий (itmo-nir)
# - Это будет отдельный проект, но из того же репозитория!
```

### Шаг 2: Настройка переменных окружения

```bash
# Backend
railway variables set PORT=3011 --service backend
railway variables set NODE_ENV=production --service backend

# Frontend (во время сборки)
railway variables set REACT_APP_BACKEND_URL=${{backend.RAILWAY_PUBLIC_URL}} --service frontend
```

**Через веб-интерфейс:**
1. Откройте проект "Classic Comparison"
2. Настройте переменные для backend и frontend

### Шаг 3: Деплой Classic

```bash
railway up
```

### Шаг 4: Получение URL

```bash
railway domain

# Получите URL:
# - backend: https://classic-backend-production.up.railway.app
# - frontend: https://classic-frontend-production.up.railway.app
```

---

## Важные моменты

### 1. Два отдельных проекта из одного репозитория

✅ **Правильно:**
- **Один репозиторий** на GitHub: `itmo-nir`
- **Проект 1 на Railway:** "BDUI Comparison" → Root Directory: `bdui/`
- **Проект 2 на Railway:** "Classic Comparison" → Root Directory: `classic/`
- Оба проекта используют один и тот же репозиторий, но разные папки

❌ **Неправильно:**
- Один проект Railway с обоими подходами (будет путаница)
- Два отдельных репозитория (не нужно, один репозиторий проще)

### 2. Переменные окружения

**BDUI:**
- Backend и BFF используют внутренние URL через `${{service.RAILWAY_PRIVATE_URL}}`
- Frontend и Admin используют публичные URL через `${{service.RAILWAY_PUBLIC_URL}}`

**Classic:**
- Frontend использует публичный URL Backend

### 3. Порты

Railway автоматически назначает порты, но в docker-compose.yml они указаны для локальной разработки. Railway использует переменную `PORT` из окружения.

### 4. Volumes (данные)

Для хранения данных (pages.json, data.json) Railway предоставляет volumes, но для простоты можно использовать встроенное хранилище или подключить внешнюю БД.

**Временное решение:** Данные будут храниться в контейнере (исчезнут при перезапуске). Для production лучше использовать PostgreSQL или другую БД.

---

## Альтернативный способ: Через веб-интерфейс

### BDUI проект:

1. Зайдите на https://railway.app
2. Нажмите "New Project"
3. Выберите "Deploy from GitHub repo"
4. Выберите репозиторий `itmo-nir` (ваш единственный репозиторий)
5. **Важно:** В настройках проекта укажите **Root Directory: `bdui/`**
   - Это можно сделать в Settings → Source → Root Directory
6. Railway автоматически определит docker-compose.yml в папке `bdui/`
7. Нажмите "Deploy"
8. Railway создаст все 4 сервиса автоматически

**Настройка переменных:**
- Откройте каждый сервис
- Вкладка "Variables"
- Добавьте переменные окружения

### Classic проект:

1. Создайте новый проект "Classic Comparison"
2. Выберите "Deploy from GitHub repo"
3. **Выберите тот же репозиторий** `itmo-nir`
4. **Важно:** В настройках проекта укажите **Root Directory: `classic/`**
5. Railway определит docker-compose.yml в папке `classic/`
6. Нажмите "Deploy"
7. Railway создаст 2 сервиса автоматически

**Итог:**
- ✅ Один репозиторий на GitHub
- ✅ Два проекта на Railway
- ✅ Каждый проект указывает на свою папку

---

## Проверка работы

### BDUI:
```bash
# Проверьте все сервисы
curl https://your-bdui-backend.railway.app/health
curl https://your-bdui-bff.railway.app/health
curl https://your-bdui-frontend.railway.app
curl https://your-bdui-admin.railway.app
```

### Classic:
```bash
curl https://your-classic-backend.railway.app/health
curl https://your-classic-frontend.railway.app
```

---

## Измерение TTM на Railway

### BDUI (через админ-панель):

1. Откройте админ-панель: `https://your-bdui-admin.railway.app`
2. Фиксируем время:
```bash
echo "BDUI Admin Start: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" > ttm_log.txt
```
3. Внесите изменения через админ-панель
4. Сохраните
5. Проверьте фронтенд:
```bash
curl https://your-bdui-frontend.railway.app | grep "новый текст"
echo "BDUI Visible: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> ttm_log.txt
```

**Ожидаемый TTM:** 0-2 минуты (только обновление данных)

### BDUI (через код):

1. Фиксируем время коммита:
```bash
echo "BDUI Commit: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" > ttm_log.txt
```
2. Делаем изменения и пушим:
```bash
git add .
git commit -m "TTM test: Change banner"
git push
```
3. Railway автоматически начнет деплой
4. В Railway Dashboard видно время деплоя
5. Фиксируем время завершения:
```bash
echo "BDUI Deploy Complete: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> ttm_log.txt
```

**Ожидаемый TTM:** 5-15 минут (сборка + деплой)

### Classic (через код):

1. Аналогично BDUI через код
2. Всегда требует деплоя

**Ожидаемый TTM:** 10-20 минут (сборка + деплой)

---

## Управление проектами

### Просмотр статуса:

```bash
# BDUI
cd bdui
railway status

# Classic
cd classic
railway status
```

### Просмотр логов:

```bash
# BDUI
railway logs

# Конкретный сервис
railway logs --service backend
```

### Обновление переменных:

```bash
railway variables set NEW_VAR=value --service service-name
```

### Перезапуск сервиса:

```bash
railway restart --service service-name
```

---

## Стоимость

**Бесплатный тариф Railway:**
- $5 кредитов в месяц
- ~500 часов работы сервисов
- Достаточно для тестирования и сравнения

**Расчет для ваших проектов:**
- BDUI: 4 сервиса × ~10 часов тестирования = 40 часов
- Classic: 2 сервиса × ~10 часов тестирования = 20 часов
- **Итого: ~60 часов** - укладывается в бесплатный тариф

---

## Troubleshooting

### Проблема: Сервисы не видят друг друга

**Решение:**
- Используйте `${{service.RAILWAY_PRIVATE_URL}}` для внутренних связей
- Или используйте внутренние DNS имена (Railway создает их автоматически)

### Проблема: Frontend не может подключиться к Backend

**Решение:**
- Проверьте, что используете `RAILWAY_PUBLIC_URL` для фронтенда
- Убедитесь, что переменные окружения установлены правильно

### Проблема: Данные не сохраняются

**Решение:**
- Railway volumes работают, но для production лучше использовать внешнюю БД
- Для тестирования можно использовать встроенное хранилище

---

## Итоговая структура на Railway

```
Railway Dashboard
├── Проект "BDUI Comparison"
│   ├── backend (порт 3001)
│   ├── bff (порт 3002)
│   ├── frontend (порт 80)
│   └── admin (порт 80)
│
└── Проект "Classic Comparison"
    ├── backend (порт 3011)
    └── frontend (порт 80)
```

Оба проекта работают независимо и не конфликтуют!
