import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import { formatDate } from '../utils';

const Settings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('user'); // Default to user preferences
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const settingsData = await fetchData('settings');
        setData(settingsData);
        console.log('Settings data loaded:', settingsData);
      } catch (err) {
        console.error('Error loading settings data:', err);
        setError('Failed to load settings data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading settings data...</p>
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
        <p>No settings data available.</p>
      </div>
    );
  }

  return (
    <div className="settings-dashboard">
      <div className="dashboard-header">
        <h1>Settings</h1>
      </div>
      
      <div className="dashboard-content">
        <div className="row">
          <div className="col-3">
            <div className="card mb-4">
              <div className="card-header">
                <h2>Navigation</h2>
              </div>
              <div className="card-body p-0">
                <div className="settings-nav">
                  <ul>
                    <li className={activeTab === 'user' ? 'active' : ''} onClick={() => setActiveTab('user')}>
                      <i className="fas fa-user-cog"></i> User Preferences
                    </li>
                    <li className={activeTab === 'system' ? 'active' : ''} onClick={() => setActiveTab('system')}>
                      <i className="fas fa-server"></i> System Settings
                    </li>
                    <li className={activeTab === 'roles' ? 'active' : ''} onClick={() => setActiveTab('roles')}>
                      <i className="fas fa-users-cog"></i> User Roles & Permissions
                    </li>
                    <li className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
                      <i className="fas fa-bell"></i> Notification Settings
                    </li>
                    <li className={activeTab === 'appearance' ? 'active' : ''} onClick={() => setActiveTab('appearance')}>
                      <i className="fas fa-palette"></i> Appearance
                    </li>
                    <li className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>
                      <i className="fas fa-shield-alt"></i> Security
                    </li>
                    <li className={activeTab === 'api' ? 'active' : ''} onClick={() => setActiveTab('api')}>
                      <i className="fas fa-plug"></i> API Keys
                    </li>
                    <li className={activeTab === 'audit' ? 'active' : ''} onClick={() => setActiveTab('audit')}>
                      <i className="fas fa-history"></i> Audit Log
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-9">
            {activeTab === 'user' && (
              <div className="card mb-4">
                <div className="card-header">
                  <h2>User Preferences</h2>
                  <button className="btn-save">Save Changes</button>
                </div>
                <div className="card-body">
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Language</label>
                      <select className="form-control" defaultValue={data.user_preferences.language}>
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Japanese">Japanese</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Theme</label>
                      <select className="form-control" defaultValue={data.user_preferences.theme}>
                        <option value="Default">Default</option>
                        <option value="Dark">Dark</option>
                        <option value="Light">Light</option>
                        <option value="High Contrast">High Contrast</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Timezone</label>
                      <select className="form-control" defaultValue={data.user_preferences.timezone}>
                        <option value="UTC-12:00">UTC-12:00</option>
                        <option value="UTC-11:00">UTC-11:00</option>
                        <option value="UTC-10:00">UTC-10:00</option>
                        <option value="UTC-09:00">UTC-09:00</option>
                        <option value="UTC-08:00">UTC-08:00</option>
                        <option value="UTC-07:00">UTC-07:00</option>
                        <option value="UTC-06:00">UTC-06:00</option>
                        <option value="UTC-05:00">UTC-05:00</option>
                        <option value="UTC-04:00">UTC-04:00</option>
                        <option value="UTC-03:00">UTC-03:00</option>
                        <option value="UTC-02:00">UTC-02:00</option>
                        <option value="UTC-01:00">UTC-01:00</option>
                        <option value="UTC+00:00">UTC+00:00</option>
                        <option value="UTC+01:00">UTC+01:00</option>
                        <option value="UTC+02:00">UTC+02:00</option>
                        <option value="UTC+03:00">UTC+03:00</option>
                        <option value="UTC+04:00">UTC+04:00</option>
                        <option value="UTC+05:00">UTC+05:00</option>
                        <option value="UTC+06:00">UTC+06:00</option>
                        <option value="UTC+07:00">UTC+07:00</option>
                        <option value="UTC+08:00">UTC+08:00</option>
                        <option value="UTC+09:00">UTC+09:00</option>
                        <option value="UTC+10:00">UTC+10:00</option>
                        <option value="UTC+11:00">UTC+11:00</option>
                        <option value="UTC+12:00">UTC+12:00</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Dashboard Layout</label>
                      <select className="form-control" defaultValue={data.user_preferences.dashboard_layout}>
                        <option value="Standard">Standard</option>
                        <option value="Compact">Compact</option>
                        <option value="Extended">Extended</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                    
                    <div className="form-group toggle-group">
                      <label>Notifications</label>
                      <div className="toggle-switch">
                        <input 
                          type="checkbox" 
                          id="notifications_enabled" 
                          defaultChecked={data.user_preferences.notifications_enabled}
                        />
                        <label htmlFor="notifications_enabled"></label>
                      </div>
                    </div>
                    
                    <div className="form-group toggle-group">
                      <label>Email Notifications</label>
                      <div className="toggle-switch">
                        <input 
                          type="checkbox" 
                          id="email_notifications" 
                          defaultChecked={data.user_preferences.email_notifications}
                        />
                        <label htmlFor="email_notifications"></label>
                      </div>
                    </div>
                    
                    <div className="form-group toggle-group">
                      <label>SMS Notifications</label>
                      <div className="toggle-switch">
                        <input 
                          type="checkbox" 
                          id="sms_notifications" 
                          defaultChecked={data.user_preferences.sms_notifications}
                        />
                        <label htmlFor="sms_notifications"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'system' && (
              <div className="card mb-4">
                <div className="card-header">
                  <h2>System Settings</h2>
                </div>
                <div className="card-body">
                  <div className="system-info">
                    <div className="info-row">
                      <div className="info-label">System Version:</div>
                      <div className="info-value">{data.system_settings.system_version}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Database Version:</div>
                      <div className="info-value">{data.system_settings.database_version}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">API Version:</div>
                      <div className="info-value">{data.system_settings.api_version}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Last Backup:</div>
                      <div className="info-value">{formatDate(data.system_settings.last_backup, 'datetime')}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Last Update:</div>
                      <div className="info-value">{formatDate(data.system_settings.last_update, 'datetime')}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Maintenance Mode:</div>
                      <div className="info-value toggle-switch">
                        <input 
                          type="checkbox" 
                          id="maintenance_mode" 
                          defaultChecked={data.system_settings.maintenance_mode}
                        />
                        <label htmlFor="maintenance_mode"></label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="action-buttons mt-4">
                    <button className="btn-primary">
                      <i className="fas fa-database"></i> Backup System
                    </button>
                    <button className="btn-secondary">
                      <i className="fas fa-sync"></i> Check for Updates
                    </button>
                    <button className="btn-warning">
                      <i className="fas fa-tools"></i> System Diagnostics
                    </button>
                    <button className="btn-danger">
                      <i className="fas fa-exclamation-triangle"></i> Clear Cache
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'roles' && (
              <div className="card mb-4">
                <div className="card-header">
                  <h2>User Roles & Permissions</h2>
                  <button className="btn-primary">
                    <i className="fas fa-plus"></i> Add New Role
                  </button>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Role Name</th>
                          <th>Users Count</th>
                          <th>Permissions</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.user_roles.map((role, index) => (
                          <tr key={index}>
                            <td>{role.role_name}</td>
                            <td>{role.users_count}</td>
                            <td>{role.permissions}</td>
                            <td>
                              <div className="action-buttons">
                                <button className="action-icon" title="Edit">
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="action-icon" title="Duplicate">
                                  <i className="fas fa-copy"></i>
                                </button>
                                {role.role_name !== 'Administrator' && (
                                  <button className="action-icon" title="Delete">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab !== 'user' && activeTab !== 'system' && activeTab !== 'roles' && (
              <div className="card mb-4">
                <div className="card-header">
                  <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</h2>
                </div>
                <div className="card-body">
                  <div className="settings-placeholder">
                    <i className="fas fa-cog placeholder-icon"></i>
                    <p>This settings section is currently under development.</p>
                    <p>Please check back soon for updates.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;