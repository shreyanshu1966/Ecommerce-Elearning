import axios from 'axios';
import store from '../store/store';

// Create a custom axios instance
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Set timeout to 15 seconds
});

// Add the auth token to every request if available
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Store the original URL to know which endpoint was called
    config._url = config.url;
    return config;
  },
  (error) => Promise.reject(error)
);

// Enhanced response interceptor with better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Capture request details for better logging
    const requestUrl = error.config?._url || 'unknown endpoint';
    const statusCode = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message;
    
    // Handle different types of errors
    switch (statusCode) {
      case 401:
        // Auth errors
        if (requestUrl.includes('/cart')) {
          // Silently handle cart auth errors - expected for non-logged in users
          console.log("Cart request requires authentication. If you're not logged in, this is expected behavior.");
        } else {
          console.error(`Authentication error (${requestUrl}):`, errorMessage);
          // You could dispatch a logout action here if needed
          // store.dispatch(logout());
        }
        break;
        
      case 500:
        // Server errors
        console.error(`Server error (${requestUrl}):`, errorMessage);
        // You could implement centralized error logging here
        // logErrorToService({ url: requestUrl, status: statusCode, message: errorMessage });
        break;
        
      case 404:
        console.warn(`Resource not found (${requestUrl}):`, errorMessage);
        break;
        
      default:
        console.error(`Request failed (${requestUrl}) with status ${statusCode}:`, errorMessage);
    }
    
    // Return a rejected promise with the error
    return Promise.reject(error);
  }
);

export default axiosInstance;
