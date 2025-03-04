/**
 * IncomeController
 * 
 * Controller for the Income page of the eMACH Custody Dashboard
 */
angular.module('eMACHApp')
    .controller('IncomeController', ['$scope', 'DataService', '$filter', function($scope, DataService, $filter) {
        console.log('Income controller initialized');
        
        // Initialize data
        $scope.totalIncome = 0;
        $scope.newIncome = 0;
        $scope.incomeGrowth = 0;
        $scope.avgMonthlyIncome = 0;
        $scope.monthlyIncomeChange = 0;
        
        // Get income data
        DataService.getIncome().then(function(data) {
            $scope.totalIncome = data.totalIncome;
            $scope.newIncome = data.newIncome;
            $scope.incomeGrowth = data.incomeGrowth;
            $scope.avgMonthlyIncome = data.avgMonthlyIncome;
            $scope.monthlyIncomeChange = data.monthlyIncomeChange;
            
            // Chart data
            $scope.monthLabels = data.monthlyIncomeData.labels;
            $scope.monthlyIncomeData = [data.monthlyIncomeData.data];
            
            $scope.productLabels = data.incomeByProductData.labels;
            $scope.incomeByProductData = data.incomeByProductData.data;
            
            $scope.quarterLabels = data.quarterlyIncomeData.labels;
            $scope.quarterlyIncomeData = [data.quarterlyIncomeData.data];
            
            // Income correlation with trading volume
            $scope.incomeCorrelationData = [
                data.incomeCorrelationData.income,
                data.incomeCorrelationData.volume
            ];
            
            $scope.categoryLabels = data.categoryDistributionData.labels;
            $scope.categoryDistributionData = data.categoryDistributionData.data;
            
            $scope.topCustomerLabels = data.topCustomerData.labels;
            $scope.topCustomerData = [data.topCustomerData.data];
            
            // Forecast data
            $scope.predictionMonths = data.predictedIncomeData.labels;
            $scope.predictedIncomeData = [
                data.predictedIncomeData.currentYear,
                data.predictedIncomeData.nextYear
            ];
            $scope.predictionYears = ['Current Year', 'Next Year'];
            
            // Growth projection
            $scope.projectionMonths = data.growthProjectionData.labels;
            $scope.growthProjectionData = [
                data.growthProjectionData.baseline,
                data.growthProjectionData.optimistic,
                data.growthProjectionData.conservative
            ];
            
            // Income breakdown table
            $scope.incomeBreakdown = data.incomeBreakdown;
        });
        
        // Chart options
        $scope.lineChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            }
        };
        
        $scope.pieChartOptions = {
            responsive: true,
            maintainAspectRatio: false
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
        
        $scope.mixedChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    id: 'y-axis-0',
                    position: 'left',
                    ticks: {
                        beginAtZero: false
                    }
                }, {
                    id: 'y-axis-1',
                    position: 'right',
                    ticks: {
                        beginAtZero: false
                    }
                }]
            }
        };
        
        $scope.donutOptions = {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 70
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
        
        $scope.areaChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            },
            elements: {
                line: {
                    tension: 0.4,
                    fill: true
                }
            }
        };
        
        // Helper functions
        $scope.formatNumber = function(value) {
            if (value >= 1000000) {
                return '₹' + (value / 1000000).toFixed(2) + 'M';
            } else if (value >= 1000) {
                return '₹' + (value / 1000).toFixed(2) + 'K';
            } else {
                return '₹' + value.toFixed(2);
            }
        };
        
        $scope.formatPercentage = function(value) {
            return value.toFixed(1) + '%';
        };
        
        $scope.getTrendClass = function(value) {
            if (value > 0) {
                return 'text-success';
            } else if (value < 0) {
                return 'text-danger';
            } else {
                return 'text-secondary';
            }
        };
        
        $scope.getTrendIcon = function(value) {
            if (value > 0) {
                return 'fa-arrow-up';
            } else if (value < 0) {
                return 'fa-arrow-down';
            } else {
                return 'fa-minus';
            }
        };
    }]);