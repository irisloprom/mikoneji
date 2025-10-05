// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

/* -------------------------------------------------------------------------- */
/*                       Autenticación y verificación                         */
/* -------------------------------------------------------------------------- */

// Limita endpoints sensibles de auth (login, register, etc.)
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones de autenticación, prueba más tarde.' }
});

// Para validaciones multimedia (foto/voz) o endpoints caros
export const verifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas verificaciones, prueba más tarde.' }
});

/* -------------------------------------------------------------------------- */
/*                               General (API)                                */
/* -------------------------------------------------------------------------- */

// Límite general opcional (si lo aplicas a toda /api)
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

/* -------------------------------------------------------------------------- */
/*                      NUEVO: Validación de intentos                         */
/* -------------------------------------------------------------------------- */

// Limita frecuencia de validaciones (evita spam de coordenadas)
export const submitAttemptLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 segundos
  max: 5,              // máximo 5 envíos por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas validaciones seguidas, espera unos segundos.' },
  keyGenerator: (req) => {
    // Prioriza ID de usuario autenticado, si no, IP
    return (req.user && req.user.sub) ? String(req.user.sub) : req.ip;
  },
});
