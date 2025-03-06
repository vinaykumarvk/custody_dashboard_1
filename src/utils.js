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
    reports: {
      available_reports: 48,
      generated_reports_mtd: 156,
      scheduled_reports: 12,
      favorite_reports: 5,
      report_categories: [
        { category: 'Regulatory', count: 15 },
        { category: 'Operational', count: 12 },
        { category: 'Client', count: 10 },
        { category: 'Financial', count: 8 },
        { category: 'Audit', count: 3 }
      ],
      recent_reports: [
        {
          report_id: 'REP-10045',
          name: 'Monthly Activity Summary',
          category: 'Client',
          generated_date: '2025-03-01T15:30:22',
          generated_by: 'Sarah Williams',
          format: 'PDF',
          status: 'Completed'
        },
        {
          report_id: 'REP-10044',
          name: 'Regulatory Capital Report',
          category: 'Regulatory',
          generated_date: '2025-03-01T12:15:47',
          generated_by: 'John Anderson',
          format: 'XLS',
          status: 'Completed'
        },
        {
          report_id: 'REP-10043',
          name: 'Failed Trade Analysis',
          category: 'Operational',
          generated_date: '2025-03-01T09:48:33',
          generated_by: 'Michael Chen',
          format: 'PDF',
          status: 'Completed'
        },
        {
          report_id: 'REP-10042',
          name: 'Asset Holdings Report',
          category: 'Client',
          generated_date: '2025-02-28T16:22:05',
          generated_by: 'Lisa Johnson',
          format: 'XLS',
          status: 'Completed'
        },
        {
          report_id: 'REP-10041',
          name: 'Settlement Efficiency Report',
          category: 'Operational',
          generated_date: '2025-02-28T14:10:19',
          generated_by: 'David Smith',
          format: 'PDF',
          status: 'Completed'
        }
      ],
      scheduled_reports: [
        {
          schedule_id: 'SCH-1234',
          report_name: 'Daily Position Report',
          frequency: 'Daily',
          next_run: '2025-03-03T18:00:00',
          recipients: 'trading@smartbank.com',
          format: 'PDF',
          created_by: 'James Wilson'
        },
        {
          schedule_id: 'SCH-1235',
          report_name: 'Weekly Custody Fee Report',
          frequency: 'Weekly',
          next_run: '2025-03-07T17:00:00',
          recipients: 'billing@smartbank.com, finance@smartbank.com',
          format: 'XLS',
          created_by: 'Emma Thompson'
        },
        {
          schedule_id: 'SCH-1236',
          report_name: 'Monthly Client Statement',
          frequency: 'Monthly',
          next_run: '2025-04-01T00:00:00',
          recipients: 'clientservices@smartbank.com',
          format: 'PDF',
          created_by: 'Robert Johnson'
        }
      ],
      available_report_list: [
        {
          id: 101,
          name: 'Account Holdings Summary',
          category: 'Client',
          description: 'Summary of all holdings for client accounts, including market values and asset allocations.',
          last_generated: '2025-03-01T10:45:22',
          available_formats: ['pdf', 'xlsx', 'csv']
        },
        {
          id: 102,
          name: 'Transaction Activity Report',
          category: 'Client',
          description: 'Detailed list of all transactions for a specified period, including trades, corporate actions and cash movements.',
          last_generated: '2025-03-01T14:30:15',
          available_formats: ['pdf', 'xlsx', 'csv']
        },
        {
          id: 103,
          name: 'Settlement Status Report',
          category: 'Operational',
          description: 'Current settlement status of all trades, highlighting exceptions and failed settlements.',
          last_generated: '2025-03-01T08:15:33',
          available_formats: ['pdf', 'xlsx', 'json']
        },
        {
          id: 104,
          name: 'Income and Corporate Actions Calendar',
          category: 'Operational',
          description: 'Calendar view of upcoming income payments and corporate actions for the next 30 days.',
          last_generated: '2025-02-28T16:45:12',
          available_formats: ['pdf', 'xlsx', 'ics']
        },
        {
          id: 105,
          name: 'Regulatory Holdings Report',
          category: 'Regulatory',
          description: 'Report of holdings for regulatory filing purposes, formatted according to regulatory requirements.',
          last_generated: '2025-02-28T11:30:45',
          available_formats: ['pdf', 'xlsx', 'xml']
        },
        {
          id: 106,
          name: 'Risk Exposure Analysis',
          category: 'Financial',
          description: 'Analysis of portfolio risk exposures including market, credit, and concentration risks.',
          last_generated: '2025-02-27T15:20:10',
          available_formats: ['pdf', 'xlsx']
        },
        {
          id: 107,
          name: 'Fee Revenue Report',
          category: 'Financial',
          description: 'Breakdown of custody and administration fees by client, service type, and asset class.',
          last_generated: '2025-02-27T09:45:38',
          available_formats: ['pdf', 'xlsx']
        },
        {
          id: 108,
          name: 'Asset Servicing Exception Report',
          category: 'Operational',
          description: 'Detailed report of exceptions in corporate actions, income events, and tax processing.',
          last_generated: '2025-02-26T14:15:22',
          available_formats: ['pdf', 'xlsx', 'csv']
        },
        {
          id: 109,
          name: 'Compliance Monitoring Report',
          category: 'Regulatory',
          description: 'Report on compliance with internal policies and regulatory requirements.',
          last_generated: '2025-02-26T10:30:45',
          available_formats: ['pdf', 'xlsx']
        },
        {
          id: 110,
          name: 'Client Profitability Analysis',
          category: 'Financial',
          description: 'Analysis of client-level profitability across service lines and products.',
          last_generated: '2025-02-25T16:40:15',
          available_formats: ['pdf', 'xlsx']
        },
        {
          id: 111,
          name: 'Audit Trail Report',
          category: 'Audit',
          description: 'Detailed log of all system actions and user activities for audit purposes.',
          last_generated: '2025-02-25T11:15:33',
          available_formats: ['pdf', 'xlsx', 'csv']
        },
        {
          id: 112,
          name: 'New Account Setup Report',
          category: 'Operational',
          description: 'Status report of all new accounts in the setup process, including pending items.',
          last_generated: '2025-02-24T15:50:22',
          available_formats: ['pdf', 'xlsx']
        }
      ]
    },
    'customers': {
      total_customers: 19632,
      active_customers: 17254,
      inactive_customers: 2378,
      new_customers_mtd: 436,
      new_customers_ytd: 3097,
      total_accounts: 34257,
      active_accounts: 29478,
      kyc_pending: 184,
      onboarding_in_progress: 342,
      
      // Customer segments data
      customer_segments: [
        { segment: 'Institutional', count: 8835, percentage: 0.45 },
        { segment: 'Corporate', count: 5890, percentage: 0.30 },
        { segment: 'Wealth Management', count: 3926, percentage: 0.20 },
        { segment: 'Retail', count: 981, percentage: 0.05 }
      ],
      
      // Customer by region data
      customers_by_region: [
        { region: 'North America', count: 9816 },
        { region: 'Europe', count: 5889 },
        { region: 'Asia Pacific', count: 2945 },
        { region: 'Middle East', count: 589 },
        { region: 'Latin America', count: 393 }
      ],
      
      // Customer growth data
      customers_monthly: [
        { date: '2024-03-31', total_customers: 1230, new_customers: 1230 },
        { date: '2024-04-30', total_customers: 2955, new_customers: 1725 },
        { date: '2024-05-31', total_customers: 4514, new_customers: 1559 },
        { date: '2024-06-30', total_customers: 5886, new_customers: 1372 },
        { date: '2024-07-31', total_customers: 7578, new_customers: 1692 },
        { date: '2024-08-31', total_customers: 9396, new_customers: 1818 },
        { date: '2024-09-30', total_customers: 11047, new_customers: 1651 },
        { date: '2024-10-31', total_customers: 13018, new_customers: 1971 },
        { date: '2024-11-30', total_customers: 14759, new_customers: 1741 },
        { date: '2024-12-31', total_customers: 16462, new_customers: 1703 },
        { date: '2025-01-31', total_customers: 18009, new_customers: 1547 },
        { date: '2025-02-28', total_customers: 19407, new_customers: 1398 },
        { date: '2025-03-31', total_customers: 19632, new_customers: 225 }
      ],
      
      // Recent customers
      recent_customers: [
        {
          customer_id: 'C-87543',
          name: 'Platinum Asset Management',
          type: 'Institutional',
          date_onboarded: '2025-03-01',
          country: 'United States',
          accounts: 4,
          status: 'Active',
          relationship_manager: 'Sarah Wilson',
          aum: 425000000,
          contact_name: 'Michael Thompson',
          contact_email: 'michael.thompson@platinum-am.com',
          contact_phone: '+1-212-555-7890'
        },
        {
          customer_id: 'C-87544',
          name: 'Global Securities Corp',
          type: 'Corporate',
          date_onboarded: '2025-03-01',
          country: 'United Kingdom',
          accounts: 2,
          status: 'Active',
          relationship_manager: 'James Roberts',
          aum: 125000000,
          contact_name: 'Emma Davies',
          contact_email: 'emma.davies@globalsec.com',
          contact_phone: '+44-20-5555-1234'
        },
        {
          customer_id: 'C-87545',
          name: 'Pacific Wealth Advisors',
          type: 'Wealth Management',
          date_onboarded: '2025-03-02',
          country: 'Singapore',
          accounts: 8,
          status: 'Pending',
          relationship_manager: 'Daniel Chen',
          aum: 85000000,
          contact_name: 'Sophia Tan',
          contact_email: 'sophia.tan@pacificwealth.com',
          contact_phone: '+65-6555-9876'
        },
        {
          customer_id: 'C-87546',
          name: 'Europa Investment Partners',
          type: 'Institutional',
          date_onboarded: '2025-03-02',
          country: 'Germany',
          accounts: 3,
          status: 'Active',
          relationship_manager: 'Laura Schmidt',
          aum: 310000000,
          contact_name: 'Hans Mueller',
          contact_email: 'hans.mueller@europainvest.com',
          contact_phone: '+49-30-5555-4321'
        },
        {
          customer_id: 'C-87547',
          name: 'Alpha Retirement Solutions',
          type: 'Corporate',
          date_onboarded: '2025-03-03',
          country: 'Australia',
          accounts: 5,
          status: 'Active',
          relationship_manager: 'Thomas Johnson',
          aum: 175000000,
          contact_name: 'Jessica White',
          contact_email: 'jessica.white@alpharetire.com',
          contact_phone: '+61-2-5555-7654'
        }
      ]
    },
    'income': {
      total_income_ytd: 32458765,
      total_income_mtd: 3457892,
      fees_collected: 24765432,
      fees_outstanding: 3254678,
      average_fee_per_customer: 1654,
      income_growth_yoy: 0.17,
      
      // Income by service type
      income_by_service: [
        { service: 'Custody Fees', amount: 17843621, percentage: 0.55 },
        { service: 'Trading Commissions', amount: 8114692, percentage: 0.25 },
        { service: 'Corporate Action Fees', amount: 3245876, percentage: 0.10 },
        { service: 'Other Services', amount: 3254576, percentage: 0.10 }
      ],
      
      // Income by region
      income_by_region: [
        { region: 'North America', amount: 16229382 },
        { region: 'Europe', amount: 8114691 },
        { region: 'Asia Pacific', amount: 4868815 },
        { region: 'Middle East', amount: 1622938 },
        { region: 'Latin America', amount: 1622939 }
      ],
      
      // Monthly income history
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
      
      // Top revenue customers
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
      
      // Report categories
      report_categories: [
        { category: 'Compliance', count: 12 },
        { category: 'Performance', count: 9 },
        { category: 'Trading', count: 8 },
        { category: 'Settlements', count: 7 },
        { category: 'Corporate Actions', count: 6 }
      ],
      
      // Recent reports
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
      
      // Scheduled reports
      scheduled_reports: [
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
      
      // System settings
      system_settings: {
        maintenance_mode: false,
        system_version: '2.5.1',
        database_version: '1.8.3',
        api_version: '3.2.0',
        last_backup: '2025-03-03T23:00:00',
        last_update: '2025-02-28T01:30:00'
      },
      
      // User roles and permissions
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
      
      // Recent trades data
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
      
      // Trade by asset class
      trade_by_asset_class: [
        { asset_class: 'Equities', value: 5247 },
        { asset_class: 'Fixed Income', value: 2145 },
        { asset_class: 'FX', value: 782 },
        { asset_class: 'Derivatives', value: 561 }
      ],
      
      // Trade volume history
      volume_history: [
        { date: '2025-02-01', volume: 54325000 },
        { date: '2025-02-03', volume: 58741000 },
        { date: '2025-02-05', volume: 61230000 },
        { date: '2025-02-07', volume: 59845000 },
        { date: '2025-02-09', volume: 57621000 },
        { date: '2025-02-11', volume: 60125000 },
        { date: '2025-02-13', volume: 63420000 },
        { date: '2025-02-15', volume: 65740000 },
        { date: '2025-02-17', volume: 62350000 },
        { date: '2025-02-19', volume: 59845000 },
        { date: '2025-02-21', volume: 61250000 },
        { date: '2025-02-23', volume: 63710000 },
        { date: '2025-02-25', volume: 60254000 },
        { date: '2025-02-27', volume: 58630000 },
        { date: '2025-03-01', volume: 61745000 },
        { date: '2025-03-03', volume: 65320000 }
      ]
    },
    'settlements': {
      total_settlements: 7634,
      settlement_volume: 1687543200,
      avg_settlement_time: 24.5,
      fails_rate: 0.03,
      completed_settlements: 6952,
      pending_settlements: 589,
      failed_settlements: 93,
      pending_value: 832456000,
      
      // Recent settlements
      recent_settlements: [
        {
          settlement_id: 'S-45321',
          trade_id: 'T-78945',
          date: '2025-03-03T14:30:00',
          trade_date: '2025-03-01T14:32:17',
          client_name: 'BlackRock Inc.',
          client_id: 'C-54321',
          security_name: 'Apple Inc.',
          isin: 'US0378331005',
          amount: 1250000,
          fees: 3125,
          currency: 'USD',
          status: 'Completed',
          settlement_method: 'DvP',
          depository: 'DTC',
          account_id: 'A-1234',
          settlement_instructions: 'Standard settlement instructions applied.',
          notes: 'Settled on time with no issues.'
        },
        {
          settlement_id: 'S-45322',
          trade_id: 'T-78946',
          date: '2025-03-03T15:15:00',
          trade_date: '2025-03-01T15:47:38',
          client_name: 'Vanguard Group',
          client_id: 'C-54322',
          security_name: 'Microsoft Corp',
          isin: 'US5949181045',
          amount: 980490,
          fees: 2451.23,
          currency: 'USD',
          status: 'Completed',
          settlement_method: 'DvP',
          depository: 'DTC',
          account_id: 'A-2234',
          settlement_instructions: 'Standard settlement instructions applied.',
          notes: 'Settled on time with no issues.'
        },
        {
          settlement_id: 'S-45323',
          trade_id: 'T-78950',
          date: '2025-03-04T10:00:00',
          trade_date: '2025-03-02T09:15:22',
          client_name: 'State Street Corp',
          client_id: 'C-54323',
          security_name: 'Alphabet Inc.',
          isin: 'US02079K3059',
          amount: 1875996,
          fees: 4689.99,
          currency: 'USD',
          status: 'Pending',
          settlement_method: 'DvP',
          depository: 'DTC',
          account_id: 'A-3234',
          settlement_instructions: 'Standard settlement instructions to be applied.',
          notes: 'Awaiting confirmation from counterparty.'
        },
        {
          settlement_id: 'S-45324',
          trade_id: 'T-78953',
          date: '2025-03-04T11:00:00',
          trade_date: '2025-03-02T10:28:45',
          client_name: 'Fidelity Investments',
          client_id: 'C-54324',
          security_name: 'Amazon.com Inc.',
          isin: 'US0231351067',
          amount: 2149998,
          fees: 5375,
          currency: 'USD',
          status: 'Pending',
          settlement_method: 'DvP',
          depository: 'DTC',
          account_id: 'A-4234',
          settlement_instructions: 'Standard settlement instructions to be applied.',
          notes: 'Large settlement amount requires additional verification.'
        },
        {
          settlement_id: 'S-45325',
          trade_id: 'T-78957',
          date: '2025-03-04T12:00:00',
          trade_date: '2025-03-02T13:42:19',
          client_name: 'JP Morgan Asset Management',
          client_id: 'C-54325',
          security_name: 'Tesla, Inc.',
          isin: 'US88160R1014',
          amount: 1563996,
          fees: 3909.98,
          currency: 'USD',
          status: 'Failed',
          settlement_method: 'DvP',
          depository: 'DTC',
          account_id: 'A-5234',
          settlement_instructions: 'Standard settlement instructions applied.',
          notes: 'Settlement failed due to insufficient securities in client account.',
          failure_reason: 'Insufficient securities in the client account for delivery.'
        },
        {
          settlement_id: 'S-45326',
          trade_id: 'T-78960',
          date: '2025-03-05T09:30:00',
          trade_date: '2025-03-03T08:22:34',
          client_name: 'UBS Asset Management',
          client_id: 'C-54326',
          security_name: 'Facebook Inc.',
          isin: 'US30303M1027',
          amount: 704990,
          fees: 1762.47,
          currency: 'USD',
          status: 'Pending',
          settlement_method: 'DvP',
          depository: 'DTC',
          account_id: 'A-6234',
          settlement_instructions: 'Standard settlement instructions to be applied.',
          notes: 'Waiting for settlement date.'
        }
      ],
      
      // Settlement by currency
      settlement_by_currency: [
        { currency: 'USD', value: 5218 },
        { currency: 'EUR', value: 1254 },
        { currency: 'GBP', value: 632 },
        { currency: 'JPY', value: 324 },
        { currency: 'CHF', value: 145 },
        { currency: 'Other', value: 61 }
      ],
      
      // Settlement history
      settlement_history: [
        { date: '2025-02-01', completed: 243, failed: 4, pending: 21 },
        { date: '2025-02-03', completed: 257, failed: 5, pending: 18 },
        { date: '2025-02-05', completed: 271, failed: 3, pending: 15 },
        { date: '2025-02-07', completed: 264, failed: 6, pending: 19 },
        { date: '2025-02-09', completed: 254, failed: 4, pending: 22 },
        { date: '2025-02-11', completed: 268, failed: 2, pending: 20 },
        { date: '2025-02-13', completed: 280, failed: 5, pending: 17 },
        { date: '2025-02-15', completed: 291, failed: 4, pending: 14 },
        { date: '2025-02-17', completed: 276, failed: 6, pending: 18 },
        { date: '2025-02-19', completed: 264, failed: 5, pending: 21 },
        { date: '2025-02-21', completed: 271, failed: 3, pending: 19 },
        { date: '2025-02-23', completed: 282, failed: 4, pending: 16 },
        { date: '2025-02-25', completed: 267, failed: 5, pending: 20 },
        { date: '2025-02-27', completed: 259, failed: 3, pending: 22 },
        { date: '2025-03-01', completed: 273, failed: 4, pending: 18 },
        { date: '2025-03-03', completed: 289, failed: 5, pending: 16 }
      ]
    },
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