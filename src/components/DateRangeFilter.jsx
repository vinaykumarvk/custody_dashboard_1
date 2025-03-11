import React from 'react';

/**
 * DateRangeFilter - A component for selecting date range filters
 * 
 * @param {Object} props Component props
 * @param {string} props.activeRange Currently active range
 * @param {Function} props.onChange Function to call when range changes
 * @param {Array} props.options Array of options with id and label
 * @returns {JSX.Element} Date range filter component
 */
const DateRangeFilter = ({ activeRange, onChange, options = [] }) => {
  // Default options if none provided
  const defaultOptions = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' },
    { id: 'all', label: 'All Time' }
  ];
  
  // Use provided options or fall back to defaults
  const filterOptions = options.length > 0 ? options : defaultOptions;
  
  return (
    <div className="date-range-filter">
      <div className="btn-group" role="group" aria-label="Date range filter">
        {filterOptions.map(option => (
          <button
            key={option.id}
            type="button"
            className={`btn ${activeRange === option.id ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateRangeFilter;