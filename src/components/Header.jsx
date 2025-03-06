import React, { useState } from 'react';

const Header = ({ userName = 'Smart Bank Admin', toggleSidebar, sidebarOpen }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'warning',
      message: 'Settlement deadline approaching for T-78950',
      time: '10 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      message: 'New corporate action announced for AAPL',
      time: '30 minutes ago',
      read: false
    },
    {
      id: 3,
      type: 'success',
      message: 'Trade T-78946 successfully settled',
      time: '1 hour ago',
      read: false
    },
    {
      id: 4,
      type: 'info',
      message: 'Client statement generated for BlackRock Inc.',
      time: '2 hours ago',
      read: true
    },
    {
      id: 5,
      type: 'warning',
      message: 'System maintenance scheduled for tonight 22:00-23:00 UTC',
      time: '3 hours ago',
      read: true
    }
  ];
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
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
    const handleClickOutside = () => {
      setShowUserDropdown(false);
      setShowNotifications(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
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
          
          {showNotifications && (
            <div className="dropdown-menu notifications-panel" onClick={e => e.stopPropagation()}>
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <button className="btn-text">Mark all as read</button>
              </div>
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                    <div className="notification-icon" style={{ color: getNotificationColor(notification.type) }}>
                      <i className={`fas ${getNotificationIcon(notification.type)}`}></i>
                    </div>
                    <div className="notification-content">
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    <div className="notification-actions">
                      <button className="btn-icon" title="Mark as read">
                        <i className="fas fa-check"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <button className="btn-view-all">View All Notifications</button>
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