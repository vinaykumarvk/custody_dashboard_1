import React, { useState, useEffect, useContext } from 'react';
import { formatNumber, formatCurrency, formatPercentage } from '../utils';
import { NavigationContext } from '../App';
import NotificationButton from './NotificationButton';

const OperationsStatistics = ({ dashboardData }) => {
  const [data, setData] = useState(null);
  const { navigateTo } = useContext(NavigationContext);

  useEffect(() => {
    // This would typically be an API call in a real application
    setData(dashboardData);
  }, [dashboardData]);

  const handleApprovalClick = (type) => {
    // Handle navigation to the appropriate list based on type
    switch(type) {
      case 'clients':
        navigateTo('clients');
        break;
      case 'trades':
        // Will be implemented later
        alert('Trade approvals drill-down will be implemented in the next phase');
        break;
      case 'settlements':
        // Will be implemented later
        alert('Settlement approvals drill-down will be implemented in the next phase');
        break;
      default:
        console.log('Unknown approval type:', type);
    }
  };

  const handleExceptionClick = (type) => {
    // Will be implemented in future phases
    alert(`${type} exceptions drill-down will be implemented in the next phase`);
  };

  const handleTradeClick = (type) => {
    // Will be implemented in future phases
    alert(`${type} trades drill-down will be implemented in the next phase`);
  };

  const handleEventClick = (type) => {
    // Will be implemented in future phases
    alert(`${type} events drill-down will be implemented in the next phase`);
  };

  const handleTicketClick = (type) => {
    // Will be implemented in future phases
    alert(`${type} tickets drill-down will be implemented in the next phase`);
  };

  if (!data) return <div className="loading">Loading dashboard data...</div>;

  return (
    <div className="operations-statistics">
      <h1 className="page-title">Operations Dashboard</h1>
      
      <div className="stats-container">
        <div className="stats-large-card">
          <h2 className="card-title">Activities</h2>
          
          <div className="to-approve-section">
            <h3 className="section-title">To Be Approved</h3>
            <div className="approval-grid">
              <div 
                className="approval-item clickable" 
                onClick={() => handleApprovalClick('clients')}
              >
                <div className="approval-header">Client Approvals</div>
                <div className="approval-value">{data.totalCustomers > 0 ? Math.floor(data.totalCustomers * 0.07) : 20}</div>
              </div>
              <div 
                className="approval-item clickable" 
                onClick={() => handleApprovalClick('trades')}
              >
                <div className="approval-header">Trade Approvals</div>
                <div className="approval-value">{data.pendingTrades || 0}</div>
              </div>
              <div 
                className="approval-item clickable" 
                onClick={() => handleApprovalClick('settlements')}
              >
                <div className="approval-header">Settlement Approvals</div>
                <div className="approval-value">{data.pendingTrades ? Math.floor(data.pendingTrades * 0.8) : 189}</div>
              </div>
            </div>
          </div>
          
          <div className="trades-section">
            <h3 className="section-title">Trades</h3>
            <div className="trades-grid">
              <div 
                className="trade-section clickable" 
                onClick={() => handleTradeClick('total')}
              >
                <div className="trade-header">Total Trades</div>
                <div className="trade-value">{formatNumber(data.totalTrades || 0)}</div>
              </div>
              <div 
                className="trade-section clickable" 
                onClick={() => handleTradeClick('volume')}
              >
                <div className="trade-header">Trading Volume</div>
                <div className="trade-value">{formatCurrency(data.tradingVolume || 0)}</div>
              </div>
              <div 
                className="trade-section clickable" 
                onClick={() => handleTradeClick('pending')}
              >
                <div className="trade-header">Pending Trades</div>
                <div className="trade-value">{formatNumber(data.pendingTrades || 0)}</div>
              </div>
              <div 
                className="trade-section clickable" 
                onClick={() => handleTradeClick('execution')}
              >
                <div className="trade-header">Avg. Execution Time</div>
                <div className="trade-value">3.4s</div>
              </div>
              <div 
                className="trade-section clickable" 
                onClick={() => handleTradeClick('settlement')}
              >
                <div className="trade-header">Avg. Settlement Time</div>
                <div className="trade-value">T+2</div>
              </div>
              <div 
                className="trade-section clickable" 
                onClick={() => handleTradeClick('failure')}
              >
                <div className="trade-header">Trade Failure Rate</div>
                <div className="trade-value">{formatPercentage(0.023)}</div>
              </div>
            </div>
          </div>
          
          <div className="events-section">
            <h3 className="section-title">Corporate Actions</h3>
            <div className="events-grid">
              <div 
                className="event-section clickable" 
                onClick={() => handleEventClick('total')}
              >
                <div className="event-header">Total Events</div>
                <div className="event-value">{data.corporateActions?.total || 0}</div>
              </div>
              <div 
                className="event-section clickable" 
                onClick={() => handleEventClick('mandatory')}
              >
                <div className="event-header">Mandatory Events</div>
                <div className="event-value">{data.corporateActions?.mandatory || 0}</div>
              </div>
              <div 
                className="event-section clickable" 
                onClick={() => handleEventClick('voluntary')}
              >
                <div className="event-header">Voluntary Events</div>
                <div className="event-value">{data.corporateActions?.voluntary || 0}</div>
              </div>
              <div 
                className="event-section clickable" 
                onClick={() => handleEventClick('pending')}
              >
                <div className="event-header">Pending Elections</div>
                <div className="event-value">{data.corporateActions?.pending_elections || 0}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="stats-large-card">
          <h2 className="card-title">Exceptions</h2>
          
          <div className="exceptions-section">
            <div className="exceptions-grid">
              <div 
                className="exception-item clickable" 
                onClick={() => handleExceptionClick('trade')}
              >
                <div className="exception-header">
                  Trade Breaks
                  <NotificationButton 
                    count={Math.floor((data.pendingTrades ? Math.floor(data.pendingTrades * 0.15) : 36) * 0.25)} 
                    type="urgent" 
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('High priority trade breaks require immediate attention');
                    }}
                  />
                </div>
                <div className="exception-value">{data.pendingTrades ? Math.floor(data.pendingTrades * 0.15) : 36}</div>
              </div>
              <div 
                className="exception-item clickable" 
                onClick={() => handleExceptionClick('settlement')}
              >
                <div className="exception-header">Settlement Fails</div>
                <div className="exception-value">{data.pendingTrades ? Math.floor(data.pendingTrades * 0.18) : 43}</div>
              </div>
              <div 
                className="exception-item clickable" 
                onClick={() => handleExceptionClick('reconciliation')}
              >
                <div className="exception-header">Reconciliation Breaks</div>
                <div className="exception-value">{data.pendingTrades ? Math.floor(data.pendingTrades * 0.08) : 19}</div>
              </div>
              <div 
                className="exception-item clickable" 
                onClick={() => handleExceptionClick('corporate')}
              >
                <div className="exception-header">Corporate Actions</div>
                <div className="exception-value">{data.corporateActions?.high_priority || 8}</div>
              </div>
              <div 
                className="exception-item clickable" 
                onClick={() => handleExceptionClick('cash')}
              >
                <div className="exception-header">Cash Breaks</div>
                <div className="exception-value">{data.pendingTrades ? Math.floor(data.pendingTrades * 0.12) : 28}</div>
              </div>
              <div 
                className="exception-item clickable" 
                onClick={() => handleExceptionClick('position')}
              >
                <div className="exception-header">Position Breaks</div>
                <div className="exception-value">{data.pendingTrades ? Math.floor(data.pendingTrades * 0.09) : 21}</div>
              </div>
            </div>
          </div>
          
          <div className="tickets-section">
            <h3 className="section-title">Tickets</h3>
            <div className="tickets-grid">
              <div 
                className="ticket-section clickable" 
                onClick={() => handleTicketClick('open')}
              >
                <div className="ticket-header">Open Tickets</div>
                <div className="ticket-value">54</div>
              </div>
              <div 
                className="ticket-section clickable" 
                onClick={() => handleTicketClick('urgent')}
              >
                <div className="ticket-header">Urgent Tickets</div>
                <div className="ticket-value">12</div>
              </div>
              <div 
                className="ticket-section clickable" 
                onClick={() => handleTicketClick('aging')}
              >
                <div className="ticket-header">Avg. Ticket Age</div>
                <div className="ticket-value">3.2 days</div>
              </div>
            </div>
          </div>
          
          <div className="payments-section">
            <h3 className="section-title">Payments</h3>
            <div className="tickets-grid">
              <div 
                className="ticket-section clickable" 
                onClick={() => handleTicketClick('pending-payments')}
              >
                <div className="ticket-header">Pending Payments</div>
                <div className="ticket-value">87</div>
              </div>
              <div 
                className="ticket-section clickable" 
                onClick={() => handleTicketClick('failed-payments')}
              >
                <div className="ticket-header">Failed Payments</div>
                <div className="ticket-value">9</div>
              </div>
              <div 
                className="ticket-section clickable" 
                onClick={() => handleTicketClick('payment-value')}
              >
                <div className="ticket-header">Total Pending Value</div>
                <div className="ticket-value">{formatCurrency(13589742)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsStatistics;