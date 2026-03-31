const CACHE_NAME = 'simon-attendance-v1';

// 這裡列出需要被下載到手機裡的檔案
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 安裝 Service Worker 並快取檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('已成功快取應用程式檔案');
        return cache.addAll(urlsToCache);
      })
  );
});

// 當應用程式更新時，清除舊的快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('清除舊版本快取');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 攔截網路請求：如果有快取就用快取，沒有才去網路抓
self.addEventListener('fetch', event => {
  // 【重要】遇到 Google Apps Script 的 API 請求，絕對不快取，確保永遠抓取最新資料！
  if (event.request.url.includes('script.google.com')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 找到快取就回傳，找不到就透過網路 fetch
        return response || fetch(event.request);
      })
  );
});