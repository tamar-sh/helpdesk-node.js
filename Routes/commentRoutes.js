import express from 'express';
import { createCommentController, getCommentsController } from '../Controllers/commentController.js';
import authenticate from '../Middleware/authenticate.js';

const router = express.Router();
router.post('/', authenticate, createCommentController);
router.get('/:ticketId', authenticate, getCommentsController);

export default router;
