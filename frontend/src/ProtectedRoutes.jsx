import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authService from './services/authService';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // No token or invalid token
  if (!token || !authService.isTokenValid()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (allowedRoles.length > 0) {
    const userRole = user?.role || '';
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;