import React, { useState } from 'react';

/**
 * DateRangeFilter - A component for selecting date range filters
 * 
 * @param {Object} props Component props
 * @param {string} props.activeRange Currently active range
 * @param {Function} props.onFilterChange Function to call when range changes
 * @param {Array} props.options Array of options with id and label
 * @returns {JSX.Element} Date range filter component
 */
const DateRangeFilter = ({ options = [], onFilterChange }) => {
  // Default options if none provided
  const defaultOptions = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: 'ytd', label: 'YTD' },
    { id: 'all', label: 'All Time' }
  ];
  
  // Use provided options or fall back to defaults
  const filterOptions = options.length > 0 ? options : defaultOptions;
  
  // Initialize active range to 30 days by default
  const [activeRange, setActiveRange] = useState('30d');
  
  // Handle filter change
  const handleFilterChange = (rangeId) => {
    setActiveRange(rangeId);
    
    // Calculate date range based on selected filter
    const endDate = new Date();
    let startDate = null;
    
    switch (rangeId) {
      case '7d':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);
        break;
      case 'ytd':
        startDate = new Date(endDate.getFullYear(), 0, 1); // January 1st of current year
        break;
      case 'all':
        // No startDate for all data
        startDate = null;
        break;
      default:
        // Default to 30 days
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
    }
    
    // Call parent component's filter change handler
    onFilterChange({
      startDate,
      endDate,
      range: rangeId
    });
  };
  
  return (
    <div className="date-range-filter">
      <div className="btn-group" role="group" aria-label="Date range filter">
        {filterOptions.map(option => (
          <button
            key={option.id}
            type="button"
            className={`btn ${activeRange === option.id ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handleFilterChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateRangeFilter;