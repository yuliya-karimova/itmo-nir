import React from 'react';

function AboutPage() {
  const banner = {
    title: 'О нашей компании',
    subtitle: 'Мы работаем с 2020 года',
    imageUrl: 'https://img.freepik.com/free-vector/abstract-paper-style-background_23-2150744378.jpg?semt=ais_hybrid&w=740&q=80',
    buttonText: 'Связаться с нами',
    buttonLink: '/contact'
  };

  const history = {
    title: 'Наша история',
    content: 'Компания была основана с целью создания инновационных решений...'
  };

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
        
        <section className="section text-section">
          <div className="container">
            <h2>{history.title}</h2>
            <div className="content" dangerouslySetInnerHTML={{ __html: history.content.replace(/\n/g, '<br />') }} />
          </div>
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