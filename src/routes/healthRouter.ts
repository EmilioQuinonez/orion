import { Router } from 'express';
import { healthController } from '../controller/healthController.js';

const router = Router();

router.get('/', (req, res) => void healthController.check(req, res));

export default router;
