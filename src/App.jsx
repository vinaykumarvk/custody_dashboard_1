import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import OperationsAlerts from './components/OperationsAlerts';
import OperationsStatistics from './components/OperationsStatistics';
import ClientList from './components/details/ClientList';
import ClientDetail from './components/details/ClientDetail';
import './assets/styles.css';

// Main App component with React Router integration
const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Convert path to activePage format
  const getActivePageFromPath = (path) => {
    // Extract the first segment of the path
    const segment = path.split('/')[1] || 'dashboard';
    return segment;
  };
  
  const [activePage, setActivePage] = useState(() => getActivePageFromPath(window.location.pathname));
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    console.log(`Navigating to page: ${pageId}`);
    navigate(`/${pageId}`);
  };

  useEffect(() => {
    // Update activePage when location changes
    const currentPage = getActivePageFromPath(location.pathname);
    if (currentPage !== activePage && !location.pathname.includes('/clients/')) {
      setActivePage(currentPage);
    }
  }, [location.pathname, activePage]);

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

  // Check if we're on a detail page
  const isDetailPage = location.pathname.startsWith('/clients/') && location.pathname.split('/').length > 2;

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} data-react-root="true">
      <Header 
        userName="Smart Bank Admin" 
        toggleSidebar={toggleSidebar} 
        sidebarOpen={sidebarOpen}
      />
      
      <div className="app-content">
        {!isDetailPage && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={toggleSidebar}
            activePage={activePage}
            onPageChange={handlePageChange}
          />
        )}
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/settlements" element={<Settlements />} />
            <Route path="/corporate-actions" element={<CorporateActions />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/income" element={<Income />} />
            <Route path="/operations-alerts" element={<OperationsAlerts />} />
            <Route path="/operations-statistics" element={<OperationsStatistics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Client drill-down routes */}
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/:clientId" element={<ClientDetail />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Wrapper component to provide Router context
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;