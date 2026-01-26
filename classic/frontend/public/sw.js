// Service Worker для кэширования данных Classic подхода
const CACHE_NAME = 'classic-cache-v1';
const API_CACHE_NAME = 'classic-api-cache-v1';

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Не кэшируем файлы при установке - они будут кэшироваться динамически при первом запросе
  // Это позволяет избежать ошибок, если файлы еще не существуют или имеют хешированные имена
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Cache opened');
      // Открываем кэш для API тоже
      return caches.open(API_CACHE_NAME);
    }).then(() => {
      console.log('Service Worker: All caches opened');
    })
  );
  // Пропускаем ожидание и активируем сразу
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Кэшируем API запросы к /api/features и /api/banner-variant
  if (url.pathname.includes('/api/features') || url.pathname.includes('/api/banner-variant')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // Если есть кэш, возвращаем его (даже если есть сеть, для оффлайн режима)
          if (cachedResponse) {
            // В фоне обновляем кэш
            fetch(event.request)
              .then((response) => {
                if (response.ok) {
                  const responseClone = response.clone();
                  cache.put(event.request, responseClone);
                }
              })
              .catch(() => {
                // Игнорируем ошибки при обновлении кэша
              });
            return cachedResponse;
          }
          
          // Если кэша нет, делаем запрос
          return fetch(event.request)
            .then((response) => {
              // Кэшируем только успешные ответы
              if (response.ok) {
                const responseClone = response.clone();
                cache.put(event.request, responseClone);
              }
              return response;
            })
            .catch((error) => {
              console.log('Service Worker: Fetch failed', error);
              // Возвращаем ошибку, если нет кэша и нет сети
              throw error;
            });
        });
      })
    );
  }
  
  // Для статических ресурсов используем стратегию "Cache First"
  if (url.pathname.startsWith('/static/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
    );
  }
});
