import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../Store/slices/authSlice';
import { FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

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
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
          <FaSignInAlt className="mr-2" /> Login
        </h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 transition"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            Don't have an account? 
            <a href="/register" className="text-primary-500 ml-2">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;