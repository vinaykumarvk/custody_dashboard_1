import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BusinessHeadDashboard from './components/BusinessHeadDashboard';
import OperationsHeadDashboard from './components/OperationsHeadDashboard';
import OperationsStatistics from './components/OperationsStatistics';
import './assets/styles.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    console.log(`Navigating to page: ${pageId}`);
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
        return <BusinessHeadDashboard />;
      case 'operations-head-dashboard':
        return <OperationsHeadDashboard />;
      case 'operations-statistics':
        return <OperationsStatistics />;
      default:
        return <BusinessHeadDashboard />;
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