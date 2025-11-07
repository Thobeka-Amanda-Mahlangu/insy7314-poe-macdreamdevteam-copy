// frontend/src/pages/PortalPage.js
import React from 'react';
import PaymentForm from '../forms/PaymentForm'; // Import the secure Payment Form
import { useAuth } from '../context/AuthContext'; 

const PortalPage = () => {
    // Access user details from context. This is crucial for personalization.
    const { user } = useAuth(); 

    // Determine the username to display (defaulting if not yet loaded)
    const displayUsername = user?.username || 'Customer';

    return (
        <div className="container">
            <div className="row justify-content-center my-5">
                <div className="col-lg-8 col-xl-7">
                    
                    {/* Main Card/Container for the Portal */}
                    <div 
                        className="card shadow-lg" 
                        style={{backgroundColor: 'var(--color-light-bg)', border: '1px solid var(--color-primary-blue)'}}
                    >
                        
                        {/* Card Header (Styled with Blue Primary Color) */}
                        <div 
                            className="card-header" 
                            style={{backgroundColor: 'var(--color-primary-blue)', color: 'white'}}
                        >
                            <h1 className="h4 mb-0 fw-bold">
                                <i className="bi bi-currency-exchange me-2"></i> 
                                Customer International Payment Portal
                            </h1>
                        </div>
                        
                        <div className="card-body p-4">
                            
                            {/* Welcome/Session Message */}
                            <p 
                                className="alert mb-4" 
                                style={{
                                    backgroundColor: 'var(--color-dark-bg)', 
                                    border: '1px solid var(--color-secondary-orange)',
                                    color: 'var(--color-text-light)'
                                }}
                            >
                                <i className="bi bi-check-circle-fill me-2" style={{color: 'var(--color-secondary-orange)'}}></i>
                                Welcome, **{displayUsername}**! Your session is secure and authenticated. 
                                Please use the form below to initiate your international payment via SWIFT.
                            </p>
                            
                            {/* 🔑 SECURITY CRITICAL: Render the Payment Form */}
                            {/* The PaymentForm component itself contains the validation logic */}
                            <PaymentForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortalPage;