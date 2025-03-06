import React, { useState, useEffect } from 'react';
import Chart from './Chart';
import DataTable from './DataTable';
import MetricCard from './MetricCard';
import DateRangeFilter from './DateRangeFilter';
import TradeDetailModal from './TradeDetailModal';
import { fetchData } from '../services/api';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '../utils';

const Trades = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('3months');
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [tradeFilter, setTradeFilter] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch trades data
        const response = await fetchData('trades');
        setData(response);
        console.log('Trades data loaded:', response);
      } catch (err) {
        console.error('Error loading trades data:', err);
        setError('Unable to load trades data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // If loading or error
  if (loading) return <div className="loading">Loading trades data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="no-data">No trades data available.</div>;

  // Filter trades by the selected status filter
  const getFilteredTrades = () => {
    if (tradeFilter === 'all') {
      return data.recent_trades;
    }
    return data.recent_trades.filter(trade => 
      trade.status.toLowerCase() === tradeFilter.toLowerCase()
    );
  };

  // Prepare volume chart data
  const prepareVolumeChartData = () => {
    // Get last entries or filter by selected date range
    let filteredData = [...data.volume_history];
    
    // Apply date filter
    switch(dateRange) {
      case '1week':
        filteredData = filteredData.slice(-7);
        break;
      case '1month':
        filteredData = filteredData.slice(-30);
        break;
      case '3months':
        filteredData = filteredData.slice(-90);
        break;
      case '6months':
        filteredData = filteredData.slice(-180);
        break;
      case '1year':
        filteredData = filteredData.slice(-365);
        break;
      // 'all' case uses all data
      default:
        break;
    }
    
    return {
      labels: filteredData.map(item => formatDate(item.date, 'short')),
      datasets: [
        {
          label: 'Trade Volume',
          data: filteredData.map(item => item.volume),
          borderColor: '#007C75',
          backgroundColor: 'rgba(0, 124, 117, 0.1)',
          tension: 0.4,
          fill: true,
        }
      ],
    };
  };

  // Prepare asset class breakdown chart data
  const prepareAssetClassChartData = () => {
    return {
      labels: data.trade_by_asset_class.map(item => item.asset_class),
      datasets: [
        {
          data: data.trade_by_asset_class.map(item => item.value),
          backgroundColor: [
            '#007C75',  // SmartBank green
            '#009E94',  // SmartBank light green
            '#006560',  // SmartBank dark green
            '#00BFB3',  // Additional blue-green
            '#005450',  // Additional dark green
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare trade direction (buy/sell) chart data
  const prepareTradeDirectionChartData = () => {
    return {
      labels: ['Buy', 'Sell'],
      datasets: [
        {
          data: [data.trades_buy, data.trades_sell],
          backgroundColor: [
            '#28A745',  // Buy - green
            '#DC3545',  // Sell - red
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Table columns configuration
  const tradeColumns = [
    { field: 'trade_id', header: 'Trade ID', width: '100px' },
    { field: 'date', header: 'Date', type: 'date', width: '120px' },
    { field: 'client_name', header: 'Client', width: '150px' },
    { 
      field: 'trade_type', 
      header: 'Type', 
      width: '80px',
      render: (value) => (
        <span className={`trade-type ${value?.toLowerCase()}`}>
          {value}
        </span>
      )
    },
    { field: 'security_name', header: 'Security', width: '150px' },
    { 
      field: 'amount', 
      header: 'Amount', 
      type: 'currency',
      width: '120px'
    },
    { 
      field: 'status', 
      header: 'Status', 
      type: 'status',
      width: '110px'
    },
    { 
      field: 'settlement_date', 
      header: 'Settlement',
      type: 'date',
      width: '120px'
    }
  ];

  const handleTradeClick = (trade) => {
    setSelectedTrade(trade);
  };

  return (
    <div className="trades-dashboard">
      <h1>Trades</h1>
      
      {/* Metrics summary */}
      <div className="row">
        <div className="col-md-3">
          <MetricCard 
            title="Total Trades" 
            value={formatNumber(data.total_trades)}
            subtitle="Last 30 days"
            icon="exchange-alt"
            color="#007C75"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Trading Volume" 
            value={formatCurrency(data.trading_volume)}
            subtitle="Last 30 days"
            icon="chart-line"
            color="#28A745"
            valueClassName={data.trading_volume > 1000000 ? 'smaller-value' : ''}
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Avg. Trade Size" 
            value={formatCurrency(data.avg_trade_size)}
            subtitle="Last 30 days"
            icon="dollar-sign"
            color="#17A2B8"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Success Rate" 
            value={formatPercentage(data.success_rate)}
            subtitle="Completed trades"
            icon="check-circle"
            color="#FFC107"
          />
        </div>
      </div>
      
      {/* Status metrics */}
      <div className="row mt-4">
        <div className="col-md-3">
          <MetricCard 
            title="Completed" 
            value={formatNumber(data.completed_trades)}
            icon="check"
            color="#28A745"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Pending" 
            value={formatNumber(data.pending_trades)}
            icon="clock"
            color="#FFC107"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Processing" 
            value={formatNumber(data.processing_trades)}
            icon="spinner"
            color="#17A2B8"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Failed" 
            value={formatNumber(data.failed_trades)}
            icon="times"
            color="#DC3545"
          />
        </div>
      </div>
      
      {/* Charts */}
      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h2>Trading Volume</h2>
                <DateRangeFilter activeRange={dateRange} onChange={setDateRange} />
              </div>
            </div>
            <div className="card-body">
              <Chart 
                type="line" 
                data={prepareVolumeChartData()} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return '$' + (value / 1000000) + 'M';
                        }
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return 'Volume: ' + formatCurrency(context.raw);
                        }
                      }
                    }
                  }
                }}
                height="300px"
              />
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="row">
            <div className="col-md-12">
              <div className="card mb-4">
                <div className="card-header">
                  <h2>Asset Class Breakdown</h2>
                </div>
                <div className="card-body">
                  <Chart 
                    type="doughnut" 
                    data={prepareAssetClassChartData()} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            boxWidth: 15,
                            padding: 10
                          }
                        }
                      }
                    }}
                    height="140px"
                  />
                </div>
              </div>
            </div>
            
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h2>Buy vs Sell</h2>
                </div>
                <div className="card-body">
                  <Chart 
                    type="pie" 
                    data={prepareTradeDirectionChartData()} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            boxWidth: 15,
                            padding: 10
                          }
                        }
                      }
                    }}
                    height="140px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent trades table */}
      <div className="card mt-4">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h2>Recent Trades</h2>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${tradeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTradeFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${tradeFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setTradeFilter('completed')}
              >
                Completed
              </button>
              <button 
                className={`filter-btn ${tradeFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setTradeFilter('pending')}
              >
                Pending
              </button>
              <button 
                className={`filter-btn ${tradeFilter === 'failed' ? 'active' : ''}`}
                onClick={() => setTradeFilter('failed')}
              >
                Failed
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <DataTable 
            data={getFilteredTrades()} 
            columns={tradeColumns}
            onRowClick={handleTradeClick}
          />
        </div>
      </div>
      
      {/* Display trade details modal if a trade is selected */}
      {selectedTrade && (
        <TradeDetailModal 
          trade={selectedTrade} 
          onClose={() => setSelectedTrade(null)}
        />
      )}
    </div>
  );
};

export default Trades;