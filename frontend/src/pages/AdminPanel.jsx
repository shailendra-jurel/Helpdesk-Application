import React, { useState, useEffect } from 'react';
import { FaUsers, FaTicketAlt, FaChartBar, FaCog } from 'react-icons/fa';
import UserManagement from './UserManagement';
// import TicketAnalytics from './TicketAnalytics';
// import SystemSettings from './SystemSettings';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalTickets: 0,
    totalUsers: 0,
    openTickets: 0,
    closedTickets: 0
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      }
    };

    fetchDashboardStats();
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
              <FaTicketAlt className="text-4xl text-primary-500 mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Total Tickets</h3>
                <p className="text-3xl font-bold">{stats.totalTickets}</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
              <FaUsers className="text-4xl text-green-500 mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Total Users</h3>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
              <FaTicketAlt className="text-4xl text-yellow-500 mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Open Tickets</h3>
                <p className="text-3xl font-bold">{stats.openTickets}</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
              <FaTicketAlt className="text-4xl text-red-500 mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Closed Tickets</h3>
                <p className="text-3xl font-bold">{stats.closedTickets}</p>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
    //   case 'analytics':
    //     return <TicketAnalytics />;
    //   case 'settings':
    //     return <SystemSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="mb-6">
          <div className="flex space-x-4 bg-white rounded-lg shadow-md">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center p-4 ${
                activeTab === 'dashboard' 
                  ? 'text-primary-500 border-b-2 border-primary-500' 
                  : 'text-gray-600 hover:text-primary-500'
              }`}
            >
              <FaChartBar className="mr-2" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center p-4 ${
                activeTab === 'users' 
                  ? 'text-primary-500 border-b-2 border-primary-500' 
                  : 'text-gray-600 hover:text-primary-500'
              }`}
            >
              <FaUsers className="mr-2" /> User Management
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center p-4 ${
                activeTab === 'analytics' 
                  ? 'text-primary-500 border-b-2 border-primary-500' 
                  : 'text-gray-600 hover:text-primary-500'
              }`}
            >
              <FaChartBar className="mr-2" /> Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center p-4 ${
                activeTab === 'settings' 
                  ? 'text-primary-500 border-b-2 border-primary-500' 
                  : 'text-gray-600 hover:text-primary-500'
              }`}
            >
              <FaCog className="mr-2" /> System Settings
            </button>
          </div>
        </div>

        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;