import { Router } from 'express';
import { z } from 'zod';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validate, numericIdParam } from '../middleware/validationMiddleware.js';

const router = Router();

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional().default(''),
  role: z.enum(['chef', 'cashier']),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.enum(['admin', 'chef', 'cashier']).optional(),
  status: z.enum(['Active', 'Inactive']).optional(),
  avatar: z.string().optional(),
});

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

router.use(requireAuth);

// Self-service profile routes (any authenticated role) — declared before /:id so
// "me" is never swallowed by the numeric id route.
router.get('/me', getMyProfile);
router.put('/me', validate(profileSchema), updateMyProfile);
router.put('/me/password', validate(passwordSchema), changeMyPassword);

router.get('/', requireRole('admin'), listUsers);
router.post(
  '/',
  requireRole('admin'),
  validate(createUserSchema),
  createUser
);
router.get('/:id', requireRole('admin'), validate(numericIdParam, 'params'), getUser);
router.put('/:id', requireRole('admin'), validate(numericIdParam, 'params'), validate(updateUserSchema), updateUser);
router.delete('/:id', requireRole('admin'), validate(numericIdParam, 'params'), deleteUser);

export default router;
