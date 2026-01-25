# Руководство по развертыванию для сравнения TTM

Для более реалистичного сравнения TTM рекомендуется развернуть оба проекта на облачных платформах. Это позволит учесть:
- Время сборки на удаленном сервере
- Время деплоя
- Время распространения CDN
- Реальные задержки сети

## Варианты развертывания

### Вариант 1: Railway (Рекомендуется для этого проекта) ⭐

**Почему Railway:**
- ✅ Поддержка docker-compose - можно задеплоить весь проект одной командой
- ✅ Автоматическая настройка внутренней сети между сервисами
- ✅ Проще настройка переменных окружения
- ✅ Быстрее начать работу

**Подробное сравнение:** См. [PLATFORM_COMPARISON.md](PLATFORM_COMPARISON.md)

**Преимущества:**
- Бесплатный тариф ($5 кредитов в месяц)
- Поддержка Docker и docker-compose
- Автоматический деплой из GitHub
- Простое управление

**Шаги:**

1. **Подготовка репозитория:**
```bash
# Создайте GitHub репозиторий
git init
git remote add origin https://github.com/yourusername/itmo-nir.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. **Развертывание BDUI:**

   a. Зайдите на https://railway.app
   
   b. Создайте новый проект "BDUI Comparison"
   
   c. Добавьте сервисы из GitHub:
      - Выберите репозиторий
      - Для каждого сервиса (backend, bff, frontend, admin) создайте отдельный сервис
      - Или используйте docker-compose (Railway поддерживает)
   
   d. Настройте переменные окружения:
      ```
      Backend:
      - PORT=3001
      
      BFF:
      - PORT=3002
      - BACKEND_URL=${{Backend.PUBLIC_URL}}
      
      Frontend:
      - REACT_APP_BFF_URL=${{BFF.PUBLIC_URL}}
      
      Admin:
      - REACT_APP_BACKEND_URL=${{Backend.PUBLIC_URL}}
      ```
   
   e. Railway автоматически определит порты и создаст публичные URL

3. **Развертывание Classic:**

   a. Создайте новый проект "Classic Comparison"
   
   b. Добавьте сервисы:
      - Backend (порт 3011)
      - Frontend (порт 3010)
   
   c. Настройте переменные:
      ```
      Backend:
      - PORT=3011
      
      Frontend:
      - REACT_APP_BACKEND_URL=${{Backend.PUBLIC_URL}}
      ```

4. **Измерение TTM:**

```bash
# Фиксируем время коммита
echo "BDUI Commit: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" > bdui_deploy_timeline.txt

# Делаем изменения и коммитим
git add .
git commit -m "Test TTM: Change banner text"
git push

# Railway автоматически начнет деплой
# В Railway Dashboard можно видеть время деплоя

# Фиксируем время, когда деплой завершился
echo "BDUI Deploy Complete: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> bdui_deploy_timeline.txt

# Проверяем, что изменения видны
curl https://your-bdui-frontend.railway.app
echo "BDUI Visible: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> bdui_deploy_timeline.txt
```

---

### Вариант 2: Vercel + Railway (Гибридный)

**Схема:**
- Frontend на Vercel (бесплатно, быстрый CDN)
- Backend на Railway (бесплатный тариф)

**Преимущества:**
- Vercel оптимизирован для React
- Быстрое распространение через CDN
- Простая настройка

**Шаги:**

1. **Backend на Railway:**
   - Как в варианте 1
   - Получите публичный URL бэкенда

2. **Frontend на Vercel:**

   a. Установите Vercel CLI:
   ```bash
   npm i -g vercel
   ```

   b. В папке фронтенда:
   ```bash
   cd bdui/frontend
   vercel
   ```

   c. Настройте переменные окружения в Vercel Dashboard:
   ```
   REACT_APP_BFF_URL=https://your-bff.railway.app
   ```

   d. Подключите GitHub для автоматического деплоя

3. **Измерение TTM:**
```bash
# Коммит
git commit -m "Test TTM"
git push

# Vercel автоматически начнет деплой
# Время деплоя видно в Vercel Dashboard

# Фиксируем время
echo "Vercel Deploy Start: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> timeline.txt
# Ждем завершения деплоя
echo "Vercel Deploy Complete: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> timeline.txt
```

---

### Вариант 3: Render (Альтернатива Railway)

**Преимущества Render:**
- ✅ Полностью бесплатный тариф (больше ресурсов)
- ✅ Отличная документация
- ✅ Стабильная платформа

**Недостатки:**
- ❌ Нет поддержки docker-compose - нужно создавать отдельные сервисы
- ❌ Больше ручной настройки

**Подробная инструкция:** См. [PLATFORM_COMPARISON.md](PLATFORM_COMPARISON.md) (раздел "Пошаговая инструкция для Render")

**Преимущества:**
- Бесплатный тариф
- Поддержка Docker
- Автоматический деплой из GitHub

**Шаги:**

1. Зайдите на https://render.com
2. Создайте Web Service для каждого сервиса
3. Подключите GitHub репозиторий
4. Настройте:
   - Build Command: `docker compose build`
   - Start Command: `docker compose up`
   - Или используйте отдельные сервисы

---

### Вариант 4: Локальный + GitHub Actions (Для сравнения)

Можно настроить CI/CD через GitHub Actions для автоматического деплоя:

**`.github/workflows/deploy-bdui.yml`:**
```yaml
name: Deploy BDUI

on:
  push:
    branches: [ main ]
    paths:
      - 'bdui/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Docker
        uses: docker/setup-buildx-action@v2
      
      - name: Build and deploy
        run: |
          cd bdui
          docker compose build
          # Здесь можно добавить деплой на Railway/Render через их CLI
      
      - name: Record deploy time
        run: |
          echo "Deploy completed at $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> deploy_log.txt
```

---

## Рекомендуемая схема для сравнения TTM

### Для BDUI:

1. **Изменение через админ-панель (без деплоя):**
   - TTM = время от сохранения в админке до появления на сайте
   - ~0-2 минуты (только обновление данных в БД)

2. **Изменение через код (с деплоем):**
   - TTM = время от коммита до появления на сайте
   - Включает: сборку, деплой, распространение CDN
   - ~5-15 минут (Railway/Vercel)

### Для Classic:

1. **Изменение через код (с деплоем):**
   - TTM = время от коммита до появления на сайте
   - Включает: сборку фронтенда, деплой, распространение CDN
   - ~10-20 минут (Railway/Vercel)

---

## Методика измерения TTM на облаке

### Шаг 1: Настройка мониторинга

Создайте скрипт для автоматического измерения:

**`scripts/measure_ttm.sh`:**
```bash
#!/bin/bash

APP_URL=$1
CHANGE_DESCRIPTION=$2

echo "=== TTM Measurement: $CHANGE_DESCRIPTION ==="
echo "Start time: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" > ttm_log.txt

# Делаем изменения
git add .
git commit -m "$CHANGE_DESCRIPTION"
git push

START_TIME=$(date +%s)
echo "Commit pushed at: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> ttm_log.txt

# Ждем деплоя (проверяем каждые 10 секунд)
while true; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $APP_URL)
  if [ "$HTTP_CODE" == "200" ]; then
    # Проверяем, что изменения применились
    # (можно проверять конкретный контент)
    if curl -s $APP_URL | grep -q "новый текст"; then
      END_TIME=$(date +%s)
      TTM=$((END_TIME - START_TIME))
      echo "Changes visible at: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> ttm_log.txt
      echo "TTM: ${TTM} seconds ($(($TTM / 60)) minutes)" >> ttm_log.txt
      break
    fi
  fi
  sleep 10
done
```

### Шаг 2: Использование API платформ

Многие платформы предоставляют API для мониторинга деплоев:

**Railway API:**
```bash
# Получить статус деплоя
curl -H "Authorization: Bearer $RAILWAY_TOKEN" \
  https://api.railway.app/v1/deployments

# Получить время деплоя
DEPLOY_TIME=$(curl -s -H "Authorization: Bearer $RAILWAY_TOKEN" \
  https://api.railway.app/v1/deployments | jq '.createdAt')
```

**Vercel API:**
```bash
# Получить статус деплоя
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  https://api.vercel.com/v6/deployments

# Получить время деплоя
DEPLOY_TIME=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  https://api.vercel.com/v6/deployments | jq '.createdAt')
```

---

## Сравнительная таблица платформ

| Платформа | Бесплатный тариф | Docker | Автодеплой | Скорость деплоя | Рекомендация |
|-----------|------------------|--------|------------|-----------------|--------------|
| Railway | $5/мес кредиты | ✅ | ✅ | Средняя | ⭐ Лучший выбор |
| Vercel | ✅ | ❌ | ✅ | Быстрая | Для фронтенда |
| Render | ✅ | ✅ | ✅ | Средняя | Альтернатива Railway |
| Fly.io | ✅ | ✅ | ✅ | Быстрая | Хорошо для Docker |
| DigitalOcean | ❌ | ✅ | ✅ | Средняя | Платно |

---

## Рекомендуемый план действий

1. **Создайте GitHub репозиторий** (если еще нет)

2. **Разверните BDUI на Railway:**
   - Используйте docker-compose или отдельные сервисы
   - Настройте переменные окружения
   - Получите публичные URL

3. **Разверните Classic на Railway:**
   - Аналогично BDUI
   - Отдельный проект

4. **Настройте автоматический деплой:**
   - Подключите GitHub к Railway
   - При каждом push будет автоматический деплой

5. **Проведите измерения:**
   - S1: Изменение через админ-панель (BDUI) vs изменение кода (Classic)
   - S1.5: Создание новой страницы
   - Фиксируйте время коммита, деплоя, появления изменений

6. **Сравните результаты:**
   - BDUI (админ-панель): 0-2 минуты
   - BDUI (код): 5-15 минут
   - Classic (код): 10-20 минут

---

## Пример конфигурации для Railway

**`railway.json` (для BDUI):**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "bdui/docker-compose.yml"
  },
  "deploy": {
    "startCommand": "docker compose up",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Или создайте отдельные сервисы для каждого компонента.

---

## Дополнительные метрики

При развертывании на облаке можно также измерить:

1. **Время сборки (Build Time):**
   - Railway/Vercel показывают время сборки в логах

2. **Время деплоя (Deploy Time):**
   - От завершения сборки до доступности

3. **Время распространения (CDN Propagation):**
   - От деплоя до доступности во всех регионах

4. **Общее TTM:**
   - От коммита до появления изменений у пользователей

---

## Автоматизация измерений

Создайте GitHub Action для автоматического измерения:

**`.github/workflows/measure-ttm.yml`:**
```yaml
name: Measure TTM

on:
  workflow_dispatch:
    inputs:
      test_scenario:
        description: 'Test scenario (S1, S1.5)'
        required: true

jobs:
  measure:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Record start time
        run: |
          echo "START_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> $GITHUB_ENV
      
      - name: Trigger deploy
        run: |
          # Делаем тестовое изменение
          echo "Test change for ${{ github.event.inputs.test_scenario }}" >> test.txt
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add test.txt
          git commit -m "TTM test: ${{ github.event.inputs.test_scenario }}"
          git push
      
      - name: Wait for deploy
        run: |
          # Ждем деплоя и проверяем доступность
          # Используйте API платформы для проверки статуса
      
      - name: Record end time
        run: |
          echo "END_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> $GITHUB_ENV
          echo "TTM: $((($END_TIME - $START_TIME) / 60)) minutes"
```

---

## Выводы

Для наиболее реалистичного сравнения TTM рекомендуется:

1. ✅ Развернуть оба проекта на Railway (или аналогичной платформе)
2. ✅ Настроить автоматический деплой из GitHub
3. ✅ Измерять время от коммита до появления изменений
4. ✅ Учесть разницу между изменением через админ-панель (BDUI) и через код

Это даст более точные результаты, чем локальное сравнение, и покажет реальные преимущества BDUI в скорости доставки изменений.
