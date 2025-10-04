// src/config/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_BASE_FOLDER
} = process.env;

let _configured = false;

export function initCloudinary() {
  if (_configured) return;
  // Si existe CLOUDINARY_URL, el SDK ya queda configurado automáticamente.
  // Aun así, reforzamos si tenemos las 3 credenciales:
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET
    });
    _configured = true;
  } else if (!process.env.CLOUDINARY_URL) {
    console.warn('⚠️ Cloudinary no configurado (faltan variables o CLOUDINARY_URL).');
  }
}

/**
 * Construye una carpeta Cloudinary bajo el prefijo base y el entorno.
 * Ej: cloudFolder(['stories','barrio-chino']) -> "rutalia/dev/stories/barrio-chino"
 */
export function cloudFolder(parts: (string | number | undefined)[], opts?: { includeEnv?: boolean }) {
  const base = (CLOUDINARY_BASE_FOLDER || 'rutalia').replace(/^\/|\/$/g, '');
  const includeEnv = opts?.includeEnv ?? true;
  const envSeg = includeEnv ? (process.env.NODE_ENV === 'production' ? 'prod' : 'dev') : undefined;
  const segs = [base, envSeg, ...parts]
    .filter(Boolean)
    .map(String)
    .map(s => s.replace(/^\/+|\/+$/g, '')); // trim de slashes
  return segs.join('/');
}

export { cloudinary };
