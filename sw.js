'use strict';
const CACHE='chronique-jeanne-v2.0.0';
const ASSETS=[
  './','./index.html','./styles.css','./app.js','./manifest.webmanifest','./404.html',
  './assets/icon-192.png','./assets/icon-512.png','./assets/hero.svg',
  './assets/m1.svg','./assets/m2.svg','./assets/m3.svg','./assets/m4.svg',
  './assets/m5.svg','./assets/m6.svg','./assets/m7.svg','./assets/m8.svg'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return response}).catch(()=>caches.match('./index.html')));return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response})));
});
