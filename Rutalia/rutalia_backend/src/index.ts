// src/index.ts
import 'dotenv/config';
import http from 'http';
import mongoose from 'mongoose';

import { app } from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

async function boot() {
  await connectDB();

  const server = http.createServer(app);
  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Listening on http://localhost:${env.port} [${env.nodeEnv}]`);
  });

  // - Graceful shutdown
  const shutdown = async (signal: string) => {
    // eslint-disable-next-line no-console
    console.log(`\n[server] Received ${signal}. Shutting down...`);
    server.close(async () => {
      try {
        await mongoose.connection.close();
        // eslint-disable-next-line no-console
        console.log('[server] MongoDB disconnected');
      } finally {
        process.exit(0);
      }
    });
    // Hard timeout in case something hangs
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

boot().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[server] Failed to start:', err);
  process.exit(1);
});
