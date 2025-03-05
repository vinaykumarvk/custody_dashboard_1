import React from 'react';

const Header = ({ userName = 'Admin User', toggleSidebar, sidebarOpen }) => {
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
        
        <div className="notifications">
          <i className="fas fa-bell"></i>
          <span className="badge">3</span>
        </div>
        
        <div className="user-info">
          <div className="user-avatar">
            {userName.charAt(0)}
          </div>
          <span className="user-name">{userName}</span>
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;