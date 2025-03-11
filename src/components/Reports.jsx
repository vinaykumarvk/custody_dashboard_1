import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import { formatDate, getStatusColor, formatNumber } from '../utils';
import MetricCard from './MetricCard';

const Reports = () => {
  // State management
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportCategory, setReportCategory] = useState('all');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [reportListView, setReportListView] = useState('grid'); // 'grid' or 'list'

  // Report generation modal
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  
  // Data fetching
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

  // Filter reports based on search term and category
  const filteredReports = data?.available_report_list?.filter(report => {
    const matchesSearch = searchTerm === '' || 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = reportCategory === 'all' || report.category === reportCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  // Modal handlers
  const openGenerateModal = (report) => {
    setSelectedReport(report);
    setShowGenerateModal(true);
  };
  
  const closeGenerateModal = () => {
    setShowGenerateModal(false);
  };
  
  const generateReport = () => {
    alert(`Generating ${selectedReport.name} report with date range: ${dateRange.startDate} to ${dateRange.endDate}`);
    closeGenerateModal();
  };
  
  // Email report handler
  const emailReport = (report) => {
    alert(`Email modal for ${report.name} would open here`);
  };
  
  // Download report handler
  const downloadReport = (report) => {
    alert(`Downloading ${report.name} in ${report.available_formats[0]}`);
  };
  
  // Schedule report handler
  const scheduleReport = (report) => {
    alert(`Schedule modal for ${report.name} would open here`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading reports data...</p>
      </div>
    );
  }

  // Error state
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

  // No data state
  if (!data) {
    return (
      <div className="no-data-container">
        <p>No reports data available.</p>
      </div>
    );
  }

  return (
    <div className="reports-dashboard">
      {/* Header with search */}
      <div className="dashboard-header">
        <h1>Reports</h1>
        <div className="reports-search">
          <input 
            type="text" 
            placeholder="Search reports..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
      
      {/* Metrics summary row */}
      <div className="row mb-4">
        <div className="col-md-3">
          <MetricCard 
            title="Available Reports" 
            value={formatNumber(data.available_reports)}
            subtitle="Total reports available"
            icon="file-alt"
            color="#007C75"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Generated Reports" 
            value={formatNumber(data.generated_reports_mtd)}
            subtitle="Month to date"
            icon="calendar-check"
            color="#28A745"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Scheduled Reports" 
            value={formatNumber(Array.isArray(data.scheduled_reports) ? data.scheduled_reports.length : data.scheduled_reports)}
            subtitle="Automated reports"
            icon="clock"
            color="#17A2B8"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            title="Favorite Reports" 
            value={formatNumber(data.favorite_reports)}
            subtitle="Your starred reports"
            icon="star"
            color="#FFC107"
          />
        </div>
      </div>
      
      {/* Main content */}
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h2>Available Reports</h2>
            <div className="report-filters d-flex">
              {/* Category filter */}
              <select 
                className="form-control me-2" 
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {data.report_categories.map(category => (
                  <option key={category.category} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
              
              {/* View toggle */}
              <div className="btn-group">
                <button 
                  className={`btn ${reportListView === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setReportListView('grid')}
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button 
                  className={`btn ${reportListView === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setReportListView('list')}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          {filteredReports.length === 0 ? (
            <div className="no-reports text-center py-5">
              <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
              <h3>No reports match your criteria</h3>
              <p>Try adjusting your search or filter settings.</p>
            </div>
          ) : reportListView === 'grid' ? (
            /* Grid view */
            <div className="row">
              {filteredReports.map(report => (
                <div key={report.id} className="col-md-4 mb-4">
                  <div className="report-card card h-100">
                    <div className="card-body">
                      <div>
                        <h3 className="card-title">{report.name}</h3>
                      </div>
                      <p className="card-text">{report.description}</p>
                      <div className="report-meta">
                        <div><i className="fas fa-file-export"></i> Formats: {report.available_formats.join(', ')}</div>
                        <div><i className="fas fa-clock"></i> Last Generated: {report.last_generated ? formatDate(report.last_generated, 'date') : 'Never'}</div>
                      </div>
                    </div>
                    <div className="card-footer d-flex justify-content-between">
                      <button className="btn btn-sm btn-primary" onClick={() => openGenerateModal(report)}>
                        <i className="fas fa-plus-circle"></i> Generate
                      </button>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => scheduleReport(report)}>
                          <i className="fas fa-clock"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => downloadReport(report)}>
                          <i className="fas fa-download"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => emailReport(report)}>
                          <i className="fas fa-envelope"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List view */
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Formats</th>
                    <th>Last Generated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map(report => (
                    <tr key={report.id}>
                      <td>{report.name}</td>
                      <td>{report.category}</td>
                      <td>{report.description}</td>
                      <td>{report.available_formats.join(', ')}</td>
                      <td>{report.last_generated ? formatDate(report.last_generated, 'date') : 'Never'}</td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-primary" onClick={() => openGenerateModal(report)}>
                            <i className="fas fa-plus-circle"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => scheduleReport(report)}>
                            <i className="fas fa-clock"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => downloadReport(report)}>
                            <i className="fas fa-download"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => emailReport(report)}>
                            <i className="fas fa-envelope"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Generated Reports section */}
      <div className="card mt-4">
        <div className="card-header">
          <h2>Recent Reports</h2>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Generated Date</th>
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
                    <td>{report.format}</td>
                    <td>{report.status}</td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-success">
                          <i className="fas fa-download"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-info">
                          <i className="fas fa-envelope"></i>
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
      
      {/* Generate Report Modal */}
      {showGenerateModal && selectedReport && (
        <div className="modal" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Generate {selectedReport.name}</h5>
                <button type="button" className="btn-close" onClick={closeGenerateModal}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Date Range</label>
                    <div className="input-group">
                      <span className="input-group-text">From</span>
                      <input 
                        type="date" 
                        className="form-control"
                        value={dateRange.startDate}
                        onChange={e => setDateRange({...dateRange, startDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text">To</span>
                      <input 
                        type="date" 
                        className="form-control"
                        value={dateRange.endDate}
                        onChange={e => setDateRange({...dateRange, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Format</label>
                    <select className="form-control">
                      {selectedReport.available_formats.map(format => (
                        <option key={format} value={format}>{format.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Delivery</label>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="downloadReport" defaultChecked />
                      <label className="form-check-label" htmlFor="downloadReport">Download report</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="emailReport" />
                      <label className="form-check-label" htmlFor="emailReport">Email report</label>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeGenerateModal}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={generateReport}>Generate Report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;