import React, { useState } from 'react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'tachometer-alt' },
    { id: 'customers', label: 'Customers', icon: 'users' },
    { id: 'trades', label: 'Trades', icon: 'exchange-alt' },
    { id: 'corporate-actions', label: 'Corporate Actions', icon: 'file-contract' },
    { id: 'deal-processing', label: 'Deal Processing', icon: 'file-invoice-dollar' },
    { id: 'reports', label: 'Reports', icon: 'chart-bar' },
    { id: 'settings', label: 'Settings', icon: 'cog' },
  ];

  const handleMenuClick = (itemId) => {
    setActiveItem(itemId);
    // On mobile, close the sidebar after selecting an item
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>Menu</h3>
        <button className="close-sidebar" onClick={toggleSidebar}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li 
              key={item.id}
              className={activeItem === item.id ? 'active' : ''}
              onClick={() => handleMenuClick(item.id)}
            >
              <i className={`fas fa-${item.icon}`}></i>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <span>© 2025 Smart Bank</span>
      </div>
    </aside>
  );
};

export default Sidebar;