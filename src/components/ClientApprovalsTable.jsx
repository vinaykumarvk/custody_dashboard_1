import React, { useState } from 'react';
import { formatDate } from '../utils';
import clientApprovals from '../data/clientApprovals';

/**
 * ClientApprovalsTable Component
 * Displays a detailed table of client approvals with expandable rows
 */
const ClientApprovalsTable = ({ onBack }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  // Function to handle row click and expand details
  const handleRowClick = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null); // Collapse if already expanded
    } else {
      setExpandedRow(id); // Expand the clicked row
    }
  };

  // Function to handle approval
  const handleApprove = (id, e) => {
    e.stopPropagation(); // Prevent row click event
    console.log(`Approving client: ${id}`);
    // In a real app, this would make an API call
    // Custom alert to show only the message part without the URL
    const message = `Client ${id} has been approved`;
    const alertWindow = window.open("", "_blank", "width=400,height=200");
    alertWindow.document.write(`
      <html>
        <head>
          <title>Approval Notification</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #1E1E1E;
              color: white;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              padding: 20px;
              box-sizing: border-box;
            }
            .message {
              margin-bottom: 20px;
              font-size: 18px;
            }
            .btn {
              background-color: #D4B5FF;
              color: black;
              border: none;
              padding: 10px 30px;
              border-radius: 20px;
              cursor: pointer;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="message">${message}</div>
          <button class="btn" onclick="window.close()">OK</button>
        </body>
      </html>
    `);
  };

  // Function to handle rejection
  const handleReject = (id, e) => {
    e.stopPropagation(); // Prevent row click event
    console.log(`Rejecting client: ${id}`);
    // In a real app, this would make an API call
    // Custom alert to show only the message part without the URL
    const message = `Client ${id} has been rejected`;
    const alertWindow = window.open("", "_blank", "width=400,height=200");
    alertWindow.document.write(`
      <html>
        <head>
          <title>Rejection Notification</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #1E1E1E;
              color: white;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              padding: 20px;
              box-sizing: border-box;
            }
            .message {
              margin-bottom: 20px;
              font-size: 18px;
            }
            .btn {
              background-color: #D4B5FF;
              color: black;
              border: none;
              padding: 10px 30px;
              border-radius: 20px;
              cursor: pointer;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="message">${message}</div>
          <button class="btn" onclick="window.close()">OK</button>
        </body>
      </html>
    `);
  };

  // Function to render priority indicator
  const renderPriorityIndicator = (priority) => {
    const colors = {
      'High': '#e74c3c',
      'Medium': '#f39c12',
      'Low': '#2ecc71'
    };
    
    return (
      <span 
        className="priority-indicator" 
        style={{ 
          backgroundColor: colors[priority],
          display: 'inline-block',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          marginRight: '8px'
        }}
      />
    );
  };

  return (
    <div className="client-approvals-container">
      <div className="table-header">
        <h2>Client Approvals</h2>
        <button className="back-button" onClick={onBack}>
          &larr; Back to Operations
        </button>
      </div>
      
      <div className="approval-table-container">
        <table className="approval-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client Name</th>
              <th>Type</th>
              <th>Submitted By</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {clientApprovals.map((client) => (
              <React.Fragment key={client.id}>
                <tr 
                  className={`approval-row ${expandedRow === client.id ? 'expanded' : ''}`}
                  onClick={() => handleRowClick(client.id)}
                >
                  <td>{client.id}</td>
                  <td>{client.name}</td>
                  <td>{client.type}</td>
                  <td>{client.submittedBy}</td>
                  <td>{formatDate(client.submittedDate, 'short')}</td>
                  <td>
                    {renderPriorityIndicator(client.priority)}
                    {client.priority}
                  </td>
                  <td>{client.status}</td>
                </tr>
                {expandedRow === client.id && (
                  <tr className="detail-row">
                    <td colSpan="7">
                      <div className="client-details">
                        <div className="detail-section">
                          <h4>Contact Information</h4>
                          <div className="detail-grid">
                            <div className="detail-item">
                              <span className="detail-label">Contact Person:</span>
                              <span className="detail-value">{client.details.contactPerson}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Email:</span>
                              <span className="detail-value">{client.details.contactEmail}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Phone:</span>
                              <span className="detail-value">{client.details.contactPhone}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Tax ID:</span>
                              <span className="detail-value">{client.details.taxId}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="detail-section">
                          <h4>Additional Information</h4>
                          <div className="detail-grid">
                            <div className="detail-item full-width">
                              <span className="detail-label">Address:</span>
                              <span className="detail-value">{client.details.address}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Documentation:</span>
                              <span className={`detail-value status-tag ${client.details.documentationStatus.toLowerCase()}`}>
                                {client.details.documentationStatus}
                              </span>
                            </div>
                            <div className="detail-item full-width">
                              <span className="detail-label">Notes:</span>
                              <span className="detail-value">{client.details.notes}</span>
                            </div>
                          </div>
                        </div>

                        <div className="action-buttons">
                          <button 
                            className="approve-button" 
                            onClick={(e) => handleApprove(client.id, e)}
                          >
                            Approve
                          </button>
                          <button 
                            className="reject-button" 
                            onClick={(e) => handleReject(client.id, e)}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientApprovalsTable;