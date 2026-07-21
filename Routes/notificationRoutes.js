import express from 'express';
import { getMyNotificationsController, markNotificationAsReadController } from '../Controllers/notificationController.js';
import authenticate from '../Middleware/authenticate.js';

const router = express.Router();
router.get('/', authenticate, getMyNotificationsController);
router.patch('/:id/read', authenticate, markNotificationAsReadController);

export default router;
