import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaTicketAlt, 
  FaFilter, 
  FaSort, 
  FaSearch 
} from 'react-icons/fa';
import { getTickets } from '../store/slices/ticketSlice';

const TicketList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tickets, isLoading } = useSelector((state) => state.ticket);

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
    let result = user.role === 'customer'
      ? tickets.filter(ticket => ticket.userId === user._id)
      : tickets;

    // Search filter
    result = result.filter(ticket => 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(ticket => ticket.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(ticket => ticket.priority === priorityFilter);
    }

    // Sorting
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
      'open': 'bg-green-200 text-green-800',
      'in-progress': 'bg-yellow-200 text-yellow-800',
      'closed': 'bg-red-200 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${statusColors[status]}`}>
        {status}
      </span>
    );
  };

  const renderPriorityBadge = (priority) => {
    const priorityColors = {
      'low': 'bg-green-200 text-green-800',
      'medium': 'bg-yellow-200 text-yellow-800',
      'high': 'bg-red-200 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${priorityColors[priority]}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <FaTicketAlt className="mr-2" /> 
            {user.role === 'customer' ? 'My Tickets' : 'All Tickets'}
          </h1>
          {user.role !== 'admin' && (
            <Link 
              to="/tickets/create" 
              className="bg-primary-500 text-white px-4 py-2 rounded flex items-center hover:bg-primary-600"
            >
              <FaPlus className="mr-2" /> Create Ticket
            </Link>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-4 py-2 border rounded"
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
              className="w-full px-4 py-2 border rounded"
            >
              <option value="createdAt">Created Date</option>
              <option value="priority">Priority</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="bg-gray-200 p-2 rounded"
            >
              <FaSort className={`transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Ticket List */}
        {isLoading ? (
          <div className="text-center py-10">Loading tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-10 text-center text-gray-500">
            No tickets found
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Ticket ID</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Priority</th>
                  <th className="p-3 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr 
                    key={ticket._id} 
                    className="border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/tickets/${ticket._id}`)}
                  >
                    <td className="p-3">{ticket._id.slice(-6)}</td>
                    <td className="p-3">{ticket.title}</td>
                    <td className="p-3">{renderStatusBadge(ticket.status)}</td>
                    <td className="p-3">{renderPriorityBadge(ticket.priority)}</td>
                    <td className="p-3">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;