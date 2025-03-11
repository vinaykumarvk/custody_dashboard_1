import React, { useState } from 'react';
import './SmsNotificationModal.css';

const SmsNotificationModal = ({ isOpen, onClose, onSend, title = 'Send SMS Notification' }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }
    
    if (!message.trim()) {
      setError('Message is required');
      return;
    }
    
    try {
      setSending(true);
      setError('');
      await onSend(phoneNumber, message);
      onClose(); // Close modal after successful send
    } catch (err) {
      setError(err.message || 'Failed to send SMS. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="sms-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
              disabled={sending}
            />
            <small>Enter phone number in international format (e.g., +1 2345678900)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              rows={4}
              maxLength={160}
              disabled={sending}
            ></textarea>
            <small>{message.length}/160 characters</small>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={sending} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={sending} className="send-button">
              {sending ? 'Sending...' : 'Send SMS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SmsNotificationModal;