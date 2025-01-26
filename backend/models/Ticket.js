// backend/models/Ticket.js
import mongoose from 'mongoose';
import Note, { NoteSchema } from './Note.js';

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
   assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'closed', 'on-hold'],
      default: 'open'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
  // notes: [NoteSchema],
 notes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    attachment: {
      type: String
    }
  }],
  dueDate: {
    type: Date
  },
  slaBreachDate: {
    type: Date
  }

}, {
  timestamps: true,
});

const Ticket = mongoose.model('Ticket', TicketSchema);
export default Ticket;