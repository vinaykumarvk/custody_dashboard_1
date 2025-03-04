// Dashboard controller
app.controller('DashboardController', function($scope, DataService) {
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
    
    // Month labels
    $scope.monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Fetch dashboard data
    DataService.getDashboardData().then(function(data) {
        // Set key metrics
        $scope.keyMetrics = data.metrics.keyMetrics;
        $scope.secondaryMetrics = data.metrics.secondaryMetrics;
        
        // Set recent activity
        $scope.recentActivity = data.recentActivity;
        
        // Pass data to top-level metrics
        $scope.totalCustomers = data.totalCustomers;
        $scope.totalTrades = data.totalTrades;
        $scope.openEvents = data.openEvents;
        $scope.totalIncome = data.totalIncome;
        $scope.newCustomers = data.newCustomers;
        $scope.totalTradeValue = data.totalTradeValue;
        $scope.criticalEvents = data.criticalEvents;
        $scope.newIncome = data.newIncome;
        
        // Set monthly trend data for charts
        let customerTrend = data.monthlyTrend.datasets[0].data;
        let tradeTrend = data.monthlyTrend.datasets[1].data;
        let incomeTrend = data.monthlyTrend.datasets[2].data;
        
        $scope.trendData = [
            customerTrend,
            tradeTrend,
            incomeTrend
        ];
        
        $scope.trendLabels = ['Customers', 'Trades (thousands)', 'Income (millions)'];
        
        // Create custom chart data for the dashboard
        // Customer distribution by product
        $scope.customersByProductLabels = ['MUTUAL FUND', 'FD', 'PORTFOLIO', 'EQUITIES', 'BONDS'];
        $scope.customersByProductData = [4850, 3920, 2780, 2590, 1702];
        
        // Trade volume trend
        $scope.tradeVolumeTrendData = [
            [712.5, 725.8, 739.2, 751.3, 763.5, 775.6, 787.8, 800.0, 810.0, 822.2, 834.3, 846.5]
        ];
        
        // Event resolution rate
        $scope.eventResolutionData = [
            [92.5, 93.1, 93.8, 94.2, 94.6, 95.0, 95.5, 96.0, 96.5, 97.0, 97.5, 98.0] // Resolution rate
        ];
        
        // Income distribution
        $scope.incomeDistributionLabels = ['Transaction Fees', 'Advisory Services', 'Custody Fees', 'Interest Income', 'Other Fees'];
        $scope.incomeDistributionData = [37.06, 20.38, 16.68, 10.19, 8.34];
        
        // Create forecast data
        $scope.forecastLabels = ['Jan', 'Feb', 'Mar'];
        $scope.customerForecastData = [
            [15970, 16100, 16230]
        ];
        $scope.tradeForecastData = [
            [530000, 536000, 542000]
        ];
        $scope.incomeForecastData = [
            [9.5, 9.7, 9.9]
        ];
    });
});