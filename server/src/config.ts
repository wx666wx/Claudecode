import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

export const config = {
  deepseekApiKey: process.env.DEEPSEEK_API_KEY || null,
  port: parseInt(process.env.PORT || '3001', 10),
  dbPath: resolve(__dirname, '../data/app.db'),
};
