import { Router } from 'express';
import { canAccess } from '../middleware/access.js';
import { passportCall } from '../utils.js';
import ChatController from '../controllers/chat.controller.js';

const router = Router();

router.get('/', passportCall('current'), ChatController.getAllMessages);

router.post('/', passportCall('current'), canAccess(['user']), ChatController.sendMessage);

export default router;