// Data Service for fetching and processing data
app.service('DataService', function($http, $q) {
    // Cache for API responses
    let cache = {};
    
    // Helper to format data for charts
    function formatChartData(data) {
        // Format data for Chart.js
        return data;
    }
    
    // Get dashboard overview data
    this.getDashboardData = function() {
        if (cache.dashboard) {
            return $q.resolve(cache.dashboard);
        }
        
        return $http.get('/api/dashboard')
            .then(function(response) {
                cache.dashboard = response.data;
                return cache.dashboard;
            })
            .catch(function(error) {
                console.error('Error fetching dashboard data:', error);
                
                // Return mock data in case of error or for development
                let mockData = {
                    totalCustomers: 15842,
                    newCustomers: 216,
                    growth: 3.7,
                    totalTrades: 524789,
                    totalTradeValue: 8975642310,
                    tradeGrowth: 5.2,
                    openEvents: 16,
                    criticalEvents: 4,
                    entitlementValue: 72548900,
                    totalIncome: 92650000,
                    newIncome: 8250000,
                    incomeGrowth: 4.8,
                    metrics: {
                        keyMetrics: [
                            { label: 'Total Customers', value: 15842, growth: 3.7, icon: 'fa-users' },
                            { label: 'Total Trades', value: 524789, growth: 5.2, icon: 'fa-exchange-alt' },
                            { label: 'Open Events', value: 16, growth: -12.5, icon: 'fa-exclamation-circle' },
                            { label: 'Income (YTD)', value: 92650000, growth: 4.8, icon: 'fa-money-bill-wave' }
                        ],
                        secondaryMetrics: [
                            { label: 'New Customers', value: 216, growth: 2.5 },
                            { label: 'Trade Value', value: 8975642310, growth: 6.3 },
                            { label: 'Critical Events', value: 4, growth: -20.0 },
                            { label: 'New Income', value: 8250000, growth: 3.1 }
                        ]
                    },
                    recentActivity: [
                        { type: 'CUSTOMER', action: 'New customer added', entity: 'Acme Corp', time: '2 hours ago' },
                        { type: 'TRADE', action: 'Large trade executed', entity: 'HDFC Bank', time: '3 hours ago' },
                        { type: 'EVENT', action: 'Critical event resolved', entity: 'Payment Failure', time: '5 hours ago' },
                        { type: 'INCOME', action: 'Advisory fee received', entity: 'TCS Ltd', time: '6 hours ago' },
                        { type: 'CUSTOMER', action: 'KYC updated', entity: 'Reliance Industries', time: '8 hours ago' }
                    ],
                    monthlyTrend: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        datasets: [
                            {
                                label: 'Customers',
                                data: [14800, 14900, 15000, 15100, 15200, 15300, 15400, 15450, 15550, 15650, 15750, 15842]
                            },
                            {
                                label: 'Trades (thousands)',
                                data: [425, 435, 445, 455, 465, 475, 485, 490, 500, 510, 515, 525]
                            },
                            {
                                label: 'Income (millions)',
                                data: [6.5, 6.8, 7.1, 7.4, 7.6, 7.9, 8.1, 8.3, 8.6, 8.8, 9.0, 9.3]
                            }
                        ]
                    }
                };
                
                cache.dashboard = mockData;
                return mockData;
            });
    };
    
    // Get customers data
    this.getCustomersData = function() {
        if (cache.customers) {
            return $q.resolve(cache.customers);
        }
        
        return $http.get('/api/customers')
            .then(function(response) {
                cache.customers = response.data;
                return cache.customers;
            })
            .catch(function(error) {
                console.error('Error fetching customers data:', error);
                
                // Return mock data in case of error or for development
                let mockData = {
                    totalCustomers: 15842,
                    newCustomers: 216,
                    growth: 3.7,
                    monthlyData: [
                        { month: 'Jan', customers: 14800 },
                        { month: 'Feb', customers: 14900 },
                        { month: 'Mar', customers: 15000 },
                        { month: 'Apr', customers: 15100 },
                        { month: 'May', customers: 15200 },
                        { month: 'Jun', customers: 15300 },
                        { month: 'Jul', customers: 15400 },
                        { month: 'Aug', customers: 15450 },
                        { month: 'Sep', customers: 15550 },
                        { month: 'Oct', customers: 15650 },
                        { month: 'Nov', customers: 15750 },
                        { month: 'Dec', customers: 15842 }
                    ],
                    customersByProduct: [
                        { product: 'MUTUAL FUND', customers: 4850 },
                        { product: 'FD', customers: 3920 },
                        { product: 'PORTFOLIO', customers: 2780 },
                        { product: 'EQUITIES', customers: 2590 },
                        { product: 'BONDS', customers: 1702 }
                    ],
                    customersByCategory: [
                        { category: 'Individual', customers: 9505 },
                        { category: 'Corporate', customers: 4120 },
                        { category: 'Institutional', customers: 2217 }
                    ],
                    acquisitionChannels: [
                        { channel: 'Direct', customers: 7921 },
                        { channel: 'Referral', customers: 3960 },
                        { channel: 'Partnership', customers: 2376 },
                        { channel: 'Online', customers: 1585 }
                    ],
                    topCustomers: [
                        { name: 'Reliance Industries', assets: 1250000000, products: 5, lastActivity: '2 hours ago' },
                        { name: 'HDFC Bank', assets: 980000000, products: 4, lastActivity: '5 hours ago' },
                        { name: 'TCS Ltd', assets: 750000000, products: 3, lastActivity: '1 day ago' },
                        { name: 'Infosys', assets: 620000000, products: 4, lastActivity: '2 days ago' },
                        { name: 'SBI', assets: 580000000, products: 3, lastActivity: '3 days ago' }
                    ]
                };
                
                cache.customers = mockData;
                return mockData;
            });
    };
    
    // Get trade data
    this.getTradeData = function() {
        if (cache.trades) {
            return $q.resolve(cache.trades);
        }
        
        return $http.get('/api/trades')
            .then(function(response) {
                cache.trades = response.data;
                return cache.trades;
            })
            .catch(function(error) {
                console.error('Error fetching trade data:', error);
                
                // Return mock data in case of error or for development
                let mockData = {
                    totalTrades: 524789,
                    totalVolume: 8975642310,
                    growth: 5.2,
                    monthlyData: [
                        { month: 'Jan', trades: 41500, volume: 712500000 },
                        { month: 'Feb', trades: 42300, volume: 725800000 },
                        { month: 'Mar', trades: 43100, volume: 739200000 },
                        { month: 'Apr', trades: 43800, volume: 751300000 },
                        { month: 'May', trades: 44500, volume: 763500000 },
                        { month: 'Jun', trades: 45200, volume: 775600000 },
                        { month: 'Jul', trades: 45900, volume: 787800000 },
                        { month: 'Aug', trades: 46600, volume: 800000000 },
                        { month: 'Sep', trades: 47200, volume: 810000000 },
                        { month: 'Oct', trades: 47900, volume: 822200000 },
                        { month: 'Nov', trades: 48600, volume: 834300000 },
                        { month: 'Dec', trades: 49300, volume: 846500000 }
                    ],
                    tradesByProduct: [
                        { product: 'MUTUAL FUND', trades: 131200 },
                        { product: 'FD', trades: 157437 },
                        { product: 'PORTFOLIO', trades: 104958 },
                        { product: 'EQUITIES', trades: 78718 },
                        { product: 'BONDS', trades: 52476 }
                    ],
                    tradesByCustomerType: [
                        { type: 'Corporate', trades: 267641 },
                        { type: 'Individual', trades: 152188 },
                        { type: 'Institutional', trades: 104960 }
                    ],
                    tradePerformance: {
                        successRate: [98, 97, 99, 98, 96, 95, 97, 98, 99, 97, 96, 98],
                        avgProcessingTime: [5, 4.5, 4.8, 5.2, 5.5, 6, 5.8, 5.5, 5, 4.8, 4.5, 4.2]
                    },
                    largestTrades: [
                        { id: 'T-78954', customer: 'Reliance Industries', product: 'EQUITIES', value: 120000000, date: '2023-12-10' },
                        { id: 'T-79012', customer: 'HDFC Bank', product: 'BONDS', value: 85000000, date: '2023-12-09' },
                        { id: 'T-79056', customer: 'TCS Ltd', product: 'PORTFOLIO', value: 75000000, date: '2023-12-08' },
                        { id: 'T-79089', customer: 'Infosys', product: 'MUTUAL FUND', value: 60000000, date: '2023-12-07' },
                        { id: 'T-79102', customer: 'SBI', product: 'EQUITIES', value: 55000000, date: '2023-12-06' }
                    ]
                };
                
                cache.trades = mockData;
                return mockData;
            });
    };
    
    // Get income data
    this.getIncomeData = function() {
        if (cache.income) {
            return $q.resolve(cache.income);
        }
        
        return $http.get('/api/income')
            .then(function(response) {
                cache.income = response.data;
                return cache.income;
            })
            .catch(function(error) {
                console.error('Error fetching income data:', error);
                
                // Return mock data in case of error or for development
                let mockData = {
                    totalIncome: 92650000,
                    newIncome: 8250000,
                    growth: 4.8,
                    monthlyData: [
                        { month: 'Jan', income: 6500000 },
                        { month: 'Feb', income: 6800000 },
                        { month: 'Mar', income: 7100000 },
                        { month: 'Apr', income: 7400000 },
                        { month: 'May', income: 7600000 },
                        { month: 'Jun', income: 7900000 },
                        { month: 'Jul', income: 8100000 },
                        { month: 'Aug', income: 8300000 },
                        { month: 'Sep', income: 8600000 },
                        { month: 'Oct', income: 8800000 },
                        { month: 'Nov', income: 9000000 },
                        { month: 'Dec', income: 9300000 }
                    ],
                    incomeByProduct: [
                        { product: 'MUTUAL FUND', income: 23162500 },
                        { product: 'FD', income: 27795000 },
                        { product: 'PORTFOLIO', income: 18530000 },
                        { product: 'EQUITIES', income: 13897500 },
                        { product: 'BONDS', income: 9265000 }
                    ],
                    incomeByCategory: [
                        { category: 'Transaction Fees', income: 37060000 },
                        { category: 'Advisory Services', income: 20383000 },
                        { category: 'Custody Fees', income: 16677000 },
                        { category: 'Interest Income', income: 10191500 },
                        { category: 'Other Fees', income: 8338500 }
                    ],
                    quarterlyData: [
                        { quarter: 'Q1 2023', income: 20400000 },
                        { quarter: 'Q2 2023', income: 22900000 },
                        { quarter: 'Q3 2023', income: 25000000 },
                        { quarter: 'Q4 2023', income: 24350000 }
                    ],
                    topCustomersByIncome: [
                        { name: 'Reliance Industries', income: 7412000 },
                        { name: 'HDFC Bank', income: 6485500 },
                        { name: 'TCS Ltd', income: 5559000 },
                        { name: 'Infosys', income: 4632500 },
                        { name: 'SBI', income: 3706000 }
                    ]
                };
                
                cache.income = mockData;
                return mockData;
            });
    };
    
    // Get event data
    this.getEventData = function() {
        if (cache.events) {
            return $q.resolve(cache.events);
        }
        
        return $http.get('/api/events')
            .then(function(response) {
                cache.events = response.data;
                return cache.events;
            })
            .catch(function(error) {
                console.error('Error fetching event data:', error);
                
                // Return mock data in case of error or for development
                let mockData = {
                    openEvents: 16,
                    criticalEvents: 4,
                    openEntitlements: 5059041,
                    entitlementsValue: 72548900,
                    avgEventAge: 18,
                    maxEventAge: 45,
                    eventsByCategory: [
                        { category: 'Settlement', count: 5 },
                        { category: 'Corporate Action', count: 4 },
                        { category: 'Payment', count: 3 },
                        { category: 'Reconciliation', count: 2 },
                        { category: 'Data', count: 2 }
                    ],
                    eventsByPriority: [
                        { priority: 'Critical', count: 4 },
                        { priority: 'High', count: 6 },
                        { priority: 'Medium', count: 5 },
                        { priority: 'Low', count: 1 }
                    ],
                    eventsByAging: [
                        { range: '0-5 days', count: 3 },
                        { range: '6-15 days', count: 6 },
                        { range: '16-30 days', count: 4 },
                        { range: '31+ days', count: 3 }
                    ],
                    monthlyTrend: [
                        { month: 'Jan', newEvents: 12, resolvedEvents: 11 },
                        { month: 'Feb', newEvents: 14, resolvedEvents: 13 },
                        { month: 'Mar', newEvents: 16, resolvedEvents: 15 },
                        { month: 'Apr', newEvents: 15, resolvedEvents: 16 },
                        { month: 'May', newEvents: 18, resolvedEvents: 17 },
                        { month: 'Jun', newEvents: 20, resolvedEvents: 19 },
                        { month: 'Jul', newEvents: 22, resolvedEvents: 20 },
                        { month: 'Aug', newEvents: 21, resolvedEvents: 22 },
                        { month: 'Sep', newEvents: 23, resolvedEvents: 21 },
                        { month: 'Oct', newEvents: 25, resolvedEvents: 23 },
                        { month: 'Nov', newEvents: 24, resolvedEvents: 22 },
                        { month: 'Dec', newEvents: 22, resolvedEvents: 21 }
                    ],
                    openEvents: [
                        { id: 'EV-9821', category: 'Settlement', customer: 'HDFC Bank Ltd.', createdDate: '2023-12-10', age: 5, status: 'In Progress', priority: 'Critical' },
                        { id: 'EV-9845', category: 'Corporate Action', customer: 'Reliance Industries Ltd.', createdDate: '2023-12-08', age: 7, status: 'Pending', priority: 'High' },
                        { id: 'EV-9862', category: 'Payment', customer: 'Infosys Ltd.', createdDate: '2023-12-02', age: 13, status: 'Escalated', priority: 'Critical' },
                        { id: 'EV-9879', category: 'Reconciliation', customer: 'TCS Ltd.', createdDate: '2023-11-20', age: 25, status: 'In Progress', priority: 'Medium' },
                        { id: 'EV-9895', category: 'Data', customer: 'SBI', createdDate: '2023-11-05', age: 40, status: 'Pending', priority: 'Low' }
                    ]
                };
                
                cache.events = mockData;
                return mockData;
            });
    };
    
    // Get deal processing data
    this.getDealData = function() {
        if (cache.deals) {
            return $q.resolve(cache.deals);
        }
        
        return $http.get('/api/deals')
            .then(function(response) {
                cache.deals = response.data;
                return cache.deals;
            })
            .catch(function(error) {
                console.error('Error fetching deal data:', error);
                
                // Return mock data in case of error or for development
                let mockData = {
                    totalDeals: 256489,
                    avgProcessingTime: 8.5,
                    processingTimeChange: -12.3,
                    successRate: 98.7,
                    successRateChange: 1.2,
                    pendingDeals: 176,
                    oldestPendingDeal: 48,
                    dealsByStatus: [
                        { status: 'Completed', percentage: 76.5 },
                        { status: 'Processing', percentage: 12.8 },
                        { status: 'Pending', percentage: 8.9 },
                        { status: 'Failed', percentage: 1.8 }
                    ],
                    processingTimeTrend: [
                        { month: 'Jan', time: 12.8 },
                        { month: 'Feb', time: 12.3 },
                        { month: 'Mar', time: 11.5 },
                        { month: 'Apr', time: 10.9 },
                        { month: 'May', time: 10.2 },
                        { month: 'Jun', time: 9.8 },
                        { month: 'Jul', time: 9.5 },
                        { month: 'Aug', time: 9.2 },
                        { month: 'Sep', time: 8.9 },
                        { month: 'Oct', time: 8.7 },
                        { month: 'Nov', time: 8.6 },
                        { month: 'Dec', time: 8.5 }
                    ],
                    dealVolumeByType: [
                        { month: 'Jan', equity: 320, bond: 280, mutualFund: 420, fd: 180, portfolio: 250 },
                        { month: 'Feb', equity: 350, bond: 290, mutualFund: 440, fd: 190, portfolio: 260 },
                        { month: 'Mar', equity: 380, bond: 300, mutualFund: 460, fd: 200, portfolio: 270 },
                        { month: 'Apr', equity: 360, bond: 320, mutualFund: 480, fd: 210, portfolio: 280 },
                        { month: 'May', equity: 390, bond: 330, mutualFund: 500, fd: 220, portfolio: 290 },
                        { month: 'Jun', equity: 410, bond: 340, mutualFund: 520, fd: 230, portfolio: 300 },
                        { month: 'Jul', equity: 450, bond: 350, mutualFund: 540, fd: 240, portfolio: 310 },
                        { month: 'Aug', equity: 470, bond: 360, mutualFund: 550, fd: 250, portfolio: 320 },
                        { month: 'Sep', equity: 490, bond: 380, mutualFund: 570, fd: 260, portfolio: 330 },
                        { month: 'Oct', equity: 510, bond: 390, mutualFund: 590, fd: 270, portfolio: 340 },
                        { month: 'Nov', equity: 540, bond: 410, mutualFund: 610, fd: 280, portfolio: 350 },
                        { month: 'Dec', equity: 570, bond: 420, mutualFund: 630, fd: 290, portfolio: 360 }
                    ],
                    errorRateByType: [
                        { type: 'Equity', rate: 0.8 },
                        { type: 'Bond', rate: 1.6 },
                        { type: 'Mutual Fund', rate: 1.2 },
                        { type: 'FD', rate: 0.5 },
                        { type: 'Portfolio', rate: 1.3 }
                    ],
                    pendingIssues: [
                        { id: 'D-78954', type: 'Equity', customer: 'Akash Mehta', issue: 'Settlement delay', status: 'Pending', age: 36 },
                        { id: 'D-78967', type: 'Mutual Fund', customer: 'Priya Sharma', issue: 'Incorrect fund details', status: 'Processing', age: 24 },
                        { id: 'D-79012', type: 'Bond', customer: 'Vikram Singh', issue: 'Pricing mismatch', status: 'Critical', age: 48 },
                        { id: 'D-79056', type: 'FD', customer: 'Neha Patel', issue: 'Interest rate discrepancy', status: 'Processing', age: 12 },
                        { id: 'D-79089', type: 'Portfolio', customer: 'Raj Kumar', issue: 'Allocation error', status: 'Pending', age: 18 }
                    ]
                };
                
                cache.deals = mockData;
                return mockData;
            });
    };
    
    // Get corporate actions data
    this.getCorporateActionsData = function() {
        if (cache.corporateActions) {
            return $q.resolve(cache.corporateActions);
        }
        
        return $http.get('/api/corporate-actions')
            .then(function(response) {
                cache.corporateActions = response.data;
                return cache.corporateActions;
            })
            .catch(function(error) {
                console.error('Error fetching corporate actions data:', error);
                
                // Return mock data in case of error or for development
                let mockData = {
                    totalActions: 4821,
                    pendingActions: 187,
                    criticalActions: 32,
                    avgProcessingTime: 24.5,
                    processingTimeChange: -8.6,
                    successRate: 97.2,
                    successRateChange: 1.5,
                    actionsByType: [
                        { type: 'Dividend', percentage: 45 },
                        { type: 'Rights Issue', percentage: 15 },
                        { type: 'Bonus', percentage: 20 },
                        { type: 'Split', percentage: 10 },
                        { type: 'Merger', percentage: 10 }
                    ],
                    monthlyActionVolume: [
                        { month: 'Jan', volume: 280 },
                        { month: 'Feb', volume: 320 },
                        { month: 'Mar', volume: 350 },
                        { month: 'Apr', volume: 310 },
                        { month: 'May', volume: 370 },
                        { month: 'Jun', volume: 390 },
                        { month: 'Jul', volume: 420 },
                        { month: 'Aug', volume: 410 },
                        { month: 'Sep', volume: 450 },
                        { month: 'Oct', volume: 480 },
                        { month: 'Nov', volume: 510 },
                        { month: 'Dec', volume: 530 }
                    ],
                    processingTimeByType: [
                        { month: 'Jan', dividend: 32, rightsIssue: 48, bonus: 36, split: 18, merger: 60 },
                        { month: 'Feb', dividend: 30, rightsIssue: 46, bonus: 35, split: 18, merger: 58 },
                        { month: 'Mar', dividend: 29, rightsIssue: 44, bonus: 34, split: 17, merger: 56 },
                        { month: 'Apr', dividend: 28, rightsIssue: 42, bonus: 33, split: 17, merger: 54 },
                        { month: 'May', dividend: 28, rightsIssue: 40, bonus: 32, split: 16, merger: 52 },
                        { month: 'Jun', dividend: 27, rightsIssue: 38, bonus: 31, split: 16, merger: 50 },
                        { month: 'Jul', dividend: 26, rightsIssue: 36, bonus: 30, split: 15, merger: 48 },
                        { month: 'Aug', dividend: 25, rightsIssue: 35, bonus: 29, split: 15, merger: 46 },
                        { month: 'Sep', dividend: 24, rightsIssue: 33, bonus: 28, split: 14, merger: 44 },
                        { month: 'Oct', dividend: 23, rightsIssue: 32, bonus: 28, split: 14, merger: 42 },
                        { month: 'Nov', dividend: 24, rightsIssue: 31, bonus: 27, split: 14, merger: 40 },
                        { month: 'Dec', dividend: 24, rightsIssue: 30, bonus: 26, split: 13, merger: 38 }
                    ],
                    actionsByStatus: [
                        { status: 'Completed', percentage: 79.5 },
                        { status: 'In Progress', percentage: 12.3 },
                        { status: 'Pending', percentage: 7.2 },
                        { status: 'Failed', percentage: 1.0 }
                    ],
                    pendingActions: [
                        { id: 'CA-1234', type: 'Dividend', security: 'HDFC Bank Ltd.', exDate: '2023-12-15', recordDate: '2023-12-17', status: 'Pending', priority: 'High' },
                        { id: 'CA-1235', type: 'Rights Issue', security: 'Reliance Industries Ltd.', exDate: '2023-12-20', recordDate: '2023-12-22', status: 'Processing', priority: 'Critical' },
                        { id: 'CA-1236', type: 'Bonus', security: 'Infosys Ltd.', exDate: '2023-12-18', recordDate: '2023-12-20', status: 'Pending', priority: 'Medium' },
                        { id: 'CA-1237', type: 'Split', security: 'TCS Ltd.', exDate: '2023-12-25', recordDate: '2023-12-27', status: 'Scheduled', priority: 'Low' },
                        { id: 'CA-1238', type: 'Merger', security: 'SBI', exDate: '2023-12-12', recordDate: '2023-12-14', status: 'Processing', priority: 'High' }
                    ]
                };
                
                cache.corporateActions = mockData;
                return mockData;
            });
    };
    
    // Clear cache (used for refreshing data)
    this.clearCache = function() {
        cache = {};
    };
});