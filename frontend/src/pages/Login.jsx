import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../Store/slices/authSlice';
import {
  LucideMail,
  LucideLock,
  LucideChevronRight
} from "lucide-react";
import PropTypes from 'prop-types';

const Card = ({ children, className = "", title, ...props }) => {
  Card.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    title: PropTypes.string
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-2xl shadow-lg
        hover:shadow-xl transition-all duration-300
        border border-gray-200 dark:border-gray-700
        ${className}
      `}
      {...props}
    >
      {title && <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      </div>}
      {children}
    </div>
  );
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  ...props
}) => {
  Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
    className: PropTypes.string,
    icon: PropTypes.elementType,
  };

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    secondary: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600",
    outline: "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700",
  };

  return (
    <button
      className={`
        px-4 py-2 rounded-lg flex items-center justify-center
        space-x-2 font-medium transition-all duration-300
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const userData = { email, password };
    try {
      await dispatch(login(userData)).unwrap();
      navigate('/');
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <main className="flex-1 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md p-8" title="Welcome Back">
          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <LucideMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="Email Address"
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

              <div className="relative">
                <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              icon={LucideChevronRight}
            >
              Login
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              Don’t have an account? 
              <Link 
                to="/register" 
                className="text-blue-600 dark:text-blue-400 ml-2 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Login;
