// frontend/src/ProtectedRoutes.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authService from './services/authService';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// const ProtectedRoute = ({ allowedRoles = [] }) => {
//   const location = useLocation();
//   const token = localStorage.getItem('token');
//   const user = JSON.parse(localStorage.getItem('user'));

//   // No token or invalid token
//   if (!token || !authService.isTokenValid()) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Role-based access control
//   if (allowedRoles.length > 0) {
//     const userRole = user?.role || '';
//     if (!allowedRoles.includes(userRole)) {
//       return <Navigate to="/" replace />;
//     }
//   }

//   return <Outlet />;
// };


const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;
