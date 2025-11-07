// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Core Security & State
import { AuthProvider, useAuth } from './context/AuthContext'; 

// 2. Import all required components and pages
// NOTE: You still need to create simple versions of these files in their respective folders!
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PortalPage from './pages/PortalPage';        // The secure customer portal
import ConfirmationPage from './pages/ConfirmationPage';
import ErrorPage from './pages/ErrorPage';

// Component to protect routes (Core Security Feature)
// This fulfills the "Enforce token-based session validation" task.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // If the user is NOT authenticated, redirect them to the login page.
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      {/* AuthProvider wraps the entire app to provide login/logout state and the secure API instance */}
      <AuthProvider>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            {/* Public Routes: Accessible without a login */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* 🔑 PROTECTED ROUTE 🔑 */}
            <Route 
              path="/portal" 
              element={
                <ProtectedRoute>
                  {/* Only users with a valid token can access the PortalPage (where PaymentForm is) */}
                  <PortalPage /> 
                </ProtectedRoute>
              } 
            />
            
            {/* Simple feedback pages */}
            <Route path="/confirm" element={<ConfirmationPage />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage type="404" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;