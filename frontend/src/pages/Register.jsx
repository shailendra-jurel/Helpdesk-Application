import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../Store/slices/authSlice';
import {
  LucideUser,
  LucideMail,
  LucideLock,
  LucideUsers,
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

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { name, email, password, confirmPassword, role } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    return strength;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const userData = { name, email, password, role };
    try {
      await dispatch(register(userData)).unwrap();
      navigate('/');
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <main className="flex-1 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md p-8" title="Create Your Account">
          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 p-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative">
                <LucideUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

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
                <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      passwordStrength <= 2 ? 'bg-red-500' : 
                      passwordStrength <= 3 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`} 
                    style={{width: `${passwordStrength * 20}%`}}
                  />
                </div>
              </div>

              <div className="relative">
                <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  placeholder="Confirm Password"
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

              <div className="relative">
                <LucideUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <select
                  name="role"
                  value={role}
                  onChange={onChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="customer">Customer</option>
                  <option value="agent">Customer Service Agent</option>
                </select>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              icon={LucideChevronRight}
            >
              Create Account
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account? 
              <Link 
                to="/login" 
                className="text-blue-600 dark:text-blue-400 ml-2 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Register;