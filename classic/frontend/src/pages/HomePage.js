import React from 'react';
import axios from 'axios';
import './HomePage.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3011';

// Жестко закодированный компонент главной страницы
// Почти все данные захардкожены на фронтенде, только features получаем с бэка
function HomePage() {
  // Данные захардкожены на фронтенде
  const banner = {
    title: 'Добро пожаловать!',
    subtitle: 'Используем современные технологии - Classic Frontend Approach Demo',
    imageUrl: 'https://img.freepik.com/free-vector/abstract-paper-style-background_23-2150744378.jpg?semt=ais_hybrid&w=740&q=80',
    buttonText: 'Узнать больше',
    buttonLink: '/info'
  };

  const about = {
    title: 'О проекте',
    content: 'Это демонстрационное приложение показывает классический подход к разработке. Контент страницы управляется через бэкенд, но структура UI жестко закодирована во фронтенде.'
  };

  const buttons = [
    { id: '1', text: 'info', link: '/info', style: 'primary' },
    { id: '2', text: 'hello', link: '/hello', style: 'secondary' }
  ];

  // Только features получаем с бэка
  const [features, setFeatures] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/features`);
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
          <h1>Главная страница</h1>
        </div>
      </header>
      <main className="main">
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

        {/* Кнопки - жестко закодированная структура */}
        {buttons && buttons.length > 0 && (
          <section className="section buttons-section">
            <div className="container">
              <div className="buttons-list">
                {buttons.map(button => (
                  <a
                    key={button.id}
                    href={button.link}
                    className={`btn btn-${button.style || 'primary'}`}
                  >
                    {button.text}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* О проекте - жестко закодированная структура */}
        <section className="section text-section">
          <div className="container">
            <h2>{about.title}</h2>
            <div className="content" dangerouslySetInnerHTML={{ __html: about.content.replace(/\n/g, '<br />') }} />
          </div>
        </section>

        <section className="section text-section">
          <div className="container">
            <h2>Новое объявление</h2>
            <div className="content">
              Мы рады сообщить о запуске нового функционала!
            </div>
          </div>
        </section>

        <section className="section text-section">
          <div className="container">
            <h2>Новое объявление 2</h2>
            <div className="content">
              Мы рады сообщить о запуске еще более нового функционала!
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
              <h2>Наши возможности</h2>
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

export default HomePage;
