import React from 'react';

const Sidebar = ({ isOpen, onClose, activePage, onPageChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'tachometer-alt' },
    { id: 'trades', label: 'Trades', icon: 'exchange-alt' },
    { id: 'customers', label: 'Customers', icon: 'users' },
    { id: 'income', label: 'Income', icon: 'chart-line' },
    { id: 'corporate-actions', label: 'Corporate Actions', icon: 'building' },
    { id: 'settlements', label: 'Settlements', icon: 'money-check-alt' },
    { id: 'operations-statistics', label: 'Operations Statistics', icon: 'chart-bar' },
    { id: 'reports', label: 'Reports', icon: 'file-alt' },
    { id: 'settings', label: 'Settings', icon: 'cog' }
  ];

  const handleMenuClick = (pageId) => {
    onPageChange(pageId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>Navigation</h3>
        <button className="close-sidebar" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li
              key={item.id}
              className={activePage === item.id ? 'active' : ''}
              onClick={() => handleMenuClick(item.id)}
            >
              <i className={`fas fa-${item.icon}`}></i>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-footer">
        <p>Smart Bank Custody Solutions</p>
        <p>Version 2.5.1</p>
      </div>
    </div>
  );
};

export default Sidebar;