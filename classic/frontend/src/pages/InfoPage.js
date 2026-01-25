import React from 'react';
import './InfoPage.css';

// Жестко закодированный компонент страницы Info
// Все данные захардкожены на фронтенде
function InfoPage() {
  // Данные захардкожены на фронтенде
  const text = {
    title: 'Привет',
    content: 'Содержимое текстового блока'
  };

  // Структура страницы полностью закодирована здесь
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>Info</h1>
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
      </main>
      <footer className="footer">
        <div className="container">
          <p>Classic Frontend Approach Demo</p>
        </div>
      </footer>
    </div>
  );
}

export default InfoPage;
