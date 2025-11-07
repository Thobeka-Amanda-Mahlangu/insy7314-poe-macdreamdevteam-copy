import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const ConfirmationPage = () => {
  const location = useLocation();
  const transaction = location.state?.transaction;

  if (!transaction) {
    return (
      <div className="container text-center my-5">
        <h3 style={{ color: 'red' }}>No transaction details found.</h3>
        <Link to="/portal" className="btn btn-primary mt-3">Back to Portal</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center my-5">
        <div className="col-md-8 col-lg-6 text-center">
          <div 
            className="card shadow-lg p-5" 
            style={{ backgroundColor: 'var(--color-light-bg)', border: '2px solid var(--color-primary-blue)' }}
          >
            <div className="card-body">
              <i 
                className="bi bi-check-circle-fill mb-4" 
                style={{ color: 'var(--color-primary-blue)', fontSize: '4.5rem' }}
              ></i>

              <h2 className="card-title fw-bold mb-3" style={{ color: 'var(--color-primary-blue)' }}>
                Transaction Submitted Successfully!
              </h2>

              <p className="lead" style={{ color: 'var(--color-text-light)' }}>
                Your international payment request has been sent for processing via SWIFT.
              </p>

              {/* Reference ID */}
              <div 
                className="p-3 my-4 rounded" 
                style={{
                  backgroundColor: 'var(--color-dark-bg)', 
                  color: 'var(--color-secondary-orange)',
                  border: '1px dashed var(--color-secondary-orange)'
                }}
              >
                <p className="mb-1 fw-bold small">CONFIRMATION REFERENCE ID:</p>
                <p className="h4">{transaction._id}</p>
              </div>

              {/* Transaction details */}
              <ul className="list-group mb-4 text-start">
                <li className="list-group-item">
                  <strong>Amount:</strong> {transaction.amount} {transaction.currency}
                </li>
                <li className="list-group-item">
                  <strong>SWIFT Code:</strong> {transaction.swift}
                </li>
                <li className="list-group-item">
                  <strong>Status:</strong> {transaction.status}
                </li>
                <li className="list-group-item">
                  <strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString()}
                </li>
              </ul>

              <p className="small text-muted mb-4">Please keep this confirmation for your records.</p>

              <div className="d-grid gap-2 d-md-block">
                <Link to="/portal" className="btn btn-primary btn-lg mt-3 py-2 px-4 me-md-3">
                  <i className="bi bi-wallet me-2"></i> Make Another Payment
                </Link>
                <Link to="/" className="btn btn-outline-success btn-lg mt-3 py-2 px-4">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;