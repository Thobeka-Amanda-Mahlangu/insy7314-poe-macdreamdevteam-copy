/*
    Frontend Security & UI References (Harvard style):

    1. OWASP, 2025. *Cross-Site Scripting (XSS) Prevention Cheat Sheet*. [online] Available at: 
       <https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html> [Accessed 9 October 2025].
       
    2. OWASP, 2025. *Authentication Cheat Sheet*. [online] Available at: 
       <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html> [Accessed 9 October 2025].

    3. React Docs, 2025. *Context API*. [online] Available at: 
       <https://react.dev/reference/react/useContext> [Accessed 9 October 2025].

    4. Bootstrap, 2025. *Navbar Component*. [online] Available at: 
       <https://getbootstrap.com/docs/5.3/components/navbar/> [Accessed 9 October 2025].
       
    5. Mozilla Developer Network (MDN), 2025. *Accessible Rich Internet Applications (ARIA) Basics*. [online] Available at: 
       <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA> [Accessed 9 October 2025].
*/

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import context for state/logout

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    // Navbar uses near-black background (set in index.css) and blue border accent
    <nav className="navbar navbar-expand-lg" style={{backgroundColor: '#0d0d0d'}}>
      <div className="container-fluid container-xl">
        
        {/* Logo/Brand (Links to Home) */}
        <Link className="navbar-brand fw-bold" to="/" style={{color: 'var(--color-primary-blue)', fontSize: '1.4rem'}}>
          <i className="bi bi-shield-lock-fill me-2"></i>
          Secure Portal Bank
        </Link>
        
        {/* Toggle button for mobile (needed for responsive Bootstrap navbar) */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          {/* Custom toggler icon to match dark theme */}
          <span className="navbar-toggler-icon" style={{backgroundColor: 'var(--color-text-light)'}}></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            
            {/* If authenticated (logged in) */}
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/portal" style={{color: 'var(--color-text-light)'}}>
                    <i className="bi bi-wallet me-1"></i> Payment Portal
                  </Link>
                </li>
                <li className="nav-item">
                  {/* Logout Button (Styled with orange accent) */}
                  <button 
                    className="btn btn-sm btn-outline-warning ms-lg-3" // Using outline-warning for orange
                    onClick={logout}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                  </button>
                </li>
              </>
            ) : (
              // If not authenticated (logged out/guest)
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" style={{color: 'var(--color-text-light)'}}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  {/* Register Link (Styled with blue accent) */}
                  <Link className="btn btn-sm btn-primary ms-lg-3" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
