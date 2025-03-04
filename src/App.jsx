import React, { useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import './assets/styles.css';

const App = () => {
  useEffect(() => {
    console.log('React App component mounted');
    
    // Apply a custom attribute to identify React-rendered content
    document.body.setAttribute('data-react-app', 'true');
    
    // Check for any Angular elements that might exist
    const angularElements = document.querySelectorAll('[ng-view], [ng-app], [ng-controller]');
    if (angularElements.length > 0) {
      console.warn('Angular elements still detected after React mount:', angularElements);
    }
    
    return () => {
      console.log('React App component unmounted');
      document.body.removeAttribute('data-react-app');
    };
  }, []);

  return (
    <div className="app-container" data-react-root="true">
      <Header userName="Smart Bank Admin" />
      <div className="main-content">
        <Dashboard />
      </div>
    </div>
  );
};

export default App;