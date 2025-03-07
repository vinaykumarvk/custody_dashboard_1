import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CorporateActions from './components/CorporateActions';
import Trades from './components/Trades';
import Settlements from './components/Settlements';
import Customers from './components/Customers';
import Income from './components/Income';
import Reports from './components/Reports';
import Settings from './components/Settings';
import './assets/styles.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [compactView, setCompactView] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleCompactView = () => {
    setCompactView(!compactView);
  };

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    console.log(`Navigating to page: ${pageId}`);
  };

  useEffect(() => {
    console.log('React App component mounted');
    
    // Apply a custom attribute to identify React-rendered content
    document.body.setAttribute('data-react-app', 'true');
    
    // Check for any Angular elements that might exist
    const angularElements = document.querySelectorAll('[ng-view], [ng-app], [ng-controller]');
    if (angularElements.length > 0) {
      console.warn('Angular elements still detected after React mount:', angularElements);
    }
    
    // Add responsive sidebar handling
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Set initial state based on window size
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      console.log('React App component unmounted');
      document.body.removeAttribute('data-react-app');
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const renderPage = () => {
    // Switch between different page components based on activePage
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'trades':
        return <Trades />;
      case 'settlements':
        return <Settlements />;
      case 'corporate-actions':
        return <CorporateActions />;
      case 'customers':
        return <Customers />;
      case 'income':
        return <Income />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${compactView ? 'compact-view' : ''}`} data-react-root="true">
      <Header 
        userName="Smart Bank Admin" 
        toggleSidebar={toggleSidebar} 
        sidebarOpen={sidebarOpen}
        compactView={compactView}
        toggleCompactView={toggleCompactView}
      />
      
      <div className="app-content">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={toggleSidebar}
          activePage={activePage}
          onPageChange={handlePageChange}
          compactView={compactView}
        />
        
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;