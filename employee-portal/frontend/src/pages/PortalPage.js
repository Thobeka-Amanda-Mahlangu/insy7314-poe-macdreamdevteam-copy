// frontend/src/pages/PortalPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TransactionCard from '../components/TransactionCard';
import TransactionModal from '../components/TransactionModal';
import { RefreshCw, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { sanitizeTransactions } from '../utils/sanitize';

const PortalPage = () => {
  const { user, authApi } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'accepted', 'rejected'
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch transactions
  const fetchTransactions = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    else setLoading(true);
    
    setError(null);

    try {
      // Fetch based on filter
      const endpoint = filter === 'pending' ? '/transactions/pending' : '/transactions';
      const response = await authApi.get(endpoint);
      
      // Sanitize all transaction data to prevent XSS
      const rawTransactions = response.data.transactions || response.data;
      const sanitizedTransactions = sanitizeTransactions(rawTransactions);
      
      setTransactions(sanitizedTransactions);
      
      // If showing all, filter on client side for other views
      if (filter !== 'pending' && filter !== 'all') {
        const filtered = sanitizedTransactions.filter(
          t => t.status === filter
        );
        setTransactions(filtered);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await authApi.get('/transactions/stats/summary');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTransactions();
    fetchStats();
    // eslint-disable-next-line
  }, [filter]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTransactions(true);
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [filter]);

  // Handle transaction review
  const handleReview = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // Handle accept/reject from modal
  const handleReviewComplete = () => {
    setSelectedTransaction(null);
    fetchTransactions(true);
    fetchStats();
  };

  // Manual refresh
  const handleRefresh = () => {
    fetchTransactions(true);
    fetchStats();
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1" style={{ color: 'var(--color-primary-green)' }}>
                <i className="bi bi-speedometer2 me-2"></i>
                Employee Dashboard
              </h1>
              <p className="text-muted mb-0">
                Welcome back, {user?.fullName || user?.employeeId || 'Employee'}
              </p>
            </div>
            <button 
              className="btn btn-outline-light"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw size={18} className={refreshing ? 'spinning' : ''} />
              <span className="ms-2">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card stat-card bg-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white-50 mb-1">Total Transactions</h6>
                  <h2 className="text-white mb-0">{stats.total}</h2>
                </div>
                <CheckCircle size={40} className="text-white opacity-50" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card stat-card bg-warning">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-dark mb-1">Pending Review</h6>
                  <h2 className="text-dark mb-0">{stats.pending}</h2>
                </div>
                <Clock size={40} className="text-dark opacity-50" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card stat-card bg-success">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white-50 mb-1">Accepted</h6>
                  <h2 className="text-white mb-0">{stats.accepted}</h2>
                </div>
                <CheckCircle size={40} className="text-white opacity-50" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card stat-card bg-danger">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white-50 mb-1">Rejected</h6>
                  <h2 className="text-white mb-0">{stats.rejected}</h2>
                </div>
                <XCircle size={40} className="text-white opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="row mb-3">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                <Clock size={16} className="me-1" />
                Pending ({stats.pending})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Transactions ({stats.total})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${filter === 'accepted' ? 'active' : ''}`}
                onClick={() => setFilter('accepted')}
              >
                <CheckCircle size={16} className="me-1" />
                Accepted ({stats.accepted})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${filter === 'rejected' ? 'active' : ''}`}
                onClick={() => setFilter('rejected')}
              >
                <XCircle size={16} className="me-1" />
                Rejected ({stats.rejected})
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-danger d-flex align-items-center">
              <AlertCircle size={20} className="me-2" />
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="row">
        <div className="col-12">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-5">
              <AlertCircle size={48} className="text-muted mb-3" />
              <h4 className="text-muted">No transactions found</h4>
              <p className="text-muted">
                {filter === 'pending' 
                  ? 'There are no pending transactions to review.' 
                  : `No ${filter} transactions available.`}
              </p>
            </div>
          ) : (
            <div className="row">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="col-md-6 col-lg-4 mb-3">
                  <TransactionCard 
                    transaction={transaction} 
                    onReview={handleReview}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Review Modal */}
      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onReviewComplete={handleReviewComplete}
        />
      )}

      <style jsx>{`
        .stat-card {
          border: none;
          border-radius: 12px;
          transition: transform 0.2s;
        }
        
        .stat-card:hover {
          transform: translateY(-2px);
        }

        .nav-tabs .nav-link {
          color: var(--color-text-muted);
          border: none;
          background: transparent;
        }

        .nav-tabs .nav-link:hover {
          color: var(--color-primary-green);
          border-color: transparent;
        }

        .nav-tabs .nav-link.active {
          color: var(--color-primary-green);
          background: var(--color-light-bg);
          border-bottom: 2px solid var(--color-primary-green);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PortalPage;
