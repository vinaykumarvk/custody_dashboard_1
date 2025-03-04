import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import './assets/styles.css';

const App = () => {
  return (
    <div className="app-container">
      <Header userName="Smart Bank Admin" />
      <div className="main-content">
        <Dashboard />
      </div>
    </div>
  );
};

export default App;