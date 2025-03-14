/**
 * Format a number with thousand separators
 * @param {number} num - The number to format
 * @param {boolean} decimals - Whether to include decimals
 * @param {boolean} forceInt - Force integer display (no decimals), default true
 * @returns {string} Formatted number
 */
export const formatNumber = (num, decimals = false, forceInt = true) => {
  if (num === null || num === undefined) return '-';
  
  // Parse the number if it's a string
  if (typeof num === 'string') {
    num = parseFloat(num);
  }
  
  // For metric cards and other integer displays, we want to force integers
  if (forceInt) {
    num = Math.round(num);
  }
  
  // Format with thousand separators and optional decimals
  if (decimals && !forceInt) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
};

/**
 * Format a currency value
 * @param {number} value - The currency value
 * @param {string} currency - The currency code (default: USD)
 * @param {number} maximumFractionDigits - Maximum number of decimal places (default: 0 for integers)
 * @param {boolean} useCompactNotation - Whether to use compact notation for large numbers
 * @param {boolean} forTable - Whether this is for a table display (uses 2 decimals)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (value, currency = 'USD', maximumFractionDigits = 0, useCompactNotation = false, forTable = false) => {
  if (value === null || value === undefined) return '-';
  
  // Parse the value if it's a string
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  
  // For table displays, we want to show 2 decimal places
  if (forTable && maximumFractionDigits === 0) {
    maximumFractionDigits = 2;
  }
  
  // Use compact notation for very large numbers (trillions/billions) if requested
  if (useCompactNotation || value >= 1000000000000) { // >= 1 trillion
    const trillions = value / 1000000000000;
    return `$${trillions.toFixed(2)}T`;
  } else if (useCompactNotation || value >= 1000000000) { // >= 1 billion
    const billions = value / 1000000000;
    return `$${billions.toFixed(2)}B`;
  }
  
  // For non-compact values, round to the nearest integer unless specified
  if (maximumFractionDigits === 0) {
    value = Math.round(value);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: maximumFractionDigits
  }).format(value);
};

/**
 * Format a percentage value
 * @param {number} value - The percentage value (e.g., 0.42 for 42%)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '-';
  
  // Parse the value if it's a string
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  
  return value.toLocaleString('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Format a date
 * @param {string|Date} date - The date to format
 * @param {string} format - The format to use (short, medium, long)
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return '-';
  
  const dateObj = new Date(date);
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US');
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'time':
      return dateObj.toLocaleTimeString('en-US');
    case 'datetime':
      return dateObj.toLocaleString('en-US');
    default:
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
  }
};

/**
 * Get a color value based on status
 * @param {string} status - The status value
 * @returns {string} Color code
 */
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'complete':
    case 'completed':
    case 'success':
    case 'active':
    case 'approved':
      return '#28A745'; // Success green
    case 'pending':
    case 'in progress':
    case 'waiting':
    case 'review':
      return '#FFC107'; // Warning yellow
    case 'failed':
    case 'error':
    case 'rejected':
    case 'cancelled':
      return '#DC3545'; // Danger red
    default:
      return '#6C757D'; // Secondary gray
  }
};

/**
 * Generate chart configuration with Smart Bank styling
 * @param {string} type - Chart type (line, bar, pie, etc.)
 * @param {object} customConfig - Custom chart configuration
 * @returns {object} Chart configuration
 */
export const generateChartConfig = (type, customConfig = {}) => {
  // Default colors for Smart Bank
  const colors = [
    '#007C75', // Primary green
    '#009E94', // Light green
    '#006560', // Dark green
    '#17A2B8', // Info blue
    '#FFC107', // Warning yellow
    '#DC3545', // Danger red
    '#6C757D', // Gray
    '#28A745', // Success green
  ];
  
  // Base configuration with Smart Bank styling
  const baseConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Roboto', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          family: "'Roboto', sans-serif",
          size: 14
        },
        bodyFont: {
          family: "'Roboto', sans-serif",
          size: 13
        },
        padding: 10,
        cornerRadius: 4,
        displayColors: true
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Roboto', sans-serif",
            size: 12
          }
        }
      },
      y: {
        grid: {
          borderDash: [2, 2],
          drawBorder: false
        },
        ticks: {
          font: {
            family: "'Roboto', sans-serif",
            size: 12
          }
        }
      }
    }
  };
  
  // Specific configurations based on chart type
  const typeSpecificConfig = {};
  
  if (type === 'line') {
    typeSpecificConfig.elements = {
      line: {
        tension: 0.3,
        borderWidth: 2
      },
      point: {
        radius: 3,
        hitRadius: 10,
        hoverRadius: 5
      }
    };
  } else if (type === 'bar') {
    typeSpecificConfig.barPercentage = 0.7;
    typeSpecificConfig.categoryPercentage = 0.8;
  } else if (type === 'pie' || type === 'doughnut') {
    typeSpecificConfig.cutout = type === 'doughnut' ? '70%' : 0;
    // Remove scales for pie/doughnut charts
    delete baseConfig.scales;
  }
  
  // Merge configurations
  return {
    type,
    ...baseConfig,
    ...typeSpecificConfig,
    ...customConfig,
    // Apply Smart Bank colors if datasets don't have custom colors
    data: customConfig.data ? {
      ...customConfig.data,
      datasets: customConfig.data.datasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || (
          type === 'line' ? 'rgba(0, 124, 117, 0.1)' : colors[index % colors.length]
        ),
        borderColor: dataset.borderColor || colors[index % colors.length]
      }))
    } : {}
  };
};

// All mock data functions have been removed in favor of real API data