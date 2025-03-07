import React, { useState, useEffect } from 'react';
import { formatNumber, formatCurrency } from '../utils';
import { fetchData } from '../services/api';
import MetricCard from './MetricCard';
import Chart from './Chart';
import DataTable from './DataTable';
import DateRangeFilter from './DateRangeFilter';
import TradeDetailModal from './TradeDetailModal';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [filterParams, setFilterParams] = useState({
    startDate: null,
    endDate: new Date(),
    range: '30d'
  });
  const [filteredVolumeData, setFilteredVolumeData] = useState([]);
  const [filteredTradeCountData, setFilteredTradeCountData] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Use our API service to fetch real data
        const dashboardData = await fetchData('dashboard');
        console.log('Dashboard data loaded:', dashboardData);
        
        // Process the data from our API format to the component format
        const processedData = processApiData(dashboardData);
        setData(processedData);
        setLoading(false);
        
        // Set initial filtered data
        applyDateFilter(processedData.tradingVolumeHistory, processedData.tradeCountHistory, filterParams);
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
    const { startDate, endDate } = filterParams;
    
    // If 'all' is selected, use all data
    if (filterParams.range === 'all') {
      setFilteredVolumeData(volumeData);
      setFilteredTradeCountData(tradeCountData);
      return;
    }
    
    // Apply date filters
    const filteredVolume = volumeData.filter(item => {
      const itemDate = new Date(item.date);
      return (!startDate || itemDate >= startDate) && 
             (!endDate || itemDate <= endDate);
    });
    
    const filteredCount = tradeCountData.filter(item => {
      const itemDate = new Date(item.date);
      return (!startDate || itemDate >= startDate) && 
             (!endDate || itemDate <= endDate);
    });
    
    setFilteredVolumeData(filteredVolume);
    setFilteredTradeCountData(filteredCount);
  };
  
  const handleRowClick = (trade) => {
    setSelectedTrade(trade);
  };
  
  const closeTradeModal = () => {
    setSelectedTrade(null);
  };
  
  /**
   * Process API data into the format expected by the dashboard component
   */
  const processApiData = (apiData) => {
    // Extract metrics directly from API response
    const totalCustomers = apiData.total_customers || 0;
    const activeCustomers = apiData.active_customers || 0;
    const monthlyGrowth = parseFloat(apiData.monthly_growth) || 0;
    const totalIncome = parseFloat(apiData.total_income) || 0;
    
    // Extract and transform customer data
    const customerSegments = [
      { label: 'MUTUAL FUND', value: 2800 },
      { label: 'FD', value: 3100 },
      { label: 'PORTFOLIO', value: 4100 }
    ];
    
    // Use real trade data if available, otherwise generate mock data
    let tradeMonthlyData = [];
    if (apiData.trade_monthly && apiData.trade_monthly.length > 0) {
      tradeMonthlyData = apiData.trade_monthly;
    } else {
      // Mock trade data as fallback
      tradeMonthlyData = apiData.customers_monthly?.map((item, index) => {
        const date = new Date(item.date);
        return {
          date: date.toISOString().split('T')[0],
          total_trades: 1000 + (index * 100),
          trade_volume: 500000 + (index * 50000)
        };
      }) || [];
    }
    
    // Extract trade data for charts
    const tradingVolumeHistory = tradeMonthlyData.map(item => ({
      date: new Date(item.date),
      value: parseFloat(item.trade_volume)
    }));
    
    const tradeCountHistory = tradeMonthlyData.map(item => ({
      date: new Date(item.date),
      value: parseInt(item.total_trades)
    }));
    
    // Use real asset class breakdown if available
    let tradesByAssetClass = [];
    if (apiData.trades_by_asset && apiData.trades_by_asset.length > 0) {
      tradesByAssetClass = apiData.trades_by_asset;
    } else {
      // Fallback mock data
      tradesByAssetClass = [
        { label: 'Equity', value: 45 },
        { label: 'Fixed Income', value: 30 },
        { label: 'FX', value: 15 },
        { label: 'Fund', value: 10 }
      ];
    }
    
    // Get total trades and trading volume from API
    const totalTrades = apiData.total_trades || 
      tradeMonthlyData.reduce((sum, item) => sum + parseInt(item.total_trades), 0);
      
    const tradingVolume = apiData.trading_volume || 
      tradeMonthlyData.reduce((sum, item) => sum + parseFloat(item.trade_volume), 0);
    
    const pendingTrades = apiData.pending_trades || Math.round(totalTrades * 0.05);
    
    // Mock recent trades - in a real implementation, this would come from the API
    const recentTrades = Array(10).fill(0).map((_, i) => ({
      id: `T-${100000 + i}`,
      customer: ['BlackRock', 'Vanguard', 'Fidelity', 'State Street', 'JPMorgan'][i % 5],
      type: i % 2 === 0 ? 'Buy' : 'Sell',
      asset: ['Equity', 'Fixed Income', 'Fund', 'FX', 'Commodity'][i % 5],
      amount: 10000 + (i * 10000),
      status: ['Completed', 'Pending', 'Processing', 'Failed', 'Cancelled'][i % 5],
      date: new Date(Date.now() - (i * 86400000)).toISOString()
    }));
    
    // Return processed data
    return {
      totalCustomers: totalCustomers,
      activeCustomers: activeCustomers,
      totalAccounts: Math.round(totalCustomers * 1.5),
      totalTrades: totalTrades,
      tradingVolume: tradingVolume,
      pendingTrades: pendingTrades,
      openEvents: 15,
      corporateActions: 12,
      dealProcessing: 8,
      monthlyIncome: totalIncome,
      incomeByService: [],
      customerSegments,
      tradesByAssetClass,
      recentTrades,
      tradingVolumeHistory,
      tradeCountHistory
    };
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard data...</p>
      </div>
    );
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

  const {
    totalCustomers,
    activeCustomers,
    totalAccounts,
    totalTrades,
    tradingVolume,
    pendingTrades,
    openEvents,
    corporateActions,
    dealProcessing,
    customerSegments,
    tradesByAssetClass,
    monthlyIncome,
    incomeByService,
    recentTrades
  } = data;

  // Prepare chart data
  const customerSegmentChartData = {
    labels: customerSegments.map(item => item.label),
    datasets: [
      {
        data: customerSegments.map(item => item.value),
        backgroundColor: [
          '#007C75',  // Primary green
          '#009E94',  // Light green
          '#006560',  // Dark green
        ],
        borderWidth: 0,
      }
    ]
  };

  const tradesByAssetChartData = {
    labels: tradesByAssetClass.map(item => item.label),
    datasets: [
      {
        label: 'Trades by Asset Class',
        data: tradesByAssetClass.map(item => item.value),
        backgroundColor: '#007C75',
      }
    ]
  };

  const tradingVolumeChartData = {
    labels: filteredVolumeData.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Trading Volume',
        data: filteredVolumeData.map(item => item.value),
        fill: true,
        tension: 0.4,
        backgroundColor: 'rgba(0, 124, 117, 0.2)',
        borderColor: '#007C75',
      }
    ]
  };

  const tradeCountChartData = {
    labels: filteredTradeCountData.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Trade Count',
        data: filteredTradeCountData.map(item => item.value),
        fill: true,
        tension: 0.4,
        backgroundColor: 'rgba(0, 124, 117, 0.2)',
        borderColor: '#007C75',
      }
    ]
  };

  // Table columns for recent trades
  const recentTradesColumns = [
    { field: 'id', header: 'Trade ID', width: '15%' },
    { field: 'customer', header: 'Customer', width: '20%' },
    { field: 'type', header: 'Type', width: '10%' },
    { field: 'asset', header: 'Asset', width: '10%' },
    { field: 'amount', header: 'Amount', type: 'currency', width: '15%' },
    { field: 'status', header: 'Status', type: 'status', width: '10%' },
    { field: 'date', header: 'Date', type: 'date', format: 'datetime', width: '20%' }
  ];

  return (
    <div className="dashboard">
      {/* Header cards row */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Total Customers" 
            value={formatNumber(totalCustomers, false)} 
            icon="users"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Active Customers" 
            value={formatNumber(activeCustomers, false)} 
            subtitle={`${Math.round((activeCustomers / totalCustomers) * 100)}% of total`}
            icon="user-check"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Total Accounts" 
            value={formatNumber(totalAccounts, false)} 
            icon="folder-open"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Monthly Income" 
            value={formatCurrency(monthlyIncome)} 
            icon="chart-line"
            color="#28A745"
          />
        </div>
      </div>

      {/* Trading metrics row */}
      <div className="row g-3 mb-4">
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
            title="Pending Trades" 
            value={formatNumber(pendingTrades, false)} 
            icon="clock"
            color="#FFC107"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Open Events" 
            value={formatNumber(openEvents, false)} 
            icon="exclamation-circle"
            color="#DC3545"
          />
        </div>
      </div>

      {/* Charts row */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>Trading Volume History</h2>
              <DateRangeFilter onFilterChange={handleDateFilterChange} />
            </div>
            <div className="card-body">
              <Chart 
                type="line"
                data={tradingVolumeChartData}
                height="300px"
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return formatCurrency(value, 'USD', 0);
                        }
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return formatCurrency(context.raw, 'USD', 0);
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h2>Customer Segments</h2>
            </div>
            <div className="card-body">
              <Chart 
                type="doughnut"
                data={customerSegmentChartData}
                height="300px"
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* More charts row */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>Trade Count History</h2>
              <DateRangeFilter onFilterChange={handleDateFilterChange} />
            </div>
            <div className="card-body">
              <Chart 
                type="line"
                data={tradeCountChartData}
                height="250px"
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2>Trades by Asset Class</h2>
            </div>
            <div className="card-body">
              <Chart 
                type="bar"
                data={tradesByAssetChartData}
                height="250px"
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  },
                  barPercentage: 0.6,
                  categoryPercentage: 0.8
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent trades table */}
      <div className="card mb-4">
        <div className="card-header">
          <h2>Recent Trades</h2>
        </div>
        <div className="card-body">
          <DataTable 
            data={recentTrades}
            columns={recentTradesColumns}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
      
      {/* Trade detail modal */}
      {selectedTrade && (
        <TradeDetailModal 
          trade={selectedTrade} 
          onClose={closeTradeModal} 
        />
      )}
    </div>
  );
};

export default Dashboard;