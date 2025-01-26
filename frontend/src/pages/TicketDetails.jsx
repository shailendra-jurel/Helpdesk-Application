import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  LucideTicket,
  LucideEdit,
  LucideTrash2,
  LucideChevronLeft,
  LucideMessageCircle,
  LucideSend,
  LucideAlertTriangle,
  LucideClock,
  LucideUser,
} from "lucide-react";
import PropTypes from 'prop-types';
import ticketService from '../services/ticketService';

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

const Badge = ({ children, status = "default", className = "" }) => {
  const statusColors = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    open: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    closed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    critical: "bg-red-500 text-white",
  };

  return (
    <span
      className={`
        px-2 py-1 rounded-full text-xs font-semibold
        ${statusColors[status]} ${className}
      `}
    >
      {children}
    </span>
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
    primary: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    secondary: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600",
    outline: "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700",
    danger: "bg-red-500 text-white hover:bg-red-600",
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

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState(null);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const data = await ticketService.getTicket(id);
        setTicket(data);
        // Simulate attachment fetch (replace with actual service call)
        setAttachments([
          { id: 1, name: 'screenshot.png', size: '256 KB' },
          { id: 2, name: 'log.txt', size: '42 KB' }
        ]);
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate file upload (replace with actual upload logic)
      setAttachments(prev => [...prev, {
        id: Date.now(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`
      }]);
      toast.success('File uploaded successfully');
    }
  };

  const deleteTicket = async () => {
    try {
      await ticketService.deleteTicket(id);
      toast.success('Ticket deleted successfully');
      navigate('/tickets');
    } catch (error) {
      toast.error('Failed to delete ticket');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">Loading ticket details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Retry Loading
        </Button>
      </div>
    </div>
  );

  if (!ticket) return null;

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              icon={LucideChevronLeft} 
              onClick={() => navigate('/tickets')}
            />
            <h1 className="text-3xl font-bold">{ticket.title}</h1>
          </div>
          <div className="flex space-x-2">
            <Badge 
              status={
                ticket.status === 'closed' ? 'closed' : 
                ticket.status === 'in-progress' ? 'in-progress' : 
                'open'
              }
            >
              {ticket.status}
            </Badge>
            {ticket.status !== 'closed' && (
              <Button 
                variant="danger" 
                icon={LucideTrash2}
                onClick={closeTicket}
              >
                Close Ticket
              </Button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card title="Ticket Details" className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">{ticket.description}</p>
                </div>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <LucideUser className="text-gray-500" />
                    <span>{ticket.assignedTo?.name || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <LucideClock className="text-gray-500" />
                    <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Ticket Notes" className="p-6">
              <div className="space-y-4">
                {ticket.notes && ticket.notes.length > 0 ? (
                  ticket.notes.map((note) => (
                    <div 
                      key={note._id} 
                      className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{note.author.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p>{note.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No notes yet</p>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-grow p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    disabled={ticket.status === 'closed'}
                  />
                  <Button 
                    icon={LucideSend}
                    onClick={addNote}
                    disabled={!newNote || ticket.status === 'closed'}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Attachments" className="p-4">
              <div className="space-y-3">
                {attachments.map((attachment) => (
                  <div 
                    key={attachment.id} 
                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{attachment.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{attachment.size}</p>
                    </div>
                    <Button variant="secondary" size="small">
                      Download
                    </Button>
                  </div>
                ))}
                <input 
                  type="file" 
                  className="hidden" 
                  id="file-upload"
                  onChange={handleFileUpload}
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  Upload Attachment
                </Button>
              </div>
            </Card>

            <Card title="Actions" className="p-4">
              <div className="space-y-3">
                <Button 
                  icon={LucideEdit} 
                  className="w-full"
                  onClick={() => navigate(`/tickets/${id}/edit`)}
                >
                  Edit Ticket
                </Button>
                <Button 
                  variant="danger" 
                  icon={LucideTrash2} 
                  className="w-full"
                  onClick={deleteTicket}
                >
                  Delete Ticket
                </Button>
              </div>
            </Card>

            <Card title="Ticket History" className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Created</span>
                  <span className="text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </span>
                </div>
                {ticket.status === 'closed' && (
                  <div className="flex justify-between">
                    <span>Closed</span>
                    <span className="text-sm text-gray-500">
                      {new Date(ticket.closedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketDetails;