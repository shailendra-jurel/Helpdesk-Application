// frontend/src/services/authService.js
import axios from 'axios';
// import jwtDecode from 'jwt-decode';
// import jwtDecode from 'jwt-decode/build/jwt-decode.esm.js';

// const BASE_URL =  'http://localhost:5000/api/auth';
const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/auth`;
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  response => response,
  error => {
    console.log('Auth Error:', error.response?.status, error.response?.data);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.clear();
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 500:
          console.error('Server error');
          break;
      }
    }
    return Promise.reject(error);
  }
);

const authService = {
  getCurrentUser() {
    const user = localStorage.getItem('helpdesk_user');
    return user ? JSON.parse(user) : null;
  },
  async refreshToken() {
    try {
      const response = await api.post('/refresh-token');  // don't have such route in backend
      localStorage.setItem('token', response.data.token);
      return response.data.token;
    } catch (error) {
      this.logout();
      throw error;
    }
  },
  async register(userData) {
    try {
      const response = await api.post('/register', userData);
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('helpdesk_user', JSON.stringify({
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        }));
        localStorage.setItem('helpdesk_role', response.data.role);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  async login(userData) {
    try {
      const response = await api.post('/login', userData);
      if (response.data && response.data.token) {
        // Ensure all required data is stored
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('helpdesk_user', JSON.stringify({
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        }));
        return response.data;
      }
      throw new Error('Invalid response data');
    } catch (error) {
      localStorage.clear(); // Clear any partial data
      throw error.response?.data?.message || 'Login failed';
    }
  },

  logout() {
    localStorage.clear(); // Clear all storage
    window.location.href = '/login';
  },

  isTokenValid() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = this.decodeToken(token);
      const isExpired = payload.exp * 1000 < Date.now();
      
      // Auto refresh if close to expiration
      if (isExpired || (payload.exp * 1000 - Date.now() < 5 * 60 * 1000)) {
        this.refreshToken();
      }

      return !isExpired;
    } catch (error) {
      this.logout();
      return false;
    }
  },

  decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  },

};

export default authService;
