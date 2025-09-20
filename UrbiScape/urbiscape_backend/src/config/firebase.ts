// src/config/firebase.ts
import admin from 'firebase-admin';
import { env } from './env.js';
import fs from 'fs';

let initialized = false;

function tryInit() {
  if (initialized) return;

  // 1) Service account JSON inline
  if (env.firebaseServiceAccountJson) {
    const cred = JSON.parse(env.firebaseServiceAccountJson);
    admin.initializeApp({ credential: admin.credential.cert(cred) });
    initialized = true;
    console.log('✅ Firebase Admin inicializado (JSON inline)');
    return;
  }

  // 2) Ruta a JSON
  if (env.firebaseServiceAccountPath) {
    const raw = fs.readFileSync(env.firebaseServiceAccountPath, 'utf8');
    const cred = JSON.parse(raw);
    admin.initializeApp({ credential: admin.credential.cert(cred) });
    initialized = true;
    console.log('✅ Firebase Admin inicializado (ruta JSON)');
    return;
  }

  // 3) Credenciales por defecto (GOOGLE_APPLICATION_CREDENTIALS / ADC)
  try {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
    initialized = true;
    console.log('✅ Firebase Admin inicializado (applicationDefault)');
  } catch {
    console.warn('⚠️ Firebase Admin no configurado (solo afecta login Google).');
  }
}

export function initFirebase() {
  tryInit();
}

export async function verifyFirebaseIdToken(idToken: string) {
  tryInit();
  if (!initialized) throw new Error('Firebase Admin no inicializado');
  return admin.auth().verifyIdToken(idToken);
}
