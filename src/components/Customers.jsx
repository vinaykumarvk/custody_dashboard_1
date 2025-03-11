import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import Chart from 'chart.js/auto';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { formatNumber, formatCurrency, formatPercentage, formatDate, getStatusColor } from '../utils';
import MetricCard from './MetricCard';

const Customers = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('12m'); // Default to 12 months
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const customersData = await fetchData('customers');
        setData(customersData);
        console.log('Customers data loaded:', customersData);
      } catch (err) {
        console.error('Error loading customers data:', err);
        setError('Failed to load customers data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const prepareCustomerGrowthChartData = () => {
    if (!data || !data.customers_monthly) return null;
    
    // Filter data based on selected date range
    let filteredData = [...data.customers_monthly];
    if (dateRange === '3m') {
      filteredData = filteredData.slice(-3);
    } else if (dateRange === '6m') {
      filteredData = filteredData.slice(-6);
    } else if (dateRange === '12m') {
      filteredData = filteredData.slice(-12);
    }
    
    return {
      labels: filteredData.map(item => formatDate(item.date, 'short')),
      datasets: [
        {
          label: 'Total Customers',
          data: filteredData.map(item => item.total_customers),
          borderColor: '#007C75',
          backgroundColor: 'rgba(0, 124, 117, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'New Customers',
          data: filteredData.map(item => item.new_customers),
          borderColor: '#17A2B8',
          backgroundColor: 'rgba(23, 162, 184, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const prepareCustomerSegmentsChartData = () => {
    if (!data || !data.customer_segments) return null;
    
    return {
      labels: data.customer_segments.map(segment => segment.segment),
      datasets: [
        {
          data: data.customer_segments.map(segment => segment.count),
          backgroundColor: [
            '#007C75', // Primary green
            '#009E94', // Light green
            '#006560', // Dark green
            '#17A2B8'  // Info blue
          ],
          borderWidth: 0
        }
      ]
    };
  };

  const prepareCustomersByRegionChartData = () => {
    if (!data || !data.customers_by_region) return null;
    
    return {
      labels: data.customers_by_region.map(region => region.region),
      datasets: [
        {
          label: 'Customers by Region',
          data: data.customers_by_region.map(region => region.count),
          backgroundColor: [
            '#007C75', // Primary green
            '#009E94', // Light green
            '#006560', // Dark green
            '#17A2B8', // Info blue
            '#6C757D'  // Gray
          ],
          borderWidth: 0
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading customers data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="no-data-container">
        <p>No customer data available.</p>
      </div>
    );
  }

  return (
    <div className="customers-dashboard">
      <div className="dashboard-header">
        <h1>Customers Dashboard</h1>
        <div className="date-range-selector">
          <button className={dateRange === '3m' ? 'active' : ''} onClick={() => setDateRange('3m')}>3 Months</button>
          <button className={dateRange === '6m' ? 'active' : ''} onClick={() => setDateRange('6m')}>6 Months</button>
          <button className={dateRange === '12m' ? 'active' : ''} onClick={() => setDateRange('12m')}>12 Months</button>
          <button className={dateRange === 'all' ? 'active' : ''} onClick={() => setDateRange('all')}>All</button>
        </div>
      </div>
      
      {/* Metrics summary */}
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-3">
          <MetricCard 
            title="Total Customers" 
            value={formatNumber(data.total_customers)}
            subtitle="All time"
            icon="users"
            color="#007C75"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Active Customers" 
            value={formatNumber(data.active_customers)}
            subtitle={`${Math.round((data.active_customers / data.total_customers) * 100)}% of total`}
            icon="user-check"
            color="#28A745"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="New Customers (MTD)" 
            value={formatNumber(data.new_customers_mtd)}
            subtitle="Month to date"
            icon="user-plus"
            color="#17A2B8"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Total Accounts" 
            value={formatNumber(data.total_accounts)}
            subtitle="All accounts"
            icon="layer-group"
            color="#6C757D"
          />
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="row g-3 mb-4 equal-height">
          <div className="col-8">
            <div className="card mb-4">
              <div className="card-header">
                <h2>Customer Growth</h2>
              </div>
              <div className="card-body">
                {data.customers_monthly && (
                  <Line 
                    data={prepareCustomerGrowthChartData()} 
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
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            drawBorder: false,
                            borderDash: [2, 2]
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        }
                      }
                    }}
                    height="300px"
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className="col-4">
            <div className="card mb-4">
              <div className="card-header">
                <h2>Customer Segments</h2>
              </div>
              <div className="card-body">
                {data.customer_segments && (
                  <Pie 
                    data={prepareCustomerSegmentsChartData()}
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
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const segment = data.customer_segments[context.dataIndex];
                              return `${segment.segment}: ${formatNumber(segment.count)} (${formatPercentage(segment.percentage)})`;
                            }
                          }
                        }
                      }
                    }}
                    height="300px"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="row g-3 mb-4 equal-height">
          <div className="col-4">
            <div className="card mb-4">
              <div className="card-header">
                <h2>Customers by Region</h2>
              </div>
              <div className="card-body">
                {data.customers_by_region && (
                  <Bar 
                    data={prepareCustomersByRegionChartData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      indexAxis: 'y',
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        x: {
                          grid: {
                            drawBorder: false,
                            borderDash: [2, 2]
                          }
                        },
                        y: {
                          grid: {
                            display: false
                          }
                        }
                      }
                    }}
                    height="300px"
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className="col-8">
            <div className="card mb-4">
              <div className="card-header">
                <h2>Recent Customers</h2>
                <button className="btn-view-all">View All</button>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Customer ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Country</th>
                        <th>Onboarded</th>
                        <th>Accounts</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recent_customers.map(customer => (
                        <tr key={customer.customer_id}>
                          <td>{customer.customer_id}</td>
                          <td>{customer.name}</td>
                          <td>{customer.type}</td>
                          <td>{customer.country}</td>
                          <td>{formatDate(customer.date_onboarded, 'short')}</td>
                          <td>{customer.accounts}</td>
                          <td>
                            <span 
                              className="status-indicator" 
                              style={{ backgroundColor: getStatusColor(customer.status) }}
                            >
                              {customer.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;