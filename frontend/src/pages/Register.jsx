import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../Store/slices/authSlice';
import { FaUser } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });

  const { name, email, password, confirmPassword, role } = formData;
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
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const userData = { name, email, password, role };
    dispatch(register(userData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
          <FaUser className="mr-2" /> Register
        </h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={onChange}
              required
            />
          </div>
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
          <div className="mb-4">
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
          <div className="mb-4">
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm password"
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-6">
            <select
              className="w-full px-3 py-2 border rounded-md"
              name="role"
              value={role}
              onChange={onChange}
            >
              <option value="customer">Customer</option>
              <option value="agent">Customer Service Agent</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 transition"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            Already have an account? 
            <a href="/login" className="text-primary-500 ml-2">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;