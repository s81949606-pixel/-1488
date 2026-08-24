/* SUPRA MAGNATE — service worker: офлайн-режим */
const CACHE = 'supra-magnate-v1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './css/app.css',
  './js/main.js', './js/economy.js', './js/data.js', './js/art.js', './js/state.js',
  './assets/icon.svg', './assets/icon-192.png', './assets/icon-512.png',
  './assets/img/car_hatch.webp', './assets/img/car_hatch.jpg',
  './assets/img/car_suv.webp', './assets/img/car_suv.jpg',
  './assets/img/car_classic.webp', './assets/img/car_classic.jpg',
  './assets/img/car_sport.webp', './assets/img/car_sport.jpg',
  './assets/img/car_hyper.webp', './assets/img/car_hyper.jpg',
  './assets/img/house_apt.webp', './assets/img/house_apt.jpg',
  './assets/img/house_suburb.webp', './assets/img/house_suburb.jpg',
  './assets/img/house_villa.webp', './assets/img/house_villa.jpg',
  './assets/img/yacht.webp', './assets/img/yacht.jpg',
  './assets/img/jet.webp', './assets/img/jet.jpg',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
