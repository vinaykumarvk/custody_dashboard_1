import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils';
import { fetchData } from '../services/api';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [data, setData] = useState({
    user: {
      id: '',
      name: '',
      email: '',
      role: '',
      department: '',
      last_login: '',
      avatar: ''
    },
    preferences: {
      theme: 'light',
      notifications: true,
      email_alerts: true,
      default_dashboard: 'dashboard',
      language: 'en',
      data_retention: '90'
    },
    security: {
      two_factor_enabled: false,
      password_last_changed: '',
      login_history: [],
      active_sessions: []
    },
    users: [],
    permission_groups: [],
    api_keys: [],
    integrations: [],
    audit_logs: []
  });
  
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const settingsData = await fetchData('settings');
        setData(settingsData);
        setFormData({
          ...settingsData.user,
          ...settingsData.preferences
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading settings data:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSaveProfile = () => {
    // In a real application, this would send data to the server
    setData({
      ...data,
      user: {
        ...data.user,
        name: formData.name,
        email: formData.email,
        department: formData.department
      }
    });
    setEditMode(false);
  };
  
  const handleSavePreferences = () => {
    // In a real application, this would send data to the server
    setData({
      ...data,
      preferences: {
        ...data.preferences,
        theme: formData.theme,
        notifications: formData.notifications,
        email_alerts: formData.email_alerts,
        default_dashboard: formData.default_dashboard,
        language: formData.language,
        data_retention: formData.data_retention
      }
    });
    setEditMode(false);
  };
  
  const renderTabContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfile();
      case 'preferences':
        return renderPreferences();
      case 'security':
        return renderSecurity();
      case 'users':
        return renderUsers();
      case 'permissions':
        return renderPermissions();
      case 'api':
        return renderAPI();
      case 'integrations':
        return renderIntegrations();
      case 'audit':
        return renderAudit();
      default:
        return renderProfile();
    }
  };
  
  const renderProfile = () => {
    return (
      <div className="settings-section">
        <div className="section-header">
          <h2>User Profile</h2>
          <button 
            className="btn-primary" 
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        <div className="profile-container">
          <div className="profile-avatar">
            <img 
              src={data.user.avatar || 'https://via.placeholder.com/150'} 
              alt="User Avatar" 
            />
            {editMode && (
              <button className="btn-change-avatar">
                <i className="fas fa-camera"></i> Change
              </button>
            )}
          </div>
          
          <div className="profile-details">
            {editMode ? (
              <form className="edit-form">
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name || ''} 
                    onChange={handleInputChange} 
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email || ''} 
                    onChange={handleInputChange} 
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label>Department</label>
                  <input 
                    type="text" 
                    name="department" 
                    value={formData.department || ''} 
                    onChange={handleInputChange} 
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label>Role</label>
                  <input 
                    type="text" 
                    name="role" 
                    value={data.user.role} 
                    disabled 
                    className="form-control"
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-primary" 
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{data.user.name}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{data.user.email}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">Role:</span>
                  <span className="info-value">{data.user.role}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">Department:</span>
                  <span className="info-value">{data.user.department}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">Last Login:</span>
                  <span className="info-value">{formatDate(data.user.last_login)}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">User ID:</span>
                  <span className="info-value">{data.user.id}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const renderPreferences = () => {
    return (
      <div className="settings-section">
        <div className="section-header">
          <h2>User Preferences</h2>
          <button 
            className="btn-primary" 
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Cancel' : 'Edit Preferences'}
          </button>
        </div>
        
        {editMode ? (
          <form className="edit-form preferences-form">
            <div className="form-group">
              <label>Theme</label>
              <select 
                name="theme" 
                value={formData.theme || data.preferences.theme} 
                onChange={handleInputChange} 
                className="form-control"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Default Dashboard</label>
              <select 
                name="default_dashboard" 
                value={formData.default_dashboard || data.preferences.default_dashboard} 
                onChange={handleInputChange} 
                className="form-control"
              >
                <option value="dashboard">Main Dashboard</option>
                <option value="trades">Trades</option>
                <option value="settlements">Settlements</option>
                <option value="corporate-actions">Corporate Actions</option>
                <option value="customers">Customers</option>
                <option value="income">Income</option>
                <option value="reports">Reports</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Language</label>
              <select 
                name="language" 
                value={formData.language || data.preferences.language} 
                onChange={handleInputChange} 
                className="form-control"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="es">Spanish</option>
                <option value="jp">Japanese</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Data Retention Period (days)</label>
              <select 
                name="data_retention" 
                value={formData.data_retention || data.preferences.data_retention} 
                onChange={handleInputChange} 
                className="form-control"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">365 days</option>
              </select>
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  name="notifications" 
                  checked={formData.notifications || data.preferences.notifications} 
                  onChange={handleInputChange} 
                />
                Enable In-App Notifications
              </label>
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  name="email_alerts" 
                  checked={formData.email_alerts || data.preferences.email_alerts} 
                  onChange={handleInputChange} 
                />
                Enable Email Alerts
              </label>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleSavePreferences}
              >
                Save Preferences
              </button>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="preferences-info">
            <div className="info-card">
              <div className="info-card-header">
                <i className="fas fa-palette"></i>
                <h3>Display</h3>
              </div>
              <div className="info-card-body">
                <div className="info-item">
                  <span className="info-label">Theme:</span>
                  <span className="info-value">
                    {data.preferences.theme === 'light' ? 'Light' : 
                     data.preferences.theme === 'dark' ? 'Dark' : 'System Default'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Default Dashboard:</span>
                  <span className="info-value">
                    {data.preferences.default_dashboard === 'dashboard' ? 'Main Dashboard' :
                     data.preferences.default_dashboard.charAt(0).toUpperCase() + 
                     data.preferences.default_dashboard.slice(1)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Language:</span>
                  <span className="info-value">
                    {data.preferences.language === 'en' ? 'English' :
                     data.preferences.language === 'fr' ? 'French' :
                     data.preferences.language === 'de' ? 'German' :
                     data.preferences.language === 'es' ? 'Spanish' :
                     data.preferences.language === 'jp' ? 'Japanese' : 'English'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-card-header">
                <i className="fas fa-bell"></i>
                <h3>Notifications</h3>
              </div>
              <div className="info-card-body">
                <div className="info-item">
                  <span className="info-label">In-App Notifications:</span>
                  <span className="info-value">
                    {data.preferences.notifications ? 
                      <i className="fas fa-check-circle text-success"></i> : 
                      <i className="fas fa-times-circle text-danger"></i>
                    }
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email Alerts:</span>
                  <span className="info-value">
                    {data.preferences.email_alerts ? 
                      <i className="fas fa-check-circle text-success"></i> : 
                      <i className="fas fa-times-circle text-danger"></i>
                    }
                  </span>
                </div>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-card-header">
                <i className="fas fa-database"></i>
                <h3>Data</h3>
              </div>
              <div className="info-card-body">
                <div className="info-item">
                  <span className="info-label">Data Retention Period:</span>
                  <span className="info-value">{data.preferences.data_retention} days</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderSecurity = () => {
    return (
      <div className="settings-section">
        <div className="section-header">
          <h2>Security & Privacy</h2>
        </div>
        
        <div className="security-container">
          <div className="info-card">
            <div className="info-card-header">
              <i className="fas fa-lock"></i>
              <h3>Account Security</h3>
            </div>
            <div className="info-card-body">
              <div className="info-item">
                <span className="info-label">Two-Factor Authentication:</span>
                <span className="info-value">
                  {data.security.two_factor_enabled ? 
                    <span className="text-success">Enabled</span> : 
                    <span className="text-danger">Disabled</span>
                  }
                </span>
                <button className="btn-link">
                  {data.security.two_factor_enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
              
              <div className="info-item">
                <span className="info-label">Password Last Changed:</span>
                <span className="info-value">
                  {formatDate(data.security.password_last_changed)}
                </span>
                <button className="btn-link">Change Password</button>
              </div>
            </div>
          </div>
          
          <div className="login-history-container">
            <h3>Login History</h3>
            <div className="table-responsive">
              <table className="table table-striped security-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>IP Address</th>
                    <th>Device</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.security.login_history.map((login, index) => (
                    <tr key={index}>
                      <td>{formatDate(login.timestamp, 'long')}</td>
                      <td>{login.ip_address}</td>
                      <td>{login.device}</td>
                      <td>{login.location}</td>
                      <td>
                        <span className={`status ${login.status === 'Success' ? 'success' : 'failed'}`}>
                          {login.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="active-sessions-container">
            <h3>Active Sessions</h3>
            <div className="sessions-list">
              {data.security.active_sessions.map((session, index) => (
                <div className="session-item" key={index}>
                  <div className="session-info">
                    <div className="device-icon">
                      <i className={`fas ${
                        session.device_type === 'mobile' ? 'fa-mobile-alt' :
                        session.device_type === 'tablet' ? 'fa-tablet-alt' : 'fa-desktop'
                      }`}></i>
                    </div>
                    <div className="session-details">
                      <div className="session-device">{session.device}</div>
                      <div className="session-meta">
                        {session.location} • {formatDate(session.last_active, 'relative')}
                      </div>
                    </div>
                  </div>
                  {session.current ? (
                    <span className="current-session">Current Session</span>
                  ) : (
                    <button className="btn-terminate">Terminate</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderUsers = () => {
    return (
      <div className="settings-section">
        <div className="section-header">
          <h2>User Management</h2>
          <button className="btn-primary">Add User</button>
        </div>
        
        <div className="users-container">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <img 
                          src={user.avatar || 'https://via.placeholder.com/36'} 
                          alt={user.name} 
                          className="user-avatar-small" 
                        />
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.department}</td>
                    <td>
                      <span className={`status-pill ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{formatDate(user.last_active, 'relative')}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn" title="Reset Password">
                          <i className="fas fa-key"></i>
                        </button>
                        {user.status === 'Active' ? (
                          <button className="action-btn" title="Deactivate">
                            <i className="fas fa-user-slash"></i>
                          </button>
                        ) : (
                          <button className="action-btn" title="Activate">
                            <i className="fas fa-user-check"></i>
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
    );
  };
  
  const renderPermissions = () => {
    return (
      <div className="settings-section">
        <div className="section-header">
          <h2>Permissions & Access Control</h2>
          <button className="btn-primary">Create Role</button>
        </div>
        
        <div className="permissions-container">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Description</th>
                  <th>Users</th>
                  <th>Last Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.permission_groups.map(group => (
                  <tr key={group.id}>
                    <td>{group.name}</td>
                    <td>{group.description}</td>
                    <td>{group.user_count}</td>
                    <td>{formatDate(group.last_modified)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn" title="Duplicate">
                          <i className="fas fa-copy"></i>
                        </button>
                        <button className="action-btn" title="Delete">
                          <i className="fas fa-trash-alt"></i>
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
    );
  };
  
  const renderAPI = () => {
    return (
      <div className="settings-section">
        <div className="section-header">
          <h2>API Keys</h2>
          <button className="btn-primary">Generate New Key</button>
        </div>
        
        <div className="api-keys-container">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>API Key Name</th>
                  <th>Created By</th>
                  <th>Created Date</th>
                  <th>Last Used</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.api_keys.map(key => (
                  <tr key={key.id}>
                    <td>{key.name}</td>
                    <td>{key.created_by}</td>
                    <td>{formatDate(key.created_date)}</td>
                    <td>{formatDate(key.last_used)}</td>
                    <td>
                      <span className={`status-pill ${key.status.toLowerCase()}`}>
                        {key.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" title="Regenerate">
                          <i className="fas fa-sync-alt"></i>
                        </button>
                        {key.status === 'Active' ? (
                          <button className="action-btn" title="Deactivate">
                            <i className="fas fa-ban"></i>
                          </button>
                        ) : (
                          <button className="action-btn" title="Activate">
                            <i className="fas fa-check-circle"></i>
                          </button>
                        )}
                        <button className="action-btn" title="Delete">
                          <i className="fas fa-trash-alt"></i>
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
    );
  };
  
  const renderIntegrations = () => {
    return (
      <div className="settings-section">
        <div className="section-header">
          <h2>Integrations</h2>
          <button className="btn-primary">Connect New</button>
        </div>
        
        <div className="integrations-container">
          <div className="integrations-list">
            {data.integrations.map(integration => (
              <div className="integration-card" key={integration.id}>
                <div className="integration-header">
                  <img 
                    src={integration.logo || 'https://via.placeholder.com/40'} 
                    alt={integration.name} 
                    className="integration-logo"
                  />
                  <h3>{integration.name}</h3>
                  <div className={`integration-status ${integration.status.toLowerCase()}`}>
                    {integration.status}
                  </div>
                </div>
                <div className="integration-body">
                  <p>{integration.description}</p>
                  <div className="integration-meta">
                    <span>Connected: {formatDate(integration.connected_date)}</span>
                    <span>Last Sync: {formatDate(integration.last_sync)}</span>
                  </div>
                </div>
                <div className="integration-footer">
                  <button className="btn-secondary">Configure</button>
                  {integration.status === 'Active' ? (
                    <button className="btn-outline">Disconnect</button>
                  ) : (
                    <button className="btn-outline">Reconnect</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const renderAudit = () => {
    return (
      <div className="settings-section">
        <div className="section-header">
          <h2>Audit Logs</h2>
          <div className="audit-filters">
            <select className="form-control">
              <option value="all">All Events</option>
              <option value="login">Login Events</option>
              <option value="data">Data Modifications</option>
              <option value="settings">Settings Changes</option>
              <option value="api">API Usage</option>
            </select>
            <input 
              type="date" 
              className="form-control" 
              defaultValue={new Date().toISOString().split('T')[0]} 
            />
          </div>
        </div>
        
        <div className="audit-logs-container">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Event Type</th>
                  <th>Description</th>
                  <th>IP Address</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {data.audit_logs.map((log, index) => (
                  <tr key={index}>
                    <td>{formatDate(log.timestamp, 'long')}</td>
                    <td>{log.user}</td>
                    <td>
                      <span className={`event-type ${log.event_type.toLowerCase()}`}>
                        {log.event_type}
                      </span>
                    </td>
                    <td>{log.description}</td>
                    <td>{log.ip_address}</td>
                    <td>
                      <button className="btn-link">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return <div className="loading">Loading Settings...</div>;
  }
  
  return (
    <div className="page-container settings-dashboard">
      <div className="page-header">
        <h1>Settings</h1>
      </div>
      
      <div className="settings-container">
        <div className="settings-sidebar">
          <ul className="settings-nav">
            <li 
              className={activeSection === 'profile' ? 'active' : ''} 
              onClick={() => setActiveSection('profile')}
            >
              <i className="fas fa-user"></i>
              <span>User Profile</span>
            </li>
            <li 
              className={activeSection === 'preferences' ? 'active' : ''} 
              onClick={() => setActiveSection('preferences')}
            >
              <i className="fas fa-sliders-h"></i>
              <span>Preferences</span>
            </li>
            <li 
              className={activeSection === 'security' ? 'active' : ''} 
              onClick={() => setActiveSection('security')}
            >
              <i className="fas fa-shield-alt"></i>
              <span>Security & Privacy</span>
            </li>
            <li 
              className={activeSection === 'users' ? 'active' : ''} 
              onClick={() => setActiveSection('users')}
            >
              <i className="fas fa-users"></i>
              <span>User Management</span>
            </li>
            <li 
              className={activeSection === 'permissions' ? 'active' : ''} 
              onClick={() => setActiveSection('permissions')}
            >
              <i className="fas fa-user-lock"></i>
              <span>Permissions</span>
            </li>
            <li 
              className={activeSection === 'api' ? 'active' : ''} 
              onClick={() => setActiveSection('api')}
            >
              <i className="fas fa-key"></i>
              <span>API Keys</span>
            </li>
            <li 
              className={activeSection === 'integrations' ? 'active' : ''} 
              onClick={() => setActiveSection('integrations')}
            >
              <i className="fas fa-plug"></i>
              <span>Integrations</span>
            </li>
            <li 
              className={activeSection === 'audit' ? 'active' : ''} 
              onClick={() => setActiveSection('audit')}
            >
              <i className="fas fa-history"></i>
              <span>Audit Logs</span>
            </li>
          </ul>
        </div>
        
        <div className="settings-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;