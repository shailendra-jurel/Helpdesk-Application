import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../Store/slices/ticketSlice';
import { FaTicketAlt } from 'react-icons/fa';

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  const { title, description, priority } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createTicket(formData))
      .then(() => navigate('/tickets'));
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
              <label className="block mb-2">Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                name="title"
                value={title}
                onChange={onChange}
                required
                placeholder="Enter ticket title"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Description</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                name="description"
                value={description}
                onChange={onChange}
                required
                rows={4}
                placeholder="Provide detailed description of your issue"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2">Priority</label>
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
              className="w-full bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 transition"
            >
              Create Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;