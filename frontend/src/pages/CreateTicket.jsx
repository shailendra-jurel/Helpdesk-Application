import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ticketService from '../services/ticketService';
import {
  LucideTicket,
  LucidePlus,
  LucideChevronLeft,
} from "lucide-react";
import PropTypes from 'prop-types';

const Card = ({ children, className = "", title, ...props }) => {
  Card.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    title: PropTypes.string
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-2xl shadow-lg
        hover:shadow-xl transition-all duration-300
        border border-gray-200 dark:border-gray-700
        ${className}
      `}
      {...props}
    >
      {title && <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      </div>}
      {children}
    </div>
  );
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  ...props
}) => {
  Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
    className: PropTypes.string,
    icon: PropTypes.elementType,
  };
  
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    secondary:
      "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600",
    outline:
      "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700",
  };

  return (
    <button
      className={`
        px-4 py-2 rounded-lg flex items-center justify-center
        space-x-2 font-medium transition-all duration-300
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  const [templateSuggestions, setTemplateSuggestions] = useState([
    {
      title: 'Hardware Issue',
      description: 'My computer is not turning on. Please help me diagnose the problem.'
    },
    {
      title: 'Software Bug',
      description: 'I encountered an unexpected error while using the application.'
    },
    {
      title: 'Access Request',
      description: 'I need access to a specific system or resource for my work.'
    }
  ]);

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

  const useTemplate = (template) => {
    setFormData({
      ...formData,
      title: template.title,
      description: template.description
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              icon={LucideChevronLeft} 
              onClick={() => navigate('/dashboard')}
            />
            <h1 className="text-3xl font-bold">Create Ticket</h1>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="secondary"
              icon={LucideTicket}
              onClick={() => navigate('/tickets')}
            >
              View Tickets
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-6" title="Ticket Details">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  name="title"
                  value={title}
                  onChange={onChange}
                  placeholder="Enter ticket title"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg h-32 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  name="description"
                  value={description}
                  onChange={onChange}
                  placeholder="Describe your issue in detail"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Priority</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  name="priority"
                  value={priority}
                  onChange={onChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                icon={LucidePlus}
              >
                {loading ? 'Creating...' : 'Create Ticket'}
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card title="Quick Templates" className="p-4">
              <div className="space-y-3">
                {templateSuggestions.map((template, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition"
                    onClick={() => useTemplate(template)}
                  >
                    <h4 className="font-semibold">{template.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Ticket Creation Tips" className="p-4">
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Be specific and concise in your title</li>
                <li>• Provide clear, detailed description</li>
                <li>• Select appropriate priority</li>
                <li>• Include any relevant context or screenshots</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateTicket;