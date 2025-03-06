import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import Chart from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import { formatDate, getStatusColor } from '../utils';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('recent'); // Default to recent reports
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const reportsData = await fetchData('reports');
        setData(reportsData);
        console.log('Reports data loaded:', reportsData);
      } catch (err) {
        console.error('Error loading reports data:', err);
        setError('Failed to load reports data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const prepareReportCategoriesChartData = () => {
    if (!data || !data.report_categories) return null;
    
    return {
      labels: data.report_categories.map(category => category.category),
      datasets: [
        {
          data: data.report_categories.map(category => category.count),
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
        <p>Loading reports data...</p>
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
        <p>No reports data available.</p>
      </div>
    );
  }

  return (
    <div className="reports-dashboard">
      <div className="dashboard-header">
        <h1>Reports Dashboard</h1>
        <div className="reports-search">
          <input type="text" placeholder="Search reports..." />
          <button><i className="fas fa-search"></i></button>
        </div>
      </div>
      
      <div className="metrics-cards">
        <div className="metric-card">
          <div className="metric-icon"><i className="fas fa-file-alt"></i></div>
          <div className="metric-content">
            <h3>Available Reports</h3>
            <div className="metric-value">{data.available_reports}</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon"><i className="fas fa-calendar-check"></i></div>
          <div className="metric-content">
            <h3>Generated (MTD)</h3>
            <div className="metric-value">{data.generated_reports_mtd}</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon"><i className="fas fa-clock"></i></div>
          <div className="metric-content">
            <h3>Scheduled Reports</h3>
            <div className="metric-value">{data.scheduled_reports}</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon"><i className="fas fa-star"></i></div>
          <div className="metric-content">
            <h3>Favorite Reports</h3>
            <div className="metric-value">{data.favorite_reports}</div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="row">
          <div className="col-4">
            <div className="card mb-4">
              <div className="card-header">
                <h2>Report Categories</h2>
              </div>
              <div className="card-body">
                {data.report_categories && (
                  <Pie 
                    data={prepareReportCategoriesChartData()}
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
                )}
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="card-body">
                <div className="quick-actions">
                  <button className="action-button">
                    <i className="fas fa-plus-circle"></i>
                    Generate New Report
                  </button>
                  <button className="action-button">
                    <i className="fas fa-clock"></i>
                    Schedule Report
                  </button>
                  <button className="action-button">
                    <i className="fas fa-download"></i>
                    Download Report
                  </button>
                  <button className="action-button">
                    <i className="fas fa-envelope"></i>
                    Email Report
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-8">
            <div className="card mb-4">
              <div className="card-header report-tabs">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeTab === 'recent' ? 'active' : ''}`}
                      onClick={() => setActiveTab('recent')}
                    >
                      Recent Reports
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeTab === 'scheduled' ? 'active' : ''}`}
                      onClick={() => setActiveTab('scheduled')}
                    >
                      Scheduled Reports
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
                      onClick={() => setActiveTab('favorites')}
                    >
                      Favorites
                    </a>
                  </li>
                </ul>
              </div>
              <div className="card-body p-0">
                {activeTab === 'recent' && (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Report ID</th>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Generated Date</th>
                          <th>Generated By</th>
                          <th>Format</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recent_reports.map(report => (
                          <tr key={report.report_id}>
                            <td>{report.report_id}</td>
                            <td>{report.name}</td>
                            <td>{report.category}</td>
                            <td>{formatDate(report.generated_date, 'datetime')}</td>
                            <td>{report.generated_by}</td>
                            <td>{report.format}</td>
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
                                <button className="action-icon" title="Download">
                                  <i className="fas fa-download"></i>
                                </button>
                                <button className="action-icon" title="Email">
                                  <i className="fas fa-envelope"></i>
                                </button>
                                <button className="action-icon" title="Star">
                                  <i className="far fa-star"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {activeTab === 'scheduled' && (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Schedule ID</th>
                          <th>Report Name</th>
                          <th>Frequency</th>
                          <th>Next Run</th>
                          <th>Recipients</th>
                          <th>Format</th>
                          <th>Created By</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.scheduled_reports.map(schedule => (
                          <tr key={schedule.schedule_id}>
                            <td>{schedule.schedule_id}</td>
                            <td>{schedule.report_name}</td>
                            <td>{schedule.frequency}</td>
                            <td>{formatDate(schedule.next_run, 'datetime')}</td>
                            <td>{schedule.recipients}</td>
                            <td>{schedule.format}</td>
                            <td>{schedule.created_by}</td>
                            <td>
                              <div className="action-buttons">
                                <button className="action-icon" title="Edit">
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="action-icon" title="Delete">
                                  <i className="fas fa-trash"></i>
                                </button>
                                <button className="action-icon" title="Run Now">
                                  <i className="fas fa-play"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {activeTab === 'favorites' && (
                  <div className="no-favorites">
                    <div className="empty-state">
                      <i className="fas fa-star empty-icon"></i>
                      <p>No favorite reports yet.</p>
                      <p>Star a report to add it to your favorites.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;