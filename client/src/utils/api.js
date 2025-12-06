import axios from 'axios';

// Create an Axios instance with your backend URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your Backend Port
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTOR ---
// This automatically adds the JWT token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // We will save the token here later
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;