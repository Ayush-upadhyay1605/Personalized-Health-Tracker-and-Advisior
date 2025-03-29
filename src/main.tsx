
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Make sure we're using the correct React instance
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}

// Only load MSW in development, not for production builds
// This prevents the service worker registration error during deployment
if (import.meta.env.DEV && window.location.hostname === 'localhost') {
  import('./mocks/browser').then(({ worker }) => {
    worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
      onUnhandledRequest: 'bypass',
    });
  });
}
