import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
} from '../controllers/userController';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(protect);

router.get('/profile', updateProfile);         // GET own profile → use /api/auth/me
router.put('/profile', updateProfile);         // Update own profile

// Admin only
router.get('/', restrictTo('admin'), getAllUsers);
router.get('/:id', restrictTo('admin'), getUserById);
router.delete('/:id', restrictTo('admin'), deleteUser);

export default router;