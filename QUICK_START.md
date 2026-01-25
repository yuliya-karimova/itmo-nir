# Быстрый старт для сравнения

Краткая шпаргалка для начала работы.

## 1. Запуск проектов

```bash
# Терминал 1: BDUI
cd bdui
docker compose up --build

# Терминал 2: Classic
cd classic
docker compose up --build
```

**Порты:**
- BDUI: http://localhost:3000 (frontend), http://localhost:3001 (backend), http://localhost:3003 (admin)
- Classic: http://localhost:3010 (frontend), http://localhost:3011 (backend)

## 2. Быстрая проверка работы

```bash
# BDUI
curl http://localhost:3001/health
curl http://localhost:3002/health
open http://localhost:3000

# Classic
curl http://localhost:3011/health
open http://localhost:3010
```

## 3. Первый сценарий (S1: Малая правка)

### BDUI:
1. Откройте http://localhost:3003 (админ-панель)
2. Измените текст кнопки
3. Сохраните
4. Проверьте http://localhost:3000 - изменения видны сразу

### Classic:
1. Отредактируйте `classic/frontend/src/pages/HomePage.js`
2. Измените текст кнопки в коде
3. Пересоберите: `docker compose restart frontend`
4. Проверьте http://localhost:3010

## 4. Измерения

### Трафик (Chrome DevTools):
1. F12 → Network
2. Очистить (Clear)
3. Обновить страницу
4. Сохранить HAR (Right-click → Save all as HAR)

### Производительность (Lighthouse):
```bash
lighthouse http://localhost:3000 --output=json --output-path=results_bdui.json
lighthouse http://localhost:3010 --output=json --output-path=results_classic.json
```

### Ресурсы (Chrome DevTools):
1. F12 → Performance
2. Record → Обновить страницу → Stop
3. Смотреть CPU и Memory графики

## 5. Создание отчета

Следуйте инструкциям в [STEP_BY_STEP_COMPARISON.md](STEP_BY_STEP_COMPARISON.md)

## Полезные команды

```bash
# Логи
docker compose logs -f

# Перезапуск
docker compose restart

# Остановка
docker compose down

# Полная очистка
docker compose down -v
```
