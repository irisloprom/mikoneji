import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { wrap } from '../utils/wrap';
import { getMe } from '../controllers/user.controller';
import { getMyHistory } from '../controllers/users/me/history';
import { getMyAchievements } from '../controllers/users/me/achievements';

export const userRouter = Router();

userRouter.get('/me',           requireAuth, wrap(getMe));
userRouter.get('/me/history',   requireAuth, wrap(getMyHistory));
userRouter.get('/me/achievements', requireAuth, wrap(getMyAchievements));
