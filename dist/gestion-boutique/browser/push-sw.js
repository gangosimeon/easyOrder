// Service Worker personnalisé pour les Web Push Notifications
// Ce fichier gère la réception et l'affichage des notifications push
// ainsi que le clic sur une notification.

self.addEventListener('push', function (event) {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { notification: { title: 'Nouvelle commande', body: event.data.text() } };
  }

  const notification = data.notification || {};
  const title   = notification.title  || 'Nouvelle commande reçue';
  const options = {
    body:    notification.body    || 'Une nouvelle commande vient d\'être passée.',
    icon:    notification.icon    || '/assets/icons/web-app-manifest-192x192.png',
    badge:   notification.badge   || '/assets/icons/web-app-manifest-96x96.png',
    vibrate: notification.vibrate || [200, 100, 200],
    data:    notification.data    || { url: '/orders' },
    tag:     'new-order',
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : '/orders';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // Si l'app est déjà ouverte, on focus et on navigue
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          if ('navigate' in client) {
            return client.navigate(targetUrl);
          }
          return;
        }
      }
      // Sinon, on ouvre un nouvel onglet
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
