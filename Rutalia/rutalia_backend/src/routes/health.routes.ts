import { Router } from 'express';

export const healthRouter = Router();

/**
 * GET /health
 * Devuelve el estado del servidor y metadatos de build (version, commit).
 */
healthRouter.get('/', (_req, res) => {
  res.json({
    ok: true,
    status: 'healthy',
    env: process.env.NODE_ENV || 'development',
    version: process.env.APP_VERSION || 'dev',
    commit: process.env.APP_COMMIT || 'local',
    time: new Date().toISOString(),
  });
});
