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

3. **Создайте BFF сервис:**
   - "+ New" → "GitHub Repo"
   - Репозиторий: `itmo-nir`
   - **Root Directory**: `bdui/bff`
   - Variables: 
     - `PORT=3002`
     - `BACKEND_URL=${{backend.RAILWAY_PRIVATE_URL}}`

4. **Создайте Frontend сервис:**
   - "+ New" → "GitHub Repo"
   - Репозиторий: `itmo-nir`
   - **Root Directory**: `bdui/frontend`
   - Variables (Build-time):
     - `REACT_APP_BFF_URL=${{bff.RAILWAY_PUBLIC_URL}}`
   - **Важно:** После деплоя BFF обновите переменную на реальный URL и пересоберите!

5. **Создайте Admin сервис:**
   - "+ New" → "GitHub Repo"
   - Репозиторий: `itmo-nir`
   - **Root Directory**: `bdui/admin`
   - Variables (Build-time):
     - `REACT_APP_BACKEND_URL=${{backend.RAILWAY_PUBLIC_URL}}`

---

## Быстрое решение для Classic

1. **Создайте проект:** "Classic Comparison"

2. **Backend сервис:**
   - Root Directory: `classic/backend`
   - Variables: `PORT=3011`, `NODE_ENV=production`

3. **Frontend сервис:**
   - Root Directory: `classic/frontend`
   - Variables (Build-time): `REACT_APP_BACKEND_URL=${{backend.RAILWAY_PUBLIC_URL}}`

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
