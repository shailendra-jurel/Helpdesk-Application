// backend/models/Ticket.js
import mongoose from 'mongoose';
const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Closed'],
    default: 'Active',
  },
  notes: [NoteSchema],
}, {
  timestamps: true,
});
const Ticket = mongoose.model('Ticket', TicketSchema);
export default Ticket;