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
import OperationsAlerts from './components/OperationsAlerts';
import OperationsStatistics from './components/OperationsStatistics';
import ClientList from './components/details/ClientList';
import ClientDetail from './components/details/ClientDetail';
import './assets/styles.css';

// Create a context for navigation
export const NavigationContext = React.createContext({
  navigateTo: () => {},
  currentPage: '',
  currentView: '',
  currentId: null
});

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentView, setCurrentView] = useState('main'); // 'main', 'list', 'detail'
  const [currentId, setCurrentId] = useState(null);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle navigation between pages/views
  const navigateTo = (destination, id = null) => {
    console.log(`Navigating to: ${destination}`, id ? `with ID: ${id}` : '');
    
    if (destination === 'back') {
      // Handle back navigation
      if (currentView === 'detail') {
        setCurrentView('list');
        setCurrentId(null);
      } else if (currentView === 'list') {
        setCurrentView('main');
        setCurrentPage('operations-statistics');
      }
      return;
    }
    
    if (destination.includes('/')) {
      // Handle path-like navigation (e.g., "clients/1001")
      const [page, itemId] = destination.split('/');
      setCurrentPage(page);
      setCurrentView(itemId ? 'detail' : 'list');
      setCurrentId(itemId ? parseInt(itemId) : null);
    } else {
      // Handle simple page navigation
      setCurrentPage(destination);
      setCurrentView('main');
      setCurrentId(null);
    }
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

  // Create the navigation context value
  const navigationContext = {
    navigateTo,
    currentPage,
    currentView,
    currentId
  };

  // Render the appropriate component based on current page and view
  const renderContent = () => {
    if (currentView === 'list' && currentPage === 'clients') {
      return <ClientList />;
    }
    
    if (currentView === 'detail' && currentPage === 'clients' && currentId) {
      return <ClientDetail clientId={currentId} />;
    }
    
    // Main views
    switch (currentPage) {
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
      case 'operations-alerts':
        return <OperationsAlerts />;
      case 'operations-statistics':
        return <OperationsStatistics />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <NavigationContext.Provider value={navigationContext}>
      <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} data-react-root="true">
        <Header 
          userName="Smart Bank Admin" 
          toggleSidebar={toggleSidebar} 
          sidebarOpen={sidebarOpen}
        />
        
        <div className="app-content">
          {currentView === 'main' && (
            <Sidebar 
              isOpen={sidebarOpen} 
              onClose={toggleSidebar}
              activePage={currentPage}
              onPageChange={(pageId) => navigateTo(pageId)}
            />
          )}
          
          <main className="main-content">
            {renderContent()}
          </main>
        </div>
      </div>
    </NavigationContext.Provider>
  );
};

export default App;