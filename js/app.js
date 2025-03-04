// Main AngularJS application module
var app = angular.module('dashboardApp', ['ngRoute', 'chart.js']);

// Configure routes
app.config(function($routeProvider) {
    $routeProvider
        .when('/dashboard', {
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardController'
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
            redirectTo: '/dashboard'
        });
});

// Configure chart defaults
app.config(function(ChartJsProvider) {
    ChartJsProvider.setOptions({
        colors: ['#FF6B35', '#006400', '#FFC30B', '#673AB7', '#0052CC'],
        responsive: true,
        maintainAspectRatio: false
    });
});