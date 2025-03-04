/**
 * Format a number with thousand separators
 * @param {number} num - The number to format
 * @param {boolean} decimals - Whether to include decimals
 * @returns {string} Formatted number
 */
export const formatNumber = (num, decimals = false) => {
  if (num === null || num === undefined) return '-';
  
  // Parse the number if it's a string
  if (typeof num === 'string') {
    num = parseFloat(num);
  }
  
  // Format with thousand separators and optional decimals
  if (decimals) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    return num.toLocaleString('en-US');
  }
};

/**
 * Format a currency value
 * @param {number} value - The currency value
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined) return '-';
  
  // Parse the value if it's a string
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
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

/**
 * Simulates an API call for development purposes
 * @param {string} endpoint - The API endpoint
 * @param {object} options - Request options
 * @returns {Promise} Promise with mock data
 */
export const mockApiCall = (endpoint, options = {}) => {
  // This is a simulated delay to mimic API calls
  const delay = options.delay || Math.random() * 500 + 300;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // You can add specific mock data based on the endpoint
      // or import from a separate file
      resolve(getMockData(endpoint));
    }, delay);
  });
};

/**
 * Returns mock data for different endpoints
 * @param {string} endpoint - The API endpoint
 * @returns {object} Mock data
 */
const getMockData = (endpoint) => {
  const mockData = {
    'dashboard': {
      totalCustomers: 2843,
      activeCustomers: 2157,
      totalAccounts: 5429,
      totalTrades: 16847,
      tradingVolume: 2547893421,
      pendingTrades: 237,
      openEvents: 89,
      corporateActions: {
        mandatory: 34,
        voluntary: 12
      },
      dealProcessing: {
        completed: 1458,
        pending: 237,
        failed: 43
      },
      customerSegments: [
        { label: 'Institutional', value: 45 },
        { label: 'Corporate', value: 30 },
        { label: 'Retail', value: 25 }
      ],
      tradesByAssetClass: [
        { label: 'Equities', value: 8254 },
        { label: 'Fixed Income', value: 5321 },
        { label: 'Derivatives', value: 2173 },
        { label: 'FX', value: 1099 }
      ],
      monthlyIncome: 14587932,
      incomeByService: [
        { label: 'Custody Fees', value: 7843621 },
        { label: 'Trading Commissions', value: 3541298 },
        { label: 'Corporate Action Fees', value: 1986754 },
        { label: 'Other Services', value: 1216259 }
      ],
      recentTrades: [
        {
          id: 'T-78945',
          customer: 'BlackRock Inc.',
          type: 'Buy',
          asset: 'AAPL',
          amount: 1250000,
          status: 'Completed',
          date: '2025-03-01T14:32:17'
        },
        {
          id: 'T-78946',
          customer: 'Vanguard Group',
          type: 'Sell',
          asset: 'MSFT',
          amount: 980500,
          status: 'Completed',
          date: '2025-03-01T15:47:38'
        },
        {
          id: 'T-78950',
          customer: 'State Street Corp',
          type: 'Buy',
          asset: 'GOOGL',
          amount: 1876000,
          status: 'Pending',
          date: '2025-03-02T09:15:22'
        },
        {
          id: 'T-78953',
          customer: 'Fidelity Investments',
          type: 'Buy',
          asset: 'AMZN',
          amount: 2150000,
          status: 'Completed',
          date: '2025-03-02T10:28:45'
        },
        {
          id: 'T-78957',
          customer: 'JP Morgan Asset Management',
          type: 'Sell',
          asset: 'TSLA',
          amount: 1564000,
          status: 'Failed',
          date: '2025-03-02T13:42:19'
        }
      ],
      // Historical data for time-series charts
      tradingVolumeHistory: [
        { date: '2025-02-01', value: 2147483647 },
        { date: '2025-02-08', value: 2247689254 },
        { date: '2025-02-15', value: 2349876543 },
        { date: '2025-02-22', value: 2198765432 },
        { date: '2025-03-01', value: 2547893421 }
      ],
      tradeCountHistory: [
        { date: '2025-02-01', value: 15243 },
        { date: '2025-02-08', value: 15876 },
        { date: '2025-02-15', value: 16234 },
        { date: '2025-02-22', value: 15987 },
        { date: '2025-03-01', value: 16847 }
      ]
    }
  };
  
  return mockData[endpoint] || {};
};