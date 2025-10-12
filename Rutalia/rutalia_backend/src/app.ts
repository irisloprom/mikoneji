// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { z } from 'zod';

import { env } from './config/env.js';
import { initCloudinary } from './config/cloudinary.js';
import { initFirebase } from './config/firebase.js';

// Routers
import { authRouter } from './routes/auth.routes.js';
import { storyRouter } from './routes/story.routes.js';
import { milestoneRouter } from './routes/milestone.routes.js';
import { userRouter } from './routes/user.routes.js';
import { attemptsRouter } from './routes/attempts.routes.js';
import { mediaRouter } from './routes/media.routes.js';
import { healthRouter } from './routes/health.routes.js';
import { trackingRouter } from './routes/tracking.routes.js';

export const app = express();

// ——— Core middlewares
app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN ?? '*')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    credentials: true
  })
);
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ——— Third-party SDKs
initCloudinary();
initFirebase();

// ——— Health
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    env: env.nodeEnv,
    now: new Date().toISOString(),
    uptimeSec: Math.round(process.uptime())
  });
});

// --- API routes (no prefix; add /api here if needed)
app.use('/auth', authRouter);
app.use('/stories', storyRouter);
app.use('/milestones', milestoneRouter);
app.use('/users', userRouter);
app.use('/attempts', attemptsRouter);
app.use('/media', mediaRouter);
app.use('/tracking', trackingRouter);
app.use('/health', healthRouter);

// ——— 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// ——— Error handler
// Acepta errores de controladores/async (los routers ya usan wrap, pero por si acaso)
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (env.nodeEnv !== 'production') {
      // Helpful log in development
      // eslint-disable-next-line no-console
      console.error(err);
    }

    // Zod
    if (err && (err instanceof z.ZodError || err.name === 'ZodError')) {
      return res.status(400).json({
        error: 'ValidationError',
        issues: (err as z.ZodError).issues
      });
    }

    // Mongoose cast (invalid ObjectId, etc.)
    if (err?.name === 'CastError') {
      return res.status(400).json({ error: 'InvalidId', detail: err?.message });
    }

    // Otros
    const status = typeof err?.status === 'number' ? err.status : 500;
    const message =
      typeof err?.message === 'string'
        ? err.message
        : 'Unexpected error';

    res.status(status).json({ error: message });
  }
);
