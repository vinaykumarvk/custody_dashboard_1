// Dashboard controller
app.controller('DashboardController', function($scope) {
    // Default chart options
    $scope.chartOptions = {
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
        },
        elements: {
            line: {
                tension: 0.4,
                borderWidth: 2
            },
            point: {
                radius: 3,
                hitRadius: 10,
                hoverRadius: 5
            }
        }
    };
    
    // Donut chart options
    $scope.donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: true,
            position: 'bottom'
        },
        cutoutPercentage: 70
    };
    
    // Bar chart options for predictions
    $scope.barOptions = {
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
    
    // Common month labels for charts
    $scope.monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Sample data for charts
    
    // Trades Chart Data
    $scope.tradesChartData = [
        [1250, 1380, 1520, 1340, 1900, 2100, 2300, 2150, 2400, 2600, 2800, 3100]
    ];
    
    // Customers Chart Data
    $scope.customersChartData = [
        [950, 1000, 1150, 1200, 1300, 1400, 1550, 1600, 1700, 1750, 1850, 2000]
    ];
    
    // Income Chart Data
    $scope.incomeChartData = [
        [5600, 5900, 6200, 6100, 6800, 7200, 7500, 7300, 7900, 8200, 8500, 9000]
    ];
    
    // Events Chart Data
    $scope.eventsChartData = [
        [10, 8, 12, 11, 9, 15, 14, 13, 16, 15, 18, 16]
    ];
    
    // Product distribution data
    $scope.productLabels = ['MUTUAL FUND', 'FD', 'PORTFOLIO'];
    
    // Customers by product
    $scope.productCustomersData = [2800, 3100, 4100];
    
    // Income by product
    $scope.productIncomeData = [2041976.21, 1765430.99, 1607418.08];
    
    // Trade volume by product
    $scope.productVolumeData = [69200.00, 1564498.00, 3369000.00];
    
    // Prediction data
    $scope.predictionLabels = ['Sep', 'Oct', 'Nov'];
    $scope.predictionYears = ['2023', '2024', '2025'];
    
    // Transaction rate prediction
    $scope.transactionPredictionData = [
        [2.74, 3.71, 2.21],  // 2023
        [3.0, 3.73, 3.89],   // 2024
        [4.3, 4.54, 3.98]    // 2025
    ];
    
    // Client growth prediction
    $scope.clientPredictionData = [
        [21.67, 29.27, 22.14],  // 2023
        [30.03, 26.6, 30.54],   // 2024
        [40.23, 49.61, 45.39]   // 2025
    ];
});