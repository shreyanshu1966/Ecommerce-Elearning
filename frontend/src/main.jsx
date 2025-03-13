import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Remove this direct axios import and configuration
// import axios from 'axios';
// axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

// We'll use our configured axios instance instead
// No need to set defaults here as they're handled in the axiosConfig file

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
