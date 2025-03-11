import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import { formatNumber, formatCurrency, formatDate } from '../utils';
import MetricCard from './MetricCard';
import DateRangeFilter from './DateRangeFilter';

const OperationsAlerts = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('week');
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch operations alerts data
        console.log('Fetching operations alerts data...');
        const response = await fetchData('operations_alerts');
        
        if (!response) {
          console.error('Invalid operations alerts data format:', response);
          setError('The operations alerts data format is invalid.');
          return;
        }
        
        setData(response);
        console.log('Operations alerts data loaded successfully.');
      } catch (err) {
        console.error('Error loading operations alerts data:', err);
        setError('Unable to load operations alerts data: ' + (err.message || err));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // If loading or error
  if (loading) return <div className="loading">Loading operations alerts data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="no-data">No operations alerts data available.</div>;

  // Mock data structure for operations alerts
  const alerts = data.alerts || {
    unauthorized_deals: [],
    settlement_due: [],
    deals_to_repair: [],
    pending_ca_payments: [],
    pending_instructions: [],
    pending_billing: [],
    trade_reconciliation: [],
    position_reconciliation: [],
    customer_tickets: []
  };
  
  // Calculate alert counts
  const alertCounts = {
    unauthorized_deals: alerts.unauthorized_deals?.length || 0,
    settlement_due: alerts.settlement_due?.length || 0,
    deals_to_repair: alerts.deals_to_repair?.length || 0,
    pending_ca_payments: alerts.pending_ca_payments?.length || 0,
    pending_instructions: alerts.pending_instructions?.length || 0,
    pending_billing: alerts.pending_billing?.length || 0,
    trade_reconciliation: alerts.trade_reconciliation?.length || 0,
    position_reconciliation: alerts.position_reconciliation?.length || 0,
    customer_tickets: alerts.customer_tickets?.length || 0
  };
  
  // Filter alerts by date range
  const filterAlertsByDate = (alertList) => {
    if (!alertList || !Array.isArray(alertList)) return [];
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch(dateRange) {
      case 'today':
        cutoffDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      default:
        cutoffDate = new Date(0); // Show all
    }
    
    return alertList.filter(alert => {
      const alertDate = new Date(alert.date);
      return alertDate >= cutoffDate;
    });
  };
  
  // Render alert tables
  const renderAlertTable = (alertList, columns) => {
    if (!alertList || !Array.isArray(alertList) || alertList.length === 0) {
      return <div className="no-alerts">No alerts to display</div>;
    }
    
    const filteredAlerts = filterAlertsByDate(alertList);
    
    if (filteredAlerts.length === 0) {
      return <div className="no-alerts">No alerts for the selected time period</div>;
    }
    
    return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.field}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((alert, index) => (
              <tr key={index}>
                {columns.map(col => (
                  <td key={col.field}>
                    {col.type === 'date' ? formatDate(alert[col.field]) : 
                     col.type === 'currency' ? formatCurrency(alert[col.field]) : 
                     col.type === 'status' ? (
                       <span className={`status status-${alert[col.field]?.toLowerCase()}`}>
                         {alert[col.field]}
                       </span>
                     ) : 
                     alert[col.field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Different column definitions for each alert type
  const dealColumns = [
    { field: 'id', header: 'Deal ID' },
    { field: 'date', header: 'Date', type: 'date' },
    { field: 'customer', header: 'Customer' },
    { field: 'amount', header: 'Amount', type: 'currency' },
    { field: 'status', header: 'Status', type: 'status' }
  ];
  
  const caColumns = [
    { field: 'id', header: 'CA ID' },
    { field: 'date', header: 'Date', type: 'date' },
    { field: 'type', header: 'Type' },
    { field: 'security', header: 'Security' },
    { field: 'amount', header: 'Amount', type: 'currency' },
    { field: 'status', header: 'Status', type: 'status' }
  ];
  
  const billingColumns = [
    { field: 'id', header: 'Invoice ID' },
    { field: 'date', header: 'Date', type: 'date' },
    { field: 'customer', header: 'Customer' },
    { field: 'amount', header: 'Amount', type: 'currency' },
    { field: 'dueDate', header: 'Due Date', type: 'date' },
    { field: 'status', header: 'Status', type: 'status' }
  ];
  
  const reconciliationColumns = [
    { field: 'id', header: 'ID' },
    { field: 'date', header: 'Date', type: 'date' },
    { field: 'type', header: 'Type' },
    { field: 'description', header: 'Description' },
    { field: 'status', header: 'Status', type: 'status' }
  ];
  
  const ticketColumns = [
    { field: 'id', header: 'Ticket ID' },
    { field: 'date', header: 'Date', type: 'date' },
    { field: 'customer', header: 'Customer' },
    { field: 'subject', header: 'Subject' },
    { field: 'priority', header: 'Priority' },
    { field: 'status', header: 'Status', type: 'status' }
  ];
  
  return (
    <div className="operations-alerts">
      <div className="page-header d-flex justify-content-between align-items-center">
        <h1>Operations Alerts</h1>
        <DateRangeFilter 
          activeRange={dateRange} 
          onChange={setDateRange}
          options={[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: '3months', label: 'Last 3 Months' },
            { id: 'all', label: 'All' }
          ]}
        />
      </div>
      
      {/* Alerts summary cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Unauthorized Deals" 
            value={alertCounts.unauthorized_deals} 
            icon="exclamation-triangle"
            color={alertCounts.unauthorized_deals > 0 ? "#DC3545" : "#28A745"}
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Settlement Due" 
            value={alertCounts.settlement_due} 
            icon="clock"
            color={alertCounts.settlement_due > 0 ? "#FFC107" : "#28A745"}
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Deals to Repair" 
            value={alertCounts.deals_to_repair} 
            icon="tools"
            color={alertCounts.deals_to_repair > 0 ? "#FFC107" : "#28A745"}
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Pending CA Payments" 
            value={alertCounts.pending_ca_payments} 
            icon="money-bill-wave"
            color={alertCounts.pending_ca_payments > 0 ? "#FFC107" : "#28A745"}
          />
        </div>
      </div>
      
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Pending Instructions" 
            value={alertCounts.pending_instructions} 
            icon="clipboard-list"
            color={alertCounts.pending_instructions > 0 ? "#FFC107" : "#28A745"}
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Pending Billing" 
            value={alertCounts.pending_billing} 
            icon="file-invoice-dollar"
            color={alertCounts.pending_billing > 0 ? "#FFC107" : "#28A745"}
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Trade Reconciliation" 
            value={alertCounts.trade_reconciliation} 
            icon="balance-scale"
            color={alertCounts.trade_reconciliation > 0 ? "#FFC107" : "#28A745"}
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Customer Tickets" 
            value={alertCounts.customer_tickets} 
            icon="ticket-alt"
            color={alertCounts.customer_tickets > 0 ? "#FFC107" : "#28A745"}
          />
        </div>
      </div>
      
      {/* Detailed alert sections */}
      <div className="accordion" id="alertsAccordion">
        {/* Unauthorized Deals */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="unauthorizedDealsHeading">
            <button 
              className="accordion-button" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#unauthorizedDealsCollapse" 
              aria-expanded="true" 
              aria-controls="unauthorizedDealsCollapse"
            >
              Unauthorized Deals ({alertCounts.unauthorized_deals})
            </button>
          </h2>
          <div 
            id="unauthorizedDealsCollapse" 
            className="accordion-collapse collapse show" 
            aria-labelledby="unauthorizedDealsHeading" 
            data-bs-parent="#alertsAccordion"
          >
            <div className="accordion-body">
              {renderAlertTable(alerts.unauthorized_deals, dealColumns)}
            </div>
          </div>
        </div>
        
        {/* Settlement Due */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="settlementDueHeading">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#settlementDueCollapse" 
              aria-expanded="false" 
              aria-controls="settlementDueCollapse"
            >
              Settlement Due ({alertCounts.settlement_due})
            </button>
          </h2>
          <div 
            id="settlementDueCollapse" 
            className="accordion-collapse collapse" 
            aria-labelledby="settlementDueHeading" 
            data-bs-parent="#alertsAccordion"
          >
            <div className="accordion-body">
              {renderAlertTable(alerts.settlement_due, dealColumns)}
            </div>
          </div>
        </div>
        
        {/* Deals to Repair */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="dealsToRepairHeading">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#dealsToRepairCollapse" 
              aria-expanded="false" 
              aria-controls="dealsToRepairCollapse"
            >
              Deals to Repair ({alertCounts.deals_to_repair})
            </button>
          </h2>
          <div 
            id="dealsToRepairCollapse" 
            className="accordion-collapse collapse" 
            aria-labelledby="dealsToRepairHeading" 
            data-bs-parent="#alertsAccordion"
          >
            <div className="accordion-body">
              {renderAlertTable(alerts.deals_to_repair, dealColumns)}
            </div>
          </div>
        </div>
        
        {/* Pending CA Payments */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="pendingCAPaymentsHeading">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#pendingCAPaymentsCollapse" 
              aria-expanded="false" 
              aria-controls="pendingCAPaymentsCollapse"
            >
              Pending CA Payments ({alertCounts.pending_ca_payments})
            </button>
          </h2>
          <div 
            id="pendingCAPaymentsCollapse" 
            className="accordion-collapse collapse" 
            aria-labelledby="pendingCAPaymentsHeading" 
            data-bs-parent="#alertsAccordion"
          >
            <div className="accordion-body">
              {renderAlertTable(alerts.pending_ca_payments, caColumns)}
            </div>
          </div>
        </div>
        
        {/* Pending Instructions */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="pendingInstructionsHeading">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#pendingInstructionsCollapse" 
              aria-expanded="false" 
              aria-controls="pendingInstructionsCollapse"
            >
              Pending Customer Instructions ({alertCounts.pending_instructions})
            </button>
          </h2>
          <div 
            id="pendingInstructionsCollapse" 
            className="accordion-collapse collapse" 
            aria-labelledby="pendingInstructionsHeading" 
            data-bs-parent="#alertsAccordion"
          >
            <div className="accordion-body">
              {renderAlertTable(alerts.pending_instructions, caColumns)}
            </div>
          </div>
        </div>
        
        {/* Pending Billing */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="pendingBillingHeading">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#pendingBillingCollapse" 
              aria-expanded="false" 
              aria-controls="pendingBillingCollapse"
            >
              Pending Billing Payments ({alertCounts.pending_billing})
            </button>
          </h2>
          <div 
            id="pendingBillingCollapse" 
            className="accordion-collapse collapse" 
            aria-labelledby="pendingBillingHeading" 
            data-bs-parent="#alertsAccordion"
          >
            <div className="accordion-body">
              {renderAlertTable(alerts.pending_billing, billingColumns)}
            </div>
          </div>
        </div>
        
        {/* Trade Reconciliation */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="tradeReconciliationHeading">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#tradeReconciliationCollapse" 
              aria-expanded="false" 
              aria-controls="tradeReconciliationCollapse"
            >
              Trade Reconciliation ({alertCounts.trade_reconciliation})
            </button>
          </h2>
          <div 
            id="tradeReconciliationCollapse" 
            className="accordion-collapse collapse" 
            aria-labelledby="tradeReconciliationHeading" 
            data-bs-parent="#alertsAccordion"
          >
            <div className="accordion-body">
              {renderAlertTable(alerts.trade_reconciliation, reconciliationColumns)}
            </div>
          </div>
        </div>
        
        {/* Position Reconciliation */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="positionReconciliationHeading">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#positionReconciliationCollapse" 
              aria-expanded="false" 
              aria-controls="positionReconciliationCollapse"
            >
              Position Reconciliation ({alertCounts.position_reconciliation})
            </button>
          </h2>
          <div 
            id="positionReconciliationCollapse" 
            className="accordion-collapse collapse" 
            aria-labelledby="positionReconciliationHeading" 
            data-bs-parent="#alertsAccordion"
          >
            <div className="accordion-body">
              {renderAlertTable(alerts.position_reconciliation, reconciliationColumns)}
            </div>
          </div>
        </div>
        
        {/* Customer Tickets */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="customerTicketsHeading">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#customerTicketsCollapse" 
              aria-expanded="false" 
              aria-controls="customerTicketsCollapse"
            >
              Customer Tickets ({alertCounts.customer_tickets})
            </button>
          </h2>
          <div 
            id="customerTicketsCollapse" 
            className="accordion-collapse collapse" 
            aria-labelledby="customerTicketsHeading" 
            data-bs-parent="#alertsAccordion"
          >
            <div className="accordion-body">
              {renderAlertTable(alerts.customer_tickets, ticketColumns)}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default OperationsAlerts;