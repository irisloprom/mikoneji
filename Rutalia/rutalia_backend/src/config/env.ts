// src/config/env.ts
import 'dotenv/config';

function required(name: string, val?: string) {
  if (!val) throw new Error(`Missing env var: ${name}`);
  return val;
}

function toInt(v: string | undefined, def: number) {
  const n = v ? parseInt(v, 10) : def;
  return Number.isFinite(n) ? n : def;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  get isProd() { return this.nodeEnv === 'production'; },
  get isDev() { return this.nodeEnv === 'development'; },

  port: toInt(process.env.PORT, 4000),
  mongoUri: required('MONGO_URI', process.env.MONGO_URI),

  jwtAccessSecret: required('JWT_ACCESS_SECRET', process.env.JWT_ACCESS_SECRET),
  jwtRefreshSecret: required('JWT_REFRESH_SECRET', process.env.JWT_REFRESH_SECRET),
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES ?? '15m',
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES ?? '30d',

  // Firebase (opcionales)
  firebaseServiceAccountJson: process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
  firebaseServiceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,

  // Cloudinary (opcionales)
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  cloudinaryUrl: process.env.CLOUDINARY_URL,         // si usas CLOUDINARY_URL, el SDK ya se configura
  cloudinaryBaseFolder: process.env.CLOUDINARY_BASE_FOLDER ?? 'rutalia',

  // Flags validadores (opcionales)
  visionProvider: process.env.VISION_PROVIDER,       // 'google' | undefined
  speechProvider: process.env.SPEECH_PROVIDER        // 'google' | undefined
} as const;
