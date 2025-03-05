import React, { useState } from 'react';

const DateRangeFilter = ({ onFilterChange }) => {
  const [range, setRange] = useState('30d'); // Default to 30 days
  
  const handleRangeChange = (newRange) => {
    setRange(newRange);
    
    let startDate = new Date();
    const endDate = new Date();
    
    switch(newRange) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case 'ytd':
        startDate = new Date(new Date().getFullYear(), 0, 1); // Jan 1st of current year
        break;
      case 'all':
        startDate = null; // No start date limit
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }
    
    onFilterChange({
      startDate,
      endDate,
      range: newRange
    });
  };
  
  return (
    <div className="date-range-filter">
      <button 
        className={`filter-btn ${range === '7d' ? 'active' : ''}`} 
        onClick={() => handleRangeChange('7d')}
      >
        7D
      </button>
      <button 
        className={`filter-btn ${range === '30d' ? 'active' : ''}`} 
        onClick={() => handleRangeChange('30d')}
      >
        30D
      </button>
      <button 
        className={`filter-btn ${range === '90d' ? 'active' : ''}`} 
        onClick={() => handleRangeChange('90d')}
      >
        90D
      </button>
      <button 
        className={`filter-btn ${range === '1y' ? 'active' : ''}`} 
        onClick={() => handleRangeChange('1y')}
      >
        1Y
      </button>
      <button 
        className={`filter-btn ${range === 'ytd' ? 'active' : ''}`} 
        onClick={() => handleRangeChange('ytd')}
      >
        YTD
      </button>
      <button 
        className={`filter-btn ${range === 'all' ? 'active' : ''}`} 
        onClick={() => handleRangeChange('all')}
      >
        ALL
      </button>
    </div>
  );
};

export default DateRangeFilter;