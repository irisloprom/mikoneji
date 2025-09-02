import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimiter.js';
import { postRegister, postLogin, postGoogle, postRefresh, postLogout, postGuest, postForgotPassword, postResetPassword } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', authLimiter, wrap(postRegister));
authRouter.post('/login', authLimiter, wrap(postLogin));
authRouter.post('/google', authLimiter, wrap(postGoogle));        // login silencioso con idToken también aquí
authRouter.post('/guest', authLimiter, wrap(postGuest));
authRouter.post('/refresh', wrap(postRefresh));
authRouter.post('/logout', wrap(postLogout));

authRouter.post('/forgot-password', authLimiter, wrap(postForgotPassword));
authRouter.post('/reset-password', authLimiter, wrap(postResetPassword));

// wrapper de errores async
function wrap(handler: any) {
  return (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
}
