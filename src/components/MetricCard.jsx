import React from 'react';

const MetricCard = ({ 
  title, 
  value, 
  subtitle = '', 
  icon = null, 
  color = '#007C75', 
  trend = null, 
  onClick = null
}) => {
  // Format trend value for display if present
  const getTrendDisplay = () => {
    if (!trend) return null;
    
    const isPositive = parseFloat(trend) >= 0;
    const trendClass = isPositive ? 'positive' : 'negative';
    const trendIcon = isPositive ? 'fa-arrow-up' : 'fa-arrow-down';
    
    return (
      <div className={`trend ${trendClass}`}>
        <i className={`fas ${trendIcon} me-1`}></i>
        {isPositive ? '+' : ''}{trend}%
      </div>
    );
  };
  
  // Generate inline styles for the card
  const cardStyle = {
    borderTop: `3px solid ${color}`,
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: onClick ? 'pointer' : 'default'
  };
  
  const iconContainerStyle = {
    backgroundColor: color,
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    marginRight: '15px'
  };

  // Handle card click
  const handleClick = () => {
    if (onClick) onClick();
  };
  
  return (
    <div 
      className="card metric-card h-100" 
      style={cardStyle}
      onClick={handleClick}
    >
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          {icon && (
            <div style={iconContainerStyle}>
              <i className={`fas fa-${icon}`}></i>
            </div>
          )}
          <h5 className="card-title mb-0">{title}</h5>
        </div>
        
        <div className="metric-value">
          <h2 className={value && value.length > 8 ? 'fs-3' : 'fs-2'}>
            {value || '—'}
          </h2>
          
          {subtitle && (
            <p className="card-text text-muted">{subtitle}</p>
          )}
          
          {getTrendDisplay()}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;