import admin from 'firebase-admin';
import { env } from './env.js';
import fs from 'fs';

let initialized = false;

export function initFirebase() {
  if (initialized) return;

  let credential: admin.ServiceAccount | undefined;

  if (env.firebaseServiceAccountJson) {
    credential = JSON.parse(env.firebaseServiceAccountJson);
  } else if (env.firebaseServiceAccountPath) {
    const raw = fs.readFileSync(env.firebaseServiceAccountPath, 'utf8');
    credential = JSON.parse(raw);
  } else {
    console.warn('⚠️ Firebase Admin no configurado (solo afecta login Google).');
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert(credential!)
  });
  initialized = true;
  console.log('✅ Firebase Admin inicializado');
}

export async function verifyFirebaseIdToken(idToken: string) {
  if (!admin.apps.length) throw new Error('Firebase Admin no inicializado');
  return admin.auth().verifyIdToken(idToken);
}
