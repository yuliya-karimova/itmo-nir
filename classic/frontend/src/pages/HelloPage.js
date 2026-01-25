import React from 'react';
import axios from 'axios';
import './HelloPage.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3011';

// Жестко закодированный компонент страницы Hello
// Почти все данные захардкожены на фронтенде, только features получаем с бэка
function HelloPage() {
  // Данные захардкожены на фронтенде
  const text = {
    title: 'Привет! Я новый текстовый блок!',
    content: 'Ты сюда можешь писать всё, что хочешь )'
  };

  const banner = {
    title: 'Мой лучший баннер',
    subtitle: 'Подзаголовок мечты',
    imageUrl: 'https://t4.ftcdn.net/jpg/02/56/10/07/360_F_256100731_qNLp6MQ3FjYtA3Freu9epjhsAj2cwU9c.jpg',
    buttonText: 'Перейти',
    buttonLink: '/info'
  };

  // Только features получаем с бэка
  const [features, setFeatures] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/features/hello`);
        setFeatures(response.data);
        setError(null);
      } catch (err) {
        console.error('Error loading features:', err);
        setError(`Ошибка загрузки features: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  // Структура страницы полностью закодирована здесь
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>Hello</h1>
        </div>
      </header>
      <main className="main">
        {/* Текстовая секция - жестко закодированная структура */}
        <section className="section text-section">
          <div className="container">
            <h2>{text.title}</h2>
            <div className="content" dangerouslySetInnerHTML={{ __html: text.content.replace(/\n/g, '<br />') }} />
          </div>
        </section>

        {/* Баннер - жестко закодированная структура */}
        <section className="section banner-section">
          <div className="banner-content">
            {banner.imageUrl && (
              <img src={banner.imageUrl} alt={banner.title || ''} className="banner-image" />
            )}
            <div className={`banner-overlay ${!banner.imageUrl ? 'no-image' : ''}`}>
              <div className="container">
                <h1>{banner.title}</h1>
                {banner.subtitle && <p className="subtitle">{banner.subtitle}</p>}
                {banner.buttonText && (
                  <a href={banner.buttonLink} className="banner-button">
                    {banner.buttonText}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Возможности - получаем с бэка */}
        {loading && (
          <section className="section features-section">
            <div className="container">
              <div className="loading">Загрузка features...</div>
            </div>
          </section>
        )}
        
        {error && (
          <section className="section features-section">
            <div className="container">
              <div className="error">{error}</div>
            </div>
          </section>
        )}

        {!loading && !error && features && features.length > 0 && (
          <section className="section features-section">
            <div className="container">
              <h2>Заголовок блока</h2>
              <div className="features-grid">
                {features.map(item => (
                  <div key={item.id} className="feature-card">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.title || ''} />
                    )}
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <footer className="footer">
        <div className="container">
          <p>Classic Frontend Approach Demo</p>
        </div>
      </footer>
    </div>
  );
}

export default HelloPage;
