import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Dashboard from './components/Dashboard';
import OperationsHeadDashboard from './components/OperationsHeadDashboard';
import OperationsStatistics from './components/OperationsStatistics';
import './assets/styles.css';

// Log that React is initializing
console.log('React Dashboard initializing');

// Handle DOM ready event
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing React app');
});

// Create router with our routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/operations-head',
        element: <OperationsHeadDashboard />
      },
      {
        path: '/operations-stats',
        element: <OperationsStatistics />
      }
    ]
  }
]);

// Initialize React
const container = document.getElementById('root');
if (!container) {
  console.error('Root element not found! Cannot mount React app.');
} else {
  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

// React application initialized