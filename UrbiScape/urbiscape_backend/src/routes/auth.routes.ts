import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimiter.js';
import { wrap } from '../utils/wrap.js';
import {
  postRegister,
  postLogin,
  postLoginGoogle,
  postLoginGuest,
  postRefresh,
  postLogout,
  postForgotPassword,
  postResetPassword
} from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', authLimiter, wrap(postRegister));
authRouter.post('/login',    authLimiter, wrap(postLogin));
authRouter.post('/google',   authLimiter, wrap(postLoginGoogle));
authRouter.post('/guest',    authLimiter, wrap(postLoginGuest));

authRouter.post('/refresh', wrap(postRefresh));
authRouter.post('/logout',  wrap(postLogout));

authRouter.post('/forgot-password', authLimiter, wrap(postForgotPassword));
authRouter.post('/reset-password',  authLimiter, wrap(postResetPassword));
