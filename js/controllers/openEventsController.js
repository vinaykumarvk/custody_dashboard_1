// Open Events controller
app.controller('OpenEventsController', function($scope) {
    // Initialize chart options
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
    $scope.openEvents = 16;
    $scope.criticalEvents = 4;
    $scope.openEntitlements = 5059041;
    $scope.entitlementsValue = 72548900;
    $scope.avgEventAge = 18;
    $scope.maxEventAge = 45;
    $scope.resolutionRate = 87.5;
    $scope.resolutionRateChange = 2.8;
    
    // Common labels
    $scope.monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $scope.categoryLabels = ['Settlement', 'Corporate Action', 'Payment', 'Reconciliation', 'Data'];
    $scope.agingLabels = ['0-5 days', '6-15 days', '16-30 days', '31+ days'];
    $scope.priorityLabels = ['Critical', 'High', 'Medium', 'Low'];
    $scope.predictionMonths = ['Dec', 'Jan', 'Feb'];
    $scope.predictionYears = ['2023', '2024', '2025'];
    
    // Events by category data
    $scope.eventsByCategoryData = [30, 25, 20, 15, 10];
    
    // Event aging data
    $scope.eventAgingData = [
        [3, 6, 4, 3]
    ];
    
    // Monthly events trend
    $scope.monthlyEventsData = [
        [12, 14, 16, 15, 18, 20, 22, 21, 23, 25, 24, 22], // New Events
        [11, 13, 15, 16, 17, 19, 20, 22, 21, 23, 22, 21]  // Resolved Events
    ];
    
    // Event priority distribution
    $scope.eventPriorityData = [
        [4, 6, 5, 1]
    ];
    
    // Prediction data
    $scope.predictedEventsData = [
        [24, 22, 20], // 2023
        [25, 23, 21], // 2024
        [26, 24, 22]  // 2025
    ];
    
    // Expected entitlements prediction
    $scope.expectedEntitlementsData = [
        [34.26, 24.59, 14.79], // 2023
        [20.07, 27.27, 13.91], // 2024
        [36.87, 36.36, 35.34]  // 2025
    ];
    
    // Open events list
    $scope.openEventsList = [
        {
            id: 'EV-9821',
            category: 'Settlement',
            customer: 'HDFC Bank Ltd.',
            createdDate: new Date(2023, 11, 10),
            age: 5,
            status: 'In Progress',
            priority: 'Critical'
        },
        {
            id: 'EV-9845',
            category: 'Corporate Action',
            customer: 'Reliance Industries Ltd.',
            createdDate: new Date(2023, 11, 8),
            age: 7,
            status: 'Pending',
            priority: 'High'
        },
        {
            id: 'EV-9862',
            category: 'Payment',
            customer: 'Infosys Ltd.',
            createdDate: new Date(2023, 11, 2),
            age: 13,
            status: 'Escalated',
            priority: 'Critical'
        },
        {
            id: 'EV-9879',
            category: 'Reconciliation',
            customer: 'TCS Ltd.',
            createdDate: new Date(2023, 10, 20),
            age: 25,
            status: 'In Progress',
            priority: 'Medium'
        },
        {
            id: 'EV-9895',
            category: 'Data',
            customer: 'SBI',
            createdDate: new Date(2023, 10, 5),
            age: 40,
            status: 'Pending',
            priority: 'Low'
        }
    ];
});