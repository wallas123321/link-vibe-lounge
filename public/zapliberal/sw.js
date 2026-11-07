const CACHE='zapliberal-web-v1';
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./index.html','./app.css','./app.js','./crypto.js','./icon-192.png'])).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('zapliberal-web-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||!u.pathname.startsWith('/zapliberal/'))return;e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));});
self.addEventListener('push',e=>{let data={};try{data=e.data.json();}catch{}e.waitUntil(self.registration.showNotification('ZapLiberal',{body:data.body||'Há novidades no seu grupo.',icon:'./icon-192.png',badge:'./icon-192.png',tag:data.tag||'zapliberal',data:{url:new URL('./index.html',self.registration.scope).href}}));});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async windows=>{for(const w of windows)if(w.url.startsWith(self.registration.scope)){await w.focus();return;}return self.clients.openWindow(new URL('./index.html',self.registration.scope).href);}));});

