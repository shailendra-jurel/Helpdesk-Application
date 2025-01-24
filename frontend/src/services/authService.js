// src/services/authService.js
import axios from 'axios';

const API_URL = '/api/users';

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  
  // Store user data in localStorage if registration is successful
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('role', response.data.role);
  }
  
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  
  // Store user data in localStorage if login is successful
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('role', response.data.role);
  }
  
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('role');
};

const authService = {
  register,
  login,
  logout
};

export default authService;