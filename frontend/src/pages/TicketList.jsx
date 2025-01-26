import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LucidePlus, 
  LucideTicket, 
  LucideFilter, 
  LucideArrowUpDown,
  LucideSearch,
  LucideClipboardList 
} from 'lucide-react';
import { getTickets } from '../Store/slices/ticketSlice';

const TicketList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tickets, isLoading, isError, message } = useSelector((state) => state.ticket);

  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  useEffect(() => {
    let result = user && user.role === 'customer'
      ? tickets.filter(ticket => ticket.userId === user._id)
      : tickets;

    // Search and filter logic
    result = result.filter(ticket => 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      result = result.filter(ticket => ticket.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter(ticket => ticket.priority === priorityFilter);
    }

    // Sorting logic
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'createdAt') {
        comparison = new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    setFilteredTickets(result);
  }, [tickets, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder, user]);

  const renderStatusBadge = (status) => {
    const statusColors = {
      'open': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'closed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${statusColors[status]}`}>
        {status.replace('-', ' ')}
      </span>
    );
  };

  const renderPriorityBadge = (priority) => {
    const priorityColors = {
      'low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'high': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${priorityColors[priority]}`}>
        {priority}
      </span>
    );
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-red-100 dark:bg-red-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error Loading Tickets
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
          <button 
            onClick={() => dispatch(getTickets())} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Create Ticket Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center dark:text-gray-200">
          <LucideClipboardList className="mr-2 text-blue-500" /> 
          {user && user.role === 'customer' ? 'My Tickets' : 'All Tickets'}
        </h1>
        {user && user.role !== 'admin' && (
          <Link 
            to="/tickets/create" 
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            <LucidePlus className="mr-2" /> Create Ticket
          </Link>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="createdAt">Created Date</option>
            <option value="priority">Priority</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="bg-gray-200 dark:bg-gray-700 p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <LucideArrowUpDown className={`transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Ticket List */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-10 text-center text-gray-500 dark:text-gray-400">
          <LucideTicket className="mx-auto text-4xl mb-4 text-gray-300 dark:text-gray-600" />
          <p>No tickets found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left dark:text-gray-200">Ticket ID</th>
                <th className="p-3 text-left dark:text-gray-200">Title</th>
                <th className="p-3 text-left dark:text-gray-200">Status</th>
                <th className="p-3 text-left dark:text-gray-200">Priority</th>
                <th className="p-3 text-left dark:text-gray-200">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr 
                  key={ticket._id} 
                  className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => navigate(`/tickets/${ticket._id}`)}
                >
                  <td className="p-3 font-mono dark:text-gray-300">#{ticket._id.slice(-6)}</td>
                  <td className="p-3 dark:text-gray-300">{ticket.title}</td>
                  <td className="p-3">{renderStatusBadge(ticket.status)}</td>
                  <td className="p-3">{renderPriorityBadge(ticket.priority)}</td>
                  <td className="p-3 dark:text-gray-300">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TicketList;