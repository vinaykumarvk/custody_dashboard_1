import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import { formatDate, formatNumber, formatCurrency } from '../utils';
import MetricCard from './MetricCard';
import Chart from './Chart';
import DataTable from './DataTable';
import LoadingSpinner from './LoadingSpinner';

const CorporateActions = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData('corporate_actions');
        console.log('Corporate actions data loaded:', result);
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error('Error loading corporate actions data:', err);
        setError('Failed to load corporate actions data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRowClick = (action) => {
    setSelectedAction(action);
  };

  const closeModal = () => {
    setSelectedAction(null);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  if (loading) {
    return <LoadingSpinner message="Loading corporate actions data..." />;
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
        No corporate actions data available
      </div>
    );
  }

  // Filter actions based on selected filter
  const filteredActions = filter === 'all' 
    ? data.actions 
    : data.actions.filter(action => action.action_type === filter);

  // Prepare data for charts
  const actionTypesPieChart = {
    labels: data.action_types.map(item => item.type),
    datasets: [
      {
        data: data.action_types.map(item => item.count),
        backgroundColor: [
          '#007C75',  // Primary green
          '#009E94',  // Light green
          '#006560',  // Dark green
          '#00AEA4',  // Lighter green
          '#005550',  // Darker green
          '#00C5B9',  // Even lighter green
          '#004540',  // Even darker green
          '#00DBD0',  // Very light green
          '#003530',  // Very dark green
        ],
        borderWidth: 0,
      }
    ]
  };

  const statusBarChart = {
    labels: data.status_breakdown.map(item => item.status),
    datasets: [
      {
        label: 'Corporate Actions by Status',
        data: data.status_breakdown.map(item => item.count),
        backgroundColor: '#007C75',
      }
    ]
  };

  // Table columns for actions
  const actionsColumns = [
    { field: 'action_id', header: 'ID', width: '10%' },
    { field: 'security_name', header: 'Security', width: '20%' },
    { field: 'action_type', header: 'Type', width: '15%' },
    { field: 'announcement_date', header: 'Announced', type: 'date', format: 'datetime', width: '15%' },
    { field: 'record_date', header: 'Record Date', type: 'date', format: 'datetime', width: '15%' },
    { field: 'status', header: 'Status', type: 'status', width: '10%' },
    { 
      field: 'impact_value', 
      header: 'Impact', 
      type: 'custom', 
      render: (row) => {
        if (row.impact_value === null) return '-';
        if (row.action_type === 'Dividend') {
          return formatCurrency(row.impact_value, row.currency);
        } else if (row.action_type === 'Stock Split') {
          return `${row.impact_value}:1`;
        }
        return row.impact_value;
      },
      width: '15%' 
    }
  ];
  
  // Columns for upcoming actions table
  const upcomingColumns = [
    { field: 'action_id', header: 'ID', width: '10%' },
    { field: 'security_name', header: 'Security', width: '25%' },
    { field: 'action_type', header: 'Type', width: '15%' },
    { field: 'record_date', header: 'Record Date', type: 'date', format: 'date', width: '15%' },
    { field: 'payment_date', header: 'Payment Date', type: 'date', format: 'date', width: '15%' },
    { field: 'status', header: 'Status', type: 'status', width: '10%' },
    { 
      field: 'days_until', 
      header: 'Days Until', 
      type: 'custom', 
      render: (row) => {
        const recordDate = new Date(row.record_date);
        const today = new Date();
        const diffTime = Math.abs(recordDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      },
      width: '10%' 
    }
  ];

  // Corporate action detail modal
  const ActionDetailModal = ({ action, onClose }) => {
    if (!action) return null;
    
    const recordDate = new Date(action.record_date);
    const paymentDate = new Date(action.payment_date);
    const announcementDate = new Date(action.announcement_date);
    
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Corporate Action Details</h2>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <h3>Action Information</h3>
                <div className="mb-2">
                  <strong>Action ID:</strong> {action.action_id}
                </div>
                <div className="mb-2">
                  <strong>Security:</strong> {action.security_name} ({action.security_id})
                </div>
                <div className="mb-2">
                  <strong>Type:</strong> {action.action_type}
                </div>
                <div className="mb-2">
                  <strong>Status:</strong> <span className={`badge bg-${action.status === 'Completed' ? 'success' : action.status === 'Cancelled' ? 'danger' : action.status === 'Pending' ? 'warning' : 'info'}`}>{action.status}</span>
                </div>
              </div>
              <div className="col-md-6">
                <h3>Important Dates</h3>
                <div className="mb-2">
                  <strong>Announcement Date:</strong> {formatDate(announcementDate, 'long')}
                </div>
                <div className="mb-2">
                  <strong>Record Date:</strong> {formatDate(recordDate, 'long')}
                </div>
                <div className="mb-2">
                  <strong>Payment Date:</strong> {formatDate(paymentDate, 'long')}
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-12">
                <h3>Details</h3>
                <p>{action.description}</p>
                
                {action.impact_value && (
                  <div className="alert alert-info">
                    <strong>Impact Value:</strong> {
                      action.action_type === 'Dividend' 
                        ? formatCurrency(action.impact_value, action.currency) 
                        : action.action_type === 'Stock Split' 
                          ? `${action.impact_value}:1 Stock Split`
                          : action.impact_value
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="corporate-actions-page">
      <h1 className="page-title mb-4">Corporate Actions</h1>
      
      {/* Summary metrics row */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Total Actions" 
            value={formatNumber(data.total_actions, false)} 
            icon="bullhorn"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Upcoming Actions" 
            value={formatNumber(data.upcoming_count, false)} 
            icon="calendar-alt"
            color="#FFC107"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Completed Actions" 
            value={formatNumber(data.status_breakdown.find(s => s.status === 'Completed')?.count || 0, false)} 
            icon="check-circle"
            color="#28A745"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Pending Actions" 
            value={formatNumber(data.status_breakdown.find(s => s.status === 'Pending')?.count || 0, false)} 
            icon="exclamation-circle"
            color="#DC3545"
          />
        </div>
      </div>
      
      {/* Charts row */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2>Actions by Type</h2>
            </div>
            <div className="card-body">
              <Chart 
                type="pie"
                data={actionTypesPieChart}
                height="300px"
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
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
              <h2>Actions by Status</h2>
            </div>
            <div className="card-body">
              <Chart 
                type="bar"
                data={statusBarChart}
                height="300px"
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
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
      </div>
      
      {/* Upcoming actions table */}
      <div className="card mb-4">
        <div className="card-header">
          <h2>Upcoming Actions</h2>
        </div>
        <div className="card-body">
          <DataTable 
            data={data.upcoming_actions}
            columns={upcomingColumns}
            onRowClick={handleRowClick}
            emptyMessage="No upcoming corporate actions"
          />
        </div>
      </div>
      
      {/* All actions table with filter */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>All Corporate Actions</h2>
          <div className="d-flex align-items-center">
            <label htmlFor="actionTypeFilter" className="me-2">Filter by type:</label>
            <select id="actionTypeFilter" className="form-select" onChange={handleFilterChange} value={filter}>
              <option value="all">All types</option>
              {data.action_types.map(type => (
                <option key={type.type} value={type.type}>{type.type}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-body">
          <DataTable 
            data={filteredActions}
            columns={actionsColumns}
            onRowClick={handleRowClick}
            emptyMessage="No corporate actions match your filter"
          />
        </div>
      </div>
      
      {/* Action detail modal */}
      {selectedAction && (
        <ActionDetailModal 
          action={selectedAction} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default CorporateActions;