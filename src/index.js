import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './assets/styles.css';

// Log that React is initializing
console.log('React Dashboard initializing');

// Handle DOM ready event
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing React app');
});

// Initialize React
const container = document.getElementById('root');
if (!container) {
  console.error('Root element not found! Cannot mount React app.');
} else {
  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// React application initialized