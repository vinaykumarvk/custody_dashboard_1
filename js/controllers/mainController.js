// Main controller for the dashboard application
app.controller('MainController', function($scope, $location) {
    // Track current path for highlighting active navigation
    $scope.currentPath = $location.path();
    
    // Update current path when location changes
    $scope.$on('$locationChangeSuccess', function() {
        $scope.currentPath = $location.path();
    });
    
    // Header metrics data (these would normally come from a service)
    $scope.headerMetrics = {
        customers: {
            total: 139860,
            new: 20800,
            period: 'Last 1 month'
        },
        income: {
            total: '₹80.51.872',
            new: '₹25.61.736',
            period: 'Last 3 months'
        },
        openEvents: {
            total: 16,
            entitlements: 5059041,
            period: 'All months'
        },
        totalTrades: {
            total: 1021258,
            volume: 11853498,
            period: 'All months'
        },
        caProcessing: {
            title: 'CA Processing',
            subtitle: 'Predictions'
        },
        dealProcessing: {
            title: 'Deal processing',
            subtitle: 'Predictions'
        }
    };
    
    // Payment aging data
    $scope.paymentAging = [
        {
            range: '0-30 Days',
            amount: '₹2,679',
            class: 'payment-green'
        },
        {
            range: '31-60 Days',
            amount: '₹0',
            class: 'payment-yellow'
        },
        {
            range: '61-90 Days',
            amount: '₹3,669,666',
            class: 'payment-orange'
        },
        {
            range: '91+ Days',
            amount: '₹36,805',
            class: 'payment-red'
        }
    ];
    
    // Tickets aging data
    $scope.ticketsAging = [
        {
            range: '0-15 days',
            count: 0,
            class: 'ticket-green'
        },
        {
            range: '16-30 days',
            count: 2,
            class: 'ticket-yellow'
        },
        {
            range: '31-45 days',
            count: 7,
            class: 'ticket-orange'
        },
        {
            range: '45+ days',
            count: 29,
            class: 'ticket-red'
        }
    ];
});