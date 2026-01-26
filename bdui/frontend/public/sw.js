// Service Worker для кэширования данных BDUI
const CACHE_NAME = 'bdui-cache-v1';
const API_CACHE_NAME = 'bdui-api-cache-v1';

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
  
  // Обрабатываем навигационные запросы (HTML страницы)
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept')?.includes('text/html'))) {
    console.log('Service Worker: Handling navigation request to', url.pathname);
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        // Нормализуем URL для кэша (убираем query параметры)
        const cacheKey = new Request(url.origin + url.pathname, {
          method: 'GET',
          headers: event.request.headers
        });
        
        // Сначала проверяем кэш
        return cache.match(cacheKey).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Service Worker: Found in cache for', url.pathname);
            // Если есть в кэше, возвращаем его и обновляем в фоне
            fetch(event.request)
              .then((response) => {
                if (response.ok) {
                  const responseClone = response.clone();
                  cache.put(cacheKey, responseClone);
                  console.log('Service Worker: Updated cache for', url.pathname);
                }
              })
              .catch((err) => {
                console.log('Service Worker: Failed to update cache (offline?)', err);
              });
            return cachedResponse;
          }
          
          console.log('Service Worker: Not in cache, fetching', url.pathname);
          // Если нет в кэше, делаем запрос
          return fetch(event.request)
            .then((response) => {
              // Кэшируем HTML страницы
              if (response.ok) {
                const responseClone = response.clone();
                cache.put(cacheKey, responseClone);
                console.log('Service Worker: Cached', url.pathname);
              }
              return response;
            })
            .catch((err) => {
              console.log('Service Worker: Fetch failed, trying index.html fallback', err);
              // Если нет сети и нет кэша для этого URL, пробуем index.html
              return cache.match('/index.html').then((indexHtml) => {
                if (indexHtml) {
                  console.log('Service Worker: Returning cached index.html');
                  return indexHtml;
                }
                // Если даже index.html нет, пробуем корневой путь
                return cache.match('/').then((rootHtml) => {
                  if (rootHtml) {
                    console.log('Service Worker: Returning cached root');
                    return rootHtml;
                  }
                  console.log('Service Worker: No cached content available');
                  // Возвращаем ошибку
                  return new Response('Offline - no cached content available', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({ 'Content-Type': 'text/html' })
                  });
                });
              });
            });
        });
      })
    );
    return;
  }
  
  // Кэшируем API запросы к /api/page/
  if (url.pathname.includes('/api/page/')) {
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
  if (url.pathname.startsWith('/static/') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg') || url.pathname.endsWith('.svg')) {
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
        }).catch(() => {
          // Если нет сети и нет кэша, возвращаем пустой ответ
          return new Response('', { status: 408, statusText: 'Request Timeout' });
        });
      })
    );
    return;
  }
  
  // Для всех остальных запросов пробуем сначала сеть, потом кэш
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
