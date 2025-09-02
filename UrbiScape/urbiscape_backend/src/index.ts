import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { initFirebase } from './config/firebase.js';
import { app } from './app.js';

async function bootstrap() {
  await connectDB();
  initFirebase();
  app.listen(env.port, () => {
    console.log(`🚀 EscapUrbis backend en http://localhost:${env.port}`);
  });
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
