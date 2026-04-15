import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { pool } from './config/db.js';
import userRoutes from './routes/user.routes.js';
import voiceRoutes from './routes/voice.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: env.corsOrigin
  })
);
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.json({ status: 'ok', service: 'Brainstorm GP RH Backend' });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Falha na conexão com MySQL' });
  }
});

app.use('/api/users', userRoutes);
app.use('/api/voice', voiceRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`✅ Brainstorm GP backend rodando em http://localhost:${env.port}`);
});
