import { Router } from 'express';
import { settingsController } from '../controller/settingsController.js';

const router = Router();

router.get('/', (req, res, next) => void settingsController.getSettings(req, res, next));
router.patch('/', (req, res, next) => void settingsController.updateSettings(req, res, next));

export default router;
