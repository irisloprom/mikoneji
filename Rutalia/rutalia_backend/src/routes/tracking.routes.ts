import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { wrap } from '../utils/wrap.js';
import { trackProgress } from '../controllers/tracking.controller.js';

export const trackingRouter = Router();

trackingRouter.post('/', requireAuth, wrap(trackProgress));
