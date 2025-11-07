// frontend/src/pages/ErrorPage.js
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

// The 'type' prop is optional, used for cases like a 404 error path.
const ErrorPage = ({ type }) => {
    // useLocation hook to check if any navigation state was passed (e.g., an error message)
    const location = useLocation();
    
    // Get a custom message if navigated to from a failure (e.g., failed payment submission)
    const customMessage = location.state?.message;

    let title = 'Transaction Processing Failed';
    let message = customMessage || 'We encountered an unexpected issue while processing your request. Please try again.';
    let iconClass = 'bi-exclamation-triangle-fill';

    if (type === '404') {
        title = '404 - Page Not Found';
        message = 'The page you are looking for does not exist on this portal.';
        iconClass = 'bi-x-octagon-fill';
    }

    return (
        <div className="container">
            <div className="row justify-content-center my-5">
                <div className="col-md-8 col-lg-6 text-center">
                    
                    <div 
                        className="card shadow-lg p-5" 
                        // Custom style: Lighter dark background with an ORANGE border for warning
                        style={{backgroundColor: 'var(--color-light-bg)', border: '2px solid var(--color-secondary-orange)'}}
                    >
                        <div className="card-body">
                            
                            {/* Error Icon (Styled with Orange) */}
                            <i 
                                className={`bi ${iconClass} mb-4`} 
                                style={{color: 'var(--color-secondary-orange)', fontSize: '4.5rem'}}
                            ></i>

                            <h2 className="card-title fw-bold mb-3" style={{color: 'var(--color-secondary-orange)'}}>
                                {title}
                            </h2>
                            
                            <p className="lead" style={{color: 'var(--color-text-light)'}}>{message}</p>
                            
                            <p className="text-muted small mt-4 mb-4">
                                If this persists, please contact support. Do not attempt payment repeatedly.
                            </p>
                            
                            {/* Action Buttons */}
                            <div className="d-grid gap-2 d-md-block">
                                {/* Link to try payment again (Orange button) */}
                                <Link to="/portal" className="btn btn-warning btn-lg mt-3 py-2 px-4 me-md-3">
                                    <i className="bi bi-arrow-clockwise me-2"></i> Try Payment Again
                                </Link>
                                
                                {/* Link back to safe home page (Blue button) */}
                                <Link to="/" className="btn btn-primary btn-lg mt-3 py-2 px-4">
                                    <i className="bi bi-house-door me-2"></i> Go to Home
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