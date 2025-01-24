import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTickets } from '../Store/slices/ticketSlice';
import { FaPlus, FaTicketAlt } from 'react-icons/fa';

const TicketList = () => {
  const dispatch = useDispatch();
  const { tickets, isLoading } = useSelector((state) => state.tickets);
  const { user, role } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const filteredTickets = role === 'customer' 
    ? tickets.filter(ticket => ticket.user === user._id)
    : tickets;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <FaTicketAlt className="mr-2" /> 
            {role === 'customer' ? 'My Tickets' : 'All Tickets'}
          </h1>
          {role !== 'admin' && (
            <Link 
              to="/tickets/create" 
              className="bg-primary-500 text-white px-4 py-2 rounded flex items-center hover:bg-primary-600 transition"
            >
              <FaPlus className="mr-2" /> Create Ticket
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Ticket ID</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Last Updated</th>
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
                    <td className="p-3">
                      <span className={`
                        px-2 py-1 rounded text-xs 
                        ${ticket.status === 'closed' ? 'bg-red-200 text-red-800' : 
                          ticket.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 
                          'bg-green-200 text-green-800'
                        }
                      `}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-3">{ticket.customerName}</td>
                    <td className="p-3">
                      {new Date(ticket.updatedAt).toLocaleDateString()}
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