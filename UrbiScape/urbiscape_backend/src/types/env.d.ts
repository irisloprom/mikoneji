// src/types/env.d.ts

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'development' | 'test' | 'production';
    PORT?: string;

    MONGO_URI: string;

    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRES?: string;  // p.ej. "15m"
    JWT_REFRESH_EXPIRES?: string; // p.ej. "30d"

    // Firebase Admin (uno de los dos)
    FIREBASE_SERVICE_ACCOUNT_JSON?: string;
    FIREBASE_SERVICE_ACCOUNT_PATH?: string;

    // Cloudinary
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
    CLOUDINARY_BASE_FOLDER?: string; // p.ej. "rutalia"

    // Otros que uses…
  }
}

export {};
