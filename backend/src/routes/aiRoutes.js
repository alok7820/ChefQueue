import { Router } from 'express';
import { ask } from '../controllers/aiController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.post('/ask', ask);

export default router;
