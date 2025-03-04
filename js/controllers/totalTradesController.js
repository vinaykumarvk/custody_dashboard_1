// Total Trades controller
app.controller('TotalTradesController', function($scope, DataService) {
    // Initialize chart options
    $scope.lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        legend: {
            display: true,
            position: 'top'
        }
    };
    
    $scope.pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: true,
            position: 'bottom'
        }
    };
    
    $scope.barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };
    
    $scope.mixedChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                id: 'y-axis-1',
                type: 'linear',
                position: 'left',
                ticks: {
                    beginAtZero: true
                }
            }, {
                id: 'y-axis-2',
                type: 'linear',
                position: 'right',
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };
    
    // Month labels
    $scope.monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Fetch trade data
    DataService.getTradeData().then(function(data) {
        // Set general metrics
        $scope.totalTrades = data.totalTrades;
        $scope.totalVolume = data.totalVolume;
        $scope.tradeGrowth = data.growth;
        $scope.monthlyAverage = Math.round(data.totalTrades / 12);
        $scope.monthlyChange = 3.8;
        
        // Prepare chart data
        let monthlyVolume = data.monthlyData.map(item => item.volume / 1000); // scaled for display
        $scope.tradeVolumeData = [monthlyVolume];
        
        let monthlyTrades = data.monthlyData.map(item => item.trades);
        $scope.tradeCountData = [monthlyTrades];
        
        // Product distribution
        $scope.productLabels = data.tradesByProduct.map(item => item.product);
        $scope.tradesByProductData = data.tradesByProduct.map(item => item.trades);
        
        // Performance data
        $scope.tradePerformanceData = [
            [98, 97, 99, 98, 96, 95, 97, 98, 99, 97, 96, 98], // Success Rate
            [5, 4.5, 4.8, 5.2, 5.5, 6, 5.8, 5.5, 5, 4.8, 4.5, 4.2] // Avg Processing Time
        ];
        
        // Sample trade breakdown
        $scope.tradeBreakdown = [
            {
                product: 'MUTUAL FUND',
                volume: 69200,
                count: 2800,
                avgValue: 24.71,
                growth: 12.5,
                status: 'Active'
            },
            {
                product: 'FD',
                volume: 1564498,
                count: 31000,
                avgValue: 50.47,
                growth: 8.3,
                status: 'Active'
            },
            {
                product: 'PORTFOLIO',
                volume: 3369000,
                count: 41000,
                avgValue: 82.17,
                growth: 15.2,
                status: 'Active'
            },
            {
                product: 'EQUITIES',
                volume: 2541000,
                count: 28500,
                avgValue: 89.16,
                growth: 10.8,
                status: 'Active'
            },
            {
                product: 'BONDS',
                volume: 1987000,
                count: 18900,
                avgValue: 105.13,
                growth: 5.4,
                status: 'Active'
            }
        ];
    });
});