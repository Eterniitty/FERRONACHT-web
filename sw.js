/* FERRONACHT web: funciona sin conexión tras la primera carga.
   Red primero (así cada versión nueva llega en cuanto se publica) y, si no hay red, la copia guardada. */
const CACHE = 'ferronacht-web-v1';
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => {
	const req = e.request;
	if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) { return; }
	e.respondWith(fetch(req).then((res) => {
		if (res.ok && res.type === 'basic') {
			const copy = res.clone();
			caches.open(CACHE).then((c) => c.put(req, copy));
		}
		return res;
	}).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || Response.error())));
});
