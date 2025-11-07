// frontend/src/pages/ErrorPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = ({ type = 'generic' }) => {
  const is404 = type === '404';

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-8 col-lg-6 text-center">
          <div 
            className="card shadow-lg p-5" 
            style={{backgroundColor: 'var(--color-light-bg)', border: '1px solid #dc3545'}}
          >
            <div className="card-body">
              {is404 ? (
                <>
                  <i className="bi bi-exclamation-triangle" style={{fontSize: '5rem', color: '#dc3545'}}></i>
                  <h1 className="display-4 mt-4 text-white">404 - Page Not Found</h1>
                  <p className="lead text-muted mt-3">
                    The page you are looking for doesn't exist or has been moved.
                  </p>
                </>
              ) : (
                <>
                  <i className="bi bi-x-circle" style={{fontSize: '5rem', color: '#dc3545'}}></i>
                  <h1 className="display-4 mt-4 text-white">Oops! Something went wrong</h1>
                  <p className="lead text-muted mt-3">
                    An unexpected error occurred. Please try again later.
                  </p>
                </>
              )}
              
              <div className="mt-5">
                <Link to="/" className="btn btn-primary btn-lg px-4">
                  <i className="bi bi-house-door me-2"></i>
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
