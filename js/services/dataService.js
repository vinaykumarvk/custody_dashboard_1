// Data service for handling all data operations
app.service('DataService', function($http) {
    var service = this;
    
    // Fetch customers data
    service.getCustomersData = function() {
        // In a real app, this would be an API call
        // return $http.get('/api/customers').then(function(response) {
        //     return response.data;
        // });
        
        // For demo, return mock data
        return Promise.resolve({
            totalCustomers: 139860,
            newCustomers: 20800,
            growth: 12.5,
            monthlyData: [
                { month: 'Jan', customers: 119060 },
                { month: 'Feb', customers: 121200 },
                { month: 'Mar', customers: 123500 },
                { month: 'Apr', customers: 125800 },
                { month: 'May', customers: 128300 },
                { month: 'Jun', customers: 130500 },
                { month: 'Jul', customers: 132900 },
                { month: 'Aug', customers: 134700 },
                { month: 'Sep', customers: 136200 },
                { month: 'Oct', customers: 137500 },
                { month: 'Nov', customers: 138700 },
                { month: 'Dec', customers: 139860 }
            ],
            customersByProduct: [
                { product: 'MUTUAL FUND', customers: 28000 },
                { product: 'FD', customers: 31000 },
                { product: 'PORTFOLIO', customers: 41000 }
            ]
        });
    };
    
    // Fetch income data
    service.getIncomeData = function() {
        // Mock data
        return Promise.resolve({
            totalIncome: 8051872,
            newIncome: 2561736,
            growth: 8.2,
            monthlyData: [
                { month: 'Jan', income: 5600000 },
                { month: 'Feb', income: 5900000 },
                { month: 'Mar', income: 6200000 },
                { month: 'Apr', income: 6100000 },
                { month: 'May', income: 6800000 },
                { month: 'Jun', income: 7200000 },
                { month: 'Jul', income: 7500000 },
                { month: 'Aug', income: 7300000 },
                { month: 'Sep', income: 7900000 },
                { month: 'Oct', income: 8200000 },
                { month: 'Nov', income: 8500000 },
                { month: 'Dec', income: 8051872 }
            ],
            incomeByProduct: [
                { product: 'MUTUAL FUND', income: 2041976.21 },
                { product: 'FD', income: 1765430.99 },
                { product: 'PORTFOLIO', income: 1607418.08 }
            ]
        });
    };
    
    // Fetch trade data
    service.getTradeData = function() {
        // Mock data
        return Promise.resolve({
            totalTrades: 1021258,
            totalVolume: 11853498,
            growth: 15.3,
            monthlyData: [
                { month: 'Jan', trades: 72500, volume: 850000 },
                { month: 'Feb', trades: 74800, volume: 880000 },
                { month: 'Mar', trades: 77200, volume: 910000 },
                { month: 'Apr', trades: 79700, volume: 930000 },
                { month: 'May', trades: 82000, volume: 960000 },
                { month: 'Jun', trades: 84500, volume: 990000 },
                { month: 'Jul', trades: 87100, volume: 1020000 },
                { month: 'Aug', trades: 89500, volume: 1050000 },
                { month: 'Sep', trades: 92100, volume: 1080000 },
                { month: 'Oct', trades: 94800, volume: 1110000 },
                { month: 'Nov', trades: 97300, volume: 1140000 },
                { month: 'Dec', trades: 1021258, volume: 11853498 }
            ],
            tradesByProduct: [
                { product: 'MUTUAL FUND', trades: 69200.00 },
                { product: 'FD', trades: 1564498.00 },
                { product: 'PORTFOLIO', trades: 3369000.00 }
            ]
        });
    };
    
    // Fetch events data
    service.getEventsData = function() {
        // Mock data
        return Promise.resolve({
            openEvents: 16,
            openEntitlements: 5059041,
            monthlyData: [
                { month: 'Jan', events: 10, entitlements: 3500000 },
                { month: 'Feb', events: 8, entitlements: 3600000 },
                { month: 'Mar', events: 12, entitlements: 3700000 },
                { month: 'Apr', events: 11, entitlements: 3800000 },
                { month: 'May', events: 9, entitlements: 3900000 },
                { month: 'Jun', events: 15, entitlements: 4100000 },
                { month: 'Jul', events: 14, entitlements: 4300000 },
                { month: 'Aug', events: 13, entitlements: 4500000 },
                { month: 'Sep', events: 16, entitlements: 4700000 },
                { month: 'Oct', events: 15, entitlements: 4850000 },
                { month: 'Nov', events: 18, entitlements: 5000000 },
                { month: 'Dec', events: 16, entitlements: 5059041 }
            ]
        });
    };
    
    // Fetch payment aging data
    service.getPaymentAgingData = function() {
        // Mock data
        return Promise.resolve([
            { range: '0-30 Days', amount: 2679 },
            { range: '31-60 Days', amount: 0 },
            { range: '61-90 Days', amount: 3669666 },
            { range: '91+ Days', amount: 36805 }
        ]);
    };
    
    // Fetch tickets aging data
    service.getTicketsAgingData = function() {
        // Mock data
        return Promise.resolve([
            { range: '0-15 days', count: 0 },
            { range: '16-30 days', count: 2 },
            { range: '31-45 days', count: 7 },
            { range: '45+ days', count: 29 }
        ]);
    };
    
    // Fetch prediction data
    service.getPredictionData = function() {
        // Mock data
        return Promise.resolve({
            transactionPrediction: [
                { month: 'Sep', year: '2023', count: 2.74 },
                { month: 'Oct', year: '2023', count: 3.71 },
                { month: 'Nov', year: '2023', count: 2.21 },
                { month: 'Sep', year: '2024', count: 3.0 },
                { month: 'Oct', year: '2024', count: 3.73 },
                { month: 'Nov', year: '2024', count: 3.89 },
                { month: 'Sep', year: '2025', count: 4.3 },
                { month: 'Oct', year: '2025', count: 4.54 },
                { month: 'Nov', year: '2025', count: 3.98 }
            ],
            clientPrediction: [
                { month: 'Sep', year: '2023', count: 21.67 },
                { month: 'Oct', year: '2023', count: 29.27 },
                { month: 'Nov', year: '2023', count: 22.14 },
                { month: 'Sep', year: '2024', count: 30.03 },
                { month: 'Oct', year: '2024', count: 26.6 },
                { month: 'Nov', year: '2024', count: 30.54 },
                { month: 'Sep', year: '2025', count: 40.23 },
                { month: 'Oct', year: '2025', count: 49.61 },
                { month: 'Nov', year: '2025', count: 45.39 }
            ],
            eventsDetailsPrediction: [
                { month: 'Sep', year: '2023', count: 240 },
                { month: 'Oct', year: '2023', count: 290 },
                { month: 'Nov', year: '2023', count: 320 },
                { month: 'Sep', year: '2024', count: 250 },
                { month: 'Oct', year: '2024', count: 220 },
                { month: 'Nov', year: '2024', count: 200 },
                { month: 'Sep', year: '2025', count: 350 },
                { month: 'Oct', year: '2025', count: 340 },
                { month: 'Nov', year: '2025', count: 340 }
            ],
            entitlementsPrediction: [
                { month: 'Sep', year: '2023', count: 34.26 },
                { month: 'Oct', year: '2023', count: 24.59 },
                { month: 'Nov', year: '2023', count: 14.79 },
                { month: 'Sep', year: '2024', count: 20.07 },
                { month: 'Oct', year: '2024', count: 27.27 },
                { month: 'Nov', year: '2024', count: 13.91 },
                { month: 'Sep', year: '2025', count: 36.87 },
                { month: 'Oct', year: '2025', count: 36.36 },
                { month: 'Nov', year: '2025', count: 35.34 }
            ]
        });
    };
    
    return service;
});