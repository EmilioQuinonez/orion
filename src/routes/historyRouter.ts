import { Router } from 'express';
import { historyController } from '../controller/historyController.js';
import { validatePagination } from '../middleware/validator.js';

const router = Router();

router.get('/', validatePagination, (req, res, next) => void historyController.getHistory(req, res, next));
router.delete('/clear', (req, res, next) => void historyController.clearHistory(req, res, next));
router.delete('/:id', (req, res, next) => void historyController.deleteMessage(req, res, next));

export default router;
