// services/authService.js
import axios from 'axios';
// import jwtDecode from 'jwt-decode';
// import jwtDecode from 'jwt-decode/build/jwt-decode.esm.js';

const BASE_URL =  'http://localhost:5000/api/auth';

const api = axios.create({
  baseURL: BASE_URL,
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
  async register(userData) {
    try {
      const response = await api.post('/register', userData);
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        }));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  async login(userData) {
    try {
      const response = await api.post('/login', userData);
      const { token, _id, name, email, role } = response.data;
      
      if (token) {
        localStorage.clear(); // Clear previous session
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          id: _id,
          name,
          email,
          role
        }));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      throw error.response?.data?.message || 'Login failed';
    }
  },

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  isTokenValid() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      // Manual token expiration check
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const payload = JSON.parse(window.atob(base64));
      
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
};

export default authService;
