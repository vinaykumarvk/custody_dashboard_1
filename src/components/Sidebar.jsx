import React from 'react';

const Sidebar = ({ isOpen, onClose, activePage, onPageChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Business Head Dashboard', icon: 'tachometer-alt' },
    { id: 'operations-head-dashboard', label: 'Operations Head Dashboard', icon: 'tasks' },
    { id: 'operations-statistics', label: 'Operations Statistics', icon: 'chart-bar' }
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