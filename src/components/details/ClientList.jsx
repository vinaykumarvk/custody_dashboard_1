import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pendingClients } from '../../mock-data/clientsData';
import { formatDate } from '../../utils';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'priority', direction: 'desc' });
  const [filter, setFilter] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        // In a real app this would be an API call
        setClients(pendingClients);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted clients
  const getSortedClients = () => {
    const sortableClients = [...clients];
    if (sortConfig.key) {
      sortableClients.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableClients;
  };

  // Handle filtering
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Get filtered clients
  const getFilteredClients = () => {
    return getSortedClients().filter(client => 
      client.clientName.toLowerCase().includes(filter.toLowerCase()) ||
      client.accountType.toLowerCase().includes(filter.toLowerCase()) ||
      client.country.toLowerCase().includes(filter.toLowerCase()) ||
      client.priority.toLowerCase().includes(filter.toLowerCase())
    );
  };

  // Handle row click to navigate to details
  const handleRowClick = (clientId) => {
    navigate(`/clients/${clientId}`);
  };

  // Get class for priority label
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return '';
    }
  };

  // Get status class
  const getKycStatusClass = (status) => {
    switch(status) {
      case 'Completed':
        return 'status-completed';
      case 'In Progress':
        return 'status-pending';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading client data...</div>;
  }

  return (
    <div className="client-list-container">
      <div className="list-header">
        <h1>Pending Client Approvals</h1>
        <div className="filter-container">
          <input 
            type="text" 
            placeholder="Filter clients..." 
            value={filter}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table client-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('clientName')}>
                Client Name
                {sortConfig.key === 'clientName' && (
                  <span className={`sort-indicator ${sortConfig.direction}`}></span>
                )}
              </th>
              <th onClick={() => requestSort('accountType')}>
                Account Type
                {sortConfig.key === 'accountType' && (
                  <span className={`sort-indicator ${sortConfig.direction}`}></span>
                )}
              </th>
              <th onClick={() => requestSort('submittedDate')}>
                Submitted Date
                {sortConfig.key === 'submittedDate' && (
                  <span className={`sort-indicator ${sortConfig.direction}`}></span>
                )}
              </th>
              <th onClick={() => requestSort('country')}>
                Country
                {sortConfig.key === 'country' && (
                  <span className={`sort-indicator ${sortConfig.direction}`}></span>
                )}
              </th>
              <th onClick={() => requestSort('submittedBy')}>
                Submitted By
                {sortConfig.key === 'submittedBy' && (
                  <span className={`sort-indicator ${sortConfig.direction}`}></span>
                )}
              </th>
              <th onClick={() => requestSort('priority')}>
                Priority
                {sortConfig.key === 'priority' && (
                  <span className={`sort-indicator ${sortConfig.direction}`}></span>
                )}
              </th>
              <th onClick={() => requestSort('documents')}>
                Documents
                {sortConfig.key === 'documents' && (
                  <span className={`sort-indicator ${sortConfig.direction}`}></span>
                )}
              </th>
              <th onClick={() => requestSort('kycStatus')}>
                KYC Status
                {sortConfig.key === 'kycStatus' && (
                  <span className={`sort-indicator ${sortConfig.direction}`}></span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {getFilteredClients().map((client, index) => (
              <tr 
                key={client.id} 
                onClick={() => handleRowClick(client.id)}
                className={`clickable-row ${index % 2 === 0 ? 'row-even' : 'row-odd'}`}
              >
                <td>{client.clientName}</td>
                <td>{client.accountType}</td>
                <td>{formatDate(new Date(client.submittedDate), 'medium')}</td>
                <td>{client.country}</td>
                <td>{client.submittedBy}</td>
                <td>
                  <span className={`priority-label ${getPriorityClass(client.priority)}`}>
                    {client.priority}
                  </span>
                </td>
                <td>{client.documents}</td>
                <td>
                  <span className={`status-label ${getKycStatusClass(client.kycStatus)}`}>
                    {client.kycStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {getFilteredClients().length === 0 && (
          <div className="no-results">No clients match the current filter.</div>
        )}
      </div>
      
      <div className="list-footer">
        <div className="record-count">Showing {getFilteredClients().length} of {clients.length} clients</div>
        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={() => navigate('/operations-statistics')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientList;