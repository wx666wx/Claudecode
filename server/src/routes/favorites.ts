import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

router.post('/favorites', (req, res) => {
  try {
    const { platform, title, style_tag, score, reason, prompt } = req.body;
    if (!platform || !title || !style_tag || !score || !reason) {
      res.status(400).json({ error: '缺少必要字段' });
      return;
    }

    const db = getDb();
    // Check if already favorited (same title + platform)
    const existing = db.prepare(
      'SELECT id FROM favorites WHERE platform = ? AND title = ?'
    ).get(platform, title) as { id: number } | undefined;

    if (existing) {
      res.json({ id: existing.id, alreadyExists: true });
      return;
    }

    const stmt = db.prepare(
      'INSERT INTO favorites (platform, title, style_tag, score, reason, prompt) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(platform, title, style_tag, score, reason, prompt || '');
    res.json({ id: result.lastInsertRowid });
  } catch (err) {
    console.error('Add favorite error:', err);
    res.status(500).json({ error: '收藏失败，请重试' });
  }
});

router.get('/favorites', (_req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM favorites ORDER BY created_at DESC').all();
    res.json({ favorites: rows });
  } catch (err) {
    console.error('Get favorites error:', err);
    res.status(500).json({ error: '获取收藏失败' });
  }
});

router.delete('/favorites/:id', (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM favorites WHERE id = ?').run(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete favorite error:', err);
    res.status(500).json({ error: '取消收藏失败' });
  }
});

export default router;
