// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Core Security & State
import { AuthProvider, useAuth } from './context/AuthContext'; 

// Import components and pages
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PortalPage from './pages/PortalPage';
import ErrorPage from './pages/ErrorPage';

// Component to protect routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Route */}
            <Route 
              path="/portal" 
              element={
                <ProtectedRoute>
                  <PortalPage /> 
                </ProtectedRoute>
              } 
            />
            
            {/* Error pages */}
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage type="404" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
