import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import MetricCard from './MetricCard';
import ClientApprovalsTable from './ClientApprovalsTable';

const OperationsStatistics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClientApprovals, setShowClientApprovals] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use static mock data to match the DR-01 document
        const toBeApprovedItems = {
          client: 20,
          clientExchange: 30,
          clientDepository: 1,
          party: 34,
          bankAccount: 89
        };
        
        // Calculate total to be approved
        const totalToBeApproved = Object.values(toBeApprovedItems).reduce((a, b) => a + b, 0);
        
        setData({
          toBeApproved: {
            ...toBeApprovedItems,
            total: totalToBeApproved
          },
          processesDoneToday: {
            sebiMessage: true,
            globalSettlement: true,
            priceUpload: true
          },
          processesDueToday2: {
            dpInstructions: true,
            mfts: true,
            earlyPayoutReport: true,
            fundObligationReport: true
          },
          exceptions: {
            pendingReconciliation: 64,
            unmatchedInventory: 8,
            positionsMismatch: 12
          },
          trades: {
            override: 68,
            repair: 32,
            pending: 8,
            unswept: 15,
            mispost: 7,
            settlementDue: 23
          },
          mails: {
            sent: 64,
            notSent: 73,
            reportFailure: 5
          },
          events: {
            newEvents: 68,
            paymentsEvents: 62
          },
          tickets: {
            breachedLimit: 27,
            closureDueToday: 14,
            otherOpen: 31
          },
          pendingPayments: 42
        });
        setLoading(false);
      } catch (err) {
        console.error('Error loading operations statistics data:', err);
        setError('Unable to load operations statistics data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="loading">Loading statistics data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!data) {
    return <div className="no-data">No operations statistics data available.</div>;
  }

  // Handle click on Client item
  const handleClientClick = () => {
    setShowClientApprovals(true);
  };

  // Handle back button from client approvals
  const handleBackFromClientApprovals = () => {
    setShowClientApprovals(false);
  };

  // Helper for rendering item row with label and count
  const renderItemRow = (label, count, onClick = null) => {
    const isClickable = onClick !== null;
    
    return (
      <div 
        className={`approval-item ${isClickable ? 'clickable' : ''}`}
        onClick={onClick}
      >
        <span className="approval-label">{label}</span>
        <span className="approval-count">{count}</span>
        {isClickable && <span className="view-details">View Details →</span>}
      </div>
    );
  };

  // Helper for rendering process items
  const renderProcessItem = (label, active) => (
    <div className={`process-item ${active ? 'active' : ''}`}>
      {label}
    </div>
  );

  // Show Client Approvals Table if in that view
  if (showClientApprovals) {
    return <ClientApprovalsTable onBack={handleBackFromClientApprovals} />;
  }

  return (
    <div className="operations-statistics">
      <div className="page-header">
        <h1>Operations</h1>
      </div>
      
      {/* ACTIVITIES SECTION */}
      <div className="section-header">
        <h2>Activities</h2>
      </div>
      
      <div className="stats-grid">
        {/* To Be Approved section */}
        <div className="stats-card">
          <div className="stats-card-header">
            <h3>To be Approved ({data.toBeApproved.total})</h3>
          </div>
          <div className="stats-card-body">
            {renderItemRow('Client', data.toBeApproved.client, handleClientClick)}
            {renderItemRow('Client Exchange', data.toBeApproved.clientExchange)}
            {renderItemRow('Client Depository', data.toBeApproved.clientDepository)}
            {renderItemRow('Party', data.toBeApproved.party)}
            {renderItemRow('Bank Account', data.toBeApproved.bankAccount)}
          </div>
        </div>

        {/* Processes Done Today section */}
        <div className="stats-card">
          <div className="stats-card-header">
            <h3>Processes Done Today</h3>
          </div>
          <div className="stats-card-body">
            {renderProcessItem('SEBI Message', data.processesDoneToday.sebiMessage)}
            {renderProcessItem('Global settlement', data.processesDoneToday.globalSettlement)}
            {renderProcessItem('Price upload', data.processesDoneToday.priceUpload)}
          </div>
        </div>

        {/* Processes Due Today section */}
        <div className="stats-card">
          <div className="stats-card-header">
            <h3>Processes Due Today</h3>
          </div>
          <div className="stats-card-body">
            {renderProcessItem('DP instructions', data.processesDueToday2.dpInstructions)}
            {renderProcessItem('MFTS', data.processesDueToday2.mfts)}
            {renderProcessItem('Early Payout Report', data.processesDueToday2.earlyPayoutReport)}
            {renderProcessItem('Fund Obligation Report', data.processesDueToday2.fundObligationReport)}
          </div>
        </div>
      </div>

      {/* EXCEPTIONS SECTION */}
      <div className="section-header">
        <h2>Exceptions</h2>
      </div>
      
      {/* Holdings subsection */}
      <div className="subsection-header">
        <h3>Holdings</h3>
      </div>
      <div className="stats-large-card">
        <div className="stats-card-body exceptions-grid">
          <div className="exception-item">
            <div className="exception-header">Pending Reconciliation & Valuation</div>
            <div className="exception-value">{data.exceptions.pendingReconciliation}</div>
          </div>
          <div className="exception-item">
            <div className="exception-header">Unmatched inventory NDCs</div>
            <div className="exception-value">{data.exceptions.unmatchedInventory}</div>
          </div>
          <div className="exception-item">
            <div className="exception-header">Positions mismatch CDSLs</div>
            <div className="exception-value">{data.exceptions.positionsMismatch}</div>
          </div>
        </div>
      </div>

      {/* Trades subsection */}
      <div className="subsection-header">
        <h3>Trades</h3>
      </div>
      <div className="stats-large-card">
        <div className="stats-card-body trades-grid">
          <div className="trade-section">
            <div className="trade-header">Override Trades</div>
            <div className="trade-value">{data.trades.override}</div>
          </div>
          <div className="trade-section">
            <div className="trade-header">Repair Trades</div>
            <div className="trade-value">{data.trades.repair}</div>
          </div>
          <div className="trade-section">
            <div className="trade-header">Pending Orders</div>
            <div className="trade-value">{data.trades.pending}</div>
          </div>
          <div className="trade-section">
            <div className="trade-header">Unswept Trades</div>
            <div className="trade-value">{data.trades.unswept}</div>
          </div>
          <div className="trade-section">
            <div className="trade-header">Mispost Trades</div>
            <div className="trade-value">{data.trades.mispost}</div>
          </div>
          <div className="trade-section">
            <div className="trade-header">Settlement Due</div>
            <div className="trade-value">{data.trades.settlementDue}</div>
          </div>
        </div>
      </div>

      {/* Communication subsection */}
      <div className="subsection-header">
        <h3>Communication</h3>
      </div>
      <div className="stats-row">
        <div className="stats-card">
          <div className="stats-card-header">
            <h3>Mails Sent</h3>
          </div>
          <div className="stats-card-body center-content">
            <div className="value-large">{data.mails.sent}</div>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card-header">
            <h3>Mails Not Sent</h3>
          </div>
          <div className="stats-card-body center-content">
            <div className="value-large">{data.mails.notSent}</div>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card-header">
            <h3>Report Failure</h3>
          </div>
          <div className="stats-card-body center-content">
            <div className="value-large">{data.mails.reportFailure}</div>
          </div>
        </div>
      </div>

      {/* Corporate Actions subsection */}
      <div className="subsection-header">
        <h3>Corporate Actions</h3>
      </div>
      <div className="stats-large-card">
        <div className="stats-card-body events-grid">
          <div className="event-section">
            <div className="event-header">New Event due Today</div>
            <div className="event-value">{data.events.newEvents}</div>
          </div>
          <div className="event-section">
            <div className="event-header">Events Payment Due Today</div>
            <div className="event-value">{data.events.paymentsEvents}</div>
          </div>
        </div>
      </div>

      {/* Tickets subsection */}
      <div className="subsection-header">
        <h3>Tickets</h3>
      </div>
      <div className="stats-large-card">
        <div className="stats-card-body tickets-grid">
          <div className="ticket-section">
            <div className="ticket-header">Tickets Breached Limit</div>
            <div className="ticket-value">{data.tickets.breachedLimit}</div>
          </div>
          <div className="ticket-section">
            <div className="ticket-header">Tickets closure due today</div>
            <div className="ticket-value">{data.tickets.closureDueToday}</div>
          </div>
          <div className="ticket-section">
            <div className="ticket-header">Other open tickets</div>
            <div className="ticket-value">{data.tickets.otherOpen}</div>
          </div>
        </div>
      </div>

      {/* Payments subsection */}
      <div className="subsection-header">
        <h3>Payments</h3>
      </div>
      <div className="stats-card">
        <div className="stats-card-header">
          <h3>Pending Payments</h3>
        </div>
        <div className="stats-card-body center-content">
          <div className="value-large">{data.pendingPayments}</div>
        </div>
      </div>
    </div>
  );
};

export default OperationsStatistics;