import axios from 'axios';
import store from '../store/store';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/', // Added /api prefix to fix 404 errors
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add the auth token to every request if available
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token; // Fixed: get token directly from auth state
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Store the original URL to know which endpoint was called
    config._url = config.url;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if this is an auth error
    if (error.response?.status === 401) {
      // Don't log auth errors for cart endpoints if the user might not be logged in
      const url = error.config?._url || '';
      if (url.includes('/cart')) {
        // Silently handle cart auth errors - expected for non-logged in users
        console.log("Cart request requires authentication. If you're not logged in, this is expected behavior.");
      } else {
        // Log other auth errors normally
        console.error('Authentication error:', error.response?.data?.message || 'Session expired');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
