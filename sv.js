const CACHE_NAME = 'akshop-cache-v1';
// Список URL ресурсов для кэширования
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  // Добавьте сюда пути ко всем остальным страницам и ресурсам, которые хотите кэшировать
  './mice.html',
  './keyboards.html',
  './headphones.html',
  './contacts.html',
  './feedback.php' // PHP файлы не кэшируются напрямую Service Worker'ом как статические ресурсы, но можно закэшировать ответ, если он статичен
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache resources:', error);
      })
  );
});

// Перехват сетевых запросов и ответ из кэша, если есть
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем кэшированный ресурс или делаем сетевой запрос
        return response || fetch(event.request);
      })
  );
});

// Активация нового Service Worker и удаление старых кэшей
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});