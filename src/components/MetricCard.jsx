import React from 'react';

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = '#007C75',
  valueClassName = ''
}) => {
  return (
    <div className="metric-card">
      {icon && (
        <div className="icon" style={{ color }}>
          <i className={`fas fa-${icon}`}></i>
        </div>
      )}
      <div className={`value ${valueClassName}`} style={{ color }}>{value}</div>
      <div className="title">{title}</div>
      {subtitle && <div className="subtitle">{subtitle}</div>}
    </div>
  );
};

export default MetricCard;