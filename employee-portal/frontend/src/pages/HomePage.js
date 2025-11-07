// frontend/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, CheckCircle, Clock, Eye, TrendingUp } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto text-center">
          <Shield size={80} className="mb-4" style={{ color: 'var(--color-primary-green)' }} />
          <h1 className="display-4 mb-3" style={{ color: 'var(--color-primary-green)', fontWeight: '700' }}>
            Employee Payment Portal
          </h1>
          <p className="lead text-muted mb-4">
            Secure transaction review and approval system for authorized personnel
          </p>
          
          {!isAuthenticated ? (
            <Link to="/login" className="btn btn-primary btn-lg px-5 py-3">
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Employee Login
            </Link>
          ) : (
            <Link to="/portal" className="btn btn-primary btn-lg px-5 py-3">
              <i className="bi bi-speedometer2 me-2"></i>
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-3">
          <div className="feature-card text-center p-4">
            <div className="feature-icon mb-3">
              <Eye size={40} />
            </div>
            <h5 className="mb-2">Review Transactions</h5>
            <p className="text-muted small mb-0">
              View and review all pending international payment transactions
            </p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="feature-card text-center p-4">
            <div className="feature-icon mb-3">
              <CheckCircle size={40} />
            </div>
            <h5 className="mb-2">Accept Payments</h5>
            <p className="text-muted small mb-0">
              Approve verified transactions for processing
            </p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="feature-card text-center p-4">
            <div className="feature-icon mb-3">
              <Clock size={40} />
            </div>
            <h5 className="mb-2">Real-time Updates</h5>
            <p className="text-muted small mb-0">
              Instant transaction status updates and notifications
            </p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="feature-card text-center p-4">
            <div className="feature-icon mb-3">
              <TrendingUp size={40} />
            </div>
            <h5 className="mb-2">Analytics Dashboard</h5>
            <p className="text-muted small mb-0">
              Track acceptance rates and transaction statistics
            </p>
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="security-notice p-4">
            <div className="d-flex align-items-start">
              <Shield size={24} className="me-3 mt-1" style={{ color: 'var(--color-primary-green)', flexShrink: 0 }} />
              <div>
                <h5 className="mb-2" style={{ color: 'var(--color-primary-green)' }}>
                  Secure Authentication
                </h5>
                <p className="text-muted mb-2">
                  This portal uses enterprise-grade security including:
                </p>
                <ul className="text-muted small mb-0">
                  <li>JWT token-based authentication with 15-minute expiration</li>
                  <li>Bcrypt password hashing with 12 rounds of salting</li>
                  <li>HTTPS/TLS encryption for all communications</li>
                  <li>CSRF protection on all state-changing operations</li>
                  <li>Rate limiting to prevent brute force attacks</li>
                  <li>Complete audit trail for all employee actions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Info */}
      <div className="row mt-4">
        <div className="col-lg-8 mx-auto text-center">
          <p className="text-muted small">
            <i className="bi bi-info-circle me-1"></i>
            Employee accounts are created by administrators. If you need access, please contact your system administrator.
          </p>
        </div>
      </div>

      <style jsx>{`
        .feature-card {
          background: var(--color-light-bg);
          border: 1px solid rgba(40, 167, 69, 0.2);
          border-radius: 12px;
          transition: all 0.3s ease;
          height: 100%;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-primary-green);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .feature-icon {
          color: var(--color-primary-green);
          display: inline-block;
        }

        .feature-card h5 {
          color: var(--color-primary-green);
          font-weight: 600;
        }

        .security-notice {
          background: rgba(40, 167, 69, 0.05);
          border: 1px solid rgba(40, 167, 69, 0.2);
          border-radius: 12px;
        }

        .security-notice ul {
          list-style: none;
          padding-left: 0;
        }

        .security-notice li {
          padding: 4px 0;
          padding-left: 20px;
          position: relative;
        }

        .security-notice li:before {
          content: "✓";
          color: var(--color-primary-green);
          font-weight: bold;
          position: absolute;
          left: 0;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
