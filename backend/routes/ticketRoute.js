import express from 'express';
import { 
  createTicket, 
  getTickets, 
  getTicketById, 
  updateTicket, 
  addTicketNote,
  deleteTicket 
} from '../controllers/ticketController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createTicket)
  .get(getTickets);

router.route('/:id')
  .get(getTicketById)
  .put(updateTicket)
  .delete(deleteTicket);

router.route('/:id/notes')
  .post(addTicketNote);

export default router;