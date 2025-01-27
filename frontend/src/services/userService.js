// frontend/src/services/userService.js
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL ;
const API_URL = `${BASE_URL}/api/users/`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

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

const userService = {
  async getAllUsers() {
    try {
      const response = await api.get('');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch users';
    }
  },

  async createUser(userData) {
    try {
      const response = await api.post('', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create user';
    }
  },

  async updateUser(userId, userData) {
    try {
      const response = await api.put(`${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update user';
    }
  },

  async deleteUser(userId) {
    try {
      const response = await api.delete(`${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete user';
    }
  },

  async getUserProfile(userId) {
    try {
      const response = await api.get(`profile/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user profile';
    }
  }
};

export default userService;