import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Guard: Show loading screen if state is still loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Guard: Redirect if user is not logged in or token is missing
  if (!user || !localStorage.getItem('token')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Guard: Redirect if user role is not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
