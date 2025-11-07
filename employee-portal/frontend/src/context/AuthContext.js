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
import { publicApi, authApi } from '../api/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Login function
    const login = async (credentials) => {
        try {
            const response = await publicApi.post('/auth/login', credentials);
            
            const { token, user: userData } = response.data;
            
            // Store token
            localStorage.setItem('accessToken', token);
            
            setUser(userData);
            setIsAuthenticated(true);
            
            // Redirect to portal
            navigate('/portal'); 
            
            return response.data;
        } catch (error) {
            console.error('Login failed:', error.response || error);
            throw error; 
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };
    
    // Check for existing token on initial load
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
             setIsAuthenticated(true);
             setUser({ username: 'Employee' }); 
        }
    }, []);

    const value = {
        user,
        isAuthenticated,
        login,
        logout,
        authApi,
        publicApi
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
