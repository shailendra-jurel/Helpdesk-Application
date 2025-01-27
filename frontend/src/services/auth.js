import axios from 'axios';

// Ensure we have a default URL if environment variable is not set
const BASE_URL = import.meta.env.VITE_BASE_URL ;
const API_URL = `${BASE_URL}/api/tickets`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
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
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please try again');
    }

    if (!error.response) {
      throw new Error('Network error - please check your connection');
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        throw new Error('Access denied');
      case 404:
        throw new Error('Resource not found');
      case 500:
        throw new Error('Server error - please try again later');
      default:
        throw new Error(data?.message || 'Something went wrong');
    }
  }
);

const ticketService = {
  async createTicket(ticketData) {
    try {
      const response = await api.post('/', ticketData);
      return response.data;
    } catch (error) {
      console.error('Create ticket error:', error);
      throw error;
    }
  },

  async getTickets() {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Get tickets error:', error);
      throw error;
    }
  },

  async getTicket(id) {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get ticket error:', error);
      throw error;
    }
  },

  async updateTicket(id, data) {
    try {
      const response = await api.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update ticket error:', error);
      throw error;
    }
  },

  async getPriorityDistribution() {
    try {
      const response = await api.get('/priority-distribution');
      return response.data;
    } catch (error) {
      console.error('Priority distribution error:', error);
      return [];
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