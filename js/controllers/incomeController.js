// Income controller
app.controller('IncomeController', function($scope, DataService) {
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
    
    $scope.mixedChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                id: 'y-axis-1',
                type: 'linear',
                position: 'left',
                ticks: {
                    beginAtZero: true
                }
            }, {
                id: 'y-axis-2',
                type: 'linear',
                position: 'right',
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
        elements: {
            line: {
                tension: 0.3,
                borderWidth: 2,
                fill: true
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };
    
    // Common labels
    $scope.monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $scope.quarterLabels = ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'];
    $scope.categoryLabels = ['Corporate', 'Retail', 'Institutional', 'Others'];
    $scope.predictionMonths = ['Dec', 'Jan', 'Feb'];
    $scope.projectionMonths = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    $scope.predictionYears = ['2023', '2024', '2025'];
    
    // Fetch income data
    DataService.getIncomeData().then(function(data) {
        // Set general metrics
        $scope.totalIncome = data.totalIncome;
        $scope.newIncome = data.newIncome;
        $scope.incomeGrowth = data.growth;
        $scope.avgMonthlyIncome = Math.round(data.totalIncome / 12);
        $scope.monthlyIncomeChange = 4.5;
        
        // Monthly income trend
        let monthlyIncome = data.monthlyData.map(item => item.income / 1000000); // Convert to millions for display
        $scope.monthlyIncomeData = [monthlyIncome];
        
        // Income by product
        $scope.productLabels = data.incomeByProduct.map(item => item.product);
        $scope.incomeByProductData = data.incomeByProduct.map(item => item.income);
        
        // Quarterly data
        $scope.quarterlyIncomeData = [
            [1650000, 1850000, 2100000, 2400000]
        ];
        
        // Income vs Trade Volume correlation
        $scope.incomeCorrelationData = [
            monthlyIncome, // Income in millions
            [850, 880, 910, 930, 960, 990, 1020, 1050, 1080, 1110, 1140, 1170] // Trade volume in thousands
        ];
        
        // Customer category distribution
        $scope.categoryDistributionData = [45, 25, 20, 10];
        
        // Top customers
        $scope.topCustomerLabels = ['Reliance Inc.', 'HDFC Bank', 'TCS', 'Infosys', 'SBI'];
        $scope.topCustomerData = [
            [350000, 290000, 240000, 210000, 180000]
        ];
        
        // Prediction data
        $scope.predictedIncomeData = [
            [830, 850, 870], // 2023 (in 10,000s)
            [860, 880, 900], // 2024 (in 10,000s)
            [890, 920, 950]  // 2025 (in 10,000s)
        ];
        
        // Growth projection data
        $scope.growthProjectionData = [
            [830, 850, 870, 890, 910, 930, 950, 970, 990, 1010, 1030, 1050]
        ];
        
        // Income breakdown table
        $scope.incomeBreakdown = [
            {
                source: 'Transaction Fees',
                currentMonth: 3250000,
                lastMonth: 3150000,
                threeMonthAvg: 3180000,
                ytd: 35600000,
                growth: 5.8,
                trend: 'UP'
            },
            {
                source: 'Advisory Services',
                currentMonth: 1850000,
                lastMonth: 1780000,
                threeMonthAvg: 1820000,
                ytd: 20500000,
                growth: 3.2,
                trend: 'UP'
            },
            {
                source: 'Custody Fees',
                currentMonth: 1480000,
                lastMonth: 1510000,
                threeMonthAvg: 1490000,
                ytd: 16800000,
                growth: -2.1,
                trend: 'DOWN'
            },
            {
                source: 'Interest Income',
                currentMonth: 950000,
                lastMonth: 930000,
                threeMonthAvg: 940000,
                ytd: 10950000,
                growth: 2.4,
                trend: 'UP'
            },
            {
                source: 'Other Fees',
                currentMonth: 720000,
                lastMonth: 720000,
                threeMonthAvg: 715000,
                ytd: 8200000,
                growth: 0.0,
                trend: 'STABLE'
            }
        ];
    });
});