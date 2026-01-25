# Быстрое решение проблемы "Railpack could not determine how to build"

## Проблема

Railway не может автоматически определить тип проекта и выдает ошибку:
```
⚠ Script start.sh not found
✖ Railpack could not determine how to build the app.
```

## Решение

Railway **не поддерживает docker-compose напрямую**. Нужно создавать **отдельный сервис для каждого компонента**.

---

## Быстрое решение для BDUI

### Вариант 1: Через веб-интерфейс (рекомендуется)

**Важно о публичных доменах:**
- Railway иногда автоматически создает публичный домен, но не всегда
- **Обязательно проверьте** после деплоя каждого сервиса: Settings → Networking → Public Networking
- Если домена нет, нажмите **"Generate Domain"** и укажите порт:
  - **Frontend**: порт `80` (nginx)
  - **Admin**: порт `80` (nginx)
  - **BFF**: порт `3002` (Node.js)
  - **Backend (BDUI)**: порт `3001` (Node.js)
  - **Backend (Classic)**: порт `3011` (Node.js)
- **Frontend, Admin, BFF** - публичный доступ обязателен
- **Backend** - публичный доступ рекомендуется (для Admin)

1. **Создайте проект:**
   - Зайдите на https://railway.app
   - "New Project" → "Empty Project"
   - Название: "BDUI Comparison"

2. **Создайте Backend сервис:**
   - "+ New" → "GitHub Repo"
   - Репозиторий: `itmo-nir`
   - **Root Directory**: `bdui/backend`
   - Railway автоматически определит Dockerfile
   - Variables: `PORT=3001`, `NODE_ENV=production`
   - **После деплоя:** Settings → Networking → "Generate Domain" → **порт `3001`** (рекомендуется, для Admin)

3. **Создайте BFF сервис:**
   - "+ New" → "GitHub Repo"
   - Репозиторий: `itmo-nir`
   - **Root Directory**: `bdui/bff`
   - Variables: 
     - `PORT=3002`
     - `BACKEND_URL=${{backend.RAILWAY_PRIVATE_URL}}`
   - **После деплоя:** Settings → Networking → "Generate Domain" → **порт `3002`** (обязательно!)

4. **Создайте Frontend сервис:**
   - "+ New" → "GitHub Repo"
   - Репозиторий: `itmo-nir`
   - **Root Directory**: `bdui/frontend`
   - Variables (Build-time):
     - `REACT_APP_BFF_URL=${{bff.RAILWAY_PUBLIC_URL}}`
   - **После деплоя:** Settings → Networking → "Generate Domain" → **порт `80`** (обязательно!)
   - **Важно:** После деплоя BFF обновите переменную на реальный URL и пересоберите!

5. **Создайте Admin сервис:**
   - "+ New" → "GitHub Repo"
   - Репозиторий: `itmo-nir`
   - **Root Directory**: `bdui/admin`
   - Variables (Build-time):
     - `REACT_APP_BACKEND_URL=${{backend.RAILWAY_PUBLIC_URL}}`
   - **После деплоя:** Settings → Networking → "Generate Domain" → **порт `80`** (обязательно!)

---

## Быстрое решение для Classic

1. **Создайте проект:** "Classic Comparison"

2. **Backend сервис:**
   - Root Directory: `classic/backend`
   - Variables: `PORT=3011`, `NODE_ENV=production`
   - **После деплоя:** Settings → Networking → "Generate Domain" → **порт `3011`** (обязательно!)

3. **Frontend сервис:**
   - Root Directory: `classic/frontend`
   - Variables (Build-time): `REACT_APP_BACKEND_URL=${{backend.RAILWAY_PUBLIC_URL}}`
   - **После деплоя:** Settings → Networking → "Generate Domain" → **порт `80`** (обязательно!)

---

## Важные моменты

### 1. Root Directory

Для каждого сервиса указывайте путь к папке с Dockerfile:
- Backend: `bdui/backend` или `classic/backend`
- НЕ `bdui/` (корневая папка проекта)

### 2. Переменные окружения для React

React переменные (`REACT_APP_*`) должны быть доступны **во время сборки**.

**Проблема:** Railway может не передать переменные во время build.

**Решение:**
1. Сначала задеплойте Backend/BFF
2. Получите их публичные URL
3. Обновите переменные Frontend/Admin на реальные URL
4. Пересоберите Frontend/Admin (Settings → Redeploy)

### 3. Внутренние URL

Для связи между сервисами используйте:
- `${{service.RAILWAY_PRIVATE_URL}}` - для внутренних связей (BFF → Backend)
- `${{service.RAILWAY_PUBLIC_URL}}` - для фронтенда (Frontend → BFF)

---

## Альтернатива: Использовать Render

Если Railway вызывает проблемы, Render проще для отдельных сервисов:

1. Создайте Web Service для каждого компонента
2. Укажите Root Directory
3. Render автоматически определит Dockerfile
4. Настройте переменные окружения

Подробнее: См. [PLATFORM_COMPARISON.md](PLATFORM_COMPARISON.md)

---

## Где найти публичные URL на Railway

### Способ 1: В интерфейсе Railway (самый простой)

1. Зайдите на https://railway.app
2. Откройте ваш проект (например, "BDUI Comparison")
3. Вы увидите список всех сервисов
4. Для каждого сервиса:
   - Нажмите на сервис (например, "backend")
   - Откройте вкладку **"Settings"**
   - Прокрутите вниз до раздела **"Networking"**
   - Там будет:
     - **Public Domain** - публичный URL (например, `backend-production-xxxx.up.railway.app`)
     - **Private Networking** - внутренний URL (для связи между сервисами)

### Способ 2: Через вкладку "Settings" → "Networking"

1. Откройте сервис
2. Вкладка **"Settings"**
3. Раздел **"Networking"**
4. Там будут:
   - **Public Domain** - публичный URL
   - Можно настроить кастомный домен (опционально)

### Способ 3: В логах деплоя

После успешного деплоя в логах будет строка вида:
```
✓ Deployed to https://backend-production-xxxx.up.railway.app
```

### Способ 4: Через Railway CLI

```bash
# Установите Railway CLI
npm i -g @railway/cli

# Войдите
railway login

# Перейдите в папку сервиса
cd bdui/backend

# Свяжите с проектом
railway link

# Получите URL
railway domain
```

---

## Пример структуры URL

После деплоя BDUI проекта вы получите:

```
Backend:
- Публичный: https://backend-production-xxxx.up.railway.app
- Внутренний: backend.railway.internal:3001

BFF:
- Публичный: https://bff-production-yyyy.up.railway.app
- Внутренний: bff.railway.internal:3002

Frontend:
- Публичный: https://frontend-production-zzzz.up.railway.app

Admin:
- Публичный: https://admin-production-wwww.up.railway.app
```

---

## Как использовать эти URL

### Для переменных окружения:

**BFF → Backend (внутренняя связь):**
```
BACKEND_URL=${{backend.RAILWAY_PRIVATE_URL}}
```
Или вручную:
```
BACKEND_URL=http://backend.railway.internal:3001
```

**Frontend → BFF (публичная связь):**
```
REACT_APP_BFF_URL=https://bff-production-yyyy.up.railway.app
```

**Admin → Backend (публичная связь):**
```
REACT_APP_BACKEND_URL=https://backend-production-xxxx.up.railway.app
```

---

## Проверка работы

После деплоя всех сервисов:

```bash
# Проверьте health endpoints
curl https://your-backend.railway.app/health
curl https://your-bff.railway.app/health

# Проверьте фронтенды
curl https://your-frontend.railway.app
curl https://your-admin.railway.app
```

Если что-то не работает:
1. Проверьте логи: Railway Dashboard → Service → Logs
2. Проверьте переменные окружения
3. Убедитесь, что Root Directory указан правильно
4. Убедитесь, что сервисы задеплоены (статус "Active")