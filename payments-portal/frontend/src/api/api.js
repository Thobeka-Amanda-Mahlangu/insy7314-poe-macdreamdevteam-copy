// frontend/src/api/api.js
import axios from 'axios';

// --- 1. Utility Function to Read Cookies (Needed for CSRF Token) ---
// This function assumes Nandi's backend sends the CSRF token (XSRF-TOKEN) in a cookie.
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// --- 2. Public API Instance (For Login/Registration) ---
export const publicApi = axios.create({
    // FIX APPLIED HERE: Changed VITE syntax to CRA syntax
    baseURL: process.env.REACT_APP_API_URL || 'https://localhost:5001/api', 
    withCredentials: true,
});


// --- 3. Authenticated API Instance (For Payment/Portal Actions) ---
export const authApi = axios.create({
    // FIX APPLIED HERE: Changed VITE syntax to CRA syntax
    baseURL: process.env.REACT_APP_API_URL || 'https://localhost:5001/api',
    // This is necessary if Nandi uses secure HttpOnly cookies for JWT/CSRF
    withCredentials: true, 
});

// --- 4. Request Interceptor (The Security Implementation) ---
authApi.interceptors.request.use(
    (config) => {
        // --- 4a. JWT Token-Based Session Validation ---
        // Fulfills: "Enforce token-based session validation"
        
        // This logic assumes the token is stored in localStorage 
        const token = localStorage.getItem('accessToken'); 

        if (token) {
            // Attach the JWT as a Bearer token in the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // --- 4b. CSRF Protection Implementation ---
        // Fulfills: "Ensure CSRF protection is implemented in form submissions"
        
        // Assuming Nandi uses a cookie-based CSRF token (e.g., Double-Submit Cookie)
        const xsrfToken = getCookie('XSRF-TOKEN');
        if (xsrfToken) {
            config.headers['X-CSRF-Token'] = xsrfToken; 
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- 5. Response Interceptor (Optional: Global Token Refresh/Handling) ---
authApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Example: If a 401 Unauthorized error occurs, the session is expired.
        if (error.response && error.response.status === 401) {
            // Clear the invalid token
            localStorage.removeItem('accessToken');
            // A redirect to login would typically occur here
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);