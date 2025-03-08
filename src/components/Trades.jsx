import React, { useState, useEffect } from 'react';
import Chart from './Chart';
import DataTable from './DataTable';
import MetricCard from './MetricCard';
import DateRangeFilter from './DateRangeFilter';
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
        console.log('Fetching trades data...');
        const response = await fetchData('trades', true); // Enable debug mode
        console.log('Trades data received:', response);
        
        if (!response || !response.trades) {
          console.error('Invalid trade data format:', response);
          setError('The trades data format is invalid.');
          return;
        }
        
        setData(response);
        console.log('Trades data loaded successfully.');
      } catch (err) {
        console.error('Error loading trades data:', err);
        setError('Unable to load trades data: ' + (err.message || err));
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
      return data.trades;
    }
    return data.trades.filter(trade => 
      trade.status.toLowerCase() === tradeFilter.toLowerCase()
    );
  };

  // Generate mock volume history for demo purposes (since API doesn't provide it)
  const generateVolumeHistory = () => {
    const today = new Date();
    const result = [];
    
    for (let i = 180; i > 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Generate some realistic-looking data with a general upward trend and fluctuations
      const baseVolume = 500000;
      const trend = i * 1000; // Upward trend
      const randomFactor = Math.random() * 100000 - 50000; // Random fluctuation
      const weekendDip = (date.getDay() === 0 || date.getDay() === 6) ? 0.7 : 1; // Weekend volume is lower
      
      const volume = (baseVolume + trend + randomFactor) * weekendDip;
      
      result.push({
        date: date.toISOString(),
        volume: Math.max(volume, 100000) // Ensure minimum volume
      });
    }
    
    return result;
  };

  // Calculate trades by type (buy/sell)
  const calculateTradesByType = () => {
    if (!data.trades) return { buy: 0, sell: 0 };
    
    return data.trades.reduce((acc, trade) => {
      if (trade.type.toLowerCase() === 'buy') {
        acc.buy += 1;
      } else if (trade.type.toLowerCase() === 'sell') {
        acc.sell += 1;
      }
      return acc;
    }, { buy: 0, sell: 0 });
  };

  // Prepare trading volume history chart data
  const prepareVolumeHistoryChartData = () => {
    // Generate mock volume history data since API doesn't provide it
    let filteredData = generateVolumeHistory();
    
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
          label: 'Trading Volume',
          data: filteredData.map(item => item.volume),
          backgroundColor: 'rgba(0, 124, 117, 0.7)',
          borderColor: '#007C75',
          borderWidth: 1,
        }
      ],
    };
  };

  // Prepare trade by asset class chart data
  const prepareTradeByAssetClassChartData = () => {
    return {
      labels: data.asset_classes.map(item => item.label),
      datasets: [
        {
          data: data.asset_classes.map(item => item.count),
          backgroundColor: [
            '#007C75',  // SmartBank green
            '#009E94',  // SmartBank light green
            '#006560',  // SmartBank dark green
            '#00BFB3',  // Additional blue-green
            '#17a2b8',  // Info blue
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare buy vs. sell chart data
  const prepareBuySellChartData = () => {
    const tradesByType = calculateTradesByType();
    
    return {
      labels: ['Buy Trades', 'Sell Trades'],
      datasets: [
        {
          data: [tradesByType.buy, tradesByType.sell],
          backgroundColor: [
            '#28A745',  // Green for buy
            '#006560',  // Dark green for sell
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Table columns configuration
  const tradeColumns = [
    { field: 'trade_id', header: 'Trade ID', width: '100px' },
    { field: 'trade_date', header: 'Date', type: 'date', width: '150px' },
    { field: 'customer_name', header: 'Customer', width: '150px' },
    { field: 'asset_name', header: 'Asset', width: '150px' },
    { 
      field: 'amount', 
      header: 'Amount', 
      type: 'currency',
      width: '120px'
    },
    { field: 'type', header: 'Type', width: '80px' },
    { 
      field: 'status', 
      header: 'Status', 
      type: 'status',
      width: '110px'
    }
  ];

  // Calculate success rate
  const calculateSuccessRate = () => {
    if (!data.stats) return 0;
    return data.stats.completed_trades / data.stats.total_trades;
  };

  // Calculate success rate color
  const calculateSuccessColor = (rate) => {
    if (rate >= 0.25) return '#28A745'; // High - green
    if (rate >= 0.15) return '#FFC107'; // Medium - yellow
    return '#DC3545'; // Low - red
  };

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
            value={formatNumber(data.stats?.total_trades || 0)}
            subtitle="All trades"
            icon="exchange-alt"
            color="#007C75"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Trading Volume" 
            value={formatCurrency(data.stats?.total_volume || 0)}
            subtitle="Total volume"
            icon="chart-line"
            color="#28A745"
            valueClassName={data.stats?.total_volume > 1000000 ? 'smaller-value' : ''}
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Avg. Trade Size" 
            value={formatCurrency(data.stats ? data.stats.total_volume / data.stats.total_trades : 0)}
            subtitle="All trades"
            icon="balance-scale"
            color="#17A2B8"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Success Rate" 
            value={formatPercentage(calculateSuccessRate())}
            subtitle="Completed trades"
            icon="check-circle"
            color={calculateSuccessColor(calculateSuccessRate())}
          />
        </div>
      </div>
      
      {/* Status metrics */}
      <div className="row mt-4">
        <div className="col-md-3">
          <MetricCard 
            title="Completed" 
            value={formatNumber(data.stats?.completed_trades || 0)}
            icon="check"
            color="#28A745"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Pending" 
            value={formatNumber(data.stats?.pending_trades || 0)}
            icon="hourglass-half"
            color="#FFC107"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Processing" 
            value={formatNumber(data.stats?.processing_trades || 0)}
            icon="cog"
            color="#17A2B8"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Failed" 
            value={formatNumber(0)} // API doesn't provide failed count, so default to 0
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
                <h2>Trading Volume History</h2>
                <DateRangeFilter activeRange={dateRange} onChange={setDateRange} />
              </div>
            </div>
            <div className="card-body">
              <Chart 
                type="bar" 
                data={prepareVolumeHistoryChartData()} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          let label = context.dataset.label || '';
                          if (label) {
                            label += ': ';
                          }
                          if (context.parsed.y !== null) {
                            label += formatCurrency(context.parsed.y);
                          }
                          return label;
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
          <div className="card mb-5">
            <div className="card-header">
              <h2>Asset Class Breakdown</h2>
            </div>
            <div className="card-body">
              <Chart 
                type="doughnut" 
                data={prepareTradeByAssetClassChartData()} 
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
                height="300px"
              />
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h2>Buy vs. Sell Trades</h2>
            </div>
            <div className="card-body">
              <Chart 
                type="pie" 
                data={prepareBuySellChartData()} 
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
                height="300px"
              />
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
      
      {/* Trade Detail Modal */}
      {selectedTrade && (
        <div className="modal-backdrop" onClick={() => setSelectedTrade(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Trade #{selectedTrade.trade_id}</h2>
              <button className="close-button" onClick={() => setSelectedTrade(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="trade-detail-grid">
                <div className="detail-section">
                  <h3>Trade Information</h3>
                  <div className="detail-row">
                    <div className="detail-label">Trade ID:</div>
                    <div className="detail-value">{selectedTrade.trade_id}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Date:</div>
                    <div className="detail-value">{formatDate(selectedTrade.trade_date, 'long')}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Type:</div>
                    <div className="detail-value">{selectedTrade.type}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Status:</div>
                    <div className="detail-value">
                      <span className={`status status-${selectedTrade.status?.toLowerCase()}`}>
                        {selectedTrade.status}
                      </span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Settlement Date:</div>
                    <div className="detail-value">{formatDate(selectedTrade.settlement_date, 'long')}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Settlement Status:</div>
                    <div className="detail-value">
                      <span className={`status status-${selectedTrade.settlement_status?.toLowerCase()}`}>
                        {selectedTrade.settlement_status}
                      </span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Exchange:</div>
                    <div className="detail-value">{selectedTrade.exchange}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Settlement Location:</div>
                    <div className="detail-value">{selectedTrade.settlement_location}</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Financial Details</h3>
                  <div className="detail-row">
                    <div className="detail-label">Price:</div>
                    <div className="detail-value">{formatCurrency(selectedTrade.price, selectedTrade.currency)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Quantity:</div>
                    <div className="detail-value">{formatNumber(selectedTrade.quantity)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Amount:</div>
                    <div className="detail-value">{formatCurrency(selectedTrade.amount, selectedTrade.currency)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Commission:</div>
                    <div className="detail-value">{formatCurrency(selectedTrade.commission, selectedTrade.currency)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Fees:</div>
                    <div className="detail-value">{formatCurrency(selectedTrade.fees, selectedTrade.currency)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Total:</div>
                    <div className="detail-value">{formatCurrency(selectedTrade.total_amount, selectedTrade.currency)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Currency:</div>
                    <div className="detail-value">{selectedTrade.currency}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Asset Class:</div>
                    <div className="detail-value">{selectedTrade.asset_class}</div>
                  </div>
                </div>
              </div>
              
              <div className="detail-grid-2col mt-3">
                <div className="detail-section">
                  <h3>Asset Information</h3>
                  <div className="detail-row">
                    <div className="detail-label">Asset Name:</div>
                    <div className="detail-value">{selectedTrade.asset_name}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Asset Class:</div>
                    <div className="detail-value">{selectedTrade.asset_class}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Amount:</div>
                    <div className="detail-value">{formatCurrency(selectedTrade.amount)}</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Customer Information</h3>
                  <div className="detail-row">
                    <div className="detail-label">Customer Name:</div>
                    <div className="detail-value">{selectedTrade.customer_name}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Customer ID:</div>
                    <div className="detail-value">{selectedTrade.customer_id}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Created At:</div>
                    <div className="detail-value">{formatDate(selectedTrade.created_at, 'long')}</div>
                  </div>
                </div>
              </div>
              
              {selectedTrade.notes && (
                <div className="detail-section mt-3">
                  <h3>Notes</h3>
                  <div className="detail-notes">
                    {selectedTrade.notes}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedTrade(null)}>Close</button>
              {selectedTrade.status === 'Pending' && (
                <button className="btn btn-primary">Process Trade</button>
              )}
              {selectedTrade.status === 'Failed' && (
                <button className="btn btn-primary">Retry Trade</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trades;