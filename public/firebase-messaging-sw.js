self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const sendNotification = (data) => {
        const title = data.title || 'New Water Bill';
        const options = {
            body: data.body || 'Your latest water bill is now available.',
            icon: '/logo.png',
            badge: '/logo.png',
            data: data
        };

        return self.registration.showNotification(title, options);
    };

    if (event.data) {
        const data = event.data.json();
        event.waitUntil(sendNotification(data));
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    
    if (event.notification.data && event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    } else {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});