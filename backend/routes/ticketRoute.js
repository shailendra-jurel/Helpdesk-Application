
// backend/routes/ticketRoutes.js
import express from 'express';
import { 
  createTicket, 
  getTickets, 
  getTicketById, 
  updateTicket, 
  addTicketNote,
  deleteTicket 
} from '../controllers/ticketController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createTicket)
  .get(protect, getTickets);

router.route('/:id')
  .get(protect, getTicketById)
  .put(protect, updateTicket)
  .delete(protect, deleteTicket);

router.route('/:id/notes')
  .post(protect, addTicketNote);

export default router;