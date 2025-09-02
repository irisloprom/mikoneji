import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getMe } from '../controllers/user.controller.js';

export const userRouter = Router();
userRouter.get('/me', requireAuth, getMe);
