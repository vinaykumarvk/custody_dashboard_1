import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import OperationsHeadDashboard from './components/OperationsHeadDashboard';
import OperationsStatistics from './components/OperationsStatistics';
import './assets/styles.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Initialize activePage based on URL path or default to 'dashboard'
  const getInitialPage = () => {
    const path = window.location.pathname;
    if (path.includes('operations-head')) return 'operations-head-dashboard';
    if (path.includes('operations-stats')) return 'operations-statistics';
    return 'dashboard';
  };
  
  const [activePage, setActivePage] = useState(getInitialPage);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    console.log(`Navigating to page: ${pageId}`);
    
    // Update browser URL for deep linking/bookmarking support
    let newPath = '/';
    if (pageId === 'operations-head-dashboard') newPath = '/operations-head';
    if (pageId === 'operations-statistics') newPath = '/operations-stats';
    
    // Use history API to update URL without full page reload
    window.history.pushState(
      { pageId },
      document.title,
      newPath
    );
  };

  useEffect(() => {
    console.log('React App component mounted');
    
    // Apply a custom attribute to identify React-rendered content
    document.body.setAttribute('data-react-app', 'true');
    
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
    
    // Handle browser back/forward navigation
    const handlePopState = (event) => {
      const pageId = event.state?.pageId || getInitialPage();
      setActivePage(pageId);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      console.log('React App component unmounted');
      document.body.removeAttribute('data-react-app');
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const renderPage = () => {
    // Switch between different page components based on activePage
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'operations-head-dashboard':
        return <OperationsHeadDashboard />;
      case 'operations-statistics':
        return <OperationsStatistics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} data-react-root="true">
      <Header 
        userName="Smart Bank Admin" 
        toggleSidebar={toggleSidebar} 
        sidebarOpen={sidebarOpen}
      />
      
      <div className="app-content">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={toggleSidebar}
          activePage={activePage}
          onPageChange={handlePageChange}
        />
        
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;