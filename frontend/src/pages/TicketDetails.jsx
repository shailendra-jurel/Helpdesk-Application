import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCommentAlt, FaPaperPlane } from 'react-icons/fa';

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await fetch(`/api/tickets/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setTicket(data);
      } catch (error) {
        console.error('Error fetching ticket details', error);
      }
    };

    fetchTicketDetails();
  }, [id]);

  const addNote = async () => {
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
    } catch (error) {
      console.error('Error adding note', error);
    }
  };

  if (!ticket) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <span className={`
            px-3 py-1 rounded text-sm
            ${ticket.status === 'closed' ? 'bg-red-200 text-red-800' : 
              ticket.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 
              'bg-green-200 text-green-800'}
          `}>
            {ticket.status}
          </span>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">{ticket.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaCommentAlt className="mr-2" /> Notes
          </h2>
          {ticket.notes.map((note) => (
            <div 
              key={note._id} 
              className="bg-gray-100 p-3 rounded-lg mb-3"
            >
              <div className="flex justify-between">
                <span className="font-medium">{note.author.name}</span>
                <span className="text-sm text-gray-500">
                  {new Date(note.createdAt).toLocaleString()}
                </span>
              </div>
              <p>{note.text}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-grow mr-2 p-2 border rounded"
          />
          <button 
            onClick={addNote}
            disabled={!newNote}
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