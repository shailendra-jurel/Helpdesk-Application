import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/tickets`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Response error:', error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 500:
          console.error('Server error');
          break;
      }
      throw error.response.data;
    }
    throw new Error('Network Error');
  }
);

const ticketService = {
  async createTicket(ticketData) {
    try {
      const response = await api.post('/', ticketData);
      return response.data;
    } catch (error) {
      console.error('Create ticket error:', error);
      throw error.message || 'Failed to create ticket';
    }
  },

  async getTickets() {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Get tickets error:', error);
      throw error.message || 'Failed to fetch tickets';
    }
  },

  async getTicket(id) {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get ticket error:', error);
      throw error.message || 'Failed to fetch ticket';
    }
  },

  async updateTicket(id, data) {
    try {
      const response = await api.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update ticket error:', error);
      throw error.message || 'Failed to update ticket';
    }
  },

  async getPriorityDistribution() {
    try {
      const response = await api.get('/priority-distribution');
      return response.data;
    } catch (error) {
      console.error('Priority distribution error:', error);
      return [
        { name: 'Low', value: 0 },
        { name: 'Medium', value: 0 },
        { name: 'High', value: 0 }
      ];
    }
  },

  async getUserPerformance() {
    try {
      const response = await api.get('/user-performance');
      return response.data;
    } catch (error) {
      console.error('User performance error:', error);
      return [];
    }
  },

  async getMissedSLATickets() {
    try {
      const response = await api.get('/missed-sla-tickets');
      return response.data;
    } catch (error) {
      console.error('Missed SLA tickets error:', error);
      return [];
    }
  },

  async getTicketStats() {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Ticket stats error:', error);
      return {
        total: 0,
        open: 0,
        inProgress: 0,
        closed: 0,
        critical: 0
      };
    }
  }
};

export default ticketService;