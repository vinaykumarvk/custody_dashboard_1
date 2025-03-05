import React from 'react';

const DateRangeFilter = ({ activeRange, onChange }) => {
  const ranges = [
    { label: '1W', value: '1week' },
    { label: '1M', value: '1month' },
    { label: '3M', value: '3months' },
    { label: '6M', value: '6months' },
    { label: 'YTD', value: 'ytd' },
    { label: '1Y', value: '1year' },
    { label: 'All', value: 'all' }
  ];

  return (
    <div className="date-range-filter">
      {ranges.map(range => (
        <button
          key={range.value}
          className={`filter-btn ${activeRange === range.value ? 'active' : ''}`}
          onClick={() => onChange(range.value)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default DateRangeFilter;