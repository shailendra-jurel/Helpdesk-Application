import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCommentAlt, FaPaperPlane, FaTimes } from 'react-icons/fa';
import ticketService from '../services/ticketService';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const data = await ticketService.getTicket(id);
        setTicket(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load ticket details');
        setLoading(false);
        toast.error('Unable to fetch ticket details');
      }
    };

    fetchTicketDetails();
  }, [id]);

  const addNote = async () => {
    if (!newNote.trim()) {
      toast.error('Note cannot be empty');
      return;
    }

    try {
      const response = await fetch(`/api/tickets/${id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text: newNote })
      });
      
      const updatedTicket = await response.json();
      setTicket(updatedTicket);
      setNewNote('');
      toast.success('Note added successfully');
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const closeTicket = async () => {
    try {
      await ticketService.closeTicket(id);
      toast.success('Ticket closed successfully');
      navigate('/tickets');
    } catch (error) {
      toast.error('Failed to close ticket');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!ticket) return null;

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <div className="flex items-center space-x-2">
            <span className={`
              px-3 py-1 rounded text-sm
              ${ticket.status === 'closed' ? 'bg-red-200 text-red-800' : 
                ticket.status === 'in-progress' ? 'bg-yellow-200 text-yellow-800' : 
                'bg-green-200 text-green-800'}
            `}>
              {ticket.status}
            </span>
            {ticket.status !== 'closed' && (
              <button
                onClick={closeTicket}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center"
              >
                <FaTimes className="mr-1" /> Close Ticket
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{ticket.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FaCommentAlt className="mr-2" /> Notes
          </h3>
          {ticket.notes && ticket.notes.length > 0 ? (
            ticket.notes.map((note) => (
              <div 
                key={note._id} 
                className="bg-gray-100 p-3 rounded-lg mb-3"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{note.author.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(note.createdAt).toLocaleString()}
                  </span>
                </div>
                <p>{note.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No notes yet</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-grow mr-2 p-2 border rounded"
            disabled={ticket.status === 'closed'}
          />
          <button 
            onClick={addNote}
            disabled={!newNote || ticket.status === 'closed'}
            className="bg-primary-500 text-white p-2 rounded hover:bg-primary-600 disabled:opacity-50"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;