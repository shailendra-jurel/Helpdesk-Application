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
import corsMiddleware from '../Middleware/cors.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.use(corsMiddleware);

router.use(protect);

router.route('/')
.post(createTicket)
.get(getTickets);

router.get('/stats', getTicketStats);
router.get('/priority-distribution', getPriorityDistribution);
router.get('/user-performance',getUserPerformance);
router.get('/missed-sla-tickets', getMissedSLATickets);


router.route('/:id')
  .get(getTicketById)
  .put(updateTicket)
  .delete(deleteTicket);

router.route('/:id/notes')
  .post(addTicketNote);


export default router;