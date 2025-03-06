import React, { useState, useEffect } from 'react';
import Chart from './Chart';
import DataTable from './DataTable';
import MetricCard from './MetricCard';
import DateRangeFilter from './DateRangeFilter';
import { fetchData } from '../services/api';
import { formatNumber, formatCurrency, formatDate } from '../utils';

const CorporateActions = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('3months');
  const [selectedAction, setSelectedAction] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch corporate actions data
        const response = await fetchData('corporate_actions');
        setData(response);
        console.log('Corporate actions data loaded:', response);
      } catch (err) {
        console.error('Error loading corporate actions data:', err);
        setError('Unable to load corporate actions data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // If loading or error
  if (loading) return <div className="loading">Loading corporate actions data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="no-data">No corporate actions data available.</div>;

  // Prepare chart data for upcoming corporate actions
  const prepareUpcomingChartData = () => {
    const types = {};
    
    // Count events by type
    data.upcoming_actions.forEach(action => {
      const type = action.action_type;
      types[type] = (types[type] || 0) + 1;
    });
    
    return {
      labels: Object.keys(types),
      datasets: [
        {
          data: Object.values(types),
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

  // Prepare chart data for corporate actions history
  const prepareHistoryChartData = () => {
    // Get last 12 entries or filter by selected date range
    let filteredData = [...data.monthly_history];
    
    // Apply date filter
    switch(dateRange) {
      case '1month':
        filteredData = filteredData.slice(-1);
        break;
      case '3months':
        filteredData = filteredData.slice(-3);
        break;
      case '6months':
        filteredData = filteredData.slice(-6);
        break;
      case '1year':
        filteredData = filteredData.slice(-12);
        break;
      // 'all' case uses all data
      default:
        break;
    }
    
    return {
      labels: filteredData.map(item => formatDate(item.month, 'short')),
      datasets: [
        {
          label: 'Dividends',
          data: filteredData.map(item => item.dividends),
          backgroundColor: 'rgba(0, 124, 117, 0.6)',
          borderColor: '#007C75',
          borderWidth: 1,
        },
        {
          label: 'Stock Splits',
          data: filteredData.map(item => item.stock_splits),
          backgroundColor: 'rgba(0, 158, 148, 0.6)',
          borderColor: '#009E94',
          borderWidth: 1,
        },
        {
          label: 'Rights Issues',
          data: filteredData.map(item => item.rights_issues),
          backgroundColor: 'rgba(0, 101, 96, 0.6)',
          borderColor: '#006560',
          borderWidth: 1,
        },
        {
          label: 'Mergers',
          data: filteredData.map(item => item.mergers),
          backgroundColor: 'rgba(0, 191, 179, 0.6)',
          borderColor: '#00BFB3',
          borderWidth: 1,
        }
      ],
    };
  };
  
  // Table columns configuration
  const actionColumns = [
    { field: 'action_date', header: 'Date', type: 'date', width: '100px' },
    { field: 'action_type', header: 'Action Type', width: '120px' },
    { field: 'security_name', header: 'Security', width: '150px' },
    { field: 'isin', header: 'ISIN', width: '110px' },
    { 
      field: 'status', 
      header: 'Status', 
      type: 'status',
      width: '100px'
    },
    { 
      field: 'value', 
      header: 'Value', 
      type: 'currency',
      width: '110px' 
    },
    { 
      field: 'client_impact', 
      header: 'Client Impact',
      width: '120px',
      render: (value) => {
        let color;
        switch(value?.toLowerCase()) {
          case 'high':
            color = 'var(--danger-color)';
            break;
          case 'medium':
            color = 'var(--warning-color)';
            break;
          case 'low':
            color = 'var(--success-color)';
            break;
          default:
            color = 'var(--text-light)';
        }
        return <span style={{ color, fontWeight: 'bold' }}>{value}</span>;
      }
    },
    { field: 'description', header: 'Description' }
  ];

  const handleActionClick = (action) => {
    setSelectedAction(action);
  };

  return (
    <div className="corporate-actions-dashboard">
      <h1>Corporate Actions</h1>
      
      {/* Metrics summary */}
      <div className="row">
        <div className="col-md-3">
          <MetricCard 
            title="Upcoming Actions" 
            value={formatNumber(data.total_upcoming)}
            subtitle="Next 30 days"
            icon="calendar-alt"
            color="#007C75"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="High Priority" 
            value={formatNumber(data.high_priority)}
            subtitle="Requires immediate attention"
            icon="exclamation-circle"
            color="#DC3545"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Client Elections" 
            value={formatNumber(data.pending_elections)}
            subtitle="Pending client decisions"
            icon="users"
            color="#FFC107"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Total Value" 
            value={formatCurrency(data.total_value)}
            subtitle="All upcoming actions"
            icon="dollar-sign"
            color="#28A745"
            valueClassName={data.total_value > 1000000 ? 'smaller-value' : ''}
          />
        </div>
      </div>
      
      {/* Charts */}
      <div className="row mt-4">
        <div className="col-md-5">
          <div className="card">
            <div className="card-header">
              <h2>Upcoming Actions by Type</h2>
            </div>
            <div className="card-body">
              <Chart 
                type="doughnut" 
                data={prepareUpcomingChartData()} 
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
                height="240px"
              />
            </div>
          </div>
        </div>
        
        <div className="col-md-7">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h2>Corporate Actions History</h2>
                <DateRangeFilter activeRange={dateRange} onChange={setDateRange} />
              </div>
            </div>
            <div className="card-body">
              <Chart 
                type="bar" 
                data={prepareHistoryChartData()} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { stacked: true },
                    y: { stacked: true }
                  },
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
                height="240px"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Upcoming actions table */}
      <div className="card mt-4">
        <div className="card-header">
          <h2>Upcoming Corporate Actions</h2>
        </div>
        <div className="card-body">
          <DataTable 
            data={data.upcoming_actions} 
            columns={actionColumns}
            onRowClick={handleActionClick}
          />
        </div>
      </div>
      
      {/* Recent actions table */}
      <div className="card mt-4">
        <div className="card-header">
          <h2>Recent Corporate Actions</h2>
        </div>
        <div className="card-body">
          <DataTable 
            data={data.recent_actions} 
            columns={actionColumns}
            onRowClick={handleActionClick}
          />
        </div>
      </div>
      
      {/* If an action is selected, we would display action details */}
      {selectedAction && (
        <div className="modal-backdrop" onClick={() => setSelectedAction(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Corporate Action Details</h2>
              <button className="close-button" onClick={() => setSelectedAction(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="trade-detail-grid">
                <div className="detail-section">
                  <h3>Basic Information</h3>
                  <div className="detail-row">
                    <div className="detail-label">Action ID:</div>
                    <div className="detail-value">{selectedAction.action_id}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Type:</div>
                    <div className="detail-value">{selectedAction.action_type}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Status:</div>
                    <div className="detail-value">
                      <span className={`status status-${selectedAction.status?.toLowerCase()}`}>
                        {selectedAction.status}
                      </span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Date:</div>
                    <div className="detail-value">{formatDate(selectedAction.action_date, 'long')}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Record Date:</div>
                    <div className="detail-value">{formatDate(selectedAction.record_date, 'long')}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Payment Date:</div>
                    <div className="detail-value">{formatDate(selectedAction.payment_date, 'long')}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Value:</div>
                    <div className="detail-value">{formatCurrency(selectedAction.value)}</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Security Information</h3>
                  <div className="detail-row">
                    <div className="detail-label">Security:</div>
                    <div className="detail-value">{selectedAction.security_name}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">CUSIP:</div>
                    <div className="detail-value">{selectedAction.cusip || 'N/A'}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">ISIN:</div>
                    <div className="detail-value">{selectedAction.isin || 'N/A'}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Exchange:</div>
                    <div className="detail-value">{selectedAction.exchange}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Client Impact:</div>
                    <div className="detail-value">
                      <span style={{ 
                        fontWeight: 'bold',
                        color: selectedAction.client_impact === 'High' ? 'var(--danger-color)' : 
                               selectedAction.client_impact === 'Medium' ? 'var(--warning-color)' : 
                               'var(--success-color)'
                      }}>
                        {selectedAction.client_impact}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="detail-section mt-3">
                <h3>Description</h3>
                <div className="detail-notes">
                  {selectedAction.description}
                </div>
              </div>
              
              <div className="detail-section mt-3">
                <h3>Client Elections</h3>
                <div className="detail-notes">
                  {selectedAction.elections ? (
                    <ul>
                      {selectedAction.elections.map((election, index) => (
                        <li key={index}>
                          Client {election.client_id}: {election.election_type} (Status: {election.status})
                        </li>
                      ))}
                    </ul>
                  ) : 'No client elections required or available.'}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedAction(null)}>Close</button>
              <button className="btn btn-primary">Process Action</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateActions;