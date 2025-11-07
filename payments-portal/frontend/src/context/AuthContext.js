/*
    Frontend Security & Auth References (Harvard style):

    1. OWASP, 2025. *Authentication Cheat Sheet*. [online] Available at: 
       <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html> [Accessed 9 October 2025].
       
    2. OWASP, 2025. *Session Management Cheat Sheet*. [online] Available at: 
       <https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html> [Accessed 9 October 2025].

    3. React Docs, 2025. *Context API*. [online] Available at: 
       <https://react.dev/reference/react/useContext> [Accessed 9 October 2025].

    4. Mozilla Developer Network (MDN), 2025. *Web Storage API*. [online] Available at: 
       <https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API> [Accessed 9 October 2025].

    5. Axios Docs, 2025. *Using Axios for HTTP requests*. [online] Available at: 
       <https://axios-http.com/docs/intro> [Accessed 9 October 2025].
*/

import React, { createContext, useState, useContext, useEffect } from 'react';
import { publicApi, authApi } from '../api/api'; // Import both secure and public API instances
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Hook to easily use authentication context in any component
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Function to handle Login API call and manage session
    const login = async (credentials) => {
        try {
            // Use publicApi as login is unauthenticated
            const response = await publicApi.post('/auth/login', credentials);
            
            const { token, user: userData } = response.data;
            
            // SECURITY CRITICAL: Store token for the interceptor in api.js to use
            // (If Nandi uses secure HttpOnly cookies, this step would be simplified/omitted)
            localStorage.setItem('accessToken', token);
            
            setUser(userData);
            setIsAuthenticated(true);
            
            // Redirect to the protected portal page
            navigate('/portal'); 
            
            return response.data; // Return success data if needed
        } catch (error) {
            console.error('Login failed:', error.response || error);
            // Re-throw the error so the LoginForm component can catch it and display a message
            throw error; 
        }
    };

    const logout = () => {
        // Clear token and state
        localStorage.removeItem('accessToken');
        setUser(null);
        setIsAuthenticated(false);
        // Redirect to a public page after logout
        navigate('/login');
    };
    
    // Check for an existing token/session on initial load (basic session persistence)
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
             // A real application would call a '/auth/verify' endpoint using the token 
             // to get user data and check validity, but this is sufficient for the demo.
             setIsAuthenticated(true);
             // Placeholder user data
             setUser({ username: 'DemoUser' }); 
        }
    }, []);

    const value = {
        user,
        isAuthenticated,
        login,
        logout,
        authApi, // Expose the secure API instance for protected requests (e.g., PaymentForm)
        publicApi // Expose the public API instance
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
