import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './assets/styles.css';
import { initAngularMonitor } from './angular-monitor';

// Log that React is initializing
console.log('React Dashboard initializing');

// Disable Angular autoboot process if it's happening
if (window.name === 'NG_DEFER_BOOTSTRAP!') {
  console.warn('Found Angular autoboot in process, disabling');
  window.name = '';
}

// Define a global variable to explicitly prevent Angular from initializing
window.PREVENT_ANGULAR_BOOTSTRAP = true;
window.angular = null; // Nullify any potential Angular object

// Handle DOM ready event
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing React and Angular monitor');
  
  // Initialize the Angular monitor to detect and report any Angular elements
  initAngularMonitor();
  
  // Check for script tags that might be loading Angular
  const scriptTags = document.querySelectorAll('script');
  scriptTags.forEach(script => {
    const src = script.getAttribute('src') || '';
    if (src.includes('angular') || script.textContent.includes('angular')) {
      console.warn('Detected potential Angular script:', script);
    }
  });
  
  // Additional check for Angular bootstrapping elements
  const htmlElement = document.documentElement;
  if (htmlElement.hasAttribute('ng-app')) {
    console.warn('Found ng-app on HTML element, removing');
    htmlElement.removeAttribute('ng-app');
  }
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

// Prevent possible external Angular initialization
Object.defineProperty(window, 'angular', {
  configurable: true,
  get: function() {
    console.warn('Attempted to access window.angular, but it has been disabled');
    return null;
  },
  set: function(val) {
    console.warn('Attempted to set window.angular, but it has been disabled');
    return null;
  }
});