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
    
    // Custom color palette
    Chart.defaults.global.colors = [
        '#4e73df', // Primary blue
        '#1cc88a', // Success green
        '#36b9cc', // Info teal
        '#f6c23e', // Warning yellow
        '#e74a3b', // Danger red
        '#5a5c69', // Secondary gray
        '#6f42c1', // Purple
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