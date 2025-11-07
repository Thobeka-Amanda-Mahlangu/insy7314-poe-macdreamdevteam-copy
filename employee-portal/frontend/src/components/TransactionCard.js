// frontend/src/components/TransactionCard.js
import React from 'react';
import { CheckCircle, XCircle, Clock, DollarSign, Calendar, User } from 'lucide-react';
import { maskAccountNumber, formatCurrency, formatDate, formatRelativeTime } from '../utils/formatters';

const TransactionCard = ({ transaction, onReview }) => {
  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'warning', icon: Clock, text: 'Pending Review' },
      accepted: { bg: 'success', icon: CheckCircle, text: 'Accepted' },
      rejected: { bg: 'danger', icon: XCircle, text: 'Rejected' }
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`badge bg-${badge.bg} d-flex align-items-center gap-1`}>
        <Icon size={14} />
        {badge.text}
      </span>
    );
  };


  return (
    <div className="card transaction-card h-100">
      <div className="card-body">
        {/* Header with Status */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h6 className="card-subtitle text-muted mb-1">
              <User size={14} className="me-1" />
              {transaction.userId?.fullName || 'Unknown User'}
            </h6>
            <small className="text-muted">
              Account: {maskAccountNumber(transaction.userId?.accountNumber)}
            </small>
          </div>
          {getStatusBadge(transaction.status)}
        </div>

        {/* Amount */}
        <div className="mb-3">
          <div className="d-flex align-items-center mb-1">
            <DollarSign size={18} className="text-primary me-1" />
            <small className="text-muted">Amount</small>
          </div>
          <h3 className="mb-0 text-primary">
            {formatCurrency(transaction.amount, transaction.currency)}
          </h3>
          <small className="text-muted">{transaction.currency}</small>
        </div>

        {/* SWIFT Code */}
        <div className="mb-3">
          <small className="text-muted d-block mb-1">SWIFT Code</small>
          <code className="swift-code">{transaction.swift}</code>
        </div>

        {/* Date */}
        <div className="mb-3">
          <Calendar size={14} className="text-muted me-1" />
          <small className="text-muted" title={formatDate(transaction.createdAt)}>
            {formatRelativeTime(transaction.createdAt)}
          </small>
        </div>

        {/* Review Info (if reviewed) */}
        {transaction.reviewedBy && (
          <div className="review-info p-2 rounded mb-3">
            <small className="text-muted d-block mb-1">
              <strong>Reviewed by:</strong> {transaction.reviewedBy}
            </small>
            <small className="text-muted d-block">
              <strong>On:</strong> {formatDate(transaction.reviewedAt)}
            </small>
            {transaction.rejectionReason && (
              <small className="text-danger d-block mt-1">
                <strong>Reason:</strong> {transaction.rejectionReason}
              </small>
            )}
          </div>
        )}

        {/* Action Button */}
        {transaction.status === 'pending' && (
          <button
            className="btn btn-primary w-100"
            onClick={() => onReview(transaction)}
          >
            <CheckCircle size={16} className="me-1" />
            Review Transaction
          </button>
        )}

        {transaction.status !== 'pending' && (
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => onReview(transaction)}
          >
            View Details
          </button>
        )}
      </div>

      <style jsx>{`
        .transaction-card {
          background: var(--color-light-bg);
          border: 1px solid rgba(40, 167, 69, 0.2);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .transaction-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          border-color: var(--color-primary-green);
        }

        .swift-code {
          background: rgba(0, 0, 0, 0.2);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.9em;
          color: var(--color-primary-green);
        }

        .review-info {
          background: rgba(0, 0, 0, 0.1);
          border-left: 3px solid var(--color-primary-green);
        }

        .badge {
          padding: 6px 12px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default TransactionCard;

