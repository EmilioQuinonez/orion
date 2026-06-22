import { Router } from 'express';
import healthRouter from './healthRouter.js';
import voiceRouter from './voiceRouter.js';
import historyRouter from './historyRouter.js';
import settingsRouter from './settingsRouter.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/voice', voiceRouter);
router.use('/history', historyRouter);
router.use('/settings', settingsRouter);

export default router;
