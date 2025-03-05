import React from 'react';
import { formatDate, formatNumber, formatCurrency } from '../utils';

const TradeDetailModal = ({ trade, onClose }) => {
  if (!trade) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Trade #{trade.trade_id} Details</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="trade-detail-grid">
            <div className="detail-section">
              <h3>Basic Information</h3>
              <div className="detail-row">
                <div className="detail-label">Trade ID:</div>
                <div className="detail-value">{trade.trade_id}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Type:</div>
                <div className="detail-value">
                  <span className={`trade-type ${trade.trade_type?.toLowerCase()}`}>
                    {trade.trade_type}
                  </span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Status:</div>
                <div className="detail-value">
                  <span className={`status status-${trade.status?.toLowerCase()}`}>
                    {trade.status}
                  </span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Date:</div>
                <div className="detail-value">{formatDate(trade.date, 'long')}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Amount:</div>
                <div className="detail-value">{formatCurrency(trade.amount)}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Quantity:</div>
                <div className="detail-value">{formatNumber(trade.quantity)}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Price:</div>
                <div className="detail-value">{formatCurrency(trade.price)}</div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Security Information</h3>
              <div className="detail-row">
                <div className="detail-label">Security:</div>
                <div className="detail-value">{trade.security_name}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">CUSIP:</div>
                <div className="detail-value">{trade.cusip || 'N/A'}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">ISIN:</div>
                <div className="detail-value">{trade.isin || 'N/A'}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Asset Class:</div>
                <div className="detail-value">{trade.asset_class}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Market:</div>
                <div className="detail-value">{trade.market}</div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Client Information</h3>
              <div className="detail-row">
                <div className="detail-label">Client:</div>
                <div className="detail-value">{trade.client_name}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Client ID:</div>
                <div className="detail-value">{trade.client_id}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Account:</div>
                <div className="detail-value">{trade.account_id}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Relationship Manager:</div>
                <div className="detail-value">{trade.relationship_manager}</div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Settlement Information</h3>
              <div className="detail-row">
                <div className="detail-label">Settlement Date:</div>
                <div className="detail-value">{formatDate(trade.settlement_date, 'long')}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Settlement Status:</div>
                <div className="detail-value">
                  <span className={`status status-${trade.settlement_status?.toLowerCase()}`}>
                    {trade.settlement_status || 'Pending'}
                  </span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Commission:</div>
                <div className="detail-value">{formatCurrency(trade.commission)}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Fees:</div>
                <div className="detail-value">{formatCurrency(trade.fees)}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Total:</div>
                <div className="detail-value">{formatCurrency(trade.total_amount)}</div>
              </div>
            </div>
          </div>
          
          <div className="detail-section mt-3">
            <h3>Notes</h3>
            <div className="detail-notes">
              {trade.notes || 'No notes for this trade.'}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary">Process Trade</button>
        </div>
      </div>
    </div>
  );
};

export default TradeDetailModal;