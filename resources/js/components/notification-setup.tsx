import { useEffect } from 'react';
import axios from 'axios';

const VAPID_KEY = "BB0FO1THNOWTOexAIbDjJtwuJoD9S8B4QZ-v3ewONpq_htmdV2EcwhsszThJvphoJ9ZY391lPln0czFb9IulOZQ";

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default function NotificationSetup() {
    useEffect(() => {
        const setupNotifications = async () => {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                console.warn('Push messaging is not supported');
                return;
            }

            try {
                // Register Service Worker
                const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                
                // Request permission
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    // Subscribe for push
                    const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(VAPID_KEY)
                    });

                    if (subscription) {
                        // Send subscription to server
                        await axios.post('/fcm/token', subscription);
                        console.log('Push Subscription saved successfully');
                    }
                } else {
                    console.log('Unable to get permission to notify.');
                }

            } catch (error) {
                console.error('An error occurred while setting up notifications:', error);
            }
        };

        setupNotifications();
    }, []);

    return null; // This component doesn't render anything UI-wise
}
