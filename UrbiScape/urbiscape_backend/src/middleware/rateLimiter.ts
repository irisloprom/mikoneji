// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

// Limita endpoints sensibles de auth
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

// General (si quieres uno global para /api)
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});
