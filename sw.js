'use strict';
const CACHE='huit-preuves-v3.1.0';
const ASSETS=[
  './','./index.html','./404.html','./styles.css','./app.js','./manifest.webmanifest',
  './assets/icon-192.png','./assets/icon-512.png','./assets/hero.svg','./assets/brouilleur.svg',
  './assets/martroi.svg','./assets/maison.svg','./assets/loire.svg','./assets/cathedrale.svg',
  './assets/groslot.svg','./assets/campo.svg','./assets/train.svg','./assets/cabu.svg'
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    if(!response||response.status!==200||response.type==='opaque')return response;
    const clone=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,clone));return response;
  }).catch(()=>event.request.mode==='navigate'?caches.match('./index.html'):undefined)));
});
