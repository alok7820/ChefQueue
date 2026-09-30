import { Router } from 'express';
import { z } from 'zod';
import { login, register, getMe } from '../controllers/authController.js';
import { validate } from '../middleware/validationMiddleware.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional().default(''),
  role: z.string().optional(),
});

router.post('/login', validate(loginSchema), login);
// router.post('/register', validate(registerSchema), register);
router.get('/me', requireAuth, getMe);

export default router;
