import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, role } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {role === 'customer' && (
            <>
              <Link 
                to="/tickets/create" 
                className="bg-primary-500 text-white p-4 rounded hover:bg-primary-600 transition"
              >
                Create New Ticket
              </Link>
              <Link 
                to="/tickets" 
                className="bg-secondary-500 text-white p-4 rounded hover:bg-secondary-600 transition"
              >
                View My Tickets
              </Link>
            </>
          )}

          {(role === 'agent' || role === 'admin') && (
            <Link 
              to="/tickets" 
              className="bg-primary-500 text-white p-4 rounded hover:bg-primary-600 transition"
            >
              All Tickets
            </Link>
          )}

          {role === 'admin' && (
            <Link 
              to="/admin" 
              className="bg-secondary-700 text-white p-4 rounded hover:bg-secondary-800 transition"
            >
              Admin Panel
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;