// eMACH Custody Dashboard Application

// Initialize the Angular application
var app = angular.module('eMACHCustodyApp', ['ngRoute', 'chart.js']);

// Configure routes
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/dashboard.html',
            controller: 'MainController'
        })
        .when('/dashboard', {
            templateUrl: 'templates/dashboard.html',
            controller: 'MainController'
        })
        .when('/customers', {
            templateUrl: 'templates/customers.html',
            controller: 'CustomersController'
        })
        .when('/total-trades', {
            templateUrl: 'templates/total-trades.html',
            controller: 'TotalTradesController'
        })
        .when('/deal-processing', {
            templateUrl: 'templates/deal-processing.html',
            controller: 'DealProcessingController'
        })
        .when('/corporate-actions', {
            templateUrl: 'templates/corporate-actions.html',
            controller: 'CorporateActionsController'
        })
        .when('/open-events', {
            templateUrl: 'templates/open-events.html',
            controller: 'OpenEventsController'
        })
        .when('/income', {
            templateUrl: 'templates/income.html',
            controller: 'IncomeController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

// Configure Chart.js defaults
app.config(function() {
    Chart.defaults.global.defaultFontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';
    Chart.defaults.global.defaultFontSize = 12;
    Chart.defaults.global.defaultFontColor = '#666';
    Chart.defaults.global.responsive = true;
    Chart.defaults.global.maintainAspectRatio = false;
    
    // Custom color palette with Smart Bank colors (updated from file #7)
    Chart.defaults.global.colors = [
        '#038559', // Primary Smart Bank green
        '#04A46E', // Light green 
        '#026844', // Dark green
        '#1cc88a', // Success green
        '#f6c23e', // Warning yellow
        '#e74a3b', // Danger red
        '#5a5c69', // Secondary gray
        '#fd7e14', // Orange
        '#20c9a6', // Teal
        '#858796'  // Light gray
    ];
});

// Run block for initialization
app.run(function($rootScope) {
    // Set application-wide properties
    $rootScope.appName = 'eMACH Custody Dashboard';
    $rootScope.appVersion = '1.0.0';
    $rootScope.company = 'eMACH.ai';
    $rootScope.year = new Date().getFullYear();
    
    // Today's date for display
    const today = new Date();
    $rootScope.today = today.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Utility to format numbers with thousand separators
    $rootScope.formatNumber = function(num) {
        if (num === null || num === undefined) return '';
        
        // For numbers less than 1000, return as is
        if (Math.abs(num) < 1000) {
            return num.toString();
        }
        
        // Format number with thousand separators
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // Set color theme classes for various metrics
    $rootScope.getMetricClass = function(type) {
        switch(type) {
            case 'CUSTOMER':
                return 'primary';
            case 'TRADE':
                return 'success';
            case 'EVENT':
                return 'danger';
            case 'INCOME':
                return 'info';
            case 'DEAL':
                return 'warning';
            case 'CORPORATE_ACTION':
                return 'secondary';
            default:
                return 'primary';
        }
    };
    
    // Log initialization
    console.log('eMACH Custody Dashboard initialized');
});