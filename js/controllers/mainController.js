// Main controller for the dashboard application
app.controller('MainController', function($scope, $rootScope, $location, DataService) {
    // Initialize navigation
    $scope.activeTab = 'dashboard';
    
    // Handle navigation
    $scope.navigate = function(tab) {
        $scope.activeTab = tab;
        $location.path('/' + tab);
    };
    
    // Initialize chart options for the dashboard
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
    
    // Get dashboard data
    DataService.getDashboardData().then(function(data) {
        // Set key metrics
        $scope.keyMetrics = data.metrics.keyMetrics;
        $scope.secondaryMetrics = data.metrics.secondaryMetrics;
        
        // Set recent activity
        $scope.recentActivity = data.recentActivity;
        
        // Set monthly trend data
        $scope.monthLabels = data.monthlyTrend.labels;
        $scope.monthlyData = data.monthlyTrend.datasets.map(dataset => dataset.data);
        $scope.monthlyDataLabels = data.monthlyTrend.datasets.map(dataset => dataset.label);
        
        // Calculate additional metrics for dashboard display
        $scope.totalCustomers = data.totalCustomers;
        $scope.totalTrades = data.totalTrades;
        $scope.openEvents = data.openEvents;
        $scope.totalIncome = data.totalIncome;
        
        // Calculate growth indicators
        $scope.customerGrowth = data.growth;
        $scope.tradeGrowth = data.tradeGrowth;
        $scope.eventChange = -12.5; // Event reduction is positive
        $scope.incomeGrowth = data.incomeGrowth;
        
        // Calculate secondary metrics
        $scope.newCustomers = data.newCustomers;
        $scope.tradeValue = data.totalTradeValue;
        $scope.criticalEvents = data.criticalEvents;
        $scope.newIncome = data.newIncome;
    });
    
    // Format numbers for display
    $scope.formatNumber = function(number) {
        // Check if the number exists and is a number
        if (number === undefined || number === null || isNaN(number)) {
            return '0';
        }
        
        // Format based on magnitude
        if (number >= 1000000000) {
            return (number / 1000000000).toFixed(2).replace('.', ',') + 'B';
        } else if (number >= 1000000) {
            return (number / 1000000).toFixed(2).replace('.', ',') + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(2).replace('.', ',') + 'K';
        } else {
            return number.toString();
        }
    };
    
    // Format regular numbers with thousand separators - now using the Angular filter
    $scope.formatNumberWithCommas = function(number) {
        if (number === undefined || number === null || isNaN(number)) {
            return '0';
        }
        
        // This function is now replaced with the numberFormat filter in app.js
        // But we keep it for backward compatibility
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // Format percentages for display
    $scope.formatPercentage = function(percentage) {
        if (percentage === undefined || percentage === null || isNaN(percentage)) {
            return '0%';
        }
        
        return percentage.toFixed(1) + '%';
    };
    
    // Format dates for display
    $scope.formatDate = function(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            year: 'numeric',
            month: 'short', 
            day: 'numeric'
        });
    };
    
    // Determine CSS class for trend indicators
    $scope.getTrendClass = function(value, inverted) {
        if (!value || isNaN(value)) return '';
        
        // For metrics where reduction is positive (like events, errors)
        if (inverted) {
            return value < 0 ? 'trend-up' : (value > 0 ? 'trend-down' : 'trend-neutral');
        }
        
        // For normal metrics where increase is positive
        return value > 0 ? 'trend-up' : (value < 0 ? 'trend-down' : 'trend-neutral');
    };
    
    // Get icon for trend indicators
    $scope.getTrendIcon = function(value, inverted) {
        if (!value || isNaN(value)) return 'fa-minus';
        
        // For metrics where reduction is positive
        if (inverted) {
            return value < 0 ? 'fa-arrow-up' : (value > 0 ? 'fa-arrow-down' : 'fa-minus');
        }
        
        // For normal metrics where increase is positive
        return value > 0 ? 'fa-arrow-up' : (value < 0 ? 'fa-arrow-down' : 'fa-minus');
    };
    
    // Determine background color class based on status
    $scope.getStatusClass = function(status) {
        status = status.toLowerCase();
        
        if (status === 'completed' || status === 'resolved' || status === 'active') {
            return 'bg-success';
        } else if (status === 'pending' || status === 'in progress' || status === 'processing') {
            return 'bg-warning';
        } else if (status === 'critical' || status === 'escalated' || status === 'failed') {
            return 'bg-danger';
        } else {
            return 'bg-info';
        }
    };
    
    // Determine priority class for visual indicators
    $scope.getPriorityClass = function(priority) {
        priority = priority.toLowerCase();
        
        if (priority === 'critical') {
            return 'priority-critical';
        } else if (priority === 'high') {
            return 'priority-high';
        } else if (priority === 'medium') {
            return 'priority-medium';
        } else if (priority === 'low') {
            return 'priority-low';
        } else {
            return '';
        }
    };
    
    // Initialize any other required functionality
    $scope.init = function() {
        // Add the standard number formatting function to rootScope so it's available across all controllers
        $rootScope.formatNumber = function(number) {
            if (number === undefined || number === null || isNaN(number)) {
                return '0';
            }
            
            // Convert to string with commas as thousand separators for Smart Bank standard format
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };
        
        // Any additional initialization can go here
        console.log('Main controller initialized');
    };
    
    // Call init function
    $scope.init();
});