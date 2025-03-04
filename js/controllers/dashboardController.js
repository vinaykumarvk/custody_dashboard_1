// Dashboard controller
app.controller('DashboardController', function($scope, $rootScope, DataService) {
    console.log('DashboardController initialized');
    
    // Helper function to format numbers
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Set hard-coded values for testing template expressions - pre-formatted
    $scope.totalCustomers = formatNumber(15842);
    $scope.newCustomers = formatNumber(284);
    $scope.totalIncome = formatNumber(925); // In lakhs
    $scope.newIncome = formatNumber(178); // In lakhs
    $scope.openEvents = formatNumber(421936);
    $scope.totalTrades = formatNumber(526480);
    $scope.totalTradeValue = formatNumber(948320); // In thousands
    $scope.criticalEvents = formatNumber(389);
    
    // Month labels
    $scope.monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize empty chart data
    $scope.trendData = [[100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210]];
    $scope.trendLabels = ['Customers'];
    
    // Customer distribution by product
    $scope.customersByProductLabels = ['MUTUAL FUND', 'FD', 'PORTFOLIO', 'EQUITIES', 'BONDS'];
    $scope.customersByProductData = [4850, 3920, 2780, 2590, 1702];
    
    // Trade volume trend
    $scope.tradeVolumeTrendData = [
        [712.5, 725.8, 739.2, 751.3, 763.5, 775.6, 787.8, 800.0, 810.0, 822.2, 834.3, 846.5]
    ];
    
    // Event resolution rate
    $scope.eventResolutionData = [
        [92.5, 93.1, 93.8, 94.2, 94.6, 95.0, 95.5, 96.0, 96.5, 97.0, 97.5, 98.0]
    ];
    
    // Income distribution
    $scope.incomeDistributionLabels = ['Transaction Fees', 'Advisory Services', 'Custody Fees', 'Interest Income', 'Other Fees'];
    $scope.incomeDistributionData = [37.06, 20.38, 16.68, 10.19, 8.34];
    
    // Create forecast data
    $scope.forecastLabels = ['Jan', 'Feb', 'Mar'];
    $scope.customerForecastData = [[15970, 16100, 16230]];
    $scope.tradeForecastData = [[530000, 536000, 542000]];
    $scope.incomeForecastData = [[9.5, 9.7, 9.9]];
    
    // Chart options for rendering
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
    
    // Set recent activity
    $scope.recentActivity = [
        { type: 'CUSTOMER', action: 'Added new corporate customer', entity: 'ABC Corp', time: '2 hours ago' },
        { type: 'TRADE', action: 'Processed large trade', entity: 'XYZ Securities', time: '4 hours ago' },
        { type: 'EVENT', action: 'Escalated pending settlement', entity: 'Corporate Bond Settlement', time: '5 hours ago' },
        { type: 'INCOME', action: 'Income processed', entity: 'Quarterly dividend payment', time: '1 day ago' }
    ];
});