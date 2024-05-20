// sw.js
self.addEventListener('push', function(event) {
    const options = {
        body: event.data.text(),
        icon: '', // Path to your notification icon
        badge: '' // Path to your badge icon
    };

    event.waitUntil(
        self.registration.showNotification('Daily Notification', options)
    );
});