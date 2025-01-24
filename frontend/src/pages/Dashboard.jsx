import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  FaTicketAlt, 
  FaPlusCircle, 
  FaChartPie, 
  FaClipboardList, 
  FaUserCog 
} from "react-icons/fa";
import ticketService from "../services/ticketService";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0
  });
  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const tickets = await ticketService.getTickets();
        
        // Filter tickets based on user role
        const relevantTickets = user.role === 'customer' 
          ? tickets.filter(ticket => ticket.userId === user._id)
          : tickets;

        setTicketStats({
          total: relevantTickets.length,
          open: relevantTickets.filter(ticket => ticket.status === 'open').length,
          inProgress: relevantTickets.filter(ticket => ticket.status === 'in-progress').length,
          closed: relevantTickets.filter(ticket => ticket.status === 'closed').length
        });

        // Get 5 most recent tickets
        setRecentTickets(
          relevantTickets
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchDashboardData();
  }, [user]);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-white shadow rounded-lg p-4 ${color} flex items-center`}>
      <Icon className="text-3xl mr-4" />
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {/* Welcome, <span className="text-primary-500">{user.name}</span> */}
          Welcome, <span className="text-primary-500">Helpdesk </span>

        </h1>

        {/* Ticket Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={FaTicketAlt} 
            title="Total Tickets" 
            value={ticketStats.total} 
            color="border-l-4 border-blue-500" 
          />
          <StatCard 
            icon={FaClipboardList} 
            title="Open Tickets" 
            value={ticketStats.open} 
            color="border-l-4 border-green-500" 
          />
          <StatCard 
            icon={FaChartPie} 
            title="In Progress" 
            value={ticketStats.inProgress} 
            color="border-l-4 border-yellow-500" 
          />
          <StatCard 
            icon={FaUserCog} 
            title="Closed Tickets" 
            value={ticketStats.closed} 
            color="border-l-4 border-red-500" 
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {user.role === "customer" && (
            <Link
              to="/tickets/create"
              className="bg-primary-500 text-white p-4 rounded-lg hover:bg-primary-600 transition shadow flex items-center justify-center"
            >
              <FaPlusCircle className="mr-2" /> Create New Ticket
            </Link>
          )}
          <Link
            to="/tickets"
            className="bg-secondary-500 text-white p-4 rounded-lg hover:bg-secondary-600 transition shadow flex items-center justify-center"
          >
            <FaTicketAlt className="mr-2" /> View Tickets
          </Link>
          {user.role === "admin" && (
            <Link
              to="/admin"
              className="bg-secondary-700 text-white p-4 rounded-lg hover:bg-secondary-800 transition shadow flex items-center justify-center"
            >
              <FaUserCog className="mr-2" /> Admin Panel
            </Link>
          )}
        </div>

        {/* Recent Tickets */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Tickets</h2>
          {recentTickets.length === 0 ? (
            <p className="text-gray-500">No recent tickets</p>
          ) : (
            <div className="divide-y">
              {recentTickets.map(ticket => (
                <Link 
                  key={ticket._id} 
                  to={`/tickets/${ticket._id}`}
                  className="flex justify-between py-3 hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-medium">{ticket.title}</p>
                    <span className={`
                      px-2 py-1 rounded text-xs 
                      ${ticket.status === 'closed' ? 'bg-red-200 text-red-800' : 
                        ticket.status === 'in-progress' ? 'bg-yellow-200 text-yellow-800' : 
                        'bg-green-200 text-green-800'}
                    `}>
                      {ticket.status}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;