import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import Chart from 'chart.js/auto';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { formatNumber, formatCurrency, formatPercentage, formatDate } from '../utils';
import MetricCard from './MetricCard';

const Income = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('12m'); // Default to 12 months
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const incomeData = await fetchData('income');
        setData(incomeData);
        console.log('Income data loaded:', incomeData);
      } catch (err) {
        console.error('Error loading income data:', err);
        setError('Failed to load income data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const prepareIncomeHistoryChartData = () => {
    if (!data || !data.income_monthly) return null;
    
    // Filter data based on selected date range
    let filteredData = [...data.income_monthly];
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
          label: 'Total Income',
          data: filteredData.map(item => item.total_income),
          borderColor: '#007C75',
          backgroundColor: 'rgba(0, 124, 117, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'New Income',
          data: filteredData.map(item => item.new_income),
          borderColor: '#17A2B8',
          backgroundColor: 'rgba(23, 162, 184, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const prepareIncomeByServiceChartData = () => {
    if (!data || !data.income_by_service) return null;
    
    return {
      labels: data.income_by_service.map(item => item.service),
      datasets: [
        {
          data: data.income_by_service.map(item => item.amount),
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

  const prepareIncomeByRegionChartData = () => {
    if (!data || !data.income_by_region) return null;
    
    return {
      labels: data.income_by_region.map(region => region.region),
      datasets: [
        {
          label: 'Income by Region',
          data: data.income_by_region.map(region => region.amount),
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
        <p>Loading income data...</p>
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
        <p>No income data available.</p>
      </div>
    );
  }

  return (
    <div className="income-dashboard">
      <div className="dashboard-header">
        <h1>Income Dashboard</h1>
        <div className="date-range-selector">
          <button className={dateRange === '3m' ? 'active' : ''} onClick={() => setDateRange('3m')}>3 Months</button>
          <button className={dateRange === '6m' ? 'active' : ''} onClick={() => setDateRange('6m')}>6 Months</button>
          <button className={dateRange === '12m' ? 'active' : ''} onClick={() => setDateRange('12m')}>12 Months</button>
          <button className={dateRange === 'all' ? 'active' : ''} onClick={() => setDateRange('all')}>All</button>
        </div>
      </div>
      
      {/* Metrics summary */}
      <div className="row">
        <div className="col-md-3">
          <MetricCard 
            title="Total Income YTD" 
            value={formatCurrency(data.total_income_ytd)}
            subtitle="Year to date"
            icon="chart-line"
            color="#007C75"
            valueClassName={data.total_income_ytd > 1000000 ? 'smaller-value' : ''}
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Income MTD" 
            value={formatCurrency(data.total_income_mtd)}
            subtitle="Month to date"
            icon="money-bill-wave"
            color="#28A745"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="YoY Growth" 
            value={formatPercentage(data.income_growth_yoy)}
            subtitle="Year over year growth"
            icon="percentage"
            color="#17A2B8"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Outstanding Fees" 
            value={formatCurrency(data.fees_outstanding)}
            subtitle="Pending collection"
            icon="file-invoice-dollar"
            color="#FFC107"
            valueClassName={data.fees_outstanding > 1000000 ? 'smaller-value' : ''}
          />
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="row">
          <div className="col-8">
            <div className="card mb-4">
              <div className="card-header">
                <h2>Income History</h2>
              </div>
              <div className="card-body">
                {data.income_monthly && (
                  <Line 
                    data={prepareIncomeHistoryChartData()} 
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
                              return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            drawBorder: false,
                            borderDash: [2, 2]
                          },
                          ticks: {
                            callback: (value) => formatCurrency(value, 'USD', 0)
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
                <h2>Income by Service</h2>
              </div>
              <div className="card-body">
                {data.income_by_service && (
                  <Pie 
                    data={prepareIncomeByServiceChartData()}
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
                              const service = data.income_by_service[context.dataIndex];
                              return `${service.service}: ${formatCurrency(service.amount)} (${formatPercentage(service.percentage)})`;
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
        
        <div className="row">
          <div className="col-4">
            <div className="card mb-4">
              <div className="card-header">
                <h2>Income by Region</h2>
              </div>
              <div className="card-body">
                {data.income_by_region && (
                  <Bar 
                    data={prepareIncomeByRegionChartData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      indexAxis: 'y',
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              return `${context.label}: ${formatCurrency(context.raw)}`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          grid: {
                            drawBorder: false,
                            borderDash: [2, 2]
                          },
                          ticks: {
                            callback: (value) => formatCurrency(value, 'USD', 0)
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
                <h2>Top Revenue Customers</h2>
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
                        <th>YTD Revenue</th>
                        <th>MTD Revenue</th>
                        <th>Outstanding Fees</th>
                        <th>Relationship Manager</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.top_customers.map(customer => (
                        <tr key={customer.customer_id}>
                          <td>{customer.customer_id}</td>
                          <td>{customer.name}</td>
                          <td>{customer.type}</td>
                          <td>{formatCurrency(customer.ytd_revenue)}</td>
                          <td>{formatCurrency(customer.mtd_revenue)}</td>
                          <td>{formatCurrency(customer.fees_outstanding)}</td>
                          <td>{customer.relationship_manager}</td>
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

export default Income;