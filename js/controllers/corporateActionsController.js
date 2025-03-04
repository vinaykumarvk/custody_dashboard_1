// Corporate Actions controller
app.controller('CorporateActionsController', function($scope, $rootScope, DataService) {
    // Define number formatting functions using the rootScope utility
    $scope.formatNumberWithCommas = function(num) {
        return $rootScope.formatNumber(num);
    };
    
    // Format date helper
    $scope.formatDate = function(date) {
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };
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
    
    $scope.donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: true,
            position: 'bottom'
        },
        cutoutPercentage: 70
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
    
    $scope.groupedBarOptions = {
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
    
    // Set general metrics
    $scope.totalActions = 4821;
    $scope.pendingActions = 187;
    $scope.criticalActions = 32;
    $scope.avgProcessingTime = 24.5;
    $scope.processingTimeChange = -8.6; // Improvement
    $scope.successRate = 97.2;
    $scope.successRateChange = 1.5;
    
    // Common labels
    $scope.monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $scope.actionTypeLabels = ['Dividend', 'Rights Issue', 'Bonus', 'Split', 'Merger'];
    $scope.statusLabels = ['Completed', 'In Progress', 'Pending', 'Failed'];
    $scope.predictionMonths = ['Dec', 'Jan', 'Feb'];
    $scope.predictionYears = ['2023', '2024', '2025'];
    
    // Actions by type data
    $scope.actionsByTypeData = [45, 15, 20, 10, 10];
    
    // Monthly action volume
    $scope.monthlyActionData = [
        [280, 320, 350, 310, 370, 390, 420, 410, 450, 480, 510, 530]
    ];
    
    // Processing timeline by action type
    $scope.processingTimelineData = [
        [32, 30, 29, 28, 28, 27, 26, 25, 24, 23, 24, 24], // Dividend
        [48, 46, 44, 42, 40, 38, 36, 35, 33, 32, 31, 30], // Rights Issue
        [36, 35, 34, 33, 32, 31, 30, 29, 28, 28, 27, 26], // Bonus
        [18, 18, 17, 17, 16, 16, 15, 15, 14, 14, 14, 13], // Split
        [60, 58, 56, 54, 52, 50, 48, 46, 44, 42, 40, 38]  // Merger
    ];
    
    // Action status data
    $scope.actionStatusData = [79.5, 12.3, 7.2, 1.0];
    
    // Prediction data
    $scope.predictedVolumeData = [
        [180, 190, 200], // 2023
        [190, 210, 220], // 2024
        [210, 230, 240]  // 2025
    ];
    
    // Processing load data
    $scope.processingLoadData = [
        [42, 35, 28, 15, 48]
    ];
    
    // Pending actions list
    $scope.pendingActionsList = [
        {
            id: 'CA-1234',
            type: 'Dividend',
            security: 'HDFC Bank Ltd.',
            exDate: new Date(2023, 11, 15),
            recordDate: new Date(2023, 11, 17),
            status: 'Pending',
            priority: 'High'
        },
        {
            id: 'CA-1235',
            type: 'Rights Issue',
            security: 'Reliance Industries Ltd.',
            exDate: new Date(2023, 11, 20),
            recordDate: new Date(2023, 11, 22),
            status: 'Processing',
            priority: 'Critical'
        },
        {
            id: 'CA-1236',
            type: 'Bonus',
            security: 'Infosys Ltd.',
            exDate: new Date(2023, 11, 18),
            recordDate: new Date(2023, 11, 20),
            status: 'Pending',
            priority: 'Medium'
        },
        {
            id: 'CA-1237',
            type: 'Split',
            security: 'TCS Ltd.',
            exDate: new Date(2023, 11, 25),
            recordDate: new Date(2023, 11, 27),
            status: 'Scheduled',
            priority: 'Low'
        },
        {
            id: 'CA-1238',
            type: 'Merger',
            security: 'SBI',
            exDate: new Date(2023, 11, 12),
            recordDate: new Date(2023, 11, 14),
            status: 'Processing',
            priority: 'High'
        }
    ];
});