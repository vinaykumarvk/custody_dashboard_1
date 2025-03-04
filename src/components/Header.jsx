import React from 'react';

const Header = ({ userName = 'Admin User' }) => {
  return (
    <header className="header">
      <div className="logo">
        <img src="/images/logo.png" alt="Smart Bank Logo" onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23FFFFFF" /><text x="50%" y="50%" font-family="Arial" font-size="12" fill="%23007C75" text-anchor="middle" dominant-baseline="middle">SB</text></svg>';
        }} />
        <h1>eMACH Custody Dashboard</h1>
      </div>
      <div className="user-info">
        <div className="user-avatar">
          {userName.charAt(0)}
        </div>
        <span>{userName}</span>
      </div>
    </header>
  );
};

export default Header;