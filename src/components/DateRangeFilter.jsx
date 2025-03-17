import React, { useState } from 'react';

/**
 * DateRangeFilter - A component for selecting date range filters
 * 
 * @param {Object} props Component props
 * @param {string} props.activeRange Currently active range
 * @param {Function} props.onFilterChange Function to call when range changes
 * @param {Function} props.onChange Alternative callback name for range changes
 * @param {Array} props.options Array of options with id and label
 * @returns {JSX.Element} Date range filter component
 */
const DateRangeFilter = ({ options = [], onFilterChange, onChange }) => {
  // Support both onFilterChange and onChange props for backward compatibility
  const handleChange = onChange || onFilterChange;
  // Default options if none provided
  const defaultOptions = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: 'ytd', label: 'YTD' },
    { id: 'all', label: 'All Time' }
  ];
  
  console.log('DateRangeFilter initialized with options:', defaultOptions);
  
  // Use provided options or fall back to defaults
  const filterOptions = options.length > 0 ? options : defaultOptions;
  
  // Initialize active range to 30 days by default
  const [activeRange, setActiveRange] = useState('30d');
  
  // Call filter change on mount to set initial state
  React.useEffect(() => {
    // Trigger the initial filter on component mount
    if (handleChange) {
      handleFilterChange('30d');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Handle filter change
  const handleFilterChange = (rangeId) => {
    setActiveRange(rangeId);
    
    // Calculate date range based on selected filter
    const endDate = new Date();
    let startDate = null;
    
    console.log(`Filter change requested: ${rangeId}`);
    
    // Convert to lowercase for case-insensitive comparison
    // Make sure rangeId is defined before calling toLowerCase
    const rangeIdLower = rangeId ? rangeId.toLowerCase() : '30d';
    
    switch (rangeIdLower) {
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
        console.log(`Unrecognized range ID: ${rangeId}`);
        // Default to 30 days
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
    }
    
    // Call parent component's filter change handler
    if (handleChange) {
      // If onChange was passed directly to a setState function, just pass the ID
      if (typeof onChange === 'function' && !onFilterChange) {
        onChange(rangeId);
      } else {
        // Otherwise pass the full object
        handleChange({
          startDate,
          endDate,
          range: rangeId
        });
      }
    } else {
      console.warn('DateRangeFilter: No change handler provided (onFilterChange or onChange)');
    }
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