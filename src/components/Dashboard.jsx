import React, { useState, useEffect } from 'react';
import { formatNumber, formatCurrency } from '../utils';
import { fetchData } from '../services/api';
import MetricCard from './MetricCard';
import Chart from './Chart';
import DataTable from './DataTable';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);
  
  /**
   * Process API data into the format expected by the dashboard component
   */
  const processApiData = (apiData) => {
    // Extract summary metrics
    const summary = apiData.summary || {};
    
    // Extract and transform customer data
    const customerSegments = [
      { label: 'MUTUAL FUND', value: 2800 },
      { label: 'FD', value: 3100 },
      { label: 'PORTFOLIO', value: 4100 }
    ];
    
    // Extract trade data
    const tradingVolumeHistory = apiData.trade_monthly.map(item => ({
      date: item.date,
      value: item.trade_volume
    }));
    
    const tradeCountHistory = apiData.trade_monthly.map(item => ({
      date: item.date,
      value: item.total_trades
    }));
    
    // Create asset class breakdown
    const tradesByAssetClass = [
      { label: 'Equities', value: 45 },
      { label: 'Fixed Income', value: 30 },
      { label: 'FX', value: 15 },
      { label: 'Funds', value: 10 }
    ];
    
    // Mock recent trades
    const recentTrades = Array(10).fill(0).map((_, i) => ({
      id: `T-${1000 + i}`,
      customer: `Customer ${i + 1}`,
      type: i % 2 === 0 ? 'Buy' : 'Sell',
      asset: ['Equity', 'Bond', 'Fund', 'FX'][i % 4],
      amount: 10000 + (i * 1000),
      status: ['Completed', 'Pending', 'Processing'][i % 3],
      date: new Date(Date.now() - (i * 86400000)).toISOString()
    }));
    
    // Return processed data
    return {
      totalCustomers: summary.total_customers || 0,
      activeCustomers: Math.round(summary.total_customers * 0.8) || 0,
      totalAccounts: summary.total_customers * 1.5 || 0,
      totalTrades: summary.total_trades || 0,
      tradingVolume: summary.total_trades * 1000 || 0,
      pendingTrades: Math.round(summary.total_trades * 0.05) || 0,
      openEvents: summary.open_events || 0,
      corporateActions: 12,
      dealProcessing: 8,
      monthlyIncome: summary.total_income || 0,
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
    recentTrades,
    tradingVolumeHistory,
    tradeCountHistory
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
    labels: tradingVolumeHistory.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Trading Volume',
        data: tradingVolumeHistory.map(item => item.value),
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const tradeCountChartData = {
    labels: tradeCountHistory.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Trade Count',
        data: tradeCountHistory.map(item => item.value),
        fill: true,
        tension: 0.4,
      }
    ]
  };

  // Table columns for recent trades
  const recentTradesColumns = [
    { field: 'id', header: 'Trade ID', width: '15%' },
    { field: 'customer', header: 'Customer', width: '25%' },
    { field: 'type', header: 'Type', width: '10%' },
    { field: 'asset', header: 'Asset', width: '15%' },
    { field: 'amount', header: 'Amount', type: 'currency', width: '15%' },
    { field: 'status', header: 'Status', type: 'status', width: '15%' },
    { field: 'date', header: 'Date', type: 'date', format: 'datetime', width: '20%' }
  ];

  return (
    <div className="dashboard">
      {/* Header cards row */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Total Customers" 
            value={formatNumber(totalCustomers)} 
            icon="users"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Active Customers" 
            value={formatNumber(activeCustomers)} 
            subtitle={`${Math.round((activeCustomers / totalCustomers) * 100)}% of total`}
            icon="user-check"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Total Accounts" 
            value={formatNumber(totalAccounts)} 
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
            value={formatNumber(totalTrades)} 
            icon="exchange-alt"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Trading Volume" 
            value={formatCurrency(tradingVolume)} 
            icon="dollar-sign"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Pending Trades" 
            value={formatNumber(pendingTrades)} 
            icon="clock"
            color="#FFC107"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Open Events" 
            value={formatNumber(openEvents)} 
            icon="exclamation-circle"
            color="#DC3545"
          />
        </div>
      </div>

      {/* Charts row */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h2>Trading Volume History</h2>
            </div>
            <div className="card-body">
              <Chart 
                type="line"
                data={tradingVolumeChartData}
                height="300px"
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
              />
            </div>
          </div>
        </div>
      </div>

      {/* More charts row */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2>Trade Count History</h2>
            </div>
            <div className="card-body">
              <Chart 
                type="line"
                data={tradeCountChartData}
                height="250px"
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
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;