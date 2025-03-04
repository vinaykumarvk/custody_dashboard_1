// Customers controller
app.controller('CustomersController', function($scope, $rootScope, DataService) {
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
    
    // Fetch customer data
    DataService.getCustomersData().then(function(data) {
        // Set general metrics
        $scope.totalCustomers = data.totalCustomers;
        $scope.newCustomers = data.newCustomers;
        $scope.customerGrowth = data.growth;
        $scope.activeUsers = Math.round(data.totalCustomers * 0.75); // Example - 75% active
        $scope.activePercentage = 75;
        $scope.retentionRate = 92;
        $scope.retentionChange = 2.5;
        
        // Prepare chart data
        let monthlyData = data.monthlyData.map(item => item.customers);
        $scope.customersChartData = [monthlyData];
        
        // Product distribution
        $scope.productLabels = data.customersByProduct.map(item => item.product);
        $scope.customersByProductData = data.customersByProduct.map(item => item.customers);
        
        // Sample acquisition channels data
        $scope.channelLabels = ['Direct', 'Referral', 'Partnership', 'Online', 'Branch'];
        $scope.acquisitionChannelsData = [
            [350, 480, 290, 520, 410]
        ];
        
        // Sample engagement data
        $scope.engagementLabels = ['Very Active', 'Active', 'Moderate', 'Low', 'Inactive'];
        $scope.engagementData = [
            [3500, 5200, 4100, 2800, 1900]
        ];
    });
});