import { Router } from 'express';
import { z } from 'zod';
import {
  listMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  updateMenuAvailability,
  deleteMenuItem,
} from '../controllers/menuController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validate, numericIdParam } from '../middleware/validationMiddleware.js';
import { MENU_CATEGORIES } from '../models/MenuItem.js';

const router = Router();

const menuItemSchema = z.object({
  name: z.string().min(1),
  category: z.enum(MENU_CATEGORIES),
  price: z.coerce.number().min(0),
  prepTime: z.coerce.number().min(0),
  available: z.coerce.boolean().optional().default(true),
  image: z.string().optional().default(''),
});

const menuItemUpdateSchema = menuItemSchema.partial();

router.use(requireAuth);

router.get('/', listMenuItems);
router.get('/:id', validate(numericIdParam, 'params'), getMenuItem);
router.post('/', requireRole('admin'), validate(menuItemSchema), createMenuItem);
router.patch(
  '/:id/availability',
  requireRole('admin', 'chef'),
  validate(numericIdParam, 'params'),
  validate(z.object({
    available: z.coerce.boolean(),
  })),
  updateMenuAvailability
);
router.put('/:id', requireRole('admin'), validate(numericIdParam, 'params'), validate(menuItemUpdateSchema), updateMenuItem);
router.delete('/:id', requireRole('admin'), validate(numericIdParam, 'params'), deleteMenuItem);

export default router;
