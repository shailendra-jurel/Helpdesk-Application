// frontend/src/services/authService.js
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
      return {
        user: {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        },
        role: response.data.role
      };
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('helpdesk_user');
    localStorage.removeItem('helpdesk_role');
    // Optional: Clear any Redux store user state
  // store.dispatch(clearUserAction());    want to implement this also   but getting error
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
