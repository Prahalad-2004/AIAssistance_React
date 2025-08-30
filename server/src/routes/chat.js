import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { sendChat, getHistory, clearHistory } from '../controllers/chatController.js';

const router = Router();
router.get('/history', auth, getHistory);
router.delete('/history', auth, clearHistory);
router.post('/', auth, sendChat);
export default router;
