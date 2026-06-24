import { Router } from 'express';
import { voiceController } from '../controller/voiceController.js';

const router = Router();

router.post(
  '/chat',
  (req, res, next) => void voiceController.chat(req, res, next)
);

export default router;
