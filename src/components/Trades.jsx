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

  // Prepare trading volume history chart data
  const prepareVolumeHistoryChartData = () => {
    // Get data filtered by selected date range
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
      labels: data.trade_by_asset_class.map(item => item.asset_class),
      datasets: [
        {
          data: data.trade_by_asset_class.map(item => item.value),
          backgroundColor: [
            '#007C75',  // SmartBank green
            '#009E94',  // SmartBank light green
            '#006560',  // SmartBank dark green
            '#00BFB3',  // Additional blue-green
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare buy vs. sell chart data
  const prepareBuySellChartData = () => {
    return {
      labels: ['Buy Trades', 'Sell Trades'],
      datasets: [
        {
          data: [data.trades_buy, data.trades_sell],
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
    { field: 'date', header: 'Date', type: 'date', width: '150px' },
    { field: 'client_name', header: 'Client', width: '150px' },
    { field: 'trade_type', header: 'Type', width: '80px' },
    { field: 'security_name', header: 'Security', width: '150px' },
    { 
      field: 'amount', 
      header: 'Amount', 
      type: 'currency',
      width: '120px'
    },
    { 
      field: 'currency', 
      header: 'Currency', 
      width: '90px',
    },
    { 
      field: 'status', 
      header: 'Status', 
      type: 'status',
      width: '110px'
    }
  ];

  // Calculate success rate color
  const calculateSuccessColor = (rate) => {
    if (rate >= 0.95) return '#28A745'; // High - green
    if (rate >= 0.90) return '#FFC107'; // Medium - yellow
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
            icon="balance-scale"
            color="#17A2B8"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Success Rate" 
            value={formatPercentage(data.success_rate)}
            subtitle="Completed trades"
            icon="check-circle"
            color={calculateSuccessColor(data.success_rate)}
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
            icon="hourglass-half"
            color="#FFC107"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Processing" 
            value={formatNumber(data.processing_trades)}
            icon="cog"
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
                height="200px"
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
                height="200px"
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
                    <div className="detail-value">{formatDate(selectedTrade.date, 'long')}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Type:</div>
                    <div className="detail-value">{selectedTrade.trade_type}</div>
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
                  <h3>Security Information</h3>
                  <div className="detail-row">
                    <div className="detail-label">Security Name:</div>
                    <div className="detail-value">{selectedTrade.security_name}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Symbol:</div>
                    <div className="detail-value">{selectedTrade.security_id}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">ISIN:</div>
                    <div className="detail-value">{selectedTrade.isin}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">CUSIP:</div>
                    <div className="detail-value">{selectedTrade.cusip}</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Client Information</h3>
                  <div className="detail-row">
                    <div className="detail-label">Client Name:</div>
                    <div className="detail-value">{selectedTrade.client_name}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Client ID:</div>
                    <div className="detail-value">{selectedTrade.client_id}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Account ID:</div>
                    <div className="detail-value">{selectedTrade.account_id}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Relationship Manager:</div>
                    <div className="detail-value">{selectedTrade.relationship_manager}</div>
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