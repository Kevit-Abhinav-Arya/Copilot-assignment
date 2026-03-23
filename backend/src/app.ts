/**
 * Express Application Configuration
 *
 * Configures middleware, mounts routes, and sets up the global error handler.
 * Exported without .listen() for use with supertest in integration tests.
 *
 * Security measures applied (OWASP Top 10):
 *   - JSON body size limited to 1mb
 *   - CORS restricted to known origins
 *   - Global error handler avoids leaking stack traces
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import taskRouter from './routes/tasks';

const app = express();

// --- Middleware ---
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json({ limit: '1mb' }));

// --- Routes ---
// ⚠️  /api/tasks/stats MUST be registered before /api/tasks/:id
app.use('/api/tasks', taskRouter);

// --- Health check ---
app.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'ok' } });
});

// --- Global error handler (must have 4 params) ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Error]', err.message);
  const statusCode = (err as Error & { statusCode?: number }).statusCode ?? 500;
  res.status(statusCode).json({ success: false, error: err.message });
});

export default app;
