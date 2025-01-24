// backend/controllers/ticketController.js
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';

export const createTicket = async (req, res) => {
  try {
    const { title } = req.body;
    const ticket = new Ticket({
      title,
      customer: req.user._id,
      status: 'Active'
    });

    const createdTicket = await ticket.save();
    res.status(201).json(createdTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({})
      .populate('customer', 'name')
      .sort({ updatedAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('customer', 'name')
      .populate('notes.user', 'name');

    if (ticket) {
      res.json(ticket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (ticket) {
      ticket.status = req.body.status || ticket.status;

      const updatedTicket = await ticket.save();
      res.json(updatedTicket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addTicketNote = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (ticket) {
      const note = {
        user: req.user._id,
        text: req.body.text,
        attachment: req.body.attachment || null
      };

      ticket.notes.push(note);
      await ticket.save();

      const updatedTicket = await Ticket.findById(req.params.id)
        .populate('notes.user', 'name');

      res.status(201).json(updatedTicket);
    } else {
      res.status(404).json({ message: 'Ticket not found , ticket Controller' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (ticket) {
      await ticket.deleteOne();
      res.json({ message: 'Ticket removed , ticket Controller' });
    } else {
      res.status(404).json({ message: 'Ticket not found  ticket Controller' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
