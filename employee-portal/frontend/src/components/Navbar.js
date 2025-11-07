// frontend/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'var(--color-dark-bg)', borderBottom: '2px solid var(--color-primary-green)' }}>
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <Shield size={28} className="me-2" style={{ color: 'var(--color-primary-green)' }} />
          <span style={{ fontWeight: '700', color: 'var(--color-primary-green)' }}>
            Employee Portal
          </span>
        </Link>

        {/* Toggle button for mobile */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Home Link */}
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house-door me-1"></i>
                Home
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                {/* Dashboard Link */}
                <li className="nav-item">
                  <Link className="nav-link" to="/portal">
                    <i className="bi bi-speedometer2 me-1"></i>
                    Dashboard
                  </Link>
                </li>

                {/* User Info */}
                <li className="nav-item">
                  <span className="nav-link user-info">
                    <User size={18} className="me-1" />
                    <span className="d-none d-lg-inline">
                      {user?.fullName || user?.employeeId || 'Employee'}
                    </span>
                  </span>
                </li>

                {/* Logout */}
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="me-1" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              /* Login Link */
              <li className="nav-item">
                <Link className="btn btn-outline-success btn-sm ms-2" to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .nav-link {
          color: rgba(255, 255, 255, 0.7) !important;
          transition: color 0.2s;
          font-weight: 500;
        }

        .nav-link:hover {
          color: var(--color-primary-green) !important;
        }

        .nav-link.active {
          color: var(--color-primary-green) !important;
        }

        .user-info {
          display: flex;
          align-items: center;
          color: var(--color-primary-green) !important;
          background: rgba(40, 167, 69, 0.1);
          padding: 6px 12px;
          border-radius: 6px;
          margin: 0 8px;
        }

        .btn-outline-danger {
          border-color: #dc3545;
          color: #dc3545;
        }

        .btn-outline-danger:hover {
          background: #dc3545;
          color: white;
        }

        .btn-outline-success {
          border-color: var(--color-primary-green);
          color: var(--color-primary-green);
        }

        .btn-outline-success:hover {
          background: var(--color-primary-green);
          color: white;
        }

        @media (max-width: 991px) {
          .user-info {
            margin: 8px 0;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
