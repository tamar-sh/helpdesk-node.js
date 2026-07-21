import express from 'express';
import { createUserController, getAllUsersController,getUserByIdController, updateUserByIdController,deleteUserByIdController} from '../Controllers/userController.js';
import authenticate from '../Middleware/authenticate.js';
import { authorize } from '../Middleware/authorize.js';
const router = express.Router();
router.post('/', authenticate, authorize('admin'), createUserController);
router.get('/', authenticate, authorize('admin'), getAllUsersController);
router.get('/:id', authenticate, authorize('admin'), getUserByIdController);
router.patch('/:id', authenticate, authorize('admin'), updateUserByIdController);
router.delete('/:id', authenticate, authorize('admin'), deleteUserByIdController);

export default router;
