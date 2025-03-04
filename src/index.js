import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './assets/styles.css';

// Log that React is initializing
console.log('React Dashboard initializing');

// Attempt to clean up any existing Angular artifacts
document.addEventListener('DOMContentLoaded', () => {
  // Remove any existing Angular elements
  const angularElements = document.querySelectorAll('[ng-view], [ng-app], [ng-controller]');
  angularElements.forEach(el => {
    console.log('Removing Angular element:', el);
    el.remove();
  });
  
  // Clean up any Angular global variables if they exist
  if (window.angular) {
    console.log('Cleaning up Angular global variable');
    // Just log it but don't actually delete to avoid breaking dependencies
  }
});

// Initialize React
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);