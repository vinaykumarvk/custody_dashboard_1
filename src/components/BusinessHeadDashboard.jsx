import React, { useState, useEffect } from 'react';
import { formatNumber, formatCurrency, formatPercentage } from '../utils';
import { fetchData } from '../services/api';
import MetricCard from './MetricCard';
import Chart from './Chart';
import DataTable from './DataTable';
import DateRangeFilter from './DateRangeFilter';

/**
 * Business Head Dashboard Component
 * This component aggregates key metrics and visualizations from across the application
 * to provide a comprehensive view for business executives.
 */
const BusinessHeadDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterParams, setFilterParams] = useState({
    startDate: null,
    endDate: new Date(),
    range: '30d'
  });

  // Fetch all necessary data when component mounts
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from multiple endpoints in parallel
        const [dashboardData, customersData, incomeData, corporateActionsData, settlementsData] = await Promise.all([
          fetchData('dashboard'),
          fetchData('customers'),
          fetchData('income'),
          fetchData('corporate-actions'),
          fetchData('settlements')
        ]);
        
        // Consolidate all data
        const consolidatedData = {
          dashboard: dashboardData,
          customers: customersData,
          income: incomeData,
          corporateActions: corporateActionsData,
          settlements: settlementsData
        };
        
        console.log('Business Head Dashboard data loaded:', consolidatedData);
        setData(consolidatedData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  const handleDateFilterChange = (newFilterParams) => {
    setFilterParams(newFilterParams);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Business Head Dashboard</h1>
        </div>
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Business Head Dashboard</h1>
        </div>
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  // Extract data for metrics and charts
  const {
    dashboard = {},
    customers = {},
    income = {},
    corporateActions = {},
    settlements = {}
  } = data || {};

  // Prepare data for rendering
  const totalCustomers = dashboard.totalCustomers || dashboard.total_customers || 0;
  const activeCustomers = dashboard.activeCustomers || dashboard.active_customers || 0;
  const newCustomersMTD = customers.newCustomersMTD || 0;
  const totalAUC = dashboard.assetsUnderCustody?.total || 0;
  const monthlyIncome = income.totalIncome || 0;
  const totalIncomeYTD = income.incomeYTD || 0;
  const incomeMTD = income.incomeMTD || 0;
  const yoyGrowth = income.yoyGrowth || 0;
  const outstandingFees = income.outstandingFees || 0;
  
  // Corporate actions metrics
  const totalActions = corporateActions.total_actions || corporateActions.totalActions || 0;
  const mandatoryActions = corporateActions.mandatory || corporateActions.mandatoryActions || 0;
  const voluntaryActions = corporateActions.voluntary || corporateActions.voluntaryActions || 0;
  const upcomingActions = corporateActions.upcoming_count || corporateActions.upcomingActions || 0;
  const completedActions = corporateActions.completed || corporateActions.completedActions || 0; 
  const pendingActions = corporateActions.pending_elections || corporateActions.pendingActions || 0;
  const pendingElections = corporateActions.pending_elections || corporateActions.pendingElections || 0;
  
  // Settlements metrics
  const totalSettlements = settlements.totalSettlements || 0;
  const settlementVolume = settlements.settlementVolume || 0;
  const averageTradeSize = settlements.averageTradeSize || 0;
  const averageSettlementTime = settlements.averageSettlementTime || '0';
  const failRate = settlements.failRate || 0;
  const completedSettlements = settlements.completedSettlements || 0;
  const pendingSettlements = settlements.pendingSettlements || 0;
  const failedSettlements = settlements.failedSettlements || 0;
  const pendingValue = settlements.pendingValue || 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Business Head Dashboard</h1>
        <DateRangeFilter onFilterChange={handleDateFilterChange} />
      </div>

      {/* Customer & AUC Overview Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Customers & Assets Overview</h2>
        <div className="row g-4">
          {/* Customer Metrics */}
          <div className="col-md-6 col-xl-3">
            <MetricCard 
              title="Total Customers" 
              value={formatNumber(totalCustomers)}
              icon="users"
              color="#007c75"
            />
          </div>
          <div className="col-md-6 col-xl-3">
            <MetricCard 
              title="Active Customers" 
              value={formatNumber(activeCustomers)}
              icon="user-check"
              color="#007c75"
            />
          </div>
          <div className="col-md-6 col-xl-3">
            <MetricCard 
              title="New Customers MTD" 
              value={formatNumber(newCustomersMTD)}
              icon="user-plus"
              color="#007c75"
            />
          </div>
          <div className="col-md-6 col-xl-3">
            <MetricCard 
              title="Total AUC" 
              value={formatCurrency(totalAUC, 'USD', 0, true)}
              icon="money-bill-wave"
              color="#007c75"
            />
          </div>
        </div>

        {/* Customer & AUC Charts */}
        <div className="row g-4 mt-4">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title">Trading Volume History</h5>
              </div>
              <div className="card-body">
                {dashboard.tradingVolumeHistory && (
                  <Chart 
                    type="line"
                    data={{
                      labels: dashboard.tradingVolumeHistory.map(item => item.date),
                      datasets: [{
                        label: 'Trading Volume',
                        data: dashboard.tradingVolumeHistory.map(item => item.value),
                        borderColor: '#007c75',
                        backgroundColor: 'rgba(0, 124, 117, 0.1)',
                        tension: 0.4
                      }]
                    }}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return formatCurrency(value, 'USD', 0, true);
                            }
                          }
                        }
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return formatCurrency(context.parsed.y, 'USD', 0);
                            }
                          }
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title">Trading AUC History</h5>
              </div>
              <div className="card-body">
                {dashboard.assetsUnderCustody?.history && (
                  <Chart 
                    type="line"
                    data={{
                      labels: dashboard.assetsUnderCustody.history.map(item => item.date || item.month),
                      datasets: [{
                        label: 'Assets Under Custody',
                        data: dashboard.assetsUnderCustody.history.map(item => item.value),
                        borderColor: '#2c7be5',
                        backgroundColor: 'rgba(44, 123, 229, 0.1)',
                        tension: 0.4
                      }]
                    }}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return formatCurrency(value, 'USD', 0, true);
                            }
                          }
                        }
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return formatCurrency(context.parsed.y, 'USD', 0);
                            }
                          }
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AUC by Asset Class */}
        <div className="row g-4 mt-4">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title">Total AUC by Asset Class</h5>
              </div>
              <div className="card-body">
                {dashboard.assetsUnderCustody?.byAssetClass && (
                  <Chart 
                    type="doughnut"
                    data={{
                      labels: dashboard.assetsUnderCustody.byAssetClass.map(item => item.label),
                      datasets: [{
                        data: dashboard.assetsUnderCustody.byAssetClass.map(item => item.value),
                        backgroundColor: [
                          '#007c75', '#2c7be5', '#00d97e', '#39afd1', '#6b5eae'
                        ]
                      }]
                    }}
                    options={{
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = formatCurrency(context.raw, 'USD', 0);
                              return `${label}: ${value}`;
                            }
                          }
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title">AUC by Asset Class</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {dashboard.assetsUnderCustody?.byAssetClass && 
                    dashboard.assetsUnderCustody.byAssetClass.map((asset, index) => (
                      <div className="col-md-6" key={index}>
                        <MetricCard 
                          title={asset.label}
                          value={formatCurrency(asset.value, 'USD', 0, true)}
                          color={
                            asset.label === 'Equity' ? '#007c75' :
                            asset.label === 'Fixed Income' ? '#2c7be5' :
                            asset.label === 'Alternatives' ? '#00d97e' :
                            asset.label === 'Cash' ? '#39afd1' : '#6b5eae'
                          }
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Income Overview Section */}
      <section className="dashboard-section mt-5">
        <h2 className="section-title">Income Overview</h2>
        <div className="row g-4">
          <div className="col-md-6 col-xl-3">
            <MetricCard 
              title="Monthly Income" 
              value={formatCurrency(monthlyIncome, 'USD', 0)}
              icon="dollar-sign"
              color="#00d97e"
            />
          </div>
          <div className="col-md-6 col-xl-3">
            <MetricCard 
              title="Total Income (YTD)" 
              value={formatCurrency(totalIncomeYTD, 'USD', 0, true)}
              icon="chart-line"
              color="#00d97e"
            />
          </div>
          <div className="col-md-6 col-xl-3">
            <MetricCard 
              title="Income MTD" 
              value={formatCurrency(incomeMTD, 'USD', 0)}
              icon="calendar-check"
              color="#00d97e"
            />
          </div>
          <div className="col-md-6 col-xl-3">
            <MetricCard 
              title="YoY Growth" 
              value={formatPercentage(yoyGrowth, 1)}
              icon="chart-bar"
              color="#00d97e"
              trend={yoyGrowth}
            />
          </div>
        </div>

        <div className="row g-4 mt-4">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title">Income by Service</h5>
              </div>
              <div className="card-body">
                {income.incomeByCategory && (
                  <Chart 
                    type="bar"
                    data={{
                      labels: income.incomeByCategory.map(item => item.category),
                      datasets: [{
                        label: 'Income',
                        data: income.incomeByCategory.map(item => item.amount),
                        backgroundColor: [
                          '#007c75', '#2c7be5', '#00d97e', '#39afd1', '#6b5eae'
                        ]
                      }]
                    }}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return formatCurrency(value, 'USD', 0, true);
                            }
                          }
                        }
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return formatCurrency(context.parsed.y, 'USD', 0);
                            }
                          }
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title">Income History</h5>
              </div>
              <div className="card-body">
                {income.monthlyHistory && (
                  <Chart 
                    type="line"
                    data={{
                      labels: income.monthlyHistory.map(item => item.period),
                      datasets: [{
                        label: 'Monthly Income',
                        data: income.monthlyHistory.map(item => item.value),
                        borderColor: '#00d97e',
                        backgroundColor: 'rgba(0, 217, 126, 0.1)',
                        tension: 0.4
                      }]
                    }}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return formatCurrency(value, 'USD', 0, true);
                            }
                          }
                        }
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return formatCurrency(context.parsed.y, 'USD', 0);
                            }
                          }
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Actions Section */}
      <section className="dashboard-section mt-5">
        <h2 className="section-title">Corporate Actions</h2>
        <div className="row g-4">
          <div className="col-md-4 col-xl-2">
            <MetricCard 
              title="Total Actions" 
              value={formatNumber(totalActions)}
              icon="building"
              color="#6b5eae"
            />
          </div>
          <div className="col-md-4 col-xl-2">
            <MetricCard 
              title="Mandatory" 
              value={formatNumber(mandatoryActions)}
              icon="lock"
              color="#6b5eae"
            />
          </div>
          <div className="col-md-4 col-xl-2">
            <MetricCard 
              title="Voluntary" 
              value={formatNumber(voluntaryActions)}
              icon="unlock"
              color="#6b5eae"
            />
          </div>
          <div className="col-md-4 col-xl-2">
            <MetricCard 
              title="Upcoming" 
              value={formatNumber(upcomingActions)}
              icon="calendar-alt"
              color="#6b5eae"
            />
          </div>
          <div className="col-md-4 col-xl-2">
            <MetricCard 
              title="Completed" 
              value={formatNumber(completedActions)}
              icon="check-circle"
              color="#6b5eae"
            />
          </div>
          <div className="col-md-4 col-xl-2">
            <MetricCard 
              title="Pending" 
              value={formatNumber(pendingActions)}
              icon="clock"
              color="#6b5eae"
            />
          </div>
        </div>

        <div className="row g-4 mt-4">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title">Actions by Type</h5>
              </div>
              <div className="card-body">
                {(corporateActions.action_types || corporateActions.actionsByType) && (
                  <Chart 
                    type="pie"
                    data={{
                      labels: (corporateActions.action_types || corporateActions.actionsByType || []).map(item => item.type || item.label),
                      datasets: [{
                        data: (corporateActions.action_types || corporateActions.actionsByType || []).map(item => item.count || item.value),
                        backgroundColor: [
                          '#007c75', '#2c7be5', '#00d97e', '#39afd1', '#6b5eae', '#e63757'
                        ]
                      }]
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title">Actions by Status</h5>
              </div>
              <div className="card-body">
                {(corporateActions.status_breakdown || corporateActions.actionsByStatus) && (
                  <Chart 
                    type="doughnut"
                    data={{
                      labels: (corporateActions.status_breakdown || corporateActions.actionsByStatus || []).map(item => item.status || item.label),
                      datasets: [{
                        data: (corporateActions.status_breakdown || corporateActions.actionsByStatus || []).map(item => item.count || item.value),
                        backgroundColor: [
                          '#00d97e', '#f6c343', '#e63757', '#39afd1', '#95aac9'
                        ]
                      }]
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Actions Table */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Upcoming Actions</h5>
              </div>
              <div className="card-body">
                {(corporateActions.upcoming_actions || corporateActions.upcomingActions || corporateActions.actions) && (
                  <DataTable 
                    data={corporateActions.upcoming_actions || corporateActions.upcomingActionsList || corporateActions.actions || []}
                    columns={[
                      { header: 'ID', accessor: 'id' },
                      { header: 'Security', accessor: row => row.security_name || row.security || ''},
                      { header: 'Type', accessor: row => row.action_type || row.type || ''},
                      { header: 'Ex Date', accessor: row => row.announcement_date || row.exDate || ''},
                      { header: 'Record Date', accessor: row => row.record_date || row.recordDate || ''},
                      { header: 'Payment Date', accessor: row => row.payment_date || row.paymentDate || ''},
                      { header: 'Status', accessor: row => row.status || '', cell: (value) => (
                        <span className={`badge bg-${
                          value === 'Completed' ? 'success' :
                          value === 'Announced' || value === 'Pending' ? 'warning' :
                          value === 'In Progress' ? 'info' : 'secondary'
                        }`}>{value}</span>
                      )}
                    ]}
                    pagination={true}
                    paginationPageSize={5}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Settlements Section */}
      <section className="dashboard-section mt-5">
        <h2 className="section-title">Settlements</h2>
        <div className="row g-4">
          <div className="col-md-4 col-xl-2">
            <MetricCard 
              title="Total Settlements (30d)" 
              value={formatNumber(totalSettlements)}
              icon="exchange-alt"
              color="#2c7be5"
            />
          </div>
          <div className="col-md-4 col-xl-2">
            <MetricCard 
              title="Settlement Volume" 
              value={formatCurrency(settlementVolume, 'USD', 0, true)}
              icon="money-bill-wave"
              color="#2c7be5"
            />
          </div>
          <div className="col-md-4 col-xl-2">
            <MetricCard 
              title="Average Trade Size" 
              value={formatCurrency(averageTradeSize, 'USD', 0)}
              icon="calculator"
              color="#2c7be5"
            />
          </div>
          <div className="col-md-4 col-xl-2">
            <MetricCard 
              title="Average Settlement Time" 
              value={averageSettlementTime}
              subtitle="Hours"
              icon="clock"
              color="#2c7be5"
            />
          </div>
          <div className="col-md-4 col-xl-2">
            <MetricCard 
              title="Fail Rate" 
              value={formatPercentage(failRate, 2)}
              icon="exclamation-triangle"
              color={failRate > 5 ? '#e63757' : failRate > 2 ? '#f6c343' : '#2c7be5'}
            />
          </div>
          <div className="col-md-4 col-xl-2">
            <MetricCard 
              title="Pending Value" 
              value={formatCurrency(pendingValue, 'USD', 0, true)}
              icon="hourglass-half"
              color="#2c7be5"
            />
          </div>
        </div>

        <div className="row g-4 mt-4">
          <div className="col-md-4">
            <div className="row g-4">
              <div className="col-12">
                <MetricCard 
                  title="Completed" 
                  value={formatNumber(completedSettlements)}
                  icon="check-circle"
                  color="#00d97e"
                />
              </div>
              <div className="col-12">
                <MetricCard 
                  title="Pending" 
                  value={formatNumber(pendingSettlements)}
                  icon="clock"
                  color="#f6c343"
                />
              </div>
              <div className="col-12">
                <MetricCard 
                  title="Failed" 
                  value={formatNumber(failedSettlements)}
                  icon="times-circle"
                  color="#e63757"
                />
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title">Settlement Volume History</h5>
              </div>
              <div className="card-body">
                {settlements.volumeHistory && (
                  <Chart 
                    type="line"
                    data={{
                      labels: settlements.volumeHistory.map(item => item.date),
                      datasets: [{
                        label: 'Settlement Volume',
                        data: settlements.volumeHistory.map(item => item.value),
                        borderColor: '#2c7be5',
                        backgroundColor: 'rgba(44, 123, 229, 0.1)',
                        tension: 0.4
                      }]
                    }}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return formatCurrency(value, 'USD', 0, true);
                            }
                          }
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-4">
          <div className="col-md-5">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title">Settlement by Currency</h5>
              </div>
              <div className="card-body">
                {settlements.byCurrency && (
                  <Chart 
                    type="pie"
                    data={{
                      labels: settlements.byCurrency.map(item => item.currency),
                      datasets: [{
                        data: settlements.byCurrency.map(item => item.value),
                        backgroundColor: [
                          '#007c75', '#2c7be5', '#00d97e', '#39afd1', '#6b5eae', '#e63757'
                        ]
                      }]
                    }}
                    options={{
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = formatCurrency(context.raw, context.label, 0);
                              return `${label}: ${value}`;
                            }
                          }
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title">Recent Settlements</h5>
              </div>
              <div className="card-body">
                {settlements.recentSettlements && (
                  <DataTable 
                    data={settlements.recentSettlements}
                    columns={[
                      { header: 'ID', accessor: 'id' },
                      { header: 'Security', accessor: 'security' },
                      { header: 'Amount', accessor: 'amount', cell: (value, row) => (
                        formatCurrency(value, row.currency || 'USD', 2, false, true)
                      )},
                      { header: 'Settlement Date', accessor: 'settlementDate' },
                      { header: 'Status', accessor: 'status', cell: (value) => (
                        <span className={`badge bg-${
                          value === 'Settled' ? 'success' :
                          value === 'Pending' ? 'warning' :
                          value === 'Failed' ? 'danger' : 'secondary'
                        }`}>{value}</span>
                      )}
                    ]}
                    pagination={true}
                    paginationPageSize={5}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessHeadDashboard;