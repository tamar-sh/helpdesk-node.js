import express from 'express';
import { createTicketController, getAllTicketsController,getTicketByIdController,assignTicketController, updateTicketStatusController} from '../Controllers/ticketController.js';
import authenticate from '../Middleware/authenticate.js';
import { authorize } from '../Middleware/authorize.js'; 
import upload from '../Middleware/upload.js'

const router = express.Router();
router.post('/', authenticate, authorize('employee'), upload.array('files', 5), createTicketController);
router.get('/:id', authenticate, getTicketByIdController);
router.get('/', authenticate, getAllTicketsController);
router.patch('/:id/assign', authenticate, authorize('admin'), assignTicketController);
router.patch('/:id/status', authenticate, authorize('technician'), updateTicketStatusController);

export default router;
