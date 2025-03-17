import React, { useState, useEffect } from 'react';
import { formatNumber, formatCurrency, formatPercentage, formatDate } from '../utils';
import { fetchData } from '../services/api';
import MetricCard from './MetricCard';
import Chart from './Chart';
import DateRangeFilter from './DateRangeFilter';
import LoadingSpinner from './LoadingSpinner';

const BusinessHeadDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for data filtering
  const [filterParams, setFilterParams] = useState({
    startDate: null,
    endDate: new Date(),
    range: '30d'
  });
  
  // States for filtered data
  const [filteredVolumeData, setFilteredVolumeData] = useState([]);
  const [filteredTradeCountData, setFilteredTradeCountData] = useState([]);
  const [filteredAucHistoryData, setFilteredAucHistoryData] = useState([]);
  const [filteredIncomeHistory, setFilteredIncomeHistory] = useState([]);
  
  // Individual filter states
  const [aucHistoryFilterParams, setAucHistoryFilterParams] = useState({
    startDate: null,
    endDate: new Date(),
    range: '30d'
  });
  
  const [incomeHistoryFilterParams, setIncomeHistoryFilterParams] = useState({
    startDate: null,
    endDate: new Date(),
    range: '30d'
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Use our API service to fetch real data
        const dashboardData = await fetchData('dashboard');
        console.log('Dashboard data loaded:', dashboardData);
        
        // Process the data from our API format to the component format
        const processedData = processApiData(dashboardData);
        console.log('Processed dashboard data:', processedData);
        setData(processedData);

        // Initialize filtered income history when data is loaded
        if (processedData && processedData.incomeHistory && processedData.incomeHistory.length > 0) {
          setFilteredIncomeHistory(processedData.incomeHistory);
        }
        
        setLoading(false);
        
        // Set initial filtered data
        applyDateFilter(processedData.tradingVolumeHistory, processedData.tradeCountHistory, filterParams);
        
        // Initialize AUC history data filter
        applyAucHistoryFilter(processedData.assetsUnderCustody?.history || [], aucHistoryFilterParams);
        
        // Initialize income history filter
        handleIncomeHistoryFilterChange(incomeHistoryFilterParams);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);
  
  const handleDateFilterChange = (newFilterParams) => {
    setFilterParams(newFilterParams);
    if (data) {
      applyDateFilter(data.tradingVolumeHistory, data.tradeCountHistory, newFilterParams);
    }
  };
  
  const applyDateFilter = (volumeData, tradeCountData, filterParams) => {
    const { startDate, endDate, range } = filterParams || {};
    
    // If 'all' is selected or range is undefined, use all data
    if (!range || (range && range.toLowerCase() === 'all')) {
      setFilteredVolumeData(volumeData);
      setFilteredTradeCountData(tradeCountData);
      return;
    }
    
    let filteredVolume = [];
    let filteredCount = [];
    const rangeLower = range.toLowerCase();
    
    if (rangeLower === '7d') {
      // For 7d, get the most recent 7 days
      filteredVolume = volumeData.slice(-7);
      filteredCount = tradeCountData.slice(-7);
    } 
    else if (rangeLower === '30d') {
      // For 30d, get the most recent 30 days
      filteredVolume = volumeData.slice(-30);
      filteredCount = tradeCountData.slice(-30);
    }
    else if (rangeLower === '90d') {
      // For 90d filter, get the most recent 90 days
      filteredVolume = volumeData.slice(-90);
      filteredCount = tradeCountData.slice(-90);
    }
    else if (rangeLower === 'ytd') {
      // For YTD, filter to the current year
      const currentYear = new Date().getFullYear();
      
      filteredVolume = volumeData.filter(item => {
        const date = new Date(item.date);
        return date.getFullYear() === currentYear;
      });
      
      filteredCount = tradeCountData.filter(item => {
        const date = new Date(item.date);
        return date.getFullYear() === currentYear;
      });
    }
    else {
      // Apply date-based filters as fallback
      filteredVolume = volumeData.filter(item => {
        const itemDate = new Date(item.date);
        return (!startDate || itemDate >= startDate) && 
               (!endDate || itemDate <= endDate);
      });
      
      filteredCount = tradeCountData.filter(item => {
        const itemDate = new Date(item.date);
        return (!startDate || itemDate >= startDate) && 
               (!endDate || itemDate <= endDate);
      });
    }
    
    // If we get no data after filtering, use the original data (failsafe)
    setFilteredVolumeData(filteredVolume.length > 0 ? filteredVolume : volumeData);
    setFilteredTradeCountData(filteredCount.length > 0 ? filteredCount : tradeCountData);
  };
  
  // Handle AUC History filter changes
  const handleAucHistoryFilterChange = (newFilterParams) => {
    setAucHistoryFilterParams(newFilterParams);
    if (data && data.assetsUnderCustody && data.assetsUnderCustody.history) {
      applyAucHistoryFilter(data.assetsUnderCustody.history, newFilterParams);
    }
  };
  
  // Apply filters to AUC history data
  const applyAucHistoryFilter = (aucHistory, filterParams) => {
    const { startDate, endDate, range } = filterParams || {};
    
    // If 'all' is selected or no history data, use all data
    if (!range || (range && range.toLowerCase() === 'all') || !aucHistory || aucHistory.length === 0) {
      setFilteredAucHistoryData(aucHistory || []);
      return;
    }
    
    let filteredData = [];
    const rangeLower = range.toLowerCase();
    
    if (rangeLower === '7d') {
      // For 7d, get the most recent 7 days
      filteredData = aucHistory.slice(-7);
    } 
    else if (rangeLower === '30d') {
      // For 30d, get the most recent 30 days
      filteredData = aucHistory.slice(-30);
    }
    else if (rangeLower === '90d') {
      // For 90d, get the most recent 90 days
      filteredData = aucHistory.slice(-90);
    }
    else if (rangeLower === 'ytd') {
      // For YTD, filter to the current year
      const currentYear = new Date().getFullYear();
      filteredData = aucHistory.filter(item => {
        // Support both new and old format
        if (item.date) {
          const date = new Date(item.date);
          return date.getFullYear() === currentYear;
        } else if (item.month) {
          const [year] = item.month.split('-').map(num => parseInt(num, 10));
          return year === currentYear;
        }
        return false;
      });
    }
    else {
      // For any other filter, try to use the date range
      filteredData = aucHistory.filter(item => {
        let itemDate;
        
        // Support both new and old format
        if (item.date) {
          itemDate = new Date(item.date);
        } else if (item.month) {
          const [year, month] = item.month.split('-').map(num => parseInt(num, 10));
          itemDate = new Date(year, month - 1, 1);
        } else {
          return false;
        }
        
        return (!startDate || itemDate >= startDate) && 
               (!endDate || itemDate <= endDate);
      });
    }
    
    // If no data after filtering, use all data as fallback
    if (filteredData.length === 0) {
      setFilteredAucHistoryData(aucHistory);
    } else {
      setFilteredAucHistoryData(filteredData);
    }
  };
  
  // Handle Income History filter change
  const handleIncomeHistoryFilterChange = (newFilterParams) => {
    setIncomeHistoryFilterParams(newFilterParams);
    if (data && data.incomeHistory) {
      const { startDate, endDate, range } = newFilterParams || {};
      // Filter income history data based on date range
      let filtered = [];
      
      // Default to all data if range is not provided
      if (!range) {
        filtered = data.incomeHistory;
      }
      else if (range.toLowerCase() === 'all') {
        filtered = data.incomeHistory;
      } else if (range.toLowerCase() === '7d') {
        filtered = data.incomeHistory.slice(-7);
      } else if (range.toLowerCase() === '30d') {
        filtered = data.incomeHistory.slice(-30);
      } else if (range.toLowerCase() === '90d') {
        filtered = data.incomeHistory.slice(-90);
      } else if (range.toLowerCase() === 'ytd') {
        const currentYear = new Date().getFullYear();
        filtered = data.incomeHistory.filter(item => {
          const date = new Date(item.date);
          return date.getFullYear() === currentYear;
        });
      } else {
        // Custom date range
        filtered = data.incomeHistory.filter(item => {
          const itemDate = new Date(item.date);
          return (!startDate || itemDate >= startDate) && 
                 (!endDate || itemDate <= endDate);
        });
      }
      
      setFilteredIncomeHistory(filtered.length > 0 ? filtered : data.incomeHistory);
    }
  };
  
  /**
   * Process API data into the format expected by the dashboard components
   */
  const processApiData = (apiData) => {
    if (!apiData) return null;
    
    // Extract customer data
    const totalCustomers = apiData.totalCustomers || 0;
    const activeCustomers = apiData.activeCustomers || 0;
    const newCustomersMtd = apiData.newCustomersMtd || 0;
    const customerLoyaltyScore = apiData.customerLoyaltyScore || 0;
    const customerChurnRate = apiData.customerChurnRate || 0;

    // Extract revenue and financial data
    const totalRevenue = apiData.totalRevenue || 0;
    const revenueGrowth = apiData.revenueGrowth || 0;
    const revenueGrowthMonthly = apiData.revenueGrowthMonthly || 0;
    const recurringRevenue = apiData.recurringRevenue || 0;
    const servicePenetration = apiData.servicePenetration || 0;
    
    // Extract Assets Under Custody (AUC) data
    let assetsUnderCustody = apiData.assetsUnderCustody;
    
    // Extract trading metrics
    const totalTrades = apiData.totalTrades || 0;
    const tradingVolume = apiData.tradingVolume || 0;
    const tradingVolumeGrowth = apiData.tradingVolumeGrowth || 0;
    const averageTradeSize = apiData.averageTradeSize || 0;
    
    // Extract time-series data
    const tradingVolumeHistory = apiData.tradingVolumeHistory || [];
    const tradeCountHistory = apiData.tradeCountHistory || [];
    const incomeHistory = apiData.incomeHistory || [];
    
    return {
      // Customer metrics
      totalCustomers,
      activeCustomers,
      newCustomersMtd,
      customerLoyaltyScore,
      customerChurnRate,
      
      // Revenue metrics
      totalRevenue,
      revenueGrowth,
      revenueGrowthMonthly,
      recurringRevenue,
      servicePenetration,
      
      // AUC data
      assetsUnderCustody,
      
      // Trading metrics
      totalTrades,
      tradingVolume,
      tradingVolumeGrowth,
      averageTradeSize,
      
      // Time-series data
      tradingVolumeHistory,
      tradeCountHistory,
      incomeHistory,
      
      // Include other data as needed from the API
      ...apiData
    };
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="alert alert-warning m-4" role="alert">
        No dashboard data available
      </div>
    );
  }

  // Extract data for easier access
  const {
    totalCustomers,
    activeCustomers,
    newCustomersMtd,
    customerLoyaltyScore,
    customerChurnRate,
    totalRevenue,
    revenueGrowth,
    revenueGrowthMonthly,
    recurringRevenue,
    servicePenetration,
    assetsUnderCustody,
    totalTrades,
    tradingVolume,
    tradingVolumeGrowth,
    averageTradeSize
  } = data;

  // Chart configurations
  const tradingVolumeChartData = {
    labels: filteredVolumeData.map(item => formatDate(item.date, 'short')),
    datasets: [
      {
        label: 'Trading Volume',
        data: filteredVolumeData.map(item => item.value),
        fill: true,
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        borderColor: 'rgba(53, 162, 235, 1)',
        tension: 0.4
      }
    ]
  };

  const tradeCountChartData = {
    labels: filteredTradeCountData.map(item => formatDate(item.date, 'short')),
    datasets: [
      {
        label: 'Daily Trades',
        data: filteredTradeCountData.map(item => item.count),
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4
      }
    ]
  };
  
  const aucHistoryChartData = {
    labels: filteredAucHistoryData.map(item => formatDate(item.date || item.month, 'short')),
    datasets: [
      {
        label: 'Assets Under Custody',
        data: filteredAucHistoryData.map(item => item.value),
        fill: true,
        tension: 0.4,
        backgroundColor: 'rgba(0, 124, 117, 0.2)',
        borderColor: 'rgba(0, 124, 117, 1)'
      }
    ]
  };
  
  const aucByAssetClassData = {
    labels: assetsUnderCustody?.byAssetClass?.map(item => item.label) || [],
    datasets: [
      {
        data: assetsUnderCustody?.byAssetClass?.map(item => item.value) || [],
        backgroundColor: [
          'rgba(0, 124, 117, 0.7)',
          'rgba(53, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1
      }
    ]
  };
  
  const incomeByServiceData = {
    labels: data.incomeByService?.map(item => item.service) || [],
    datasets: [
      {
        data: data.incomeByService?.map(item => item.value) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(0, 124, 117, 0.7)',
        ],
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1
      }
    ]
  };
  
  const incomeHistoryChartData = {
    labels: filteredIncomeHistory.map(item => formatDate(item.date, 'short')),
    datasets: [
      {
        label: 'Fee Income',
        data: filteredIncomeHistory.map(item => item.value),
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="dashboard">
      <div className="page-header mb-4">
        <h1>Business Head Dashboard</h1>
        <p className="subtitle">Overview of customer metrics, growth, and revenue analysis</p>
      </div>
      
      {/* CUSTOMER METRICS SECTION */}
      <div className="section-header">
        <h2>Customer Metrics</h2>
      </div>
      
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-4 col-sm-6">
          <MetricCard 
            title="Total Customers" 
            value={formatNumber(totalCustomers, false)} 
            icon="users"
          />
        </div>
        <div className="col-md-4 col-sm-6">
          <MetricCard 
            title="Active Customers" 
            value={formatNumber(activeCustomers, false)} 
            subtitle={`${Math.round((activeCustomers / totalCustomers) * 100)}% of total`}
            icon="user-check"
          />
        </div>
        <div className="col-md-4 col-sm-6">
          <MetricCard 
            title="New Customers (MTD)" 
            value={formatNumber(newCustomersMtd, false)} 
            subtitle="Month to date"
            icon="user-plus"
            color="#17A2B8"
          />
        </div>
      </div>
      
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-6 col-sm-6">
          <MetricCard 
            title="Customer Loyalty Score" 
            value={formatNumber(customerLoyaltyScore, 1)}
            subtitle="Out of 10"
            icon="star"
            color="#FFC107"
          />
        </div>
        <div className="col-md-6 col-sm-6">
          <MetricCard 
            title="Customer Churn Rate" 
            value={formatPercentage(customerChurnRate, 1)}
            subtitle="Annual rate"
            icon="user-slash"
            color={customerChurnRate > 0.1 ? "#DC3545" : "#28A745"}
          />
        </div>
      </div>

      {/* REVENUE PERFORMANCE SECTION */}
      <div className="section-header">
        <h2>Revenue Performance</h2>
      </div>
      
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-4 col-sm-6">
          <MetricCard 
            title="Total Revenue (MTD)" 
            value={formatCurrency(totalRevenue, 'USD', 0)} 
            icon="dollar-sign"
            valueClassName="smaller-value"
          />
        </div>
        <div className="col-md-4 col-sm-6">
          <MetricCard 
            title="Revenue Growth" 
            value={formatPercentage(revenueGrowth, 1)}
            subtitle="Year over year"
            icon="chart-line"
            color={revenueGrowth >= 0 ? "#28A745" : "#DC3545"}
          />
        </div>
        <div className="col-md-4 col-sm-6">
          <MetricCard 
            title="Monthly Growth" 
            value={formatPercentage(revenueGrowthMonthly, 1)}
            subtitle="Month over month"
            icon="chart-bar"
            color={revenueGrowthMonthly >= 0 ? "#28A745" : "#DC3545"}
          />
        </div>
      </div>
      
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-6 col-sm-6">
          <MetricCard 
            title="Recurring Revenue" 
            value={formatCurrency(recurringRevenue, 'USD', 0)}
            subtitle={`${Math.round((recurringRevenue / totalRevenue) * 100)}% of total`}
            icon="sync"
            valueClassName="smaller-value"
          />
        </div>
        <div className="col-md-6 col-sm-6">
          <MetricCard 
            title="Service Penetration" 
            value={formatPercentage(servicePenetration, 1)}
            subtitle="Services per customer"
            icon="project-diagram"
          />
        </div>
      </div>
      
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-7">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>Income History</h2>
              <DateRangeFilter 
                onChange={handleIncomeHistoryFilterChange}
              />
            </div>
            <div className="card-body">
              <Chart 
                type="line" 
                data={incomeHistoryChartData} 
                options={{
                  scales: {
                    y: {
                      beginAtZero: false,
                      ticks: {
                        callback: (value) => formatCurrency(value, 'USD', 0, true)
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return formatCurrency(context.parsed.y, 'USD', 0);
                        }
                      }
                    }
                  }
                }}
                height={300}
              />
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card">
            <div className="card-header">
              <h2>Income by Service</h2>
            </div>
            <div className="card-body">
              <Chart 
                type="doughnut" 
                data={incomeByServiceData}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom'
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = formatCurrency(context.parsed, 'USD', 0);
                          const percentage = formatPercentage(
                            context.parsed / 
                            context.dataset.data.reduce((a, b) => a + b, 0), 
                            1
                          );
                          return `${label}: ${value} (${percentage})`;
                        }
                      }
                    }
                  }
                }}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* ASSETS UNDER CUSTODY SECTION */}
      <div className="section-header">
        <h2>Assets Under Custody</h2>
      </div>
      
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-6 col-sm-6">
          <MetricCard 
            title="Total AUC" 
            value={formatCurrency(assetsUnderCustody?.total || 0, 'USD', 0, true)} 
            subtitle={`${formatPercentage(assetsUnderCustody?.growthRate || 0, 1)} YoY growth`}
            icon="landmark"
            valueClassName="smaller-value"
          />
        </div>
        <div className="col-md-6 col-sm-6">
          <MetricCard 
            title="AUC per Customer" 
            value={formatCurrency(totalCustomers ? (assetsUnderCustody?.total || 0) / totalCustomers : 0, 'USD', 0, true)} 
            icon="user-tag"
            valueClassName="smaller-value"
          />
        </div>
      </div>
      
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-7">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>AUC History</h2>
              <DateRangeFilter 
                onChange={handleAucHistoryFilterChange}
              />
            </div>
            <div className="card-body">
              <Chart 
                type="line" 
                data={aucHistoryChartData} 
                options={{
                  scales: {
                    y: {
                      beginAtZero: false,
                      ticks: {
                        callback: (value) => formatCurrency(value, 'USD', 0, true)
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return formatCurrency(context.parsed.y, 'USD', 0);
                        }
                      }
                    }
                  }
                }}
                height={300}
              />
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card">
            <div className="card-header">
              <h2>AUC by Asset Class</h2>
            </div>
            <div className="card-body">
              <Chart 
                type="doughnut" 
                data={aucByAssetClassData}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom'
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = formatCurrency(context.parsed, 'USD', 0);
                          const percentage = formatPercentage(
                            context.parsed / 
                            context.dataset.data.reduce((a, b) => a + b, 0), 
                            1
                          );
                          return `${label}: ${value} (${percentage})`;
                        }
                      }
                    }
                  }
                }}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* TRADING ACTIVITY SECTION */}
      <div className="section-header">
        <h2>Trading Activity</h2>
      </div>
      
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Total Trades" 
            value={formatNumber(totalTrades, false)} 
            icon="exchange-alt"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Trading Volume" 
            value={formatCurrency(tradingVolume, 'USD', 0)} 
            icon="dollar-sign"
            valueClassName="smaller-value"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Volume Growth" 
            value={formatPercentage(tradingVolumeGrowth, 1)}
            subtitle="Year over year"
            icon="chart-line"
            color={tradingVolumeGrowth >= 0 ? "#28A745" : "#DC3545"}
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Avg. Trade Size" 
            value={formatCurrency(averageTradeSize, 'USD', 0)}
            icon="balance-scale"
            valueClassName="smaller-value"
          />
        </div>
      </div>
      
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>Trading Volume History</h2>
              <DateRangeFilter 
                onChange={handleDateFilterChange}
              />
            </div>
            <div className="card-body">
              <Chart 
                type="line" 
                data={tradingVolumeChartData} 
                options={{
                  scales: {
                    y: {
                      beginAtZero: false,
                      ticks: {
                        callback: (value) => formatCurrency(value, 'USD', 0, true)
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return formatCurrency(context.parsed.y, 'USD', 0);
                        }
                      }
                    }
                  }
                }}
                height={300}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>Trade Count History</h2>
              <DateRangeFilter 
                onChange={handleDateFilterChange}
              />
            </div>
            <div className="card-body">
              <Chart 
                type="bar" 
                data={tradeCountChartData} 
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default BusinessHeadDashboard;