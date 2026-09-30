import { Router } from 'express';
import {
  getAdminDashboard,
  getCashierDashboard,
  getChefDashboard,
  getAnalytics,
} from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/admin', requireRole('admin'), getAdminDashboard);
router.get('/chef', requireRole('admin', 'chef'), getChefDashboard);
router.get('/cashier', requireRole('admin', 'cashier'), getCashierDashboard);
router.get('/analytics', requireRole('admin'), getAnalytics);

export default router;
