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
    },
    'corporate_actions': {
      total_upcoming: 46,
      high_priority: 8,
      pending_elections: 12,
      total_value: 3827500,
      
      // Monthly history of corporate actions
      monthly_history: [
        {
          month: '2024-04-01',
          dividends: 18,
          stock_splits: 2,
          rights_issues: 1,
          mergers: 0
        },
        {
          month: '2024-05-01',
          dividends: 23,
          stock_splits: 0,
          rights_issues: 2,
          mergers: 1
        },
        {
          month: '2024-06-01',
          dividends: 20,
          stock_splits: 1,
          rights_issues: 0,
          mergers: 1
        },
        {
          month: '2024-07-01',
          dividends: 25,
          stock_splits: 3,
          rights_issues: 1,
          mergers: 0
        },
        {
          month: '2024-08-01',
          dividends: 22,
          stock_splits: 2,
          rights_issues: 2,
          mergers: 2
        },
        {
          month: '2024-09-01',
          dividends: 24,
          stock_splits: 1,
          rights_issues: 1,
          mergers: 1
        },
        {
          month: '2024-10-01',
          dividends: 26,
          stock_splits: 0,
          rights_issues: 3,
          mergers: 1
        },
        {
          month: '2024-11-01',
          dividends: 19,
          stock_splits: 2,
          rights_issues: 0,
          mergers: 0
        },
        {
          month: '2024-12-01',
          dividends: 28,
          stock_splits: 1,
          rights_issues: 1,
          mergers: 2
        },
        {
          month: '2025-01-01',
          dividends: 24,
          stock_splits: 3,
          rights_issues: 2,
          mergers: 1
        },
        {
          month: '2025-02-01',
          dividends: 21,
          stock_splits: 1,
          rights_issues: 1,
          mergers: 0
        },
        {
          month: '2025-03-01',
          dividends: 30,
          stock_splits: 2,
          rights_issues: 2,
          mergers: 2
        }
      ],
      
      // Upcoming corporate actions
      upcoming_actions: [
        {
          action_id: 'CA-34521',
          action_type: 'Dividend',
          security_name: 'Apple Inc.',
          isin: 'US0378331005',
          cusip: '037833100',
          exchange: 'NASDAQ',
          action_date: '2025-03-15',
          record_date: '2025-03-08',
          payment_date: '2025-03-20',
          value: 450000,
          status: 'Pending',
          client_impact: 'Medium',
          description: 'Quarterly cash dividend of $0.24 per share.',
          elections: [
            { client_id: 'C-7842', election_type: 'Cash', status: 'Pending' },
            { client_id: 'C-8953', election_type: 'Cash', status: 'Completed' }
          ]
        },
        {
          action_id: 'CA-34522',
          action_type: 'Stock Split',
          security_name: 'Tesla, Inc.',
          isin: 'US88160R1014',
          cusip: '88160R101',
          exchange: 'NASDAQ',
          action_date: '2025-03-25',
          record_date: '2025-03-18',
          payment_date: '2025-03-30',
          value: null,
          status: 'Pending',
          client_impact: 'High',
          description: '3-for-1 stock split to make stock ownership more accessible.',
          elections: null
        },
        {
          action_id: 'CA-34523',
          action_type: 'Rights Issue',
          security_name: 'Bank of America Corp',
          isin: 'US0605051046',
          cusip: '060505104',
          exchange: 'NYSE',
          action_date: '2025-04-05',
          record_date: '2025-03-29',
          payment_date: '2025-04-10',
          value: 875000,
          status: 'Pending',
          client_impact: 'High',
          description: 'Rights issue offering 1 new share for every 8 shares held at a discount price of $32 per share.',
          elections: [
            { client_id: 'C-7842', election_type: 'Exercise', status: 'Pending' },
            { client_id: 'C-8953', election_type: 'Sell Rights', status: 'Pending' },
            { client_id: 'C-9214', election_type: 'Exercise', status: 'Pending' }
          ]
        },
        {
          action_id: 'CA-34524',
          action_type: 'Merger',
          security_name: 'Salesforce, Inc.',
          isin: 'US79466L3024',
          cusip: '79466L302',
          exchange: 'NYSE',
          action_date: '2025-04-15',
          record_date: '2025-04-08',
          payment_date: '2025-04-20',
          value: 1250000,
          status: 'Announced',
          client_impact: 'High',
          description: 'Merger with Slack Technologies. Shareholders will receive 0.8 shares of the new entity for each share held.',
          elections: [
            { client_id: 'C-7321', election_type: 'Accept', status: 'Pending' },
            { client_id: 'C-8742', election_type: 'Accept', status: 'Pending' },
            { client_id: 'C-9153', election_type: 'Undecided', status: 'Pending' }
          ]
        },
        {
          action_id: 'CA-34525',
          action_type: 'Dividend',
          security_name: 'Microsoft Corporation',
          isin: 'US5949181045',
          cusip: '594918104',
          exchange: 'NASDAQ',
          action_date: '2025-03-18',
          record_date: '2025-03-11',
          payment_date: '2025-03-23',
          value: 625000,
          status: 'Pending',
          client_impact: 'Low',
          description: 'Quarterly cash dividend of $0.68 per share.',
          elections: [
            { client_id: 'C-7521', election_type: 'Cash', status: 'Completed' },
            { client_id: 'C-8351', election_type: 'Cash', status: 'Completed' }
          ]
        },
        {
          action_id: 'CA-34526',
          action_type: 'Dividend',
          security_name: 'Johnson & Johnson',
          isin: 'US4781601046',
          cusip: '478160104',
          exchange: 'NYSE',
          action_date: '2025-03-22',
          record_date: '2025-03-15',
          payment_date: '2025-03-27',
          value: 325000,
          status: 'Pending',
          client_impact: 'Low',
          description: 'Quarterly cash dividend of $1.19 per share.',
          elections: [
            { client_id: 'C-7842', election_type: 'Cash', status: 'Pending' }
          ]
        },
        {
          action_id: 'CA-34527',
          action_type: 'Tender Offer',
          security_name: 'Adobe Inc.',
          isin: 'US00724F1012',
          cusip: '00724F101',
          exchange: 'NASDAQ',
          action_date: '2025-04-10',
          record_date: '2025-04-03',
          payment_date: '2025-04-15',
          value: 1750000,
          status: 'Announced',
          client_impact: 'Medium',
          description: 'Tender offer to repurchase up to 10% of outstanding shares at a 12% premium to market price.',
          elections: [
            { client_id: 'C-7912', election_type: 'Tender', status: 'Pending' },
            { client_id: 'C-8624', election_type: 'Do Not Tender', status: 'Completed' },
            { client_id: 'C-9341', election_type: 'Tender', status: 'Pending' }
          ]
        }
      ],
      
      // Recent actions
      recent_actions: [
        {
          action_id: 'CA-34510',
          action_type: 'Dividend',
          security_name: 'Procter & Gamble Co',
          isin: 'US7427181091',
          cusip: '742718109',
          exchange: 'NYSE',
          action_date: '2025-02-15',
          record_date: '2025-02-08',
          payment_date: '2025-02-20',
          value: 385000,
          status: 'Completed',
          client_impact: 'Low',
          description: 'Quarterly cash dividend of $0.94 per share.',
          elections: null
        },
        {
          action_id: 'CA-34511',
          action_type: 'Dividend',
          security_name: 'Coca-Cola Company',
          isin: 'US1912161007',
          cusip: '191216100',
          exchange: 'NYSE',
          action_date: '2025-02-18',
          record_date: '2025-02-11',
          payment_date: '2025-02-23',
          value: 275000,
          status: 'Completed',
          client_impact: 'Low',
          description: 'Quarterly cash dividend of $0.46 per share.',
          elections: null
        },
        {
          action_id: 'CA-34512',
          action_type: 'Stock Split',
          security_name: 'Nvidia Corporation',
          isin: 'US67066G1040',
          cusip: '67066G104',
          exchange: 'NASDAQ',
          action_date: '2025-02-10',
          record_date: '2025-02-03',
          payment_date: '2025-02-15',
          value: null,
          status: 'Completed',
          client_impact: 'Medium',
          description: '4-for-1 stock split to make stock ownership more accessible.',
          elections: null
        },
        {
          action_id: 'CA-34513',
          action_type: 'Merger',
          security_name: 'LinkedIn Corp',
          isin: 'US53578A1088',
          cusip: '53578A108',
          exchange: 'NYSE',
          action_date: '2025-01-25',
          record_date: '2025-01-18',
          payment_date: '2025-01-30',
          value: 980000,
          status: 'Completed',
          client_impact: 'High',
          description: 'Merger with Microsoft Corporation. Shareholders received $196 in cash per share.',
          elections: null
        },
        {
          action_id: 'CA-34514',
          action_type: 'Rights Issue',
          security_name: 'Wells Fargo & Co',
          isin: 'US9497461015',
          cusip: '949746101',
          exchange: 'NYSE',
          action_date: '2025-02-05',
          record_date: '2025-01-29',
          payment_date: '2025-02-10',
          value: 725000,
          status: 'Completed',
          client_impact: 'Medium',
          description: 'Rights issue offering 1 new share for every 10 shares held at a discount price of $35 per share.',
          elections: null
        }
      ]
    }
  };
  
  return mockData[endpoint] || {};
};