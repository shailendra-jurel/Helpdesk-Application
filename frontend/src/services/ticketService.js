import axios from 'axios';
const BASE_URL = 'http://localhost:5000';
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

  // New methods for dashboard
  async getPriorityDistribution() {
    try {
      const response = await api.get('/priority-distribution');
      console.log('Priority Distribution Response:', response.data);

      return response.data || [
        { name: 'Low', value: 0 },
        { name: 'Medium', value: 0 },
        { name: 'High', value: 0 }
      ];
    } catch (error) {
      console.error('Priority Distribution Error:', error.response?.data || error.message);
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
      console.log('User Performance Response:', response.data);

      return response.data || [];
    } catch (error) {
      console.error('User Performance Error:', error.response?.data || error.message);
      return [];
    }
  },

  async getMissedSLATickets() {
    try {
      const response = await api.get('/missed-sla-tickets');
      console.log('Missed SLA tickets Response:', response.data);

      return response.data || [];
    } catch (error) {
      console.error('Missed SLA Tickets Error:', error.response?.data || error.message);
      return [];
    }
  }
,
  // Helper method to get ticket stats
  async getTicketStats() {
    try {
      const response = await api.get('/stats');
      console.log('Ticket Stats Response:', response.data);

      return response.data || {
        total: 0,
        open: 0,
        inProgress: 0,
        closed: 0,
        critical: 0
      };
    } catch (error) {
      console.error('Failed to fetch ticket stats', error);
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