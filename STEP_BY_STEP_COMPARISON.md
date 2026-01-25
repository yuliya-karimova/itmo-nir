# Пошаговая инструкция по сравнению BDUI и классического подхода

Детальное руководство для проведения практического сравнения согласно методике НИР2.

## Подготовка окружения

### Шаг 1: Установка инструментов

Убедитесь, что установлены:
```bash
# Проверка Docker
docker --version

# Проверка Node.js (для локальной разработки, если нужно)
node --version

# Установка Lighthouse (для измерений производительности)
npm install -g lighthouse

# Установка Chrome DevTools Protocol (опционально)
# Chrome уже должен быть установлен
```

### Шаг 2: Клонирование/подготовка проектов

```bash
# Убедитесь, что оба проекта готовы
cd /Users/me/mine/itmo/web/itmo-nir
ls -la bdui/ classic/
```

### Шаг 3: Создание папки для результатов

```bash
mkdir -p comparison_results/{bdui,classic}
mkdir -p comparison_results/artifacts/{lighthouse,har,profiles}
```

---

## Сценарий S1: Простая правка (TTM и трудоёмкость)

### Цель: Изменить текст в баннере и добавить новый текстовый блок

---

### BDUI подход

#### Шаг 1.1: Запуск BDUI проекта
```bash
cd bdui
docker compose up --build -d
# Ждем 30-60 секунд пока все сервисы запустятся
docker compose ps  # Проверяем, что все сервисы работают
```

#### Шаг 1.2: Фиксация начального времени
```bash
# Записываем время начала задачи
echo "BDUI S1 Start: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" > ../comparison_results/bdui/s1_timeline.txt

# Или создаем задачу в Jira/GitHub Issues и фиксируем время создания
```

#### Шаг 1.3: Выполнение изменения через админ-панель

1. Откройте админ-панель: http://localhost:3003
2. Найдите главную страницу (home)
3. Найдите блок типа "banner"
4. Измените:
   - Заголовок баннера: "Добро пожаловать!" → "Добро пожаловать на наш сайт!"
   - Подзаголовок: "Backend Driven UI Demo" → "Используем современные технологии"
5. Добавьте новый текстовый блок:
   - Нажмите "Добавить блок"
   - Выберите тип "text"
   - Заполните:
     - Заголовок: "Новое объявление"
     - Содержимое: "Мы рады сообщить о запуске нового функционала!"
6. Сохраните изменения

# Фиксируем время завершения изменения
echo "BDUI S1 Change Complete: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> ../comparison_results/bdui/s1_timeline.txt
```

#### Шаг 1.4: Проверка результата
```bash
# Открываем фронтенд
open http://localhost:3000

# Фиксируем время, когда изменения появились
echo "BDUI S1 Visible: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> ../comparison_results/bdui/s1_timeline.txt
```

#### Шаг 1.5: Расчет TTM
```bash
# Вычисляем разницу (вручную или скриптом)
# TTM = время от Start до Visible
```

**Ожидаемый результат BDUI**: Изменения видны сразу после сохранения (0-5 минут)

---

### Классический подход

#### Шаг 1.6: Запуск Classic проекта
```bash
cd ../classic
docker compose up --build -d
# Ждем запуска
docker compose ps
```

#### Шаг 1.7: Фиксация начального времени
```bash
echo "Classic S1 Start: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" > ../comparison_results/classic/s1_timeline.txt
```

#### Шаг 1.8: Выполнение изменения в коде

1. Откройте файл компонента страницы:
```bash
# Находим файл главной страницы
cat frontend/src/pages/HomePage.js
```

2. Изменяем захардкоженные данные в компоненте:
```javascript
// Было:
const banner = {
  title: 'Добро пожаловать!',
  subtitle: 'Classic Frontend Approach Demo',
  // ...
};

// Стало:
const banner = {
  title: 'Добро пожаловать на наш сайт!',
  subtitle: 'Используем современные технологии',
  // ...
};
```

3. Добавляем новый текстовый блок в JSX:
```javascript
// После секции about, перед features, добавляем:
<section className="section text-section">
  <div className="container">
    <h2>Новое объявление</h2>
    <div className="content">
      Мы рады сообщить о запуске нового функционала!
    </div>
  </div>
</section>
```

4. Пересобираем фронтенд:
```bash
cd frontend
docker compose exec frontend npm run build
# Или перезапускаем контейнер
cd ..
docker compose restart frontend
```

5. Фиксируем время завершения:
```bash
echo "Classic S1 Build Complete: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> ../comparison_results/classic/s1_timeline.txt
```

#### Шаг 1.9: Проверка результата
```bash
open http://localhost:3010
echo "Classic S1 Visible: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> ../comparison_results/classic/s1_timeline.txt
```

**Ожидаемый результат Classic**: Требуется пересборка и перезапуск (10-30 минут)

---

### Шаг 1.10: Сравнение результатов

```bash
# Создаем таблицу сравнения
cat > ../comparison_results/s1_comparison.txt << EOF
Сценарий S1: Малая правка

BDUI:
- Время начала: [из s1_timeline.txt]
- Время завершения: [из s1_timeline.txt]
- TTM: [разница в минутах]
- Требовалась пересборка: НЕТ

Classic:
- Время начала: [из s1_timeline.txt]
- Время завершения: [из s1_timeline.txt]
- TTM: [разница в минутах]
- Требовалась пересборка: ДА

Вывод: BDUI быстрее на [X] минут
EOF
```

**Оценка по шкале 1-5** (из НИР2):
- BDUI: 5 баллов (мгновенно, < 1 часа)
- Classic: 2-3 балла (неделя+ для мобильных, несколько дней для веба)

---

## Сценарий S1.5: Сложная правка - Добавление новой страницы (TTM)

### Цель: Создать новую страницу "О нас" с баннером, текстовым блоком и блоком карточек

---

### BDUI подход

#### Шаг 1.5.1: Фиксация начального времени
```bash
echo "BDUI S1.5 Start: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" > ../comparison_results/bdui/s1.5_timeline.txt
```

#### Шаг 1.5.2: Создание новой страницы через админ-панель

1. Откройте админ-панель: http://localhost:3003
2. Нажмите "Создать страницу" или перейдите на `/pages/new`
3. Заполните данные страницы:
   - ID: `about`
   - Заголовок: `О нас`
   - Slug: `/about`
4. Добавьте блоки в следующем порядке:
   
   **Блок 1 - Баннер:**
   - Тип: `banner`
   - Заголовок: `О нашей компании`
   - Подзаголовок: `Мы работаем с 2020 года`
   - URL изображения: `https://via.placeholder.com/1200x400`
   - Текст кнопки: `Связаться с нами`
   - Ссылка кнопки: `/contact`
   
   **Блок 2 - Текстовый блок:**
   - Тип: `text`
   - Заголовок: `Наша история`
   - Содержимое: `Компания была основана с целью создания инновационных решений...`
   
   **Блок 3 - Блок с карточками:**
   - Тип: `cards`
   - Заголовок блока: `Наши преимущества`
   - Добавьте 3 карточки:
     - Карточка 1: "Опыт", "Более 5 лет на рынке", изображение
     - Карточка 2: "Команда", "50+ специалистов", изображение
     - Карточка 3: "Проекты", "200+ успешных проектов", изображение

5. Сохраните страницу

# Фиксируем время завершения
echo "BDUI S1.5 Change Complete: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> ../comparison_results/bdui/s1.5_timeline.txt
```

#### Шаг 1.5.3: Проверка результата
```bash
# Открываем новую страницу
open http://localhost:3000/about

# Фиксируем время, когда страница появилась
echo "BDUI S1.5 Visible: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> ../comparison_results/bdui/s1.5_timeline.txt
```

**Ожидаемый результат BDUI**: Новая страница доступна сразу после сохранения (0-5 минут)

---

### Классический подход

#### Шаг 1.5.4: Фиксация начального времени
```bash
echo "Classic S1.5 Start: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" > ../comparison_results/classic/s1.5_timeline.txt
```

#### Шаг 1.5.5: Создание новой страницы в коде

1. Создайте новый компонент страницы:
```bash
# Создаем файл для новой страницы
touch frontend/src/pages/AboutPage.js
```

2. Напишите компонент `AboutPage.js`:
```javascript
import React from 'react';
import axios from 'axios';
import './AboutPage.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3011';

function AboutPage() {
  // Захардкоженные данные
  const banner = {
    title: 'О нашей компании',
    subtitle: 'Мы работаем с 2020 года',
    imageUrl: 'https://via.placeholder.com/1200x400',
    buttonText: 'Связаться с нами',
    buttonLink: '/contact'
  };

  const history = {
    title: 'Наша история',
    content: 'Компания была основана с целью создания инновационных решений...'
  };

  // Features получаем с бэка (если нужны)
  const [features, setFeatures] = React.useState([]);
  // ... код загрузки features

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>О нас</h1>
        </div>
      </header>
      <main className="main">
        {/* Баннер */}
        <section className="section banner-section">
          {/* ... код баннера */}
        </section>
        
        {/* История */}
        <section className="section text-section">
          {/* ... код текстового блока */}
        </section>
        
        {/* Преимущества - захардкоженные карточки */}
        <section className="section features-section">
          <div className="container">
            <h2>Наши преимущества</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Опыт</h3>
                <p>Более 5 лет на рынке</p>
              </div>
              <div className="feature-card">
                <h3>Команда</h3>
                <p>50+ специалистов</p>
              </div>
              <div className="feature-card">
                <h3>Проекты</h3>
                <p>200+ успешных проектов</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container">
          <p>Classic Frontend Approach Demo</p>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;
```

3. Добавьте роут в `App.js`:
```javascript
import AboutPage from './pages/AboutPage';

// В Routes добавить:
<Route path="/about" element={<AboutPage />} />
```

4. Создайте CSS файл `AboutPage.css` (или используйте общие стили)

5. Пересоберите фронтенд:
```bash
cd frontend
docker compose exec frontend npm run build
cd ..
docker compose restart frontend
```

6. Фиксируем время завершения:
```bash
echo "Classic S1.5 Build Complete: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> ../comparison_results/classic/s1.5_timeline.txt
```

#### Шаг 1.5.6: Проверка результата
```bash
open http://localhost:3010/about
echo "Classic S1.5 Visible: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> ../comparison_results/classic/s1.5_timeline.txt
```

**Ожидаемый результат Classic**: Требуется создание нового компонента, добавление роута, пересборка (20-40 минут)

---

### Шаг 1.5.7: Сравнение результатов

```bash
cat > ../comparison_results/s1.5_comparison.txt << EOF
Сценарий S1.5: Добавление новой страницы

BDUI:
- Время начала: [из s1.5_timeline.txt]
- Время завершения: [из s1.5_timeline.txt]
- TTM: [разница в минутах]
- Требовалась пересборка: НЕТ
- Создание нового компонента: НЕТ

Classic:
- Время начала: [из s1.5_timeline.txt]
- Время завершения: [из s1.5_timeline.txt]
- TTM: [разница в минутах]
- Требовалась пересборка: ДА
- Создание нового компонента: ДА

Вывод: BDUI быстрее на [X] минут
EOF
```

**Оценка по шкале 1-5**:
- BDUI: 5 баллов (мгновенно, без пересборки)
- Classic: 1-2 балла (требуется создание компонента, пересборка, деплой)

---

## Сценарий S2: Новая форма (Трафик, производительность, ресурсы)

### Цель: Добавить форму из 5 полей с валидацией

---

### BDUI подход

#### Шаг 2.1: Создание нового типа блока

1. Добавляем контракт в `bdui/backend/contracts.js`:
```javascript
{
  type: 'form',
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Имя' },
    { name: 'email', type: 'email', required: true, label: 'Email' },
    { name: 'phone', type: 'tel', required: false, label: 'Телефон' },
    { name: 'message', type: 'textarea', required: true, label: 'Сообщение' },
    { name: 'agree', type: 'checkbox', required: true, label: 'Согласие' }
  ]
}
```

2. Создаем компонент `bdui/frontend/src/blocks/FormBlock.js`
3. Добавляем в `BlockRenderer.js`
4. Пересобираем фронтенд (один раз для нового компонента)

#### Шаг 2.2: Измерение трафика

**Перед изменением:**
```bash
# Открываем Chrome DevTools (F12)
# Переходим на вкладку Network
# Очищаем лог (кнопка Clear)
# Открываем страницу http://localhost:3000
# Сохраняем HAR файл: Right-click → Save all as HAR
# Копируем в results
cp ~/Downloads/*.har ../comparison_results/artifacts/har/bdui_s2_before.har
```

**После добавления формы:**
```bash
# Повторяем процесс
# Сохраняем как bdui_s2_after.har
```

**Анализ HAR файла:**
```bash
# Используем онлайн-анализатор или скрипт
# Считаем:
# - Общий размер ответов (KB)
# - Количество запросов
# - Размер JSON с описанием страницы
```

#### Шаг 2.3: Измерение производительности

```bash
# Запускаем Lighthouse
lighthouse http://localhost:3000 \
  --output=json \
  --output-path=../comparison_results/artifacts/lighthouse/bdui_s2.json \
  --chrome-flags="--headless"

# Или через Chrome DevTools:
# 1. Открываем DevTools (F12)
# 2. Вкладка Lighthouse
# 3. Выбираем "Performance"
# 4. Нажимаем "Generate report"
# 5. Сохраняем результаты
```

**Метрики для записи:**
- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

#### Шаг 2.4: Измерение ресурсов

**CPU и RAM на клиенте:**
```bash
# Chrome DevTools → Performance
# 1. Нажимаем Record (круглая кнопка)
# 2. Обновляем страницу
# 3. Ждем полной загрузки
# 4. Останавливаем запись
# 5. Смотрим на графики CPU и Memory
# 6. Экспортируем профиль: Right-click → Save profile
```

**CPU и RAM на сервере:**
```bash
# Подключаемся к контейнеру
docker compose exec backend sh

# Внутри контейнера (если Node.js):
# Используем встроенные инструменты или
top
# Записываем пиковые значения

# Или используем docker stats
docker stats bdui-backend-1 --format "table {{.CPUPerc}}\t{{.MemUsage}}" > ../comparison_results/bdui/server_resources.txt
```

---

### Классический подход

#### Шаг 2.5: Создание формы

1. Создаем компонент `classic/frontend/src/components/ContactForm.js`
2. Добавляем валидацию
3. Интегрируем в нужную страницу
4. Пересобираем фронтенд

#### Шаг 2.6-2.8: Повторяем измерения

Те же шаги, что для BDUI, но для `http://localhost:3010`

---

### Шаг 2.9: Сравнение результатов

Создаем таблицу:

| Метрика | BDUI | Classic | Разница |
|---------|------|---------|---------|
| Размер ответа API (KB) | | | |
| Количество запросов | | | |
| FCP (мс) | | | |
| TTI (мс) | | | |
| Пик CPU (%) | | | |
| Пик RAM (MB) | | | |

**Оценка по шкале 1-5**:
- Трафик: BDUI может быть больше из-за описания UI
- Производительность: Classic может быть быстрее (UI уже в приложении)
- Ресурсы: Зависит от реализации

---

## Сценарий S3: A/B-эксперимент (TTM, поддерживаемость)

### Цель: Показывать 50% пользователей альтернативный баннер

---

### BDUI подход

#### Шаг 3.1: Реализация логики на сервере

В `bdui/bff/server.js`:
```javascript
app.get('/api/page/:slug?', async (req, res) => {
  // ... существующий код ...
  
  // A/B тест: 50% пользователей видят альтернативный баннер
  const userId = req.headers['user-id'] || Math.random().toString();
  const useVariantB = parseInt(userId, 16) % 2 === 0;
  
  if (useVariantB) {
    // Заменяем баннер на альтернативный
    page.blocks = page.blocks.map(block => {
      if (block.type === 'banner') {
        return {
          ...block,
          data: {
            ...block.data,
            title: 'Альтернативный баннер',
            subtitle: 'Вы видите вариант B'
          }
        };
      }
      return block;
    });
  }
  
  res.json(transformedPage);
});
```

#### Шаг 3.2: Деплой изменений
```bash
cd bdui
docker compose restart bff
# Или пересобираем если нужно
docker compose up -d --build bff
```

#### Шаг 3.3: Фиксация времени
```bash
echo "BDUI S3 Deployed: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" > ../comparison_results/bdui/s3_timeline.txt
```

#### Шаг 3.4: Тестирование
```bash
# Открываем страницу несколько раз
# Должны видеть разные баннеры
curl http://localhost:3002/api/page/ -H "user-id: 1"  # Вариант A
curl http://localhost:3002/api/page/ -H "user-id: 2"  # Вариант B
```

**Ожидаемый TTM**: 5-10 минут (только перезапуск BFF)

---

### Классический подход

#### Шаг 3.5: Реализация в коде

1. Добавляем логику A/B теста в компонент:
```javascript
// classic/frontend/src/pages/HomePage.js
const userId = localStorage.getItem('userId') || Math.random().toString(36);
localStorage.setItem('userId', userId);
const useVariantB = parseInt(userId, 36) % 2 === 0;

{useVariantB ? (
  <Banner data={data.alternativeBanner} />
) : (
  <Banner data={data.banner} />
)}
```

2. Пересобираем фронтенд:
```bash
cd classic/frontend
docker compose exec frontend npm run build
docker compose restart frontend
```

#### Шаг 3.6: Фиксация времени
```bash
echo "Classic S3 Deployed: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" > ../comparison_results/classic/s3_timeline.txt
```

**Ожидаемый TTM**: 15-30 минут (пересборка + деплой)

---

### Шаг 3.7: Оценка поддерживаемости

**BDUI:**
- Изменения в одном месте (BFF)
- Не требует пересборки фронтенда
- Легко откатить (изменить логику на сервере)
- **Оценка: 4-5 баллов**

**Classic:**
- Требуется изменение кода компонента
- Пересборка фронтенда
- Сложнее откатить (нужен новый деплой)
- **Оценка: 2-3 балла**

---

## Сценарий S4: Оффлайн-режим (Производительность, ресурсы)

### Цель: Открыть страницу без сети

---

### BDUI подход

#### Шаг 4.1: Подготовка кэширования

1. Добавляем Service Worker в `bdui/frontend/public/sw.js`:
```javascript
// Кэшируем последнее описание страницы
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/page/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          const responseClone = response.clone();
          caches.open('bdui-cache').then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        });
      })
    );
  }
});
```

2. Регистрируем в `bdui/frontend/src/index.js`

#### Шаг 4.2: Тестирование оффлайн

```bash
# 1. Открываем страницу с сетью
open http://localhost:3000

# 2. Открываем Chrome DevTools → Network
# 3. Ставим "Offline" режим
# 4. Обновляем страницу
# 5. Фиксируем результат
```

**Ожидаемый результат**: Страница может загрузиться из кэша, если была посещена ранее

---

### Классический подход

#### Шаг 4.3: Тестирование оффлайн

```bash
# 1. Открываем страницу с сетью
open http://localhost:3010

# 2. Ставим "Offline" режим
# 3. Обновляем страницу
# 4. Фиксируем результат
```

**Ожидаемый результат**: UI уже в приложении, работает с закэшированными данными

---

### Шаг 4.4: Сравнение

| Аспект | BDUI | Classic |
|--------|------|---------|
| Работает оффлайн? | Да (с кэшем) | Да (UI встроен) |
| Требуется кэш? | Да | Нет (для UI) |
| Размер кэша | Больше (UI + данные) | Меньше (только данные) |

**Оценка**: Classic получает преимущество (4-5 баллов) vs BDUI (3-4 балла)

---

## Финальный анализ и отчет

### Шаг 5.1: Сводная таблица результатов

Создайте файл `comparison_results/final_comparison.md`:

```markdown
# Сводная таблица сравнения

## Параметр 1: Скорость доставки изменений (TTM)

| Сценарий | BDUI (баллы) | Classic (баллы) | Победитель |
|----------|--------------|-----------------|------------|
| S1: Простая правка (изменить текст + добавить блок) | 5 | 2 | BDUI |
| S1.5: Сложная правка (новая страница) | 5 | 1 | BDUI |
| S3: A/B тест | 5 | 3 | BDUI |
| **Среднее** | **5** | **2** | **BDUI** |

## Параметр 2: Объём передаваемых данных

| Метрика | BDUI | Classic | Победитель |
|---------|------|---------|------------|
| Размер ответа (KB) | | | |
| Количество запросов | | | |
| **Оценка** | **3** | **5** | **Classic** |

## Параметр 3: Производительность UI

| Метрика | BDUI | Classic | Победитель |
|---------|------|---------|------------|
| FCP (мс) | | | |
| TTI (мс) | | | |
| **Оценка** | **3** | **5** | **Classic** |

## Параметр 4: Использование ресурсов

| Метрика | BDUI | Classic | Победитель |
|---------|------|---------|------------|
| CPU (%) | | | |
| RAM (MB) | | | |
| **Оценка** | **3** | **4** | **Classic** |

## Параметр 5: Простота поддержки

| Аспект | BDUI | Classic |
|--------|------|---------|
| Ясность архитектуры | | |
| Объём повторяющегося кода | | |
| Сложность отладки | | |
| Документация | | |
| Легкость входа | | |
| **Средняя оценка** | **3** | **4** | **Classic** |

## Итоговая оценка

| Подход | Сумма баллов | Вывод |
|--------|--------------|-------|
| BDUI | 17/25 | Подходит для продуктов с частыми изменениями |
| Classic | 20.5/25 | Подходит для статичных приложений |

## Рекомендации

- **BDUI** рекомендуется для:
  - E-commerce с частыми промо-акциями
  - Приложений с A/B тестированием
  - Мультиплатформенных продуктов
  
- **Classic** рекомендуется для:
  - Статичных сайтов
  - Приложений с критичной производительностью
  - Оффлайн-критичных приложений
```

### Шаг 5.2: Визуализация результатов

Создайте скрипт для визуализации:

```python
# comparison_results/visualize.py
import matplotlib.pyplot as plt
import numpy as np

parameters = ['TTM', 'Трафик', 'Производительность', 'Ресурсы', 'Поддержка']
bdui_scores = [5, 3, 3, 3, 3]
classic_scores = [2.5, 5, 5, 4, 4]

x = np.arange(len(parameters))
width = 0.35

fig, ax = plt.subplots()
bars1 = ax.bar(x - width/2, bdui_scores, width, label='BDUI')
bars2 = ax.bar(x + width/2, classic_scores, width, label='Classic')

ax.set_ylabel('Баллы (1-5)')
ax.set_title('Сравнение BDUI и Classic подходов')
ax.set_xticks(x)
ax.set_xticklabels(parameters)
ax.legend()
ax.set_ylim(0, 5.5)

plt.tight_layout()
plt.savefig('comparison_chart.png')
```

### Шаг 5.3: Сохранение артефактов

```bash
# Создаем архив всех результатов
tar -czf comparison_results_$(date +%Y%m%d).tar.gz comparison_results/

# Или загружаем в облако для верификации
```

---

## Чеклист для НИР3

- [ ] Все 4 сценария выполнены для обоих подходов
- [ ] Все метрики измерены и записаны
- [ ] Создана сводная таблица с оценками
- [ ] Построены графики сравнения
- [ ] Сохранены все артефакты (HAR, Lighthouse, профили)
- [ ] Написаны выводы и рекомендации
- [ ] Подготовлен отчет для НИР3

---

## Полезные команды

```bash
# Просмотр логов
docker compose logs -f backend

# Перезапуск сервиса
docker compose restart frontend

# Остановка всех контейнеров
docker compose down

# Очистка и пересборка
docker compose down -v
docker compose up --build

# Проверка использования ресурсов
docker stats

# Экспорт данных
docker compose exec backend cat data/pages.json > backup.json
```

---

## Контакты и помощь

При возникновении проблем:
1. Проверьте логи: `docker compose logs`
2. Убедитесь, что порты не заняты: `lsof -i :3000`
3. Проверьте, что все сервисы запущены: `docker compose ps`
