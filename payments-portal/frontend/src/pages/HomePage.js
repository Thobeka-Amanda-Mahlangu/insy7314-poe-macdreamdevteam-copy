// frontend/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

// Attribution for imported image: (FavPNG, n.d.) 
// Source: https://favpng.com/png_view/payment-gateway-icon-payment-gateway-e-commerce-payment-system-png/HfyJJDXS
import paymentHero from '../assets/secure.png'; 

const HomePage = () => {
  return (
    <div className="container py-5 my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8 text-center">

          {/* 1. MAIN HEADING - Always at the top */}
          <h1 className="display-4 fw-bold mb-4" style={{ color: 'var(--color-primary-blue)' }}>
            <i className="bi bi-bank me-3"></i>
            Welcome to Your Secure Global Payment Hub
          </h1>

          {/* 2. STORY/INTRODUCTION TEXT */}
          <p className="lead mx-auto mb-5" style={{ color: 'var(--color-text-light)', maxWidth: '800px' }}>
            Here, you can effortlessly manage your international transactions with unparalleled security and speed.
            Our platform ensures every payment is protected by robust encryption and compliance standards, making global finance simple and secure.
          </p>
          
          {/* 3. CONTAINED IMAGE - Image size and placement fixed */}
          <div className="d-flex justify-content-center my-5">
            <img 
              src={paymentHero} 
              className="img-fluid rounded-3 shadow-lg" 
              alt="Secure Online Payments Illustration" 
              style={{ 
                maxWidth: '400px', 
                height: 'auto', 
                border: '4px solid var(--color-secondary-orange)', /* Orange border for pop */
                boxShadow: '0 0 40px rgba(255, 193, 7, 0.5)' /* Orange glow */
              }} 
            />
          </div>

          <p className="lead mb-4" style={{ color: 'var(--color-secondary-orange)' }}>
            Join us today for a truly seamless and protected financial experience.
          </p>
          
          {/* 4. ACTION BUTTONS - Centered and prominent */}
          <div className="d-flex justify-content-center gap-4 mt-5">
            <Link to="/login" className="btn btn-primary btn-lg px-5 py-3 shadow-lg">
              <i className="bi bi-person-lock me-2"></i> 
              Customer Login
            </Link>
            <Link to="/register" className="btn btn-outline-success btn-lg px-5 py-3 shadow-lg">
              <i className="bi bi-person-plus me-2"></i> 
              New Customer Registration
            </Link>
          </div>

          {/* 5. SECURITY FOOTER */}
          <div className="mt-5 pt-4 border-top" style={{ borderColor: 'var(--color-text-muted)' }}>
            <p className="small fst-italic" style={{ color: 'var(--color-text-muted)' }}>
              <i className="bi bi-shield-fill-check me-2" style={{ color: 'var(--color-secondary-orange)' }}></i>
              **Security Guarantee:** All processes use **token-based session validation**, SSL/TLS encryption, and **input whitelisting** for your complete protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;