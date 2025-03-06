import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { formatNumber, formatCurrency, formatPercentage, formatDate, getStatusColor } from '../utils';
import { fetchData } from '../services/api';

const Reports = () => {
  const [data, setData] = useState({
    total_reports: 0,
    scheduled_reports: 0,
    reports_this_month: 0,
    reports_viewed: 0,
    report_categories: [],
    report_usage: [],
    recent_reports: [],
    reports_by_type: [],
    favorite_reports: []
  });
  
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('3m');
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const reportData = await fetchData('reports');
        setData(reportData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading reports data:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Chart data preparation functions
  const prepareReportUsageChartData = () => {
    if (!data.report_usage) return null;
    
    const labels = data.report_usage.map(item => formatDate(item.date, 'short'));
    const generatedData = data.report_usage.map(item => item.generated);
    const viewedData = data.report_usage.map(item => item.viewed);
    
    return {
      labels,
      datasets: [
        {
          label: 'Generated',
          data: generatedData,
          borderColor: '#2E7D32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Viewed',
          data: viewedData,
          borderColor: '#1976D2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }
      ]
    };
  };
  
  const prepareReportsByTypeChartData = () => {
    if (!data.reports_by_type) return null;
    
    const labels = data.reports_by_type.map(item => item.type);
    const counts = data.reports_by_type.map(item => item.count);
    
    return {
      labels,
      datasets: [
        {
          data: counts,
          backgroundColor: [
            '#2E7D32',
            '#1976D2',
            '#7B1FA2',
            '#FFB300',
            '#C2185B',
            '#0097A7'
          ],
          borderWidth: 1
        }
      ]
    };
  };
  
  const prepareReportCategoriesChartData = () => {
    if (!data.report_categories) return null;
    
    const labels = data.report_categories.map(item => item.category);
    const counts = data.report_categories.map(item => item.count);
    
    return {
      labels,
      datasets: [
        {
          label: 'Reports by Category',
          data: counts,
          backgroundColor: 'rgba(46, 125, 50, 0.8)',
          borderColor: '#2E7D32',
          borderWidth: 1
        }
      ]
    };
  };
  
  const getReportsByTab = () => {
    if (!data.recent_reports) return [];
    
    switch (activeTab) {
      case 'favorites':
        return data.favorite_reports || [];
      case 'scheduled':
        return data.recent_reports.filter(report => report.scheduled);
      case 'regulatory':
        return data.recent_reports.filter(report => report.type === 'Regulatory');
      case 'all':
      default:
        return data.recent_reports;
    }
  };
  
  if (loading) {
    return <div className="loading">Loading Reports Data...</div>;
  }
  
  return (
    <div className="page-container reports-dashboard">
      <div className="page-header">
        <h1>Reports Dashboard</h1>
        <div className="date-range-selector">
          <button className={dateRange === '1m' ? 'active' : ''} onClick={() => setDateRange('1m')}>1M</button>
          <button className={dateRange === '3m' ? 'active' : ''} onClick={() => setDateRange('3m')}>3M</button>
          <button className={dateRange === '6m' ? 'active' : ''} onClick={() => setDateRange('6m')}>6M</button>
          <button className={dateRange === '1y' ? 'active' : ''} onClick={() => setDateRange('1y')}>1Y</button>
          <button className={dateRange === 'all' ? 'active' : ''} onClick={() => setDateRange('all')}>All</button>
        </div>
      </div>
      
      <div className="metrics-summary">
        <div className="row">
          <div className="col-md-3">
            <div className="summary-card">
              <div className="card-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="card-info">
                <h2>{formatNumber(data.total_reports)}</h2>
                <p>Total Reports</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="summary-card">
              <div className="card-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="card-info">
                <h2>{formatNumber(data.scheduled_reports)}</h2>
                <p>Scheduled Reports</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="summary-card">
              <div className="card-icon">
                <i className="fas fa-file-export"></i>
              </div>
              <div className="card-info">
                <h2>{formatNumber(data.reports_this_month)}</h2>
                <p>Reports This Month</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="summary-card">
              <div className="card-icon">
                <i className="fas fa-eye"></i>
              </div>
              <div className="card-info">
                <h2>{formatNumber(data.reports_viewed)}</h2>
                <p>Reports Viewed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="row">
          <div className="col-8">
            <div className="card mb-4">
              <div className="card-header">
                <h2>Report Usage Trends</h2>
              </div>
              <div className="card-body">
                {data.report_usage && (
                  <Line 
                    data={prepareReportUsageChartData()} 
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
                <h2>Reports by Type</h2>
              </div>
              <div className="card-body">
                {data.reports_by_type && (
                  <Pie 
                    data={prepareReportsByTypeChartData()}
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
                              const reportType = data.reports_by_type[context.dataIndex];
                              return `${reportType.type}: ${formatNumber(reportType.count)} (${formatPercentage(reportType.percentage)})`;
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
                <h2>Report Categories</h2>
              </div>
              <div className="card-body">
                {data.report_categories && (
                  <Bar 
                    data={prepareReportCategoriesChartData()}
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
              <div className="card-header reports-table-header">
                <h2>Reports</h2>
                <div className="report-tabs">
                  <button 
                    className={activeTab === 'all' ? 'active' : ''} 
                    onClick={() => setActiveTab('all')}
                  >
                    All Reports
                  </button>
                  <button 
                    className={activeTab === 'favorites' ? 'active' : ''} 
                    onClick={() => setActiveTab('favorites')}
                  >
                    Favorites
                  </button>
                  <button 
                    className={activeTab === 'scheduled' ? 'active' : ''} 
                    onClick={() => setActiveTab('scheduled')}
                  >
                    Scheduled
                  </button>
                  <button 
                    className={activeTab === 'regulatory' ? 'active' : ''} 
                    onClick={() => setActiveTab('regulatory')}
                  >
                    Regulatory
                  </button>
                </div>
                <button className="btn-view-all">Create Report</button>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Report Name</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Last Generated</th>
                        <th>Format</th>
                        <th>Scheduled</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getReportsByTab().map(report => (
                        <tr key={report.id}>
                          <td>
                            <div className="report-name">
                              {report.favorite && <i className="fas fa-star favorite-icon"></i>}
                              {report.name}
                            </div>
                          </td>
                          <td>{report.type}</td>
                          <td>{report.category}</td>
                          <td>{formatDate(report.last_generated, 'short')}</td>
                          <td>{report.format}</td>
                          <td>
                            {report.scheduled ? (
                              <span className="scheduled">
                                <i className="fas fa-calendar-check"></i> {report.schedule_frequency}
                              </span>
                            ) : (
                              <span className="not-scheduled">-</span>
                            )}
                          </td>
                          <td>
                            <span 
                              className="status-indicator" 
                              style={{ backgroundColor: getStatusColor(report.status) }}
                            >
                              {report.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="action-btn" title="Download">
                                <i className="fas fa-download"></i>
                              </button>
                              <button className="action-btn" title="Share">
                                <i className="fas fa-share-alt"></i>
                              </button>
                              <button className="action-btn" title="Configure">
                                <i className="fas fa-cog"></i>
                              </button>
                            </div>
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

export default Reports;