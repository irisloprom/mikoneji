import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getMe } from '../controllers/user.controller';
import { getMyHistory } from '../controllers/users/me/history';
import { getMyAchievements } from '../controllers/users/me/achievements';

export const userRouter = Router();

userRouter.get('/me', requireAuth, getMe);
userRouter.get('/me/history', requireAuth, getMyHistory);
userRouter.get('/me/achievements', requireAuth, getMyAchievements);
