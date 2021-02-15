const CACHE_NAME = 'v1::static';
const urlsToCache = [
  './',

  './site.webmanifest',
  './service-worker.js',

  './sketch.js',

  'https://cdn.jsdelivr.net/npm/p5@0.10.2/lib/p5.js',
  'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/addons/p5.sound.min.js',

  './src/assets/fonts/FjallaOne-Regular.ttf',
  './src/assets/fonts/font-awesome.otf',

  './src/assets/images/ball.json',
  './src/assets/images/ball.png',
  './src/assets/images/social_img.png',
  './src/assets/images/star.json',
  './src/assets/images/star.png',

  './src/assets/sounds/PowerUp.wav',
  './src/assets/sounds/SoftHit.wav',

  './src/classes/ball.js',
  './src/classes/clickableObject.js',
  './src/classes/multiball.js',

  './src/helpers/constrainAngle.js',
  './src/helpers/displayScores.js',
  './src/helpers/readSpritesheet.js',
  './src/helpers/saveHighScoreCookie.js',

  './android-chrome-192x192.png',
  './android-chrome-512x512.png',
  './apple-touch-icon.png',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './favicon.ico',

];

// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      }),
  );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (event) => {
  event.respondWith(
    (caches
      .open(CACHE_NAME)
      .then((cache) => cache.match(event.request)
        .then((res) => res || fetch(event.request)))),
  );
});
