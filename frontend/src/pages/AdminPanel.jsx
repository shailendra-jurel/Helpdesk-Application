import React, { useState, useEffect } from 'react';
import { 
  LucideUsers, 
  LucideTicket, 
  LucideBarChart2, 
  LucideCog 
} from 'lucide-react';
import UserManagement from './UserManagement';
import ticketService from '../services/ticketService';
import userService from '../services/userService';

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex items-center">
    <Icon className={`text-4xl ${color} mr-4`} />
    <div>
      <h3 className="text-xl font-semibold dark:text-gray-200">{title}</h3>
      <p className="text-3xl font-bold dark:text-gray-100">{value}</p>
    </div>
  </div>
);

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
              icon={LucideTicket}
              title="Total Tickets"
              value={stats.totalTickets}
              color="text-blue-500"
            />
            <StatCard 
              icon={LucideUsers}
              title="Total Users"
              value={stats.totalUsers}
              color="text-green-500"
            />
            <StatCard 
              icon={LucideTicket}
              title="Open Tickets"
              value={stats.openTickets}
              color="text-yellow-500"
            />
            <StatCard 
              icon={LucideTicket}
              title="Closed Tickets"
              value={stats.closedTickets}
              color="text-red-500"
            />
          </div>
        );
      case 'users':
        return <UserManagement />;
      default:
        return null;
    }
  };

  const tabs = [
    { 
      tab: 'dashboard', 
      icon: LucideBarChart2, 
      label: 'Dashboard' 
    },
    { 
      tab: 'users', 
      icon: LucideUsers, 
      label: 'User Management' 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex space-x-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {tabs.map(({ tab, icon: Icon, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex items-center p-4 
                ${activeTab === tab 
                  ? 'text-blue-500 border-b-2 border-blue-500' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'}
              `}
            >
              <Icon className="mr-2" /> {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;