import axios from 'axios';
const BASE_URL =  'http://localhost:5000';
const API_URL = `${BASE_URL}/api/tickets`;

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

const ticketService = {
  async createTicket(ticketData) {
    try {
      const response = await api.post('', ticketData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create ticket';
    }
  },

  async getTickets() {
    try {
      const response = await api.get('');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch tickets';
    }
  },

  async getTicket(id) {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch ticket';
    }
  },

  async closeTicket(id) {
    try {
      const response = await api.put(`/${id}/close`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to close ticket';
    }
  },
};

export default ticketService;