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
    if (!data || !data.monthly_history) return null;
    
    // Filter data based on selected date range
    let filteredData = [...data.monthly_history];
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
          data: filteredData.map(item => parseFloat(item.amount)),
          borderColor: '#007C75',
          backgroundColor: 'rgba(0, 124, 117, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const prepareIncomeByServiceChartData = () => {
    if (!data || !data.income_by_category) return null;
    
    return {
      labels: data.income_by_category.map(item => item.category),
      datasets: [
        {
          data: data.income_by_category.map(item => parseFloat(item.amount)),
          backgroundColor: [
            '#007C75', // Primary green
            '#009E94', // Light green
            '#006560', // Dark green
            '#17A2B8', // Info blue
            '#28A745'  // Success green
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
      </div>
      
      {/* Metrics summary */}
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Total Income" 
            value={formatCurrency(parseFloat(data.total_income))}
            subtitle="Current month"
            icon="chart-line"
            color="#007C75"
            valueClassName={parseFloat(data.total_income) > 1000000 ? 'smaller-value' : ''}
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Custody Fees" 
            value={formatCurrency(data.income_by_category ? parseFloat(data.income_by_category[0]?.amount || 0) : 0)}
            subtitle="Main income source"
            icon="money-bill-wave"
            color="#28A745"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Transaction Fees" 
            value={formatCurrency(data.income_by_category ? parseFloat(data.income_by_category[1]?.amount || 0) : 0)}
            subtitle="Trading services"
            icon="exchange-alt"
            color="#17A2B8"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Asset Servicing" 
            value={formatCurrency(data.income_by_category ? parseFloat(data.income_by_category[2]?.amount || 0) : 0)}
            subtitle="Corporate actions etc."
            icon="file-invoice-dollar"
            color="#FFC107"
            valueClassName={parseFloat(data.income_by_category ? data.income_by_category[2]?.amount || 0 : 0) > 1000000 ? 'smaller-value' : ''}
          />
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="row g-3 mb-4 equal-height">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h2>Income History</h2>
                  <div className="date-range-selector">
                    <button className={dateRange === '3m' ? 'active' : ''} onClick={() => setDateRange('3m')}>3 Months</button>
                    <button className={dateRange === '6m' ? 'active' : ''} onClick={() => setDateRange('6m')}>6 Months</button>
                    <button className={dateRange === '12m' ? 'active' : ''} onClick={() => setDateRange('12m')}>12 Months</button>
                    <button className={dateRange === 'all' ? 'active' : ''} onClick={() => setDateRange('all')}>All</button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {data.monthly_history && (
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
          
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h2>Income by Service</h2>
              </div>
              <div className="card-body">
                {data.income_by_category && (
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
                              const category = data.income_by_category[context.dataIndex];
                              return `${category.category}: ${formatCurrency(parseFloat(category.amount))} (${formatPercentage(parseFloat(category.percentage)/100)})`;
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
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h2>Monthly Income Trend ({new Date().getFullYear()})</h2>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Total Income</th>
                        <th>Custody Fees</th>
                        <th>Transaction Fees</th>
                        <th>Asset Servicing</th>
                        <th>Securities Lending</th>
                        <th>Other Services</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.monthly_history && data.monthly_history.map((item, index) => (
                        <tr key={index}>
                          <td>{formatDate(item.date, 'short')}</td>
                          <td className="text-end">{formatCurrency(parseFloat(item.amount))}</td>
                          <td className="text-end">{formatCurrency(parseFloat(item.amount) * 0.45)}</td>
                          <td className="text-end">{formatCurrency(parseFloat(item.amount) * 0.25)}</td>
                          <td className="text-end">{formatCurrency(parseFloat(item.amount) * 0.15)}</td>
                          <td className="text-end">{formatCurrency(parseFloat(item.amount) * 0.10)}</td>
                          <td className="text-end">{formatCurrency(parseFloat(item.amount) * 0.05)}</td>
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