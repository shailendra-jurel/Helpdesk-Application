import React, { useState, useEffect } from 'react';
import { FaUsers, FaTicketAlt, FaChartBar, FaCog } from 'react-icons/fa';
import UserManagement from './UserManagement';
import ticketService from '../services/ticketService';
import userService from '../services/userService';

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
        const [ticketsResponse, usersResponse] = await Promise.all([
          ticketService.getTickets(),
          userService.getAllUsers()
        ]);

        setStats({
          totalTickets: ticketsResponse.length,
          totalUsers: usersResponse.length,
          openTickets: ticketsResponse.filter(ticket => ticket.status !== 'closed').length,
          closedTickets: ticketsResponse.filter(ticket => ticket.status === 'closed').length
        });
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
            <StatCard 
              icon={<FaTicketAlt className="text-4xl text-primary-500 mr-4" />}
              title="Total Tickets"
              value={stats.totalTickets}
            />
            <StatCard 
              icon={<FaUsers className="text-4xl text-green-500 mr-4" />}
              title="Total Users"
              value={stats.totalUsers}
            />
            <StatCard 
              icon={<FaTicketAlt className="text-4xl text-yellow-500 mr-4" />}
              title="Open Tickets"
              value={stats.openTickets}
            />
            <StatCard 
              icon={<FaTicketAlt className="text-4xl text-red-500 mr-4" />}
              title="Closed Tickets"
              value={stats.closedTickets}
            />
          </div>
        );
      case 'users':
        return <UserManagement />;
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
            {[
              { tab: 'dashboard', icon: FaChartBar, label: 'Dashboard' },
              { tab: 'users', icon: FaUsers, label: 'User Management' }
            ].map(({ tab, icon: Icon, label }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center p-4 ${
                  activeTab === tab 
                    ? 'text-primary-500 border-b-2 border-primary-500' 
                    : 'text-gray-600 hover:text-primary-500'
                }`}
              >
                <Icon className="mr-2" /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
    {icon}
    <div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </div>
);

export default AdminPanel;