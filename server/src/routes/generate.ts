import { Router } from 'express';
import { generateTopics } from '../services/deepseek.js';
import { getDb } from '../db.js';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { platform, prompt } = req.body;

    if (!platform) {
      res.status(400).json({ error: '请选择平台' });
      return;
    }

    const validPlatforms = ['douyin', 'xiaohongshu', 'kuaishou', 'bilibili'];
    if (!validPlatforms.includes(platform)) {
      res.status(400).json({ error: '无效的平台选择' });
      return;
    }

    const topics = await generateTopics(platform, prompt);

    // Save to history
    const db = getDb();
    const stmt = db.prepare('INSERT INTO generations (platform, prompt, results) VALUES (?, ?, ?)');
    const result = stmt.run(platform, prompt || '', JSON.stringify(topics));

    res.json({ topics, generationId: result.lastInsertRowid });
  } catch (err) {
    const message = err instanceof Error ? err.message : '生成失败，请重试';
    console.error('Generate error:', err);
    res.status(500).json({ error: message });
  }
});

export default router;
