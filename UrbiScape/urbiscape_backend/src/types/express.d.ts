// src/types/express.d.ts

declare global {
  namespace Express {
    /** Payload mínimo que ponemos en req.user desde requireAuth */
    interface JwtUser {
      sub: string; // user id (Mongo ObjectId en string)
      role?: 'guest' | 'user' | 'editor' | 'admin';
      email?: string;
      provider?: 'local' | 'google' | 'guest';
    }

    /** Decoded ID token básico de Firebase (si usas verifyFirebaseIdTokenMw) */
    interface FirebaseUser {
      uid: string;
      email?: string;
      name?: string;
      picture?: string;
      // campos adicionales según tu proyecto Firebase:
      [k: string]: unknown;
    }

    interface Request {
      /** Inyectado por requireAuth */
      user?: JwtUser;

      /** Inyectado por verifyFirebaseIdTokenMw (opcional, sólo en rutas que lo usen) */
      firebaseUser?: FirebaseUser;
    }
  }
}

export {};
