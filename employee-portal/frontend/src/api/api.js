// frontend/src/api/api.js
import axios from 'axios';

// Utility Function to Read Cookies (Needed for CSRF Token)
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Public API Instance (For Login)
export const publicApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://localhost:5002/api', 
    withCredentials: true,
});

// Authenticated API Instance (For Protected Actions)
export const authApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://localhost:5002/api',
    withCredentials: true, 
});

// Request Interceptor for JWT and CSRF
authApi.interceptors.request.use(
    (config) => {
        // Attach JWT token
        const token = localStorage.getItem('accessToken'); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Attach CSRF token
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

// Response Interceptor for handling token expiration
authApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('accessToken');
        }
        return Promise.reject(error);
    }
);
