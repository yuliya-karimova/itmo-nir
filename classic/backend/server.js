const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3011;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

app.use(cors());
app.use(bodyParser.json());

// Инициализация данных
async function initData() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      // Создаем начальные данные - только features
      const initialData = {
        features: [
          {
            id: '1',
            title: 'Статический контент',
            description: 'Структура UI определена во фронтенде',
            imageUrl: 'https://media.proglib.io/posts/2021/02/24/5ccab15a3f7623fe3283f1907fd3cd2d.webp'
          },
          {
            id: '2',
            title: 'Предсказуемая структура',
            description: 'Легко понять, где что находится',
            imageUrl: 'https://static.tildacdn.com/tild3831-3535-4932-a662-656464333136/templates2.jpg'
          },
          {
            id: '3',
            title: 'Быстрая загрузка',
            description: 'UI уже в приложении, не нужно ждать',
            imageUrl: 'https://daily.wordreference.com/wp-content/uploads/2017/04/fast.jpg'
          }
        ],
        helloFeatures: [
          { id: '1', title: 'Первая', description: 'Описание', imageUrl: '' },
          { id: '2', title: 'Вторая', description: 'Описание', imageUrl: '' },
          { id: '3', title: 'Третья', description: 'Описание', imageUrl: '' }
        ]
      };
      await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Получить список фичей для главной страницы
app.get('/api/features', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    res.json(jsonData.features || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить фичи для страницы hello
app.get('/api/features/hello', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    res.json(jsonData.helloFeatures || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить список фичей
app.put('/api/features', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    jsonData.features = req.body;
    await fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2));
    res.json(jsonData.features);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Запуск сервера
initData().then(() => {
  app.listen(PORT, () => {
    console.log(`Classic Backend server running on port ${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET /api/features - Get features list for home page');
    console.log('  GET /api/features/hello - Get features list for hello page');
  });
});
