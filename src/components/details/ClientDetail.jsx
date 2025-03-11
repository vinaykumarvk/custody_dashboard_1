import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientDetailsById } from '../../mock-data/clientsData';
import { formatDate } from '../../utils';

const ClientDetail = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API fetch
    const fetchClientDetail = async () => {
      try {
        // In a real app this would be an API call
        const clientData = getClientDetailsById(clientId);
        if (clientData) {
          setClient(clientData);
        } else {
          console.error('Client not found');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching client details:', error);
        setLoading(false);
      }
    };
    
    fetchClientDetail();
  }, [clientId]);

  const handleApprove = () => {
    // Here you would make an API call to approve the client
    setNotification({
      type: 'success',
      message: 'Client has been approved successfully!'
    });
    
    // Automatically dismiss notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleReject = () => {
    // Here you would make an API call to reject the client
    setNotification({
      type: 'warning',
      message: 'Client has been rejected.'
    });
    
    // Automatically dismiss notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleBack = () => {
    navigate('/clients');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return <div className="loading">Loading client details...</div>;
  }

  if (!client) {
    return (
      <div className="error-container">
        <h2>Client Not Found</h2>
        <p>The requested client could not be found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/clients')}>
          Back to Client List
        </button>
      </div>
    );
  }

  return (
    <div className="client-detail-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-message">{notification.message}</span>
          <button className="notification-close" onClick={() => setNotification(null)}>×</button>
        </div>
      )}
      
      <div className="detail-header">
        <div className="client-title-section">
          <h1>{client.clientName}</h1>
          <div className="client-id">ID: {client.id}</div>
          <div className="client-badges">
            <span className={`badge account-type-${client.accountType.toLowerCase().replace(/\s+/g, '-')}`}>
              {client.accountType}
            </span>
            <span className={`badge priority-${client.priority.toLowerCase()}`}>
              {client.priority} Priority
            </span>
            <span className={`badge status-${client.status.toLowerCase().replace(/\s+/g, '-')}`}>
              {client.status}
            </span>
          </div>
        </div>
        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={handleBack}>
            Back
          </button>
          <button className="btn btn-danger" onClick={handleReject}>
            Reject
          </button>
          <button className="btn btn-success" onClick={handleApprove}>
            Approve
          </button>
        </div>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => switchTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => switchTab('documents')}
        >
          Documents ({client.documents})
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => switchTab('history')}
        >
          Review History
        </button>
      </div>

      <div className="detail-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="detail-section">
              <h3>Company Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Legal Name</span>
                  <span className="detail-value">{client.clientName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Registration Number</span>
                  <span className="detail-value">{client.registrationNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Legal Entity Type</span>
                  <span className="detail-value">{client.legalEntity}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tax ID</span>
                  <span className="detail-value">{client.taxId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Country of Registration</span>
                  <span className="detail-value">{client.country}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Regulatory Status</span>
                  <span className="detail-value">{client.regulatoryStatus}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Address Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Street Address</span>
                  <span className="detail-value">{client.address.street}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">City</span>
                  <span className="detail-value">{client.address.city}</span>
                </div>
                {client.address.state && (
                  <div className="detail-item">
                    <span className="detail-label">State/Province</span>
                    <span className="detail-value">{client.address.state}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Postal Code</span>
                  <span className="detail-value">{client.address.zip}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Country</span>
                  <span className="detail-value">{client.address.country}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Contact Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Primary Contact</span>
                  <span className="detail-value">{client.contactName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{client.contactEmail}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{client.contactPhone}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Account Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Account Type</span>
                  <span className="detail-value">{client.accountType}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Source of Funds</span>
                  <span className="detail-value">{client.sourceOfFunds}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Submitted Date</span>
                  <span className="detail-value">{formatDate(new Date(client.submittedDate), 'long')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Submitted By</span>
                  <span className="detail-value">{client.submittedBy}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">KYC Status</span>
                  <span className={`detail-value status-${client.kycStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                    {client.kycStatus}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Risk Rating</span>
                  <span className={`detail-value risk-${client.riskRating.toLowerCase()}`}>
                    {client.riskRating}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Submission Notes</h3>
              <div className="notes-container">
                <p>{client.submissionNotes}</p>
              </div>
            </div>

            <div className="detail-section">
              <h3>Compliance Review</h3>
              <div className="notes-container">
                <p>{client.complianceReview}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="documents-tab">
            <div className="document-list">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {client.documentList.map((doc, index) => (
                    <tr key={doc.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                      <td>{doc.name}</td>
                      <td>
                        <span className={`status-badge ${doc.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-small btn-outline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-tab">
            <div className="timeline">
              {client.reviewHistory.map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-date">
                    {formatDate(new Date(event.date), 'short')}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <strong>{event.action}</strong> by {event.user}
                    </div>
                    <div className="timeline-notes">
                      {event.notes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetail;