import React, { useState, useEffect } from 'react';
import Chart from './Chart';
import DataTable from './DataTable';
import MetricCard from './MetricCard';
import DateRangeFilter from './DateRangeFilter';
import { fetchData } from '../services/api';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '../utils';

const Settlements = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('3months');
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [settlementFilter, setSettlementFilter] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch settlements data
        const response = await fetchData('settlements');
        setData(response);
        console.log('Settlements data loaded:', response);
      } catch (err) {
        console.error('Error loading settlements data:', err);
        setError('Unable to load settlements data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // If loading or error
  if (loading) return <div className="loading">Loading settlements data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="no-data">No settlements data available.</div>;

  // Filter settlements by the selected status filter
  const getFilteredSettlements = () => {
    if (settlementFilter === 'all') {
      return data.recent_settlements;
    }
    return data.recent_settlements.filter(settlement => 
      settlement.status.toLowerCase() === settlementFilter.toLowerCase()
    );
  };

  // Prepare settlement history chart data
  const prepareSettlementHistoryChartData = () => {
    // Get data filtered by selected date range
    let filteredData = [...data.settlement_history];
    
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
          label: 'Completed',
          data: filteredData.map(item => item.completed),
          backgroundColor: 'rgba(40, 167, 69, 0.7)',
          borderColor: '#28A745',
          borderWidth: 1,
        },
        {
          label: 'Failed',
          data: filteredData.map(item => item.failed),
          backgroundColor: 'rgba(220, 53, 69, 0.7)',
          borderColor: '#DC3545',
          borderWidth: 1,
        },
        {
          label: 'Pending',
          data: filteredData.map(item => item.pending),
          backgroundColor: 'rgba(255, 193, 7, 0.7)',
          borderColor: '#FFC107',
          borderWidth: 1,
        }
      ],
    };
  };

  // Prepare settlement by currency chart data
  const prepareSettlementByCurrencyChartData = () => {
    return {
      labels: data.settlement_by_currency.map(item => item.currency),
      datasets: [
        {
          data: data.settlement_by_currency.map(item => item.value),
          backgroundColor: [
            '#007C75',  // SmartBank green
            '#009E94',  // SmartBank light green
            '#006560',  // SmartBank dark green
            '#00BFB3',  // Additional blue-green
            '#005450',  // Additional dark green
            '#28A745',  // Success green
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Table columns configuration
  const settlementColumns = [
    { field: 'settlement_id', header: 'Settlement ID', width: '120px' },
    { field: 'date', header: 'Date', type: 'date', width: '120px' },
    { field: 'trade_id', header: 'Trade ID', width: '100px' },
    { field: 'client_name', header: 'Client', width: '150px' },
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

  // Calculate potential risk
  const calculateRiskColor = (value) => {
    if (value > 0.10) return '#DC3545'; // High risk - red
    if (value > 0.05) return '#FFC107'; // Medium risk - yellow
    return '#28A745'; // Low risk - green
  };

  const handleSettlementClick = (settlement) => {
    setSelectedSettlement(settlement);
  };

  return (
    <div className="settlements-dashboard">
      <h1>Settlements</h1>
      
      {/* Metrics summary */}
      <div className="row">
        <div className="col-md-3">
          <MetricCard 
            title="Total Settlements" 
            value={formatNumber(data.total_settlements)}
            subtitle="Last 30 days"
            icon="check-circle"
            color="#007C75"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Settlement Volume" 
            value={formatCurrency(data.settlement_volume)}
            subtitle="Last 30 days"
            icon="money-bill-wave"
            color="#28A745"
            valueClassName={data.settlement_volume > 1000000 ? 'smaller-value' : ''}
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Avg. Settlement Time" 
            value={data.avg_settlement_time + ' hrs'}
            subtitle="Processing duration"
            icon="clock"
            color="#17A2B8"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Fails Rate" 
            value={formatPercentage(data.fails_rate)}
            subtitle="Settlement failures"
            icon="exclamation-triangle"
            color={calculateRiskColor(data.fails_rate)}
          />
        </div>
      </div>
      
      {/* Status metrics */}
      <div className="row mt-4">
        <div className="col-md-3">
          <MetricCard 
            title="Completed" 
            value={formatNumber(data.completed_settlements)}
            icon="check"
            color="#28A745"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Pending" 
            value={formatNumber(data.pending_settlements)}
            icon="hourglass-half"
            color="#FFC107"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Failed" 
            value={formatNumber(data.failed_settlements)}
            icon="times"
            color="#DC3545"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Pending Value" 
            value={formatCurrency(data.pending_value)}
            icon="dollar-sign"
            color="#17A2B8"
            valueClassName={data.pending_value > 1000000 ? 'smaller-value' : ''}
          />
        </div>
      </div>
      
      {/* Charts */}
      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h2>Settlement History</h2>
                <DateRangeFilter activeRange={dateRange} onChange={setDateRange} />
              </div>
            </div>
            <div className="card-body">
              <Chart 
                type="bar" 
                data={prepareSettlementHistoryChartData()} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { stacked: true },
                    y: { stacked: true }
                  },
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
                            label += formatNumber(context.parsed.y);
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
          <div className="card">
            <div className="card-header">
              <h2>Settlement by Currency</h2>
            </div>
            <div className="card-body">
              <Chart 
                type="doughnut" 
                data={prepareSettlementByCurrencyChartData()} 
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
      
      {/* Recent settlements table */}
      <div className="card mt-4">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h2>Recent Settlements</h2>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${settlementFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSettlementFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${settlementFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setSettlementFilter('completed')}
              >
                Completed
              </button>
              <button 
                className={`filter-btn ${settlementFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setSettlementFilter('pending')}
              >
                Pending
              </button>
              <button 
                className={`filter-btn ${settlementFilter === 'failed' ? 'active' : ''}`}
                onClick={() => setSettlementFilter('failed')}
              >
                Failed
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <DataTable 
            data={getFilteredSettlements()} 
            columns={settlementColumns}
            onRowClick={handleSettlementClick}
          />
        </div>
      </div>
      
      {/* Settlement Detail Modal */}
      {selectedSettlement && (
        <div className="modal-backdrop" onClick={() => setSelectedSettlement(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Settlement #{selectedSettlement.settlement_id}</h2>
              <button className="close-button" onClick={() => setSelectedSettlement(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="trade-detail-grid">
                <div className="detail-section">
                  <h3>Settlement Information</h3>
                  <div className="detail-row">
                    <div className="detail-label">Settlement ID:</div>
                    <div className="detail-value">{selectedSettlement.settlement_id}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Trade ID:</div>
                    <div className="detail-value">{selectedSettlement.trade_id}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Status:</div>
                    <div className="detail-value">
                      <span className={`status status-${selectedSettlement.status?.toLowerCase()}`}>
                        {selectedSettlement.status}
                      </span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Date:</div>
                    <div className="detail-value">{formatDate(selectedSettlement.date, 'long')}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Trade Date:</div>
                    <div className="detail-value">{formatDate(selectedSettlement.trade_date, 'long')}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Amount:</div>
                    <div className="detail-value">{formatCurrency(selectedSettlement.amount, selectedSettlement.currency)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Fees:</div>
                    <div className="detail-value">{formatCurrency(selectedSettlement.fees, selectedSettlement.currency)}</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Security & Client Information</h3>
                  <div className="detail-row">
                    <div className="detail-label">Security:</div>
                    <div className="detail-value">{selectedSettlement.security_name}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">ISIN:</div>
                    <div className="detail-value">{selectedSettlement.isin || 'N/A'}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Client:</div>
                    <div className="detail-value">{selectedSettlement.client_name}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Account:</div>
                    <div className="detail-value">{selectedSettlement.account_id}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Settlement Method:</div>
                    <div className="detail-value">{selectedSettlement.settlement_method}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Depository:</div>
                    <div className="detail-value">{selectedSettlement.depository}</div>
                  </div>
                </div>
              </div>
              
              {selectedSettlement.settlement_instructions && (
                <div className="detail-section mt-3">
                  <h3>Settlement Instructions</h3>
                  <div className="detail-notes">
                    {selectedSettlement.settlement_instructions}
                  </div>
                </div>
              )}
              
              {selectedSettlement.notes && (
                <div className="detail-section mt-3">
                  <h3>Notes</h3>
                  <div className="detail-notes">
                    {selectedSettlement.notes}
                  </div>
                </div>
              )}
              
              {selectedSettlement.status === 'Failed' && selectedSettlement.failure_reason && (
                <div className="detail-section mt-3">
                  <h3>Failure Reason</h3>
                  <div className="detail-notes" style={{ color: '#DC3545' }}>
                    {selectedSettlement.failure_reason}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedSettlement(null)}>Close</button>
              {selectedSettlement.status === 'Pending' && (
                <button className="btn btn-primary">Process Settlement</button>
              )}
              {selectedSettlement.status === 'Failed' && (
                <button className="btn btn-primary">Retry Settlement</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settlements;