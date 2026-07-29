import axios from 'axios';

// --- THE ONLY URL YOU NEED FOR DEVELOPMENT AND PRODUCTION ---
// This file now does one simple thing:
// It tells your application to ALWAYS send API requests to your live server.

export const API_ROOT_URL = 'https://api.amdehaymanot.com';
const API_BASE_URL = `${API_ROOT_URL}/api`;


// --- AXIOS INSTANCE CONFIGURATION (No changes needed below) ---
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;