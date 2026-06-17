import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import configRouter from './routes/config.js';
import generateRouter from './routes/generate.js';
import favoritesRouter from './routes/favorites.js';
import historyRouter from './routes/history.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', configRouter);
app.use('/api', generateRouter);
app.use('/api', favoritesRouter);
app.use('/api', historyRouter);

app.listen(config.port, () => {
  console.log(`✓ 后端运行在 http://localhost:${config.port}`);
});
