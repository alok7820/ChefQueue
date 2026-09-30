import { Router } from 'express';
import { z } from 'zod';
import {
  listOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validate, numericIdParam } from '../middleware/validationMiddleware.js';
import { ORDER_STATUSES, PAYMENT_STATUSES, ORDER_PRIORITIES } from '../models/Order.js';

const router = Router();

const orderItemSchema = z.object({
  id: z.coerce.number().optional(),
  menuItem: z.coerce.number().optional(),
  qty: z.coerce.number().min(1),
}).refine((v) => v.id !== undefined || v.menuItem !== undefined, { message: 'item id is required' });

const createOrderSchema = z.object({
  customer: z.string().optional().default('Walk-in Guest'),
  table: z.string().min(1, 'Table is required'),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
  priority: z.enum(ORDER_PRIORITIES).optional().default('Normal'),
  cookingTime: z.coerce.number().optional(),
});

const updateOrderSchema = z.object({
  customer: z.string().optional(),
  table: z.string().optional(),
  priority: z.enum(ORDER_PRIORITIES).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
});

const statusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

router.use(requireAuth);

router.get('/', listOrders);
router.get('/:id', validate(numericIdParam, 'params'), getOrder);
router.post('/', requireRole('admin', 'cashier'), validate(createOrderSchema), createOrder);
router.put('/:id', requireRole('admin', 'cashier'), validate(numericIdParam, 'params'), validate(updateOrderSchema), updateOrder);
router.patch('/:id/status', requireRole('admin', 'chef', 'cashier'), validate(numericIdParam, 'params'), validate(statusSchema), updateOrderStatus);
router.delete('/:id', requireRole('admin'), validate(numericIdParam, 'params'), deleteOrder);

export default router;
