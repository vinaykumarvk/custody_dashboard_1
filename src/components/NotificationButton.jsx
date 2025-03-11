import React from 'react';
import './NotificationButton.css';

const NotificationButton = ({ count, onClick, type = 'default' }) => {
  // Only show the notification button if there are notifications
  if (!count || count <= 0) return null;
  
  const getTypeClass = () => {
    switch (type) {
      case 'urgent':
        return 'notification-urgent';
      case 'warning':
        return 'notification-warning';
      default:
        return '';
    }
  };
  
  return (
    <button 
      className={`notification-button ${getTypeClass()}`} 
      onClick={onClick}
      title={`You have ${count} ${type} notification${count !== 1 ? 's' : ''}`}
    >
      <span className="notification-count">{count}</span>
      <span className="notification-icon">!</span>
    </button>
  );
};

export default NotificationButton;