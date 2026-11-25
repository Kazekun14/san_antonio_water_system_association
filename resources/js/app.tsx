// Polyfill/Fix for Inertia.js v2 History State Null Bug
try {
    const originalStateDescriptor = Object.getOwnPropertyDescriptor(History.prototype, 'state');
    if (originalStateDescriptor && originalStateDescriptor.get) {
        Object.defineProperty(History.prototype, 'state', {
            get() {
                const state = originalStateDescriptor.get!.call(this);
                return state === null ? { page: null } : state;
            },
            configurable: true,
            enumerable: true
        });
    }
} catch (e) {
    console.error('Failed to patch History.state:', e);
}

import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} | ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
