import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

router.get('/history', (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    const db = getDb();
    const total = (db.prepare('SELECT COUNT(*) as count FROM generations').get() as { count: number }).count;
    const rows = db.prepare(
      'SELECT * FROM generations ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).all(limit, offset);

    const history = (rows as Array<{
      id: number; platform: string; prompt: string; results: string; created_at: string;
    }>).map(row => ({
      ...row,
      results: JSON.parse(row.results),
    }));

    res.json({ history, total, page, limit });
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({ error: '获取历史记录失败' });
  }
});

router.get('/history/:id', (req, res) => {
  try {
    const db = getDb();
    const row = db.prepare('SELECT * FROM generations WHERE id = ?').get(req.params.id) as
      | { id: number; platform: string; prompt: string; results: string; created_at: string }
      | undefined;

    if (!row) {
      res.status(404).json({ error: '记录不存在' });
      return;
    }

    res.json({
      generation: {
        ...row,
        results: JSON.parse(row.results),
      },
    });
  } catch (err) {
    console.error('Get history detail error:', err);
    res.status(500).json({ error: '获取历史详情失败' });
  }
});

export default router;
