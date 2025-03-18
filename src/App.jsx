import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './assets/styles.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Helper function to convert URL path to page ID
  const getPageIdFromPath = (path) => {
    if (path.includes('/operations-head')) return 'operations-head-dashboard';
    if (path.includes('/operations-stats')) return 'operations-statistics';
    return 'dashboard';
  };
  
  const [activePage, setActivePage] = useState(() => getPageIdFromPath(location.pathname));
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    console.log(`Navigating to page: ${pageId}`);
    
    // Convert page ID to URL path
    let newPath = '/';
    if (pageId === 'operations-head-dashboard') newPath = '/operations-head';
    if (pageId === 'operations-statistics') newPath = '/operations-stats';
    
    // Use React Router to navigate
    navigate(newPath);
  };

  // Update active page when route changes
  useEffect(() => {
    const newPageId = getPageIdFromPath(location.pathname);
    if (newPageId !== activePage) {
      setActivePage(newPageId);
    }
  }, [location.pathname, activePage]);

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
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default App;