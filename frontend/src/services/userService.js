import axios from 'axios';

const API_URL = '/api/users/';

// Get all users
const getAllUsers = async () => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

// Create user
const createUser = async (userData) => {
  const response = await axios.post(API_URL, userData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

// Update user
const updateUser = async (userId, userData) => {
  const response = await axios.put(`${API_URL}${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

// Delete user
const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

// Get user profile
const getUserProfile = async (userId) => {
  const response = await axios.get(`${API_URL}profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

const userService = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile
};

export default userService;