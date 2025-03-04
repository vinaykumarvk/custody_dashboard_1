// Deal Processing controller
app.controller('DealProcessingController', function($scope) {
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
    
    $scope.horizontalBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };
    
    $scope.stackedBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true,
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };
    
    // Set general metrics
    $scope.totalDeals = 256489;
    $scope.avgProcessingTime = 8.5;
    $scope.processingTimeChange = -12.3; // Improvement
    $scope.successRate = 98.7;
    $scope.successRateChange = 1.2;
    $scope.pendingDeals = 176;
    $scope.oldestPendingDeal = 48;
    
    // Common labels
    $scope.monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $scope.statusLabels = ['Completed', 'Processing', 'Pending', 'Failed'];
    $scope.dealTypes = ['Equity', 'Bond', 'Mutual Fund', 'FD', 'Portfolio'];
    $scope.futurePeriodLabels = ['Dec', 'Jan', 'Feb'];
    
    // Deal status data
    $scope.dealStatusData = [76.5, 12.8, 8.9, 1.8];
    
    // Processing time trend
    $scope.processingTimeData = [
        [12.8, 12.3, 11.5, 10.9, 10.2, 9.8, 9.5, 9.2, 8.9, 8.7, 8.6, 8.5]
    ];
    
    // Deal volume by type
    $scope.dealVolumeData = [
        [320, 350, 380, 360, 390, 410, 450, 470, 490, 510, 540, 570], // Equity
        [280, 290, 300, 320, 330, 340, 350, 360, 380, 390, 410, 420], // Bond
        [420, 440, 460, 480, 500, 520, 540, 550, 570, 590, 610, 630], // Mutual Fund
        [180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290], // FD
        [250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360]  // Portfolio
    ];
    
    // Error rate by deal type
    $scope.errorRateData = [
        [0.8, 1.6, 1.2, 0.5, 1.3]
    ];
    
    // Future deal volume prediction
    $scope.futureVolumeData = [
        [2300, 2450, 2600]
    ];
    
    // Future processing time prediction
    $scope.futureProcessingData = [
        [8.2, 7.9, 7.6]
    ];
    
    // Recent deal issues
    $scope.recentIssues = [
        {
            id: 'D-78954',
            type: 'Equity',
            customer: 'Akash Mehta',
            issue: 'Settlement delay',
            status: 'Pending',
            age: 36
        },
        {
            id: 'D-78967',
            type: 'Mutual Fund',
            customer: 'Priya Sharma',
            issue: 'Incorrect fund details',
            status: 'Processing',
            age: 24
        },
        {
            id: 'D-79012',
            type: 'Bond',
            customer: 'Vikram Singh',
            issue: 'Pricing mismatch',
            status: 'Critical',
            age: 48
        },
        {
            id: 'D-79056',
            type: 'FD',
            customer: 'Neha Patel',
            issue: 'Interest rate discrepancy',
            status: 'Processing',
            age: 12
        },
        {
            id: 'D-79089',
            type: 'Portfolio',
            customer: 'Raj Kumar',
            issue: 'Allocation error',
            status: 'Pending',
            age: 18
        }
    ];
});