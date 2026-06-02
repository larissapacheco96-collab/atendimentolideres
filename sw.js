self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'OBDC', {
      body: data.body || '',
      icon: data.icon || '',
      tag: data.tag || 'obdc-notif',
      renotify: true,
      requireInteraction: true,
      data: { url: data.url || self.location.origin }
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      for (const c of cs) {
        if (c.url && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(e.notification.data.url);
    })
  );
});

// Mantém o SW ativo
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
