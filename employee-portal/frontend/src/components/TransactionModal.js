// frontend/src/components/TransactionModal.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, CheckCircle, XCircle, AlertTriangle, DollarSign, CreditCard, Calendar, User } from 'lucide-react';
import { maskAccountNumber, maskIdNumber, formatCurrency, formatDate, formatSwift } from '../utils/formatters';

const TransactionModal = ({ transaction, onClose, onReviewComplete }) => {
  const { authApi } = useAuth();
  const [action, setAction] = useState(null); // 'accept' or 'reject'
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isPending = transaction.status === 'pending';

  const handleAccept = async () => {
    setLoading(true);
    setError(null);

    try {
      await authApi.patch(`/transactions/${transaction._id}/accept`);
      setSuccess(true);
      setTimeout(() => {
        onReviewComplete();
      }, 1500);
    } catch (err) {
      console.error('Error accepting transaction:', err);
      setError(err.response?.data?.error || 'Failed to accept transaction');
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (rejectionReason.trim().length < 10) {
      setError('Rejection reason must be at least 10 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authApi.patch(`/transactions/${transaction._id}/reject`, {
        reason: rejectionReason.trim()
      });
      setSuccess(true);
      setTimeout(() => {
        onReviewComplete();
      }, 1500);
    } catch (err) {
      console.error('Error rejecting transaction:', err);
      setError(err.response?.data?.error || 'Failed to reject transaction');
      setLoading(false);
    }
  };


  if (success) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content success-modal" onClick={e => e.stopPropagation()}>
          <div className="text-center py-4">
            <CheckCircle size={64} className="text-success mb-3" />
            <h3 className="text-success mb-2">Success!</h3>
            <p className="text-muted">Transaction has been {action === 'accept' ? 'accepted' : 'rejected'}.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content transaction-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h4 className="mb-0">
            {isPending ? 'Review Transaction' : 'Transaction Details'}
          </h4>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Customer Info */}
          <div className="info-section">
            <h6 className="section-title">
              <User size={18} className="me-2" />
              Customer Information
            </h6>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{transaction.userId?.fullName || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Account Number</span>
                <span className="info-value masked-value">
                  {maskAccountNumber(transaction.userId?.accountNumber)}
                  <span className="privacy-badge ms-2">
                    <i className="bi bi-shield-check"></i> Masked
                  </span>
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">ID Number</span>
                <span className="info-value masked-value">
                  {maskIdNumber(transaction.userId?.idNumber)}
                  <span className="privacy-badge ms-2">
                    <i className="bi bi-shield-check"></i> POPIA
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="info-section">
            <h6 className="section-title">
              <DollarSign size={18} className="me-2" />
              Transaction Details
            </h6>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Amount</span>
                <span className="info-value amount">
                  {formatCurrency(transaction.amount, transaction.currency)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Currency</span>
                <span className="info-value">{transaction.currency}</span>
              </div>
              <div className="info-item">
                <span className="info-label">SWIFT Code</span>
                <code className="swift-code">{formatSwift(transaction.swift)}</code>
              </div>
              <div className="info-item">
                <span className="info-label">Submitted</span>
                <span className="info-value">
                  <Calendar size={14} className="me-1" />
                  {formatDate(transaction.createdAt)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className={`badge bg-${transaction.status === 'pending' ? 'warning' : transaction.status === 'accepted' ? 'success' : 'danger'}`}>
                  {transaction.status.toUpperCase()}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Transaction ID</span>
                <code className="transaction-id">{transaction._id}</code>
              </div>
            </div>
          </div>

          {/* Review Info (if already reviewed) */}
          {transaction.reviewedBy && (
            <div className="info-section review-section">
              <h6 className="section-title">
                <CreditCard size={18} className="me-2" />
                Review Information
              </h6>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Reviewed By</span>
                  <span className="info-value">{transaction.reviewedBy}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Review Date</span>
                  <span className="info-value">{formatDate(transaction.reviewedAt)}</span>
                </div>
                {transaction.rejectionReason && (
                  <div className="info-item full-width">
                    <span className="info-label">Rejection Reason</span>
                    <div className="rejection-reason">
                      <AlertTriangle size={16} className="me-2" />
                      {transaction.rejectionReason}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center">
              <AlertTriangle size={20} className="me-2" />
              {error}
            </div>
          )}

          {/* Action Selection (for pending transactions) */}
          {isPending && !action && (
            <div className="action-section">
              <h6 className="section-title mb-3">Select Action</h6>
              <div className="action-buttons">
                <button 
                  className="btn btn-success btn-lg"
                  onClick={() => setAction('accept')}
                  disabled={loading}
                >
                  <CheckCircle size={20} className="me-2" />
                  Accept Transaction
                </button>
                <button 
                  className="btn btn-danger btn-lg"
                  onClick={() => setAction('reject')}
                  disabled={loading}
                >
                  <XCircle size={20} className="me-2" />
                  Reject Transaction
                </button>
              </div>
            </div>
          )}

          {/* Rejection Reason Input */}
          {action === 'reject' && (
            <div className="rejection-form">
              <label htmlFor="rejectionReason" className="form-label">
                Rejection Reason <span className="text-danger">*</span>
              </label>
              <textarea
                id="rejectionReason"
                className="form-control"
                rows="4"
                placeholder="Enter the reason for rejecting this transaction (minimum 10 characters)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                disabled={loading}
              />
              <small className="text-muted">
                {rejectionReason.length} / 10 characters minimum
              </small>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {!action && (
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          )}

          {action === 'accept' && (
            <>
              <button 
                className="btn btn-secondary" 
                onClick={() => setAction(null)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-success" 
                onClick={handleAccept}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="me-2" />
                    Confirm Accept
                  </>
                )}
              </button>
            </>
          )}

          {action === 'reject' && (
            <>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setAction(null);
                  setRejectionReason('');
                  setError(null);
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleReject}
                disabled={loading || rejectionReason.trim().length < 10}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle size={16} className="me-2" />
                    Confirm Reject
                  </>
                )}
              </button>
            </>
          )}
        </div>

        <style jsx>{`
          .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1050;
            padding: 20px;
          }

          .modal-content {
            background: var(--color-dark-bg);
            border: 1px solid var(--color-primary-green);
            border-radius: 16px;
            width: 100%;
            max-width: 700px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          }

          .success-modal {
            max-width: 400px;
          }

          .modal-header {
            padding: 20px 24px;
            border-bottom: 1px solid rgba(40, 167, 69, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .modal-header h4 {
            color: var(--color-primary-green);
            margin: 0;
          }

          .btn-close-modal {
            background: transparent;
            border: none;
            color: var(--color-text-muted);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;
          }

          .btn-close-modal:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
          }

          .modal-body {
            padding: 24px;
          }

          .info-section {
            margin-bottom: 24px;
            padding: 16px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            border-left: 3px solid var(--color-primary-green);
          }

          .review-section {
            border-left-color: var(--color-secondary-purple);
          }

          .section-title {
            color: var(--color-primary-green);
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            font-weight: 600;
          }

          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
          }

          .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .info-item.full-width {
            grid-column: 1 / -1;
          }

          .info-label {
            font-size: 0.85em;
            color: var(--color-text-muted);
            font-weight: 500;
          }

          .info-value {
            color: white;
            font-weight: 500;
          }

          .info-value.amount {
            color: var(--color-primary-green);
            font-size: 1.5em;
            font-weight: 700;
          }

          .swift-code, .transaction-id {
            background: rgba(0, 0, 0, 0.3);
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 0.9em;
            color: var(--color-primary-green);
            display: inline-block;
          }

          .rejection-reason {
            background: rgba(220, 53, 69, 0.1);
            border: 1px solid rgba(220, 53, 69, 0.3);
            padding: 12px;
            border-radius: 6px;
            color: #ff6b6b;
            display: flex;
            align-items: start;
          }

          .masked-value {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .privacy-badge {
            font-size: 0.7em;
            background: rgba(40, 167, 69, 0.1);
            color: var(--color-primary-green);
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 500;
          }

          .action-section {
            margin-top: 24px;
          }

          .action-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .rejection-form {
            margin-top: 16px;
          }

          .rejection-form textarea {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            resize: vertical;
          }

          .rejection-form textarea:focus {
            background: rgba(0, 0, 0, 0.4);
            border-color: var(--color-primary-green);
            color: white;
            box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
          }

          .modal-footer {
            padding: 20px 24px;
            border-top: 1px solid rgba(40, 167, 69, 0.2);
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }

          @media (max-width: 768px) {
            .action-buttons {
              grid-template-columns: 1fr;
            }

            .info-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default TransactionModal;

