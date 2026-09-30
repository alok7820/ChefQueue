import { askAssistant } from '../services/aiService.js';
import { ApiError } from '../middleware/errorMiddleware.js';

export async function ask(req, res, next) {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) throw new ApiError(400, 'message is required');
    const result = await askAssistant(message.trim());
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
