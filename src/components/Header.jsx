import React, { useState, useEffect } from 'react';
import { fetchData, markNotificationAsRead, markAllNotificationsAsRead } from '../services/api';

const Header = ({ userName = 'Smart Bank Admin', toggleSidebar, sidebarOpen }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Load notifications from API
  useEffect(() => {
    const getNotifications = async () => {
      setLoading(true);
      try {
        const data = await fetchData('notifications');
        // Ensure we're getting an array
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          console.warn('Notifications API did not return an array:', data);
          // Use fallback data from mock API
          const mockData = await import('../utils').then(module => module.mockApiCall('notifications'));
          setNotifications(Array.isArray(mockData) ? mockData : []);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Use fallback data from mock API
        try {
          const mockData = await import('../utils').then(module => module.mockApiCall('notifications'));
          setNotifications(Array.isArray(mockData) ? mockData : []);
        } catch (mockError) {
          console.error('Failed to load mock notifications data:', mockError);
          setNotifications([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    getNotifications();
  }, []);
  
  // Count unread notifications - ensure notifications is an array
  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;
  
  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      if (Array.isArray(notifications)) {
        setNotifications(notifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      if (Array.isArray(notifications)) {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Toggle user dropdown
  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setShowUserDropdown(!showUserDropdown);
    if (!showUserDropdown) {
      setShowNotifications(false);
    }
  };
  
  // Toggle notifications panel
  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setShowUserDropdown(false);
    }
  };
  
  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'warning': return 'fa-exclamation-triangle';
      case 'success': return 'fa-check-circle';
      case 'info': default: return 'fa-info-circle';
    }
  };
  
  // Get color for notification type
  const getNotificationColor = (type) => {
    switch(type) {
      case 'warning': return '#FFC107';
      case 'success': return '#28A745';
      case 'info': default: return '#17A2B8';
    }
  };
  
  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if clicking outside of the dropdowns
      const isOutsideUserDropdown = showUserDropdown && 
        !event.target.closest('.user-info') && 
        !event.target.closest('.user-dropdown');
      
      const isOutsideNotifications = showNotifications && 
        !event.target.closest('.notifications') && 
        !event.target.closest('.notifications-panel');
      
      if (isOutsideUserDropdown) {
        setShowUserDropdown(false);
      }
      
      if (isOutsideNotifications) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserDropdown, showNotifications]);
  
  return (
    <header className="header">
      <div className="menu-toggle" onClick={toggleSidebar}>
        <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </div>
      
      <div className="logo">
        <img src="/images/logo.svg" alt="Smart Bank Logo" onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23FFFFFF" /><text x="50%" y="50%" font-family="Arial" font-size="12" fill="%23007C75" text-anchor="middle" dominant-baseline="middle">SB</text></svg>';
        }} />
        <h1>Custody Dashboard</h1>
      </div>
      
      <div className="header-actions">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search..." />
        </div>
        
        {/* Notifications dropdown */}
        <div className="notifications" onClick={toggleNotifications}>
          <i className="fas fa-bell"></i>
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          
          {showNotifications && !showAllNotifications && (
            <div className="dropdown-menu notifications-panel" onClick={e => e.stopPropagation()}>
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <button className="btn-text" onClick={markAllAsRead}>Mark all as read</button>
              </div>
              <div className="notifications-list">
                {Array.isArray(notifications) && notifications.slice(0, 5).map(notification => (
                  <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                    <div className="notification-icon" style={{ color: getNotificationColor(notification.type) }}>
                      <i className={`fas ${getNotificationIcon(notification.type)}`}></i>
                    </div>
                    <div className="notification-content">
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    <div className="notification-actions">
                      {!notification.read && (
                        <button className="btn-icon" title="Mark as read" onClick={() => markAsRead(notification.id)}>
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <button className="btn-view-all" onClick={() => setShowAllNotifications(true)}>
                  View All Notifications
                </button>
              </div>
            </div>
          )}
          
          {/* All Notifications View */}
          {showNotifications && showAllNotifications && (
            <div className="dropdown-menu notifications-panel all-notifications" onClick={e => e.stopPropagation()}>
              <div className="dropdown-header">
                <button className="btn-back" onClick={() => setShowAllNotifications(false)}>
                  <i className="fas fa-arrow-left"></i> Back
                </button>
                <h3>All Notifications</h3>
                <button className="btn-text" onClick={markAllAsRead}>
                  Mark all as read
                </button>
              </div>
              
              <div className="notifications-filters">
                <div className="filter-group">
                  <span>Filter:</span>
                  <button className="btn-filter active">All</button>
                  <button className="btn-filter">Unread</button>
                  <button className="btn-filter">Read</button>
                </div>
                <div className="search-notifications">
                  <i className="fas fa-search"></i>
                  <input type="text" placeholder="Search notifications..." />
                </div>
              </div>
              
              <div className="notifications-list">
                {Array.isArray(notifications) && notifications.map(notification => (
                  <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                    <div className="notification-icon" style={{ color: getNotificationColor(notification.type) }}>
                      <i className={`fas ${getNotificationIcon(notification.type)}`}></i>
                    </div>
                    <div className="notification-content">
                      <div className="notification-category">{notification.category}</div>
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    <div className="notification-actions">
                      {!notification.read && (
                        <button 
                          className="btn-icon" 
                          title="Mark as read" 
                          onClick={() => markAsRead(notification.id)}
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      <button className="btn-icon" title="Delete">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="dropdown-footer">
                <div className="pagination">
                  <button className="pagination-btn disabled">
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <span className="pagination-info">Page 1 of 1</span>
                  <button className="pagination-btn disabled">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* User dropdown */}
        <div className="user-info" onClick={toggleUserDropdown}>
          <div className="user-avatar">
            {userName.charAt(0)}
          </div>
          <span className="user-name">{userName}</span>
          <i className={`fas fa-chevron-${showUserDropdown ? 'up' : 'down'}`}></i>
          
          {showUserDropdown && (
            <div className="dropdown-menu user-dropdown" onClick={e => e.stopPropagation()}>
              <div className="dropdown-item">
                <i className="fas fa-user"></i>
                <span>My Profile</span>
              </div>
              <div className="dropdown-item">
                <i className="fas fa-cog"></i>
                <span>Account Settings</span>
              </div>
              <div className="dropdown-item">
                <i className="fas fa-lock"></i>
                <span>Change Password</span>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item">
                <i className="fas fa-question-circle"></i>
                <span>Help & Support</span>
              </div>
              <div className="dropdown-item">
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;