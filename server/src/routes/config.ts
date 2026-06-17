import { Router } from 'express';
import { config } from '../config.js';

const router = Router();

router.get('/config', (_req, res) => {
  res.json({ hasApiKey: config.deepseekApiKey !== null });
});

export default router;
