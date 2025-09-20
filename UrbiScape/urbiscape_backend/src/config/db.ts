// src/config/db.ts
import mongoose from 'mongoose';
import { env } from './env.js';

let cached = false;

export async function connectDB() {
  if (cached) return mongoose;
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.mongoUri, {
      autoIndex: env.nodeEnv !== 'production',
    });
    cached = true;

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err);
    });

    console.log(`✅ MongoDB conectado (${mongoose.connection.name})`);
    return mongoose;
  } catch (err: any) {
    console.error('❌ Error conectando a MongoDB:', err?.message || err);
    throw err;
  }
}

export async function disconnectDB() {
  if (!cached) return;
  await mongoose.disconnect();
  cached = false;
}
