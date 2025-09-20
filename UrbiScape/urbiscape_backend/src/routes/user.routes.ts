import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { wrap } from '../utils/wrap.js';
import { getMe } from '../controllers/user.controller.js';
import { getMyHistory } from '../controllers/users/me/history.js';
import { getMyAchievements } from '../controllers/users/me/achievements.js';

export const userRouter = Router();

userRouter.get('/me',           requireAuth, wrap(getMe));
userRouter.get('/me/history',   requireAuth, wrap(getMyHistory));
userRouter.get('/me/achievements', requireAuth, wrap(getMyAchievements));
