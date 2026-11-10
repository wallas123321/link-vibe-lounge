importScripts('./push-receipts.js');
const CACHE='zapliberal-web-v5';
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./index.html','./app.css','./app.js','./crypto.js','./local-security.js','./icon-192.png'])).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('zapliberal-web-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||!u.pathname.startsWith('/zapliberal/'))return;e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));});
self.addEventListener('push',e=>{let data={};try{data=e.data.json();}catch{}const url=new URL('./index.html',self.registration.scope);if(data.kind==='request')url.searchParams.set('view','approvals');else if(/^[a-f0-9-]{36}$/.test(data.room))url.searchParams.set('room',data.room);e.waitUntil(Promise.all([self.registration.showNotification('ZapLiberal',{body:data.body||'Há novidades nas suas conversas.',icon:'./icon-192.png',badge:'./icon-192.png',tag:data.tag||'zapliberal',data:{url:url.href}}),self.zapReceipts.received(data)]));});
self.addEventListener('notificationclick',e=>{e.notification.close();const target=e.notification.data?.url,fallback=new URL('./index.html',self.registration.scope).href,url=typeof target==='string'&&target.startsWith(self.registration.scope)?target:fallback;e.waitUntil(Promise.all([self.zapReceipts.flush(),self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async windows=>{for(const w of windows)if(w.url.startsWith(self.registration.scope)){await w.navigate(url);await w.focus();return;}return self.clients.openWindow(url);})]));});

self.addEventListener('message',e=>{if(e.data?.type==='flush-receipts')e.waitUntil(self.zapReceipts.flush());});

self.addEventListener('message',e=>{if(e.data?.type==='forget-room')e.waitUntil(self.zapReceipts.forget(e.data.room));});
