import React from 'react';
import { formatCurrency, formatDate } from '../utils';

const TradeDetailModal = ({ trade, onClose }) => {
  if (!trade) return null;
  
  // Mock additional details that might not be in the main table
  const additionalDetails = {
    reference: `REF-${trade.id.slice(2)}-${Math.floor(Math.random() * 1000)}`,
    executionVenue: ['NYSE', 'NASDAQ', 'LSE', 'HKEX'][Math.floor(Math.random() * 4)],
    settlementDate: new Date(new Date(trade.date).getTime() + (2 * 86400000)).toISOString(),
    fees: trade.amount * 0.0015,
    counterparty: ['JP Morgan', 'Goldman Sachs', 'Morgan Stanley', 'Barclays'][Math.floor(Math.random() * 4)],
    executionTime: new Date(trade.date).toTimeString().slice(0, 8),
    settlementCurrency: ['USD', 'EUR', 'GBP', 'JPY'][Math.floor(Math.random() * 4)],
    tradeNotes: 'Standard settlement terms apply. Confirmation sent to client.',
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Trade Details - {trade.id}</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="trade-detail-grid">
            <div className="detail-section">
              <h3>Primary Information</h3>
              <div className="detail-row">
                <div className="detail-label">Trade ID:</div>
                <div className="detail-value">{trade.id}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Customer:</div>
                <div className="detail-value">{trade.customer}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Type:</div>
                <div className="detail-value">
                  <span className={`trade-type ${trade.type.toLowerCase()}`}>
                    {trade.type}
                  </span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Asset:</div>
                <div className="detail-value">{trade.asset}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Amount:</div>
                <div className="detail-value">{formatCurrency(trade.amount)}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Status:</div>
                <div className="detail-value">
                  <span className={`status status-${trade.status.toLowerCase()}`}>
                    {trade.status}
                  </span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Trade Date:</div>
                <div className="detail-value">{formatDate(trade.date, 'full')}</div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Settlement Information</h3>
              <div className="detail-row">
                <div className="detail-label">Reference:</div>
                <div className="detail-value">{additionalDetails.reference}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Execution Venue:</div>
                <div className="detail-value">{additionalDetails.executionVenue}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Settlement Date:</div>
                <div className="detail-value">{formatDate(additionalDetails.settlementDate, 'full')}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Fees:</div>
                <div className="detail-value">{formatCurrency(additionalDetails.fees)}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Counterparty:</div>
                <div className="detail-value">{additionalDetails.counterparty}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Execution Time:</div>
                <div className="detail-value">{additionalDetails.executionTime}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Settlement Currency:</div>
                <div className="detail-value">{additionalDetails.settlementCurrency}</div>
              </div>
            </div>
          </div>
          
          <div className="detail-section mt-4">
            <h3>Notes</h3>
            <div className="detail-notes">
              {additionalDetails.tradeNotes}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" disabled={trade.status === 'Completed'}>
            {trade.status === 'Completed' ? 'Completed' : 'Process Trade'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeDetailModal;