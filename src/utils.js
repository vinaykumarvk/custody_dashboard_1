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
  
  // Handle different currencies
  let symbol = '$';
  let position = 'before';
  
  switch (currency) {
    case 'EUR':
      symbol = '€';
      position = 'after';
      break;
    case 'GBP':
      symbol = '£';
      break;
    case 'JPY':
      symbol = '¥';
      break;
    // Add more currencies as needed
  }
  
  // Format with thousand separators and two decimal places
  const formattedValue = value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  // Return formatted currency value
  return position === 'before' ? `${symbol}${formattedValue}` : `${formattedValue} ${symbol}`;
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
  
  // Convert to percentage and format
  const percentage = value * 100;
  return percentage.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }) + '%';
};

/**
 * Format a date
 * @param {string|Date} date - The date to format
 * @param {string} format - The format to use (short, medium, long)
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return '-';
  
  // Convert string to Date object if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Define format options
  let options;
  switch (format) {
    case 'short':
      options = { month: 'numeric', day: 'numeric', year: '2-digit' };
      break;
    case 'medium':
      options = { month: 'short', day: 'numeric', year: 'numeric' };
      break;
    case 'long':
      options = { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      break;
    default:
      options = { month: 'short', day: 'numeric', year: 'numeric' };
  }
  
  // Return formatted date
  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Get a color value based on status
 * @param {string} status - The status value
 * @returns {string} Color code
 */
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'approved':
    case 'success':
      return '#28a745'; // Green
    case 'pending':
    case 'in progress':
    case 'processing':
    case 'review':
      return '#ffc107'; // Yellow
    case 'inactive':
    case 'failed':
    case 'rejected':
    case 'error':
      return '#dc3545'; // Red
    case 'warning':
      return '#fd7e14'; // Orange
    case 'neutral':
    case 'onboarding':
      return '#6c757d'; // Gray
    default:
      return '#6c757d'; // Default gray
  }
};

/**
 * Generate chart configuration with Smart Bank styling
 * @param {string} type - Chart type (line, bar, pie, etc.)
 * @param {object} customConfig - Custom chart configuration
 * @returns {object} Chart configuration
 */
export const generateChartConfig = (type, customConfig = {}) => {
  // Default colors palette
  const colors = [
    '#28a745', // Primary green
    '#17a2b8', // Info blue
    '#6610f2', // Purple
    '#fd7e14', // Orange
    '#e83e8c', // Pink
    '#6f42c1', // Indigo
    '#20c997', // Teal
    '#ffc107', // Yellow
  ];
  
  // Base configuration for all charts
  const baseConfig = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 12
        },
        bodyFont: {
          size: 11
        },
        padding: 10,
        cornerRadius: 3
      }
    }
  };
  
  // Type-specific configurations
  let typeConfig = {};
  
  switch (type) {
    case 'line':
      typeConfig = {
        elements: {
          line: {
            tension: 0.1,
            borderWidth: 2
          },
          point: {
            radius: 2,
            hitRadius: 6,
            hoverRadius: 4
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        }
      };
      break;
    case 'bar':
      typeConfig = {
        elements: {
          bar: {
            borderWidth: 0
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        }
      };
      break;
    case 'pie':
    case 'doughnut':
      typeConfig = {
        cutout: type === 'doughnut' ? '60%' : 0,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      };
      break;
    // Add more chart types as needed
  }
  
  // Merge configurations
  return {
    ...baseConfig,
    ...typeConfig,
    ...customConfig,
    // Add default colors if datasets are provided without colors
    data: customConfig.data ? {
      ...customConfig.data,
      datasets: customConfig.data.datasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || colors[index % colors.length],
        borderColor: dataset.borderColor || colors[index % colors.length]
      }))
    } : undefined
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
  // Map corporate_actions to corporateActions if needed
  if (endpoint === 'corporate_actions') {
    endpoint = 'corporateActions';
  }
  
  const mockData = {
    'corporateActions': {
      total_actions: 1875,
      pending_actions: 342,
      completed_actions: 1421,
      failed_actions: 112,
      dividend_actions: 723,
      stock_split_actions: 245,
      rights_issue_actions: 187,
      merger_actions: 129,
      
      // Actions by status
      actions_by_status: [
        { status: 'Completed', count: 1421 },
        { status: 'Pending', count: 342 },
        { status: 'Failed', count: 112 }
      ],
      
      // Actions by type
      actions_by_type: [
        { type: 'Dividend', count: 723 },
        { type: 'Stock Split', count: 245 },
        { type: 'Rights Issue', count: 187 },
        { type: 'Merger', count: 129 },
        { type: 'Spinoff', count: 94 },
        { type: 'Acquisition', count: 82 },
        { type: 'Other', count: 415 }
      ],
      
      // Recent actions
      recent_actions: [
        {
          action_id: 'CA-45678',
          security_name: 'Apple Inc.',
          security_id: 'AAPL',
          type: 'Dividend',
          announcement_date: '2025-02-20',
          record_date: '2025-03-10',
          payment_date: '2025-03-15',
          status: 'Pending',
          amount: 0.24,
          currency: 'USD',
          description: 'Quarterly dividend payment',
          affected_accounts: 342,
          total_value: 2457650,
          processor: 'Sarah Williams',
          notes: 'Standard quarterly dividend processing'
        },
        {
          action_id: 'CA-45679',
          security_name: 'Tesla, Inc.',
          security_id: 'TSLA',
          type: 'Stock Split',
          announcement_date: '2025-02-15',
          record_date: '2025-03-05',
          payment_date: '2025-03-08',
          status: 'Completed',
          split_ratio: '3:1',
          description: '3-for-1 stock split',
          affected_accounts: 198,
          processor: 'James Wilson',
          notes: 'Stock split completed successfully'
        },
        {
          action_id: 'CA-45680',
          security_name: 'JP Morgan Chase',
          security_id: 'JPM',
          type: 'Dividend',
          announcement_date: '2025-02-22',
          record_date: '2025-03-12',
          payment_date: '2025-03-18',
          status: 'Pending',
          amount: 1.15,
          currency: 'USD',
          description: 'Quarterly dividend payment',
          affected_accounts: 287,
          total_value: 1854320,
          processor: 'Michael Chen',
          notes: 'Dividend announced, pending record date'
        },
        {
          action_id: 'CA-45681',
          security_name: 'Microsoft Corp',
          security_id: 'MSFT',
          type: 'Dividend',
          announcement_date: '2025-02-18',
          record_date: '2025-03-08',
          payment_date: '2025-03-14',
          status: 'Pending',
          amount: 0.68,
          currency: 'USD',
          description: 'Quarterly dividend payment',
          affected_accounts: 312,
          total_value: 2967450,
          processor: 'Emma Davies',
          notes: 'Verifying eligible positions'
        },
        {
          action_id: 'CA-45682',
          security_name: 'Amazon.com Inc.',
          security_id: 'AMZN',
          type: 'Stock Split',
          announcement_date: '2025-02-10',
          record_date: '2025-03-01',
          payment_date: '2025-03-05',
          status: 'Completed',
          split_ratio: '20:1',
          description: '20-for-1 stock split',
          affected_accounts: 276,
          processor: 'Thomas Johnson',
          notes: 'Stock split completed successfully'
        },
        {
          action_id: 'CA-45683',
          security_name: 'Exxon Mobil Corp',
          security_id: 'XOM',
          type: 'Dividend',
          announcement_date: '2025-02-25',
          record_date: '2025-03-15',
          payment_date: '2025-03-22',
          status: 'Announced',
          amount: 0.95,
          currency: 'USD',
          description: 'Quarterly dividend payment',
          affected_accounts: 234,
          total_value: 1456780,
          processor: 'Robert Johnson',
          notes: 'Announcement received, pending processing'
        }
      ],
      
      // Actions timeline
      actions_timeline: [
        { date: '2025-02-01', total_actions: 45, completed: 28, pending: 14, failed: 3 },
        { date: '2025-02-05', total_actions: 58, completed: 32, pending: 21, failed: 5 },
        { date: '2025-02-10', total_actions: 67, completed: 39, pending: 23, failed: 5 },
        { date: '2025-02-15', total_actions: 72, completed: 45, pending: 20, failed: 7 },
        { date: '2025-02-20', total_actions: 83, completed: 52, pending: 24, failed: 7 },
        { date: '2025-02-25', total_actions: 89, completed: 58, pending: 26, failed: 5 },
        { date: '2025-03-01', total_actions: 94, completed: 63, pending: 27, failed: 4 }
      ]
    },
    'settlements': {
      total_settlements: 7824,
      pending_settlements: 643,
      failed_settlements: 84,
      success_rate: 0.96,
      settlement_volume: 1453298760,
      average_settlement_time: 1.4,
      
      // Settlements by status
      settlements_by_status: [
        { status: 'Completed', count: 7097 },
        { status: 'Pending', count: 643 },
        { status: 'Failed', count: 84 }
      ],
      
      // Settlements by type
      settlements_by_type: [
        { type: 'DVP', count: 5865 },
        { type: 'FOP', count: 1432 },
        { type: 'Internal', count: 527 }
      ],
      
      // Settlements by currency
      settlements_by_currency: [
        { currency: 'USD', count: 4512 },
        { currency: 'EUR', count: 1623 },
        { currency: 'GBP', count: 834 },
        { currency: 'JPY', count: 423 },
        { currency: 'Other', count: 432 }
      ],
      
      // Recent settlements
      recent_settlements: [
        {
          settlement_id: 'S-34567',
          trade_id: 'T-78945',
          client_name: 'BlackRock Inc.',
          client_id: 'C-54321',
          security_name: 'Apple Inc.',
          security_id: 'AAPL',
          settlement_date: '2025-03-03',
          amount: 1253125,
          currency: 'USD',
          status: 'Completed',
          type: 'DVP',
          counterparty: 'Morgan Stanley',
          location: 'DTC',
          account: 'A-1234',
          processor: 'Jane Smith',
          notes: 'Standard settlement completed'
        },
        {
          settlement_id: 'S-34568',
          trade_id: 'T-78946',
          client_name: 'Vanguard Group',
          client_id: 'C-54322',
          security_name: 'Microsoft Corp',
          security_id: 'MSFT',
          settlement_date: '2025-03-03',
          amount: 978038.77,
          currency: 'USD',
          status: 'Completed',
          type: 'DVP',
          counterparty: 'Goldman Sachs',
          location: 'DTC',
          account: 'A-2234',
          processor: 'Michael Brown',
          notes: 'Settlement completed on time'
        },
        {
          settlement_id: 'S-34569',
          trade_id: 'T-78950',
          client_name: 'State Street Corp',
          client_id: 'C-54323',
          security_name: 'Alphabet Inc.',
          security_id: 'GOOGL',
          settlement_date: '2025-03-04',
          amount: 1880685.98,
          currency: 'USD',
          status: 'Pending',
          type: 'DVP',
          counterparty: 'UBS',
          location: 'DTC',
          account: 'A-3234',
          processor: 'David Lee',
          notes: 'Awaiting confirmation from counterparty'
        },
        {
          settlement_id: 'S-34570',
          trade_id: 'T-78953',
          client_name: 'Fidelity Investments',
          client_id: 'C-54324',
          security_name: 'Amazon.com Inc.',
          security_id: 'AMZN',
          settlement_date: '2025-03-04',
          amount: 2155373,
          currency: 'USD',
          status: 'Pending',
          type: 'DVP',
          counterparty: 'JP Morgan',
          location: 'DTC',
          account: 'A-4234',
          processor: 'Patricia Wilson',
          notes: 'Waiting for client funds'
        },
        {
          settlement_id: 'S-34571',
          trade_id: 'T-78957',
          client_name: 'JP Morgan Asset Management',
          client_id: 'C-54325',
          security_name: 'Tesla, Inc.',
          security_id: 'TSLA',
          settlement_date: '2025-03-04',
          amount: 1560086.02,
          currency: 'USD',
          status: 'Failed',
          type: 'DVP',
          counterparty: 'Citigroup',
          location: 'DTC',
          account: 'A-5234',
          processor: 'Steven Garcia',
          notes: 'Settlement failed due to insufficient shares'
        },
        {
          settlement_id: 'S-34572',
          trade_id: 'T-78960',
          client_name: 'UBS Asset Management',
          client_id: 'C-54326',
          security_name: 'Facebook Inc.',
          security_id: 'FB',
          settlement_date: '2025-03-05',
          amount: 706752.47,
          currency: 'USD',
          status: 'Pending',
          type: 'DVP',
          counterparty: 'Bank of America',
          location: 'DTC',
          account: 'A-6234',
          processor: 'Richard Taylor',
          notes: 'Settlement in process'
        }
      ],
      
      // Settlement timeline
      settlement_timeline: [
        { date: '2025-02-01', total: 245, completed: 230, pending: 12, failed: 3 },
        { date: '2025-02-05', total: 268, completed: 249, pending: 15, failed: 4 },
        { date: '2025-02-10', total: 274, completed: 258, pending: 13, failed: 3 },
        { date: '2025-02-15', total: 262, completed: 248, pending: 11, failed: 3 },
        { date: '2025-02-20', total: 289, completed: 270, pending: 14, failed: 5 },
        { date: '2025-02-25', total: 295, completed: 279, pending: 12, failed: 4 },
        { date: '2025-03-01', total: 304, completed: 285, pending: 15, failed: 4 }
      ]
    },
    'customers': {
      total_customers: 19632,
      active_customers: 16584,
      new_customers_mtd: 436,
      total_accounts: 34579,
      customers_monthly: [
        { date: '2024-03-31', total_customers: 1230, new_customers: 3419 },
        { date: '2024-04-30', total_customers: 2955, new_customers: 3357 },
        { date: '2024-05-31', total_customers: 4920, new_customers: 1965 },
        { date: '2024-06-30', total_customers: 6921, new_customers: 2001 },
        { date: '2024-07-31', total_customers: 8823, new_customers: 1902 },
        { date: '2024-08-31', total_customers: 10678, new_customers: 1855 },
        { date: '2024-09-30', total_customers: 12452, new_customers: 1774 },
        { date: '2024-10-31', total_customers: 14196, new_customers: 1744 },
        { date: '2024-11-30', total_customers: 15922, new_customers: 1726 },
        { date: '2024-12-31', total_customers: 17548, new_customers: 1626 },
        { date: '2025-01-31', total_customers: 18701, new_customers: 1153 },
        { date: '2025-02-28', total_customers: 19196, new_customers: 495 },
        { date: '2025-03-31', total_customers: 19632, new_customers: 436 }
      ],
      customers_by_type: [
        { type: 'Institutional', count: 7854 },
        { type: 'Corporate', count: 5889 },
        { type: 'Wealth Management', count: 3927 },
        { type: 'Retail', count: 1962 }
      ],
      customers_by_region: [
        { region: 'North America', count: 8835 },
        { region: 'Europe', count: 5890 },
        { region: 'Asia Pacific', count: 2945 },
        { region: 'Middle East', count: 982 },
        { region: 'Latin America', count: 980 }
      ],
      top_customers: [
        {
          customer_id: 'C-12345',
          name: 'BlackRock Inc.',
          type: 'Institutional',
          date_onboarded: '2024-04-15',
          country: 'United States',
          accounts: 12,
          status: 'Active',
          relationship_manager: 'Robert Johnson',
          aum: 1200000000,
          contact_name: 'Michael Smith',
          contact_email: 'michael.smith@blackrock.com',
          contact_phone: '+1-212-555-1234'
        },
        {
          customer_id: 'C-12346',
          name: 'Vanguard Group',
          type: 'Institutional',
          date_onboarded: '2024-04-22',
          country: 'United States',
          accounts: 10,
          status: 'Active',
          relationship_manager: 'Sarah Williams',
          aum: 950000000,
          contact_name: 'Jennifer Davis',
          contact_email: 'jennifer.davis@vanguard.com',
          contact_phone: '+1-610-555-5678'
        },
        {
          customer_id: 'C-12347',
          name: 'Goldman Sachs Asset Management',
          type: 'Institutional',
          date_onboarded: '2024-05-03',
          country: 'United States',
          accounts: 8,
          status: 'Active',
          relationship_manager: 'James Wilson',
          aum: 780000000,
          contact_name: 'David Brown',
          contact_email: 'david.brown@gs.com',
          contact_phone: '+1-212-555-9012'
        },
        {
          customer_id: 'C-12348',
          name: 'HSBC Global Asset Management',
          type: 'Institutional',
          date_onboarded: '2024-05-15',
          country: 'United Kingdom',
          accounts: 7,
          status: 'Active',
          relationship_manager: 'Emma Davies',
          aum: 650000000,
          contact_name: 'Richard Wilson',
          contact_email: 'richard.wilson@hsbc.com',
          contact_phone: '+44-20-555-3456'
        },
        {
          customer_id: 'C-12349',
          name: 'UBS Asset Management',
          type: 'Institutional',
          date_onboarded: '2024-05-28',
          country: 'Switzerland',
          accounts: 6,
          status: 'Active',
          relationship_manager: 'Michael Chen',
          aum: 520000000,
          contact_name: 'Thomas Mueller',
          contact_email: 'thomas.mueller@ubs.com',
          contact_phone: '+41-44-555-7890'
        }
      ],
      recent_activities: [
        { timestamp: '2025-03-31T10:15:22', user: 'Robert Johnson', action: 'Created new customer account: Horizon Investments Ltd.', ip_address: '192.168.1.15' },
        { timestamp: '2025-03-31T10:00:15', user: 'Sarah Williams', action: 'Updated customer details: Goldman Sachs Asset Management', ip_address: '192.168.1.22' },
        { timestamp: '2025-03-31T09:45:30', user: 'Emma Davies', action: 'Approved new account opening: AllianceBernstein LP', ip_address: '192.168.1.18' },
        { timestamp: '2025-03-31T09:30:15', user: 'Michael Chen', action: 'Generated customer report: UBS Asset Management', ip_address: '192.168.1.25' },
        { timestamp: '2025-03-31T09:15:45', user: 'James Wilson', action: 'Added new contact for: BlackRock Inc.', ip_address: '192.168.1.30' },
        { timestamp: '2025-03-31T09:00:30', user: 'System', action: 'Sent onboarding documents to: Wellington Management Company', ip_address: '10.0.0.15' },
        { timestamp: '2025-03-31T08:45:15', user: 'David Lee', action: 'Scheduled customer meeting: Fidelity Investments', ip_address: '192.168.1.35' }
      ]
    },
    'income': {
      total_income_ytd: 32458765,
      total_income_mtd: 3457892,
      fees_collected: 24765432,
      fees_outstanding: 3254678,
      average_fee_per_customer: 1654,
      income_growth_yoy: 0.17,
      
      income_by_service: [
        { service: 'Custody Fees', amount: 17843621, percentage: 0.55 },
        { service: 'Trading Commissions', amount: 8114692, percentage: 0.25 },
        { service: 'Corporate Action Fees', amount: 3245876, percentage: 0.10 },
        { service: 'Other Services', amount: 3254576, percentage: 0.10 }
      ],
      
      income_by_region: [
        { region: 'North America', amount: 16229382 },
        { region: 'Europe', amount: 8114691 },
        { region: 'Asia Pacific', amount: 4868815 },
        { region: 'Middle East', amount: 1622938 },
        { region: 'Latin America', amount: 1622939 }
      ],
      
      income_monthly: [
        { date: '2024-03-31', total_income: 967982, new_income: 967982 },
        { date: '2024-04-30', total_income: 1986532, new_income: 1018550 },
        { date: '2024-05-31', total_income: 3254765, new_income: 1268233 },
        { date: '2024-06-30', total_income: 4876421, new_income: 1621656 },
        { date: '2024-07-31', total_income: 6543278, new_income: 1666857 },
        { date: '2024-08-31', total_income: 8765432, new_income: 2222154 },
        { date: '2024-09-30', total_income: 11346789, new_income: 2581357 },
        { date: '2024-10-31', total_income: 14568932, new_income: 3222143 },
        { date: '2024-11-30', total_income: 17865432, new_income: 3296500 },
        { date: '2024-12-31', total_income: 21543678, new_income: 3678246 },
        { date: '2025-01-31', total_income: 25432765, new_income: 3889087 },
        { date: '2025-02-28', total_income: 29000873, new_income: 3568108 },
        { date: '2025-03-31', total_income: 32458765, new_income: 3457892 }
      ],
      
      top_customers: [
        {
          customer_id: 'C-54321',
          name: 'BlackRock Inc.',
          type: 'Institutional',
          ytd_revenue: 1567843,
          mtd_revenue: 143256,
          fees_outstanding: 97543,
          relationship_manager: 'Robert Johnson'
        },
        {
          customer_id: 'C-54322',
          name: 'Vanguard Group',
          type: 'Institutional',
          ytd_revenue: 1342657,
          mtd_revenue: 125478,
          fees_outstanding: 68754,
          relationship_manager: 'Sarah Williams'
        },
        {
          customer_id: 'C-54323',
          name: 'State Street Corp',
          type: 'Institutional',
          ytd_revenue: 987563,
          mtd_revenue: 98745,
          fees_outstanding: 45321,
          relationship_manager: 'Amanda Chen'
        },
        {
          customer_id: 'C-54324',
          name: 'Fidelity Investments',
          type: 'Institutional',
          ytd_revenue: 865492,
          mtd_revenue: 87456,
          fees_outstanding: 32457,
          relationship_manager: 'Thomas Martinez'
        },
        {
          customer_id: 'C-54325',
          name: 'JP Morgan Asset Management',
          type: 'Institutional',
          ytd_revenue: 654387,
          mtd_revenue: 65987,
          fees_outstanding: 29876,
          relationship_manager: 'Laura Kim'
        }
      ]
    },
    'reports': {
      available_reports: 42,
      generated_reports_mtd: 386,
      scheduled_reports: 176,
      favorite_reports: 8,
      
      report_categories: [
        { category: 'Compliance', count: 12 },
        { category: 'Performance', count: 9 },
        { category: 'Trading', count: 8 },
        { category: 'Settlements', count: 7 },
        { category: 'Corporate Actions', count: 6 }
      ],
      
      recent_reports: [
        {
          report_id: 'R-34567',
          name: 'Monthly Trade Summary',
          category: 'Trading',
          generated_date: '2025-03-03T09:30:45',
          generated_by: 'Sarah Wilson',
          format: 'PDF',
          size: '2.4 MB',
          status: 'Completed'
        },
        {
          report_id: 'R-34568',
          name: 'Corporate Actions Pending',
          category: 'Corporate Actions',
          generated_date: '2025-03-03T10:15:22',
          generated_by: 'James Roberts',
          format: 'XLSX',
          size: '1.8 MB',
          status: 'Completed'
        },
        {
          report_id: 'R-34569',
          name: 'Settlement Fails Analysis',
          category: 'Settlements',
          generated_date: '2025-03-03T14:45:19',
          generated_by: 'Daniel Chen',
          format: 'PDF',
          size: '3.6 MB',
          status: 'Completed'
        },
        {
          report_id: 'R-34570',
          name: 'Regulatory Compliance Review',
          category: 'Compliance',
          generated_date: '2025-03-03T16:22:37',
          generated_by: 'Laura Schmidt',
          format: 'PDF',
          size: '5.2 MB',
          status: 'Processing'
        },
        {
          report_id: 'R-34571',
          name: 'Customer Performance Summary',
          category: 'Performance',
          generated_date: '2025-03-04T08:10:51',
          generated_by: 'Thomas Johnson',
          format: 'XLSX',
          size: '4.1 MB',
          status: 'Completed'
        }
      ],
      
      scheduled_report_list: [
        {
          schedule_id: 'S-23456',
          report_name: 'Daily Trade Summary',
          frequency: 'Daily',
          next_run: '2025-03-05T06:00:00',
          recipients: 12,
          format: 'PDF',
          created_by: 'System Administrator'
        },
        {
          schedule_id: 'S-23457',
          report_name: 'Weekly Settlement Status',
          frequency: 'Weekly',
          next_run: '2025-03-08T07:00:00',
          recipients: 8,
          format: 'XLSX',
          created_by: 'System Administrator'
        },
        {
          schedule_id: 'S-23458',
          report_name: 'Monthly Performance Report',
          frequency: 'Monthly',
          next_run: '2025-04-01T06:00:00',
          recipients: 15,
          format: 'PDF',
          created_by: 'System Administrator'
        },
        {
          schedule_id: 'S-23459',
          report_name: 'Quarterly Compliance Review',
          frequency: 'Quarterly',
          next_run: '2025-06-01T06:00:00',
          recipients: 7,
          format: 'PDF',
          created_by: 'System Administrator'
        },
        {
          schedule_id: 'S-23460',
          report_name: 'Daily Corporate Actions Alert',
          frequency: 'Daily',
          next_run: '2025-03-05T06:30:00',
          recipients: 10,
          format: 'XLSX',
          created_by: 'System Administrator'
        }
      ]
    },
    'settings': {
      user_preferences: {
        language: 'English',
        theme: 'Default',
        timezone: 'UTC-05:00',
        notifications_enabled: true,
        email_notifications: true,
        sms_notifications: false,
        two_factor_auth: true,
        dashboard_layout: 'Standard'
      },
      
      system_settings: {
        maintenance_mode: false,
        system_version: '2.5.1',
        database_version: '1.8.3',
        api_version: '3.2.0',
        last_backup: '2025-03-03T23:00:00',
        last_update: '2025-02-28T01:30:00'
      },
      
      user_roles: [
        {
          role_name: 'Administrator',
          users_count: 4,
          permissions: 'Full access'
        },
        {
          role_name: 'Operations Manager',
          users_count: 8,
          permissions: 'Create, Read, Update'
        },
        {
          role_name: 'Relationship Manager',
          users_count: 15,
          permissions: 'Create, Read'
        },
        {
          role_name: 'View Only',
          users_count: 23,
          permissions: 'Read'
        }
      ]
    },
    'trades': {
      total_trades: 8735,
      trading_volume: 1765342800,
      avg_trade_size: 202100,
      success_rate: 0.96,
      completed_trades: 7824,
      pending_trades: 643,
      processing_trades: 184,
      failed_trades: 84,
      trades_buy: 4821,
      trades_sell: 3914,
      
      recent_trades: [
        {
          trade_id: 'T-78945',
          date: '2025-03-01T14:32:17',
          client_name: 'BlackRock Inc.',
          client_id: 'C-54321',
          trade_type: 'Buy',
          security_name: 'Apple Inc.',
          security_id: 'AAPL',
          isin: 'US0378331005',
          cusip: '037833100',
          quantity: 5000,
          price: 250,
          amount: 1250000,
          currency: 'USD',
          status: 'Completed',
          settlement_date: '2025-03-03',
          settlement_status: 'Pending',
          exchange: 'NASDAQ',
          settlement_location: 'DTC',
          account_id: 'A-1234',
          commission: 2500,
          fees: 625,
          total_amount: 1253125,
          trader: 'Jane Smith',
          notes: 'Client requested immediate execution. Priority trade.',
          relationship_manager: 'Robert Johnson',
          asset_class: 'Equities'
        },
        {
          trade_id: 'T-78946',
          date: '2025-03-01T15:47:38',
          client_name: 'Vanguard Group',
          client_id: 'C-54322',
          trade_type: 'Sell',
          security_name: 'Microsoft Corp',
          security_id: 'MSFT',
          isin: 'US5949181045',
          cusip: '594918104',
          quantity: 3500,
          price: 280.14,
          amount: 980490,
          currency: 'USD',
          status: 'Completed',
          settlement_date: '2025-03-03',
          settlement_status: 'Completed',
          exchange: 'NASDAQ',
          settlement_location: 'DTC',
          account_id: 'A-2234',
          commission: 1960.98,
          fees: 490.25,
          total_amount: 978038.77,
          trader: 'Michael Brown',
          notes: 'Standard trade execution.',
          relationship_manager: 'Sarah Williams',
          asset_class: 'Equities'
        },
        {
          trade_id: 'T-78950',
          date: '2025-03-02T09:15:22',
          client_name: 'State Street Corp',
          client_id: 'C-54323',
          trade_type: 'Buy',
          security_name: 'Alphabet Inc.',
          security_id: 'GOOGL',
          isin: 'US02079K3059',
          cusip: '02079K305',
          quantity: 1200,
          price: 1563.33,
          amount: 1875996,
          currency: 'USD',
          status: 'Pending',
          settlement_date: '2025-03-04',
          settlement_status: 'Pending',
          exchange: 'NASDAQ',
          settlement_location: 'DTC',
          account_id: 'A-3234',
          commission: 3751.99,
          fees: 937.99,
          total_amount: 1880685.98,
          trader: 'David Lee',
          notes: 'Awaiting confirmation from counterparty.',
          relationship_manager: 'Amanda Chen',
          asset_class: 'Equities'
        },
        {
          trade_id: 'T-78953',
          date: '2025-03-02T10:28:45',
          client_name: 'Fidelity Investments',
          client_id: 'C-54324',
          trade_type: 'Buy',
          security_name: 'Amazon.com Inc.',
          security_id: 'AMZN',
          isin: 'US0231351067',
          cusip: '023135106',
          quantity: 600,
          price: 3583.33,
          amount: 2149998,
          currency: 'USD',
          status: 'Completed',
          settlement_date: '2025-03-04',
          settlement_status: 'Pending',
          exchange: 'NASDAQ',
          settlement_location: 'DTC',
          account_id: 'A-4234',
          commission: 4300,
          fees: 1075,
          total_amount: 2155373,
          trader: 'Patricia Wilson',
          notes: 'Large block trade, executed in parts.',
          relationship_manager: 'Thomas Martinez',
          asset_class: 'Equities'
        },
        {
          trade_id: 'T-78957',
          date: '2025-03-02T13:42:19',
          client_name: 'JP Morgan Asset Management',
          client_id: 'C-54325',
          trade_type: 'Sell',
          security_name: 'Tesla, Inc.',
          security_id: 'TSLA',
          isin: 'US88160R1014',
          cusip: '88160R101',
          quantity: 1400,
          price: 1117.14,
          amount: 1563996,
          currency: 'USD',
          status: 'Failed',
          settlement_date: '2025-03-04',
          settlement_status: 'Failed',
          exchange: 'NASDAQ',
          settlement_location: 'DTC',
          account_id: 'A-5234',
          commission: 3127.99,
          fees: 781.99,
          total_amount: 1560086.02,
          trader: 'Steven Garcia',
          notes: 'Trade failed due to insufficient shares in client account.',
          relationship_manager: 'Laura Kim',
          asset_class: 'Equities'
        },
        {
          trade_id: 'T-78960',
          date: '2025-03-03T08:22:34',
          client_name: 'UBS Asset Management',
          client_id: 'C-54326',
          trade_type: 'Buy',
          security_name: 'Facebook Inc.',
          security_id: 'FB',
          isin: 'US30303M1027',
          cusip: '30303M102',
          quantity: 2200,
          price: 320.45,
          amount: 704990,
          currency: 'USD',
          status: 'Completed',
          settlement_date: '2025-03-05',
          settlement_status: 'Pending',
          exchange: 'NASDAQ',
          settlement_location: 'DTC',
          account_id: 'A-6234',
          commission: 1409.98,
          fees: 352.49,
          total_amount: 706752.47,
          trader: 'Richard Taylor',
          notes: 'Standard trade execution.',
          relationship_manager: 'Michelle Robinson',
          asset_class: 'Equities'
        }
      ],
      
      trade_by_asset_class: [
        { asset_class: 'Equities', value: 5247 },
        { asset_class: 'Fixed Income', value: 2145 },
        { asset_class: 'FX', value: 782 },
        { asset_class: 'Derivatives', value: 561 }
      ],
      
      volume_history: [
        { date: '2025-02-01', volume: 54325000 },
        { date: '2025-02-03', volume: 58741000 },
        { date: '2025-02-05', volume: 61230000 },
        { date: '2025-02-07', volume: 59845000 },
        { date: '2025-02-09', volume: 57621000 },
        { date: '2025-02-11', volume: 62345000 },
        { date: '2025-02-13', volume: 67812000 },
        { date: '2025-02-15', volume: 71435000 },
        { date: '2025-02-17', volume: 68945000 },
        { date: '2025-02-19', volume: 72134000 },
        { date: '2025-02-21', volume: 75648000 },
        { date: '2025-02-23', volume: 77821000 },
        { date: '2025-02-25', volume: 82347000 },
        { date: '2025-02-27', volume: 85632000 },
        { date: '2025-03-01', volume: 89457000 },
        { date: '2025-03-03', volume: 92786000 }
      ]
    },
    'dashboard': {
      custody_assets: 458692145000,
      custody_assets_growth: 0.08,
      total_accounts: 34579,
      active_accounts: 29827,
      total_customers: 19632,
      total_open_events: 3467,
      
      revenue_mtd: 3457892,
      revenue_ytd: 32458765,
      revenue_growth: 0.14,
      
      total_trades: 8735,
      completed_trades: 7824,
      pending_trades: 643,
      processing_trades: 184,
      failed_trades: 84,
      
      total_corporate_actions: 1875,
      
      // Trade history data for charts
      trade_monthly: [
        { date: '2025-01-01', trade_volume: 145000000, total_trades: 710 },
        { date: '2025-01-15', trade_volume: 168000000, total_trades: 754 },
        { date: '2025-02-01', trade_volume: 152000000, total_trades: 684 },
        { date: '2025-02-15', trade_volume: 195000000, total_trades: 812 },
        { date: '2025-03-01', trade_volume: 205000000, total_trades: 842 }
      ],
      pending_corporate_actions: 342,
      
      system_status: {
        overall: 'Operational',
        trading: 'Operational',
        settlement: 'Operational',
        reporting: 'Degraded Performance',
        api: 'Operational'
      },
      
      events_today: [
        {
          time: '09:00',
          event: 'Daily Trade Settlement Process'
        },
        {
          time: '10:30',
          event: 'Corporate Actions Deadline: Stock Split (Apple Inc.)'
        },
        {
          time: '13:00',
          event: 'System Maintenance: Reporting Module'
        },
        {
          time: '15:45',
          event: 'End of Day Processing Starts'
        }
      ],
      
      recent_activities: [
        { timestamp: '2025-03-04T09:32:15', user: 'System', event_type: 'Settlement', description: 'Daily settlement process completed successfully', ip_address: '10.0.0.10' },
        { timestamp: '2025-03-04T09:15:22', user: 'Robert Johnson', event_type: 'Corporate Action', description: 'Approved dividend payment: Microsoft Corp', ip_address: '192.168.1.15' },
        { timestamp: '2025-03-04T08:47:53', user: 'Sarah Williams', event_type: 'Trade', description: 'Resolved trade settlement failure: ID T-78901', ip_address: '192.168.1.22' },
        { timestamp: '2025-03-04T08:30:41', user: 'James Wilson', event_type: 'Customer', description: 'Updated KYC information: BlackRock Inc.', ip_address: '192.168.1.30' },
        { timestamp: '2025-03-04T08:15:19', user: 'System', event_type: 'Security', description: 'Updated security profiles for 235 instruments', ip_address: '10.0.0.15' },
        { timestamp: '2025-03-31T09:00:45', user: 'System', event_type: 'API', description: 'API key API-001 usage: GET /api/clients', ip_address: '10.0.0.25' },
        { timestamp: '2025-03-31T08:45:23', user: 'Smart Bank Admin', event_type: 'Login', description: 'Successful login', ip_address: '192.168.1.10' }
      ]
    }
  };
  
  // Return the requested data or an empty object if not found
  return mockData[endpoint] || {};
};