import express from 'express';
import { 
  createTicket, 
  getTickets, 
  getTicketById, 
  updateTicket, 
  addTicketNote,
  deleteTicket ,
  getTicketStats,
  getPriorityDistribution,
  getUserPerformance,
  getMissedSLATickets
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

router.get('/stats', getTicketStats);
router.get('/priority-distribution', getPriorityDistribution);
router.get('/user-performance',getUserPerformance);
router.get('/missed-sla-tickets', getMissedSLATickets);

export default router;