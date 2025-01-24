import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ticketService from '../services/ticketService';
import { FaTicketAlt } from 'react-icons/fa';

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { title, description, priority } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const newTicket = await ticketService.createTicket({
        title,
        description,
        priority
      });

      toast.success('Ticket created successfully');
      navigate(`/tickets/${newTicket._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-xl">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
            <FaTicketAlt className="mr-2" /> Create New Ticket
          </h2>
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                name="title"
                value={title}
                onChange={onChange}
                placeholder="Enter ticket title"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Description</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                name="description"
                value={description}
                onChange={onChange}
                placeholder="Describe your issue in detail"
                rows={4}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-medium">Priority</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                name="priority"
                value={priority}
                onChange={onChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;