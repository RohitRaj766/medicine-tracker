import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

// User profile routes
router.get('/profile', AuthController.getProfile);
router.put('/profile', AuthController.updateProfile);

export default router;
